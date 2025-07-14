import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";

const register = () => {
  return (
    <ScreenWrapper>
      <Typo color={colors.white} size={24}>
        Register
      </Typo>
    </ScreenWrapper>
  );
};

export default register;
