import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import * as Icon from "phosphor-react-native";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loader from "@/components/Loader";

const conversations = [
  {
    name: "Alice",
    type: "direct",
    lastMessage: {
      senderName: "Alice",
      content: "Hey! Are we still on for tonight?",
      createdAt: "2025-06-22T18:45:00Z",
    },
  },
  {
    name: "Project Team",
    type: "group",
    lastMessage: {
      senderName: "Sarah",
      content: "Meeting rescheduled to 3pm tomorrow and will be online.",
      createdAt: "2025-06-21T14:10:00Z",
    },
  },
  {
    name: "John",
    type: "direct",
    lastMessage: {
      senderName: "John",
      content: "I'll send the files by EOD.",
      createdAt: "2025-06-28T12:30:00Z",
    },
  },
  {
    name: "Family Chat",
    type: "group",
    lastMessage: {
      senderName: "Mom",
      content: "Dinner at 8pm tonight?",
      createdAt: "2025-06-27T19:20:00Z",
    },
  },
  {
    name: "Emily",
    type: "direct",
    lastMessage: {
      senderName: "Emily",
      content: "Happy Birthday!",
      createdAt: "2025-06-20T09:10:00Z",
    },
  },
  {
    name: "Developers",
    type: "group",
    lastMessage: {
      senderName: "Raj",
      content: "Feature branch merged.",
      createdAt: "2025-06-26T16:05:00Z",
    },
  },
  {
    name: "Support",
    type: "direct",
    lastMessage: {
      senderName: "Agent",
      content: "Your ticket has been resolved.",
      createdAt: "2025-06-25T10:44:00Z",
    },
  },
  {
    name: "Book Club",
    type: "group",
    lastMessage: {
      senderName: "Tom",
      content: "Next book suggestion?",
      createdAt: "2025-06-24T15:11:00Z",
    },
  },
  {
    name: "Linda",
    type: "direct",
    lastMessage: {
      senderName: "Linda",
      content: "Can you review my document?",
      createdAt: "2025-06-23T08:30:00Z",
    },
  },
  {
    name: "Marketing Team",
    type: "group",
    lastMessage: {
      senderName: "Priya",
      content: "Campaign draft is ready for feedback.",
      createdAt: "2025-06-22T11:00:00Z",
    },
  },
];

const home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const router = useRouter();

  let directConversations = conversations
    .filter((item: any) => item.type === "direct")
    .sort((a: any, b: any) => {
      let aDate = new Date(a?.lastMessage?.createdAt || a.createdAt);
      let bDate = new Date(b?.lastMessage?.createdAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  let groupConversations = conversations
    .filter((item: any) => item.type === "group")
    .sort((a: any, b: any) => {
      let aDate = new Date(a?.lastMessage?.createdAt || a.createdAt);
      let bDate = new Date(b?.lastMessage?.createdAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  return (
    <ScreenWrapper showPattern bgOpacity={0.5}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4">
          <Typo
            color={colors.neutral200}
            size={19}
            textProps={{ numberOfLines: 1 }}
          >
            Welcome,{" "}
            <Typo size={20} fontWeight={"800"} color={colors.white}>
              {currentUser?.name} 👋
            </Typo>
          </Typo>

          <TouchableOpacity
            onPress={() => router.push("/(main)/profileModal")}
            className="p-2 rounded-full bg-neutral-700"
          >
            <Icon.GearSixIcon size={22} color={colors.white} weight="fill" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._10 }}
          >
            <View className="flex flex-row items-center px-5">
              <View className="flex-row flex-1 items-center justify-center gap-2 ">
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  className={`bg-neutral100 py-3 px-5 rounded-full ${selectedTab === 0 && "bg-primaryLight"}`}
                >
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  className={`bg-neutral100 py-3 px-5 rounded-full ${selectedTab === 1 && "bg-primaryLight"}`}
                >
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>

            {/* Conversation List */}
            <View className="py-5">
              {selectedTab === 0 &&
                directConversations.map((item: any, index) => {
                  return (
                    <ConversationItem
                      key={index}
                      item={item}
                      router={router}
                      showDivider={directConversations.length != index + 1}
                    />
                  );
                })}
              {selectedTab === 1 &&
                groupConversations.map((item: any, index) => {
                  return (
                    <ConversationItem
                      key={index}
                      item={item}
                      router={router}
                      showDivider={groupConversations.length != index + 1}
                    />
                  );
                })}

              {!loading &&
                selectedTab === 0 &&
                directConversations.length === 0 && (
                  <Typo
                    size={20}
                    fontWeight={"700"}
                    color={colors.neutral500}
                    style={{ textAlign: "center" }}
                  >
                    You don't have any messages!
                  </Typo>
                )}

              {!loading &&
                selectedTab === 1 &&
                groupConversations.length === 0 && (
                  <Typo
                    size={20}
                    fontWeight={"700"}
                    color={colors.neutral500}
                    style={{ textAlign: "center" }}
                  >
                    You haven't joined any groups yet!
                  </Typo>
                )}

              {loading && <Loader size={50} />}
            </View>
          </ScrollView>
        </View>
      </View>

      <Button
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModal",
            params: { isGroup: selectedTab },
          })
        }
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          height: 50,
          width: 50,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Icon.PlusIcon size={24} color={colors.black} weight="bold" />
      </Button>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingX._10,
    marginTop: spacingX._20,
  },
});

export default home;
