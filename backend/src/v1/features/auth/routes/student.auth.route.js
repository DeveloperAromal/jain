import express from "express";
import { Protect } from "../middleware/auth.middleware.js";
import {
  signUpStudent,
  signInStudent,
  getCurrentStudent,
  updateStudentProfile,
} from "../controllers/student.auth.controller.js";

const router = express.Router();

router.post("/student/signup", signUpStudent);
router.post("/student/signin", signInStudent);

router.get("/student/me", Protect, getCurrentStudent);
router.put("/student/profile", Protect, updateStudentProfile);

router.post("/admin/login", signInAdminUser);
router.get("/admin/validate", Protect, validateAdminUser);

export default router;
