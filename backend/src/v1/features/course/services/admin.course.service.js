import { supabase } from "../../../config/supabase.config.js";

export async function adminCreateCourse({
  subject,
  subject_class,
  description,
  tags,
  cover_image,
}) {
  if (!subject || !subject_class) {
    throw new Error("Subject and subject_class are required");
  }

  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        subject,
        subject_class,
        description,
        tags,
        cover_image,
        is_free: false,
      },
    ])
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
}

export async function adminUpdateCourse(courseId, updates) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  const { data, error } = await supabase
    .from("courses")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
}

export async function adminDeleteCourse(courseId) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (error) throw new Error(error.message);

  return { success: true };
}

