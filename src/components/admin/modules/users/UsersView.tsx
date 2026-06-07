// "use client";

// // components/admin/modules/users/UsersView.tsx
// // Full Admin User-Management Module — List, Analytics, Drawer, Create, Edit, Actions

// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Search, Filter, Download, Plus, Eye, Pencil, Lock,
//   Trash2, ChevronLeft, ChevronRight, X, Check,
//   AlertTriangle, Users, GraduationCap, BookOpen,
//   ShieldCheck, UserCheck, UserX, Loader2, Mail,
//   Phone, MapPin, Calendar, RefreshCw, MoreVertical,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type UserRole   = "admin" | "student" | "teacher" | "user";
// type UserStatus = "Active" | "Inactive" | "Suspended" | "Deleted";

// interface Program      { id: string; name: string }
// interface ProgramLevel { id: string; name: string }

// interface StudentProfile {
//   studentId:     string;
//   rollNumber:    string | null;
//   fullName:      string;
//   photoUrl:      string | null;
//   admissionDate: string | null;
//   dateOfBirth:   string | null;
//   gender:        string | null;
//   bloodGroup:    string | null;
//   phone:         string | null;
//   address:       string | null;
//   city:          string | null;
//   state:         string | null;
//   parentName:    string | null;
//   parentPhone:   string | null;
//   parentEmail:   string | null;
//   section:       string | null;
//   academicYear:  string | null;
//   status:        string;
//   program:       Program      | null;
//   programLevel:  ProgramLevel | null;
// }

// interface TeacherSubject { subject: { id: string; name: string } }
// interface TeacherProfile {
//   id:              string;
//   name:            string;
//   phone:           string | null;
//   experience:      string | null;
//   designation:     string | null;
//   wifeOrHusbandOf: string | null;
//   photoUrl:        string | null;
//   dateOfBirth:     string | null;
//   status:          string;
//   subjects:        TeacherSubject[];
// }

// interface User {
//   id:        string;
//   email:     string;
//   name:      string | null;
//   phone:     string | null;
//   city:      string | null;
//   avatarUrl: string | null;
//   role:      UserRole;
//   status:    UserStatus | null;
//   createdAt: string;
//   updatedAt: string;
//   student:   StudentProfile | null;
//   teacher:   TeacherProfile | null;
// }

// interface AuthMeta {
//   emailConfirmed: boolean;
//   provider:       string;
//   lastSignIn:     string | null;
//   createdAt:      string | null;
// }

// interface Analytics {
//   total:    number;
//   students: number;
//   teachers: number;
//   admins:   number;
//   active:   number;
//   inactive: number;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const ROLE_COLORS: Record<UserRole, string> = {
//   admin:   "bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30",
//   student: "bg-[#4ECDC4]/15 text-[#4ECDC4] border border-[#4ECDC4]/30",
//   teacher: "bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30",
//   user:    "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/30",
// };

// const STATUS_COLORS: Record<string, string> = {
//   Active:    "bg-emerald-50 text-emerald-600 border border-emerald-200",
//   Inactive:  "bg-gray-100 text-gray-500 border border-gray-200",
//   Suspended: "bg-amber-50 text-amber-600 border border-amber-200",
//   Deleted:   "bg-red-50 text-red-500 border border-red-200",
// };

// function Avatar({ user, size = 36 }: { user: User; size?: number }) {
//   const initials = (user.name ?? user.email)
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   const roleGradients: Record<UserRole, string> = {
//     admin:   "from-[#FF6B6B] to-[#FF8E53]",
//     student: "from-[#4ECDC4] to-[#44A08D]",
//     teacher: "from-[#A78BFA] to-[#7C3AED]",
//     user:    "from-[#FFB347] to-[#FF8C00]",
//   };

//   if (user.avatarUrl) {
//     return (
//       <img
//         src={user.avatarUrl}
//         alt={user.name ?? ""}
//         width={size} height={size}
//         className="rounded-full object-cover"
//         style={{ width: size, height: size }}
//       />
//     );
//   }

//   return (
//     <div
//       className={`bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center rounded-full text-white font-bold`}
//       style={{ width: size, height: size, fontSize: size * 0.36 }}
//     >
//       {initials}
//     </div>
//   );
// }

// function RoleBadge({ role }: { role: UserRole }) {
//   const labels: Record<UserRole, string> = {
//     admin: "Admin", student: "Student", teacher: "Teacher", user: "User",
//   };
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${ROLE_COLORS[role]}`}>
//       {labels[role]}
//     </span>
//   );
// }

// function StatusBadge({ status }: { status: string | null }) {
//   const s = status ?? "Active";
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[s] ?? STATUS_COLORS.Active}`}>
//       {s}
//     </span>
//   );
// }

// function fmt(dateStr: string | null): string {
//   if (!dateStr) return "—";
//   return new Date(dateStr).toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// }

// // ─── Analytics Cards ──────────────────────────────────────────────────────────

// function AnalyticsCards({ analytics }: { analytics: Analytics | null }) {
//   const cards = [
//     { label: "Total Users",    value: analytics?.total    ?? 0, icon: <Users size={20} />,       color: "from-[#FF6B6B] to-[#FF8E53]", light: "bg-[#FF6B6B]/10" },
//     { label: "Students",       value: analytics?.students ?? 0, icon: <GraduationCap size={20}/>, color: "from-[#4ECDC4] to-[#44A08D]", light: "bg-[#4ECDC4]/10" },
//     { label: "Teachers",       value: analytics?.teachers ?? 0, icon: <BookOpen size={20} />,     color: "from-[#A78BFA] to-[#7C3AED]", light: "bg-[#A78BFA]/10" },
//     { label: "Admins",         value: analytics?.admins   ?? 0, icon: <ShieldCheck size={20} />,  color: "from-[#FFB347] to-[#FF8C00]", light: "bg-[#FFB347]/10" },
//     { label: "Active",         value: analytics?.active   ?? 0, icon: <UserCheck size={20} />,    color: "from-emerald-400 to-emerald-600", light: "bg-emerald-50" },
//     { label: "Inactive / Suspended", value: analytics?.inactive ?? 0, icon: <UserX size={20} />, color: "from-gray-400 to-gray-600",   light: "bg-gray-100" },
//   ];

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//       {cards.map((c, i) => (
//         <div key={i} className="bg-white rounded-2xl p-4 border border-[#F0EEF8] shadow-sm hover:-translate-y-0.5 transition-transform">
//           <div className={`w-9 h-9 rounded-xl ${c.light} flex items-center justify-center mb-3 bg-gradient-to-br ${c.color} text-white`}>
//             {c.icon}
//           </div>
//           <p className="text-2xl font-black text-[#1A1A2E]">{c.value}</p>
//           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{c.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── User Detail Drawer ───────────────────────────────────────────────────────

