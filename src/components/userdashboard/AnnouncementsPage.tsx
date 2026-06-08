// // src/components/userdashboard/AnnouncementsPage.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle, Bell, Info,
  Megaphone, Search, X, Loader2,
  Mail, FileText, Image as ImageIcon,
  Calendar, Users, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "info" | "normal" | "urgent";
  audience: string;
  fileUrl: string | null;
  fileType: string | null;
  fileName: string | null;
  expiresAt: string | null;
  emailSent: boolean;
  createdAt: string;
  program?: { id: string; name: string } | null;
  level?:   { id: string; name: string } | null;
}

// ── Config ────────────────────────────────────────────────────────────────────
const PRIORITY_CFG = {
  info:   { label: "Info",   color: "#4ECDC4", bg: "#F0FFFE", border: "#4ECDC433", Icon: Info,          emoji: "ℹ️" },
  normal: { label: "Normal", color: "#FFB347", bg: "#FFF8EE", border: "#FFB34733", Icon: Bell,          emoji: "📢" },
  urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FFF0F0", border: "#FF6B6B33", Icon: AlertTriangle, emoji: "🚨" },
};

const AUDIENCE_LABEL: Record<string, string> = {
  all: "Everyone", students: "All Students",
  teachers: "Teachers Only", program: "Program", level: "Level",
};

// ── API helper ────────────────────────────────────────────────────────────────
async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch("/api/announcements", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  greeting?: string;
  attendancePct?: number;
  onNavigate?: (page: string) => void;
  onToast?: (msg: string) => void;
}

