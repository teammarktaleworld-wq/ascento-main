









// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Bell, CheckCheck, Loader2, X, ChevronRight } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

// interface Notification {
//   id: string;
//   type: NotifType;
//   title: string;
//   message: string;
//   isRead: boolean;
//   link?: string;
//   webinar?: { meetingLink: string; status: string };
//   createdAt: string;
// }

// const TYPE_META: Record<NotifType, { color: string; bg: string; icon: string }> = {
//   webinar:      { color: "#6366F1", bg: "#EEF2FF", icon: "📹" },
//   announcement: { color: "#F59E0B", bg: "#FFFBEB", icon: "📣" },
//   exam:         { color: "#8B5CF6", bg: "#F5F3FF", icon: "📖" },
//   attendance:   { color: "#10B981", bg: "#ECFDF5", icon: "📅" },
//   general:      { color: "#3B82F6", bg: "#EFF6FF", icon: "ℹ️" },
// };

// function timeAgo(dateStr: string) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1)  return "Just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24)  return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// }

// export default function UserTopBar({
//   title,
//   onNotificationsClick,
// }: {
//   title: string;
//   onNotificationsClick?: () => void;
// }) {
//   const { token, user } = useAuth();

//   const [open,          setOpen]          = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount,   setUnreadCount]   = useState(0);
//   const [loading,       setLoading]       = useState(false);
//   const [ringing,       setRinging]       = useState(false);

//   const dropdownRef  = useRef<HTMLDivElement>(null);
//   const prevCountRef = useRef(0);

//   const tokenRef = useRef<string | null>(null);
//   useEffect(() => { tokenRef.current = token; }, [token]);

//   const safeFetch = useCallback((url: string, init: RequestInit = {}) => {
//     const t = tokenRef.current;
//     if (!t) return null;
//     return fetch(url, {
//       ...init,
//       headers: { ...(init.headers ?? {}), Authorization: `Bearer ${t}` },
//     });
//   }, []);

//   const triggerRing = () => {
//     setRinging(true);
//     setTimeout(() => setRinging(false), 800);
//   };

//   const pollCount = useCallback(async () => {
//     const p = safeFetch("/api/notifications?limit=1");
//     if (!p) return;
//     try {
//       const res = await p;
//       if (!res.ok) return;
//       const data  = await res.json();
//       const count: number = data.unreadCount ?? 0;
//       if (count > prevCountRef.current) triggerRing();
//       prevCountRef.current = count;
//       setUnreadCount(count);
//     } catch {}
//   }, [safeFetch]);

//   useEffect(() => {
//     if (!token) return;
//     pollCount();
//     const id = setInterval(pollCount, 30_000);
//     return () => clearInterval(id);
//   }, [token, pollCount]);

//   const fetchDropdown = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = safeFetch("/api/notifications?limit=10");
//       if (!p) return;
//       const res = await p;
//       if (!res.ok) return;
//       const data = await res.json();
//       setNotifications(data.notifications ?? []);
//       const count: number = data.unreadCount ?? 0;
//       setUnreadCount(count);
//       prevCountRef.current = count;
//     } catch {}
//     finally { setLoading(false); }
//   }, [safeFetch]);

//   const toggleOpen = () => {
//     if (!open) fetchDropdown();
//     setOpen(v => !v);
//   };

//   const markRead = async (id: string) => {
//     const p = safeFetch(`/api/notifications/${id}`, { method: "PATCH" });
//     if (!p) return;
//     await p;
//     setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
//     setUnreadCount(c => {
//       const next = Math.max(0, c - 1);
//       prevCountRef.current = next;
//       return next;
//     });
//   };

//   const markAllRead = async () => {
//     const p = safeFetch("/api/notifications", { method: "PATCH" });
//     if (!p) return;
//     await p;
//     setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
//     setUnreadCount(0);
//     prevCountRef.current = 0;
//   };

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
//         setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Derive initials from user name or email
//   const initials = (() => {
//     const name = (user as any)?.name || (user as any)?.email || "U";
//     return name.slice(0, 1).toUpperCase();
//   })();

