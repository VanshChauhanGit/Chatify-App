import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";
import { sendOTPVerificationEmail } from "../utils/emailService";
import UserOTPVerification from "../models/UserOTPVerification";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, avatar } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, msg: "User already exists" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance (not saved yet)
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      avatar: avatar || "",
      isEmailVerified: false,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send OTP to email (AFTER saving user)
    try {
      await sendOTPVerificationEmail({ email: savedUser.email }, res);
    } catch (otpError) {
      console.error("Error sending OTP:", otpError);
      // Optional: Rollback user creation if email failed
      await User.findByIdAndDelete(savedUser._id);
      res
        .status(500)
        .json({ success: false, msg: "Failed to send OTP. Please try again." });
      return;
    }

    // Generate JWT token
    const token = generateToken(savedUser);

    // Send success response
    res.status(200).json({
      success: true,
      token,
      msg: "User registered successfully. OTP sent to email.",
    });
  } catch (error) {
    console.error("Error at registerUser:", error);
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

export const verifyEmailOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp } = req.body;

  try {
    // Check if email and OTP are provided
    if (!email || !otp) {
      res
        .status(400)
        .json({ success: false, msg: "Please provide email and OTP" });
      return;
    }

    // Get the latest OTP record
    const otpRecord = await UserOTPVerification.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    // If no OTP record found
    if (!otpRecord) {
      res
        .status(400)
        .json({ success: false, msg: "No OTP found for this email" });
      return;
    }

    const { expiresAt, otp: hashedOtp } = otpRecord;

    // Check if OTP is expired
    if (expiresAt < new Date()) {
      await UserOTPVerification.deleteMany({ email }); // cleanup expired OTPs
      res
        .status(400)
        .json({ success: false, msg: "OTP has expired, please resend OTP!" });
      return;
    }

    // Compare the OTP
    const isMatch = await bcrypt.compare(otp, hashedOtp);
    if (!isMatch) {
      res
        .status(400)
        .json({ success: false, msg: "Invalid OTP, please try again!" });
      return;
    }

    // Mark email as verified and get the updated user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found while verifying.");
    }

    // generate JWT token
    const token = generateToken(updatedUser);

    // Delete all OTP records for this user after successful verification
    await UserOTPVerification.deleteMany({ email });

    res.status(200).json({
      success: true,
      token,
      msg: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const resendVerifyEmailOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ success: false, msg: "Please provide email" });
      return;
    }
    await UserOTPVerification.deleteMany({ email });
    await sendOTPVerificationEmail({ email }, res);
    res.status(200).json({ success: true, msg: "OTP sent to email!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
