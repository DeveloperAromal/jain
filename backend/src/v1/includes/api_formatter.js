export function FormatRes({ statusCode = 200, detail = "", data = null }) {
  return {
    status_code: statusCode,
    detail,
    data,
  };
}
