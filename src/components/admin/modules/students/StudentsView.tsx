


// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

// // ── Constants ─────────────────────────────────────────────────────────────────

// const SECTIONS      = ["A", "B", "C", "D"];
// const CLASSES       = ["KG1", "KG2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
// const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
// const CITIES        = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

// // ── API helper ────────────────────────────────────────────────────────────────

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

// // ── UI Components ─────────────────────────────────────────────────────────────

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

// const Badge = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
//       <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
//         onClick={(e) => e.stopPropagation()}>
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//   </div>
// );

// // Combobox: shows a dropdown of suggestions + lets you type custom value
// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input
//       list={`list-${label}`}
//       value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
//     />
//     <datalist id={`list-${label}`}>
//       {options.map((o: string) => <option key={o} value={o} />)}
//     </datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select…" }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
//       <option value="">{placeholder}</option>
//       {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
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

// // ── Student form fields (shared by Add + Edit) ────────────────────────────────

// function StudentFormFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
//   const set = (key: string) => (v: string) => setForm({ ...form, [key]: v });
//   return (
//     <div className="space-y-6">
//       {/* Student Info */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav" required value={form.firstName} onChange={set("firstName")} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}  onChange={set("lastName")} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
//           <FormSelect label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={set("gender")} />
//           <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
//         </div>
//       </div>

//       {/* Academic Details */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#4ECDC4] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Details</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Roll Number" placeholder="01" value={form.rollNumber} onChange={set("rollNumber")} />
//           <FormSelect label="Section" options={SECTIONS} value={form.section} onChange={set("section")} placeholder="No section" />
//           <FormSelect label="Class" options={CLASSES} value={form.class} onChange={set("class")} placeholder="No class" />
//           <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//         </div>
//       </div>

//       {/* Parent & Contact */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set("parentName")} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"  value={form.parentPhone} onChange={set("parentPhone")} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
//           {/* City: type freely or pick from list */}
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set("city")} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set("state")} />
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
//       </div>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────

// export default function StudentsView() {
//   const [studentsData, setStudentsData] = useState<any[]>([]);
//   const [loading, setLoading]           = useState(true);
//   const [studentSearch, setStudentSearch] = useState("");
//   const [classFilter, setClassFilter]   = useState("");
//   const [sectionFilter, setSectionFilter] = useState("");

//   // Modals
//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string } | null>(null);

//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast]           = useState<string | null>(null);
//   const [addForm,  setAddForm]      = useState<any>({});
//   const [editForm, setEditForm]     = useState<any>({});

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

//   // ── Fetch ──────────────────────────────────────────────────────────────────
//   const fetchStudents = useCallback(async (q = "", cls = "", sec = "") => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({ search: q, limit: "100" });
//       if (cls) params.set("class", cls);
//       if (sec) params.set("section", sec);
//       const res = await apiFetch(`/api/admin/students?${params}`);
//       setStudentsData(res.students ?? []);
//     } catch { showToast("Failed to load students"); }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, classFilter, sectionFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, classFilter, sectionFilter, fetchStudents]);

//   // ── Add ────────────────────────────────────────────────────────────────────
//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       showToast("First name, last name and email are required");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:     `${addForm.firstName} ${addForm.lastName}`,
//           email:        addForm.email,
//           dateOfBirth:  addForm.dateOfBirth,
//           gender:       addForm.gender,
//           bloodGroup:   addForm.bloodGroup,
//           rollNumber:   addForm.rollNumber,
//           parentName:   addForm.parentName,
//           parentPhone:  addForm.parentPhone,
//           parentEmail:  addForm.parentEmail,
//           address:      addForm.address,
//           city:         addForm.city,
//           state:        addForm.state,
//           section:      addForm.section      || null,
//           class:        addForm.class        || null,
//           academicYear: addForm.academicYear || null,
//         }),
//       });
//       if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
//       setAddForm({});
//       setIsAddModalOpen(false);
//       fetchStudents(studentSearch, classFilter, sectionFilter);
//     } catch (err: any) {
//       let msg = err.message || "Failed to add student";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   // ── Edit ───────────────────────────────────────────────────────────────────
//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? "").split(" ");
//     setEditForm({
//       firstName,
//       lastName:    rest.join(" "),
//       email:       student.user?.email ?? "",
//       dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
//       gender:      student.gender      ?? "",
//       bloodGroup:  student.bloodGroup  ?? "",
//       rollNumber:  student.rollNumber  ?? "",
//       section:     student.section     ?? "",
//       class:       student.class       ?? "",
//       academicYear: student.academicYear ?? "",
//       parentName:  student.parentName  ?? "",
//       parentPhone: student.parentPhone ?? "",
//       parentEmail: student.parentEmail ?? "",
//       city:        student.city        ?? "",
//       state:       student.state       ?? "",
//       address:     student.address     ?? "",
//     });
//     setEditingStudent(student);
//     setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({
//           fullName:     `${editForm.firstName} ${editForm.lastName}`,
//           dateOfBirth:  editForm.dateOfBirth,
//           gender:       editForm.gender,
//           bloodGroup:   editForm.bloodGroup,
//           rollNumber:   editForm.rollNumber,
//           parentName:   editForm.parentName,
//           parentPhone:  editForm.parentPhone,
//           parentEmail:  editForm.parentEmail,
//           address:      editForm.address,
//           city:         editForm.city,
//           state:        editForm.state,
//           section:      editForm.section      || null,
//           class:        editForm.class        || null,
//           academicYear: editForm.academicYear || null,
//         }),
//       });
//       showToast("Student updated successfully");
//       setIsEditModalOpen(false);
//       setEditingStudent(null);
//       fetchStudents(studentSearch, classFilter, sectionFilter);
//     } catch (err: any) {
//       showToast(err.message || "Failed to update student");
//     }
//     setSubmitting(false);
//   };

//   // ── Delete ─────────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       setIsDeleteModalOpen(false);
//       setStudentToDelete(null);
//       fetchStudents(studentSearch, classFilter, sectionFilter);
//     } catch { showToast("Failed to delete student"); }
//     setSubmitting(false);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setIsAddModalOpen(true); }}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* Filters */}
//       <Card className="overflow-visible">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">

//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..."
//               value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>

//           {/* Class filter */}
//           <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[140px]">
//             <option value="">All Classes</option>
//             {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
//           </select>

//           {/* Section filter */}
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>

//           {/* Clear filters */}
//           {(classFilter || sectionFilter || studentSearch) && (
//             <button onClick={() => { setClassFilter(""); setSectionFilter(""); setStudentSearch(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {["ID", "Student", "Class / Section", "Academic Year", "Attendance", "Fee", "Parent", "Actions"].map((h) => (
//                     <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => {
//                   const latestFee = s.fees?.[0];
//                   const attendancePct = s.attendance?.length
//                     ? Math.round((s.attendance.filter((a: any) => a.status === "present").length / s.attendance.length) * 100)
//                     : null;
//                   const avatarGradients = [
//                     "linear-gradient(135deg,#FF6B6B,#FFB347)",
//                     "linear-gradient(135deg,#4ECDC4,#45B7AA)",
//                     "linear-gradient(135deg,#A78BFA,#7C3AED)",
//                   ];
//                   return (
//                     <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                       <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono">{s.studentId}</td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div style={{ background: avatarGradients[i % 3] }}
//                             className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-black flex-shrink-0">
//                             {s.fullName?.[0]?.toUpperCase() ?? "?"}
//                           </div>
//                           <div>
//                             <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
//                             <p className="text-xs text-gray-400">{s.phone ?? "—"}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4">
//                         <div className="flex gap-1.5 flex-wrap">
//                           {s.class && (
//                             <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-lg border border-[#A78BFA]/20">{s.class}</span>
//                           )}
//                           {s.section && (
//                             <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                           )}
//                           {!s.class && !s.section && <span className="text-xs text-gray-400">—</span>}
//                         </div>
//                         <p className="text-xs text-gray-400 mt-0.5 ml-0.5">Roll: {s.rollNumber ?? "—"}</p>
//                       </td>
//                       <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
//                       <td className="px-5 py-4">
//                         {attendancePct !== null ? (
//                           <div className="flex items-center gap-2">
//                             <div className="w-14 h-1.5 bg-[#FFF0E8] rounded-full overflow-hidden">
//                               <div className={`h-full rounded-full ${attendancePct >= 90 ? "bg-[#4ECDC4]" : "bg-[#FFB347]"}`} style={{ width: `${attendancePct}%` }} />
//                             </div>
//                             <span className="text-xs font-black">{attendancePct}%</span>
//                           </div>
//                         ) : <span className="text-xs text-gray-400">—</span>}
//                       </td>
//                       <td className="px-5 py-4">
//                         <Badge text={latestFee?.paymentStatus === "paid" ? "Paid" : "Pending"}
//                           color={latestFee?.paymentStatus === "paid" ? "#4ECDC4" : "#FF6B6B"} />
//                       </td>
//                       <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <button onClick={() => openEdit(s)}
//                             className="p-2 text-gray-400 hover:text-[#FFB347] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FFB347]/40 transition-all shadow-sm"
//                             title="Edit">
//                             <Pencil size={14} />
//                           </button>
//                           <button onClick={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                             className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
//                             title="Delete">
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 }) : (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-20 text-center">
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
//       </Card>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student">
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? "Registering..." : "Register Student"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`}>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>
//               {submitting ? "Saving..." : "Save Changes"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Registered">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 leading-relaxed">
//             Account created. The password is shown <span className="font-black text-[#FF6B6B]">only once</span>.
//           </p>
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

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)}
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
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
//       `}}/>
//     </div>
//   );
// }







// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, FileText, Download, ChevronDown, IdCard,
//   Eye, MoreHorizontal,
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ["A", "B", "C", "D"];
// const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
// const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

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

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// // ── UI Components ──────────────────────────────────────────────────────────────

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

// const Badge = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
//       <div className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[90vh] flex flex-col overflow-hidden`}
//         onClick={(e) => e.stopPropagation()}>
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input list={`list-${label}`} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
//       placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
//     <datalist id={`list-${label}`}>
//       {options.map((o: string) => <option key={o} value={o} />)}
//     </datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select…" }: any) => (
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

// // ── Program selector (dynamic) ─────────────────────────────────────────────────
// function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
//   programs: Program[];
//   programId: string;
//   programLevelId: string;
//   onProgramChange: (id: string) => void;
//   onLevelChange: (id: string) => void;
// }) {
//   const selectedProgram = programs.find((p) => p.id === programId);
//   const hasLevels = selectedProgram?.hasLevels || (selectedProgram && selectedProgram.levels.length > 0);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <FormSelect
//         label="Program"
//         placeholder="Select program…"
//         value={programId}
//         onChange={(v: string) => { onProgramChange(v); onLevelChange(""); }}
//         options={programs.map((p) => ({ value: p.id, label: p.name }))}
//       />
//       {selectedProgram && selectedProgram.levels.length > 0 && (
//         <FormSelect
//           label={selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
//           placeholder="Select level…"
//           value={programLevelId}
//           onChange={onLevelChange}
//           options={selectedProgram.levels.map((l) => ({ value: l.id, label: l.name }))}
//         />
//       )}
//     </div>
//   );
// }

// // ── Student Form Fields ────────────────────────────────────────────────────────
// function StudentFormFields({ form, setForm, programs }: { form: any; setForm: (f: any) => void; programs: Program[] }) {
//   const set = (key: string) => (v: string) => setForm({ ...form, [key]: v });
//   return (
//     <div className="space-y-6">
//       {/* Program */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
//         <ProgramSelector
//           programs={programs}
//           programId={form.programId ?? ""}
//           programLevelId={form.programLevelId ?? ""}
//           onProgramChange={(v) => setForm({ ...form, programId: v, programLevelId: "" })}
//           onLevelChange={(v) => setForm({ ...form, programLevelId: v })}
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormSelect label="Section" options={SECTIONS} value={form.section} onChange={set("section")} placeholder="No section" />
//           <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
//           <FormInput label="Roll Number" placeholder="01" value={form.rollNumber} onChange={set("rollNumber")} />
//         </div>
//       </div>

//       {/* Student Info */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav" required value={form.firstName} onChange={set("firstName")} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}  onChange={set("lastName")} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
//           <FormSelect label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={set("gender")} />
//           <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
//         </div>
//       </div>

