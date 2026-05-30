


"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell, BellOff, Check, CheckCheck, Trash2, Video,
  Megaphone, BookOpen, Calendar, Info, Loader2,
  ExternalLink, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

interface WebinarSnippet {
  id: string; title: string; scheduledAt: string;
  meetingLink: string; platform: string; status: string;
}

interface Notification {
  id: string; type: NotifType; title: string; message: string;
  isRead: boolean; link?: string; webinarId?: string;
  webinar?: WebinarSnippet; createdAt: string;
}

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  webinar:      { icon: Video,     color: "#2D8CFF", bg: "#EBF4FF", label: "Webinar" },
  announcement: { icon: Megaphone, color: "#FF6B6B", bg: "#FFF0F0", label: "Announcement" },
  exam:         { icon: BookOpen,  color: "#8B5CF6", bg: "#F5F3FF", label: "Exam" },
  attendance:   { icon: Calendar,  color: "#22C55E", bg: "#F0FDF4", label: "Attendance" },
  general:      { icon: Info,      color: "#FFB347", bg: "#FFF8EC", label: "General" },
};

export default function NotificationsView() {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState<"all" | "unread">("all");
  const [typeFilter,    setTypeFilter]    = useState<NotifType | "">("");

  const authFetch = useCallback((url: string, init: RequestInit = {}) => {
    return fetch(url, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "unread") params.set("unread", "true");
      params.set("limit", "100");
      const res  = await authFetch(`/api/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {}
    finally { setLoading(false); }
  }, [filter, authFetch, token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id: string) => {
    await authFetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await authFetch("/api/notifications", { method: "PATCH" });
    setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotif = async (id: string, wasRead: boolean) => {
    await authFetch(`/api/notifications/${id}`, { method: "DELETE" });
    setNotifications(ns => ns.filter(n => n.id !== id));
    if (!wasRead) setUnreadCount(c => Math.max(0, c - 1));
  };

  const filtered = notifications.filter(n => typeFilter ? n.type === typeFilter : true);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-md">
              <Bell size={18} className="text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Notifications</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl hover:bg-[#FF6B6B]/5 transition-colors">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          <button onClick={fetchNotifications}
            className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["all", "unread"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all
                ${filter === f ? "bg-white shadow-sm text-[#FF6B6B]" : "text-gray-500 hover:text-gray-700"}`}>
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
          <option value="">All Types</option>
          {(Object.entries(TYPE_META) as [NotifType, any][]).map(([type, meta]) => (
            <option key={type} value={type}>{meta.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={26} className="animate-spin text-[#FF6B6B]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <BellOff size={36} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-[#1A1A2E] mb-1">
            {filter === "unread" ? "No unread notifications" : "No notifications"}
          </h3>
          <p className="text-sm text-gray-400">
            {filter === "unread" ? "You're all caught up! 🎉" : "Notifications will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <NotificationItem key={n.id} notif={n}
              onRead={() => markRead(n.id)}
              onDelete={() => deleteNotif(n.id, n.isRead)} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notif: n, onRead, onDelete }: {
  notif: Notification; onRead: () => void; onDelete: () => void;
}) {
  const meta = TYPE_META[n.type] || TYPE_META.general;
  const Icon = meta.icon;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group
      ${n.isRead ? "bg-white border-gray-100 opacity-70" : "bg-white border-l-4 shadow-sm"}`}
      style={!n.isRead ? { borderLeftColor: meta.color } : {}}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: meta.bg }}>
        <Icon size={18} style={{ color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
              {!n.isRead && <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />}
            </div>
            <h4 className={`font-bold text-sm mt-1 ${n.isRead ? "text-gray-600" : "text-[#1A1A2E]"}`}>
              {n.title}
            </h4>
            <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
            {n.webinar && n.webinar.status !== "cancelled" && (
              <a href={n.webinar.meetingLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
                🚀 Join Webinar <ExternalLink size={11} />
              </a>
            )}
            {n.link && !n.webinar && (
              <a href={n.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
                style={{ color: meta.color }}>
                View details <ExternalLink size={10} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {!n.isRead && (
              <button onClick={onRead} title="Mark as read"
                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
                <Check size={13} />
              </button>
            )}
            <button onClick={onDelete} title="Delete"
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{timeAgo}</p>
      </div>
    </div>
  );
}