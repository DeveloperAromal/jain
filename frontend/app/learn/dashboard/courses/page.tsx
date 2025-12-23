"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  BookOpen,
  ArrowRight,
  Search,
  Filter,
  Lock,
  Crown,
  X,
} from "lucide-react";
import { Course } from "@/app/types/dashboardTypes";
import { useAuth } from "@/app/hooks/useAuth";

export default function Courses() {
  const { makeApiCall } = useAPICall();
  const [courses, setCourses] = useState<Course[]>([]);
  const [len, setLen] = useState();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
 

  const filteredCourses = courses.filter((course) =>
    [course.subject, course.description, course.subject_class].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const clearSearch = () => setSearchQuery("");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
          All Courses
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Explore courses designed to help you excel in your studies
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by subject, class, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-background 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                       transition-all text-foreground placeholder:text-muted-foreground"
            aria-label="Search courses"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-background hover:bg-accent hover:border-accent transition-all">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-4/5" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
                <div className="h-9 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const isFree = course.is_free === true;
            const isPremium = !isFree;

            const lessonCount = len;
            const duration = course.duration_minutes || "8.5 hrs";

            return (
              <div
                key={course.id}
                className={`group relative bg-card rounded-xl border overflow-hidden transition-all duration-300 ${
                  isPremium
                    ? "border-orange-200/50 opacity-90"
                    : "border-border hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
                }`}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={course.cover_image}
                    alt={`${course.subject} course thumbnail`}
                    fill
                    className={`object-cover transition-all duration-500 ${
                      isPremium ? "grayscale" : "group-hover:scale-110"
                    }`}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    {isFree ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur">
                        FREE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur">
                        <Crown className="h-3.5 w-3.5" />
                        Premium
                      </span>
                    )}

                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-900 shadow-sm backdrop-blur">
                      Class {course.subject_class}
                    </span>
                  </div>

                  {/* Premium Overlay */}
                  {isPremium && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6">
                      <Lock className="w-14 h-14 mb-3 opacity-80" />
                      <p className="text-lg font-bold">Premium Course</p>
                      <p className="text-sm opacity-90 mt-1">
                        Unlock with subscription
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`font-bold text-lg line-clamp-2 mb-3 transition-colors ${
                      isPremium
                        ? "text-muted-foreground"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {course.subject}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{lessonCount} Lessons</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{duration}</span>
                    </div> */}
                  </div>

                  {/* Action */}
                  {isPremium ? (
                    <Link
                      href="/learn/dashboard/payment"
                      className="block w-full text-center px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Crown className="w-5 h-5" />
                        Get Premium Access
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/dashboard/courses/${course.id}`}
                      className="flex items-center justify-between w-full pt-4 border-t border-border/60 group"
                    >
                      <span className="font-semibold text-foreground">
                        Start Learning
                      </span>
                      <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-2" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-2xl mx-auto">
          <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {searchQuery ? "No courses found" : "No courses available yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try different keywords or clear the search"
              : "New courses are added regularly — check back soon!"}
          </p>
        </div>
      )}
    </section>
  );
}
