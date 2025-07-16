import { log } from "console";
import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, avatar } = req.body;
  try {
    // Check if user already exists with the email
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, msg: "User already exists" });
      return;
    }

    // Create new user
    const newUser = new User({ email, password, name, avatar: avatar || "" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;

    // Save the user to the database
    await newUser.save();

    // generate token
    const token = generateToken(newUser);

    res
      .status(200)
      .json({ success: true, token, msg: "User registered successfully" });
  } catch (error) {
    console.log("Error at registerUser", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, msg: "User not found" });
      return;
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, msg: "Incorrect password" });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res
      .status(200)
      .json({ success: true, token, msg: "User logged in successfully" });
  } catch (error) {
    console.log("Error at loginUser", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
