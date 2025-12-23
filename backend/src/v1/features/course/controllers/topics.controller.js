import {
  createTopic,
  getTopicsByCourseID,
  togleTopicFree,
  getAuthorizedTopic,
} from "../services/topics.service.js";

export const create_topic = async (req, res) => {
  try {
    const {
      course_id,
      title,
      description,
      tags,
      thumbnail_img,
      video_url,
      duration_minutes,
      is_free,
      sequence_order,
    } = req.body;

    const newTopic = await createTopic({
      course_id,
      title,
      description,
      tags,
      thumbnail_img,
      video_url,
      duration_minutes,
      is_free,
      sequence_order,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic: newTopic,
    });
  } catch (e) {
    console.error("create_topic error:", e);
    return res.status(500).json({
      success: false,
      message: `Failed to create topic: ${e.message || e}`,
    });
  }
};


export const get_topics_by_course = async (req, res) => {
  try {
    const { course_id } = req.params;

    const topics = await getTopicsByCourseID(course_id);

    return res.status(200).json({
      success: true,
      message: "Topics fetched successfully",
      topics,
    });
  } catch (e) {
    console.error("get_topics_by_course error:", e);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch topics: ${e.message || e}`,
    });
  }
};

export const updateToggleIsFree = async (req, res) => {
  try {
    const { topic_id } = req.params;

    const topics = await togleTopicFree(topic_id);

    return res.status(200).json({
      success: true,
      message: "Updated",
      topics,
    });
  } catch (e) {
    console.error("update_topics_by_course error:", e);
    return res.status(500).json({
      success: false,
      message: `Failed to update: ${e.message || e}`,
    });
  }
};

export const getAuthorizedTopicsHandler = async (req, res) => {
  try {
    const { user_id, course_id } = req.params;

    const topics = await getAuthorizedTopic(user_id, course_id);

    return res.status(200).json({
      success: true,
      message: "Fetched datas",
      topics,
    });
  } catch (e) {
    console.error("fetching error:", e);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch: ${e.message || e}`,
    });
  }
};
