import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import * as Icon from "phosphor-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "@/contexts/AuthContext";
import { verticalScale } from "@/utils/styling";
import ResendOtpButton from "@/components/ResendOtpButton";
import { resendVerifyEmailOTP, verifyEmailOTP } from "@/services/authService";

const VerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { updateToken } = useAuth();

  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyEmailOTP(email as string, otp);

      console.log("Response at VerifyOtp:", response);

      if (response.success == false) {
        setError(response.msg || "Verification failed");
        return;
      }

      setError("");

      await updateToken(response.token);

      router.replace("/(main)/home" as any);
    } catch (error: any) {
      setError(error?.message || "Verification failed");
      Alert.alert(
        "Email Verification",
        error?.message || "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerifyEmailOTP(email as string);
    } catch (error: any) {
      Alert.alert("Resend OTP", error?.message || "OTP Resend failed!");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern bgOpacity={0.5}>
        <View className="justify-between flex-1">
          <View className="flex-row items-center justify-between px-4">
            <BackButton />
            <Typo color={colors.white} size={17}>
              Need some help?
            </Typo>
          </View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(1000).springify()}
            exiting={FadeInUp.duration(1000).springify()}
            className="flex-1 mt-10 bg-white"
            style={styles.content}
          >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="gap-5">
                <View className="gap-1 ">
                  <Typo size={27} color={colors.text} fontWeight={"900"}>
                    Verify Your Email
                  </Typo>
                  <Typo size={14} color={colors.neutral600} fontWeight={"700"}>
                    Please enter the 6-digit code sent to your email.
                  </Typo>
                </View>

                {/* OTP Input */}
                <View>
                  <Input
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    icon={
                      <Icon.EnvelopeSimpleIcon
                        size={verticalScale(24)}
                        color={colors.neutral600}
                      />
                    }
                  />

                  {error ? <Typo color="red">{error}</Typo> : null}
                </View>

                <View className="gap-3 mt-5">
                  <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo size={18} fontWeight={"bold"}>
                      Verify
                    </Typo>
                  </Button>
                </View>

                {/* Resend OTP */}
                <ResendOtpButton onResend={handleResendOtp} />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingX._20,
  },
});

export default VerifyOtp;
