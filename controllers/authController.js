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

// =====================
// Nodemailer transporter
// =====================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================
// Signup
// =====================
export const signup = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, email, password: hashPass });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// =====================
// Login → Access + Refresh token
// =====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // optional: save refreshToken in DB for extra security
    user.refreshToken = refreshToken;
    await user.save();

    // send refresh token in cookie (httpOnly, secure)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    res.status(500).json({ msg: err.message });
  }
};

// =====================
// Refresh Access Token
// =====================
export const refreshToken = async (req, res) => {
  try {
    const {refreshToken}= req.body
console.log(req.body,"ssdfsdf")
    if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
};

// =====================
// Logout → clear refresh token
// =====================
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: "" });
    }
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// =====================
// Forget Password → Send OTP
// =====================
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit
    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send OTP on email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>This OTP is valid for 15 minutes.</p>`,
    });

    res.json({ msg: "OTP sent to your email ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// =====================
// Verify OTP
// =====================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (
      parseInt(user.resetToken) !== parseInt(otp) ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// =====================
// Reset Password
// =====================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const hashPass = await bcrypt.hash(password, 10);
    user.password = hashPass;

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ msg: "Password reset successful ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
