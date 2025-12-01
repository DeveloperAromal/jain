import * as promocodeService from "../services/promocode.service.js";

export const createPromoCode = async (req, res) => {
  try {
    const { code, discount_percent, max_uses, expires, description } = req.body;
    const created_by = req.user?.id;

    if (!code || !discount_percent) {
      return res.status(400).json({
        success: false,
        message: "Code and discount_percent are required",
      });
    }

    const promoCode = await promocodeService.createPromoCode({
      code,
      discount_percent,
      max_uses: max_uses || -1,
      expires: expires || null,
      description: description || null,
      created_by,
    });

    return res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      data: promoCode,
    });
  } catch (error) {
    console.error("createPromoCode error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create promo code",
    });
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await promocodeService.getAllPromoCodes();

    return res.status(200).json({
      success: true,
      message: "Promo codes retrieved successfully",
      data: promoCodes,
    });
  } catch (error) {
    console.error("getAllPromoCodes error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve promo codes",
    });
  }
};

export const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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
    console.error("updatePromoCode error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update promo code",
    });
  }
};

export const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

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
    console.error("deletePromoCode error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete promo code",
    });
  }
};

