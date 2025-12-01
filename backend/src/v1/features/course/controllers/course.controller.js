import {
  toggleCourseFreeStatus,
  getCoursesForUnpaidStudent,
  getFreeCourses,
  getAllCourse,
  createCourse,
  getCourseByID,
  getUserSubscriptionStatus,
  getCoursesWithAccessStatus,
  checkCourseAccess,
} from "../services/create_course.service.js";

const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const adminToggleCourseFree = async (req, res) => {
  try {
    const { courseID, isFree } = req.body;

    if (!courseID || typeof isFree !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "courseID (string) and isFree (boolean) are required",
      });
    }

    if (!isValidUUID(courseID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseID format",
      });
    }

    const updated = await toggleCourseFreeStatus(courseID, isFree);

    if (!updated || updated.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Course marked as ${isFree ? "FREE" : "PAID"}`,
      course: updated[0],
    });
  } catch (error) {
    console.error("adminToggleCourseFree error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

export const getStudentFreeCourses = async (req, res) => {
  try {
    const courses = await getCoursesForUnpaidStudent();

    return res.status(200).json({
      success: true,
      message: "Free courses retrieved",
      count: courses?.length || 0,
      courses: courses || [],
    });
  } catch (error) {
    console.error("getStudentFreeCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve free courses",
    });
  }
};

export const adminGetAllCourses = async (req, res) => {
  try {
    const courses = await getAllCourse();

    return res.status(200).json({
      success: true,
      message: "All courses retrieved",
      count: courses?.length || 0,
      courses: courses || [],
    });
  } catch (error) {
    console.error("adminGetAllCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
    });
  }
};



export const create_course = async (req, res) => {
  try {
    const { subject, student_class, description, tags } = req.body;

    if (!subject || !student_class) {
      return res.status(400).json({
        success: false,
        message: "subject and student_class are required",
      });
    }

    const newCourse = await createCourse(
      subject,
      student_class,
      description,
      tags
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (e) {
    console.error("create_course error:", e);
    return res.status(500).json({
      success: false,
      message:  `Failed to create course ${e}`,
    });
  }
};

export const getStudentSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subscriptionStatus = await getUserSubscriptionStatus(userId);

    return res.status(200).json({
      success: true,
      data: subscriptionStatus,
    });
  } catch (error) {
    console.error("getStudentSubscriptionStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get subscription status",
    });
  }
};

export const getStudentCoursesWithAccess = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await getCoursesWithAccessStatus(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getStudentCoursesWithAccess error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get courses",
    });
  }
};

export const checkStudentCourseAccess = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const access = await checkCourseAccess(userId, courseId);

    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    console.error("checkStudentCourseAccess error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check course access",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await getCourseByID(courseId);

    return res.status(200).json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get course",
    });
  }
};
