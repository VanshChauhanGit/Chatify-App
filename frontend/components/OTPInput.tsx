import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

interface OTPInputProps {
  length?: number;
  onFilled?: (otp: string) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onFilled,
  disabled = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, idx: number) => {
    if (!/^\d*$/.test(text)) return;
    const arr = [...otp];
    arr[idx] = text.slice(-1);
    setOtp(arr);
    if (text && idx < length - 1) inputs.current[idx + 1]?.focus();
    if (arr.every((val) => val.length === 1)) {
      Keyboard.dismiss();
      onFilled?.(arr.join(""));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    idx: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center mt-4 mb-7">
      {otp.map((digit, i) => (
        <TextInput
          key={i}
          //   ref={(el) => (inputs.current[i] = el)}
          value={digit}
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          selectTextOnFocus
          className={`w-12 h-14 mx-1 text-center text-2xl font-bold
            rounded-xl border-2
            ${
              digit
                ? "bg-yellow-300 border-yellow-500"
                : "bg-yellow-100 border-yellow-400"
            }
            text-yellow-700 focus:border-yellow-600`}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          placeholder="•"
          placeholderTextColor="#eab308"
        />
      ))}
    </View>
  );
};

export default OTPInput;
