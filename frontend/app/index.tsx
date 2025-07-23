import "../global.css";
import { View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import ScreenWrapper from "@/components/ScreenWrapper";

const SplashScreen = () => {
  return (
    <ScreenWrapper showPattern bgOpacity={0.2}>
      <View className="items-center justify-center flex-1 ">
        <StatusBar barStyle="light-content" backgroundColor={"transparent"} />
        <Animated.Image
          source={require("@/assets/images/splashImage.png")}
          entering={FadeInDown.duration(700).springify()}
          style={{ height: "23%", aspectRatio: 1 }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SplashScreen;
