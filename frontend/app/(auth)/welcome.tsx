import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

const Welcome = () => {
  return (
    <ScreenWrapper showPattern>
      <Text className="text-3xl text-primaryLight">Welcome</Text>
    </ScreenWrapper>
  );
};

export default Welcome;
