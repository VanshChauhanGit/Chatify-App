import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { testSocket } from "@/socket/socketEvents";

const home = () => {
  const { signOut, user } = useAuth();
  console.log("USER HOME : ", user);

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return () => {
  //     testSocket(testSocketCallbackHandler, true);
  //   };
  // }, []);

  // const testSocketCallbackHandler = (data: any) => {
  //   console.log("Got response from testSocket event : ", data);
  // };

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
