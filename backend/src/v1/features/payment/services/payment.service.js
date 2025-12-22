import razorpay from "../utils/razorpayClient.js";
import crypto from "crypto";
import { supabase } from "../../../config/supabase.config.js";

const BASE_PRICE = 999;
const SUBSCRIPTION_MONTHS = 12;


export const verifySignatureService = (payload, signature) => {
  console.debug("[PAYMENT][SIGNATURE] Verifying signature");

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("[PAYMENT][SIGNATURE] Secret missing");
    throw new Error("Razorpay secret missing");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const valid = expected === signature;
  console.debug("[PAYMENT][SIGNATURE] Valid:", valid);

  return valid;
};


export const createSubscriptionOrder = async ({ userId, promoCode }) => {
  console.debug("[PAYMENT][SERVICE][CREATE_ORDER] Start");
  console.debug("[PAYMENT][SERVICE][CREATE_ORDER] User:", userId);

  let finalAmount = BASE_PRICE;
  let discount = 0;
  let promoCodeId = null;

  if (promoCode) {
    console.debug("[PAYMENT][PROMO] Validating promo:", promoCode);

    const { data: promo, error } = await supabase
      .from("promocodes")
      .select("*")
      .eq("code", promoCode.toUpperCase())
      .eq("active", true)
      .maybeSingle();

    if (error) {
      console.error("[PAYMENT][PROMO] DB error:", error);
    }

    if (promo && (!promo.expires || new Date(promo.expires) > new Date())) {
      discount = Math.round((BASE_PRICE * promo.discount_percent) / 100);
      finalAmount = BASE_PRICE - discount;
      promoCodeId = promo.id;

      console.info(
        "[PAYMENT][PROMO] Applied:",
        promo.code,
        "Discount:",
        discount
      );
    } else {
      console.warn("[PAYMENT][PROMO] Invalid or expired promo");
    }
  }

  console.debug("[PAYMENT][AMOUNT] Final amount:", finalAmount);

  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount * 100,
    currency: "INR",
    receipt: `sub_${Date.now()}`,
  });

  console.info("[PAYMENT][RAZORPAY] Order created:", razorpayOrder.id);

  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + SUBSCRIPTION_MONTHS);

  const { error: orderError } = await supabase.from("orders").insert({
    razorpay_order_id: razorpayOrder.id,
    user_id: userId,
    amount: BASE_PRICE,
    discount_amount: discount,
    promo_code_id: promoCodeId,
    status: "pending",
    subscription_months: SUBSCRIPTION_MONTHS,
    subscription_start_date: start,
    subscription_end_date: end,
  });

  if (orderError) {
    console.error("[PAYMENT][DB] Order insert failed:", orderError);
  } else {
    console.info("[PAYMENT][DB] Order stored successfully");
  }

  return {
    order: razorpayOrder,
    finalAmount,
    discount,
  };
};


export const verifySubscriptionPayment = async ({
  userId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  console.debug("[PAYMENT][SERVICE][VERIFY] Start");
  console.debug("[PAYMENT][SERVICE][VERIFY] Order:", razorpay_order_id);

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  if (!verifySignatureService(payload, razorpay_signature)) {
    console.warn("[PAYMENT][VERIFY] Signature mismatch");
    throw new Error("Invalid payment signature");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (!order) {
    console.error("[PAYMENT][VERIFY] Order not found");
    throw new Error("Order not found");
  }

  console.info("[PAYMENT][VERIFY] Order found:", order.id);

  const { data: user } = await supabase
    .from("users")
    .select("subscription_end_date")
    .eq("id", userId)
    .single();

  const now = new Date();
  const baseDate =
    user?.subscription_end_date && new Date(user.subscription_end_date) > now
      ? new Date(user.subscription_end_date)
      : now;

  const newEnd = new Date(baseDate);
  newEnd.setMonth(newEnd.getMonth() + SUBSCRIPTION_MONTHS);

  await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id,
      razorpay_signature,
      amount_paid: BASE_PRICE - order.discount_amount,
    })
    .eq("id", order.id);

  console.info("[PAYMENT][VERIFY] Order marked PAID");

  await supabase
    .from("users")
    .update({
      subscription_active: true,
      subscription_start_date: now,
      subscription_end_date: newEnd,
    })
    .eq("id", userId);

  console.info(
    "[PAYMENT][SUBSCRIPTION] Activated until:",
    newEnd.toISOString()
  );

  return {
    subscription_end_date: newEnd,
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
