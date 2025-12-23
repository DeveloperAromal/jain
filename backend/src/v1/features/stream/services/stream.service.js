import { supabase } from "../../../config/supabase.config.js";

export async function streamAuthorizeVideoService(user_id, topic_id) {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, subscription_active")
    .eq("id", user_id)
    .single();

  if (userError || !userData) {
    throw new Error("USER_NOT_FOUND");
  }

  const { subscription_active } = userData;

  const { data: topicData, error: topicError } = await supabase
    .from("topics")
    .select("video_url, is_free")
    .eq("id", topic_id)
    .single();

  if (topicError || !topicData) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  const { video_url, is_free } = topicData;

  if (!subscription_active && !is_free) {
    throw new Error("FORBIDDEN");
  }

  return video_url;
}
