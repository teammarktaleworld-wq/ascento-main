

// "use client";

// import { useParams, useRouter } from "next/navigation";

// import DashboardPage from "@/components/userdashboard/DashboardPage";
// import AnnouncementsPage from "@/components/userdashboard/AnnouncementsPage";
// import SchedulePage from "@/components/userdashboard/SchedulePage";
// import NotesPage from "@/components/userdashboard/NotesPage";
// import HomeworkFilesPage from "@/components/userdashboard/HomeworkFilesPage";
// import AttendancePage from "@/components/userdashboard/AttendancePage";
// import ExamsPage from "@/components/userdashboard/ExamsPage";
// import FeesPage from "@/components/userdashboard/FeesPage";
// import ProfilePage from "@/components/userdashboard/ProfilePage";
// import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";

// function getGreeting() {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// }

// export default function TabPage() {
//   const params = useParams();
//   const router = useRouter();
//   const tab = (params?.tab as string) || "home";

//   const sharedProps = {
//     greeting: getGreeting(),
//     attendancePct: 82,
//     onNavigate: (page: string) => router.push(`/dashboard/${page}`),
//     onToast: (msg: string) => {
//       const el = document.createElement("div");
//       el.textContent = msg;
//       Object.assign(el.style, {
//         position: "fixed", bottom: "24px", left: "50%",
//         transform: "translateX(-50%)",
//         background: "#1A1A2E", color: "#fff",
//         padding: "10px 20px", borderRadius: "12px",
//         fontSize: "13px", fontWeight: "600",
//         zIndex: "9999", boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
//       });
//       document.body.appendChild(el);
//       setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity 0.3s"; }, 2200);
//       setTimeout(() => el.remove(), 2500);
//     },
//   };

//   switch (tab) {
//     case "home": return <DashboardPage     {...sharedProps} />;
//     case "announcements": return <AnnouncementsPage {...sharedProps} />;
//     case "schedule": return <SchedulePage      {...sharedProps} />;
//     case "notes": return <NotesPage         {...sharedProps} />;
//     case "homework": return <HomeworkFilesPage />;
//     case "attendance": return <AttendancePage    {...sharedProps} />;
//     case "exams": return <ExamsPage          />;
//     case "fees": return <FeesPage          {...sharedProps} />;
//     case "profile": return <ProfilePage       {...sharedProps} />;
//     case "notifications": return <NotificationsView />;
//     default: return <DashboardPage     {...sharedProps} />;
//   }
// }








// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// import DashboardPage from "@/components/userdashboard/DashboardPage";
// import AnnouncementsPage from "@/components/userdashboard/AnnouncementsPage";
// import SchedulePage from "@/components/userdashboard/SchedulePage";
// import NotesPage from "@/components/userdashboard/NotesPage";
// import HomeworkFilesPage from "@/components/userdashboard/HomeworkFilesPage";
// import AttendancePage from "@/components/userdashboard/AttendancePage";
// import ExamsPage from "@/components/userdashboard/ExamsPage";
// import FeesPage from "@/components/userdashboard/FeesPage";
// import ProfilePage from "@/components/userdashboard/ProfilePage";
// import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";

// function getGreeting() {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// }

// export default function TabPage() {
//   const params  = useParams();
//   const router  = useRouter();
//   const { user } = useAuth(); // ← get user so we can pass token down
//   const tab = (params?.tab as string) || "home";

//   // ── Toast helper ───────────────────────────────────────────────────────────
//   const onToast = (msg: string, type: "success" | "error" = "success") => {
//     const el = document.createElement("div");
//     el.textContent = msg;
//     Object.assign(el.style, {
//       position: "fixed", bottom: "24px", left: "50%",
//       transform: "translateX(-50%)",
//       background: type === "error" ? "#DC2626" : "#1A1A2E",
//       color: "#fff", padding: "10px 20px", borderRadius: "12px",
//       fontSize: "13px", fontWeight: "600",
//       zIndex: "9999", boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
//       transition: "opacity 0.3s",
//     });
//     document.body.appendChild(el);
//     setTimeout(() => { el.style.opacity = "0"; }, 2200);
//     setTimeout(() => el.remove(), 2500);
//   };

