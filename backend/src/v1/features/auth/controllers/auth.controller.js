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