import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { InputProps } from "@/types";
import { colors } from "@/constants/theme";

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      style={[
        props.containerStyle && props.containerStyle,
        isFocused && { borderColor: colors.primary },
      ]}
      className="flex-row bg-neutral100 items-center justify-center px-4 py-2 border border-neutral200 rounded-full gap-2"
    >
      {props.icon && props.icon}
      <TextInput
        className="flex-1 text-text text-lg"
        placeholderTextColor={colors.neutral500}
        ref={props.inputRef && props.inputRef}
        style={[props.inputStyle && props.inputStyle]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default Input;
