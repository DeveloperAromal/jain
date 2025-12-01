/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { useState } from "react";
import Cookies from "js-cookie";

import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const spacegrotesk = Space_Grotesk({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

export default function Authentication() {
  const router = useRouter();
  const { makeApiCall } = useAPICall();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "POST",
        ApiEndPoints.LOGIN_USER,
        {
          email,
          password,
        },
        "application/json"
      );

      const token = response?.data.token;
      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        router.push("/learn/dashboard");
      } else {
        console.error("Token not found in response");
      }
    } catch (error) {
      console.error("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex min-h-screen bg-[var(--background)] text-[var(--text-main)] ${spacegrotesk.className}`}
    >
      <div className="left flex flex-col items-center justify-between p-12">
        <div className="top w-full flex items-center justify-start">
          <div className="left">
            <Image src={"/assets/logo.png"} alt="logo" width={50} height={50} />
          </div>
        </div>

        <div className="mid w-full">
          <div className="w-full flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md p-8">
              <h2 className="text-5xl font-semibold text-left text-[var(--primary)]">
                Welcome Back
              </h2>
              <span className="text-neutral-400 mb-8 inline-block">
                Sign in to your account
              </span>

              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 mb-4 rounded-sm border-1 border-neutral-400 text-[var(--text-main)] outline-none bg-[var(--dashboard-card)] focus:border-1 focus:border-[var(--primary)]"
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-sm border-1 border-neutral-400 text-[var(--text-main)] outline-none bg-[var(--dashboard-card)] focus:border-1 focus:border-[var(--primary)]"
                  required
                />
                <span className="w-full text-right inline-block m-0 p-0 text-sm text-neutral-500">
                  forgot password ?
                </span>

                <button className="w-full mt-4 py-2.5 bg-green-400  font-black border border-[var(--primary)]">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bottom">
          <p className="text-sm text-neutral-400 text-center">
            By continuing, you agree to Supabase&apos;s{" "}
            <Link href={"#"} className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={"#"} className="underline">
              Privacy Policy
            </Link>
            , and to receive periodic emails with updates.
          </p>
        </div>
      </div>
    </section>
  );
}
