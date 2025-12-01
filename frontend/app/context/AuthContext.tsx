import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User, AuthContextType } from "../types/dashboardTypes";
import { useAPICall } from "../hooks/useApiCall";
import { ApiEndPoints } from "../config/Backend";
import Cookies from "js-cookie";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { makeApiCall } = useAPICall();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (expiryTime <= currentTime) {
        Cookies.remove("token");
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
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Cookies.get("token");

        if (token) {
          const res = await makeApiCall(
            "get",
            ApiEndPoints.VALIDATE,
            null,
            "application/json",
            token
          );

          if (res && res.data.user) {
            setUser(res.data.user);
          } else {
            Cookies.remove("token");
            router.push("/");
          }
        }
      } catch (e) {
        console.error(e);
        router.push("/");
      }
    };

    getUserData();
  }, [makeApiCall, router]);

  const login = (UserData: User, token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setUser(UserData);
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
