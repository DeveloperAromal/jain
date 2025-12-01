import * as paymentService from "../services/payment.service.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, promoCode, subscriptionMonths = 12 } = req.body;
    const userId = req.user?.id;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Subscription payment - no courseId needed (gives access to ALL courses)
    const result = await paymentService.createOrderService({
      amount,
      currency,
      receipt,
      promoCode,
      userId,
      courseId: null, // NULL for subscription (all courses access)
      subscriptionMonths: subscriptionMonths || 12,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("createOrder controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

export const verifySignature = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const userId = req.user?.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "All payment details are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await paymentService.verifyPaymentAndEnroll({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and enrollment created",
      data: result,
    });
  } catch (error) {
    console.error("verifySignature error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const payload = req.rawBody
      ? req.rawBody.toString()
      : JSON.stringify(req.body || {});
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      console.warn("Webhook request missing signature");
      return res.status(400).send("Signature required");
    }

    const isValid = paymentService.verifySignatureService(payload, signature);
    if (!isValid) {
      console.warn("Invalid webhook signature detected");
      return res.status(401).send("Invalid signature");
    }

    let event;
    try {
      event = JSON.parse(payload);
    } catch (parseError) {
      console.error("Failed to parse webhook payload:", parseError);
      return res.status(400).send("Invalid JSON payload");
    }

    await paymentService.handleWebhookEventService(event);

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("paymentWebhook error:", error);
    // Always return 200 to acknowledge receipt to Razorpay
    return res.status(200).json({
      success: false,
      message: "Webhook received but processing failed",
    });
  }
};
