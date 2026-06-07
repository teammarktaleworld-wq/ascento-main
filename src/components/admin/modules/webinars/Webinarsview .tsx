










// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Video, Plus, Search, Edit2, Trash2,
//   Calendar, Clock, Users, Link2, Eye, X, ChevronDown,
//   Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff,
//   Globe, Zap, ExternalLink, Mail, RefreshCw, BellRing,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Platform = "zoom" | "google_meet" | "microsoft_teams" | "other";
// type WebinarStatus = "active" | "inactive";

// interface Program { id: string; name: string }
// interface Level   { id: string; name: string }
// interface Webinar {
//   id: string;
//   title: string;
//   description?: string;
//   platform: Platform;
//   meetingLink: string;
//   meetingId?: string;
//   passcode?: string;
//   hostName?: string;
//   hostEmail?: string;
//   scheduledAt: string;
//   durationMins: number;
//   status: WebinarStatus;
//   programId?: string;
//   levelId?: string;
//   bannerUrl?: string;
//   emailSent: boolean;
//   emailSentAt?: string;
//   emailSentCount: number;
//   notificationSent?: boolean;
//   notificationSentAt?: string;
//   notificationSentCount?: number;
//   program?: { id: string; name: string };
//   level?:   { id: string; name: string };
//   createdAt: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; icon: string }> = {
//   zoom:            { label: "Zoom",            color: "#2D8CFF", bg: "#EBF4FF", icon: "📹" },
//   google_meet:     { label: "Google Meet",     color: "#34A853", bg: "#E8F5E9", icon: "🎥" },
//   microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", bg: "#EDECF9", icon: "💼" },
//   other:           { label: "Online",          color: "#FF6B6B", bg: "#FFF0F0", icon: "🖥️" },
// };

// const STATUS_META: Record<WebinarStatus, { label: string; color: string; bg: string; dot: string }> = {
//   active:   { label: "Active",   color: "#22C55E", bg: "#F0FDF4", dot: "bg-green-400" },
//   inactive: { label: "Inactive", color: "#9CA3AF", bg: "#F3F4F6", dot: "bg-gray-400"  },
// };

// // Default banners per platform (Unsplash, free to use)
// const PLATFORM_BANNERS: Record<Platform, string> = {
//   zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
//   google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
//   microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
//   other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
// };

// function getWebinarBanner(w: Webinar): string {
//   return w.bannerUrl || PLATFORM_BANNERS[w.platform];
// }

// const emptyForm = () => ({
//   title: "", description: "", platform: "zoom" as Platform,
//   meetingLink: "", meetingId: "", passcode: "",
//   hostName: "", hostEmail: "", scheduledAt: "", durationMins: 60,
//   programId: "", levelId: "", bannerUrl: "",
//   status: "active" as WebinarStatus,
//   sendEmail: false,
// });

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function WebinarsView() {
//   const { token } = useAuth();

//   const [webinars,      setWebinars]      = useState<Webinar[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [levels,        setLevels]        = useState<Level[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [search,        setSearch]        = useState("");
//   const [filterStatus,  setFilterStatus]  = useState("");
//   const [filterProgram, setFilterProgram] = useState("");
//   const [modal,         setModal]         = useState<"create" | "edit" | "view" | null>(null);
//   const [selected,      setSelected]      = useState<Webinar | null>(null);
//   const [form,          setForm]          = useState(emptyForm());
//   const [saving,        setSaving]        = useState(false);
//   const [toast,         setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
//   const [sendingEmail,  setSendingEmail]  = useState<string | null>(null);
//   const [sendingNotif,  setSendingNotif]  = useState<string | null>(null);
//   const submittingRef = useRef(false); // ← double-submit guard

//   // ── Authenticated fetch ────────────────────────────────────────────────────
//   const authFetch = useCallback(
//     (url: string, init: RequestInit = {}) =>
//       fetch(url, {
//         ...init,
//         headers: {
//           "Content-Type": "application/json",
//           ...(init.headers ?? {}),
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       }),
//     [token],
//   );

//   // ── Fetch webinars ─────────────────────────────────────────────────────────
//   const fetchWebinars = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filterStatus)  params.set("status",    filterStatus);
//       if (filterProgram) params.set("programId", filterProgram);
//       const res  = await authFetch(`/api/admin/webinars?${params}`);
//       const data = await res.json();
//       setWebinars(Array.isArray(data) ? data : []);
//     } catch { setWebinars([]); }
//     finally  { setLoading(false); }
//   }, [filterStatus, filterProgram, authFetch]);

//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res  = await authFetch("/api/admin/programs");
//       const data = await res.json();
//       setPrograms(Array.isArray(data) ? data : []);
//     } catch {}
//   }, [authFetch]);

//   const fetchLevels = useCallback(async (programId: string) => {
//     if (!programId) { setLevels([]); return; }
//     try {
//       const res  = await authFetch(`/api/admin/programs/${programId}/levels`);
//       const data = await res.json();
//       setLevels(Array.isArray(data) ? data : []);
//     } catch { setLevels([]); }
//   }, [authFetch]);

//   useEffect(() => { fetchWebinars(); }, [fetchWebinars]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   // ── Toast ──────────────────────────────────────────────────────────────────
//   const showToast = (msg: string, type: "success" | "error" = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 4000);
//   };

//   // ── Modal helpers ──────────────────────────────────────────────────────────
//   const openCreate = () => {
//     setForm(emptyForm());
//     setLevels([]);
//     setSelected(null);
//     setModal("create");
//   };

//   const openEdit = (w: Webinar) => {
//     setSelected(w);
//     setForm({
//       title:       w.title,
//       description: w.description || "",
//       platform:    w.platform,
//       meetingLink: w.meetingLink,
//       meetingId:   w.meetingId   || "",
//       passcode:    w.passcode    || "",
//       hostName:    w.hostName    || "",
//       hostEmail:   w.hostEmail   || "",
//       scheduledAt: w.scheduledAt.slice(0, 16),
//       durationMins: w.durationMins,
//       programId:   w.programId  || "",
//       levelId:     w.levelId    || "",
//       bannerUrl:   w.bannerUrl  || "",
//       status:      w.status,
//       sendEmail:   false,
//     });
//     if (w.programId) fetchLevels(w.programId);
//     setModal("edit");
//   };

//   const openView  = (w: Webinar) => { setSelected(w); setModal("view"); };
//   const closeModal = () => { setModal(null); setSelected(null); };

//   const handleFormChange = (key: string, val: any) => {
//     if (key === "programId") {
//       fetchLevels(val);
//       setForm(f => ({ ...f, programId: val, levelId: "" }));
//     } else {
//       setForm(f => ({ ...f, [key]: val }));
//     }
//   };

//   // ── Create / Update ────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (submittingRef.current) return; // ← prevent double-submit
//     if (!form.title || !form.meetingLink || !form.scheduledAt) {
//       showToast("Title, meeting link and scheduled time are required.", "error");
//       return;
//     }
//     submittingRef.current = true;
//     setSaving(true);
//     try {
//       const isEdit = modal === "edit" && selected;
//       const url    = isEdit ? `/api/admin/webinars/${selected.id}` : "/api/admin/webinars";
//       const method = isEdit ? "PATCH" : "POST";
//       const res = await authFetch(url, {
//         method,
//         body: JSON.stringify({ ...form, durationMins: Number(form.durationMins) }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed");
//       showToast(isEdit ? "Webinar updated!" : "Webinar created!");
//       closeModal();
//       fetchWebinars();
//     } catch (e: any) {
//       showToast(e.message, "error");
//     } finally {
//       setSaving(false);
//       submittingRef.current = false;
//     }
//   };

//   // ── Delete ─────────────────────────────────────────────────────────────────
//   const handleDelete = async (w: Webinar) => {
//     if (!confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
//     try {
//       const res = await authFetch(`/api/admin/webinars/${w.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");
//       showToast("Webinar deleted.");
//       fetchWebinars();
//     } catch { showToast("Delete failed.", "error"); }
//   };

//   // ── Status toggle ──────────────────────────────────────────────────────────
//   const handleStatusChange = async (w: Webinar, status: WebinarStatus) => {
//     try {
//       await authFetch(`/api/admin/webinars/${w.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({ status }),
//       });
//       fetchWebinars();
//     } catch {}
//   };

//   // ── Send in-app notification ───────────────────────────────────────────────
//   const handleSendNotification = async (w: Webinar) => {
//     setSendingNotif(w.id);
//     try {
//       const res  = await authFetch(`/api/admin/webinars/${w.id}/send-notification`, { method: "POST" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed");
//       const prev = w.notificationSentCount ?? 0;
//       showToast(`🔔 Notifications sent to ${data.count} users! (${prev + 1}× total)`);
//       fetchWebinars();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setSendingNotif(null); }
//   };

//   // ── Send email ─────────────────────────────────────────────────────────────
//   const handleSendEmail = async (w: Webinar) => {
//     setSendingEmail(w.id);
//     try {
//       const res  = await authFetch(`/api/admin/webinars/${w.id}/send-email`, { method: "POST" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed");
//       const prev = w.emailSentCount ?? 0;
//       showToast(`📧 Emails sent to ${data.sent}/${data.total} recipients! (${prev + 1}× total)`);
//       fetchWebinars();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setSendingEmail(null); }
//   };

//   // ── Filtered list ──────────────────────────────────────────────────────────
//   const filtered = webinars.filter(w =>
//     w.title.toLowerCase().includes(search.toLowerCase()) ||
//     (w.program?.name || "").toLowerCase().includes(search.toLowerCase()),
//   );

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col gap-6 min-h-0">

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border
//           ${toast.type === "success"
//             ? "bg-green-50 border-green-200 text-green-800"
//             : "bg-red-50  border-red-200  text-red-800"}`}>
//           {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Webinars</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Schedule &amp; manage online sessions for all students and parents</p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all"
//         >
//           <Plus size={16} /> Schedule Webinar
//         </button>
//       </div>

//       {/* Stats */}
//       <StatsRow webinars={webinars} />

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search webinars..."
//             className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10 bg-white"
//           />
//         </div>
//         <SelectFilter
//           value={filterStatus}
//           onChange={setFilterStatus}
//           placeholder="All Status"
//           options={[
//             { value: "active",   label: "Active"   },
//             { value: "inactive", label: "Inactive" },
//           ]}
//         />
//         <SelectFilter
//           value={filterProgram}
//           onChange={setFilterProgram}
//           placeholder="All Programs"
//           options={programs.map(p => ({ value: p.id, label: p.name }))}
//         />
//         <button
//           onClick={fetchWebinars}
//           className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
//         >
//           <RefreshCw size={15} />
//         </button>
//       </div>

