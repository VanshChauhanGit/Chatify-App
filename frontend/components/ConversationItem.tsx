import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import Typo from "./Typo";
import moment from "moment";
import { colors } from "@/constants/theme";
import { ConversationListItemProps } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const ConversationItem = ({
  item,
  showDivider,
  router,
}: ConversationListItemProps) => {
  const lastMessage: any = item?.lastMessage;
  const isDirect = item.type === "direct";
  const { user: currentUser } = useAuth();
  let avatar = item.avatar;
  const otherParticipant = isDirect
    ? item.participants.find((p) => p._id !== currentUser?.id)
    : null;

  if (isDirect && otherParticipant) {
    avatar = otherParticipant?.avatar;
  }

  const getLastMessageDate = () => {
    if (!lastMessage.createdAt) return null;

    const messageDate = moment(lastMessage.createdAt);

    const today = moment();

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("hh:mm A");
    }
    if (messageDate.isSame(today, "year")) {
      return messageDate.format("MMM DD");
    }
    return messageDate.format("MMM DD, YYYY");
  };

  const getLastMessageContent = () => {
    if (!lastMessage) return "Say, Hii👋";

    return lastMessage?.attachment ? "Attachment" : lastMessage?.content;
  };

  const openConversation = () => {};
  return (
    <View>
      <TouchableOpacity
        onPress={openConversation}
        className="flex-row items-center gap-2 py-3"
      >
        <View>
          <Avatar uri={avatar} size={48} isGroup={item.type === "group"} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Typo size={18} fontWeight={"600"}>
              {isDirect ? otherParticipant?.name : item?.name}
            </Typo>
            {item.lastMessage && <Typo size={14}>{getLastMessageDate()}</Typo>}
          </View>

          <Typo
            size={14}
            color={colors.neutral600}
            textProps={{ numberOfLines: 1 }}
          >
            {getLastMessageContent()}
          </Typo>
        </View>
      </TouchableOpacity>

      {showDivider && <View className="h-[1px] bg-gray-200" />}
    </View>
  );
};

export default ConversationItem;
