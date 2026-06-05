




// 'use client';

// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle, Loader2, Calendar,
//   FileText, Clock, BookOpen, ChevronDown, GraduationCap,
//   Layers, Filter, Upload, Image, File, ExternalLink, Paperclip,
// } from 'lucide-react';
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Program {
//   id: string;
//   name: string;
//   hasLevels: boolean;
//   levels?: ProgramLevel[];
// }
// interface ProgramLevel {
//   id: string;
//   name: string;
//   programId: string;
// }
// interface Exam {
//   id: string;
//   examName: string;
//   description?: string;
//   examStartDate?: string;
//   examEndDate?: string;
//   programId?: string;
//   levelId?: string;
//   fileUrl?: string;
//   fileType?: string;  // "pdf" | "image"
//   fileName?: string;
//   program?: { id: string; name: string };
//   level?: { id: string; name: string };
// }

// // ─── API Helper ───────────────────────────────────────────────────────────────

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

// // ─── UI Components ────────────────────────────────────────────────────────────

// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button
//     type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(167,139,250,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
//   >
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const Badge = ({ text, color = "#FFB347" }: { text: string; color?: string }) => (
//   <span
//     style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block"
//   >
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm"
//       style={{ paddingTop: "96px" }}
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
//         onClick={e => e.stopPropagation()}
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
//       type={type} placeholder={placeholder} value={value ?? ""}
//       onChange={e => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"
//     />
//   </div>
// );

// const FormTextarea = ({ label, placeholder, value, onChange }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</label>
//     <textarea
//       placeholder={placeholder} value={value ?? ""}
//       onChange={e => onChange?.(e.target.value)}
//       rows={3}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors resize-none custom-scrollbar"
//     />
//   </div>
// );

// const StyledSelect = ({
//   label, value, onChange, options, placeholder, required = false, disabled = false,
// }: {
//   label: string; value: string; onChange: (v: string) => void;
//   options: { value: string; label: string }[]; placeholder: string;
//   required?: boolean; disabled?: boolean;
// }) => {
//   const [open, setOpen] = useState(false);
//   const selected = options.find(o => o.value === value);
//   return (
//     <div className="space-y-1.5 relative">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//         {label} {required && <span className="text-[#FF6B6B]">*</span>}
//       </label>
//       <button
//         type="button" disabled={disabled}
//         onClick={() => !disabled && setOpen(p => !p)}
//         className={`w-full bg-[#FFFDF7] border-2 rounded-xl px-4 py-3 text-sm font-bold text-left flex items-center justify-between transition-colors
//           ${open ? 'border-[#F59E0B] ring-4 ring-[#F59E0B]/10' : 'border-[#F0EEF8]'}
//           ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#A78BFA] cursor-pointer'}`}
//       >
//         <span className={selected ? 'text-[#1A1A2E]' : 'text-gray-400'}>
//           {selected ? selected.label : placeholder}
//         </span>
//         <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>
//       {open && (
//         <>
//           <div className="fixed inset-0 z-[210]" onClick={() => setOpen(false)} />
//           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#F0EEF8] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-[220] max-h-56 overflow-y-auto custom-scrollbar">
//             <div className="px-4 py-3 text-sm text-gray-400 font-bold cursor-pointer hover:bg-gray-50"
//               onClick={() => { onChange(''); setOpen(false); }}>{placeholder}</div>
//             {options.map(opt => (
//               <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
//                 className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors
//                   ${value === opt.value ? 'bg-[#1D4ED8] text-white' : 'text-[#1A1A2E] hover:bg-[#F0EEF8]'}`}>
//                 {opt.label}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // ─── File Upload Component ────────────────────────────────────────────────────

// const FileUploader = ({
//   file, onFileChange, onClear,
// }: {
//   file: File | null;
//   onFileChange: (f: File | null) => void;
//   onClear: () => void;
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [dragOver, setDragOver] = useState(false);

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     const dropped = e.dataTransfer.files[0];
//     if (dropped && isValidFile(dropped)) onFileChange(dropped);
//   };

//   const isValidFile = (f: File) => {
//     const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
//     return allowed.includes(f.type);
//   };

//   const formatBytes = (bytes: number) => {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
//   };

//   const isImage = file && file.type.startsWith('image/');

//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//         Attachment <span className="text-gray-400 font-medium normal-case">(PDF or Image, max 10MB)</span>
//       </label>

//       {!file ? (
//         <div
//           onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={handleDrop}
//           onClick={() => inputRef.current?.click()}
//           className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
//             ${dragOver ? 'border-[#A78BFA] bg-[#A78BFA]/5' : 'border-[#F0EEF8] hover:border-[#A78BFA]/50 hover:bg-[#FAFAFA]'}`}
//         >
//           <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center">
//             <Upload size={18} className="text-[#A78BFA]" />
//           </div>
//           <p className="text-sm font-bold text-[#1A1A2E]">Drop file here or <span className="text-[#A78BFA]">browse</span></p>
//           <p className="text-xs text-gray-400 font-medium">Supports PDF, JPG, PNG, WEBP</p>
//           <input
//             ref={inputRef} type="file"
//             accept=".pdf,image/jpeg,image/png,image/webp"
//             className="hidden"
//             onChange={e => {
//               const f = e.target.files?.[0];
//               if (f && isValidFile(f)) onFileChange(f);
//               e.target.value = '';
//             }}
//           />
//         </div>
//       ) : (
//         <div className="border-2 border-[#A78BFA]/30 bg-[#A78BFA]/5 rounded-xl p-4 flex items-center gap-3">
//           {/* Preview */}
//           <div className="w-10 h-10 rounded-xl bg-white border border-[#F0EEF8] flex items-center justify-center flex-shrink-0 overflow-hidden">
//             {isImage ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
//             ) : (
//               <FileText size={18} className="text-[#A78BFA]" />
//             )}
//           </div>
//           {/* Info */}
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-black text-[#1A1A2E] truncate">{file.name}</p>
//             <p className="text-xs text-gray-500 font-medium mt-0.5">
//               {isImage ? 'Image' : 'PDF'} · {formatBytes(file.size)}
//             </p>
//           </div>
//           {/* Clear */}
//           <button
//             type="button" onClick={onClear}
//             className="p-1.5 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors flex-shrink-0"
//           >
//             <X size={14} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Program Group Card ───────────────────────────────────────────────────────

// const ProgramGroupCard = ({
//   programName, exams, onDelete,
// }: {
//   programName: string; exams: Exam[]; onDelete: (exam: Exam) => void;
// }) => {
//   const [expanded, setExpanded] = useState(true);
//   const upcomingCount = exams.filter(e =>
//     e.examStartDate && new Date(e.examStartDate) >= new Date(new Date().setHours(0, 0, 0, 0))
//   ).length;

//   return (
//     <Card className="overflow-visible">
//       <div
//         className="flex items-center justify-between p-5 cursor-pointer select-none bg-gradient-to-r from-[#F8F6FF] to-white border-b border-[#F0EEF8]"
//         onClick={() => setExpanded(p => !p)}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
//             <GraduationCap size={18} />
//           </div>
//           <div>
//             <h3 className="font-black text-[#1A1A2E] text-base">{programName}</h3>
//             <p className="text-xs text-gray-500 font-medium mt-0.5">
//               {exams.length} exam{exams.length !== 1 ? 's' : ''} · {upcomingCount} upcoming
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {upcomingCount > 0 && <Badge text={`${upcomingCount} upcoming`} color="#A78BFA" />}
//           <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
//         </div>
//       </div>

//       {expanded && (
//         <div className="divide-y divide-[#F0EEF8]">
//           {exams.length === 0 ? (
//             <div className="p-8 text-center">
//               <p className="text-sm text-gray-400 font-medium">No exams found for this program.</p>
//             </div>
//           ) : (
//             exams.map(exam => {
//               const isUpcoming = exam.examStartDate
//                 ? new Date(exam.examStartDate) >= new Date(new Date().setHours(0, 0, 0, 0))
//                 : false;
//               const statusColor = isUpcoming ? '#A78BFA' : '#4ECDC4';

//               return (
//                 <div key={exam.id} className="p-5 flex items-start gap-4 group hover:bg-[#FAFAFA] transition-colors">
//                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
//                     ${isUpcoming ? 'bg-[#A78BFA]/10 text-[#A78BFA]' : 'bg-[#4ECDC4]/10 text-[#4ECDC4]'}`}>
//                     <FileText size={16} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 flex-wrap">
//                       <div>
//                         <h4 className="font-black text-[#1A1A2E] text-sm group-hover:text-[#A78BFA] transition-colors">
//                           {exam.examName}
//                         </h4>
//                         {exam.level && (
//                           <div className="flex items-center gap-1 mt-0.5">
//                             <Layers size={11} className="text-gray-400" />
//                             <span className="text-[11px] text-gray-500 font-bold">{exam.level.name}</span>
//                           </div>
//                         )}
//                       </div>
//                       <Badge text={isUpcoming ? "Upcoming" : "Completed"} color={statusColor} />
//                     </div>

//                     {exam.description && (
//                       <p className="text-xs text-gray-500 mt-1.5 font-medium line-clamp-1">{exam.description}</p>
//                     )}

//                     <div className="flex items-center gap-4 mt-2 flex-wrap">
//                       <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
//                         <Calendar size={12} style={{ color: statusColor }} />
//                         {exam.examStartDate
//                           ? new Date(exam.examStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
//                           : 'TBA'}
//                       </div>
//                       {exam.examEndDate && (
//                         <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
//                           <Clock size={12} className="opacity-50" />
//                           Ends: {new Date(exam.examEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                         </div>
//                       )}
//                       {/* Attachment badge */}
//                       {exam.fileUrl && (
//                         <a
//                           href={exam.fileUrl} target="_blank" rel="noopener noreferrer"
//                           onClick={e => e.stopPropagation()}
//                           className="flex items-center gap-1 text-xs font-bold text-[#A78BFA] hover:underline"
//                         >
//                           {exam.fileType === 'image'
//                             ? <Image size={11} /> : <FileText size={11} />}
//                           {exam.fileName ?? (exam.fileType === 'image' ? 'View Image' : 'View PDF')}
//                           <ExternalLink size={10} />
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => onDelete(exam)}
//                     className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-all flex-shrink-0"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </Card>
//   );
// };

// // ─── Main ExamsView ───────────────────────────────────────────────────────────

// export default function ExamsView() {
//   const [examsData, setExamsData] = useState<Exam[]>([]);
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [programFilter, setProgramFilter] = useState('All');

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<string | null>(null);
//   const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

//   const [examForm, setExamForm] = useState({
//     examName: '', examDate: '', examEndDate: '',
//     description: '', programId: '', levelId: '',
//   });
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);

//   const selectedProgram = programs.find(p => p.id === examForm.programId);
//   const availableLevels = selectedProgram?.levels ?? [];

//   const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── Fetch ──────────────────────────────────────────────────────────────────

//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res = await apiFetch("/api/admin/programs");
//       setPrograms(res?.programs ?? []);
//     } catch { /* silent */ }
//   }, []);

//   const fetchExams = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch("/api/admin/exams");
//       setExamsData(res ?? []);
//     } catch {
//       showToast("Failed to load exams", "error");
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchPrograms(); fetchExams(); }, [fetchPrograms, fetchExams]);

