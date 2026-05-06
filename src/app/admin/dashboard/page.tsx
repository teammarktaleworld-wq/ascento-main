"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Layout
import Sidebar from "@/components/admin/layout/Sidebar";
import TopBar from "@/components/admin/layout/TopBar";

// Modules
import DashboardView from "@/components/admin/modules/dashboard/DashboardView";
import StudentsView from "@/components/admin/modules/students/StudentsView";
import TeachersView from "@/components/admin/modules/teachers/TeachersView";
import ScheduleView from "@/components/admin/modules/schedule/ScheduleView";
import ExamsView from "@/components/admin/modules/exams/ExamsView";
import AttendenceView from "@/components/admin/modules/attendance/AttendenceView";
import FeesView from "@/components/admin/modules/fees/FeesView";
import ReportsView from "@/components/admin/modules/reports/ReportsView";
import SettingsView from "@/components/admin/modules/settings/SettingsView";
import EnquiriesView from "@/components/admin/modules/enquiries/EnquiriesView";
import { useRouter } from "next/navigation"; 
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

 const { user, loading } = useAuth();
  const router = useRouter();

  // 🔥 REDIRECT IF NOT ADMIN
  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/"); // 👈 redirect
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  if (user?.role !== "admin") return null; // prevent flicker

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;

      case "students":
        return <StudentsView />;

      case "teachers":
        return <TeachersView />;

      case "schedule":
        return <ScheduleView />;

      case "exams":
        return <ExamsView />;

      case "attendance":
        return <AttendenceView />;

      case "fees":
        return <FeesView />;

      case "enquiries":
        return <EnquiriesView />;

      case "reports":
        return <ReportsView />;

      case "settings":
        return <SettingsView />;

      default:
        return <div>Not Found</div>;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-[#FFFDF7]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 ml-[260px] flex flex-col">
        {/* Topbar */}
        <TopBar title={activeTab} />

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}