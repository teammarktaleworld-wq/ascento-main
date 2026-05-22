







// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle,
//   Loader2, Copy, Check, AlertTriangle,
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

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
//     type={type}
//     onClick={onClick}
//     disabled={disabled}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
//   >
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const Badge = ({ text, color }: { text: string; color: string }) => (
//   <span
//     style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
//   >
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
//       <div
//         className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
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

// const FormSelect = ({ label, options, required = false, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <select
//       value={value ?? ""}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
//     >
//       <option value="">Select…</option>
//       {options.map((o: string) => (
//         <option key={o} value={o}>{o}</option>
//       ))}
//     </select>
//   </div>
// );

// function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(value);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
//       </div>
//       <button
//         onClick={handleCopy}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 shadow-sm ${
//           copied
//             ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10"
//             : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347] hover:border-[#FFB347]/40"
//         }`}
//       >
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────

// export default function StudentsView() {
//   const [studentsData, setStudentsData]   = useState<any[]>([]);
//   const [sections, setSections]           = useState<any[]>([]);
//   const [loading, setLoading]             = useState(true);
//   const [studentSearch, setStudentSearch] = useState('');
//   const [levelFilter, setLevelFilter]     = useState('All Classes');

//   const [isModalOpen, setIsModalOpen]                       = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen]           = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [studentToDelete, setStudentToDelete]               = useState<any>(null);
//   const [credentials, setCredentials]                       = useState<{
//     studentId: string; email: string; password: string;
//   } | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast]           = useState<string | null>(null);
//   const [studentForm, setStudentForm] = useState<any>({});

//   const showToast = (msg: string) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── Fetch students ────────────────────────────────────────────────────────
//   const fetchStudents = useCallback(async (q = "") => {
//     setLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/students?search=${encodeURIComponent(q)}&limit=50`);
//       setStudentsData(res.students ?? []);
//     } catch {
//       showToast("Failed to load students");
//     }
//     setLoading(false);
//   }, []);

//   // ── Fetch sections for dropdown ───────────────────────────────────────────
//   useEffect(() => {
//     apiFetch("/api/admin/sections")
//       .then((res) => setSections(res.sections ?? []))
//       .catch(() => showToast("Failed to load sections"));
//   }, []);

//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(studentSearch), 350);
//     return () => clearTimeout(t);
//   }, [studentSearch, fetchStudents]);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleOpenAddModal = () => {
//     setStudentForm({});
//     setIsModalOpen(true);
//   };

//   const handleAddStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!studentForm.firstName || !studentForm.lastName) {
//       showToast("First and last name are required");
//       return;
//     }
//     if (!studentForm.email) {
//       showToast("Email is required");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await apiFetch("/api/admin/students", {
//         method: "POST",
//         body: JSON.stringify({
//           fullName:     `${studentForm.firstName} ${studentForm.lastName}`,
//           email:        studentForm.email,
//           dateOfBirth:  studentForm.dateOfBirth,
//           gender:       studentForm.gender,
//           bloodGroup:   studentForm.bloodGroup,
//           rollNumber:   studentForm.rollNumber,
//           parentName:   studentForm.parentName,
//           parentPhone:  studentForm.parentPhone,
//           parentEmail:  studentForm.parentEmail,
//           address:      studentForm.address,
//           city:         studentForm.city,
//           state:        studentForm.state,
//           sectionId:    studentForm.sectionId || undefined,   // ← real UUID from dropdown
//           academicYear: studentForm.academicYear || undefined,
//         }),
//       });

//       if (res.credentials) {
//         setCredentials(res.credentials);
//         setIsCredentialsModalOpen(true);
//       }

//       setStudentForm({});
//       setIsModalOpen(false);
//       fetchStudents(studentSearch);
//     } catch (err: any) {
//       // Parse JSON error body if present
//       let msg = err.message || "Failed to add student";
//       try {
//         const parsed = JSON.parse(msg);
//         if (parsed?.error) msg = parsed.error;
//       } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   const confirmDelete = (student: any) => {
//     setStudentToDelete(student);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!studentToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
//       showToast("Student deleted successfully");
//       fetchStudents(studentSearch);
//       setIsDeleteModalOpen(false);
//       setStudentToDelete(null);
//     } catch {
//       showToast("Failed to delete student");
//     }
//     setSubmitting(false);
//   };

//   const handleCloseCredentials = () => {
//     setIsCredentialsModalOpen(false);
//     setCredentials(null);
//   };

//   const filteredStudents = useMemo(() => {
//     if (levelFilter === 'All Classes') return studentsData;
//     return studentsData.filter((s) => {
//       const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
//       return className.includes(levelFilter) || levelFilter.includes(className);
//     });
//   }, [studentsData, levelFilter]);

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} enrolled students</p>
//         </div>
//         <GradientButton icon={Plus} onClick={handleOpenAddModal}>Add Student</GradientButton>
//       </div>

