"use client";

import { SCHEDULE, STUDENT } from "./data";

export default function SchedulePage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const details: [string, string][] = [
    ["📚 Program", STUDENT.program],
    ["📊 Level",   STUDENT.level],
    ["👩‍🏫 Teacher", STUDENT.teacher],
    ["📍 Batch",   STUDENT.batch],
    ["🔢 Roll No.", STUDENT.rollNo],
    ["📅 Joined",  STUDENT.joinedDate],
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">My Schedule</h2>
        <p className="page-sub">{STUDENT.batch}</p>
      </div>

      <div className="schedule-week">
        {days.map((d) => {
          const cls    = SCHEDULE.find((s) => s.day === d);
          const isToday = d === "Mon";
          return (
            <div
              key={d}
              className={`sched-day-card ${cls ? "has-class" : "empty-day"} ${isToday ? "today-day" : ""}`}
            >
              <div className="sched-day-label">{d}</div>
              {cls ? (
                <div
                  className="sched-class-info"
                  style={{ "--sched-color": cls.color } as React.CSSProperties}
                >
                  <div className="sched-subject">{cls.subject}</div>
                  <div className="sched-time">{cls.time}</div>
                  <div className="sched-teacher">👩‍🏫 {cls.teacher}</div>
                  <div className="sched-room">📍 {cls.room}</div>
                  {isToday && <div className="sched-live-pill">● LIVE TODAY</div>}
                </div>
              ) : (
                <div className="sched-off">No class 🌿</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="dash-card" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>Class Details</div>
        <div className="class-detail-grid">
          {details.map(([l, v]) => (
            <div key={l} className="class-detail-item">
              <div className="cd-label">{l}</div>
              <div className="cd-value">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}