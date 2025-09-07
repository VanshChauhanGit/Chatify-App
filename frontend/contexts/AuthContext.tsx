import { login, register, verifyEmailOTP } from "@/services/authService";
import {
  AuthContextProps,
  DecodedTokenProps,
  ResponseProps,
  UserProps,
} from "@/types";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { Alert } from "react-native";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {
    return { success: false, msg: "Not implemented" };
  },
  signUp: async () => {
    return { success: false, msg: "Not implemented" };
  },
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(storedToken);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          await AsyncStorage.removeItem("token");
          //go to welcome page
          goToWelcomePage();
          return;
        }
        // token is valid and user is logged in
        setToken(storedToken);
        await connectSocket();
        setUser(decoded.user);

        // go to home page
        goToHomePage();
      } catch (error) {
        // go to welcome page
        goToWelcomePage();
        console.log("Failed to decode token: ", error);
      }
    } else {
      // go to welcome page
      goToWelcomePage();
    }
  };

  const goToWelcomePage = () => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
  };

  const goToHomePage = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);
      // decode token (user)
      const decoded = jwtDecode<DecodedTokenProps>(token);
      setUser(decoded.user);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<ResponseProps> => {
    try {
      const response = await login(email, password);

      if (response?.data?.isEmailVerified === false) {
        router.replace({
          pathname: "/(auth)/verifyOtp",
          params: { email },
        });
        return response;
      }

      if (!response?.success) {
        return response;
      }

      await updateToken(response.token);
      await connectSocket();
      router.replace("/(main)/home");

      return { success: true };
    } catch (error: any) {
      console.error("SignIn error:", error?.message);
      return {
        success: false,
        msg: error?.response?.data?.msg || "Login failed. Please try again.",
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    avatar?: string
  ): Promise<ResponseProps> => {
    try {
      const response = await register(name, email, password, avatar);

      if (!response?.success) {
        return response;
      }

      router.replace({
        pathname: "/(auth)/verifyOtp",
        params: { email },
      });

      return { success: true };
    } catch (error: any) {
      console.error("SignUp error:", error?.message);
      return {
        success: false,
        msg: error?.response?.data?.msg || "Something went wrong. Try again.",
      };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
    disconnectSocket();
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
