import { streamAuthorizeVideoService } from "../services/stream.service.js";
import { streamVideo } from "../utils/stream.utils.js";

export async function streamAuthorizedVideo(req, res) {
  console.log("🔥 STREAM CONTROLLER HIT — NO AUTH 🔥");

  try {
    const { user_id, topic_id } = req.params;
    const range = req.headers.range;

    console.log("Streaming topic:", topic_id);

    const videoUrl = await streamAuthorizeVideoService(user_id, topic_id);

    await streamVideo({
      videoUrl,
      range,
      res,
    });
  } catch (err) {
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (err.message === "USER_NOT_FOUND" || err.message === "TOPIC_NOT_FOUND") {
      return res.status(404).json({ message: "Resource not found" });
    }

    console.error("[STREAM ERROR]:", err);
    res.status(500).json({ message: "Streaming failed" });
  }
}
