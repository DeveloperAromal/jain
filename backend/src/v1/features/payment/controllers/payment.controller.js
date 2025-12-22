import * as paymentService from "../services/payment.service.js";

export const createOrder = async (req, res) => {
  console.debug("[PAYMENT][CREATE_ORDER] Request received");

  try {
    const userId = req.user?.id;
    const { promoCode } = req.body;

    console.debug("[PAYMENT][CREATE_ORDER] User:", userId);
    console.debug("[PAYMENT][CREATE_ORDER] Promo:", promoCode || "NONE");

    if (!userId) {
      console.warn("[PAYMENT][CREATE_ORDER] Unauthorized request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await paymentService.createSubscriptionOrder({
      userId,
      promoCode,
    });

    console.info(
      "[PAYMENT][CREATE_ORDER] Razorpay order created:",
      result?.order?.id
    );

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("[PAYMENT][CREATE_ORDER] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

export const verifySignature = async (req, res) => {
  console.debug("[PAYMENT][VERIFY] Verification request received");

  try {
    const userId = req.user?.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.debug("[PAYMENT][VERIFY] User:", userId);
    console.debug("[PAYMENT][VERIFY] Order:", razorpay_order_id);

    if (!userId) {
      console.warn("[PAYMENT][VERIFY] Unauthorized request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await paymentService.verifySubscriptionPayment({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    console.info(
      "[PAYMENT][VERIFY] Subscription activated until:",
      result.subscription_end_date
    );

    return res.status(200).json({
      success: true,
      message: "Subscription activated",
      data: result,
    });
  } catch (error) {
    console.error("[PAYMENT][VERIFY] Error:", error);
    return res.status(400).json({
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