//       {/* Parent & Contact */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set("parentName")} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"  value={form.parentPhone} onChange={set("parentPhone")} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
//           <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set("city")} />
//           <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set("state")} />
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
//       </div>
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const items = [
//     { icon: Pencil,      label: "Edit",              color: "#FFB347", action: onEdit },
//     { icon: KeyRound,    label: "Generate Password",  color: "#4ECDC4", action: onGeneratePassword },
//     { icon: IdCard,      label: "View ID Card",       color: "#A78BFA", action: onViewIdCard },
//     { icon: Eye,         label: "View Report",        color: "#64B6FF", action: onViewReport },
//     { icon: Download,    label: "Download Report",    color: "#6BCB77", action: onDownloadReport },
//     { icon: Trash2,      label: "Delete",             color: "#FF6B6B", action: onDelete },
//   ];

//   return (
//     <div ref={ref} className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm flex items-center gap-1"
//       >
//         <MoreHorizontal size={15} />
//       </button>

//       {open && (
//         <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[190px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button
//               key={label}
//               onClick={() => { action(); setOpen(false); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left"
//             >
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── ID Card Component ──────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   return (
//     <div className="w-full max-w-sm mx-auto" id="student-id-card">
//       {/* Card Front */}
//       <div className="rounded-2xl overflow-hidden shadow-xl border border-[#F0EEF8]" style={{ aspectRatio: '1.586' }}>
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] px-5 py-3 flex items-center justify-between">
//           <div>
//             <p className="text-white font-black text-sm tracking-wide">STUDENT ID CARD</p>
//             <p className="text-white/70 text-[10px] font-medium">Academic Year: {student.academicYear ?? "—"}</p>
//           </div>
//           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//             <span className="text-white font-black text-lg">{student.fullName?.[0]?.toUpperCase()}</span>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="bg-white px-5 py-4 space-y-3">
//           <div>
//             <p className="text-[#FF6B6B] font-black text-lg leading-tight">{student.fullName}</p>
//             <p className="text-gray-400 text-[11px] font-mono font-bold">{student.studentId}</p>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-[11px]">
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Program</p>
//               <p className="text-[#1A1A2E] font-bold">{student.program?.name ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Level / Class</p>
//               <p className="text-[#1A1A2E] font-bold">{student.programLevel?.name ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Section</p>
//               <p className="text-[#1A1A2E] font-bold">{student.section ? `Section ${student.section}` : "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Roll No.</p>
//               <p className="text-[#1A1A2E] font-bold">{student.rollNumber ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Blood Group</p>
//               <p className="text-[#FF6B6B] font-black">{student.bloodGroup ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Parent</p>
//               <p className="text-[#1A1A2E] font-bold truncate">{student.parentName ?? "—"}</p>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t border-[#F0EEF8] pt-2 flex justify-between items-center">
//             <p className="text-[10px] text-gray-400">
//               <span className="font-black">📞</span> {student.parentPhone ?? "—"}
//             </p>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
//               <p className="text-[10px] font-black text-[#4ECDC4]">{student.status}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Report View ────────────────────────────────────────────────────────────────
// function StudentReport({ report }: { report: any }) {
//   const fields = [
//     { label: "Student ID",    value: report.studentId },
//     { label: "Full Name",     value: report.fullName },
//     { label: "Email",         value: report.email },
//     { label: "Date of Birth", value: report.dateOfBirth ?? "—" },
//     { label: "Gender",        value: report.gender ?? "—" },
//     { label: "Blood Group",   value: report.bloodGroup ?? "—" },
//     { label: "Program",       value: report.program?.name ?? "—" },
//     { label: "Level / Class", value: report.level?.name ?? "—" },
//     { label: "Section",       value: report.section ? `Section ${report.section}` : "—" },
//     { label: "Roll Number",   value: report.rollNumber ?? "—" },
//     { label: "Academic Year", value: report.academicYear ?? "—" },
//     { label: "Status",        value: report.status },
//     { label: "Parent Name",   value: report.parentName ?? "—" },
//     { label: "Parent Phone",  value: report.parentPhone ?? "—" },
//     { label: "Parent Email",  value: report.parentEmail ?? "—" },
//     { label: "Address",       value: [report.address, report.city, report.state].filter(Boolean).join(", ") || "—" },
//     { label: "Enrolled At",   value: new Date(report.enrolledAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) },
//   ];

//   return (
//     <div id="student-report" className="space-y-4">
//       <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] rounded-2xl p-5 text-white">
//         <p className="text-2xl font-black">{report.fullName}</p>
//         <p className="font-mono text-white/80 text-sm">{report.studentId}</p>
//         <div className="flex gap-2 mt-2">
//           {report.program && <Badge text={report.program.name} color="#fff" />}
//           {report.level   && <Badge text={report.level.name}   color="#fff" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(({ label, value }) => (
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

//   // Modals
//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string } | null>(null);

//   const [submitting, setSubmitting] = useState(false);
//   const [reportLoading, setReportLoading] = useState(false);
//   const [toast,      setToast]      = useState<string | null>(null);
//   const [addForm,    setAddForm]    = useState<any>({});
//   const [editForm,   setEditForm]   = useState<any>({});

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

//   // ── Fetch programs ────────────────────────────────────────────────────────
//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res = await apiFetch("/api/admin/programs");
//       setPrograms(res.programs ?? []);
//     } catch { /* programs stay empty */ }
//   }, []);

//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   // ── Fetch students ────────────────────────────────────────────────────────
//   const fetchStudents = useCallback(async (q = "", prog = "", sec = "") => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({ search: q, limit: "100" });
//       if (prog) params.set("programId", prog);
//       if (sec)  params.set("section", sec);
//       const res = await apiFetch(`/api/admin/students?${params}`);
//       setStudentsData(res.students ?? []);
//     } catch { showToast("Failed to load students"); }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, fetchStudents]);

//   // ── Add ───────────────────────────────────────────────────────────────────
//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       showToast("First name, last name and email are required"); return;
//     }
//     setSubmitting(true);
//     try {
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:      `${addForm.firstName} ${addForm.lastName}`,
//           email:         addForm.email,
//           dateOfBirth:   addForm.dateOfBirth,
//           gender:        addForm.gender,
//           bloodGroup:    addForm.bloodGroup,
//           rollNumber:    addForm.rollNumber,
//           parentName:    addForm.parentName,
//           parentPhone:   addForm.parentPhone,
//           parentEmail:   addForm.parentEmail,
//           address:       addForm.address,
//           city:          addForm.city,
//           state:         addForm.state,
//           section:       addForm.section       || null,
//           academicYear:  addForm.academicYear  || null,
//           programId:     addForm.programId     || null,
//           programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
//       setAddForm({});
//       setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch (err: any) {
//       let msg = err.message || "Failed to add student";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   // ── Edit ──────────────────────────────────────────────────────────────────
//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? "").split(" ");
//     setEditForm({
//       firstName,
//       lastName:      rest.join(" "),
//       email:         student.user?.email ?? "",
//       dateOfBirth:   student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
//       gender:        student.gender      ?? "",
//       bloodGroup:    student.bloodGroup  ?? "",
//       rollNumber:    student.rollNumber  ?? "",
//       section:       student.section     ?? "",
//       academicYear:  student.academicYear ?? "",
//       parentName:    student.parentName  ?? "",
//       parentPhone:   student.parentPhone ?? "",
//       parentEmail:   student.parentEmail ?? "",
//       city:          student.city        ?? "",
//       state:         student.state       ?? "",
//       address:       student.address     ?? "",
//       programId:     student.programId   ?? "",
//       programLevelId: student.programLevelId ?? "",
//     });
//     setEditingStudent(student);
//     setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({
//           fullName:      `${editForm.firstName} ${editForm.lastName}`,
//           dateOfBirth:   editForm.dateOfBirth,
//           gender:        editForm.gender,
//           bloodGroup:    editForm.bloodGroup,
//           rollNumber:    editForm.rollNumber,
//           parentName:    editForm.parentName,
//           parentPhone:   editForm.parentPhone,
//           parentEmail:   editForm.parentEmail,
//           address:       editForm.address,
//           city:          editForm.city,
//           state:         editForm.state,
//           section:       editForm.section       || null,
//           academicYear:  editForm.academicYear  || null,
//           programId:     editForm.programId     || null,
//           programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       showToast("Student updated successfully");
//       setIsEditModalOpen(false);
//       setEditingStudent(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch (err: any) {
//       showToast(err.message || "Failed to update student");
//     }
//     setSubmitting(false);
//   };

//   // ── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       setIsDeleteModalOpen(false);
//       setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch { showToast("Failed to delete student"); }
//     setSubmitting(false);
//   };

//   // ── Generate Password ─────────────────────────────────────────────────────
//   const handleGeneratePassword = async (student: any) => {
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
//       setCredentials(res);
//       setIsCredentialsModalOpen(true);
//     } catch { showToast("Failed to generate password"); }
//   };

//   // ── Report ────────────────────────────────────────────────────────────────
//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       setReportData(res.report);
//       if (!download) setIsReportModalOpen(true);
//       else downloadReportAsJSON(res.report);
//     } catch { showToast("Failed to load report"); }
//     setReportLoading(false);
//   };

//   const downloadReportAsJSON = (report: any) => {
//     const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href     = url;
//     a.download = `${report.studentId}-report.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ── Download report as printable HTML ────────────────────────────────────
//   const downloadReportAsHTML = (report: any) => {
//     if (!report) return;
//     const fields = [
//       ["Student ID",    report.studentId],
//       ["Full Name",     report.fullName],
//       ["Email",         report.email],
//       ["Date of Birth", report.dateOfBirth ?? "—"],
//       ["Gender",        report.gender ?? "—"],
//       ["Blood Group",   report.bloodGroup ?? "—"],
//       ["Program",       report.program?.name ?? "—"],
//       ["Level / Class", report.level?.name ?? "—"],
//       ["Section",       report.section ? `Section ${report.section}` : "—"],
//       ["Roll Number",   report.rollNumber ?? "—"],
//       ["Academic Year", report.academicYear ?? "—"],
//       ["Status",        report.status],
//       ["Parent Name",   report.parentName ?? "—"],
//       ["Parent Phone",  report.parentPhone ?? "—"],
//       ["Parent Email",  report.parentEmail ?? "—"],
//       ["Address",       [report.address, report.city, report.state].filter(Boolean).join(", ") || "—"],
//       ["Enrolled At",   new Date(report.enrolledAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
//     ];

//     const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
// <title>Student Report - ${report.fullName}</title>
// <style>
//   body { font-family: Arial, sans-serif; margin: 40px; color: #1A1A2E; }
//   h1 { background: linear-gradient(135deg,#FF6B6B,#FFB347); color: white; padding: 20px; border-radius: 12px; margin-bottom: 8px; }
//   .id { font-family: monospace; color: #aaa; font-size: 13px; }
//   .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
//   .cell { background: #FFFDF7; border: 1px solid #F0EEF8; padding: 12px 16px; border-radius: 10px; }
//   .label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; font-weight: 900; margin-bottom: 3px; }
//   .value { font-size: 14px; font-weight: 700; }
//   @media print { body { margin: 20px; } }
// </style>
// </head><body>
// <h1>${report.fullName}</h1>
// <p class="id">${report.studentId}</p>
// <div class="grid">
// ${fields.map(([l, v]) => `<div class="cell"><div class="label">${l}</div><div class="value">${v}</div></div>`).join("")}
// </div>
// </body></html>`;

//     const blob = new Blob([html], { type: "text/html" });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href     = url;
//     a.download = `${report.studentId}-report.html`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const avatarGradients = [
//     "linear-gradient(135deg,#FF6B6B,#FFB347)",
//     "linear-gradient(135deg,#4ECDC4,#45B7AA)",
//     "linear-gradient(135deg,#A78BFA,#7C3AED)",
//   ];

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setIsAddModalOpen(true); }}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* Filters */}
//       <Card className="overflow-visible">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search by name, ID, parent..."
//               value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
//           </div>

//           {/* Program filter */}
//           <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>

//           {/* Section filter */}
//           <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>

//           {(programFilter || sectionFilter || studentSearch) && (
//             <button onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {["ID", "Student", "Program", "Level / Class", "Section", "Academic Year", "Parent", "Actions"].map((h) => (
//                     <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div style={{ background: avatarGradients[i % 3] }}
//                           className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-black flex-shrink-0">
//                           {s.fullName?.[0]?.toUpperCase() ?? "?"}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
//                           <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-lg border border-[#FF6B6B]/20">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-lg border border-[#A78BFA]/20">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
//                     <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
//                     <td className="px-5 py-4">
//                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                         <ActionsMenu
//                           student={s}
//                           onEdit={() => openEdit(s)}
//                           onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                           onGeneratePassword={() => handleGeneratePassword(s)}
//                           onViewReport={() => fetchReport(s, false)}
//                           onDownloadReport={async () => {
//                             setReportLoading(true);
//                             try {
//                               const res = await apiFetch(`/api/admin/students/${s.id}/report`);
//                               downloadReportAsHTML(res.report);
//                             } catch { showToast("Failed to download report"); }
//                             setReportLoading(false);
//                           }}
//                           onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-20 text-center">
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
//       </Card>

