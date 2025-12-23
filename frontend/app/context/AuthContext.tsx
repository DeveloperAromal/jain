"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { User, AuthContextType } from "../types/dashboardTypes";
import { useAPICall } from "../hooks/useApiCall";
import { ApiEndPoints } from "../config/Backend";
import Cookies from "js-cookie";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { makeApiCall } = useAPICall();
  const router = useRouter();

  // Check token validity and handle expiration
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setLoading(false);
      router.push("/");
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (expiryTime <= currentTime) {
        Cookies.remove("token");
        setLoading(false);
        router.push("/");
        return;
      }

      const timeout = setTimeout(() => {
        Cookies.remove("token");
        setUser(null);
        router.push("/");
      }, expiryTime - currentTime);

      return () => clearTimeout(timeout);
    } catch (e) {
      console.error("Invalid token", e);
      Cookies.remove("token");
      setLoading(false);
      router.push("/");
    }
  }, [router]);

  // Fetch user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await makeApiCall(
          "get",
          ApiEndPoints.VALIDATE,
          null,
          "application/json",
          token
        );

        if (res?.data?.user) {
          setUser(res.data.user);
        } else {
          Cookies.remove("token");
          router.push("/");
        }
      } catch (e) {
        console.error(e);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [makeApiCall, router]);

  // Login method
  const login = (UserData: User, token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setUser(UserData);
  };

  // Logout method
  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
