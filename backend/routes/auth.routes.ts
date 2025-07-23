import { Router } from "express";
import {
  googleLoginUser,
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
router.post("/google-login", googleLoginUser);

export default router;
