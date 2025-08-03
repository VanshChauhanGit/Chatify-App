import { View, Text } from "react-native";
import React from "react";
import { AvatarProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { Image } from "expo-image";
import { getAvatarPath } from "@/services/imageService";

const Avatar = ({ size = 40, uri, style, isGroup = false }: AvatarProps) => {
  return (
    <View
      style={[
        {
          width: verticalScale(size),
          height: verticalScale(size),
          backgroundColor: colors.neutral200,
        },
        style,
      ]}
      className="overflow-hidden border-2 rounded-full border-neutral300"
    >
      <Image
        source={getAvatarPath(uri, isGroup)}
        style={{ flex: 1 }}
        contentFit="cover"
        transition={100}
      />
    </View>
  );
};

export default Avatar;
