import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface ApiResponse {
  [x: string]: unknown;
  data?: unknown;
  status: number;
  detail?: string;
  user?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  subscription_active: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean; 
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface Course {
  lesson_count: number;
  cover_image: string | StaticImport;
  duration_minutes: string;
  id: string | number;
  subject: string;
  subject_class: string;
  description: string;
  tags?: string;
  is_free: boolean;
  price?: number;
  instructor_id?: string | null;
  created_by?: string | null;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  accessStatus?: "accessible" | "locked";
  isFree?: boolean;
  isEnrolled?: boolean;
}

export interface Topic {
  is_unlocked: any;
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_img?: string;
  duration_minutes?: number;
  sequence_order?: number;
  created_at?: string;
  updated_at?: string;
  is_free: boolean;
}

export interface SubscriptionStatus {
  isFreeTrialActive: boolean;
  daysRemaining: number;
  hasPaidSubscription: boolean;
  subscriptionType: "paid" | "free_trial" | "expired";
  subscriptionEndDate?: string | null;
  subscriptionDaysRemaining?: number;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  id?: string;
  max_uses?: number;
  used_count?: number;
  active?: boolean;
  expires?: string;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
