





// // src\components\admin\modules\students\StudentsView.tsx
// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   ChevronDown, CheckCircle2, Clock, AlertOctagon,
// } from 'lucide-react';
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ["A", "B", "C", "D"];
// const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
// const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

// const SCHOOL_NAME    = "Ascento Playschool";
// const SCHOOL_TAGLINE = "Play School";
// const SCHOOL_WEBSITE = "https://ascentoabacus.com/";
// const SCHOOL_PHONE   = "+91 9810366417";
// const SCHOOL_ADDRESS = "Ascento Playschool, Dwarka, New Delhi";

// const FEE_TYPES   = ["Tuition", "Admission", "Activity", "Transport", "Exam", "Library", "Uniform", "Other"];
// const FEE_STATUSES = ["Pending", "Paid", "Partial", "Overdue", "Waived"] as const;
// type FeeStatus = typeof FEE_STATUSES[number];

// const CARD_W = 208;

// // ── API helper ─────────────────────────────────────────────────────────────────
// async function apiFetch(path: string, options?: RequestInit) {
//   const { data } = await supabase.auth.getSession();
//   const token = data.session?.access_token;
//   const res = await fetch(path, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...(options?.headers ?? {}),
//     },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
//   const { data: sessionData } = await supabase.auth.getSession();
//   if (!sessionData.session) throw new Error("Not authenticated");
//   const ext  = file.name.split(".").pop() ?? "jpg";
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, "_")}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage.from("student-assets").upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from("student-assets").getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(htmlContent: string) {
//   const win = window.open("", "_blank", "width=800,height=900");
//   if (!win) { alert("Please allow popups to download the PDF."); return; }
//   win.document.write(htmlContent);
//   win.document.close();
//   win.focus();
//   setTimeout(() => { win.print(); }, 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const reader    = new FileReader();
//       reader.onload  = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch { return ""; }
// }

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// interface StudentFee {
//   id:          string;
//   feeType:     string;
//   description: string | null;
//   amount:      number;
//   paidAmount:  number;
//   dueDate:     string | null;
//   paidDate:    string | null;
//   status:      FeeStatus;
//   month:       string | null;
//   academicYear:string | null;
//   receiptNo:   string | null;
//   remarks:     string | null;
//   createdAt:   string;
// }

// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button
//     type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
//   >
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col`}
//         style={{ maxHeight: "90vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select..." }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === "string"
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Photo Upload ───────────────────────────────────────────────────────────────
// function PhotoUpload({ value, onChange, label = "Passport Photo" }: {
//   value?: string; onChange: (url: string, file: File) => void; label?: string;
// }) {
//   const inputRef              = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//     onChange("pending", file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// // ── Program Selector ───────────────────────────────────────────────────────────
// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const selectedProgram = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {selectedProgram && selectedProgram.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {selectedProgram.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Student Form Fields ────────────────────────────────────────────────────────
// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
// }) {
//   const set = (key: string) => (v: string) => setForm((prev: any) => ({ ...prev, [key]: v }));

//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set("programLevelId", form.programLevelId);
//     if (form.section)        params.set("section",        form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((res) => {
//         const roll = res.formatted ?? String(res.nextRollNumber ?? "");
//         setForm((prev: any) => ({ ...prev, rollNumber: roll }));
//       }).catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl} label="Passport Photo"
//           onChange={(url, file) => { setPhotoFile(file); setForm((prev: any) => ({ ...prev, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ""} programLevelId={form.programLevelId ?? ""}
//             onProgramChange={(v) => setForm((prev: any) => ({ ...prev, programId: v, programLevelId: "", rollNumber: "" }))}
//             onLevelChange={(v) => setForm((prev: any) => ({ ...prev, programLevelId: v, rollNumber: "" }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((prev: any) => ({ ...prev, section: v, rollNumber: "" }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ""} onChange={(e) => set("rollNumber")(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set("admissionDate")} />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set("firstName")} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set("lastName")} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
//           <FormSelect label="Gender" options={["Male","Female","Other"]} value={form.gender} onChange={set("gender")} />
//           <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma"         required value={form.parentName}  onChange={set("parentName")} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"               value={form.parentPhone} onChange={set("parentPhone")} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set("city")} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set("state")} />
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
//       </div>
//     </div>
//   );
// }

// // ── Status Badge ───────────────────────────────────────────────────────────────
// function StatusBadge({ status, onClick, loading }: { status: string; onClick: () => void; loading?: boolean }) {
//   const isActive = status === "Active";
//   return (
//     <button onClick={onClick} disabled={loading} title={`Click to ${isActive ? "disable" : "activate"} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30"
//           : "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30"
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status ?? "Active"}
//     </button>
//   );
// }

// // ── Fee Status Badge ───────────────────────────────────────────────────────────
// const FEE_STATUS_CONFIG: Record<FeeStatus, { color: string; bg: string; border: string; icon: any }> = {
//   Paid:    { color: "#4ECDC4", bg: "#4ECDC4/10", border: "#4ECDC4/30", icon: CheckCircle2 },
//   Pending: { color: "#FFB347", bg: "#FFB347/10", border: "#FFB347/30", icon: Clock },
//   Partial: { color: "#A78BFA", bg: "#A78BFA/10", border: "#A78BFA/30", icon: TrendingUp },
//   Overdue: { color: "#FF6B6B", bg: "#FF6B6B/10", border: "#FF6B6B/30", icon: AlertOctagon },
//   Waived:  { color: "#6BCB77", bg: "#6BCB77/10", border: "#6BCB77/30", icon: CheckCircle2 },
// };

// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const cfg = FEE_STATUS_CONFIG[status] ?? FEE_STATUS_CONFIG.Pending;
//   const Icon = cfg.icon;
//   return (
//     <span style={{ color: cfg.color, background: cfg.color + "18", border: `1px solid ${cfg.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <Icon size={10} />
//       {status}
//     </span>
//   );
// }

// // ── Fee Form ───────────────────────────────────────────────────────────────────
// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: {
//   form: any; setForm: any; onSubmit: (e: React.FormEvent) => void;
//   submitting: boolean; onCancel: () => void; isEdit?: boolean;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types-list" value={form.feeType ?? ""} onChange={(e) => set("feeType")(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types-list">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set("status")} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set("amount")} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set("paidAmount")} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set("dueDate")} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set("paidDate")} />
//         <FormInput label="Month"        placeholder="June 2025"  value={form.month}        onChange={set("month")} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001" value={form.receiptNo} onChange={set("receiptNo")} />
//         <FormInput label="Description"  placeholder="Monthly tuition fee" value={form.description} onChange={set("description")} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ""} onChange={(e) => set("remarks")(e.target.value)} placeholder="Any additional notes..."
//           rows={2} className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? "Saving..." : isEdit ? "Update Fee" : "Add Fee"}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// // ── Fees Modal Content ─────────────────────────────────────────────────────────
// function FeesSection({ student, onClose }: { student: any; onClose: () => void }) {
//   const [fees,         setFees]         = useState<StudentFee[]>([]);
//   const [summary,      setSummary]      = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,      setLoading]      = useState(true);
//   const [view,         setView]         = useState<"list" | "add" | "edit">("list");
//   const [editingFee,   setEditingFee]   = useState<StudentFee | null>(null);
//   const [feeForm,      setFeeForm]      = useState<any>({});
//   const [submitting,   setSubmitting]   = useState(false);
//   const [deletingId,   setDeletingId]   = useState<string | null>(null);
//   const [toast,        setToast]        = useState<string | null>(null);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

//   const loadFees = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(res.fees ?? []);
//       setSummary(res.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { showToast("Failed to load fees"); }
//     setLoading(false);
//   }, [student.id]);

//   useEffect(() => { loadFees(); }, [loadFees]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { showToast("Fee type and amount are required"); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, {
//         method: "POST", body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || "Pending" }),
//       });
//       showToast("Fee record added"); setFeeForm({}); setView("list"); loadFees();
//     } catch (err: any) { showToast(err.message || "Failed to add fee"); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, {
//         method: "PATCH", body: JSON.stringify(feeForm),
//       });
//       showToast("Fee updated"); setView("list"); setEditingFee(null); loadFees();
//     } catch (err: any) { showToast(err.message || "Failed to update fee"); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: "DELETE" });
//       showToast("Fee deleted"); loadFees();
//     } catch { showToast("Failed to delete fee"); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType:     fee.feeType,
//       description: fee.description ?? "",
//       amount:      String(fee.amount),
//       paidAmount:  String(fee.paidAmount),
//       dueDate:     fee.dueDate  ? fee.dueDate.slice(0, 10)  : "",
//       paidDate:    fee.paidDate ? fee.paidDate.slice(0, 10) : "",
//       status:      fee.status,
//       month:       fee.month        ?? "",
//       academicYear:fee.academicYear ?? "",
//       receiptNo:   fee.receiptNo    ?? "",
//       remarks:     fee.remarks      ?? "",
//     });
//     setEditingFee(fee); setView("edit");
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

//   return (
//     <div className="space-y-5 relative">
//       {/* Student header */}
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: "Total Fees",  value: fmt(summary.totalAmount), color: "#1A1A2E",  icon: Receipt },
//           { label: "Amount Paid", value: fmt(summary.totalPaid),   color: "#4ECDC4",  icon: CheckCircle2 },
//           { label: "Balance Due", value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? "#FF6B6B" : "#4ECDC4", icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* View toggle */}
//       {view === "list" && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: "Pending", paidAmount: "0" }); setView("add"); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//               <p className="text-xs mt-1">Add the first fee entry for this student.</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const balance = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         {fee.description && <p className="text-xs text-gray-500 mb-2">{fee.description}</p>}
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${balance > 0 ? "text-[#FF6B6B]" : "text-[#4ECDC4]"}`}>{fmt(balance)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString("en-IN")}</span></div>}
//                         </div>
//                         {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)}
//                           className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors">
//                           <Pencil size={13} />
//                         </button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
//                           className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     {/* Progress bar */}
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                     <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
//                       {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       {view === "add" && (
//         <>
//           <div className="flex items-center gap-2 mb-1">
//             <button onClick={() => setView("list")} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back</button>
//             <span className="text-xs text-gray-300">/</span>
//             <span className="text-xs font-black text-[#1A1A2E]">Add New Fee</span>
//           </div>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting}
//             onCancel={() => { setView("list"); setFeeForm({}); }} />
//         </>
//       )}

//       {view === "edit" && editingFee && (
//         <>
//           <div className="flex items-center gap-2 mb-1">
//             <button onClick={() => { setView("list"); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back</button>
//             <span className="text-xs text-gray-300">/</span>
//             <span className="text-xs font-black text-[#1A1A2E]">Edit Fee — {editingFee.feeType}</span>
//           </div>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting}
//             onCancel={() => { setView("list"); setEditingFee(null); }} isEdit />
//         </>
//       )}

//       {toast && (
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(233,30,140,0.4)] z-10 whitespace-nowrap animate-in slide-in-from-bottom-3">
//           {toast}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);
//   const items = [
//     { icon: Pencil,       label: "Edit",             color: "#FFB347", action: onEdit },
//     { icon: KeyRound,     label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
//     { icon: IdCard,       label: "View ID Card",      color: "#A78BFA", action: onViewIdCard },
//     { icon: IndianRupee,  label: "Manage Fees",       color: "#e91e8c", action: onViewFees },
//     { icon: Eye,          label: "View Report",       color: "#64B6FF", action: onViewReport },
//     { icon: Download,     label: "Download Report",   color: "#6BCB77", action: onDownloadReport },
//     { icon: Trash2,       label: "Delete",            color: "#FF6B6B", action: onDelete },
//   ];
//   return (
//     <div ref={ref} className="relative">
//       <button onClick={() => setOpen(!open)}
//         className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[200px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label} onClick={() => { action(); setOpen(false); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── ID Card ────────────────────────────────────────────────────────────────────
// function IDCard({ student, logoUrl }: { student: any; logoUrl?: string }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" }) : "—";
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString("en-IN",   { day:"2-digit", month:"2-digit", year:"numeric" }) : "—";
//   const w = CARD_W;
//   return (
//     <div className="flex flex-col gap-4 items-center">
//       <div style={{ width: w }} className="flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
//         <div style={{ width: w, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial,sans-serif" }}>
//           <div style={{ background:"linear-gradient(135deg,#e91e8c 0%,#c2185b 100%)", padding:"8px 10px 6px", display:"flex", alignItems:"center", gap:6 }}>
//             {logoUrl ? <img src={logoUrl} alt="logo" style={{ width:29, height:29, borderRadius:5, objectFit:"contain", background:"#fff", padding:2, flexShrink:0 }} />
//               : <div style={{ width:29, height:29, background:"rgba(255,255,255,0.25)", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:900, color:"#fff" }}>A</div>}
//             <div>
//               <div style={{ color:"#fff", fontWeight:900, fontSize:11, lineHeight:1.2 }}>{SCHOOL_NAME}</div>
//               <div style={{ color:"rgba(255,255,255,0.7)", fontSize:6.5, marginTop:2 }}>Adm. No.: {student.studentId ?? "—"}</div>
//             </div>
//           </div>
//           <div style={{ background:"#fff", position:"relative", overflow:"hidden" }}>
//             <svg viewBox={`0 0 ${w} 14`} style={{ display:"block", width:"100%" }}>
//               <path d={`M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z`} fill="#e91e8c" opacity="0.15"/>
//             </svg>
//           </div>
//           <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 10px 8px" }}>
//             <div style={{ width:64, height:72, borderRadius:"50%", overflow:"hidden", border:"3px solid #e91e8c", background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//               {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//                 : <span style={{ fontSize:22, fontWeight:900, color:"#e91e8c" }}>{student.fullName?.[0]?.toUpperCase() ?? "?"}</span>}
//             </div>
//           </div>
//           <div style={{ padding:"0 11px 5px", fontSize:8 }}>
//             {[["Name",student.fullName??"-"],["D.O.B",dob],["Adm Date",admDate],["Mob.",student.parentPhone??"-"],["Class",student.programLevel?.name??student.program?.name??"-"],["P. Name",student.parentName??"-"]].map(([l,v])=>(
//               <div key={l} style={{ display:"flex", gap:3, marginBottom:3, alignItems:"flex-start" }}>
//                 <span style={{ fontWeight:700, color:"#333", width:44, flexShrink:0 }}>{l}</span>
//                 <span style={{ color:"#555", fontWeight:600 }}>: &nbsp;{v}</span>
//               </div>
//             ))}
//             {student.bloodGroup && <div style={{ display:"flex", alignItems:"center", gap:3, marginTop:2 }}><span style={{ fontWeight:700, color:"#333", width:44 }}>Blood</span><span style={{ color:"#e91e8c", fontWeight:900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//           </div>
//           <div style={{ padding:"3px 11px", display:"flex", justifyContent:"flex-end" }}>
//             <div style={{ textAlign:"center" }}><div style={{ borderBottom:"1px solid #aaa", width:48, marginBottom:2 }} /><div style={{ fontSize:6.5, color:"#777" }}>Auth. Sign.</div></div>
//           </div>
//           <svg viewBox={`0 0 ${w} 18`} style={{ display:"block", width:"100%", marginTop:2 }}>
//             <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#e91e8c"/>
//             <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity="0.6"/>
//           </svg>
//         </div>
//       </div>
//       <div style={{ width: w }} className="flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
//         <div style={{ width: w, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial,sans-serif" }}>
//           <svg viewBox={`0 0 ${w} 22`} style={{ display:"block", width:"100%" }}>
//             <path d={`M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z`} fill="#9c27b0" opacity="0.6"/>
//             <path d={`M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z`} fill="#e91e8c"/>
//           </svg>
//           <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 11px 6px", textAlign:"center" }}>
//             {logoUrl ? <img src={logoUrl} alt="logo" style={{ width:38, height:38, borderRadius:7, objectFit:"contain", marginBottom:5 }} />
//               : <div style={{ width:38, height:38, background:"linear-gradient(135deg,#e91e8c,#9c27b0)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:5, fontSize:16, fontWeight:900, color:"#fff" }}>A</div>}
//             <div style={{ fontWeight:900, fontSize:11, color:"#1a1a2e", lineHeight:1.2 }}>{SCHOOL_NAME}</div>
//           </div>
//           <div style={{ height:1, background:"#f0eef8", margin:"0 11px" }} />
//           <div style={{ padding:"6px 11px", textAlign:"center", fontSize:7.5, color:"#444", lineHeight:1.6 }}>
//             <div>{SCHOOL_ADDRESS}</div><div>{SCHOOL_WEBSITE}</div><div>Mob.: {SCHOOL_PHONE}</div>
//           </div>
//           <div style={{ height:1, background:"#f0eef8", margin:"0 11px" }} />
//           <div style={{ padding:"6px 11px 5px", textAlign:"center" }}>
//             <div style={{ fontWeight:900, fontSize:8.5, color:"#e91e8c", marginBottom:3 }}>Finder may please<br/>return to</div>
//             <div style={{ fontSize:7.5, color:"#444", lineHeight:1.6 }}>
//               {student.address ? <>{student.address}<br/></> : null}
//               {[student.city, student.state].filter(Boolean).join(", ") || "—"}<br/>
//               Mob.: {student.parentPhone ?? "—"}
//             </div>
//           </div>
//           <div style={{ display:"flex", justifyContent:"center", padding:"3px 11px 5px" }}>
//             <div style={{ background:"#4ecdc422", border:"1px solid #4ecdc444", borderRadius:20, padding:"2px 8px", display:"flex", alignItems:"center", gap:3 }}>
//               <div style={{ width:4, height:4, borderRadius:"50%", background:"#4ecdc4" }} />
//               <span style={{ fontSize:7, fontWeight:900, color:"#4ecdc4" }}>{student.status ?? "Active"}</span>
//             </div>
//           </div>
//           <svg viewBox={`0 0 ${w} 18`} style={{ display:"block", width:"100%", marginTop:3 }}>
//             <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#e91e8c"/>
//             <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity="0.6"/>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── buildIDCardHTML / buildReportHTML — unchanged, keep from original ──────────
// // (paste your existing buildIDCardHTML and buildReportHTML functions here)

// async function buildIDCardHTML(student: any, logoUrl?: string): Promise<string> {
//   let photoSrc = ""; if (student.photoUrl) { const b64 = await urlToBase64(student.photoUrl); if (b64) photoSrc = b64; }
//   let logoSrc  = ""; if (logoUrl)          { const b64 = await urlToBase64(logoUrl);           if (b64) logoSrc  = b64; }
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString("en-IN",  {day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
//   const w = CARD_W;
//   const logoImgFront = logoSrc ? `<img src="${logoSrc}" class="logo-img" />` : `<div class="logo-av">A</div>`;
//   const logoImgBack  = logoSrc ? `<img src="${logoSrc}" class="logo-back" />` : `<div class="logo-av-back">A</div>`;
//   const photoHtml    = photoSrc ? `<img src="${photoSrc}" class="photo" />` : `<div class="photo-av">${(student.fullName?.[0]??"?").toUpperCase()}</div>`;
//   const addrLine = [student.address, student.city, student.state].filter(Boolean).join(", ") || "—";
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card — ${student.fullName}</title><style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4 portrait;margin:15mm}body{font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:16px;padding:20px}.card{width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee;font-family:Arial,sans-serif;display:flex;flex-direction:column;flex-shrink:0}.header{background:linear-gradient(135deg,#e91e8c 0%,#c2185b 100%);padding:8px 10px 6px;display:flex;align-items:center;gap:6px;flex-shrink:0}.logo-img{width:29px;height:29px;border-radius:5px;object-fit:contain;background:#fff;padding:2px;flex-shrink:0}.logo-av{width:29px;height:29px;border-radius:5px;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;flex-shrink:0}.header-text .school{color:#fff;font-weight:900;font-size:11px;line-height:1.2}.header-text .adm{color:rgba(255,255,255,0.7);font-size:6.5px;margin-top:2px}.wave-top svg{display:block;width:100%}.photo-wrap{display:flex;flex-direction:column;align-items:center;padding:5px 10px 8px;flex-shrink:0}.photo{width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c}.photo-av{width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c}.info{padding:0 11px 5px;font-size:8px}.row{display:flex;gap:3px;margin-bottom:3px;align-items:flex-start}.lbl{font-weight:700;color:#333;width:44px;flex-shrink:0}.val{color:#555;font-weight:600}.blood{color:#e91e8c!important;font-weight:900!important}.sign{padding:3px 11px;display:flex;justify-content:flex-end}.sign-inner{text-align:center}.sign-line{border-bottom:1px solid #aaa;width:48px;margin-bottom:2px}.sign-label{font-size:6.5px;color:#777}.wave-bot svg{display:block;width:100%;margin-top:2px}.wave-top-back svg{display:block;width:100%}.back-logo{display:flex;flex-direction:column;align-items:center;padding:8px 11px 6px;text-align:center}.logo-back{width:38px;height:38px;border-radius:7px;object-fit:contain;margin-bottom:5px}.logo-av-back{width:38px;height:38px;border-radius:7px;background:linear-gradient(135deg,#e91e8c,#9c27b0);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;margin-bottom:5px}.back-school{font-weight:900;font-size:11px;color:#1a1a2e;line-height:1.2}.divider{height:1px;background:#f0eef8;margin:0 11px}.back-addr{padding:6px 11px;text-align:center;font-size:7.5px;color:#444;line-height:1.6}.finder{padding:6px 11px;text-align:center}.finder-title{font-weight:900;font-size:8.5px;color:#e91e8c;margin-bottom:3px;line-height:1.3}.finder-addr{font-size:7.5px;color:#444;line-height:1.6}.status-chip{display:flex;justify-content:center;padding:3px 0 5px}.chip{background:#4ecdc422;border:1px solid #4ecdc444;border-radius:20px;padding:2px 8px;display:flex;align-items:center;gap:3px}.dot{width:4px;height:4px;border-radius:50%;background:#4ecdc4}.chip-txt{font-size:7px;font-weight:900;color:#4ecdc4}.card-label{text-align:center;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:6px}.card-wrapper{display:flex;flex-direction:column;align-items:center}@media print{body{background:#fff;gap:16px;padding:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}</style></head><body>
//   <div class="card-wrapper"><div class="card-label">Front</div><div class="card"><div class="header">${logoImgFront}<div class="header-text"><div class="school">${SCHOOL_NAME}</div><div class="adm">Adm. No.: ${student.studentId??"—"}</div></div></div><div class="wave-top"><svg viewBox="0 0 ${w} 14"><path d="M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z" fill="#e91e8c" opacity="0.15"/></svg></div><div class="photo-wrap">${photoHtml}</div><div class="info"><div class="row"><span class="lbl">Name</span><span class="val">: &nbsp;${student.fullName??"—"}</span></div><div class="row"><span class="lbl">D.O.B</span><span class="val">: &nbsp;${dob}</span></div><div class="row"><span class="lbl">Adm Date</span><span class="val">: &nbsp;${admDate}</span></div><div class="row"><span class="lbl">Mob.</span><span class="val">: &nbsp;${student.parentPhone??"—"}</span></div><div class="row"><span class="lbl">Class</span><span class="val">: &nbsp;${student.programLevel?.name??student.program?.name??"—"}</span></div><div class="row"><span class="lbl">P. Name</span><span class="val">: &nbsp;${student.parentName??"—"}</span></div>${student.bloodGroup?`<div class="row"><span class="lbl">Blood</span><span class="val blood">: &nbsp;${student.bloodGroup}</span></div>`:""}</div><div class="sign"><div class="sign-inner"><div class="sign-line"></div><div class="sign-label">Auth. Sign.</div></div></div><div class="wave-bot"><svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity="0.6"/></svg></div></div></div>
//   <div class="card-wrapper"><div class="card-label">Back</div><div class="card"><div class="wave-top-back"><svg viewBox="0 0 ${w} 22"><path d="M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z" fill="#9c27b0" opacity="0.6"/><path d="M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z" fill="#e91e8c"/></svg></div><div class="back-logo">${logoImgBack}<div class="back-school">${SCHOOL_NAME}</div></div><div class="divider"></div><div class="back-addr">${SCHOOL_ADDRESS}<br/>${SCHOOL_WEBSITE}<br/>Mob.: ${SCHOOL_PHONE}</div><div class="divider"></div><div class="finder"><div class="finder-title">Finder may please<br/>return to</div><div class="finder-addr">${addrLine}<br/>Mob.: ${student.parentPhone??"—"}</div></div><div class="status-chip"><div class="chip"><div class="dot"></div><span class="chip-txt">${student.status??"Active"}</span></div></div><div class="wave-bot"><svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity="0.6"/></svg></div></div></div>
//   </body></html>`;
// }

// async function buildReportHTML(r: any): Promise<string> {
//   const addr      = [r.address, r.city, r.state].filter(Boolean).join(", ") || "—";
//   const enrolled  = r.enrolledAt    ? new Date(r.enrolledAt).toLocaleDateString("en-IN",    {year:"numeric",month:"long",day:"numeric"}) : "—";
//   const admDate   = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString("en-IN", {year:"numeric",month:"long",day:"numeric"}) : "—";
//   const generated = new Date().toLocaleDateString("en-IN", {year:"numeric",month:"long",day:"numeric"});
//   const fields: [string,string][] = [
//     ["Student ID",r.studentId],["Full Name",r.fullName],["Email",r.email??"—"],["Date of Birth",r.dateOfBirth??"—"],
//     ["Admission Date",admDate],["Gender",r.gender??"—"],["Blood Group",r.bloodGroup??"—"],["Program",r.program?.name??"—"],
//     ["Level / Class",r.level?.name??"—"],["Section",r.section?`Section ${r.section}`:"—"],["Roll Number",r.rollNumber??"—"],
//     ["Academic Year",r.academicYear??"—"],["Status",r.status??"—"],["Parent Name",r.parentName??"—"],
//     ["Parent Phone",r.parentPhone??"—"],["Parent Email",r.parentEmail??"—"],["Address",addr],["Enrolled At",enrolled],
//   ];
//   let photoHtml = "";
//   if (r.photoUrl) { const b64 = await urlToBase64(r.photoUrl); if (b64) photoHtml = `<img src="${b64}" alt="Student Photo" class="report-photo" />`; }
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report — ${r.fullName}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.hdr-left{flex:1}.school{font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px}h1{font-size:22px;font-weight:900;line-height:1.2}.sid{font-family:monospace;font-size:11px;opacity:.7;margin-top:3px}.badges{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.badge{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);padding:2px 10px;border-radius:20px;font-size:9px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.report-photo{width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,0.4);flex-shrink:0}.hdr-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}.date{font-size:9px;opacity:.65}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff;padding:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}</style></head><body>
//   <div class="hdr"><div class="hdr-left"><div class="school">${SCHOOL_NAME} · ${SCHOOL_TAGLINE}</div><h1>${r.fullName}</h1><div class="sid">${r.studentId}</div><div class="badges">${r.program?`<span class="badge">${r.program.name}</span>`:""} ${r.level?`<span class="badge">${r.level.name}</span>`:""} ${r.section?`<span class="badge">Sec ${r.section}</span>`:""}</div></div><div class="hdr-right">${photoHtml}<div class="date">Generated: ${generated}</div></div></div>
//   <div class="grid">${fields.map(([l,v])=>`<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}</div>
//   <div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
// }

// // ── Student Report Preview ─────────────────────────────────────────────────────
// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}) : "—";
//   const fields: [string,string][] = [
//     ["Student ID",report.studentId],["Full Name",report.fullName],["Email",report.email??"—"],["Date of Birth",report.dateOfBirth??"—"],
//     ["Admission Date",admDate],["Gender",report.gender??"—"],["Blood Group",report.bloodGroup??"—"],["Program",report.program?.name??"—"],
//     ["Level / Class",report.level?.name??"—"],["Section",report.section?`Section ${report.section}`:"—"],["Roll Number",report.rollNumber??"—"],
//     ["Academic Year",report.academicYear??"—"],["Status",report.status??"—"],["Parent Name",report.parentName??"—"],
//     ["Parent Phone",report.parentPhone??"—"],["Parent Email",report.parentEmail??"—"],
//     ["Address",[report.address,report.city,report.state].filter(Boolean).join(", ")||"—"],
//     ["Enrolled At",report.enrolledAt?new Date(report.enrolledAt).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}):"—"],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME} · {SCHOOL_TAGLINE}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//               {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export default function StudentsView() {
//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState("");
//   const [programFilter, setProgramFilter] = useState("");
//   const [sectionFilter, setSectionFilter] = useState("");
//   const [statusFilter,  setStatusFilter]  = useState("");

//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);   // ← NEW

//   const [editingStudent,   setEditingStudent]   = useState<any>(null);
//   const [studentToDelete,  setStudentToDelete]  = useState<any>(null);
//   const [idCardStudent,    setIdCardStudent]    = useState<any>(null);
//   const [feesStudent,      setFeesStudent]      = useState<any>(null);           // ← NEW
//   const [reportData,       setReportData]       = useState<any>(null);
//   const [credentials,      setCredentials]      = useState<{ studentId: string; email: string; password: string } | null>(null);
//   const [submitting,       setSubmitting]       = useState(false);
//   const [reportLoading,    setReportLoading]    = useState(false);
//   const [toast,            setToast]            = useState<string | null>(null);
//   const [addForm,          setAddForm]          = useState<any>({});
//   const [editForm,         setEditForm]         = useState<any>({});
//   const [addPhotoFile,     setAddPhotoFile]     = useState<File | null>(null);
//   const [editPhotoFile,    setEditPhotoFile]    = useState<File | null>(null);
//   const [togglingStatus,   setTogglingStatus]   = useState<string | null>(null);

//   const LOGO_URL = "/Acento-Logo.jpg";

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch("/api/admin/programs"); setPrograms(r.programs ?? []); } catch {}
//   }, []);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = "", prog = "", sec = "", stat = "") => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: "100" });
//       if (prog) p.set("programId", prog);
//       if (sec)  p.set("section", sec);
//       if (stat) p.set("status", stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { showToast("Failed to load students"); }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   const handleToggleStatus = async (student: any) => {
//     const newStatus = student.status === "Active" ? "Disabled" : "Active";
//     setTogglingStatus(student.id);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
//       showToast(`Student ${newStatus === "Active" ? "activated" : "disabled"}`);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { showToast(err.message || "Failed to update status"); }
//     setTogglingStatus(null);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) { showToast("First name, last name and email are required"); return; }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
//         catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`); setSubmitting(false); return; }
//       }
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:`${addForm.firstName} ${addForm.lastName}`, email:addForm.email, photoUrl,
//           admissionDate:addForm.admissionDate||null, dateOfBirth:addForm.dateOfBirth, gender:addForm.gender,
//           bloodGroup:addForm.bloodGroup, rollNumber:addForm.rollNumber, parentName:addForm.parentName,
//           parentPhone:addForm.parentPhone, parentEmail:addForm.parentEmail, address:addForm.address,
//           city:addForm.city, state:addForm.state, section:addForm.section||null,
//           academicYear:addForm.academicYear||null, programId:addForm.programId||null, programLevelId:addForm.programLevelId||null,
//         }),
//       });
//       if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || "Failed to add student";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? "").split(" ");
//     setEditForm({
//       firstName, lastName: rest.join(" "), email: student.user?.email ?? "",
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0,10)   : "",
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0,10) : "",
//       gender:student.gender??"", bloodGroup:student.bloodGroup??"", rollNumber:student.rollNumber??"",
//       section:student.section??"", academicYear:student.academicYear??"", parentName:student.parentName??"",
//       parentPhone:student.parentPhone??"", parentEmail:student.parentEmail??"",
//       city:student.city??"", state:student.state??"", address:student.address??"",
//       programId:student.programId??"", programLevelId:student.programLevelId??"", photoUrl:student.photoUrl??"",
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.user?.email || editingStudent.id); }
//         catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({
//           fullName:`${editForm.firstName} ${editForm.lastName}`, photoUrl:photoUrl??undefined,
//           admissionDate:editForm.admissionDate||null, dateOfBirth:editForm.dateOfBirth, gender:editForm.gender,
//           bloodGroup:editForm.bloodGroup, rollNumber:editForm.rollNumber, parentName:editForm.parentName,
//           parentPhone:editForm.parentPhone, parentEmail:editForm.parentEmail, address:editForm.address,
//           city:editForm.city, state:editForm.state, section:editForm.section||null,
//           academicYear:editForm.academicYear||null, programId:editForm.programId||null, programLevelId:editForm.programLevelId||null,
//         }),
//       });
//       showToast("Student updated successfully");
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { showToast(err.message || "Failed to update student"); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { showToast("Failed to delete student"); }
//     setSubmitting(false);
//   };

//   const handleGeneratePassword = async (student: any) => {
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
//       setCredentials(res); setIsCredentialsModalOpen(true);
//     } catch { showToast("Failed to generate password"); }
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { const html = await buildReportHTML(res.report); openPrintWindow(html); }
//       else { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { showToast("Failed to load report"); }
//     setReportLoading(false);
//   };

//   const handleDownloadIdCard = async (student: any) => {
//     const html = await buildIDCardHTML(student, LOGO_URL);
//     openPrintWindow(html);
//   };

//   const avatarGradients = [
//     "linear-gradient(135deg,#e91e8c,#c2185b)",
//     "linear-gradient(135deg,#9c27b0,#7b1fa2)",
//     "linear-gradient(135deg,#FF6B6B,#FFB347)",
//   ];

//   const hasActiveFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>Add Student</GradientButton>
//       </div>

//       <Card className="overflow-visible">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Disabled">Disabled</option>
//           </select>
//           {hasActiveFilters && (
//             <button onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); setStatusFilter(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {["","ID","Student","Program","Level / Class","Section","Academic Year","Parent","Status","Actions"].map((h) => (
//                     <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     <td className="pl-5 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] bg-[#FFFDF7] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">{s.fullName?.[0]?.toUpperCase() ?? "?"}</div>}
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     <td className="px-5 py-4">
//                       <div>
//                         <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#e91e8c] transition-colors">{s.fullName}</p>
//                         <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">{s.program ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20">{s.program.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-5 py-4">{s.programLevel ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20">{s.programLevel.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-5 py-4">{s.section ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
//                     <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
//                     <td className="px-5 py-4">
//                       <StatusBadge status={s.status ?? "Active"} loading={togglingStatus === s.id} onClick={() => handleToggleStatus(s)} />
//                     </td>
//                     <td className="px-5 py-4">
//                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                         <ActionsMenu
//                           student={s}
//                           onEdit={() => openEdit(s)}
//                           onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                           onGeneratePassword={() => handleGeneratePassword(s)}
//                           onViewReport={() => fetchReport(s, false)}
//                           onDownloadReport={() => fetchReport(s, true)}
//                           onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                           onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan={10} className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center text-gray-400">
//                       <Search size={24} className="text-gray-300 mb-3" />
//                       <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                       <p className="text-sm mt-1">Try adjusting your search or filters.</p>
//                     </div>
//                   </td></tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>

//       {/* ADD MODAL */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? "Registering..." : "Register Student"}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* EDIT MODAL */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? "Saving..." : "Save Changes"}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* FEES MODAL ← NEW */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} />}
//       </Modal>

//       {/* ID CARD MODAL */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} logoUrl={LOGO_URL} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => handleDownloadIdCard(idCardStudent)}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* REPORT MODAL */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//         ) : reportData && (
//           <div className="space-y-4">
//             <StudentReport report={reportData} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => { const html = await buildReportHTML(reportData); openPrintWindow(html); }}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Download PDF
//               </button>
//               <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* CREDENTIALS MODAL */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Credentials">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 leading-relaxed">The password is shown <span className="font-black text-[#e91e8c]">only once</span>. Save it now.</p>
//           {credentials && (
//             <div className="space-y-3">
//               <CredentialRow label="Student ID"         value={credentials.studentId} />
//               <CredentialRow label="Email"              value={credentials.email} />
//               <CredentialRow label="Temporary Password" value={credentials.password} mono />
//             </div>
//           )}
//           <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//             <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//             <p className="text-xs font-medium text-amber-700">Share and ask the student to change password after first login.</p>
//           </div>
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//             <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//           </div>
//         </div>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* TOAST */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(233,30,140,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html:`
//         .custom-scrollbar::-webkit-scrollbar{width:6px}
//         .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
//         .custom-scrollbar::-webkit-scrollbar-thumb{background:#e91e8c44;border-radius:6px}
//       `}}/>
//     </div>
//   );
// }




















// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   ChevronDown, CheckCircle2, Clock, AlertOctagon,
//   Mail,
// } from 'lucide-react';
// import { useAuth } from "@/context/AuthContext";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ["A", "B", "C", "D"];
// const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
// const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

// const SCHOOL_NAME    = "Ascento Playschool";
// const SCHOOL_TAGLINE = "Play School";
// const SCHOOL_WEBSITE = "https://ascentoabacus.com/";
// const SCHOOL_PHONE   = "+91 9810366417";
// const SCHOOL_ADDRESS = "Ascento Playschool, Dwarka, New Delhi";

// const FEE_TYPES    = ["Tuition", "Admission", "Activity", "Transport", "Exam", "Library", "Uniform", "Other"];
// const FEE_STATUSES = ["Pending", "Paid", "Partial", "Overdue", "Waived"] as const;
// type FeeStatus = typeof FEE_STATUSES[number];

// const CARD_W = 208;

// // ── API helper — uses token from AuthContext ───────────────────────────────────
// function useApiFetch() {
//   const { token } = useAuth();
//   return useCallback(async (path: string, options?: RequestInit) => {
//     const res = await fetch(path, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         ...(options?.headers ?? {}),
//       },
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   }, [token]);
// }

