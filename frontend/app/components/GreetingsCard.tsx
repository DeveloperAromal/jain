"use client";

import { useAuth } from "@/app/hooks/useAuth";

export default function Greetings() {
  const auth = useAuth();

  if (!auth || !auth.user) {
    return (
      <div className="h-screen flex justify-center items-center text-text-secondary">
        <div className="animate-pulse text-sm sm:text-base">Loading...</div>
      </div>
    );
  }

  const { user } = auth;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 bg-linear-to-br from-primary to-primary-hover text-white shadow-lg">
        <div className="absolute -top-12 sm:-top-16 -right-12 sm:-right-16 w-32 h-32 sm:w-48 sm:h-48 rounded-full opacity-10 bg-white"></div>
        <div className="absolute -bottom-8 sm:-bottom-12 -left-8 sm:-left-12 w-28 h-28 sm:w-40 sm:h-40 rounded-full opacity-10 bg-white"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Hello, {user.name} 👋</h2>
          <p className="text-base sm:text-lg md:text-xl opacity-95">
            Welcome back! Let&apos;s continue your learning journey.
          </p>
        </div>
      </div>
    </div>
  );
}
