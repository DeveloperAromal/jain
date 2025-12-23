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
              userId: user?.id
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card rounded-2xl border border-emerald-200/70 p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="text-sm text-muted-foreground">
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
    <div className="bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        <div className="mb-6 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 mb-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              Jain Math Hub Premium
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            12 months of ad‑free learning
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Watch all premium courses without limits, just like a YouTube
            Premium experience for your studies.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-border">
              <div className="p-4 sm:p-6">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/thumb.png"
                    alt="Premium Subscription"
                    width={640}
                    height={360}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1">
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-white">
                      Premium
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs sm:text-sm text-white/90">
                    Unlimited access to all premium courses
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">
                  Everything you need to master math
                </h2>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Ad‑free viewing of all premium lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Full access to course videos, notes, and materials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Track your progress across all courses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    12 months of unlimited learning for one flat price
                  </li>
                </ul>

                <p className="mt-4 text-xs text-muted-foreground">
                  Valid for 12 months from payment date. Cancel anytime from
                  your account settings.
                </p>
              </div>
            </div>

            {/* Right side: price + promo + button (md: 2 columns) */}
            <div className="md:col-span-2 p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Payment details
                </h3>

                {/* Price line like YouTube Premium headline price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                      ₹{finalPrice}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      for 12 months
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="mt-1 text-xs text-emerald-600">
                      You save ₹{discount} with your promo.
                    </div>
                  )}
                </div>

                {/* Promo input */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Promo code (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      placeholder="ENTER CODE"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={processing || validatingPromo || !!appliedPromo}
                    />
                    {!appliedPromo ? (
                      <button
                        onClick={applyPromoCode}
                        disabled={
                          validatingPromo || !promoCode.trim() || processing
                        }
                        className="px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent disabled:opacity-50"
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
                        className="px-3 py-2 rounded-lg bg-red-50 text-xs font-medium text-red-700 hover:bg-red-100 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <div className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Promo {appliedPromo.code} applied (
                      {appliedPromo.discountPercent}% off)
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4 border-t border-border/60 pt-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subscription price
                    </span>
                    <span className="font-medium">₹{originalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Discount</span>
                      <span className="font-medium text-emerald-600">
                        -₹{discount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 text-sm font-semibold">
                    <span>Total today</span>
                    <span className="text-primary">₹{finalPrice}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                    {error}
                  </div>
                )}
              </div>

              {/* Pay button */}
              <div>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      Pay ₹{finalPrice} for 12 months access
                    </>
                  )}
                </button>
                <p className="mt-2 text-[11px] text-center text-muted-foreground">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
