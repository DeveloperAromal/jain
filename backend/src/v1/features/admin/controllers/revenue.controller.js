import {
  getAllRevenue,
  getMonthlyTotalRevenue,
} from "../services/revenue.service.js";

export const getMonthlyRevenue = async (req, res) => {
  try {
    const { month } = req.params;
    console.debug("[revenue][LIST] Fetching all promo codes");

    const revenue = await getMonthlyTotalRevenue(month);

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    console.error("[revenue][LIST] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMonthRevenue = async (req, res) => {
  try {
    console.debug("[revenue][LIST] Fetching all promo codes");

    const revenue = await getAllRevenue();

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    console.error("[revenue][LIST] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
