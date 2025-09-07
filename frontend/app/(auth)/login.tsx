import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import * as Icon from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "@/contexts/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value.trim()) return "Email is required!";
  if (!emailRegex.test(value)) return "Email is invalid!";
  return "";
};

const validatePassword = (value: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!value) return "Password is required!";
  if (!passwordRegex.test(value))
    return "Min 8 characters, must include uppercase, lowercase, and number!";
  return "";
};

const register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const { signIn } = useAuth();

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (field === "password") {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    try {
      setIsLoading(true);
      const response = await signIn(email, password);

      if (!response.success) {
        Alert.alert("Sign In", response.msg);
        return;
      }
      router.replace("/(main)/home");
    } catch (error: any) {
      Alert.alert("Sign In", error.message);
    } finally {
      setIsLoading(false);
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
              Forgot Password ?
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
                    Welcome Back
                  </Typo>
                  <Typo size={17} color={colors.neutral600} fontWeight={"700"}>
                    We are happy to see you
                  </Typo>
                </View>

                <View>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    editable={!isLoading}
                    onChangeText={(value) => handleChange("email", value)}
                    leftIcon={
                      <Icon.AtIcon
                        size={verticalScale(24)}
                        color={colors.neutral600}
                      />
                    }
                  />
                  {errors.email ? (
                    <Typo size={12} color="red">
                      {errors.email}
                    </Typo>
                  ) : null}
                </View>
                <View>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    editable={!isLoading}
                    onChangeText={(value) => handleChange("password", value)}
                    leftIcon={
                      <Icon.LockIcon
                        size={verticalScale(24)}
                        color={colors.neutral600}
                      />
                    }
                  />
                  {errors.password ? (
                    <Typo size={12} color="red">
                      {errors.password}
                    </Typo>
                  ) : null}
                </View>

                <View className="gap-3 mt-5">
                  <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo size={18} fontWeight={"bold"}>
                      Login
                    </Typo>
                  </Button>

                  <View className="flex-row justify-center gap-2 align-center">
                    <Typo>Don't have an account ?</Typo>
                    <Pressable onPress={() => router.push("/(auth)/register")}>
                      <Typo color={colors.primaryDark}>Sign Up</Typo>
                    </Pressable>
                  </View>
                </View>

                {/* <Typo
                  color={colors.neutral600}
                  size={17}
                  fontWeight={"bold"}
                  style={{ textAlign: "center" }}
                >
                  OR
                </Typo> */}

                {/* <GoogleLoginButton /> */}
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

export default register;