// // ── Supabase storage upload (uses supabase client directly for storage only) ──
// import { supabase } from "@/lib/helpers/supabaseClient";
// async function uploadStudentPhoto(file: File, studentEmail: string, token: string): Promise<string> {
//   const ext  = file.name.split(".").pop() ?? "jpg";
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, "_")}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage.from("student-assets").upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from("student-assets").getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(htmlContent: string) {
//   const win = window.open("", "_blank", "width=800,height=900");
//   if (!win) { alert("Please allow popups to download the PDF."); return; }
//   win.document.write(htmlContent);
//   win.document.close();
//   win.focus();
//   setTimeout(() => { win.print(); }, 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const reader    = new FileReader();
//       reader.onload  = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch { return ""; }
// }

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// interface StudentFee {
//   id:          string;
//   feeType:     string;
//   description: string | null;
//   amount:      number;
//   paidAmount:  number;
//   dueDate:     string | null;
//   paidDate:    string | null;
//   status:      FeeStatus;
//   month:       string | null;
//   academicYear:string | null;
//   receiptNo:   string | null;
//   remarks:     string | null;
//   createdAt:   string;
// }

// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button
//     type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
//   >
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// // ── Modal — clears navbar + topbar (80px navbar + 56px topbar = 136px) ────────
// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-start justify-center bg-[#1A1A2E]/40 backdrop-blur-sm"
//       style={{ paddingTop: 144, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col`}
//         style={{ maxHeight: "calc(100vh - 168px)" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange, hint }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     {hint && <p className="text-[10px] text-[#4ECDC4] font-bold flex items-center gap-1"><Mail size={10} />{hint}</p>}
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select..." }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === "string"
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Photo Upload ───────────────────────────────────────────────────────────────
// function PhotoUpload({ value, onChange, label = "Passport Photo" }: {
//   value?: string; onChange: (url: string, file: File) => void; label?: string;
// }) {
//   const inputRef              = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//     onChange("pending", file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// // ── Program Selector ───────────────────────────────────────────────────────────
// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const selectedProgram = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {selectedProgram && selectedProgram.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {selectedProgram.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Student Form Fields ────────────────────────────────────────────────────────
// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
//   apiFetch: (path: string, options?: RequestInit) => Promise<any>;
// }) {
//   const set = (key: string) => (v: string) => setForm((prev: any) => ({ ...prev, [key]: v }));

//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set("programLevelId", form.programLevelId);
//     if (form.section)        params.set("section",        form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((res) => {
//         const roll = res.formatted ?? String(res.nextRollNumber ?? "");
//         setForm((prev: any) => ({ ...prev, rollNumber: roll }));
//       }).catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl} label="Passport Photo"
//           onChange={(url, file) => { setPhotoFile(file); setForm((prev: any) => ({ ...prev, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ""} programLevelId={form.programLevelId ?? ""}
//             onProgramChange={(v) => setForm((prev: any) => ({ ...prev, programId: v, programLevelId: "", rollNumber: "" }))}
//             onLevelChange={(v) => setForm((prev: any) => ({ ...prev, programLevelId: v, rollNumber: "" }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((prev: any) => ({ ...prev, section: v, rollNumber: "" }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ""} onChange={(e) => set("rollNumber")(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set("admissionDate")} />
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set("firstName")} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set("lastName")} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
//           <FormSelect label="Gender" options={["Male","Female","Other"]} value={form.gender} onChange={set("gender")} />
//           <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set("parentName")} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"        value={form.parentPhone} onChange={set("parentPhone")} />
//           {/* ── Parent email with login hint ── */}
//           <FormInput
//             label="Parent Email"
//             type="email"
//             placeholder="parent@email.com"
//             value={form.parentEmail}
//             onChange={set("parentEmail")}
//             hint="Student login credentials & password resets will be sent to this email"
//           />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set("city")} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set("state")} />
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
//       </div>
//     </div>
//   );
// }

// // ── Status Badge ───────────────────────────────────────────────────────────────
// function StatusBadge({ status, onClick, loading }: { status: string; onClick: () => void; loading?: boolean }) {
//   const isActive = status === "Active";
//   return (
//     <button onClick={onClick} disabled={loading} title={`Click to ${isActive ? "disable" : "activate"} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30"
//           : "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30"
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status ?? "Active"}
//     </button>
//   );
// }

// // ── Fee Status Badge ───────────────────────────────────────────────────────────
// const FEE_STATUS_CONFIG: Record<FeeStatus, { color: string; icon: any }> = {
//   Paid:    { color: "#4ECDC4", icon: CheckCircle2 },
//   Pending: { color: "#FFB347", icon: Clock },
//   Partial: { color: "#A78BFA", icon: TrendingUp },
//   Overdue: { color: "#FF6B6B", icon: AlertOctagon },
//   Waived:  { color: "#6BCB77", icon: CheckCircle2 },
// };

// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const cfg = FEE_STATUS_CONFIG[status] ?? FEE_STATUS_CONFIG.Pending;
//   const Icon = cfg.icon;
//   return (
//     <span style={{ color: cfg.color, background: cfg.color + "18", border: `1px solid ${cfg.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <Icon size={10} />
//       {status}
//     </span>
//   );
// }

// // ── Fee Form ───────────────────────────────────────────────────────────────────
// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: {
//   form: any; setForm: any; onSubmit: (e: React.FormEvent) => void;
//   submitting: boolean; onCancel: () => void; isEdit?: boolean;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types-list" value={form.feeType ?? ""} onChange={(e) => set("feeType")(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types-list">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set("status")} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set("amount")} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set("paidAmount")} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set("dueDate")} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set("paidDate")} />
//         <FormInput label="Month"        placeholder="June 2025"  value={form.month}        onChange={set("month")} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001" value={form.receiptNo} onChange={set("receiptNo")} />
//         <FormInput label="Description"  placeholder="Monthly tuition fee" value={form.description} onChange={set("description")} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ""} onChange={(e) => set("remarks")(e.target.value)} placeholder="Any additional notes..."
//           rows={2} className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? "Saving..." : isEdit ? "Update Fee" : "Add Fee"}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// // ── Fees Modal Content ─────────────────────────────────────────────────────────
// function FeesSection({ student, apiFetch }: { student: any; apiFetch: (path: string, options?: RequestInit) => Promise<any> }) {
//   const [fees,       setFees]       = useState<StudentFee[]>([]);
//   const [summary,    setSummary]    = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,    setLoading]    = useState(true);
//   const [view,       setView]       = useState<"list" | "add" | "edit">("list");
//   const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
//   const [feeForm,    setFeeForm]    = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [toast,      setToast]      = useState<string | null>(null);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

//   const loadFees = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(res.fees ?? []);
//       setSummary(res.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { showToast("Failed to load fees"); }
//     setLoading(false);
//   }, [student.id]);

//   useEffect(() => { loadFees(); }, [loadFees]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { showToast("Fee type and amount are required"); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, {
//         method: "POST", body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || "Pending" }),
//       });
//       showToast("Fee record added"); setFeeForm({}); setView("list"); loadFees();
//     } catch (err: any) { showToast(err.message || "Failed to add fee"); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, {
//         method: "PATCH", body: JSON.stringify(feeForm),
//       });
//       showToast("Fee updated"); setView("list"); setEditingFee(null); loadFees();
//     } catch (err: any) { showToast(err.message || "Failed to update fee"); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: "DELETE" });
//       showToast("Fee deleted"); loadFees();
//     } catch { showToast("Failed to delete fee"); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType:      fee.feeType,
//       description:  fee.description ?? "",
//       amount:       String(fee.amount),
//       paidAmount:   String(fee.paidAmount),
//       dueDate:      fee.dueDate  ? fee.dueDate.slice(0, 10)  : "",
//       paidDate:     fee.paidDate ? fee.paidDate.slice(0, 10) : "",
//       status:       fee.status,
//       month:        fee.month        ?? "",
//       academicYear: fee.academicYear ?? "",
//       receiptNo:    fee.receiptNo    ?? "",
//       remarks:      fee.remarks      ?? "",
//     });
//     setEditingFee(fee); setView("edit");
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

//   return (
//     <div className="space-y-5 relative">
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>

//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: "Total Fees",  value: fmt(summary.totalAmount), color: "#1A1A2E", icon: Receipt },
//           { label: "Amount Paid", value: fmt(summary.totalPaid),   color: "#4ECDC4", icon: CheckCircle2 },
//           { label: "Balance Due", value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? "#FF6B6B" : "#4ECDC4", icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {view === "list" && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: "Pending", paidAmount: "0" }); setView("add"); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const balance = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${balance > 0 ? "text-[#FF6B6B]" : "text-[#4ECDC4]"}`}>{fmt(balance)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString("en-IN")}</span></div>}
//                         </div>
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id} className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       {view === "add" && (
//         <>
//           <button onClick={() => setView("list")} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c]">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView("list"); setFeeForm({}); }} />
//         </>
//       )}
//       {view === "edit" && editingFee && (
//         <>
//           <button onClick={() => { setView("list"); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c]">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView("list"); setEditingFee(null); }} isEdit />
//         </>
//       )}

//       {toast && (
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(233,30,140,0.4)] z-10 whitespace-nowrap">
//           {toast}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// // Fix: always visible button; dropdown rendered in a portal-like fixed div to escape overflow:hidden
// // function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
// //   const [open,       setOpen]       = useState(false);
// //   const [dropPos,    setDropPos]    = useState({ top: 0, right: 0 });
// //   const btnRef = useRef<HTMLButtonElement>(null);

// //   const openMenu = () => {
// //     if (btnRef.current) {
// //       const rect = btnRef.current.getBoundingClientRect();
// //       setDropPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right });
// //     }
// //     setOpen(true);
// //   };

// //   useEffect(() => {
// //     if (!open) return;
// //     const h = (e: MouseEvent) => setOpen(false);
// //     document.addEventListener("mousedown", h);
// //     return () => document.removeEventListener("mousedown", h);
// //   }, [open]);

// //   const items = [
// //     { icon: Pencil,      label: "Edit",              color: "#FFB347", action: onEdit },
// //     { icon: KeyRound,    label: "Generate Password",  color: "#4ECDC4", action: onGeneratePassword },
// //     { icon: IdCard,      label: "View ID Card",       color: "#A78BFA", action: onViewIdCard },
// //     { icon: IndianRupee, label: "Manage Fees",        color: "#e91e8c", action: onViewFees },
// //     { icon: Eye,         label: "View Report",        color: "#64B6FF", action: onViewReport },
// //     { icon: Download,    label: "Download Report",    color: "#6BCB77", action: onDownloadReport },
// //     { icon: Trash2,      label: "Delete",             color: "#FF6B6B", action: onDelete },
// //   ];

// //   return (
// //     <>
// //       <button
// //         ref={btnRef}
// //         onClick={openMenu}
// //         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
// //       >
// //         <MoreHorizontal size={15} />
// //       </button>

// //       {open && (
// //         <div
// //           style={{ position: "fixed", top: dropPos.top, right: dropPos.right, zIndex: 9999 }}
// //           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]"
// //           onMouseDown={(e) => e.stopPropagation()}
// //         >
// //           {items.map(({ icon: Icon, label, color, action }) => (
// //             <button key={label} onClick={() => { action(); setOpen(false); }}
// //               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
// //               <Icon size={14} style={{ color }} />
// //               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </>
// //   );
// // }


// // Drop-in replacement for the ActionsMenu component in StudentsView.tsx
// // Fix: use onClick (not mousedown) for document close listener,
// //      and call action inside a setTimeout so the menu closes cleanly first.

// function ActionsMenu({
//   student, onEdit, onDelete, onGeneratePassword,
//   onViewReport, onDownloadReport, onViewIdCard, onViewFees,
// }: any) {
//   const [open,    setOpen]    = useState(false);
//   const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
//   const btnRef  = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Open: measure button, store position for fixed dropdown
//   const handleOpen = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (btnRef.current) {
//       const r = btnRef.current.getBoundingClientRect();
//       setDropPos({
//         top:   r.bottom + 4,
//         right: window.innerWidth - r.right,
//       });
//     }
//     setOpen(v => !v);
//   };

//   // Close on outside click
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e: MouseEvent) => {
//       if (
//         menuRef.current  && !menuRef.current.contains(e.target  as Node) &&
//         btnRef.current   && !btnRef.current.contains(e.target   as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     // Use capture so we get the event before anything else
//     document.addEventListener("click", handler, true);
//     return () => document.removeEventListener("click", handler, true);
//   }, [open]);

//   // Close on scroll / resize so the dropdown doesn't float away
//   useEffect(() => {
//     if (!open) return;
//     const close = () => setOpen(false);
//     window.addEventListener("scroll", close, true);
//     window.addEventListener("resize", close);
//     return () => {
//       window.removeEventListener("scroll", close, true);
//       window.removeEventListener("resize", close);
//     };
//   }, [open]);

//   const items = [
//     { icon: Pencil,      label: "Edit",             color: "#FFB347", action: onEdit },
//     { icon: KeyRound,    label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
//     { icon: IdCard,      label: "View ID Card",      color: "#A78BFA", action: onViewIdCard },
//     { icon: IndianRupee, label: "Manage Fees",        color: "#e91e8c", action: onViewFees },
//     { icon: Eye,         label: "View Report",        color: "#64B6FF", action: onViewReport },
//     { icon: Download,    label: "Download Report",    color: "#6BCB77", action: onDownloadReport },
//     { icon: Trash2,      label: "Delete",             color: "#FF6B6B", action: onDelete },
//   ];

//   const handleItemClick = (e: React.MouseEvent, action: () => void) => {
//     e.stopPropagation();
//     setOpen(false);
//     // Defer so the modal/state update happens after the menu unmounts cleanly
//     setTimeout(action, 10);
//   };

//   return (
//     <>
//       {/* Trigger button — always visible */}
//       <button
//         ref={btnRef}
//         onClick={handleOpen}
//         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//       >
//         <MoreHorizontal size={15} />
//       </button>

//       {/* Dropdown — rendered at root level via fixed positioning */}
//       {open && (
//         <div
//           ref={menuRef}
//           style={{
//             position: "fixed",
//             top:       dropPos.top,
//             right:     dropPos.right,
//             zIndex:    9999,
//           }}
//           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]"
//         >
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button
//               key={label}
//               onClick={(e) => handleItemClick(e, action)}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left"
//             >
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>
//                 {label}
//               </span>
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// // ── ID Card (unchanged from original) ─────────────────────────────────────────
// function IDCard({ student, logoUrl }: { student: any; logoUrl?: string }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" }) : "—";
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString("en-IN",   { day:"2-digit", month:"2-digit", year:"numeric" }) : "—";
//   const w = CARD_W;
//   return (
//     <div className="flex flex-col gap-4 items-center">
//       <div style={{ width: w }}>
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
//         <div style={{ width: w, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial,sans-serif" }}>
//           <div style={{ background:"linear-gradient(135deg,#e91e8c 0%,#c2185b 100%)", padding:"8px 10px 6px", display:"flex", alignItems:"center", gap:6 }}>
//             <div style={{ width:29, height:29, background:"rgba(255,255,255,0.25)", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:900, color:"#fff" }}>A</div>
//             <div>
//               <div style={{ color:"#fff", fontWeight:900, fontSize:11, lineHeight:1.2 }}>{SCHOOL_NAME}</div>
//               <div style={{ color:"rgba(255,255,255,0.7)", fontSize:6.5, marginTop:2 }}>Adm. No.: {student.studentId ?? "—"}</div>
//             </div>
//           </div>
//           <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 10px 8px" }}>
//             <div style={{ width:64, height:72, borderRadius:"50%", overflow:"hidden", border:"3px solid #e91e8c", background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center" }}>
//               {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//                 : <span style={{ fontSize:22, fontWeight:900, color:"#e91e8c" }}>{student.fullName?.[0]?.toUpperCase() ?? "?"}</span>}
//             </div>
//           </div>
//           <div style={{ padding:"0 11px 5px", fontSize:8 }}>
//             {[["Name",student.fullName??"-"],["D.O.B",dob],["Adm Date",admDate],["Mob.",student.parentPhone??"-"],["Class",student.programLevel?.name??student.program?.name??"-"],["P. Name",student.parentName??"-"]].map(([l,v])=>(
//               <div key={l} style={{ display:"flex", gap:3, marginBottom:3, alignItems:"flex-start" }}>
//                 <span style={{ fontWeight:700, color:"#333", width:44, flexShrink:0 }}>{l}</span>
//                 <span style={{ color:"#555", fontWeight:600 }}>: &nbsp;{v}</span>
//               </div>
//             ))}
//           </div>
//           <div style={{ padding:"3px 11px", display:"flex", justifyContent:"flex-end" }}>
//             <div style={{ textAlign:"center" }}><div style={{ borderBottom:"1px solid #aaa", width:48, marginBottom:2 }} /><div style={{ fontSize:6.5, color:"#777" }}>Auth. Sign.</div></div>
//           </div>
//           <svg viewBox={`0 0 ${w} 18`} style={{ display:"block", width:"100%", marginTop:2 }}>
//             <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#e91e8c"/>
//             <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity="0.6"/>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Student Report Preview ─────────────────────────────────────────────────────
// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}) : "—";
//   const fields: [string,string][] = [
//     ["Student ID",report.studentId],["Full Name",report.fullName],["Email",report.email??"—"],["Date of Birth",report.dateOfBirth??"—"],
//     ["Admission Date",admDate],["Gender",report.gender??"—"],["Blood Group",report.bloodGroup??"—"],["Program",report.program?.name??"—"],
//     ["Level / Class",report.level?.name??"—"],["Section",report.section?`Section ${report.section}`:"—"],["Roll Number",report.rollNumber??"—"],
//     ["Academic Year",report.academicYear??"—"],["Status",report.status??"—"],["Parent Name",report.parentName??"—"],
//     ["Parent Phone",report.parentPhone??"—"],["Parent Email",report.parentEmail??"—"],
//     ["Address",[report.address,report.city,report.state].filter(Boolean).join(", ")||"—"],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// async function buildReportHTML(r: any): Promise<string> {
//   const addr      = [r.address, r.city, r.state].filter(Boolean).join(", ") || "—";
//   const admDate   = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString("en-IN", {year:"numeric",month:"long",day:"numeric"}) : "—";
//   const generated = new Date().toLocaleDateString("en-IN", {year:"numeric",month:"long",day:"numeric"});
//   const fields: [string,string][] = [
//     ["Student ID",r.studentId],["Full Name",r.fullName],["Email",r.email??"—"],
//     ["Admission Date",admDate],["Gender",r.gender??"—"],["Blood Group",r.bloodGroup??"—"],
//     ["Program",r.program?.name??"—"],["Level",r.level?.name??"—"],["Status",r.status??"—"],
//     ["Parent Name",r.parentName??"—"],["Parent Phone",r.parentPhone??"—"],["Address",addr],
//   ];
//   let photoHtml = "";
//   if (r.photoUrl) { const b64 = await urlToBase64(r.photoUrl); if (b64) photoHtml = `<img src="${b64}" class="report-photo" />`; }
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>body{font-family:Arial;background:#f7f7f7;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between}.report-photo{width:60px;height:72px;border-radius:8px;object-fit:cover}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:4px">Generated: ${generated}</div></div></div><div class="grid">${fields.map(([l,v])=>`<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}</div></body></html>`;
// }

// async function buildIDCardHTML(student: any): Promise<string> {
//   let photoSrc = "";
//   if (student.photoUrl) { const b64 = await urlToBase64(student.photoUrl); if (b64) photoSrc = b64; }
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString("en-IN",  {day:"2-digit",month:"2-digit",year:"numeric"}) : "—";
//   const w = CARD_W;
//   const photoHtml = photoSrc ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c" />` : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(student.fullName?.[0]??"?").toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card — ${student.fullName}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee;font-family:Arial"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${student.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photoHtml}</div><div style="padding:0 11px 8px;font-size:8px">${[["Name",student.fullName??"—"],["D.O.B",dob],["Adm Date",admDate],["Mob.",student.parentPhone??"—"],["Class",student.programLevel?.name??student.program?.name??"—"],["Parent",student.parentName??"—"]].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join("")}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export default function StudentsView() {
//   const apiFetch = useApiFetch();
//   const { token } = useAuth();

//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState("");
//   const [programFilter, setProgramFilter] = useState("");
//   const [sectionFilter, setSectionFilter] = useState("");
//   const [statusFilter,  setStatusFilter]  = useState("");

//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
//   const [feesStudent,     setFeesStudent]     = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string; emailSent?: boolean; parentEmail?: string } | null>(null);
//   const [submitting,      setSubmitting]      = useState(false);
//   const [reportLoading,   setReportLoading]   = useState(false);
//   const [togglingStatus,  setTogglingStatus]  = useState<string | null>(null);

//   // Toast: supports type for color
//   const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success"|"error"|"info" }[]>([]);
//   let toastId = useRef(0);
//   const showToast = (msg: string, type: "success"|"error"|"info" = "success") => {
//     const id = ++toastId.current;
//     setToasts(prev => [...prev, { id, msg, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
//   };

//   const [addForm,      setAddForm]      = useState<any>({});
//   const [editForm,     setEditForm]     = useState<any>({});
//   const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);
//   const [editPhotoFile,setEditPhotoFile]= useState<File | null>(null);

//   const LOGO_URL = "/Acento-Logo.jpg";

//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch("/api/admin/programs"); setPrograms(r.programs ?? []); } catch {}
//   }, [apiFetch]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = "", prog = "", sec = "", stat = "") => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: "100" });
//       if (prog) p.set("programId", prog);
//       if (sec)  p.set("section", sec);
//       if (stat) p.set("status", stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { showToast("Failed to load students", "error"); }
//     setLoading(false);
//   }, [apiFetch]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   // ── Toggle student status — force logout via ban ───────────────────────────
//   const handleToggleStatus = async (student: any) => {
//     const newStatus = student.status === "Active" ? "Disabled" : "Active";
//     setTogglingStatus(student.id);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
//       showToast(`Student ${newStatus === "Active" ? "activated" : "disabled — session revoked"}`, newStatus === "Active" ? "success" : "info");
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { showToast(err.message || "Failed to update status", "error"); }
//     setTogglingStatus(null);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) { showToast("First name, last name and email are required", "error"); return; }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile && token) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email, token); }
//         catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`, "error"); setSubmitting(false); return; }
//       }
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:`${addForm.firstName} ${addForm.lastName}`, email:addForm.email, photoUrl,
//           admissionDate:addForm.admissionDate||null, dateOfBirth:addForm.dateOfBirth, gender:addForm.gender,
//           bloodGroup:addForm.bloodGroup, rollNumber:addForm.rollNumber, parentName:addForm.parentName,
//           parentPhone:addForm.parentPhone, parentEmail:addForm.parentEmail, address:addForm.address,
//           city:addForm.city, state:addForm.state, section:addForm.section||null,
//           academicYear:addForm.academicYear||null, programId:addForm.programId||null, programLevelId:addForm.programLevelId||null,
//         }),
//       });
//       if (res.credentials) {
//         setCredentials({ ...res.credentials, emailSent: res.emailSent, parentEmail: addForm.parentEmail });
//         setIsCredentialsModalOpen(true);
//         if (res.emailSent) showToast(`✉️ Login credentials sent to ${addForm.parentEmail}`, "info");
//       }
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || "Failed to add student";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg, "error");
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? "").split(" ");
//     setEditForm({
//       firstName, lastName: rest.join(" "), email: student.user?.email ?? "",
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0,10)   : "",
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0,10) : "",
//       gender:student.gender??"", bloodGroup:student.bloodGroup??"", rollNumber:student.rollNumber??"",
//       section:student.section??"", academicYear:student.academicYear??"", parentName:student.parentName??"",
//       parentPhone:student.parentPhone??"", parentEmail:student.parentEmail??"",
//       city:student.city??"", state:student.state??"", address:student.address??"",
//       programId:student.programId??"", programLevelId:student.programLevelId??"", photoUrl:student.photoUrl??"",
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile && token) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id, token); }
//         catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`, "error"); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({
//           fullName:`${editForm.firstName} ${editForm.lastName}`, photoUrl:photoUrl??undefined,
//           admissionDate:editForm.admissionDate||null, dateOfBirth:editForm.dateOfBirth, gender:editForm.gender,
//           bloodGroup:editForm.bloodGroup, rollNumber:editForm.rollNumber, parentName:editForm.parentName,
//           parentPhone:editForm.parentPhone, parentEmail:editForm.parentEmail, address:editForm.address,
//           city:editForm.city, state:editForm.state, section:editForm.section||null,
//           academicYear:editForm.academicYear||null, programId:editForm.programId||null, programLevelId:editForm.programLevelId||null,
//         }),
//       });
//       showToast("Student updated successfully");
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { showToast(err.message || "Failed to update student", "error"); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { showToast("Failed to delete student", "error"); }
//     setSubmitting(false);
//   };

//   // ── Generate password — sends email + forces logout ──────────────────────
//   const handleGeneratePassword = async (student: any) => {
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
//       setCredentials({ ...res, emailSent: res.emailSent, parentEmail: res.parentEmail });
//       setIsCredentialsModalOpen(true);
//       showToast("🔑 New password generated — previous session revoked", "info");
//       if (res.emailSent) {
//         setTimeout(() => showToast(`✉️ New credentials sent to ${res.parentEmail}`, "info"), 600);
//       }
//     } catch { showToast("Failed to generate password", "error"); }
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { const html = await buildReportHTML(res.report); openPrintWindow(html); }
//       else { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { showToast("Failed to load report", "error"); }
//     setReportLoading(false);
//   };

//   const handleDownloadIdCard = async (student: any) => {
//     const html = await buildIDCardHTML(student);
//     openPrintWindow(html);
//   };

//   const avatarGradients = [
//     "linear-gradient(135deg,#e91e8c,#c2185b)",
//     "linear-gradient(135deg,#9c27b0,#7b1fa2)",
//     "linear-gradient(135deg,#FF6B6B,#FFB347)",
//   ];

//   const hasActiveFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>Add Student</GradientButton>
//       </div>

//       {/* Table card — overflow-visible so dropdown isn't clipped */}
//       <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">

//         {/* Filters */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Disabled">Disabled</option>
//           </select>
//           {hasActiveFilters && (
//             <button onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); setStatusFilter(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* Scrollable table — horizontal scrollbar always visible on overflow */}
//         <div className="overflow-x-auto" style={{ minHeight: 400 }}>
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="text-left border-collapse" style={{ minWidth: 1100, width: "100%" }}>
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {["","ID","Student","Program","Level","Section","Acad. Year","Parent","Status","Actions"].map((h) => (
//                     <th key={h} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     <td className="pl-4 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">{s.fullName?.[0]?.toUpperCase() ?? "?"}</div>}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     <td className="px-4 py-4">
//                       <p className="text-sm font-bold text-[#1A1A2E]">{s.fullName}</p>
//                       <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
//                     </td>
//                     <td className="px-4 py-4">{s.program ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20">{s.program.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-4 py-4">{s.programLevel ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20">{s.programLevel.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-4 py-4">{s.section ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span> : <span className="text-xs text-gray-400">—</span>}</td>
//                     <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? "—"}</td>
//                     <td className="px-4 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{s.parentName ?? "—"}</td>
//                     <td className="px-4 py-4">
//                       <StatusBadge status={s.status ?? "Active"} loading={togglingStatus === s.id} onClick={() => handleToggleStatus(s)} />
//                     </td>
//                     {/* Actions — always visible, not opacity-0 */}
//                     <td className="px-4 py-4">
//                       <ActionsMenu
//                         student={s}
//                         onEdit={() => openEdit(s)}
//                         onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                         onGeneratePassword={() => handleGeneratePassword(s)}
//                         onViewReport={() => fetchReport(s, false)}
//                         onDownloadReport={() => fetchReport(s, true)}
//                         onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                       />
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan={10} className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center text-gray-400">
//                       <Search size={24} className="text-gray-300 mb-3" />
//                       <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                     </div>
//                   </td></tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? "Registering..." : "Register Student"}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? "Saving..." : "Save Changes"}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── FEES MODAL ── */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} logoUrl={LOGO_URL} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => handleDownloadIdCard(idCardStudent)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//         ) : reportData && (
//           <div className="space-y-4">
//             <StudentReport report={reportData} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => { const html = await buildReportHTML(reportData); openPrintWindow(html); }}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Download PDF
//               </button>
//               <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Credentials">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 leading-relaxed">The password is shown <span className="font-black text-[#e91e8c]">only once</span>. Save it immediately.</p>

//           {/* Email sent banner */}
//           {credentials?.emailSent && credentials?.parentEmail && (
//             <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
//               <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-bold text-[#4ECDC4]">Credentials automatically sent to <span className="underline">{credentials.parentEmail}</span></p>
//             </div>
//           )}
//           {credentials && !credentials.emailSent && (
//             <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//               <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-amber-700">No parent email on file — share these credentials manually.</p>
//             </div>
//           )}

//           {credentials && (
//             <div className="space-y-3">
//               <CredentialRow label="Student ID"         value={credentials.studentId} />
//               <CredentialRow label="Login Email"        value={credentials.email} />
//               <CredentialRow label="Temporary Password" value={credentials.password} mono />
//             </div>
//           )}

//           <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//             <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//             <p className="text-xs font-medium text-amber-700">Any previous session for this student has been automatically signed out.</p>
//           </div>

//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//             <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//           </div>
//         </div>
//       </Modal>

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* ── Toast stack (bottom-right, supports multiple) ── */}
//       <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999] pointer-events-none">
//         {toasts.map(t => (
//           <div key={t.id} style={{
//             background: t.type === "error" ? "linear-gradient(135deg,#FF6B6B,#e91e8c)"
//               : t.type === "info"  ? "linear-gradient(135deg,#4ECDC4,#45B7AA)"
//               : "linear-gradient(135deg,#e91e8c,#9c27b0)",
//           }} className="text-white px-5 py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)] pointer-events-auto animate-in slide-in-from-bottom-3 max-w-xs">
//             {t.msg}
//           </div>
//         ))}
//       </div>

//       <style dangerouslySetInnerHTML={{__html:`
//         .custom-scrollbar::-webkit-scrollbar{width:6px}
//         .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
//         .custom-scrollbar::-webkit-scrollbar-thumb{background:#e91e8c44;border-radius:6px}
//       `}}/>
//     </div>
//   );
// }

















// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   CheckCircle2, Clock, AlertOctagon,
//   Mail, ShieldAlert, Send,
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/helpers/supabaseClient';

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ['A', 'B', 'C', 'D'];
// const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
// const CITIES         = ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior'];
// const SCHOOL_NAME    = 'Ascento Playschool';
// const SCHOOL_TAGLINE = 'Play School';
// const SCHOOL_WEBSITE = 'https://ascentoabacus.com/';
// const SCHOOL_PHONE   = '+91 9810366417';
// const SCHOOL_ADDRESS = 'Ascento Playschool, Dwarka, New Delhi';
// const FEE_TYPES      = ['Tuition','Admission','Activity','Transport','Exam','Library','Uniform','Other'];
// const FEE_STATUSES   = ['Pending','Paid','Partial','Overdue','Waived'] as const;
// type FeeStatus = typeof FEE_STATUSES[number];
// const CARD_W = 208;

// // ── UserStatus enum — matches Prisma UserStatus exactly ───────────────────────
// // Used for both Student.status and User.status
// type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

// // ── API helper ────────────────────────────────────────────────────────────────
// function makeApiFetch(token: string | null) {
//   return async (path: string, options?: RequestInit) => {
//     const res = await fetch(path, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...(options?.headers ?? {}),
//       },
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   };
// }

// async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
//   const ext  = file.name.split('.').pop() ?? 'jpg';
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, '_')}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage
//     .from('student-assets')
//     .upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from('student-assets').getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(html: string) {
//   const win = window.open('', '_blank', 'width=800,height=900');
//   if (!win) { alert('Please allow popups to print/download.'); return; }
//   win.document.write(html);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const r    = new FileReader();
//       r.onload  = () => resolve(r.result as string);
//       r.onerror = reject;
//       r.readAsDataURL(blob);
//     });
//   } catch { return ''; }
// }

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
// interface StudentFee {
//   id: string; feeType: string; description: string | null;
//   amount: number; paidAmount: number; dueDate: string | null;
//   paidDate: string | null; status: FeeStatus; month: string | null;
//   academicYear: string | null; receiptNo: string | null; remarks: string | null;
//   createdAt: string;
// }
// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// interface CredentialsData {
//   studentId:       string;
//   email:           string;
//   password:        string;
//   parentEmail?:    string;
//   emailSent?:      boolean;
//   passwordVersion?: number;
// }

