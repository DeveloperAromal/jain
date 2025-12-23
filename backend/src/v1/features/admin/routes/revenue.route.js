import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import {
  getAllMonthRevenue,
  getMonthlyRevenue,
} from "../controllers/revenue.controller.js";

const router = express.Router();

router.get("/admin/revenue_chart", Protect, getAllMonthRevenue);
router.get("/admin/monthly_revenue/:month", Protect, getMonthlyRevenue);

export default router;
