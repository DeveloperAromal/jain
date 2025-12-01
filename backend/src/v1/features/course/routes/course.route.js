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
} from "../controllers/course.controller.js";
import {
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminCreateTopic,
} from "../controllers/admin.course.controller.js";

const router = express.Router();

/**
 * @swagger
 * /v1/courses/admin/all-courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all courses (admin only)
 *     description: Retrieve all courses in the platform (paid and free). Admin access only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/all-courses", adminGetAllCourses);

/**
 * @swagger
 * /v1/courses/admin/toggle-free:
 *   put:
 *     tags:
 *       - Courses
 *     summary: Toggle course free status
 *     description: Toggle whether a course is free or paid. Admin access only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               is_free:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - courseId
 *               - is_free
 *     responses:
 *       200:
 *         description: Course status updated successfully
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
 *                   example: "Course updated successfully"
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid course ID format or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/admin/toggle-free", Protect, adminToggleCourseFree);

/**
 * @swagger
 * /v1/courses/free:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get all free courses
 *     description: Retrieve all free courses available to students. No authentication required.
 *     responses:
 *       200:
 *         description: Free courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/free", getStudentFreeCourses);

router.post("/create-course", create_course);

// Admin course management routes
router.post("/admin/courses", Protect, adminCreateCourse);
router.put("/admin/courses/:courseId", Protect, adminUpdateCourse);
router.delete("/admin/courses/:courseId", Protect, adminDeleteCourse);
router.post("/admin/topics", Protect, adminCreateTopic);

// Student subscription and access routes
router.get("/student/subscription-status", Protect, getStudentSubscriptionStatus);
router.get("/student/courses", Protect, getStudentCoursesWithAccess);
router.get("/student/course/:courseId/access", Protect, checkStudentCourseAccess);
router.get("/courses/:courseId", getCourseById);

export default router;

