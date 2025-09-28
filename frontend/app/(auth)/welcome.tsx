import { View, Text, StatusBar } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Animated, { FadeIn } from "react-native-reanimated";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <StatusBar barStyle="light-content" backgroundColor={"transparent"} />
      <View className="items-center flex-1 justify-evenly">
        <Typo color={colors.white} size={43} fontWeight={"900"}>
          Chatify
        </Typo>

        <Animated.Image
          source={require("@/assets/images/welcome.png")}
          entering={FadeIn.duration(700).springify()}
          style={{ aspectRatio: 1, height: verticalScale(300) }}
        ></Animated.Image>

        <View>
          <Typo
            color={colors.white}
            size={33}
            fontWeight={"800"}
            style={{ textAlign: "center" }}
          >
            Stay Connected
          </Typo>
          <Typo
            color={colors.white}
            size={33}
            fontWeight={"800"}
            style={{ textAlign: "center" }}
          >
            with your family
          </Typo>
          <Typo
            color={colors.white}
            size={33}
            fontWeight={"800"}
            style={{ textAlign: "center" }}
          >
            and friends
          </Typo>
        </View>

        <Button
          onPress={() => router.push("/(auth)/register")}
          style={{ width: "80%" }}
        >
          <Typo color={colors.text} size={20} fontWeight={"bold"}>
            Get Started
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
