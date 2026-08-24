import crypto from "node:crypto";

const guestCookieName = "guestId";

export const getGuestId = (req, res) => {
  const cookies = req.headers.cookie?.split(";").reduce((values, item) => {
    const [name, ...parts] = item.trim().split("=");
    if (name) values[name] = decodeURIComponent(parts.join("="));
    return values;
  }, {}) || {};

  const guestId = cookies[guestCookieName] || crypto.randomUUID();

  if (!cookies[guestCookieName]) {
    res.cookie(guestCookieName, guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return guestId;
};

export const getSessionFilter = (req, res) => {
  if (req.user?._id) return { user: req.user._id, guestId: null };
  return { user: null, guestId: getGuestId(req, res) };
};
