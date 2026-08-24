// db.js
import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    // Agar pehle se connect hai to dobara connect mat karo
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
    throw err;
  }
};
