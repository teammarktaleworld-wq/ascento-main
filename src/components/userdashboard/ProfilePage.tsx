"use client";

import { STUDENT } from "./data";

interface ProfilePageProps {
  attendancePct: number;
  onToast: (msg: string) => void;
}

export default function ProfilePage({ attendancePct, onToast }: ProfilePageProps) {
  const fields: [string, string][] = [
    ["🔢 Roll Number", STUDENT.rollNo],
    ["📚 Program",     STUDENT.program],
    ["📊 Level",       STUDENT.level],
    ["📅 Batch",       STUDENT.batch],
    ["👩‍🏫 Teacher",    STUDENT.teacher],
    ["🗓️ Joined",     STUDENT.joinedDate],
    ["✅ Attendance",  `${attendancePct}%`],
    ["🏆 Best Score",  "92/100 (Level 4 Final)"],
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-big">{STUDENT.initials}</div>
        <div className="profile-name">{STUDENT.name}</div>
        <div className="profile-prog-badge">{STUDENT.program} · {STUDENT.level}</div>
      </div>

      <div className="profile-grid">
        {fields.map(([l, v]) => (
          <div key={l} className="profile-field">
            <div className="pf-label">{l}</div>
            <div className="pf-value">{v}</div>
          </div>
        ))}
      </div>

      <div className="profile-actions">
        <button className="profile-btn" onClick={() => onToast("Opening change password…")}>
          🔒 Change Password
        </button>
        <button className="profile-btn" onClick={() => onToast("Opening contact form…")}>
          📨 Message Teacher
        </button>
        <button className="profile-btn danger" onClick={() => onToast("Logging out…")}>
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}