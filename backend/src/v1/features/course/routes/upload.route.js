import express from "express";
import multer from "multer";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import { uploadVideoFileController, uploadImageFileController } from "../controllers/upload.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  }
});

router.post("/video", Protect, upload.single("file"), uploadVideoFileController);
router.post("/image", Protect, upload.single("file"), uploadImageFileController);

export default router;
