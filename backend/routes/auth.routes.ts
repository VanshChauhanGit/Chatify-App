import { Router } from "express";
import {
  loginUser,
  registerUser,
  resendVerifyEmailOTP,
  verifyEmailOTP,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyEmailOTP);
router.post("/resend-otp", resendVerifyEmailOTP);

export default router;
