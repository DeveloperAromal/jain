"use client";

import { useEffect, useState, useCallback } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  Users,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";
import Cookies from "js-cookie";

interface Student {
  id?: string;
  name: string;
  phone: string;
  email: string;
  subscription_active: boolean;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function StudentsPage() {
  const { makeApiCall } = useAPICall();
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Fetch students with pagination
  const fetchStudents = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const token = Cookies.get("admin_token");
        if (!token) return;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(search && { search }),
        });

        const response = await makeApiCall(
          "GET",
          `${ApiEndPoints.GET_ALL_STUDENTS}?${params.toString()}`,
          null,
          "application/json",
          token
        );

        const data = response?.data?.data || response?.data || [];
        const pag = response?.data?.pagination || {
          page,
          limit: 10,
          total: data.length,
          totalPages: 1,
        };

        setStudents(data);
        setPagination(pag);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    },
    [makeApiCall, pagination.limit]
  );

  useEffect(() => {
    fetchStudents(1, searchQuery);
  }, [fetchStudents, searchQuery]);

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchStudents(page, searchQuery);
    }
  };

  // Select all rows
  const toggleSelectAll = () => {
    if (selectedRows.size === students.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(
        new Set(students.map((student) => student.id || student.email))
      );
    }
  };

  // Row selection
  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Export CSV (placeholder)
  const exportCSV = () => {
    const headers =
      "Name,Email,Phone,Subscription Active,Start Date,End Date\n";
    const csv =
      headers +
      students
        .map(
          (s) =>
            `"${s.name}","${s.email}","${s.phone}",${s.subscription_active},"${
              s.subscription_start_date || ""
            }","${s.subscription_end_date || ""}"`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading && students.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-xl w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-6 h-48"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-primary" />
            Students
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage {pagination.total.toLocaleString()} total students
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <span>| {students.length} shown</span>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 font-semibold text-foreground text-left">
                  SI
                </th>
                <th className="p-4 text-left font-semibold text-foreground">
                  Student
                </th>
                <th className="p-4 text-left font-semibold text-foreground">
                  Contact
                </th>
                <th className="p-4 text-left font-semibold text-foreground">
                  Subscription
                </th>
                <th className="p-4 text-left font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student, index) => (
                <tr
                  key={student.id || student.email}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                   {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {student.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {student.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{student.phone || "—"}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      {student.subscription_active ? (
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <UserX className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          student.subscription_active
                            ? "font-semibold text-emerald-600"
                            : "text-muted-foreground"
                        }
                      >
                        {student.subscription_active ? "Premium" : "Free"}
                      </span>
                    </div>
                    {student.subscription_start_date && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          student.subscription_start_date
                        ).toLocaleDateString()}{" "}
                        -
                        {student.subscription_end_date && (
                          <>
                            {" "}
                            {new Date(
                              student.subscription_end_date
                            ).toLocaleDateString()}
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.subscription_active
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {student.subscription_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {students.length === 0 && !loading && (
          <div className="text-center py-24 border-t border-border">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No students found
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms."
                : "No students have signed up yet."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total.toLocaleString()} students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum =
                    pagination.page <= 3
                      ? i + 1
                      : pagination.totalPages - 4 + i;
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pagination.page === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-foreground border border-border"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
