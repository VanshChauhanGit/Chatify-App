import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import * as Icon from "phosphor-react-native";
import { useRouter } from "expo-router";

const home = () => {
  const { signOut, user: currentUser } = useAuth();

  const router = useRouter();

  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4">
          <Typo
            color={colors.neutral200}
            size={19}
            textProps={{ numberOfLines: 1 }}
          >
            Welcome,{" "}
            <Typo size={20} fontWeight={"800"} color={colors.white}>
              {currentUser?.name} 👋
            </Typo>
          </Typo>

          <TouchableOpacity
            onPress={() => router.push("/(main)/profileModal")}
            className="p-2 rounded-full bg-neutral-700"
          >
            <Icon.GearSixIcon size={22} color={colors.white} weight="fill" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}></View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingX._20,
    marginTop: spacingX._20,
  },
});

export default home;
