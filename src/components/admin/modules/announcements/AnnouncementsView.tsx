// src\components\admin\modules\announcements\AnnouncementsView.tsx


// "use client";


// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import {
//   Plus, Search, Trash2, X, Loader2, Edit,
//   Megaphone, AlertTriangle, Info, Bell,
//   Calendar, Users, ToggleLeft, ToggleRight,
//   Paperclip, FileText, Image as ImageIcon,
//   Send, Mail, CheckCircle, XCircle, Eye, EyeOff,
// } from "lucide-react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ── API helper ────────────────────────────────────────────────────────────────
// async function apiFetch(path: string, options?: RequestInit) {
//   const { data } = await supabase.auth.getSession();
//   const token = data.session?.access_token;
//   const res = await fetch(path, {
//     ...options,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       ...(options?.headers ?? {}),
//     },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// async function apiUpload(file: File, token: string) {
//   const fd = new FormData();
//   fd.append("file", file);
//   const res = await fetch("/api/admin/announcements/upload", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: fd,
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<{ fileUrl: string; storagePath: string; fileType: string; fileName: string }>;
// }

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Program { id: string; name: string; levels: { id: string; name: string }[] }
// interface Announcement {
//   id: string;
//   title: string;
//   message: string;
//   priority: "info" | "normal" | "urgent";
//   audience: "all" | "students" | "teachers" | "program" | "level";
//   programId: string | null;
//   levelId: string | null;
//   fileUrl: string | null;
//   fileType: string | null;
//   fileName: string | null;
//   expiresAt: string | null;
//   isActive: boolean;
//   emailSent: boolean;
//   createdAt: string;
//   program?: { id: string; name: string } | null;
//   level?: { id: string; name: string } | null;
// }

// interface FormState {
//   title: string; message: string;
//   priority: string; audience: string;
//   programId: string; levelId: string;
//   expiresAt: string; sendEmail: boolean;
//   fileUrl: string; storagePath: string;
//   fileType: string; fileName: string;
// }

// // ── Constants ─────────────────────────────────────────────────────────────────
// const PRIORITY_CFG = {
//   info:   { label: "Info",   color: "#4ECDC4", bg: "#4ECDC418", Icon: Info          },
//   normal: { label: "Normal", color: "#FFB347", bg: "#FFB34718", Icon: Bell          },
//   urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FF6B6B18", Icon: AlertTriangle },
// };
// const AUDIENCE_LABEL: Record<string, string> = {
//   all: "Everyone", students: "All Students",
//   teachers: "Teachers Only", program: "Program", level: "Level",
// };
// const EMPTY_FORM: FormState = {
//   title: "", message: "", priority: "normal", audience: "all",
//   programId: "", levelId: "", expiresAt: "", sendEmail: false,
//   fileUrl: "", storagePath: "", fileType: "", fileName: "",
// };

// // ── Primitives ────────────────────────────────────────────────────────────────
// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? "hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5" : ""} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? "animate-spin" : ""} />}
//     {children}
//   </button>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? "max-w-3xl" : "max-w-2xl"} flex flex-col`}
//         style={{ maxHeight: "92vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"><X size={20} /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: "thin" }}>{children}</div>
//       </div>
//     </div>
//   );
// };

// const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
//   <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
//     {children} {required && <span className="text-[#FF6B6B]">*</span>}
//   </label>
// );

// const inputCls = "w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] transition-colors";

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AnnouncementsView() {
//   const [items,      setItems]      = useState<Announcement[]>([]);
//   const [programs,   setPrograms]   = useState<Program[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploading,  setUploading]  = useState(false);
//   const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

//   const [isFormOpen,   setIsFormOpen]   = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [isViewOpen,   setIsViewOpen]   = useState(false);

//   const [editing,   setEditing]   = useState<Announcement | null>(null);
//   const [toDelete,  setToDelete]  = useState<Announcement | null>(null);
//   const [viewing,   setViewing]   = useState<Announcement | null>(null);
//   const [form,      setForm]      = useState<FormState>(EMPTY_FORM);
//   const [emailResult, setEmailResult] = useState<{ sent: number; failed: number } | null>(null);

//   const [search,    setSearch]    = useState("");
//   const [fAud,      setFAud]      = useState("");
//   const [fPri,      setFPri]      = useState("");
//   const [fActive,   setFActive]   = useState("");

//   const fileRef = useRef<HTMLInputElement>(null);

//   const showToast = (msg: string, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── Fetch ───────────────────────────────────────────────────────────────────
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [ann, prog] = await Promise.all([
//         apiFetch("/api/admin/announcements"),
//         apiFetch("/api/admin/programs"),
//       ]);
//       setItems(ann ?? []);
//       setPrograms(prog.programs ?? []);
//     } catch { showToast("Failed to load data", false); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchAll(); }, [fetchAll]);

//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const selectedProgram = programs.find((p) => p.id === form.programId);
//   const levels = selectedProgram?.levels ?? [];

//   const filtered = useMemo(() =>
//     items.filter((a) => {
//       const q = search.toLowerCase();
//       const matchQ   = !q || a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
//       const matchAud = !fAud || a.audience === fAud;
//       const matchPri = !fPri || a.priority === fPri;
//       const matchAct = !fActive || (fActive === "active" ? a.isActive : !a.isActive);
//       return matchQ && matchAud && matchPri && matchAct;
//     }),
//     [items, search, fAud, fPri, fActive]
//   );

//   const stats = [
//     { label: "Total",    value: items.length,                                                      color: "#FFB347" },
//     { label: "Active",   value: items.filter((a) => a.isActive).length,                            color: "#4ECDC4" },
//     { label: "Urgent",   value: items.filter((a) => a.priority === "urgent").length,                color: "#FF6B6B" },
//     { label: "Emailed",  value: items.filter((a) => a.emailSent).length,                            color: "#A78BFA" },
//   ];

//   // ── Open modal ──────────────────────────────────────────────────────────────
//   const openCreate = () => {
//     setEditing(null);
//     setForm(EMPTY_FORM);
//     setEmailResult(null);
//     setIsFormOpen(true);
//   };

//   const openEdit = (a: Announcement) => {
//     setEditing(a);
//     setForm({
//       title:       a.title,
//       message:     a.message,
//       priority:    a.priority,
//       audience:    a.audience,
//       programId:   a.programId   ?? "",
//       levelId:     a.levelId     ?? "",
//       expiresAt:   a.expiresAt   ? a.expiresAt.slice(0, 10) : "",
//       sendEmail:   false,
//       fileUrl:     a.fileUrl     ?? "",
//       storagePath: "",
//       fileType:    a.fileType    ?? "",
//       fileName:    a.fileName    ?? "",
//     });
//     setEmailResult(null);
//     setIsFormOpen(true);
//   };

//   // ── File upload ─────────────────────────────────────────────────────────────
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const { data } = await supabase.auth.getSession();
//       const token = data.session?.access_token ?? "";
//       const res = await apiUpload(file, token);
//       setForm((prev) => ({
//         ...prev,
//         fileUrl:     res.fileUrl,
//         storagePath: res.storagePath,
//         fileType:    res.fileType,
//         fileName:    res.fileName,
//       }));
//       showToast("File uploaded ✅");
//     } catch (err: any) {
//       showToast("Upload failed: " + err.message, false);
//     }
//     setUploading(false);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const removeFile = () => setForm((prev) => ({ ...prev, fileUrl: "", storagePath: "", fileType: "", fileName: "" }));

//   // ── Save ────────────────────────────────────────────────────────────────────
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.title.trim() || !form.message.trim()) { showToast("Title and message required", false); return; }
//     setSubmitting(true);
//     try {
//       const payload = {
//         title:       form.title.trim(),
//         message:     form.message.trim(),
//         priority:    form.priority,
//         audience:    form.audience,
//         programId:   ["program","level"].includes(form.audience) ? (form.programId || null) : null,
//         levelId:     form.audience === "level" ? (form.levelId || null) : null,
//         fileUrl:     form.fileUrl     || null,
//         storagePath: form.storagePath || null,
//         fileType:    form.fileType    || null,
//         fileName:    form.fileName    || null,
//         expiresAt:   form.expiresAt   || null,
//         sendEmail:   form.sendEmail,
//       };

//       const res = editing
//         ? await apiFetch(`/api/admin/announcements/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//         : await apiFetch("/api/admin/announcements",                { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

//       if (form.sendEmail && res.emailResult) {
//         setEmailResult(res.emailResult);
//         showToast(`Sent to ${res.emailResult.sent} recipients 📧`);
//       } else {
//         showToast(editing ? "Updated ✨" : "Published 📢");
//         setIsFormOpen(false);
//       }
//       fetchAll();
//     } catch (err: any) {
//       let msg = err.message;
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg, false);
//     }
//     setSubmitting(false);
//   };

//   // ── Toggle active ───────────────────────────────────────────────────────────
//   const handleToggle = async (a: Announcement) => {
//     try {
//       await apiFetch(`/api/admin/announcements/${a.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !a.isActive }),
//       });
//       setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, isActive: !a.isActive } : x));
//     } catch { showToast("Failed to update", false); }
//   };

//   // ── Resend emails ───────────────────────────────────────────────────────────
//   const handleResendEmail = async (a: Announcement) => {
//     try {
//       const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sendEmail: true }),
//       });
//       showToast(`Resent to ${res.emailResult?.sent ?? 0} recipients 📧`);
//       fetchAll();
//     } catch { showToast("Email send failed", false); }
//   };

//   // ── Delete ──────────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!toDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/announcements/${toDelete.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//       showToast("Deleted");
//       setIsDeleteOpen(false);
//       setToDelete(null);
//       fetchAll();
//     } catch { showToast("Failed to delete", false); }
//     setSubmitting(false);
//   };

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Announcements</h2>
//           <p className="text-sm text-gray-500 mt-1">Broadcast notices with email delivery to students, programs & teachers</p>
//         </div>
//         <GradientButton icon={Plus} onClick={openCreate}>New Announcement</GradientButton>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s) => (
//           <Card key={s.label} className="p-5">
//             <p className="text-3xl font-black text-[#1A1A2E]">{s.value}</p>
//             <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: s.color }}>{s.label}</p>
//           </Card>
//         ))}
//       </div>

//       {/* Filters */}
//       <Card className="p-4 bg-[#FFFDF7]">
//         <div className="flex flex-wrap gap-3">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
//             <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or message…"
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FF6B6B] transition-all shadow-sm" />
//           </div>
//           {[
//             { val: fAud, set: setFAud, placeholder: "All Audiences", opts: [["all","Everyone"],["students","All Students"],["teachers","Teachers Only"],["program","Program"],["level","Level"]] },
//             { val: fPri, set: setFPri, placeholder: "All Priorities", opts: [["urgent","🚨 Urgent"],["normal","🔔 Normal"],["info","ℹ️ Info"]] },
//             { val: fActive, set: setFActive, placeholder: "Any Status", opts: [["active","Active"],["inactive","Inactive"]] },
//           ].map(({ val, set, placeholder, opts }, i) => (
//             <select key={i} value={val} onChange={(e) => set(e.target.value)}
//               className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FF6B6B] shadow-sm cursor-pointer appearance-none min-w-[150px]">
//               <option value="">{placeholder}</option>
//               {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//             </select>
//           ))}
//           {(search || fAud || fPri || fActive) && (
//             <button onClick={() => { setSearch(""); setFAud(""); setFPri(""); setFActive(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
//               Clear
//             </button>
//           )}
//         </div>
//       </Card>