// // ── Toast system ──────────────────────────────────────────────────────────────
// type ToastKind = 'success' | 'error' | 'info' | 'email';
// interface Toast { id: number; msg: string; kind: ToastKind; }

// const TOAST_COLORS: Record<ToastKind, string> = {
//   success: 'from-[#4ECDC4] to-[#3db8af]',
//   error:   'from-[#FF6B6B] to-[#e91e8c]',
//   info:    'from-[#A78BFA] to-[#9c27b0]',
//   email:   'from-[#FFB347] to-[#FF6B6B]',
// };
// const TOAST_ICONS: Record<ToastKind, React.ReactNode> = {
//   success: <CheckCircle2 size={15} />,
//   error:   <AlertCircle  size={15} />,
//   info:    <ShieldAlert  size={15} />,
//   email:   <Mail         size={15} />,
// };

// function ToastStack({ toasts }: { toasts: Toast[] }) {
//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
//       {toasts.map((t) => (
//         <div key={t.id}
//           className={`bg-gradient-to-r ${TOAST_COLORS[t.kind]} text-white px-5 py-3.5 rounded-2xl font-bold text-sm
//             shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 max-w-sm pointer-events-auto
//             animate-in slide-in-from-bottom-4 duration-300`}>
//           {TOAST_ICONS[t.kind]}
//           <span>{t.msg}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToasts() {
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const ctr = useRef(0);
//   const push = useCallback((msg: string, kind: ToastKind = 'success') => {
//     const id = ++ctr.current;
//     setToasts((p) => [...p, { id, msg, kind }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
//   }, []);
//   return { toasts, push };
// }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const GradientButton = ({ children, onClick, icon: Icon, className = '', type = 'button', disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold
//       flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed
//       ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = 'hidden';
//     else        document.body.style.overflow = '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 bg-[#1A1A2E]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
//       style={{ paddingTop: 80, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full
//           ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col my-auto`}
//         style={{ maxHeight: 'calc(100vh - 104px)' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0"
//           style={{ scrollbarWidth: 'thin', scrollbarColor: '#e91e8c44 transparent' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Confirm-send dialog — shows parent email BEFORE generating password ────────
// function ConfirmSendDialog({
//   student,
//   onConfirm,
//   onCancel,
// }: {
//   student: any;
//   onConfirm: () => void;
//   onCancel: () => void;
// }) {
//   const hasParentEmail = !!student?.parentEmail;
//   return (
//     <div className="fixed inset-0 z-[60] bg-[#1A1A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm p-6 space-y-4">
//         {/* Header */}
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-[#FFB347]/15 flex items-center justify-center flex-shrink-0">
//             <KeyRound size={20} className="text-[#FFB347]" />
//           </div>
//           <div>
//             <p className="font-black text-[#1A1A2E] text-base">Generate New Password?</p>
//             <p className="text-xs text-gray-500 mt-0.5">For <span className="font-bold">{student?.fullName}</span></p>
//           </div>
//         </div>

//         {/* Parent email destination */}
//         <div className={`rounded-xl px-4 py-3 ${hasParentEmail ? 'bg-[#FFFDF7] border border-[#F0EEF8]' : 'bg-amber-50 border border-amber-200'}`}>
//           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//             <Mail size={10} /> Credentials will be emailed to
//           </p>
//           {hasParentEmail ? (
//             <p className="text-sm font-black text-[#1A1A2E] break-all">{student.parentEmail}</p>
//           ) : (
//             <p className="text-xs font-bold text-amber-700">⚠️ No parent email on file — you'll need to share credentials manually.</p>
//           )}
//         </div>

//         {/* What will happen */}
//         <ul className="space-y-1.5 text-xs text-gray-500">
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-[9px] font-black flex-shrink-0">1</span> A new strong password is generated</li>
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center text-[9px] font-black flex-shrink-0">2</span> All existing sessions are signed out</li>
//           {hasParentEmail && (
//             <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#FFB347]/20 text-[#FFB347] flex items-center justify-center text-[9px] font-black flex-shrink-0">3</span> Login credentials emailed to parent</li>
//           )}
//         </ul>

//         <div className="flex gap-3 pt-1">
//           <button onClick={onCancel}
//             className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FFB347] to-[#FF6B6B] hover:shadow-[0_6px_20px_rgba(255,179,71,0.4)] transition-all text-sm flex items-center justify-center gap-2">
//             <Send size={14} /> Yes, Generate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const FormInput = ({ label, type = 'text', placeholder, required = false, value, onChange, hint }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     {hint && (
//       <p className="text-[10px] font-bold text-[#FFB347] flex items-center gap-1.5">
//         <Mail size={10} className="flex-shrink-0" />{hint}
//       </p>
//     )}
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = 'Select...' }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === 'string'
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CopyRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied
//           ? 'text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10'
//           : 'text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]'}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Photo Upload ───────────────────────────────────────────────────────────────
// function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void; }) {
//   const inputRef  = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith('image/')) return;
//     const r    = new FileReader();
//     r.onload  = (e) => setPreview(e.target?.result as string);
//     r.readAsDataURL(file);
//     onChange('pending', file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// // ── Program Selector ───────────────────────────────────────────────────────────
// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const sel = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {sel && sel.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {sel.hasLevels ? 'Level' : 'Class / Sub-group'}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {sel.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Student Form Fields ────────────────────────────────────────────────────────
// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
//   apiFetch: (path: string, options?: RequestInit) => Promise<any>;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set('programLevelId', form.programLevelId);
//     if (form.section)        params.set('section', form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((r) => setForm((p: any) => ({ ...p, rollNumber: r.formatted ?? String(r.nextRollNumber ?? '') })))
//       .catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl}
//           onChange={(url, file) => { setPhotoFile(file); setForm((p: any) => ({ ...p, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ''} programLevelId={form.programLevelId ?? ''}
//             onProgramChange={(v) => setForm((p: any) => ({ ...p, programId: v, programLevelId: '', rollNumber: '' }))}
//             onLevelChange={(v) => setForm((p: any) => ({ ...p, programLevelId: v, rollNumber: '' }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((p: any) => ({ ...p, section: v, rollNumber: '' }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ''} onChange={(e) => set('rollNumber')(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set('admissionDate')} />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set('firstName')} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set('lastName')} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set('email')} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
//           <FormSelect label="Gender" options={['Male','Female','Other']} value={form.gender} onChange={set('gender')} />
//           <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} value={form.bloodGroup} onChange={set('bloodGroup')} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent &amp; Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set('parentName')} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"        value={form.parentPhone} onChange={set('parentPhone')} />
//           <FormInput
//             label="Parent Email"
//             type="email"
//             placeholder="parent@email.com"
//             value={form.parentEmail}
//             onChange={set('parentEmail')}
//             hint="Login credentials & password resets are sent to this email — must be valid"
//           />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set('city')} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set('state')} />
//         </div>
//         <div className="flex items-start gap-3 bg-[#FFF8EE] border border-[#FFB347]/30 rounded-xl px-4 py-3">
//           <Mail size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
//           <p className="text-xs font-medium text-[#92650a]">
//             <span className="font-black">Important:</span> The parent email above must be a real, accessible inbox.
//             When you register this student or generate a new password, the login credentials
//             (Student ID &amp; password) will be automatically emailed to this address.
//           </p>
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set('address')} />
//       </div>
//     </div>
//   );
// }

// // ── Status Badge — Active / Inactive (uses UserStatus) ───────────────────────
// function StatusBadge({ status, onClick, loading }: { status: UserStatus; onClick: () => void; loading?: boolean }) {
//   const isActive = status === 'Active';
//   return (
//     <button onClick={onClick} disabled={loading}
//       title={`Click to ${isActive ? 'deactivate' : 'activate'} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30'
//           : status === 'Suspended'
//           ? 'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30 cursor-not-allowed'
//           : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30'
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status}
//     </button>
//   );
// }

// // ── Fee Status Badge ───────────────────────────────────────────────────────────
// const FEE_CFG: Record<FeeStatus, { color: string; icon: any }> = {
//   Paid:    { color: '#4ECDC4', icon: CheckCircle2 },
//   Pending: { color: '#FFB347', icon: Clock },
//   Partial: { color: '#A78BFA', icon: TrendingUp },
//   Overdue: { color: '#FF6B6B', icon: AlertOctagon },
//   Waived:  { color: '#6BCB77', icon: CheckCircle2 },
// };
// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const c = FEE_CFG[status] ?? FEE_CFG.Pending;
//   return (
//     <span style={{ color: c.color, background: c.color + '18', border: `1px solid ${c.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <c.icon size={10} /> {status}
//     </span>
//   );
// }

// // ── Fee Form ───────────────────────────────────────────────────────────────────
// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: any) {
//   const set = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types" value={form.feeType ?? ''} onChange={(e) => set('feeType')(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set('status')} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set('amount')} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set('paidAmount')} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set('dueDate')} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set('paidDate')} />
//         <FormInput label="Month"     placeholder="June 2025"       value={form.month}        onChange={set('month')} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001"       value={form.receiptNo}    onChange={set('receiptNo')} />
//         <FormInput label="Description"  placeholder="Monthly fee"  value={form.description}  onChange={set('description')} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ''} onChange={(e) => set('remarks')(e.target.value)} rows={2}
//           placeholder="Any additional notes..."
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? 'Saving...' : isEdit ? 'Update Fee' : 'Add Fee'}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// // ── Fees Section ──────────────────────────────────────────────────────────────
// function FeesSection({ student, apiFetch }: { student: any; apiFetch: ReturnType<typeof makeApiFetch> }) {
//   const [fees,       setFees]       = useState<StudentFee[]>([]);
//   const [summary,    setSummary]    = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,    setLoading]    = useState(true);
//   const [view,       setView]       = useState<'list' | 'add' | 'edit'>('list');
//   const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
//   const [feeForm,    setFeeForm]    = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const { toasts, push }            = useToasts();

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const r = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(r.fees ?? []);
//       setSummary(r.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { push('Failed to load fees', 'error'); }
//     setLoading(false);
//   }, [student.id]);
//   useEffect(() => { load(); }, [load]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { push('Fee type and amount required', 'error'); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, { method: 'POST',
//         body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || 'Pending' }) });
//       push('Fee record added', 'success'); setFeeForm({}); setView('list'); load();
//     } catch (err: any) { push(err.message || 'Failed to add fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, { method: 'PATCH', body: JSON.stringify(feeForm) });
//       push('Fee updated', 'success'); setView('list'); setEditingFee(null); load();
//     } catch (err: any) { push(err.message || 'Failed to update fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: 'DELETE' });
//       push('Fee deleted', 'success'); load();
//     } catch { push('Failed to delete fee', 'error'); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType: fee.feeType, description: fee.description ?? '', amount: String(fee.amount),
//       paidAmount: String(fee.paidAmount), dueDate: fee.dueDate?.slice(0, 10) ?? '',
//       paidDate: fee.paidDate?.slice(0, 10) ?? '', status: fee.status,
//       month: fee.month ?? '', academicYear: fee.academicYear ?? '',
//       receiptNo: fee.receiptNo ?? '', remarks: fee.remarks ?? '',
//     });
//     setEditingFee(fee); setView('edit');
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: 'Total Fees',  value: fmt(summary.totalAmount), color: '#1A1A2E', icon: Receipt },
//           { label: 'Amount Paid', value: fmt(summary.totalPaid),   color: '#4ECDC4', icon: CheckCircle2 },
//           { label: 'Balance Due', value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? '#FF6B6B' : '#4ECDC4', icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>
//       {view === 'list' && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: 'Pending', paidAmount: '0' }); setView('add'); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const bal = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${bal > 0 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>{fmt(bal)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span></div>}
//                         </div>
//                         {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
//                           className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                     <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
//                       {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//       {view === 'add' && (
//         <>
//           <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView('list'); setFeeForm({}); }} />
//         </>
//       )}
//       {view === 'edit' && editingFee && (
//         <>
//           <button onClick={() => { setView('list'); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView('list'); setEditingFee(null); }} isEdit />
//         </>
//       )}
//       <ToastStack toasts={toasts} />
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
//   const [open,    setOpen]    = useState(false);
//   const [pos,     setPos]     = useState({ top: 0, right: 0 });
//   const btnRef  = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleOpen = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (btnRef.current) {
//       const r = btnRef.current.getBoundingClientRect();
//       setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
//     }
//     setOpen((v) => !v);
//   };

//   useEffect(() => {
//     if (!open) return;
//     const close = (e: MouseEvent) => {
//       if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
//       setOpen(false);
//     };
//     document.addEventListener('click', close, true);
//     return () => document.removeEventListener('click', close, true);
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const close = () => setOpen(false);
//     window.addEventListener('scroll', close, true);
//     window.addEventListener('resize', close);
//     return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
//   }, [open]);

//   const items = [
//     { icon: Pencil,      label: 'Edit',             color: '#FFB347', action: onEdit },
//     { icon: KeyRound,    label: 'Generate Password', color: '#4ECDC4', action: onGeneratePassword },
//     { icon: IdCard,      label: 'View ID Card',      color: '#A78BFA', action: onViewIdCard },
//     { icon: IndianRupee, label: 'Manage Fees',       color: '#e91e8c', action: onViewFees },
//     { icon: Eye,         label: 'View Report',       color: '#64B6FF', action: onViewReport },
//     { icon: Download,    label: 'Download Report',   color: '#6BCB77', action: onDownloadReport },
//     { icon: Trash2,      label: 'Delete',            color: '#FF6B6B', action: onDelete },
//   ];

//   return (
//     <>
//       <button ref={btnRef} onClick={handleOpen}
//         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//         title="Actions">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div ref={menuRef}
//           style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
//           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label}
//               onClick={(e) => { e.stopPropagation(); setOpen(false); setTimeout(action, 10); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === 'Delete' ? '#FF6B6B' : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// // ── ID Card preview ────────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   return (
//     <div className="flex justify-center">
//       <div style={{ width: w, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eee', fontFamily: 'Arial,sans-serif' }}>
//         <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
//           <div>
//             <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 10px' }}>
//           <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {student.photoUrl
//               ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//           </div>
//         </div>
//         <div style={{ padding: '0 11px 8px', fontSize: 8 }}>
//           {[['Name', student.fullName ?? '—'], ['D.O.B', dob], ['Adm Date', admDate], ['Mob.', student.parentPhone ?? '—'],
//             ['Class', student.programLevel?.name ?? student.program?.name ?? '—'], ['Parent', student.parentName ?? '—']].map(([l, v]) => (
//             <div key={l} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//               <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{l}</span>
//               <span style={{ color: '#555', fontWeight: 600 }}>: &nbsp;{v}</span>
//             </div>
//           ))}
//           {student.bloodGroup && <div style={{ display: 'flex', gap: 3 }}><span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span><span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//         </div>
//         <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%' }}>
//           <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//           <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = ''; if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }
//   const admDate = s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = s.dateOfBirth   ? new Date(s.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   const photo = photoSrc
//     ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c"/>`
//     : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${s.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photo}</div><div style="padding:0 11px 8px;font-size:8px">${[['Name',s.fullName??'—'],['D.O.B',dob],['Adm Date',admDate],['Mob.',s.parentPhone??'—'],['Class',s.programLevel?.name??s.program?.name??'—'],['Parent',s.parentName??'—']].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join('')}${s.bloodGroup?`<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: ${s.bloodGroup}</span></div>`:''}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }

// async function buildReportHTML(r: any): Promise<string> {
//   let photoHtml = '';
//   if (r.photoUrl) { const b = await urlToBase64(r.photoUrl); if (b) photoHtml = `<img src="${b}" style="width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0"/>`; }
//   const admDate = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const addr    = [r.address, r.city, r.state].filter(Boolean).join(', ') || '—';
//   const gen     = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
//   const fields: [string, string][] = [
//     ['Student ID', r.studentId], ['Full Name', r.fullName], ['Email', r.email ?? '—'],
//     ['Date of Birth', r.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', r.gender ?? '—'], ['Blood Group', r.bloodGroup ?? '—'],
//     ['Program', r.program?.name ?? '—'], ['Level / Class', r.level?.name ?? '—'],
//     ['Section', r.section ? `Section ${r.section}` : '—'], ['Roll Number', r.rollNumber ?? '—'],
//     ['Academic Year', r.academicYear ?? '—'], ['Status', r.status ?? '—'],
//     ['Parent Name', r.parentName ?? '—'], ['Parent Phone', r.parentPhone ?? '—'],
//     ['Parent Email', r.parentEmail ?? '—'], ['Address', addr],
//   ];
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><div style="font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px">${SCHOOL_NAME}</div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7;font-size:12px;margin-top:3px">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:6px">Generated: ${gen}</div></div></div><div class="grid">${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join('')}</div><div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
// }

// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const fields: [string, string][] = [
//     ['Student ID', report.studentId], ['Full Name', report.fullName], ['Email', report.email ?? '—'],
//     ['Date of Birth', report.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', report.gender ?? '—'], ['Blood Group', report.bloodGroup ?? '—'],
//     ['Program', report.program?.name ?? '—'], ['Level / Class', report.level?.name ?? '—'],
//     ['Section', report.section ? `Section ${report.section}` : '—'], ['Roll Number', report.rollNumber ?? '—'],
//     ['Academic Year', report.academicYear ?? '—'], ['Status', report.status ?? '—'],
//     ['Parent Name', report.parentName ?? '—'], ['Parent Phone', report.parentPhone ?? '—'],
//     ['Parent Email', report.parentEmail ?? '—'],
//     ['Address', [report.address, report.city, report.state].filter(Boolean).join(', ') || '—'],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//               {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function StudentsView() {
//   const { token } = useAuth();
//   const apiFetch  = makeApiFetch(token);
//   const { toasts, push } = useToasts();

//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [programFilter, setProgramFilter] = useState('');
//   const [sectionFilter, setSectionFilter] = useState('');
//   const [statusFilter,  setStatusFilter]  = useState('');

//   // Modal flags
//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);

//   // Confirm-generate dialog — holds the full student object so we can show parentEmail
//   const [confirmGenFor, setConfirmGenFor] = useState<any>(null);

//   const [editingStudent,   setEditingStudent]   = useState<any>(null);
//   const [studentToDelete,  setStudentToDelete]  = useState<any>(null);
//   const [idCardStudent,    setIdCardStudent]    = useState<any>(null);
//   const [feesStudent,      setFeesStudent]      = useState<any>(null);
//   const [reportData,       setReportData]       = useState<any>(null);
//   const [credentials,      setCredentials]      = useState<CredentialsData | null>(null);

//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
//   const [genLoading,     setGenLoading]     = useState(false);

//   const [addForm,       setAddForm]       = useState<any>({});
//   const [editForm,      setEditForm]      = useState<any>({});
//   const [addPhotoFile,  setAddPhotoFile]  = useState<File | null>(null);
//   const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

//   // ── Data fetchers ────────────────────────────────────────────────────────────
//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch('/api/admin/programs'); setPrograms(r.programs ?? []); } catch {}
//   }, [token]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = '', prog = '', sec = '', stat = '') => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: '100' });
//       if (prog) p.set('programId', prog);
//       if (sec)  p.set('section', sec);
//       if (stat) p.set('status', stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { push('Failed to load students', 'error'); }
//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   // ── Toggle Active ↔ Inactive — updates BOTH Student + User tables ───────────
//   const handleToggleStatus = async (student: any) => {
//     const newStatus: UserStatus = student.status === 'Active' ? 'Inactive' : 'Active';
//     setTogglingStatus(student.id);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: newStatus }),
//       });
//       push(res.message ?? `Student ${newStatus === 'Active' ? 'activated' : 'deactivated'}`,
//            newStatus === 'Active' ? 'success' : 'info');
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       push(err.message || 'Failed to update status', 'error');
//     }
//     setTogglingStatus(null);
//   };

//   // ── Add student ──────────────────────────────────────────────────────────────
//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       push('First name, last name and email are required', 'error'); return;
//     }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       const res = await apiFetch('/api/admin/students', {
//         method: 'POST',
//         body: JSON.stringify({
//           fullName:       `${addForm.firstName} ${addForm.lastName}`,
//           email:          addForm.email, photoUrl,
//           admissionDate:  addForm.admissionDate || null,
//           dateOfBirth:    addForm.dateOfBirth, gender: addForm.gender,
//           bloodGroup:     addForm.bloodGroup, rollNumber: addForm.rollNumber,
//           parentName:     addForm.parentName, parentPhone: addForm.parentPhone,
//           parentEmail:    addForm.parentEmail, address: addForm.address,
//           city:           addForm.city, state: addForm.state,
//           section:        addForm.section || null, academicYear: addForm.academicYear || null,
//           programId:      addForm.programId || null, programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) {
//         setCredentials({ ...res.credentials, parentEmail: addForm.parentEmail });
//         setIsCredentialsModalOpen(true);
//       }
//       push('Student registered successfully!', 'success');
//       if (addForm.parentEmail) {
//         setTimeout(() => push(`Credentials emailed to ${addForm.parentEmail}`, 'email'), 600);
//       }
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || 'Failed to add student';
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       push(msg, 'error');
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? '').split(' ');
//     setEditForm({
//       firstName, lastName: rest.join(' '), email: student.user?.email ?? '',
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0, 10)   : '',
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
//       gender: student.gender ?? '', bloodGroup: student.bloodGroup ?? '', rollNumber: student.rollNumber ?? '',
//       section: student.section ?? '', academicYear: student.academicYear ?? '',
//       parentName: student.parentName ?? '', parentPhone: student.parentPhone ?? '',
//       parentEmail: student.parentEmail ?? '', city: student.city ?? '', state: student.state ?? '',
//       address: student.address ?? '', programId: student.programId ?? '',
//       programLevelId: student.programLevelId ?? '', photoUrl: student.photoUrl ?? '',
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           fullName:       `${editForm.firstName} ${editForm.lastName}`,
//           photoUrl:       photoUrl ?? undefined,
//           admissionDate:  editForm.admissionDate || null,
//           dateOfBirth:    editForm.dateOfBirth, gender: editForm.gender,
//           bloodGroup:     editForm.bloodGroup, rollNumber: editForm.rollNumber,
//           parentName:     editForm.parentName, parentPhone: editForm.parentPhone,
//           parentEmail:    editForm.parentEmail, address: editForm.address,
//           city:           editForm.city, state: editForm.state,
//           section:        editForm.section || null, academicYear: editForm.academicYear || null,
//           programId:      editForm.programId || null, programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       push('Student updated successfully', 'success');
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { push(err.message || 'Failed to update student', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: 'DELETE' });
//       push('Student deleted successfully', 'success');
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { push('Failed to delete student', 'error'); }
//     setSubmitting(false);
//   };

//   // ── Step 1: show confirm dialog with student info + parent email ─────────────
//   const openGeneratePasswordConfirm = (student: any) => setConfirmGenFor(student);

//   // ── Step 2: actual generate — called after admin confirms ────────────────────
//   const handleGeneratePassword = async () => {
//     const student = confirmGenFor;
//     setConfirmGenFor(null);
//     if (!student) return;
//     setGenLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: 'POST' });

//       setCredentials({
//         studentId:       res.studentId,
//         email:           res.email,
//         password:        res.password,
//         parentEmail:     res.parentEmail,
//         emailSent:       res.emailSent,
//         passwordVersion: res.passwordVersion,
//       });
//       setIsCredentialsModalOpen(true);

//       // Toast 1: password generated + session signed out
//       push('New password generated — previous session signed out', 'info');

//       // Toast 2: email status
//       if (res.emailSent && res.parentEmail) {
//         setTimeout(() => push(`📧 Credentials emailed to ${res.parentEmail}`, 'email'), 700);
//       } else if (res.parentEmail && !res.emailSent) {
//         setTimeout(() => push('Email delivery failed — share credentials manually', 'error'), 700);
//       } else {
//         setTimeout(() => push('No parent email on file — share credentials manually', 'info'), 700);
//       }
//     } catch (err: any) {
//       push(err.message || 'Failed to generate password', 'error');
//     }
//     setGenLoading(false);
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { openPrintWindow(await buildReportHTML(res.report)); }
//       else          { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { push('Failed to load report', 'error'); }
//     setReportLoading(false);
//   };

//   const avatarGradients = [
//     'linear-gradient(135deg,#e91e8c,#c2185b)',
//     'linear-gradient(135deg,#9c27b0,#7b1fa2)',
//     'linear-gradient(135deg,#FF6B6B,#FFB347)',
//   ];
//   const hasFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {/* ── Confirm generate-password dialog ── */}
//       {confirmGenFor && (
//         <ConfirmSendDialog
//           student={confirmGenFor}
//           onConfirm={handleGeneratePassword}
//           onCancel={() => setConfirmGenFor(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>Add Student</GradientButton>
//       </div>

//       {/* Table card */}
//       <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
//         {/* Filters */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//           {hasFilters && (
//             <button onClick={() => { setProgramFilter(''); setSectionFilter(''); setStudentSearch(''); setStatusFilter(''); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto" style={{ minHeight: 400, scrollbarWidth: 'thin', scrollbarColor: '#e91e8c55 #f0eef8' }}>
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="text-left border-collapse" style={{ minWidth: 1100, width: '100%' }}>
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {['', 'ID', 'Student', 'Program', 'Level', 'Section', 'Acad. Year', 'Parent', 'Status', 'Actions'].map((h) => (
//                     <th key={h} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors">
//                     <td className="pl-4 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl
//                           ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">{s.fullName?.[0]?.toUpperCase() ?? '?'}</div>}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     <td className="px-4 py-4">
//                       <p className="text-sm font-bold text-[#1A1A2E] whitespace-nowrap">{s.fullName}</p>
//                       <p className="text-xs text-gray-400">{s.user?.email ?? '—'}</p>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? '—'}</td>
//                     <td className="px-4 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{s.parentName ?? '—'}</td>
//                     <td className="px-4 py-4">
//                       <StatusBadge
//                         status={(s.status ?? 'Active') as UserStatus}
//                         loading={togglingStatus === s.id}
//                         onClick={() => {
//                           // Only allow toggling Active ↔ Inactive (not Suspended/Deleted)
//                           if (s.status === 'Suspended' || s.status === 'Deleted') {
//                             push(`Cannot toggle — student is ${s.status}`, 'error');
//                             return;
//                           }
//                           handleToggleStatus(s);
//                         }}
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <ActionsMenu
//                         onEdit={() => openEdit(s)}
//                         onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                         onGeneratePassword={() => openGeneratePasswordConfirm(s)}
//                         onViewReport={() => fetchReport(s, false)}
//                         onDownloadReport={() => fetchReport(s, true)}
//                         onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                       />
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan={10} className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center text-gray-400">
//                       <Search size={24} className="text-gray-300 mb-3" />
//                       <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                       <p className="text-sm mt-1">Try adjusting your search or filters.</p>
//                     </div>
//                   </td></tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs}
//             photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? 'Registering...' : 'Register Student'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs}
//             photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? 'Saving...' : 'Save Changes'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── FEES MODAL ── */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent))}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading
//           ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//           : reportData && (
//             <div className="space-y-4">
//               <StudentReport report={reportData} />
//               <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={async () => openPrintWindow(await buildReportHTML(reportData))}
//                   className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                   <Download size={16} /> Download PDF
//                 </button>
//                 <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen}
//         onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
//         title="Student Login Credentials">
//         {credentials && (
//           <div className="space-y-4">
//             {/* One-time warning */}
//             <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//               <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#FF6B6B]">
//                 The password below is shown <span className="font-black">only once</span>. Copy it now before closing this dialog.
//               </p>
//             </div>

//             {/* Email delivery status */}
//             {credentials.emailSent && credentials.parentEmail ? (
//               <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
//                 <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-black text-[#4ECDC4]">✓ Login credentials sent to parent</p>
//                   <p className="text-xs font-bold text-[#1A1A2E] mt-0.5 break-all">{credentials.parentEmail}</p>
//                   <p className="text-[10px] text-gray-400 mt-1">The parent can now log in using the credentials below.</p>
//                 </div>
//                 <Check size={16} className="text-[#4ECDC4] flex-shrink-0 mt-0.5" />
//               </div>
//             ) : credentials.parentEmail && !credentials.emailSent ? (
//               <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//                 <div className="min-w-0">
//                   <p className="text-xs font-black text-[#FF6B6B]">Email delivery failed</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     Please share these credentials manually with the parent at{' '}
//                     <span className="font-bold break-all">{credentials.parentEmail}</span>
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-xs font-medium text-amber-700">No parent email on record — share these credentials manually with the parent.</p>
//               </div>
//             )}

//             {/* Credential rows */}
//             <div className="space-y-3">
//               <CopyRow label="Student ID"         value={credentials.studentId} />
//               <CopyRow label="Login Email"        value={credentials.email} />
//               <CopyRow label="Temporary Password" value={credentials.password} mono />
//               {credentials.parentEmail && (
//                 <div className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//                     <Mail size={10} /> Copy credentials to this parent email
//                   </p>
//                   <p className="text-sm font-bold text-[#1A1A2E] break-all">{credentials.parentEmail}</p>
//                   {credentials.emailSent
//                     ? <p className="text-[10px] text-[#4ECDC4] font-bold mt-1 flex items-center gap-1"><Check size={10} /> Already sent automatically</p>
//                     : <p className="text-[10px] text-[#FF6B6B] font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Email failed — share manually</p>}
//                 </div>
//               )}
//             </div>

//             {/* Session signed-out + version notice */}
//             <div className="flex items-start gap-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl px-4 py-3">
//               <ShieldAlert size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs font-medium text-[#6d28d9]">
//                   The student's previous login session has been automatically signed out.
//                 </p>
//                 {credentials.passwordVersion !== undefined && (
//                   <p className="text-[10px] font-black text-[#A78BFA] mt-1">
//                     Password version: <span className="bg-[#A78BFA]/20 px-2 py-0.5 rounded-full">v{credentials.passwordVersion}</span>
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//               <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This permanently deletes the student and all their records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Global toast stack */}
//       <ToastStack toasts={toasts} />

//       <style dangerouslySetInnerHTML={{ __html: `
//         .overflow-x-auto::-webkit-scrollbar { height: 6px; }
//         .overflow-x-auto::-webkit-scrollbar-track { background: #f0eef8; border-radius: 6px; }
//         .overflow-x-auto::-webkit-scrollbar-thumb { background: #e91e8c66; border-radius: 6px; }
//         .overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #e91e8c99; }
//       ` }} />
//     </div>
//   );
// }














// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   CheckCircle2, Clock, AlertOctagon,
//   Mail, ShieldAlert, Send,
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/helpers/supabaseClient';

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ['A', 'B', 'C', 'D'];
// const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
// const CITIES         = ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior'];
// const SCHOOL_NAME    = 'Ascento Playschool';
// const SCHOOL_TAGLINE = 'Play School';
// const SCHOOL_WEBSITE = 'https://ascentoabacus.com/';
// const SCHOOL_PHONE   = '+91 9810366417';
// const SCHOOL_ADDRESS = 'Ascento Playschool, Dwarka, New Delhi';
// const FEE_TYPES      = ['Tuition','Admission','Activity','Transport','Exam','Library','Uniform','Other'];
// const FEE_STATUSES   = ['Pending','Paid','Partial','Overdue','Waived'] as const;
// type FeeStatus = typeof FEE_STATUSES[number];
// const CARD_W = 208;

// type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

// function makeApiFetch(token: string | null) {
//   return async (path: string, options?: RequestInit) => {
//     const res = await fetch(path, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...(options?.headers ?? {}),
//       },
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   };
// }

// async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
//   const ext  = file.name.split('.').pop() ?? 'jpg';
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, '_')}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage
//     .from('student-assets')
//     .upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from('student-assets').getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(html: string) {
//   const win = window.open('', '_blank', 'width=800,height=900');
//   if (!win) { alert('Please allow popups to print/download.'); return; }
//   win.document.write(html);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const r    = new FileReader();
//       r.onload  = () => resolve(r.result as string);
//       r.onerror = reject;
//       r.readAsDataURL(blob);
//     });
//   } catch { return ''; }
// }

// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
// interface StudentFee {
//   id: string; feeType: string; description: string | null;
//   amount: number; paidAmount: number; dueDate: string | null;
//   paidDate: string | null; status: FeeStatus; month: string | null;
//   academicYear: string | null; receiptNo: string | null; remarks: string | null;
//   createdAt: string;
// }
// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// interface CredentialsData {
//   studentId:       string;
//   email:           string;
//   password:        string;
//   parentEmail?:    string;
//   emailSent?:      boolean;
//   emailError?:     string;
//   passwordVersion?: number;
// }

// // ── Toast system ──────────────────────────────────────────────────────────────
// type ToastKind = 'success' | 'error' | 'info' | 'email';
// interface Toast { id: number; msg: string; kind: ToastKind; }

// const TOAST_COLORS: Record<ToastKind, string> = {
//   success: 'from-[#4ECDC4] to-[#3db8af]',
//   error:   'from-[#FF6B6B] to-[#e91e8c]',
//   info:    'from-[#A78BFA] to-[#9c27b0]',
//   email:   'from-[#FFB347] to-[#FF6B6B]',
// };
// const TOAST_ICONS: Record<ToastKind, React.ReactNode> = {
//   success: <CheckCircle2 size={15} />,
//   error:   <AlertCircle  size={15} />,
//   info:    <ShieldAlert  size={15} />,
//   email:   <Mail         size={15} />,
// };

