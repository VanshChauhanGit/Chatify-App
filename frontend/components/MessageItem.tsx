import { View, Text } from "react-native";
import React from "react";
import { MessageProps } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "./Avatar";
import Typo from "./Typo";
import { colors } from "@/constants/theme";

const MessageItem = ({
  item,
  isDirect,
}: {
  item: MessageProps;
  isDirect: boolean;
}) => {
  const { user: currentUser } = useAuth();

  const isMe = item.isMe;

  return (
    <View
      className={`flex-row max-w-[80%] gap-2 my-2 ${isMe ? "self-end" : "self-start"}`}
    >
      {!isMe && !isDirect && <Avatar size={30} uri={null} />}

      <View
        className={`p-2 rounded-xl gap-1 ${isMe ? "bg-myBubble" : "bg-otherBubble"}`}
      >
        {!isMe && !isDirect && (
          <Typo color={colors.neutral900} fontWeight={"600"} size={14}>
            {item.sender.name}
          </Typo>
        )}
        {item.content && <Typo size={16}>{item.content}</Typo>}
        <Typo
          style={{ alignSelf: "flex-end" }}
          size={12}
          fontWeight={"500"}
          color={colors.neutral600}
        >
          {item.createdAt}
        </Typo>
      </View>
    </View>
  );
};

export default MessageItem;