//       {/* List */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-64 text-[#FF6B6B]">
//           <Loader2 className="animate-spin mb-3" size={32} />
//           <p className="text-sm font-bold text-gray-500">Loading…</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <Card className="flex flex-col items-center justify-center py-20 text-center">
//           <Megaphone size={36} className="text-gray-200 mb-3" />
//           <p className="text-base font-bold text-[#1A1A2E]">No announcements</p>
//           <p className="text-sm text-gray-400 mt-1">Create one to get started.</p>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((a) => {
//             const cfg      = PRIORITY_CFG[a.priority];
//             const PriIcon  = cfg.Icon;
//             const expired  = a.expiresAt && new Date(a.expiresAt) < new Date();

//             return (
//               <Card key={a.id} className={`p-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] ${!a.isActive ? "opacity-55" : ""}`}>
//                 <div className="flex items-start gap-4">
//                   {/* Priority icon */}
//                   <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
//                     style={{ background: cfg.bg }}>
//                     <PriIcon size={18} style={{ color: cfg.color }} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-3 flex-wrap">
//                       <div className="flex-1 min-w-0">
//                         {/* Title + badges */}
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                           <h3 className="text-sm font-black text-[#1A1A2E]">{a.title}</h3>
//                           <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
//                             style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
//                             {cfg.label}
//                           </span>
//                           {!a.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400 border border-gray-200">Inactive</span>}
//                           {expired    && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-400 border border-red-100">Expired</span>}
//                           {a.emailSent && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-400 border border-purple-100 flex items-center gap-1"><Mail size={8}/> Emailed</span>}
//                           {a.fileUrl  && (
//                             <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
//                               className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-400 border border-blue-100 flex items-center gap-1 hover:bg-blue-100 transition-colors">
//                               {a.fileType === "image" ? <ImageIcon size={8}/> : <FileText size={8}/>}
//                               {a.fileName ?? "Attachment"}
//                             </a>
//                           )}
//                         </div>

//                         {/* Message */}
//                         <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{a.message}</p>

//                         {/* Meta */}
//                         <div className="flex flex-wrap items-center gap-3 mt-2">
//                           <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
//                             <Users size={11} />
//                             {a.audience === "program" && a.program ? `Program: ${a.program.name}`
//                               : a.audience === "level" && a.level   ? `Level: ${a.level.name}${a.program ? ` (${a.program.name})` : ""}`
//                               : AUDIENCE_LABEL[a.audience]}
//                           </span>
//                           {a.expiresAt && (
//                             <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
//                               <Calendar size={11} /> Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-300">
//                             {new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         {/* View */}
//                         <button onClick={() => { setViewing(a); setIsViewOpen(true); }} title="View"
//                           className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] transition-colors">
//                           <Eye size={15} />
//                         </button>
//                         {/* Resend email */}
//                         <button onClick={() => handleResendEmail(a)} title="Resend Email"
//                           className="p-2 rounded-xl bg-purple-50 text-purple-400 hover:bg-purple-100 transition-colors">
//                           <Send size={15} />
//                         </button>
//                         {/* Toggle */}
//                         <button onClick={() => handleToggle(a)} title={a.isActive ? "Deactivate" : "Activate"}
//                           className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
//                           {a.isActive
//                             ? <ToggleRight size={20} className="text-[#4ECDC4]" />
//                             : <ToggleLeft  size={20} className="text-gray-300" />}
//                         </button>
//                         {/* Edit */}
//                         <button onClick={() => openEdit(a)} title="Edit"
//                           className="p-2 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors">
//                           <Edit size={15} />
//                         </button>
//                         {/* Delete */}
//                         <button onClick={() => { setToDelete(a); setIsDeleteOpen(true); }} title="Delete"
//                           className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors">
//                           <Trash2 size={15} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
//       <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? "Edit Announcement" : "New Announcement"} wide>
//         <form onSubmit={handleSave} className="space-y-5">

//           {/* Email result banner */}
//           {emailResult && (
//             <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${emailResult.failed === 0 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
//               {emailResult.failed === 0
//                 ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
//                 : <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />}
//               <p className="text-sm font-bold text-gray-700">
//                 Emails sent to <strong>{emailResult.sent}</strong> recipients
//                 {emailResult.failed > 0 && <>, <span className="text-red-500">{emailResult.failed} failed</span></>}.
//               </p>
//               <button type="button" onClick={() => { setEmailResult(null); setIsFormOpen(false); }} className="ml-auto text-xs font-black text-gray-400 hover:text-gray-600">Done</button>
//             </div>
//           )}

//           {/* Title */}
//           <div>
//             <Label required>Title</Label>
//             <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
//               placeholder="e.g. Holiday Notice — Diwali Break" className={inputCls} />
//           </div>

//           {/* Message */}
//           <div>
//             <Label required>Message</Label>
//             <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
//               rows={5} placeholder="Write the full announcement here…"
//               className={inputCls + " resize-none"} />
//           </div>

//           {/* Priority + Audience */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <Label required>Priority</Label>
//               <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="info">ℹ️ Info</option>
//                 <option value="normal">🔔 Normal</option>
//                 <option value="urgent">🚨 Urgent</option>
//               </select>
//             </div>
//             <div>
//               <Label required>Audience</Label>
//               <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value, programId: "", levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="all">👥 Everyone</option>
//                 <option value="students">🎓 All Students</option>
//                 <option value="teachers">🧑‍🏫 Teachers Only</option>
//                 <option value="program">📚 Specific Program</option>
//                 <option value="level">🎯 Specific Level</option>
//               </select>
//             </div>
//           </div>

//           {/* Program dropdown */}
//           {(form.audience === "program" || form.audience === "level") && (
//             <div>
//               <Label>Program</Label>
//               <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="">Select program…</option>
//                 {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           )}

//           {/* Level dropdown */}
//           {form.audience === "level" && levels.length > 0 && (
//             <div>
//               <Label>Level</Label>
//               <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="">Select level…</option>
//                 {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//               </select>
//             </div>
//           )}

//           {/* Expiry date */}
//           <div>
//             <Label>Expiry Date (optional)</Label>
//             <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
//           </div>

//           {/* File attachment */}
//           <div>
//             <Label>Attachment (PDF or Image, max 10MB)</Label>
//             {form.fileUrl ? (
//               <div className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
//                   {form.fileType === "image" ? <ImageIcon size={16} className="text-blue-400" /> : <FileText size={16} className="text-blue-400" />}
//                 </div>
//                 <p className="flex-1 text-sm font-bold text-[#1A1A2E] truncate">{form.fileName}</p>
//                 <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mr-2">Preview</a>
//                 <button type="button" onClick={removeFile} className="p-1 text-gray-400 hover:text-[#FF6B6B] transition-colors"><X size={16} /></button>
//               </div>
//             ) : (
//               <div>
//                 <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
//                 <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
//                   className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-dashed border-[#F0EEF8] rounded-xl px-5 py-3 text-sm font-bold text-gray-500 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors disabled:opacity-60 w-full justify-center">
//                   {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
//                   {uploading ? "Uploading…" : "Click to attach PDF or Image"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Send email toggle */}
//           <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
//                 <Mail size={16} className="text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-black text-[#1A1A2E]">Send Email Notification</p>
//                 <p className="text-xs text-gray-400">Email will be sent to all matching recipients</p>
//               </div>
//             </div>
//             <button type="button" onClick={() => setForm({ ...form, sendEmail: !form.sendEmail })}
//               className="transition-colors">
//               {form.sendEmail
//                 ? <ToggleRight size={28} className="text-purple-500" />
//                 : <ToggleLeft  size={28} className="text-gray-300" />}
//             </button>
//           </div>

//           {/* Preview */}
//           {form.title && form.message && (
//             <div className="rounded-xl border-2 p-4 space-y-2"
//               style={{ borderColor: PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.color + "33",
//                        background:   PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.bg }}>
//               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Preview</p>
//               <p className="font-black text-[#1A1A2E] text-sm">{form.title}</p>
//               <p className="text-sm text-gray-500 leading-relaxed">{form.message}</p>
//             </div>
//           )}

