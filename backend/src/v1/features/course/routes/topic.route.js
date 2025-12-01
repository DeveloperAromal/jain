import express from "express";
import {
  create_topic,
  get_topics_by_course,
} from "../controllers/topics.controller.js";

const router = express.Router();

router.post("/create-topic", create_topic);

router.get("/course/:course_id", get_topics_by_course);

export default router;