// function ToastStack({ toasts }: { toasts: Toast[] }) {
//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
//       {toasts.map((t) => (
//         <div key={t.id}
//           className={`bg-gradient-to-r ${TOAST_COLORS[t.kind]} text-white px-5 py-3.5 rounded-2xl font-bold text-sm
//             shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 max-w-sm pointer-events-auto
//             animate-in slide-in-from-bottom-4 duration-300`}>
//           {TOAST_ICONS[t.kind]}
//           <span>{t.msg}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToasts() {
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const ctr = useRef(0);
//   const push = useCallback((msg: string, kind: ToastKind = 'success') => {
//     const id = ++ctr.current;
//     setToasts((p) => [...p, { id, msg, kind }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
//   }, []);
//   return { toasts, push };
// }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const GradientButton = ({ children, onClick, icon: Icon, className = '', type = 'button', disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold
//       flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed
//       ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = 'hidden';
//     else        document.body.style.overflow = '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 bg-[#1A1A2E]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
//       style={{ paddingTop: 80, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full
//           ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col my-auto`}
//         style={{ maxHeight: 'calc(100vh - 104px)' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0"
//           style={{ scrollbarWidth: 'thin', scrollbarColor: '#e91e8c44 transparent' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// function ConfirmSendDialog({
//   student,
//   onConfirm,
//   onCancel,
// }: {
//   student: any;
//   onConfirm: () => void;
//   onCancel: () => void;
// }) {
//   const hasParentEmail = !!student?.parentEmail;
//   return (
//     <div className="fixed inset-0 z-[60] bg-[#1A1A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm p-6 space-y-4">
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-[#FFB347]/15 flex items-center justify-center flex-shrink-0">
//             <KeyRound size={20} className="text-[#FFB347]" />
//           </div>
//           <div>
//             <p className="font-black text-[#1A1A2E] text-base">Generate New Password?</p>
//             <p className="text-xs text-gray-500 mt-0.5">For <span className="font-bold">{student?.fullName}</span></p>
//           </div>
//         </div>

//         <div className={`rounded-xl px-4 py-3 ${hasParentEmail ? 'bg-[#FFFDF7] border border-[#F0EEF8]' : 'bg-amber-50 border border-amber-200'}`}>
//           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//             <Mail size={10} /> Credentials will be emailed to
//           </p>
//           {hasParentEmail ? (
//             <p className="text-sm font-black text-[#1A1A2E] break-all">{student.parentEmail}</p>
//           ) : (
//             <p className="text-xs font-bold text-amber-700">⚠️ No parent email on file — you'll need to share credentials manually.</p>
//           )}
//         </div>

//         <ul className="space-y-1.5 text-xs text-gray-500">
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-[9px] font-black flex-shrink-0">1</span> A new strong password is generated</li>
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center text-[9px] font-black flex-shrink-0">2</span> All existing sessions are signed out</li>
//           {hasParentEmail && (
//             <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#FFB347]/20 text-[#FFB347] flex items-center justify-center text-[9px] font-black flex-shrink-0">3</span> Login credentials emailed to parent</li>
//           )}
//         </ul>

//         <div className="flex gap-3 pt-1">
//           <button onClick={onCancel}
//             className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FFB347] to-[#FF6B6B] hover:shadow-[0_6px_20px_rgba(255,179,71,0.4)] transition-all text-sm flex items-center justify-center gap-2">
//             <Send size={14} /> Yes, Generate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const FormInput = ({ label, type = 'text', placeholder, required = false, value, onChange, hint }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     {hint && (
//       <p className="text-[10px] font-bold text-[#FFB347] flex items-center gap-1.5">
//         <Mail size={10} className="flex-shrink-0" />{hint}
//       </p>
//     )}
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = 'Select...' }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === 'string'
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CopyRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied
//           ? 'text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10'
//           : 'text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]'}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void; }) {
//   const inputRef  = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith('image/')) return;
//     const r    = new FileReader();
//     r.onload  = (e) => setPreview(e.target?.result as string);
//     r.readAsDataURL(file);
//     onChange('pending', file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const sel = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {sel && sel.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {sel.hasLevels ? 'Level' : 'Class / Sub-group'}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {sel.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
//   apiFetch: (path: string, options?: RequestInit) => Promise<any>;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set('programLevelId', form.programLevelId);
//     if (form.section)        params.set('section', form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((r) => setForm((p: any) => ({ ...p, rollNumber: r.formatted ?? String(r.nextRollNumber ?? '') })))
//       .catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl}
//           onChange={(url, file) => { setPhotoFile(file); setForm((p: any) => ({ ...p, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ''} programLevelId={form.programLevelId ?? ''}
//             onProgramChange={(v) => setForm((p: any) => ({ ...p, programId: v, programLevelId: '', rollNumber: '' }))}
//             onLevelChange={(v) => setForm((p: any) => ({ ...p, programLevelId: v, rollNumber: '' }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((p: any) => ({ ...p, section: v, rollNumber: '' }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ''} onChange={(e) => set('rollNumber')(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set('admissionDate')} />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set('firstName')} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set('lastName')} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set('email')} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
//           <FormSelect label="Gender" options={['Male','Female','Other']} value={form.gender} onChange={set('gender')} />
//           <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} value={form.bloodGroup} onChange={set('bloodGroup')} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent &amp; Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set('parentName')} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"        value={form.parentPhone} onChange={set('parentPhone')} />
//           <FormInput
//             label="Parent Email"
//             type="email"
//             placeholder="parent@email.com"
//             value={form.parentEmail}
//             onChange={set('parentEmail')}
//             hint="Login credentials & password resets are sent to this email — must be valid"
//           />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set('city')} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set('state')} />
//         </div>
//         <div className="flex items-start gap-3 bg-[#FFF8EE] border border-[#FFB347]/30 rounded-xl px-4 py-3">
//           <Mail size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
//           <p className="text-xs font-medium text-[#92650a]">
//             <span className="font-black">Important:</span> The parent email above must be a real, accessible inbox.
//             When you register this student or generate a new password, the login credentials
//             (Student ID &amp; password) will be automatically emailed to this address.
//           </p>
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set('address')} />
//       </div>
//     </div>
//   );
// }

// function StatusBadge({ status, onClick, loading }: { status: UserStatus; onClick: () => void; loading?: boolean }) {
//   const isActive = status === 'Active';
//   return (
//     <button onClick={onClick} disabled={loading}
//       title={`Click to ${isActive ? 'deactivate' : 'activate'} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30'
//           : status === 'Suspended'
//           ? 'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30 cursor-not-allowed'
//           : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30'
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status}
//     </button>
//   );
// }

// const FEE_CFG: Record<FeeStatus, { color: string; icon: any }> = {
//   Paid:    { color: '#4ECDC4', icon: CheckCircle2 },
//   Pending: { color: '#FFB347', icon: Clock },
//   Partial: { color: '#A78BFA', icon: TrendingUp },
//   Overdue: { color: '#FF6B6B', icon: AlertOctagon },
//   Waived:  { color: '#6BCB77', icon: CheckCircle2 },
// };
// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const c = FEE_CFG[status] ?? FEE_CFG.Pending;
//   return (
//     <span style={{ color: c.color, background: c.color + '18', border: `1px solid ${c.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <c.icon size={10} /> {status}
//     </span>
//   );
// }

// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: any) {
//   const set = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types" value={form.feeType ?? ''} onChange={(e) => set('feeType')(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set('status')} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set('amount')} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set('paidAmount')} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set('dueDate')} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set('paidDate')} />
//         <FormInput label="Month"     placeholder="June 2025"       value={form.month}        onChange={set('month')} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001"       value={form.receiptNo}    onChange={set('receiptNo')} />
//         <FormInput label="Description"  placeholder="Monthly fee"  value={form.description}  onChange={set('description')} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ''} onChange={(e) => set('remarks')(e.target.value)} rows={2}
//           placeholder="Any additional notes..."
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? 'Saving...' : isEdit ? 'Update Fee' : 'Add Fee'}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// function FeesSection({ student, apiFetch }: { student: any; apiFetch: ReturnType<typeof makeApiFetch> }) {
//   const [fees,       setFees]       = useState<StudentFee[]>([]);
//   const [summary,    setSummary]    = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,    setLoading]    = useState(true);
//   const [view,       setView]       = useState<'list' | 'add' | 'edit'>('list');
//   const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
//   const [feeForm,    setFeeForm]    = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const { toasts, push }            = useToasts();

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const r = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(r.fees ?? []);
//       setSummary(r.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { push('Failed to load fees', 'error'); }
//     setLoading(false);
//   }, [student.id]);
//   useEffect(() => { load(); }, [load]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { push('Fee type and amount required', 'error'); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, { method: 'POST',
//         body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || 'Pending' }) });
//       push('Fee record added', 'success'); setFeeForm({}); setView('list'); load();
//     } catch (err: any) { push(err.message || 'Failed to add fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, { method: 'PATCH', body: JSON.stringify(feeForm) });
//       push('Fee updated', 'success'); setView('list'); setEditingFee(null); load();
//     } catch (err: any) { push(err.message || 'Failed to update fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: 'DELETE' });
//       push('Fee deleted', 'success'); load();
//     } catch { push('Failed to delete fee', 'error'); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType: fee.feeType, description: fee.description ?? '', amount: String(fee.amount),
//       paidAmount: String(fee.paidAmount), dueDate: fee.dueDate?.slice(0, 10) ?? '',
//       paidDate: fee.paidDate?.slice(0, 10) ?? '', status: fee.status,
//       month: fee.month ?? '', academicYear: fee.academicYear ?? '',
//       receiptNo: fee.receiptNo ?? '', remarks: fee.remarks ?? '',
//     });
//     setEditingFee(fee); setView('edit');
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: 'Total Fees',  value: fmt(summary.totalAmount), color: '#1A1A2E', icon: Receipt },
//           { label: 'Amount Paid', value: fmt(summary.totalPaid),   color: '#4ECDC4', icon: CheckCircle2 },
//           { label: 'Balance Due', value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? '#FF6B6B' : '#4ECDC4', icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>
//       {view === 'list' && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: 'Pending', paidAmount: '0' }); setView('add'); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const bal = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${bal > 0 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>{fmt(bal)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span></div>}
//                         </div>
//                         {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
//                           className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                     <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
//                       {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//       {view === 'add' && (
//         <>
//           <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView('list'); setFeeForm({}); }} />
//         </>
//       )}
//       {view === 'edit' && editingFee && (
//         <>
//           <button onClick={() => { setView('list'); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView('list'); setEditingFee(null); }} isEdit />
//         </>
//       )}
//       <ToastStack toasts={toasts} />
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
//   const [open,    setOpen]    = useState(false);
//   const [pos,     setPos]     = useState({ top: 0, right: 0 });
//   const btnRef  = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleOpen = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (btnRef.current) {
//       const r = btnRef.current.getBoundingClientRect();
//       setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
//     }
//     setOpen((v) => !v);
//   };

//   useEffect(() => {
//     if (!open) return;
//     const close = (e: MouseEvent) => {
//       if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
//       setOpen(false);
//     };
//     document.addEventListener('click', close, true);
//     return () => document.removeEventListener('click', close, true);
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const close = () => setOpen(false);
//     window.addEventListener('scroll', close, true);
//     window.addEventListener('resize', close);
//     return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
//   }, [open]);

//   const items = [
//     { icon: Pencil,      label: 'Edit',             color: '#FFB347', action: onEdit },
//     { icon: KeyRound,    label: 'Generate Password', color: '#4ECDC4', action: onGeneratePassword },
//     { icon: IdCard,      label: 'View ID Card',      color: '#A78BFA', action: onViewIdCard },
//     { icon: IndianRupee, label: 'Manage Fees',       color: '#e91e8c', action: onViewFees },
//     { icon: Eye,         label: 'View Report',       color: '#64B6FF', action: onViewReport },
//     { icon: Download,    label: 'Download Report',   color: '#6BCB77', action: onDownloadReport },
//     { icon: Trash2,      label: 'Delete',            color: '#FF6B6B', action: onDelete },
//   ];

//   return (
//     <>
//       <button ref={btnRef} onClick={handleOpen}
//         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//         title="Actions">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div ref={menuRef}
//           style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
//           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label}
//               onClick={(e) => { e.stopPropagation(); setOpen(false); setTimeout(action, 10); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === 'Delete' ? '#FF6B6B' : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// // ── ID Card ────────────────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   return (
//     <div className="flex justify-center">
//       <div style={{ width: w, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eee', fontFamily: 'Arial,sans-serif' }}>
//         <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
//           <div>
//             <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 10px' }}>
//           <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {student.photoUrl
//               ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//           </div>
//         </div>
//         <div style={{ padding: '0 11px 8px', fontSize: 8 }}>
//           {[['Name', student.fullName ?? '—'], ['D.O.B', dob], ['Adm Date', admDate], ['Mob.', student.parentPhone ?? '—'],
//             ['Class', student.programLevel?.name ?? student.program?.name ?? '—'], ['Parent', student.parentName ?? '—']].map(([l, v]) => (
//             <div key={l} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//               <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{l}</span>
//               <span style={{ color: '#555', fontWeight: 600 }}>: &nbsp;{v}</span>
//             </div>
//           ))}
//           {student.bloodGroup && <div style={{ display: 'flex', gap: 3 }}><span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span><span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//         </div>
//         <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%' }}>
//           <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//           <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = ''; if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }
//   const admDate = s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = s.dateOfBirth   ? new Date(s.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   const photo = photoSrc
//     ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c"/>`
//     : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${s.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photo}</div><div style="padding:0 11px 8px;font-size:8px">${[['Name',s.fullName??'—'],['D.O.B',dob],['Adm Date',admDate],['Mob.',s.parentPhone??'—'],['Class',s.programLevel?.name??s.program?.name??'—'],['Parent',s.parentName??'—']].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join('')}${s.bloodGroup?`<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: ${s.bloodGroup}</span></div>`:''}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }

// async function buildReportHTML(r: any): Promise<string> {
//   let photoHtml = '';
//   if (r.photoUrl) { const b = await urlToBase64(r.photoUrl); if (b) photoHtml = `<img src="${b}" style="width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0"/>`; }
//   const admDate = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const addr    = [r.address, r.city, r.state].filter(Boolean).join(', ') || '—';
//   const gen     = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
//   const fields: [string, string][] = [
//     ['Student ID', r.studentId], ['Full Name', r.fullName], ['Email', r.email ?? '—'],
//     ['Date of Birth', r.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', r.gender ?? '—'], ['Blood Group', r.bloodGroup ?? '—'],
//     ['Program', r.program?.name ?? '—'], ['Level / Class', r.level?.name ?? '—'],
//     ['Section', r.section ? `Section ${r.section}` : '—'], ['Roll Number', r.rollNumber ?? '—'],
//     ['Academic Year', r.academicYear ?? '—'], ['Status', r.status ?? '—'],
//     ['Parent Name', r.parentName ?? '—'], ['Parent Phone', r.parentPhone ?? '—'],
//     ['Parent Email', r.parentEmail ?? '—'], ['Address', addr],
//   ];
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><div style="font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px">${SCHOOL_NAME}</div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7;font-size:12px;margin-top:3px">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:6px">Generated: ${gen}</div></div></div><div class="grid">${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join('')}</div><div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
// }

// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const fields: [string, string][] = [
//     ['Student ID', report.studentId], ['Full Name', report.fullName], ['Email', report.email ?? '—'],
//     ['Date of Birth', report.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', report.gender ?? '—'], ['Blood Group', report.bloodGroup ?? '—'],
//     ['Program', report.program?.name ?? '—'], ['Level / Class', report.level?.name ?? '—'],
//     ['Section', report.section ? `Section ${report.section}` : '—'], ['Roll Number', report.rollNumber ?? '—'],
//     ['Academic Year', report.academicYear ?? '—'], ['Status', report.status ?? '—'],
//     ['Parent Name', report.parentName ?? '—'], ['Parent Phone', report.parentPhone ?? '—'],
//     ['Parent Email', report.parentEmail ?? '—'],
//     ['Address', [report.address, report.city, report.state].filter(Boolean).join(', ') || '—'],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//               {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function StudentsView() {
//   const { token } = useAuth();
//   const apiFetch  = makeApiFetch(token);
//   const { toasts, push } = useToasts();

//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [programFilter, setProgramFilter] = useState('');
//   const [sectionFilter, setSectionFilter] = useState('');
//   const [statusFilter,  setStatusFilter]  = useState('');

//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);

//   const [confirmGenFor, setConfirmGenFor] = useState<any>(null);

//   const [editingStudent,   setEditingStudent]   = useState<any>(null);
//   const [studentToDelete,  setStudentToDelete]  = useState<any>(null);
//   const [idCardStudent,    setIdCardStudent]    = useState<any>(null);
//   const [feesStudent,      setFeesStudent]      = useState<any>(null);
//   const [reportData,       setReportData]       = useState<any>(null);
//   const [credentials,      setCredentials]      = useState<CredentialsData | null>(null);

//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
//   const [genLoading,     setGenLoading]     = useState(false);

//   const [addForm,       setAddForm]       = useState<any>({});
//   const [editForm,      setEditForm]      = useState<any>({});
//   const [addPhotoFile,  setAddPhotoFile]  = useState<File | null>(null);
//   const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch('/api/admin/programs'); setPrograms(r.programs ?? []); } catch {}
//   }, [token]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = '', prog = '', sec = '', stat = '') => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: '100' });
//       if (prog) p.set('programId', prog);
//       if (sec)  p.set('section', sec);
//       if (stat) p.set('status', stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { push('Failed to load students', 'error'); }
//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   const handleToggleStatus = async (student: any) => {
//     const newStatus: UserStatus = student.status === 'Active' ? 'Inactive' : 'Active';
//     setTogglingStatus(student.id);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: newStatus }),
//       });
//       push(res.message ?? `Student ${newStatus === 'Active' ? 'activated' : 'deactivated'}`,
//            newStatus === 'Active' ? 'success' : 'info');
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       push(err.message || 'Failed to update status', 'error');
//     }
//     setTogglingStatus(null);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       push('First name, last name and email are required', 'error'); return;
//     }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       const res = await apiFetch('/api/admin/students', {
//         method: 'POST',
//         body: JSON.stringify({
//           fullName:       `${addForm.firstName} ${addForm.lastName}`,
//           email:          addForm.email, photoUrl,
//           admissionDate:  addForm.admissionDate || null,
//           dateOfBirth:    addForm.dateOfBirth, gender: addForm.gender,
//           bloodGroup:     addForm.bloodGroup, rollNumber: addForm.rollNumber,
//           parentName:     addForm.parentName, parentPhone: addForm.parentPhone,
//           parentEmail:    addForm.parentEmail, address: addForm.address,
//           city:           addForm.city, state: addForm.state,
//           section:        addForm.section || null, academicYear: addForm.academicYear || null,
//           programId:      addForm.programId || null, programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) {
//         setCredentials({ ...res.credentials, parentEmail: addForm.parentEmail });
//         setIsCredentialsModalOpen(true);
//       }
//       push('Student registered successfully!', 'success');
//       if (addForm.parentEmail) {
//         setTimeout(() => push(`Credentials emailed to ${addForm.parentEmail}`, 'email'), 600);
//       }
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || 'Failed to add student';
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       push(msg, 'error');
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? '').split(' ');
//     setEditForm({
//       firstName, lastName: rest.join(' '), email: student.user?.email ?? '',
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0, 10)   : '',
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
//       gender: student.gender ?? '', bloodGroup: student.bloodGroup ?? '', rollNumber: student.rollNumber ?? '',
//       section: student.section ?? '', academicYear: student.academicYear ?? '',
//       parentName: student.parentName ?? '', parentPhone: student.parentPhone ?? '',
//       parentEmail: student.parentEmail ?? '', city: student.city ?? '', state: student.state ?? '',
//       address: student.address ?? '', programId: student.programId ?? '',
//       programLevelId: student.programLevelId ?? '', photoUrl: student.photoUrl ?? '',
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           fullName:       `${editForm.firstName} ${editForm.lastName}`,
//           photoUrl:       photoUrl ?? undefined,
//           admissionDate:  editForm.admissionDate || null,
//           dateOfBirth:    editForm.dateOfBirth, gender: editForm.gender,
//           bloodGroup:     editForm.bloodGroup, rollNumber: editForm.rollNumber,
//           parentName:     editForm.parentName, parentPhone: editForm.parentPhone,
//           parentEmail:    editForm.parentEmail, address: editForm.address,
//           city:           editForm.city, state: editForm.state,
//           section:        editForm.section || null, academicYear: editForm.academicYear || null,
//           programId:      editForm.programId || null, programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       push('Student updated successfully', 'success');
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { push(err.message || 'Failed to update student', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: 'DELETE' });
//       push('Student deleted successfully', 'success');
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { push('Failed to delete student', 'error'); }
//     setSubmitting(false);
//   };

//   const openGeneratePasswordConfirm = (student: any) => setConfirmGenFor(student);

//   const handleGeneratePassword = async () => {
//     const student = confirmGenFor;
//     setConfirmGenFor(null);
//     if (!student) return;
//     setGenLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: 'POST' });

//       setCredentials({
//         studentId:       res.studentId,
//         email:           res.email,
//         password:        res.password,
//         parentEmail:     res.parentEmail,
//         emailSent:       res.emailSent,
//         emailError:      res.emailError,
//         passwordVersion: res.passwordVersion,
//       });
//       setIsCredentialsModalOpen(true);

//       push('New password generated — previous session signed out', 'info');

//       if (res.emailSent && res.parentEmail) {
//         setTimeout(() => push(`📧 Credentials emailed to ${res.parentEmail}`, 'email'), 700);
//       } else if (res.parentEmail && !res.emailSent) {
//         setTimeout(() => push('Email delivery failed — share credentials manually', 'error'), 700);
//       } else {
//         setTimeout(() => push('No parent email on file — share credentials manually', 'info'), 700);
//       }
//     } catch (err: any) {
//       push(err.message || 'Failed to generate password', 'error');
//     }
//     setGenLoading(false);
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { openPrintWindow(await buildReportHTML(res.report)); }
//       else          { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { push('Failed to load report', 'error'); }
//     setReportLoading(false);
//   };

//   const avatarGradients = [
//     'linear-gradient(135deg,#e91e8c,#c2185b)',
//     'linear-gradient(135deg,#9c27b0,#7b1fa2)',
//     'linear-gradient(135deg,#FF6B6B,#FFB347)',
//   ];
//   const hasFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {confirmGenFor && (
//         <ConfirmSendDialog
//           student={confirmGenFor}
//           onConfirm={handleGeneratePassword}
//           onCancel={() => setConfirmGenFor(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>Add Student</GradientButton>
//       </div>

//       {/* Table card */}
//       <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
//         {/* Filters */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//           {hasFilters && (
//             <button onClick={() => { setProgramFilter(''); setSectionFilter(''); setStudentSearch(''); setStatusFilter(''); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* ── TABLE — sticky Status + Actions columns on the right ── */}
//         <div className="overflow-x-auto students-table-scroll" style={{ minHeight: 400 }}>
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="text-left border-collapse" style={{ minWidth: 900, width: '100%' }}>
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {/* Scrollable columns */}
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap w-12"></th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ID</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Program</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Level</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Section</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Acad. Year</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Parent</th>
//                   {/* ── Sticky right columns ── */}
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap sticky right-[52px] bg-[#FFFDF7] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)]">
//                     Status
//                   </th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap sticky right-0 bg-[#FFFDF7] z-10 w-[52px]">
//                     {/* Actions header — blank, icon implies meaning */}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     {/* Photo */}
//                     <td className="pl-4 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl
//                           ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">{s.fullName?.[0]?.toUpperCase() ?? '?'}</div>}
//                       </div>
//                     </td>
//                     {/* ID */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     {/* Student name + email */}
//                     <td className="px-4 py-4">
//                       <p className="text-sm font-bold text-[#1A1A2E] whitespace-nowrap">{s.fullName}</p>
//                       <p className="text-xs text-gray-400">{s.user?.email ?? '—'}</p>
//                     </td>
//                     {/* Program */}
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     {/* Level */}
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     {/* Section */}
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     {/* Academic Year */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? '—'}</td>
//                     {/* Parent */}
//                     <td className="px-4 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{s.parentName ?? '—'}</td>

//                     {/* ── Sticky: Status ── */}
//                     <td className="px-4 py-4 sticky right-[52px] bg-white group-hover:bg-[#FFFDF7] z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.04)] transition-colors">
//                       <StatusBadge
//                         status={(s.status ?? 'Active') as UserStatus}
//                         loading={togglingStatus === s.id}
//                         onClick={() => {
//                           if (s.status === 'Suspended' || s.status === 'Deleted') {
//                             push(`Cannot toggle — student is ${s.status}`, 'error');
//                             return;
//                           }
//                           handleToggleStatus(s);
//                         }}
//                       />
//                     </td>

//                     {/* ── Sticky: Actions ── */}
//                     <td className="px-3 py-4 sticky right-0 bg-white group-hover:bg-[#FFFDF7] z-10 transition-colors w-[52px]">
//                       <ActionsMenu
//                         onEdit={() => openEdit(s)}
//                         onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                         onGeneratePassword={() => openGeneratePasswordConfirm(s)}
//                         onViewReport={() => fetchReport(s, false)}
//                         onDownloadReport={() => fetchReport(s, true)}
//                         onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                       />
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan={10} className="px-6 py-20 text-center">
//                     <div className="flex flex-col items-center text-gray-400">
//                       <Search size={24} className="text-gray-300 mb-3" />
//                       <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                       <p className="text-sm mt-1">Try adjusting your search or filters.</p>
//                     </div>
//                   </td></tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs}
//             photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? 'Registering...' : 'Register Student'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs}
//             photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? 'Saving...' : 'Save Changes'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── FEES MODAL ── */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent))}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading
//           ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//           : reportData && (
//             <div className="space-y-4">
//               <StudentReport report={reportData} />
//               <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={async () => openPrintWindow(await buildReportHTML(reportData))}
//                   className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                   <Download size={16} /> Download PDF
//                 </button>
//                 <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen}
//         onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
//         title="Student Login Credentials">
//         {credentials && (
//           <div className="space-y-4">
//             {/* One-time warning */}
//             <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//               <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#FF6B6B]">
//                 The password below is shown <span className="font-black">only once</span>. Copy it now before closing.
//               </p>
//             </div>

//             {/* Email delivery status */}
//             {credentials.emailSent && credentials.parentEmail ? (
//               <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
//                 <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-black text-[#4ECDC4]">✓ Credentials emailed to parent</p>
//                   <p className="text-xs font-bold text-[#1A1A2E] mt-0.5 break-all">{credentials.parentEmail}</p>
//                   <p className="text-[10px] text-gray-400 mt-1">The parent can log in using the credentials below.</p>
//                 </div>
//                 <Check size={16} className="text-[#4ECDC4] flex-shrink-0 mt-0.5" />
//               </div>
//             ) : credentials.parentEmail && !credentials.emailSent ? (
//               <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//                 <div className="min-w-0">
//                   <p className="text-xs font-black text-[#FF6B6B]">Email delivery failed</p>
//                   {credentials.emailError && (
//                     <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{credentials.emailError}</p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">
//                     Share credentials manually with the parent at{' '}
//                     <span className="font-bold break-all">{credentials.parentEmail}</span>
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-xs font-medium text-amber-700">No parent email on record — share these credentials manually.</p>
//               </div>
//             )}

//             {/* Credential rows */}
//             <div className="space-y-3">
//               <CopyRow label="Student ID"         value={credentials.studentId} />
//               <CopyRow label="Login Email"        value={credentials.email} />
//               <CopyRow label="Temporary Password" value={credentials.password} mono />
//               {credentials.parentEmail && (
//                 <div className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//                     <Mail size={10} /> Parent email on file
//                   </p>
//                   <p className="text-sm font-bold text-[#1A1A2E] break-all">{credentials.parentEmail}</p>
//                   {credentials.emailSent
//                     ? <p className="text-[10px] text-[#4ECDC4] font-bold mt-1 flex items-center gap-1"><Check size={10} /> Credentials sent automatically</p>
//                     : <p className="text-[10px] text-[#FF6B6B] font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Email failed — share manually</p>}
//                 </div>
//               )}
//             </div>

//             {/* Session info */}
//             <div className="flex items-start gap-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl px-4 py-3">
//               <ShieldAlert size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#6d28d9]">
//                 The student's previous login session has been automatically signed out.
//               </p>
//             </div>

//             <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//               <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This permanently deletes the student and all their records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <ToastStack toasts={toasts} />

//       <style dangerouslySetInnerHTML={{ __html: `
//         .students-table-scroll::-webkit-scrollbar { height: 6px; }
//         .students-table-scroll::-webkit-scrollbar-track { background: #f0eef8; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb { background: #e91e8c66; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb:hover { background: #e91e8c99; }
//       ` }} />
//     </div>
//   );
// }


















// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   CheckCircle2, Clock, AlertOctagon,
//   Mail, ShieldAlert, Send,
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/helpers/supabaseClient';

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ['A', 'B', 'C', 'D'];
// const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
// const CITIES         = ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior'];
// const SCHOOL_NAME    = 'Ascento Playschool';
// const SCHOOL_TAGLINE = 'Play School';
// const SCHOOL_WEBSITE = 'https://ascentoabacus.com/';
// const SCHOOL_PHONE   = '+91 9810366417';
// const SCHOOL_ADDRESS = 'Ascento Playschool, Dwarka, New Delhi';
// const FEE_TYPES      = ['Tuition','Admission','Activity','Transport','Exam','Library','Uniform','Other'];
// const FEE_STATUSES   = ['Pending','Paid','Partial','Overdue','Waived'] as const;
// type FeeStatus = typeof FEE_STATUSES[number];
// const CARD_W = 208;

// type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

// function makeApiFetch(token: string | null) {
//   return async (path: string, options?: RequestInit) => {
//     const res = await fetch(path, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...(options?.headers ?? {}),
//       },
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   };
// }

// async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
//   const ext  = file.name.split('.').pop() ?? 'jpg';
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, '_')}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage
//     .from('student-assets')
//     .upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from('student-assets').getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(html: string) {
//   const win = window.open('', '_blank', 'width=800,height=900');
//   if (!win) { alert('Please allow popups to print/download.'); return; }
//   win.document.write(html);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const r    = new FileReader();
//       r.onload  = () => resolve(r.result as string);
//       r.onerror = reject;
//       r.readAsDataURL(blob);
//     });
//   } catch { return ''; }
// }

// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
// interface StudentFee {
//   id: string; feeType: string; description: string | null;
//   amount: number; paidAmount: number; dueDate: string | null;
//   paidDate: string | null; status: FeeStatus; month: string | null;
//   academicYear: string | null; receiptNo: string | null; remarks: string | null;
//   createdAt: string;
// }
// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// interface CredentialsData {
//   studentId:       string;
//   email:           string;
//   password:        string;
//   parentEmail?:    string;
//   emailSent?:      boolean;
//   emailError?:     string;
//   passwordVersion?: number;
// }

// // ── Toast system ──────────────────────────────────────────────────────────────
// type ToastKind = 'success' | 'error' | 'info' | 'email';
// interface Toast { id: number; msg: string; kind: ToastKind; }

// const TOAST_COLORS: Record<ToastKind, string> = {
//   success: 'from-[#4ECDC4] to-[#3db8af]',
//   error:   'from-[#FF6B6B] to-[#e91e8c]',
//   info:    'from-[#A78BFA] to-[#9c27b0]',
//   email:   'from-[#FFB347] to-[#FF6B6B]',
// };
// const TOAST_ICONS: Record<ToastKind, React.ReactNode> = {
//   success: <CheckCircle2 size={15} />,
//   error:   <AlertCircle  size={15} />,
//   info:    <ShieldAlert  size={15} />,
//   email:   <Mail         size={15} />,
// };

// function ToastStack({ toasts }: { toasts: Toast[] }) {
//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
//       {toasts.map((t) => (
//         <div key={t.id}
//           className={`bg-gradient-to-r ${TOAST_COLORS[t.kind]} text-white px-5 py-3.5 rounded-2xl font-bold text-sm
//             shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 max-w-sm pointer-events-auto
//             animate-in slide-in-from-bottom-4 duration-300`}>
//           {TOAST_ICONS[t.kind]}
//           <span>{t.msg}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToasts() {
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const ctr = useRef(0);
//   const push = useCallback((msg: string, kind: ToastKind = 'success') => {
//     const id = ++ctr.current;
//     setToasts((p) => [...p, { id, msg, kind }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
//   }, []);
//   return { toasts, push };
// }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const GradientButton = ({ children, onClick, icon: Icon, className = '', type = 'button', disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold
//       flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed
//       ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = 'hidden';
//     else        document.body.style.overflow = '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 bg-[#1A1A2E]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
//       style={{ paddingTop: 80, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full
//           ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col my-auto`}
//         style={{ maxHeight: 'calc(100vh - 104px)' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0"
//           style={{ scrollbarWidth: 'thin', scrollbarColor: '#e91e8c44 transparent' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// function ConfirmSendDialog({ student, onConfirm, onCancel }: { student: any; onConfirm: () => void; onCancel: () => void; }) {
//   const hasParentEmail = !!student?.parentEmail;
//   return (
//     <div className="fixed inset-0 z-[60] bg-[#1A1A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm p-6 space-y-4">
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-[#FFB347]/15 flex items-center justify-center flex-shrink-0">
//             <KeyRound size={20} className="text-[#FFB347]" />
//           </div>
//           <div>
//             <p className="font-black text-[#1A1A2E] text-base">Generate New Password?</p>
//             <p className="text-xs text-gray-500 mt-0.5">For <span className="font-bold">{student?.fullName}</span></p>
//           </div>
//         </div>
//         <div className={`rounded-xl px-4 py-3 ${hasParentEmail ? 'bg-[#FFFDF7] border border-[#F0EEF8]' : 'bg-amber-50 border border-amber-200'}`}>
//           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//             <Mail size={10} /> Credentials will be emailed to
//           </p>
//           {hasParentEmail
//             ? <p className="text-sm font-black text-[#1A1A2E] break-all">{student.parentEmail}</p>
//             : <p className="text-xs font-bold text-amber-700">⚠️ No parent email on file — you'll need to share credentials manually.</p>}
//         </div>
//         <ul className="space-y-1.5 text-xs text-gray-500">
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-[9px] font-black flex-shrink-0">1</span> A new strong password is generated</li>
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center text-[9px] font-black flex-shrink-0">2</span> All existing sessions are signed out</li>
//           {hasParentEmail && (
//             <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#FFB347]/20 text-[#FFB347] flex items-center justify-center text-[9px] font-black flex-shrink-0">3</span> Login credentials emailed to parent</li>
//           )}
//         </ul>
//         <div className="flex gap-3 pt-1">
//           <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
//           <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FFB347] to-[#FF6B6B] hover:shadow-[0_6px_20px_rgba(255,179,71,0.4)] transition-all text-sm flex items-center justify-center gap-2">
//             <Send size={14} /> Yes, Generate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const FormInput = ({ label, type = 'text', placeholder, required = false, value, onChange, hint }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     {hint && <p className="text-[10px] font-bold text-[#FFB347] flex items-center gap-1.5"><Mail size={10} className="flex-shrink-0" />{hint}</p>}
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = 'Select...' }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === 'string'
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CopyRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? 'text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10' : 'text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]'}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void; }) {
//   const inputRef  = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith('image/')) return;
//     const r   = new FileReader();
//     r.onload  = (e) => setPreview(e.target?.result as string);
//     r.readAsDataURL(file);
//     onChange('pending', file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const sel = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {sel && sel.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {sel.hasLevels ? 'Level' : 'Class / Sub-group'}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {sel.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
//   apiFetch: (path: string, options?: RequestInit) => Promise<any>;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set('programLevelId', form.programLevelId);
//     if (form.section)        params.set('section', form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((r) => setForm((p: any) => ({ ...p, rollNumber: r.formatted ?? String(r.nextRollNumber ?? '') })))
//       .catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl}
//           onChange={(url, file) => { setPhotoFile(file); setForm((p: any) => ({ ...p, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ''} programLevelId={form.programLevelId ?? ''}
//             onProgramChange={(v) => setForm((p: any) => ({ ...p, programId: v, programLevelId: '', rollNumber: '' }))}
//             onLevelChange={(v) => setForm((p: any) => ({ ...p, programLevelId: v, rollNumber: '' }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((p: any) => ({ ...p, section: v, rollNumber: '' }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ''} onChange={(e) => set('rollNumber')(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set('admissionDate')} />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set('firstName')} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set('lastName')} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set('email')} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
//           <FormSelect label="Gender" options={['Male','Female','Other']} value={form.gender} onChange={set('gender')} />
//           <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} value={form.bloodGroup} onChange={set('bloodGroup')} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent &amp; Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set('parentName')} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"        value={form.parentPhone} onChange={set('parentPhone')} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set('parentEmail')}
//             hint="Login credentials & password resets are sent to this email — must be valid" />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set('city')} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set('state')} />
//         </div>
//         <div className="flex items-start gap-3 bg-[#FFF8EE] border border-[#FFB347]/30 rounded-xl px-4 py-3">
//           <Mail size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
//           <p className="text-xs font-medium text-[#92650a]">
//             <span className="font-black">Important:</span> The parent email above must be a real, accessible inbox.
//             When you register this student or generate a new password, the login credentials
//             (Student ID &amp; password) will be automatically emailed to this address.
//           </p>
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set('address')} />
//       </div>
//     </div>
//   );
// }

