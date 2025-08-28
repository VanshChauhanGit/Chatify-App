import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

const contacts = [
  {
    id: "1",
    name: "Liam Carter",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "2",
    name: "Emma Davis",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    name: "Noah Smith",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "4",
    name: "Olivia Lee",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: "5",
    name: "Mason Taylor",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: "6",
    name: "Sophia King",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
  {
    id: "7",
    name: "Benjamin Clark",
    avatar: "https://i.pravatar.cc/150?img=17",
  },
  {
    id: "8",
    name: "Ava Moore",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
  {
    id: "9",
    name: "Logan Walker",
    avatar: "https://i.pravatar.cc/150?img=19",
  },
  {
    id: "10",
    name: "Charlotte Harris",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
];

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isGroupMode = isGroup === "1";
  const router = useRouter();

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
      // todo
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

  const createGroup = () => {};

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
                  icon={
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
                  <Typo fontWeight={"600"}>{user.name}</Typo>

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
            <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-neutral200 pb-12">
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
