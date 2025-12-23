"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { useParams } from "next/navigation";
import {
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  Lock,
  Loader2,
} from "lucide-react";
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

  // 👇 NEW: Video streaming states
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

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

      // ✅ pick first unlocked topic
      const firstPlayable = topicData.find((t: Topic) => t.is_unlocked);
      if (firstPlayable) setSelectedTopic(firstPlayable);
    } catch (e) {
      console.error("Error fetching topics:", e);
    } finally {
      setLoading(false);
    }
  }, [courseId, user?.id, makeApiCall]);

  // 👇 NEW: Load authenticated video stream
  const loadVideoStream = useCallback(async () => {
    if (!selectedTopic?.id || !user?.id) {
      setVideoSrc(null);
      return;
    }

    try {
      setIsLoadingVideo(true);
      setVideoError(null);

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // 👇 Dynamic API base URL (localhost vs production)
      const API_BASE =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "https://jain-wycd.onrender.com";

      const streamUrl = `${API_BASE}/api/v1/topics/${user.id}/video/${selectedTopic.id}/stream`;

      const response = await fetch(streamUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Range: "bytes=0-", // ✅ Enable video seeking (206 Partial Content)
        },
        credentials: "include", // Fallback for cookies
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stream failed: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Cleanup previous blob
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }

      setVideoSrc(url);
    } catch (error) {
      console.error("Video stream error:", error);
      setVideoError(
        error instanceof Error ? error.message : "Failed to load video"
      );
      setVideoSrc(null);
    } finally {
      setIsLoadingVideo(false);
    }
  }, [selectedTopic?.id, user?.id, videoSrc]);

  // 👇 Load topics on mount
  useEffect(() => {
    if (!authLoading) getTopics();
  }, [authLoading, getTopics]);

  // 👇 Load video when topic changes
  useEffect(() => {
    if (selectedTopic?.is_unlocked) {
      loadVideoStream();
    } else {
      setVideoSrc(null);
      setVideoError(null);
    }
  }, [selectedTopic?.id, loadVideoStream]);

  // 👇 Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  // 👇 Video end handler
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !selectedTopic) return;

    const handleEnded = () => {
      setCompletedTopics(
        (prev) => new Set([...Array.from(prev), selectedTopic.id])
      );

      const currentIndex = topics.findIndex((t) => t.id === selectedTopic.id);
      const nextTopic = topics[currentIndex + 1];

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
          <p className="text-sm text-muted-foreground">Loading course...</p>
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
              <div className="w-full aspect-video">
                {isLoadingVideo ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/50 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm">Loading video...</span>
                  </div>
                ) : videoError ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/70 gap-2">
                    <Lock className="w-12 h-12 opacity-50" />
                    <p className="text-sm text-center max-w-md">{videoError}</p>
                  </div>
                ) : videoSrc ? (
                  <video
                    key={selectedTopic.id}
                    ref={videoRef}
                    src={videoSrc} // ✅ Authenticated blob URL
                    controls
                    autoPlay
                    className="w-full h-full bg-black"
                    onError={(e) => {
                      console.error("Video playback error:", e);
                      setVideoError("Video playback failed");
                      setVideoSrc(null);
                    }}
                    preload="metadata"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/50">
                    Preparing video...
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-black/90">
                <Lock className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-2">
              {selectedTopic?.title || "Select a topic"}
            </h2>
            {selectedTopic && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>{selectedTopic.duration_minutes} mins</span>
              </div>
            )}
            <p className="text-muted-foreground">
              {selectedTopic?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Topics Sidebar */}
      <aside className="lg:w-1/3 w-full bg-card flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold">Course Topics</h3>
          <p className="text-xs text-muted-foreground">
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
                className={`flex gap-3 p-2.5 rounded-xl transition-all duration-200
                  ${
                    canWatch
                      ? "cursor-pointer hover:bg-accent/40 hover:shadow-sm"
                      : "opacity-60 cursor-not-allowed"
                  }
                  ${
                    isSelected
                      ? "bg-accent border-2 border-primary/40 shadow-md"
                      : ""
                  }
                `}
              >
                <div className="relative shrink-0">
                  <Image
                    src={topic.thumbnail_img || " "}
                    alt={topic.title}
                    width={150}
                    height={84}
                    className="rounded-lg object-cover w-32 h-[72px]"
                    loading="lazy"
                  />
                  {!canWatch && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-emerald-500 bg-white rounded-full shadow-sm" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                    {index + 1}. {topic.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{topic.duration_minutes} mins</span>
                  </div>
                </div>

                {isSelected && canWatch && (
                  <Play className="w-4 h-4 text-primary mt-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
