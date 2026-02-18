import api from "../config/api";
import { type User } from "../types/userType";
import Loading from "../components/shared/Loading";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user on mount
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const res = await api.get("/auth-status");

      return res.data.user as User | null;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (error) {
      setUser(null);
    }
  }, [data, error]);

  if (isLoading) {
    return <Loading loadingText="Loading User..." />;
  }

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export const useUser = () => {
  const { user } = useAuth();

  return user;
};
