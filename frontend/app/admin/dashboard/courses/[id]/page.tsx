/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { ArrowLeft, Plus, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Course, Topic } from "@/app/types/dashboardTypes";
import Image from "next/image";

export default function CourseDetails() {
  const params = useParams();
  const courseId = params.id as string;
  const { makeApiCall } = useAPICall();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicFormData, setTopicFormData] = useState({
    title: "",
    description: "",
    tags: "",
    video_url: "",
    thumbnail_img: "",
    duration_minutes: "",
    sequence_order: "",
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      const response = await makeApiCall(
        "GET",
        `${ApiEndPoints.GET_COURSE_BY_COURSE_ID}/${courseId}`,
        null,
        "application/json",
        token
      );

      const courseData = response?.data?.data?.course || response?.data?.course || response?.data;
      setCourse(courseData as Course);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, makeApiCall]);

  const fetchTopics = useCallback(async () => {
    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      const response = await makeApiCall(
        "GET",
        `${ApiEndPoints.GET_TOPICS_BY_COURSE}/${courseId}`,
        null,
        "application/json",
        token
      );

      const topicsData = response?.data?.topics || response?.topics || [];
      setTopics(topicsData as Topic[]);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }, [courseId, makeApiCall]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchTopics();
    }
  }, [courseId, fetchCourse, fetchTopics]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    setVideoFile(file);

    try {
      setUploadingVideo(true);
      const token = Cookies.get("admin_token");
      if (!token) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(ApiEndPoints.UPLOAD_VIDEO, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.data?.url) {
        setTopicFormData((prev) => ({ ...prev, video_url: result.data.url }));
      } else {
        alert("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  function getVideoDuration(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.preload = "metadata";
      video.src = url;
      video.crossOrigin = "anonymous";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration); // seconds
      };

      video.onerror = () => reject("Failed to load video metadata");
    });
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setThumbnailFile(file);

    try {
      setUploadingThumbnail(true);
      const token = Cookies.get("admin_token");
      if (!token) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(ApiEndPoints.UPLOAD_IMAGE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.data?.url) {
        setTopicFormData((prev) => ({ ...prev, thumbnail_img: result.data.url }));
      } else {
        alert("Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("admin_token");
      if (!token) return;

      let durationMinutes: number | null = null;

      if (topicFormData.video_url) {
        const durationSeconds = await getVideoDuration(topicFormData.video_url);

        durationMinutes = Math.ceil(durationSeconds / 60);
      }


      await makeApiCall(
        "POST",
        ApiEndPoints.ADMIN_CREATE_TOPIC,
        {
          course_id: courseId,
          ...topicFormData,
          duration_minutes: durationMinutes,
          sequence_order: topicFormData.sequence_order
            ? parseInt(topicFormData.sequence_order)
            : null,
        },
        "application/json",
        token
      );

      setShowTopicForm(false);
      setTopicFormData({
        title: "",
        description: "",
        tags: "",
        video_url: "",
        thumbnail_img: "",
        duration_minutes: "",
        sequence_order: "",
      });
      setVideoFile(null);
      setThumbnailFile(null);
      fetchTopics();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create topic");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Course not found</p>
        <Link href="/admin/dashboard/courses" className="text-primary hover:underline mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        href="/admin/dashboard/courses"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="bg-white rounded-xl border border-neutral-900 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {course.subject}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Class {course.subject_class}
            </p>
          </div>
          <button
            onClick={() => setShowTopicForm(!showTopicForm)}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Topic
          </button>
        </div>

        {course.description && (
          <p className="text-sm sm:text-base text-text-secondary mb-4">
            {course.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm">
          <span
            className={`px-3 py-1 rounded-full ${
              course.is_free
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {course.is_free ? "Free" : "Paid"}
          </span>
        </div>
      </div>

      {showTopicForm && (
        <div className="bg-white rounded-xl border border-neutral-900 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Add New Topic
          </h2>
          <form onSubmit={handleTopicSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Topic Title *
              </label>
              <input
                type="text"
                value={topicFormData.title}
                onChange={(e) =>
                  setTopicFormData({ ...topicFormData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Introduction to Algebra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={topicFormData.description}
                onChange={(e) =>
                  setTopicFormData({
                    ...topicFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Topic description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Video Upload
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-900 rounded-lg cursor-pointer hover:bg-bg-soft transition-colors">
                  <Upload className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    {uploadingVideo
                      ? "Uploading..."
                      : videoFile
                      ? videoFile.name
                      : "Upload Video"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                {topicFormData.video_url && (
                  <p className="text-xs text-green-600 mt-2">
                    Video uploaded successfully
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Thumbnail Image
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-900 rounded-lg cursor-pointer hover:bg-bg-soft transition-colors">
                  <Upload className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    {uploadingThumbnail
                      ? "Uploading..."
                      : thumbnailFile
                      ? thumbnailFile.name
                      : "Upload Thumbnail"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />
                </label>
                {topicFormData.thumbnail_img && (
                  <p className="text-xs text-green-600 mt-2">
                    Thumbnail uploaded successfully
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sequence Order
                </label>
                <input
                  type="number"
                  value={topicFormData.sequence_order}
                  onChange={(e) =>
                    setTopicFormData({
                      ...topicFormData,
                      sequence_order: e.target.value,
                    })
                  }
                  min="1"
                  className="w-full px-4 py-3 border border-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={topicFormData.tags}
                  onChange={(e) =>
                    setTopicFormData({ ...topicFormData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="algebra, equations, variables"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-neutral-900">
              <button
                type="submit"
                disabled={uploadingVideo || uploadingThumbnail}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadingVideo || uploadingThumbnail ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Create Topic"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTopicForm(false);
                  setTopicFormData({
                    title: "",
                    description: "",
                    tags: "",
                    video_url: "",
                    thumbnail_img: "",
                    duration_minutes: "",
                    sequence_order: "",
                  });
                }}
                className="px-6 py-3 border border-neutral-900 rounded-lg hover:bg-bg-soft transition-colors text-foreground"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-900 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {(topics.length <= 1) ? "Topic" : "Topics" } ({topics.length})
        </h2>
        {topics.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No topics yet. Add your first topic above.
          </p>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className="flex items-center gap-4 p-4 border border-neutral-900 rounded-lg hover:bg-bg-soft transition-colors"
              >
                  {topic.thumbnail_img && (
                    <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden">
                      <Image
                        src={topic.thumbnail_img}
                        alt={topic.title}
                        fill
                      />
                    </div>
                  )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-semibold text-text-secondary bg-bg-soft px-2 py-1 rounded">
                          {index + 1}
                        </h2>
                        <h3 className="font-semibold text-foreground">
                          {topic.title}
                        </h3>
                      </div>
                      {topic.description && (
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    {topic.duration_minutes && (
                      <span>{topic.duration_minutes} minutes</span>
                    )}
                    {topic.video_url && (
                      <span className="text-green-600">Video uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

