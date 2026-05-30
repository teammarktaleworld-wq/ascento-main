// "use client";

// import { Bell, Search } from "lucide-react";

// export default function TopBar({ title }: { title: string }) {
//   return (
//     <header className="h-[80px] bg-[#FFFDF7] border-b flex items-center justify-between px-8">
//       <h2 className="text-xl font-bold capitalize">{title}</h2>

//       <div className="flex items-center gap-4">
//         <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-2 text-gray-400" size={16} />
//           <input
//             className="pl-9 pr-3 py-2 border rounded-full text-sm"
//             placeholder="Search..."
//           />
//         </div>

//         <Bell className="text-gray-500 cursor-pointer" />
//       </div>
//     </header>
//   );
// }













"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell, CheckCheck, ExternalLink, Loader2, Video,
  Megaphone, BookOpen, Calendar, Info, X, ChevronRight,
} from "lucide-react";

// ─── Types (minimal, matches NotificationsView) ───────────────────────────────
type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  webinar?: { meetingLink: string; status: string };
  createdAt: string;
}

const TYPE_META: Record<NotifType, { color: string; bg: string; icon: string }> = {
  webinar:      { color: "#2D8CFF", bg: "#EBF4FF", icon: "📹" },
  announcement: { color: "#FF6B6B", bg: "#FFF0F0", icon: "📣" },
  exam:         { color: "#8B5CF6", bg: "#F5F3FF", icon: "📖" },
  attendance:   { color: "#22C55E", bg: "#F0FDF4", icon: "📅" },
  general:      { color: "#FFB347", bg: "#FFF8EC", icon: "ℹ️" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
export default function TopBar({
  title,
  onNotificationsClick,
}: {
  title: string;
  onNotificationsClick?: () => void;
}) {
  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [ringing,       setRinging]       = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Poll unread count every 30s ────────────────────────────────────────────
  const fetchCount = async () => {
    try {
      const res  = await fetch("/api/notifications?limit=1");
      const data = await res.json();
      const count = data.unreadCount ?? 0;
      if (count > unreadCount) triggerRing();
      setUnreadCount(count);
    } catch {}
  };

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Ring animation whenever new notifs arrive ──────────────────────────────
  const triggerRing = () => {
    setRinging(true);
    setTimeout(() => setRinging(false), 1000);
  };

  // ── Fetch dropdown list ────────────────────────────────────────────────────
  const fetchDropdown = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/notifications?limit=10");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {}
    finally { setLoading(false); }
  };

  const toggleOpen = () => {
    if (!open) fetchDropdown();
    setOpen(v => !v);
  };

  // ── Mark one read ──────────────────────────────────────────────────────────
  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-black text-[#1A1A2E] tracking-tight">{label}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleOpen}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
              ${open ? "bg-[#FF6B6B]/10 text-[#FF6B6B]" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            <Bell
              size={18}
              className={ringing ? "animate-[ring_0.6s_ease-in-out]" : ""}
              style={ringing ? {
                animation: "ring 0.6s ease-in-out",
              } : {}}
            />
            {unreadCount > 0 && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF4444] text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none
                ${ringing ? "scale-125" : "scale-100"} transition-transform duration-200`}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 z-50 overflow-hidden">
              {/* Dropdown header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1A1A2E] text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#FF6B6B] px-2 py-1 rounded-lg hover:bg-[#FF6B6B]/5 transition-colors">
                      <CheckCheck size={12} /> All read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={20} className="animate-spin text-[#FF6B6B]" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2">
                      <Bell size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-300 mt-0.5">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const meta = TYPE_META[n.type] || TYPE_META.general;
                    return (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && markRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors group
                          ${n.isRead ? "hover:bg-gray-50/50" : "bg-[#FFFDF7] hover:bg-orange-50/50 border-l-2"}`}
                        style={!n.isRead ? { borderLeftColor: meta.color } : {}}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                          style={{ background: meta.bg }}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold leading-snug truncate ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-gray-300 font-medium mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: meta.color }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer — navigate to full notifications page */}
              {onNotificationsClick && (
                <button onClick={() => { setOpen(false); onNotificationsClick(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-colors border-t border-gray-100">
                  View all notifications <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Admin avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-black">A</span>
        </div>
      </div>

      {/* Bell ring keyframes injected inline */}
      <style>{`
        @keyframes ring {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(15deg); }
          30%  { transform: rotate(-13deg); }
          45%  { transform: rotate(10deg); }
          60%  { transform: rotate(-8deg); }
          75%  { transform: rotate(5deg); }
          90%  { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        .bell-ring { animation: ring 0.6s ease-in-out; }
      `}</style>
    </div>
  );
}