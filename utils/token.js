import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  // Always include user id in token for robust authentication
  const token = jwt.sign(
    { ...payload },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || "1d" }
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
