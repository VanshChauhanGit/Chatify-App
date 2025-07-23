import { View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { InputProps } from "@/types";
import { colors } from "@/constants/theme";
import { EyeIcon, EyeSlashIcon } from "phosphor-react-native";

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secure, setSecure] = useState(props.type === "password");

  const toggleSecure = () => setSecure((prev) => !prev);
  const showToggle = props.type === "password";

  return (
    <View
      style={[
        props.containerStyle,
        isFocused && { borderColor: colors.primary },
      ]}
      className="flex-row items-center justify-center gap-2 px-4 py-2 border rounded-full bg-neutral100 border-neutral200"
    >
      {props.icon && props.icon}

      <TextInput
        className="flex-1 text-lg text-text"
        placeholderTextColor={colors.neutral500}
        ref={props.inputRef}
        style={props.inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secure}
        {...props}
      />

      {showToggle && (
        <Pressable onPress={toggleSecure}>
          {secure ? (
            <EyeSlashIcon size={22} color={colors.neutral600} />
          ) : (
            <EyeIcon size={22} color={colors.neutral600} />
          )}
        </Pressable>
      )}
    </View>
  );
};

export default Input;