//       {/* ── ADD MODAL ── */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? "Registering..." : "Register Student"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── EDIT MODAL ── */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>
//               {submitting ? "Saving..." : "Save Changes"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── ID CARD MODAL ── */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card">
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => window.print()}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── REPORT MODAL ── */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading ? (
//           <div className="flex justify-center py-12">
//             <Loader2 className="animate-spin text-[#FFB347]" size={32} />
//           </div>
//         ) : reportData && (
//           <div className="space-y-4">
//             <StudentReport report={reportData} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => downloadReportAsHTML(reportData)}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Download HTML
//               </button>
//               <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ── CREDENTIALS MODAL ── */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Credentials">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 leading-relaxed">
//             The password is shown <span className="font-black text-[#FF6B6B]">only once</span>. Save it now.
//           </p>
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

//       {/* ── DELETE MODAL ── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)}
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
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
//         @media print {
//           body > *:not(#student-id-card) { display: none !important; }
//           #student-id-card { display: block !important; width: 85.6mm; height: 54mm; }
//         }
//       `}}/>
//     </div>
//   );
// }

















// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle, Pencil,
//   KeyRound, FileText, Download, ChevronDown, IdCard,
//   Eye, MoreHorizontal,
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SECTIONS       = ["A", "B", "C", "D"];
// const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
// const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

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

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProgramLevel { id: string; name: string; sortOrder: number; }
// interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// // ── UI Components ──────────────────────────────────────────────────────────────

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

// const Badge = ({ text, color }: { text: string; color: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
//       <div
//         className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[90vh] flex flex-col overflow-hidden`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
//     />
//   </div>
// );

// const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input
//       list={`list-${label}`}
//       value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       placeholder={placeholder}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
//     />
//     <datalist id={`list-${label}`}>
//       {options.map((o: string) => <option key={o} value={o} />)}
//     </datalist>
//   </div>
// );

// const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select..." }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select
//       value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
//     >
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
//       <button
//         onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}
//       >
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Program selector (dynamic) ─────────────────────────────────────────────────
// function ProgramSelector({
//   programs,
//   programId,
//   programLevelId,
//   onProgramChange,
//   onLevelChange,
// }: {
//   programs: Program[];
//   programId: string;
//   programLevelId: string;
//   onProgramChange: (id: string) => void;
//   onLevelChange: (id: string) => void;
// }) {
//   const selectedProgram = programs.find((p) => p.id === programId);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* Program native select — avoids any controlled/uncontrolled mismatch */}
//       <div className="space-y-1.5">
//         <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
//         <select
//           value={programId}
//           onChange={(e) => onProgramChange(e.target.value)}
//           className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
//         >
//           <option value="">Select program...</option>
//           {programs.map((p) => (
//             <option key={p.id} value={p.id}>{p.name}</option>
//           ))}
//         </select>
//       </div>

//       {/* Level — only shown when program has levels */}
//       {selectedProgram && selectedProgram.levels.length > 0 && (
//         <div className="space-y-1.5">
//           <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//             {selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
//           </label>
//           <select
//             value={programLevelId}
//             onChange={(e) => onLevelChange(e.target.value)}
//             className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
//           >
//             <option value="">Select level...</option>
//             {selectedProgram.levels.map((l) => (
//               <option key={l.id} value={l.id}>{l.name}</option>
//             ))}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Student Form Fields ────────────────────────────────────────────────────────
// function StudentFormFields({
//   form,
//   setForm,
//   programs,
// }: {
//   form: any;
//   setForm: (updater: any) => void;
//   programs: Program[];
// }) {
//   // FIX: Use functional updater to always read the latest state — prevents stale closure bug
//   const set = (key: string) => (v: string) =>
//     setForm((prev: any) => ({ ...prev, [key]: v }));

//   // Auto-increment roll number when program, level, or section changes
//   useEffect(() => {
//     if (!form.programId) return;
//     const params = new URLSearchParams({ programId: form.programId });
//     if (form.programLevelId) params.set("programLevelId", form.programLevelId);
//     if (form.section) params.set("section", form.section);

//     apiFetch(`/api/admin/students/next-roll-number?${params}`)
//       .then((res) => {
//         setForm((prev: any) => ({
//           ...prev,
//           rollNumber: res.formatted ?? String(res.nextRollNumber),
//         }));
//       })
//       .catch(() => {
//         // silently ignore if the endpoint is not yet deployed
//       });
//   }, [form.programId, form.programLevelId, form.section]);

//   return (
//     <div className="space-y-6">
//       {/* Program */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">
//           Program Enrollment
//         </h4>
//         <ProgramSelector
//           programs={programs}
//           programId={form.programId ?? ""}
//           programLevelId={form.programLevelId ?? ""}
//           // FIX: Functional updater here too — avoids stale form snapshot
//           onProgramChange={(v) =>
//             setForm((prev: any) => ({ ...prev, programId: v, programLevelId: "", rollNumber: "" }))
//           }
//           onLevelChange={(v) =>
//             setForm((prev: any) => ({ ...prev, programLevelId: v, rollNumber: "" }))
//           }
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormSelect
//             label="Section"
//             options={SECTIONS}
//             value={form.section}
//             onChange={(v: string) =>
//               setForm((prev: any) => ({ ...prev, section: v, rollNumber: "" }))
//             }
//             placeholder="No section"
//           />
//           <FormSelect
//             label="Academic Year"
//             options={ACADEMIC_YEARS}
//             value={form.academicYear}
//             onChange={set("academicYear")}
//             placeholder="Select year"
//           />
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//               Roll Number
//               {form.programId && (
//                 <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">
//                   (auto-filled)
//                 </span>
//               )}
//             </label>
//             <input
//               type="text"
//               placeholder="01"
//               value={form.rollNumber ?? ""}
//               onChange={(e) => set("rollNumber")(e.target.value)}
//               className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Student Info */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">
//           Student Information
//         </h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}   onChange={set("firstName")} />
//           <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}    onChange={set("lastName")} />
//           <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
//           <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
//           <FormSelect label="Gender"      options={["Male", "Female", "Other"]}                               value={form.gender}     onChange={set("gender")} />
//           <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}      value={form.bloodGroup} onChange={set("bloodGroup")} />
//         </div>
//       </div>

//       {/* Parent & Contact */}
//       <div className="space-y-4">
//         <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">
//           Parent & Contact Info
//         </h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput label="Parent Name"  placeholder="Rahul Sharma"      required value={form.parentName}  onChange={set("parentName")} />
//           <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"            value={form.parentPhone} onChange={set("parentPhone")} />
//           <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
//           <ComboInput label="City" placeholder="Indore" options={CITIES}  value={form.city}  onChange={set("city")} />
//           <FormInput label="State" placeholder="Madhya Pradesh"           value={form.state} onChange={set("state")} />
//         </div>
//         <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
//       </div>
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const items = [
//     { icon: Pencil,   label: "Edit",              color: "#FFB347", action: onEdit },
//     { icon: KeyRound, label: "Generate Password",  color: "#4ECDC4", action: onGeneratePassword },
//     { icon: IdCard,   label: "View ID Card",       color: "#A78BFA", action: onViewIdCard },
//     { icon: Eye,      label: "View Report",        color: "#64B6FF", action: onViewReport },
//     { icon: Download, label: "Download Report",    color: "#6BCB77", action: onDownloadReport },
//     { icon: Trash2,   label: "Delete",             color: "#FF6B6B", action: onDelete },
//   ];

//   return (
//     <div ref={ref} className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm flex items-center gap-1"
//       >
//         <MoreHorizontal size={15} />
//       </button>

//       {open && (
//         <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[190px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button
//               key={label}
//               onClick={() => { action(); setOpen(false); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left"
//             >
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── ID Card Component ──────────────────────────────────────────────────────────
// function IDCard({ student }: { student: any }) {
//   return (
//     <div className="w-full max-w-sm mx-auto" id="student-id-card">
//       <div className="rounded-2xl overflow-hidden shadow-xl border border-[#F0EEF8]" style={{ aspectRatio: '1.586' }}>
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] px-5 py-3 flex items-center justify-between">
//           <div>
//             <p className="text-white font-black text-sm tracking-wide">STUDENT ID CARD</p>
//             <p className="text-white/70 text-[10px] font-medium">Academic Year: {student.academicYear ?? "—"}</p>
//           </div>
//           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//             <span className="text-white font-black text-lg">{student.fullName?.[0]?.toUpperCase()}</span>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="bg-white px-5 py-4 space-y-3">
//           <div>
//             <p className="text-[#FF6B6B] font-black text-lg leading-tight">{student.fullName}</p>
//             <p className="text-gray-400 text-[11px] font-mono font-bold">{student.studentId}</p>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-[11px]">
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Program</p>
//               <p className="text-[#1A1A2E] font-bold">{student.program?.name ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Level / Class</p>
//               <p className="text-[#1A1A2E] font-bold">{student.programLevel?.name ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Section</p>
//               <p className="text-[#1A1A2E] font-bold">{student.section ? `Section ${student.section}` : "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Roll No.</p>
//               <p className="text-[#1A1A2E] font-bold">{student.rollNumber ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Blood Group</p>
//               <p className="text-[#FF6B6B] font-black">{student.bloodGroup ?? "—"}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Parent</p>
//               <p className="text-[#1A1A2E] font-bold truncate">{student.parentName ?? "—"}</p>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t border-[#F0EEF8] pt-2 flex justify-between items-center">
//             <p className="text-[10px] text-gray-400">
//               <span className="font-black">📞</span> {student.parentPhone ?? "—"}
//             </p>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
//               <p className="text-[10px] font-black text-[#4ECDC4]">{student.status}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Report View ────────────────────────────────────────────────────────────────
// function StudentReport({ report }: { report: any }) {
//   const fields = [
//     { label: "Student ID",    value: report.studentId },
//     { label: "Full Name",     value: report.fullName },
//     { label: "Email",         value: report.email },
//     { label: "Date of Birth", value: report.dateOfBirth ?? "—" },
//     { label: "Gender",        value: report.gender ?? "—" },
//     { label: "Blood Group",   value: report.bloodGroup ?? "—" },
//     { label: "Program",       value: report.program?.name ?? "—" },
//     { label: "Level / Class", value: report.level?.name ?? "—" },
//     { label: "Section",       value: report.section ? `Section ${report.section}` : "—" },
//     { label: "Roll Number",   value: report.rollNumber ?? "—" },
//     { label: "Academic Year", value: report.academicYear ?? "—" },
//     { label: "Status",        value: report.status },
//     { label: "Parent Name",   value: report.parentName ?? "—" },
//     { label: "Parent Phone",  value: report.parentPhone ?? "—" },
//     { label: "Parent Email",  value: report.parentEmail ?? "—" },
//     { label: "Address",       value: [report.address, report.city, report.state].filter(Boolean).join(", ") || "—" },
//     { label: "Enrolled At",   value: new Date(report.enrolledAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) },
//   ];

//   return (
//     <div id="student-report" className="space-y-4">
//       <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] rounded-2xl p-5 text-white">
//         <p className="text-2xl font-black">{report.fullName}</p>
//         <p className="font-mono text-white/80 text-sm">{report.studentId}</p>
//         <div className="flex gap-2 mt-2">
//           {report.program && <Badge text={report.program.name} color="#fff" />}
//           {report.level   && <Badge text={report.level.name}   color="#fff" />}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(({ label, value }) => (
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

//   // Modals
//   const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
//   const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

//   const [editingStudent,  setEditingStudent]  = useState<any>(null);
//   const [studentToDelete, setStudentToDelete] = useState<any>(null);
//   const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string } | null>(null);

//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [toast,          setToast]          = useState<string | null>(null);
//   const [addForm,        setAddForm]        = useState<any>({});
//   const [editForm,       setEditForm]       = useState<any>({});

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

//   // ── Fetch programs ────────────────────────────────────────────────────────
//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res = await apiFetch("/api/admin/programs");
//       setPrograms(res.programs ?? []);
//     } catch { /* programs stay empty */ }
//   }, []);

//   useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

//   // ── Fetch students ────────────────────────────────────────────────────────
//   const fetchStudents = useCallback(async (q = "", prog = "", sec = "") => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({ search: q, limit: "100" });
//       if (prog) params.set("programId", prog);
//       if (sec)  params.set("section", sec);
//       const res = await apiFetch(`/api/admin/students?${params}`);
//       setStudentsData(res.students ?? []);
//     } catch { showToast("Failed to load students"); }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, programFilter, sectionFilter, fetchStudents]);

//   // ── Add ───────────────────────────────────────────────────────────────────
//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!addForm.firstName || !addForm.lastName || !addForm.email) {
//       showToast("First name, last name and email are required"); return;
//     }
//     setSubmitting(true);
//     try {
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:       `${addForm.firstName} ${addForm.lastName}`,
//           email:          addForm.email,
//           dateOfBirth:    addForm.dateOfBirth,
//           gender:         addForm.gender,
//           bloodGroup:     addForm.bloodGroup,
//           rollNumber:     addForm.rollNumber,
//           parentName:     addForm.parentName,
//           parentPhone:    addForm.parentPhone,
//           parentEmail:    addForm.parentEmail,
//           address:        addForm.address,
//           city:           addForm.city,
//           state:          addForm.state,
//           section:        addForm.section        || null,
//           academicYear:   addForm.academicYear   || null,
//           programId:      addForm.programId      || null,
//           programLevelId: addForm.programLevelId || null,
//         }),
//       });
//       if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
//       setAddForm({});
//       setIsAddModalOpen(false);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch (err: any) {
//       let msg = err.message || "Failed to add student";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   // ── Edit ──────────────────────────────────────────────────────────────────
//   const openEdit = (student: any) => {
//     const [firstName, ...rest] = (student.fullName ?? "").split(" ");
//     setEditForm({
//       firstName,
//       lastName:       rest.join(" "),
//       email:          student.user?.email        ?? "",
//       dateOfBirth:    student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
//       gender:         student.gender             ?? "",
//       bloodGroup:     student.bloodGroup         ?? "",
//       rollNumber:     student.rollNumber         ?? "",
//       section:        student.section            ?? "",
//       academicYear:   student.academicYear       ?? "",
//       parentName:     student.parentName         ?? "",
//       parentPhone:    student.parentPhone        ?? "",
//       parentEmail:    student.parentEmail        ?? "",
//       city:           student.city               ?? "",
//       state:          student.state              ?? "",
//       address:        student.address            ?? "",
//       programId:      student.programId          ?? "",
//       programLevelId: student.programLevelId     ?? "",
//     });
//     setEditingStudent(student);
//     setIsEditModalOpen(true);
//   };

//   const handleEditStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingStudent) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${editingStudent.id}`, {
//         method: "PATCH",
//         body: JSON.stringify({
//           fullName:       `${editForm.firstName} ${editForm.lastName}`,
//           dateOfBirth:    editForm.dateOfBirth,
//           gender:         editForm.gender,
//           bloodGroup:     editForm.bloodGroup,
//           rollNumber:     editForm.rollNumber,
//           parentName:     editForm.parentName,
//           parentPhone:    editForm.parentPhone,
//           parentEmail:    editForm.parentEmail,
//           address:        editForm.address,
//           city:           editForm.city,
//           state:          editForm.state,
//           section:        editForm.section        || null,
//           academicYear:   editForm.academicYear   || null,
//           programId:      editForm.programId      || null,
//           programLevelId: editForm.programLevelId || null,
//         }),
//       });
//       showToast("Student updated successfully");
//       setIsEditModalOpen(false);
//       setEditingStudent(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch (err: any) {
//       showToast(err.message || "Failed to update student");
//     }
//     setSubmitting(false);
//   };

//   // ── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       setIsDeleteModalOpen(false);
//       setStudentToDelete(null);
//       fetchStudents(studentSearch, programFilter, sectionFilter);
//     } catch { showToast("Failed to delete student"); }
//     setSubmitting(false);
//   };

//   // ── Generate Password ─────────────────────────────────────────────────────
//   const handleGeneratePassword = async (student: any) => {
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
//       setCredentials(res);
//       setIsCredentialsModalOpen(true);
//     } catch { showToast("Failed to generate password"); }
//   };

//   // ── Report ────────────────────────────────────────────────────────────────
//   const fetchReport = async (student: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students/${student.id}/report`);
//       setReportData(res.report);
//       if (!download) setIsReportModalOpen(true);
//       else downloadReportAsHTML(res.report);
//     } catch { showToast("Failed to load report"); }
//     setReportLoading(false);
//   };

//   const downloadReportAsHTML = (report: any) => {
//     if (!report) return;
//     const fields = [
//       ["Student ID",    report.studentId],
//       ["Full Name",     report.fullName],
//       ["Email",         report.email],
//       ["Date of Birth", report.dateOfBirth ?? "—"],
//       ["Gender",        report.gender ?? "—"],
//       ["Blood Group",   report.bloodGroup ?? "—"],
//       ["Program",       report.program?.name ?? "—"],
//       ["Level / Class", report.level?.name ?? "—"],
//       ["Section",       report.section ? `Section ${report.section}` : "—"],
//       ["Roll Number",   report.rollNumber ?? "—"],
//       ["Academic Year", report.academicYear ?? "—"],
//       ["Status",        report.status],
//       ["Parent Name",   report.parentName ?? "—"],
//       ["Parent Phone",  report.parentPhone ?? "—"],
//       ["Parent Email",  report.parentEmail ?? "—"],
//       ["Address",       [report.address, report.city, report.state].filter(Boolean).join(", ") || "—"],
//       ["Enrolled At",   new Date(report.enrolledAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
//     ];

//     const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
// <title>Student Report - ${report.fullName}</title>
// <style>
//   body { font-family: Arial, sans-serif; margin: 40px; color: #1A1A2E; }
//   h1 { background: linear-gradient(135deg,#FF6B6B,#FFB347); color: white; padding: 20px; border-radius: 12px; margin-bottom: 8px; }
//   .id { font-family: monospace; color: #aaa; font-size: 13px; }
//   .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
//   .cell { background: #FFFDF7; border: 1px solid #F0EEF8; padding: 12px 16px; border-radius: 10px; }
//   .label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; font-weight: 900; margin-bottom: 3px; }
//   .value { font-size: 14px; font-weight: 700; }
//   @media print { body { margin: 20px; } }
// </style>
// </head><body>
// <h1>${report.fullName}</h1>
// <p class="id">${report.studentId}</p>
// <div class="grid">
// ${fields.map(([l, v]) => `<div class="cell"><div class="label">${l}</div><div class="value">${v}</div></div>`).join("")}
// </div>
// </body></html>`;

//     const blob = new Blob([html], { type: "text/html" });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href     = url;
//     a.download = `${report.studentId}-report.html`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const avatarGradients = [
//     "linear-gradient(135deg,#FF6B6B,#FFB347)",
//     "linear-gradient(135deg,#4ECDC4,#45B7AA)",
//     "linear-gradient(135deg,#A78BFA,#7C3AED)",
//   ];

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => { setAddForm({}); setIsAddModalOpen(true); }}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* Filters */}
//       <Card className="overflow-visible">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
//           {/* Search */}
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, ID, parent..."
//               value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
//             />
//           </div>

