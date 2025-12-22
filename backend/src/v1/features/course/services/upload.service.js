import { supabase } from "../../../config/supabase.config.js";
import { v4 as uuidv4 } from "uuid";

const DEBUG = true; // 🔥 turn off in production

function log(...args) {
  if (DEBUG) console.log("[UPLOAD]", ...args);
}

function errorLog(...args) {
  if (DEBUG) console.error("[UPLOAD ERROR]", ...args);
}

export async function uploadVideo(file) {
  log("Starting video upload");

  if (!file) {
    errorLog("No file provided");
    throw new Error("File is required");
  }

  log("File info:", {
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `videos/${fileName}`;

  log("Generated path:", filePath);

  try {
    const { data, error } = await supabase.storage
      .from("course_video")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      errorLog("Supabase upload failed", error);
      throw error;
    }

    log("Upload success:", data);

    const { data: publicURL } = supabase.storage
      .from("course_video")
      .getPublicUrl(filePath);

    log("Public URL generated:", publicURL?.publicUrl);

    return {
      url: publicURL.publicUrl,
      path: filePath,
    };
  } catch (err) {
    errorLog("Video upload error:", err.message || err);
    throw err;
  }
}

export async function uploadImage(file) {
  log("Starting image upload");

  if (!file) {
    errorLog("No file provided");
    throw new Error("File is required");
  }

  log("File info:", {
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  log("Generated path:", filePath);

  try {
    const { data, error } = await supabase.storage
      .from("thumbnail_image")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      errorLog("Supabase upload failed", error);
      throw error;
    }

    log("Upload success:", data);

    const { data: publicURL } = supabase.storage
      .from("thumbnail_image")
      .getPublicUrl(filePath);

    log("Public URL generated:", publicURL?.publicUrl);

    return {
      url: publicURL.publicUrl,
      path: filePath,
    };
  } catch (err) {
    errorLog("Image upload error:", err.message || err);
    throw err;
  }
}
