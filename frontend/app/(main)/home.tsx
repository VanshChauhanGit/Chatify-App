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
import {
  getConversations,
  newConversation,
  newMessage,
} from "@/socket/socketEvents";
import { ConversationProps, ResponseProps } from "@/types";

const home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  const router = useRouter();

  let directConversations = conversations
    .filter((item: ConversationProps) => item.type === "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      let aDate = new Date(a?.lastMessage?.createdAt || a.createdAt);
      let bDate = new Date(b?.lastMessage?.createdAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  let groupConversations = conversations
    .filter((item: ConversationProps) => item.type === "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      let aDate = new Date(a?.lastMessage?.createdAt || a.createdAt);
      let bDate = new Date(b?.lastMessage?.createdAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  useEffect(() => {
    setLoading(true);
    getConversations(processConversations);
    newConversation(newConversationHandler);
    newMessage(newMessageHandler);
    getConversations(null);

    return () => {
      getConversations(processConversations, true);
      getConversations(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    };
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);
    if (res.success) {
      let conversationId = res.data.conversationId;

      setConversations((prev) => {
        let updatedConversations = prev.map((item) => {
          if (item._id === conversationId) {
            item.lastMessage = res.data;
          }
          return item;
        });

        return updatedConversations;
      });
    }
  };

  const processConversations = (res: ResponseProps) => {
    setLoading(false);
    if (res.success) {
      setConversations(res?.data);
    }
  };

  const newConversationHandler = (res: ResponseProps) => {
    setLoading(false);
    if (res.success && res.data.isNew) {
      setConversations((prev) => [...prev, res?.data]);
    }
  };

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
              <View className="flex-row items-center justify-center flex-1 gap-2 ">
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
                directConversations.map((item: ConversationProps, index) => {
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
                groupConversations.map((item: ConversationProps, index) => {
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
