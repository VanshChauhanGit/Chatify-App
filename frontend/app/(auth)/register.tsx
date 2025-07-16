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

const register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      setIsLoading(false);
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern bgOpacity={0.5}>
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-4">
            <BackButton />
            <Typo color={colors.white} size={17}>
              Need some help ?
            </Typo>
          </View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(1000).springify()}
            exiting={FadeInUp.duration(1000).springify()}
            className="flex-1 bg-white mt-10"
            style={styles.content}
          >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="gap-5">
                <View className="gap-1 ">
                  <Typo size={27} color={colors.text} fontWeight={"900"}>
                    Getting Started
                  </Typo>
                  <Typo size={17} color={colors.neutral600} fontWeight={"700"}>
                    Create a new account to continue
                  </Typo>
                </View>

                <Input
                  placeholder="Enter your name"
                  icon={
                    <Icon.UserIcon
                      size={verticalScale(24)}
                      color={colors.neutral600}
                    />
                  }
                  onChangeText={(value) => (nameRef.current = value)}
                />
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

                <View className="mt-5 gap-3">
                  <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo size={18} fontWeight={"bold"}>
                      Sign Up
                    </Typo>
                  </Button>

                  <View className="flex-row justify-center align-center gap-2">
                    <Typo>Already have an account ?</Typo>
                    <Pressable onPress={() => router.push("/(auth)/login")}>
                      <Typo color={colors.primaryDark}>Login</Typo>
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