// function StatusBadge({ status, onClick, loading }: { status: UserStatus; onClick: () => void; loading?: boolean }) {
//   const isActive = status === 'Active';
//   return (
//     <button onClick={onClick} disabled={loading}
//       title={`Click to ${isActive ? 'deactivate' : 'activate'} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30'
//           : status === 'Suspended'
//           ? 'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30 cursor-not-allowed'
//           : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30'
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status}
//     </button>
//   );
// }

// const FEE_CFG: Record<FeeStatus, { color: string; icon: any }> = {
//   Paid:    { color: '#4ECDC4', icon: CheckCircle2 },
//   Pending: { color: '#FFB347', icon: Clock },
//   Partial: { color: '#A78BFA', icon: TrendingUp },
//   Overdue: { color: '#FF6B6B', icon: AlertOctagon },
//   Waived:  { color: '#6BCB77', icon: CheckCircle2 },
// };
// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const c = FEE_CFG[status] ?? FEE_CFG.Pending;
//   return (
//     <span style={{ color: c.color, background: c.color + '18', border: `1px solid ${c.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <c.icon size={10} /> {status}
//     </span>
//   );
// }

// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: any) {
//   const set = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types" value={form.feeType ?? ''} onChange={(e) => set('feeType')(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set('status')} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set('amount')} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set('paidAmount')} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set('dueDate')} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set('paidDate')} />
//         <FormInput label="Month"     placeholder="June 2025"       value={form.month}        onChange={set('month')} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001"       value={form.receiptNo}    onChange={set('receiptNo')} />
//         <FormInput label="Description"  placeholder="Monthly fee"  value={form.description}  onChange={set('description')} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ''} onChange={(e) => set('remarks')(e.target.value)} rows={2}
//           placeholder="Any additional notes..."
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? 'Saving...' : isEdit ? 'Update Fee' : 'Add Fee'}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// function FeesSection({ student, apiFetch }: { student: any; apiFetch: ReturnType<typeof makeApiFetch> }) {
//   const [fees,       setFees]       = useState<StudentFee[]>([]);
//   const [summary,    setSummary]    = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,    setLoading]    = useState(true);
//   const [view,       setView]       = useState<'list' | 'add' | 'edit'>('list');
//   const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
//   const [feeForm,    setFeeForm]    = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const { toasts, push }            = useToasts();

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const r = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(r.fees ?? []);
//       setSummary(r.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { push('Failed to load fees', 'error'); }
//     setLoading(false);
//   }, [student.id]);
//   useEffect(() => { load(); }, [load]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { push('Fee type and amount required', 'error'); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, { method: 'POST',
//         body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || 'Pending' }) });
//       push('Fee record added', 'success'); setFeeForm({}); setView('list'); load();
//     } catch (err: any) { push(err.message || 'Failed to add fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, { method: 'PATCH', body: JSON.stringify(feeForm) });
//       push('Fee updated', 'success'); setView('list'); setEditingFee(null); load();
//     } catch (err: any) { push(err.message || 'Failed to update fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: 'DELETE' });
//       push('Fee deleted', 'success'); load();
//     } catch { push('Failed to delete fee', 'error'); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType: fee.feeType, description: fee.description ?? '', amount: String(fee.amount),
//       paidAmount: String(fee.paidAmount), dueDate: fee.dueDate?.slice(0, 10) ?? '',
//       paidDate: fee.paidDate?.slice(0, 10) ?? '', status: fee.status,
//       month: fee.month ?? '', academicYear: fee.academicYear ?? '',
//       receiptNo: fee.receiptNo ?? '', remarks: fee.remarks ?? '',
//     });
//     setEditingFee(fee); setView('edit');
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: 'Total Fees',  value: fmt(summary.totalAmount), color: '#1A1A2E', icon: Receipt },
//           { label: 'Amount Paid', value: fmt(summary.totalPaid),   color: '#4ECDC4', icon: CheckCircle2 },
//           { label: 'Balance Due', value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? '#FF6B6B' : '#4ECDC4', icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>
//       {view === 'list' && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: 'Pending', paidAmount: '0' }); setView('add'); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const bal = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${bal > 0 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>{fmt(bal)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span></div>}
//                         </div>
//                         {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
//                           className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                     <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
//                       {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//       {view === 'add' && (
//         <>
//           <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView('list'); setFeeForm({}); }} />
//         </>
//       )}
//       {view === 'edit' && editingFee && (
//         <>
//           <button onClick={() => { setView('list'); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView('list'); setEditingFee(null); }} isEdit />
//         </>
//       )}
//       <ToastStack toasts={toasts} />
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
//   const [open, setOpen] = useState(false);
//   const [pos,  setPos]  = useState({ top: 0, right: 0 });
//   const btnRef  = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleOpen = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (btnRef.current) {
//       const r = btnRef.current.getBoundingClientRect();
//       setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
//     }
//     setOpen((v) => !v);
//   };

//   useEffect(() => {
//     if (!open) return;
//     const close = (e: MouseEvent) => {
//       if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
//       setOpen(false);
//     };
//     document.addEventListener('click', close, true);
//     return () => document.removeEventListener('click', close, true);
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const close = () => setOpen(false);
//     window.addEventListener('scroll', close, true);
//     window.addEventListener('resize', close);
//     return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
//   }, [open]);

//   const items = [
//     { icon: Pencil,      label: 'Edit',             color: '#FFB347', action: onEdit },
//     { icon: KeyRound,    label: 'Generate Password', color: '#4ECDC4', action: onGeneratePassword },
//     { icon: IdCard,      label: 'View ID Card',      color: '#A78BFA', action: onViewIdCard },
//     { icon: IndianRupee, label: 'Manage Fees',       color: '#e91e8c', action: onViewFees },
//     { icon: Eye,         label: 'View Report',       color: '#64B6FF', action: onViewReport },
//     { icon: Download,    label: 'Download Report',   color: '#6BCB77', action: onDownloadReport },
//     { icon: Trash2,      label: 'Delete',            color: '#FF6B6B', action: onDelete },
//   ];

//   return (
//     <>
//       <button ref={btnRef} onClick={handleOpen}
//         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//         title="Actions">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div ref={menuRef}
//           style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
//           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label}
//               onClick={(e) => { e.stopPropagation(); setOpen(false); setTimeout(action, 10); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === 'Delete' ? '#FF6B6B' : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// // ── ID Card ────────────────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   return (
//     <div className="flex justify-center">
//       <div style={{ width: w, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eee', fontFamily: 'Arial,sans-serif' }}>
//         <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
//           <div>
//             <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 10px' }}>
//           <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {student.photoUrl
//               ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//           </div>
//         </div>
//         <div style={{ padding: '0 11px 8px', fontSize: 8 }}>
//           {[['Name', student.fullName ?? '—'], ['D.O.B', dob], ['Adm Date', admDate], ['Mob.', student.parentPhone ?? '—'],
//             ['Class', student.programLevel?.name ?? student.program?.name ?? '—'], ['Parent', student.parentName ?? '—']].map(([l, v]) => (
//             <div key={l} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//               <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{l}</span>
//               <span style={{ color: '#555', fontWeight: 600 }}>: &nbsp;{v}</span>
//             </div>
//           ))}
//           {student.bloodGroup && <div style={{ display: 'flex', gap: 3 }}><span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span><span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//         </div>
//         <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%' }}>
//           <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//           <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = ''; if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }
//   const admDate = s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = s.dateOfBirth   ? new Date(s.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   const photo = photoSrc
//     ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c"/>`
//     : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${s.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photo}</div><div style="padding:0 11px 8px;font-size:8px">${[['Name',s.fullName??'—'],['D.O.B',dob],['Adm Date',admDate],['Mob.',s.parentPhone??'—'],['Class',s.programLevel?.name??s.program?.name??'—'],['Parent',s.parentName??'—']].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join('')}${s.bloodGroup?`<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: ${s.bloodGroup}</span></div>`:''}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }

// async function buildReportHTML(r: any): Promise<string> {
//   let photoHtml = '';
//   if (r.photoUrl) { const b = await urlToBase64(r.photoUrl); if (b) photoHtml = `<img src="${b}" style="width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0"/>`; }
//   const admDate = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const addr    = [r.address, r.city, r.state].filter(Boolean).join(', ') || '—';
//   const gen     = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
//   const fields: [string, string][] = [
//     ['Student ID', r.studentId], ['Full Name', r.fullName], ['Email', r.email ?? '—'],
//     ['Date of Birth', r.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', r.gender ?? '—'], ['Blood Group', r.bloodGroup ?? '—'],
//     ['Program', r.program?.name ?? '—'], ['Level / Class', r.level?.name ?? '—'],
//     ['Section', r.section ? `Section ${r.section}` : '—'], ['Roll Number', r.rollNumber ?? '—'],
//     ['Academic Year', r.academicYear ?? '—'], ['Status', r.status ?? '—'],
//     ['Parent Name', r.parentName ?? '—'], ['Parent Phone', r.parentPhone ?? '—'],
//     ['Parent Email', r.parentEmail ?? '—'], ['Address', addr],
//   ];
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><div style="font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px">${SCHOOL_NAME}</div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7;font-size:12px;margin-top:3px">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:6px">Generated: ${gen}</div></div></div><div class="grid">${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join('')}</div><div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
// }

// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const fields: [string, string][] = [
//     ['Student ID', report.studentId], ['Full Name', report.fullName], ['Email', report.email ?? '—'],
//     ['Date of Birth', report.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', report.gender ?? '—'], ['Blood Group', report.bloodGroup ?? '—'],
//     ['Program', report.program?.name ?? '—'], ['Level / Class', report.level?.name ?? '—'],
//     ['Section', report.section ? `Section ${report.section}` : '—'], ['Roll Number', report.rollNumber ?? '—'],
//     ['Academic Year', report.academicYear ?? '—'], ['Status', report.status ?? '—'],
//     ['Parent Name', report.parentName ?? '—'], ['Parent Phone', report.parentPhone ?? '—'],
//     ['Parent Email', report.parentEmail ?? '—'],
//     ['Address', [report.address, report.city, report.state].filter(Boolean).join(', ') || '—'],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//               {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function StudentsView() {
//   const { token } = useAuth();
//   const apiFetch  = makeApiFetch(token);
//   const { toasts, push } = useToasts();

//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [programFilter, setProgramFilter] = useState('');
//   const [sectionFilter, setSectionFilter] = useState('');
//   const [statusFilter,  setStatusFilter]  = useState('');

//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);

//   const [confirmGenFor, setConfirmGenFor] = useState<any>(null);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
//   const [feesStudent,     setFeesStudent]     = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<CredentialsData | null>(null);

//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
//   const [genLoading,     setGenLoading]     = useState(false);

//   const [addForm,       setAddForm]       = useState<any>({});
//   const [editForm,      setEditForm]      = useState<any>({});
//   const [addPhotoFile,  setAddPhotoFile]  = useState<File | null>(null);
//   const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch('/api/admin/programs'); setPrograms(r.programs ?? []); } catch {}
//   }, [token]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = '', prog = '', sec = '', stat = '') => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: '100' });
//       if (prog) p.set('programId', prog);
//       if (sec)  p.set('section', sec);
//       if (stat) p.set('status', stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { push('Failed to load students', 'error'); }
//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   const handleToggleStatus = async (student: any) => {
//     const newStatus: UserStatus = student.status === 'Active' ? 'Inactive' : 'Active';
//     setTogglingStatus(student.id);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: newStatus }),
//       });
//       push(res.message ?? `Student ${newStatus === 'Active' ? 'activated' : 'deactivated'}`, newStatus === 'Active' ? 'success' : 'info');
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       push(err.message || 'Failed to update status', 'error');
//     }
//     setTogglingStatus(null);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       push('First name, last name and email are required', 'error'); return;
//     }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       const res = await apiFetch('/api/admin/students', {
//         method: 'POST',
//         body: JSON.stringify({
//           fullName: `${addForm.firstName} ${addForm.lastName}`,
//           email: addForm.email, photoUrl,
//           admissionDate: addForm.admissionDate || null,
//           dateOfBirth: addForm.dateOfBirth, gender: addForm.gender,
//           bloodGroup: addForm.bloodGroup, rollNumber: addForm.rollNumber,
//           parentName: addForm.parentName, parentPhone: addForm.parentPhone,
//           parentEmail: addForm.parentEmail, address: addForm.address,
//           city: addForm.city, state: addForm.state,
//           section: addForm.section || null, academicYear: addForm.academicYear || null,
//           programId: addForm.programId || null, programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) {
//         setCredentials({ ...res.credentials, parentEmail: addForm.parentEmail });
//         setIsCredentialsModalOpen(true);
//       }
//       push('Student registered successfully!', 'success');
//       if (addForm.parentEmail) setTimeout(() => push(`Credentials emailed to ${addForm.parentEmail}`, 'email'), 600);
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || 'Failed to add student';
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       push(msg, 'error');
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? '').split(' ');
//     setEditForm({
//       firstName, lastName: rest.join(' '), email: student.user?.email ?? '',
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0, 10)   : '',
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
//       gender: student.gender ?? '', bloodGroup: student.bloodGroup ?? '', rollNumber: student.rollNumber ?? '',
//       section: student.section ?? '', academicYear: student.academicYear ?? '',
//       parentName: student.parentName ?? '', parentPhone: student.parentPhone ?? '',
//       parentEmail: student.parentEmail ?? '', city: student.city ?? '', state: student.state ?? '',
//       address: student.address ?? '', programId: student.programId ?? '',
//       programLevelId: student.programLevelId ?? '', photoUrl: student.photoUrl ?? '',
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           fullName: `${editForm.firstName} ${editForm.lastName}`,
//           photoUrl: photoUrl ?? undefined,
//           admissionDate: editForm.admissionDate || null,
//           dateOfBirth: editForm.dateOfBirth, gender: editForm.gender,
//           bloodGroup: editForm.bloodGroup, rollNumber: editForm.rollNumber,
//           parentName: editForm.parentName, parentPhone: editForm.parentPhone,
//           parentEmail: editForm.parentEmail, address: editForm.address,
//           city: editForm.city, state: editForm.state,
//           section: editForm.section || null, academicYear: editForm.academicYear || null,
//           programId: editForm.programId || null, programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       push('Student updated successfully', 'success');
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { push(err.message || 'Failed to update student', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: 'DELETE' });
//       push('Student deleted successfully', 'success');
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { push('Failed to delete student', 'error'); }
//     setSubmitting(false);
//   };

//   const openGeneratePasswordConfirm = (student: any) => setConfirmGenFor(student);

//   const handleGeneratePassword = async () => {
//     const student = confirmGenFor;
//     setConfirmGenFor(null);
//     if (!student) return;
//     setGenLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: 'POST' });
//       setCredentials({
//         studentId: res.studentId, email: res.email, password: res.password,
//         parentEmail: res.parentEmail, emailSent: res.emailSent,
//         emailError: res.emailError, passwordVersion: res.passwordVersion,
//       });
//       setIsCredentialsModalOpen(true);
//       push('New password generated — previous session signed out', 'info');
//       if (res.emailSent && res.parentEmail) {
//         setTimeout(() => push(`📧 Credentials emailed to ${res.parentEmail}`, 'email'), 700);
//       } else if (res.parentEmail && !res.emailSent) {
//         setTimeout(() => push('Email delivery failed — share credentials manually', 'error'), 700);
//       } else {
//         setTimeout(() => push('No parent email on file — share credentials manually', 'info'), 700);
//       }
//     } catch (err: any) {
//       push(err.message || 'Failed to generate password', 'error');
//     }
//     setGenLoading(false);
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { openPrintWindow(await buildReportHTML(res.report)); }
//       else          { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { push('Failed to load report', 'error'); }
//     setReportLoading(false);
//   };

//   const avatarGradients = [
//     'linear-gradient(135deg,#e91e8c,#c2185b)',
//     'linear-gradient(135deg,#9c27b0,#7b1fa2)',
//     'linear-gradient(135deg,#FF6B6B,#FFB347)',
//   ];
//   const hasFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   // ── STICKY COLUMN WIDTHS ───────────────────────────────────────────────────
//   // Status col: 140px, Actions col: 60px
//   const STATUS_W  = 140;
//   const ACTIONS_W = 60;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {confirmGenFor && (
//         <ConfirmSendDialog
//           student={confirmGenFor}
//           onConfirm={handleGeneratePassword}
//           onCancel={() => setConfirmGenFor(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* Table card */}
//       <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

//         {/* Filters */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//           {hasFilters && (
//             <button onClick={() => { setProgramFilter(''); setSectionFilter(''); setStudentSearch(''); setStatusFilter(''); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* ── TABLE ── */}
//         <div
//           className="students-table-scroll"
//           style={{ overflowX: 'auto', minHeight: 400, position: 'relative' }}
//         >
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table
//               className="text-left border-collapse"
//               style={{ minWidth: 860, width: '100%', tableLayout: 'fixed' }}
//             >
//               <colgroup>
//                 <col style={{ width: 52 }} />   {/* photo */}
//                 <col style={{ width: 110 }} />  {/* ID */}
//                 <col style={{ width: 180 }} />  {/* Student */}
//                 <col style={{ width: 120 }} />  {/* Program */}
//                 <col style={{ width: 110 }} />  {/* Level */}
//                 <col style={{ width: 90 }} />   {/* Section */}
//                 <col style={{ width: 110 }} />  {/* Acad Year */}
//                 <col style={{ width: 130 }} />  {/* Parent */}
//                 <col style={{ width: STATUS_W }} />   {/* Status — sticky */}
//                 <col style={{ width: ACTIONS_W }} />  {/* Actions — sticky */}
//               </colgroup>

//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest" />
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ID</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Program</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Level</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Section</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Acad. Year</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Parent</th>

//                   {/* ── Sticky: Status header ── */}
//                   <th
//                     className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-[#FFFDF7]"
//                     style={{
//                       position: 'sticky',
//                       right: ACTIONS_W,
//                       zIndex: 10,
//                       boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.07)',
//                     }}
//                   >
//                     Status
//                   </th>

//                   {/* ── Sticky: Actions header ── */}
//                   <th
//                     className="px-3 py-4 bg-[#FFFDF7]"
//                     style={{
//                       position: 'sticky',
//                       right: 0,
//                       zIndex: 10,
//                     }}
//                   />
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">

//                     {/* Photo */}
//                     <td className="pl-4 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl
//                           ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">
//                               {s.fullName?.[0]?.toUpperCase() ?? '?'}
//                             </div>}
//                       </div>
//                     </td>

//                     {/* ID */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{s.studentId}</td>

//                     {/* Student */}
//                     <td className="px-4 py-4 overflow-hidden">
//                       <p className="text-sm font-bold text-[#1A1A2E] truncate">{s.fullName}</p>
//                       <p className="text-xs text-gray-400 truncate">{s.user?.email ?? '—'}</p>
//                     </td>

//                     {/* Program */}
//                     <td className="px-4 py-4">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20 whitespace-nowrap">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Level */}
//                     <td className="px-4 py-4">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20 whitespace-nowrap">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Section */}
//                     <td className="px-4 py-4">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Academic Year */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? '—'}</td>

//                     {/* Parent */}
//                     <td className="px-4 py-4 text-xs font-medium text-gray-600 overflow-hidden">
//                       <span className="truncate block">{s.parentName ?? '—'}</span>
//                     </td>

//                     {/* ── Sticky: Status ── */}
//                     <td
//                       className="px-4 py-4 transition-colors"
//                       style={{
//                         position: 'sticky',
//                         right: ACTIONS_W,
//                         zIndex: 8,
//                         background: 'inherit',
//                         boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.05)',
//                       }}
//                     >
//                       <StatusBadge
//                         status={(s.status ?? 'Active') as UserStatus}
//                         loading={togglingStatus === s.id}
//                         onClick={() => {
//                           if (s.status === 'Suspended' || s.status === 'Deleted') {
//                             push(`Cannot toggle — student is ${s.status}`, 'error');
//                             return;
//                           }
//                           handleToggleStatus(s);
//                         }}
//                       />
//                     </td>

//                     {/* ── Sticky: Actions ── */}
//                     <td
//                       className="px-3 py-4 transition-colors"
//                       style={{
//                         position: 'sticky',
//                         right: 0,
//                         zIndex: 8,
//                         background: 'inherit',
//                       }}
//                     >
//                       <ActionsMenu
//                         onEdit={() => openEdit(s)}
//                         onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                         onGeneratePassword={() => openGeneratePasswordConfirm(s)}
//                         onViewReport={() => fetchReport(s, false)}
//                         onDownloadReport={() => fetchReport(s, true)}
//                         onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                       />
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan={10} className="px-6 py-20 text-center">
//                       <div className="flex flex-col items-center text-gray-400">
//                         <Search size={24} className="text-gray-300 mb-3" />
//                         <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                         <p className="text-sm mt-1">Try adjusting your search or filters.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs}
//             photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? 'Registering...' : 'Register Student'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs}
//             photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? 'Saving...' : 'Save Changes'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── FEES MODAL ── */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent))}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading
//           ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//           : reportData && (
//             <div className="space-y-4">
//               <StudentReport report={reportData} />
//               <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={async () => openPrintWindow(await buildReportHTML(reportData))}
//                   className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                   <Download size={16} /> Download PDF
//                 </button>
//                 <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen}
//         onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
//         title="Student Login Credentials">
//         {credentials && (
//           <div className="space-y-4">
//             <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//               <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#FF6B6B]">
//                 The password below is shown <span className="font-black">only once</span>. Copy it now before closing.
//               </p>
//             </div>
//             {credentials.emailSent && credentials.parentEmail ? (
//               <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
//                 <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-black text-[#4ECDC4]">✓ Credentials emailed to parent</p>
//                   <p className="text-xs font-bold text-[#1A1A2E] mt-0.5 break-all">{credentials.parentEmail}</p>
//                   <p className="text-[10px] text-gray-400 mt-1">The parent can log in using the credentials below.</p>
//                 </div>
//                 <Check size={16} className="text-[#4ECDC4] flex-shrink-0 mt-0.5" />
//               </div>
//             ) : credentials.parentEmail && !credentials.emailSent ? (
//               <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//                 <div className="min-w-0">
//                   <p className="text-xs font-black text-[#FF6B6B]">Email delivery failed</p>
//                   {credentials.emailError && <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{credentials.emailError}</p>}
//                   <p className="text-xs text-gray-500 mt-1">Share credentials manually with the parent at <span className="font-bold break-all">{credentials.parentEmail}</span></p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-xs font-medium text-amber-700">No parent email on record — share these credentials manually.</p>
//               </div>
//             )}
//             <div className="space-y-3">
//               <CopyRow label="Student ID"         value={credentials.studentId} />
//               <CopyRow label="Login Email"        value={credentials.email} />
//               <CopyRow label="Temporary Password" value={credentials.password} mono />
//               {credentials.parentEmail && (
//                 <div className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5"><Mail size={10} /> Parent email on file</p>
//                   <p className="text-sm font-bold text-[#1A1A2E] break-all">{credentials.parentEmail}</p>
//                   {credentials.emailSent
//                     ? <p className="text-[10px] text-[#4ECDC4] font-bold mt-1 flex items-center gap-1"><Check size={10} /> Credentials sent automatically</p>
//                     : <p className="text-[10px] text-[#FF6B6B] font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Email failed — share manually</p>}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-start gap-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl px-4 py-3">
//               <ShieldAlert size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#6d28d9]">The student's previous login session has been automatically signed out.</p>
//             </div>
//             <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//               <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This permanently deletes the student and all their records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <ToastStack toasts={toasts} />

//       <style dangerouslySetInnerHTML={{ __html: `
//         .students-table-scroll::-webkit-scrollbar { height: 6px; }
//         .students-table-scroll::-webkit-scrollbar-track { background: #f0eef8; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb { background: #e91e8c66; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb:hover { background: #e91e8c99; }
//       ` }} />
//     </div>
//   );
// }




















// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, Download, IdCard,
//   Eye, MoreHorizontal, Camera, Upload,
//   ToggleLeft, ToggleRight,
//   IndianRupee, Receipt, CreditCard, TrendingUp,
//   CheckCircle2, Clock, AlertOctagon,
//   Mail, ShieldAlert, Send,
// } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/helpers/supabaseClient';

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ['A', 'B', 'C', 'D'];
// const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
// const CITIES         = ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior'];
// const SCHOOL_NAME    = 'Ascento Playschool';
// const SCHOOL_TAGLINE = 'Play School';
// const SCHOOL_WEBSITE = 'https://ascentoabacus.com/';
// const SCHOOL_PHONE   = '+91 9810366417';
// const SCHOOL_ADDRESS = 'Ascento Playschool, Dwarka, New Delhi';
// const FEE_TYPES      = ['Tuition','Admission','Activity','Transport','Exam','Library','Uniform','Other'];
// const FEE_STATUSES   = ['Pending','Paid','Partial','Overdue','Waived'] as const;
// type FeeStatus = typeof FEE_STATUSES[number];
// const CARD_W = 208;

// type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

// function makeApiFetch(token: string | null) {
//   return async (path: string, options?: RequestInit) => {
//     const res = await fetch(path, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...(options?.headers ?? {}),
//       },
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   };
// }

// async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
//   const ext  = file.name.split('.').pop() ?? 'jpg';
//   const path = `student-photos/${studentEmail.replace(/[@.]/g, '_')}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage
//     .from('student-assets')
//     .upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from('student-assets').getPublicUrl(path);
//   return data.publicUrl;
// }

// function openPrintWindow(html: string) {
//   const win = window.open('', '_blank', 'width=800,height=900');
//   if (!win) { alert('Please allow popups to print/download.'); return; }
//   win.document.write(html);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const r    = new FileReader();
//       r.onload  = () => resolve(r.result as string);
//       r.onerror = reject;
//       r.readAsDataURL(blob);
//     });
//   } catch { return ''; }
// }

// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
// interface StudentFee {
//   id: string; feeType: string; description: string | null;
//   amount: number; paidAmount: number; dueDate: string | null;
//   paidDate: string | null; status: FeeStatus; month: string | null;
//   academicYear: string | null; receiptNo: string | null; remarks: string | null;
//   createdAt: string;
// }
// interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

// interface CredentialsData {
//   studentId:       string;
//   email:           string;
//   password:        string;
//   parentEmail?:    string;
//   emailSent?:      boolean;
//   emailError?:     string;
//   passwordVersion?: number;
// }

// // ── Toast system ──────────────────────────────────────────────────────────────
// type ToastKind = 'success' | 'error' | 'info' | 'email';
// interface Toast { id: number; msg: string; kind: ToastKind; }

// const TOAST_COLORS: Record<ToastKind, string> = {
//   success: 'from-[#4ECDC4] to-[#3db8af]',
//   error:   'from-[#FF6B6B] to-[#e91e8c]',
//   info:    'from-[#A78BFA] to-[#9c27b0]',
//   email:   'from-[#FFB347] to-[#FF6B6B]',
// };
// const TOAST_ICONS: Record<ToastKind, React.ReactNode> = {
//   success: <CheckCircle2 size={15} />,
//   error:   <AlertCircle  size={15} />,
//   info:    <ShieldAlert  size={15} />,
//   email:   <Mail         size={15} />,
// };

// function ToastStack({ toasts }: { toasts: Toast[] }) {
//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
//       {toasts.map((t) => (
//         <div key={t.id}
//           className={`bg-gradient-to-r ${TOAST_COLORS[t.kind]} text-white px-5 py-3.5 rounded-2xl font-bold text-sm
//             shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 max-w-sm pointer-events-auto
//             animate-in slide-in-from-bottom-4 duration-300`}>
//           {TOAST_ICONS[t.kind]}
//           <span>{t.msg}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToasts() {
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const ctr = useRef(0);
//   const push = useCallback((msg: string, kind: ToastKind = 'success') => {
//     const id = ++ctr.current;
//     setToasts((p) => [...p, { id, msg, kind }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
//   }, []);
//   return { toasts, push };
// }

// // ── UI primitives ──────────────────────────────────────────────────────────────
// const GradientButton = ({ children, onClick, icon: Icon, className = '', type = 'button', disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold
//       flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed
//       ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}>
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const BadgeChip = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = 'hidden';
//     else        document.body.style.overflow = '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 bg-[#1A1A2E]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
//       style={{ paddingTop: 80, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
//       onClick={onClose}
//     >
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full
//           ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col my-auto`}
//         style={{ maxHeight: 'calc(100vh - 104px)' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0"
//           style={{ scrollbarWidth: 'thin', scrollbarColor: '#e91e8c44 transparent' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// function ConfirmSendDialog({ student, onConfirm, onCancel }: { student: any; onConfirm: () => void; onCancel: () => void; }) {
//   const hasParentEmail = !!student?.parentEmail;
//   return (
//     <div className="fixed inset-0 z-[60] bg-[#1A1A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm p-6 space-y-4">
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-xl bg-[#FFB347]/15 flex items-center justify-center flex-shrink-0">
//             <KeyRound size={20} className="text-[#FFB347]" />
//           </div>
//           <div>
//             <p className="font-black text-[#1A1A2E] text-base">Generate New Password?</p>
//             <p className="text-xs text-gray-500 mt-0.5">For <span className="font-bold">{student?.fullName}</span></p>
//           </div>
//         </div>
//         <div className={`rounded-xl px-4 py-3 ${hasParentEmail ? 'bg-[#FFFDF7] border border-[#F0EEF8]' : 'bg-amber-50 border border-amber-200'}`}>
//           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
//             <Mail size={10} /> Credentials will be emailed to
//           </p>
//           {hasParentEmail
//             ? <p className="text-sm font-black text-[#1A1A2E] break-all">{student.parentEmail}</p>
//             : <p className="text-xs font-bold text-amber-700">⚠️ No parent email on file — you'll need to share credentials manually.</p>}
//         </div>
//         <ul className="space-y-1.5 text-xs text-gray-500">
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-[9px] font-black flex-shrink-0">1</span> A new strong password is generated</li>
//           <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center text-[9px] font-black flex-shrink-0">2</span> All existing sessions are signed out</li>
//           {hasParentEmail && (
//             <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#FFB347]/20 text-[#FFB347] flex items-center justify-center text-[9px] font-black flex-shrink-0">3</span> Login credentials emailed to parent</li>
//           )}
//         </ul>
//         <div className="flex gap-3 pt-1">
//           <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
//           <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FFB347] to-[#FF6B6B] hover:shadow-[0_6px_20px_rgba(255,179,71,0.4)] transition-all text-sm flex items-center justify-center gap-2">
//             <Send size={14} /> Yes, Generate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const FormInput = ({ label, type = 'text', placeholder, required = false, value, onChange, hint }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     {hint && <p className="text-[10px] font-bold text-[#FFB347] flex items-center gap-1.5"><Mail size={10} className="flex-shrink-0" />{hint}</p>}
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = 'Select...' }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: { value: string; label: string } | string) =>
//         typeof o === 'string'
//           ? <option key={o} value={o}>{o}</option>
//           : <option key={o.value} value={o.value}>{o.label}</option>
//       )}
//     </select>
//   </div>
// );