//   const label = title.charAt(0).toUpperCase() + title.slice(1);

//   return (
//     <>
//       <style>{`
//         @keyframes bell-ring {
//           0%,100% { transform: rotate(0); }
//           15%     { transform: rotate(14deg); }
//           30%     { transform: rotate(-12deg); }
//           45%     { transform: rotate(9deg); }
//           60%     { transform: rotate(-7deg); }
//           75%     { transform: rotate(4deg); }
//           90%     { transform: rotate(-2deg); }
//         }
//         .user-bell-ringing { animation: bell-ring 0.8s ease-in-out; }
//         @keyframes badge-pop {
//           0%   { transform: scale(0.5); opacity: 0; }
//           60%  { transform: scale(1.2); }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .user-badge-pop { animation: badge-pop 0.3s cubic-bezier(.34,1.56,.64,1); }
//       `}</style>

//       <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
//         <h2 className="text-lg font-black text-[#1A1A2E] tracking-tight">{label}</h2>

//         <div className="flex items-center gap-3">

//           {/* Bell + dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={toggleOpen}
//               aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
//               className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all
//                 ${open
//                   ? "bg-indigo-50 text-indigo-500"
//                   : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
//             >
//               <Bell size={18} className={ringing ? "user-bell-ringing" : ""} />
//               {unreadCount > 0 && (
//                 <span
//                   key={unreadCount}
//                   className="user-badge-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
//                     bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px]
//                     font-black rounded-full flex items-center justify-center leading-none shadow-sm"
//                 >
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl
//                 shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 z-[200] overflow-hidden">

