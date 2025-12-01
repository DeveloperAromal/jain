"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { useParams, useRouter } from "next/navigation";
import { Play, Clock, CheckCircle2, Circle, BookOpen, Lock, Crown } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Course, Topic } from "@/app/types/dashboardTypes";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { makeApiCall } = useAPICall();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const getTopics = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      const courseResponse = await makeApiCall(
        "GET",
        `${ApiEndPoints.GET_COURSE_BY_COURSE_ID}/${courseId}`,
        null,
        "application/json",
        token
      );

      const courseData = (courseResponse?.data?.data?.course || courseResponse?.data?.course || courseResponse?.data) as Course;
      setCourse(courseData);

      const isFree = courseData?.is_free === true || 
                     courseData?.is_free === "true" || 
                     courseData?.is_free === 1 ||
                     String(courseData?.is_free).toLowerCase() === "true";
      
      if (isFree) {
        setHasAccess(true);
        setCheckingAccess(false);
      } else {
        try {
          setCheckingAccess(true);
          const accessResponse = await makeApiCall(
            "GET",
            `${ApiEndPoints.CHECK_COURSE_ACCESS}/${courseId}/access`,
            null,
            "application/json",
            token
          );
          const accessData = accessResponse?.data?.data || accessResponse?.data;
          setHasAccess(accessData?.hasAccess || false);
        } catch (e) {
          console.log("Error checking access:", e);
          setHasAccess(false);
        } finally {
          setCheckingAccess(false);
        }
      }

      const topicsResponse = await makeApiCall(
        "GET",
        `${ApiEndPoints.GET_TOPICS_BY_COURSE}/${courseId}`,
        null,
        "application/json",
        token
      );

      const fetchedTopics = (topicsResponse?.data?.topics || topicsResponse?.topics || []) as Topic[];
      setTopics(fetchedTopics);

      const isFreeCourse = courseData?.is_free === true || 
                           courseData?.is_free === "true" || 
                           courseData?.is_free === 1 ||
                           String(courseData?.is_free).toLowerCase() === "true";
      if (fetchedTopics.length > 0 && (hasAccess || isFreeCourse)) {
        setSelectedTopic(fetchedTopics[0]);
      }
    } catch (e) {
      console.log("Error fetching course/topics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      getTopics();
    }
  }, [courseId]);

  const handleMarkAsViewed = () => {
    if (selectedTopic) {
      setCompletedTopics((prev) => new Set([...prev, selectedTopic.id]));
    }
  };

  const isTopicCompleted = (topicId: string) => completedTopics.has(topicId);

  if (loading || (checkingAccess && !course)) {
    return (
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="text-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50 animate-pulse" />
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  const isFreeCourse = course?.is_free === true || 
                       course?.is_free === "true" || 
                       course?.is_free === 1 ||
                       String(course?.is_free).toLowerCase() === "true";
  
  if (!hasAccess && course && !isFreeCourse) {
    return (
      <section className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[var(--bg-soft)] p-4 sm:p-6">
        <div className="max-w-2xl w-full bg-white rounded-xl sm:rounded-2xl border border-[var(--border)] p-6 sm:p-8 text-center">
          <div className="mb-6 relative">
            <div className="relative inline-block mb-4 w-full">
              <Image
                src="/thumb.png"
                alt="Course thumbnail"
                width={400}
                height={250}
                className="w-full h-48 sm:h-64 object-cover rounded-lg opacity-50"
              />
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-2 sm:px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-xs font-semibold text-white flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
            {course.subject}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 sm:mb-6">
            This is a premium course. Unlock it to access all content.
          </p>

          <Link
            href="/learn/dashboard/payment"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all text-sm sm:text-base"
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            Get 12 Months Premium Access
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] lg:overflow-hidden">
      <div className="lg:w-2/3 w-full overflow-y-auto no-scroll-bar bg-[var(--bg-soft)]">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] mb-4 sm:mb-6">
            {loading ? (
              <div className="w-full aspect-video bg-[var(--bg-soft)] animate-pulse flex items-center justify-center">
                <Play className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] opacity-50" />
              </div>
            ) : selectedTopic ? (
              <video
                key={selectedTopic.id}
                src={selectedTopic.video_url}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-base sm:text-lg font-medium">Select a topic to start learning</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-[var(--border)]">
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-2">
                {selectedTopic && isTopicCompleted(selectedTopic.id) && (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                )}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)]">
                  {selectedTopic?.title || "Course Content"}
                </h2>
              </div>

              {selectedTopic && (
                <div className="flex items-center gap-4 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{selectedTopic.duration_minutes || 0} minutes</span>
                  </div>
                </div>
              )}

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {selectedTopic?.description ||
                  "Select a topic from the sidebar to start learning. Each topic contains video lessons and materials to help you master the concepts."}
              </p>
            </div>

            {selectedTopic && (
              <div className="pt-4 sm:pt-6 border-t border-[var(--border)]">
                <button
                  onClick={handleMarkAsViewed}
                  disabled={isTopicCompleted(selectedTopic.id)}
                  className={`
                    w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base
                    ${
                      isTopicCompleted(selectedTopic.id)
                        ? "bg-green-50 text-green-700 cursor-not-allowed"
                        : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:shadow-md"
                    }
                  `}
                >
                  {isTopicCompleted(selectedTopic.id) ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Completed
                    </span>
                  ) : (
                    "Mark as Completed"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 w-full border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-white flex flex-col">
        <div className="p-4 sm:p-6 border-b border-[var(--border)] bg-white sticky top-0 z-10">
          <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-1">Course Topics</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {topics.length} {topics.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>

        <div className="overflow-y-auto no-scroll-bar flex-1">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-24 h-16 sm:w-32 sm:h-20 bg-[var(--bg-soft)] rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg-soft)] rounded w-3/4"></div>
                    <div className="h-3 bg-[var(--bg-soft)] rounded w-full"></div>
                    <div className="h-3 bg-[var(--bg-soft)] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">No topics found.</p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-2">
              {topics.map((topic, index) => {
                const isSelected = selectedTopic?.id === topic.id;
                const isCompleted = isTopicCompleted(topic.id);

                return (
                  <div
                    key={topic.id}
                    onClick={() => hasAccess && setSelectedTopic(topic)}
                    className={`
                      flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all
                      ${
                        !hasAccess
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                      ${
                        isSelected
                          ? "bg-[var(--accent-soft)] border-2 border-[var(--primary)]"
                          : "bg-[var(--bg-soft)] hover:bg-white border-2 border-transparent hover:border-[var(--border)] hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={topic.thumbnail_img || "/thumb.png"}
                        alt="Topic thumbnail"
                        width={120}
                        height={80}
                        className="rounded-lg w-24 h-16 sm:w-32 sm:h-20 object-cover"
                      />
                      {isCompleted && (
                        <div className="absolute top-1 right-1 bg-green-600 rounded-full p-0.5 sm:p-1">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--primary)]" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] bg-white px-1.5 sm:px-2 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <h3 className={`font-semibold text-xs sm:text-sm line-clamp-1 ${isSelected ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
                            {topic.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-1 sm:mb-2">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{topic.duration_minutes || 0} mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
