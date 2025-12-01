import { supabase } from "../../../config/supabase.config.js";
import generatePromoCode from "../utils/generate_promo_code.utils.js";

export async function createRefferal(user_id) {
  let exists = true;

  while (exists) {
    reff_code = generatePromoCode();

    const { data, error } = await supabase
      .from("refferals")
      .select("refferal_code")
      .eq("refferal_code", reff_code)
      .single();

    if (error) throw error;

    exists = data ? true : false;
  }

  const { data: reff_data, error: reff_error } = await supabase
    .from("refferals")
    .insert([{ user_id, refferal_code: reff_code }])
    .select("*");

  if (reff_error) throw reff_error;

  return reff_data;
}

export async function findHowMyUsersUsedReff(reff_code, type) {
  const { data, error } = await supabase
    .from("refferals")
    .select("*")
    .eq("refferal_code", reff_code);

  if (type === "count") {
    return data.length;
  }

  if (type == "info") {
    const userIds = referrals.map((r) => r.user_id);

    if (userIds.length === 0) return [];

    const { data: users, error: usersErr } = await supabase
      .from("users")
      .select("name, class, user_id")
      .in("user_id", userIds);

    if (usersErr) throw usersErr;

    return users;
  }
}
