"use client";

import { useEffect, useState } from "react";
import { useAPICall } from "@/app/hooks/useApiCall";
import { ApiEndPoints } from "@/app/config/Backend";
import { Book, Tag, Users, TrendingUp } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function AdminDashboard() {
  const { makeApiCall } = useAPICall();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalPromoCodes: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("admin_token");
        if (!token) return;

        const [coursesRes] = await Promise.all([
          makeApiCall("GET", ApiEndPoints.ADMIN_GET_ALL_COURSES, null, "application/json", token),
        ]);

        const courses = coursesRes?.data?.courses || coursesRes?.data?.data?.courses || [];
        setStats({
          totalCourses: courses.length,
          totalPromoCodes: 0,
          totalUsers: 0,
          totalRevenue: 0,
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
      icon: Book,
      color: "bg-blue-500",
      link: "/admin/dashboard/courses",
    },
    {
      title: "Promo Codes",
      value: stats.totalPromoCodes,
      icon: Tag,
      color: "bg-green-500",
      link: "/admin/dashboard/promocodes",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-text-secondary">Manage courses, topics, and promo codes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const content = (
            <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </p>
            </div>
          );

          return stat.link ? (
            <Link key={index} href={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/dashboard/courses/new"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-bg-soft transition-colors"
            >
              <Book className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Create New Course</p>
                <p className="text-sm text-text-secondary">Add a new course to the platform</p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard/promocodes/new"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-bg-soft transition-colors"
            >
              <Tag className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Create Promo Code</p>
                <p className="text-sm text-text-secondary">Add a discount code for users</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <p className="text-text-secondary">No recent activity</p>
        </div>
      </div>
    </div>
  );
}

