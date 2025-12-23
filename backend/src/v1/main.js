import express from "express";
import cors from "cors";
import { json } from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";


import authRoutes from "./features/auth/routes/auth.route.js";
import topicRoutes from "./features/course/routes/topic.route.js";
import paymentRoutes from "./features/payment/routes/payment.route.js";
import courseRoutes from "./features/course/routes/course.route.js";
import uploadRoutes from "./features/course/routes/upload.route.js";
import promocodeRoutes from "./features/payment/routes/promocode.route.js";
import { swaggerSpec } from "./config/swagger.config.js";

import streamRoute from "./features/stream/routes/stream.route.js" 

import statusRoute from "./features/admin/routes/status.route.js"
import revenueRoute from "./features/admin/routes/revenue.route.js";


const app = express();

app.use(json());
app.use(cors());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://jainmathshub.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.send("Jain Academy api");
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use("/api/v1", authRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", topicRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1", promocodeRoutes);
app.use("/api/v1", streamRoute);
app.use("/api/v1", statusRoute);
app.use("/api/v1", revenueRoute)

 
export default app;
