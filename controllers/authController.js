import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Admin Login Only
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ msg: "Token expired or invalid" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      const decoded = verifyRefreshToken(token).catch?.() || null;
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
      }
    }
    res.clearCookie("refreshToken");
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.json({ msg: "Logged out" });
  }
};

// Forget Password - Send OTP (Admin only)
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>This OTP is valid for 15 minutes.</p>`,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    if (
      parseInt(user.resetToken) !== parseInt(otp) ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const hashPass = await bcrypt.hash(password, 12);
    user.password = hashPass;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
