import jwt from "jsonwebtoken";

/**
 * Generate Access Token (short expiry, e.g. 15m)
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload },
    process.env.ACCESS_TOKEN_SECRET,   // alag secret rakho
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

/**
 * Generate Refresh Token (long expiry, e.g. 7d)
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload },
    process.env.REFRESH_TOKEN_SECRET,  // alag secret rakho
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

