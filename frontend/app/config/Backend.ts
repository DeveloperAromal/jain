const isProduction = process.env.NODE_ENV === "development";

const baseUrl = isProduction
  ? `http://localhost:8080/api/v1`
  : `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const ApiEndPoints = {
  VALIDATE: `${baseUrl}/student/me`,
  REGISTER_USER: `${baseUrl}/student/signup`,
  LOGIN_USER: `${baseUrl}/student/signin`,
  GET_ALL_COURSE: `${baseUrl}/all-courses`,
  GET_COURSE_BY_COURSE_ID: `${baseUrl}/courses`,
  GET_TOPICS_BY_COURSE: `${baseUrl}/course`,
  GET_STUDENT_COURSES: `${baseUrl}/student/courses`,
  GET_SUBSCRIPTION_STATUS: `${baseUrl}/student/subscription-status`,
  CHECK_COURSE_ACCESS: `${baseUrl}/student/course`,
  CREATE_PAYMENT_ORDER: `${baseUrl}/create-order`,
  VERIFY_PAYMENT: `${baseUrl}/verify`,
  ADMIN_LOGIN: `${baseUrl}/admin/login`,
  ADMIN_VALIDATE: `${baseUrl}/admin/validate`,
  ADMIN_GET_ALL_COURSES: `${baseUrl}/all-courses`,
  ADMIN_CREATE_COURSE: `${baseUrl}/admin/courses`,
  ADMIN_UPDATE_COURSE: `${baseUrl}/admin/courses`,
  ADMIN_DELETE_COURSE: `${baseUrl}/admin/courses`,
  ADMIN_TOGGLE_COURSE_FREE: `${baseUrl}/admin/toggle-free`,
  ADMIN_CREATE_TOPIC: `${baseUrl}/admin/topics`,
  ADMIN_GET_PROMOCODES: `${baseUrl}/payment/admin/promocodes`,
  ADMIN_CREATE_PROMOCODE: `${baseUrl}/payment/admin/promocodes`,
  ADMIN_UPDATE_PROMOCODE: `${baseUrl}/payment/admin/promocodes`,
  ADMIN_DELETE_PROMOCODE: `${baseUrl}/payment/admin/promocodes`,
  UPLOAD_VIDEO: `${baseUrl}/upload/video`,
  UPLOAD_IMAGE: `${baseUrl}/upload/image`,
  GET_ALL_STATUS: `${baseUrl}/admin/status`,
  GET_ALL_STUDENTS: `${baseUrl}/admin/all_students`,

  GET_EACH_MONTH_REVENUE: (month: string) =>
    `${baseUrl}/admin/monthly_revenue/${month}`,
  
  GET_REVENUE_CHART_DATA: `${baseUrl}/admin/revenue_chart`,

  VALIDATE_PROMO: `${baseUrl}/admin/verify-promocodes`,
  GET_COURSE_LIST: (user_id: string) => `${baseUrl}/course/list/${user_id}`,
  GET_TOPICS_LIST: (user_id: string, course_id: string) =>
    `${baseUrl}/course/topics/${user_id}/${course_id}`,
  GET_STREAM: (user_id: string, topic_id: string) =>
    `${baseUrl}/topics/${user_id}/video/${topic_id}/stream`,
};
