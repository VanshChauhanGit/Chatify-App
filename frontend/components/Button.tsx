import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { ButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
  ...props
}: ButtonProps) => {
  if (loading) {
    return (
      <View
        style={[{ height: verticalScale(50), width: "100%" }]}
        className="items-center justify-center bg-transparent rounded-full"
      >
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ height: verticalScale(50), width: "100%" }, style]}
      className={`flex-row items-center justify-center rounded-full bg-primary ${props.disabled && "opacity-50"}`}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
