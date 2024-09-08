import mongoose from "mongoose";
import { IUserSchema } from "../interfaces/user.schema";

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isValid: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("User", userSchema);
