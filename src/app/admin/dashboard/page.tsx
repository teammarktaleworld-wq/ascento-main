







// "use client";

// import { useEffect, useState } from "react";
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

// // ── Public navbar height — must match your Navbar component ──────────────────
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
//     case "reports":       return <ReportsView />;
//     case "settings":      return <SettingsView />;
//     case "notes":         return <NotesView />;
//     case "homework":      return <HomeworkView />;
//     default:              return <div className="p-8 text-gray-400">Page not found.</div>;
//   }
// }

// export default function AdminDashboardPage() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user?.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   // ── Loading splash ────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div
//         className="flex items-center justify-center bg-[#FFFDF7]"
//         style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, marginTop: NAVBAR_HEIGHT }}
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
//     /*
//      * Root shell:
//      * - fills the viewport below the fixed public navbar
//      * - overflow:hidden on the shell prevents double scrollbars
//      * - NO isolation / transform — allows fixed-position toasts & modals to escape
//      */
//     <div
//       className="flex"
//       style={{
//         height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//         marginTop: NAVBAR_HEIGHT,
//         background: "#FFFDF7",
//         // deliberate: no overflow:hidden here so fixed children escape correctly
//       }}
//     >
//       {/* ── Sidebar ──────────────────────────────────────────────────────────
//           - sticky top:0 so it scrolls only its own content
//           - height: 100% fills the shell
//           - flex-shrink:0 prevents it from being squashed
//       */}
//       <div
//         className="flex-shrink-0"
//         style={{
//           width: 260,
//           height: "100%",
//           position: "sticky",
//           top: 0,
//           // overflow visible on wrapper — actual scroll is inside <Sidebar>
//         }}
//       >
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       </div>

//       {/* ── Main column ──────────────────────────────────────────────────── */}
//       <div
//         className="flex flex-col flex-1 min-w-0"
//         style={{ height: "100%", overflow: "hidden" }}
//       >
//         {/* TopBar: fixed height, never scrolls */}
//         <div className="flex-shrink-0">
//           <TopBar title={activeTab} />
//         </div>

//         {/* Content: only this area scrolls */}
//         <main
//           className="flex-1 overflow-y-auto"
//           style={{
//             padding: 24,
//             background: "#FFFDF7",
//             // webkit momentum scrolling on iOS
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {renderPage(activeTab)}
//         </main>
//       </div>
//     </div>
//   );
// }















"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import NotesView from "@/components/admin/modules/notes/NotesView";
import HomeworkView from "@/components/admin/modules/homework/Homeworkview ";
import AnnouncementsView from "@/components/admin/modules/announcements/AnnouncementsView";

// Your public navbar height
const NAVBAR_HEIGHT = 80;

function renderPage(activeTab: string) {
  switch (activeTab) {
    case "dashboard":     return <DashboardView />;
    case "students":      return <StudentsView />;
    case "teachers":      return <TeachersView />;
    case "schedule":      return <ScheduleView />;
    case "exams":         return <ExamsView />;
    case "attendance":    return <AttendenceView />;
    case "fees":          return <FeesView />;
    case "announcements": return <AnnouncementsView />;
    case "enquiries":     return <EnquiriesView />;
    case "reports":       return <ReportsView />;
    case "settings":      return <SettingsView />;
    case "notes":         return <NotesView />;
    case "homework":      return <HomeworkView />;
    default:              return <div className="p-8 text-gray-400">Page not found.</div>;
  }
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const router = useRouter();

  // ── Prevent the page body from scrolling while admin is mounted ────────────
  // This stops the gap caused by body overflow adding extra scrollable space
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      // Use position:fixed so this splash also respects the navbar
      <div
        className="fixed flex items-center justify-center bg-[#FFFDF7] z-40"
        style={{
          top:    NAVBAR_HEIGHT,
          left:   0,
          right:  0,
          bottom: 0,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
          <p className="text-sm font-semibold text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  return (
    /*
     * KEY FIX: use position:fixed + inset instead of height/marginTop.
     * This guarantees the shell always stretches exactly from the bottom
     * of the navbar to the bottom of the viewport — no gap, ever.
     *
     * position:fixed means the shell is taken out of normal flow,
     * so the body can't add extra scroll space below it.
     */
    <div
      className="fixed flex"
      style={{
        top:      NAVBAR_HEIGHT,  // sits flush below the fixed public navbar
        left:     0,
        right:    0,
        bottom:   0,              // stretches exactly to the viewport bottom — no gap
        background: "#FFFDF7",
        zIndex:   30,             // above page content, below navbar (navbar should be z-40+)
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────────
          height: 100% fills the entire fixed shell — sidebar never ends early
      */}
      <div className="flex-shrink-0" style={{ width: 260, height: "100%" }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ height: "100%", overflow: "hidden" }}
      >
        {/* TopBar */}
        <div className="flex-shrink-0">
          <TopBar title={activeTab} />
        </div>

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto main-scroll"
          style={{
            padding: 24,
            background: "#FFFDF7",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {renderPage(activeTab)}
        </main>
      </div>
    </div>
  );
}