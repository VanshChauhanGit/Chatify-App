import { login } from "@/services/authService";
import { AuthContextProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useState } from "react";

export const authContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
  };
};
