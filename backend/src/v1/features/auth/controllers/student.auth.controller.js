import * as studentAuthService from "../services/student.auth.service.js";

export const signUpStudent = async (req, res) => {
  try {
    const { email, password, name, phone, class: student_class } = req.body;

    const result = await studentAuthService.signUpStudent({
      email,
      password,
      name,
      phone,
      student_class,
    });

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create account",
    });
  }
};

export const signInStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await studentAuthService.signInStudent({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

export const getCurrentStudent = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await studentAuthService.getCurrentStudent(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "User not found",
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, student_class } = req.body;

    const updatedUser = await studentAuthService.updateStudentProfile(userId, {
      name,
      phone,
      student_class,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