export default function AnnouncementsPage({ onToast }: Props) {
  const [items,   setItems]   = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [fPri,    setFPri]    = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnnouncements();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
      onToast?.("Failed to load announcements");
    }
    setLoading(false);
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = items.filter((a) => {
    const q = search.toLowerCase();
    const matchQ   = !q || a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
    const matchPri = !fPri || a.priority === fPri;
    return matchQ && matchPri;
  });

  const urgentCount = items.filter((a) => a.priority === "urgent").length;
  const unreadCount = items.length; // all are "new" from student POV

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)",
        borderRadius: 20,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(255,107,107,0.25)",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.2)", borderRadius: 20,
            padding: "4px 12px", fontSize: 11, fontWeight: 700,
            color: "#fff", marginBottom: 10, letterSpacing: "0.05em",
          }}>📢 Announcements</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>
            School Notices
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
            {urgentCount > 0
              ? <><strong style={{ color: "#fff" }}>{urgentCount} urgent</strong> notice{urgentCount > 1 ? "s" : ""} require your attention</>
              : `${items.length} announcement${items.length !== 1 ? "s" : ""} for you`}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 48, opacity: 0.85 }}>📣</div>
          <button
            onClick={load}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 8, padding: "4px 10px", color: "#fff",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Total",  value: items.length,  color: "#FFB347", bg: "#FFF8EE", icon: "📋" },
          { label: "Urgent", value: urgentCount,    color: "#FF6B6B", bg: "#FFF0F0", icon: "🚨" },
          { label: "Info",   value: items.filter(a => a.priority === "info").length, color: "#4ECDC4", bg: "#F0FFFE", icon: "ℹ️" },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 16,
            padding: "16px 20px", border: `1px solid ${s.color}22`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: "14px 16px",
        display: "flex", gap: 10, flexWrap: "wrap",
        border: "1px solid #F3F4F6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements…"
            style={{
              width: "100%", paddingLeft: 36, paddingRight: search ? 32 : 12,
              paddingTop: 9, paddingBottom: 9,
              border: "1.5px solid #F0EEF8", borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: "#1A1A2E",
              outline: "none", background: "#FFFDF7",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#9CA3AF",
              display: "flex", alignItems: "center",
            }}><X size={13} /></button>
          )}
        </div>

        {/* Priority filter */}
        <select
          value={fPri}
          onChange={(e) => setFPri(e.target.value)}
          style={{
            border: "1.5px solid #F0EEF8", borderRadius: 10,
            padding: "9px 14px", fontSize: 13, fontWeight: 600,
            color: "#4B5563", background: "#FFFDF7", outline: "none", cursor: "pointer",
          }}
        >
          <option value="">All Priorities</option>
          <option value="urgent">🚨 Urgent</option>
          <option value="normal">📢 Normal</option>
          <option value="info">ℹ️ Info</option>
        </select>

        {(search || fPri) && (
          <button
            onClick={() => { setSearch(""); setFPri(""); }}
            style={{
              padding: "9px 16px", borderRadius: 10, fontSize: 13,
              fontWeight: 700, color: "#6B7280", background: "#F3F4F6",
              border: "none", cursor: "pointer",
            }}
          >Clear</button>
        )}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 12 }}>
          <Loader2 size={32} style={{ color: "#FF6B6B", animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Loading announcements…</p>
        </div>
      ) : error ? (
        <div style={{
          background: "#FFF0F0", borderRadius: 16, padding: "32px",
          textAlign: "center", border: "1px solid #FF6B6B33",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#FF6B6B" }}>Failed to load</p>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{error}</p>
          <button onClick={load} style={{
            marginTop: 12, padding: "8px 20px", borderRadius: 10,
            background: "#FF6B6B", color: "#fff", border: "none",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 16, padding: "56px 32px",
          textAlign: "center", border: "1px solid #F3F4F6",
        }}>
          <Megaphone size={36} style={{ color: "#E5E7EB", marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E" }}>
            {search || fPri ? "No matching announcements" : "No announcements yet"}
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
            {search || fPri ? "Try clearing your filters" : "Check back later for updates from your school"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a) => {
            const cfg      = PRIORITY_CFG[a.priority];
            const PriIcon  = cfg.Icon;
            const isOpen   = expanded === a.id;
            const expired  = a.expiresAt && new Date(a.expiresAt) < new Date();

            return (
              <div
                key={a.id}
                onClick={() => setExpanded(isOpen ? null : a.id)}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: `1.5px solid ${isOpen ? cfg.color + "44" : "#F3F4F6"}`,
                  boxShadow: isOpen ? `0 4px 20px ${cfg.color}18` : "0 2px 8px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Priority stripe */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)` }} />

                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>

                    {/* Icon */}
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: cfg.bg, border: `1px solid ${cfg.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <PriIcon size={18} style={{ color: cfg.color }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>{a.title}</span>
                            {/* Priority badge */}
                            <span style={{
                              fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                              letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 20,
                              background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                            }}>{cfg.label}</span>
                            {expired && (
                              <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: "#FEF2F2", color: "#EF4444", border: "1px solid #FEE2E2" }}>Expired</span>
                            )}
                            {a.emailSent && (
                              <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: "#F5F3FF", color: "#8B5CF6", border: "1px solid #EDE9FE", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                <Mail size={8} /> Emailed
                              </span>
                            )}
                          </div>

                          {/* Message — collapsed: 2 lines, expanded: full */}
                          <p style={{
                            fontSize: 13, color: "#6B7280", lineHeight: 1.6,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: isOpen ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: isOpen ? "visible" : "hidden",
                          }}>{a.message}</p>

                          {/* Meta */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>
                              <Users size={10} />
                              {a.audience === "program" && a.program ? `${a.program.name}`
                               : a.audience === "level" && a.level   ? `${a.level.name}`
                               : AUDIENCE_LABEL[a.audience] ?? a.audience}
                            </span>
                            {a.expiresAt && (
                              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>
                                <Calendar size={10} />
                                Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}
                              </span>
                            )}
                            <span style={{ fontSize: 11, color: "#D1D5DB", fontWeight: 600 }}>
                              {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attachment — only when expanded */}
                      {isOpen && a.fileUrl && (
                        <div style={{ marginTop: 14 }}>
                          {a.fileType === "image" ? (
                            <img
                              src={a.fileUrl}
                              alt={a.fileName ?? "attachment"}
                              style={{ borderRadius: 10, maxHeight: 240, objectFit: "contain", border: "1px solid #F3F4F6", width: "100%" }}
                            />
                          ) : (
                            <a
                              href={a.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "10px 16px", borderRadius: 10,
                                background: "#F0F9FF", border: "1px solid #BAE6FD",
                                color: "#0284C7", fontSize: 13, fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              <FileText size={15} />
                              {a.fileName ?? "View Attachment"}
                            </a>
                          )}
                        </div>
                      )}

                      {/* Expand hint */}
                      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: cfg.color, opacity: 0.7 }}>
                        {isOpen ? "▲ Show less" : "▼ Read more"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}