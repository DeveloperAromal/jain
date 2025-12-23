"use client";

import Greetings from "@/app/components/GreetingsCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { BookOpen, ArrowRight, Lock, Crown } from "lucide-react";
import Image from "next/image";
import { Course } from "@/app/types/dashboardTypes";
import { useAuth } from "@/app/hooks/useAuth";


export default function StudentDashboard() {
  const { makeApiCall } = useAPICall();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const { user } = auth;

useEffect(() => {
  if (!user?.id) return;

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await makeApiCall(
        "GET",
        ApiEndPoints.GET_COURSE_LIST(user.id),
        null,
        "application/json"
      );

      setCourses(response?.data?.data.course?.courses || []);
    } catch (e) {
      console.error("Error fetching courses:", e);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, [makeApiCall, user?.id]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Greetings />

      <div className="mt-10 mb-6 flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Continue Learning
          </h2>
          <p className="text-sm text-muted-foreground">
            Resume or explore new courses curated for you
          </p>
        </div>

        <Link
          href="/learn/dashboard/courses"
          className="text-sm font-medium text-primary hover:opacity-80 transition"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card animate-pulse overflow-hidden"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-9 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course) => {
            const isFree = course.is_free === true;
            const isPremium = !isFree;

            return (
              <div
                key={course.id}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={course.cover_image}
                    alt={course.subject}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      isPremium ? "grayscale" : "group-hover:scale-[1.03]"
                    }`}
                  />

                  {/* Soft gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    {isFree ? (
                      <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white">
                        FREE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold text-white">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Premium Overlay */}
                  {isPremium && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                      <Lock className="w-9 h-9 mb-1 opacity-90" />
                      <span className="text-sm font-medium">
                        Premium Course
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3
                    className={`font-semibold text-base mb-2 line-clamp-2 ${
                      isPremium
                        ? "text-muted-foreground"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {course.subject}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  {isPremium ? (
                    <Link
                      href="/learn/dashboard/payment"
                      className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                      Unlock Premium
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/dashboard/courses/${course.id}`}
                      className="flex items-center justify-between pt-3 border-t border-border text-sm font-medium"
                    >
                      <span>Continue learning</span>
                      <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm">
            No courses available yet.
          </p>
        </div>
      )}
    </section>
  );
}
