"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import Cookies from "js-cookie";
import Link from "next/link";
import { Crown } from "lucide-react";

export default function SubscriptionStatusBar() {
  const { makeApiCall } = useAPICall();

  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await makeApiCall(
          "GET",
          ApiEndPoints.GET_SUBSCRIPTION_STATUS,
          null,
          "application/json",
          token
        );

        const data = response.data.data;

        setHasSubscription(Boolean(data.hasPaidSubscription));
        setDaysRemaining(data.subscriptionDaysRemaining ?? 0);
      } catch (error) {
        console.error("Failed to fetch subscription status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [makeApiCall]);

  // Hide banner completely if user has active paid subscription
  if (loading || hasSubscription === null || hasSubscription) return null;

  return (
    <Link href="/learn/dashboard/payment" className="block no-underline">
      <div className="w-full py-2 px-4 text-center text-sm font-medium cursor-pointer border-b border-orange-200/50 bg-orange-500/10 text-orange-800 transition-colors hover:bg-accent/50">
        <span className="inline-flex items-center justify-center gap-1">
          <Crown className="w-4 h-4" />
          Upgrade to Premium
        </span>
      </div>
    </Link>
  );
}