//   // ── Handlers ───────────────────────────────────────────────────────────────

//   const handleOpenModal = () => {
//     setExamForm({ examName: '', examDate: '', examEndDate: '', description: '', programId: '', levelId: '' });
//     setAttachedFile(null);
//     setUploadProgress(null);
//     setIsModalOpen(true);
//   };

//   const handleSaveExam = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!examForm.examName) { showToast("Exam title is required", "error"); return; }
//     if (!examForm.programId) { showToast("Please select a program", "error"); return; }

//     setSubmitting(true);

//     try {
//       let fileUrl: string | undefined;
//       let fileType: string | undefined;
//       let fileName: string | undefined;
//       let storagePath: string | undefined;

//       // ── Step 1: Upload file to Supabase Storage if attached ────────────────
//       if (attachedFile) {
//         setUploadProgress("Uploading file...");
//         const ext = attachedFile.name.split('.').pop();
//         const safeTimestamp = Date.now();
//         const safeName = attachedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
//         const path = `exams/${safeTimestamp}_${safeName}`;

//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('exam-files')           // ← your Supabase bucket name
//           .upload(path, attachedFile, { cacheControl: '3600', upsert: false });

//         if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

//         const { data: urlData } = supabase.storage
//           .from('exam-files')
//           .getPublicUrl(uploadData.path);

