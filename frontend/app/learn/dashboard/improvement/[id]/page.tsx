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

      // ✅ pick first unlocked topic ONLY
      const firstPlayable = topicData.find((t: Topic) => t.is_unlocked);
      if (firstPlayable) setSelectedTopic(firstPlayable);
    } catch (e) {
      console.error("Error fetching topics:", e);
    } finally {
      setLoading(false);
    }
  }, [courseId, user?.id, makeApiCall]);

  useEffect(() => {
    if (!authLoading) getTopics();
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

      // ✅ only auto-play unlocked topic
      if (nextTopic?.is_unlocked) {
        setTimeout(() => setSelectedTopic(nextTopic), 2000);
      }
    };

    videoEl.addEventListener("ended", handleEnded);
    return () => videoEl.removeEventListener("ended", handleEnded);
  }, [selectedTopic, topics]);

  const isTopicCompleted = (topicId: string) => completedTopics.has(topicId);

  if (loading || authLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-50 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] bg-background">
      {/* Player */}
      <div className="lg:w-2/3 w-full border-b lg:border-b-0 lg:border-r border-border flex flex-col">
        <div className="w-full bg-black">
          <div className="max-w-5xl mx-auto">
            {selectedTopic?.is_unlocked ? (
              <video
                key={selectedTopic.id}
                ref={videoRef}
                src={ApiEndPoints.GET_STREAM(user!.id, selectedTopic.id)}
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <h2 className="text-lg sm:text-2xl font-semibold mb-2">
              {selectedTopic?.title || "Select a topic"}
            </h2>
            {selectedTopic && (
              <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>{selectedTopic.duration_minutes} mins</span>
              </div>
            )}
            <p className="text-sm sm:text-base text-muted-foreground">
              {selectedTopic?.description ||
                "Choose a lesson from the list on the right."}
            </p>
          </div>
        </div>
      </div>

      {/* Topic list */}
      <aside className="lg:w-1/3 w-full bg-card flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm sm:text-base">Course Topics</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            {topics.length} lessons
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {topics.map((topic, index) => {
            const isSelected = selectedTopic?.id === topic.id;
            const isCompleted = isTopicCompleted(topic.id);
            const canWatch = topic.is_unlocked;

            return (
              <div
                key={topic.id}
                onClick={() => canWatch && setSelectedTopic(topic)}
                className={`relative flex gap-3 p-2.5 rounded-xl transition
                  ${
                    canWatch
                      ? "cursor-pointer hover:bg-accent/40"
                      : "opacity-60 cursor-not-allowed"
                  }
                  ${
                    isSelected
                      ? "bg-accent border border-primary/40"
                      : "border border-transparent"
                  }
                `}
              >
                <div className="relative shrink-0">
                  <Image
                    src={topic.thumbnail_img || "/placeholder.png"}
                    alt={topic.title}
                    width={150}
                    height={84}
                    className="rounded-lg object-cover w-32 h-[72px] sm:w-36 sm:h-20"
                  />
                  {!canWatch && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-emerald-500 bg-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm line-clamp-2">
                    {index + 1}. {topic.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{topic.duration_minutes} mins</span>
                  </div>
                </div>

                {isSelected && canWatch && (
                  <Play className="w-4 h-4 text-primary mt-1 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
