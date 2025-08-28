import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";

const Header = ({ style, leftIcon, rightIcon, title }: HeaderProps) => {
  return (
    <View style={[style]} className="flex-row items-center justify-between">
      {leftIcon && <View>{leftIcon}</View>}

      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{ textAlign: "center", flex: 1 }}
        >
          {title}
        </Typo>
      )}

      {rightIcon && <View>{rightIcon}</View>}
    </View>
  );
};

export default Header;