//       {/* List */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <EmptyState onAdd={openCreate} />
//       ) : (
//         <div className="grid gap-4">
//           {filtered.map(w => (
//             <WebinarCard
//               key={w.id}
//               webinar={w}
//               onEdit={()   => openEdit(w)}
//               onView={()   => openView(w)}
//               onDelete={()      => handleDelete(w)}
//               onSendNotif={()   => handleSendNotification(w)}
//               onSendEmail={()   => handleSendEmail(w)}
//               onStatusChange={s => handleStatusChange(w, s)}
//               sendingNotif={sendingNotif === w.id}
//               sendingEmail={sendingEmail === w.id}
//             />
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       {(modal === "create" || modal === "edit") && (
//         <WebinarFormModal
//           form={form}
//           onChange={handleFormChange}
//           programs={programs}
//           levels={levels}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//           saving={saving}
//           isEdit={modal === "edit"}
//         />
//       )}

//       {modal === "view" && selected && (
//         <WebinarDetailModal
//           webinar={selected}
//           onClose={closeModal}
//           onEdit={() => { closeModal(); openEdit(selected); }}
//           onSendNotif={() => handleSendNotification(selected)}
//           onSendEmail={() => handleSendEmail(selected)}
//           sendingNotif={sendingNotif === selected.id}
//           sendingEmail={sendingEmail === selected.id}
//         />
//       )}
//     </div>
//   );
// }

// // ─── Stats Row ────────────────────────────────────────────────────────────────
// function StatsRow({ webinars }: { webinars: Webinar[] }) {
//   const now  = new Date();
//   const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

//   const stats = [
//     { label: "Total",     value: webinars.length,                                      color: "#FF6B6B", icon: Video    },
//     { label: "Active",    value: webinars.filter(w => w.status === "active").length,   color: "#22C55E", icon: Wifi     },
//     { label: "Inactive",  value: webinars.filter(w => w.status === "inactive").length, color: "#9CA3AF", icon: WifiOff  },
//     {
//       label: "This Week",
//       value: webinars.filter(w => {
//         const d = new Date(w.scheduledAt);
//         return d >= now && d <= week;
//       }).length,
//       color: "#8B5CF6", icon: Calendar,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//       {stats.map(s => {
//         const Icon = s.icon;
//         return (
//           <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
//               <Icon size={18} style={{ color: s.color }} />
//             </div>
//             <div>
//               <p className="text-2xl font-black text-[#1A1A2E]">{s.value}</p>
//               <p className="text-xs text-gray-500 font-medium">{s.label}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Webinar Card ─────────────────────────────────────────────────────────────
// function WebinarCard({
//   webinar: w,
//   onEdit, onView, onDelete,
//   onSendNotif, onSendEmail,
//   onStatusChange,
//   sendingNotif, sendingEmail,
// }: {
//   webinar: Webinar;
//   onEdit: () => void; onView: () => void; onDelete: () => void;
//   onSendNotif: () => void; onSendEmail: () => void;
//   sendingNotif: boolean; sendingEmail: boolean;
//   onStatusChange: (s: WebinarStatus) => void;
// }) {
//   const pm = PLATFORM_META[w.platform];
//   const sm = STATUS_META[w.status];
//   const [showStatusMenu, setShowStatusMenu] = useState(false);

//   const scheduled = new Date(w.scheduledAt);
//   const dateStr   = scheduled.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   const timeStr   = scheduled.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const isPast    = scheduled < new Date();

//   return (
//     <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden
//       ${w.status === "inactive" ? "opacity-70 border-gray-100" : "border-gray-100"}`}>

//       {/* Platform colour bar */}
//       <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${pm.color},${pm.color}66)` }} />

//       {/* Banner thumbnail strip */}
//       <div className="h-16 w-full overflow-hidden relative">
//         <img
//           src={getWebinarBanner(w)}
//           alt=""
//           className="w-full h-full object-cover"
//           onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
//       </div>

//       <div className="p-5 pt-3">
//         <div className="flex items-start gap-4">
//           {/* Platform icon */}
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg -mt-8 z-10 shadow-sm border border-white"
//             style={{ background: pm.bg }}
//           >
//             {pm.icon}
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-2 flex-wrap">
//               <div className="min-w-0">
//                 <h3 className="font-bold text-[#1A1A2E] text-base leading-tight truncate">{w.title}</h3>
//                 {w.description && (
//                   <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{w.description}</p>
//                 )}
//                 <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                   {/* Platform badge */}
//                   <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
//                     style={{ background: pm.bg, color: pm.color }}>
//                     {pm.icon} {pm.label}
//                   </span>

//                   {/* Status toggle */}
//                   <div className="relative">
//                     <button
//                       onClick={() => setShowStatusMenu(v => !v)}
//                       className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full hover:opacity-80"
//                       style={{ background: sm.bg, color: sm.color }}
//                     >
//                       <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${w.status === "active" ? "animate-pulse" : ""}`} />
//                       {sm.label}
//                       <ChevronDown size={10} />
//                     </button>
//                     {showStatusMenu && (
//                       <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[130px]">
//                         {(["active", "inactive"] as WebinarStatus[]).map(s => (
//                           <button
//                             key={s}
//                             onClick={() => { onStatusChange(s); setShowStatusMenu(false); }}
//                             className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2"
//                             style={{ color: STATUS_META[s].color }}
//                           >
//                             <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`} />
//                             {STATUS_META[s].label}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Audience */}
//                   {w.program ? (
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
//                       {w.program.name}{w.level ? ` › ${w.level.name}` : ""}
//                     </span>
//                   ) : (
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Globe size={10} /> All Students &amp; Parents
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
//                 <button onClick={onView}   title="View"
//                   className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition-colors">
//                   <Eye size={15} />
//                 </button>
//                 <button onClick={onEdit}   title="Edit"
//                   className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                   <Edit2 size={15} />
//                 </button>

//                 {/* Notify button */}
//                 <button
//                   onClick={onSendNotif}
//                   disabled={sendingNotif || sendingEmail}
//                   title="Send in-app notification"
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
//                 >
//                   {sendingNotif ? <Loader2 size={12} className="animate-spin" /> : <BellRing size={12} />}
//                   Notify{(w.notificationSentCount ?? 0) > 0 ? ` (${w.notificationSentCount})` : ""}
//                 </button>

//                 {/* Email button */}
//                 <button
//                   onClick={onSendEmail}
//                   disabled={sendingEmail || sendingNotif}
//                   title="Send email"
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
//                 >
//                   {sendingEmail ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
//                   Email{(w.emailSentCount ?? 0) > 0 ? ` (${w.emailSentCount})` : ""}
//                 </button>

//                 <button onClick={onDelete} title="Delete"
//                   className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             </div>

//             {/* Info row */}
//             <div className="flex items-center gap-4 mt-3 flex-wrap">
//               <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                 <Calendar size={12} className="text-[#FF6B6B]" /> {dateStr}
//               </span>
//               <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                 <Clock size={12} className="text-[#FFB347]" /> {timeStr} · {w.durationMins} min
//               </span>
//               {w.hostName && (
//                 <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                   <Users size={12} className="text-blue-400" /> {w.hostName}
//                 </span>
//               )}
//               {isPast && w.status === "active" && (
//                 <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
//                   Past — consider marking inactive
//                 </span>
//               )}
//               <a
//                 href={w.meetingLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-1 text-xs font-semibold text-[#2D8CFF] hover:underline ml-auto"
//               >
//                 <Link2 size={11} /> Join <ExternalLink size={10} />
//               </a>
//             </div>

//             {/* Send history badges */}
//             {(w.emailSent || w.notificationSent) && (
//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {w.notificationSent && (
//                   <span className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
//                     <BellRing size={11} />
//                     Notified {w.notificationSentCount}×
//                     {w.notificationSentAt && " — "}
//                     {w.notificationSentAt && new Date(w.notificationSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
//                   </span>
//                 )}
//                 {w.emailSent && (
//                   <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
//                     <Mail size={11} />
//                     Emailed {w.emailSentCount}×
//                     {w.emailSentAt && " — "}
//                     {w.emailSentAt && new Date(w.emailSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Form Modal ───────────────────────────────────────────────────────────────
// function WebinarFormModal({
//   form, onChange, programs, levels,
//   onSubmit, onClose, saving, isEdit,
// }: {
//   form: ReturnType<typeof emptyForm>;
//   onChange: (k: string, v: any) => void;
//   programs: Program[]; levels: Level[];
//   onSubmit: () => void; onClose: () => void;
//   saving: boolean; isEdit: boolean;
// }) {
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   const bannerPreview = form.bannerUrl || PLATFORM_BANNERS[form.platform as Platform];

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
//       style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-fit mt-20 mb-8 mx-4 flex flex-col"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
//               <Video size={16} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1A1A2E] text-lg">
//               {isEdit ? "Edit Webinar" : "Schedule Webinar"}
//             </h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-5">

//           {/* Banner preview */}
//           <div className="rounded-xl overflow-hidden h-28 bg-gray-100 relative">
//             <img
//               src={bannerPreview}
//               alt="Banner preview"
//               className="w-full h-full object-cover"
//               onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center px-4">
//               <span className="text-white text-sm font-bold drop-shadow">
//                 {form.title || "Webinar title preview"}
//               </span>
//             </div>
//           </div>

//           <FormField label="Webinar Title *">
//             <input
//               value={form.title}
//               onChange={e => onChange("title", e.target.value)}
//               placeholder="e.g. Parent Orientation — Abacus Level 1"
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10"
//             />
//           </FormField>

//           <FormField label="Description">
//             <textarea
//               value={form.description}
//               onChange={e => onChange("description", e.target.value)}
//               rows={2}
//               placeholder="Brief description..."
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 resize-none"
//             />
//           </FormField>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Platform">
//               <select
//                 value={form.platform}
//                 onChange={e => onChange("platform", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white"
//               >
//                 <option value="zoom">📹 Zoom</option>
//                 <option value="google_meet">🎥 Google Meet</option>
//                 <option value="microsoft_teams">💼 Microsoft Teams</option>
//                 <option value="other">🖥️ Other</option>
//               </select>
//             </FormField>
//             <FormField label="Meeting Link *">
//               <input
//                 value={form.meetingLink}
//                 onChange={e => onChange("meetingLink", e.target.value)}
//                 placeholder="https://zoom.us/j/..."
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Meeting ID">
//               <input
//                 value={form.meetingId}
//                 onChange={e => onChange("meetingId", e.target.value)}
//                 placeholder="123 456 789"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//             <FormField label="Passcode">
//               <input
//                 value={form.passcode}
//                 onChange={e => onChange("passcode", e.target.value)}
//                 placeholder="Optional"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Scheduled At *">
//               <input
//                 type="datetime-local"
//                 value={form.scheduledAt}
//                 onChange={e => onChange("scheduledAt", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//             <FormField label="Duration (minutes)">
//               <input
//                 type="number"
//                 value={form.durationMins}
//                 min={15} max={480}
//                 onChange={e => onChange("durationMins", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Host Name">
//               <input
//                 value={form.hostName}
//                 onChange={e => onChange("hostName", e.target.value)}
//                 placeholder="Presenter / Teacher name"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//             <FormField label="Host Email">
//               <input
//                 value={form.hostEmail}
//                 onChange={e => onChange("hostEmail", e.target.value)}
//                 placeholder="host@school.com"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//           </div>

//           {/* Status — edit only */}
//           {isEdit && (
//             <FormField label="Status">
//               <div className="flex gap-3">
//                 {(["active", "inactive"] as WebinarStatus[]).map(s => (
//                   <button
//                     key={s}
//                     type="button"
//                     onClick={() => onChange("status", s)}
//                     className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
//                       ${form.status === s
//                         ? s === "active"
//                           ? "border-green-400 bg-green-50 text-green-700"
//                           : "border-gray-300 bg-gray-100 text-gray-600"
//                         : "border-gray-200 text-gray-400 hover:border-gray-300"
//                       }`}
//                   >
//                     {s === "active" ? "🟢 Active" : "⚫ Inactive"}
//                   </button>
//                 ))}
//               </div>
//             </FormField>
//           )}

//           {/* Target audience selects */}
//           <div className="p-4 bg-[#FFFDF7] border border-[#FFB347]/30 rounded-xl space-y-3">
//             <div>
//               <p className="text-xs font-black text-[#FF6B6B] uppercase tracking-widest">Target Audience</p>
//               <p className="text-xs text-gray-400 mt-0.5">Leave blank to send to ALL students and parents</p>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <FormField label="Specific Program (optional)">
//                 <select
//                   value={form.programId}
//                   onChange={e => onChange("programId", e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white"
//                 >
//                   <option value="">All Programs</option>
//                   {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//               </FormField>
//               <FormField label="Specific Level (optional)">
//                 <select
//                   value={form.levelId}
//                   onChange={e => onChange("levelId", e.target.value)}
//                   disabled={!form.programId || levels.length === 0}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white disabled:opacity-50"
//                 >
//                   <option value="">All Levels</option>
//                   {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//                 </select>
//               </FormField>
//             </div>
//           </div>

//           {/* Banner URL with live preview */}
//           <FormField label="Custom Banner Image URL (optional)">
//             <input
//               value={form.bannerUrl}
//               onChange={e => onChange("bannerUrl", e.target.value)}
//               placeholder="https://... (leave blank for default platform image)"
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               Default image is shown above — paste a URL to override it.
//             </p>
//           </FormField>

//           {/* Send email on create */}
//           {!isEdit && (
//             <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#FF6B6B]/30 transition-colors">
//               <input
//                 type="checkbox"
//                 checked={form.sendEmail}
//                 onChange={e => onChange("sendEmail", e.target.checked)}
//                 className="w-4 h-4 accent-[#FF6B6B]"
//               />
//               <div>
//                 <p className="text-sm font-bold text-[#1A1A2E]">Send email immediately on create</p>
//                 <p className="text-xs text-gray-500">Goes to all targeted students &amp; parents</p>
//               </div>
//             </label>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={saving}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
//           >
//             {saving ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
//             {isEdit ? "Save Changes" : "Create Webinar"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Detail Modal ─────────────────────────────────────────────────────────────
// function WebinarDetailModal({
//   webinar: w, onClose, onEdit,
//   onSendNotif, onSendEmail,
//   sendingNotif, sendingEmail,
// }: {
//   webinar: Webinar; onClose: () => void; onEdit: () => void;
//   onSendNotif: () => void; onSendEmail: () => void;
//   sendingNotif: boolean; sendingEmail: boolean;
// }) {
//   const pm     = PLATFORM_META[w.platform];
//   const sm     = STATUS_META[w.status];
//   const sched  = new Date(w.scheduledAt);
//   const dateStr   = sched.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
//   const timeStr   = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const endTimeStr = new Date(sched.getTime() + w.durationMins * 60000)
//     .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
//       style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-fit mt-20 mb-8 mx-4 flex flex-col overflow-hidden"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Banner image */}
//         <div className="relative h-36 overflow-hidden">
//           <img
//             src={getWebinarBanner(w)}
//             alt={w.title}
//             className="w-full h-full object-cover"
//             onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
//           />
//           {/* Gradient overlay + title */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
//           >
//             <X size={16} className="text-white" />
//           </button>
//           <div className="absolute bottom-0 left-0 right-0 p-4">
//             <div className="flex items-center gap-2 mb-1 flex-wrap">
//               <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
//                 {pm.icon} {pm.label}
//               </span>
//               <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
//                 <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} /> {sm.label}
//               </span>
//               <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
//                 <Globe size={10} />
//                 {w.program ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}` : "All Students & Parents"}
//               </span>
//             </div>
//             <h2 className="font-black text-white text-lg leading-tight pr-8 drop-shadow">{w.title}</h2>
//             {w.description && (
//               <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{w.description}</p>
//             )}
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-5 space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <InfoCard icon="📅" label="Date"     value={dateStr} />
//             <InfoCard icon="⏰" label="Time"     value={`${timeStr} – ${endTimeStr}`} />
//             <InfoCard icon="⏱️" label="Duration" value={`${w.durationMins} minutes`} />
//             <InfoCard icon="👥" label="Audience"
//               value={w.program
//                 ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}`
//                 : "All Students & Parents"} />
//             {w.hostName  && <InfoCard icon="🎤" label="Host"       value={w.hostName} />}
//             {w.meetingId && <InfoCard icon="🔢" label="Meeting ID" value={w.meetingId} />}
//             {w.passcode  && <InfoCard icon="🔑" label="Passcode"   value={w.passcode} />}
//           </div>

//           {/* Join link */}
//           <div
//             className="p-4 rounded-xl border-2 text-center"
//             style={{ borderColor: `${pm.color}30`, background: `${pm.color}08` }}
//           >
//             <p className="text-xs font-bold text-gray-400 mb-1.5">MEETING LINK</p>
//             <a
//               href={w.meetingLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm font-bold break-all hover:underline"
//               style={{ color: pm.color }}
//             >
//               {w.meetingLink}
//             </a>
//             <div className="mt-3">
//               <a
//                 href={w.meetingLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
//                 style={{ background: pm.color }}
//               >
//                 🚀 Join Webinar <ExternalLink size={13} />
//               </a>
//             </div>
//           </div>

//           {/* Send history */}
//           {(w.notificationSent || w.emailSent) && (
//             <div className="space-y-2">
//               {w.notificationSent && (
//                 <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-semibold">
//                   <BellRing size={15} />
//                   Notifications sent {w.notificationSentCount}×
//                   {w.notificationSentAt && (
//                     <span className="ml-auto text-xs text-purple-400 font-normal">
//                       Last: {new Date(w.notificationSentAt).toLocaleString("en-IN")}
//                     </span>
//                   )}
//                 </div>
//               )}
//               {w.emailSent && (
//                 <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-semibold">
//                   <Mail size={15} />
//                   Emails sent {w.emailSentCount}×
//                   {w.emailSentAt && (
//                     <span className="ml-auto text-xs text-green-500 font-normal">
//                       Last: {new Date(w.emailSentAt).toLocaleString("en-IN")}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
//           <button
//             onClick={onEdit}
//             className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
//           >
//             <Edit2 size={14} /> Edit
//           </button>
//           <button
//             onClick={onSendNotif}
//             disabled={sendingNotif || sendingEmail}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
//           >
//             {sendingNotif ? <Loader2 size={15} className="animate-spin" /> : <BellRing size={15} />}
//             Send Notification
//           </button>
//           <button
//             onClick={onSendEmail}
//             disabled={sendingEmail || sendingNotif}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
//           >
//             {sendingEmail ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
//             Send Email
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Small helpers ────────────────────────────────────────────────────────────
// function FormField({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
//       {children}
//     </div>
//   );
// }

// function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
//   return (
//     <div className="bg-gray-50 rounded-xl p-3">
//       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{icon} {label}</p>
//       <p className="text-sm font-bold text-[#1A1A2E] leading-snug">{value}</p>
//     </div>
//   );
// }

// function SelectFilter({ value, onChange, placeholder, options }: {
//   value: string; onChange: (v: string) => void;
//   placeholder: string; options: { value: string; label: string }[];
// }) {
//   return (
//     <select
//       value={value}
//       onChange={e => onChange(e.target.value)}
//       className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700"
//     >
//       <option value="">{placeholder}</option>
//       {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//     </select>
//   );
// }

// function EmptyState({ onAdd }: { onAdd: () => void }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFB347]/10 rounded-2xl flex items-center justify-center mb-4">
//         <Video size={36} className="text-[#FF6B6B]" />
//       </div>
//       <h3 className="text-lg font-black text-[#1A1A2E] mb-1">No webinars yet</h3>
//       <p className="text-sm text-gray-400 mb-5">Schedule your first online session for all students and parents.</p>
//       <button
//         onClick={onAdd}
//         className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
//       >
//         <Plus size={16} /> Schedule Webinar
//       </button>
//     </div>
//   );
// }













// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Video, Plus, Search, Edit2, Trash2,
//   Calendar, Clock, Users, Link2, Eye, X, ChevronDown,
//   Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff,
//   Globe, Zap, ExternalLink, Mail, RefreshCw, BellRing,
//   ImageIcon, Upload, Link as LinkIcon, Check,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Platform = "zoom" | "google_meet" | "microsoft_teams" | "other";
// type WebinarStatus = "active" | "inactive";

// interface Program { id: string; name: string }
// interface Level   { id: string; name: string }
// interface Webinar {
//   id: string;
//   title: string;
//   description?: string;
//   platform: Platform;
//   meetingLink: string;
//   meetingId?: string;
//   passcode?: string;
//   hostName?: string;
//   hostEmail?: string;
//   scheduledAt: string;
//   durationMins: number;
//   status: WebinarStatus;
//   programId?: string;
//   levelId?: string;
//   bannerUrl?: string;
//   emailSent: boolean;
//   emailSentAt?: string;
//   emailSentCount: number;
//   notificationSent?: boolean;
//   notificationSentAt?: string;
//   notificationSentCount?: number;
//   program?: { id: string; name: string };
//   level?:   { id: string; name: string };
//   createdAt: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; icon: string }> = {
//   zoom:            { label: "Zoom",            color: "#2D8CFF", bg: "#EBF4FF", icon: "📹" },
//   google_meet:     { label: "Google Meet",     color: "#34A853", bg: "#E8F5E9", icon: "🎥" },
//   microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", bg: "#EDECF9", icon: "💼" },
//   other:           { label: "Online",          color: "#FF6B6B", bg: "#FFF0F0", icon: "🖥️" },
// };

// const STATUS_META: Record<WebinarStatus, { label: string; color: string; bg: string; dot: string }> = {
//   active:   { label: "Active",   color: "#22C55E", bg: "#F0FDF4", dot: "bg-green-400" },
//   inactive: { label: "Inactive", color: "#9CA3AF", bg: "#F3F4F6", dot: "bg-gray-400"  },
// };

// const PLATFORM_BANNERS: Record<Platform, string> = {
//   zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
//   google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
//   microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
//   other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
// };

// // Preset banner options shown in the image picker
// const PRESET_BANNERS = [
//   { label: "Webinar",     url: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80" },
//   { label: "Meet",        url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80" },
//   { label: "Teams",       url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" },
//   { label: "Conference",  url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
//   { label: "Education",   url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" },
//   { label: "Kids",        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" },
//   { label: "Math",        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" },
//   { label: "Abacus",      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80" },
// ];

// function getWebinarBanner(w: Webinar): string {
//   return w.bannerUrl || PLATFORM_BANNERS[w.platform];
// }

// const emptyForm = () => ({
//   title: "", description: "", platform: "zoom" as Platform,
//   meetingLink: "", meetingId: "", passcode: "",
//   hostName: "", hostEmail: "", scheduledAt: "", durationMins: 60,
//   programId: "", levelId: "", bannerUrl: "",
//   status: "active" as WebinarStatus,
//   sendEmail: false,
// });

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function WebinarsView() {
//   const { token } = useAuth();

//   const [webinars,      setWebinars]      = useState<Webinar[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [levels,        setLevels]        = useState<Level[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [search,        setSearch]        = useState("");
//   const [filterStatus,  setFilterStatus]  = useState("");
//   const [filterProgram, setFilterProgram] = useState("");
//   const [modal,         setModal]         = useState<"create" | "edit" | "view" | null>(null);
//   const [selected,      setSelected]      = useState<Webinar | null>(null);
//   const [form,          setForm]          = useState(emptyForm());
//   const [saving,        setSaving]        = useState(false);
//   const [toast,         setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
//   const [sendingEmail,  setSendingEmail]  = useState<string | null>(null);
//   const [sendingNotif,  setSendingNotif]  = useState<string | null>(null);
//   const submittingRef = useRef(false);

//   const authFetch = useCallback(
//     (url: string, init: RequestInit = {}) =>
//       fetch(url, {
//         ...init,
//         headers: {
//           "Content-Type": "application/json",
//           ...(init.headers ?? {}),
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       }),
//     [token],
//   );

//   const fetchWebinars = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filterStatus)  params.set("status",    filterStatus);
//       if (filterProgram) params.set("programId", filterProgram);
//       const res  = await authFetch(`/api/admin/webinars?${params}`);
//       const data = await res.json();
//       setWebinars(Array.isArray(data) ? data : []);
//     } catch { setWebinars([]); }
//     finally  { setLoading(false); }
//   }, [filterStatus, filterProgram, authFetch]);

//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res  = await authFetch("/api/admin/programs");
//       const data = await res.json();
//       setPrograms(Array.isArray(data) ? data : []);
//     } catch {}
//   }, [authFetch]);

//   const fetchLevels = useCallback(async (programId: string) => {
//     if (!programId) { setLevels([]); return; }
//     try {
//       const res  = await authFetch(`/api/admin/programs/${programId}/levels`);
//       const data = await res.json();
//       setLevels(Array.isArray(data) ? data : []);
//     } catch { setLevels([]); }
//   }, [authFetch]);

//   useEffect(() => { fetchWebinars(); }, [fetchWebinars]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const showToast = (msg: string, type: "success" | "error" = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const openCreate = () => {
//     setForm(emptyForm());
//     setLevels([]);
//     setSelected(null);
//     setModal("create");
//   };

//   const openEdit = (w: Webinar) => {
//     setSelected(w);
//     setForm({
//       title:        w.title,
//       description:  w.description  || "",
//       platform:     w.platform,
//       meetingLink:  w.meetingLink,
//       meetingId:    w.meetingId    || "",
//       passcode:     w.passcode     || "",
//       hostName:     w.hostName     || "",
//       hostEmail:    w.hostEmail    || "",
//       scheduledAt:  w.scheduledAt.slice(0, 16),
//       durationMins: w.durationMins,
//       programId:    w.programId   || "",
//       levelId:      w.levelId     || "",
//       // ← Preserve saved banner on edit; fall back to platform default
//       bannerUrl:    w.bannerUrl   || PLATFORM_BANNERS[w.platform],
//       status:       w.status,
//       sendEmail:    false,
//     });
//     if (w.programId) fetchLevels(w.programId);
//     setModal("edit");
//   };

//   const openView  = (w: Webinar) => { setSelected(w); setModal("view"); };
//   const closeModal = () => { setModal(null); setSelected(null); };

//   const handleFormChange = (key: string, val: any) => {
//     if (key === "programId") {
//       fetchLevels(val);
//       setForm(f => ({ ...f, programId: val, levelId: "" }));
//     } else if (key === "platform") {
//       // When platform changes, only update banner if it's still a default banner
//       setForm(f => {
//         const isDefault = !f.bannerUrl || Object.values(PLATFORM_BANNERS).includes(f.bannerUrl);
//         return {
//           ...f,
//           platform: val as Platform,
//           bannerUrl: isDefault ? PLATFORM_BANNERS[val as Platform] : f.bannerUrl,
//         };
//       });
//     } else {
//       setForm(f => ({ ...f, [key]: val }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (submittingRef.current) return;
//     if (!form.title || !form.meetingLink || !form.scheduledAt) {
//       showToast("Title, meeting link and scheduled time are required.", "error");
//       return;
//     }
//     submittingRef.current = true;
//     setSaving(true);
//     try {
//       const isEdit = modal === "edit" && selected;
//       const url    = isEdit ? `/api/admin/webinars/${selected.id}` : "/api/admin/webinars";
//       const method = isEdit ? "PATCH" : "POST";
//       const res = await authFetch(url, {
//         method,
//         body: JSON.stringify({ ...form, durationMins: Number(form.durationMins) }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error || "Failed");
//       showToast(isEdit ? "Webinar updated!" : "Webinar created!");
//       closeModal();
//       fetchWebinars();
//     } catch (e: any) {
//       showToast(e.message, "error");
//     } finally {
//       setSaving(false);
//       submittingRef.current = false;
//     }
//   };

//   const handleDelete = async (w: Webinar) => {
//     if (!confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
//     try {
//       const res = await authFetch(`/api/admin/webinars/${w.id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");
//       showToast("Webinar deleted.");
//       fetchWebinars();
//     } catch { showToast("Delete failed.", "error"); }
//   };

//   const handleStatusChange = async (w: Webinar, status: WebinarStatus) => {
//     try {
//       await authFetch(`/api/admin/webinars/${w.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({ status }),
//       });
//       fetchWebinars();
//     } catch {}
//   };

//   const handleSendNotification = async (w: Webinar) => {
//     setSendingNotif(w.id);
//     try {
//       const res  = await authFetch(`/api/admin/webinars/${w.id}/send-notification`, { method: "POST" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed");
//       const prev = w.notificationSentCount ?? 0;
//       showToast(`🔔 Notifications sent to ${data.count} users! (${prev + 1}× total)`);
//       fetchWebinars();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setSendingNotif(null); }
//   };

//   const handleSendEmail = async (w: Webinar) => {
//     setSendingEmail(w.id);
//     try {
//       const res  = await authFetch(`/api/admin/webinars/${w.id}/send-email`, { method: "POST" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed");
//       const prev = w.emailSentCount ?? 0;
//       showToast(`📧 Emails sent to ${data.sent}/${data.total} recipients! (${prev + 1}× total)`);
//       fetchWebinars();
//     } catch (e: any) { showToast(e.message, "error"); }
//     finally { setSendingEmail(null); }
//   };

//   const filtered = webinars.filter(w =>
//     w.title.toLowerCase().includes(search.toLowerCase()) ||
//     (w.program?.name || "").toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="flex flex-col gap-6 min-h-0">

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border
//           ${toast.type === "success"
//             ? "bg-green-50 border-green-200 text-green-800"
//             : "bg-red-50  border-red-200  text-red-800"}`}>
//           {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Webinars</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Schedule &amp; manage online sessions for all students and parents</p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all"
//         >
//           <Plus size={16} /> Schedule Webinar
//         </button>
//       </div>

//       <StatsRow webinars={webinars} />

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search webinars..."
//             className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10 bg-white"
//           />
//         </div>
//         <SelectFilter value={filterStatus}  onChange={setFilterStatus}  placeholder="All Status"
//           options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
//         <SelectFilter value={filterProgram} onChange={setFilterProgram} placeholder="All Programs"
//           options={programs.map(p => ({ value: p.id, label: p.name }))} />
//         <button onClick={fetchWebinars}
//           className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
//           <RefreshCw size={15} />
//         </button>
//       </div>

//       {/* List */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <EmptyState onAdd={openCreate} />
//       ) : (
//         <div className="grid gap-4">
//           {filtered.map(w => (
//             <WebinarCard
//               key={w.id}
//               webinar={w}
//               onEdit={()        => openEdit(w)}
//               onView={()        => openView(w)}
//               onDelete={()      => handleDelete(w)}
//               onSendNotif={()   => handleSendNotification(w)}
//               onSendEmail={()   => handleSendEmail(w)}
//               onStatusChange={s => handleStatusChange(w, s)}
//               sendingNotif={sendingNotif === w.id}
//               sendingEmail={sendingEmail === w.id}
//             />
//           ))}
//         </div>
//       )}

//       {(modal === "create" || modal === "edit") && (
//         <WebinarFormModal
//           form={form}
//           onChange={handleFormChange}
//           programs={programs}
//           levels={levels}
//           onSubmit={handleSubmit}
//           onClose={closeModal}
//           saving={saving}
//           isEdit={modal === "edit"}
//         />
//       )}

//       {modal === "view" && selected && (
//         <WebinarDetailModal
//           webinar={selected}
//           onClose={closeModal}
//           onEdit={() => { closeModal(); openEdit(selected); }}
//           onSendNotif={() => handleSendNotification(selected)}
//           onSendEmail={() => handleSendEmail(selected)}
//           sendingNotif={sendingNotif === selected.id}
//           sendingEmail={sendingEmail === selected.id}
//         />
//       )}
//     </div>
//   );
// }

// // ─── Stats Row ────────────────────────────────────────────────────────────────
// function StatsRow({ webinars }: { webinars: Webinar[] }) {
//   const now  = new Date();
//   const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//   const stats = [
//     { label: "Total",    value: webinars.length,                                      color: "#FF6B6B", icon: Video   },
//     { label: "Active",   value: webinars.filter(w => w.status === "active").length,   color: "#22C55E", icon: Wifi    },
//     { label: "Inactive", value: webinars.filter(w => w.status === "inactive").length, color: "#9CA3AF", icon: WifiOff },
//     { label: "This Week",
//       value: webinars.filter(w => { const d = new Date(w.scheduledAt); return d >= now && d <= week; }).length,
//       color: "#8B5CF6", icon: Calendar },
//   ];
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//       {stats.map(s => {
//         const Icon = s.icon;
//         return (
//           <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
//               <Icon size={18} style={{ color: s.color }} />
//             </div>
//             <div>
//               <p className="text-2xl font-black text-[#1A1A2E]">{s.value}</p>
//               <p className="text-xs text-gray-500 font-medium">{s.label}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Webinar Card ─────────────────────────────────────────────────────────────
// function WebinarCard({
//   webinar: w, onEdit, onView, onDelete,
//   onSendNotif, onSendEmail, onStatusChange,
//   sendingNotif, sendingEmail,
// }: {
//   webinar: Webinar;
//   onEdit: () => void; onView: () => void; onDelete: () => void;
//   onSendNotif: () => void; onSendEmail: () => void;
//   sendingNotif: boolean; sendingEmail: boolean;
//   onStatusChange: (s: WebinarStatus) => void;
// }) {
//   const pm = PLATFORM_META[w.platform];
//   const sm = STATUS_META[w.status];
//   const [showStatusMenu, setShowStatusMenu] = useState(false);
//   const scheduled = new Date(w.scheduledAt);
//   const dateStr   = scheduled.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   const timeStr   = scheduled.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const isPast    = scheduled < new Date();

//   return (
//     <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden
//       ${w.status === "inactive" ? "opacity-70 border-gray-100" : "border-gray-100"}`}>
//       <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${pm.color},${pm.color}66)` }} />
//       <div className="h-16 w-full overflow-hidden relative">
//         <img src={getWebinarBanner(w)} alt="" className="w-full h-full object-cover"
//           onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }} />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
//       </div>

//       <div className="p-5 pt-3">
//         <div className="flex items-start gap-4">
//           <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg -mt-8 z-10 shadow-sm border border-white"
//             style={{ background: pm.bg }}>{pm.icon}</div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-2 flex-wrap">
//               <div className="min-w-0">
//                 <h3 className="font-bold text-[#1A1A2E] text-base leading-tight truncate">{w.title}</h3>
//                 {w.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{w.description}</p>}
//                 <div className="flex items-center gap-2 mt-1.5 flex-wrap">
//                   <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
//                     style={{ background: pm.bg, color: pm.color }}>{pm.icon} {pm.label}</span>
//                   <div className="relative">
//                     <button onClick={() => setShowStatusMenu(v => !v)}
//                       className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full hover:opacity-80"
//                       style={{ background: sm.bg, color: sm.color }}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${w.status === "active" ? "animate-pulse" : ""}`} />
//                       {sm.label}<ChevronDown size={10} />
//                     </button>
//                     {showStatusMenu && (
//                       <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[130px]">
//                         {(["active", "inactive"] as WebinarStatus[]).map(s => (
//                           <button key={s} onClick={() => { onStatusChange(s); setShowStatusMenu(false); }}
//                             className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2"
//                             style={{ color: STATUS_META[s].color }}>
//                             <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`} />
//                             {STATUS_META[s].label}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   {w.program ? (
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
//                       {w.program.name}{w.level ? ` › ${w.level.name}` : ""}
//                     </span>
//                   ) : (
//                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Globe size={10} /> All Students &amp; Parents
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
//                 <button onClick={onView} title="View"
//                   className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition-colors">
//                   <Eye size={15} />
//                 </button>
//                 <button onClick={onEdit} title="Edit"
//                   className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
//                   <Edit2 size={15} />
//                 </button>

//                 {/* ── NOTIFY button — separate, always clickable ── */}
//                 <button onClick={onSendNotif} disabled={sendingNotif || sendingEmail}
//                   title={`Send in-app notification${(w.notificationSentCount ?? 0) > 0 ? ` · sent ${w.notificationSentCount}× already` : ""}`}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity relative"
//                   style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}>
//                   {sendingNotif ? <Loader2 size={12} className="animate-spin" /> : <BellRing size={12} />}
//                   Notify
//                   {(w.notificationSentCount ?? 0) > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 bg-purple-700 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
//                       {w.notificationSentCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* ── EMAIL button — separate, always clickable ── */}
//                 <button onClick={onSendEmail} disabled={sendingEmail || sendingNotif}
//                   title={`Send email${(w.emailSentCount ?? 0) > 0 ? ` · sent ${w.emailSentCount}× already` : ""}`}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity relative"
//                   style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//                   {sendingEmail ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
//                   Email
//                   {(w.emailSentCount ?? 0) > 0 && (
//                     <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
//                       {w.emailSentCount}
//                     </span>
//                   )}
//                 </button>

//                 <button onClick={onDelete} title="Delete"
//                   className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
//                   <Trash2 size={15} />
//                 </button>
//               </div>
//             </div>

//             {/* Info row */}
//             <div className="flex items-center gap-4 mt-3 flex-wrap">
//               <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                 <Calendar size={12} className="text-[#FF6B6B]" /> {dateStr}
//               </span>
//               <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                 <Clock size={12} className="text-[#FFB347]" /> {timeStr} · {w.durationMins} min
//               </span>
//               {w.hostName && (
//                 <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                   <Users size={12} className="text-blue-400" /> {w.hostName}
//                 </span>
//               )}
//               {isPast && w.status === "active" && (
//                 <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
//                   Past — consider marking inactive
//                 </span>
//               )}
//               <a href={w.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="flex items-center gap-1 text-xs font-semibold text-[#2D8CFF] hover:underline ml-auto">
//                 <Link2 size={11} /> Join <ExternalLink size={10} />
//               </a>
//             </div>

//             {/* Send history badges */}
//             {(w.emailSent || w.notificationSent) && (
//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {w.notificationSent && (
//                   <span className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
//                     <BellRing size={11} />
//                     Notified {w.notificationSentCount}×
//                     {w.notificationSentAt && ` — ${new Date(w.notificationSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}`}
//                   </span>
//                 )}
//                 {w.emailSent && (
//                   <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
//                     <Mail size={11} />
//                     Emailed {w.emailSentCount}×
//                     {w.emailSentAt && ` — ${new Date(w.emailSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}`}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Image Picker ─────────────────────────────────────────────────────────────
// function ImagePicker({
//   value,
//   onChange,
//   platform,
// }: {
//   value: string;
//   onChange: (url: string) => void;
//   platform: Platform;
// }) {
//   const [tab, setTab] = useState<"preset" | "url">("preset");
//   const [urlInput, setUrlInput] = useState(value && !PRESET_BANNERS.find(b => b.url === value) && !Object.values(PLATFORM_BANNERS).includes(value) ? value : "");
//   const [urlError, setUrlError] = useState(false);

//   const effectiveBanner = value || PLATFORM_BANNERS[platform];

//   const handleUrlApply = () => {
//     if (!urlInput.trim()) return;
//     // basic URL validation
//     try { new URL(urlInput); } catch { setUrlError(true); return; }
//     setUrlError(false);
//     onChange(urlInput.trim());
//   };

//   return (
//     <div className="space-y-3">
//       {/* Current preview */}
//       <div className="relative rounded-xl overflow-hidden h-28 border-2 border-dashed border-gray-200 bg-gray-50">
//         <img
//           src={effectiveBanner}
//           alt="Banner preview"
//           className="w-full h-full object-cover"
//           onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end p-3">
//           <div className="flex items-center gap-2">
//             <ImageIcon size={13} className="text-white/70" />
//             <span className="text-white text-xs font-bold drop-shadow">Banner Preview</span>
//           </div>
//           {value && (
//             <button
//               onClick={() => onChange("")}
//               className="ml-auto p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
//               title="Reset to platform default"
//             >
//               <X size={12} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Tab switcher */}
//       <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
//         <button
//           onClick={() => setTab("preset")}
//           className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all
//             ${tab === "preset" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-gray-500 hover:text-gray-700"}`}
//         >
//           <ImageIcon size={12} /> Preset Images
//         </button>
//         <button
//           onClick={() => setTab("url")}
//           className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all
//             ${tab === "url" ? "bg-white shadow-sm text-[#1A1A2E]" : "text-gray-500 hover:text-gray-700"}`}
//         >
//           <LinkIcon size={12} /> Paste URL
//         </button>
//       </div>

//       {/* Preset grid */}
//       {tab === "preset" && (
//         <div className="grid grid-cols-4 gap-2">
//           {PRESET_BANNERS.map(b => {
//             const isSelected = effectiveBanner === b.url;
//             return (
//               <button
//                 key={b.url}
//                 onClick={() => onChange(b.url)}
//                 className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105
//                   ${isSelected ? "border-[#FF6B6B] shadow-md shadow-[#FF6B6B]/20" : "border-transparent hover:border-gray-300"}`}
//                 style={{ aspectRatio: "16/9" }}
//               >
//                 <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
//                 <div className={`absolute inset-0 transition-opacity ${isSelected ? "bg-[#FF6B6B]/20" : "bg-transparent"}`} />
//                 {isSelected && (
//                   <div className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B6B] rounded-full flex items-center justify-center">
//                     <Check size={9} className="text-white" />
//                   </div>
//                 )}
//                 <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
//                   <p className="text-[9px] text-white font-bold text-center truncate">{b.label}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* URL input */}
//       {tab === "url" && (
//         <div className="space-y-2">
//           <div className="flex gap-2">
//             <input
//               value={urlInput}
//               onChange={e => { setUrlInput(e.target.value); setUrlError(false); }}
//               onKeyDown={e => e.key === "Enter" && handleUrlApply()}
//               placeholder="https://your-image-url.com/banner.jpg"
//               className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none transition-colors
//                 ${urlError
//                   ? "border-red-300 focus:border-red-400 bg-red-50"
//                   : "border-gray-200 focus:border-[#FF6B6B]/50"}`}
//             />
//             <button
//               onClick={handleUrlApply}
//               className="px-3 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1"
//             >
//               <Upload size={12} /> Apply
//             </button>
//           </div>
//           {urlError && <p className="text-xs text-red-500 font-medium">Please enter a valid image URL</p>}
//           <p className="text-xs text-gray-400">Paste any direct image URL (jpg, png, webp). Press Enter or click Apply.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Form Modal ───────────────────────────────────────────────────────────────
// function WebinarFormModal({
//   form, onChange, programs, levels,
//   onSubmit, onClose, saving, isEdit,
// }: {
//   form: ReturnType<typeof emptyForm>;
//   onChange: (k: string, v: any) => void;
//   programs: Program[]; levels: Level[];
//   onSubmit: () => void; onClose: () => void;
//   saving: boolean; isEdit: boolean;
// }) {
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
//       style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-fit mt-16 mb-8 mx-4 flex flex-col"
//         onClick={e => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
//               <Video size={16} className="text-white" />
//             </div>
//             <h2 className="font-black text-[#1A1A2E] text-lg">
//               {isEdit ? "Edit Webinar" : "Schedule Webinar"}
//             </h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-5 overflow-y-auto">

//           {/* ── IMAGE PICKER ── */}
//           <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
//             <div className="flex items-center gap-2 mb-1">
//               <ImageIcon size={14} className="text-[#FF6B6B]" />
//               <p className="text-xs font-black text-[#1A1A2E] uppercase tracking-widest">Banner Image</p>
//               {form.bannerUrl && (
//                 <span className="ml-auto text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
//                   <Check size={9} /> Custom image set
//                 </span>
//               )}
//             </div>
//             <ImagePicker
//               value={form.bannerUrl}
//               onChange={url => onChange("bannerUrl", url)}
//               platform={form.platform as Platform}
//             />
//           </div>

//           <FormField label="Webinar Title *">
//             <input
//               value={form.title}
//               onChange={e => onChange("title", e.target.value)}
//               placeholder="e.g. Parent Orientation — Abacus Level 1"
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10"
//             />
//           </FormField>

//           <FormField label="Description">
//             <textarea
//               value={form.description}
//               onChange={e => onChange("description", e.target.value)}
//               rows={2}
//               placeholder="Brief description..."
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 resize-none"
//             />
//           </FormField>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Platform">
//               <select
//                 value={form.platform}
//                 onChange={e => onChange("platform", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white"
//               >
//                 <option value="zoom">📹 Zoom</option>
//                 <option value="google_meet">🎥 Google Meet</option>
//                 <option value="microsoft_teams">💼 Microsoft Teams</option>
//                 <option value="other">🖥️ Other</option>
//               </select>
//             </FormField>
//             <FormField label="Meeting Link *">
//               <input
//                 value={form.meetingLink}
//                 onChange={e => onChange("meetingLink", e.target.value)}
//                 placeholder="https://zoom.us/j/..."
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
//               />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Meeting ID">
//               <input value={form.meetingId} onChange={e => onChange("meetingId", e.target.value)}
//                 placeholder="123 456 789"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//             <FormField label="Passcode">
//               <input value={form.passcode} onChange={e => onChange("passcode", e.target.value)}
//                 placeholder="Optional"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Scheduled At *">
//               <input type="datetime-local" value={form.scheduledAt}
//                 onChange={e => onChange("scheduledAt", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//             <FormField label="Duration (minutes)">
//               <input type="number" value={form.durationMins} min={15} max={480}
//                 onChange={e => onChange("durationMins", e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField label="Host Name">
//               <input value={form.hostName} onChange={e => onChange("hostName", e.target.value)}
//                 placeholder="Presenter / Teacher name"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//             <FormField label="Host Email">
//               <input value={form.hostEmail} onChange={e => onChange("hostEmail", e.target.value)}
//                 placeholder="host@school.com"
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50" />
//             </FormField>
//           </div>

//           {isEdit && (
//             <FormField label="Status">
//               <div className="flex gap-3">
//                 {(["active", "inactive"] as WebinarStatus[]).map(s => (
//                   <button key={s} type="button" onClick={() => onChange("status", s)}
//                     className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
//                       ${form.status === s
//                         ? s === "active" ? "border-green-400 bg-green-50 text-green-700" : "border-gray-300 bg-gray-100 text-gray-600"
//                         : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
//                     {s === "active" ? "🟢 Active" : "⚫ Inactive"}
//                   </button>
//                 ))}
//               </div>
//             </FormField>
//           )}

//           {/* Target audience */}
//           <div className="p-4 bg-[#FFFDF7] border border-[#FFB347]/30 rounded-xl space-y-3">
//             <div>
//               <p className="text-xs font-black text-[#FF6B6B] uppercase tracking-widest">Target Audience</p>
//               <p className="text-xs text-gray-400 mt-0.5">Leave blank to send to ALL students and parents</p>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <FormField label="Specific Program (optional)">
//                 <select value={form.programId} onChange={e => onChange("programId", e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white">
//                   <option value="">All Programs</option>
//                   {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//               </FormField>
//               <FormField label="Specific Level (optional)">
//                 <select value={form.levelId} onChange={e => onChange("levelId", e.target.value)}
//                   disabled={!form.programId || levels.length === 0}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white disabled:opacity-50">
//                   <option value="">All Levels</option>
//                   {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//                 </select>
//               </FormField>
//             </div>
//           </div>

//           {/* Send email on create */}
//           {!isEdit && (
//             <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#FF6B6B]/30 transition-colors">
//               <input type="checkbox" checked={form.sendEmail} onChange={e => onChange("sendEmail", e.target.checked)}
//                 className="w-4 h-4 accent-[#FF6B6B]" />
//               <div>
//                 <p className="text-sm font-bold text-[#1A1A2E]">Send email immediately on create</p>
//                 <p className="text-xs text-gray-500">Goes to all targeted students &amp; parents</p>
//               </div>
//             </label>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
//           <button onClick={onClose}
//             className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
//             Cancel
//           </button>
//           <button onClick={onSubmit} disabled={saving}
//             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
//             {saving ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
//             {isEdit ? "Save Changes" : "Create Webinar"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Detail Modal ─────────────────────────────────────────────────────────────
// function WebinarDetailModal({
//   webinar: w, onClose, onEdit,
//   onSendNotif, onSendEmail,
//   sendingNotif, sendingEmail,
// }: {
//   webinar: Webinar; onClose: () => void; onEdit: () => void;
//   onSendNotif: () => void; onSendEmail: () => void;
//   sendingNotif: boolean; sendingEmail: boolean;
// }) {
//   const pm   = PLATFORM_META[w.platform];
//   const sm   = STATUS_META[w.status];
//   const sched = new Date(w.scheduledAt);
//   const dateStr    = sched.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
//   const timeStr    = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const endTimeStr = new Date(sched.getTime() + w.durationMins * 60000)
//     .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
//       style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-fit mt-20 mb-8 mx-4 flex flex-col overflow-hidden"
//         onClick={e => e.stopPropagation()}>

//         {/* Banner */}
//         <div className="relative h-36 overflow-hidden">
//           <img src={getWebinarBanner(w)} alt={w.title} className="w-full h-full object-cover"
//             onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }} />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
//           <button onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors">
//             <X size={16} className="text-white" />
//           </button>
//           <div className="absolute bottom-0 left-0 right-0 p-4">
//             <div className="flex items-center gap-2 mb-1 flex-wrap">
//               <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
//                 {pm.icon} {pm.label}
//               </span>
//               <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
//                 <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} /> {sm.label}
//               </span>
//             </div>
//             <h2 className="font-black text-white text-lg leading-tight pr-8 drop-shadow">{w.title}</h2>
//             {w.description && <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{w.description}</p>}
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-5 space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <InfoCard icon="📅" label="Date"     value={dateStr} />
//             <InfoCard icon="⏰" label="Time"     value={`${timeStr} – ${endTimeStr}`} />
//             <InfoCard icon="⏱️" label="Duration" value={`${w.durationMins} minutes`} />
//             <InfoCard icon="👥" label="Audience"
//               value={w.program ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}` : "All Students & Parents"} />
//             {w.hostName  && <InfoCard icon="🎤" label="Host"       value={w.hostName} />}
//             {w.meetingId && <InfoCard icon="🔢" label="Meeting ID" value={w.meetingId} />}
//             {w.passcode  && <InfoCard icon="🔑" label="Passcode"   value={w.passcode} />}
//           </div>

//           {/* Join link */}
//           <div className="p-4 rounded-xl border-2 text-center"
//             style={{ borderColor: `${pm.color}30`, background: `${pm.color}08` }}>
//             <p className="text-xs font-bold text-gray-400 mb-1.5">MEETING LINK</p>
//             <a href={w.meetingLink} target="_blank" rel="noopener noreferrer"
//               className="text-sm font-bold break-all hover:underline" style={{ color: pm.color }}>
//               {w.meetingLink}
//             </a>
//             <div className="mt-3">
//               <a href={w.meetingLink} target="_blank" rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
//                 style={{ background: pm.color }}>
//                 🚀 Join Webinar <ExternalLink size={13} />
//               </a>
//             </div>
//           </div>

//           {/* ── Send history with counts ── */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="p-3 rounded-xl border bg-purple-50 border-purple-100">
//               <div className="flex items-center justify-between mb-1">
//                 <div className="flex items-center gap-1.5 text-purple-700">
//                   <BellRing size={13} />
//                   <span className="text-xs font-black">Notifications</span>
//                 </div>
//                 <span className="text-lg font-black text-purple-700">{w.notificationSentCount ?? 0}×</span>
//               </div>
//               {w.notificationSentAt ? (
//                 <p className="text-[10px] text-purple-400">
//                   Last: {new Date(w.notificationSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
//                 </p>
//               ) : (
//                 <p className="text-[10px] text-purple-300">Not sent yet</p>
//               )}
//             </div>
//             <div className="p-3 rounded-xl border bg-green-50 border-green-100">
//               <div className="flex items-center justify-between mb-1">
//                 <div className="flex items-center gap-1.5 text-green-700">
//                   <Mail size={13} />
//                   <span className="text-xs font-black">Emails</span>
//                 </div>
//                 <span className="text-lg font-black text-green-700">{w.emailSentCount ?? 0}×</span>
//               </div>
//               {w.emailSentAt ? (
//                 <p className="text-[10px] text-green-500">
//                   Last: {new Date(w.emailSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
//                 </p>
//               ) : (
//                 <p className="text-[10px] text-green-300">Not sent yet</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer — two separate action buttons */}
//         <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
//           <button onClick={onEdit}
//             className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
//             <Edit2 size={14} /> Edit
//           </button>

//           {/* NOTIFY — independent */}
//           <button onClick={onSendNotif} disabled={sendingNotif || sendingEmail}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
//             style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}>
//             {sendingNotif ? <Loader2 size={15} className="animate-spin" /> : <BellRing size={15} />}
//             {sendingNotif ? "Sending..." : `Send Notification${(w.notificationSentCount ?? 0) > 0 ? ` (${w.notificationSentCount}×)` : ""}`}
//           </button>

//           {/* EMAIL — independent */}
//           <button onClick={onSendEmail} disabled={sendingEmail || sendingNotif}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
//             style={{ background: "linear-gradient(135deg,#FF6B6B,#FFB347)" }}>
//             {sendingEmail ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
//             {sendingEmail ? "Sending..." : `Send Email${(w.emailSentCount ?? 0) > 0 ? ` (${w.emailSentCount}×)` : ""}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Small helpers ────────────────────────────────────────────────────────────
// function FormField({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
//       {children}
//     </div>
//   );
// }

// function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
//   return (
//     <div className="bg-gray-50 rounded-xl p-3">
//       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{icon} {label}</p>
//       <p className="text-sm font-bold text-[#1A1A2E] leading-snug">{value}</p>
//     </div>
//   );
// }

// function SelectFilter({ value, onChange, placeholder, options }: {
//   value: string; onChange: (v: string) => void;
//   placeholder: string; options: { value: string; label: string }[];
// }) {
//   return (
//     <select value={value} onChange={e => onChange(e.target.value)}
//       className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700">
//       <option value="">{placeholder}</option>
//       {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//     </select>
//   );
// }

// function EmptyState({ onAdd }: { onAdd: () => void }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFB347]/10 rounded-2xl flex items-center justify-center mb-4">
//         <Video size={36} className="text-[#FF6B6B]" />
//       </div>
//       <h3 className="text-lg font-black text-[#1A1A2E] mb-1">No webinars yet</h3>
//       <p className="text-sm text-gray-400 mb-5">Schedule your first online session for all students and parents.</p>
//       <button onClick={onAdd}
//         className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
//         <Plus size={16} /> Schedule Webinar
//       </button>
//     </div>
//   );
// }

















"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Video, Plus, Search, Edit2, Trash2,
  Calendar, Clock, Users, Link2, Eye, X, ChevronDown,
  Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff,
  Globe, Zap, ExternalLink, Mail, RefreshCw, BellRing,
  Upload, ImageIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Platform = "zoom" | "google_meet" | "microsoft_teams" | "other";
type WebinarStatus = "active" | "inactive";

interface Program { id: string; name: string }
interface Level   { id: string; name: string }
interface Webinar {
  id: string;
  title: string;
  description?: string;
  platform: Platform;
  meetingLink: string;
  meetingId?: string;
  passcode?: string;
  hostName?: string;
  hostEmail?: string;
  scheduledAt: string;
  durationMins: number;
  status: WebinarStatus;
  programId?: string;
  levelId?: string;
  bannerUrl?: string;
  emailSent: boolean;
  emailSentAt?: string;
  emailSentCount: number;
  notificationSent?: boolean;
  notificationSentAt?: string;
  notificationSentCount?: number;
  program?: { id: string; name: string };
  level?:   { id: string; name: string };
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; icon: string }> = {
  zoom:            { label: "Zoom",            color: "#2D8CFF", bg: "#EBF4FF", icon: "📹" },
  google_meet:     { label: "Google Meet",     color: "#34A853", bg: "#E8F5E9", icon: "🎥" },
  microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", bg: "#EDECF9", icon: "💼" },
  other:           { label: "Online",          color: "#FF6B6B", bg: "#FFF0F0", icon: "🖥️" },
};

const STATUS_META: Record<WebinarStatus, { label: string; color: string; bg: string; dot: string }> = {
  active:   { label: "Active",   color: "#22C55E", bg: "#F0FDF4", dot: "bg-green-400" },
  inactive: { label: "Inactive", color: "#9CA3AF", bg: "#F3F4F6", dot: "bg-gray-400"  },
};

// Default banners per platform
const PLATFORM_BANNERS: Record<Platform, string> = {
  zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
  google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
  microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
};

function getWebinarBanner(w: Webinar): string {
  return w.bannerUrl || PLATFORM_BANNERS[w.platform];
}

const emptyForm = () => ({
  title: "", description: "", platform: "zoom" as Platform,
  meetingLink: "", meetingId: "", passcode: "",
  hostName: "", hostEmail: "", scheduledAt: "", durationMins: 60,
  programId: "", levelId: "", bannerUrl: "",
  status: "active" as WebinarStatus,
});

// ─── Banner Uploader Component ────────────────────────────────────────────────
function BannerUploader({
  currentUrl,
  platform,
  onChange,
  token,
}: {
  currentUrl: string;
  platform: Platform;
  onChange: (url: string) => void;
  token: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = currentUrl || PLATFORM_BANNERS[platform];

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP or GIF allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5 MB.");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/webinars/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
        <ImageIcon size={11} /> Banner Image
      </label>

      {/* Preview with overlay buttons */}
      <div className="rounded-xl overflow-hidden h-32 bg-gray-100 relative group">
        <img
          src={preview}
          alt="Banner preview"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-2 bg-white text-[#1A1A2E] text-xs font-bold rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-60"
          >
            {uploading
              ? <Loader2 size={12} className="animate-spin" />
              : <Upload size={12} />}
            {uploading ? "Uploading…" : currentUrl ? "Replace" : "Upload Photo"}
          </button>
          {currentUrl && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-2 bg-red-500 text-white text-xs font-bold rounded-lg shadow-md hover:bg-red-600"
            >
              <X size={11} /> Reset
            </button>
          )}
        </div>

        {/* Status badge bottom-left */}
        <div className="absolute bottom-2 left-2">
          {currentUrl ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-green-500 text-white rounded-full">
              <CheckCircle2 size={9} /> Custom image
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-black/50 text-white rounded-full backdrop-blur-sm">
              Default ({PLATFORM_META[platform].label})
            </span>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />

      {uploadError && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
          <AlertCircle size={11} /> {uploadError}
        </p>
      )}

      {/* Click hint when not hovering */}
      <p className="text-xs text-gray-400">
        Hover the image above and click <strong>Upload Photo</strong> to select from your PC.
        {currentUrl ? " Click Reset to use the platform default." : ""}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WebinarsView() {
  const { token } = useAuth();

  const [webinars,      setWebinars]      = useState<Webinar[]>([]);
  const [programs,      setPrograms]      = useState<Program[]>([]);
  const [levels,        setLevels]        = useState<Level[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [modal,         setModal]         = useState<"create" | "edit" | "view" | null>(null);
  const [selected,      setSelected]      = useState<Webinar | null>(null);
  const [form,          setForm]          = useState(emptyForm());
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [sendingEmail,  setSendingEmail]  = useState<string | null>(null);
  const [sendingNotif,  setSendingNotif]  = useState<string | null>(null);
  const submittingRef = useRef(false);

  // ── Authenticated fetch ────────────────────────────────────────────────────
  const authFetch = useCallback(
    (url: string, init: RequestInit = {}) =>
      fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }),
    [token],
  );

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchWebinars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus)  params.set("status",    filterStatus);
      if (filterProgram) params.set("programId", filterProgram);
      const res  = await authFetch(`/api/admin/webinars?${params}`);
      const data = await res.json();
      setWebinars(Array.isArray(data) ? data : []);
    } catch { setWebinars([]); }
    finally  { setLoading(false); }
  }, [filterStatus, filterProgram, authFetch]);

  const fetchPrograms = useCallback(async () => {
    try {
      const res  = await authFetch("/api/admin/programs");
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch {}
  }, [authFetch]);

  const fetchLevels = useCallback(async (programId: string) => {
    if (!programId) { setLevels([]); return; }
    try {
      const res  = await authFetch(`/api/admin/programs/${programId}/levels`);
      const data = await res.json();
      setLevels(Array.isArray(data) ? data : []);
    } catch { setLevels([]); }
  }, [authFetch]);

  useEffect(() => { fetchWebinars(); }, [fetchWebinars]);
  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm());
    setLevels([]);
    setSelected(null);
    setModal("create");
  };

  const openEdit = (w: Webinar) => {
    setSelected(w);
    setForm({
      title:        w.title,
      description:  w.description  || "",
      platform:     w.platform,
      meetingLink:  w.meetingLink,
      meetingId:    w.meetingId    || "",
      passcode:     w.passcode     || "",
      hostName:     w.hostName     || "",
      hostEmail:    w.hostEmail    || "",
      scheduledAt:  w.scheduledAt.slice(0, 16),
      durationMins: w.durationMins,
      programId:    w.programId    || "",
      levelId:      w.levelId      || "",
      bannerUrl:    w.bannerUrl    || "",   // ← auto-loads existing image
      status:       w.status,
    });
    if (w.programId) fetchLevels(w.programId);
    setModal("edit");
  };

  const openView   = (w: Webinar) => { setSelected(w); setModal("view"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleFormChange = (key: string, val: any) => {
    if (key === "programId") {
      fetchLevels(val);
      setForm(f => ({ ...f, programId: val, levelId: "" }));
    } else {
      setForm(f => ({ ...f, [key]: val }));
    }
  };

  // ── Create / Update ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (submittingRef.current) return;
    if (!form.title || !form.meetingLink || !form.scheduledAt) {
      showToast("Title, meeting link and scheduled time are required.", "error");
      return;
    }
    submittingRef.current = true;
    setSaving(true);
    try {
      const isEdit = modal === "edit" && selected;
      const url    = isEdit ? `/api/admin/webinars/${selected.id}` : "/api/admin/webinars";
      const method = isEdit ? "PATCH" : "POST";
      const res = await authFetch(url, {
        method,
        body: JSON.stringify({ ...form, durationMins: Number(form.durationMins) }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      showToast(isEdit ? "Webinar updated!" : "Webinar created!");
      closeModal();
      fetchWebinars();
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
      submittingRef.current = false;
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (w: Webinar) => {
    if (!confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`/api/admin/webinars/${w.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Webinar deleted.");
      fetchWebinars();
    } catch { showToast("Delete failed.", "error"); }
  };

  // ── Status toggle ──────────────────────────────────────────────────────────
  const handleStatusChange = async (w: Webinar, status: WebinarStatus) => {
    try {
      await authFetch(`/api/admin/webinars/${w.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      fetchWebinars();
    } catch {}
  };

  // ── Send in-app notification ───────────────────────────────────────────────
  const handleSendNotification = async (w: Webinar) => {
    setSendingNotif(w.id);
    try {
      const res  = await authFetch(`/api/admin/webinars/${w.id}/send-notification`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const prev = w.notificationSentCount ?? 0;
      showToast(`🔔 Notifications sent to ${data.count} users! (Send #${prev + 1})`);
      fetchWebinars();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setSendingNotif(null); }
  };

  // ── Send email ─────────────────────────────────────────────────────────────
  const handleSendEmail = async (w: Webinar) => {
    setSendingEmail(w.id);
    try {
      const res  = await authFetch(`/api/admin/webinars/${w.id}/send-email`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const prev = w.emailSentCount ?? 0;
      showToast(`📧 Emails sent to ${data.sent}/${data.total} recipients! (Send #${prev + 1})`);
      fetchWebinars();
    } catch (e: any) { showToast(e.message, "error"); }
    finally { setSendingEmail(null); }
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = webinars.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    (w.program?.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 min-h-0">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border
          ${toast.type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50  border-red-200  text-red-800"}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Webinars</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule &amp; manage online sessions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Schedule Webinar
        </button>
      </div>

      {/* Stats */}
      <StatsRow webinars={webinars} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search webinars…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10 bg-white"
          />
        </div>
        <SelectFilter
          value={filterStatus}
          onChange={setFilterStatus}
          placeholder="All Status"
          options={[
            { value: "active",   label: "Active"   },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <SelectFilter
          value={filterProgram}
          onChange={setFilterProgram}
          placeholder="All Programs"
          options={programs.map(p => ({ value: p.id, label: p.name }))}
        />
        <button
          onClick={fetchWebinars}
          className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="grid gap-4">
          {filtered.map(w => (
            <WebinarCard
              key={w.id}
              webinar={w}
              onEdit={()        => openEdit(w)}
              onView={()        => openView(w)}
              onDelete={()      => handleDelete(w)}
              onSendNotif={()   => handleSendNotification(w)}
              onSendEmail={()   => handleSendEmail(w)}
              onStatusChange={s => handleStatusChange(w, s)}
              sendingNotif={sendingNotif === w.id}
              sendingEmail={sendingEmail === w.id}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <WebinarFormModal
          form={form}
          onChange={handleFormChange}
          programs={programs}
          levels={levels}
          onSubmit={handleSubmit}
          onClose={closeModal}
          saving={saving}
          isEdit={modal === "edit"}
          token={token}
        />
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <WebinarDetailModal
          webinar={selected}
          onClose={closeModal}
          onEdit={() => { closeModal(); openEdit(selected); }}
          onSendNotif={() => handleSendNotification(selected)}
          onSendEmail={() => handleSendEmail(selected)}
          sendingNotif={sendingNotif === selected.id}
          sendingEmail={sendingEmail === selected.id}
        />
      )}
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow({ webinars }: { webinars: Webinar[] }) {
  const now  = new Date();
  const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const stats = [
    { label: "Total",    value: webinars.length,                                      color: "#FF6B6B", icon: Video   },
    { label: "Active",   value: webinars.filter(w => w.status === "active").length,   color: "#22C55E", icon: Wifi    },
    { label: "Inactive", value: webinars.filter(w => w.status === "inactive").length, color: "#9CA3AF", icon: WifiOff },
    {
      label: "This Week",
      value: webinars.filter(w => { const d = new Date(w.scheduledAt); return d >= now && d <= week; }).length,
      color: "#8B5CF6", icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
              <Icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1A1A2E]">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Webinar Card ─────────────────────────────────────────────────────────────
function WebinarCard({
  webinar: w,
  onEdit, onView, onDelete,
  onSendNotif, onSendEmail,
  onStatusChange,
  sendingNotif, sendingEmail,
}: {
  webinar: Webinar;
  onEdit: () => void; onView: () => void; onDelete: () => void;
  onSendNotif: () => void; onSendEmail: () => void;
  sendingNotif: boolean; sendingEmail: boolean;
  onStatusChange: (s: WebinarStatus) => void;
}) {
  const pm = PLATFORM_META[w.platform];
  const sm = STATUS_META[w.status];
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const scheduled = new Date(w.scheduledAt);
  const dateStr   = scheduled.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr   = scheduled.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const isPast    = scheduled < new Date();

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden
      ${w.status === "inactive" ? "opacity-70 border-gray-100" : "border-gray-100"}`}>

      {/* Platform colour bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${pm.color},${pm.color}66)` }} />

      {/* Banner thumbnail */}
      <div className="h-16 w-full overflow-hidden relative">
        <img
          src={getWebinarBanner(w)}
          alt=""
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-start gap-4">
          {/* Platform icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg -mt-8 z-10 shadow-sm border border-white"
            style={{ background: pm.bg }}
          >
            {pm.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-bold text-[#1A1A2E] text-base leading-tight truncate">{w.title}</h3>
                {w.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{w.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* Platform badge */}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: pm.bg, color: pm.color }}>
                    {pm.icon} {pm.label}
                  </span>

                  {/* Status toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(v => !v)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full hover:opacity-80"
                      style={{ background: sm.bg, color: sm.color }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${w.status === "active" ? "animate-pulse" : ""}`} />
                      {sm.label} <ChevronDown size={10} />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[130px]">
                        {(["active", "inactive"] as WebinarStatus[]).map(s => (
                          <button
                            key={s}
                            onClick={() => { onStatusChange(s); setShowStatusMenu(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 flex items-center gap-2"
                            style={{ color: STATUS_META[s].color }}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`} />
                            {STATUS_META[s].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audience */}
                  {w.program ? (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {w.program.name}{w.level ? ` › ${w.level.name}` : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Globe size={10} /> All Students &amp; Parents
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                <button onClick={onView}   title="View"
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition-colors">
                  <Eye size={15} />
                </button>
                <button onClick={onEdit}   title="Edit"
                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={15} />
                </button>

                {/* ── In-app Notify button ── */}
                <button
                  onClick={onSendNotif}
                  disabled={sendingNotif || sendingEmail}
                  title={`Send in-app notification${(w.notificationSentCount ?? 0) > 0 ? ` — sent ${w.notificationSentCount}× before` : ""}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {sendingNotif
                    ? <Loader2 size={12} className="animate-spin" />
                    : <BellRing size={12} />}
                  Notify
                  {(w.notificationSentCount ?? 0) > 0 && (
                    <span className="bg-white/25 px-1 py-0.5 rounded text-[10px] leading-none">
                      {w.notificationSentCount}×
                    </span>
                  )}
                </button>

                {/* ── Email button ── */}
                <button
                  onClick={onSendEmail}
                  disabled={sendingEmail || sendingNotif}
                  title={`Send email${(w.emailSentCount ?? 0) > 0 ? ` — sent ${w.emailSentCount}× before` : ""}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {sendingEmail
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Mail size={12} />}
                  Email
                  {(w.emailSentCount ?? 0) > 0 && (
                    <span className="bg-white/25 px-1 py-0.5 rounded text-[10px] leading-none">
                      {w.emailSentCount}×
                    </span>
                  )}
                </button>

                <button onClick={onDelete} title="Delete"
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Info row */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Calendar size={12} className="text-[#FF6B6B]" /> {dateStr}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Clock size={12} className="text-[#FFB347]" /> {timeStr} · {w.durationMins} min
              </span>
              {w.hostName && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Users size={12} className="text-blue-400" /> {w.hostName}
                </span>
              )}
              {isPast && w.status === "active" && (
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                  Past — consider marking inactive
                </span>
              )}
              <a
                href={w.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-[#2D8CFF] hover:underline ml-auto"
              >
                <Link2 size={11} /> Join <ExternalLink size={10} />
              </a>
            </div>

            {/* Send history badges */}
            {(w.emailSent || (w.notificationSentCount ?? 0) > 0) && (
              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                {(w.notificationSentCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-lg">
                    <BellRing size={11} />
                    Notified {w.notificationSentCount}×
                    {w.notificationSentAt && (
                      <span className="text-purple-400 font-normal ml-1">
                        — Last: {new Date(w.notificationSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </span>
                )}
                {w.emailSent && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg">
                    <Mail size={11} />
                    Emailed {w.emailSentCount}×
                    {w.emailSentAt && (
                      <span className="text-green-500 font-normal ml-1">
                        — Last: {new Date(w.emailSentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function WebinarFormModal({
  form, onChange, programs, levels,
  onSubmit, onClose, saving, isEdit, token,
}: {
  form: ReturnType<typeof emptyForm>;
  onChange: (k: string, v: any) => void;
  programs: Program[]; levels: Level[];
  onSubmit: () => void; onClose: () => void;
  saving: boolean; isEdit: boolean;
  token: string | null;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-fit mt-16 mb-8 mx-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
              <Video size={16} className="text-white" />
            </div>
            <h2 className="font-black text-[#1A1A2E] text-lg">
              {isEdit ? "Edit Webinar" : "Schedule Webinar"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[75vh]">

          {/* ── Banner Image Uploader ── */}
          <BannerUploader
            currentUrl={form.bannerUrl}
            platform={form.platform as Platform}
            onChange={url => onChange("bannerUrl", url)}
            token={token}
          />

          <FormField label="Webinar Title *">
            <input
              value={form.title}
              onChange={e => onChange("title", e.target.value)}
              placeholder="e.g. Parent Orientation — Abacus Level 1"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 focus:ring-2 focus:ring-[#FF6B6B]/10"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={e => onChange("description", e.target.value)}
              rows={2}
              placeholder="Brief description…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 resize-none"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Platform">
              <select
                value={form.platform}
                onChange={e => onChange("platform", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white"
              >
                <option value="zoom">📹 Zoom</option>
                <option value="google_meet">🎥 Google Meet</option>
                <option value="microsoft_teams">💼 Microsoft Teams</option>
                <option value="other">🖥️ Other</option>
              </select>
            </FormField>
            <FormField label="Meeting Link *">
              <input
                value={form.meetingLink}
                onChange={e => onChange("meetingLink", e.target.value)}
                placeholder="https://zoom.us/j/…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Meeting ID">
              <input
                value={form.meetingId}
                onChange={e => onChange("meetingId", e.target.value)}
                placeholder="123 456 789"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
            <FormField label="Passcode">
              <input
                value={form.passcode}
                onChange={e => onChange("passcode", e.target.value)}
                placeholder="Optional"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Scheduled At *">
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => onChange("scheduledAt", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
            <FormField label="Duration (minutes)">
              <input
                type="number"
                value={form.durationMins}
                min={15} max={480}
                onChange={e => onChange("durationMins", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Host Name">
              <input
                value={form.hostName}
                onChange={e => onChange("hostName", e.target.value)}
                placeholder="Presenter / Teacher name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
            <FormField label="Host Email">
              <input
                value={form.hostEmail}
                onChange={e => onChange("hostEmail", e.target.value)}
                placeholder="host@school.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50"
              />
            </FormField>
          </div>

          {/* Status — edit only */}
          {isEdit && (
            <FormField label="Status">
              <div className="flex gap-3">
                {(["active", "inactive"] as WebinarStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChange("status", s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
                      ${form.status === s
                        ? s === "active"
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-300 bg-gray-100 text-gray-600"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                      }`}
                  >
                    {s === "active" ? "🟢 Active" : "⚫ Inactive"}
                  </button>
                ))}
              </div>
            </FormField>
          )}

          {/* Target audience */}
          <div className="p-4 bg-[#FFFDF7] border border-[#FFB347]/30 rounded-xl space-y-3">
            <div>
              <p className="text-xs font-black text-[#FF6B6B] uppercase tracking-widest">Target Audience</p>
              <p className="text-xs text-gray-400 mt-0.5">Leave blank to send to ALL students and parents</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Specific Program (optional)">
                <select
                  value={form.programId}
                  onChange={e => onChange("programId", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white"
                >
                  <option value="">All Programs</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </FormField>
              <FormField label="Specific Level (optional)">
                <select
                  value={form.levelId}
                  onChange={e => onChange("levelId", e.target.value)}
                  disabled={!form.programId || levels.length === 0}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B6B]/50 bg-white disabled:opacity-50"
                >
                  <option value="">All Levels</option>
                  {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </FormField>
            </div>
          </div>

          {/* ── Send options — shown for both create AND edit ── */}
          <div className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Send After {isEdit ? "Saving" : "Creating"}
            </p>
            <p className="text-xs text-gray-400 -mt-1">
              You can also send from the webinar card at any time. Counts are tracked separately.
            </p>

            {/* Email option */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 bg-white hover:border-[#FF6B6B]/30 transition-colors">
              <input
                type="checkbox"
                checked={(form as any).sendEmail ?? false}
                onChange={e => onChange("sendEmail", e.target.checked)}
                className="w-4 h-4 accent-[#FF6B6B]"
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A2E]">Send email</p>
                  <p className="text-xs text-gray-500">To all targeted students, parents &amp; teachers</p>
                </div>
              </div>
            </label>

            {/* In-app notification option */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 bg-white hover:border-[#8B5CF6]/30 transition-colors">
              <input
                type="checkbox"
                checked={(form as any).sendNotification ?? false}
                onChange={e => onChange("sendNotification", e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6]"
              />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center flex-shrink-0">
                  <BellRing size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A2E]">Send in-app notification</p>
                  <p className="text-xs text-gray-500">Appears in students' notification bell</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
            {isEdit ? "Save Changes" : "Create Webinar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function WebinarDetailModal({
  webinar: w, onClose, onEdit,
  onSendNotif, onSendEmail,
  sendingNotif, sendingEmail,
}: {
  webinar: Webinar; onClose: () => void; onEdit: () => void;
  onSendNotif: () => void; onSendEmail: () => void;
  sendingNotif: boolean; sendingEmail: boolean;
}) {
  const pm      = PLATFORM_META[w.platform];
  const sm      = STATUS_META[w.status];
  const sched   = new Date(w.scheduledAt);
  const dateStr = sched.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const endStr  = new Date(sched.getTime() + w.durationMins * 60000)
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-fit mt-16 mb-8 mx-4 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={getWebinarBanner(w)}
            alt={w.title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = PLATFORM_BANNERS.other; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {pm.icon} {pm.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} /> {sm.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                <Globe size={10} />
                {w.program ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}` : "All Students & Parents"}
              </span>
            </div>
            <h2 className="font-black text-white text-lg leading-tight pr-8 drop-shadow">{w.title}</h2>
            {w.description && (
              <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{w.description}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard icon="📅" label="Date"     value={dateStr} />
            <InfoCard icon="⏰" label="Time"     value={`${timeStr} – ${endStr}`} />
            <InfoCard icon="⏱️" label="Duration" value={`${w.durationMins} minutes`} />
            <InfoCard icon="👥" label="Audience"
              value={w.program
                ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}`
                : "All Students & Parents"} />
            {w.hostName  && <InfoCard icon="🎤" label="Host"       value={w.hostName} />}
            {w.meetingId && <InfoCard icon="🔢" label="Meeting ID" value={w.meetingId} />}
            {w.passcode  && <InfoCard icon="🔑" label="Passcode"   value={w.passcode} />}
          </div>

          {/* Join link */}
          <div
            className="p-4 rounded-xl border-2 text-center"
            style={{ borderColor: `${pm.color}30`, background: `${pm.color}08` }}
          >
            <p className="text-xs font-bold text-gray-400 mb-1.5">MEETING LINK</p>
            <a
              href={w.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold break-all hover:underline"
              style={{ color: pm.color }}
            >
              {w.meetingLink}
            </a>
            <div className="mt-3">
              <a
                href={w.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
                style={{ background: pm.color }}
              >
                🚀 Join Webinar <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Send history */}
          {((w.notificationSentCount ?? 0) > 0 || w.emailSent) && (
            <div className="space-y-2">
              {(w.notificationSentCount ?? 0) > 0 && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-semibold">
                  <BellRing size={15} />
                  In-app notifications sent {w.notificationSentCount}×
                  {w.notificationSentAt && (
                    <span className="ml-auto text-xs text-purple-400 font-normal">
                      Last: {new Date(w.notificationSentAt).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}
              {w.emailSent && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-semibold">
                  <Mail size={15} />
                  Emails sent {w.emailSentCount}×
                  {w.emailSentAt && (
                    <span className="ml-auto text-xs text-green-500 font-normal">
                      Last: {new Date(w.emailSentAt).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — separate Email and Notify buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>

          {/* In-app notification */}
          <button
            onClick={onSendNotif}
            disabled={sendingNotif || sendingEmail}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {sendingNotif ? <Loader2 size={15} className="animate-spin" /> : <BellRing size={15} />}
            Notify{(w.notificationSentCount ?? 0) > 0 ? ` (${w.notificationSentCount}×)` : ""}
          </button>

          {/* Email */}
          <button
            onClick={onSendEmail}
            disabled={sendingEmail || sendingNotif}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {sendingEmail ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            Email{(w.emailSentCount ?? 0) > 0 ? ` (${w.emailSentCount}×)` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{icon} {label}</p>
      <p className="text-sm font-bold text-[#1A1A2E] leading-snug">{value}</p>
    </div>
  );
}

function SelectFilter({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#FF6B6B]/50 text-gray-700"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFB347]/10 rounded-2xl flex items-center justify-center mb-4">
        <Video size={36} className="text-[#FF6B6B]" />
      </div>
      <h3 className="text-lg font-black text-[#1A1A2E] mb-1">No webinars yet</h3>
      <p className="text-sm text-gray-400 mb-5">Schedule your first online session for all students and parents.</p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
      >
        <Plus size={16} /> Schedule Webinar
      </button>
    </div>
  );
}