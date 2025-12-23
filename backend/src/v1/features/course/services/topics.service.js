import { supabase } from "../../../config/supabase.config.js";

export async function createTopic({
  course_id,
  title,
  description,
  tags,
  thumbnail_img,
  video_url,
  duration_minutes,
  sequence_order,
}) {
  if (!sequence_order) {
    const { data: lastTopic, error: lastErr } = await supabase
      .from("topics")
      .select("sequence_order")
      .eq("course_id", course_id)
      .order("sequence_order", { ascending: false })
      .limit(1);

    if (lastErr) throw lastErr;

    sequence_order = lastTopic?.[0]?.sequence_order
      ? lastTopic[0].sequence_order + 1
      : 1;
  }

  const { data, error } = await supabase
    .from("topics")
    .insert([
      {
        course_id,
        title,
        description,
        tags,
        thumbnail_img,
        video_url,
        duration_minutes,
        sequence_order,
        is_published: true,
      },
    ])
    .select("*");

  if (error) throw error;

  return data[0];
}

export async function getTopicsByCourseID(course_id) {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", course_id)
    .order("sequence_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function togleTopicFree(topic_id) {
  const { data, error } = await supabase
    .from("topics")
    .update({ is_free })
    .eq("topic_id", topic_id)
    .select("*");

  if (error) throw error;
  return data;
}

export async function getAuthorizedTopic(user_id, course_id) {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, subscription_active")
    .eq("id", user_id)
    .single();

  if (userError) throw userError;

  const { subscription_active } = userData;

  const { data: topicData, error: topicError } = await supabase
    .from("topics")
    .select(
      "id, title, description, thumbnail_img, tags, duration_minutes, is_free"
    )
    .eq("course_id", course_id);

  if (topicError) throw topicError;

  if (!subscription_active) {
    return topicData;
  }

  return topicData.map((topic) => ({
    ...topic,
    is_free: true, 
  }));
}

