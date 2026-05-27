
// // "use client";

// // import { useEffect, useState } from "react";
// // import { useAuth } from "@/context/AuthContext";
// // import { useRouter } from "next/navigation";

// // // Layout
// // import Sidebar from "@/components/admin/layout/Sidebar";
// // import TopBar from "@/components/admin/layout/TopBar";

// // // Modules
// // import DashboardView from "@/components/admin/modules/dashboard/DashboardView";
// // import StudentsView from "@/components/admin/modules/students/StudentsView";
// // import TeachersView from "@/components/admin/modules/teachers/TeachersView";
// // import ScheduleView from "@/components/admin/modules/schedule/ScheduleView";
// // import ExamsView from "@/components/admin/modules/exams/ExamsView";
// // import AttendenceView from "@/components/admin/modules/attendance/AttendenceView";
// // import FeesView from "@/components/admin/modules/fees/FeesView";
// // import ReportsView from "@/components/admin/modules/reports/ReportsView";
// // import SettingsView from "@/components/admin/modules/settings/SettingsView";
// // import EnquiriesView from "@/components/admin/modules/enquiries/EnquiriesView";
// // import NotesView from "@/components/admin/modules/notes/NotesView";
// // import HomeworkView from "@/components/admin/modules/homework/Homeworkview ";
// // import AnnouncementsView from "@/components/admin/modules/announcements/AnnouncementsView";

// // // In renderPage():

// // export default function AdminDashboardPage() {
// //   const [activeTab, setActiveTab] = useState("dashboard");
// //   const { user, loading } = useAuth();
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (!loading && user?.role !== "admin") {
// //       router.replace("/");
// //     }
// //   }, [user, loading, router]);

// //   if (loading)
// //     return (
// //       <div
// //         style={{
// //           minHeight: "100vh",
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           background: "#FFFDF7",
// //           fontFamily: "sans-serif",
// //           fontSize: 16,
// //           color: "#999",
// //         }}
// //       >
// //         Loading...
// //       </div>
// //     );

// //   if (user?.role !== "admin") return null;

// //   const renderPage = () => {
// //     switch (activeTab) {
// //       case "dashboard":  return <DashboardView />;
// //       case "students":   return <StudentsView />;
// //       case "teachers":   return <TeachersView />;
// //       case "schedule":   return <ScheduleView />;
// //       case "exams":      return <ExamsView />;
// //       case "attendance": return <AttendenceView />;
// //       case "fees":       return <FeesView />;
// //       case "announcements": return <AnnouncementsView />;
// //       case "enquiries":  return <EnquiriesView />;
// //       case "reports":    return <ReportsView />;
// //       case "settings":   return <SettingsView />;
// //       case "notes":      return <NotesView />;
// //       case "homework":   return <HomeworkView />;
// //       default:           return <div>Not Found</div>;
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         minHeight: "100vh",
// //         background: "#FFFDF7",
// //         position: "relative",
// //         isolation: "isolate",
// //       }}
// //     >
// //       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

// //       <div
// //         style={{
// //           flex: 1,
// //           marginLeft: 260,
// //           display: "flex",
// //           flexDirection: "column",
// //           minHeight: "100vh",
// //           overflow: "hidden",
// //         }}
// //       >
// //         <TopBar title={activeTab} />

// //         <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
// //           {renderPage()}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }












// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

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

// // Public navbar height — must match the height in your Navbar component
// const NAVBAR_HEIGHT = 80;

// export default function AdminDashboardPage() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user?.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   if (loading)
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#FFFDF7",
//           fontFamily: "sans-serif",
//           fontSize: 16,
//           color: "#999",
//         }}
//       >
//         Loading...
//       </div>
//     );

//   if (user?.role !== "admin") return null;

//   const renderPage = () => {
//     switch (activeTab) {
//       case "dashboard":     return <DashboardView />;
//       case "students":      return <StudentsView />;
//       case "teachers":      return <TeachersView />;
//       case "schedule":      return <ScheduleView />;
//       case "exams":         return <ExamsView />;
//       case "attendance":    return <AttendenceView />;
//       case "fees":          return <FeesView />;
//       case "announcements": return <AnnouncementsView />;
//       case "enquiries":     return <EnquiriesView />;
//       case "reports":       return <ReportsView />;
//       case "settings":      return <SettingsView />;
//       case "notes":         return <NotesView />;
//       case "homework":      return <HomeworkView />;
//       default:              return <div>Not Found</div>;
//     }
//   };

//   return (
//     // Offset the entire admin shell below the fixed public navbar
//     <div
//       style={{
//         display: "flex",
//         height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//         marginTop: NAVBAR_HEIGHT,        // ← pushes admin shell below the fixed navbar
//         background: "#FFFDF7",
//         position: "relative",
//         isolation: "isolate",
//         overflow: "hidden",              // prevents double scrollbars
//       }}
//     >
//       {/* Sidebar — fixed relative to the admin shell, not the full viewport */}
//       <div
//         style={{
//           width: 260,
//           flexShrink: 0,
//           height: "100%",
//           overflowY: "auto",
//           borderRight: "1px solid #F0EEF8",
//           background: "#fff",
//           position: "sticky",
//           top: 0,
//         }}
//       >
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       </div>

//       {/* Main content area */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//           overflow: "hidden",
//         }}
//       >
//         <TopBar title={activeTab} />

//         <main
//           style={{
//             flex: 1,
//             padding: 24,
//             overflowY: "auto",
//           }}
//         >
//           {renderPage()}
//         </main>
//       </div>
//     </div>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

// Public navbar height — must match the height in your Navbar component
const NAVBAR_HEIGHT = 80;

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFDF7",
          fontFamily: "sans-serif",
          fontSize: 16,
          color: "#999",
        }}
      >
        Loading...
      </div>
    );

  if (user?.role !== "admin") return null;

  const renderPage = () => {
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
      default:              return <div>Not Found</div>;
    }
  };

  return (
    // Offset the entire admin shell below the fixed public navbar
    <div
      style={{
        display: "flex",
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        marginTop: NAVBAR_HEIGHT,
        background: "#FFFDF7",
        // NO isolation or overflow:hidden — both trap fixed-position modals/toasts inside the shell
      }}
    >
      {/* Sidebar — fixed relative to the admin shell, not the full viewport */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          height: "100%",
          overflowY: "auto",
          borderRight: "1px solid #F0EEF8",
          background: "#fff",
          position: "sticky",
          top: 0,
        }}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <TopBar title={activeTab} />

        <main
          style={{
            flex: 1,
            padding: 24,
            overflowY: "auto",
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}