//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsFormOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting || uploading} icon={submitting ? Loader2 : (editing ? Edit : Plus)}>
//               {submitting ? "Saving…" : editing ? "Update" : "Publish"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── View Modal ───────────────────────────────────────────────────────── */}
//       <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Announcement Details" wide>
//         {viewing && (() => {
//           const cfg = PRIORITY_CFG[viewing.priority];
//           return (
//             <div className="space-y-5">
//               <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `2px solid ${cfg.color}33` }}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <cfg.Icon size={16} style={{ color: cfg.color }} />
//                   <span className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
//                 </div>
//                 <h2 className="text-xl font-black text-[#1A1A2E] mb-2">{viewing.title}</h2>
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   ["Audience",  viewing.audience === "program" && viewing.program ? `Program: ${viewing.program.name}`
//                               : viewing.audience === "level" && viewing.level     ? `Level: ${viewing.level.name}`
//                               : AUDIENCE_LABEL[viewing.audience]],
//                   ["Status",    viewing.isActive ? "Active" : "Inactive"],
//                   ["Email Sent", viewing.emailSent ? "Yes" : "No"],
//                   ["Expires",   viewing.expiresAt ? new Date(viewing.expiresAt).toLocaleDateString("en-IN") : "Never"],
//                   ["Created",   new Date(viewing.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })],
//                 ].map(([l, v]) => (
//                   <div key={l} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3">
//                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
//                     <p className="text-sm font-bold text-[#1A1A2E]">{v}</p>
//                   </div>
//                 ))}
//               </div>
//               {viewing.fileUrl && (
//                 <div>
//                   <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Attachment</p>
//                   {viewing.fileType === "image" ? (
//                     <img src={viewing.fileUrl} alt={viewing.fileName ?? "attachment"} className="rounded-xl max-h-64 object-contain border border-[#F0EEF8] w-full" />
//                   ) : (
//                     <a href={viewing.fileUrl} target="_blank" rel="noopener noreferrer"
//                       className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl p-3 hover:border-blue-300 transition-colors">
//                       <FileText size={20} className="text-blue-400" />
//                       <span className="text-sm font-bold text-[#1A1A2E]">{viewing.fileName ?? "View PDF"}</span>
//                     </a>
//                   )}
//                 </div>
//               )}
//               <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={() => { setIsViewOpen(false); openEdit(viewing); }}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors text-sm font-bold">
//                   <Edit size={14} /> Edit
//                 </button>
//                 <GradientButton onClick={() => setIsViewOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           );
//         })()}
//       </Modal>

//       {/* ── Delete Modal ─────────────────────────────────────────────────────── */}
//       <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Announcement">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertTriangle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{toDelete?.title}"?</h4>
//             <p className="text-sm text-gray-500 mt-2">This cannot be undone. Any attached file will also be removed from storage.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteOpen(false)}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm z-[999] animate-in slide-in-from-bottom-5 shadow-xl flex items-center gap-2 ${toast.ok ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] shadow-[0_8px_24px_rgba(255,107,107,0.4)]" : "bg-red-500"}`}>
//           {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }





















// "use client";

// import React, {
//   useState, useEffect, useCallback, useMemo, useRef,
// } from "react";
// import {
//   Plus, Search, Trash2, X, Loader2, Edit,
//   Megaphone, AlertTriangle, Info, Bell,
//   Calendar, Users, ToggleLeft, ToggleRight,
//   Paperclip, FileText, Image as ImageIcon,
//   Send, Mail, CheckCircle, XCircle, Eye,
//   BellRing, CheckSquare, Square, Minus,
//   Filter, SlidersHorizontal, ChevronDown,
// } from "lucide-react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ── API helper ────────────────────────────────────────────────────────────────
// async function apiFetch(path: string, options?: RequestInit) {
//   const { data } = await supabase.auth.getSession();
//   const token = data.session?.access_token;
//   const res = await fetch(path, {
//     ...options,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       ...(options?.headers ?? {}),
//     },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// async function apiUpload(file: File, token: string) {
//   const fd = new FormData();
//   fd.append("file", file);
//   const res = await fetch("/api/admin/announcements/upload", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: fd,
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<{ fileUrl: string; storagePath: string; fileType: string; fileName: string }>;
// }

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Program { id: string; name: string; levels: { id: string; name: string }[] }
// interface Announcement {
//   id: string;
//   title: string;
//   message: string;
//   priority: "info" | "normal" | "urgent";
//   audience: "all" | "students" | "teachers" | "program" | "level";
//   programId: string | null;
//   levelId: string | null;
//   fileUrl: string | null;
//   fileType: string | null;
//   fileName: string | null;
//   expiresAt: string | null;
//   isActive: boolean;
//   emailSent: boolean;
//   emailSentCount?: number;
//   createdAt: string;
//   program?: { id: string; name: string } | null;
//   level?: { id: string; name: string } | null;
// }

// interface FormState {
//   title: string; message: string;
//   priority: string; audience: string;
//   programId: string; levelId: string;
//   expiresAt: string;
//   fileUrl: string; storagePath: string;
//   fileType: string; fileName: string;
// }

// // ── Constants ─────────────────────────────────────────────────────────────────
// const PRIORITY_CFG = {
//   info:   { label: "Info",   color: "#4ECDC4", bg: "#4ECDC418", Icon: Info          },
//   normal: { label: "Normal", color: "#FFB347", bg: "#FFB34718", Icon: Bell          },
//   urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FF6B6B18", Icon: AlertTriangle },
// };
// const AUDIENCE_LABEL: Record<string, string> = {
//   all: "Everyone", students: "All Students",
//   teachers: "Teachers Only", program: "Program", level: "Level",
// };
// const EMPTY_FORM: FormState = {
//   title: "", message: "", priority: "normal", audience: "all",
//   programId: "", levelId: "", expiresAt: "",
//   fileUrl: "", storagePath: "", fileType: "", fileName: "",
// };

// // ── Primitives ────────────────────────────────────────────────────────────────
// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? "hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5" : ""} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? "animate-spin" : ""} />}
//     {children}
//   </button>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? "max-w-3xl" : "max-w-2xl"} flex flex-col`}
//         style={{ maxHeight: "92vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"><X size={20} /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: "thin" }}>{children}</div>
//       </div>
//     </div>
//   );
// };

// const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
//   <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
//     {children} {required && <span className="text-[#FF6B6B]">*</span>}
//   </label>
// );

// const inputCls = "w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] transition-colors";

// // ── Action Modals ─────────────────────────────────────────────────────────────

// /** After creating/editing, offer Send Email + Send Notification as separate actions */
// function PostSaveActions({
//   announcement,
//   onSendEmail,
//   onSendNotification,
//   onClose,
//   emailResult,
//   notifResult,
//   sending,
// }: {
//   announcement: Announcement;
//   onSendEmail: () => void;
//   onSendNotification: () => void;
//   onClose: () => void;
//   emailResult: { sent: number; failed: number } | null;
//   notifResult: number | null;
//   sending: "email" | "notif" | null;
// }) {
//   return (
//     <div className="space-y-4">
//       <p className="text-sm text-gray-500">
//         Your announcement <strong className="text-[#1A1A2E]">"{announcement.title}"</strong> has been saved.
//         Choose what to do next:
//       </p>

//       {/* Email card */}
//       <div className={`rounded-2xl border-2 p-4 transition-all ${emailResult ? "border-green-200 bg-green-50" : "border-[#F0EEF8] bg-[#FFFDF7]"}`}>
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
//             <Mail size={18} className="text-purple-500" />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-black text-[#1A1A2E]">Send Email</p>
//             <p className="text-xs text-gray-400">
//               Email all matching recipients.
//               {announcement.audience === "students" || announcement.audience === "all"
//                 ? " Students will receive it at their parent's email."
//                 : ""}
//             </p>
//           </div>
//         </div>

//         {emailResult ? (
//           <div className="flex items-center gap-2 text-sm font-bold text-green-700">
//             <CheckCircle size={14} className="text-green-500" />
//             Sent to {emailResult.sent} recipients
//             {emailResult.failed > 0 && <span className="text-red-500 ml-1">({emailResult.failed} failed)</span>}
//           </div>
//         ) : (
//           <button
//             onClick={onSendEmail}
//             disabled={sending === "email"}
//             className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
//           >
//             {sending === "email" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
//             {sending === "email" ? "Sending…" : "Send Email Now"}
//           </button>
//         )}
//       </div>

//       {/* Notification card */}
//       <div className={`rounded-2xl border-2 p-4 transition-all ${notifResult !== null ? "border-teal-200 bg-teal-50" : "border-[#F0EEF8] bg-[#FFFDF7]"}`}>
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
//             <BellRing size={18} className="text-teal-500" />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-black text-[#1A1A2E]">Push In-App Notification</p>
//             <p className="text-xs text-gray-400">Shows as a notification bell alert inside the platform.</p>
//           </div>
//         </div>

//         {notifResult !== null ? (
//           <div className="flex items-center gap-2 text-sm font-bold text-teal-700">
//             <CheckCircle size={14} className="text-teal-500" />
//             Notification pushed to {notifResult} users
//           </div>
//         ) : (
//           <button
//             onClick={onSendNotification}
//             disabled={sending === "notif"}
//             className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
//           >
//             {sending === "notif" ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
//             {sending === "notif" ? "Pushing…" : "Push Notification"}
//           </button>
//         )}
//       </div>

//       <div className="flex justify-end pt-2 border-t border-[#F0EEF8]">
//         <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
//           Done
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// export default function AnnouncementsView() {
//   const [items,      setItems]      = useState<Announcement[]>([]);
//   const [programs,   setPrograms]   = useState<Program[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploading,  setUploading]  = useState(false);
//   const [sending,    setSending]    = useState<"email" | "notif" | null>(null);
//   const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

//   const [isFormOpen,     setIsFormOpen]     = useState(false);
//   const [isDeleteOpen,   setIsDeleteOpen]   = useState(false);
//   const [isBulkDelOpen,  setIsBulkDelOpen]  = useState(false);
//   const [isViewOpen,     setIsViewOpen]     = useState(false);
//   const [isPostSaveOpen, setIsPostSaveOpen] = useState(false);

//   const [editing,      setEditing]      = useState<Announcement | null>(null);
//   const [toDelete,     setToDelete]     = useState<Announcement | null>(null);
//   const [viewing,      setViewing]      = useState<Announcement | null>(null);
//   const [savedAnn,     setSavedAnn]     = useState<Announcement | null>(null);  // for post-save modal
//   const [form,         setForm]         = useState<FormState>(EMPTY_FORM);

//   const [emailResult,  setEmailResult]  = useState<{ sent: number; failed: number } | null>(null);
//   const [notifResult,  setNotifResult]  = useState<number | null>(null);

//   // ── Bulk select ──────────────────────────────────────────────────────────────
//   const [selected,   setSelected]   = useState<Set<string>>(new Set());
//   const [bulkMode,   setBulkMode]   = useState(false);

//   // ── Filters ──────────────────────────────────────────────────────────────────
//   const [search,    setSearch]    = useState("");
//   const [fAud,      setFAud]      = useState("");
//   const [fPri,      setFPri]      = useState("");
//   const [fActive,   setFActive]   = useState("");
//   const [fEmail,    setFEmail]    = useState("");        // "sent" | "not_sent"
//   const [fExpired,  setFExpired]  = useState("");        // "expired" | "valid"
//   const [showFilters, setShowFilters] = useState(false);

//   const fileRef = useRef<HTMLInputElement>(null);

//   const showToast = (msg: string, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── Fetch ───────────────────────────────────────────────────────────────────
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [ann, prog] = await Promise.all([
//         apiFetch("/api/admin/announcements"),
//         apiFetch("/api/admin/programs"),
//       ]);
//       setItems(ann ?? []);
//       setPrograms(prog.programs ?? []);
//     } catch { showToast("Failed to load data", false); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchAll(); }, [fetchAll]);

//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const selectedProgram = programs.find((p) => p.id === form.programId);
//   const levels = selectedProgram?.levels ?? [];

//   const activeFiltersCount = [fAud, fPri, fActive, fEmail, fExpired].filter(Boolean).length;

//   const filtered = useMemo(() => {
//     const now = new Date();
//     return items.filter((a) => {
//       const q = search.toLowerCase();
//       const matchQ       = !q || a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
//       const matchAud     = !fAud  || a.audience  === fAud;
//       const matchPri     = !fPri  || a.priority  === fPri;
//       const matchAct     = !fActive || (fActive === "active" ? a.isActive : !a.isActive);
//       const matchEmail   = !fEmail  || (fEmail === "sent" ? a.emailSent : !a.emailSent);
//       const isExpired    = !!(a.expiresAt && new Date(a.expiresAt) < now);
//       const matchExpired = !fExpired || (fExpired === "expired" ? isExpired : !isExpired);
//       return matchQ && matchAud && matchPri && matchAct && matchEmail && matchExpired;
//     });
//   }, [items, search, fAud, fPri, fActive, fEmail, fExpired]);

//   const stats = [
//     { label: "Total",    value: items.length,                                      color: "#FFB347" },
//     { label: "Active",   value: items.filter((a) => a.isActive).length,            color: "#4ECDC4" },
//     { label: "Urgent",   value: items.filter((a) => a.priority === "urgent").length, color: "#FF6B6B" },
//     { label: "Emailed",  value: items.filter((a) => a.emailSent).length,           color: "#A78BFA" },
//   ];

//   // ── Checkbox helpers ─────────────────────────────────────────────────────────
//   const toggleSelect = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };
//   const selectAll = () => {
//     if (selected.size === filtered.length) setSelected(new Set());
//     else setSelected(new Set(filtered.map((a) => a.id)));
//   };
//   const exitBulk = () => { setBulkMode(false); setSelected(new Set()); };

//   // ── Open modals ──────────────────────────────────────────────────────────────
//   const openCreate = () => {
//     setEditing(null);
//     setForm(EMPTY_FORM);
//     setIsFormOpen(true);
//   };

//   const openEdit = (a: Announcement) => {
//     setEditing(a);
//     setForm({
//       title:       a.title,
//       message:     a.message,
//       priority:    a.priority,
//       audience:    a.audience,
//       programId:   a.programId   ?? "",
//       levelId:     a.levelId     ?? "",
//       expiresAt:   a.expiresAt   ? a.expiresAt.slice(0, 10) : "",
//       fileUrl:     a.fileUrl     ?? "",
//       storagePath: "",
//       fileType:    a.fileType    ?? "",
//       fileName:    a.fileName    ?? "",
//     });
//     setIsFormOpen(true);
//   };

//   // ── File upload ─────────────────────────────────────────────────────────────
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const { data } = await supabase.auth.getSession();
//       const token = data.session?.access_token ?? "";
//       const res = await apiUpload(file, token);
//       setForm((prev) => ({ ...prev, fileUrl: res.fileUrl, storagePath: res.storagePath, fileType: res.fileType, fileName: res.fileName }));
//       showToast("File uploaded ✅");
//     } catch (err: any) {
//       showToast("Upload failed: " + err.message, false);
//     }
//     setUploading(false);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const removeFile = () => setForm((prev) => ({ ...prev, fileUrl: "", storagePath: "", fileType: "", fileName: "" }));

//   // ── Save (no email/notif — done via PostSave) ────────────────────────────────
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.title.trim() || !form.message.trim()) { showToast("Title and message required", false); return; }
//     setSubmitting(true);
//     try {
//       const payload = {
//         title:       form.title.trim(),
//         message:     form.message.trim(),
//         priority:    form.priority,
//         audience:    form.audience,
//         programId:   ["program","level"].includes(form.audience) ? (form.programId || null) : null,
//         levelId:     form.audience === "level" ? (form.levelId || null) : null,
//         fileUrl:     form.fileUrl     || null,
//         storagePath: form.storagePath || null,
//         fileType:    form.fileType    || null,
//         fileName:    form.fileName    || null,
//         expiresAt:   form.expiresAt   || null,
//         sendEmail:   false,         // handled separately
//         sendNotification: false,    // handled separately
//       };

//       const res: Announcement = editing
//         ? await apiFetch(`/api/admin/announcements/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
//         : await apiFetch("/api/admin/announcements",               { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

//       setSavedAnn(res);
//       setEmailResult(null);
//       setNotifResult(null);
//       setIsFormOpen(false);
//       setIsPostSaveOpen(true);
//       fetchAll();
//     } catch (err: any) {
//       let msg = err.message;
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg, false);
//     }
//     setSubmitting(false);
//   };

//   // ── Post-save: send email ────────────────────────────────────────────────────
//   const handlePostSendEmail = async () => {
//     if (!savedAnn) return;
//     setSending("email");
//     try {
//       const res = await apiFetch(`/api/admin/announcements/${savedAnn.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sendEmail: true }),
//       });
//       setEmailResult(res.emailResult ?? { sent: 0, failed: 0 });
//       showToast(`Sent to ${res.emailResult?.sent ?? 0} recipients 📧`);
//       fetchAll();
//     } catch { showToast("Email send failed", false); }
//     setSending(null);
//   };

//   // ── Post-save: push notification ─────────────────────────────────────────────
//   const handlePostSendNotif = async () => {
//     if (!savedAnn) return;
//     setSending("notif");
//     try {
//       const res = await apiFetch(`/api/admin/announcements/${savedAnn.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sendNotification: true }),
//       });
//       setNotifResult(res.notifCount ?? 0);
//       showToast(`Notification pushed to ${res.notifCount ?? 0} users 🔔`);
//     } catch { showToast("Notification failed", false); }
//     setSending(null);
//   };

//   // ── Toggle active ───────────────────────────────────────────────────────────
//   const handleToggle = async (a: Announcement) => {
//     try {
//       await apiFetch(`/api/admin/announcements/${a.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive: !a.isActive }),
//       });
//       setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, isActive: !a.isActive } : x));
//     } catch { showToast("Failed to update", false); }
//   };

//   // ── Resend email (from list row) ─────────────────────────────────────────────
//   const handleResendEmail = async (a: Announcement) => {
//     try {
//       const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sendEmail: true }),
//       });
//       showToast(`Resent to ${res.emailResult?.sent ?? 0} recipients 📧`);
//       fetchAll();
//     } catch { showToast("Email send failed", false); }
//   };

//   // ── Resend notification (from list row) ──────────────────────────────────────
//   const handleResendNotif = async (a: Announcement) => {
//     try {
//       const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sendNotification: true }),
//       });
//       showToast(`Notification re-pushed to ${res.notifCount ?? 0} users 🔔`);
//     } catch { showToast("Notification failed", false); }
//   };

//   // ── Single delete ────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!toDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/announcements/${toDelete.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//       showToast("Deleted");
//       setIsDeleteOpen(false);
//       setToDelete(null);
//       fetchAll();
//     } catch { showToast("Failed to delete", false); }
//     setSubmitting(false);
//   };

//   // ── Bulk delete ──────────────────────────────────────────────────────────────
//   const handleBulkDelete = async () => {
//     setSubmitting(true);
//     try {
//       await Promise.all(
//         [...selected].map((id) =>
//           apiFetch(`/api/admin/announcements/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } })
//         )
//       );
//       showToast(`Deleted ${selected.size} announcement${selected.size !== 1 ? "s" : ""}`);
//       setIsBulkDelOpen(false);
//       setSelected(new Set());
//       setBulkMode(false);
//       fetchAll();
//     } catch { showToast("Failed to delete some items", false); }
//     setSubmitting(false);
//   };

//   const clearFilters = () => { setSearch(""); setFAud(""); setFPri(""); setFActive(""); setFEmail(""); setFExpired(""); };
//   const hasFilters   = !!(search || fAud || fPri || fActive || fEmail || fExpired);

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Announcements</h2>
//           <p className="text-sm text-gray-500 mt-1">Broadcast notices with email delivery to students, programs & teachers</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {bulkMode ? (
//             <>
//               <button onClick={exitBulk} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//               <button
//                 disabled={selected.size === 0}
//                 onClick={() => setIsBulkDelOpen(true)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20 font-bold text-sm hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <Trash2 size={15} />
//                 Delete {selected.size > 0 ? `(${selected.size})` : "Selected"}
//               </button>
//             </>
//           ) : (
//             <>
//               <button onClick={() => setBulkMode(true)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-[#F0EEF8] hover:bg-gray-50 transition-colors flex items-center gap-2">
//                 <CheckSquare size={15} /> Select
//               </button>
//               <GradientButton icon={Plus} onClick={openCreate}>New Announcement</GradientButton>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s) => (
//           <Card key={s.label} className="p-5">
//             <p className="text-3xl font-black text-[#1A1A2E]">{s.value}</p>
//             <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: s.color }}>{s.label}</p>
//           </Card>
//         ))}
//       </div>

//       {/* Search + Filter bar */}
//       <Card className="p-4 bg-[#FFFDF7]">
//         <div className="flex flex-wrap gap-3">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[220px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
//             <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or message…"
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FF6B6B] transition-all shadow-sm" />
//             {search && (
//               <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
//                 <X size={14} />
//               </button>
//             )}
//           </div>