//         fileUrl = urlData.publicUrl;
//         fileType = attachedFile.type.startsWith('image/') ? 'image' : 'pdf';
//         fileName = attachedFile.name;
//         storagePath = uploadData.path;
//         setUploadProgress("Saving exam...");
//       }

//       // ── Step 2: Save exam record ───────────────────────────────────────────
//       await apiFetch("/api/admin/exams", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           examName: examForm.examName,
//           description: examForm.description,
//           examStartDate: examForm.examDate,
//           examEndDate: examForm.examEndDate || undefined,
//           programId: examForm.programId,
//           levelId: examForm.levelId || undefined,
//           fileUrl,
//           fileType,
//           fileName,
//           storagePath,
//         }),
//       });

//       showToast("Exam scheduled successfully! 📝");
//       setIsModalOpen(false);
//       fetchExams();
//     } catch (err: any) {
//       showToast(err.message || "Failed to schedule exam", "error");
//     }

//     setSubmitting(false);
//     setUploadProgress(null);
//   };

//   const confirmDelete = (exam: Exam) => { setExamToDelete(exam); setIsDeleteModalOpen(true); };

//   const handleDelete = async () => {
//     if (!examToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/exams/${examToDelete.id}`, { method: "DELETE" });
//       showToast("Exam deleted successfully");
//       fetchExams();
//       setIsDeleteModalOpen(false);
//       setExamToDelete(null);
//     } catch {
//       showToast("Failed to delete exam", "error");
//     }
//     setSubmitting(false);
//   };

//   // ── Filtering & Grouping ───────────────────────────────────────────────────

//   const filteredExams = useMemo(() => {
//     return examsData.filter(e => {
//       const matchesSearch =
//         (e.examName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (e.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
//       const isUpcoming = e.examStartDate
//         ? new Date(e.examStartDate) >= new Date(new Date().setHours(0, 0, 0, 0))
//         : false;
//       let matchesStatus = true;
//       if (statusFilter === 'Upcoming') matchesStatus = isUpcoming;
//       if (statusFilter === 'Completed') matchesStatus = !isUpcoming;
//       const matchesProgram = programFilter === 'All' || e.program?.id === programFilter;
//       return matchesSearch && matchesStatus && matchesProgram;
//     }).sort((a, b) => {
//       if (!a.examStartDate) return 1;
//       if (!b.examStartDate) return -1;
//       return new Date(a.examStartDate).getTime() - new Date(b.examStartDate).getTime();
//     });
//   }, [examsData, searchQuery, statusFilter, programFilter]);

