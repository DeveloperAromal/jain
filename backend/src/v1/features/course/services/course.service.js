import { supabase } from "../../../config/supabase.config.js";

export async function createCourse({
  subject,
  subject_class,
  description,
  tags,
  cover_image,
}) {
  if (!subject || !subject_class) {
    throw new Error("Subject and subject_class are required");
  }

  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        subject,
        subject_class,
        description,
        tags,
        cover_image,
        is_free: false,
      },
    ])
    .select("*");

  if (error) throw error;
  return data[0];
}

export async function getAllCourse() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getCourseByID(courseID) {
  if (!courseID) {
    throw new Error("Course ID is required");
  }

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseID)
    .single();

  if (error) throw new Error("Course not found");

  return data;
}

// Get all free courses (for unpaid students)
export async function getFreeCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_free", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function toggleCourseFreeStatus(courseID, is_free) {
  if (!courseID) {
    throw new Error("Course ID is required");
  }

  const { data, error } = await supabase
    .from("courses")
    .update({ is_free })
    .eq("id", courseID)
    .select("*");

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getCoursesForUnpaidStudent() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_free", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function getUserSubscriptionStatus(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("created_at, subscription_active, subscription_end_date")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  const createdAt = new Date(user.created_at);
  const now = new Date();
  const daysSinceSignup = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const isFreeTrialActive = daysSinceSignup < 7;
  const daysRemaining = Math.max(0, 7 - daysSinceSignup);

  let hasPaidSubscription = false;
  let subscriptionEndDate = null;
  let subscriptionDaysRemaining = 0;

  if (user.subscription_active && user.subscription_end_date) {
    subscriptionEndDate = new Date(user.subscription_end_date);
    hasPaidSubscription = subscriptionEndDate > now;

    if (hasPaidSubscription) {
      const daysUntilExpiry = Math.floor(
        (subscriptionEndDate - now) / (1000 * 60 * 60 * 24)
      );
      subscriptionDaysRemaining = Math.max(0, daysUntilExpiry);
    } else {
      await supabase
        .from("users")
        .update({ subscription_active: false })
        .eq("id", userId);
    }
  } else {
    // Check for paid orders to activate subscription
    const { data: paidOrders } = await supabase
      .from("orders")
      .select("subscription_end_date")
      .eq("user_id", userId)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1);

    if (
      paidOrders &&
      paidOrders.length > 0 &&
      paidOrders[0].subscription_end_date
    ) {
      subscriptionEndDate = new Date(paidOrders[0].subscription_end_date);
      hasPaidSubscription = subscriptionEndDate > now;

      if (hasPaidSubscription) {
        const daysUntilExpiry = Math.floor(
          (subscriptionEndDate - now) / (1000 * 60 * 60 * 24)
        );
        subscriptionDaysRemaining = Math.max(0, daysUntilExpiry);

        // Update user subscription status
        await supabase
          .from("users")
          .update({
            subscription_active: true,
            subscription_start_date: new Date(
              paidOrders[0].subscription_end_date.getTime() -
                365 * 24 * 60 * 60 * 1000
            ),
            subscription_end_date: subscriptionEndDate,
          })
          .eq("id", userId);
      }
    }
  }

  return {
    // isFreeTrialActive: isFreeTrialActive && !hasPaidSubscription,
    // daysRemaining,
    hasPaidSubscription,
    subscriptionEndDate: subscriptionEndDate
      ? subscriptionEndDate.toISOString()
      : null,
    subscriptionDaysRemaining,
    subscriptionType: hasPaidSubscription ? "paid" : "pending",
  };
}

export async function getCoursesWithAccessStatus(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Get subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(userId);
  const hasAccess =
    subscriptionStatus.hasPaidSubscription ||
    subscriptionStatus.isFreeTrialActive;

  // Get all courses
  const { data: allCourses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (coursesError) throw new Error(coursesError.message);

  // Get user enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const enrolledCourseIds = new Set(
    (enrollments || []).map((e) => e.course_id)
  );

  // Map courses with access status
  // If user has paid subscription, they have access to ALL courses (except free ones are always accessible)
  const coursesWithStatus = (allCourses || []).map((course) => {
    const isFree = course.is_free === true;
    const isEnrolled = enrolledCourseIds.has(course.id);
    // Paid subscription gives access to ALL courses, free courses are always accessible
    const hasAccessToCourse = isFree || hasAccess;

    return {
      ...course,
      accessStatus: hasAccessToCourse ? "accessible" : "locked",
      isFree,
      isEnrolled,
    };
  });

  return {
    courses: coursesWithStatus,
    subscriptionStatus,
  };
}

export async function checkCourseAccess(userId, courseId) {
  if (!userId || !courseId) {
    throw new Error("User ID and Course ID are required");
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    throw new Error("Course not found");
  }

  if (course.is_free) {
    return { hasAccess: true, reason: "free_course" };
  }

  const subscriptionStatus = await getUserSubscriptionStatus(userId);
  if (
    subscriptionStatus.hasPaidSubscription ||
    subscriptionStatus.isFreeTrialActive
  ) {
    return { hasAccess: true, reason: "subscription" };
  }

  return { hasAccess: false, reason: "subscription_required" };
}

export async function getAuthorizedSubjects(user_id) {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, class, subscription_active")
    .eq("id", user_id)
    .single();

  if (userError) throw userError;

  const { class: userClass, subscription_active } = userData;

  if (!subscription_active) {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("subject_class", userClass);

    if (courseError) throw courseError;

    return {
      courses: courseData,
      improvements: [],
    };
  }

  const normalizeCourses = (courses = []) =>
    courses.map((course) => ({
      ...course,
      is_free: true,
    }));

  if (userClass === 12) {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("subject_class", 12);

    if (courseError) throw courseError;

    const { data: improvementData, error: improvementError } = await supabase
      .from("courses")
      .select("*")
      .eq("subject_class", 11);

    if (improvementError) throw improvementError;

    return {
      courses: normalizeCourses(courseData),
      improvements: normalizeCourses(improvementData),
    };
  }

  // 🔹 Other classes
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("subject_class", userClass);

  if (courseError) throw courseError;

  return {
    courses: normalizeCourses(courseData),
    improvements: [],
  };
}
