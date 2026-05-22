"use client";

import { ANNOUNCEMENTS } from "./data";

export default function AnnouncementsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Announcements</h2>
        <p className="page-sub">Stay up to date with notices, events & exam updates</p>
      </div>
      <div className="ann-list">
        {ANNOUNCEMENTS.map((a) => (
          <div
            key={a.id}
            className="ann-full-card"
            style={{ "--ann-color": a.color } as React.CSSProperties}
          >
            <div className="ann-full-left">
              <div
                className="ann-full-tag"
                style={{ background: a.color + "20", color: a.color }}
              >
                {a.tag}
              </div>
              <div className="ann-full-title">{a.title}</div>
              <div className="ann-full-body">{a.body}</div>
              <div className="ann-full-date">🕐 {a.date}</div>
            </div>
            {a.urgent && <div className="ann-full-urgent">NEW</div>}
          </div>
        ))}
      </div>
    </div>
  );
}