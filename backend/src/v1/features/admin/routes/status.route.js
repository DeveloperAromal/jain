import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import { getAllUsers, getStatus } from "../controllers/status.controller.js";

const router = express.Router();

router.get("/admin/status", Protect, getStatus);
router.get("/admin/all_students", getAllUsers);

export default router;
