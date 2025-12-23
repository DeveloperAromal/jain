import {
  toggleCourseFreeStatus,
  getCoursesForUnpaidStudent,
  getAllCourse,
  createCourse,
  getCourseByID,
  getUserSubscriptionStatus,
  getCoursesWithAccessStatus,
  checkCourseAccess,
  getAuthorizedSubjects,
} from "../services/course.service.js";

const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const adminToggleCourseFree = async (req, res) => {
  try {
    const { courseID, is_free } = req.body;

    if (!courseID || typeof is_free !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "courseID (string) and is_free (boolean) are required",
      });
    }

    if (!isValidUUID(courseID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseID format",
      });
    }

    const updated = await toggleCourseFreeStatus(courseID, is_free);

    if (!updated || updated.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Course marked as ${is_free ? "FREE" : "PAID"}`,
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
    const { subject, subject_class, description, tags, cover_image } = req.body;

    console.log("📥 CREATE COURSE REQUEST BODY");
    console.log({
      subject,
      subject_class,
      description,
      tags,
      cover_image,
      cover_image_type: typeof cover_image,
      cover_image_length: cover_image?.length,
    });
    
    const newCourse = await createCourse({
      subject,
      subject_class,
      description,
      tags,
      cover_image,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (e) {
    console.error("create_course error:", e);
    return res.status(500).json({
      success: false,
      message: `Failed to create course ${e}`,
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
export async function getAuthorizedSubjectHandler(req, res) {
  try {
     const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const data = await getAuthorizedSubjects(user_id);

    return res.status(200).json({
      success: true,
      data: {
        course: data,
      },
    });
  } catch (error) {
    console.error("getAuthorizedSubjectHandler error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