//   const groupedExams = useMemo(() => {
//     const groups: Record<string, { programId: string; exams: Exam[] }> = {};
//     filteredExams.forEach(exam => {
//       const key = exam.program?.name ?? 'No Program';
//       if (!groups[key]) groups[key] = { programId: exam.program?.id ?? '', exams: [] };
//       groups[key].exams.push(exam);
//     });
//     return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
//   }, [filteredExams]);

//   const totalUpcoming = examsData.filter(e =>
//     e.examStartDate && new Date(e.examStartDate) >= new Date(new Date().setHours(0, 0, 0, 0))
//   ).length;

//   const programOptions = programs.map(p => ({ value: p.id, label: p.name }));
//   const levelOptions = availableLevels.map(l => ({ value: l.id, label: l.name }));
//   const programFilterOptions = [
//     { value: 'All', label: 'All Programs' },
//     ...programs.map(p => ({ value: p.id, label: p.name })),
//   ];

//   // ── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="space-y-6 relative">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Exam Scheduler</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">Schedule and manage exams per program & level.</p>
//         </div>
//         <GradientButton icon={Plus} onClick={handleOpenModal}>Schedule Exam</GradientButton>
//       </div>

//       {/* Stat Pills */}
//       <div className="flex flex-wrap gap-3">
//         {[
//           { label: 'Total', value: examsData.length, color: '#A78BFA' },
//           { label: 'Upcoming', value: totalUpcoming, color: '#F59E0B' },
//           { label: 'Completed', value: examsData.length - totalUpcoming, color: '#4ECDC4' },
//           { label: 'Programs', value: programs.length, color: '#FF6B6B' },
//         ].map(stat => (
//           <div key={stat.label}
//             style={{ borderColor: stat.color + '33', background: stat.color + '0D' }}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border">
//             <span className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</span>
//             <span className="text-xs font-bold text-gray-500">{stat.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Toolbar */}
//       <Card className="bg-[#FFFDF7]">
//         <div className="p-5 flex flex-col md:flex-row gap-4 flex-wrap">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input type="text" placeholder="Search exams..." value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/10 transition-all shadow-sm"
//             />
//           </div>
//           <div className="flex items-center gap-2 flex-wrap">
//             <Filter size={14} className="text-gray-400 flex-shrink-0" />
//             {programFilterOptions.map(opt => (
//               <button key={opt.value} onClick={() => setProgramFilter(opt.value)}
//                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap
//                   ${programFilter === opt.value
//                     ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-2 border-[#A78BFA]/20'
//                     : 'bg-white text-gray-500 border-2 border-[#F0EEF8] hover:border-[#A78BFA]/30 hover:text-[#A78BFA]'}`}>
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//           <div className="flex gap-2 flex-shrink-0">
//             {["All", "Upcoming", "Completed"].map(status => (
//               <button key={status} onClick={() => setStatusFilter(status)}
//                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
//                   ${statusFilter === status ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-500 border-2 border-[#F0EEF8] hover:border-gray-300'}`}>
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>
//       </Card>

//       {/* Grouped Exam List */}
//       <div className="space-y-4">
//         {loading ? (
//           <Card className="flex flex-col items-center justify-center h-64 text-[#A78BFA]">
//             <Loader2 className="animate-spin mb-4" size={32} />
//             <p className="text-sm font-bold text-gray-500">Loading exams...</p>
//           </Card>
//         ) : groupedExams.length === 0 ? (
//           <Card className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//               <BookOpen size={24} className="text-gray-300" />
//             </div>
//             <p className="text-base font-bold text-[#1A1A2E]">No exams found</p>
//             <p className="text-sm mt-1 text-gray-500">Adjust your filters or schedule a new exam.</p>
//           </Card>
//         ) : (
//           groupedExams.map(([programName, { exams }]) => (
//             <ProgramGroupCard key={programName} programName={programName} exams={exams} onDelete={confirmDelete} />
//           ))
//         )}
//       </div>

//       {/* ── Add Exam Modal ─────────────────────────────────────────────────── */}
//       <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title="Schedule New Exam">
//         <form onSubmit={handleSaveExam} className="space-y-5">

//           {/* Program */}
//           <StyledSelect
//             label="Program" required value={examForm.programId}
//             onChange={v => setExamForm(f => ({ ...f, programId: v, levelId: '' }))}
//             options={programOptions} placeholder="Select program..."
//           />

//           {/* Level — only for programs with levels */}
//           {selectedProgram?.hasLevels && availableLevels.length > 0 && (
//             <StyledSelect
//               label="Level / Class" value={examForm.levelId}
//               onChange={v => setExamForm(f => ({ ...f, levelId: v }))}
//               options={levelOptions} placeholder="Select level..."
//               disabled={!examForm.programId}
//             />
//           )}

//           {/* Exam Title */}
//           <FormInput
//             label="Exam Title" placeholder="e.g. Half-Yearly Mathematics" required
//             value={examForm.examName}
//             onChange={(v: string) => setExamForm(f => ({ ...f, examName: v }))}
//           />

