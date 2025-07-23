import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { useEffect } from "react";
import { API_URL } from "@/constants";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { EXPO_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID } from "@/constants";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "821962837558-l7visi2admus17d9oda7o27vn4tmbps2.apps.googleusercontent.com",
    androidClientId:
      "821962837558-2qme03iq91pgpl1avu7g913dfrib6t36.apps.googleusercontent.com",
    webClientId:
      "821962837558-e476d0pq2n2nl68tui5qj8jegr5s496r.apps.googleusercontent.com",
  } as any);

  const router = useRouter();
  const { updateToken } = useAuth();

  //   useEffect(() => {
  //     if (response?.type === "success") {
  //       const { idToken } = response.authentication!;
  //       if (idToken) {
  //         loginToBackend(idToken);
  //       } else {
  //         console.error("No idToken received from Google authentication.");
  //       }
  //     }
  //   }, [response]);

  //   const loginToBackend = async (idToken: string) => {
  //     try {
  //       const res = await axios.post(`${API_URL}/auth/google-login`, {
  //         idToken,
  //       });
  //       console.log("JWT Token:", res.data.token);
  //       // Save token to storage and navigate user to home
  //       await updateToken(res.data.token);
  //       router.replace("/(main)/home");
  //     } catch (error) {
  //       console.error("Login failed", error);
  //     }
  //   };

  return { request, promptAsync };
}
