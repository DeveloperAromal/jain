"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { useParams } from "next/navigation";
import { Play, Clock, CheckCircle2, BookOpen, Lock } from "lucide-react";
import Cookies from "js-cookie";
import { Course, Topic } from "@/app/types/dashboardTypes";
import { useAuth } from "@/app/hooks/useAuth";

interface ApiResponse {
  data?: {
    course?: Course;
    topics?: Topic[];
    data?: {
      course?: Course;
      topics?: Topic[];
    };
  };
}

export default function CoursePage() {
  const params = useParams();
  const courseId = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string) || "";

  const { makeApiCall } = useAPICall();
  const { user, loading: authLoading } = useAuth();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [, setCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set()
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getTopics = useCallback(async () => {
    if (!user?.id || !courseId) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) return;

      const response = (await makeApiCall(
        "GET",
        ApiEndPoints.GET_TOPICS_LIST(user.id, courseId),
        null,
        "application/json",
        token
      )) as ApiResponse;

      const courseData =
        response?.data?.course || response?.data?.data?.course || null;
      const topicData =
        response?.data?.topics || response?.data?.data?.topics || [];

      setCourse(courseData);
      setTopics(topicData);

      if (topicData.length > 0) {
        const firstPlayable = topicData.find(
          (t: Topic) => t.is_free || user.subscription_active
        );
        if (firstPlayable) setSelectedTopic(firstPlayable);
      }
    } catch (e) {
      console.error("Error fetching topics:", e);
    } finally {
      setLoading(false);
    }
  }, [courseId, user?.id, user?.subscription_active, makeApiCall]);

  useEffect(() => {
    if (!authLoading) {
      getTopics();
    }
  }, [authLoading, getTopics]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !selectedTopic) return;

    const handleEnded = () => {
      setCompletedTopics(
        (prev) => new Set([...Array.from(prev), selectedTopic.id])
      );

      const currentIndex = topics.findIndex((t) => t.id === selectedTopic.id);
      const nextTopic = topics[currentIndex + 1];
      const canPlayNext =
        nextTopic && (nextTopic.is_free || user?.subscription_active);

      if (canPlayNext) {
        setTimeout(() => setSelectedTopic(nextTopic), 2000);
      }
    };

    videoEl.addEventListener("ended", handleEnded);
    return () => videoEl.removeEventListener("ended", handleEnded);
  }, [selectedTopic, topics, user?.subscription_active]);

  const isTopicCompleted = (topicId: string) => completedTopics.has(topicId);

  if (loading || authLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-50 animate-pulse" />
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-64px)]">
      <div className="lg:w-2/3 w-full bg-bg-soft overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-2xl overflow-hidden border mb-6">
            {selectedTopic && user?.id ? (
              <video
                key={selectedTopic.id}
                ref={videoRef}
                src={ApiEndPoints.GET_STREAM(user.id, selectedTopic.id)}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-black/90">
                <Lock className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="text-2xl font-bold mb-2">
              {selectedTopic?.title || "Select a topic"}
            </h2>
            {selectedTopic && (
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                <Clock className="w-4 h-4" />
                {selectedTopic.duration_minutes} mins
              </div>
            )}
            <p className="text-text-secondary">
              {selectedTopic?.description ||
                "Choose a lesson from the right panel."}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 w-full bg-white border-l">
        <div className="p-5 border-b">
          <h3 className="font-bold text-lg">Course Topics</h3>
          <p className="text-xs text-text-secondary">{topics.length} lessons</p>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto">
          {topics.map((topic, index) => {
            const isSelected = selectedTopic?.id === topic.id;
            const isCompleted = isTopicCompleted(topic.id);
            const canWatch = topic.is_free || user?.subscription_active;

            return (
              <div
                key={topic.id}
                onClick={() => canWatch && setSelectedTopic(topic)}
                className={`relative flex gap-3 p-3 rounded-xl border transition ${
                  canWatch
                    ? "cursor-pointer hover:bg-bg-soft"
                    : "opacity-60 cursor-not-allowed"
                } ${
                  isSelected
                    ? "border-primary bg-accent-soft"
                    : "border-transparent"
                }`}
              >
                <div className="relative">
                  <Image
                    src={topic.thumbnail_img || "/placeholder.png"}
                    alt={topic.title}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover w-28 h-16"
                  />
                  {!canWatch && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {index + 1}. {topic.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                    <Clock className="w-3 h-3" />
                    {topic.duration_minutes} mins
                  </div>
                </div>
                {isSelected && canWatch && (
                  <Play className="w-4 h-4 text-primary mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