//           {/* Dates */}
//           <div className="grid grid-cols-2 gap-4">
//             <FormInput label="Start Date" type="date" required value={examForm.examDate}
//               onChange={(v: string) => setExamForm(f => ({ ...f, examDate: v }))} />
//             <FormInput label="End Date (Optional)" type="date" value={examForm.examEndDate}
//               onChange={(v: string) => setExamForm(f => ({ ...f, examEndDate: v }))} />
//           </div>

//           {/* Description */}
//           <FormTextarea
//             label="Description / Instructions"
//             placeholder="e.g. Chapters 1 to 5. Bring geometry boxes. No calculators allowed."
//             value={examForm.description}
//             onChange={(v: string) => setExamForm(f => ({ ...f, description: v }))}
//           />

//           {/* File Upload */}
//           <FileUploader
//             file={attachedFile}
//             onFileChange={setAttachedFile}
//             onClear={() => setAttachedFile(null)}
//           />

//           {/* Upload progress indicator */}
//           {uploadProgress && (
//             <div className="flex items-center gap-2 text-xs font-bold text-[#A78BFA]">
//               <Loader2 size={14} className="animate-spin" />
//               {uploadProgress}
//             </div>
//           )}

//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? (uploadProgress ?? 'Saving...') : 'Schedule Exam'}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ── Delete Modal ───────────────────────────────────────────────────── */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => !submitting && setIsDeleteModalOpen(false)} title="Confirm Action">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{examToDelete?.examName}"?</h4>
//             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
//               This will permanently remove the exam and its attachment. This cannot be undone.
//             </p>
//           </div>
//           <div className="w-full flex gap-3 pt-2">
//             <button onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//             <button onClick={handleDelete} disabled={submitting}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* ── Toast ─────────────────────────────────────────────────────────── */}
//       {toast && (
//         <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-lg z-[201] animate-in slide-in-from-bottom-5
//           ${toast.type === 'error'
//             ? 'bg-[#FF6B6B]'
//             : 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]'}`}>
//           {toast.msg}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #A78BFA44; border-radius: 6px; }
//       `}} />
//     </div>
//   );
// }









'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle, Loader2, Calendar,
  FileText, Clock, BookOpen, ChevronDown, GraduationCap,
  Layers, Filter, Upload, Image, ExternalLink,
} from 'lucide-react';
import { supabase } from "@/lib/helpers/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Program {
  id: string;
  name: string;
  hasLevels: boolean;
  levels?: ProgramLevel[];
}
interface ProgramLevel {
  id: string;
  name: string;
  programId: string;
}
interface Exam {
  id: string;
  examName: string;
  description?: string;
  examStartDate?: string;
  examEndDate?: string;
  programId?: string;
  levelId?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  program?: { id: string; name: string };
  level?: { id: string; name: string };
}

// ─── API Helper ───────────────────────────────────────────────────────────────

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

