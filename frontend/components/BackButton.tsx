import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const BackButton = ({
  color = colors.white,
  iconSize = 24,
  style,
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="items-center justify-center"
    >
      <CaretLeft
        color={color}
        size={verticalScale(iconSize)}
        style={style}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;