//           {/* Program filter */}
//           <select
//             value={programFilter}
//             onChange={(e) => setProgramFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]"
//           >
//             <option value="">All Programs</option>
//             {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//           </select>

//           {/* Section filter */}
//           <select
//             value={sectionFilter}
//             onChange={(e) => setSectionFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]"
//           >
//             <option value="">All Sections</option>
//             {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
//           </select>

//           {(programFilter || sectionFilter || studentSearch) && (
//             <button
//               onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); }}
//               className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
//             >
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading students...</p>
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   {["ID", "Student", "Program", "Level / Class", "Section", "Academic Year", "Parent", "Actions"].map((h) => (
//                     <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {studentsData.length > 0 ? studentsData.map((s, i) => (
//                   <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div
//                           style={{ background: avatarGradients[i % 3] }}
//                           className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-black flex-shrink-0"
//                         >
//                           {s.fullName?.[0]?.toUpperCase() ?? "?"}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
//                           <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.program
//                         ? <span className="text-xs font-black text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-lg border border-[#FF6B6B]/20">{s.program.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.programLevel
//                         ? <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-lg border border-[#A78BFA]/20">{s.programLevel.name}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4">
//                       {s.section
//                         ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
//                         : <span className="text-xs text-gray-400">—</span>}
//                     </td>
//                     <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
//                     <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
//                     <td className="px-5 py-4">
//                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                         <ActionsMenu
//                           student={s}
//                           onEdit={() => openEdit(s)}
//                           onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
//                           onGeneratePassword={() => handleGeneratePassword(s)}
//                           onViewReport={() => fetchReport(s, false)}
//                           onDownloadReport={async () => {
//                             setReportLoading(true);
//                             try {
//                               const res = await apiFetch(`/api/admin/students/${s.id}/report`);
//                               downloadReportAsHTML(res.report);
//                             } catch { showToast("Failed to download report"); }
//                             setReportLoading(false);
//                           }}
//                           onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-20 text-center">
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
//       </Card>

//       {/* ADD MODAL */}
//       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
//         <form onSubmit={handleAddStudent} className="space-y-6">
//           <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsAddModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? "Registering..." : "Register Student"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* EDIT MODAL */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
//         <form onSubmit={handleEditStudent} className="space-y-6">
//           <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} />
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsEditModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>
//               {submitting ? "Saving..." : "Save Changes"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ID CARD MODAL */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card">
//         {idCardStudent && (
//           <div className="space-y-5">
//             <IDCard student={idCardStudent} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => window.print()}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* REPORT MODAL */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
//         {reportLoading ? (
//           <div className="flex justify-center py-12">
//             <Loader2 className="animate-spin text-[#FFB347]" size={32} />
//           </div>
//         ) : reportData && (
//           <div className="space-y-4">
//             <StudentReport report={reportData} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => downloadReportAsHTML(reportData)}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Download HTML
//               </button>
//               <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* CREDENTIALS MODAL */}
//       <Modal
//         isOpen={isCredentialsModalOpen}
//         onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
//         title="Student Credentials"
//       >
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 leading-relaxed">
//             The password is shown <span className="font-black text-[#FF6B6B]">only once</span>. Save it now.
//           </p>
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
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
//             >
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
//         @media print {
//           body > *:not(#student-id-card) { display: none !important; }
//           #student-id-card { display: block !important; width: 85.6mm; height: 54mm; }
//         }
//       `}}/>
//     </div>
//   );
// }

















'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle,
  Loader2, Copy, Check, AlertTriangle, Pencil,
  KeyRound, Download, IdCard,
  Eye, MoreHorizontal,
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS       = ["A", "B", "C", "D"];
const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];
const SCHOOL_NAME    = "Ascento Abacus";
const SCHOOL_TAGLINE = "Brain Development Academy";

// ── API helper ─────────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── PDF via print window (no external lib) ────────────────────────────────────
function openPrintWindow(htmlContent: string) {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) { alert("Please allow popups to download the PDF."); return; }
  win.document.write(htmlContent);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 600);
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProgramLevel { id: string; name: string; sortOrder: number; }
interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// ── UI primitives ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const BadgeChip = ({ text, color }: { text: string; color: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
    {text}
  </span>
);

