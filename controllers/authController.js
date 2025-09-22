import { generateToken } from "../utils/token.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// 🔹 Email transporter
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



export const login = async (req, res) => {
  try {
    const {  email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.json({
      token,
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

    // Check OTP and expiry
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

    // Clear OTP fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ msg: "Password reset successful ✅" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
