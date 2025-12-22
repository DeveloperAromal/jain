import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import {
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} from "../controllers/promocode.controller.js";

const router = express.Router();

router.post("/admin/promocodes", Protect, createPromoCode);
router.get("/admin/promocodes", Protect, getAllPromoCodes);
router.put("/admin/promocodes/:id", Protect, updatePromoCode);
router.delete("/admin/promocodes/:id", Protect, deletePromoCode);
router.post("/admin/verify-promocodes", Protect, validatePromoCode);


export default router;

