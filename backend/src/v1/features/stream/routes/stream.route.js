import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import { streamAuthorizedVideo } from "../controllers/stream.controller.js";
const router = express.Router();

router.get("/topics/:user_id/video/:topic_id/stream", streamAuthorizedVideo);

export default router;
