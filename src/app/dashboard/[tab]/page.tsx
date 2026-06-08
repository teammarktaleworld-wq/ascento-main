

"use client";

import { useParams, useRouter } from "next/navigation";

import DashboardPage from "@/components/userdashboard/DashboardPage";
import AnnouncementsPage from "@/components/userdashboard/AnnouncementsPage";
import SchedulePage from "@/components/userdashboard/SchedulePage";
import NotesPage from "@/components/userdashboard/NotesPage";
import HomeworkFilesPage from "@/components/userdashboard/HomeworkFilesPage";
import AttendancePage from "@/components/userdashboard/AttendancePage";
import ExamsPage from "@/components/userdashboard/ExamsPage";
import FeesPage from "@/components/userdashboard/FeesPage";
import ProfilePage from "@/components/userdashboard/ProfilePage";
import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TabPage() {
  const params = useParams();
  const router = useRouter();
  const tab = (params?.tab as string) || "home";

  const sharedProps = {
    greeting: getGreeting(),
    attendancePct: 82,
    onNavigate: (page: string) => router.push(`/dashboard/${page}`),
    onToast: (msg: string) => {
      const el = document.createElement("div");
      el.textContent = msg;
      Object.assign(el.style, {
        position: "fixed", bottom: "24px", left: "50%",
        transform: "translateX(-50%)",
        background: "#1A1A2E", color: "#fff",
        padding: "10px 20px", borderRadius: "12px",
        fontSize: "13px", fontWeight: "600",
        zIndex: "9999", boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      });
      document.body.appendChild(el);
      setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity 0.3s"; }, 2200);
      setTimeout(() => el.remove(), 2500);
    },
  };

  switch (tab) {
    case "home": return <DashboardPage     {...sharedProps} />;
    case "announcements": return <AnnouncementsPage {...sharedProps} />;
    case "schedule": return <SchedulePage      {...sharedProps} />;
    case "notes": return <NotesPage         {...sharedProps} />;
    case "homework": return <HomeworkFilesPage />;
    case "attendance": return <AttendancePage    {...sharedProps} />;
    case "exams": return <ExamsPage          />;
    case "fees": return <FeesPage          {...sharedProps} />;
    case "profile": return <ProfilePage       {...sharedProps} />;
    case "notifications": return <NotificationsView />;
    default: return <DashboardPage     {...sharedProps} />;
  }
}