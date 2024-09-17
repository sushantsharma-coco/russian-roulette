import { Request, Response } from "express";

import { ApiResponse } from "../../utils/ApiResponse.utils";
import { ApiError } from "../../utils/ApiError.utils";
import { User } from "../../models/user.model";

let options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      throw new ApiError(400, "email and passowrd is required");

    let userExists = await User.findOne({ email });

    if (!userExists) throw new ApiError(404, "user with email not found");

    let isPasswordValid = userExists.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(400, "invalid password");

    let accessToken = userExists.generateAccessToken();

    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .send(new ApiResponse(200, { accessToken, message: "login successful" }));
  } catch (error) {
    console.error("error during login");
  }
};
