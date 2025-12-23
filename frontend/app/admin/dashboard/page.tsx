"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import {
  Book,
  Tag,
  Users,
  TrendingUp,
  Plus,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function AdminDashboard() {
  const { makeApiCall } = useAPICall();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    paidUsers: 0,
    nonPaidUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("admin_token");
        if (!token) return;

        const statusRes = await makeApiCall(
          "GET",
          ApiEndPoints.GET_ALL_STATUS,
          null,
          "application/json",
          token
        );

        const [coursesRes] = await Promise.all([
          makeApiCall(
            "GET",
            ApiEndPoints.ADMIN_GET_ALL_COURSES,
            null,
            "application/json",
            token
          ),
        ]);

        const statusData = statusRes?.data.data || statusRes?.data?.data || {};
        const courses =
          coursesRes?.data?.courses || coursesRes?.data?.data?.courses || [];

        setStats({
          totalCourses: courses.length,
          totalUsers: statusData.totalUsers || 0,
          paidUsers: statusData.paidUsers || 0,
          nonPaidUsers: statusData.nonPaidUsers || 0,
          totalRevenue: statusData.totalRevenue || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [makeApiCall]);

  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      change: "+12%",
      icon: Book,
      color: "from-blue-500 to-blue-600",
      link: "/admin/courses",
    },
    {
      title: "Total Users",
      value: stats.totalUsers?.toLocaleString() || 0,
      change: "+8%",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Paid Users",
      value: stats.paidUsers,
      change: "+15%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${(stats.totalRevenue / 1000).toLocaleString()}K`,
      change: "+22%",
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-6 animate-pulse"
            >
              <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage courses, users, and subscriptions
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.link || "#"} className="group">
              <div className="group bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}
                  >
                    <Icon
                      className={`w-6 h-6 ${stat.color
                        .replace("from-", "text-")
                        .replace("to-", "/to-")}`}
                    />
                  </div>
                  <div className="flex items-center text-xs font-medium">
                    <span
                      className={`mr-1 ${
                        stat.change.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.change.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-foreground transition-colors">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/courses/new"
              className="group flex items-center gap-4 p-6 border border-border rounded-xl hover:shadow-lg hover:border-primary/50 transition-all"
            >
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary mb-1">
                  Create Course
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add new course content
                </p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard/promocode/new"
              className="group flex items-center gap-4 p-6 border border-border rounded-xl hover:shadow-lg hover:border-primary/50 transition-all"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all">
                <Tag className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-emerald-600 mb-1">
                  Promo Code
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate discount codes
                </p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard/students"
              className="group flex items-center gap-4 p-6 border border-border rounded-xl hover:shadow-lg hover:border-primary/50 transition-all md:col-span-2"
            >
              <div className="p-3 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-all">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-orange-600 mb-1">
                  Manage Users
                </h3>
                <p className="text-sm text-muted-foreground">
                  View {stats.paidUsers} paid, {stats.nonPaidUsers} free users
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Revenue</h2>
          </div>
          <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center mb-6">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                ₹{(stats.totalRevenue / 1000).toLocaleString()}K total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
