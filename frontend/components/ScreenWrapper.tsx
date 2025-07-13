import { View, Text, ImageBackground, StatusBar } from "react-native";
import React from "react";
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
      }}
      imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
      source={require("@/assets/images/bgPattern.png")}
    >
      <View style={[{ flex: 1 }, style]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.neutral900}
        />
        {children}
      </View>
    </ImageBackground>
  );
};

export default ScreenWrapper;
