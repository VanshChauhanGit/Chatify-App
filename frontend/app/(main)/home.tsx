import { View, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

const home = () => {
  const { signOut, user } = useAuth();
  console.log("USER HOME : ", user);

  return (
    <ScreenWrapper style={{ paddingHorizontal: 15 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl text-primary">Home</Text>
        <Button onPress={async () => await signOut()} style={{ width: "25%" }}>
          <Typo>Logout</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default home;
