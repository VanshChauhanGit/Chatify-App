import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Touchable,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import * as Icon from "phosphor-react-native";
import MessageItem from "@/components/MessageItem";
import Input from "@/components/Input";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { verticalScale } from "@/utils/styling";
import Loader from "@/components/Loader";

const dummyMessages = [
  {
    id: "msg_1",
    sender: {
      id: "me",
      name: "Me",
      avatar: null,
    },
    content: "Hey, what's the status on the new feature?",
    createdAt: "10:30 AM",
    isMe: true,
  },
  {
    id: "msg_2",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content: "I'm still working on the front-end part. The back-end is done.",
    createdAt: "10:32 AM",
    isMe: false,
  },
  {
    id: "msg_22",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content: "I'm still working on the front-end part. The back-end is done.",
    createdAt: "10:32 AM",
    isMe: false,
  },
  {
    id: "msg_3",
    sender: {
      id: "me",
      name: "Me",
      avatar: null,
    },
    content: "Okay, sounds good. Let me know if you run into any issues.",
    createdAt: "10:33 AM",
    isMe: true,
  },
  {
    id: "msg_4",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content: "Will do. Are you working on the design mockups today?",
    createdAt: "10:35 AM",
    isMe: false,
  },
  {
    id: "msg_5",
    sender: {
      id: "me",
      name: "Me",
      avatar: null,
    },
    content:
      "Yes, I'm thinking about adding message reactions and file sharing.",
    createdAt: "10:41 AM",
    isMe: true,
  },
  {
    id: "msg_6",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content: "That's a great idea! It'll make the app much more interactive.",
    createdAt: "10:42 AM",
    isMe: false,
  },
  {
    id: "msg_7",
    sender: {
      id: "me",
      name: "Me",
      avatar: null,
    },
    content:
      "Exactly. I'll share the preliminary designs with the team later today.",
    createdAt: "10:45 AM",
    isMe: true,
  },
  {
    id: "msg_8",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content:
      "Awesome, I'm looking forward to it. I'll finish up my part and test it.",
    createdAt: "10:46 AM",
    isMe: false,
  },
  {
    id: "msg_9",
    sender: {
      id: "me",
      name: "Me",
      avatar: null,
    },
    content: "Perfect. Let's sync up after lunch.",
    createdAt: "10:48 AM",
    isMe: true,
  },
  {
    id: "msg_10",
    sender: {
      id: "user123",
      name: "Teammate A",
      avatar: null,
    },
    content: "Sounds like a plan!",
    createdAt: "10:49 AM",
    isMe: false,
  },
];

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const {
    id: conversationId,
    name,
    type,
    participants: stringifiedParticipants,
    avatar,
  } = useLocalSearchParams();

  const partcipants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;
  const isDirect = type == "direct";
  const otherParticipant = isDirect
    ? partcipants.find((p: any) => p._id !== currentUser?.id)
    : null;

  if (isDirect && otherParticipant) {
    conversationAvatar = otherParticipant.avatar;
  }
  let conversationName = isDirect ? otherParticipant.name : name;

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onMsgSend = () => {};

  return (
    <ScreenWrapper showPattern bgOpacity={0.4}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* header */}
        <Header
          leftIcon={
            <View className="flex-row items-center gap-3 pl-4">
              <BackButton />
              <Avatar
                uri={conversationAvatar as string}
                size={40}
                isGroup={type == "group"}
              />
              <Typo color={colors.white} size={20} fontWeight={"500"}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity className="pr-4">
              <Icon.DotsThreeOutlineVerticalIcon
                size={24}
                color={colors.white}
                weight="fill"
              />
            </TouchableOpacity>
          }
        />

        {/* messages */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            borderTopLeftRadius: radius._50,
            borderTopRightRadius: radius._50,
            borderCurve: "continuous",
            paddingHorizontal: spacingX._10,
            paddingBottom: spacingX._40,
            marginTop: spacingX._20,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={dummyMessages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
          />

          <View className="pt-1 pb-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
              containerStyle={{ borderRadius: radius._20, overflow: "hidden" }}
              leftIcon={
                <TouchableOpacity onPress={onPickFile}>
                  <Icon.FolderSimplePlusIcon
                    size={verticalScale(35)}
                    color={colors.primaryDark}
                    weight="fill"
                  />

                  {selectedFile && selectedFile.uri && (
                    <Image
                      source={selectedFile.uri}
                      style={{
                        width: verticalScale(35),
                        height: verticalScale(35),
                        position: "absolute",
                        borderRadius: radius.full,
                      }}
                    />
                  )}
                </TouchableOpacity>
              }
              rightIcon={
                loading ? (
                  <Loader size={verticalScale(35)} />
                ) : (
                  <TouchableOpacity onPress={onMsgSend}>
                    <Icon.PaperPlaneTiltIcon
                      size={verticalScale(35)}
                      color={colors.primaryDark}
                      weight="fill"
                    />
                  </TouchableOpacity>
                )
              }
            />

            <View className="absolute right-2 top-3 "></View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;
