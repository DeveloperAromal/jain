import { supabase } from "../../../config/supabase.config.js";

export async function createPromoCode({
  code,
  discount_percent,
  max_uses = -1,
  expires,
  description,
  created_by,
}) {
  if (!code || !discount_percent) {
    throw new Error("Code and discount_percent are required");
  }

  if (discount_percent < 1 || discount_percent > 100) {
    throw new Error("Discount percent must be between 1 and 100");
  }

  const { data, error } = await supabase
    .from("promocodes")
    .insert([
      {
        code: code.toUpperCase(),
        discount_percent,
        max_uses,
        used_count: 0,
        active: true,
        expires: expires || null,
        description: description || null,
        created_by: created_by || null,
      },
    ])
    .select("*");

  if (error) {
    if (error.code === "23505") {
      throw new Error("Promo code already exists");
    }
    throw new Error(error.message);
  }

  return data[0];
}

export async function getAllPromoCodes() {
  const { data, error } = await supabase
    .from("promocodes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function updatePromoCode(id, updates) {
  if (!id) {
    throw new Error("Promo code ID is required");
  }

  const { data, error } = await supabase
    .from("promocodes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
}

export async function deletePromoCode(id) {
  if (!id) {
    throw new Error("Promo code ID is required");
  }

  const { error } = await supabase
    .from("promocodes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}

