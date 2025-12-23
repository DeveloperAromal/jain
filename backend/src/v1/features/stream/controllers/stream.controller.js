import { streamAuthorizeVideoService } from "../services/stream.service.js";
import { streamVideo } from "../utils/stream.utils.js";
import { verifyJwtToken } from "../../auth/utils/jwt.js";

export async function streamAuthorizedVideo(req, res) {
  try {
    const { user_id, topic_id } = req.params;
    const range = req.headers.range;

    const token = req.cookies?.token; 

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(topic_id)

    const decoded = verifyJwtToken(token);

    if (decoded.id !== user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const videoUrl = await streamAuthorizeVideoService(user_id, topic_id);

    await streamVideo({
      videoUrl,
      range,
      res,
    });

  } catch (err) {
    if (err.message === "Invalid or expired token") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (err.message === "USER_NOT_FOUND" || err.message === "TOPIC_NOT_FOUND") {
      return res.status(404).json({ message: "Resource not found" });
    }

    console.error(err);
    res.status(500).json({ message: "Streaming failed" });
  }
}
