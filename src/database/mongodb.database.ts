import mongoose from "mongoose";

export const mongodbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://127.0.0.1/roulette",
      {}
    );

    if (!connection) throw new Error("mongodb connection failed");

    console.log("mongodb connection successful", connection.version);
  } catch (error: any) {
    console.error("error during mongodb connection :", error?.message);

    process.exit(1);
  }
};
