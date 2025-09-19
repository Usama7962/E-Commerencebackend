import User from "../models/User.js";
import { verifyToken } from "../utils/token.js";
import jwt from "jsonwebtoken";



export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    console.log("Verifying token:", token);
    const decoded = verifyToken(token);
    console.log("Decoded token:", decoded);
    // Prefer id from token, fallback to email
    let user;
    if (decoded.id) {
      user = await User.findById(decoded.id);
    } else if (decoded.email) {
      user = await User.findOne({ email: decoded.email });
    }
    console.log("Authenticated user:", user);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
