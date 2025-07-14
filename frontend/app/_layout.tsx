import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import * as SystemUI from "expo-system-ui";
import { colors } from "@/constants/theme";

SystemUI.setBackgroundColorAsync("transparent"); // or transparent if you want that

const _layout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
