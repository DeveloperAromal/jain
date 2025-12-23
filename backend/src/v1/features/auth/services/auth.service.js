import { supabase } from "../../../config/supabase.config.js";
import { generateJwtToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const signInAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data: userData, error: userError } = await supabase
    .from("admin")
    .select("id, email, password") 
    .eq("email", email)
    .single();

  if (userError || !userData) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, userData.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateJwtToken({
    id: userData.id,
    email: userData.email,
    role: "admin", 
  });

  return token;
};