//       {/* Table Card */}
//       <Card className="overflow-visible">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-4 bg-[#FFFDF7]">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, ID, or parent..."
//               value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
//             />
//           </div>
//           <select
//             value={levelFilter}
//             onChange={(e) => setLevelFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none"
//           >
//             <option>All Classes</option>
//             {sections.map((s) => (
//               <option key={s.id} value={s.className}>{s.label}</option>
//             ))}
//           </select>
//         </div>

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
//                   {["ID", "Student Details", "Class / Roll", "Attendance", "Fees Status", "Parent", "Actions"].map((h) => (
//                     <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((s, i) => {
//                     const latestFee     = s.fees?.[0];
//                     const attendancePct = s.attendance?.length
//                       ? Math.round((s.attendance.filter((a: any) => a.status === "present").length / s.attendance.length) * 100)
//                       : null;
//                     const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
//                     const avatarGradients = [
//                       "linear-gradient(135deg,#FF6B6B,#FFB347)",
//                       "linear-gradient(135deg,#4ECDC4,#45B7AA)",
//                       "linear-gradient(135deg,#A78BFA,#7C3AED)",
//                     ];
//                     return (
//                       <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                         <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono">{s.studentId || s.id.substring(0, 6)}</td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-4">
//                             <div style={{ background: avatarGradients[i % 3] }} className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-black shadow-md flex-shrink-0">
//                               {s.fullName?.[0]?.toUpperCase() ?? "?"}
//                             </div>
//                             <div>
//                               <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
//                               <p className="text-xs text-gray-400 font-medium">{s.email || "No email"}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-black text-[#A78BFA] bg-[#A78BFA]/10 px-3 py-1 rounded-lg border border-[#A78BFA]/20 w-max mb-1">{className}</div>
//                           <span className="text-xs text-gray-500 font-medium ml-1">Roll: {s.rollNumber ?? "—"}</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           {attendancePct !== null ? (
//                             <div className="flex items-center gap-3">
//                               <div className="w-16 h-1.5 bg-[#FFF0E8] rounded-full overflow-hidden">
//                                 <div className={`h-full rounded-full ${attendancePct >= 90 ? "bg-[#4ECDC4]" : "bg-[#FFB347]"}`} style={{ width: `${attendancePct}%` }} />
//                               </div>
//                               <span className="text-xs font-black text-[#1A1A2E]">{attendancePct}%</span>
//                             </div>
//                           ) : <span className="text-xs text-gray-400 font-medium">—</span>}
//                         </td>
//                         <td className="px-6 py-4">
//                           <Badge
//                             text={latestFee?.paymentStatus === "paid" ? "Paid" : "Pending"}
//                             color={latestFee?.paymentStatus === "paid" ? "#4ECDC4" : "#FF6B6B"}
//                           />
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-600">{s.parentName ?? "—"}</td>
//                         <td className="px-6 py-4 text-right">
//                           <button
//                             onClick={() => confirmDelete(s)}
//                             className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10 transition-all shadow-sm opacity-0 group-hover:opacity-100"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-20 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-400">
//                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                           <Search size={24} className="text-gray-300" />
//                         </div>
//                         <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                         <p className="text-sm mt-1">Try adjusting your search or add a new student.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>

//       {/* Add Student Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
//         <form onSubmit={handleAddStudent} className="space-y-6">

