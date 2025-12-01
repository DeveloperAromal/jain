"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { Crown, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { SubscriptionStatus } from "@/app/types/dashboardTypes";

export default function SubscriptionStatusBar() {
  const { makeApiCall } = useAPICall();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
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
        setSubscriptionStatus(response?.data as SubscriptionStatus);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [makeApiCall]);

  if (loading || !subscriptionStatus) {
    return null;
  }

  const { 
    isFreeTrialActive, 
    daysRemaining, 
    hasPaidSubscription, 
    subscriptionType,
    subscriptionEndDate,
    subscriptionDaysRemaining 
  } = subscriptionStatus;

  if (hasPaidSubscription && subscriptionDaysRemaining && subscriptionDaysRemaining > 0) {
    const monthsRemaining = Math.floor(subscriptionDaysRemaining / 30);
    const daysRemaining = subscriptionDaysRemaining % 30;
    
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            <div>
              <p className="font-semibold text-xs sm:text-sm md:text-base">
                Premium Subscription Active
              </p>
              <p className="text-xs opacity-90">
                {monthsRemaining > 0 && `${monthsRemaining} ${monthsRemaining === 1 ? "month" : "months"}`} {daysRemaining > 0 && `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`} remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFreeTrialActive) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <div>
              <p className="font-semibold text-xs sm:text-sm md:text-base">
                7 Days Free Trial Active
              </p>
              <p className="text-xs opacity-90">
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining - Access to free courses only
              </p>
            </div>
          </div>
          <Link
            href="/learn/dashboard/payment"
            className="flex items-center gap-2 bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
            Get 12 Months Access
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 sm:py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <div>
            <p className="font-semibold text-xs sm:text-sm md:text-base">
              {subscriptionType === "expired" ? "Free Trial Expired" : "No Active Subscription"}
            </p>
            <p className="text-xs opacity-90">
              Upgrade to get 12 months access to all premium courses
            </p>
          </div>
        </div>
        <Link
          href="/learn/dashboard/payment"
          className="flex items-center gap-2 bg-white text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
        >
          <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
          Get 12 Months Access
        </Link>
      </div>
    </div>
  );
}
