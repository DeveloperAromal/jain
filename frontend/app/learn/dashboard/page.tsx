"use client";

import Greetings from "@/app/components/GreetingsCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  BookOpen,
  Play,
  ArrowRight,
  Sparkles,
  Lock,
  Crown,
} from "lucide-react";
import Image from "next/image";

import { Course } from "@/app/types/dashboardTypes";

export default function StudentDashboard() {
  const { makeApiCall } = useAPICall();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await makeApiCall(
          "GET",
          ApiEndPoints.GET_ALL_COURSE,
          null,
          "application/json"
        );
        const responseData = response?.data?.data;
        setCourses(responseData?.courses || []);
      } catch (e) {
        console.error("Error fetching courses:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [makeApiCall]);

  const featuredCourse = courses[0];
  const recentCourses = courses.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Greetings />

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Quick Start
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Link
            href="/learn/dashboard/courses"
            className="group px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-2 border-border rounded-xl hover:border-primary hover:bg-accent-soft transition-all flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
          >
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              Browse All Courses
            </span>
            <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="/learn/dashboard/courses"
            className="group px-4 sm:px-6 py-3 sm:py-3.5 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-primary/20 text-sm sm:text-base"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Continue Learning</span>
          </Link>
        </div>
      </div>

      {featuredCourse && (
        <div className="mb-6 sm:mb-8 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Featured Course
            </h2>
          </div>
          <Link
            href={
              featuredCourse.is_free
                ? `/learn/dashboard/courses/${featuredCourse.id}`
                : "/learn/dashboard/payment"
            }
          >
            <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-48 sm:h-56 md:h-auto overflow-hidden">
                  <Image
                    src="/thumb.png"
                    alt={featuredCourse.subject}
                    width={400}
                    height={300}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      featuredCourse.is_free
                        ? "group-hover:scale-105"
                        : "grayscale"
                    }`}
                  />
                  {!featuredCourse.is_free && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                        <p className="font-semibold text-sm sm:text-base">Premium Course</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col sm:flex-row gap-2">
                    {featuredCourse.is_free && (
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-semibold text-white">
                        Free
                      </span>
                    )}
                    {!featuredCourse.is_free && (
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-xs font-semibold text-white flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary">
                      Class {featuredCourse.subject_class}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-2 sm:px-3 py-1 bg-accent-soft text-primary text-xs font-semibold rounded-full mb-3">
                      Class {featuredCourse.subject_class}
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                      {featuredCourse.subject}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary line-clamp-2 sm:line-clamp-3 mb-4">
                      {featuredCourse.description}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border gap-2 sm:gap-0">
                    <span className="text-xs sm:text-sm font-medium text-primary">
                      Start Learning
                    </span>
                    <div className="flex items-center gap-2 text-text-secondary group-hover:text-primary transition-colors">
                      <span className="text-xs sm:text-sm">View Course</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {recentCourses.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Continue Your Journey
              </h2>
            </div>
            <Link
              href="/learn/dashboard/courses"
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCourses.map((course) => {
              const isFree = course.is_free;
              const isLocked = !isFree;

              return (
                <Link
                  key={course.id}
                  href={
                    isLocked
                      ? "/learn/dashboard/payment"
                      : `/learn/dashboard/courses/${course.id}`
                  }
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src="/thumb.png"
                      alt={course.subject}
                      width={300}
                      height={200}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isLocked ? "grayscale" : "group-hover:scale-110"
                      }`}
                    />
                    {!isFree && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                          <p className="font-semibold text-xs sm:text-sm">Premium</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Play
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            isLocked ? "text-gray-400" : "text-primary"
                          } group-hover:text-white transition-colors`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-text-secondary mb-1">
                      Class {course.subject_class}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {course.subject}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            No courses yet
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">
            Check back soon for new courses!
          </p>
          <Link
            href="/learn/dashboard/courses"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-sm sm:text-base"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            Browse Courses
          </Link>
        </div>
      )}
    </section>
  );
}
