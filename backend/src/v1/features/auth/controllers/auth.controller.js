import {
  signInAdmin, 
  validateAdmin,
} from "../services/auth.service.js";

export const signInAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const token = await signInAdmin({ email, password });

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ token });
  } catch (e) {
    console.error("Error in signInAdminUser:", e);
    res.status(500).json({ message: "Server Error during sign in." });
  }
};

export const validateAdminUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token." });
    }

    const user = await validateAdmin(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ authenticated: true, user });
  } catch (e) {
    console.error("Error in validateAdminUser:", e);
    res.status(500).json({ message: "Server Error during validation." });
  }
};