//           {/* Student Info */}
//           <div className="space-y-4">
//             <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput label="First Name" placeholder="Aarav" required value={studentForm.firstName} onChange={(v: string) => setStudentForm({ ...studentForm, firstName: v })} />
//               <FormInput label="Last Name" placeholder="Sharma" required value={studentForm.lastName} onChange={(v: string) => setStudentForm({ ...studentForm, lastName: v })} />
//               <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={studentForm.email} onChange={(v: string) => setStudentForm({ ...studentForm, email: v })} />
//               <FormInput label="Date of Birth" type="date" value={studentForm.dateOfBirth} onChange={(v: string) => setStudentForm({ ...studentForm, dateOfBirth: v })} />
//               <FormSelect label="Gender" options={["Male", "Female", "Other"]} value={studentForm.gender} onChange={(v: string) => setStudentForm({ ...studentForm, gender: v })} />
//               <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={studentForm.bloodGroup} onChange={(v: string) => setStudentForm({ ...studentForm, bloodGroup: v })} />
//             </div>
//           </div>

//           {/* Academic Details */}
//           <div className="space-y-4">
//             <h4 className="text-xs font-black text-[#4ECDC4] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Details</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput
//                 label="Roll Number"
//                 placeholder="01"
//                 value={studentForm.rollNumber}
//                 onChange={(v: string) => setStudentForm({ ...studentForm, rollNumber: v })}
//               />

//               {/* ── Section dropdown (replaces plain text input) ── */}
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//                   Section
//                 </label>
//                 <select
//                   value={studentForm.sectionId ?? ""}
//                   onChange={(e) => setStudentForm({ ...studentForm, sectionId: e.target.value })}
//                   className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
//                 >
//                   <option value="">No section — enroll later</option>
//                   {sections.map((sec) => (
//                     <option key={sec.id} value={sec.id}>
//                       {sec.label}  {/* e.g. "Abacus › Level 1 › Section A" */}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <FormInput
//                 label="Academic Year"
//                 placeholder="2025-2026"
//                 value={studentForm.academicYear}
//                 onChange={(v: string) => setStudentForm({ ...studentForm, academicYear: v })}
//               />
//             </div>
//           </div>

//           {/* Parent & Contact Info */}
//           <div className="space-y-4">
//             <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput label="Parent Name" placeholder="Rahul Sharma" required value={studentForm.parentName} onChange={(v: string) => setStudentForm({ ...studentForm, parentName: v })} />
//               <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX" value={studentForm.parentPhone} onChange={(v: string) => setStudentForm({ ...studentForm, parentPhone: v })} />
//               <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={studentForm.parentEmail} onChange={(v: string) => setStudentForm({ ...studentForm, parentEmail: v })} />
//               <FormInput label="City" placeholder="Indore" value={studentForm.city} onChange={(v: string) => setStudentForm({ ...studentForm, city: v })} />
//               <FormInput label="State" placeholder="Madhya Pradesh" value={studentForm.state} onChange={(v: string) => setStudentForm({ ...studentForm, state: v })} />
//             </div>
//             <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={studentForm.address} onChange={(v: string) => setStudentForm({ ...studentForm, address: v })} />
//           </div>

//           <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3 mt-8">
//             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? 'Registering...' : 'Register Student'}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* Credentials Modal */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={handleCloseCredentials} title="Student Registered 🎒">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500 font-medium leading-relaxed">
//             The student account has been created. Share these login credentials — the password is shown{" "}
//             <span className="font-black text-[#FF6B6B]">only once</span> and is not stored in plain text.
//           </p>
//           {credentials && (
//             <div className="space-y-3">
//               <CredentialRow label="Student ID"         value={credentials.studentId} />
//               <CredentialRow label="Email / Login"      value={credentials.email} />
//               <CredentialRow label="Temporary Password" value={credentials.password} mono />
//             </div>
//           )}
//           <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//             <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//             <p className="text-xs font-medium text-amber-700 leading-relaxed">
//               Copy and securely share these credentials. Ask the student to change their password after first login.
//             </p>
//           </div>
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//             <GradientButton onClick={handleCloseCredentials}>Done</GradientButton>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete Modal */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
//             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
//               This will permanently delete the student and all associated records.
//             </p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
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
//       `}}/>
//     </div>
//   );
// }













'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle,
  Loader2, Copy, Check, AlertTriangle, Pencil,
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

// ── Constants ─────────────────────────────────────────────────────────────────

