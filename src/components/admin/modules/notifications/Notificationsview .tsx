// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Bell, BellOff, Check, CheckCheck, Trash2, Video,
//   Megaphone, BookOpen, Calendar, Info, Loader2,
//   ExternalLink, RefreshCw,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

// interface WebinarSnippet {
//   id: string; title: string; scheduledAt: string;
//   meetingLink: string; platform: string; status: string;
// }

// interface ExamSnippet {
//   id: string;
//   examName: string;
//   examStartDate?: string;
//   examEndDate?: string;
//   description?: string;
//   fileUrl?: string;
//   fileName?: string;

//   program?: {
//     id: string;
//     name: string;
//   };

//   level?: {
//     id: string;
//     name: string;
//   };
// }
// interface Notification {
//   id: string;
//   type: NotifType;
//   title: string;
//   message: string;
//   isRead: boolean;

//   link?: string;

//   webinarId?: string;
//   webinar?: WebinarSnippet;

//   examId?: string;
//   exam?: ExamSnippet;

//   createdAt: string;
// }
// const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
//   webinar: { icon: Video, color: "#2D8CFF", bg: "#EBF4FF", label: "Webinar" },
//   announcement: { icon: Megaphone, color: "#FF6B6B", bg: "#FFF0F0", label: "Announcement" },
//   exam: { icon: BookOpen, color: "#8B5CF6", bg: "#F5F3FF", label: "Exam" },
//   attendance: { icon: Calendar, color: "#22C55E", bg: "#F0FDF4", label: "Attendance" },
//   general: { icon: Info, color: "#FFB347", bg: "#FFF8EC", label: "General" },
// };

// export default function NotificationsView() {
//   const { token } = useAuth();

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"all" | "unread">("all");
//   const [typeFilter, setTypeFilter] = useState<NotifType | "">("");

//   const authFetch = useCallback((url: string, init: RequestInit = {}) => {
//     return fetch(url, {
//       ...init,
//       headers: {
//         ...(init.headers ?? {}),
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }, [token]);

//   const fetchNotifications = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filter === "unread") params.set("unread", "true");
//       params.set("limit", "100");
//       const res = await authFetch(`/api/notifications?${params}`);
//       const data = await res.json();
//       setNotifications(data.notifications || []);
//       setUnreadCount(data.unreadCount ?? 0);
//     } catch { }
//     finally { setLoading(false); }
//   }, [filter, authFetch, token]);

//   useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

//   const markRead = async (id: string) => {
//     await authFetch(`/api/notifications/${id}`, { method: "PATCH" });
//     setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
//     setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const markAllRead = async () => {
//     await authFetch("/api/notifications", { method: "PATCH" });
//     setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
//     setUnreadCount(0);
//   };

//   const deleteNotif = async (id: string, wasRead: boolean) => {
//     await authFetch(`/api/notifications/${id}`, { method: "DELETE" });
//     setNotifications(ns => ns.filter(n => n.id !== id));
//     if (!wasRead) setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const filtered = notifications.filter(n => typeFilter ? n.type === typeFilter : true);

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-md">
//               <Bell size={18} className="text-white" />
//             </div>
//             {unreadCount > 0 && (
//               <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
//                 {unreadCount > 99 ? "99+" : unreadCount}
//               </span>
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Notifications</h1>
//             <p className="text-sm text-gray-500">
//               {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {unreadCount > 0 && (
//             <button onClick={markAllRead}
//               className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl hover:bg-[#FF6B6B]/5 transition-colors">
//               <CheckCheck size={14} /> Mark all read
//             </button>
//           )}
//           <button onClick={fetchNotifications}
//             className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
//             <RefreshCw size={15} />
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 flex-wrap">
//         <div className="flex bg-gray-100 rounded-xl p-1">
//           {(["all", "unread"] as const).map(f => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all
//                 ${filter === f ? "bg-white shadow-sm text-[#FF6B6B]" : "text-gray-500 hover:text-gray-700"}`}>
//               {f === "all" ? "All" : `Unread (${unreadCount})`}
//             </button>
//           ))}
//         </div>
//         <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
//           className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
//           <option value="">All Types</option>
//           {(Object.entries(TYPE_META) as [NotifType, any][]).map(([type, meta]) => (
//             <option key={type} value={type}>{meta.label}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={26} className="animate-spin text-[#FF6B6B]" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
//             <BellOff size={36} className="text-gray-300" />
//           </div>
//           <h3 className="text-lg font-black text-[#1A1A2E] mb-1">
//             {filter === "unread" ? "No unread notifications" : "No notifications"}
//           </h3>
//           <p className="text-sm text-gray-400">
//             {filter === "unread" ? "You're all caught up! 🎉" : "Notifications will appear here."}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {filtered.map(n => (
//             <NotificationItem key={n.id} notif={n}
//               onRead={() => markRead(n.id)}
//               onDelete={() => deleteNotif(n.id, n.isRead)} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function NotificationItem({ notif: n, onRead, onDelete }: {
//   notif: Notification; onRead: () => void; onDelete: () => void;
// }) {
//   const meta = TYPE_META[n.type] || TYPE_META.general;
//   const Icon = meta.icon;