//   const sharedProps = {
//     greeting: getGreeting(),
//     attendancePct: 82,
//     onNavigate: (page: string) => router.push(`/dashboard/${page}`),
//     onToast,
//   };

//   // ── key=tab forces clean remount when switching tabs ───────────────────────
//   // Prevents stale data from one tab bleeding into another
//   const tabKey = `${user?.id ?? "guest"}-${tab}`;

//   switch (tab) {
//     case "home":          return <DashboardPage       key={tabKey} {...sharedProps} />;
//     case "announcements": return <AnnouncementsPage   key={tabKey} {...sharedProps} />;
//     case "schedule":      return <SchedulePage         key={tabKey} {...sharedProps} />;
//     case "notes":         return <NotesPage            key={tabKey} {...sharedProps} />;
//     case "homework":      return <HomeworkFilesPage    key={tabKey} />;
//     case "attendance":    return <AttendancePage       key={tabKey} {...sharedProps} />;
//     case "exams":         return <ExamsPage            key={tabKey} />;
//     case "fees":          return <FeesPage             key={tabKey} {...sharedProps} />;
//     case "profile":       return <ProfilePage          key={tabKey} {...sharedProps} />;
//     case "notifications": return <NotificationsView    key={tabKey} />;
//     default:              return <DashboardPage        key={tabKey} {...sharedProps} />;
//   }
// }











"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import DashboardPage from "@/components/userdashboard/DashboardPage";
import AnnouncementsPage from "@/components/userdashboard/AnnouncementsPage";
import SchedulePage from "@/components/userdashboard/SchedulePage";
import NotesPage from "@/components/userdashboard/NotesPage";
import HomeworkFilesPage from "@/components/userdashboard/HomeworkFilesPage";
import AttendancePage from "@/components/userdashboard/AttendancePage";
import ExamsPage from "@/components/userdashboard/ExamsPage";
import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";
import UserExamDashboard from "@/components/userdashboard/UserExamDashboard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TabPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth(); // ← token available for any child that needs it
  const tab = (params?.tab as string) || "home";

  const onToast = (msg: string, type: "success" | "error" = "success") => {
    const el = document.createElement("div");
    el.textContent = msg;
    Object.assign(el.style, {
      position: "fixed", bottom: "24px", left: "50%",
      transform: "translateX(-50%)",
      background: type === "error" ? "#DC2626" : "#1A1A2E",
      color: "#fff", padding: "10px 20px", borderRadius: "12px",
      fontSize: "13px", fontWeight: "600",
      zIndex: "9999", boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      transition: "opacity 0.3s",
    });
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; }, 2200);
    setTimeout(() => el.remove(), 2500);
  };

  const sharedProps = {
    greeting: getGreeting(),
    attendancePct: 82,
    onNavigate: (page: string) => router.push(`/dashboard/${page}`),
    onToast,
  };

  // user.id in key ensures stale state never survives a user switch
  // tab in key ensures each tab mounts fresh (no data bleed between tabs)
  const tabKey = `${user?.id ?? "guest"}-${tab}`;

  switch (tab) {
    case "home": return <DashboardPage key={tabKey} {...sharedProps} />;
    case "announcements": return <AnnouncementsPage key={tabKey} {...sharedProps} />;
    case "schedule": return <SchedulePage key={tabKey} {...sharedProps} />;
    case "notes": return <NotesPage key={tabKey} {...sharedProps} />;
    case "homework": return <HomeworkFilesPage key={tabKey} />;
    case "attendance": return <AttendancePage key={tabKey} {...sharedProps} />;
    case "exams": return <ExamsPage key={tabKey} />;
    case "notifications": return <NotificationsView key={tabKey} />;
    case "user-exams":
      return (
        <UserExamDashboard
          key={tabKey}
          user={user}
          token={token}
        />
      );
    default: return <DashboardPage key={tabKey} {...sharedProps} />;


  }
}