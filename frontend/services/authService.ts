import { API_URL } from "@/constants";
import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log("got error:", error);
    const msg = error?.response?.data?.message || "Login Failed!";
    throw new Error(msg);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  avatar?: string | null
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      avatar,
    });
    return response.data;
  } catch (error: any) {
    console.log("got error:", error);
    const msg = error?.response?.data?.message || "Registration Failed!";
    throw new Error(msg);
  }
};

export const verifyEmailOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, {
      email,
      otp,
    });

    return response.data;
  } catch (error: any) {
    console.log("got error:", error);
  }
};

export const resendVerifyEmailOTP = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-otp`, {
      email,
    });

    return response.data;
  } catch (error: any) {
    console.log("got error:", error);
  }
};
