/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  Crown,
  CheckCircle2,
  X,
  Loader2,
  Calendar,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { PromoCode, RazorpayResponse } from "@/app/types/dashboardTypes";

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface OrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
  finalAmount: number;
  appliedPromo?: PromoCode;
}

export default function PaymentPage() {
  const router = useRouter();
  const { makeApiCall } = useAPICall();

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscriptionPrice] = useState(999);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      const token = Cookies.get("token");
      if (!token) {
        setError("Authentication required");
        setProcessing(false);
        return;
      }

      const orderResponse = await makeApiCall(
        "POST",
        ApiEndPoints.CREATE_PAYMENT_ORDER,
        {
          amount: subscriptionPrice,
          subscriptionMonths: 12,
          promoCode: promoCode || undefined,
        },
        "application/json",
        token
      );

      const orderData = (orderResponse?.data?.data || orderResponse?.data || orderResponse || {}) as OrderResponse;
      const { order, finalAmount, appliedPromo: promo } = orderData;

      if (!order?.id) {
        throw new Error("Failed to create payment order. Please try again.");
      }

      if (promo) setAppliedPromo(promo);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error("Razorpay key not configured.");

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: finalAmount * 100,
        currency: "INR",
        name: "Jain Math Hub",
        description: "12 Months Premium Subscription",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const token = Cookies.get("token");
            if (!token) {
              setError("Authentication required");
              setProcessing(false);
              return;
            }

            const verifyResponse = await makeApiCall(
              "POST",
              ApiEndPoints.VERIFY_PAYMENT,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              "application/json",
              token
            );

            if (verifyResponse?.success || verifyResponse?.data?.success) {
              setPaymentSuccess(true);
              setTimeout(() => router.push("/learn/dashboard/courses"), 2000);
            } else {
              setError("Payment verification failed");
            }
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setError("Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-green-200 p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="text-text-secondary mb-6">
            You now have 12 months access to all premium courses. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const originalPrice = subscriptionPrice;
  const discount = appliedPromo
    ? Math.round((originalPrice * appliedPromo.discountPercent) / 100)
    : 0;
  const finalPrice = originalPrice - discount;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-foreground mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Premium Subscription
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Get 12 months access to all premium courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="relative mb-4">
            <Image
              src="/thumb.png"
              alt="Subscription"
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-linear-to-r from-orange-500 to-red-500 backdrop-blur-sm text-xs font-semibold text-white flex items-center gap-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
            12 Months Premium Access
          </h2>

          <div className="space-y-3 mb-4">
            {[
              "Access to ALL premium courses",
              "12 months unlimited access",
              "All course materials and videos",
              "Progress tracking",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-text-secondary"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" /> {item}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4" /> Valid for 12 months from payment
            date
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Payment Details
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Promo Code (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={processing || !!appliedPromo}
              />
              {!appliedPromo && (
                <button
                  onClick={() => setError("")}
                  className="px-4 py-2 bg-bg-soft text-foreground rounded-lg hover:bg-border transition-colors"
                  disabled={processing}
                >
                  Apply
                </button>
              )}
            </div>
            {appliedPromo && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Promo code{" "}
                {appliedPromo.code} applied ({appliedPromo.discountPercent}%
                off)
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                Subscription Price (12 months)
              </span>
              <span className="font-medium">₹{originalPrice}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total</span>
              <span className="text-primary">₹{finalPrice}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" /> Pay ₹{finalPrice} for 12 Months
                Access
              </>
            )}
          </button>

          <p className="text-xs text-text-secondary text-center mt-4">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
