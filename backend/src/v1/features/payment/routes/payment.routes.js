import express from "express";
import {
  createOrder,
  paymentWebhook,
  verifyPaymentSignature,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/webhook", paymentWebhook);
router.post("/verify", verifyPaymentSignature);

export default router;
