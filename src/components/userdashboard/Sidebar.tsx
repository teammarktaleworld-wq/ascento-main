"use client";

import { STUDENT, NAV_ITEMS, NavPage } from "./data";

interface SidebarProps {
  activePage: NavPage;
  sidebarOpen: boolean;
  onNavigate: (page: NavPage) => void;
  onClose: () => void;
  announcementBadge: number;
  notesBadge: number;
  feesBadge: number;
}

export default function Sidebar({
  activePage,
  sidebarOpen,
  onNavigate,
  onClose,
  announcementBadge,
  notesBadge,
  feesBadge,
}: SidebarProps) {
  const getBadge = (id: NavPage) => {
    if (id === "announcements") return announcementBadge;
    if (id === "notes") return notesBadge;
    if (id === "fees") return feesBadge;
    return 0;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`ud-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🧮</div>
          <div>
            <div className="logo-text">Ascento</div>
            <div className="logo-sub">Student Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const badge = getBadge(item.id);
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => { onNavigate(item.id); onClose(); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {badge > 0 && <span className="nav-badge">{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-av">{STUDENT.initials}</div>
          <div>
            <div className="user-name">{STUDENT.name}</div>
            <div className="user-role">{STUDENT.program}</div>
          </div>
        </div>
      </aside>
    </>
  );
}