// function UserDetailDrawer({
//   userId,
//   onClose,
//   onEdit,
//   onStatusChange,
//   onPasswordReset,
//   onDelete,
// }: {
//   userId: string;
//   onClose: () => void;
//   onEdit: (user: User) => void;
//   onStatusChange: (id: string, status: UserStatus) => void;
//   onPasswordReset: (id: string) => void;
//   onDelete: (id: string) => void;
// }) {
//   const [user, setUser]         = useState<User | null>(null);
//   const [authMeta, setAuthMeta] = useState<AuthMeta | null>(null);
//   const [loading, setLoading]   = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`/api/admin/users/${userId}`)
//       .then((r) => r.json())
//       .then(({ user, authMeta }) => {
//         setUser(user);
//         setAuthMeta(authMeta);
//       })
//       .finally(() => setLoading(false));
//   }, [userId]);

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
//       <div
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         aria-hidden
//       />
//       <div
//         className="relative z-10 w-full max-w-lg bg-[#FFFDF7] h-full overflow-y-auto shadow-2xl flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="sticky top-0 z-10 bg-[#FFFDF7] border-b border-[#F0EEF8] px-6 py-4 flex items-center justify-between">
//           <h2 className="text-lg font-black text-[#1A1A2E]">User Details</h2>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <Loader2 className="animate-spin text-[#FF6B6B]" size={32} />
//           </div>
//         ) : !user ? (
//           <div className="flex-1 flex items-center justify-center text-gray-400">User not found.</div>
//         ) : (
//           <div className="flex-1 p-6 space-y-6">