// function CopyRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? 'text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10' : 'text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]'}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void; }) {
//   const inputRef  = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith('image/')) return;
//     const r   = new FileReader();
//     r.onload  = (e) => setPreview(e.target?.result as string);
//     r.readAsDataURL(file);
//     onChange('pending', file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[]; programId: string; programLevelId: string;
//   onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
// }) {
//   const sel = programs.find((p) => p.id === programId);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//           <option value="">Select program...</option>
//           {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//         </select>
//       </div>
//       {sel && sel.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {sel.hasLevels ? 'Level' : 'Class / Sub-group'}
//           </label>
//           <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//             <option value="">Select level...</option>
//             {sel.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
//   form: any; setForm: (u: any) => void; programs: Program[];
//   photoFile: File | null; setPhotoFile: (f: File | null) => void;
//   apiFetch: (path: string, options?: RequestInit) => Promise<any>;
// }) {
//   const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set('programLevelId', form.programLevelId);
//     if (form.section)        params.set('section', form.section);
//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((r) => setForm((p: any) => ({ ...p, rollNumber: r.formatted ?? String(r.nextRollNumber ?? '') })))
//       .catch(() => {});
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-5 items-start">
//         <PhotoUpload value={form.photoUrl}
//           onChange={(url, file) => { setPhotoFile(file); setForm((p: any) => ({ ...p, photoUrl: url })); }} />
//         <div className="flex-1 space-y-4">
//           <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//           <ProgramSelector programs={programs} programId={form.programId ?? ''} programLevelId={form.programLevelId ?? ''}
//             onProgramChange={(v) => setForm((p: any) => ({ ...p, programId: v, programLevelId: '', rollNumber: '' }))}
//             onLevelChange={(v) => setForm((p: any) => ({ ...p, programLevelId: v, rollNumber: '' }))} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect label="Section" options={SECTIONS} value={form.section}
//               onChange={(v: string) => setForm((p: any) => ({ ...p, section: v, rollNumber: '' }))} placeholder="No section" />
//             <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                 Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
//               </label>
//               <input type="text" placeholder="01" value={form.rollNumber ?? ''} onChange={(e) => set('rollNumber')(e.target.value)}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//             </div>
//             <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set('admissionDate')} />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set('firstName')} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set('lastName')} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set('email')} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
//           <FormSelect label="Gender" options={['Male','Female','Other']} value={form.gender} onChange={set('gender')} />
//           <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} value={form.bloodGroup} onChange={set('bloodGroup')} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent &amp; Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set('parentName')} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"        value={form.parentPhone} onChange={set('parentPhone')} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set('parentEmail')}
//             hint="Login credentials & password resets are sent to this email — must be valid" />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set('city')} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set('state')} />
//         </div>
//         <div className="flex items-start gap-3 bg-[#FFF8EE] border border-[#FFB347]/30 rounded-xl px-4 py-3">
//           <Mail size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
//           <p className="text-xs font-medium text-[#92650a]">
//             <span className="font-black">Important:</span> The parent email above must be a real, accessible inbox.
//             When you register this student or generate a new password, the login credentials
//             (Student ID &amp; password) will be automatically emailed to this address.
//           </p>
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set('address')} />
//       </div>
//     </div>
//   );
// }

// function StatusBadge({ status, onClick, loading }: { status: UserStatus; onClick: () => void; loading?: boolean }) {
//   const isActive = status === 'Active';
//   return (
//     <button onClick={onClick} disabled={loading}
//       title={`Click to ${isActive ? 'deactivate' : 'activate'} student`}
//       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
//         isActive
//           ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30'
//           : status === 'Suspended'
//           ? 'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30 cursor-not-allowed'
//           : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30'
//       }`}>
//       {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
//       {status}
//     </button>
//   );
// }

// const FEE_CFG: Record<FeeStatus, { color: string; icon: any }> = {
//   Paid:    { color: '#4ECDC4', icon: CheckCircle2 },
//   Pending: { color: '#FFB347', icon: Clock },
//   Partial: { color: '#A78BFA', icon: TrendingUp },
//   Overdue: { color: '#FF6B6B', icon: AlertOctagon },
//   Waived:  { color: '#6BCB77', icon: CheckCircle2 },
// };
// function FeeStatusBadge({ status }: { status: FeeStatus }) {
//   const c = FEE_CFG[status] ?? FEE_CFG.Pending;
//   return (
//     <span style={{ color: c.color, background: c.color + '18', border: `1px solid ${c.color}44` }}
//       className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//       <c.icon size={10} /> {status}
//     </span>
//   );
// }

// function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: any) {
//   const set = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
//           <input list="fee-types" value={form.feeType ?? ''} onChange={(e) => set('feeType')(e.target.value)} placeholder="e.g. Tuition"
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//           <datalist id="fee-types">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
//         </div>
//         <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set('status')} placeholder="Select status" required />
//         <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set('amount')} />
//         <FormInput label="Paid Amount (₹)"  type="number" placeholder="0"    value={form.paidAmount} onChange={set('paidAmount')} />
//         <FormInput label="Due Date"  type="date" value={form.dueDate}  onChange={set('dueDate')} />
//         <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set('paidDate')} />
//         <FormInput label="Month"     placeholder="June 2025"       value={form.month}        onChange={set('month')} />
//         <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
//         <FormInput label="Receipt No." placeholder="RCP-001"       value={form.receiptNo}    onChange={set('receiptNo')} />
//         <FormInput label="Description"  placeholder="Monthly fee"  value={form.description}  onChange={set('description')} />
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
//         <textarea value={form.remarks ?? ''} onChange={(e) => set('remarks')(e.target.value)} rows={2}
//           placeholder="Any additional notes..."
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
//       </div>
//       <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//         <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//         <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
//           {submitting ? 'Saving...' : isEdit ? 'Update Fee' : 'Add Fee'}
//         </GradientButton>
//       </div>
//     </form>
//   );
// }

// function FeesSection({ student, apiFetch }: { student: any; apiFetch: ReturnType<typeof makeApiFetch> }) {
//   const [fees,       setFees]       = useState<StudentFee[]>([]);
//   const [summary,    setSummary]    = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   const [loading,    setLoading]    = useState(true);
//   const [view,       setView]       = useState<'list' | 'add' | 'edit'>('list');
//   const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
//   const [feeForm,    setFeeForm]    = useState<any>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const { toasts, push }            = useToasts();

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const r = await apiFetch(`/api/admin/students/${student.id}/fees`);
//       setFees(r.fees ?? []);
//       setSummary(r.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//     } catch { push('Failed to load fees', 'error'); }
//     setLoading(false);
//   }, [student.id]);
//   useEffect(() => { load(); }, [load]);

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!feeForm.feeType || feeForm.amount == null) { push('Fee type and amount required', 'error'); return; }
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees`, { method: 'POST',
//         body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || 'Pending' }) });
//       push('Fee record added', 'success'); setFeeForm({}); setView('list'); load();
//     } catch (err: any) { push(err.message || 'Failed to add fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingFee) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, { method: 'PATCH', body: JSON.stringify(feeForm) });
//       push('Fee updated', 'success'); setView('list'); setEditingFee(null); load();
//     } catch (err: any) { push(err.message || 'Failed to update fee', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async (feeId: string) => {
//     setDeletingId(feeId);
//     try {
//       await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: 'DELETE' });
//       push('Fee deleted', 'success'); load();
//     } catch { push('Failed to delete fee', 'error'); }
//     setDeletingId(null);
//   };

//   const openEdit = (fee: StudentFee) => {
//     setFeeForm({
//       feeType: fee.feeType, description: fee.description ?? '', amount: String(fee.amount),
//       paidAmount: String(fee.paidAmount), dueDate: fee.dueDate?.slice(0, 10) ?? '',
//       paidDate: fee.paidDate?.slice(0, 10) ?? '', status: fee.status,
//       month: fee.month ?? '', academicYear: fee.academicYear ?? '',
//       receiptNo: fee.receiptNo ?? '', remarks: fee.remarks ?? '',
//     });
//     setEditingFee(fee); setView('edit');
//   };

//   const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
//           {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
//           <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
//         </div>
//         <IndianRupee size={16} className="text-[#e91e8c]" />
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { label: 'Total Fees',  value: fmt(summary.totalAmount), color: '#1A1A2E', icon: Receipt },
//           { label: 'Amount Paid', value: fmt(summary.totalPaid),   color: '#4ECDC4', icon: CheckCircle2 },
//           { label: 'Balance Due', value: fmt(summary.totalDue),    color: summary.totalDue > 0 ? '#FF6B6B' : '#4ECDC4', icon: CreditCard },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
//             <Icon size={14} style={{ color }} className="mx-auto mb-1" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-base font-black" style={{ color }}>{value}</p>
//           </div>
//         ))}
//       </div>
//       {view === 'list' && (
//         <>
//           <div className="flex justify-between items-center">
//             <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
//             <button onClick={() => { setFeeForm({ status: 'Pending', paidAmount: '0' }); setView('add'); }}
//               className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
//               <Plus size={15} /> Add Fee
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
//           ) : fees.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
//               <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {fees.map((fee) => {
//                 const bal = fee.amount - fee.paidAmount;
//                 return (
//                   <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-1.5">
//                           <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
//                           <FeeStatusBadge status={fee.status} />
//                           {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                           <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
//                           <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${bal > 0 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>{fmt(bal)}</span></div>
//                           {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span></div>}
//                         </div>
//                         {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
//                       </div>
//                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                         <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
//                         <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
//                           className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
//                           {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         </button>
//                       </div>
//                     </div>
//                     <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
//                         style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
//                     </div>
//                     <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
//                       {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//       {view === 'add' && (
//         <>
//           <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView('list'); setFeeForm({}); }} />
//         </>
//       )}
//       {view === 'edit' && editingFee && (
//         <>
//           <button onClick={() => { setView('list'); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
//           <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView('list'); setEditingFee(null); }} isEdit />
//         </>
//       )}
//       <ToastStack toasts={toasts} />
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
//   const [open, setOpen] = useState(false);
//   const [pos,  setPos]  = useState({ top: 0, right: 0 });
//   const btnRef  = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const handleOpen = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (btnRef.current) {
//       const r = btnRef.current.getBoundingClientRect();
//       // Anchor menu's RIGHT edge to button's RIGHT edge so it opens leftward,
//       // fully clearing the sticky Status column.
//       setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
//     }
//     setOpen((v) => !v);
//   };

//   useEffect(() => {
//     if (!open) return;
//     const close = (e: MouseEvent) => {
//       if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
//       setOpen(false);
//     };
//     document.addEventListener('click', close, true);
//     return () => document.removeEventListener('click', close, true);
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     const close = () => setOpen(false);
//     window.addEventListener('scroll', close, true);
//     window.addEventListener('resize', close);
//     return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
//   }, [open]);

//   const items = [
//     { icon: Pencil,      label: 'Edit',             color: '#FFB347', action: onEdit },
//     { icon: KeyRound,    label: 'Generate Password', color: '#4ECDC4', action: onGeneratePassword },
//     { icon: IdCard,      label: 'View ID Card',      color: '#A78BFA', action: onViewIdCard },
//     { icon: IndianRupee, label: 'Manage Fees',       color: '#e91e8c', action: onViewFees },
//     { icon: Eye,         label: 'View Report',       color: '#64B6FF', action: onViewReport },
//     { icon: Download,    label: 'Download Report',   color: '#6BCB77', action: onDownloadReport },
//     { icon: Trash2,      label: 'Delete',            color: '#FF6B6B', action: onDelete },
//   ];

//   return (
//     <>
//       <button ref={btnRef} onClick={handleOpen}
//         className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//         title="Actions">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div
//           ref={menuRef}
//           style={{
//             position: 'fixed',
//             top: pos.top,
//             right: pos.right,
//             // ✅ Must be above everything including sticky headers (z-index 10)
//             zIndex: 99999,
//           }}
//           className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]"
//         >
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label}
//               onClick={(e) => { e.stopPropagation(); setOpen(false); setTimeout(action, 10); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === 'Delete' ? '#FF6B6B' : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// // ── ID Card ────────────────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   return (
//     <div className="flex justify-center">
//       <div style={{ width: w, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eee', fontFamily: 'Arial,sans-serif' }}>
//         <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
//           <div>
//             <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 10px' }}>
//           <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {student.photoUrl
//               ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//           </div>
//         </div>
//         <div style={{ padding: '0 11px 8px', fontSize: 8 }}>
//           {[['Name', student.fullName ?? '—'], ['D.O.B', dob], ['Adm Date', admDate], ['Mob.', student.parentPhone ?? '—'],
//             ['Class', student.programLevel?.name ?? student.program?.name ?? '—'], ['Parent', student.parentName ?? '—']].map(([l, v]) => (
//             <div key={l} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//               <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{l}</span>
//               <span style={{ color: '#555', fontWeight: 600 }}>: &nbsp;{v}</span>
//             </div>
//           ))}
//           {student.bloodGroup && <div style={{ display: 'flex', gap: 3 }}><span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span><span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//         </div>
//         <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%' }}>
//           <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//           <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = ''; if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }
//   const admDate = s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = s.dateOfBirth   ? new Date(s.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   const photo = photoSrc
//     ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c"/>`
//     : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${s.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photo}</div><div style="padding:0 11px 8px;font-size:8px">${[['Name',s.fullName??'—'],['D.O.B',dob],['Adm Date',admDate],['Mob.',s.parentPhone??'—'],['Class',s.programLevel?.name??s.program?.name??'—'],['Parent',s.parentName??'—']].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join('')}${s.bloodGroup?`<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: ${s.bloodGroup}</span></div>`:''}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }

// async function buildReportHTML(r: any): Promise<string> {
//   let photoHtml = '';
//   if (r.photoUrl) { const b = await urlToBase64(r.photoUrl); if (b) photoHtml = `<img src="${b}" style="width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0"/>`; }
//   const admDate = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const addr    = [r.address, r.city, r.state].filter(Boolean).join(', ') || '—';
//   const gen     = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
//   const fields: [string, string][] = [
//     ['Student ID', r.studentId], ['Full Name', r.fullName], ['Email', r.email ?? '—'],
//     ['Date of Birth', r.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', r.gender ?? '—'], ['Blood Group', r.bloodGroup ?? '—'],
//     ['Program', r.program?.name ?? '—'], ['Level / Class', r.level?.name ?? '—'],
//     ['Section', r.section ? `Section ${r.section}` : '—'], ['Roll Number', r.rollNumber ?? '—'],
//     ['Academic Year', r.academicYear ?? '—'], ['Status', r.status ?? '—'],
//     ['Parent Name', r.parentName ?? '—'], ['Parent Phone', r.parentPhone ?? '—'],
//     ['Parent Email', r.parentEmail ?? '—'], ['Address', addr],
//   ];
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><div style="font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px">${SCHOOL_NAME}</div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7;font-size:12px;margin-top:3px">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:6px">Generated: ${gen}</div></div></div><div class="grid">${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join('')}</div><div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
// }

// function StudentReport({ report }: { report: any }) {
//   const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
//   const fields: [string, string][] = [
//     ['Student ID', report.studentId], ['Full Name', report.fullName], ['Email', report.email ?? '—'],
//     ['Date of Birth', report.dateOfBirth ?? '—'], ['Admission Date', admDate],
//     ['Gender', report.gender ?? '—'], ['Blood Group', report.bloodGroup ?? '—'],
//     ['Program', report.program?.name ?? '—'], ['Level / Class', report.level?.name ?? '—'],
//     ['Section', report.section ? `Section ${report.section}` : '—'], ['Roll Number', report.rollNumber ?? '—'],
//     ['Academic Year', report.academicYear ?? '—'], ['Status', report.status ?? '—'],
//     ['Parent Name', report.parentName ?? '—'], ['Parent Phone', report.parentPhone ?? '—'],
//     ['Parent Email', report.parentEmail ?? '—'],
//     ['Address', [report.address, report.city, report.state].filter(Boolean).join(', ') || '—'],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
//             <p className="text-2xl font-black">{report.fullName}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
//             <div className="flex gap-2 mt-3 flex-wrap">
//               {report.program && <BadgeChip text={report.program.name} color="#fff" />}
//               {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
//               {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
//             </div>
//           </div>
//           {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function StudentsView() {
//   const { token } = useAuth();
//   const apiFetch  = makeApiFetch(token);
//   const { toasts, push } = useToasts();

//   const [studentsData,  setStudentsData]  = useState<any[]>([]);
//   const [programs,      setPrograms]      = useState<Program[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [programFilter, setProgramFilter] = useState('');
//   const [sectionFilter, setSectionFilter] = useState('');
//   const [statusFilter,  setStatusFilter]  = useState('');

//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
//   const [isFeesModalOpen,        setIsFeesModalOpen]        = useState(false);

//   const [confirmGenFor, setConfirmGenFor] = useState<any>(null);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
//   const [feesStudent,     setFeesStudent]     = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<CredentialsData | null>(null);

//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
//   const [genLoading,     setGenLoading]     = useState(false);

//   const [addForm,       setAddForm]       = useState<any>({});
//   const [editForm,      setEditForm]      = useState<any>({});
//   const [addPhotoFile,  setAddPhotoFile]  = useState<File | null>(null);
//   const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

//   const fetchPrograms = useCallback(async () => {
//     try { const r = await apiFetch('/api/admin/programs'); setPrograms(r.programs ?? []); } catch {}
//   }, [token]);
//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   const fetchStudents = useCallback(async (q = '', prog = '', sec = '', stat = '') => {
//     setLoading(true);
//     try {
//       const p = new URLSearchParams({ search: q, limit: '100' });
//       if (prog) p.set('programId', prog);
//       if (sec)  p.set('section', sec);
//       if (stat) p.set('status', stat);
//       const r = await apiFetch(`/api/admin/students?${p}`);
//       setStudentsData(r.students ?? []);
//     } catch { push('Failed to load students', 'error'); }
//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

//   const handleToggleStatus = async (student: any) => {
//     const newStatus: UserStatus = student.status === 'Active' ? 'Inactive' : 'Active';
//     setTogglingStatus(student.id);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: newStatus }),
//       });
//       push(res.message ?? `Student ${newStatus === 'Active' ? 'activated' : 'deactivated'}`, newStatus === 'Active' ? 'success' : 'info');
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       push(err.message || 'Failed to update status', 'error');
//     }
//     setTogglingStatus(null);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       push('First name, last name and email are required', 'error'); return;
//     }
//     setSubmitting(true);
//     try {
//       let photoUrl: string | null = null;
//       if (addPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       const res = await apiFetch('/api/admin/students', {
//         method: 'POST',
//         body: JSON.stringify({
//           fullName: `${addForm.firstName} ${addForm.lastName}`,
//           email: addForm.email, photoUrl,
//           admissionDate: addForm.admissionDate || null,
//           dateOfBirth: addForm.dateOfBirth, gender: addForm.gender,
//           bloodGroup: addForm.bloodGroup, rollNumber: addForm.rollNumber,
//           parentName: addForm.parentName, parentPhone: addForm.parentPhone,
//           parentEmail: addForm.parentEmail, address: addForm.address,
//           city: addForm.city, state: addForm.state,
//           section: addForm.section || null, academicYear: addForm.academicYear || null,
//           programId: addForm.programId || null, programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) {
//         setCredentials({ ...res.credentials, parentEmail: addForm.parentEmail });
//         setIsCredentialsModalOpen(true);
//       }
//       push('Student registered successfully!', 'success');
//       if (addForm.parentEmail) setTimeout(() => push(`Credentials emailed to ${addForm.parentEmail}`, 'email'), 600);
//       setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) {
//       let msg = err.message || 'Failed to add student';
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       push(msg, 'error');
//     }
//     setSubmitting(false);
//   };

//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? '').split(' ');
//     setEditForm({
//       firstName, lastName: rest.join(' '), email: student.user?.email ?? '',
//       dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0, 10)   : '',
//       admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
//       gender: student.gender ?? '', bloodGroup: student.bloodGroup ?? '', rollNumber: student.rollNumber ?? '',
//       section: student.section ?? '', academicYear: student.academicYear ?? '',
//       parentName: student.parentName ?? '', parentPhone: student.parentPhone ?? '',
//       parentEmail: student.parentEmail ?? '', city: student.city ?? '', state: student.state ?? '',
//       address: student.address ?? '', programId: student.programId ?? '',
//       programLevelId: student.programLevelId ?? '', photoUrl: student.photoUrl ?? '',
//     });
//     setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       let photoUrl = editForm.photoUrl || null;
//       if (editPhotoFile) {
//         try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id); }
//         catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
//       }
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           fullName: `${editForm.firstName} ${editForm.lastName}`,
//           photoUrl: photoUrl ?? undefined,
//           admissionDate: editForm.admissionDate || null,
//           dateOfBirth: editForm.dateOfBirth, gender: editForm.gender,
//           bloodGroup: editForm.bloodGroup, rollNumber: editForm.rollNumber,
//           parentName: editForm.parentName, parentPhone: editForm.parentPhone,
//           parentEmail: editForm.parentEmail, address: editForm.address,
//           city: editForm.city, state: editForm.state,
//           section: editForm.section || null, academicYear: editForm.academicYear || null,
//           programId: editForm.programId || null, programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       push('Student updated successfully', 'success');
//       setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch (err: any) { push(err.message || 'Failed to update student', 'error'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: 'DELETE' });
//       push('Student deleted successfully', 'success');
//       setIsDeleteModalOpen(false); setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
//     } catch { push('Failed to delete student', 'error'); }
//     setSubmitting(false);
//   };

//   const openGeneratePasswordConfirm = (student: any) => setConfirmGenFor(student);

//   const handleGeneratePassword = async () => {
//     const student = confirmGenFor;
//     setConfirmGenFor(null);
//     if (!student) return;
//     setGenLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: 'POST' });
//       setCredentials({
//         studentId: res.studentId, email: res.email, password: res.password,
//         parentEmail: res.parentEmail, emailSent: res.emailSent,
//         emailError: res.emailError, passwordVersion: res.passwordVersion,
//       });
//       setIsCredentialsModalOpen(true);
//       push('New password generated — previous session signed out', 'info');
//       if (res.emailSent && res.parentEmail) {
//         setTimeout(() => push(`📧 Credentials emailed to ${res.parentEmail}`, 'email'), 700);
//       } else if (res.parentEmail && !res.emailSent) {
//         setTimeout(() => push('Email delivery failed — share credentials manually', 'error'), 700);
//       } else {
//         setTimeout(() => push('No parent email on file — share credentials manually', 'info'), 700);
//       }
//     } catch (err: any) {
//       push(err.message || 'Failed to generate password', 'error');
//     }
//     setGenLoading(false);
//   };

//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       if (download) { openPrintWindow(await buildReportHTML(res.report)); }
//       else          { setReportData(res.report); setIsReportModalOpen(true); }
//     } catch { push('Failed to load report', 'error'); }
//     setReportLoading(false);
//   };

//   const avatarGradients = [
//     'linear-gradient(135deg,#e91e8c,#c2185b)',
//     'linear-gradient(135deg,#9c27b0,#7b1fa2)',
//     'linear-gradient(135deg,#FF6B6B,#FFB347)',
//   ];
//   const hasFilters = programFilter || sectionFilter || studentSearch || statusFilter;

//   // ── STICKY COLUMN WIDTHS ───────────────────────────────────────────────────
//   const STATUS_W  = 140;
//   const ACTIONS_W = 60;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">

//       {confirmGenFor && (
//         <ConfirmSendDialog
//           student={confirmGenFor}
//           onConfirm={handleGeneratePassword}
//           onCancel={() => setConfirmGenFor(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* Table card */}
//       <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

//         {/* Filters */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//           {hasFilters && (
//             <button onClick={() => { setProgramFilter(''); setSectionFilter(''); setStudentSearch(''); setStatusFilter(''); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* ── TABLE ── */}
//         <div
//           className="students-table-scroll"
//           style={{ overflowX: 'auto', minHeight: 400, position: 'relative' }}
//         >
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table
//               className="text-left border-collapse"
//               style={{ minWidth: 860, width: '100%', tableLayout: 'fixed' }}
//             >
//               <colgroup>
//                 <col style={{ width: 52 }} />
//                 <col style={{ width: 110 }} />
//                 <col style={{ width: 180 }} />
//                 <col style={{ width: 120 }} />
//                 <col style={{ width: 110 }} />
//                 <col style={{ width: 90 }} />
//                 <col style={{ width: 110 }} />
//                 <col style={{ width: 130 }} />
//                 <col style={{ width: STATUS_W }} />
//                 <col style={{ width: ACTIONS_W }} />
//               </colgroup>

//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest" />
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ID</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Program</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Level</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Section</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Acad. Year</th>
//                   <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Parent</th>

//                   {/* ── Sticky: Status header — needs zIndex to stay above scrolling body rows ── */}
//                   <th
//                     className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-[#FFFDF7]"
//                     style={{
//                       position: 'sticky',
//                       right: ACTIONS_W,
//                       zIndex: 10,
//                       boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.07)',
//                     }}
//                   >
//                     Status
//                   </th>

//                   {/* ── Sticky: Actions header ── */}
//                   <th
//                     className="px-3 py-4 bg-[#FFFDF7]"
//                     style={{
//                       position: 'sticky',
//                       right: 0,
//                       zIndex: 10,
//                     }}
//                   />
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">

//                     {/* Photo */}
//                     <td className="pl-4 py-3 pr-0">
//                       <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
//                         {s.photoUrl
//                           ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
//                           : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">
//                               {s.fullName?.[0]?.toUpperCase() ?? '?'}
//                             </div>}
//                       </div>
//                     </td>

//                     {/* ID */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{s.studentId}</td>

//                     {/* Student */}
//                     <td className="px-4 py-4 overflow-hidden">
//                       <p className="text-sm font-bold text-[#1A1A2E] truncate">{s.fullName}</p>
//                       <p className="text-xs text-gray-400 truncate">{s.user?.email ?? '—'}</p>
//                     </td>

//                     {/* Program */}
//                     <td className="px-4 py-4">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20 whitespace-nowrap">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Level */}
//                     <td className="px-4 py-4">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20 whitespace-nowrap">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Section */}
//                     <td className="px-4 py-4">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>

//                     {/* Academic Year */}
//                     <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? '—'}</td>

//                     {/* Parent */}
//                     <td className="px-4 py-4 text-xs font-medium text-gray-600 overflow-hidden">
//                       <span className="truncate block">{s.parentName ?? '—'}</span>
//                     </td>

//                     {/* ── Sticky: Status ──
//                         ✅ NO zIndex here — removing it prevents this td from creating
//                            a stacking context that blocks the fixed-position dropdown menu.
//                            background: 'inherit' still ensures scrolled content goes behind it. ── */}
//                     <td
//                       className="px-4 py-4 transition-colors"
//                       style={{
//                         position: 'sticky',
//                         right: ACTIONS_W,
//                         background: 'inherit',
//                         boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.05)',
//                       }}
//                     >
//                       <StatusBadge
//                         status={(s.status ?? 'Active') as UserStatus}
//                         loading={togglingStatus === s.id}
//                         onClick={() => {
//                           if (s.status === 'Suspended' || s.status === 'Deleted') {
//                             push(`Cannot toggle — student is ${s.status}`, 'error');
//                             return;
//                           }
//                           handleToggleStatus(s);
//                         }}
//                       />
//                     </td>

//                     {/* ── Sticky: Actions ──
//                         ✅ NO zIndex here — same reason as Status td above. ── */}
//                     <td
//                       className="px-3 py-4 transition-colors"
//                       style={{
//                         position: 'sticky',
//                         right: 0,
//                         background: 'inherit',
//                       }}
//                     >
//                       <ActionsMenu
//                         onEdit={() => openEdit(s)}
//                         onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                         onGeneratePassword={() => openGeneratePasswordConfirm(s)}
//                         onViewReport={() => fetchReport(s, false)}
//                         onDownloadReport={() => fetchReport(s, true)}
//                         onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
//                       />
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan={10} className="px-6 py-20 text-center">
//                       <div className="flex flex-col items-center text-gray-400">
//                         <Search size={24} className="text-gray-300 mb-3" />
//                         <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                         <p className="text-sm mt-1">Try adjusting your search or filters.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs}
//             photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? 'Registering...' : 'Register Student'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs}
//             photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? 'Saving...' : 'Save Changes'}</GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── FEES MODAL ── */}
//       <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
//         {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent))}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading
//           ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
//           : reportData && (
//             <div className="space-y-4">
//               <StudentReport report={reportData} />
//               <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//                 <button onClick={async () => openPrintWindow(await buildReportHTML(reportData))}
//                   className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                   <Download size={16} /> Download PDF
//                 </button>
//                 <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//               </div>
//             </div>
//           )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen}
//         onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
//         title="Student Login Credentials">
//         {credentials && (
//           <div className="space-y-4">
//             <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//               <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#FF6B6B]">
//                 The password below is shown <span className="font-black">only once</span>. Copy it now before closing.
//               </p>
//             </div>
//             {credentials.emailSent && credentials.parentEmail ? (
//               <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
//                 <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-black text-[#4ECDC4]">✓ Credentials emailed to parent</p>
//                   <p className="text-xs font-bold text-[#1A1A2E] mt-0.5 break-all">{credentials.parentEmail}</p>
//                   <p className="text-[10px] text-gray-400 mt-1">The parent can log in using the credentials below.</p>
//                 </div>
//                 <Check size={16} className="text-[#4ECDC4] flex-shrink-0 mt-0.5" />
//               </div>
//             ) : credentials.parentEmail && !credentials.emailSent ? (
//               <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
//                 <div className="min-w-0">
//                   <p className="text-xs font-black text-[#FF6B6B]">Email delivery failed</p>
//                   {credentials.emailError && <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{credentials.emailError}</p>}
//                   <p className="text-xs text-gray-500 mt-1">Share credentials manually with the parent at <span className="font-bold break-all">{credentials.parentEmail}</span></p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//                 <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-xs font-medium text-amber-700">No parent email on record — share these credentials manually.</p>
//               </div>
//             )}
//             <div className="space-y-3">
//               <CopyRow label="Student ID"         value={credentials.studentId} />
//               <CopyRow label="Login Email"        value={credentials.email} />
//               <CopyRow label="Temporary Password" value={credentials.password} mono />
//               {credentials.parentEmail && (
//                 <div className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5"><Mail size={10} /> Parent email on file</p>
//                   <p className="text-sm font-bold text-[#1A1A2E] break-all">{credentials.parentEmail}</p>
//                   {credentials.emailSent
//                     ? <p className="text-[10px] text-[#4ECDC4] font-bold mt-1 flex items-center gap-1"><Check size={10} /> Credentials sent automatically</p>
//                     : <p className="text-[10px] text-[#FF6B6B] font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Email failed — share manually</p>}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-start gap-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl px-4 py-3">
//               <ShieldAlert size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
//               <p className="text-xs font-medium text-[#6d28d9]">The student's previous login session has been automatically signed out.</p>
//             </div>
//             <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//               <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This permanently deletes the student and all their records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <ToastStack toasts={toasts} />

//       <style dangerouslySetInnerHTML={{ __html: `
//         .students-table-scroll::-webkit-scrollbar { height: 6px; }
//         .students-table-scroll::-webkit-scrollbar-track { background: #f0eef8; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb { background: #e91e8c66; border-radius: 6px; }
//         .students-table-scroll::-webkit-scrollbar-thumb:hover { background: #e91e8c99; }
//       ` }} />
//     </div>
//   );
// }



















'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Trash2, X, AlertCircle,
  Loader2, Copy, Check, AlertTriangle, Pencil,
  KeyRound, Download, IdCard,
  Eye, MoreHorizontal, Camera, Upload,
  ToggleLeft, ToggleRight,
  IndianRupee, Receipt, CreditCard, TrendingUp,
  CheckCircle2, Clock, AlertOctagon,
  Mail, ShieldAlert, Send,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/helpers/supabaseClient';

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS = ['A', 'B', 'C', 'D'];
const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
const CITIES = ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior'];
const SCHOOL_NAME = 'Ascento Playschool';
const SCHOOL_TAGLINE = 'Play School';
const LOGO_URL = '/bestlogoascento.jpeg'; // rename the file to something clean
const SCHOOL_WEBSITE = 'https://ascentoabacus.com/';
const SCHOOL_PHONE = '+91 9810366417';
const SCHOOL_ADDRESS = 'Ascento Playschool, Dwarka, New Delhi';
const FEE_TYPES = ['Tuition', 'Admission', 'Activity', 'Transport', 'Exam', 'Library', 'Uniform', 'Other'];
const FEE_STATUSES = ['Pending', 'Paid', 'Partial', 'Overdue', 'Waived'] as const;
type FeeStatus = typeof FEE_STATUSES[number];
const CARD_W = 208;

type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Deleted';

