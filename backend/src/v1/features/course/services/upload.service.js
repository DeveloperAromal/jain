import { supabase } from "../../../config/supabase.config.js";
import { v4 as uuidv4 } from "uuid";

export async function uploadVideo(file) {
  if (!file) {
    throw new Error("File is required");
  }

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `videos/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("course_video")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicURL } = supabase.storage
      .from("course_video")
      .getPublicUrl(filePath);

    return {
      url: publicURL.publicUrl,
      path: filePath,
    };
  } catch (err) {
    throw err;
  }
}

export async function uploadImage(file) {
  if (!file) {
    throw new Error("File is required");
  }

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("thumbnail_image")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicURL } = supabase.storage
      .from("thumbnail_image")
      .getPublicUrl(filePath);

    return {
      url: publicURL.publicUrl,
      path: filePath,
    };
  } catch (err) {
    throw err;
  }
}
