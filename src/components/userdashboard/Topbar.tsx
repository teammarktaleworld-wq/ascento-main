"use client";

import { NavPage, NAV_ITEMS, STUDENT } from "./data";

interface TopbarProps {
  activePage: NavPage;
  onMenuClick: () => void;
  onNotifClick: () => void;
}

export default function Topbar({ activePage, onMenuClick, onNotifClick }: TopbarProps) {
  const label = NAV_ITEMS.find((n) => n.id === activePage)?.label ?? "Dashboard";

  return (
    <header className="ud-topbar">
      <button className="menu-btn" onClick={onMenuClick}>☰</button>
      <div className="topbar-title">{label}</div>
      <div className="topbar-pill">🎒 {STUDENT.level}</div>
      <div className="topbar-notif" onClick={onNotifClick}>
        🔔
        <div className="notif-dot" />
      </div>
    </header>
  );
}