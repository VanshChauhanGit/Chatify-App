import { TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import Typo from "./Typo";
import { colors } from "@/constants/theme";

const GoogleLoginButton = () => {
  return (
    <TouchableOpacity
      // onPress={}
      className="flex-row items-center self-center justify-center w-full h-16 gap-2 rounded-full"
      style={{ backgroundColor: colors.neutral200 }}
    >
      <Typo fontWeight={"bold"} size={20} color={colors.neutral700}>
        Continue with
      </Typo>
      <Image
        source={require("@/assets/images/google2.png")}
        style={{ width: 75, height: "100%" }}
        resizeMode="contain"
        className="mt-1"
      />
    </TouchableOpacity>
  );
};

export default GoogleLoginButton;
