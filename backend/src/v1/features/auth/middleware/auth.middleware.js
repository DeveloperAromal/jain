import { verifyJwtToken } from "../utils/jwt.js";

export const Protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization token missing" });
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyJwtToken(token);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};
