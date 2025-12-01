import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import {
  createOrder,
  paymentWebhook,
  verifySignature,
} from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /v1/payment/create-order:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a payment order
 *     description: Create a Razorpay payment order with optional promo code discount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in paisa (e.g., 50000 for ₹500)
 *                 example: 50000
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: Course ID to purchase
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               promoCode:
 *                 type: string
 *                 description: Optional promo code for discount
 *                 example: "SAVE20"
 *             required:
 *               - amount
 *               - courseId
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid amount, course ID, or promo code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error or Razorpay API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/create-order", Protect, createOrder);

/**
 * @swagger
 * /v1/payment/verify:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Verify payment signature
 *     description: Verify the signature of a payment transaction from Razorpay
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 description: Order ID from Razorpay
 *                 example: "order_DBJOWzybf0sJbb"
 *               razorpay_payment_id:
 *                 type: string
 *                 description: Payment ID from Razorpay
 *                 example: "pay_DBJOWzybf0sJbb"
 *               razorpay_signature:
 *                 type: string
 *                 description: HMAC signature from Razorpay
 *                 example: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment verified successfully"
 *       400:
 *         description: Invalid signature or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/verify", Protect, verifySignature);

/**
 * @swagger
 * /v1/payment/webhook:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Razorpay webhook endpoint
 *     description: Webhook endpoint for Razorpay to send payment events. Should always return 200 OK.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event type (e.g., payment.authorized, payment.failed)
 *                 example: "payment.authorized"
 *               payload:
 *                 type: object
 *                 description: Event payload with payment details
 *     responses:
 *       200:
 *         description: Webhook received successfully (required for Razorpay)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

export default router;