function makeApiFetch(token: string | null) {
  return async (path: string, options?: RequestInit) => {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
}

async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `student-photos/${studentEmail.replace(/[@.]/g, '_')}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('student-assets')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('student-assets').getPublicUrl(path);
  return data.publicUrl;
}

function openPrintWindow(html: string) {
  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) { alert('Please allow popups to print/download.'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

async function urlToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch { return ''; }
}

interface ProgramLevel { id: string; name: string; sortOrder: number; }
interface Program { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
interface StudentFee {
  id: string; feeType: string; description: string | null;
  amount: number; paidAmount: number; dueDate: string | null;
  paidDate: string | null; status: FeeStatus; month: string | null;
  academicYear: string | null; receiptNo: string | null; remarks: string | null;
  createdAt: string;
}
interface FeeSummary { totalAmount: number; totalPaid: number; totalDue: number; }

interface CredentialsData {
  studentId: string;
  email: string;
  password: string;
  parentEmail?: string;
  emailSent?: boolean;
  emailError?: string;
  passwordVersion?: number;
}

// ── Toast system ──────────────────────────────────────────────────────────────
type ToastKind = 'success' | 'error' | 'info' | 'email';
interface Toast { id: number; msg: string; kind: ToastKind; }

const TOAST_COLORS: Record<ToastKind, string> = {
  success: 'from-[#4ECDC4] to-[#3db8af]',
  error: 'from-[#FF6B6B] to-[#e91e8c]',
  info: 'from-[#A78BFA] to-[#9c27b0]',
  email: 'from-[#FFB347] to-[#FF6B6B]',
};
const TOAST_ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={15} />,
  error: <AlertCircle size={15} />,
  info: <ShieldAlert size={15} />,
  email: <Mail size={15} />,
};

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`bg-gradient-to-r ${TOAST_COLORS[t.kind]} text-white px-5 py-3.5 rounded-2xl font-bold text-sm
            shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 max-w-sm pointer-events-auto
            animate-in slide-in-from-bottom-4 duration-300`}>
          {TOAST_ICONS[t.kind]}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ctr = useRef(0);
  const push = useCallback((msg: string, kind: ToastKind = 'success') => {
    const id = ++ctr.current;
    setToasts((p) => [...p, { id, msg, kind }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);
  return { toasts, push };
}

// ── UI primitives ──────────────────────────────────────────────────────────────
const GradientButton = ({ children, onClick, icon: Icon, className = '', type = 'button', disabled }: any) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold
      flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed
      ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}>
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const BadgeChip = ({ text, color }: { text: string; color: string }) => (
  <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
    {text}
  </span>
);

const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1A2E]/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
      style={{ paddingTop: 80, paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full
          ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col my-auto`}
        style={{ maxHeight: 'calc(100vh - 104px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-h-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#e91e8c44 transparent' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function ConfirmSendDialog({ student, onConfirm, onCancel }: { student: any; onConfirm: () => void; onCancel: () => void; }) {
  const hasParentEmail = !!student?.parentEmail;
  return (
    <div className="fixed inset-0 z-[60] bg-[#1A1A2E]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FFB347]/15 flex items-center justify-center flex-shrink-0">
            <KeyRound size={20} className="text-[#FFB347]" />
          </div>
          <div>
            <p className="font-black text-[#1A1A2E] text-base">Generate New Password?</p>
            <p className="text-xs text-gray-500 mt-0.5">For <span className="font-bold">{student?.fullName}</span></p>
          </div>
        </div>
        <div className={`rounded-xl px-4 py-3 ${hasParentEmail ? 'bg-[#FFFDF7] border border-[#F0EEF8]' : 'bg-amber-50 border border-amber-200'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5">
            <Mail size={10} /> Credentials will be emailed to
          </p>
          {hasParentEmail
            ? <p className="text-sm font-black text-[#1A1A2E] break-all">{student.parentEmail}</p>
            : <p className="text-xs font-bold text-amber-700">⚠️ No parent email on file — you'll need to share credentials manually.</p>}
        </div>
        <ul className="space-y-1.5 text-xs text-gray-500">
          <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-[9px] font-black flex-shrink-0">1</span> A new strong password is generated</li>
          <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center text-[9px] font-black flex-shrink-0">2</span> All existing sessions are signed out</li>
          {hasParentEmail && (
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#FFB347]/20 text-[#FFB347] flex items-center justify-center text-[9px] font-black flex-shrink-0">3</span> Login credentials emailed to parent</li>
          )}
        </ul>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FFB347] to-[#FF6B6B] hover:shadow-[0_6px_20px_rgba(255,179,71,0.4)] transition-all text-sm flex items-center justify-center gap-2">
            <Send size={14} /> Yes, Generate
          </button>
        </div>
      </div>
    </div>
  );
}

const FormInput = ({ label, type = 'text', placeholder, required = false, value, onChange, hint }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input type={type} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
    {hint && <p className="text-[10px] font-bold text-[#FFB347] flex items-center gap-1.5"><Mail size={10} className="flex-shrink-0" />{hint}</p>}
  </div>
);

const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input list={`list-${label}`} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
    <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
  </div>
);

const FormSelect = ({ label, options, required = false, value, onChange, placeholder = 'Select...' }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
      <option value="">{placeholder}</option>
      {options.map((o: { value: string; label: string } | string) =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  </div>
);

function CopyRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
      </div>
      <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? 'text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10' : 'text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]'}`}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void; }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target?.result as string);
    r.readAsDataURL(file);
    onChange('pending', file);
  };
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
      <div onClick={() => inputRef.current?.click()}
        className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <Camera size={20} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
            <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
  programs: Program[]; programId: string; programLevelId: string;
  onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
}) {
  const sel = programs.find((p) => p.id === programId);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
        <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
          className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
          <option value="">Select program...</option>
          {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {sel && sel.levels.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
            {sel.hasLevels ? 'Level' : 'Class / Sub-group'}
          </label>
          <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
            className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
            <option value="">Select level...</option>
            {sel.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile, apiFetch }: {
  form: any; setForm: (u: any) => void; programs: Program[];
  photoFile: File | null; setPhotoFile: (f: File | null) => void;
  apiFetch: (path: string, options?: RequestInit) => Promise<any>;
}) {
  const set = (key: string) => (v: string) => setForm((p: any) => ({ ...p, [key]: v }));
  useEffect(() => {
    if (!form.programId) return;
    const params = new URLSearchParams({ programId: form.programId });
    if (form.programLevelId) params.set('programLevelId', form.programLevelId);
    if (form.section) params.set('section', form.section);
    apiFetch(`/api/admin/students/next-roll-number?${params}`)
      .then((r) => setForm((p: any) => ({ ...p, rollNumber: r.formatted ?? String(r.nextRollNumber ?? '') })))
      .catch(() => { });
  }, [form.programId, form.programLevelId, form.section]);

  return (
    <div className="space-y-6">
      <div className="flex gap-5 items-start">
        <PhotoUpload value={form.photoUrl}
          onChange={(url, file) => { setPhotoFile(file); setForm((p: any) => ({ ...p, photoUrl: url })); }} />
        <div className="flex-1 space-y-4">
          <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
          <ProgramSelector programs={programs} programId={form.programId ?? ''} programLevelId={form.programLevelId ?? ''}
            onProgramChange={(v) => setForm((p: any) => ({ ...p, programId: v, programLevelId: '', rollNumber: '' }))}
            onLevelChange={(v) => setForm((p: any) => ({ ...p, programLevelId: v, rollNumber: '' }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect label="Section" options={SECTIONS} value={form.section}
              onChange={(v: string) => setForm((p: any) => ({ ...p, section: v, rollNumber: '' }))} placeholder="No section" />
            <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
              </label>
              <input type="text" placeholder="01" value={form.rollNumber ?? ''} onChange={(e) => set('rollNumber')(e.target.value)}
                className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
            </div>
            <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set('admissionDate')} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" placeholder="Aarav" required value={form.firstName} onChange={set('firstName')} />
          <FormInput label="Last Name" placeholder="Sharma" required value={form.lastName} onChange={set('lastName')} />
          <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set('email')} />
          <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
          <FormSelect label="Gender" options={['Male', 'Female', 'Other']} value={form.gender} onChange={set('gender')} />
          <FormSelect label="Blood Group" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} value={form.bloodGroup} onChange={set('bloodGroup')} />
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent &amp; Contact Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Parent Name" placeholder="Rahul Sharma" required value={form.parentName} onChange={set('parentName')} />
          <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX" value={form.parentPhone} onChange={set('parentPhone')} />
          <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set('parentEmail')}
            hint="Login credentials & password resets are sent to this email — must be valid" />
          <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set('city')} />
          <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set('state')} />
        </div>
        <div className="flex items-start gap-3 bg-[#FFF8EE] border border-[#FFB347]/30 rounded-xl px-4 py-3">
          <Mail size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium text-[#92650a]">
            <span className="font-black">Important:</span> The parent email above must be a real, accessible inbox.
            When you register this student or generate a new password, the login credentials
            (Student ID &amp; password) will be automatically emailed to this address.
          </p>
        </div>
        <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set('address')} />
      </div>
    </div>
  );
}

