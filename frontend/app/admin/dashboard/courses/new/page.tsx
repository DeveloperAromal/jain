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

  // ✅ FIXED: use cover_image instead of thumbnail_url
  const [formData, setFormData] = useState({
    subject: "",
    subject_class: "",
    description: "",
    tags: "",
    cover_image: "",
  });

  const [coverPreview, setCoverPreview] = useState<string>("");

  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // preview immediately
    setCoverPreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);

      const token = Cookies.get("admin_token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const response = await fetch(ApiEndPoints.UPLOAD_IMAGE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        // ✅ FIXED: save to cover_image
        setFormData((prev) => ({
          ...prev,
          cover_image: result.data.url,
        }));
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

  // ================= FORM SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      // Optional validation
      if (!formData.cover_image) {
        alert("Please upload a course cover image");
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

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/dashboard/courses"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
        Create New Course
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-border p-6 sm:p-8 space-y-6"
      >
        {/* SUBJECT + CLASS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Class *</label>

            <select
              value={formData.subject_class}
              onChange={(e) =>
                setFormData({ ...formData, subject_class: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="" disabled>
                Select Class
              </option>

              <option value="10">10</option>
              <option value="11">+1</option>
              <option value="12">+2</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* TAGS */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* COVER IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Course Cover Image
          </label>

          <div className="space-y-4">
            {coverPreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview("");
                    setFormData({ ...formData, cover_image: "" });
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-5 h-5" />
              <span className="text-sm">
                {uploadingImage ? "Uploading..." : "Upload Cover Image"}
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

        {/* FREE / PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_free}
              onChange={(e) =>
                setFormData({ ...formData, is_free: e.target.checked })
              }
              className="w-5 h-5"
            />
            Free Course
          </label> */}

          {/* {!formData.is_free && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          )} */}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="px-6 py-3 bg-primary text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
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
            className="px-6 py-3 border rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