//             {/* Profile hero */}
//             <div className="flex items-center gap-4">
//               <Avatar user={user} size={64} />
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xl font-black text-[#1A1A2E] truncate">{user.name ?? "—"}</h3>
//                 <p className="text-sm text-gray-500 truncate">{user.email}</p>
//                 <div className="flex items-center gap-2 mt-1.5">
//                   <RoleBadge role={user.role} />
//                   <StatusBadge status={user.status} />
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => onEdit(user)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-bold hover:bg-[#FF6B6B]/20 transition"
//               >
//                 <Pencil size={13} /> Edit
//               </button>
//               <button
//                 onClick={() => onPasswordReset(user.id)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-bold hover:bg-[#A78BFA]/20 transition"
//               >
//                 <Lock size={13} /> Reset Password
//               </button>
//               {user.status !== "Suspended" ? (
//                 <button
//                   onClick={() => onStatusChange(user.id, "Suspended")}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition"
//                 >
//                   <AlertTriangle size={13} /> Suspend
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => onStatusChange(user.id, "Active")}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition"
//                 >
//                   <Check size={13} /> Activate
//                 </button>
//               )}
//               <button
//                 onClick={() => onDelete(user.id)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
//               >
//                 <Trash2 size={13} /> Delete
//               </button>
//             </div>

//             {/* Basic Info */}
//             <Section title="Basic Info">
//               <InfoRow icon={<Mail size={14}/>}     label="Email"    value={user.email} />
//               <InfoRow icon={<Phone size={14}/>}    label="Phone"    value={user.phone} />
//               <InfoRow icon={<MapPin size={14}/>}   label="City"     value={user.city} />
//               <InfoRow icon={<Calendar size={14}/>} label="Created"  value={fmt(user.createdAt)} />
//               <InfoRow icon={<RefreshCw size={14}/>}label="Updated"  value={fmt(user.updatedAt)} />
//               <InfoRow icon={<ShieldCheck size={14}/>} label="Supabase ID" value={user.id} mono />
//             </Section>

//             {/* Account Info */}
//             {authMeta && (
//               <Section title="Account Info">
//                 <InfoRow icon={<Check size={14}/>}    label="Email Verified" value={authMeta.emailConfirmed ? "Yes ✅" : "No ❌"} />
//                 <InfoRow icon={<ShieldCheck size={14}/>} label="Provider"   value={authMeta.provider} />
//                 <InfoRow icon={<Calendar size={14}/>} label="Auth Created"  value={fmt(authMeta.createdAt)} />
//                 <InfoRow icon={<Calendar size={14}/>} label="Last Sign In"  value={fmt(authMeta.lastSignIn)} />
//               </Section>
//             )}

//             {/* Student Info */}
//             {user.role === "student" && user.student && (
//               <Section title="Student Info">
//                 <InfoRow label="Student ID"    value={user.student.studentId} />
//                 <InfoRow label="Roll No."      value={user.student.rollNumber} />
//                 <InfoRow label="Program"       value={user.student.program?.name} />
//                 <InfoRow label="Level"         value={user.student.programLevel?.name} />
//                 <InfoRow label="Admission"     value={fmt(user.student.admissionDate)} />
//                 <InfoRow label="Date of Birth" value={fmt(user.student.dateOfBirth)} />
//                 <InfoRow label="Gender"        value={user.student.gender} />
//                 <InfoRow label="Blood Group"   value={user.student.bloodGroup} />
//                 <InfoRow label="Section"       value={user.student.section} />
//                 <InfoRow label="Academic Year" value={user.student.academicYear} />
//                 <InfoRow label="Address"       value={[user.student.address, user.student.city, user.student.state].filter(Boolean).join(", ")} />
//                 <InfoRow label="Parent Name"   value={user.student.parentName} />
//                 <InfoRow label="Parent Phone"  value={user.student.parentPhone} />
//                 <InfoRow label="Parent Email"  value={user.student.parentEmail} />
//                 <InfoRow label="Status"        value={user.student.status} />
//               </Section>
//             )}

//             {/* Teacher Info */}
//             {user.role === "teacher" && user.teacher && (
//               <Section title="Teacher Info">
//                 <InfoRow label="Designation"  value={user.teacher.designation} />
//                 <InfoRow label="Experience"   value={user.teacher.experience} />
//                 <InfoRow label="Date of Birth" value={fmt(user.teacher.dateOfBirth)} />
//                 <InfoRow label="Status"       value={user.teacher.status} />
//                 <InfoRow label="Subjects"     value={user.teacher.subjects.map((s) => s.subject.name).join(", ")} />
//               </Section>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-3">{title}</h4>
//       <div className="bg-white rounded-2xl border border-[#F0EEF8] divide-y divide-[#F0EEF8] overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }

// function InfoRow({
//   icon, label, value, mono,
// }: {
//   icon?: React.ReactNode;
//   label: string;
//   value?: string | null;
//   mono?: boolean;
// }) {
//   return (
//     <div className="flex items-start gap-3 px-4 py-2.5">
//       {icon && <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>}
//       <span className="text-xs text-gray-400 font-semibold w-28 flex-shrink-0">{label}</span>
//       <span className={`text-xs text-[#1A1A2E] font-bold flex-1 break-all ${mono ? "font-mono" : ""}`}>
//         {value ?? "—"}
//       </span>
//     </div>
//   );
// }

// // ─── Create / Edit User Modal ─────────────────────────────────────────────────

// function UserFormModal({
//   editUser,
//   onClose,
//   onSaved,
// }: {
//   editUser: User | null;
//   onClose: () => void;
//   onSaved: () => void;
// }) {
//   const isEdit = !!editUser;
//   const [role, setRole]       = useState<UserRole>(editUser?.role ?? "user");
//   const [name, setName]       = useState(editUser?.name ?? "");
//   const [email, setEmail]     = useState(editUser?.email ?? "");
//   const [phone, setPhone]     = useState(editUser?.phone ?? "");
//   const [status, setStatus]   = useState<UserStatus>(editUser?.status ?? "Active");
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState("");

//   // Student extras
//   const [parentName,  setParentName]  = useState(editUser?.student?.parentName  ?? "");
//   const [parentPhone, setParentPhone] = useState(editUser?.student?.parentPhone ?? "");
//   const [parentEmail, setParentEmail] = useState(editUser?.student?.parentEmail ?? "");
//   const [programId,   setProgramId]   = useState(editUser?.student?.program?.id ?? "");
//   const [programs, setPrograms]       = useState<Program[]>([]);

//   // Teacher extras
//   const [designation, setDesignation] = useState(editUser?.teacher?.designation ?? "");
//   const [experience,  setExperience]  = useState(editUser?.teacher?.experience  ?? "");

//   useEffect(() => {
//     fetch("/api/admin/programs")
//       .then((r) => r.json())
//       .then((d) => setPrograms(d.programs ?? []))
//       .catch(() => {});
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const payload = isEdit
//       ? { name, phone, status }
//       : { role, name, email, phone, programId: programId || undefined, parentName, parentPhone, parentEmail, designation, experience };

//     const url    = isEdit ? `/api/admin/users/${editUser!.id}` : "/api/admin/users";
//     const method = isEdit ? "PATCH" : "POST";

//     const res  = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error ?? "Something went wrong");
//       setLoading(false);
//       return;
//     }

//     // Show credentials if creating
//     if (!isEdit && data.credentials) {
//       alert(
//         `✅ User created!\n\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}\n\nShare these credentials with the user.`
//       );
//     }

//     onSaved();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-black text-white">
//               {isEdit ? "Edit User" : "Create User"}
//             </h2>
//             <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
//               <X size={16} />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
//               <AlertTriangle size={16} /> {error}
//             </div>
//           )}

//           {/* Role (only on create) */}
//           {!isEdit && (
//             <div>
//               <label className="block text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2">Role</label>
//               <div className="grid grid-cols-4 gap-2">
//                 {(["user", "student", "teacher", "admin"] as UserRole[]).map((r) => (
//                   <button
//                     key={r}
//                     type="button"
//                     onClick={() => setRole(r)}
//                     className={`py-2 rounded-xl text-xs font-bold capitalize transition border-2 ${
//                       role === r
//                         ? "border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]"
//                         : "border-[#F0EDE8] text-gray-400 hover:border-gray-300"
//                     }`}
//                   >
//                     {r}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <FormField label="Full Name" required>
//             <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" required />
//           </FormField>

//           {!isEdit && (
//             <FormField label="Email" required>
//               <input className={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
//             </FormField>
//           )}

//           <FormField label="Phone">
//             <input className={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
//           </FormField>

//           {isEdit && (
//             <FormField label="Status">
//               <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
//                 {["Active", "Inactive", "Suspended"].map((s) => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//             </FormField>
//           )}

//           {/* Student extras */}
//           {!isEdit && role === "student" && (
//             <>
//               <div className="border-t border-[#F0EDE8] pt-3">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-[#4ECDC4] mb-3">Student Details</p>
//               </div>
//               <FormField label="Parent Name">
//                 <input className={INPUT} value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent / Guardian" />
//               </FormField>
//               <FormField label="Parent Phone">
//                 <input className={INPUT} value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
//               </FormField>
//               <FormField label="Parent Email">
//                 <input className={INPUT} type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
//               </FormField>
//               <FormField label="Program">
//                 <select className={INPUT} value={programId} onChange={(e) => setProgramId(e.target.value)}>
//                   <option value="">— Select Program —</option>
//                   {programs.map((p) => (
//                     <option key={p.id} value={p.id}>{p.name}</option>
//                   ))}
//                 </select>
//               </FormField>
//             </>
//           )}

//           {/* Teacher extras */}
//           {!isEdit && role === "teacher" && (
//             <>
//               <div className="border-t border-[#F0EDE8] pt-3">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA] mb-3">Teacher Details</p>
//               </div>
//               <FormField label="Designation">
//                 <input className={INPUT} value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Teacher" />
//               </FormField>
//               <FormField label="Experience">
//                 <input className={INPUT} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" />
//               </FormField>
//             </>
//           )}

//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-500 hover:bg-gray-50">
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
//             >
//               {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
//               {isEdit ? "Save Changes" : "Create User"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// const INPUT = "w-full px-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/10 transition placeholder:text-gray-300 placeholder:font-normal";

// function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
//   return (
//     <div>
//       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
//         {label}{required && <span className="text-[#FF6B6B] ml-0.5">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// // ─── Confirm Dialog ───────────────────────────────────────────────────────────

// function ConfirmDialog({
//   title, message, confirmLabel, danger,
//   onConfirm, onClose,
// }: {
//   title: string;
//   message: string;
//   confirmLabel: string;
//   danger?: boolean;
//   onConfirm: () => void;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
//         <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${danger ? "bg-red-100" : "bg-amber-100"}`}>
//           <AlertTriangle className={danger ? "text-red-500" : "text-amber-500"} size={28} />
//         </div>
//         <h3 className="text-lg font-black text-[#1A1A2E] text-center mb-2">{title}</h3>
//         <p className="text-sm text-gray-500 text-center mb-6 font-medium leading-relaxed">{message}</p>
//         <div className="flex gap-3">
//           <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-500">
//             Cancel
//           </button>
//           <button
//             onClick={() => { onConfirm(); onClose(); }}
//             className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white ${danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Row Actions Menu ─────────────────────────────────────────────────────────

// function RowActionsMenu({
//   user,
//   onView,
//   onEdit,
//   onSuspend,
//   onActivate,
//   onResetPassword,
//   onDelete,
// }: {
//   user: User;
//   onView: () => void;
//   onEdit: () => void;
//   onSuspend: () => void;
//   onActivate: () => void;
//   onResetPassword: () => void;
//   onDelete: () => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const actions = [
//     { icon: <Eye size={13} />,    label: "View Details",    fn: onView,           color: "text-gray-700" },
//     { icon: <Pencil size={13} />, label: "Edit",            fn: onEdit,           color: "text-gray-700" },
//     { icon: <Lock size={13} />,   label: "Reset Password",  fn: onResetPassword,  color: "text-[#A78BFA]" },
//     user.status === "Suspended"
//       ? { icon: <Check size={13} />,          label: "Activate",  fn: onActivate, color: "text-emerald-600" }
//       : { icon: <AlertTriangle size={13} />,  label: "Suspend",   fn: onSuspend,  color: "text-amber-600"  },
//     { icon: <Trash2 size={13} />, label: "Delete",          fn: onDelete,         color: "text-red-500"    },
//   ];

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
//       >
//         <MoreVertical size={16} />
//       </button>
//       {open && (
//         <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-2xl shadow-xl border border-[#F0EEF8] py-1.5 overflow-hidden">
//           {actions.map((a, i) => (
//             <button
//               key={i}
//               onClick={() => { a.fn(); setOpen(false); }}
//               className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-[#FFFDF7] transition ${a.color}`}
//             >
//               {a.icon} {a.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main UsersView ───────────────────────────────────────────────────────────

// export default function UsersView() {
//   const router = useRouter();

//   // Data
//   const [users,     setUsers]     = useState<User[]>([]);
//   const [analytics, setAnalytics] = useState<Analytics | null>(null);
//   const [total,     setTotal]     = useState(0);
//   const [loading,   setLoading]   = useState(true);

//   // Filters
//   const [search,  setSearch]  = useState("");
//   const [roleTab, setRoleTab] = useState<"" | UserRole>(""); // "" = All
//   const [sortBy,  setSortBy]  = useState("newest");
//   const [page,    setPage]    = useState(1);
//   const LIMIT = 20;

//   // UI state
//   const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
//   const [editUser,     setEditUser]     = useState<User | null | "create">(null);
//   const [confirm,      setConfirm]      = useState<{
//     title: string; message: string; label: string; danger?: boolean; fn: () => void;
//   } | null>(null);

//   // Fetch
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     const params = new URLSearchParams({
//       page:   String(page),
//       limit:  String(LIMIT),
//       sortBy,
//       ...(search  && { search  }),
//       ...(roleTab && { role: roleTab }),
//     });
//     const res  = await fetch(`/api/admin/users?${params}`);
//     const data = await res.json();
//     setUsers(data.users ?? []);
//     setTotal(data.total ?? 0);
//     setAnalytics(data.analytics ?? null);
//     setLoading(false);
//   }, [page, search, roleTab, sortBy]);

//   useEffect(() => { fetchUsers(); }, [fetchUsers]);

//   // Debounce search → reset to page 1
//   const searchTimeout = useRef<ReturnType<typeof setTimeout>>();
//   const handleSearch = (v: string) => {
//     setSearch(v);
//     setPage(1);
//     clearTimeout(searchTimeout.current);
//     searchTimeout.current = setTimeout(fetchUsers, 400);
//   };

//   // Actions
//   const suspendUser = async (id: string) => {
//     await fetch(`/api/admin/users/${id}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "Suspended" }),
//     });
//     fetchUsers();
//     if (drawerUserId === id) setDrawerUserId(null);
//   };

//   const activateUser = async (id: string) => {
//     await fetch(`/api/admin/users/${id}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "Active" }),
//     });
//     fetchUsers();
//   };

//   const deleteUser = async (id: string) => {
//     await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
//     fetchUsers();
//     if (drawerUserId === id) setDrawerUserId(null);
//   };

//   const resetPassword = async (id: string) => {
//     const res  = await fetch(`/api/admin/users/${id}/reset-password`, { method: "POST" });
//     const data = await res.json();
//     if (res.ok) alert(`✅ Password reset email sent to ${data.email}`);
//     else        alert(`❌ ${data.error}`);
//   };

//   const handleExport = () => {
//     const params = new URLSearchParams({
//       ...(search  && { search  }),
//       ...(roleTab && { role: roleTab }),
//     });
//     window.open(`/api/admin/users/export?${params}`, "_blank");
//   };

//   // Tabs
//   const ROLE_TABS: { label: string; value: "" | UserRole }[] = [
//     { label: "All",      value: ""        },
//     { label: "Admins",   value: "admin"   },
//     { label: "Students", value: "student" },
//     { label: "Teachers", value: "teacher" },
//     { label: "Users",    value: "user"    },
//   ];

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="space-y-6 animate-fade-in">

//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-black text-[#1A1A2E]">User Management</h1>
//           <p className="text-sm text-gray-400 font-medium mt-0.5">
//             {total} total users across all roles
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
//           >
//             <Download size={15} /> Export CSV
//           </button>
//           <button
//             onClick={() => setEditUser("create")}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
//           >
//             <Plus size={15} /> Create User
//           </button>
//         </div>
//       </div>

//       {/* Analytics */}
//       <AnalyticsCards analytics={analytics} />

//       {/* Filters Row */}
//       <div className="bg-white rounded-2xl border border-[#F0EEF8] p-4 flex flex-wrap items-center gap-3">
//         {/* Search */}
//         <div className="relative flex-1 min-w-52">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/10 transition placeholder:text-gray-300 placeholder:font-normal"
//             placeholder="Search by name, email, phone…"
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>

//         {/* Sort */}
//         <div className="flex items-center gap-2">
//           <Filter size={14} className="text-gray-400" />
//           <select
//             className="px-3 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-bold text-gray-600 outline-none focus:border-[#FF6B6B] transition"
//             value={sortBy}
//             onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="name_asc">Name A → Z</option>
//           </select>
//         </div>
//       </div>

//       {/* Role Tabs + Table */}
//       <div className="bg-white rounded-2xl border border-[#F0EEF8] overflow-hidden">

//         {/* Tabs */}
//         <div className="flex items-center gap-1 p-3 border-b border-[#F0EEF8] overflow-x-auto">
//           {ROLE_TABS.map((t) => (
//             <button
//               key={t.value}
//               onClick={() => { setRoleTab(t.value); setPage(1); }}
//               className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
//                 roleTab === t.value
//                   ? "bg-[#FF6B6B] text-white shadow-sm"
//                   : "text-gray-500 hover:bg-gray-50"
//               }`}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="animate-spin text-[#FF6B6B]" size={28} />
//           </div>
//         ) : users.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-gray-300">
//             <Users size={48} className="mb-3 opacity-30" />
//             <p className="text-sm font-bold">No users found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-[#FFFDF7]">
//                   {["User", "Email", "Role", "Status", "Created", "Actions"].map((h) => (
//                     <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="border-t border-[#F0EEF8] hover:bg-[#FFFDF7] transition-colors group"
//                   >
//                     {/* User */}
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-3">
//                         <Avatar user={user} size={36} />
//                         <div>
//                           <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">
//                             {user.name ?? "—"}
//                           </p>
//                           {user.student && (
//                             <p className="text-[10px] text-gray-400 font-semibold">{user.student.studentId}</p>
//                           )}
//                           {user.teacher?.designation && (
//                             <p className="text-[10px] text-gray-400 font-semibold">{user.teacher.designation}</p>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     {/* Email */}
//                     <td className="px-5 py-3">
//                       <p className="text-sm text-gray-500 font-medium">{user.email}</p>
//                       {user.phone && <p className="text-[10px] text-gray-400">{user.phone}</p>}
//                     </td>
//                     {/* Role */}
//                     <td className="px-5 py-3">
//                       <RoleBadge role={user.role} />
//                     </td>
//                     {/* Status */}
//                     <td className="px-5 py-3">
//                       <StatusBadge status={user.status} />
//                     </td>
//                     {/* Created */}
//                     <td className="px-5 py-3">
//                       <p className="text-xs text-gray-400 font-semibold">{fmt(user.createdAt)}</p>
//                     </td>
//                     {/* Actions */}
//                     <td className="px-5 py-3">
//                       <RowActionsMenu
//                         user={user}
//                         onView={() => setDrawerUserId(user.id)}
//                         onEdit={() => setEditUser(user)}
//                         onSuspend={() =>
//                           setConfirm({
//                             title: "Suspend User",
//                             message: `Suspend ${user.name ?? user.email}? They won't be able to log in.`,
//                             label: "Suspend",
//                             fn: () => suspendUser(user.id),
//                           })
//                         }
//                         onActivate={() => activateUser(user.id)}
//                         onResetPassword={() => resetPassword(user.id)}
//                         onDelete={() =>
//                           setConfirm({
//                             title: "Delete User",
//                             message: `Soft-delete ${user.name ?? user.email}? This can be undone by reactivating.`,
//                             label: "Delete",
//                             danger: true,
//                             fn: () => deleteUser(user.id),
//                           })
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-5 py-4 border-t border-[#F0EEF8] flex items-center justify-between">
//             <p className="text-xs text-gray-400 font-semibold">
//               Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="w-8 h-8 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <span className="text-xs font-bold text-gray-600 px-1">
//                 {page} / {totalPages}
//               </span>
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="w-8 h-8 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals & Drawers */}
//       {drawerUserId && (
//         <UserDetailDrawer
//           userId={drawerUserId}
//           onClose={() => setDrawerUserId(null)}
//           onEdit={(u) => { setDrawerUserId(null); setEditUser(u); }}
//           onStatusChange={(id, status) => {
//             if (status === "Suspended") suspendUser(id);
//             else activateUser(id);
//             setDrawerUserId(null);
//           }}
//           onPasswordReset={resetPassword}
//           onDelete={(id) => {
//             setConfirm({
//               title: "Delete User",
//               message: "Soft-delete this user?",
//               label: "Delete",
//               danger: true,
//               fn: () => deleteUser(id),
//             });
//             setDrawerUserId(null);
//           }}
//         />
//       )}

//       {editUser !== null && (
//         <UserFormModal
//           editUser={editUser === "create" ? null : editUser}
//           onClose={() => setEditUser(null)}
//           onSaved={() => { fetchUsers(); setEditUser(null); }}
//         />
//       )}

//       {confirm && (
//         <ConfirmDialog
//           title={confirm.title}
//           message={confirm.message}
//           confirmLabel={confirm.label}
//           danger={confirm.danger}
//           onConfirm={confirm.fn}
//           onClose={() => setConfirm(null)}
//         />
//       )}
//     </div>
//   );
// }














"use client";

// components/admin/modules/users/UsersView.tsx
// Full Admin User-Management Module — List, Analytics, Drawer, Create, Edit, Actions

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/helpers/supabaseClient";
import {
  Search, Filter, Download, Plus, Eye, Pencil, Lock,
  Trash2, ChevronLeft, ChevronRight, X, Check,
  AlertTriangle, Users, GraduationCap, BookOpen,
  ShieldCheck, UserCheck, UserX, Loader2, Mail,
  Phone, MapPin, Calendar, RefreshCw, MoreVertical,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole   = "admin" | "student" | "teacher" | "user";
type UserStatus = "Active" | "Inactive" | "Suspended" | "Deleted";

interface Program      { id: string; name: string }
interface ProgramLevel { id: string; name: string }

interface StudentProfile {
  studentId:     string;
  rollNumber:    string | null;
  fullName:      string;
  photoUrl:      string | null;
  admissionDate: string | null;
  dateOfBirth:   string | null;
  gender:        string | null;
  bloodGroup:    string | null;
  phone:         string | null;
  address:       string | null;
  city:          string | null;
  state:         string | null;
  parentName:    string | null;
  parentPhone:   string | null;
  parentEmail:   string | null;
  section:       string | null;
  academicYear:  string | null;
  status:        string;
  program:       Program      | null;
  programLevel:  ProgramLevel | null;
}

interface TeacherSubject { subject: { id: string; name: string } }
interface TeacherProfile {
  id:              string;
  name:            string;
  phone:           string | null;
  experience:      string | null;
  designation:     string | null;
  wifeOrHusbandOf: string | null;
  photoUrl:        string | null;
  dateOfBirth:     string | null;
  status:          string;
  subjects:        TeacherSubject[];
}

interface User {
  id:        string;
  email:     string;
  name:      string | null;
  phone:     string | null;
  city:      string | null;
  avatarUrl: string | null;
  role:      UserRole;
  status:    UserStatus | null;
  createdAt: string;
  updatedAt: string;
  student:   StudentProfile | null;
  teacher:   TeacherProfile | null;
}

interface AuthMeta {
  emailConfirmed: boolean;
  provider:       string;
  lastSignIn:     string | null;
  createdAt:      string | null;
}

interface Analytics {
  total:    number;
  students: number;
  teachers: number;
  admins:   number;
  active:   number;
  inactive: number;
}

// ─── Auth-aware fetch helper (module-level) ───────────────────────────────────
// Gets the current Supabase session token and attaches it as Bearer.

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";
  return fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<UserRole, string> = {
  admin:   "bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30",
  student: "bg-[#4ECDC4]/15 text-[#4ECDC4] border border-[#4ECDC4]/30",
  teacher: "bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30",
  user:    "bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/30",
};

const STATUS_COLORS: Record<string, string> = {
  Active:    "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Inactive:  "bg-gray-100 text-gray-500 border border-gray-200",
  Suspended: "bg-amber-50 text-amber-600 border border-amber-200",
  Deleted:   "bg-red-50 text-red-500 border border-red-200",
};

function Avatar({ user, size = 36 }: { user: User; size?: number }) {
  const initials = (user.name ?? user.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleGradients: Record<UserRole, string> = {
    admin:   "from-[#FF6B6B] to-[#FF8E53]",
    student: "from-[#4ECDC4] to-[#44A08D]",
    teacher: "from-[#A78BFA] to-[#7C3AED]",
    user:    "from-[#FFB347] to-[#FF8C00]",
  };

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name ?? ""}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center rounded-full text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const labels: Record<UserRole, string> = {
    admin: "Admin", student: "Student", teacher: "Teacher", user: "User",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${ROLE_COLORS[role]}`}>
      {labels[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "Active";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[s] ?? STATUS_COLORS.Active}`}>
      {s}
    </span>
  );
}

function fmt(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Analytics Cards ──────────────────────────────────────────────────────────

function AnalyticsCards({ analytics }: { analytics: Analytics | null }) {
  const cards = [
    { label: "Total Users",          value: analytics?.total    ?? 0, icon: <Users size={20} />,        color: "from-[#FF6B6B] to-[#FF8E53]",      light: "bg-[#FF6B6B]/10"  },
    { label: "Students",             value: analytics?.students ?? 0, icon: <GraduationCap size={20} />, color: "from-[#4ECDC4] to-[#44A08D]",      light: "bg-[#4ECDC4]/10"  },
    { label: "Teachers",             value: analytics?.teachers ?? 0, icon: <BookOpen size={20} />,      color: "from-[#A78BFA] to-[#7C3AED]",      light: "bg-[#A78BFA]/10"  },
    { label: "Admins",               value: analytics?.admins   ?? 0, icon: <ShieldCheck size={20} />,   color: "from-[#FFB347] to-[#FF8C00]",      light: "bg-[#FFB347]/10"  },
    { label: "Active",               value: analytics?.active   ?? 0, icon: <UserCheck size={20} />,     color: "from-emerald-400 to-emerald-600",   light: "bg-emerald-50"    },
    { label: "Inactive / Suspended", value: analytics?.inactive ?? 0, icon: <UserX size={20} />,         color: "from-gray-400 to-gray-600",         light: "bg-gray-100"      },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-[#F0EEF8] shadow-sm hover:-translate-y-0.5 transition-transform"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${c.color} text-white`}
          >
            {c.icon}
          </div>
          <p className="text-2xl font-black text-[#1A1A2E]">{c.value}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── User Detail Drawer ───────────────────────────────────────────────────────

function UserDetailDrawer({
  userId,
  onClose,
  onEdit,
  onStatusChange,
  onPasswordReset,
  onDelete,
}: {
  userId: string;
  onClose: () => void;
  onEdit: (user: User) => void;
  onStatusChange: (id: string, status: UserStatus) => void;
  onPasswordReset: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [user, setUser]         = useState<User | null>(null);
  const [authMeta, setAuthMeta] = useState<AuthMeta | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    authFetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then(({ user, authMeta }) => {
        setUser(user);
        setAuthMeta(authMeta);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-hidden />
      <div
        className="relative z-10 w-full max-w-lg bg-[#FFFDF7] h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FFFDF7] border-b border-[#F0EEF8] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1A1A2E]">User Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#FF6B6B]" size={32} />
          </div>
        ) : !user ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            User not found.
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6">

            {/* Profile hero */}
            <div className="flex items-center gap-4">
              <Avatar user={user} size={64} />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-[#1A1A2E] truncate">{user.name ?? "—"}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(user)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-bold hover:bg-[#FF6B6B]/20 transition"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => onPasswordReset(user.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A78BFA]/10 text-[#A78BFA] text-xs font-bold hover:bg-[#A78BFA]/20 transition"
              >
                <Lock size={13} /> Reset Password
              </button>
              {user.status !== "Suspended" ? (
                <button
                  onClick={() => onStatusChange(user.id, "Suspended")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition"
                >
                  <AlertTriangle size={13} /> Suspend
                </button>
              ) : (
                <button
                  onClick={() => onStatusChange(user.id, "Active")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <Check size={13} /> Activate
                </button>
              )}
              <button
                onClick={() => onDelete(user.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>

            {/* Basic Info */}
            <Section title="Basic Info">
              <InfoRow icon={<Mail size={14} />}      label="Email"       value={user.email} />
              <InfoRow icon={<Phone size={14} />}     label="Phone"       value={user.phone} />
              <InfoRow icon={<MapPin size={14} />}    label="City"        value={user.city} />
              <InfoRow icon={<Calendar size={14} />}  label="Created"     value={fmt(user.createdAt)} />
              <InfoRow icon={<RefreshCw size={14} />} label="Updated"     value={fmt(user.updatedAt)} />
              <InfoRow icon={<ShieldCheck size={14} />} label="Supabase ID" value={user.id} mono />
            </Section>

            {/* Account Info */}
            {authMeta && (
              <Section title="Account Info">
                <InfoRow icon={<Check size={14} />}       label="Email Verified" value={authMeta.emailConfirmed ? "Yes ✅" : "No ❌"} />
                <InfoRow icon={<ShieldCheck size={14} />} label="Provider"       value={authMeta.provider} />
                <InfoRow icon={<Calendar size={14} />}    label="Auth Created"   value={fmt(authMeta.createdAt)} />
                <InfoRow icon={<Calendar size={14} />}    label="Last Sign In"   value={fmt(authMeta.lastSignIn)} />
              </Section>
            )}

            {/* Student Info */}
            {user.role === "student" && user.student && (
              <Section title="Student Info">
                <InfoRow label="Student ID"    value={user.student.studentId} />
                <InfoRow label="Roll No."      value={user.student.rollNumber} />
                <InfoRow label="Program"       value={user.student.program?.name} />
                <InfoRow label="Level"         value={user.student.programLevel?.name} />
                <InfoRow label="Admission"     value={fmt(user.student.admissionDate)} />
                <InfoRow label="Date of Birth" value={fmt(user.student.dateOfBirth)} />
                <InfoRow label="Gender"        value={user.student.gender} />
                <InfoRow label="Blood Group"   value={user.student.bloodGroup} />
                <InfoRow label="Section"       value={user.student.section} />
                <InfoRow label="Academic Year" value={user.student.academicYear} />
                <InfoRow label="Address"       value={[user.student.address, user.student.city, user.student.state].filter(Boolean).join(", ")} />
                <InfoRow label="Parent Name"   value={user.student.parentName} />
                <InfoRow label="Parent Phone"  value={user.student.parentPhone} />
                <InfoRow label="Parent Email"  value={user.student.parentEmail} />
                <InfoRow label="Status"        value={user.student.status} />
              </Section>
            )}

            {/* Teacher Info */}
            {user.role === "teacher" && user.teacher && (
              <Section title="Teacher Info">
                <InfoRow label="Designation"   value={user.teacher.designation} />
                <InfoRow label="Experience"    value={user.teacher.experience} />
                <InfoRow label="Date of Birth" value={fmt(user.teacher.dateOfBirth)} />
                <InfoRow label="Status"        value={user.teacher.status} />
                <InfoRow label="Subjects"      value={user.teacher.subjects.map((s) => s.subject.name).join(", ")} />
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-3">{title}</h4>
      <div className="bg-white rounded-2xl border border-[#F0EEF8] divide-y divide-[#F0EEF8] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  icon, label, value, mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5">
      {icon && <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>}
      <span className="text-xs text-gray-400 font-semibold w-28 flex-shrink-0">{label}</span>
      <span className={`text-xs text-[#1A1A2E] font-bold flex-1 break-all ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── Create / Edit User Modal ─────────────────────────────────────────────────

function UserFormModal({
  editUser,
  onClose,
  onSaved,
}: {
  editUser: User | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editUser;

  const [role,       setRole]       = useState<UserRole>(editUser?.role ?? "user");
  const [name,       setName]       = useState(editUser?.name  ?? "");
  const [email,      setEmail]      = useState(editUser?.email ?? "");
  const [phone,      setPhone]      = useState(editUser?.phone ?? "");
  const [status,     setStatus]     = useState<UserStatus>(editUser?.status ?? "Active");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // Student extras
  const [parentName,  setParentName]  = useState(editUser?.student?.parentName  ?? "");
  const [parentPhone, setParentPhone] = useState(editUser?.student?.parentPhone ?? "");
  const [parentEmail, setParentEmail] = useState(editUser?.student?.parentEmail ?? "");
  const [programId,   setProgramId]   = useState(editUser?.student?.program?.id ?? "");
  const [programs,    setPrograms]    = useState<Program[]>([]);

  // Teacher extras
  const [designation, setDesignation] = useState(editUser?.teacher?.designation ?? "");
  const [experience,  setExperience]  = useState(editUser?.teacher?.experience  ?? "");

  useEffect(() => {
    authFetch("/api/admin/programs")
      .then((r) => r.json())
      .then((d) => setPrograms(d.programs ?? []))
      .catch(() => {});
  }, []);

//   const handleSubmit = async (e: React.FormEvent) => {


//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const payload = isEdit
//       ? { name, phone, status }
//       : {
//           role, name, email, phone,
//           programId:   programId   || undefined,
//           parentName,  parentPhone, parentEmail,
//           designation, experience,
//         };

//     const res  = await authFetch(
//       isEdit ? `/api/admin/users/${editUser!.id}` : "/api/admin/users",
//       { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(payload) }
//     );
//     // const data = await res.json();
//     const response = await fetch("/api/admin/users");

// if (!response.ok) {
//   const text = await response.text();
//   console.error(text);
//   throw new Error(`API Error ${response.status}`);
// }

// const data = await response.json();

//     if (!res.ok) {
//       setError(data.error ?? "Something went wrong");
//       setLoading(false);
//       return;
//     }

//     if (!isEdit && data.credentials) {
//       alert(
//         `✅ User created!\n\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}\n\nShare these credentials with the user.`
//       );
//     }

//     onSaved();
//     onClose();
//   };





const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const payload = isEdit
      ? {
          name,
          phone,
          status,
        }
      : {
          role,
          name,
          email,
          phone,
          programId: programId || undefined,
          parentName,
          parentPhone,
          parentEmail,
          designation,
          experience,
        };

    const res = await authFetch(
      isEdit
        ? `/api/admin/users/${editUser!.id}`
        : "/api/admin/users",
      {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    if (!isEdit && data.credentials) {
      alert(
        `✅ User created!\n\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}\n\nShare these credentials with the user.`
      );
    }

    onSaved();
    onClose();
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">
              {isEdit ? "Edit User" : "Create User"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Role (create only) */}
          {!isEdit && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2">
                Role
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["user", "student", "teacher", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition border-2 ${
                      role === r
                        ? "border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]"
                        : "border-[#F0EDE8] text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <FormField label="Full Name" required>
            <input
              className={INPUT}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              required
            />
          </FormField>

          {!isEdit && (
            <FormField label="Email" required>
              <input
                className={INPUT}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </FormField>
          )}

          <FormField label="Phone">
            <input
              className={INPUT}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </FormField>

          {isEdit && (
            <FormField label="Status">
              <select
                className={INPUT}
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
              >
                {["Active", "Inactive", "Suspended"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
          )}

          {/* Student extras */}
          {!isEdit && role === "student" && (
            <>
              <div className="border-t border-[#F0EDE8] pt-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4ECDC4] mb-3">
                  Student Details
                </p>
              </div>
              <FormField label="Parent Name">
                <input className={INPUT} value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent / Guardian" />
              </FormField>
              <FormField label="Parent Phone">
                <input className={INPUT} value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
              </FormField>
              <FormField label="Parent Email">
                <input className={INPUT} type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
              </FormField>
              <FormField label="Program">
                <select className={INPUT} value={programId} onChange={(e) => setProgramId(e.target.value)}>
                  <option value="">— Select Program —</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </FormField>
            </>
          )}

          {/* Teacher extras */}
          {!isEdit && role === "teacher" && (
            <>
              <div className="border-t border-[#F0EDE8] pt-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA] mb-3">
                  Teacher Details
                </p>
              </div>
              <FormField label="Designation">
                <input className={INPUT} value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Teacher" />
              </FormField>
              <FormField label="Experience">
                <input className={INPUT} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" />
              </FormField>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const INPUT =
  "w-full px-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/10 transition placeholder:text-gray-300 placeholder:font-normal";

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-[#FF6B6B] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  title, message, confirmLabel, danger,
  onConfirm, onClose,
}: {
  title:        string;
  message:      string;
  confirmLabel: string;
  danger?:      boolean;
  onConfirm:    () => void;
  onClose:      () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            danger ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          <AlertTriangle className={danger ? "text-red-500" : "text-amber-500"} size={28} />
        </div>
        <h3 className="text-lg font-black text-[#1A1A2E] text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6 font-medium leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Row Actions Menu ─────────────────────────────────────────────────────────

function RowActionsMenu({
  user,
  onView, onEdit, onSuspend, onActivate, onResetPassword, onDelete,
}: {
  user:            User;
  onView:          () => void;
  onEdit:          () => void;
  onSuspend:       () => void;
  onActivate:      () => void;
  onResetPassword: () => void;
  onDelete:        () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    { icon: <Eye size={13} />,   label: "View Details",   fn: onView,          color: "text-gray-700"   },
    { icon: <Pencil size={13}/>, label: "Edit",           fn: onEdit,          color: "text-gray-700"   },
    { icon: <Lock size={13}/>,   label: "Reset Password", fn: onResetPassword, color: "text-[#A78BFA]"  },
    user.status === "Suspended"
      ? { icon: <Check size={13} />,         label: "Activate", fn: onActivate, color: "text-emerald-600" }
      : { icon: <AlertTriangle size={13} />, label: "Suspend",  fn: onSuspend,  color: "text-amber-600"  },
    { icon: <Trash2 size={13}/>, label: "Delete",         fn: onDelete,        color: "text-red-500"    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-2xl shadow-xl border border-[#F0EEF8] py-1.5 overflow-hidden">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => { a.fn(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold hover:bg-[#FFFDF7] transition ${a.color}`}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main UsersView ───────────────────────────────────────────────────────────

export default function UsersView() {
  // Data
  const [users,     setUsers]     = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);

  // Filters
  const [search,  setSearch]  = useState("");
  const [roleTab, setRoleTab] = useState<"" | UserRole>("");
  const [sortBy,  setSortBy]  = useState("newest");
  const [page,    setPage]    = useState(1);
  const LIMIT = 20;

  // UI state
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [editUser,     setEditUser]     = useState<User | null | "create">(null);
  const [confirm,      setConfirm]      = useState<{
    title: string; message: string; label: string; danger?: boolean; fn: () => void;
  } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page:   String(page),
      limit:  String(LIMIT),
      sortBy,
      ...(search  && { search  }),
      ...(roleTab && { role: roleTab }),
    });
    const res  = await authFetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users     ?? []);
    setTotal(data.total     ?? 0);
    setAnalytics(data.analytics ?? null);
    setLoading(false);
  }, [page, search, roleTab, sortBy]);

  // useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // // Debounce search
  // const searchTimeout = useRef<ReturnType<typeof setTimeout>>();
  // const handleSearch = (v: string) => {
  //   setSearch(v);
  //   setPage(1);
  //   clearTimeout(searchTimeout.current);
  //   searchTimeout.current = setTimeout(fetchUsers, 400);
  // };


  useEffect(() => {
  fetchUsers();
}, [fetchUsers]);

// Debounce search
const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleSearch = (v: string) => {
  setSearch(v);
  setPage(1);

  if (searchTimeout.current) {
    clearTimeout(searchTimeout.current);
  }

  searchTimeout.current = setTimeout(() => {
    fetchUsers();
  }, 400);
};

  // ── Actions ────────────────────────────────────────────────────────────────
  const suspendUser = async (id: string) => {
    await authFetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Suspended" }),
    });
    fetchUsers();
    if (drawerUserId === id) setDrawerUserId(null);
  };

  const activateUser = async (id: string) => {
    await authFetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Active" }),
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await authFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
    if (drawerUserId === id) setDrawerUserId(null);
  };

  const resetPassword = async (id: string) => {
    const res  = await authFetch(`/api/admin/users/${id}/reset-password`, { method: "POST" });
    const data = await res.json();
    if (res.ok) alert(`✅ Password reset email sent to ${data.email}`);
    else        alert(`❌ ${data.error}`);
  };

  const handleExport = async () => {
    const params = new URLSearchParams({
      ...(search  && { search  }),
      ...(roleTab && { role: roleTab }),
    });
    const res  = await authFetch(`/api/admin/users/export?${params}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `users-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const ROLE_TABS: { label: string; value: "" | UserRole }[] = [
    { label: "All",      value: ""        },
    { label: "Admins",   value: "admin"   },
    { label: "Students", value: "student" },
    { label: "Teachers", value: "teacher" },
    { label: "Users",    value: "user"    },
  ];

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">User Management</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            {total} total users across all roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={() => setEditUser("create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus size={15} /> Create User
          </button>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsCards analytics={analytics} />

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-[#F0EEF8] p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/10 transition placeholder:text-gray-300 placeholder:font-normal"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            className="px-3 py-2.5 rounded-xl border-2 border-[#F0EDE8] bg-[#FFFDF7] text-sm font-bold text-gray-600 outline-none focus:border-[#FF6B6B] transition"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name A → Z</option>
          </select>
        </div>
      </div>

      {/* Role Tabs + Table */}
      <div className="bg-white rounded-2xl border border-[#F0EEF8] overflow-hidden">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-3 border-b border-[#F0EEF8] overflow-x-auto">
          {ROLE_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setRoleTab(t.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                roleTab === t.value
                  ? "bg-[#FF6B6B] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#FF6B6B]" size={28} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <Users size={48} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFFDF7]">
                  {["User", "Email", "Role", "Status", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-[#F0EEF8] hover:bg-[#FFFDF7] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} size={36} />
                        <div>
                          <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">
                            {user.name ?? "—"}
                          </p>
                          {user.student && (
                            <p className="text-[10px] text-gray-400 font-semibold">{user.student.studentId}</p>
                          )}
                          {user.teacher?.designation && (
                            <p className="text-[10px] text-gray-400 font-semibold">{user.teacher.designation}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                      {user.phone && <p className="text-[10px] text-gray-400">{user.phone}</p>}
                    </td>
                    <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-5 py-3">
                      <p className="text-xs text-gray-400 font-semibold">{fmt(user.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <RowActionsMenu
                        user={user}
                        onView={() => setDrawerUserId(user.id)}
                        onEdit={() => setEditUser(user)}
                        onSuspend={() =>
                          setConfirm({
                            title:   "Suspend User",
                            message: `Suspend ${user.name ?? user.email}? They won't be able to log in.`,
                            label:   "Suspend",
                            fn:      () => suspendUser(user.id),
                          })
                        }
                        onActivate={() => activateUser(user.id)}
                        onResetPassword={() => resetPassword(user.id)}
                        onDelete={() =>
                          setConfirm({
                            title:   "Delete User",
                            message: `Soft-delete ${user.name ?? user.email}? This can be undone by reactivating.`,
                            label:   "Delete",
                            danger:  true,
                            fn:      () => deleteUser(user.id),
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#F0EEF8] flex items-center justify-between">
            <p className="text-xs text-gray-400 font-semibold">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-gray-600 px-1">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-[#F0EDE8] flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      {drawerUserId && (
        <UserDetailDrawer
          userId={drawerUserId}
          onClose={() => setDrawerUserId(null)}
          onEdit={(u) => { setDrawerUserId(null); setEditUser(u); }}
          onStatusChange={(id, status) => {
            if (status === "Suspended") suspendUser(id);
            else activateUser(id);
            setDrawerUserId(null);
          }}
          onPasswordReset={resetPassword}
          onDelete={(id) => {
            setConfirm({
              title:   "Delete User",
              message: "Soft-delete this user?",
              label:   "Delete",
              danger:  true,
              fn:      () => deleteUser(id),
            });
            setDrawerUserId(null);
          }}
        />
      )}

      {editUser !== null && (
        <UserFormModal
          editUser={editUser === "create" ? null : editUser}
          onClose={() => setEditUser(null)}
          onSaved={() => { fetchUsers(); setEditUser(null); }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.label}
          danger={confirm.danger}
          onConfirm={confirm.fn}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}