// ── Fixed Modal — proper flex column so header never scrolls away ──────────────
const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input type={type} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
  </div>
);

const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input list={`list-${label}`} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
    <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
  </div>
);

const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select..." }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
      <option value="">{placeholder}</option>
      {options.map((o: { value: string; label: string } | string) =>
        typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  </div>
);

function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
      </div>
      <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

// ── Program Selector ───────────────────────────────────────────────────────────
function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
  programs: Program[]; programId: string; programLevelId: string;
  onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
}) {
  const selectedProgram = programs.find((p) => p.id === programId);
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
      {selectedProgram && selectedProgram.levels.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
            {selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
          </label>
          <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
            className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
            <option value="">Select level...</option>
            {selectedProgram.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

// ── Student Form Fields ────────────────────────────────────────────────────────
function StudentFormFields({ form, setForm, programs }: { form: any; setForm: (u: any) => void; programs: Program[] }) {
  const set = (key: string) => (v: string) => setForm((prev: any) => ({ ...prev, [key]: v }));

  useEffect(() => {
    if (!form.programId) return;
    const params = new URLSearchParams({ programId: form.programId });
    if (form.programLevelId) params.set("programLevelId", form.programLevelId);
    if (form.section) params.set("section", form.section);
    apiFetch(`/api/admin/students/next-roll-number?${params}`)
      .then((res) => setForm((prev: any) => ({ ...prev, rollNumber: res.formatted ?? String(res.nextRollNumber) })))
      .catch(() => {});
  }, [form.programId, form.programLevelId, form.section]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
        <ProgramSelector
          programs={programs} programId={form.programId ?? ""} programLevelId={form.programLevelId ?? ""}
          onProgramChange={(v) => setForm((prev: any) => ({ ...prev, programId: v, programLevelId: "", rollNumber: "" }))}
          onLevelChange={(v) => setForm((prev: any) => ({ ...prev, programLevelId: v, rollNumber: "" }))}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect label="Section" options={SECTIONS} value={form.section}
            onChange={(v: string) => setForm((prev: any) => ({ ...prev, section: v, rollNumber: "" }))} placeholder="No section" />
          <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Roll Number {form.programId && <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>}
            </label>
            <input type="text" placeholder="01" value={form.rollNumber ?? ""} onChange={(e) => set("rollNumber")(e.target.value)}
              className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set("firstName")} />
          <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set("lastName")} />
          <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
          <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
          <FormSelect label="Gender" options={["Male","Female","Other"]} value={form.gender} onChange={set("gender")} />
          <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Parent Name"  placeholder="Rahul Sharma"        required value={form.parentName}  onChange={set("parentName")} />
          <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"              value={form.parentPhone} onChange={set("parentPhone")} />
          <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
          <ComboInput label="City" placeholder="Indore" options={CITIES}    value={form.city}  onChange={set("city")} />
          <FormInput label="State" placeholder="Madhya Pradesh"             value={form.state} onChange={set("state")} />
        </div>
        <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
      </div>
    </div>
  );
}

// ── Actions Dropdown ───────────────────────────────────────────────────────────
function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { icon: Pencil,   label: "Edit",             color: "#FFB347", action: onEdit },
    { icon: KeyRound, label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
    { icon: IdCard,   label: "View ID Card",      color: "#A78BFA", action: onViewIdCard },
    { icon: Eye,      label: "View Report",       color: "#64B6FF", action: onViewReport },
    { icon: Download, label: "Download Report",   color: "#6BCB77", action: onDownloadReport },
    { icon: Trash2,   label: "Delete",            color: "#FF6B6B", action: onDelete },
  ];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[190px]">
          {items.map(({ icon: Icon, label, color, action }) => (
            <button key={label} onClick={() => { action(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
              <Icon size={14} style={{ color }} />
              <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ID Card inline preview ─────────────────────────────────────────────────────
function IDCard({ student }: { student: any }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-xl border border-[#F0EEF8]">
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white font-black text-sm tracking-wide">{SCHOOL_NAME}</p>
              <p className="text-white/70 text-[10px]">{SCHOOL_TAGLINE}</p>
              <p className="text-white/60 text-[9px] uppercase tracking-[2px] mt-2">Student ID Card</p>
              <p className="text-white/50 text-[9px] mt-0.5">Academic Year: {student.academicYear ?? "—"}</p>
            </div>
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white font-black text-lg">{student.fullName?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="bg-white px-5 py-4 space-y-3">
          <div>
            <p className="text-[#FF6B6B] font-black text-lg leading-tight">{student.fullName}</p>
            <p className="text-gray-400 text-[11px] font-mono font-bold mt-0.5">{student.studentId}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Program</p><p className="text-[#1A1A2E] font-bold">{student.program?.name ?? "—"}</p></div>
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Level / Class</p><p className="text-[#1A1A2E] font-bold">{student.programLevel?.name ?? "—"}</p></div>
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Section</p><p className="text-[#1A1A2E] font-bold">{student.section ? `Section ${student.section}` : "—"}</p></div>
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Roll No.</p><p className="text-[#1A1A2E] font-bold">{student.rollNumber ?? "—"}</p></div>
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Blood Group</p><p className="text-[#FF6B6B] font-black">{student.bloodGroup ?? "—"}</p></div>
            <div><p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Parent</p><p className="text-[#1A1A2E] font-bold truncate">{student.parentName ?? "—"}</p></div>
          </div>
          <div className="border-t border-[#F0EEF8] pt-2 flex justify-between items-center">
            <p className="text-[10px] text-gray-400">📞 {student.parentPhone ?? "—"}</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
              <p className="text-[10px] font-black text-[#4ECDC4]">{student.status ?? "Active"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PDF HTML generators ────────────────────────────────────────────────────────
function buildIDCardHTML(student: any): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ID Card</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f0f0f0}
.card{width:85.6mm;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.15)}
.hdr{background:linear-gradient(135deg,#FF6B6B,#FFB347);padding:16px 18px;display:flex;justify-content:space-between;align-items:flex-start}
.school-name{color:#fff;font-size:12px;font-weight:900;letter-spacing:.5px}
.school-tag{color:rgba(255,255,255,.7);font-size:9px;margin-top:1px}
.card-title{color:rgba(255,255,255,.8);font-size:8px;letter-spacing:2px;text-transform:uppercase;margin-top:7px}
.acad{color:rgba(255,255,255,.55);font-size:8px;margin-top:2px}
.av{width:40px;height:40px;background:rgba(255,255,255,.25);border-radius:50%;border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#fff;flex-shrink:0}
.body{padding:14px 18px}
.sname{color:#FF6B6B;font-size:16px;font-weight:900;line-height:1.2}
.sid{font-family:monospace;font-size:10px;color:#aaa;margin-top:2px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.lbl{font-size:7px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:2px}
.val{font-size:11px;font-weight:700;color:#1A1A2E}
.val.red{color:#FF6B6B}
.foot{border-top:1px solid #F0EEF8;margin-top:10px;padding-top:8px;display:flex;justify-content:space-between;align-items:center}
.phone{font-size:9px;color:#aaa}
.status{display:flex;align-items:center;gap:4px;font-size:9px;font-weight:900;color:#4ECDC4}
.dot{width:6px;height:6px;border-radius:50%;background:#4ECDC4}
@media print{body{background:#fff;min-height:unset}@page{size:95mm 65mm;margin:0}.card{box-shadow:none;border-radius:0;width:100%}}
</style></head><body>
<div class="card">
  <div class="hdr">
    <div>
      <div class="school-name">${SCHOOL_NAME}</div>
      <div class="school-tag">${SCHOOL_TAGLINE}</div>
      <div class="card-title">Student ID Card</div>
      <div class="acad">Academic Year: ${student.academicYear ?? "—"}</div>
    </div>
    <div class="av">${(student.fullName?.[0] ?? "?").toUpperCase()}</div>
  </div>
  <div class="body">
    <div class="sname">${student.fullName ?? "—"}</div>
    <div class="sid">${student.studentId ?? "—"}</div>
    <div class="grid">
      <div><div class="lbl">Program</div><div class="val">${student.program?.name ?? "—"}</div></div>
      <div><div class="lbl">Level / Class</div><div class="val">${student.programLevel?.name ?? "—"}</div></div>
      <div><div class="lbl">Section</div><div class="val">${student.section ? "Section " + student.section : "—"}</div></div>
      <div><div class="lbl">Roll No.</div><div class="val">${student.rollNumber ?? "—"}</div></div>
      <div><div class="lbl">Blood Group</div><div class="val red">${student.bloodGroup ?? "—"}</div></div>
      <div><div class="lbl">Parent</div><div class="val">${student.parentName ?? "—"}</div></div>
    </div>
    <div class="foot">
      <div class="phone">📞 ${student.parentPhone ?? "—"}</div>
      <div class="status"><div class="dot"></div>${student.status ?? "Active"}</div>
    </div>
  </div>
</div>
</body></html>`;
}

function buildReportHTML(r: any): string {
  const addr = [r.address, r.city, r.state].filter(Boolean).join(", ") || "—";
  const enrolled = r.enrolledAt ? new Date(r.enrolledAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—";
  const generated = new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });
  const fields: [string,string][] = [
    ["Student ID", r.studentId], ["Full Name", r.fullName], ["Email", r.email ?? "—"],
    ["Date of Birth", r.dateOfBirth ?? "—"], ["Gender", r.gender ?? "—"], ["Blood Group", r.bloodGroup ?? "—"],
    ["Program", r.program?.name ?? "—"], ["Level / Class", r.level?.name ?? "—"],
    ["Section", r.section ? `Section ${r.section}` : "—"], ["Roll Number", r.rollNumber ?? "—"],
    ["Academic Year", r.academicYear ?? "—"], ["Status", r.status ?? "—"],
    ["Parent Name", r.parentName ?? "—"], ["Parent Phone", r.parentPhone ?? "—"],
    ["Parent Email", r.parentEmail ?? "—"], ["Address", addr], ["Enrolled At", enrolled],
  ];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Student Report — ${r.fullName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#f7f7f7;color:#1A1A2E;padding:32px}
.hdr{background:linear-gradient(135deg,#FF6B6B,#FFB347);border-radius:16px;padding:24px 28px;color:#fff;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start}
.school{font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:6px}
h1{font-size:26px;font-weight:900;line-height:1.2}
.sid{font-family:monospace;font-size:13px;opacity:.7;margin-top:4px}
.badges{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.badge{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);padding:3px 12px;border-radius:20px;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
.date{font-size:10px;opacity:.65}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cell{background:#fff;border:1px solid #F0EEF8;border-radius:10px;padding:12px 16px}
.lbl{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:3px}
.val{font-size:13px;font-weight:700;word-break:break-word}
.footer{margin-top:24px;text-align:center;font-size:9px;color:#ccc}
@media print{body{background:#fff;padding:20px}@page{margin:12mm}}
</style></head><body>
<div class="hdr">
  <div>
    <div class="school">${SCHOOL_NAME} · ${SCHOOL_TAGLINE}</div>
    <h1>${r.fullName}</h1>
    <div class="sid">${r.studentId}</div>
    <div class="badges">
      ${r.program ? `<span class="badge">${r.program.name}</span>` : ""}
      ${r.level   ? `<span class="badge">${r.level.name}</span>` : ""}
      ${r.section ? `<span class="badge">Section ${r.section}</span>` : ""}
    </div>
  </div>
  <div class="date">Generated: ${generated}</div>
</div>
<div class="grid">
  ${fields.map(([l,v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}
</div>
<div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div>
</body></html>`;
}

// ── Report modal preview ───────────────────────────────────────────────────────
function StudentReport({ report }: { report: any }) {
  const fields: [string,string][] = [
    ["Student ID", report.studentId], ["Full Name", report.fullName], ["Email", report.email ?? "—"],
    ["Date of Birth", report.dateOfBirth ?? "—"], ["Gender", report.gender ?? "—"], ["Blood Group", report.bloodGroup ?? "—"],
    ["Program", report.program?.name ?? "—"], ["Level / Class", report.level?.name ?? "—"],
    ["Section", report.section ? `Section ${report.section}` : "—"], ["Roll Number", report.rollNumber ?? "—"],
    ["Academic Year", report.academicYear ?? "—"], ["Status", report.status ?? "—"],
    ["Parent Name", report.parentName ?? "—"], ["Parent Phone", report.parentPhone ?? "—"],
    ["Parent Email", report.parentEmail ?? "—"],
    ["Address", [report.address, report.city, report.state].filter(Boolean).join(", ") || "—"],
    ["Enrolled At", report.enrolledAt ? new Date(report.enrolledAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—"],
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] rounded-2xl p-5 text-white">
        <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME} · {SCHOOL_TAGLINE}</p>
        <p className="text-2xl font-black">{report.fullName}</p>
        <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {report.program && <BadgeChip text={report.program.name} color="#fff" />}
          {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
          {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
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

// ── Main ───────────────────────────────────────────────────────────────────────
export default function StudentsView() {
  const [studentsData,  setStudentsData]  = useState<any[]>([]);
  const [programs,      setPrograms]      = useState<Program[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
  const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
  const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
  const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

  const [editingStudent,  setEditingStudent]  = useState<any>(null);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [idCardStudent,   setIdCardStudent]   = useState<any>(null);
  const [reportData,      setReportData]      = useState<any>(null);
  const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string } | null>(null);
  const [submitting,      setSubmitting]      = useState(false);
  const [reportLoading,   setReportLoading]   = useState(false);
  const [toast,           setToast]           = useState<string | null>(null);
  const [addForm,         setAddForm]         = useState<any>({});
  const [editForm,        setEditForm]        = useState<any>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fetchPrograms = useCallback(async () => {
    try { const r = await apiFetch("/api/admin/programs"); setPrograms(r.programs ?? []); } catch {}
  }, []);
  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const fetchStudents = useCallback(async (q = "", prog = "", sec = "") => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ search: q, limit: "100" });
      if (prog) p.set("programId", prog);
      if (sec)  p.set("section", sec);
      const r = await apiFetch(`/api/admin/students?${p}`);
      setStudentsData(r.students ?? []);
    } catch { showToast("Failed to load students"); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter), 350);
    return () => clearTimeout(t);
  }, [studentSearch, programFilter, sectionFilter, fetchStudents]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email) { showToast("First name, last name and email are required"); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/students", {
        method: "POST",
        body: JSON.stringify({
          fullName: `${addForm.firstName} ${addForm.lastName}`, email: addForm.email,
          dateOfBirth: addForm.dateOfBirth, gender: addForm.gender, bloodGroup: addForm.bloodGroup,
          rollNumber: addForm.rollNumber, parentName: addForm.parentName,
          parentPhone: addForm.parentPhone, parentEmail: addForm.parentEmail,
          address: addForm.address, city: addForm.city, state: addForm.state,
          section: addForm.section || null, academicYear: addForm.academicYear || null,
          programId: addForm.programId || null, programLevelId: addForm.programLevelId || null,
        }),
      });
      if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
      setAddForm({}); setIsAddModalOpen(false);
      fetchStudents(studentSearch, programFilter, sectionFilter);
    } catch (err: any) {
      let msg = err.message || "Failed to add student";
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg);
    }
    setSubmitting(false);
  };

  const openEdit = (student: any) => {
    const [firstName, ...rest] = (student.fullName ?? "").split(" ");
    setEditForm({
      firstName, lastName: rest.join(" "), email: student.user?.email ?? "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
      gender: student.gender ?? "", bloodGroup: student.bloodGroup ?? "",
      rollNumber: student.rollNumber ?? "", section: student.section ?? "",
      academicYear: student.academicYear ?? "", parentName: student.parentName ?? "",
      parentPhone: student.parentPhone ?? "", parentEmail: student.parentEmail ?? "",
      city: student.city ?? "", state: student.state ?? "", address: student.address ?? "",
      programId: student.programId ?? "", programLevelId: student.programLevelId ?? "",
    });
    setEditingStudent(student); setIsEditModalOpen(true);
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          fullName: `${editForm.firstName} ${editForm.lastName}`,
          dateOfBirth: editForm.dateOfBirth, gender: editForm.gender, bloodGroup: editForm.bloodGroup,
          rollNumber: editForm.rollNumber, parentName: editForm.parentName,
          parentPhone: editForm.parentPhone, parentEmail: editForm.parentEmail,
          address: editForm.address, city: editForm.city, state: editForm.state,
          section: editForm.section || null, academicYear: editForm.academicYear || null,
          programId: editForm.programId || null, programLevelId: editForm.programLevelId || null,
        }),
      });
      showToast("Student updated successfully");
      setIsEditModalOpen(false); setEditingStudent(null);
      fetchStudents(studentSearch, programFilter, sectionFilter);
    } catch (err: any) { showToast(err.message || "Failed to update student"); }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
      showToast("Student deleted successfully");
      setIsDeleteModalOpen(false); setStudentToDelete(null);
      fetchStudents(studentSearch, programFilter, sectionFilter);
    } catch { showToast("Failed to delete student"); }
    setSubmitting(false);
  };

  const handleGeneratePassword = async (student: any) => {
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
      setCredentials(res); setIsCredentialsModalOpen(true);
    } catch { showToast("Failed to generate password"); }
  };

  const fetchReport = async (student: any, download = false) => {
    setReportLoading(true);
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/report`);
      if (download) {
        openPrintWindow(buildReportHTML(res.report));
      } else {
        setReportData(res.report);
        setIsReportModalOpen(true);
      }
    } catch { showToast("Failed to load report"); }
    setReportLoading(false);
  };

  const avatarGradients = [
    "linear-gradient(135deg,#FF6B6B,#FFB347)",
    "linear-gradient(135deg,#4ECDC4,#45B7AA)",
    "linear-gradient(135deg,#A78BFA,#7C3AED)",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
        </div>
        <GradientButton icon={Plus} onClick={() => { setAddForm({}); setIsAddModalOpen(true); }}>Add Student</GradientButton>
      </div>

      <Card className="overflow-visible">
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
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
          {(programFilter || sectionFilter || studentSearch) && (
            <button onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Clear filters
            </button>
          )}
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-bold text-gray-500">Loading students...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                <tr>
                  {["ID","Student","Program","Level / Class","Section","Academic Year","Parent","Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {studentsData.length > 0 ? studentsData.map((s, i) => (
                  <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                    <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div style={{ background: avatarGradients[i % 3] }} className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                          {s.fullName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
                          <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{s.program ? <span className="text-xs font-black text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-lg border border-[#FF6B6B]/20">{s.program.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="px-5 py-4">{s.programLevel ? <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-lg border border-[#A78BFA]/20">{s.programLevel.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="px-5 py-4">{s.section ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
                    <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionsMenu
                          student={s}
                          onEdit={() => openEdit(s)}
                          onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                          onGeneratePassword={() => handleGeneratePassword(s)}
                          onViewReport={() => fetchReport(s, false)}
                          onDownloadReport={() => fetchReport(s, true)}
                          onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Search size={24} className="text-gray-300 mb-3" />
                      <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ADD */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
        <form onSubmit={handleAddStudent} className="space-y-6">
          <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? "Registering..." : "Register Student"}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* EDIT */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
        <form onSubmit={handleEditStudent} className="space-y-6">
          <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? "Saving..." : "Save Changes"}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* ID CARD */}
      <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card">
        {idCardStudent && (
          <div className="space-y-5">
            <IDCard student={idCardStudent} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button
                onClick={() => openPrintWindow(buildIDCardHTML(idCardStudent))}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Print / Save PDF
              </button>
              <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* REPORT */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
        {reportLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#FFB347]" size={32} /></div>
        ) : reportData && (
          <div className="space-y-4">
            <StudentReport report={reportData} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button onClick={() => openPrintWindow(buildReportHTML(reportData))}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Download PDF
              </button>
              <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* CREDENTIALS */}
      <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Credentials">
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">The password is shown <span className="font-black text-[#FF6B6B]">only once</span>. Save it now.</p>
          {credentials && (
            <div className="space-y-3">
              <CredentialRow label="Student ID"         value={credentials.studentId} />
              <CredentialRow label="Email"              value={credentials.email} />
              <CredentialRow label="Temporary Password" value={credentials.password} mono />
            </div>
          )}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-700">Share and ask the student to change password after first login.</p>
          </div>
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
            <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
          </div>
        </div>
      </Modal>

      {/* DELETE */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar{width:6px}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:#FFB34744;border-radius:6px}
      `}}/>
    </div>
  );
}