import * as promocodeService from "../services/promocode.service.js";

/**
 * ADMIN – Create promo code
 */
export const createPromoCode = async (req, res) => {
  try {
    console.debug("[PROMO][CREATE] Payload:", req.body);

    const { code, discount_percent, max_uses, expires, description } = req.body;

    if (!code || !discount_percent) {
      return res.status(400).json({
        success: false,
        message: "Code and discount_percent are required",
      });
    }

    const promoCode = await promocodeService.createPromoCode({
      code,
      discount_percent,
      max_uses,
      expires,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      data: promoCode,
    });
  } catch (error) {
    console.error("[PROMO][CREATE] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create promo code",
    });
  }
};

/**
 * ADMIN – Get all promo codes
 */
export const getAllPromoCodes = async (_req, res) => {
  try {
    console.debug("[PROMO][LIST] Fetching all promo codes");

    const promoCodes = await promocodeService.getAllPromoCodes();

    return res.status(200).json({
      success: true,
      data: promoCodes,
    });
  } catch (error) {
    console.error("[PROMO][LIST] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ADMIN – Update promo code
 */
export const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.debug("[PROMO][UPDATE] ID:", id, "Updates:", updates);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Promo code ID is required",
      });
    }

    const updated = await promocodeService.updatePromoCode(id, updates);

    return res.status(200).json({
      success: true,
      message: "Promo code updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[PROMO][UPDATE] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ADMIN – Delete promo code
 */
export const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    console.debug("[PROMO][DELETE] ID:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Promo code ID is required",
      });
    }

    await promocodeService.deletePromoCode(id);

    return res.status(200).json({
      success: true,
      message: "Promo code deleted successfully",
    });
  } catch (error) {
    console.error("[PROMO][DELETE] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const validatePromoCode = async (req, res) => {
  const amount = 999
  try {
    const { code } = req.body;
    console.debug("[PROMO][VALIDATE] Code:", code);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
    }

    const result = await promocodeService.verifyPromoCode({
      code,
      baseAmount: amount || 0,
    });

    const promoData = result.valid
      ? {
          code: code.toUpperCase(),
          discountPercent:
            result.discountAmount && amount
              ? Math.round((result.discountAmount / amount) * 100)
              : 0,
        }
      : null;

    return res.status(200).json({
      success: true,
      valid: result.valid,
      message: result.message,
      promo: promoData,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });
  } catch (error) {
    console.error("[PROMO][VALIDATE] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to validate promo code",
    });
  }
};