function StatusBadge({ status, onClick, loading }: { status: UserStatus; onClick: () => void; loading?: boolean }) {
  const isActive = status === 'Active';
  return (
    <button onClick={onClick} disabled={loading}
      title={`Click to ${isActive ? 'deactivate' : 'activate'} student`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${isActive
          ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30'
          : status === 'Suspended'
            ? 'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/30 cursor-not-allowed'
            : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30'
        }`}>
      {loading ? <Loader2 size={10} className="animate-spin" /> : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
      {status}
    </button>
  );
}

const FEE_CFG: Record<FeeStatus, { color: string; icon: any }> = {
  Paid: { color: '#4ECDC4', icon: CheckCircle2 },
  Pending: { color: '#FFB347', icon: Clock },
  Partial: { color: '#A78BFA', icon: TrendingUp },
  Overdue: { color: '#FF6B6B', icon: AlertOctagon },
  Waived: { color: '#6BCB77', icon: CheckCircle2 },
};
function FeeStatusBadge({ status }: { status: FeeStatus }) {
  const c = FEE_CFG[status] ?? FEE_CFG.Pending;
  return (
    <span style={{ color: c.color, background: c.color + '18', border: `1px solid ${c.color}44` }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
      <c.icon size={10} /> {status}
    </span>
  );
}

function FeeForm({ form, setForm, onSubmit, submitting, onCancel, isEdit = false }: any) {
  const set = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Fee Type <span className="text-[#FF6B6B]">*</span></label>
          <input list="fee-types" value={form.feeType ?? ''} onChange={(e) => set('feeType')(e.target.value)} placeholder="e.g. Tuition"
            className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
          <datalist id="fee-types">{FEE_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
        </div>
        <FormSelect label="Status" options={[...FEE_STATUSES]} value={form.status} onChange={set('status')} placeholder="Select status" required />
        <FormInput label="Total Amount (₹)" type="number" placeholder="5000" required value={form.amount} onChange={set('amount')} />
        <FormInput label="Paid Amount (₹)" type="number" placeholder="0" value={form.paidAmount} onChange={set('paidAmount')} />
        <FormInput label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} />
        <FormInput label="Paid Date" type="date" value={form.paidDate} onChange={set('paidDate')} />
        <FormInput label="Month" placeholder="June 2025" value={form.month} onChange={set('month')} />
        <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set('academicYear')} placeholder="Select year" />
        <FormInput label="Receipt No." placeholder="RCP-001" value={form.receiptNo} onChange={set('receiptNo')} />
        <FormInput label="Description" placeholder="Monthly fee" value={form.description} onChange={set('description')} />
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Remarks</label>
        <textarea value={form.remarks ?? ''} onChange={(e) => set('remarks')(e.target.value)} rows={2}
          placeholder="Any additional notes..."
          className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
        <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : isEdit ? Pencil : Plus}>
          {submitting ? 'Saving...' : isEdit ? 'Update Fee' : 'Add Fee'}
        </GradientButton>
      </div>
    </form>
  );
}

function FeesSection({ student, apiFetch }: { student: any; apiFetch: ReturnType<typeof makeApiFetch> }) {
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [summary, setSummary] = useState<FeeSummary>({ totalAmount: 0, totalPaid: 0, totalDue: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
  const [feeForm, setFeeForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toasts, push } = useToasts();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiFetch(`/api/admin/students/${student.id}/fees`);
      setFees(r.fees ?? []);
      setSummary(r.summary ?? { totalAmount: 0, totalPaid: 0, totalDue: 0 });
    } catch { push('Failed to load fees', 'error'); }
    setLoading(false);
  }, [student.id]);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.feeType || feeForm.amount == null) { push('Fee type and amount required', 'error'); return; }
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${student.id}/fees`, {
        method: 'POST',
        body: JSON.stringify({ ...feeForm, paidAmount: feeForm.paidAmount || 0, status: feeForm.status || 'Pending' })
      });
      push('Fee record added', 'success'); setFeeForm({}); setView('list'); load();
    } catch (err: any) { push(err.message || 'Failed to add fee', 'error'); }
    setSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${student.id}/fees/${editingFee.id}`, { method: 'PATCH', body: JSON.stringify(feeForm) });
      push('Fee updated', 'success'); setView('list'); setEditingFee(null); load();
    } catch (err: any) { push(err.message || 'Failed to update fee', 'error'); }
    setSubmitting(false);
  };

  const handleDelete = async (feeId: string) => {
    setDeletingId(feeId);
    try {
      await apiFetch(`/api/admin/students/${student.id}/fees/${feeId}`, { method: 'DELETE' });
      push('Fee deleted', 'success'); load();
    } catch { push('Failed to delete fee', 'error'); }
    setDeletingId(null);
  };

  const openEdit = (fee: StudentFee) => {
    setFeeForm({
      feeType: fee.feeType, description: fee.description ?? '', amount: String(fee.amount),
      paidAmount: String(fee.paidAmount), dueDate: fee.dueDate?.slice(0, 10) ?? '',
      paidDate: fee.paidDate?.slice(0, 10) ?? '', status: fee.status,
      month: fee.month ?? '', academicYear: fee.academicYear ?? '',
      receiptNo: fee.receiptNo ?? '', remarks: fee.remarks ?? '',
    });
    setEditingFee(fee); setView('edit');
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#e91e8c]/10 to-[#9c27b0]/10 rounded-2xl p-4 border border-[#e91e8c]/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#9c27b0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden">
          {student.photoUrl ? <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#1A1A2E] truncate">{student.fullName}</p>
          <p className="text-xs text-gray-500 font-mono">{student.studentId}</p>
        </div>
        <IndianRupee size={16} className="text-[#e91e8c]" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Fees', value: fmt(summary.totalAmount), color: '#1A1A2E', icon: Receipt },
          { label: 'Amount Paid', value: fmt(summary.totalPaid), color: '#4ECDC4', icon: CheckCircle2 },
          { label: 'Balance Due', value: fmt(summary.totalDue), color: summary.totalDue > 0 ? '#FF6B6B' : '#4ECDC4', icon: CreditCard },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
            <Icon size={14} style={{ color }} className="mx-auto mb-1" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <p className="text-base font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-black text-[#1A1A2E] uppercase tracking-wider">Fee Records</h4>
            <button onClick={() => { setFeeForm({ status: 'Pending', paidAmount: '0' }); setView('add'); }}
              className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_6px_20px_rgba(233,30,140,0.3)] hover:-translate-y-0.5 transition-all">
              <Plus size={15} /> Add Fee
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={28} /></div>
          ) : fees.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Receipt size={28} className="mx-auto mb-3 text-gray-300" />
              <p className="font-bold text-[#1A1A2E] text-sm">No fee records yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fees.map((fee) => {
                const bal = fee.amount - fee.paidAmount;
                return (
                  <div key={fee.id} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-4 hover:border-[#e91e8c]/30 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-black text-[#1A1A2E] text-sm">{fee.feeType}</span>
                          <FeeStatusBadge status={fee.status} />
                          {fee.month && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fee.month}</span>}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div><span className="text-gray-400 font-bold">Total</span><br /><span className="font-black text-[#1A1A2E]">{fmt(fee.amount)}</span></div>
                          <div><span className="text-gray-400 font-bold">Paid</span><br /><span className="font-black text-[#4ECDC4]">{fmt(fee.paidAmount)}</span></div>
                          <div><span className="text-gray-400 font-bold">Balance</span><br /><span className={`font-black ${bal > 0 ? 'text-[#FF6B6B]' : 'text-[#4ECDC4]'}`}>{fmt(bal)}</span></div>
                          {fee.dueDate && <div><span className="text-gray-400 font-bold">Due</span><br /><span className="font-black text-[#1A1A2E]">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span></div>}
                        </div>
                        {fee.receiptNo && <p className="text-[10px] text-gray-400 mt-2 font-mono">Receipt: {fee.receiptNo}</p>}
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEdit(fee)} className="p-2 text-[#FFB347] bg-[#FFB347]/10 rounded-xl hover:bg-[#FFB347]/20 transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(fee.id)} disabled={deletingId === fee.id}
                          className="p-2 text-[#FF6B6B] bg-[#FF6B6B]/10 rounded-xl hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-50">
                          {deletingId === fee.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/60 rounded-full transition-all"
                        style={{ width: `${fee.amount > 0 ? Math.min(100, (fee.paidAmount / fee.amount) * 100) : 0}%` }} />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold text-right">
                      {fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0}% paid
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {view === 'add' && (
        <>
          <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
          <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleAdd} submitting={submitting} onCancel={() => { setView('list'); setFeeForm({}); }} />
        </>
      )}
      {view === 'edit' && editingFee && (
        <>
          <button onClick={() => { setView('list'); setEditingFee(null); }} className="text-xs font-bold text-gray-400 hover:text-[#e91e8c] transition-colors">← Back to list</button>
          <FeeForm form={feeForm} setForm={setFeeForm} onSubmit={handleEdit} submitting={submitting} onCancel={() => { setView('list'); setEditingFee(null); }} isEdit />
        </>
      )}
      <ToastStack toasts={toasts} />
    </div>
  );
}

// ── Actions Dropdown ───────────────────────────────────────────────────────────
// Uses a React Portal to render the menu directly into document.body,
// fully escaping the table's scroll/stacking context so it never gets clipped.
function ActionsMenu({ onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onViewFees }: any) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Ensure we only use createPortal after hydration
  useEffect(() => { setMounted(true); }, []);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      // Anchor the menu's RIGHT edge to the button's RIGHT edge → opens leftward
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close, true);
    return () => document.removeEventListener('mousedown', close, true);
  }, [open]);

  // Close on scroll or resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [open]);

  const items = [
    { icon: Pencil, label: 'Edit', color: '#FFB347', action: onEdit },
    { icon: KeyRound, label: 'Generate Password', color: '#4ECDC4', action: onGeneratePassword },
    { icon: IdCard, label: 'View ID Card', color: '#A78BFA', action: onViewIdCard },
    { icon: IndianRupee, label: 'Manage Fees', color: '#e91e8c', action: onViewFees },
    { icon: Eye, label: 'View Report', color: '#64B6FF', action: onViewReport },
    { icon: Download, label: 'Download Report', color: '#6BCB77', action: onDownloadReport },
    { icon: Trash2, label: 'Delete', color: '#FF6B6B', action: onDelete },
  ];

  const menu = open && (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: pos.top,
        right: pos.right,
        zIndex: 99999,   // above everything — portal renders outside the table DOM
      }}
      className="bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] py-1.5 min-w-[210px]"
    >
      {items.map(({ icon: Icon, label, color, action }) => (
        <button key={label}
          onMouseDown={(e) => { e.stopPropagation(); setOpen(false); setTimeout(action, 10); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
          <Icon size={14} style={{ color }} />
          <span style={{ color: label === 'Delete' ? '#FF6B6B' : undefined }}>{label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button ref={btnRef} onClick={handleOpen}
        className="p-2 text-gray-500 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
        title="Actions">
        <MoreHorizontal size={15} />
      </button>
      {/* Portal teleports the menu to document.body — zero stacking context interference */}
      {mounted && menu && createPortal(menu, document.body)}
    </>
  );
}

// ── ID Card ────────────────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = student.dateOfBirth   ? new Date(student.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   return (
//     <div className="flex justify-center">
//       <div style={{ width: w, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #eee', fontFamily: 'Arial,sans-serif' }}>
//         <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//           <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
//           <div>
//             <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 10px' }}>
//           <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {student.photoUrl
//               ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//               : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//           </div>
//         </div>
//         <div style={{ padding: '0 11px 8px', fontSize: 8 }}>
//           {[['Name', student.fullName ?? '—'], ['D.O.B', dob], ['Adm Date', admDate], ['Mob.', student.parentPhone ?? '—'],
//             ['Class', student.programLevel?.name ?? student.program?.name ?? '—'], ['Parent', student.parentName ?? '—']].map(([l, v]) => (
//             <div key={l} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//               <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{l}</span>
//               <span style={{ color: '#555', fontWeight: 600 }}>: &nbsp;{v}</span>
//             </div>
//           ))}
//           {student.bloodGroup && <div style={{ display: 'flex', gap: 3 }}><span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span><span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span></div>}
//         </div>
//         <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%' }}>
//           <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//           <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//         </svg>
//       </div>
//     </div>
//   );
// }

// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = ''; if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }
//   const admDate = s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const dob     = s.dateOfBirth   ? new Date(s.dateOfBirth).toLocaleDateString('en-IN',   { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
//   const w = CARD_W;
//   const photo = photoSrc
//     ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c"/>`
//     : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;
//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f5f5f5;display:flex;align-items:flex-start;justify-content:center;padding:20px}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div style="width:${w}px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15);border:1px solid #eee"><div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px"><div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff">A</div><div><div style="color:#fff;font-weight:900;font-size:11px">${SCHOOL_NAME}</div><div style="color:rgba(255,255,255,.7);font-size:6.5px">Adm: ${s.studentId}</div></div></div><div style="display:flex;flex-direction:column;align-items:center;padding:8px 10px">${photo}</div><div style="padding:0 11px 8px;font-size:8px">${[['Name',s.fullName??'—'],['D.O.B',dob],['Adm Date',admDate],['Mob.',s.parentPhone??'—'],['Class',s.programLevel?.name??s.program?.name??'—'],['Parent',s.parentName??'—']].map(([l,v])=>`<div style="display:flex;gap:3px;margin-bottom:3px"><span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${l}</span><span style="color:#555">: ${v}</span></div>`).join('')}${s.bloodGroup?`<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: ${s.bloodGroup}</span></div>`:''}</div><svg viewBox="0 0 ${w} 18" style="display:block;width:100%"><path d="M0,18 L0,10 Q${w*.25},0 ${w*.5},6 Q${w*.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*.25},3 ${w*.5},10 Q${w*.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/></svg></div></body></html>`;
// }


// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENTS for StudentsView.tsx
// Replace the existing `IDCard` component AND `buildIDCardHTML` function with
// the two exports below. Everything else in StudentsView stays untouched.
// Colors: pink #e91e8c / purple #9c27b0 — unchanged from original.
// ─────────────────────────────────────────────────────────────────────────────

// ── ID Card Preview (React) — front + back, 208 px wide ──────────────────────
// function IDCard({ student }: { student: any }) {
//   const admDate = student.admissionDate
//     ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
//     : '—';
//   const dob = student.dateOfBirth
//     ? new Date(student.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
//     : '—';
//   const w = CARD_W; // 208

//   const cardStyle: React.CSSProperties = {
//     width: w,
//     background: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
//     border: '1px solid #eee',
//     fontFamily: 'Arial, sans-serif',
//   };

//   return (
//     <div className="flex flex-col gap-4 items-center">

//       {/* ── FRONT ── */}
//       <div style={{ width: w }} className="flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
//         <div style={cardStyle}>

//           {/* Header */}
//           <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
//             <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
//               A
//             </div>
//             <div>
//               <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//               <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 2 }}>Adm: {student.studentId ?? '—'}</div>
//             </div>
//           </div>

//           {/* Subtle wave under header */}
//           <svg viewBox={`0 0 ${w} 14`} style={{ display: 'block', width: '100%' }}>
//             <path d={`M0,14 Q${w * .25},0 ${w * .5},8 Q${w * .75},16 ${w},3 L${w},0 L0,0 Z`} fill="#e91e8c" opacity="0.15" />
//           </svg>

//           {/* Photo */}
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 10px 8px' }}>
//             <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               {student.photoUrl
//                 ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                 : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
//             </div>
//           </div>

//           {/* Info rows */}
//           <div style={{ padding: '0 11px 5px', fontSize: 8 }}>
//             {([
//               ['Name',     student.fullName ?? '—',                              false],
//               ['D.O.B',   dob,                                                   false],
//               ['Adm Date',admDate,                                               false],
//               ['Mob.',    student.parentPhone ?? '—',                            false],
//               ['Class',   student.programLevel?.name ?? student.program?.name ?? '—', true],
//               ['Parent',  student.parentName ?? '—',                             false],
//             ] as [string, string, boolean][]).map(([label, value, highlight]) => (
//               <div key={label} style={{ display: 'flex', gap: 3, marginBottom: 3, alignItems: 'flex-start' }}>
//                 <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{label}</span>
//                 <span style={{ color: highlight ? '#e91e8c' : '#555', fontWeight: highlight ? 900 : 600 }}>: &nbsp;{value}</span>
//               </div>
//             ))}
//             {student.bloodGroup && (
//               <div style={{ display: 'flex', gap: 3 }}>
//                 <span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span>
//                 <span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span>
//               </div>
//             )}
//           </div>

//           {/* Signature line */}
//           <div style={{ padding: '3px 11px', display: 'flex', justifyContent: 'flex-end' }}>
//             <div style={{ textAlign: 'center' }}>
//               <div style={{ borderBottom: '1px solid #aaa', width: 48, marginBottom: 2 }} />
//               <div style={{ fontSize: 6.5, color: '#777' }}>Auth. Sign.</div>
//             </div>
//           </div>

//           {/* Wave footer */}
//           <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%', marginTop: 2 }}>
//             <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//             <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//           </svg>
//         </div>
//       </div>

//       {/* ── BACK ── */}
//       <div style={{ width: w }} className="flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
//         <div style={cardStyle}>

//           {/* Inverted wave header */}
//           <svg viewBox={`0 0 ${w} 22`} style={{ display: 'block', width: '100%' }}>
//             <path d={`M0,0 L${w},0 L${w},13 Q${w * .75},22 ${w * .5},16 Q${w * .25},10 0,19 Z`} fill="#9c27b0" opacity=".6" />
//             <path d={`M0,0 L${w},0 L${w},8 Q${w * .75},18 ${w * .5},11 Q${w * .25},5 0,14 Z`} fill="#e91e8c" />
//           </svg>

//           {/* School logo block */}
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 11px 6px', textAlign: 'center' }}>
//             <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#e91e8c,#9c27b0)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5, fontSize: 16, fontWeight: 900, color: '#fff' }}>
//               A
//             </div>
//             <div style={{ fontWeight: 900, fontSize: 11, color: '#1a1a2e', lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
//           </div>

//           <div style={{ height: 1, background: '#f0eef8', margin: '0 11px' }} />

//           {/* School contact */}
//           <div style={{ padding: '6px 11px', textAlign: 'center', fontSize: 7.5, color: '#444', lineHeight: 1.6 }}>
//             <div>{SCHOOL_ADDRESS}</div>
//             <div>{SCHOOL_WEBSITE}</div>
//             <div>Mob.: {SCHOOL_PHONE}</div>
//           </div>

//           <div style={{ height: 1, background: '#f0eef8', margin: '0 11px' }} />

//           {/* Finder section */}
//           <div style={{ padding: '6px 11px 5px', textAlign: 'center' }}>
//             <div style={{ fontWeight: 900, fontSize: 8.5, color: '#e91e8c', marginBottom: 3, lineHeight: 1.3 }}>
//               Finder may please<br />return to
//             </div>
//             <div style={{ fontSize: 7.5, color: '#444', lineHeight: 1.6 }}>
//               {SCHOOL_ADDRESS}<br />Mob.: {student.parentPhone ?? '—'}
//             </div>
//           </div>

//           {/* Status chip */}
//           <div style={{ display: 'flex', justifyContent: 'center', padding: '3px 11px 5px' }}>
//             <div style={{ background: '#4ecdc422', border: '1px solid #4ecdc444', borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 3 }}>
//               <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ecdc4' }} />
//               <span style={{ fontSize: 7, fontWeight: 900, color: '#4ecdc4' }}>{student.status ?? 'Active'}</span>
//             </div>
//           </div>

//           {/* Wave footer */}
//           <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%', marginTop: 3 }}>
//             <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
//             <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
//           </svg>
//         </div>
//       </div>

//     </div>
//   );
// }


// // ── buildIDCardHTML — print/PDF version, front + back, 208 px ─────────────────
// async function buildIDCardHTML(s: any): Promise<string> {
//   let photoSrc = '';
//   if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }

//   const admDate = s.admissionDate
//     ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
//     : '—';
//   const dob = s.dateOfBirth
//     ? new Date(s.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
//     : '—';

//   const w = CARD_W; // 208

//   const photoHtml = photoSrc
//     ? `<img src="${photoSrc}" class="photo" />`
//     : `<div class="photo-av">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;

//   const rows: [string, string, boolean][] = [
//     ['Name',     s.fullName ?? '—',                                    false],
//     ['D.O.B',   dob,                                                    false],
//     ['Adm Date',admDate,                                                false],
//     ['Mob.',    s.parentPhone ?? '—',                                   false],
//     ['Class',   s.programLevel?.name ?? s.program?.name ?? '—',        true],
//     ['Parent',  s.parentName ?? '—',                                    false],
//   ];
//   const infoRowsHtml = rows.map(([label, value, highlight]) =>
//     `<div class="row"><span class="lbl">${label}</span><span class="val${highlight ? ' highlight' : ''}">: &nbsp;${value}</span></div>`
//   ).join('');
//   const bloodHtml = s.bloodGroup
//     ? `<div class="row"><span class="lbl">Blood</span><span class="val highlight">: &nbsp;${s.bloodGroup}</span></div>`
//     : '';

//   return `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>ID Card — ${s.fullName ?? 'Student'}</title>
// <style>
//   * { margin:0; padding:0; box-sizing:border-box; }
//   @page { size: A4 portrait; margin: 15mm; }
//   body {
//     font-family: Arial, Helvetica, sans-serif;
//     background: #f5f5f5;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 16px;
//     padding: 20px;
//   }
//   .card {
//     width: ${w}px;
//     background: #fff;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//     border: 1px solid #eee;
//     font-family: Arial, sans-serif;
//   }

//   /* ── FRONT ── */
//   .header {
//     background: linear-gradient(135deg,#e91e8c,#c2185b);
//     padding: 8px 10px 6px;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }
//   .logo-av {
//     width: 29px; height: 29px;
//     background: rgba(255,255,255,.25);
//     border-radius: 5px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 12px; font-weight: 900; color: #fff; flex-shrink: 0;
//   }
//   .school-name { color:#fff; font-weight:900; font-size:11px; line-height:1.2; }
//   .school-adm  { color:rgba(255,255,255,.7); font-size:6.5px; margin-top:2px; }

//   .photo-wrap {
//     display: flex; flex-direction: column; align-items: center;
//     padding: 5px 10px 8px;
//   }
//   .photo {
//     width:64px; height:72px; border-radius:50%;
//     object-fit:cover; border:3px solid #e91e8c;
//   }
//   .photo-av {
//     width:64px; height:72px; border-radius:50%;
//     background:#f3e5f5; border:3px solid #e91e8c;
//     display:flex; align-items:center; justify-content:center;
//     font-size:22px; font-weight:900; color:#e91e8c;
//   }

//   .info { padding: 0 11px 5px; font-size: 8px; }
//   .row  { display:flex; gap:3px; margin-bottom:3px; align-items:flex-start; }
//   .lbl  { font-weight:700; color:#333; width:44px; flex-shrink:0; }
//   .val  { color:#555; font-weight:600; }
//   .val.highlight { color:#e91e8c; font-weight:900; }

//   .sign-row  { padding:3px 11px; display:flex; justify-content:flex-end; }
//   .sign-inner { text-align:center; }
//   .sign-line  { border-bottom:1px solid #aaa; width:48px; margin-bottom:2px; }
//   .sign-label { font-size:6.5px; color:#777; }

//   /* ── BACK ── */
//   .back-logo {
//     display:flex; flex-direction:column; align-items:center;
//     padding:8px 11px 6px; text-align:center;
//   }
//   .back-logo-av {
//     width:38px; height:38px;
//     background:linear-gradient(135deg,#e91e8c,#9c27b0);
//     border-radius:7px;
//     display:flex; align-items:center; justify-content:center;
//     font-size:16px; font-weight:900; color:#fff; margin-bottom:5px;
//   }
//   .back-school { font-weight:900; font-size:11px; color:#1a1a2e; line-height:1.2; }
//   .divider { height:1px; background:#f0eef8; margin:0 11px; }
//   .back-contact {
//     padding:6px 11px; text-align:center;
//     font-size:7.5px; color:#444; line-height:1.6;
//   }
//   .finder { padding:6px 11px 5px; text-align:center; }
//   .finder-title { font-weight:900; font-size:8.5px; color:#e91e8c; margin-bottom:3px; line-height:1.3; }
//   .finder-addr  { font-size:7.5px; color:#444; line-height:1.6; }
//   .status-wrap  { display:flex; justify-content:center; padding:3px 11px 5px; }
//   .status-chip  {
//     background:#4ecdc422; border:1px solid #4ecdc444;
//     border-radius:20px; padding:2px 8px;
//     display:flex; align-items:center; gap:3px;
//   }
//   .status-dot   { width:4px; height:4px; border-radius:50%; background:#4ecdc4; }
//   .status-txt   { font-size:7px; font-weight:900; color:#4ecdc4; }

//   .card-label {
//     text-align:center; font-size:10px; font-weight:900;
//     text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:6px;
//   }
//   .card-wrapper { display:flex; flex-direction:column; align-items:center; }

//   @media print {
//     body { background:#fff; gap:16px; padding:0; }
//     * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
//   }
// </style>
// </head>
// <body>

// <!-- ── FRONT ── -->
// <div class="card-wrapper">
//   <div class="card-label">Front</div>
//   <div class="card">
//     <div class="header">
//       <div class="logo-av">A</div>
//       <div>
//         <div class="school-name">${SCHOOL_NAME}</div>
//         <div class="school-adm">Adm: ${s.studentId ?? '—'}</div>
//       </div>
//     </div>

//     <svg viewBox="0 0 ${w} 14" style="display:block;width:100%">
//       <path d="M0,14 Q${w * .25},0 ${w * .5},8 Q${w * .75},16 ${w},3 L${w},0 L0,0 Z" fill="#e91e8c" opacity="0.15"/>
//     </svg>

//     <div class="photo-wrap">${photoHtml}</div>

//     <div class="info">
//       ${infoRowsHtml}
//       ${bloodHtml}
//     </div>

//     <div class="sign-row">
//       <div class="sign-inner">
//         <div class="sign-line"></div>
//         <div class="sign-label">Auth. Sign.</div>
//       </div>
//     </div>

//     <svg viewBox="0 0 ${w} 18" style="display:block;width:100%;margin-top:2px">
//       <path d="M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/>
//       <path d="M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/>
//     </svg>
//   </div>
// </div>

// <!-- ── BACK ── -->
// <div class="card-wrapper">
//   <div class="card-label">Back</div>
//   <div class="card">
//     <svg viewBox="0 0 ${w} 22" style="display:block;width:100%">
//       <path d="M0,0 L${w},0 L${w},13 Q${w * .75},22 ${w * .5},16 Q${w * .25},10 0,19 Z" fill="#9c27b0" opacity=".6"/>
//       <path d="M0,0 L${w},0 L${w},8 Q${w * .75},18 ${w * .5},11 Q${w * .25},5 0,14 Z" fill="#e91e8c"/>
//     </svg>

//     <div class="back-logo">
//       <div class="back-logo-av">A</div>
//       <div class="back-school">${SCHOOL_NAME}</div>
//     </div>

//     <div class="divider"></div>

//     <div class="back-contact">
//       ${SCHOOL_ADDRESS}<br/>
//       ${SCHOOL_WEBSITE}<br/>
//       Mob.: ${SCHOOL_PHONE}
//     </div>

//     <div class="divider"></div>

//     <div class="finder">
//       <div class="finder-title">Finder may please<br/>return to</div>
//       <div class="finder-addr">${SCHOOL_ADDRESS}<br/>Mob.: ${s.parentPhone ?? '—'}</div>
//     </div>

//     <div class="status-wrap">
//       <div class="status-chip">
//         <div class="status-dot"></div>
//         <span class="status-txt">${s.status ?? 'Active'}</span>
//       </div>
//     </div>

//     <svg viewBox="0 0 ${w} 18" style="display:block;width:100%;margin-top:3px">
//       <path d="M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/>
//       <path d="M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/>
//     </svg>
//   </div>
// </div>

// </body>
// </html>`;
// }



// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENTS for StudentsView.tsx
//
// CHANGES vs previous version:
//  1. Add this constant near the other SCHOOL_* constants at the top:
//       const LOGO_URL = '/1781237707749_bestlogoascento.jpeg';
//     (copy the logo file to your /public folder first)
//
//  2. Replace `function IDCard` with the one below.
//  3. Replace `async function buildIDCardHTML` with the one below.
//  4. Update the ID Card modal call — pass logoUrl:
//       <IDCard student={idCardStudent} logoUrl={LOGO_URL} />
//     and the print button:
//       onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent, LOGO_URL))}
// ─────────────────────────────────────────────────────────────────────────────


// ── Add this near the top with other SCHOOL_* constants ──────────────────────
// const LOGO_URL = '/1781237707749_bestlogoascento.jpeg';
// (rename the file to something simpler like /ascento-logo.jpeg if you prefer)


// ── ID Card Preview (React) — front + back, 208 px ───────────────────────────
function IDCard({ student, logoUrl }: { student: any; logoUrl?: string }) {
  const admDate = student.admissionDate
    ? new Date(student.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';
  const dob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';
  const w = CARD_W; // 208

  // Student's full address for the finder section
  const studentAddress = [student.address, student.city, student.state].filter(Boolean).join(', ') || SCHOOL_ADDRESS;

  const cardStyle: React.CSSProperties = {
    width: w,
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '1px solid #eee',
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div className="flex flex-col gap-4 items-center">

      {/* ── FRONT ── */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
        <div style={cardStyle}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Logo */}
            {logoUrl
              ? <img src={logoUrl} alt="School Logo" style={{ width: 29, height: 29, borderRadius: 5, objectFit: 'contain', background: '#fff', padding: 2, flexShrink: 0 }} />
              : <div style={{ width: 29, height: 29, background: 'rgba(255,255,255,.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>A</div>
            }
            <div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
              <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 7, lineHeight: 1.3 }}>{SCHOOL_TAGLINE}</div>
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 6.5, marginTop: 1 }}>Adm: {student.studentId ?? '—'}</div>
            </div>
          </div>

          {/* Subtle wave */}
          <svg viewBox={`0 0 ${w} 14`} style={{ display: 'block', width: '100%' }}>
            <path d={`M0,14 Q${w * .25},0 ${w * .5},8 Q${w * .75},16 ${w},3 L${w},0 L0,0 Z`} fill="#e91e8c" opacity="0.12" />
          </svg>

          {/* Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 10px 8px' }}>
            <div style={{ width: 64, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e91e8c', background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {student.photoUrl
                ? <img src={student.photoUrl} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 22, fontWeight: 900, color: '#e91e8c' }}>{student.fullName?.[0]?.toUpperCase() ?? '?'}</span>}
            </div>
          </div>

          {/* Info rows */}
          <div style={{ padding: '0 11px 5px', fontSize: 8 }}>
            {([
              ['Name', student.fullName ?? '—', false],
              ['D.O.B', dob, false],
              ['Adm Date', admDate, false],
              ['Mob.', student.parentPhone ?? '—', false],
              ['Class', student.programLevel?.name ?? student.program?.name ?? '—', true],
              ['Parent', student.parentName ?? '—', false],
            ] as [string, string, boolean][]).map(([label, value, highlight]) => (
              <div key={label} style={{ display: 'flex', gap: 3, marginBottom: 3, alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, color: '#333', width: 44, flexShrink: 0 }}>{label}</span>
                <span style={{ color: highlight ? '#e91e8c' : '#555', fontWeight: highlight ? 900 : 600 }}>: &nbsp;{value}</span>
              </div>
            ))}
            {student.bloodGroup && (
              <div style={{ display: 'flex', gap: 3 }}>
                <span style={{ fontWeight: 700, color: '#333', width: 44 }}>Blood</span>
                <span style={{ color: '#e91e8c', fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Signature */}
          <div style={{ padding: '3px 11px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #aaa', width: 48, marginBottom: 2 }} />
              <div style={{ fontSize: 6.5, color: '#777' }}>Auth. Sign.</div>
            </div>
          </div>

          {/* Wave footer */}
          <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%', marginTop: 2 }}>
            <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
            <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
          </svg>
        </div>
      </div>

      {/* ── BACK ── */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
        <div style={cardStyle}>

          {/* Inverted wave header */}
          <svg viewBox={`0 0 ${w} 22`} style={{ display: 'block', width: '100%' }}>
            <path d={`M0,0 L${w},0 L${w},13 Q${w * .75},22 ${w * .5},16 Q${w * .25},10 0,19 Z`} fill="#9c27b0" opacity=".6" />
            <path d={`M0,0 L${w},0 L${w},8 Q${w * .75},18 ${w * .5},11 Q${w * .25},5 0,14 Z`} fill="#e91e8c" />
          </svg>

          {/* School logo block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 11px 6px', textAlign: 'center' }}>
            {logoUrl
              ? <img src={logoUrl} alt="School Logo" style={{ width: 38, height: 38, borderRadius: 7, objectFit: 'contain', marginBottom: 5 }} />
              : <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#e91e8c,#9c27b0)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5, fontSize: 16, fontWeight: 900, color: '#fff' }}>A</div>
            }
            <div style={{ fontWeight: 900, fontSize: 11, color: '#1a1a2e', lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
            <div style={{ fontSize: 7, color: '#888', marginTop: 1 }}>{SCHOOL_TAGLINE}</div>
          </div>

          <div style={{ height: 1, background: '#f0eef8', margin: '0 11px' }} />

          {/* School contact */}
          <div style={{ padding: '6px 11px', textAlign: 'center', fontSize: 7.5, color: '#444', lineHeight: 1.6 }}>
            <div>{SCHOOL_ADDRESS}</div>
            <div>{SCHOOL_WEBSITE}</div>
            <div>Mob.: {SCHOOL_PHONE}</div>
          </div>

          <div style={{ height: 1, background: '#f0eef8', margin: '0 11px' }} />

          {/* Finder — student's own address */}
          <div style={{ padding: '6px 11px 5px', textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 8.5, color: '#e91e8c', marginBottom: 3, lineHeight: 1.3 }}>
              Finder may please<br />return to
            </div>
            <div style={{ fontSize: 7.5, color: '#444', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{student.fullName ?? '—'}</div>
              <div>{studentAddress}</div>
              <div>Mob.: {student.parentPhone ?? '—'}</div>
            </div>
          </div>

          {/* Status chip */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3px 11px 5px' }}>
            <div style={{ background: '#4ecdc422', border: '1px solid #4ecdc444', borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ecdc4' }} />
              <span style={{ fontSize: 7, fontWeight: 900, color: '#4ecdc4' }}>{student.status ?? 'Active'}</span>
            </div>
          </div>

          {/* Wave footer */}
          <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%', marginTop: 3 }}>
            <path d={`M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z`} fill="#e91e8c" />
            <path d={`M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity=".6" />
          </svg>
        </div>
      </div>

    </div>
  );
}


// ── buildIDCardHTML — print/PDF version, front + back ────────────────────────
async function buildIDCardHTML(s: any, logoUrl?: string): Promise<string> {
  let photoSrc = '';
  if (s.photoUrl) { const b = await urlToBase64(s.photoUrl); if (b) photoSrc = b; }

  // Convert logo to base64 so it embeds in the print window (no network needed)
  let logoSrc = '';
  if (logoUrl) { const b = await urlToBase64(logoUrl); if (b) logoSrc = b; }

  const admDate = s.admissionDate
    ? new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';
  const dob = s.dateOfBirth
    ? new Date(s.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  // Student's own address for finder section
  const studentAddress = [s.address, s.city, s.state].filter(Boolean).join(', ') || SCHOOL_ADDRESS;

  const w = CARD_W; // 208

  const logoFront = logoSrc
    ? `<img src="${logoSrc}" style="width:29px;height:29px;border-radius:5px;object-fit:contain;background:#fff;padding:2px;flex-shrink:0" />`
    : `<div style="width:29px;height:29px;background:rgba(255,255,255,.25);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;flex-shrink:0">A</div>`;

  const logoBack = logoSrc
    ? `<img src="${logoSrc}" style="width:38px;height:38px;border-radius:7px;object-fit:contain;margin-bottom:5px" />`
    : `<div style="width:38px;height:38px;background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:7px;display:flex;align-items:center;justify-content:center;margin-bottom:5px;font-size:16px;font-weight:900;color:#fff">A</div>`;

  const photoHtml = photoSrc
    ? `<img src="${photoSrc}" style="width:64px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e91e8c" />`
    : `<div style="width:64px;height:72px;border-radius:50%;background:#f3e5f5;border:3px solid #e91e8c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#e91e8c">${(s.fullName?.[0] ?? '?').toUpperCase()}</div>`;

  const rows: [string, string, boolean][] = [
    ['Name', s.fullName ?? '—', false],
    ['D.O.B', dob, false],
    ['Adm Date', admDate, false],
    ['Mob.', s.parentPhone ?? '—', false],
    ['Class', s.programLevel?.name ?? s.program?.name ?? '—', true],
    ['Parent', s.parentName ?? '—', false],
  ];
  const infoRows = rows.map(([label, value, highlight]) =>
    `<div style="display:flex;gap:3px;margin-bottom:3px;align-items:flex-start">
       <span style="font-weight:700;color:#333;width:44px;flex-shrink:0">${label}</span>
       <span style="color:${highlight ? '#e91e8c' : '#555'};font-weight:${highlight ? 900 : 600}">: &nbsp;${value}</span>
     </div>`
  ).join('');
  const bloodRow = s.bloodGroup
    ? `<div style="display:flex;gap:3px"><span style="font-weight:700;color:#333;width:44px">Blood</span><span style="color:#e91e8c;font-weight:900">: &nbsp;${s.bloodGroup}</span></div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ID Card — ${s.fullName ?? 'Student'}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 portrait; margin: 15mm; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
  .card-wrapper { display:flex; flex-direction:column; align-items:center; }
  .card-label {
    text-align:center; font-size:10px; font-weight:900;
    text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:6px;
  }
  .card {
    width:${w}px; background:#fff; border-radius:12px; overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.15); border:1px solid #eee;
    font-family:Arial,sans-serif;
  }
  @media print {
    body { background:#fff; gap:16px; padding:0; }
    * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  }
</style>
</head>
<body>

<!-- ── FRONT ── -->
<div class="card-wrapper">
  <div class="card-label">Front</div>
  <div class="card">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e91e8c,#c2185b);padding:8px 10px 6px;display:flex;align-items:center;gap:6px">
      ${logoFront}
      <div>
        <div style="color:#fff;font-weight:900;font-size:11px;line-height:1.2">${SCHOOL_NAME}</div>
        <div style="color:rgba(255,255,255,.8);font-size:7px;line-height:1.3">${SCHOOL_TAGLINE}</div>
        <div style="color:rgba(255,255,255,.7);font-size:6.5px;margin-top:1px">Adm: ${s.studentId ?? '—'}</div>
      </div>
    </div>

    <!-- Subtle top wave -->
    <svg viewBox="0 0 ${w} 14" style="display:block;width:100%">
      <path d="M0,14 Q${w * .25},0 ${w * .5},8 Q${w * .75},16 ${w},3 L${w},0 L0,0 Z" fill="#e91e8c" opacity="0.12"/>
    </svg>

    <!-- Photo -->
    <div style="display:flex;flex-direction:column;align-items:center;padding:5px 10px 8px">
      ${photoHtml}
    </div>

    <!-- Info rows -->
    <div style="padding:0 11px 5px;font-size:8px">
      ${infoRows}
      ${bloodRow}
    </div>

    <!-- Signature -->
    <div style="padding:3px 11px;display:flex;justify-content:flex-end">
      <div style="text-align:center">
        <div style="border-bottom:1px solid #aaa;width:48px;margin-bottom:2px"></div>
        <div style="font-size:6.5px;color:#777">Auth. Sign.</div>
      </div>
    </div>

    <!-- Wave footer -->
    <svg viewBox="0 0 ${w} 18" style="display:block;width:100%;margin-top:2px">
      <path d="M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/>
      <path d="M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/>
    </svg>
  </div>
</div>

<!-- ── BACK ── -->
<div class="card-wrapper">
  <div class="card-label">Back</div>
  <div class="card">

    <!-- Inverted wave header -->
    <svg viewBox="0 0 ${w} 22" style="display:block;width:100%">
      <path d="M0,0 L${w},0 L${w},13 Q${w * .75},22 ${w * .5},16 Q${w * .25},10 0,19 Z" fill="#9c27b0" opacity=".6"/>
      <path d="M0,0 L${w},0 L${w},8 Q${w * .75},18 ${w * .5},11 Q${w * .25},5 0,14 Z" fill="#e91e8c"/>
    </svg>

    <!-- Logo + school name -->
    <div style="display:flex;flex-direction:column;align-items:center;padding:8px 11px 6px;text-align:center">
      ${logoBack}
      <div style="font-weight:900;font-size:11px;color:#1a1a2e;line-height:1.2">${SCHOOL_NAME}</div>
      <div style="font-size:7px;color:#888;margin-top:1px">${SCHOOL_TAGLINE}</div>
    </div>

    <div style="height:1px;background:#f0eef8;margin:0 11px"></div>

    <!-- School contact -->
    <div style="padding:6px 11px;text-align:center;font-size:7.5px;color:#444;line-height:1.6">
      <div>${SCHOOL_ADDRESS}</div>
      <div>${SCHOOL_WEBSITE}</div>
      <div>Mob.: ${SCHOOL_PHONE}</div>
    </div>

    <div style="height:1px;background:#f0eef8;margin:0 11px"></div>

    <!-- Finder — student's own address -->
    <div style="padding:6px 11px 5px;text-align:center">
      <div style="font-weight:900;font-size:8.5px;color:#e91e8c;margin-bottom:3px;line-height:1.3">
        Finder may please<br/>return to
      </div>
      <div style="font-size:7.5px;color:#444;line-height:1.6">
        <div style="font-weight:700;color:#1a1a2e">${s.fullName ?? '—'}</div>
        <div>${studentAddress}</div>
        <div>Mob.: ${s.parentPhone ?? '—'}</div>
      </div>
    </div>

    <!-- Status chip -->
    <div style="display:flex;justify-content:center;padding:3px 11px 5px">
      <div style="background:#4ecdc422;border:1px solid #4ecdc444;border-radius:20px;padding:2px 8px;display:flex;align-items:center;gap:3px">
        <div style="width:4px;height:4px;border-radius:50%;background:#4ecdc4"></div>
        <span style="font-size:7px;font-weight:900;color:#4ecdc4">${s.status ?? 'Active'}</span>
      </div>
    </div>

    <!-- Wave footer -->
    <svg viewBox="0 0 ${w} 18" style="display:block;width:100%;margin-top:3px">
      <path d="M0,18 L0,10 Q${w * .25},0 ${w * .5},6 Q${w * .75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/>
      <path d="M0,18 L0,13 Q${w * .25},3 ${w * .5},10 Q${w * .75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity=".6"/>
    </svg>
  </div>
</div>

</body>
</html>`;
}


async function buildReportHTML(r: any): Promise<string> {
  let photoHtml = '';
  if (r.photoUrl) { const b = await urlToBase64(r.photoUrl); if (b) photoHtml = `<img src="${b}" style="width:60px;height:72px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0"/>`; }
  const admDate = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const addr = [r.address, r.city, r.state].filter(Boolean).join(', ') || '—';
  const gen = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const fields: [string, string][] = [
    ['Student ID', r.studentId], ['Full Name', r.fullName], ['Email', r.email ?? '—'],
    ['Date of Birth', r.dateOfBirth ?? '—'], ['Admission Date', admDate],
    ['Gender', r.gender ?? '—'], ['Blood Group', r.bloodGroup ?? '—'],
    ['Program', r.program?.name ?? '—'], ['Level / Class', r.level?.name ?? '—'],
    ['Section', r.section ? `Section ${r.section}` : '—'], ['Roll Number', r.rollNumber ?? '—'],
    ['Academic Year', r.academicYear ?? '—'], ['Status', r.status ?? '—'],
    ['Parent Name', r.parentName ?? '—'], ['Parent Phone', r.parentPhone ?? '—'],
    ['Parent Email', r.parentEmail ?? '—'], ['Address', addr],
  ];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f7f7f7;color:#1A1A2E;padding:20px}.hdr{background:linear-gradient(135deg,#e91e8c,#9c27b0);border-radius:12px;padding:20px 24px;color:#fff;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cell{background:#fff;border:1px solid #F0EEF8;border-radius:8px;padding:10px 14px}.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:2px}.val{font-size:12px;font-weight:700;word-break:break-word}.footer{margin-top:18px;text-align:center;font-size:8px;color:#ccc}@page{margin:12mm}@media print{body{background:#fff}*{-webkit-print-color-adjust:exact!important}}</style></head><body><div class="hdr"><div><div style="font-size:9px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:4px">${SCHOOL_NAME}</div><h1 style="font-size:22px;font-weight:900">${r.fullName}</h1><div style="font-family:monospace;opacity:.7;font-size:12px;margin-top:3px">${r.studentId}</div></div><div style="text-align:right">${photoHtml}<div style="font-size:9px;opacity:.65;margin-top:6px">Generated: ${gen}</div></div></div><div class="grid">${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join('')}</div><div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div></body></html>`;
}

function StudentReport({ report }: { report: any }) {
  const admDate = report.admissionDate ? new Date(report.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const fields: [string, string][] = [
    ['Student ID', report.studentId], ['Full Name', report.fullName], ['Email', report.email ?? '—'],
    ['Date of Birth', report.dateOfBirth ?? '—'], ['Admission Date', admDate],
    ['Gender', report.gender ?? '—'], ['Blood Group', report.bloodGroup ?? '—'],
    ['Program', report.program?.name ?? '—'], ['Level / Class', report.level?.name ?? '—'],
    ['Section', report.section ? `Section ${report.section}` : '—'], ['Roll Number', report.rollNumber ?? '—'],
    ['Academic Year', report.academicYear ?? '—'], ['Status', report.status ?? '—'],
    ['Parent Name', report.parentName ?? '—'], ['Parent Phone', report.parentPhone ?? '—'],
    ['Parent Email', report.parentEmail ?? '—'],
    ['Address', [report.address, report.city, report.state].filter(Boolean).join(', ') || '—'],
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME}</p>
            <p className="text-2xl font-black">{report.fullName}</p>
            <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {report.program && <BadgeChip text={report.program.name} color="#fff" />}
              {report.level && <BadgeChip text={report.level.name} color="#fff" />}
              {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
            </div>
          </div>
          {report.photoUrl && <img src={report.photoUrl} alt={report.fullName} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(([label, value]) => (
          <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function StudentsView() {
  const { token } = useAuth();
  const apiFetch = makeApiFetch(token);
  const { toasts, push } = useToasts();

  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);

  const [confirmGenFor, setConfirmGenFor] = useState<any>(null);

  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [idCardStudent, setIdCardStudent] = useState<any>(null);
  const [feesStudent, setFeesStudent] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [credentials, setCredentials] = useState<CredentialsData | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState(false);

  const [addForm, setAddForm] = useState<any>({});
  const [editForm, setEditForm] = useState<any>({});
  const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  const fetchPrograms = useCallback(async () => {
    try { const r = await apiFetch('/api/admin/programs'); setPrograms(r.programs ?? []); } catch { }
  }, [token]);
  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const fetchStudents = useCallback(async (q = '', prog = '', sec = '', stat = '') => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ search: q, limit: '100' });
      if (prog) p.set('programId', prog);
      if (sec) p.set('section', sec);
      if (stat) p.set('status', stat);
      const r = await apiFetch(`/api/admin/students?${p}`);
      setStudentsData(r.students ?? []);
    } catch { push('Failed to load students', 'error'); }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
    return () => clearTimeout(t);
  }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

  const handleToggleStatus = async (student: any) => {
    const newStatus: UserStatus = student.status === 'Active' ? 'Inactive' : 'Active';
    setTogglingStatus(student.id);
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      push(res.message ?? `Student ${newStatus === 'Active' ? 'activated' : 'deactivated'}`, newStatus === 'Active' ? 'success' : 'info');
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) {
      push(err.message || 'Failed to update status', 'error');
    }
    setTogglingStatus(null);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email) {
      push('First name, last name and email are required', 'error'); return;
    }
    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (addPhotoFile) {
        try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
        catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
      }
      const res = await apiFetch('/api/admin/students', {
        method: 'POST',
        body: JSON.stringify({
          fullName: `${addForm.firstName} ${addForm.lastName}`,
          email: addForm.email, photoUrl,
          admissionDate: addForm.admissionDate || null,
          dateOfBirth: addForm.dateOfBirth, gender: addForm.gender,
          bloodGroup: addForm.bloodGroup, rollNumber: addForm.rollNumber,
          parentName: addForm.parentName, parentPhone: addForm.parentPhone,
          parentEmail: addForm.parentEmail, address: addForm.address,
          city: addForm.city, state: addForm.state,
          section: addForm.section || null, academicYear: addForm.academicYear || null,
          programId: addForm.programId || null, programLevelId: addForm.programLevelId || null,
        }),
      });
      if (res.credentials) {
        setCredentials({ ...res.credentials, parentEmail: addForm.parentEmail });
        setIsCredentialsModalOpen(true);
      }
      push('Student registered successfully!', 'success');
      if (addForm.parentEmail) setTimeout(() => push(`Credentials emailed to ${addForm.parentEmail}`, 'email'), 600);
      setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) {
      let msg = err.message || 'Failed to add student';
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch { }
      push(msg, 'error');
    }
    setSubmitting(false);
  };

  const openEdit = (student: any) => {
    const [firstName, ...rest] = (student.fullName ?? '').split(' ');
    setEditForm({
      firstName, lastName: rest.join(' '), email: student.user?.email ?? '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
      admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
      gender: student.gender ?? '', bloodGroup: student.bloodGroup ?? '', rollNumber: student.rollNumber ?? '',
      section: student.section ?? '', academicYear: student.academicYear ?? '',
      parentName: student.parentName ?? '', parentPhone: student.parentPhone ?? '',
      parentEmail: student.parentEmail ?? '', city: student.city ?? '', state: student.state ?? '',
      address: student.address ?? '', programId: student.programId ?? '',
      programLevelId: student.programLevelId ?? '', photoUrl: student.photoUrl ?? '',
    });
    setEditPhotoFile(null); setEditingStudent(student); setIsEditModalOpen(true);
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSubmitting(true);
    try {
      let photoUrl = editForm.photoUrl || null;
      if (editPhotoFile) {
        try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.id); }
        catch (photoErr: any) { push(`Photo upload failed: ${photoErr.message}`, 'error'); setSubmitting(false); return; }
      }
      await apiFetch(`/api/admin/students/${editingStudent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: `${editForm.firstName} ${editForm.lastName}`,
          photoUrl: photoUrl ?? undefined,
          admissionDate: editForm.admissionDate || null,
          dateOfBirth: editForm.dateOfBirth, gender: editForm.gender,
          bloodGroup: editForm.bloodGroup, rollNumber: editForm.rollNumber,
          parentName: editForm.parentName, parentPhone: editForm.parentPhone,
          parentEmail: editForm.parentEmail, address: editForm.address,
          city: editForm.city, state: editForm.state,
          section: editForm.section || null, academicYear: editForm.academicYear || null,
          programId: editForm.programId || null, programLevelId: editForm.programLevelId || null,
        }),
      });
      push('Student updated successfully', 'success');
      setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) { push(err.message || 'Failed to update student', 'error'); }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: 'DELETE' });
      push('Student deleted successfully', 'success');
      setIsDeleteModalOpen(false); setStudentToDelete(null);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch { push('Failed to delete student', 'error'); }
    setSubmitting(false);
  };

  const openGeneratePasswordConfirm = (student: any) => setConfirmGenFor(student);

  const handleGeneratePassword = async () => {
    const student = confirmGenFor;
    setConfirmGenFor(null);
    if (!student) return;
    setGenLoading(true);
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: 'POST' });
      setCredentials({
        studentId: res.studentId, email: res.email, password: res.password,
        parentEmail: res.parentEmail, emailSent: res.emailSent,
        emailError: res.emailError, passwordVersion: res.passwordVersion,
      });
      setIsCredentialsModalOpen(true);
      push('New password generated — previous session signed out', 'info');
      if (res.emailSent && res.parentEmail) {
        setTimeout(() => push(`📧 Credentials emailed to ${res.parentEmail}`, 'email'), 700);
      } else if (res.parentEmail && !res.emailSent) {
        setTimeout(() => push('Email delivery failed — share credentials manually', 'error'), 700);
      } else {
        setTimeout(() => push('No parent email on file — share credentials manually', 'info'), 700);
      }
    } catch (err: any) {
      push(err.message || 'Failed to generate password', 'error');
    }
    setGenLoading(false);
  };

  const fetchReport = async (student: any, download = false) => {
    setReportLoading(true);
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/report`);
      if (download) { openPrintWindow(await buildReportHTML(res.report)); }
      else { setReportData(res.report); setIsReportModalOpen(true); }
    } catch { push('Failed to load report', 'error'); }
    setReportLoading(false);
  };

  const avatarGradients = [
    'linear-gradient(135deg,#e91e8c,#c2185b)',
    'linear-gradient(135deg,#9c27b0,#7b1fa2)',
    'linear-gradient(135deg,#FF6B6B,#FFB347)',
  ];
  const hasFilters = programFilter || sectionFilter || studentSearch || statusFilter;

  // ── STICKY COLUMN WIDTHS ───────────────────────────────────────────────────
  const STATUS_W = 140;
  const ACTIONS_W = 60;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {confirmGenFor && (
        <ConfirmSendDialog
          student={confirmGenFor}
          onConfirm={handleGeneratePassword}
          onCancel={() => setConfirmGenFor(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
        </div>
        <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>
          Add Student
        </GradientButton>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

        {/* Filters */}
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap rounded-t-[24px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
          </div>
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
            <option value="">All Programs</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setProgramFilter(''); setSectionFilter(''); setStudentSearch(''); setStatusFilter(''); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Clear filters
            </button>
          )}
        </div>

        {/* ── TABLE ── */}
        <div
          className="students-table-scroll"
          style={{ overflowX: 'auto', minHeight: 400, position: 'relative' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-bold text-gray-500">Loading students...</p>
            </div>
          ) : (
            <table
              className="text-left border-collapse"
              style={{ minWidth: 860, width: '100%', tableLayout: 'fixed' }}
            >
              <colgroup>
                <col style={{ width: 52 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 180 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: STATUS_W }} />
                <col style={{ width: ACTIONS_W }} />
              </colgroup>

              <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                <tr>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest" />
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">ID</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Program</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Level</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Section</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Acad. Year</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Parent</th>

                  {/* ── Sticky: Status header — needs zIndex to stay above scrolling body rows ── */}
                  <th
                    className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-[#FFFDF7]"
                    style={{
                      position: 'sticky',
                      right: ACTIONS_W,
                      zIndex: 10,
                      boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.07)',
                    }}
                  >
                    Status
                  </th>

                  {/* ── Sticky: Actions header ── */}
                  <th
                    className="px-3 py-4 bg-[#FFFDF7]"
                    style={{
                      position: 'sticky',
                      right: 0,
                      zIndex: 10,
                    }}
                  />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EEF8]">
                {studentsData.length > 0 ? studentsData.map((s, i) => (
                  <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">

                    {/* Photo */}
                    <td className="pl-4 py-3 pr-0">
                      <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] flex items-center justify-center flex-shrink-0">
                        {s.photoUrl
                          ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
                          : <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">
                            {s.fullName?.[0]?.toUpperCase() ?? '?'}
                          </div>}
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-4 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis">{s.studentId}</td>

                    {/* Student */}
                    <td className="px-4 py-4 overflow-hidden">
                      <p className="text-sm font-bold text-[#1A1A2E] truncate">{s.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{s.user?.email ?? '—'}</p>
                    </td>

                    {/* Program
                    <td className="px-4 py-4">
                      {s.program
                        ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20 whitespace-nowrap">{s.program.name}</span>
                        : <span className="text-xs text-gray-400">—</span>}
                    </td> */}


                    <td className="px-4 py-4 max-w-[260px]">
                      {s.program ? (
                        <span
                          className="inline-block text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-1 rounded-lg border border-[#e91e8c]/20"
                          style={{
                            maxWidth: "240px",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {s.program.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Level */}
                    <td className="px-4 py-4">
                      {s.programLevel
                        ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20 whitespace-nowrap">{s.programLevel.name}</span>
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>

                    {/* Section */}
                    <td className="px-4 py-4">
                      {s.section
                        ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>

                    {/* Academic Year */}
                    <td className="px-4 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{s.academicYear ?? '—'}</td>

                    {/* Parent */}
                    <td className="px-4 py-4 text-xs font-medium text-gray-600 overflow-hidden">
                      <span className="truncate block">{s.parentName ?? '—'}</span>
                    </td>

                    {/* ── Sticky: Status ──
                        ✅ NO zIndex here — removing it prevents this td from creating
                           a stacking context that blocks the fixed-position dropdown menu.
                           background: 'inherit' still ensures scrolled content goes behind it. ── */}
                    <td
                      className="px-4 py-4 transition-colors"
                      style={{
                        position: 'sticky',
                        right: ACTIONS_W,
                        background: 'inherit',
                        boxShadow: '-6px 0 12px -4px rgba(0,0,0,0.05)',
                      }}
                    >
                      <StatusBadge
                        status={(s.status ?? 'Active') as UserStatus}
                        loading={togglingStatus === s.id}
                        onClick={() => {
                          if (s.status === 'Suspended' || s.status === 'Deleted') {
                            push(`Cannot toggle — student is ${s.status}`, 'error');
                            return;
                          }
                          handleToggleStatus(s);
                        }}
                      />
                    </td>

                    {/* ── Sticky: Actions ──
                        ✅ NO zIndex here — same reason as Status td above. ── */}
                    <td
                      className="px-3 py-4 transition-colors"
                      style={{
                        position: 'sticky',
                        right: 0,
                        background: 'inherit',
                      }}
                    >
                      <ActionsMenu
                        onEdit={() => openEdit(s)}
                        onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                        onGeneratePassword={() => openGeneratePasswordConfirm(s)}
                        onViewReport={() => fetchReport(s, false)}
                        onDownloadReport={() => fetchReport(s, true)}
                        onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
                        onViewFees={() => { setFeesStudent(s); setIsFeesModalOpen(true); }}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <Search size={24} className="text-gray-300 mb-3" />
                        <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
        <form onSubmit={handleAddStudent} className="space-y-6">
          <StudentFormFields form={addForm} setForm={setAddForm} programs={programs}
            photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} apiFetch={apiFetch} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? 'Registering...' : 'Register Student'}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
        <form onSubmit={handleEditStudent} className="space-y-6">
          <StudentFormFields form={editForm} setForm={setEditForm} programs={programs}
            photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} apiFetch={apiFetch} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? 'Saving...' : 'Save Changes'}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── FEES MODAL ── */}
      <Modal isOpen={isFeesModalOpen} onClose={() => { setIsFeesModalOpen(false); setFeesStudent(null); }} title="Manage Student Fees" wide>
        {feesStudent && <FeesSection student={feesStudent} apiFetch={apiFetch} />}
      </Modal>

      {/* ── ID CARD MODAL ── */}
      <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
        {idCardStudent && (
          <div className="space-y-5">
            {/* <IDCard student={idCardStudent} /> */}
            <IDCard student={idCardStudent} logoUrl={LOGO_URL} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button onClick={async () => openPrintWindow(await buildIDCardHTML(idCardStudent, LOGO_URL))}

                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Print / Save PDF
              </button>
              <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* ── REPORT MODAL ── */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
        {reportLoading
          ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
          : reportData && (
            <div className="space-y-4">
              <StudentReport report={reportData} />
              <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
                <button onClick={async () => openPrintWindow(await buildReportHTML(reportData))}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Download size={16} /> Download PDF
                </button>
                <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
              </div>
            </div>
          )}
      </Modal>

      {/* ── CREDENTIALS MODAL ── */}
      <Modal isOpen={isCredentialsModalOpen}
        onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
        title="Student Login Credentials">
        {credentials && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-[#FF6B6B]">
                The password below is shown <span className="font-black">only once</span>. Copy it now before closing.
              </p>
            </div>
            {credentials.emailSent && credentials.parentEmail ? (
              <div className="flex items-start gap-3 bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3">
                <Mail size={16} className="text-[#4ECDC4] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#4ECDC4]">✓ Credentials emailed to parent</p>
                  <p className="text-xs font-bold text-[#1A1A2E] mt-0.5 break-all">{credentials.parentEmail}</p>
                  <p className="text-[10px] text-gray-400 mt-1">The parent can log in using the credentials below.</p>
                </div>
                <Check size={16} className="text-[#4ECDC4] flex-shrink-0 mt-0.5" />
              </div>
            ) : credentials.parentEmail && !credentials.emailSent ? (
              <div className="flex items-start gap-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-3">
                <AlertTriangle size={16} className="text-[#FF6B6B] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#FF6B6B]">Email delivery failed</p>
                  {credentials.emailError && <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{credentials.emailError}</p>}
                  <p className="text-xs text-gray-500 mt-1">Share credentials manually with the parent at <span className="font-bold break-all">{credentials.parentEmail}</span></p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-amber-700">No parent email on record — share these credentials manually.</p>
              </div>
            )}
            <div className="space-y-3">
              <CopyRow label="Student ID" value={credentials.studentId} />
              <CopyRow label="Login Email" value={credentials.email} />
              <CopyRow label="Temporary Password" value={credentials.password} mono />
              {credentials.parentEmail && (
                <div className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1.5"><Mail size={10} /> Parent email on file</p>
                  <p className="text-sm font-bold text-[#1A1A2E] break-all">{credentials.parentEmail}</p>
                  {credentials.emailSent
                    ? <p className="text-[10px] text-[#4ECDC4] font-bold mt-1 flex items-center gap-1"><Check size={10} /> Credentials sent automatically</p>
                    : <p className="text-[10px] text-[#FF6B6B] font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Email failed — share manually</p>}
                </div>
              )}
            </div>
            <div className="flex items-start gap-3 bg-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-xl px-4 py-3">
              <ShieldAlert size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-[#6d28d9]">The student's previous login session has been automatically signed out.</p>
            </div>
            <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
              <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* ── DELETE MODAL ── */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
            <p className="text-sm text-gray-500 mt-2">This permanently deletes the student and all their records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .students-table-scroll::-webkit-scrollbar { height: 6px; }
        .students-table-scroll::-webkit-scrollbar-track { background: #f0eef8; border-radius: 6px; }
        .students-table-scroll::-webkit-scrollbar-thumb { background: #e91e8c66; border-radius: 6px; }
        .students-table-scroll::-webkit-scrollbar-thumb:hover { background: #e91e8c99; }
      ` }} />
    </div>
  );
}