"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/app/components/includes/DashboardLayout";
import AuthProvider from "@/app/context/AuthContext";
export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
