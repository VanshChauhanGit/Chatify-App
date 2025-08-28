import {
  View,
  Text,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icon from "phosphor-react-native";
import Avatar from "@/components/Avatar";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { UserDataProps } from "@/types";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { updateProfile } from "@/socket/socketEvents";
import * as ImagePicker from "expo-image-picker";
import { uploadFileToCloudinary } from "@/services/imageService";

const ProfileModal = () => {
  const { user, signOut, updateToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    avatar: "",
  });
  const [initialData, setInitialData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });
  const [userData, setUserData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });

  const router = useRouter();

  const handleLogout = async () => {
    router.back();
    await signOut();
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Confirm Logout!",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => handleLogout(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    let { name, avatar } = userData;

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Please enter your name!" }));
      return;
    }

    let data = {
      name,
      avatar,
    };

    if (avatar && avatar?.uri) {
      setLoading(true);
      const res = await uploadFileToCloudinary(avatar, "profiles");
      if (res.success) {
        data.avatar = res.data;
      } else {
        Alert.alert("User", res.msg);
        setLoading(false);
        return;
      }
    }

    updateProfile(data);
  };

  const processUpdateProfile = (res: any) => {
    setLoading(false);

    if (res.success) {
      router.back();
      updateToken(res.data.token);
    } else {
      Alert.alert("User", res.msg);
    }
  };

  useEffect(() => {
    updateProfile(processUpdateProfile);

    return () => {
      updateProfile(processUpdateProfile, true);
    };
  }, []);

  const isDataChanged = () => {
    return (
      userData.name.trim() !== initialData.name.trim() ||
      userData.avatar !== initialData.avatar
    );
  };

  useEffect(() => {
    if (!user) return;

    const data = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || null,
    };
    setUserData(data);
    setInitialData(data);
  }, [user?.name, user?.email, user?.avatar]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ ...userData, avatar: result.assets[0] });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper isModal>
        <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
        <View className="justify-between flex-1 px-4">
          <View className="flex-row items-center justify-between">
            <Header
              title={"Update Profile"}
              leftIcon={
                Platform.OS == "android" && <BackButton color={colors.black} />
              }
              style={{ marginVertical: 10, flex: 1 }}
            />
            <TouchableOpacity onPress={showLogoutAlert} disabled={loading}>
              <Icon.SignOutIcon size={24} weight="bold" color={colors.rose} />
            </TouchableOpacity>
          </View>

          {/* Form */}

          <ScrollView
            contentContainerStyle={{
              gap: spacingY._30,
              marginTop: spacingY._15,
              flex: 1,
            }}
          >
            <View className="self-center">
              <Avatar size={180} uri={userData.avatar} />
              <TouchableOpacity
                onPress={onPickImage}
                className="absolute p-2 rounded-full shadow-lg right-2 bottom-2 bg-neutral100 shadow-black"
              >
                <Icon.CameraIcon
                  size={24}
                  weight="bold"
                  color={colors.neutral700}
                />
              </TouchableOpacity>
            </View>

            <View className="gap-5">
              {/* Email */}
              <View className="gap-2">
                <Typo style={{ paddingLeft: spacingX._10 }} size={20}>
                  Email
                </Typo>
                <Input
                  value={userData.email}
                  containerStyle={{
                    borderColor: colors.neutral350,
                    backgroundColor: colors.neutral300,
                    paddingLeft: spacingX._20,
                  }}
                  inputStyle={{ color: colors.neutral700, fontWeight: "bold" }}
                  editable={false}
                  icon={<Icon.AtIcon size={22} weight="bold" />}
                />
              </View>
              {/* Name */}
              <View className="gap-2">
                <Typo style={{ paddingLeft: spacingX._10 }} size={20}>
                  Name
                </Typo>
                <Input
                  value={userData.name}
                  onChangeText={(value) =>
                    setUserData({ ...userData, name: value })
                  }
                  containerStyle={{
                    borderColor: colors.neutral350,
                    backgroundColor: colors.neutral200,
                    paddingLeft: spacingX._20,
                  }}
                  inputStyle={{
                    color: colors.neutral700,
                    fontWeight: "semibold",
                  }}
                  icon={<Icon.UserIcon size={22} weight="bold" />}
                />
                {errors.name && (
                  <Typo size={14} color={colors.rose}>
                    {errors.name}
                  </Typo>
                )}
              </View>

              <Button
                onPress={handleSubmit}
                loading={loading}
                disabled={!isDataChanged()}
                style={{ marginTop: spacingY._15 }}
              >
                <Typo fontWeight={"600"} size={verticalScale(18)}>
                  Update
                </Typo>
              </Button>
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default ProfileModal;
