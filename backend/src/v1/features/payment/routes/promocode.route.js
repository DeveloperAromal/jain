import express from "express";
import { Protect, authorizeAdmin } from "../../auth/middleware/auth.middleware.js";
import {
  createPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} from "../controllers/promocode.controller.js";

const router = express.Router();

router.use("/admin", Protect);

router.post("/admin/promocodes", createPromoCode);
router.get("/admin/promocodes", getAllPromoCodes);
router.put("/admin/promocodes/:id", updatePromoCode);
router.delete("/admin/promocodes/:id", deletePromoCode);
router.post("/admin/verify-promocodes", Protect, validatePromoCode);



export default router;

