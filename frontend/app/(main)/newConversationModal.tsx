import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import * as Icon from "phosphor-react-native";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { getContacts, newConversation } from "@/socket/socketEvents";
import { uploadFileToCloudinary } from "@/services/imageService";

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isGroupMode = isGroup === "1";
  const router = useRouter();

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation);
    getContacts(null);

    return () => {
      getContacts(processGetContacts, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    if (res.success) {
      setContacts(res.data);
    }
  };
  const processNewConversation = (res: any) => {
    // console.log("processNewConversation :: ", res);
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: "/(main)/conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          type: res.data.type,
          avatar: res.data.avatar,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      console.log("Error at fectching/creating conversation: ", res.msg);
      Alert.alert("Error", res.msg);
    }
  };

  const toggleParticipant = (user: any) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(user.id)) {
        return prev.filter((id) => id !== user.id);
      }
      return [...prev, user.id];
    });
  };

  const onSelectUser = (user: any) => {
    if (!user) {
      Alert.alert("Authentication", "Please login to continue!");
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    } else {
      // start new conversation
      newConversation({
        type: "direct",
        participants: [currentUser?.id, user.id],
      });
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser || selectedParticipants.length < 2) {
      return;
    }

    setIsLoading(true);

    try {
      let avatar = null;

      if (groupAvatar) {
        const res = await uploadFileToCloudinary(groupAvatar, "group-avatars");
        if (res.success) {
          avatar = res.data;
        }
      }

      newConversation({
        type: "group",
        participants: [...selectedParticipants, currentUser.id],
        name: groupName,
        avatar,
      });
    } catch (error) {
      console.log("Error at creating group: ", error);
      Alert.alert("Error", (error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper isModal>
        <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
        <View className="flex-1 px-4">
          <Header
            title={isGroupMode ? "Create Group" : "Select User"}
            leftIcon={<BackButton color={colors.black} />}
            style={{ marginVertical: 10 }}
          />

          {isGroupMode && (
            <View className="items-center mt-4">
              <View className="mb-5">
                <TouchableOpacity onPress={onPickImage}>
                  <Avatar uri={groupAvatar?.uri || null} size={150} isGroup />
                </TouchableOpacity>
              </View>

              <View className="w-full mb-2">
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChangeText={setGroupName}
                  leftIcon={
                    <Icon.PencilSimpleIcon
                      size={24}
                      weight="bold"
                      color={colors.neutral400}
                    />
                  }
                />
              </View>
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2 mt-2 pb-36"
          >
            {contacts.map((user: any, index) => {
              const isSelected = selectedParticipants.includes(user.id);
              return (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center gap-2 px-2 py-2 ${isSelected && "bg-neutral100 rounded-lg"}`}
                  onPress={() => onSelectUser(user)}
                >
                  <Avatar uri={user.avatar} size={50} />
                  <View>
                    <Typo fontWeight={"600"}>{user.name}</Typo>
                    <Typo color={colors.neutral400} size={12}>
                      {user.username}
                    </Typo>
                  </View>

                  {isGroupMode && (
                    <View className="ml-auto">
                      <View
                        className={`size-8 rounded-full border border-primary ${isSelected && "bg-primary"} flex items-center justify-center`}
                      >
                        {isSelected ? (
                          <Icon.CheckIcon
                            size={20}
                            weight="bold"
                            color={isSelected ? colors.white : colors.primary}
                          />
                        ) : (
                          <Icon.PlusIcon
                            size={20}
                            weight="bold"
                            color={isSelected ? colors.white : colors.primary}
                          />
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {isGroupMode && (
            <View className="absolute bottom-0 left-0 right-0 p-4 pb-12 bg-white border-t border-neutral200">
              <Button
                loading={isLoading}
                onPress={createGroup}
                disabled={!groupName.trim() || selectedParticipants.length < 2}
              >
                <Typo color={colors.black} size={18} fontWeight={"bold"}>
                  Create Group
                </Typo>
              </Button>
            </View>
          )}
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default NewConversationModal;
