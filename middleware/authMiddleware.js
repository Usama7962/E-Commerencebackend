import User from "../models/User.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/token.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      // 🔹 step 1: verify access token
      decoded = verifyAccessToken(token);
    } catch (err) {
      // 🔹 step 2: agar access token expire hai → refresh token check karo
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ msg: "Refresh token missing, please login again" });
        }

        let refreshDecoded;
        try {
          refreshDecoded = verifyRefreshToken(refreshToken);
        } catch (refreshErr) {
          return res.status(401).json({ msg: "Invalid refresh token" });
        }

        const user = await User.findById(refreshDecoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(401).json({ msg: "Refresh token not valid" });
        }

        // 🔹 step 3: generate new access token
        const newAccessToken = generateAccessToken({
          id: user._id,
          email: user.email,
          role: user.role,
        });

        // send new token in response header
        res.setHeader("x-access-token", newAccessToken);

        req.user = user;
        req.userId = user._id;
        return next();
      } else {
        return res.status(401).json({ msg: "Invalid token" });
      }
    }

    // 🔹 if access token valid
    let user;
    if (decoded.id) {
      user = await User.findById(decoded.id);
    } else if (decoded.email) {
      user = await User.findOne({ email: decoded.email });
    }

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