//   const timeAgo = (() => {
//     const diff = Date.now() - new Date(n.createdAt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs / 24)}d ago`;
//   })();

//   return (
//     <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group
//       ${n.isRead ? "bg-white border-gray-100 opacity-70" : "bg-white border-l-4 shadow-sm"}`}
//       style={!n.isRead ? { borderLeftColor: meta.color } : {}}>
//       <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: meta.bg }}>
//         <Icon size={18} style={{ color: meta.color }} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
//                 style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
//               {!n.isRead && <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />}
//             </div>
//             <h4 className={`font-bold text-sm mt-1 ${n.isRead ? "text-gray-600" : "text-[#1A1A2E]"}`}>
//               {n.title}
//             </h4>
//             <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
//             {/* {n.webinar && n.webinar.status !== "cancelled" && (
//               <a href={n.webinar.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
//                 style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//                 🚀 Join Webinar <ExternalLink size={11} />
//               </a>
//             )}
//             {n.link && !n.webinar && (
//               <a href={n.link} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
//                 style={{ color: meta.color }}>
//                 View details <ExternalLink size={10} />
//               </a>
//             )} */}
//             {n.webinar && n.webinar.status !== "cancelled" && (
//               <a href={n.webinar.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
//                 style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//                 🚀 Join Webinar <ExternalLink size={11} />
//               </a>
//             )}

//             {/* ADD THIS BLOCK */}
//             {n.exam?.fileUrl && (
//               <a
//                 href={n.exam.fileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold"
//                 style={{
//                   background: meta.bg,
//                   color: meta.color,
//                 }}
//               >
//                 📎 {n.exam.fileName ?? "View Attachment"}
//                 <ExternalLink size={11} />
//               </a>
//             )}

//             {n.link && !n.webinar && !n.exam?.fileUrl && (
//               <a href={n.link} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
//                 style={{ color: meta.color }}>
//                 View details <ExternalLink size={10} />
//               </a>
//             )}
//           </div>
//           <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//             {!n.isRead && (
//               <button onClick={onRead} title="Mark as read"
//                 className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
//                 <Check size={13} />
//               </button>
//             )}
//             <button onClick={onDelete} title="Delete"
//               className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//               <Trash2 size={13} />
//             </button>
//           </div>
//         </div>
//         <p className="text-xs text-gray-400 mt-1.5 font-medium">{timeAgo}</p>
//       </div>
//     </div>
//   );
// }

















// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Bell, BellOff, Check, CheckCheck, Trash2, Video,
//   Megaphone, BookOpen, Calendar, Info, Loader2,
//   ExternalLink, RefreshCw, User,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

// interface WebinarSnippet {
//   id: string; title: string; scheduledAt: string;
//   meetingLink: string; platform: string; status: string;
// }

// interface ExamSnippet {
//   id: string;
//   examName: string;
//   examStartDate?: string;
//   examEndDate?: string;
//   description?: string;
//   fileUrl?: string;
//   fileName?: string;
//   program?: { id: string; name: string };
//   level?: { id: string; name: string };
// }

// interface RecipientSnippet {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface Notification {
//   id: string;
//   type: NotifType;
//   title: string;
//   message: string;
//   isRead: boolean;
//   link?: string;
//   webinarId?: string;
//   webinar?: WebinarSnippet;
//   examId?: string;
//   exam?: ExamSnippet;
//   createdAt: string;
//   user?: RecipientSnippet; // only present when fetched as admin
// }

// const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
//   webinar:      { icon: Video,     color: "#2D8CFF", bg: "#EBF4FF", label: "Webinar" },
//   announcement: { icon: Megaphone, color: "#FF6B6B", bg: "#FFF0F0", label: "Announcement" },
//   exam:         { icon: BookOpen,  color: "#8B5CF6", bg: "#F5F3FF", label: "Exam" },
//   attendance:   { icon: Calendar,  color: "#22C55E", bg: "#F0FDF4", label: "Attendance" },
//   general:      { icon: Info,      color: "#FFB347", bg: "#FFF8EC", label: "General" },
// };

// export default function NotificationsView() {
//   const { token, user: authUser } = useAuth();
//   const isAdmin = authUser?.role === "admin";

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount]     = useState(0);
//   const [loading, setLoading]             = useState(true);
//   const [filter, setFilter]               = useState<"all" | "unread">("all");
//   const [typeFilter, setTypeFilter]       = useState<NotifType | "">("");

//   const authFetch = useCallback((url: string, init: RequestInit = {}) => {
//     return fetch(url, {
//       ...init,
//       headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` },
//     });
//   }, [token]);

//   const fetchNotifications = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filter === "unread") params.set("unread", "true");
//       params.set("limit", "100");
//       const res  = await authFetch(`/api/notifications?${params}`);
//       const data = await res.json();
//       setNotifications(data.notifications || []);
//       setUnreadCount(data.unreadCount ?? 0);
//     } catch {}
//     finally { setLoading(false); }
//   }, [filter, authFetch, token]);

//   useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