// ─── UI Components ────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(167,139,250,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const Badge = ({ text, color = "#FFB347" }: { text: string; color?: string }) => (
  <span
    style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block"
  >
    {text}
  </span>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm"
      style={{ paddingTop: "96px" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
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
    <input
      type={type} placeholder={placeholder} value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"
    />
  </div>
);

const FormTextarea = ({ label, placeholder, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</label>
    <textarea
      placeholder={placeholder} value={value ?? ""}
      onChange={e => onChange?.(e.target.value)}
      rows={3}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors resize-none custom-scrollbar"
    />
  </div>
);

const StyledSelect = ({
  label, value, onChange, options, placeholder, required = false, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder: string;
  required?: boolean; disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5 relative">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
        {label} {required && <span className="text-[#FF6B6B]">*</span>}
      </label>
      <button
        type="button" disabled={disabled}
        onClick={() => !disabled && setOpen(p => !p)}
        className={`w-full bg-[#FFFDF7] border-2 rounded-xl px-4 py-3 text-sm font-bold text-left flex items-center justify-between transition-colors
          ${open ? 'border-[#A78BFA] ring-4 ring-[#A78BFA]/10' : 'border-[#F0EEF8]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#A78BFA] cursor-pointer'}`}
      >
        <span className={selected ? 'text-[#1A1A2E]' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[210]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#F0EEF8] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-[220] max-h-56 overflow-y-auto custom-scrollbar">
            <div
              className="px-4 py-3 text-sm text-gray-400 font-bold cursor-pointer hover:bg-gray-50"
              onClick={() => { onChange(''); setOpen(false); }}
            >
              {placeholder}
            </div>
            {options.map(opt => (
              <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors
                  ${value === opt.value ? 'bg-[#A78BFA] text-white' : 'text-[#1A1A2E] hover:bg-[#F0EEF8]'}`}>
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── File Upload Component ────────────────────────────────────────────────────

const FileUploader = ({
  file, onFileChange, onClear,
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
  onClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const isValidFile = (f: File) =>
    ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(f.type);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = file && file.type.startsWith('image/');

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
        Attachment <span className="text-gray-400 font-medium normal-case">(PDF or Image, max 10MB)</span>
      </label>
      {!file ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f && isValidFile(f)) onFileChange(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${dragOver ? 'border-[#A78BFA] bg-[#A78BFA]/5' : 'border-[#F0EEF8] hover:border-[#A78BFA]/50 hover:bg-[#FAFAFA]'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center">
            <Upload size={18} className="text-[#A78BFA]" />
          </div>
          <p className="text-sm font-bold text-[#1A1A2E]">Drop file here or <span className="text-[#A78BFA]">browse</span></p>
          <p className="text-xs text-gray-400 font-medium">Supports PDF, JPG, PNG, WEBP</p>
          <input
            ref={inputRef} type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f && isValidFile(f)) onFileChange(f);
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        <div className="border-2 border-[#A78BFA]/30 bg-[#A78BFA]/5 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#F0EEF8] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {isImage
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              : <FileText size={18} className="text-[#A78BFA]" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[#1A1A2E] truncate">{file.name}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {isImage ? 'Image' : 'PDF'} · {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button" onClick={onClear}
            className="p-1.5 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Program Group Card ───────────────────────────────────────────────────────

const ProgramGroupCard = ({
  groupLabel, levelName, exams, onDelete,
}: {
  groupLabel: string;
  levelName?: string;
  exams: Exam[];
  onDelete: (exam: Exam) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcomingCount = exams.filter(e =>
    e.examStartDate && new Date(e.examStartDate) >= today
  ).length;

  return (
    <Card className="overflow-visible">
      <div
        className="flex items-center justify-between p-5 cursor-pointer select-none bg-gradient-to-r from-[#F8F6FF] to-white border-b border-[#F0EEF8]"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
            <GraduationCap size={18} />
          </div>
          <div>
            {/* Program name + optional level pill on the same line */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-[#1A1A2E] text-base leading-tight">{groupLabel}</h3>
              {levelName && (
                <span className="px-2 py-0.5 rounded-lg bg-[#A78BFA]/10 text-[#7C3AED] text-[11px] font-black border border-[#A78BFA]/20">
                  {levelName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {exams.length} exam{exams.length !== 1 ? 's' : ''} · {upcomingCount} upcoming
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {upcomingCount > 0 && <Badge text={`${upcomingCount} upcoming`} color="#A78BFA" />}
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-[#F0EEF8]">
          {exams.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-400 font-medium">No exams found.</p>
            </div>
          ) : (
            exams.map(exam => {
              const today2 = new Date(); today2.setHours(0, 0, 0, 0);
              const isUpcoming = exam.examStartDate
                ? new Date(exam.examStartDate) >= today2
                : false;
              const statusColor = isUpcoming ? '#A78BFA' : '#4ECDC4';

              return (
                <div key={exam.id} className="p-5 flex items-start gap-4 group hover:bg-[#FAFAFA] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isUpcoming ? 'bg-[#A78BFA]/10 text-[#A78BFA]' : 'bg-[#4ECDC4]/10 text-[#4ECDC4]'}`}>
                    <FileText size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="font-black text-[#1A1A2E] text-sm group-hover:text-[#A78BFA] transition-colors">
                          {exam.examName}
                        </h4>
                        {/* Show level inside row only when the card groups multiple levels together */}
                        {exam.level && !levelName && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Layers size={11} className="text-gray-400" />
                            <span className="text-[11px] text-gray-500 font-bold">{exam.level.name}</span>
                          </div>
                        )}
                      </div>
                      <Badge text={isUpcoming ? "Upcoming" : "Completed"} color={statusColor} />
                    </div>

                    {exam.description && (
                      <p className="text-xs text-gray-500 mt-1.5 font-medium line-clamp-1">{exam.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                        <Calendar size={12} style={{ color: statusColor }} />
                        {exam.examStartDate
                          ? new Date(exam.examStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'TBA'}
                      </div>
                      {exam.examEndDate && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Clock size={12} className="opacity-50" />
                          Ends: {new Date(exam.examEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                      {exam.fileUrl && (
                        <a
                          href={exam.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs font-bold text-[#A78BFA] hover:underline"
                        >
                          {exam.fileType === "image" ? (
                            <Image size={11} />
                          ) : (
                            <FileText size={11} />
                          )}

                          {exam.fileName ??
                            (exam.fileType === "image" ? "View Image" : "View PDF")}

                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(exam)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
};

// ─── Main ExamsView ───────────────────────────────────────────────────────────

export default function ExamsView() {
  const [examsData, setExamsData] = useState<Exam[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [examForm, setExamForm] = useState({
    examName: '', examDate: '', examEndDate: '',
    description: '', programId: '', levelId: '',
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Derive selected program and its levels
  const selectedProgram = programs.find(p => p.id === examForm.programId);
  const availableLevels = selectedProgram?.levels ?? [];

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/programs");
      setPrograms(res?.programs ?? []);
    } catch { /* silent */ }
  }, []);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/exams");
      setExamsData(res ?? []);
    } catch {
      showToast("Failed to load exams", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPrograms(); fetchExams(); }, [fetchPrograms, fetchExams]);

  // ── Modal open ─────────────────────────────────────────────────────────────

  const handleOpenModal = () => {
    setExamForm({ examName: '', examDate: '', examEndDate: '', description: '', programId: '', levelId: '' });
    setAttachedFile(null);
    setUploadProgress(null);
    setIsModalOpen(true);
  };

  // ── Save exam ──────────────────────────────────────────────────────────────

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.examName.trim()) { showToast("Exam title is required", "error"); return; }
    if (!examForm.programId) { showToast("Please select a program", "error"); return; }

    // If program has levels, require a level selection
    if (availableLevels.length > 0 && !examForm.levelId) {
      showToast("Please select a class / level", "error");
      return;
    }

    setSubmitting(true);

    try {
      let fileUrl: string | undefined;
      let fileType: string | undefined;
      let fileName: string | undefined;
      let storagePath: string | undefined;

      if (attachedFile) {
        setUploadProgress("Uploading file...");
        const safeName = attachedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `exams/${Date.now()}_${safeName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('exam-files')
          .upload(path, attachedFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from('exam-files').getPublicUrl(uploadData.path);
        fileUrl = urlData.publicUrl;
        fileType = attachedFile.type.startsWith('image/') ? 'image' : 'pdf';
        fileName = attachedFile.name;
        storagePath = uploadData.path;
        setUploadProgress("Saving exam...");
      }

      await apiFetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examName: examForm.examName,
          description: examForm.description,
          examStartDate: examForm.examDate,
          examEndDate: examForm.examEndDate || undefined,
          programId: examForm.programId,
          levelId: examForm.levelId || undefined,
          fileUrl, fileType, fileName, storagePath,
        }),
      });

      showToast("Exam scheduled successfully! 📝");
      setIsModalOpen(false);
      fetchExams();
    } catch (err: any) {
      showToast(err.message || "Failed to schedule exam", "error");
    }

    setSubmitting(false);
    setUploadProgress(null);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const confirmDelete = (exam: Exam) => { setExamToDelete(exam); setIsDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!examToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/exams/${examToDelete.id}`, { method: "DELETE" });
      showToast("Exam deleted successfully");
      fetchExams();
      setIsDeleteModalOpen(false);
      setExamToDelete(null);
    } catch {
      showToast("Failed to delete exam", "error");
    }
    setSubmitting(false);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredExams = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return examsData.filter(e => {
      const matchesSearch =
        (e.examName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());

      const isUpcoming = e.examStartDate ? new Date(e.examStartDate) >= today : false;
      let matchesStatus = true;
      if (statusFilter === 'Upcoming') matchesStatus = isUpcoming;
      if (statusFilter === 'Completed') matchesStatus = !isUpcoming;

      const matchesProgram = programFilter === 'All' || e.program?.id === programFilter;
      return matchesSearch && matchesStatus && matchesProgram;
    }).sort((a, b) => {
      if (!a.examStartDate) return 1;
      if (!b.examStartDate) return -1;
      return new Date(a.examStartDate).getTime() - new Date(b.examStartDate).getTime();
    });
  }, [examsData, searchQuery, statusFilter, programFilter]);

  // ── Grouping — by program, then by level within each program ───────────────
  //
  //  Key format: "programId::levelId"  (levelId = "" when no level)
  //  This ensures Play School → Nursery and Play School → LKG are
  //  separate cards, while still showing a single card for programs
  //  that have no levels at all.

  const groupedExams = useMemo(() => {
    type GroupEntry = {
      groupLabel: string;
      levelName?: string;
      exams: Exam[];
    };
    const groups = new Map<string, GroupEntry>();

    filteredExams.forEach(exam => {
      const programName = exam.program?.name ?? 'No Program';
      const levelId = exam.level?.id ?? '';
      const levelName = exam.level?.name;
      const key = `${exam.program?.id ?? ''}::${levelId}`;

      if (!groups.has(key)) {
        groups.set(key, {
          groupLabel: programName,
          levelName,
          exams: [],
        });
      }
      groups.get(key)!.exams.push(exam);
    });

    // Sort: by program name first, then by level name
    return Array.from(groups.entries())
      .sort(([, a], [, b]) => {
        const prog = a.groupLabel.localeCompare(b.groupLabel);
        if (prog !== 0) return prog;
        return (a.levelName ?? '').localeCompare(b.levelName ?? '');
      });
  }, [filteredExams]);

  // ── Derived counts ─────────────────────────────────────────────────────────

  const totalUpcoming = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return examsData.filter(e => e.examStartDate && new Date(e.examStartDate) >= today).length;
  }, [examsData]);

  const programOptions = programs.map(p => ({ value: p.id, label: p.name }));
  const levelOptions = availableLevels.map(l => ({ value: l.id, label: l.name }));
  const programFilterOptions = [
    { value: 'All', label: 'All Programs' },
    ...programs.map(p => ({ value: p.id, label: p.name })),
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Exam Scheduler</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Schedule and manage exams per program & class.</p>
        </div>
        <GradientButton icon={Plus} onClick={handleOpenModal}>Schedule Exam</GradientButton>
      </div>

      {/* Stat Pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total', value: examsData.length, color: '#A78BFA' },
          { label: 'Upcoming', value: totalUpcoming, color: '#F59E0B' },
          { label: 'Completed', value: examsData.length - totalUpcoming, color: '#4ECDC4' },
          { label: 'Programs', value: programs.length, color: '#FF6B6B' },
        ].map(stat => (
          <div key={stat.label}
            style={{ borderColor: stat.color + '33', background: stat.color + '0D' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border">
            <span className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</span>
            <span className="text-xs font-bold text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="bg-[#FFFDF7]">
        <div className="p-5 flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Search exams..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/10 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            {programFilterOptions.map(opt => (
              <button key={opt.value} onClick={() => setProgramFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap
                  ${programFilter === opt.value
                    ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-2 border-[#A78BFA]/20'
                    : 'bg-white text-gray-500 border-2 border-[#F0EEF8] hover:border-[#A78BFA]/30 hover:text-[#A78BFA]'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {["All", "Upcoming", "Completed"].map(status => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                  ${statusFilter === status ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-500 border-2 border-[#F0EEF8] hover:border-gray-300'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grouped Exam List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="flex flex-col items-center justify-center h-64 text-[#A78BFA]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-bold text-gray-500">Loading exams...</p>
          </Card>
        ) : groupedExams.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">No exams found</p>
            <p className="text-sm mt-1 text-gray-500">Adjust your filters or schedule a new exam.</p>
          </Card>
        ) : (
          groupedExams.map(([key, { groupLabel, levelName, exams }]) => (
            <ProgramGroupCard
              key={key}
              groupLabel={groupLabel}
              levelName={levelName}
              exams={exams}
              onDelete={confirmDelete}
            />
          ))
        )}
      </div>

      {/* ── Add Exam Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title="Schedule New Exam">
        <form onSubmit={handleSaveExam} className="space-y-5">

          {/* Program */}
          <StyledSelect
            label="Program" required
            value={examForm.programId}
            onChange={v => setExamForm(f => ({ ...f, programId: v, levelId: '' }))}
            options={programOptions}
            placeholder="Select program..."
          />

          {/*
            ── KEY FIX ────────────────────────────────────────────────────────
            Show level/class selector whenever the selected program has any
            levels — regardless of the hasLevels flag. This matches how
            student creation works in ProgramSelector.
          */}
          {examForm.programId && availableLevels.length > 0 && (
            <StyledSelect
              label="Class / Sub-level"
              required={availableLevels.length > 0}
              value={examForm.levelId}
              onChange={v => setExamForm(f => ({ ...f, levelId: v }))}
              options={levelOptions}
              placeholder="Select class..."
              disabled={!examForm.programId}
            />
          )}

          {/* Hint when program has no levels */}
          {examForm.programId && availableLevels.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F0EEF8] rounded-xl">
              <Layers size={14} className="text-[#A78BFA] flex-shrink-0" />
              <p className="text-xs font-bold text-gray-500">
                This program has no sub-classes — the exam will apply to the entire program.
              </p>
            </div>
          )}

          {/* Exam Title */}
          <FormInput
            label="Exam Title" placeholder="e.g. Half-Yearly Mathematics" required
            value={examForm.examName}
            onChange={(v: string) => setExamForm(f => ({ ...f, examName: v }))}
          />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date" type="date" required
              value={examForm.examDate}
              onChange={(v: string) => setExamForm(f => ({ ...f, examDate: v }))}
            />
            <FormInput
              label="End Date (Optional)" type="date"
              value={examForm.examEndDate}
              onChange={(v: string) => setExamForm(f => ({ ...f, examEndDate: v }))}
            />
          </div>

          {/* Description */}
          <FormTextarea
            label="Description / Instructions"
            placeholder="e.g. Chapters 1–5. Bring geometry box. No calculators."
            value={examForm.description}
            onChange={(v: string) => setExamForm(f => ({ ...f, description: v }))}
          />

          {/* File Upload */}
          <FileUploader
            file={attachedFile}
            onFileChange={setAttachedFile}
            onClear={() => setAttachedFile(null)}
          />

          {uploadProgress && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#A78BFA]">
              <Loader2 size={14} className="animate-spin" />
              {uploadProgress}
            </div>
          )}

          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button
              type="button" onClick={() => setIsModalOpen(false)} disabled={submitting}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
              {submitting ? (uploadProgress ?? 'Saving...') : 'Schedule Exam'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !submitting && setIsDeleteModalOpen(false)} title="Confirm Action">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{examToDelete?.examName}"?</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              This will permanently remove the exam and its attachment. This cannot be undone.
            </p>
          </div>
          <div className="w-full flex gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-lg z-[201] animate-in slide-in-from-bottom-5
          ${toast.type === 'error' ? 'bg-[#FF6B6B]' : 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]'}`}>
          {toast.msg}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A78BFA44; border-radius: 6px; }
      `}} />
    </div>
  );
}