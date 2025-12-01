import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_PUBLIC_URL || "";
const supabaseKey = process.env.SUPABASE_PUBLIC_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