//   const markRead = async (id: string) => {
//     await authFetch(`/api/notifications/${id}`, { method: "PATCH" });
//     setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
//     setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const markAllRead = async () => {
//     await authFetch("/api/notifications", { method: "PATCH" });
//     setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
//     setUnreadCount(0);
//   };

//   const deleteNotif = async (id: string, wasRead: boolean) => {
//     await authFetch(`/api/notifications/${id}`, { method: "DELETE" });
//     setNotifications(ns => ns.filter(n => n.id !== id));
//     if (!wasRead) setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const filtered = notifications.filter(n => typeFilter ? n.type === typeFilter : true);

//   return (
//     <div className="flex flex-col gap-5">

//       {/* ── Header ── */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-md">
//               <Bell size={18} className="text-white" />
//             </div>
//             {unreadCount > 0 && (
//               <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
//                 {unreadCount > 99 ? "99+" : unreadCount}
//               </span>
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Notifications</h1>
//             <p className="text-sm text-gray-500">
//               {isAdmin
//                 ? `Showing all users · ${unreadCount} unread`
//                 : unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {unreadCount > 0 && (
//             <button onClick={markAllRead}
//               className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl hover:bg-[#FF6B6B]/5 transition-colors">
//               <CheckCheck size={14} /> Mark all read
//             </button>
//           )}
//           <button onClick={fetchNotifications}
//             className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
//             <RefreshCw size={15} />
//           </button>
//         </div>
//       </div>

//       {/* ── Filters ── */}
//       <div className="flex items-center gap-2 flex-wrap">
//         <div className="flex bg-gray-100 rounded-xl p-1">
//           {(["all", "unread"] as const).map(f => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all
//                 ${filter === f ? "bg-white shadow-sm text-[#FF6B6B]" : "text-gray-500 hover:text-gray-700"}`}>
//               {f === "all" ? "All" : `Unread (${unreadCount})`}
//             </button>
//           ))}
//         </div>
//         <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
//           className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
//           <option value="">All Types</option>
//           {(Object.entries(TYPE_META) as [NotifType, any][]).map(([type, meta]) => (
//             <option key={type} value={type}>{meta.label}</option>
//           ))}
//         </select>
//       </div>

//       {/* ── List ── */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={26} className="animate-spin text-[#FF6B6B]" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
//             <BellOff size={36} className="text-gray-300" />
//           </div>
//           <h3 className="text-lg font-black text-[#1A1A2E] mb-1">
//             {filter === "unread" ? "No unread notifications" : "No notifications"}
//           </h3>
//           <p className="text-sm text-gray-400">
//             {filter === "unread" ? "You're all caught up! 🎉" : "Notifications will appear here."}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {filtered.map(n => (
//             <NotificationItem
//               key={n.id}
//               notif={n}
//               isAdmin={isAdmin}
//               onRead={() => markRead(n.id)}
//               onDelete={() => deleteNotif(n.id, n.isRead)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function NotificationItem({ notif: n, isAdmin, onRead, onDelete }: {
//   notif: Notification;
//   isAdmin: boolean;
//   onRead: () => void;
//   onDelete: () => void;
// }) {
//   const meta = TYPE_META[n.type] || TYPE_META.general;
//   const Icon = meta.icon;

//   const timeAgo = (() => {
//     const diff = Date.now() - new Date(n.createdAt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs / 24)}d ago`;
//   })();

//   return (
//     <div
//       className={`flex items-start gap-4 p-4 rounded-2xl border transition-all group
//         ${n.isRead ? "bg-white border-gray-100 opacity-70" : "bg-white border-l-4 shadow-sm"}`}
//       style={!n.isRead ? { borderLeftColor: meta.color } : {}}
//     >
//       {/* Icon */}
//       <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: meta.bg }}>
//         <Icon size={18} style={{ color: meta.color }} />
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0 flex-1">

//             {/* ── Badges row ── */}
//             <div className="flex items-center gap-2 flex-wrap">
//               {/* Type badge */}
//               <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
//                 style={{ background: meta.bg, color: meta.color }}>
//                 {meta.label}
//               </span>

//               {/* Unread dot */}
//               {!n.isRead && (
//                 <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
//               )}

//               {/* ── Admin recipient badge ── */}
//               {isAdmin && n.user && (
//                 <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 max-w-xs truncate">
//                   <User size={11} className="flex-shrink-0 text-gray-400" />
//                   <span className="truncate">{n.user.name}</span>
//                   <span className="text-gray-300">·</span>
//                   <span className="text-gray-400 truncate">{n.user.email}</span>
//                 </span>
//               )}
//             </div>

//             {/* Title & message */}
//             <h4 className={`font-bold text-sm mt-1 ${n.isRead ? "text-gray-600" : "text-[#1A1A2E]"}`}>
//               {n.title}
//             </h4>
//             <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>

//             {/* Webinar join button */}
//             {n.webinar && n.webinar.status !== "cancelled" && (
//               <a href={n.webinar.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
//                 style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//                 🚀 Join Webinar <ExternalLink size={11} />
//               </a>
//             )}

