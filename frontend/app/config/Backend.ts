const isProduction = process.env.NODE_ENV === "production";

const baseUrl = isProduction
  ? `https://jain-wycd.onrender.com/api/v1`
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
};
