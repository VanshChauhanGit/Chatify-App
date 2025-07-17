import React from "react";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { AuthProvider } from "@/contexts/AuthContext";

SystemUI.setBackgroundColorAsync("transparent"); // or transparent if you want that

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
};

export default RootLayout;
