import React from "react";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { AuthProvider } from "@/contexts/AuthContext";

SystemUI.setBackgroundColorAsync("transparent"); // or transparent if you want that

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(main)/home" />
        <Stack.Screen
          name="(main)/profileModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(main)/newConversationModal"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
