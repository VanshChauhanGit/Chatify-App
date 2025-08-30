import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";
import { sendOTPVerificationEmail } from "../utils/emailService";
import UserOTPVerification from "../models/UserOTPVerification";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, avatar } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({
        success: false,
        msg: "User already exists with this email, login instead!",
      });
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
      res.json({
        success: false,
        msg: "Failed to send OTP, Please try again!",
      });
      return;
    }

    // Send success response
    res.json({
      success: true,
      msg: "User registered successfully, OTP sent to email.",
    });
  } catch (error) {
    console.error("Error at registerUser:", error);
    res.status(500).json({ success: false, msg: "Server error!" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        success: false,
        msg: "User not found with this email, register first!",
      });
      return;
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ success: false, msg: "Incorrect password!" });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.json({ success: true, token, msg: "User logged in successfully" });
  } catch (error) {
    console.log("Error at loginUser", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const verifyEmailOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      res.json({
        success: false,
        msg: "Email and OTP are required.",
      });
      return;
    }

    // Get latest OTP for this email
    const otpRecord = await UserOTPVerification.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!otpRecord) {
      res.json({
        success: false,
        msg: "No OTP record found for this email.",
      });
      return;
    }

    const { otp: hashedOtp, expiresAt } = otpRecord;

    // Check expiration
    if (new Date() > expiresAt) {
      await UserOTPVerification.deleteMany({ email }); // Clean up expired OTPs
      res.json({
        success: false,
        msg: "OTP has expired, Please request a new one.",
      });
      return;
    }

    // Validate OTP
    const isOtpValid = await bcrypt.compare(otp, hashedOtp);
    if (!isOtpValid) {
      res.json({
        success: false,
        msg: "Invalid OTP, Please try again.",
      });
      return;
    }

    // Update user's email verification status
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      res.json({
        success: false,
        msg: "User not found while verifying email.",
      });
      return;
    }

    // Generate token and clean up OTPs
    const token = generateToken(updatedUser);
    await UserOTPVerification.deleteMany({ email });

    res.json({
      success: true,
      token,
      msg: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Error during email OTP verification:", error);
    res.json({
      success: false,
      msg: "Something went wrong while verifying OTP, Please try again later.",
    });
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
    res
      .status(200)
      .json({ success: true, msg: "OTP has been resended to email!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const googleLoginUser = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
      return res.json({ success: false, msg: "Invalid Google Token" });
    }

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
        isEmailVerified: true,
        googleId: sub,
        password: "",
      });
      await user.save();
    }

    const token = generateToken(user);
    res.json({ success: true, token, msg: "Logged in with Google!" });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ success: false, msg: "Server error!" });
  }
};