//             {/* Exam attachment */}
//             {n.exam?.fileUrl && (
//               <a href={n.exam.fileUrl} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold"
//                 style={{ background: meta.bg, color: meta.color }}>
//                 📎 {n.exam.fileName ?? "View Attachment"} <ExternalLink size={11} />
//               </a>
//             )}

//             {/* Generic link */}
//             {n.link && !n.webinar && !n.exam?.fileUrl && (
//               <a href={n.link} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
//                 style={{ color: meta.color }}>
//                 View details <ExternalLink size={10} />
//               </a>
//             )}
//           </div>

//           {/* Action buttons */}
//           <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//             {!n.isRead && (
//               <button onClick={onRead} title="Mark as read"
//                 className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
//                 <Check size={13} />
//               </button>
//             )}
//             <button onClick={onDelete} title="Delete"
//               className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//               <Trash2 size={13} />
//             </button>
//           </div>
//         </div>

//         <p className="text-xs text-gray-400 mt-1.5 font-medium">{timeAgo}</p>
//       </div>
//     </div>
//   );
// }
























// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Bell, BellOff, Check, CheckCheck, Trash2, Video,
//   Megaphone, BookOpen, Calendar, Info, Loader2,
//   ExternalLink, RefreshCw, User, ChevronDown, ChevronUp,
//   Users, Filter,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

// interface WebinarSnippet {
//   id: string; title: string; scheduledAt: string;
//   meetingLink: string; platform: string; status: string;
// }
// interface ExamSnippet {
//   id: string; examName: string;
//   examStartDate?: string; examEndDate?: string;
//   description?: string; fileUrl?: string; fileName?: string;
//   program?: { id: string; name: string };
//   level?:   { id: string; name: string };
// }
// interface RecipientSnippet {
//   id: string; name: string | null; email: string; role: string;
// }
// interface Notification {
//   id: string; type: NotifType; title: string;
//   message: string; isRead: boolean; link?: string;
//   webinarId?: string; webinar?: WebinarSnippet;
//   examId?: string;   exam?: ExamSnippet;
//   createdAt: string; user?: RecipientSnippet;
// }
// interface UserOption { id: string; name: string | null; email: string; }

// const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
//   webinar:      { icon: Video,     color: "#2D8CFF", bg: "#EBF4FF", label: "Webinar" },
//   announcement: { icon: Megaphone, color: "#FF6B6B", bg: "#FFF0F0", label: "Announcement" },
//   exam:         { icon: BookOpen,  color: "#8B5CF6", bg: "#F5F3FF", label: "Exam" },
//   attendance:   { icon: Calendar,  color: "#22C55E", bg: "#F0FDF4", label: "Attendance" },
//   general:      { icon: Info,      color: "#FFB347", bg: "#FFF8EC", label: "General" },
// };

// // ─── Helper: group notifications by userId ───────────────────────────────────
// function groupByUser(notifications: Notification[]) {
//   const map = new Map<string, { user: RecipientSnippet; items: Notification[] }>();
//   for (const n of notifications) {
//     const uid = n.user?.id ?? "unknown";
//     if (!map.has(uid)) map.set(uid, { user: n.user!, items: [] });
//     map.get(uid)!.items.push(n);
//   }
//   return [...map.values()];
// }

// export default function NotificationsView() {
//   const { token, user: authUser } = useAuth();
//   const isAdmin = authUser?.role === "admin";

//   const [notifications, setNotifications]   = useState<Notification[]>([]);
//   const [unreadCount,   setUnreadCount]      = useState(0);
//   const [userOptions,   setUserOptions]      = useState<UserOption[]>([]);
//   const [loading,       setLoading]          = useState(true);

//   // filters
//   const [readFilter,   setReadFilter]   = useState<"all" | "unread">("all");
//   const [typeFilter,   setTypeFilter]   = useState<NotifType | "">("");
//   const [userFilter,   setUserFilter]   = useState<string>("");       // admin only
//   const [viewMode,     setViewMode]     = useState<"flat" | "grouped">("grouped"); // admin only

//   const authFetch = useCallback((url: string, init: RequestInit = {}) =>
//     fetch(url, { ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } })
//   , [token]);

//   const fetchNotifications = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (readFilter === "unread") params.set("unread", "true");
//       if (typeFilter)              params.set("type", typeFilter);
//       if (isAdmin && userFilter)   params.set("userId", userFilter);
//       params.set("limit", "200");

//       const res  = await authFetch(`/api/notifications?${params}`);
//       const data = await res.json();
//       setNotifications(data.notifications  || []);
//       setUnreadCount(data.unreadCount      ?? 0);
//       if (isAdmin) setUserOptions(data.usersWithNotifs || []);
//     } catch {}
//     finally { setLoading(false); }
//   }, [readFilter, typeFilter, userFilter, authFetch, token, isAdmin]);

//   useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

//   const markRead = async (id: string) => {
//     await authFetch(`/api/notifications/${id}`, { method: "PATCH" });
//     setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
//     setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const markAllRead = async () => {
//     await authFetch("/api/notifications", { method: "PATCH" });
//     setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
//     setUnreadCount(0);
//   };

