import { View, Text } from "react-native";
import React from "react";
import { MessageProps } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "./Avatar";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import moment from "moment";

const MessageItem = ({
  item,
  isDirect,
}: {
  item: MessageProps;
  isDirect: boolean;
}) => {
  const { user: currentUser } = useAuth();

  const isMe = currentUser?.id === item.sender.id;

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm A")
    : moment(item.createdAt).format("MMM D, h:mm A");

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
          {formattedDate}
        </Typo>
      </View>
    </View>
  );
};

export default MessageItem;
