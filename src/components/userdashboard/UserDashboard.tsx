"use client";

import { useState, useEffect } from "react";
import { NavPage, ANNOUNCEMENTS, NOTES, FEES, ATTENDANCE } from "./data";
import ExamsPage from "./ExamsPage";
// ── Sub-components ────────────────────────────────────────────────────────────
import DashboardStyles from "./DashboardStyles";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import HomePage from "./HomePage";
import AnnouncementsPage from "./AnnouncementsPage";
import SchedulePage from "./SchedulePage";
import NotesPage from "./NotesPage";
import AttendancePage from "./AttendancePage";
import FeesPage from "./FeesPage";
import ProfilePage from "./ProfilePage";
import HomeworkFilesPage from "./HomeworkFilesPage";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState<NavPage>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Derived stats
  const presentCount = ATTENDANCE.filter((a) => a.status === "present").length;
  const attendancePct = Math.round((presentCount / ATTENDANCE.length) * 100);

  // Badge counts for sidebar
  const announcementBadge = ANNOUNCEMENTS.filter((a) => a.urgent).length;
  const notesBadge = NOTES.filter((n) => n.new).length;
  const feesBadge = FEES.filter((f) => f.status === "pending").length;

  // Page map
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <HomePage
            greeting={greeting}
            attendancePct={attendancePct}
            onNavigate={setActivePage}
            onToast={showToast}
          />
        );
      case "announcements":
        return <AnnouncementsPage />;
      case "schedule":
        return <SchedulePage />;
      case "notes":
        return <NotesPage onToast={showToast} />;
      case "attendance":
        return <AttendancePage attendancePct={attendancePct} />;
      case "exams":
        return <ExamsPage />;
      case "homework":
        return <HomeworkFilesPage />;
      case "fees":
        return <FeesPage onToast={showToast} />;
      case "profile":
        return <ProfilePage attendancePct={attendancePct} onToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardStyles />

      <div className="ud-root">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          onNavigate={setActivePage}
          onClose={() => setSidebarOpen(false)}
          announcementBadge={announcementBadge}
          notesBadge={notesBadge}
          feesBadge={feesBadge}
        />

        {/* Main */}
        <div className="ud-main">
          <Topbar
            activePage={activePage}
            onMenuClick={() => setSidebarOpen((o) => !o)}
            onNotifClick={() => showToast("You have 1 urgent announcement!")}
          />

          <div className="ud-scroll">
            {renderPage()}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="ud-toast">{toast}</div>}
    </>
  );
}