//                 {/* Header */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//                   <div className="flex items-center gap-2">
//                     <span className="font-black text-[#1A1A2E] text-sm">Notifications</span>
//                     {unreadCount > 0 && (
//                       <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
//                         {unreadCount} new
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {unreadCount > 0 && (
//                       <button onClick={markAllRead}
//                         className="flex items-center gap-1 text-xs font-semibold text-gray-400
//                           hover:text-indigo-500 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
//                         <CheckCheck size={12} /> All read
//                       </button>
//                     )}
//                     <button onClick={() => setOpen(false)}
//                       className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100">
//                       <X size={14} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* List */}
//                 <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
//                   {loading ? (
//                     <div className="flex items-center justify-center py-10">
//                       <Loader2 size={20} className="animate-spin text-indigo-500" />
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-10 text-center px-4">
//                       <Bell size={28} className="text-gray-200 mb-2" />
//                       <p className="text-sm font-bold text-gray-400">No notifications yet</p>
//                       <p className="text-xs text-gray-300 mt-0.5">
//                         You'll be notified of webinars, exams, and more.
//                       </p>
//                     </div>
//                   ) : (
//                     notifications.map(n => {
//                       const meta = TYPE_META[n.type] ?? TYPE_META.general;
//                       return (
//                         <div
//                           key={n.id}
//                           onClick={() => !n.isRead && markRead(n.id)}
//                           className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
//                             ${n.isRead
//                               ? "hover:bg-gray-50/60"
//                               : "bg-indigo-50/20 hover:bg-indigo-50/40 border-l-2"}`}
//                           style={!n.isRead ? { borderLeftColor: meta.color } : {}}
//                         >
//                           <div
//                             className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
//                             style={{ background: meta.bg }}
//                           >
//                             {meta.icon}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className={`text-sm font-bold leading-snug truncate
//                               ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
//                               {n.title}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
//                             {n.webinar && n.webinar.status === "active" && (
//                               <a
//                                 href={n.webinar.meetingLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 onClick={e => e.stopPropagation()}
//                                 className="inline-flex items-center gap-1 mt-1 text-xs font-bold"
//                                 style={{ color: meta.color }}
//                               >
//                                 🚀 Join webinar →
//                               </a>
//                             )}
//                             <p className="text-[10px] text-gray-300 font-medium mt-1">
//                               {timeAgo(n.createdAt)}
//                             </p>
//                           </div>
//                           {!n.isRead && (
//                             <span
//                               className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
//                               style={{ background: meta.color }}
//                             />
//                           )}
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <button
//                   onClick={() => { setOpen(false); onNotificationsClick?.(); }}
//                   className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold
//                     text-indigo-500 hover:bg-indigo-50 transition-colors border-t border-gray-100"
//                 >
//                   View all notifications <ChevronRight size={12} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* User avatar */}
//           <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl
//             flex items-center justify-center shadow-sm">
//             <span className="text-white text-sm font-black">{initials}</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

















// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { Bell, CheckCheck, Loader2, X, ChevronRight } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// type NotifType = "webinar" | "announcement" | "exam" | "attendance" | "general";

// interface Notification {
//   id: string;
//   type: NotifType;
//   title: string;
//   message: string;
//   isRead: boolean;
//   link?: string;
//   webinar?: { meetingLink: string; status: string };
//   createdAt: string;
// }

// const TYPE_META: Record<NotifType, { color: string; bg: string; icon: string }> = {
//   webinar:      { color: "#6366F1", bg: "#EEF2FF", icon: "📹" },
//   announcement: { color: "#F59E0B", bg: "#FFFBEB", icon: "📣" },
//   exam:         { color: "#8B5CF6", bg: "#F5F3FF", icon: "📖" },
//   attendance:   { color: "#10B981", bg: "#ECFDF5", icon: "📅" },
//   general:      { color: "#3B82F6", bg: "#EFF6FF", icon: "ℹ️" },
// };

// function timeAgo(dateStr: string) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1)  return "Just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24)  return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// }

// interface UserTopBarProps {
//   title?: string;
//   onNotificationsClick?: () => void;
// }

// export default function UserTopBar({
//   title = "",
//   onNotificationsClick,
// }: UserTopBarProps) {
//   const { token, user } = useAuth();

//   const [open,          setOpen]          = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount,   setUnreadCount]   = useState(0);
//   const [loading,       setLoading]       = useState(false);
//   const [ringing,       setRinging]       = useState(false);

//   const dropdownRef  = useRef<HTMLDivElement>(null);
//   const prevCountRef = useRef(0);

//   const tokenRef = useRef<string | null>(null);
//   useEffect(() => { tokenRef.current = token ?? null; }, [token]);

//   const safeFetch = useCallback((url: string, init: RequestInit = {}) => {
//     const t = tokenRef.current;
//     if (!t) return null;
//     return fetch(url, {
//       ...init,
//       headers: { ...(init.headers ?? {}), Authorization: `Bearer ${t}` },
//     });
//   }, []);

//   const triggerRing = () => {
//     setRinging(true);
//     setTimeout(() => setRinging(false), 800);
//   };

//   const pollCount = useCallback(async () => {
//     const p = safeFetch("/api/notifications?limit=1");
//     if (!p) return;
//     try {
//       const res = await p;
//       if (!res.ok) return;
//       const data  = await res.json();
//       const count: number = data.unreadCount ?? 0;
//       if (count > prevCountRef.current) triggerRing();
//       prevCountRef.current = count;
//       setUnreadCount(count);
//     } catch {}
//   }, [safeFetch]);

//   useEffect(() => {
//     if (!token) return;
//     pollCount();
//     const id = setInterval(pollCount, 30_000);
//     return () => clearInterval(id);
//   }, [token, pollCount]);

//   const fetchDropdown = useCallback(async () => {
//     setLoading(true);
//     try {
//       const p = safeFetch("/api/notifications?limit=10");
//       if (!p) return;
//       const res = await p;
//       if (!res.ok) return;
//       const data = await res.json();
//       setNotifications(data.notifications ?? []);
//       const count: number = data.unreadCount ?? 0;
//       setUnreadCount(count);
//       prevCountRef.current = count;
//     } catch {}
//     finally { setLoading(false); }
//   }, [safeFetch]);

//   const toggleOpen = () => {
//     if (!open) fetchDropdown();
//     setOpen(v => !v);
//   };

//   const markRead = async (id: string) => {
//     const p = safeFetch(`/api/notifications/${id}`, { method: "PATCH" });
//     if (!p) return;
//     await p;
//     setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
//     setUnreadCount(c => {
//       const next = Math.max(0, c - 1);
//       prevCountRef.current = next;
//       return next;
//     });
//   };

//   const markAllRead = async () => {
//     const p = safeFetch("/api/notifications", { method: "PATCH" });
//     if (!p) return;
//     await p;
//     setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
//     setUnreadCount(0);
//     prevCountRef.current = 0;
//   };

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
//         setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Safe initials — works even when user is null/undefined on first render
//   const initials = (() => {
//     const raw = (user as any)?.name || (user as any)?.email || "";
//     const trimmed = typeof raw === "string" ? raw.trim() : "";
//     return trimmed.length > 0 ? trimmed[0].toUpperCase() : "U";
//   })();

//   // Safe label — typeof guard so it never crashes even if title is undefined at runtime
//   const label = (() => {
//     const t = typeof title === "string" ? title : "";
//     return t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : "";
//   })();

//   return (
//     <>
//       <style>{`
//         @keyframes bell-ring {
//           0%,100% { transform: rotate(0); }
//           15%     { transform: rotate(14deg); }
//           30%     { transform: rotate(-12deg); }
//           45%     { transform: rotate(9deg); }
//           60%     { transform: rotate(-7deg); }
//           75%     { transform: rotate(4deg); }
//           90%     { transform: rotate(-2deg); }
//         }
//         .user-bell-ringing { animation: bell-ring 0.8s ease-in-out; }
//         @keyframes badge-pop {
//           0%   { transform: scale(0.5); opacity: 0; }
//           60%  { transform: scale(1.2); }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .user-badge-pop { animation: badge-pop 0.3s cubic-bezier(.34,1.56,.64,1); }
//       `}</style>

//       <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
//         <h2 className="text-lg font-black text-[#1A1A2E] tracking-tight">{label}</h2>

//         <div className="flex items-center gap-3">

//           {/* Bell + dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={toggleOpen}
//               aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
//               className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all
//                 ${open
//                   ? "bg-indigo-50 text-indigo-500"
//                   : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
//             >
//               <Bell size={18} className={ringing ? "user-bell-ringing" : ""} />
//               {unreadCount > 0 && (
//                 <span
//                   key={unreadCount}
//                   className="user-badge-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
//                     bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px]
//                     font-black rounded-full flex items-center justify-center leading-none shadow-sm"
//                 >
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             {open && (
//               <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl
//                 shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 z-[200] overflow-hidden">

//                 {/* Header */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//                   <div className="flex items-center gap-2">
//                     <span className="font-black text-[#1A1A2E] text-sm">Notifications</span>
//                     {unreadCount > 0 && (
//                       <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
//                         {unreadCount} new
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {unreadCount > 0 && (
//                       <button
//                         onClick={markAllRead}
//                         className="flex items-center gap-1 text-xs font-semibold text-gray-400
//                           hover:text-indigo-500 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
//                       >
//                         <CheckCheck size={12} /> All read
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* List */}
//                 <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
//                   {loading ? (
//                     <div className="flex items-center justify-center py-10">
//                       <Loader2 size={20} className="animate-spin text-indigo-500" />
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-10 text-center px-4">
//                       <Bell size={28} className="text-gray-200 mb-2" />
//                       <p className="text-sm font-bold text-gray-400">No notifications yet</p>
//                       <p className="text-xs text-gray-300 mt-0.5">
//                         You'll be notified of webinars, exams, and more.
//                       </p>
//                     </div>
//                   ) : (
//                     notifications.map(n => {
//                       const meta = TYPE_META[n.type] ?? TYPE_META.general;
//                       return (
//                         <div
//                           key={n.id}
//                           onClick={() => !n.isRead && markRead(n.id)}
//                           className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
//                             ${n.isRead
//                               ? "hover:bg-gray-50/60"
//                               : "bg-indigo-50/20 hover:bg-indigo-50/40 border-l-2"}`}
//                           style={!n.isRead ? { borderLeftColor: meta.color } : {}}
//                         >
//                           <div
//                             className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
//                             style={{ background: meta.bg }}
//                           >
//                             {meta.icon}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className={`text-sm font-bold leading-snug truncate
//                               ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
//                               {n.title}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
//                             {n.webinar && n.webinar.status === "active" && (
//                               <a
//                                 href={n.webinar.meetingLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 onClick={e => e.stopPropagation()}
//                                 className="inline-flex items-center gap-1 mt-1 text-xs font-bold"
//                                 style={{ color: meta.color }}
//                               >
//                                 🚀 Join webinar →
//                               </a>
//                             )}
//                             <p className="text-[10px] text-gray-300 font-medium mt-1">
//                               {timeAgo(n.createdAt)}
//                             </p>
//                           </div>
//                           {!n.isRead && (
//                             <span
//                               className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
//                               style={{ background: meta.color }}
//                             />
//                           )}
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <button
//                   onClick={() => { setOpen(false); onNotificationsClick?.(); }}
//                   className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold
//                     text-indigo-500 hover:bg-indigo-50 transition-colors border-t border-gray-100"
//                 >
//                   View all notifications <ChevronRight size={12} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* User avatar */}
//           <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl
//             flex items-center justify-center shadow-sm">
//             <span className="text-white text-sm font-black">{initials}</span>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }














"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, CheckCheck, Loader2, X, ChevronRight, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  webinar:      { color: "#6366F1", bg: "#EEF2FF", icon: "📹" },
  announcement: { color: "#F59E0B", bg: "#FFFBEB", icon: "📣" },
  exam:         { color: "#8B5CF6", bg: "#F5F3FF", icon: "📖" },
  attendance:   { color: "#10B981", bg: "#ECFDF5", icon: "📅" },
  general:      { color: "#3B82F6", bg: "#EFF6FF", icon: "ℹ️" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface UserTopBarProps {
  title?: string;
  onMenuClick?: () => void;           // ← hamburger toggle
  onNotificationsClick?: () => void;
}

export default function UserTopBar({
  title = "",
  onMenuClick,
  onNotificationsClick,
}: UserTopBarProps) {
  const { token, user } = useAuth();

  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [ringing,       setRinging]       = useState(false);

  const dropdownRef  = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const tokenRef = useRef<string | null>(null);
  useEffect(() => { tokenRef.current = token ?? null; }, [token]);

  const safeFetch = useCallback((url: string, init: RequestInit = {}) => {
    const t = tokenRef.current;
    if (!t) return null;
    return fetch(url, {
      ...init,
      headers: { ...(init.headers ?? {}), Authorization: `Bearer ${t}` },
    });
  }, []);

  const triggerRing = () => {
    setRinging(true);
    setTimeout(() => setRinging(false), 800);
  };

  const pollCount = useCallback(async () => {
    const p = safeFetch("/api/notifications?limit=1");
    if (!p) return;
    try {
      const res = await p;
      if (!res.ok) return;
      const data  = await res.json();
      const count: number = data.unreadCount ?? 0;
      if (count > prevCountRef.current) triggerRing();
      prevCountRef.current = count;
      setUnreadCount(count);
    } catch {}
  }, [safeFetch]);

  useEffect(() => {
    if (!token) return;
    pollCount();
    const id = setInterval(pollCount, 30_000);
    return () => clearInterval(id);
  }, [token, pollCount]);

  const fetchDropdown = useCallback(async () => {
    setLoading(true);
    try {
      const p = safeFetch("/api/notifications?limit=10");
      if (!p) return;
      const res = await p;
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      const count: number = data.unreadCount ?? 0;
      setUnreadCount(count);
      prevCountRef.current = count;
    } catch {}
    finally { setLoading(false); }
  }, [safeFetch]);

  const toggleOpen = () => {
    if (!open) fetchDropdown();
    setOpen(v => !v);
  };

  const markRead = async (id: string) => {
    const p = safeFetch(`/api/notifications/${id}`, { method: "PATCH" });
    if (!p) return;
    await p;
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => {
      const next = Math.max(0, c - 1);
      prevCountRef.current = next;
      return next;
    });
  };

  const markAllRead = async () => {
    const p = safeFetch("/api/notifications", { method: "PATCH" });
    if (!p) return;
    await p;
    setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    prevCountRef.current = 0;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = (() => {
    const raw = (user as any)?.name || (user as any)?.email || "";
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    return trimmed.length > 0 ? trimmed[0].toUpperCase() : "U";
  })();

  const label = (() => {
    const t = typeof title === "string" ? title : "";
    return t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : "";
  })();

  return (
    <>
      <style>{`
        @keyframes bell-ring {
          0%,100% { transform: rotate(0); }
          15%     { transform: rotate(14deg); }
          30%     { transform: rotate(-12deg); }
          45%     { transform: rotate(9deg); }
          60%     { transform: rotate(-7deg); }
          75%     { transform: rotate(4deg); }
          90%     { transform: rotate(-2deg); }
        }
        .user-bell-ringing { animation: bell-ring 0.8s ease-in-out; }
        @keyframes badge-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .user-badge-pop { animation: badge-pop 0.3s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-100 shadow-[0_1px_0_rgba(0,0,0,0.04)]">

        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          {/* Hamburger — visible only on mobile/tablet (hidden on lg+) */}
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500
              hover:text-gray-700 flex items-center justify-center transition-all active:scale-95"
          >
            <Menu size={18} />
          </button>

          <h2 className="text-lg font-black text-[#1A1A2E] tracking-tight">{label}</h2>
        </div>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-3">

          {/* Bell + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleOpen}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all
                ${open
                  ? "bg-indigo-50 text-indigo-500"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
            >
              <Bell size={18} className={ringing ? "user-bell-ringing" : ""} />
              {unreadCount > 0 && (
                <span
                  key={unreadCount}
                  className="user-badge-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                    bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px]
                    font-black rounded-full flex items-center justify-center leading-none shadow-sm"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl
                shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 z-[200] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#1A1A2E] text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-400
                          hover:text-indigo-500 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <CheckCheck size={12} /> All read
                      </button>
                    )}
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={20} className="animate-spin text-indigo-500" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <Bell size={28} className="text-gray-200 mb-2" />
                      <p className="text-sm font-bold text-gray-400">No notifications yet</p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        You'll be notified of webinars, exams, and more.
                      </p>
                    </div>
                  ) : (
                    notifications.map(n => {
                      const meta = TYPE_META[n.type] ?? TYPE_META.general;
                      return (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && markRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                            ${n.isRead
                              ? "hover:bg-gray-50/60"
                              : "bg-indigo-50/20 hover:bg-indigo-50/40 border-l-2"}`}
                          style={!n.isRead ? { borderLeftColor: meta.color } : {}}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                            style={{ background: meta.bg }}
                          >
                            {meta.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold leading-snug truncate
                              ${n.isRead ? "text-gray-500" : "text-[#1A1A2E]"}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                            {n.webinar && n.webinar.status === "active" && (
                              <a
                                href={n.webinar.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1 mt-1 text-xs font-bold"
                                style={{ color: meta.color }}
                              >
                                🚀 Join webinar →
                              </a>
                            )}
                            <p className="text-[10px] text-gray-300 font-medium mt-1">
                              {timeAgo(n.createdAt)}
                            </p>
                          </div>
                          {!n.isRead && (
                            <span
                              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: meta.color }}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <button
                  onClick={() => { setOpen(false); onNotificationsClick?.(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold
                    text-indigo-500 hover:bg-indigo-50 transition-colors border-t border-gray-100"
                >
                  View all notifications <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl
            flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-black">{initials}</span>
          </div>

        </div>
      </div>
    </>
  );
}