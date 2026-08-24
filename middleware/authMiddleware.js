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
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken =
          req.cookies?.refreshToken ||
          req.headers.cookie?.match(/(?:^|;\s*)refreshToken=([^;]+)/)?.[1];

        if (!refreshToken) {
          return res.status(401).json({ msg: "Session expired, please login again" });
        }

        let refreshDecoded;
        try {
          refreshDecoded = verifyRefreshToken(refreshToken);
        } catch (refreshErr) {
          return res.status(401).json({ msg: "Invalid refresh token" });
        }

        const user = await User.findById(refreshDecoded.id).select("+refreshToken");
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(401).json({ msg: "Refresh token not valid" });
        }

        const newAccessToken = generateAccessToken({
          id: user._id,
          email: user.email,
          role: user.role,
        });

        res.setHeader("x-access-token", newAccessToken);

        req.user = user;
        req.userId = user._id;
        return next();
      }
      return res.status(401).json({ msg: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
