import { supabase } from "../../../config/supabase.config.js";

/**
 * Create promo code
 */
export async function createPromoCode({
  code,
  discount_percent,
  max_uses = -1,
  expires = null,
  description = null,
  created_by = null,
}) {
  console.debug("[PROMO][SERVICE][CREATE]", code);

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
        expires,
        description,
        created_by,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[PROMO][SERVICE][CREATE] Error:", error);
    if (error.code === "23505") {
      throw new Error("Promo code already exists");
    }
    throw error;
  }

  return data;
}

/**
 * Get all promo codes
 */
export async function getAllPromoCodes() {
  const { data, error } = await supabase
    .from("promocodes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Update promo code
 */
export async function updatePromoCode(id, updates) {
  console.debug("[PROMO][SERVICE][UPDATE]", id);

  const { data, error } = await supabase
    .from("promocodes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete promo code
 */
export async function deletePromoCode(id) {
  console.debug("[PROMO][SERVICE][DELETE]", id);

  const { error } = await supabase.from("promocodes").delete().eq("id", id);

  if (error) throw error;
  return true;
}


export async function verifyPromoCode({ code, baseAmount = 0 }) {
  console.debug("[PROMO][SERVICE][VERIFY]", code);

  const normalizedCode = code.toUpperCase();

  const { data: promo, error } = await supabase
    .from("promocodes")
    .select("*")
    .eq("code", normalizedCode)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("[PROMO][SERVICE][VERIFY] Supabase error:", error);
    throw new Error(error.message);
  }

  if (!promo) {
    return {
      valid: false,
      message: "Invalid promo code",
      discountAmount: 0,
      finalAmount: baseAmount,
    };
  }

  if (promo.expires && new Date(promo.expires) < new Date()) {
    return {
      valid: false,
      message: "Promo code expired",
      discountAmount: 0,
      finalAmount: baseAmount,
    };
  }

  if (promo.max_uses !== -1 && promo.used_count >= promo.max_uses) {
    return {
      valid: false,
      message: "Promo code usage limit reached",
      discountAmount: 0,
      finalAmount: baseAmount,
    };
  }

  const discountAmount = Math.round((baseAmount * promo.discount_percent) / 100);
  const finalAmount = Math.max(baseAmount - discountAmount, 0);

  console.info(
    "[PROMO][SERVICE][VERIFY] Promo applied:",
    promo.code,
    "Discount:", discountAmount
  );

  return {
    valid: true,
    message: "Promo applied successfully",
    discountAmount,
    finalAmount,
  };
}