import { View, Text, ImageBackground, StatusBar, Platform } from "react-native";
import React, { useEffect } from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const ScreenWrapper = ({
  style,
  children,
  showPattern = false,
  isModal = false,
  bgOpacity = 1,
}: ScreenWrapperProps) => {
  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: isModal ? colors.white : colors.neutral900,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
      // className="px-4"
      imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
      source={require("@/assets/images/bg_pattern.png")}
    >
      <View style={[{ flex: 1 }, style]}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor={"transparent"}
        />
        {children}
      </View>
    </ImageBackground>
  );
};

export default ScreenWrapper;
