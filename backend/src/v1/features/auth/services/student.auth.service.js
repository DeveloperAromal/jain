import { supabase } from "../../../config/supabase.config.js";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../utils/jwt.js";

export const signUpStudent = async ({
  email,
  password,
  name,
  phone,
  student_class,
}) => {
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  const studentClass = student_class;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: newUser, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        password: hashedPassword,
        name,
        phone,
        class: studentClass,
        is_active: true,
      },
    ])
    .select("id, email, name, class, phone, created_at");

  if (error) {
    throw new Error("Failed to create user account");
  }

  const token = generateJwtToken({
    id: newUser[0].id,
    email: newUser[0].email,
  });

  return {
    user: newUser[0],
    token,
  };
};

export const signInStudent = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, password, class, phone, is_active, created_at")
    .eq("email", email)
    .maybeSingle();

  if (error || !user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account has been deactivated");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateJwtToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      class: user.class,
      phone: user.phone,
      created_at: user.created_at,
    },
    token,
  };
};

export const getCurrentStudent = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, class, phone, is_active, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateStudentProfile = async (
  userId,
  { name, phone, student_class }
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (student_class) updateData.class = student_class;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  updateData.updated_at = new Date().toISOString();

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select("id, email, name, class, phone, is_active, created_at, updated_at");

  if (error) {
    throw new Error("Failed to update profile");
  }

  return updatedUser[0];
};
