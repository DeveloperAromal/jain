"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import Cookies from "js-cookie";

interface AuthResponse {
  token: string;
}

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { makeApiCall } = useAPICall();

  const canSubmit =
    email.includes("@") &&
    password.length >= 6 &&
    (isLogin || phone.length >= 10) &&
    !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await makeApiCall(
        "POST",
        ApiEndPoints.LOGIN_USER,
        { email, password },
        "application/json"
      );

      const token = (res?.data as AuthResponse)?.token;

      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        router.push("/learn/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await makeApiCall(
        "POST",
        ApiEndPoints.REGISTER_USER,
        { email, phone, password },
        "application/json"
      );

      const token = (res?.data as AuthResponse)?.token;

      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        router.push("/learn/dashboard");
      }
    } catch (err) {
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-border transition-all">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-center text-foreground">
        {isLogin ? "Welcome Back 👋" : "Create Your Account"}
      </h1>

      <p className="text-center text-sm text-text-secondary mt-1">
        {isLogin
          ? "Login to continue your learning journey"
          : "Join Numora and unlock premium learning experience"}
      </p>

      <div className="mt-8 space-y-5">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            placeholder="eg: user@gmail.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone (Signup only) */}
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          disabled={!canSubmit}
          onClick={isLogin ? handleLogin : handleSignup}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
            canSubmit
              ? "bg-primary hover:bg-primary-hover shadow-sm"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>
      </div>

      {/* Toggle Link */}
      <p className="text-center text-sm mt-6 text-foreground">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span
              className="text-primary font-semibold cursor-pointer hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Signup
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-primary font-semibold cursor-pointer hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Login
            </span>
          </>
        )}
      </p>
    </div>
  );
}
