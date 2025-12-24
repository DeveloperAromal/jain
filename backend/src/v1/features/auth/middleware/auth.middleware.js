import { verifyJwtToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

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


export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

export const streamAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    console.log("No token in cookies");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};