//   const deleteNotif = async (id: string, wasRead: boolean) => {
//     await authFetch(`/api/notifications/${id}`, { method: "DELETE" });
//     setNotifications(ns => ns.filter(n => n.id !== id));
//     if (!wasRead) setUnreadCount(c => Math.max(0, c - 1));
//   };

//   const groups = isAdmin && viewMode === "grouped"
//     ? groupByUser(notifications)
//     : null;

//   return (
//     <div className="flex flex-col gap-5">

//       {/* ── Header ── */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-md">
//               <Bell size={18} className="text-white" />
//             </div>
//             {unreadCount > 0 && (
//               <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
//                 {unreadCount > 99 ? "99+" : unreadCount}
//               </span>
//             )}
//           </div>
//           <div>
//             <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Notifications</h1>
//             <p className="text-sm text-gray-500">
//               {isAdmin
//                 ? `${notifications.length} total · ${unreadCount} unread`
//                 : unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {!isAdmin && unreadCount > 0 && (
//             <button onClick={markAllRead}
//               className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl hover:bg-[#FF6B6B]/5 transition-colors">
//               <CheckCheck size={14} /> Mark all read
//             </button>
//           )}
//           <button onClick={fetchNotifications}
//             className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
//             <RefreshCw size={15} />
//           </button>
//         </div>
//       </div>

//       {/* ── Filters ── */}
//       <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
//         <Filter size={14} className="text-gray-400 flex-shrink-0" />

//         {/* Read filter */}
//         <div className="flex bg-white border border-gray-200 rounded-xl p-0.5">
//           {(["all", "unread"] as const).map(f => (
//             <button key={f} onClick={() => setReadFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
//                 ${readFilter === f ? "bg-[#FF6B6B] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
//               {f === "all" ? "All" : `Unread (${unreadCount})`}
//             </button>
//           ))}
//         </div>

//         {/* Type filter */}
//         <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
//           className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
//           <option value="">All Types</option>
//           {(Object.entries(TYPE_META) as [NotifType, any][]).map(([type, meta]) => (
//             <option key={type} value={type}>{meta.label}</option>
//           ))}
//         </select>

//         {/* Admin-only: user filter + view mode toggle */}
//         {isAdmin && (
//           <>
//             <select value={userFilter} onChange={e => setUserFilter(e.target.value)}
//               className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700 max-w-[200px]">
//               <option value="">All Users</option>
//               {userOptions.map(u => (
//                 <option key={u.id} value={u.id}>
//                   {u.name ?? u.email}
//                 </option>
//               ))}
//             </select>

//             {/* Grouped / Flat toggle — only meaningful when no single user is selected */}
//             {!userFilter && (
//               <div className="flex bg-white border border-gray-200 rounded-xl p-0.5 ml-auto">
//                 <button onClick={() => setViewMode("grouped")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
//                     ${viewMode === "grouped" ? "bg-[#FF6B6B] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
//                   <Users size={12} /> Grouped
//                 </button>
//                 <button onClick={() => setViewMode("flat")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
//                     ${viewMode === "flat" ? "bg-[#FF6B6B] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
//                   <Bell size={12} /> Flat
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Content ── */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={26} className="animate-spin text-[#FF6B6B]" />
//         </div>
//       ) : notifications.length === 0 ? (
//         <EmptyState filter={readFilter} />
//       ) : groups ? (
//         /* ── Grouped view (admin, no userFilter) ── */
//         <div className="flex flex-col gap-4">
//           {groups.map(g => (
//             <UserGroup
//               key={g.user?.id ?? "unknown"}
//               user={g.user}
//               notifications={g.items}
//               onRead={markRead}
//               onDelete={deleteNotif}
//             />
//           ))}
//         </div>
//       ) : (
//         /* ── Flat view ── */
//         <div className="space-y-2">
//           {notifications.map(n => (
//             <NotificationItem key={n.id} notif={n} isAdmin={isAdmin}
//               onRead={() => markRead(n.id)}
//               onDelete={() => deleteNotif(n.id, n.isRead)} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── UserGroup (collapsible card per user) ────────────────────────────────────
// function UserGroup({ user, notifications, onRead, onDelete }: {
//   user: RecipientSnippet;
//   notifications: Notification[];
//   onRead: (id: string) => void;
//   onDelete: (id: string, wasRead: boolean) => void;
// }) {
//   const [open, setOpen] = useState(true);
//   const unread = notifications.filter(n => !n.isRead).length;

//   return (
//     <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
//       {/* Group header */}
//       <button
//         onClick={() => setOpen(o => !o)}
//         className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
//       >
//         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center flex-shrink-0">
//           <User size={14} className="text-white" />
//         </div>
//         <div className="flex-1 text-left min-w-0">
//           <p className="font-bold text-sm text-[#1A1A2E] truncate">
//             {user?.name ?? "Unknown User"}
//           </p>
//           <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <span className="text-xs text-gray-500 font-medium">
//             {notifications.length} notif{notifications.length !== 1 ? "s" : ""}
//           </span>
//           {unread > 0 && (
//             <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
//               {unread}
//             </span>
//           )}
//           {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
//         </div>
//       </button>

