"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminLayout from "@/app/components/admin/AdminLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return <AdminLayout>{children}</AdminLayout>;
}

