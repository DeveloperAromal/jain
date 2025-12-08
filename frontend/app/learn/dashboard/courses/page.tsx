"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Lock,
  Crown,
} from "lucide-react";
import Cookies from "js-cookie";
import { Course } from "@/app/types/dashboardTypes";

export default function Courses() {
  const { makeApiCall } = useAPICall();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllAvailableCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await makeApiCall(
        "GET",
        ApiEndPoints.GET_STUDENT_COURSES,
        null,
        "application/json",
        token
      );

      const responseData = response?.data?.data;

      setCourses((responseData?.courses || []) as Course[]);

      console.log("Courses:", responseData?.courses);
      console.log("Subscription:", responseData?.subscriptionStatus);
    } catch (e) {
      console.error("Error fetching courses:", e);
    } finally {
      setLoading(false);
    }
  }, [makeApiCall]);

  useEffect(() => {
    getAllAvailableCourses();
  }, [getAllAvailableCourses]);

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.subject?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.subject_class?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
          All Courses
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Explore and enroll in courses to enhance your learning
        </p>
      </div>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       bg-white text-sm text-foreground placeholder:text-text-secondary
                       transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-white hover:bg-bg-soft transition-colors">
          <Filter className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-foreground">Filter</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-bg-soft"></div>
              <div className="p-6 space-y-3">
                <div className="h-5 bg-bg-soft rounded w-3/4"></div>
                <div className="h-4 bg-bg-soft rounded w-full"></div>
                <div className="h-4 bg-bg-soft rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => {
            const isFree = course.is_free === true;
            const isLocked = !isFree;

            return (
              <div
                key={course.id}
                className={`group bg-white rounded-xl border overflow-hidden transition-all duration-200 ${
                  isLocked
                    ? "border-orange-300 opacity-75"
                    : "border-border hover:shadow-lg hover:border-primary"
                }`}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src="/thumb.png"
                    alt="Course thumbnail"
                    width={500}
                    height={300}
                    className={`w-full h-40 sm:h-48 object-cover transition-transform duration-300 ${
                      isLocked ? "grayscale" : "group-hover:scale-105"
                    }`}
                  />

                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-semibold">Premium Course</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col sm:flex-row gap-2">
                    {isFree && (
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-semibold text-white">
                        Free
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-xs font-semibold text-white flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary">
                      Class {course.subject_class}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h2
                    className={`text-lg sm:text-xl font-bold line-clamp-2 transition-colors ${
                      isLocked
                        ? "text-text-secondary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {course.subject}
                  </h2>

                  <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-text-secondary mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>12 Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>8.5 hrs</span>
                    </div>
                  </div>

                  {isLocked ? (
                    <Link
                      href="/learn/dashboard/payment"
                      className="flex items-center justify-center gap-2 w-full pt-4 border-t border-border bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      Get Premium Access
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/dashboard/courses/${course.id}`}
                      className="flex items-center justify-between pt-4 border-t border-border"
                    >
                      <span className="text-sm font-medium text-foreground">
                        View Course
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No courses found" : "No courses available"}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Check back later for new courses"}
          </p>
        </div>
      )}
    </section>
  );
}
