import express from "express";
import cors from "cors";
import { json } from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./features/auth/routes/auth.route.js";
import topicRoutes from "./features/course/routes/topic.route.js";
import paymentRoutes from "./features/payment/routes/payment.route.js";
import courseRoutes from "./features/course/routes/course.route.js";
import uploadRoutes from "./features/course/routes/upload.route.js";
import promocodeRoutes from "./features/payment/routes/promocode.route.js";
import streamRoute from "./features/stream/routes/stream.route.js";
import statusRoute from "./features/admin/routes/status.route.js";
import revenueRoute from "./features/admin/routes/revenue.route.js";

import { swaggerSpec } from "./config/swagger.config.js";

const app = express();

app.use(json());

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://jainmathshub.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Range"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.get("/", (req, res) => {
  res.send("Jain Academy API is running");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", topicRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1", promocodeRoutes);
app.use("/api/v1", streamRoute);
app.use("/api/v1", statusRoute);
app.use("/api/v1", revenueRoute);

export default app;
