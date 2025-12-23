"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [len, setLen] = useState<number | undefined>();
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

        const list = response?.data?.data.course?.courses || [];
        setCourses(list);
        // if API has lesson count per course, set it there instead
        setLen(list[0]?.lesson_count);
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            All Courses
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore courses designed to help you excel in your studies
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-full border border-border bg-background
                         text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search courses"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border text-sm bg-background hover:bg-accent">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-muted rounded w-4/5" />
                <div className="h-3 bg-muted rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 pb-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
          {filteredCourses.map((course) => {
            const isFree = course.is_free === true;
            const isPremium = !isFree;
            const lessonCount = len ?? course.lesson_count ?? 0;
            const duration = course.duration_minutes || "8.5 hrs";

            return (
              <div key={course.id} className="cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={course.cover_image}
                    alt={`${course.subject} course thumbnail`}
                    fill
                    className={`object-cover ${isPremium ? "grayscale" : ""}`}
                  />

                  {/* Small badges top-left */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-black/70 text-white">
                      Class {course.subject_class}
                    </span>
                    {isPremium ? (
                      <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-black/80 text-amber-300">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    ) : (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500 text-white">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Lock bottom-right */}
                  {isPremium && (
                    <div className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded bg-black/70 text-white px-1.5 py-0.5 text-[10px]">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-3 flex gap-2">
                  <div className="mt-0.5">
                    <BookOpen className="w-7 h-7 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                      {course.subject}
                    </h3>
                    <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-3">
                      <span>{lessonCount} lessons</span>
                      <span className="hidden sm:inline-block">•</span>
                      <span className="hidden sm:inline-block">{duration}</span>
                    </div>

                    <div className="mt-2">
                      {isPremium ? (
                        <Link
                          href="/learn/dashboard/payment"
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          Get Premium Access
                        </Link>
                      ) : (
                        <Link
                          href={`/learn/dashboard/courses/${course.id}`}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                        >
                          <span>Start learning</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-2xl mx-auto">
          <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No courses found" : "No courses available yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try different keywords or clear the search."
              : "New courses are added regularly — check back soon!"}
          </p>
        </div>
      )}
    </section>
  );
}