//       {/* Notification list */}
//       {open && (
//         <div className="divide-y divide-gray-50">
//           {notifications.map(n => (
//             <NotificationItem key={n.id} notif={n} isAdmin={false}
//               onRead={() => onRead(n.id)}
//               onDelete={() => onDelete(n.id, n.isRead)} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Single notification row ──────────────────────────────────────────────────
// function NotificationItem({ notif: n, isAdmin, onRead, onDelete }: {
//   notif: Notification; isAdmin: boolean;
//   onRead: () => void; onDelete: () => void;
// }) {
//   const meta = TYPE_META[n.type] || TYPE_META.general;
//   const Icon = meta.icon;

//   const timeAgo = (() => {
//     const diff = Date.now() - new Date(n.createdAt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs / 24)}d ago`;
//   })();

//   return (
//     <div
//       className={`flex items-start gap-4 p-4 transition-all group
//         ${n.isRead ? "bg-white opacity-70" : "bg-white border-l-4 shadow-sm"}`}
//       style={!n.isRead ? { borderLeftColor: meta.color } : {}}
//     >
//       <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: meta.bg }}>
//         <Icon size={16} style={{ color: meta.color }} />
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0 flex-1">
//             {/* Badges */}
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
//                 style={{ background: meta.bg, color: meta.color }}>
//                 {meta.label}
//               </span>
//               {!n.isRead && (
//                 <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
//               )}
//               {/* Recipient badge — flat/admin view only */}
//               {isAdmin && n.user && (
//                 <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
//                   <User size={10} className="flex-shrink-0" />
//                   <span className="truncate max-w-[140px]">{n.user.name ?? n.user.email}</span>
//                 </span>
//               )}
//             </div>

//             <h4 className={`font-bold text-sm mt-1 ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
//               {n.title}
//             </h4>
//             <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>

//             {n.webinar && n.webinar.status !== "cancelled" && (
//               <a href={n.webinar.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
//                 style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//                 🚀 Join Webinar <ExternalLink size={11} />
//               </a>
//             )}
//             {n.exam?.fileUrl && (
//               <a href={n.exam.fileUrl} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold"
//                 style={{ background: meta.bg, color: meta.color }}>
//                 📎 {n.exam.fileName ?? "View Attachment"} <ExternalLink size={11} />
//               </a>
//             )}
//             {n.link && !n.webinar && !n.exam?.fileUrl && (
//               <a href={n.link} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
//                 style={{ color: meta.color }}>
//                 View details <ExternalLink size={10} />
//               </a>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//             {!n.isRead && (
//               <button onClick={onRead} title="Mark as read"
//                 className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
//                 <Check size={13} />
//               </button>
//             )}
//             <button onClick={onDelete} title="Delete"
//               className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//               <Trash2 size={13} />
//             </button>
//           </div>
//         </div>
//         <p className="text-xs text-gray-400 mt-1.5 font-medium">{timeAgo}</p>
//       </div>
//     </div>
//   );
// }

// // ─── Empty state ──────────────────────────────────────────────────────────────
// function EmptyState({ filter }: { filter: "all" | "unread" }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
//         <BellOff size={36} className="text-gray-300" />
//       </div>
//       <h3 className="text-lg font-black text-[#1A1A2E] mb-1">
//         {filter === "unread" ? "No unread notifications" : "No notifications"}
//       </h3>
//       <p className="text-sm text-gray-400">
//         {filter === "unread" ? "You're all caught up! 🎉" : "Notifications will appear here."}
//       </p>
//     </div>
//   );
// }

















"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Bell, BellOff, Check, CheckCheck, Trash2, Video,
  Megaphone, BookOpen, Calendar, Info, Loader2,
  ExternalLink, RefreshCw, User, ChevronDown, ChevronUp,
  Users, Filter, Search, Layers, X, Square, CheckSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

interface WebinarSnippet {
  id: string; title: string; scheduledAt: string;
  meetingLink: string; platform: string; status: string;
}
interface ExamSnippet {
  id: string; examName: string;
  examStartDate?: string; examEndDate?: string;
  description?: string; fileUrl?: string; fileName?: string;
  program?: { id: string; name: string };
  level?:   { id: string; name: string };
}
interface RecipientSnippet {
  id: string; name: string | null; email: string; role: string;
}
interface Notification {
  id: string; type: NotifType; title: string;
  message: string; isRead: boolean; link?: string;
  webinarId?: string; webinar?: WebinarSnippet;
  examId?: string;   exam?: ExamSnippet;
  createdAt: string; user?: RecipientSnippet;
}
interface UserOption { id: string; name: string | null; email: string; }

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  webinar:      { icon: Video,     color: "#2D8CFF", bg: "#EBF4FF", label: "Webinar" },
  announcement: { icon: Megaphone, color: "#FF6B6B", bg: "#FFF0F0", label: "Announcement" },
  exam:         { icon: BookOpen,  color: "#8B5CF6", bg: "#F5F3FF", label: "Exam" },
  attendance:   { icon: Calendar,  color: "#22C55E", bg: "#F0FDF4", label: "Attendance" },
  general:      { icon: Info,      color: "#FFB347", bg: "#FFF8EC", label: "General" },
};

