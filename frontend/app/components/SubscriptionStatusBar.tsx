"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import Cookies from "js-cookie";
import Link from "next/link";

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

  if (loading || hasSubscription === null) return null;

  let message = "Upgrade to Premium";
  let bgClass =
    "bg-gradient-to-r from-red-900 via-red-700 to-red-800 text-red-200";

  if (hasSubscription) {
    const months = Math.floor(daysRemaining / 30);
    const days = daysRemaining % 30;

    message = `Premium Active  ${months > 0 ? `${months} months ` : ""}${
      days > 0 ? `${days} days` : ""
    } left`;

    bgClass =
      "bg-gradient-to-r from-purple-800 via-pink-700 to-purple-900 text-pink-200";
  }

  return (
    <Link href="/learn/dashboard/payment">
      <div
        className={`${bgClass} w-full py-1 text-center text-sm font-medium cursor-pointer`}
      >
        {message}
      </div>
    </Link>
  );
}
