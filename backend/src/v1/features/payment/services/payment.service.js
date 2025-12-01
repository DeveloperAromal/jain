import razorpay from "../utils/razorpayClient.js";
import crypto from "crypto";
import { supabase } from "../../../config/supabase.config.js";

export const createOrderService = async ({
  amount,
  currency = "INR",
  receipt,
  promoCode,
  userId,
  courseId = null, // NULL for subscription payments (all courses)
  subscriptionMonths = 12,
}) => {
  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  let discount = 0;
  let appliedPromo = null;
  let finalAmount = Number(amount);

  if (promoCode) {
    try {
      const { data: promo, error } = await supabase
        .from("promocodes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (error) {
        console.error("Promo code validation error:", error);
        // Don't throw - just skip discount
      } else if (
        promo &&
        (!promo.expires || new Date(promo.expires) > new Date())
      ) {
        discount = Math.round((finalAmount * promo.discount_percent) / 100);
        finalAmount = Math.max(0, finalAmount - discount);
        appliedPromo = {
          code: promo.code,
          discountPercent: promo.discount_percent,
        };
      }
    } catch (error) {
      console.error("Promo code processing error:", error);
      // Continue without discount on error
    }
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured");
  }

  const options = {
    amount: Math.round(finalAmount * 100), // Convert to paise
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    payment_capture: 1,
    notes: appliedPromo
      ? {
          promoCode: appliedPromo.code,
          discountPercent: appliedPromo.discountPercent,
          originalAmount: amount,
        }
      : { originalAmount: amount },
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Store order in database if userId provided (subscription payments don't need courseId)
    if (userId) {
      let promoCodeId = null;
      if (appliedPromo) {
        const { data: promo } = await supabase
          .from("promocodes")
          .select("id")
          .eq("code", appliedPromo.code)
          .maybeSingle();
        promoCodeId = promo?.id || null;
      }

      // Calculate subscription dates
      const subscriptionStartDate = new Date();
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + subscriptionMonths);

      const { error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            razorpay_order_id: razorpayOrder.id,
            user_id: userId,
            course_id: courseId, // NULL for subscription (all courses)
            amount: Number(amount), // Use original amount before discount
            discount_amount: discount,
            promo_code_id: promoCodeId,
            currency,
            status: "pending",
            subscription_months: subscriptionMonths,
            subscription_start_date: subscriptionStartDate.toISOString(),
            subscription_end_date: subscriptionEndDate.toISOString(),
          },
        ]);

      if (orderError) {
        console.error("Error storing order:", orderError);
        // Continue even if DB insert fails
      }
    }

    return {
      order: razorpayOrder,
      discount,
      appliedPromo,
      finalAmount,
      originalAmount: amount,
    };
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new Error("Failed to create payment order");
  }
};

export const verifySignatureService = (payload, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("Razorpay secret not configured");
  }

  if (!signature || typeof signature !== "string") {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expected === signature;
};

// Verify payment and activate subscription (12 months access to all courses)
export const verifyPaymentAndEnroll = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Verify signature
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const isValid = verifySignatureService(payload, razorpay_signature);

  if (!isValid) {
    throw new Error("Invalid payment signature");
  }

  // Find order in database
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  // Calculate subscription dates (12 months from now)
  const subscriptionStartDate = new Date();
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + (order.subscription_months || 12));

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id,
      razorpay_signature,
      amount_paid: order.amount - (order.discount_amount || 0),
      subscription_start_date: subscriptionStartDate.toISOString(),
      subscription_end_date: subscriptionEndDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateError) {
    console.error("Error updating order:", updateError);
    throw new Error("Failed to update order");
  }

  // Activate subscription for user (12 months access to ALL courses)
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({
      subscription_active: true,
      subscription_start_date: subscriptionStartDate.toISOString(),
      subscription_end_date: subscriptionEndDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (userUpdateError) {
    console.error("Error updating user subscription:", userUpdateError);
    // Don't throw - order is already updated
  }

  // If order has a specific course_id, create enrollment for that course
  // Otherwise, subscription gives access to all courses
  if (order.course_id) {
    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .insert([
        {
          user_id: userId,
          course_id: order.course_id,
          order_id: order.id,
          enrollment_type: "paid",
          status: "active",
        },
      ])
      .select();

    if (enrollmentError) {
      // If enrollment already exists, just update it
      if (enrollmentError.code === "23505") {
        // Unique constraint violation - enrollment exists
        await supabase
          .from("enrollments")
          .update({
            status: "active",
            order_id: order.id,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("course_id", order.course_id);
      } else {
        console.error("Error creating enrollment:", enrollmentError);
      }
    }
  }

  return {
    success: true,
    orderId: order.id,
    subscriptionEndDate: subscriptionEndDate.toISOString(),
    subscriptionMonths: order.subscription_months || 12,
  };
};

export const handleWebhookEventService = async (event) => {
  if (!event || !event.event) {
    throw new Error("Invalid webhook payload");
  }

  console.log("Webhook event received:", event.event);

  try {
    switch (event.event) {
      case "payment.captured":
        // TODO: Update DB - mark payment as captured
        console.log(
          "Payment captured for order:",
          event.payload?.order?.entity?.id
        );
        break;

      case "payment.failed":
        // TODO: Update DB - mark payment as failed
        console.log(
          "Payment failed for order:",
          event.payload?.order?.entity?.id
        );
        break;

      case "order.paid":
        // TODO: Update DB - mark order as paid
        console.log("Order paid:", event.payload?.order?.entity?.id);
        break;

      default:
        console.warn("Unhandled webhook event type:", event.event);
    }

    return { success: true, handled: true };
  } catch (error) {
    console.error("Webhook event processing error:", error);
    throw error;
  }
};
