import * as adminCourseService from "../services/admin.course.service.js";
import { createTopic } from "../services/topics.service.js";

export const adminCreateCourse = async (req, res) => {
  try {
    const { subject, subject_class, description, tags, cover_image } = req.body;
    const created_by = req.user?.id;
    const instructor_id = req.user?.id;

    if (!subject || !subject_class) {
      return res.status(400).json({
        success: false,
        message: "Subject and subject_class are required",
      });
    }

    const course = await adminCourseService.adminCreateCourse({
      subject,
      subject_class,
      description,
      tags,
      cover_image,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("adminCreateCourse error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

export const adminUpdateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await adminCourseService.adminUpdateCourse(courseId, updates);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("adminUpdateCourse error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update course",
    });
  }
};

export const adminDeleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    await adminCourseService.adminDeleteCourse(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("adminDeleteCourse error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete course",
    });
  }
};

export const adminCreateTopic = async (req, res) => {
  try {
    const {
      course_id,
      title,
      description,
      tags,
      thumbnail_img,
      video_url,
      duration_minutes,
      sequence_order,
    } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and title are required",
      });
    }

    const topic = await createTopic({
      course_id,
      title,
      description,
      tags,
      thumbnail_img,
      video_url,
      duration_minutes: duration_minutes ? parseInt(duration_minutes) : null,
      sequence_order: sequence_order ? parseInt(sequence_order) : null,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topic,
    });
  } catch (error) {
    console.error("adminCreateTopic error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create topic",
    });
  }
};

