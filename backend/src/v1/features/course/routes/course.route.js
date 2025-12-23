import express from "express";
import { Protect } from "../../auth/middleware/auth.middleware.js";
import {
  adminToggleCourseFree,
  getStudentFreeCourses,
  adminGetAllCourses,
  create_course,
  getStudentSubscriptionStatus,
  getStudentCoursesWithAccess,
  checkStudentCourseAccess,
  getCourseById,
  getAuthorizedSubjectHandler,
} from "../controllers/course.controller.js";
import {
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminCreateTopic,
} from "../controllers/admin.course.controller.js";

const router = express.Router();

router.get("/all-courses", adminGetAllCourses);

router.put("/admin/toggle-free", adminToggleCourseFree);

router.get("/free", getStudentFreeCourses);
router.post("/create-course", create_course);
router.post("/admin/courses", Protect, adminCreateCourse);
router.put("/admin/courses/:courseId", Protect, adminUpdateCourse);
router.delete("/admin/courses/:courseId", Protect, adminDeleteCourse);
router.post("/admin/topics", Protect, adminCreateTopic);



router.get("/student/subscription-status", Protect, getStudentSubscriptionStatus);
router.get("/student/courses", Protect, getStudentCoursesWithAccess);
router.get("/student/course/:courseId/access", Protect, checkStudentCourseAccess);
router.get("/courses/:courseId", getCourseById);
router.get("/course/list/:user_id", getAuthorizedSubjectHandler);

export default router;

