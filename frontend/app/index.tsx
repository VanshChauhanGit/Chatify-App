import "../global.css";
import { View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
  }, []);

  return (
    <View className="items-center justify-center flex-1 bg-neutral900">
      <StatusBar barStyle="light-content" backgroundColor={"transparent"} />
      <Animated.Image
        source={require("@/assets/images/splashImage.png")}
        entering={FadeInDown.duration(700).springify()}
        style={{ height: "23%", aspectRatio: 1 }}
      />
    </View>
  );
};

export default SplashScreen;