function groupByUser(notifications: Notification[]) {
  const map = new Map<string, { user: RecipientSnippet; items: Notification[] }>();
  for (const n of notifications) {
    const uid = n.user?.id ?? "unknown";
    if (!map.has(uid)) map.set(uid, { user: n.user!, items: [] });
    map.get(uid)!.items.push(n);
  }
  return [...map.values()];
}

export default function NotificationsView() {
  const { token, user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [userOptions,   setUserOptions]   = useState<UserOption[]>([]);
  const [loading,       setLoading]       = useState(true);

  // filters
  const [readFilter,  setReadFilter]  = useState<"all" | "unread">("all");
  const [typeFilter,  setTypeFilter]  = useState<NotifType | "">("");
  const [userFilter,  setUserFilter]  = useState<string>("");
  const [viewMode,    setViewMode]    = useState<"flat" | "grouped">("grouped");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const authFetch = useCallback((url: string, init: RequestInit = {}) =>
    fetch(url, { ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } })
  , [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const params = new URLSearchParams();
      if (readFilter === "unread") params.set("unread", "true");
      if (typeFilter)              params.set("type", typeFilter);
      if (isAdmin && userFilter)   params.set("userId", userFilter);
      params.set("limit", "200");

      const res  = await authFetch(`/api/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications  || []);
      setUnreadCount(data.unreadCount      ?? 0);
      if (isAdmin) setUserOptions(data.usersWithNotifs || []);
    } catch {}
    finally { setLoading(false); }
  }, [readFilter, typeFilter, userFilter, authFetch, token, isAdmin]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Client-side search filter (by user name/email) ────────────────────────
  const displayed = useMemo(() => {
    if (!searchQuery.trim()) return notifications;
    const q = searchQuery.toLowerCase();
    return notifications.filter(n => {
      const name  = (n.user?.name  ?? "").toLowerCase();
      const email = (n.user?.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [notifications, searchQuery]);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const allIds        = useMemo(() => displayed.map(n => n.id), [displayed]);
  const allSelected   = allIds.length > 0 && allIds.every(id => selectedIds.has(id));
  const someSelected  = selectedIds.size > 0;

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(allIds));

  // ── Actions ───────────────────────────────────────────────────────────────
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
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    if (!wasRead) setUnreadCount(c => Math.max(0, c - 1));
  };

  // Delete ALL currently displayed notifications
  const deleteAll = async () => {
    if (!displayed.length) return;
    if (!confirm(`Delete all ${displayed.length} notification${displayed.length !== 1 ? "s" : ""}? This cannot be undone.`)) return;
    await Promise.all(displayed.map(n =>
      authFetch(`/api/notifications/${n.id}`, { method: "DELETE" })
    ));
    const deletedIds = new Set(displayed.map(n => n.id));
    const deletedUnread = displayed.filter(n => !n.isRead).length;
    setNotifications(ns => ns.filter(n => !deletedIds.has(n.id)));
    setUnreadCount(c => Math.max(0, c - deletedUnread));
    setSelectedIds(new Set());
  };

  // Delete only selected notifications
  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected notification${selectedIds.size !== 1 ? "s" : ""}? This cannot be undone.`)) return;
    const toDelete = displayed.filter(n => selectedIds.has(n.id));
    await Promise.all(toDelete.map(n =>
      authFetch(`/api/notifications/${n.id}`, { method: "DELETE" })
    ));
    const deletedUnread = toDelete.filter(n => !n.isRead).length;
    setNotifications(ns => ns.filter(n => !selectedIds.has(n.id)));
    setUnreadCount(c => Math.max(0, c - deletedUnread));
    setSelectedIds(new Set());
  };

  const groups = isAdmin && viewMode === "grouped" && !userFilter
    ? groupByUser(displayed)
    : null;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
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
              {isAdmin
                ? `${displayed.length} shown · ${unreadCount} unread`
                : unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mark all read — non-admin only */}
          {!isAdmin && unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl hover:bg-[#FF6B6B]/5 transition-colors">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}

          {/* Delete selected */}
          {someSelected && (
            <button onClick={deleteSelected}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
              Delete selected ({selectedIds.size})
            </button>
          )}

          {/* Delete all */}
          {displayed.length > 0 && (
            <button onClick={deleteAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm">
              <Trash2 size={14} /> Delete all
            </button>
          )}

          {/* Group toggle button */}
          {isAdmin && !userFilter && (
            <button
              onClick={() => setViewMode(v => v === "grouped" ? "flat" : "grouped")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border transition-colors
                ${viewMode === "grouped"
                  ? "bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-sm"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              <Layers size={14} />
              {viewMode === "grouped" ? "Grouped" : "Group by user"}
            </button>
          )}

          <button onClick={fetchNotifications}
            className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-gray-400 flex-shrink-0" />

          {/* Read filter */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-0.5">
            {(["all", "unread"] as const).map(f => (
              <button key={f} onClick={() => setReadFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${readFilter === f ? "bg-[#FF6B6B] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {f === "all" ? "All" : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
            <option value="">All Types</option>
            {(Object.entries(TYPE_META) as [NotifType, any][]).map(([type, meta]) => (
              <option key={type} value={type}>{meta.label}</option>
            ))}
          </select>

          {/* Admin: user dropdown */}
          {isAdmin && (
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700 max-w-[200px]">
              <option value="">All Users</option>
              {userOptions.map(u => (
                <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
              ))}
            </select>
          )}
        </div>

        {/* Search bar — admin only, searches by user name/email client-side */}
        {isAdmin && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by user name or email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Select all bar — shown when there are items ── */}
      {!loading && displayed.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <button onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#FF6B6B] transition-colors">
            {allSelected
              ? <CheckSquare size={15} className="text-[#FF6B6B]" />
              : <Square size={15} />}
            {allSelected ? "Deselect all" : `Select all (${displayed.length})`}
          </button>
          {someSelected && (
            <span className="text-xs text-gray-400">{selectedIds.size} selected</span>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={26} className="animate-spin text-[#FF6B6B]" />
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState filter={readFilter} hasSearch={!!searchQuery} />
      ) : groups ? (
        /* Grouped view */
        <div className="flex flex-col gap-4">
          {groups.map(g => (
            <UserGroup
              key={g.user?.id ?? "unknown"}
              user={g.user}
              notifications={g.items}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onRead={markRead}
              onDelete={deleteNotif}
            />
          ))}
        </div>
      ) : (
        /* Flat view */
        <div className="space-y-2">
          {displayed.map(n => (
            <NotificationItem key={n.id} notif={n} isAdmin={isAdmin}
              selected={selectedIds.has(n.id)}
              onToggleSelect={() => toggleSelect(n.id)}
              onRead={() => markRead(n.id)}
              onDelete={() => deleteNotif(n.id, n.isRead)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── UserGroup ────────────────────────────────────────────────────────────────
function UserGroup({ user, notifications, selectedIds, onToggleSelect, onRead, onDelete }: {
  user: RecipientSnippet;
  notifications: Notification[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onRead: (id: string) => void;
  onDelete: (id: string, wasRead: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-bold text-sm text-[#1A1A2E] truncate">{user?.name ?? "Unknown User"}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            {notifications.length} notif{notifications.length !== 1 ? "s" : ""}
          </span>
          {unread > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
          {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-gray-50">
          {notifications.map(n => (
            <NotificationItem key={n.id} notif={n} isAdmin={false}
              selected={selectedIds.has(n.id)}
              onToggleSelect={() => onToggleSelect(n.id)}
              onRead={() => onRead(n.id)}
              onDelete={() => onDelete(n.id, n.isRead)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NotificationItem ─────────────────────────────────────────────────────────
function NotificationItem({ notif: n, isAdmin, selected, onToggleSelect, onRead, onDelete }: {
  notif: Notification; isAdmin: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onRead: () => void; onDelete: () => void;
}) {
  const meta = TYPE_META[n.type] || TYPE_META.general;
  const Icon = meta.icon;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div
      className={`flex items-start gap-3 p-4 transition-all group
        ${selected ? "bg-red-50/60" : n.isRead ? "bg-white opacity-70" : "bg-white shadow-sm"}
        ${!n.isRead && !selected ? "border-l-4" : ""}`}
      style={!n.isRead && !selected ? { borderLeftColor: meta.color } : {}}
    >
      {/* Checkbox */}
      <button
        onClick={onToggleSelect}
        className="flex-shrink-0 mt-0.5 text-gray-300 hover:text-[#FF6B6B] transition-colors"
        title={selected ? "Deselect" : "Select"}
      >
        {selected
          ? <CheckSquare size={16} className="text-[#FF6B6B]" />
          : <Square size={16} />}
      </button>

      {/* Icon */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: meta.bg }}>
        <Icon size={16} style={{ color: meta.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: meta.bg, color: meta.color }}>
                {meta.label}
              </span>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
              )}
              {isAdmin && n.user && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                  <User size={10} className="flex-shrink-0" />
                  <span className="truncate max-w-[140px]">{n.user.name ?? n.user.email}</span>
                </span>
              )}
            </div>

            <h4 className={`font-bold text-sm mt-1 ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
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
            {n.exam?.fileUrl && (
              <a href={n.exam.fileUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: meta.bg, color: meta.color }}>
                📎 {n.exam.fileName ?? "View Attachment"} <ExternalLink size={11} />
              </a>
            )}
            {n.link && !n.webinar && !n.exam?.fileUrl && (
              <a href={n.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-xs font-semibold hover:underline"
                style={{ color: meta.color }}>
                View details <ExternalLink size={10} />
              </a>
            )}
          </div>

          {/* Actions */}
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

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ filter, hasSearch }: { filter: "all" | "unread"; hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
        <BellOff size={36} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-black text-[#1A1A2E] mb-1">
        {hasSearch
          ? "No matching notifications"
          : filter === "unread" ? "No unread notifications" : "No notifications"}
      </h3>
      <p className="text-sm text-gray-400">
        {hasSearch
          ? "Try a different name or email."
          : filter === "unread" ? "You're all caught up! 🎉" : "Notifications will appear here."}
      </p>
    </div>
  );
}