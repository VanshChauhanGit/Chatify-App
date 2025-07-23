import { TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GoogleLoginButton = () => {
  const handleSubmit = async () => {
    GoogleSignin.configure({
      webClientId:
        "821962837558-e476d0pq2n2nl68tui5qj8jegr5s496r.apps.googleusercontent.com",
      iosClientId:
        "821962837558-l7visi2admus17d9oda7o27vn4tmbps2.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  };

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