//           {/* Toggle filters */}
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${showFilters || activeFiltersCount > 0 ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30" : "bg-white border-[#F0EEF8] text-gray-600 hover:border-[#FF6B6B]/30"}`}
//           >
//             <SlidersHorizontal size={15} />
//             Filters
//             {activeFiltersCount > 0 && (
//               <span className="w-5 h-5 bg-[#FF6B6B] text-white rounded-full text-[10px] font-black flex items-center justify-center">
//                 {activeFiltersCount}
//               </span>
//             )}
//             <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
//           </button>

//           {hasFilters && (
//             <button onClick={clearFilters}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
//               Clear All
//             </button>
//           )}
//         </div>

//         {/* Expandable filter row */}
//         {showFilters && (
//           <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#F0EEF8]">
//             {[
//               { val: fAud,     set: setFAud,     placeholder: "All Audiences", opts: [["all","👥 Everyone"],["students","🎓 Students"],["teachers","🧑‍🏫 Teachers"],["program","📚 Program"],["level","🎯 Level"]] },
//               { val: fPri,     set: setFPri,     placeholder: "All Priorities",opts: [["urgent","🚨 Urgent"],["normal","🔔 Normal"],["info","ℹ️ Info"]] },
//               { val: fActive,  set: setFActive,  placeholder: "Any Status",    opts: [["active","✅ Active"],["inactive","⛔ Inactive"]] },
//               { val: fEmail,   set: setFEmail,   placeholder: "Email Status",  opts: [["sent","📧 Emailed"],["not_sent","📭 Not Emailed"]] },
//               { val: fExpired, set: setFExpired, placeholder: "Expiry",        opts: [["expired","⏰ Expired"],["valid","✅ Valid"]] },
//             ].map(({ val, set, placeholder, opts }, i) => (
//               <select key={i} value={val} onChange={(e) => set(e.target.value)}
//                 className={`bg-white border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-[#FF6B6B] shadow-sm cursor-pointer appearance-none min-w-[160px] transition-colors ${val ? "border-[#FF6B6B]/40 text-[#1A1A2E]" : "border-[#F0EEF8] text-gray-600"}`}>
//                 <option value="">{placeholder}</option>
//                 {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//               </select>
//             ))}
//           </div>
//         )}

//         {/* Active filter chips */}
//         {activeFiltersCount > 0 && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {fAud     && <FilterChip label={`Audience: ${AUDIENCE_LABEL[fAud] ?? fAud}`}     onRemove={() => setFAud("")} />}
//             {fPri     && <FilterChip label={`Priority: ${fPri}`}                              onRemove={() => setFPri("")} />}
//             {fActive  && <FilterChip label={`Status: ${fActive}`}                             onRemove={() => setFActive("")} />}
//             {fEmail   && <FilterChip label={`Email: ${fEmail === "sent" ? "Sent" : "Not sent"}`} onRemove={() => setFEmail("")} />}
//             {fExpired && <FilterChip label={`Expiry: ${fExpired}`}                            onRemove={() => setFExpired("")} />}
//           </div>
//         )}
//       </Card>

//       {/* Bulk select bar */}
//       {bulkMode && filtered.length > 0 && (
//         <div className="flex items-center gap-4 px-5 py-3 bg-[#1A1A2E] rounded-2xl text-white">
//           <button onClick={selectAll} className="flex items-center gap-2 text-sm font-bold hover:text-[#FFB347] transition-colors">
//             {selected.size === filtered.length
//               ? <Minus size={15} />
//               : <CheckSquare size={15} />}
//             {selected.size === filtered.length ? "Deselect All" : "Select All"}
//           </button>
//           <span className="text-sm text-gray-400 ml-1">
//             {selected.size} of {filtered.length} selected
//           </span>
//         </div>
//       )}

//       {/* Results count */}
//       {!loading && (
//         <div className="flex items-center justify-between px-1">
//           <p className="text-xs font-bold text-gray-400">
//             {filtered.length} result{filtered.length !== 1 ? "s" : ""}
//             {hasFilters ? " (filtered)" : ""}
//           </p>
//         </div>
//       )}

//       {/* List */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-64 text-[#FF6B6B]">
//           <Loader2 className="animate-spin mb-3" size={32} />
//           <p className="text-sm font-bold text-gray-500">Loading…</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <Card className="flex flex-col items-center justify-center py-20 text-center">
//           <Megaphone size={36} className="text-gray-200 mb-3" />
//           <p className="text-base font-bold text-[#1A1A2E]">
//             {hasFilters ? "No announcements match your filters" : "No announcements"}
//           </p>
//           <p className="text-sm text-gray-400 mt-1">
//             {hasFilters ? <button onClick={clearFilters} className="text-[#FF6B6B] hover:underline font-bold">Clear filters</button> : "Create one to get started."}
//           </p>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((a) => {
//             const cfg      = PRIORITY_CFG[a.priority];
//             const PriIcon  = cfg.Icon;
//             const expired  = a.expiresAt && new Date(a.expiresAt) < new Date();
//             const isSelected = selected.has(a.id);

//             return (
//               <Card key={a.id}
//                 className={`p-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] ${!a.isActive ? "opacity-55" : ""} ${isSelected ? "ring-2 ring-[#FF6B6B] ring-offset-1" : ""}`}>
//                 <div className="flex items-start gap-4">

//                   {/* Checkbox (bulk mode) or priority icon */}
//                   {bulkMode ? (
//                     <button onClick={() => toggleSelect(a.id)} className="w-11 h-11 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       {isSelected
//                         ? <CheckSquare size={22} className="text-[#FF6B6B]" />
//                         : <Square      size={22} className="text-gray-300" />}
//                     </button>
//                   ) : (
//                     <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
//                       style={{ background: cfg.bg }}>
//                       <PriIcon size={18} style={{ color: cfg.color }} />
//                     </div>
//                   )}

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-3 flex-wrap">
//                       <div className="flex-1 min-w-0">
//                         {/* Title + badges */}
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                           <h3 className="text-sm font-black text-[#1A1A2E]">{a.title}</h3>
//                           <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
//                             style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
//                             {cfg.label}
//                           </span>
//                           {!a.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400 border border-gray-200">Inactive</span>}
//                           {expired     && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-400 border border-red-100">Expired</span>}
//                           {a.emailSent && (
//                             <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-400 border border-purple-100 flex items-center gap-1">
//                               <Mail size={8}/>
//                               {a.emailSentCount !== undefined ? `Emailed (${a.emailSentCount})` : "Emailed"}
//                             </span>
//                           )}
//                           {a.fileUrl && (
//                             <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
//                               className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-400 border border-blue-100 flex items-center gap-1 hover:bg-blue-100 transition-colors">
//                               {a.fileType === "image" ? <ImageIcon size={8}/> : <FileText size={8}/>}
//                               {a.fileName ?? "Attachment"}
//                             </a>
//                           )}
//                         </div>

//                         {/* Message */}
//                         <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{a.message}</p>

//                         {/* Meta */}
//                         <div className="flex flex-wrap items-center gap-3 mt-2">
//                           <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
//                             <Users size={11} />
//                             {a.audience === "program" && a.program ? `Program: ${a.program.name}`
//                               : a.audience === "level" && a.level   ? `Level: ${a.level.name}${a.program ? ` (${a.program.name})` : ""}`
//                               : AUDIENCE_LABEL[a.audience]}
//                           </span>
//                           {a.expiresAt && (
//                             <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
//                               <Calendar size={11} /> Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-300">
//                             {new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Actions (hidden in bulk mode) */}
//                       {!bulkMode && (
//                         <div className="flex items-center gap-1.5 flex-shrink-0">
//                           {/* View */}
//                           <button onClick={() => { setViewing(a); setIsViewOpen(true); }} title="View"
//                             className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] transition-colors">
//                             <Eye size={15} />
//                           </button>
//                           {/* Send email */}
//                           <button onClick={() => handleResendEmail(a)} title="Send/Resend Email"
//                             className="p-2 rounded-xl bg-purple-50 text-purple-400 hover:bg-purple-100 transition-colors">
//                             <Mail size={15} />
//                           </button>
//                           {/* Push notification */}
//                           <button onClick={() => handleResendNotif(a)} title="Push Notification"
//                             className="p-2 rounded-xl bg-teal-50 text-teal-400 hover:bg-teal-100 transition-colors">
//                             <BellRing size={15} />
//                           </button>
//                           {/* Toggle active */}
//                           <button onClick={() => handleToggle(a)} title={a.isActive ? "Deactivate" : "Activate"}
//                             className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
//                             {a.isActive
//                               ? <ToggleRight size={20} className="text-[#4ECDC4]" />
//                               : <ToggleLeft  size={20} className="text-gray-300" />}
//                           </button>
//                           {/* Edit */}
//                           <button onClick={() => openEdit(a)} title="Edit"
//                             className="p-2 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors">
//                             <Edit size={15} />
//                           </button>
//                           {/* Delete */}
//                           <button onClick={() => { setToDelete(a); setIsDeleteOpen(true); }} title="Delete"
//                             className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors">
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
//       <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? "Edit Announcement" : "New Announcement"} wide>
//         <form onSubmit={handleSave} className="space-y-5">

//           {/* Title */}
//           <div>
//             <Label required>Title</Label>
//             <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
//               placeholder="e.g. Holiday Notice — Diwali Break" className={inputCls} />
//           </div>

//           {/* Message */}
//           <div>
//             <Label required>Message</Label>
//             <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
//               rows={5} placeholder="Write the full announcement here…"
//               className={inputCls + " resize-none"} />
//           </div>

//           {/* Priority + Audience */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <Label required>Priority</Label>
//               <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="info">ℹ️ Info</option>
//                 <option value="normal">🔔 Normal</option>
//                 <option value="urgent">🚨 Urgent</option>
//               </select>
//             </div>
//             <div>
//               <Label required>Audience</Label>
//               <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value, programId: "", levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="all">👥 Everyone</option>
//                 <option value="students">🎓 All Students</option>
//                 <option value="teachers">🧑‍🏫 Teachers Only</option>
//                 <option value="program">📚 Specific Program</option>
//                 <option value="level">🎯 Specific Level</option>
//               </select>
//             </div>
//           </div>

//           {/* Program dropdown */}
//           {(form.audience === "program" || form.audience === "level") && (
//             <div>
//               <Label>Program</Label>
//               <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="">Select program…</option>
//                 {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           )}

//           {/* Level dropdown */}
//           {form.audience === "level" && levels.length > 0 && (
//             <div>
//               <Label>Level</Label>
//               <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
//                 <option value="">Select level…</option>
//                 {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//               </select>
//             </div>
//           )}

//           {/* Expiry date */}
//           <div>
//             <Label>Expiry Date (optional)</Label>
//             <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
//           </div>

//           {/* File attachment */}
//           <div>
//             <Label>Attachment (PDF or Image, max 10MB)</Label>
//             {form.fileUrl ? (
//               <div className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
//                   {form.fileType === "image" ? <ImageIcon size={16} className="text-blue-400" /> : <FileText size={16} className="text-blue-400" />}
//                 </div>
//                 <p className="flex-1 text-sm font-bold text-[#1A1A2E] truncate">{form.fileName}</p>
//                 <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mr-2">Preview</a>
//                 <button type="button" onClick={removeFile} className="p-1 text-gray-400 hover:text-[#FF6B6B] transition-colors"><X size={16} /></button>
//               </div>
//             ) : (
//               <div>
//                 <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
//                 <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
//                   className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-dashed border-[#F0EEF8] rounded-xl px-5 py-3 text-sm font-bold text-gray-500 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors disabled:opacity-60 w-full justify-center">
//                   {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
//                   {uploading ? "Uploading…" : "Click to attach PDF or Image"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Email + Notif info note */}
//           <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
//             <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
//             <p className="text-xs text-blue-600 font-bold leading-relaxed">
//               After saving, you can choose to send an email and/or push an in-app notification separately.
//               {(form.audience === "students" || form.audience === "all") && (
//                 <> <br /><span className="text-blue-500">Students will receive emails at their parent's registered email address.</span></>
//               )}
//             </p>
//           </div>

//           {/* Preview */}
//           {form.title && form.message && (
//             <div className="rounded-xl border-2 p-4 space-y-2"
//               style={{ borderColor: PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.color + "33",
//                        background:   PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.bg }}>
//               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Preview</p>
//               <p className="font-black text-[#1A1A2E] text-sm">{form.title}</p>
//               <p className="text-sm text-gray-500 leading-relaxed">{form.message}</p>
//             </div>
//           )}

//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsFormOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting || uploading} icon={submitting ? Loader2 : (editing ? Edit : Plus)}>
//               {submitting ? "Saving…" : editing ? "Update" : "Publish"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── Post-Save: Send Email / Notification modal ──────────────────────── */}
//       <Modal isOpen={isPostSaveOpen} onClose={() => setIsPostSaveOpen(false)} title="Announcement Saved ✅">
//         {savedAnn && (
//           <PostSaveActions
//             announcement={savedAnn}
//             onSendEmail={handlePostSendEmail}
//             onSendNotification={handlePostSendNotif}
//             onClose={() => setIsPostSaveOpen(false)}
//             emailResult={emailResult}
//             notifResult={notifResult}
//             sending={sending}
//           />
//         )}
//       </Modal>

//       {/* ── View Modal ───────────────────────────────────────────────────────── */}
//       <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Announcement Details" wide>
//         {viewing && (() => {
//           const cfg = PRIORITY_CFG[viewing.priority];
//           return (
//             <div className="space-y-5">
//               <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `2px solid ${cfg.color}33` }}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <cfg.Icon size={16} style={{ color: cfg.color }} />
//                   <span className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
//                 </div>
//                 <h2 className="text-xl font-black text-[#1A1A2E] mb-2">{viewing.title}</h2>
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   ["Audience",   viewing.audience === "program" && viewing.program ? `Program: ${viewing.program.name}`
//                                : viewing.audience === "level"   && viewing.level   ? `Level: ${viewing.level.name}`
//                                : AUDIENCE_LABEL[viewing.audience]],
//                   ["Status",     viewing.isActive ? "Active" : "Inactive"],
//                   ["Email Sent", viewing.emailSent ? `Yes${viewing.emailSentCount ? ` (${viewing.emailSentCount} recipients)` : ""}` : "No"],
//                   ["Expires",    viewing.expiresAt ? new Date(viewing.expiresAt).toLocaleDateString("en-IN") : "Never"],
//                   ["Created",    new Date(viewing.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })],
//                 ].map(([l, v]) => (
//                   <div key={l} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3">
//                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
//                     <p className="text-sm font-bold text-[#1A1A2E]">{v}</p>
//                   </div>
//                 ))}
//               </div>
//               {viewing.fileUrl && (
//                 <div>
//                   <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Attachment</p>
//                   {viewing.fileType === "image" ? (
//                     <img src={viewing.fileUrl} alt={viewing.fileName ?? "attachment"} className="rounded-xl max-h-64 object-contain border border-[#F0EEF8] w-full" />
//                   ) : (
//                     <a href={viewing.fileUrl} target="_blank" rel="noopener noreferrer"
//                       className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl p-3 hover:border-blue-300 transition-colors">
//                       <FileText size={20} className="text-blue-400" />
//                       <span className="text-sm font-bold text-[#1A1A2E]">{viewing.fileName ?? "View PDF"}</span>
//                     </a>
//                   )}
//                 </div>
//               )}
//               <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={() => handleResendEmail(viewing)}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors text-sm font-bold">
//                   <Mail size={14} /> Resend Email
//                 </button>
//                 <button onClick={() => handleResendNotif(viewing)}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-500 hover:bg-teal-100 transition-colors text-sm font-bold">
//                   <BellRing size={14} /> Push Notification
//                 </button>
//                 <button onClick={() => { setIsViewOpen(false); openEdit(viewing); }}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors text-sm font-bold">
//                   <Edit size={14} /> Edit
//                 </button>
//                 <GradientButton onClick={() => setIsViewOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           );
//         })()}
//       </Modal>

//       {/* ── Delete Single Modal ───────────────────────────────────────────────── */}
//       <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Announcement">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertTriangle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{toDelete?.title}"?</h4>
//             <p className="text-sm text-gray-500 mt-2">This cannot be undone. Any attached file will also be removed from storage.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteOpen(false)}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* ── Bulk Delete Modal ─────────────────────────────────────────────────── */}
//       <Modal isOpen={isBulkDelOpen} onClose={() => setIsBulkDelOpen(false)} title="Delete Multiple Announcements">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <Trash2 size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Delete {selected.size} announcement{selected.size !== 1 ? "s" : ""}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This cannot be undone. All attached files will also be removed from storage.</p>
//           </div>
//           <div className="w-full bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3 max-h-36 overflow-y-auto text-left">
//             {[...selected].map((id) => {
//               const ann = items.find((a) => a.id === id);
//               return ann ? (
//                 <div key={id} className="flex items-center gap-2 py-1">
//                   <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_CFG[ann.priority].color }} />
//                   <p className="text-xs font-bold text-[#1A1A2E] truncate">{ann.title}</p>
//                 </div>
//               ) : null;
//             })}
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsBulkDelOpen(false)}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleBulkDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : `Delete ${selected.size} item${selected.size !== 1 ? "s" : ""}`}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm z-[999] animate-in slide-in-from-bottom-5 shadow-xl flex items-center gap-2 ${toast.ok ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] shadow-[0_8px_24px_rgba(255,107,107,0.4)]" : "bg-red-500"}`}>
//           {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Filter chip ───────────────────────────────────────────────────────────────
// function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
//   return (
//     <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full text-xs font-bold border border-[#FF6B6B]/20">
//       {label}
//       <button onClick={onRemove} className="hover:text-red-600 transition-colors"><X size={11} /></button>
//     </span>
//   );
// }


























"use client";

import React, {
  useState, useEffect, useCallback, useMemo, useRef,
} from "react";
import {
  Plus, Search, Trash2, X, Loader2, Edit,
  Megaphone, AlertTriangle, Info, Bell,
  Calendar, Users, ToggleLeft, ToggleRight,
  Paperclip, FileText, Image as ImageIcon,
  Send, Mail, CheckCircle, XCircle, Eye,
  BellRing, CheckSquare, Square, Minus,
  SlidersHorizontal, ChevronDown, BarChart2,
} from "lucide-react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ── API helper ────────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiUpload(file: File, token: string) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/announcements/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ fileUrl: string; storagePath: string; fileType: string; fileName: string }>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Program { id: string; name: string; levels: { id: string; name: string }[] }
interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "info" | "normal" | "urgent";
  audience: "all" | "students" | "teachers" | "program" | "level";
  programId: string | null;
  levelId: string | null;
  fileUrl: string | null;
  fileType: string | null;
  fileName: string | null;
  expiresAt: string | null;
  isActive: boolean;
  emailSent: boolean;
  emailSentCount?: number;
  createdAt: string;
  program?: { id: string; name: string } | null;
  level?: { id: string; name: string } | null;
}
interface EmailLog {
  id: string;
  email: string;
  userId: string;
  status: string;
  errorMsg?: string | null;
  sentAt?: string | null;
  createdAt: string;
}
interface LogStats { total: number; sent: number; failed: number }
interface FormState {
  title: string; message: string;
  priority: string; audience: string;
  programId: string; levelId: string;
  expiresAt: string;
  fileUrl: string; storagePath: string;
  fileType: string; fileName: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PRIORITY_CFG = {
  info:   { label: "Info",   color: "#4ECDC4", bg: "#4ECDC418", Icon: Info          },
  normal: { label: "Normal", color: "#FFB347", bg: "#FFB34718", Icon: Bell          },
  urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FF6B6B18", Icon: AlertTriangle },
};
const AUDIENCE_LABEL: Record<string, string> = {
  all: "Everyone", students: "All Students",
  teachers: "Teachers Only", program: "Program", level: "Level",
};
const EMPTY_FORM: FormState = {
  title: "", message: "", priority: "normal", audience: "all",
  programId: "", levelId: "", expiresAt: "",
  fileUrl: "", storagePath: "", fileType: "", fileName: "",
};

// ── Primitives ────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? "hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5" : ""} ${className}`}>
    {Icon && <Icon size={18} className={disabled ? "animate-spin" : ""} />}
    {children}
  </button>
);

