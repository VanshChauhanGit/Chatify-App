import {
  View,
  Text,
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

const register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please fill all the fields");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(emailRef.current, passwordRef.current);
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
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

                <Input
                  placeholder="Enter your email"
                  icon={
                    <Icon.AtIcon
                      size={verticalScale(24)}
                      color={colors.neutral600}
                    />
                  }
                  onChangeText={(value) => (emailRef.current = value)}
                />
                <Input
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  icon={
                    <Icon.LockIcon
                      size={verticalScale(24)}
                      color={colors.neutral600}
                    />
                  }
                  onChangeText={(value) => (passwordRef.current = value)}
                />

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
