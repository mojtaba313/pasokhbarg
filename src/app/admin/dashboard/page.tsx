// app/admin/dashboard/page.tsx
"use client";
import StatisticsCards from "@/components/admin/StatisticsCards";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>
      <StatisticsCards />
    </div>
  );
}