/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { useAuth } from "@/app/hooks/useAuth";

import { Crown, CheckCircle2, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { PromoCode, RazorpayResponse } from "@/app/types/dashboardTypes";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  finalAmount: number;
  appliedPromo?: PromoCode;
}

export default function PaymentPage() {
  const auth = useAuth();
  const { user } = auth;

  const router = useRouter();
  const { makeApiCall } = useAPICall();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const originalPrice = 999;

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setValidatingPromo(true);
    setError("");

    try {
      const token = Cookies.get("token");
      const res = await makeApiCall(
        "POST",
        ApiEndPoints.VALIDATE_PROMO,
        { code: promoCode },
        "application/json",
        token
      );

      if (res?.data?.valid) {
        setAppliedPromo(res.data.promo);
      } else {
        setError(res?.data?.message || "Invalid promo code");
        setAppliedPromo(null);
      }
    } catch (err) {
      setError("Failed to validate promo code");
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

const createOrder = async (): Promise<OrderResponse | null> => {
  setProcessing(true);
  setError("");

  try {
    const token = Cookies.get("token");
    if (!token) {
      setError("Please log in to continue");
      return null;
    }

    const userId = user?.id;
    if (!userId) {
      setError("User information not found. Please log in again.");
      return null;
    }

    const res = await makeApiCall(
      "POST",
      ApiEndPoints.CREATE_PAYMENT_ORDER,
      {
        promoCode: appliedPromo ? promoCode : undefined,
        userId,
      },
      "application/json",
      token
    );

    const data = (res?.data?.data || res?.data || res) as OrderResponse;

    setOrderData(data);

    return data;
  } catch (err) {
    setError("Failed to create order. Please try again.");
    return null;
  } finally {
    setProcessing(false);
  }
};


  const handlePayment = async () => {
    setError("");

    const order = orderData ?? (await createOrder());
    if (!order) return;

    setProcessing(true);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      setError("Payment gateway not configured");
      setProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.finalAmount * 100,
      currency: "INR",
      name: "Jain Math Hub",
      description: "12 Months Premium Subscription",
      order_id: order.order.id,

      handler: async (response: RazorpayResponse) => {
        try {
          const token = Cookies.get("token");
          const verifyRes = await makeApiCall(
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

          if (verifyRes?.success || verifyRes?.data?.success) {
            setPaymentSuccess(true);
            setTimeout(() => router.push("/learn/dashboard/courses"), 2000);
          } else {
            setError("Payment verification failed");
          }
        } catch {
          setError("Payment failed. Please contact support.");
        } finally {
          setProcessing(false);
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },

      theme: { color: "#4F46E5" },
      modal: { ondismiss: () => setProcessing(false) },
    };

    new window.Razorpay(options).open();
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

const finalPrice = appliedPromo
  ? Math.max(
      originalPrice -
        Math.round((appliedPromo.discountPercent / 100) * originalPrice),
      0
    )
  : originalPrice;
  const discount = originalPrice - finalPrice;

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
        {/* Left: Benefits */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="relative mb-4">
            <Image
              src="/thumb.png"
              alt="Premium Subscription"
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
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border text-sm text-text-secondary">
            Valid for 12 months from payment date
          </div>
        </div>

        {/* Right: Payment Details */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Payment Details
          </h3>

          {/* Promo Code Input */}
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
                disabled={processing || validatingPromo || !!appliedPromo}
              />
              {!appliedPromo ? (
                <button
                  onClick={applyPromoCode}
                  disabled={validatingPromo || !promoCode.trim() || processing}
                  className="px-4 py-2 bg-bg-soft text-foreground rounded-lg hover:bg-border transition-colors disabled:opacity-50"
                >
                  {validatingPromo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoCode("");
                    setOrderData(null);
                    setError("");
                  }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Remove
                </button>
              )}
            </div>

            {appliedPromo && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Promo code {appliedPromo.code} applied (
                {appliedPromo.discountPercent}% off)
              </div>
            )}
          </div>

          {/* Price Breakdown */}
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" />
                Pay ₹{finalPrice} for 12 Months Access
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
