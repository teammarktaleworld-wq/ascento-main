






"use client";

import { useEffect, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import Sidebar from "@/components/admin/layout/Sidebar";
import TopBar from "@/components/admin/layout/TopBar";

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
import HomeworkView from "@/components/admin/modules/homework/Homeworkview ";
import AnnouncementsView from "@/components/admin/modules/announcements/AnnouncementsView";
import WebinarsView from "@/components/admin/modules/webinars/Webinarsview ";
import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";
import UsersView from "@/components/admin/modules/users/UsersView";
import NotesLibraryAdmin from "@/components/admin/modules/notes/NotesLibraryAdmin";

const NAVBAR_HEIGHT = 80;

function renderPage(tab: string) {
  switch (tab) {
    case "users":
      return <UsersView />;
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
    case "announcements":
      return <AnnouncementsView />;
    case "enquiries":
      return <EnquiriesView />;
    case "webinars":
      return <WebinarsView />;
    case "notifications":
      return <NotificationsView />;
    case "reports":
      return <ReportsView />;
    case "settings":
      return <SettingsView />;
    case "notes":
      return <NotesLibraryAdmin />;
    case "homework":
      return <HomeworkView />;
    default:
      return <DashboardView />;
  }
}

export default function AdminDashboardPage() {
  const params = useParams();
  const tab = (params?.tab as string) || "dashboard";

  const [unreadCount, setUnreadCount] = useState(0);

  const { user, loading } = useAuth();
  const router = useRouter();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=1");
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch { }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(id);
  }, [fetchUnreadCount]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="fixed flex items-center justify-center bg-[#FFFDF7]"
        style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  return (
    <div
      className="fixed flex"
      style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
    >
      <Sidebar notificationCount={unreadCount} />  {/* ✅ removed activeTab */}

      <div className="flex flex-col flex-1">
        <TopBar
          title={tab}
          onNotificationsClick={() =>
            router.push("/admin/dashboard/notifications")
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderPage(tab)}
        </main>
      </div>
    </div>
  );
}