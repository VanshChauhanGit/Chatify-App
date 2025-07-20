import { Response } from "express";
import bcrypt from "bcryptjs";
import UserOTPVerification from "../models/UserOTPVerification";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPVerificationEmail = async (
  { email }: { email: string },
  res: Response
) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOTPVerification = new UserOTPVerification({
      email,
      otp: hashedOtp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date(),
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailInfo = {
      from: "Chatify <Chatify.app1@gmail.com>",
      to: email,
      subject: "Chatify OTP Verification",
      text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Your OTP Code</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #667eea;">
              <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; margin-bottom: 20px;">This code will expire in <strong>10 minutes</strong></p>
            <p style="color: #999; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailInfo);

    await newOTPVerification.save();
  } catch (error) {
    console.error("Failed to send verification OTP Email:", error);

    // Only send response if it hasn't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        status: "FAILED",
        message: "Failed to send verification OTP!",
      });
    }
  }
};
