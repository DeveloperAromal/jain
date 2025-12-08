"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Gracefully redirect any stale path to the main admin dashboard.
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-[var(--text-secondary)]">
      Redirecting to admin dashboard...
    </div>
  );
}

