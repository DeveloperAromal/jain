import axios from "axios";
import { supabase } from "../../../config/supabase.config.js";
import { generateJwtToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

const apiBaseUrl = process.env.API_BASE_URL || "http://localhost";
const port = process.env.PORT || 4000;

export const signInAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data: userData, error: userError } = await supabase
    .from("clients")
    .select("*")
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
  });
  return token;
};

export const validateAdmin = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: userData, error: userError } = await supabase
    .from("clients")
    .select("id, email, name, company_name, phonenumber, client_id")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    throw new Error("User not found");
  }

  try {
    const apiResponse = await axios.get(
      `${apiBaseUrl}:${port}/api/v1/get/clients-data/${userData.id}`,
      { timeout: 5000 }
    );
    return {
      message: "Authenticated",
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        additionalData: apiResponse.data,
      },
    };
  } catch (apiErr) {
    console.warn(
      `Could not fetch additional user data for ID ${userData.id}:`,
      apiErr.message
    );
    return {
      message: "Authenticated (partial data)",
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        additionalData: null,
      },
    };
  }
};
