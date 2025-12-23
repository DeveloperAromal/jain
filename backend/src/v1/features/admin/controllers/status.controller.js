import { getAllStudents, getDashboardStats } from "../services/status.service.js";


export const getStatus = async (_req, res) => {
  try {
    console.debug("[status][LIST] Fetching all status");

    const status = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("[status][LIST] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    console.debug("[students][LIST] Fetching all students");

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await getAllStudents({ page, limit });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[students][LIST] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
