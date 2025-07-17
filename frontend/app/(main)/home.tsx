import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";

const home = () => {
  return (
    <ScreenWrapper>
      <Text className="text-2xl text-primary">Home</Text>
    </ScreenWrapper>
  );
};

export default home;