const SECTIONS      = ["A", "B", "C", "D"];
const CLASSES       = ["KG1", "KG2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
const CITIES        = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

// ── API helper ────────────────────────────────────────────────────────────────

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

// ── UI Components ─────────────────────────────────────────────────────────────

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

const Badge = ({ text, color }: { text: string; color: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
    {text}
  </span>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input type={type} placeholder={placeholder} value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
  </div>
);

// Combobox: shows a dropdown of suggestions + lets you type custom value
const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input
      list={`list-${label}`}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
    />
    <datalist id={`list-${label}`}>
      {options.map((o: string) => <option key={o} value={o} />)}
    </datalist>
  </div>
);

const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select…" }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
      <option value="">{placeholder}</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
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

// ── Student form fields (shared by Add + Edit) ────────────────────────────────

function StudentFormFields({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const set = (key: string) => (v: string) => setForm({ ...form, [key]: v });
  return (
    <div className="space-y-6">
      {/* Student Info */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" placeholder="Aarav" required value={form.firstName} onChange={set("firstName")} />
          <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}  onChange={set("lastName")} />
          <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
          <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
          <FormSelect label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={set("gender")} />
          <FormSelect label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
        </div>
      </div>

      {/* Academic Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#4ECDC4] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Roll Number" placeholder="01" value={form.rollNumber} onChange={set("rollNumber")} />
          <FormSelect label="Section" options={SECTIONS} value={form.section} onChange={set("section")} placeholder="No section" />
          <FormSelect label="Class" options={CLASSES} value={form.class} onChange={set("class")} placeholder="No class" />
          <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
        </div>
      </div>

      {/* Parent & Contact */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Parent Name"  placeholder="Rahul Sharma" required value={form.parentName}  onChange={set("parentName")} />
          <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"  value={form.parentPhone} onChange={set("parentPhone")} />
          <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
          {/* City: type freely or pick from list */}
          <ComboInput label="City" placeholder="Indore" options={CITIES} value={form.city} onChange={set("city")} />
          <FormInput label="State" placeholder="Madhya Pradesh" value={form.state} onChange={set("state")} />
        </div>
        <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function StudentsView() {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [classFilter, setClassFilter]   = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  // Modals
  const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
  const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
  const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  const [editingStudent,  setEditingStudent]  = useState<any>(null);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [credentials,     setCredentials]     = useState<{ studentId: string; email: string; password: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState<string | null>(null);
  const [addForm,  setAddForm]      = useState<any>({});
  const [editForm, setEditForm]     = useState<any>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async (q = "", cls = "", sec = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: q, limit: "100" });
      if (cls) params.set("class", cls);
      if (sec) params.set("section", sec);
      const res = await apiFetch(`/api/admin/students?${params}`);
      setStudentsData(res.students ?? []);
    } catch { showToast("Failed to load students"); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(studentSearch, classFilter, sectionFilter), 350);
    return () => clearTimeout(t);
  }, [studentSearch, classFilter, sectionFilter, fetchStudents]);

  // ── Add ────────────────────────────────────────────────────────────────────
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email) {
      showToast("First name, last name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/admin/students", {
        method: "POST",
        body: JSON.stringify({
          fullName:     `${addForm.firstName} ${addForm.lastName}`,
          email:        addForm.email,
          dateOfBirth:  addForm.dateOfBirth,
          gender:       addForm.gender,
          bloodGroup:   addForm.bloodGroup,
          rollNumber:   addForm.rollNumber,
          parentName:   addForm.parentName,
          parentPhone:  addForm.parentPhone,
          parentEmail:  addForm.parentEmail,
          address:      addForm.address,
          city:         addForm.city,
          state:        addForm.state,
          section:      addForm.section      || null,
          class:        addForm.class        || null,
          academicYear: addForm.academicYear || null,
        }),
      });
      if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
      setAddForm({});
      setIsAddModalOpen(false);
      fetchStudents(studentSearch, classFilter, sectionFilter);
    } catch (err: any) {
      let msg = err.message || "Failed to add student";
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg);
    }
    setSubmitting(false);
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const openEdit = (student: any) => {
    const [firstName, ...rest] = (student.fullName ?? "").split(" ");
    setEditForm({
      firstName,
      lastName:    rest.join(" "),
      email:       student.user?.email ?? "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
      gender:      student.gender      ?? "",
      bloodGroup:  student.bloodGroup  ?? "",
      rollNumber:  student.rollNumber  ?? "",
      section:     student.section     ?? "",
      class:       student.class       ?? "",
      academicYear: student.academicYear ?? "",
      parentName:  student.parentName  ?? "",
      parentPhone: student.parentPhone ?? "",
      parentEmail: student.parentEmail ?? "",
      city:        student.city        ?? "",
      state:       student.state       ?? "",
      address:     student.address     ?? "",
    });
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          fullName:     `${editForm.firstName} ${editForm.lastName}`,
          dateOfBirth:  editForm.dateOfBirth,
          gender:       editForm.gender,
          bloodGroup:   editForm.bloodGroup,
          rollNumber:   editForm.rollNumber,
          parentName:   editForm.parentName,
          parentPhone:  editForm.parentPhone,
          parentEmail:  editForm.parentEmail,
          address:      editForm.address,
          city:         editForm.city,
          state:        editForm.state,
          section:      editForm.section      || null,
          class:        editForm.class        || null,
          academicYear: editForm.academicYear || null,
        }),
      });
      showToast("Student updated successfully");
      setIsEditModalOpen(false);
      setEditingStudent(null);
      fetchStudents(studentSearch, classFilter, sectionFilter);
    } catch (err: any) {
      showToast(err.message || "Failed to update student");
    }
    setSubmitting(false);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
      showToast("Student deleted successfully");
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents(studentSearch, classFilter, sectionFilter);
    } catch { showToast("Failed to delete student"); }
    setSubmitting(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
        </div>
        <GradientButton icon={Plus} onClick={() => { setAddForm({}); setIsAddModalOpen(true); }}>
          Add Student
        </GradientButton>
      </div>

      {/* Filters */}
      <Card className="overflow-visible">
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, ID, parent..."
              value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
          </div>

          {/* Class filter */}
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[140px]">
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Section filter */}
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>

          {/* Clear filters */}
          {(classFilter || sectionFilter || studentSearch) && (
            <button onClick={() => { setClassFilter(""); setSectionFilter(""); setStudentSearch(""); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
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
                  {["ID", "Student", "Class / Section", "Academic Year", "Attendance", "Fee", "Parent", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {studentsData.length > 0 ? studentsData.map((s, i) => {
                  const latestFee = s.fees?.[0];
                  const attendancePct = s.attendance?.length
                    ? Math.round((s.attendance.filter((a: any) => a.status === "present").length / s.attendance.length) * 100)
                    : null;
                  const avatarGradients = [
                    "linear-gradient(135deg,#FF6B6B,#FFB347)",
                    "linear-gradient(135deg,#4ECDC4,#45B7AA)",
                    "linear-gradient(135deg,#A78BFA,#7C3AED)",
                  ];
                  return (
                    <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                      <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono">{s.studentId}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div style={{ background: avatarGradients[i % 3] }}
                            className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                            {s.fullName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
                            <p className="text-xs text-gray-400">{s.phone ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {s.class && (
                            <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-lg border border-[#A78BFA]/20">{s.class}</span>
                          )}
                          {s.section && (
                            <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span>
                          )}
                          {!s.class && !s.section && <span className="text-xs text-gray-400">—</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 ml-0.5">Roll: {s.rollNumber ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
                      <td className="px-5 py-4">
                        {attendancePct !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-[#FFF0E8] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${attendancePct >= 90 ? "bg-[#4ECDC4]" : "bg-[#FFB347]"}`} style={{ width: `${attendancePct}%` }} />
                            </div>
                            <span className="text-xs font-black">{attendancePct}%</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <Badge text={latestFee?.paymentStatus === "paid" ? "Paid" : "Pending"}
                          color={latestFee?.paymentStatus === "paid" ? "#4ECDC4" : "#FF6B6B"} />
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(s)}
                            className="p-2 text-gray-400 hover:text-[#FFB347] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FFB347]/40 transition-all shadow-sm"
                            title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                            className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm"
                            title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
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
      </Card>

      {/* ── ADD MODAL ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student">
        <form onSubmit={handleAddStudent} className="space-y-6">
          <StudentFormFields form={addForm} setForm={setAddForm} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
              {submitting ? "Registering..." : "Register Student"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── EDIT MODAL ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`}>
        <form onSubmit={handleEditStudent} className="space-y-6">
          <StudentFormFields form={editForm} setForm={setEditForm} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>
              {submitting ? "Saving..." : "Save Changes"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── CREDENTIALS MODAL ── */}
      <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Registered">
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            Account created. The password is shown <span className="font-black text-[#FF6B6B]">only once</span>.
          </p>
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

      {/* ── DELETE MODAL ── */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
      `}}/>
    </div>
  );
}