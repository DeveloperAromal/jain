"use client";

import { useEffect, useState, useCallback } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { Plus, Edit, Trash2, BookOpen, Crown } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Course } from "@/app/types/dashboardTypes";

export default function AdminCourses() {
  const { makeApiCall } = useAPICall();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      const response = await makeApiCall(
        "GET",
        ApiEndPoints.ADMIN_GET_ALL_COURSES,
        null,
        "application/json",
        token
      );

      const coursesData = response?.data?.courses || response?.data?.data?.courses || [];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [makeApiCall]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleToggleFree = async (courseId: string | number, isFree: boolean) => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      await makeApiCall(
        "PUT",
        ApiEndPoints.ADMIN_TOGGLE_COURSE_FREE,
        { courseID: courseId, is_free: !isFree },
        "application/json",
        token
      );

      fetchCourses();
    } catch (error) {
      console.error("Error toggling course:", error);
    }
  };

  const handleDelete = async (courseId: string | number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      await makeApiCall(
        "DELETE",
        `${ApiEndPoints.ADMIN_DELETE_COURSE}/${courseId}`, {},
        "application/json",
        token
      );

      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-sm sm:text-base text-text-secondary">Manage all courses</p>
        </div>
        <Link
          href="/admin/dashboard/courses/new"
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Course</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-6 animate-pulse">
              <div className="h-4 bg-bg-soft rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-bg-soft rounded w-full mb-2"></div>
              <div className="h-3 bg-bg-soft rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
          <p className="text-sm text-text-secondary mb-6">Create your first course to get started</p>
          <Link
            href="/admin/dashboard/courses/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {course.subject}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-3">
                    Class {course.subject_class}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {course.is_free ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Free
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Paid
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-4">
                {course.description}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => handleToggleFree(course.id, course.is_free)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    course.is_free
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Make {course.is_free ? "Paid" : "Free"}
                </button>
                <Link
                  href={`/admin/dashboard/courses/${course.id}`}
                  className="p-2 border border-border rounded-lg hover:bg-bg-soft transition-colors"
                >
                  <Edit className="w-4 h-4 text-text-secondary" />
                </Link>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

