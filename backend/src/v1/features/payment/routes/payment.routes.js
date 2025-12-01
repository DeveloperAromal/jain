import express from "express";
import {
  createOrder,
  paymentWebhook,
  verifyPaymentSignature,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
// Webhook endpoint (Razorpay will POST here)
router.post("/webhook", paymentWebhook);
// Optional route to verify signature from client
router.post("/verify", verifyPaymentSignature);

export default router;
