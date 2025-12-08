"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";

export default function NewCourse() {
  const router = useRouter();
  const { makeApiCall } = useAPICall();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    subject_class: "",
    description: "",
    tags: "",
    is_free: false,
    price: 0,
    thumbnail_url: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setThumbnailPreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);
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
        setFormData((prev) => ({ ...prev, thumbnail_url: result.data.url }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      await makeApiCall(
        "POST",
        ApiEndPoints.ADMIN_CREATE_COURSE,
        formData,
        "application/json",
        token
      );

      router.push("/admin/dashboard/courses");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? // @ts-expect-error partial axios shape
            error.response?.data?.message
          : error instanceof Error
            ? error.message
            : "Failed to create course";
      alert(message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/dashboard/courses"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Create New Course</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Course Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Class *
            </label>
            <input
              type="text"
              value={formData.subject_class}
              onChange={(e) => setFormData({ ...formData, subject_class: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 10, Plus One, Plus Two"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Course description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="math, algebra, geometry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thumbnail Image
          </label>
          <div className="space-y-4">
            {thumbnailPreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview("");
                    setFormData({ ...formData, thumbnail_url: "" });
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-bg-soft transition-colors">
              <Upload className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {uploadingImage ? "Uploading..." : "Upload Thumbnail"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_free}
                onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">Free Course</span>
            </label>
          </div>

          {!formData.is_free && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </button>
          <Link
            href="/admin/dashboard/courses"
            className="px-6 py-3 border border-border rounded-lg hover:bg-bg-soft transition-colors text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