const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? "max-w-3xl" : "max-w-2xl"} flex flex-col`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: "thin" }}>{children}</div>
      </div>
    </div>
  );
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
    {children} {required && <span className="text-[#FF6B6B]">*</span>}
  </label>
);

const inputCls = "w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] transition-colors";

// ── Email Report Modal ────────────────────────────────────────────────────────
function EmailReportModal({
  announcement, onClose,
}: { announcement: Announcement; onClose: () => void }) {
  const [logs,    setLogs]    = useState<EmailLog[]>([]);
  const [stats,   setStats]   = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"all" | "sent" | "failed">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/admin/announcements/${announcement.id}/logs`);
        setLogs(res.logs ?? []);
        setStats(res.stats ?? null);
      } catch {}
      setLoading(false);
    })();
  }, [announcement.id]);

  const filtered = logs.filter(l => filter === "all" || l.status === filter);

  return (
    <Modal isOpen onClose={onClose} title={`Email Report`} wide>
      <div className="space-y-4">

        {/* Announcement title */}
        <p className="text-sm text-gray-500 truncate">
          <span className="font-black text-[#1A1A2E]">{announcement.title}</span>
          {announcement.emailSentCount ? (
            <span className="ml-2 text-xs text-purple-500 font-bold">· Sent {announcement.emailSentCount} time{announcement.emailSentCount !== 1 ? "s" : ""}</span>
          ) : null}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FF6B6B]" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-[#1A1A2E]">{stats.total}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">Total</p>
                </div>
                <button
                  onClick={() => setFilter(f => f === "sent" ? "all" : "sent")}
                  className={`rounded-2xl p-4 text-center transition-all border ${filter === "sent" ? "bg-green-100 border-green-300 ring-2 ring-green-300" : "bg-green-50 border-green-100 hover:bg-green-100"}`}>
                  <p className="text-3xl font-black text-green-600">{stats.sent}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-500 mt-1">✓ Sent</p>
                </button>
                <button
                  onClick={() => setFilter(f => f === "failed" ? "all" : "failed")}
                  className={`rounded-2xl p-4 text-center transition-all border ${filter === "failed" ? "bg-red-100 border-red-300 ring-2 ring-red-300" : "bg-red-50 border-red-100 hover:bg-red-100"}`}>
                  <p className="text-3xl font-black text-red-500">{stats.failed}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400 mt-1">✗ Failed</p>
                </button>
              </div>
            )}

            {/* Progress bar */}
            {stats && stats.total > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>Delivery rate</span>
                  <span>{Math.round((stats.sent / stats.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                    style={{ width: `${(stats.sent / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 border-b border-[#F0EEF8] pb-3">
              {(["all", "sent", "failed"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${
                    filter === f
                      ? f === "failed" ? "bg-red-50 text-red-500" : f === "sent" ? "bg-green-50 text-green-600" : "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}>
                  {f === "all" ? "All" : f === "sent" ? "✓ Sent" : "✗ Failed"}
                  {stats && f !== "all" && (
                    <span className="ml-1.5 text-[10px] font-black">({stats[f]})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Log list */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                {logs.length === 0
                  ? "No emails have been sent for this announcement yet."
                  : `No ${filter} entries found.`}
              </div>
            ) : (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                {filtered.map(l => (
                  <div key={l.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      l.status === "sent"
                        ? "border-green-100 bg-green-50/40"
                        : "border-red-100 bg-red-50/40"
                    }`}>

                    {/* Status icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      l.status === "sent" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {l.status === "sent"
                        ? <CheckCircle size={15} className="text-green-600" />
                        : <XCircle     size={15} className="text-red-500" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-bold text-[#1A1A2E] truncate">{l.email}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                          l.status === "sent"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}>
                          {l.status}
                        </span>
                      </div>

                      {/* Error reason */}
                      {l.status === "failed" && l.errorMsg && (
                        <div className="mt-1.5 flex items-start gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                          <AlertTriangle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-600 break-words leading-relaxed">
                            <span className="font-bold">Reason: </span>{l.errorMsg}
                          </p>
                        </div>
                      )}

                      {/* Sent time */}
                      {l.sentAt && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          Sent {new Date(l.sentAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Failed summary callout */}
            {stats && stats.failed > 0 && filter !== "sent" && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-bold leading-relaxed">
                  {stats.failed} email{stats.failed !== 1 ? "s" : ""} failed to deliver.
                  Common causes: invalid email address, mailbox full, or domain rejection.
                  Consider fixing the recipient emails and resending.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

// ── Post Save Actions ─────────────────────────────────────────────────────────
function PostSaveActions({
  announcement, onSendEmail, onSendNotification, onClose,
  emailResult, notifResult, sending,
}: {
  announcement: Announcement;
  onSendEmail: () => void;
  onSendNotification: () => void;
  onClose: () => void;
  emailResult: { sent: number; failed: number } | null;
  notifResult: number | null;
  sending: "email" | "notif" | null;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Your announcement <strong className="text-[#1A1A2E]">"{announcement.title}"</strong> has been saved.
        Choose what to do next:
      </p>

      {/* Email card */}
      <div className={`rounded-2xl border-2 p-4 transition-all ${emailResult ? "border-green-200 bg-green-50" : "border-[#F0EEF8] bg-[#FFFDF7]"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[#1A1A2E]">Send Email</p>
            <p className="text-xs text-gray-400">
              Email all matching recipients.
              {(announcement.audience === "students" || announcement.audience === "all") &&
                " Students receive it at their parent's email."}
            </p>
          </div>
        </div>
        {emailResult ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-green-700">
              <CheckCircle size={14} className="text-green-500" />
              Sent to {emailResult.sent} recipients
              {emailResult.failed > 0 && (
                <span className="text-red-500 ml-1">({emailResult.failed} failed — check Report)</span>
              )}
            </div>
          </div>
        ) : (
          <button onClick={onSendEmail} disabled={sending === "email"}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60">
            {sending === "email" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {sending === "email" ? "Sending…" : "Send Email Now"}
          </button>
        )}
      </div>

      {/* Notification card */}
      <div className={`rounded-2xl border-2 p-4 transition-all ${notifResult !== null ? "border-teal-200 bg-teal-50" : "border-[#F0EEF8] bg-[#FFFDF7]"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <BellRing size={18} className="text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[#1A1A2E]">Push In-App Notification</p>
            <p className="text-xs text-gray-400">Shows as a notification bell alert inside the platform.</p>
          </div>
        </div>
        {notifResult !== null ? (
          <div className="flex items-center gap-2 text-sm font-bold text-teal-700">
            <CheckCircle size={14} className="text-teal-500" />
            Notification pushed to {notifResult} users
          </div>
        ) : (
          <button onClick={onSendNotification} disabled={sending === "notif"}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60">
            {sending === "notif" ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
            {sending === "notif" ? "Pushing…" : "Push Notification"}
          </button>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-[#F0EEF8]">
        <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
          Done
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AnnouncementsView() {
  const [items,      setItems]      = useState<Announcement[]>([]);
  const [programs,   setPrograms]   = useState<Program[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [sending,    setSending]    = useState<"email" | "notif" | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

  const [isFormOpen,     setIsFormOpen]     = useState(false);
  const [isDeleteOpen,   setIsDeleteOpen]   = useState(false);
  const [isBulkDelOpen,  setIsBulkDelOpen]  = useState(false);
  const [isViewOpen,     setIsViewOpen]     = useState(false);
  const [isPostSaveOpen, setIsPostSaveOpen] = useState(false);
  const [isReportOpen,   setIsReportOpen]   = useState(false);

  const [editing,    setEditing]    = useState<Announcement | null>(null);
  const [toDelete,   setToDelete]   = useState<Announcement | null>(null);
  const [viewing,    setViewing]    = useState<Announcement | null>(null);
  const [savedAnn,   setSavedAnn]   = useState<Announcement | null>(null);
  const [reportAnn,  setReportAnn]  = useState<Announcement | null>(null);
  const [form,       setForm]       = useState<FormState>(EMPTY_FORM);

  const [emailResult, setEmailResult] = useState<{ sent: number; failed: number } | null>(null);
  const [notifResult, setNotifResult] = useState<number | null>(null);

  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [bulkMode,    setBulkMode]    = useState(false);

  const [search,      setSearch]      = useState("");
  const [fAud,        setFAud]        = useState("");
  const [fPri,        setFPri]        = useState("");
  const [fActive,     setFActive]     = useState("");
  const [fEmail,      setFEmail]      = useState("");
  const [fExpired,    setFExpired]    = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ann, prog] = await Promise.all([
        apiFetch("/api/admin/announcements"),
        apiFetch("/api/admin/programs"),
      ]);
      setItems(ann ?? []);
      setPrograms(prog.programs ?? []);
    } catch { showToast("Failed to load data", false); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const selectedProgram = programs.find((p) => p.id === form.programId);
  const levels = selectedProgram?.levels ?? [];
  const activeFiltersCount = [fAud, fPri, fActive, fEmail, fExpired].filter(Boolean).length;

  const filtered = useMemo(() => {
    const now = new Date();
    return items.filter((a) => {
      const q = search.toLowerCase();
      const matchQ       = !q || a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
      const matchAud     = !fAud    || a.audience === fAud;
      const matchPri     = !fPri    || a.priority === fPri;
      const matchAct     = !fActive || (fActive === "active" ? a.isActive : !a.isActive);
      const matchEmail   = !fEmail  || (fEmail === "sent" ? a.emailSent : !a.emailSent);
      const isExpired    = !!(a.expiresAt && new Date(a.expiresAt) < now);
      const matchExpired = !fExpired || (fExpired === "expired" ? isExpired : !isExpired);
      return matchQ && matchAud && matchPri && matchAct && matchEmail && matchExpired;
    });
  }, [items, search, fAud, fPri, fActive, fEmail, fExpired]);

  const stats = [
    { label: "Total",   value: items.length,                                         color: "#FFB347" },
    { label: "Active",  value: items.filter((a) => a.isActive).length,               color: "#4ECDC4" },
    { label: "Urgent",  value: items.filter((a) => a.priority === "urgent").length,  color: "#FF6B6B" },
    { label: "Emailed", value: items.filter((a) => a.emailSent).length,              color: "#A78BFA" },
  ];

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };
  const exitBulk = () => { setBulkMode(false); setSelected(new Set()); };

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setIsFormOpen(true); };
  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title, message: a.message, priority: a.priority, audience: a.audience,
      programId: a.programId ?? "", levelId: a.levelId ?? "",
      expiresAt: a.expiresAt ? a.expiresAt.slice(0, 10) : "",
      fileUrl: a.fileUrl ?? "", storagePath: "",
      fileType: a.fileType ?? "", fileName: a.fileName ?? "",
    });
    setIsFormOpen(true);
  };

  const openReport = (a: Announcement) => { setReportAnn(a); setIsReportOpen(true); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token ?? "";
      const res = await apiUpload(file, token);
      setForm(prev => ({ ...prev, fileUrl: res.fileUrl, storagePath: res.storagePath, fileType: res.fileType, fileName: res.fileName }));
      showToast("File uploaded ✅");
    } catch (err: any) { showToast("Upload failed: " + err.message, false); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };
  const removeFile = () => setForm(prev => ({ ...prev, fileUrl: "", storagePath: "", fileType: "", fileName: "" }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) { showToast("Title and message required", false); return; }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(), message: form.message.trim(),
        priority: form.priority, audience: form.audience,
        programId: ["program","level"].includes(form.audience) ? (form.programId || null) : null,
        levelId: form.audience === "level" ? (form.levelId || null) : null,
        fileUrl: form.fileUrl || null, storagePath: form.storagePath || null,
        fileType: form.fileType || null, fileName: form.fileName || null,
        expiresAt: form.expiresAt || null,
        sendEmail: false, sendNotification: false,
      };
      const res: Announcement = editing
        ? await apiFetch(`/api/admin/announcements/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await apiFetch("/api/admin/announcements",               { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSavedAnn(res); setEmailResult(null); setNotifResult(null);
      setIsFormOpen(false); setIsPostSaveOpen(true);
      fetchAll();
    } catch (err: any) {
      let msg = err.message;
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg, false);
    }
    setSubmitting(false);
  };

  const handlePostSendEmail = async () => {
    if (!savedAnn) return;
    setSending("email");
    try {
      const res = await apiFetch(`/api/admin/announcements/${savedAnn.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: true }),
      });
      setEmailResult(res.emailResult ?? { sent: 0, failed: 0 });
      showToast(`Sent to ${res.emailResult?.sent ?? 0} recipients 📧${res.emailResult?.failed > 0 ? ` · ${res.emailResult.failed} failed` : ""}`);
      fetchAll();
    } catch { showToast("Email send failed", false); }
    setSending(null);
  };

  const handlePostSendNotif = async () => {
    if (!savedAnn) return;
    setSending("notif");
    try {
      const res = await apiFetch(`/api/admin/announcements/${savedAnn.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendNotification: true }),
      });
      setNotifResult(res.notifCount ?? 0);
      showToast(`Notification pushed to ${res.notifCount ?? 0} users 🔔`);
    } catch { showToast("Notification failed", false); }
    setSending(null);
  };

  const handleToggle = async (a: Announcement) => {
    try {
      await apiFetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !a.isActive }),
      });
      setItems(prev => prev.map(x => x.id === a.id ? { ...x, isActive: !a.isActive } : x));
    } catch { showToast("Failed to update", false); }
  };

  const handleResendEmail = async (a: Announcement) => {
    try {
      const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: true }),
      });
      showToast(`Sent to ${res.emailResult?.sent ?? 0} recipients 📧${res.emailResult?.failed > 0 ? ` · ${res.emailResult.failed} failed` : ""}`);
      fetchAll();
    } catch { showToast("Email send failed", false); }
  };

  const handleResendNotif = async (a: Announcement) => {
    try {
      const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendNotification: true }),
      });
      showToast(`Notification pushed to ${res.notifCount ?? 0} users 🔔`);
    } catch { showToast("Notification failed", false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/announcements/${toDelete.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
      showToast("Deleted"); setIsDeleteOpen(false); setToDelete(null); fetchAll();
    } catch { showToast("Failed to delete", false); }
    setSubmitting(false);
  };

  const handleBulkDelete = async () => {
    setSubmitting(true);
    try {
      await Promise.all([...selected].map(id =>
        apiFetch(`/api/admin/announcements/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } })
      ));
      showToast(`Deleted ${selected.size} announcement${selected.size !== 1 ? "s" : ""}`);
      setIsBulkDelOpen(false); setSelected(new Set()); setBulkMode(false); fetchAll();
    } catch { showToast("Failed to delete some items", false); }
    setSubmitting(false);
  };

  const clearFilters = () => { setSearch(""); setFAud(""); setFPri(""); setFActive(""); setFEmail(""); setFExpired(""); };
  const hasFilters = !!(search || fAud || fPri || fActive || fEmail || fExpired);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">Broadcast notices with email delivery to students, programs & teachers</p>
        </div>
        <div className="flex items-center gap-3">
          {bulkMode ? (
            <>
              <button onClick={exitBulk} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
              <button disabled={selected.size === 0} onClick={() => setIsBulkDelOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20 font-bold text-sm hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Trash2 size={15} /> Delete {selected.size > 0 ? `(${selected.size})` : "Selected"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setBulkMode(true)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-[#F0EEF8] hover:bg-gray-50 transition-colors flex items-center gap-2">
                <CheckSquare size={15} /> Select
              </button>
              <GradientButton icon={Plus} onClick={openCreate}>New Announcement</GradientButton>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-3xl font-black text-[#1A1A2E]">{s.value}</p>
            <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: s.color }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search + Filter bar */}
      <Card className="p-4 bg-[#FFFDF7]">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or message…"
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FF6B6B] transition-all shadow-sm" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"><X size={14} /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${showFilters || activeFiltersCount > 0 ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30" : "bg-white border-[#F0EEF8] text-gray-600 hover:border-[#FF6B6B]/30"}`}>
            <SlidersHorizontal size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#FF6B6B] text-white rounded-full text-[10px] font-black flex items-center justify-center">{activeFiltersCount}</span>
            )}
            <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Clear All</button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#F0EEF8]">
            {[
              { val: fAud,     set: setFAud,     placeholder: "All Audiences", opts: [["all","👥 Everyone"],["students","🎓 Students"],["teachers","🧑‍🏫 Teachers"],["program","📚 Program"],["level","🎯 Level"]] },
              { val: fPri,     set: setFPri,     placeholder: "All Priorities",opts: [["urgent","🚨 Urgent"],["normal","🔔 Normal"],["info","ℹ️ Info"]] },
              { val: fActive,  set: setFActive,  placeholder: "Any Status",    opts: [["active","✅ Active"],["inactive","⛔ Inactive"]] },
              { val: fEmail,   set: setFEmail,   placeholder: "Email Status",  opts: [["sent","📧 Emailed"],["not_sent","📭 Not Emailed"]] },
              { val: fExpired, set: setFExpired, placeholder: "Expiry",        opts: [["expired","⏰ Expired"],["valid","✅ Valid"]] },
            ].map(({ val, set, placeholder, opts }, i) => (
              <select key={i} value={val} onChange={(e) => set(e.target.value)}
                className={`bg-white border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-[#FF6B6B] shadow-sm cursor-pointer appearance-none min-w-[160px] transition-colors ${val ? "border-[#FF6B6B]/40 text-[#1A1A2E]" : "border-[#F0EEF8] text-gray-600"}`}>
                <option value="">{placeholder}</option>
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
          </div>
        )}

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {fAud     && <FilterChip label={`Audience: ${AUDIENCE_LABEL[fAud] ?? fAud}`}          onRemove={() => setFAud("")} />}
            {fPri     && <FilterChip label={`Priority: ${fPri}`}                                   onRemove={() => setFPri("")} />}
            {fActive  && <FilterChip label={`Status: ${fActive}`}                                  onRemove={() => setFActive("")} />}
            {fEmail   && <FilterChip label={`Email: ${fEmail === "sent" ? "Sent" : "Not sent"}`}   onRemove={() => setFEmail("")} />}
            {fExpired && <FilterChip label={`Expiry: ${fExpired}`}                                 onRemove={() => setFExpired("")} />}
          </div>
        )}
      </Card>

      {/* Bulk select bar */}
      {bulkMode && filtered.length > 0 && (
        <div className="flex items-center gap-4 px-5 py-3 bg-[#1A1A2E] rounded-2xl text-white">
          <button onClick={selectAll} className="flex items-center gap-2 text-sm font-bold hover:text-[#FFB347] transition-colors">
            {selected.size === filtered.length ? <Minus size={15} /> : <CheckSquare size={15} />}
            {selected.size === filtered.length ? "Deselect All" : "Select All"}
          </button>
          <span className="text-sm text-gray-400 ml-1">{selected.size} of {filtered.length} selected</span>
        </div>
      )}

      {!loading && (
        <div className="px-1">
          <p className="text-xs font-bold text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}{hasFilters ? " (filtered)" : ""}
          </p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#FF6B6B]">
          <Loader2 className="animate-spin mb-3" size={32} />
          <p className="text-sm font-bold text-gray-500">Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <Megaphone size={36} className="text-gray-200 mb-3" />
          <p className="text-base font-bold text-[#1A1A2E]">{hasFilters ? "No announcements match your filters" : "No announcements"}</p>
          <p className="text-sm text-gray-400 mt-1">
            {hasFilters
              ? <button onClick={clearFilters} className="text-[#FF6B6B] hover:underline font-bold">Clear filters</button>
              : "Create one to get started."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const cfg = PRIORITY_CFG[a.priority];
            const PriIcon = cfg.Icon;
            const expired = a.expiresAt && new Date(a.expiresAt) < new Date();
            const isSelected = selected.has(a.id);

            return (
              <Card key={a.id}
                className={`p-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] ${!a.isActive ? "opacity-55" : ""} ${isSelected ? "ring-2 ring-[#FF6B6B] ring-offset-1" : ""}`}>
                <div className="flex items-start gap-4">
                  {bulkMode ? (
                    <button onClick={() => toggleSelect(a.id)} className="w-11 h-11 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {isSelected ? <CheckSquare size={22} className="text-[#FF6B6B]" /> : <Square size={22} className="text-gray-300" />}
                    </button>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                      <PriIcon size={18} style={{ color: cfg.color }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-sm font-black text-[#1A1A2E]">{a.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                            {cfg.label}
                          </span>
                          {!a.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400 border border-gray-200">Inactive</span>}
                          {expired     && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-400 border border-red-100">Expired</span>}
                          {a.emailSent && (
                            <button onClick={() => openReport(a)}
                              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-500 border border-purple-100 flex items-center gap-1 hover:bg-purple-100 transition-colors">
                              <Mail size={8} />
                              {a.emailSentCount ? `Emailed (${a.emailSentCount}×)` : "Emailed"}
                              <BarChart2 size={8} />
                            </button>
                          )}
                          {a.fileUrl && (
                            <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-400 border border-blue-100 flex items-center gap-1 hover:bg-blue-100 transition-colors">
                              {a.fileType === "image" ? <ImageIcon size={8}/> : <FileText size={8}/>}
                              {a.fileName ?? "Attachment"}
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{a.message}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Users size={11} />
                            {a.audience === "program" && a.program ? `Program: ${a.program.name}`
                              : a.audience === "level" && a.level ? `Level: ${a.level.name}${a.program ? ` (${a.program.name})` : ""}`
                              : AUDIENCE_LABEL[a.audience]}
                          </span>
                          {a.expiresAt && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                              <Calendar size={11} /> Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}
                            </span>
                          )}
                          <span className="text-xs text-gray-300">
                            {new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {!bulkMode && (
                        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                          <button onClick={() => { setViewing(a); setIsViewOpen(true); }} title="View"
                            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] transition-colors">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => handleResendEmail(a)} title="Send/Resend Email"
                            className="p-2 rounded-xl bg-purple-50 text-purple-400 hover:bg-purple-100 transition-colors">
                            <Mail size={15} />
                          </button>
                          {/* Report button — only when emails have been sent */}
                          {a.emailSent && (
                            <button onClick={() => openReport(a)} title="Email delivery report"
                              className="p-2 rounded-xl bg-green-50 text-green-500 hover:bg-green-100 transition-colors">
                              <BarChart2 size={15} />
                            </button>
                          )}
                          <button onClick={() => handleResendNotif(a)} title="Push Notification"
                            className="p-2 rounded-xl bg-teal-50 text-teal-400 hover:bg-teal-100 transition-colors">
                            <BellRing size={15} />
                          </button>
                          <button onClick={() => handleToggle(a)} title={a.isActive ? "Deactivate" : "Activate"}
                            className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                            {a.isActive ? <ToggleRight size={20} className="text-[#4ECDC4]" /> : <ToggleLeft size={20} className="text-gray-300" />}
                          </button>
                          <button onClick={() => openEdit(a)} title="Edit"
                            className="p-2 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => { setToDelete(a); setIsDeleteOpen(true); }} title="Delete"
                            className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? "Edit Announcement" : "New Announcement"} wide>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <Label required>Title</Label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Holiday Notice — Diwali Break" className={inputCls} />
          </div>
          <div>
            <Label required>Message</Label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5} placeholder="Write the full announcement here…" className={inputCls + " resize-none"} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Priority</Label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="info">ℹ️ Info</option>
                <option value="normal">🔔 Normal</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
            <div>
              <Label required>Audience</Label>
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value, programId: "", levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="all">👥 Everyone</option>
                <option value="students">🎓 All Students</option>
                <option value="teachers">🧑‍🏫 Teachers Only</option>
                <option value="program">📚 Specific Program</option>
                <option value="level">🎯 Specific Level</option>
              </select>
            </div>
          </div>
          {(form.audience === "program" || form.audience === "level") && (
            <div>
              <Label>Program</Label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select program…</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          {form.audience === "level" && levels.length > 0 && (
            <div>
              <Label>Level</Label>
              <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select level…</option>
                {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <Label>Expiry Date (optional)</Label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
          </div>
          <div>
            <Label>Attachment (PDF or Image, max 10MB)</Label>
            {form.fileUrl ? (
              <div className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
                  {form.fileType === "image" ? <ImageIcon size={16} className="text-blue-400" /> : <FileText size={16} className="text-blue-400" />}
                </div>
                <p className="flex-1 text-sm font-bold text-[#1A1A2E] truncate">{form.fileName}</p>
                <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mr-2">Preview</a>
                <button type="button" onClick={removeFile} className="p-1 text-gray-400 hover:text-[#FF6B6B] transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div>
                <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-dashed border-[#F0EEF8] rounded-xl px-5 py-3 text-sm font-bold text-gray-500 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors disabled:opacity-60 w-full justify-center">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
                  {uploading ? "Uploading…" : "Click to attach PDF or Image"}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600 font-bold leading-relaxed">
              After saving, you can choose to send an email and/or push an in-app notification separately.
              {(form.audience === "students" || form.audience === "all") && (
                <><br /><span className="text-blue-500">Students will receive emails at their parent's registered email address.</span></>
              )}
            </p>
          </div>
          {form.title && form.message && (
            <div className="rounded-xl border-2 p-4 space-y-2"
              style={{ borderColor: PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.color + "33", background: PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.bg }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Preview</p>
              <p className="font-black text-[#1A1A2E] text-sm">{form.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{form.message}</p>
            </div>
          )}
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting || uploading} icon={submitting ? Loader2 : (editing ? Edit : Plus)}>
              {submitting ? "Saving…" : editing ? "Update" : "Publish"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── Post-Save Modal ───────────────────────────────────────────────── */}
      <Modal isOpen={isPostSaveOpen} onClose={() => setIsPostSaveOpen(false)} title="Announcement Saved ✅">
        {savedAnn && (
          <PostSaveActions
            announcement={savedAnn}
            onSendEmail={handlePostSendEmail}
            onSendNotification={handlePostSendNotif}
            onClose={() => setIsPostSaveOpen(false)}
            emailResult={emailResult}
            notifResult={notifResult}
            sending={sending}
          />
        )}
      </Modal>

      {/* ── View Modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Announcement Details" wide>
        {viewing && (() => {
          const cfg = PRIORITY_CFG[viewing.priority];
          return (
            <div className="space-y-5">
              <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `2px solid ${cfg.color}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <cfg.Icon size={16} style={{ color: cfg.color }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
                <h2 className="text-xl font-black text-[#1A1A2E] mb-2">{viewing.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Audience", viewing.audience === "program" && viewing.program ? `Program: ${viewing.program.name}`
                             : viewing.audience === "level"   && viewing.level   ? `Level: ${viewing.level.name}`
                             : AUDIENCE_LABEL[viewing.audience]],
                  ["Status",     viewing.isActive ? "Active" : "Inactive"],
                  ["Email Sent", viewing.emailSent ? `Yes${viewing.emailSentCount ? ` (${viewing.emailSentCount}×)` : ""}` : "No"],
                  ["Expires",    viewing.expiresAt ? new Date(viewing.expiresAt).toLocaleDateString("en-IN") : "Never"],
                  ["Created",    new Date(viewing.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })],
                ].map(([l, v]) => (
                  <div key={l} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                    <p className="text-sm font-bold text-[#1A1A2E]">{v}</p>
                  </div>
                ))}
              </div>
              {viewing.fileUrl && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Attachment</p>
                  {viewing.fileType === "image" ? (
                    <img src={viewing.fileUrl} alt={viewing.fileName ?? "attachment"} className="rounded-xl max-h-64 object-contain border border-[#F0EEF8] w-full" />
                  ) : (
                    <a href={viewing.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl p-3 hover:border-blue-300 transition-colors">
                      <FileText size={20} className="text-blue-400" />
                      <span className="text-sm font-bold text-[#1A1A2E]">{viewing.fileName ?? "View PDF"}</span>
                    </a>
                  )}
                </div>
              )}
              <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
                {viewing.emailSent && (
                  <button onClick={() => { setIsViewOpen(false); openReport(viewing); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm font-bold">
                    <BarChart2 size={14} /> Email Report
                  </button>
                )}
                <button onClick={() => handleResendEmail(viewing)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors text-sm font-bold">
                  <Mail size={14} /> Resend Email
                </button>
                <button onClick={() => handleResendNotif(viewing)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-500 hover:bg-teal-100 transition-colors text-sm font-bold">
                  <BellRing size={14} /> Push Notification
                </button>
                <button onClick={() => { setIsViewOpen(false); openEdit(viewing); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors text-sm font-bold">
                  <Edit size={14} /> Edit
                </button>
                <GradientButton onClick={() => setIsViewOpen(false)}>Close</GradientButton>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Email Report Modal ────────────────────────────────────────────── */}
      {isReportOpen && reportAnn && (
        <EmailReportModal
          announcement={reportAnn}
          onClose={() => { setIsReportOpen(false); setReportAnn(null); }}
        />
      )}

      {/* ── Delete Single Modal ───────────────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Announcement">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{toDelete?.title}"?</h4>
            <p className="text-sm text-gray-500 mt-2">This cannot be undone. Any attached file will also be removed from storage.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Bulk Delete Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isBulkDelOpen} onClose={() => setIsBulkDelOpen(false)} title="Delete Multiple Announcements">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <Trash2 size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Delete {selected.size} announcement{selected.size !== 1 ? "s" : ""}?</h4>
            <p className="text-sm text-gray-500 mt-2">This cannot be undone. All attached files will also be removed from storage.</p>
          </div>
          <div className="w-full bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3 max-h-36 overflow-y-auto text-left">
            {[...selected].map(id => {
              const ann = items.find(a => a.id === id);
              return ann ? (
                <div key={id} className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_CFG[ann.priority].color }} />
                  <p className="text-xs font-bold text-[#1A1A2E] truncate">{ann.title}</p>
                </div>
              ) : null;
            })}
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsBulkDelOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleBulkDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : `Delete ${selected.size} item${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm z-[999] animate-in slide-in-from-bottom-5 shadow-xl flex items-center gap-2 ${toast.ok ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] shadow-[0_8px_24px_rgba(255,107,107,0.4)]" : "bg-red-500"}`}>
          {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full text-xs font-bold border border-[#FF6B6B]/20">
      {label}
      <button onClick={onRemove} className="hover:text-red-600 transition-colors"><X size={11} /></button>
    </span>
  );
}