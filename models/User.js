import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  refreshToken: { type: String, select: false },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const User = mongoose.model("User", UserSchema);
export default User;
