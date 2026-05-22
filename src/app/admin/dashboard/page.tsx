




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

// export default function AdminDashboardPage() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user?.role !== "admin") {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   if (loading) return (
//     <div style={{
//       minHeight: "100vh", display: "flex",
//       alignItems: "center", justifyContent: "center",
//       background: "#FFFDF7", fontFamily: "sans-serif",
//       fontSize: 16, color: "#999",
//     }}>
//       Loading...
//     </div>
//   );

//   if (user?.role !== "admin") return null;

//   const renderPage = () => {
//     switch (activeTab) {
//       case "dashboard":   return <DashboardView />;
//       case "students":    return <StudentsView />;
//       case "teachers":    return <TeachersView />;
//       case "schedule":    return <ScheduleView />;
//       case "exams":       return <ExamsView />;
//       case "attendance":  return <AttendenceView />;
//       case "fees":        return <FeesView />;
//       case "enquiries":   return <EnquiriesView />;
//       case "reports":     return <ReportsView />;
//       case "settings":    return <SettingsView />;
//       case "notes":    return <NotesView />;
//       default:            return <div>Not Found</div>;
//     }
//   };

//   return (
//     <div style={{
//       display: "flex",
//       minHeight: "100vh",
//       background: "#FFFDF7",
//       // Reset any global layout interference
//       position: "relative",
//       isolation: "isolate",
//     }}>
//       {/* Sidebar — fixed on the left */}
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* Main content — offset by sidebar width */}
//       <div style={{
//         flex: 1,
//         marginLeft: 260,
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         overflow: "hidden",
//       }}>
//         {/* TopBar */}
//         <TopBar title={activeTab} />

//         {/* Page content */}
//         <main style={{
//           flex: 1,
//           padding: 24,
//           overflowY: "auto",
//         }}>
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
      case "dashboard":  return <DashboardView />;
      case "students":   return <StudentsView />;
      case "teachers":   return <TeachersView />;
      case "schedule":   return <ScheduleView />;
      case "exams":      return <ExamsView />;
      case "attendance": return <AttendenceView />;
      case "fees":       return <FeesView />;
      case "enquiries":  return <EnquiriesView />;
      case "reports":    return <ReportsView />;
      case "settings":   return <SettingsView />;
      case "notes":      return <NotesView />;
      case "homework":   return <HomeworkView />;
      default:           return <div>Not Found</div>;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FFFDF7",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        style={{
          flex: 1,
          marginLeft: 260,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <TopBar title={activeTab} />

        <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}