import { uploadVideo, uploadImage } from "../services/upload.service.js";

export const uploadVideoFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadVideo(req.file);

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload video",
    });
  }
};

export const uploadImageFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadImage(req.file);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload image",
    });
  }
};
