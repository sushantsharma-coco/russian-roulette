import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://127.0.0.1/russian-roulette",
      {}
    );

    if (!connection) throw new Error("mongodb connection failed");

    console.error("mongodb connection successful", connection.version);
  } catch (error: any) {
    console.error("error during mongodb connection :", error?.message);

    process.exit(1);
  }
};
