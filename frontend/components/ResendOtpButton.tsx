import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { colors } from "@/constants/theme";

const ResendOtpButton = ({ onResend }: { onResend: () => void }) => {
  const [timer, setTimer] = useState(90);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isDisabled]);

  const handleResend = () => {
    onResend();
    setTimer(90);
    setIsDisabled(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <TouchableOpacity onPress={handleResend} disabled={isDisabled}>
      <Text
        style={{
          color: isDisabled ? "gray" : colors.primaryDark,
          textAlign: "center",
          fontWeight: "900",
          fontSize: 16,
        }}
      >
        {isDisabled ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
      </Text>
    </TouchableOpacity>
  );
};

export default ResendOtpButton;
