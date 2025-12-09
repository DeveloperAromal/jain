"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";

interface AuthResponse {
  token: string;
}

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPassSame, setIsPassSame] = useState(true);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { makeApiCall } = useAPICall();

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setIsPassSame(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const canSubmit =
    email.includes("@") &&
    password.length >= 6 &&
    (isLogin ||
      (phone.length >= 10 && name.length >= 2 && studentClass.trim() !== "")) &&
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
        {
          email,
          password,
          phone,
          name,
          student_class: studentClass,
        },
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
    <div
      className="
        
        max-w-md 
        lg:max-w-xl  
        mx-auto
      "
    >
      <h1 className="text-3xl font-semibold text-center text-foreground/80 col-span-2">
        {isLogin ? "Welcome Back 👋" : "Create Your Account"}
      </h1>

      <p className="text-center text-sm text-text-secondary mt-1 col-span-2">
        {isLogin
          ? "Login to continue your learning journey"
          : "Join Jain and unlock premium learning experience"}
      </p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {!isLogin && (
          <div className="space-y-1 w-full">
            <label className="text-sm font-medium text-foreground/80/80">
              Full Name
            </label>
            <input
              type="text"
              placeholder="eg: John Doe"
              className="w-full px-4 py-1.5 border border-border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {!isLogin && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-1.5 border border-border rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}

        <div className={`space-y-1 w-full ${isLogin ? "lg:col-span-2" : ""}`}>
          <label className="text-sm font-medium text-foreground/80">
            Email
          </label>
          <input
            type="email"
            placeholder="eg: user@gmail.com"
            className="w-full px-4 py-1.5 border border-border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80">
              Class
            </label>
            <input
              type="text"
              placeholder="eg: 10, 11, 12"
              className="w-full px-4 py-1.5 border border-border rounded-lg"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1 lg:col-span-2">
          <label className="text-sm font-medium text-foreground/80">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-1.5 border border-border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-medium text-foreground/80">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-1.5 border rounded-lg ${
                  !isPassSame ? "border-red-500" : "border-border"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}

        {!isLogin &&
          confirmPassword.length > 0 &&
          (isPassSame ? (
            <p className="text-green-500 text-sm">Passwords match</p>
          ) : (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          ))}

        <div className="lg:col-span-2">
          <button
            disabled={!canSubmit}
            onClick={isLogin ? handleLogin : handleSignup}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all bg-primary hover:bg-primary-hover shadow-sm`}
          >
            Create Account
          </button>
        </div>
      </div>

      <p className="text-center text-sm mt-3 text-foreground/80">
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
