

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";

// // Layout
// import Sidebar from "@/components/admin/layout/Sidebar";
// import TopBar from "@/components/admin/layout/TopBar";

// // Modules
// import DashboardView from "@/components/admin/modules/dashboard/DashboardView";
// import StudentsView from "@/components/admin/modules/students/StudentsView";
// import TeachersView from "@/components/admin/modules/teachers/TeachersView";
// import ScheduleView from "@/components/admin/modules/schedule/ScheduleView";
// import ExamsView from "@/components/admin/modules/exams/ExamsView";
// import AttendenceView from "@/components/admin/modules/attendance/AttendenceView";
// import FeesView from "@/components/admin/modules/fees/FeesView";
// import ReportsView from "@/components/admin/modules/reports/ReportsView";
// import SettingsView from "@/components/admin/modules/settings/SettingsView";
// import EnquiriesView from "@/components/admin/modules/enquiries/EnquiriesView";
// import NotesView from "@/components/admin/modules/notes/NotesView";
// import HomeworkView from "@/components/admin/modules/homework/Homeworkview ";
// import AnnouncementsView from "@/components/admin/modules/announcements/AnnouncementsView";
// import WebinarsView from "@/components/admin/modules/webinars/Webinarsview ";
// import NotificationsView from "@/components/admin/modules/notifications/Notificationsview ";

// const NAVBAR_HEIGHT = 80;

// function renderPage(activeTab: string) {
//   switch (activeTab) {
//     case "dashboard":     return <DashboardView />;
//     case "students":      return <StudentsView />;
//     case "teachers":      return <TeachersView />;
//     case "schedule":      return <ScheduleView />;
//     case "exams":         return <ExamsView />;
//     case "attendance":    return <AttendenceView />;
//     case "fees":          return <FeesView />;
//     case "announcements": return <AnnouncementsView />;
//     case "enquiries":     return <EnquiriesView />;
//     case "webinars":      return <WebinarsView />;
//     case "notifications": return <NotificationsView />;
//     case "reports":       return <ReportsView />;
//     case "settings":      return <SettingsView />;
//     case "notes":         return <NotesView />;
//     case "homework":      return <HomeworkView />;
//     default:              return <div className="p-8 text-gray-400">Page not found.</div>;
//   }
// }

// export default function AdminDashboardPage() {
//   const [activeTab,      setActiveTab]      = useState("dashboard");
//   const [unreadCount,    setUnreadCount]    = useState(0);
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // ── Fetch unread notification count (for sidebar badge) ───────────────────
//   const fetchUnreadCount = useCallback(async () => {
//     try {
//       const res  = await fetch("/api/notifications?limit=1");
//       const data = await res.json();
//       setUnreadCount(data.unreadCount ?? 0);
//     } catch {}
//   }, []);

//   useEffect(() => {
//     fetchUnreadCount();
//     // Refresh count every 60s
//     const id = setInterval(fetchUnreadCount, 60_000);
//     return () => clearInterval(id);
//   }, [fetchUnreadCount]);

//   // Re-fetch when user navigates away from notifications (they may have read some)
//   useEffect(() => {
//     if (activeTab !== "notifications") fetchUnreadCount();
//   }, [activeTab]);

//   // ── Lock body scroll while admin panel is mounted ─────────────────────────
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   useEffect(() => {
//     if (!loading && user?.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return (
//       <div
//         className="fixed flex items-center justify-center bg-[#FFFDF7] z-40"
//         style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
//       >
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
//           <p className="text-sm font-semibold text-gray-400">Loading dashboard…</p>
//         </div>
//       </div>
//     );
//   }

//   if (user?.role !== "admin") return null;

//   return (
//     <div
//       className="fixed flex"
//       style={{
//         top:      NAVBAR_HEIGHT,
//         left:     0,
//         right:    0,
//         bottom:   0,
//         background: "#FFFDF7",
//         zIndex:   30,
//       }}
//     >
//       {/* Sidebar — passes unread count for bell badge */}
//       <div className="flex-shrink-0" style={{ width: 260, height: "100%" }}>
//         <Sidebar
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           notificationCount={unreadCount}
//         />
//       </div>

//       {/* Main column */}
//       <div className="flex flex-col flex-1 min-w-0" style={{ height: "100%", overflow: "hidden" }}>
//         {/* TopBar — bell icon opens dropdown; "View all" navigates to notifications tab */}
//         <div className="flex-shrink-0">
//           <TopBar
//             title={activeTab}
//             onNotificationsClick={() => setActiveTab("notifications")}
//           />
//         </div>

//         {/* Scrollable content */}
//         <main
//           className="flex-1 overflow-y-auto main-scroll"
//           style={{
//             padding: 24,
//             background: "#FFFDF7",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {renderPage(activeTab)}
//         </main>
//       </div>
//     </div>
//   );
// }











import DashboardView from "@/components/admin/modules/dashboard/DashboardView";

export default function Page() {
  return <DashboardView />;
}