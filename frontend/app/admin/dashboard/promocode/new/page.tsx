"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  Copy,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";
import Cookies from "js-cookie";

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number;
  uses: number;
  expires: string;
  description: string;
}

export default function PromoCodesPage() {
  const { makeApiCall } = useAPICall();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(
    null
  );
  const [formData, setFormData] = useState({
    code: "",
    discount_percent: 10,
    max_uses: 100,
    expires: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch all promo codes
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("admin_token");
      if (!token) return;

      const response = await makeApiCall(
        "GET",
        ApiEndPoints.ADMIN_GET_PROMOCODES,
        null,
        "application/json",
        token
      );

      const codes = response?.data?.data || response?.data || [];
      setPromoCodes(codes);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter promo codes
  const filteredPromoCodes = promoCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create/Update promo code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const token = Cookies.get("admin_token");
      if (!token) throw new Error("Admin token not found");

      const payload = {
        code: formData.code.trim().toUpperCase(),
        discount_percent: parseInt(formData.discount_percent.toString()),
        max_uses: parseInt(formData.max_uses.toString()),
        expires: formData.expires,
        description: formData.description.trim(),
      };

      let response;
      if (editingPromoCode) {
        // Update
        response = await makeApiCall(
          "PUT",
          `${ApiEndPoints.ADMIN_UPDATE_PROMOCODE}/${editingPromoCode.id}`,
          payload,
          "application/json",
          token
        );
      } else {
        // Create
        response = await makeApiCall(
          "POST",
          ApiEndPoints.ADMIN_CREATE_PROMOCODE,
          payload,
          "application/json",
          token
        );
      }

      if (response?.success || response?.data?.success) {
        fetchPromoCodes();
        resetForm();
        setShowCreateModal(false);
        setEditingPromoCode(null);
      } else {
        setFormError("Failed to save promo code");
      }
    } catch (error) {
      console.error("Error saving promo code:", error);
      setFormError("Failed to save promo code. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete promo code
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;

    try {
      const token = Cookies.get("admin_token");
      const response = await makeApiCall(
        "DELETE",
        `${ApiEndPoints.ADMIN_DELETE_PROMOCODE}/${id}`,
        {},
        "application/json",
        token
      );

      if (response?.success || response?.data?.success) {
        fetchPromoCodes();
      }
    } catch (error) {
      console.error("Error deleting promo code:", error);
      alert("Failed to delete promo code");
    }
  };

  // Edit promo code
  const handleEdit = (promoCode: PromoCode) => {
    setFormData({
      code: promoCode.code,
      discount_percent: promoCode.discount_percent,
      max_uses: promoCode.max_uses,
      expires: promoCode.expires,
      description: promoCode.description,
    });
    setEditingPromoCode(promoCode);
    setShowCreateModal(true);
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      discount_percent: 10,
      max_uses: 100,
      expires: "",
      description: "",
    });
    setFormError("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-neutral-800 p-6 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-24 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Tag className="w-10 h-10 text-primary" />
            Promo Codes
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage discount codes for your courses
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPromoCode(null);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search promo codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-neutral-800 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              {filteredPromoCodes.length}
            </span>{" "}
            codes
          </p>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromoCodes.map((promoCode) => (
          <div
            key={promoCode.id}
            className="bg-card rounded-2xl border border-neutral-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground" aria-label={promoCode.code}>
                    {promoCode.code.length > 8
                      ? `${promoCode.code.slice(0, 8)}...`
                      : promoCode.code}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {promoCode.description || "No description"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(promoCode.code)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(promoCode)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(promoCode.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-semibold text-primary">
                  {promoCode.discount_percent}% OFF
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Max Uses</span>
                <span
                  className={`font-semibold ${
                    promoCode.uses >= promoCode.max_uses
                      ? "text-red-500"
                      : "text-foreground"
                  }`}
                >
                  {promoCode.uses}/{promoCode.max_uses}
                </span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expires</span>
                <span
                  className={`font-semibold ${
                    new Date(promoCode.expires).getTime() < Date.now()
                      ? "text-red-500"
                      : "text-emerald-600"
                  }`}
                >
                  {new Date(promoCode.expires).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPromoCodes.length === 0 && !loading && (
        <div className="text-center py-24">
          <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-foreground mb-2">
            No promo codes found
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first discount code to get started
          </p>
          <button
            onClick={() => {
              resetForm();
              setEditingPromoCode(null);
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create First Promo Code
          </button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-neutral-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingPromoCode ? "Edit Promo Code" : "Create Promo Code"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                    setEditingPromoCode(null);
                  }}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="SAVE20"
                    className="w-full px-4 py-3 border border-neutral-800 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={formData.discount_percent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_percent: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-neutral-800 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_uses: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    className="w-full px-4 py-3 border border-neutral-800 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div> */}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expires
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={formData.expires}
                    onChange={(e) =>
                      setFormData({ ...formData, expires: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-neutral-800 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Special offer for students..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-800 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-vertical"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {editingPromoCode ? "Update Code" : "Create Code"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                    setEditingPromoCode(null);
                  }}
                  disabled={formLoading}
                  className="px-6 py-3 border border-neutral-800 rounded-xl text-foreground hover:bg-accent disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
