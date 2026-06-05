// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Trash2, 
//   X, 
//   AlertCircle,
//   Loader2,
//   CalendarDays,
//   Clock,
//   BookOpen,
//   User
// } from 'lucide-react';
// import { supabase } from "@/lib/helpers/supabaseClient";

// /**
//  * ==========================================
//  * API HELPER
//  * ==========================================
//  */
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

// /**
//  * ==========================================
//  * REUSABLE UI COMPONENTS (Ascento Theme)
//  * ==========================================
//  */
// const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className="", type="button", disabled }: any) => (
//   <button 
//     type={type}
//     onClick={onClick}
//     disabled={disabled}
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
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
//       <div 
//         className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 overflow-y-auto custom-scrollbar">
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
//     <input 
//       type={type} 
//       placeholder={placeholder} 
//       value={value ?? ""} 
//       onChange={e => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"
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
//       onChange={e => onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors appearance-none cursor-pointer"
//     >
//       <option value="">Select…</option>
//       {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
//     </select>
//   </div>
// );

// /**
//  * ==========================================
//  * MAIN SCHEDULE VIEW
//  * ==========================================
//  */
// export default function ScheduleView() {
//   const [scheduleData, setScheduleData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [dayFilter, setDayFilter] = useState('Monday');

//   // Modal & Form State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [slotToDelete, setSlotToDelete] = useState<any>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   const [scheduleForm, setScheduleForm] = useState<any>({
//     dayOfWeek: 'Monday',
//     periodNumber: '1'
//   });

//   const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const PERIOD_COLORS = ["#FF6B6B", "#4ECDC4", "#FFB347", "#A78BFA", "#F06292", "#45B7AA", "#7C3AED", "#FFD700"];

//   const showToast = (msg: string) => { 
//     setToast(msg); 
//     setTimeout(() => setToast(null), 3000); 
//   };

//   // --- API Integrations ---
//   const fetchSchedule = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch("/api/admin/schedule");
//       setScheduleData(res ?? []);
//     } catch { 
//       showToast("Failed to load schedule"); 
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     fetchSchedule();
//   }, [fetchSchedule]);

//   // --- Handlers ---
//   const handleOpenModal = () => {
//     setScheduleForm({
//       dayOfWeek: dayFilter !== 'All Days' ? dayFilter : 'Monday',
//       periodNumber: '1',
//       subjectName: '',
//       teacherName: '',
//       className: '',
//       sectionName: '',
//       startTime: '',
//       endTime: ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleSaveSlot = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!scheduleForm.subjectName || !scheduleForm.teacherName) { 
//       showToast("Subject and Teacher are required"); 
//       return; 
//     }

//     setSubmitting(true);
//     try {
//       await apiFetch("/api/admin/schedule", {
//         method: "POST",
//         body: JSON.stringify(scheduleForm),
//       });

//       showToast("Schedule slot added successfully! 📅");
//       setIsModalOpen(false);
//       fetchSchedule();
//     } catch (err: any) { 
//       showToast(err.message || "Failed to add schedule slot"); 
//     }
//     setSubmitting(false);
//   };

//   const confirmDelete = (slot: any) => {
//     setSlotToDelete(slot);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!slotToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/schedule/${slotToDelete.id}`, { method: "DELETE" });
//       showToast("Slot removed successfully");
//       fetchSchedule();
//       setIsDeleteModalOpen(false);
//       setSlotToDelete(null);
//     } catch {
//       showToast("Failed to remove slot");
//     }
//     setSubmitting(false);
//   };

//   // --- Local Filtering ---
//   const filteredSchedule = useMemo(() => {
//     return scheduleData.filter(s => {
//       // Search by subject or teacher
//       const subject = s.subject?.name || s.subjectName || '';
//       const teacher = s.teacher?.user?.name || s.teacherName || '';
//       const matchesSearch = subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             teacher.toLowerCase().includes(searchQuery.toLowerCase());

//       // Filter by day
//       const matchesDay = dayFilter === 'All Days' || s.dayOfWeek === dayFilter;

//       return matchesSearch && matchesDay;
//     }).sort((a, b) => parseInt(a.periodNumber) - parseInt(b.periodNumber)); // Sort by period
//   }, [scheduleData, searchQuery, dayFilter]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">

//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Class Timetable</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">Manage weekly schedules and teacher assignments.</p>
//         </div>
//         <GradientButton icon={Plus} onClick={handleOpenModal}>
//           Add Class Slot
//         </GradientButton>
//       </div>

//       {/* --- TOOLBAR --- */}
//       <Card className="bg-[#FFFDF7]">
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search subject or teacher..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/10 transition-all shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Day Pills */}
//         <div className="px-5 py-4 flex gap-3 overflow-x-auto no-scrollbar">
//           {["All Days", ...DAYS_OF_WEEK].map((day) => (
//             <button
//               key={day}
//               onClick={() => setDayFilter(day)}
//               className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
//                 dayFilter === day
//                   ? 'bg-[#A78BFA] text-white shadow-[0_4px_15px_rgba(167,139,250,0.3)] scale-105'
//                   : 'bg-white border border-[#F0EEF8] text-gray-500 hover:border-[#A78BFA]/50 hover:text-[#A78BFA]'
//               }`}
//             >
//               {day}
//             </button>
//           ))}
//         </div>
//       </Card>

//       {/* --- SCHEDULE LIST --- */}
//       <div className="space-y-4">
//         {loading ? (
//           <Card className="flex flex-col items-center justify-center h-64 text-[#A78BFA]">
//             <Loader2 className="animate-spin mb-4" size={32} />
//             <p className="text-sm font-bold text-gray-500">Loading timetable...</p>
//           </Card>
//         ) : filteredSchedule.length === 0 ? (
//           <Card className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//               <CalendarDays size={24} className="text-gray-300" />
//             </div>
//             <p className="text-base font-bold text-[#1A1A2E]">No classes scheduled</p>
//             <p className="text-sm mt-1 text-gray-500">Add some timetable slots to see them appear here.</p>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredSchedule.map((slot: any, i: number) => {
//               // Assign consistent color based on period number for visual hierarchy
//               const pNum = parseInt(slot.periodNumber) || i;
//               const color = PERIOD_COLORS[(pNum - 1) % PERIOD_COLORS.length] || PERIOD_COLORS[0];
//               const subject = slot.subject?.name || slot.subjectName || "—";
//               const teacher = slot.teacher?.user?.name || slot.teacherName || "—";
//               const className = slot.section?.class?.name || slot.className || "—";
//               const sectionName = slot.section?.name || slot.sectionName || "—";

//               return (
//                 <div 
//                   key={slot.id || i} 
//                   className="group relative bg-white rounded-2xl border border-[#F0EEF8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex"
//                 >
//                   {/* Color Accent Bar */}
//                   <div className="w-2 flex-shrink-0" style={{ backgroundColor: color }} />

//                   <div className="flex-1 p-5 relative">
//                     {/* Floating Delete Button */}
//                     <button 
//                       onClick={() => confirmDelete(slot)}
//                       className="absolute top-4 right-4 p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                     {/* Period & Time */}
//                     <div className="flex items-center gap-3 mb-4">
//                       <div 
//                         className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm"
//                         style={{ backgroundColor: `${color}15`, color: color }}
//                       >
//                         P{slot.periodNumber}
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{slot.dayOfWeek}</p>
//                         <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A2E]">
//                           <Clock size={12} className="text-gray-400" />
//                           {slot.startTime || '00:00'} - {slot.endTime || '00:00'}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Subject & Teacher */}
//                     <div className="mb-5 space-y-1">
//                       <h3 className="text-lg font-black text-[#1A1A2E] flex items-center gap-2">
//                         <BookOpen size={16} style={{ color }} /> {subject}
//                       </h3>
//                       <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
//                         <User size={14} className="text-gray-400" /> {teacher}
//                       </p>
//                     </div>

//                     {/* Class & Section Badges */}
//                     <div className="flex flex-wrap gap-2 pt-4 border-t border-[#F0EEF8]">
//                       <Badge text={`Class ${className}`} color={color} />
//                       <Badge text={`Section ${sectionName}`} color="#999" />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* --- ADD SLOT MODAL --- */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Class">
//         <form onSubmit={handleSaveSlot} className="space-y-6">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormSelect 
//               label="Day of Week" 
//               options={DAYS_OF_WEEK} 
//               required 
//               value={scheduleForm.dayOfWeek} 
//               onChange={(v: string) => setScheduleForm({ ...scheduleForm, dayOfWeek: v })} 
//             />
//             <FormSelect 
//               label="Period Number" 
//               options={["1", "2", "3", "4", "5", "6", "7", "8", "9"]} 
//               required 
//               value={scheduleForm.periodNumber} 
//               onChange={(v: string) => setScheduleForm({ ...scheduleForm, periodNumber: v })} 
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormInput 
//               label="Start Time" 
//               type="time" 
//               required 
//               value={scheduleForm.startTime} 
//               onChange={(v: string) => setScheduleForm({ ...scheduleForm, startTime: v })} 
//             />
//             <FormInput 
//               label="End Time" 
//               type="time" 
//               required 
//               value={scheduleForm.endTime} 
//               onChange={(v: string) => setScheduleForm({ ...scheduleForm, endTime: v })} 
//             />
//           </div>

//           <div className="space-y-4">
//             <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2 mt-2">Class Details</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormInput 
//                 label="Subject Name" 
//                 placeholder="e.g. Mathematics" 
//                 required 
//                 value={scheduleForm.subjectName} 
//                 onChange={(v: string) => setScheduleForm({ ...scheduleForm, subjectName: v })} 
//               />
//               <FormInput 
//                 label="Teacher Name" 
//                 placeholder="e.g. Mrs. Sharma" 
//                 required 
//                 value={scheduleForm.teacherName} 
//                 onChange={(v: string) => setScheduleForm({ ...scheduleForm, teacherName: v })} 
//               />
//               <FormInput 
//                 label="Class Name" 
//                 placeholder="e.g. X" 
//                 required 
//                 value={scheduleForm.className} 
//                 onChange={(v: string) => setScheduleForm({ ...scheduleForm, className: v })} 
//               />
//               <FormInput 
//                 label="Section" 
//                 placeholder="e.g. A" 
//                 required 
//                 value={scheduleForm.sectionName} 
//                 onChange={(v: string) => setScheduleForm({ ...scheduleForm, sectionName: v })} 
//               />
//             </div>
//           </div>

//           <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3 mt-8">
//             <button 
//               type="button" 
//               onClick={() => setIsModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
//               {submitting ? 'Saving...' : 'Add Slot'}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* --- DELETE CONFIRMATION MODAL --- */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Action">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove Schedule Slot?</h4>
//             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
//               Are you sure you want to remove Period {slotToDelete?.periodNumber} for {slotToDelete?.subjectName || slotToDelete?.subject?.name}? This action cannot be undone.
//             </p>
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
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] shadow-[0_4px_15px_rgba(255,107,107,0.3)] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
//             >
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Remove'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* --- LOCAL TOAST --- */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(167,139,250,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #A78BFA44; border-radius: 6px; }
//       `}}/>
//     </div>
//   );
// }










// 'use client';

// /**
//  * TimetableManager — wired to real API endpoints.
//  *
//  * Replaces local useState(DEMO_SLOTS) with live calls to:
//  *   scheduleApi  →  /api/admin/schedule
//  *   programsApi  →  /api/admin/programs
//  *   uploadsApi   →  /api/admin/timetable-uploads
//  *
//  * Drop this file in at the same path as before; the UI is unchanged.
//  */

// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle, Loader2,
//   CalendarDays, Clock, BookOpen, User, Download,
//   Upload, Eye, FileText, GraduationCap, Layers,
//   Image as ImageIcon, Check,
// } from 'lucide-react';

// import {
//   scheduleApi, programsApi, uploadsApi,
//   type ScheduleSlot, type Program, type TimetableUpload,
// } from '@/lib/api/timetable';

// // ─── CONSTANTS ──────────────────────────────────────────────────────────────
// const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// const PERIOD_COLORS = [
//   '#7C3AED','#F59E0B','#10B981','#EF4444',
//   '#3B82F6','#EC4899','#14B8A6','#F97316',
// ];

// // ─── TINY UI HELPERS (unchanged from original) ───────────────────────────────
// const Card = ({ children, className='' }: any) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>{children}</div>
// );

// const GradientBtn = ({ children, onClick, icon:Icon, className='', type='button', disabled }: any) => (
//   <button type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${!disabled?'hover:shadow-[0_8px_20px_rgba(167,139,250,0.3)] hover:-translate-y-0.5':''} ${className}`}>
//     {Icon && <Icon size={18} className={disabled?'animate-spin':''} />}{children}
//   </button>
// );

// const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm">
//       <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e=>e.stopPropagation()}>
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
//           <h3 className="text-xl font-black text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"><X size={20}/></button>
//         </div>
//         <div className="p-6 overflow-y-auto">{children}</div>
//       </div>
//     </div>
//   );
// };

// const FLabel = ({ label, required }: any) => (
//   <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
//     {label}{required && <span className="text-[#FF6B6B]"> *</span>}
//   </label>
// );
// const FInput = ({ label, type='text', placeholder, required, value, onChange }: any) => (
//   <div><FLabel label={label} required={required}/>
//     <input type={type} placeholder={placeholder} value={value??''} onChange={e=>onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"/>
//   </div>
// );
// const FSelect = ({ label, options, required, value, onChange }: any) => (
//   <div><FLabel label={label} required={required}/>
//     <select value={value??''} onChange={e=>onChange?.(e.target.value)}
//       className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors appearance-none cursor-pointer">
//       <option value="">Select…</option>
//       {options.map((o:any)=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
//     </select>
//   </div>
// );
// const Badge = ({ text, color='#A78BFA' }: any) => (
//   <span style={{ background:`${color}20`, color, border:`1px solid ${color}44` }}
//     className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
//     {text}
//   </span>
// );
// const Toast = ({ msg }: any) => msg ? (
//   <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(167,139,250,0.4)] z-[999]">{msg}</div>
// ) : null;

// // ─── PDF DOWNLOAD ────────────────────────────────────────────────────────────
// function downloadPDF(slots: ScheduleSlot[], progName?: string, levelName?: string) {
//   const rows = [...slots].sort((a,b)=>{
//     const d = DAYS.indexOf(a.dayOfWeek)-DAYS.indexOf(b.dayOfWeek);
//     return d!==0?d:a.periodNumber-b.periodNumber;
//   });
//   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Timetable</title>
// <style>body{font-family:Arial,sans-serif;padding:32px;color:#1A1A2E}h1{font-size:22px;margin:0}
// p.sub{color:#888;font-size:13px;margin:4px 0 24px}table{width:100%;border-collapse:collapse;font-size:13px}
// th{background:#7C3AED;color:#fff;padding:10px 14px;text-align:left}
// td{padding:9px 14px;border-bottom:1px solid #f0eef8}tr:nth-child(even)td{background:#FFFDF7}</style>
// </head><body>
// <h1>Class Timetable</h1>
// <p class="sub">${progName??'All Programs'}${levelName?` · ${levelName}`:''}</p>
// <table><thead><tr><th>Day</th><th>Period</th><th>Time</th><th>Subject</th><th>Teacher</th></tr></thead>
// <tbody>${rows.map(s=>`<tr><td>${s.dayOfWeek}</td><td>P${s.periodNumber}</td><td>${s.startTime}–${s.endTime}</td><td><strong>${s.subjectName}</strong></td><td>${s.teacherName}</td></tr>`).join('')}
// </tbody></table></body></html>`;
//   const win = window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank');
//   if (win) setTimeout(()=>win.print(), 600);
// }

// // ─── SLOT CARD ────────────────────────────────────────────────────────────────
// const SlotCard = ({ slot, onDelete }: { slot: ScheduleSlot; onDelete:(s:ScheduleSlot)=>void }) => {
//   const color = PERIOD_COLORS[(slot.periodNumber-1)%PERIOD_COLORS.length];
//   return (
//     <div className="group relative bg-white rounded-2xl border border-[#F0EEF8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex">
//       <div className="w-1.5 flex-shrink-0" style={{backgroundColor:color}}/>
//       <div className="flex-1 p-4 relative">
//         <button onClick={()=>onDelete(slot)}
//           className="absolute top-3 right-3 p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
//           <Trash2 size={14}/>
//         </button>
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base"
//             style={{backgroundColor:`${color}18`,color}}>P{slot.periodNumber}</div>
//           <div>
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{slot.dayOfWeek}</p>
//             <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A2E]">
//               <Clock size={10} className="text-gray-400"/>{slot.startTime}–{slot.endTime}
//             </div>
//           </div>
//         </div>
//         <h3 className="text-base font-black text-[#1A1A2E] flex items-center gap-2 mb-0.5">
//           <BookOpen size={14} style={{color}}/>{slot.subjectName}
//         </h3>
//         <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
//           <User size={12} className="text-gray-400"/>{slot.teacherName}
//         </p>
//         <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0EEF8]">
//           <Badge text={slot.program.name} color={color}/>
//           {slot.level && <Badge text={slot.level.name} color="#999"/>}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── MAIN ────────────────────────────────────────────────────────────────────
// export default function TimetableManager() {
//   const [slots, setSlots]             = useState<ScheduleSlot[]>([]);
//   const [programs, setPrograms]       = useState<Program[]>([]);
//   const [uploads, setUploads]         = useState<TimetableUpload[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [activeTab, setActiveTab]     = useState<'schedule'|'grid'|'upload'|'view'>('schedule');

//   // Filters
//   const [progFilter, setProgFilter]   = useState('');
//   const [levelFilter, setLevelFilter] = useState('');
//   const [dayFilter, setDayFilter]     = useState('All Days');
//   const [search, setSearch]           = useState('');

//   // Add modal
//   const [addOpen, setAddOpen]         = useState(false);
//   const [delTarget, setDelTarget]     = useState<ScheduleSlot|null>(null);
//   const [submitting, setSubmitting]   = useState(false);
//   const [form, setForm]               = useState<any>({});
//   const [toast, setToast]             = useState<string|null>(null);

//   // Upload
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [uploading, setUploading]     = useState(false);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

//   // ── Fetch ──────────────────────────────────────────────────────────────────
//   const fetchSlots = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params: any = {};
//       if (progFilter)              params.programId = progFilter;
//       if (levelFilter)             params.levelId   = levelFilter;
//       if (dayFilter!=='All Days')  params.dayOfWeek = dayFilter;
//       if (search)                  params.search    = search;
//       setSlots(await scheduleApi.list(params));
//     } catch { showToast('Failed to load slots'); }
//     setLoading(false);
//   }, [progFilter, levelFilter, dayFilter, search]);

//   useEffect(()=>{ fetchSlots(); }, [fetchSlots]);

//   useEffect(()=>{
//     programsApi.list().then(setPrograms).catch(()=>showToast('Failed to load programs'));
//   }, []);

//   const fetchUploads = useCallback(async () => {
//     try { setUploads(await uploadsApi.list()); }
//     catch { showToast('Failed to load uploads'); }
//   }, []);

//   useEffect(()=>{ if(activeTab==='view') fetchUploads(); }, [activeTab, fetchUploads]);

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const activeProg  = useMemo(()=>programs.find(p=>p.id===progFilter), [programs, progFilter]);
//   const levelOpts   = useMemo(()=>activeProg?.levels??[], [activeProg]);

//   const gridDays    = dayFilter==='All Days' ? DAYS : [dayFilter];
//   const maxPeriod   = slots.reduce((m,s)=>Math.max(m,s.periodNumber),0)||8;
//   const gridPeriods = Array.from({length:maxPeriod},(_,i)=>i+1);
//   const slotAt      = (day:string, p:number) => slots.find(s=>s.dayOfWeek===day&&s.periodNumber===p);

//   const TABS = [
//     { id:'schedule', label:'Timetable',            icon:CalendarDays },
//     { id:'grid',     label:'Grid',                 icon:Layers       },
//     { id:'upload',   label:'Upload',               icon:Upload       },
//     { id:'view',     label:`Uploads (${uploads.length})`, icon:Eye  },
//   ] as const;

//   // ── Handlers ───────────────────────────────────────────────────────────────
//   const openAdd = () => {
//     setForm({ programId:progFilter||'', levelId:levelFilter||'',
//       dayOfWeek: dayFilter!=='All Days'?dayFilter:'Monday', periodNumber:'1',
//       startTime:'', endTime:'', subjectName:'', teacherName:'', notes:'' });
//     setAddOpen(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.subjectName||!form.teacherName||!form.programId) { showToast('Fill required fields'); return; }
//     setSubmitting(true);
//     try {
//       await scheduleApi.create({ ...form, periodNumber: parseInt(form.periodNumber)||1, levelId: form.levelId||null });
//       showToast('Class slot added! 📅');
//       setAddOpen(false);
//       fetchSlots();
//     } catch (err: any) { showToast(err.message||'Failed to save'); }
//     setSubmitting(false);
//   };

//   const handleDelete = async () => {
//     if (!delTarget) return;
//     setSubmitting(true);
//     try {
//       await scheduleApi.remove(delTarget.id);
//       showToast('Slot removed');
//       setDelTarget(null);
//       fetchSlots();
//     } catch { showToast('Failed to remove'); }
//     setSubmitting(false);
//   };

//   const handleUpload = async (files: FileList|null) => {
//     if (!files?.length) return;
//     setUploading(true);
//     const meta = { programId: progFilter||undefined, levelId: levelFilter||undefined };
//     try {
//       await Promise.all([...files].map(f=>uploadsApi.upload(f, meta)));
//       showToast(`${files.length} file(s) uploaded 🗂️`);
//       setActiveTab('view');
//       fetchUploads();
//     } catch (err:any) { showToast(err.message||'Upload failed'); }
//     setUploading(false);
//   };

//   const handleRemoveUpload = async (id: string) => {
//     try {
//       await uploadsApi.remove(id);
//       setUploads(prev=>prev.filter(u=>u.id!==id));
//       showToast('Removed');
//     } catch { showToast('Failed to remove'); }
//   };

//   const handleProgChange = (pid: string) => {
//     const prog = programs.find(p=>p.id===pid);
//     setForm((f:any)=>({ ...f, programId:pid, levelId: prog?.levels?.[0]?.id||'' }));
//   };

//   // ── RENDER ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 relative">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2">
//             <GraduationCap className="text-[#A78BFA]" size={28}/> Class Timetable
//           </h2>
//           <p className="text-sm text-gray-500 mt-0.5 font-medium">Program-wise schedules, teacher assignments, PDF export.</p>
//         </div>
//         <div className="flex gap-3">
//           <button onClick={()=>downloadPDF(slots, activeProg?.name, levelFilter)}
//             className="border-2 border-[#A78BFA]/30 text-[#7C3AED] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#A78BFA]/8 transition-colors text-sm">
//             <Download size={16}/> Download PDF
//           </button>
//           <GradientBtn icon={Plus} onClick={openAdd}>Add Slot</GradientBtn>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="flex gap-2 bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-1.5">
//         {TABS.map(tab=>(
//           <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
//               activeTab===tab.id
//                 ? 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
//                 : 'text-gray-500 hover:text-[#7C3AED]'
//             }`}>
//             <tab.icon size={14}/>{tab.label}
//           </button>
//         ))}
//       </div>

//       {/* FILTERS */}
//       {(activeTab==='schedule'||activeTab==='grid') && (
//         <Card className="bg-[#FFFDF7]">
//           <div className="p-4 border-b border-[#F0EEF8] grid grid-cols-1 md:grid-cols-4 gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
//               <input type="text" placeholder="Search subject / teacher…" value={search} onChange={e=>setSearch(e.target.value)}
//                 className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] transition-all"/>
//             </div>
//             <select value={progFilter} onChange={e=>{ setProgFilter(e.target.value); setLevelFilter(''); }}
//               className="bg-white border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] appearance-none cursor-pointer">
//               <option value="">All Programs</option>
//               {programs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
//             </select>
//             <select value={levelFilter} onChange={e=>setLevelFilter(e.target.value)} disabled={!levelOpts.length}
//               className="bg-white border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] appearance-none cursor-pointer disabled:opacity-40">
//               <option value="">All Levels</option>
//               {levelOpts.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
//             </select>
//             <div className="flex items-center justify-end">
//               <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-2 rounded-xl">
//                 {loading ? '…' : `${slots.length} slot${slots.length!==1?'s':''}`}
//               </span>
//             </div>
//           </div>
//           <div className="px-4 py-3 flex gap-2 overflow-x-auto">
//             {['All Days',...DAYS].map(d=>(
//               <button key={d} onClick={()=>setDayFilter(d)}
//                 className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
//                   dayFilter===d ? 'bg-[#A78BFA] text-white shadow-[0_4px_12px_rgba(167,139,250,0.35)]'
//                     : 'bg-white border border-[#F0EEF8] text-gray-500 hover:border-[#A78BFA]/50 hover:text-[#A78BFA]'
//                 }`}>{d}</button>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* CARD VIEW */}
//       {activeTab==='schedule' && (
//         loading ? (
//           <Card className="flex flex-col items-center justify-center h-48 text-[#A78BFA]">
//             <Loader2 className="animate-spin mb-3" size={28}/><p className="text-sm font-bold text-gray-500">Loading…</p>
//           </Card>
//         ) : slots.length===0 ? (
//           <Card className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4"><CalendarDays size={22} className="text-gray-300"/></div>
//             <p className="text-base font-bold text-[#1A1A2E]">No classes scheduled</p>
//             <p className="text-sm mt-1 text-gray-500">Add slots using the button above.</p>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//             {slots.map(s=><SlotCard key={s.id} slot={s} onDelete={setDelTarget}/>)}
//           </div>
//         )
//       )}

//       {/* GRID VIEW */}
//       {activeTab==='grid' && (
//         <Card>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr>
//                   <th className="bg-[#7C3AED] text-white text-left px-4 py-3 text-xs font-black uppercase tracking-wider">Period</th>
//                   {gridDays.map(d=><th key={d} className="bg-[#7C3AED] text-white text-left px-4 py-3 text-xs font-black uppercase tracking-wider">{d}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {gridPeriods.map(p=>(
//                   <tr key={p} className="border-b border-[#F0EEF8] even:bg-[#FFFDF7]">
//                     <td className="px-4 py-3 font-black text-[#A78BFA] text-xs">P{p}</td>
//                     {gridDays.map(d=>{
//                       const s=slotAt(d,p);
//                       const color=s?PERIOD_COLORS[(s.periodNumber-1)%PERIOD_COLORS.length]:null;
//                       return (
//                         <td key={d} className="px-3 py-2 min-w-[140px]">
//                           {s?(
//                             <div className="rounded-xl p-2.5 border" style={{background:`${color}12`,borderColor:`${color}30`}}>
//                               <p className="font-black text-[11px]" style={{color}}>{s.subjectName}</p>
//                               <p className="text-[10px] text-gray-500 font-medium mt-0.5">{s.teacherName}</p>
//                               <p className="text-[9px] text-gray-400 mt-1">{s.startTime}–{s.endTime}</p>
//                             </div>
//                           ):(
//                             <div className="rounded-xl p-2.5 border border-dashed border-[#F0EEF8] flex items-center justify-center">
//                               <span className="text-[10px] text-gray-300 font-bold">Free</span>
//                             </div>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* UPLOAD TAB */}
//       {activeTab==='upload' && (
//         <Card>
//           <div
//             onDragOver={e=>e.preventDefault()}
//             onDrop={e=>{ e.preventDefault(); handleUpload(e.dataTransfer.files); }}
//             onClick={()=>fileInputRef.current?.click()}
//             className="m-4 border-2 border-dashed border-[#A78BFA]/40 rounded-2xl flex flex-col items-center justify-center py-16 px-8 cursor-pointer hover:border-[#A78BFA] hover:bg-[#A78BFA]/4 transition-all text-center group">
//             {uploading
//               ? <Loader2 className="animate-spin text-[#A78BFA] mb-4" size={36}/>
//               : <div className="w-16 h-16 bg-[#A78BFA]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <Upload size={28} className="text-[#A78BFA]"/>
//                 </div>
//             }
//             <p className="text-base font-black text-[#1A1A2E]">{uploading?'Uploading…':'Drop timetable image or PDF here'}</p>
//             {!uploading && <p className="text-sm text-gray-500 mt-1">or click to browse files</p>}
//             <div className="flex gap-3 mt-4">
//               <Badge text="JPG / PNG" color="#10B981"/>
//               <Badge text="PDF" color="#A78BFA"/>
//             </div>
//           </div>
//           <input ref={fileInputRef} type="file" accept="image/*,application/pdf" multiple
//             className="hidden" onChange={e=>handleUpload(e.target.files)}/>
//         </Card>
//       )}

//       {/* VIEW UPLOADS */}
//       {activeTab==='view' && (
//         uploads.length===0 ? (
//           <Card className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Eye size={22} className="text-gray-300"/></div>
//             <p className="text-base font-bold text-[#1A1A2E]">No files uploaded yet</p>
//             <button onClick={()=>setActiveTab('upload')} className="mt-4 text-sm font-bold text-[#A78BFA] hover:underline">Go to Upload →</button>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {uploads.map(u=>(
//               <div key={u.id} className="relative rounded-2xl border border-[#F0EEF8] overflow-hidden bg-white shadow-sm">
//                 <button onClick={()=>handleRemoveUpload(u.id)}
//                   className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-[#F0EEF8]">
//                   <X size={14}/>
//                 </button>
//                 {u.mimeType.startsWith('image/') && <img src={u.url} alt={u.originalName} className="w-full object-contain max-h-[60vh]"/>}
//                 {u.mimeType==='application/pdf' && <iframe src={u.url} title={u.originalName} className="w-full h-[60vh] border-0"/>}
//                 <div className="px-4 py-2 bg-[#FFFDF7] border-t border-[#F0EEF8] flex items-center gap-2">
//                   {u.mimeType.startsWith('image/')
//                     ? <ImageIcon size={14} className="text-[#A78BFA]"/>
//                     : <FileText  size={14} className="text-[#A78BFA]"/>
//                   }
//                   <span className="text-xs font-bold text-gray-600 truncate">{u.originalName}</span>
//                   <span className="text-[10px] text-gray-400 ml-auto">{Math.round(u.size/1024)}KB</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//       )}

//       {/* ADD MODAL */}
//       <Modal isOpen={addOpen} onClose={()=>setAddOpen(false)} title="Schedule New Class">
//         <form onSubmit={handleSave} className="space-y-5">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FSelect label="Program" required options={programs.map(p=>({value:p.id,label:p.name}))}
//               value={form.programId} onChange={handleProgChange}/>
//             {levelOpts.length>0
//               ? <FSelect label="Level" options={levelOpts.map(l=>({value:l.id,label:l.name}))} value={form.levelId} onChange={(v:string)=>setForm((f:any)=>({...f,levelId:v}))}/>
//               : <FInput  label="Level / Class" placeholder="e.g. Batch A" value={form.levelId} onChange={(v:string)=>setForm((f:any)=>({...f,levelId:v}))}/>
//             }
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FSelect label="Day" required options={DAYS} value={form.dayOfWeek} onChange={(v:string)=>setForm((f:any)=>({...f,dayOfWeek:v}))}/>
//             <FSelect label="Period" required options={['1','2','3','4','5','6','7','8','9']}
//               value={form.periodNumber} onChange={(v:string)=>setForm((f:any)=>({...f,periodNumber:v}))}/>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FInput label="Start Time" type="time" required value={form.startTime} onChange={(v:string)=>setForm((f:any)=>({...f,startTime:v}))}/>
//             <FInput label="End Time"   type="time" required value={form.endTime}   onChange={(v:string)=>setForm((f:any)=>({...f,endTime:v}))}/>
//           </div>
//           <div className="pt-2 border-t border-[#F0EEF8]">
//             <p className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA] mb-3">Class Details</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FInput label="Subject" placeholder="e.g. Mathematics" required value={form.subjectName} onChange={(v:string)=>setForm((f:any)=>({...f,subjectName:v}))}/>
//               <FInput label="Teacher" placeholder="e.g. Mrs. Sharma"  required value={form.teacherName} onChange={(v:string)=>setForm((f:any)=>({...f,teacherName:v}))}/>
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEF8]">
//             <button type="button" onClick={()=>setAddOpen(false)}
//               className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm">Cancel</button>
//             <GradientBtn type="submit" icon={submitting?Loader2:Check} disabled={submitting}>
//               {submitting?'Saving…':'Add Slot'}
//             </GradientBtn>
//           </div>
//         </form>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal isOpen={!!delTarget} onClose={()=>setDelTarget(null)} title="Confirm Remove">
//         <div className="flex flex-col items-center text-center space-y-4 py-2">
//           <div className="w-14 h-14 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={28}/></div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove this slot?</h4>
//             <p className="text-sm text-gray-500 mt-1.5">Period {delTarget?.periodNumber} — <strong>{delTarget?.subjectName}</strong> with {delTarget?.teacherName}</p>
//           </div>
//           <div className="w-full flex gap-3 pt-2">
//             <button onClick={()=>setDelTarget(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting?<Loader2 size={16} className="animate-spin"/>:'Yes, Remove'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Toast msg={toast}/>
//     </div>
//   );
// }













'use client';

/**
 * TimetableManager — fully wired to real API endpoints.
 *
 * API routes:
 *   GET/POST  /api/admin/schedule
 *   DELETE    /api/admin/schedule/[id]
 *   GET       /api/admin/programs
 *   GET/POST  /api/admin/timetable-uploads
 *   POST      /api/admin/timetable-uploads/sign   ← signed upload URL
 *   DELETE    /api/admin/timetable-uploads/[id]
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle, Loader2,
  CalendarDays, Clock, BookOpen, User, Download,
  Upload, Eye, FileText, GraduationCap, Layers,
  Image as ImageIcon, Check, ChevronDown, Filter,
} from 'lucide-react';

import {
  scheduleApi, programsApi, uploadsApi,
  type ScheduleSlot, type Program, type TimetableUpload,
} from '@/lib/api/timetable';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PERIOD_COLORS = [
  '#7C3AED', '#F59E0B', '#10B981', '#EF4444',
  '#3B82F6', '#EC4899', '#14B8A6', '#F97316',
];

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
};

// ─── TINY UI HELPERS ──────────────────────────────────────────────────────────

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const GradientBtn = ({
  children, onClick, icon: Icon, className = '', type = 'button', disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(167,139,250,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const Modal = ({
  isOpen, onClose, title, children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
          <h3 className="text-xl font-black text-[#1A1A2E]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const FLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
    {label}{required && <span className="text-[#FF6B6B]"> *</span>}
  </label>
);

const FInput = ({
  label, type = 'text', placeholder, required, value, onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) => (
  <div>
    <FLabel label={label} required={required} />
    <input
      type={type}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"
    />
  </div>
);

const FSelect = ({
  label, options, required, value, onChange, disabled,
}: {
  label: string;
  options: { value: string; label: string }[] | string[];
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <FLabel label={label} required={required} />
    <select
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors appearance-none cursor-pointer disabled:opacity-40"
    >
      <option value="">Select…</option>
      {(options as any[]).map((o: any) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  </div>
);

const FTextarea = ({
  label, placeholder, value, onChange,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) => (
  <div>
    <FLabel label={label} />
    <textarea
      placeholder={placeholder}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      rows={3}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors resize-none"
    />
  </div>
);

const Badge = ({ text, color = '#A78BFA' }: { text: string; color?: string }) => (
  <span
    style={{ background: `${color}20`, color, border: `1px solid ${color}44` }}
    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
  >
    {text}
  </span>
);

const Toast = ({ msg }: { msg: string | null }) =>
  msg ? (
    <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(167,139,250,0.4)] z-[999] animate-in slide-in-from-bottom-4">
      {msg}
    </div>
  ) : null;

// ─── PDF DOWNLOAD (client-side print) ────────────────────────────────────────
function downloadPDF(slots: ScheduleSlot[], progName?: string, levelName?: string) {
  const rows = [...slots].sort((a, b) => {
    const d = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
    return d !== 0 ? d : a.periodNumber - b.periodNumber;
  });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Timetable — ${progName ?? 'All'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1A1A2E; background: #fff; }
  .header { border-bottom: 3px solid #7C3AED; padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 24px; font-weight: 900; color: #7C3AED; }
  .sub { color: #888; font-size: 13px; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #7C3AED; color: #fff; padding: 11px 16px; text-align: left; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
  td { padding: 10px 16px; border-bottom: 1px solid #F0EEF8; vertical-align: middle; }
  tr:nth-child(even) td { background: #FFFDF7; }
  .period { background: #7C3AED22; color: #7C3AED; font-weight: 900; border-radius: 6px; padding: 2px 7px; font-size: 11px; }
  .subject { font-weight: 800; color: #1A1A2E; }
  .teacher { color: #888; font-size: 12px; }
  @media print { body { padding: 20px; } }
</style></head>
<body>
  <div class="header">
    <h1>📅 Class Timetable</h1>
    <p class="sub">${progName ?? 'All Programs'}${levelName ? ` · ${levelName}` : ''} · Generated ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
  </div>
  <table>
    <thead>
      <tr><th>Day</th><th>Period</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Notes</th></tr>
    </thead>
    <tbody>
      ${rows.map(s => `
      <tr>
        <td><strong>${s.dayOfWeek}</strong></td>
        <td><span class="period">P${s.periodNumber}</span></td>
        <td>${s.startTime}–${s.endTime}</td>
        <td><span class="subject">${s.subjectName}</span></td>
        <td class="teacher">${s.teacherName}</td>
        <td class="teacher">${s.notes ?? '—'}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</body></html>`;

  const win = window.open(
    URL.createObjectURL(new Blob([html], { type: 'text/html' })),
    '_blank',
  );
  if (win) setTimeout(() => win.print(), 700);
}

// ─── SLOT CARD ────────────────────────────────────────────────────────────────
const SlotCard = ({
  slot, onDelete,
}: {
  slot: ScheduleSlot;
  onDelete: (s: ScheduleSlot) => void;
}) => {
  const color = PERIOD_COLORS[(slot.periodNumber - 1) % PERIOD_COLORS.length];
  return (
    <div className="group relative bg-white rounded-2xl border border-[#F0EEF8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-200 overflow-hidden flex">
      <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 p-4 relative">
        <button
          onClick={() => onDelete(slot)}
          className="absolute top-3 right-3 p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>

        {/* Period + Day */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ backgroundColor: `${color}18`, color }}
          >
            P{slot.periodNumber}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              {slot.dayOfWeek}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A2E]">
              <Clock size={10} className="text-gray-400" />
              {slot.startTime}–{slot.endTime}
            </div>
          </div>
        </div>

        {/* Subject + Teacher */}
        <h3 className="text-base font-black text-[#1A1A2E] flex items-center gap-2 mb-0.5 pr-6">
          <BookOpen size={13} style={{ color, flexShrink: 0 }} />
          {slot.subjectName}
        </h3>
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
          <User size={12} className="text-gray-400 flex-shrink-0" />
          {slot.teacherName}
        </p>

        {/* Notes */}
        {slot.notes && (
          <p className="text-[11px] text-gray-400 italic mb-3 border-l-2 pl-2" style={{ borderColor: `${color}50` }}>
            {slot.notes}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0EEF8]">
          <Badge text={slot.program.name} color={color} />
          {slot.level && <Badge text={slot.level.name} color="#999" />}
        </div>
      </div>
    </div>
  );
};

// ─── STATS BAR ────────────────────────────────────────────────────────────────
const StatsBar = ({ slots }: { slots: ScheduleSlot[] }) => {
  const uniqueSubjects = new Set(slots.map(s => s.subjectName)).size;
  const uniqueTeachers = new Set(slots.map(s => s.teacherName)).size;
  const stats = [
    { label: 'Total Slots', value: slots.length, icon: CalendarDays, color: '#7C3AED' },
    { label: 'Subjects', value: uniqueSubjects, icon: BookOpen, color: '#10B981' },
    { label: 'Teachers', value: uniqueTeachers, icon: User, color: '#F59E0B' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-[#F0EEF8] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${s.color}15` }}>
            <s.icon size={18} style={{ color: s.color }} />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1A1A2E] leading-none">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── FORM STATE TYPE ──────────────────────────────────────────────────────────
interface SlotForm {
  programId: string;
  levelId: string;
  dayOfWeek: string;
  periodNumber: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  notes: string;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TimetableManager() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [uploads, setUploads] = useState<TimetableUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'grid' | 'upload' | 'view'>('schedule');

  // Filters
  const [progFilter, setProgFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('All Days');
  const [search, setSearch] = useState('');

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<ScheduleSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<SlotForm>({
    programId: '', levelId: '', dayOfWeek: 'Monday', periodNumber: '1',
    startTime: '', endTime: '', subjectName: '', teacherName: '', notes: '',
  });
  const [toast, setToast] = useState<string | null>(null);

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (progFilter) params.programId = progFilter;
      if (levelFilter) params.levelId = levelFilter;
      if (dayFilter !== 'All Days') params.dayOfWeek = dayFilter;
      if (search) params.search = search;
      setSlots(await scheduleApi.list(params));
    } catch {
      showToast('Failed to load slots');
    }
    setLoading(false);
  }, [progFilter, levelFilter, dayFilter, search]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  useEffect(() => {
    programsApi.list()
      .then(setPrograms)
      .catch(() => showToast('Failed to load programs'));
  }, []);

  const fetchUploads = useCallback(async () => {
    try { setUploads(await uploadsApi.list()); }
    catch { showToast('Failed to load uploads'); }
  }, []);

  useEffect(() => {
    if (activeTab === 'view') fetchUploads();
  }, [activeTab, fetchUploads]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeProg = useMemo(() => programs.find(p => p.id === progFilter), [programs, progFilter]);
  const levelOpts = useMemo(() => activeProg?.levels ?? [], [activeProg]);
  const formProg = useMemo(() => programs.find(p => p.id === form.programId), [programs, form.programId]);
  const formLevels = useMemo(() => formProg?.levels ?? [], [formProg]);

  const gridDays = dayFilter === 'All Days' ? DAYS : [dayFilter];
  const maxPeriod = Math.max(slots.reduce((m, s) => Math.max(m, s.periodNumber), 0), 8);
  const gridPeriods = Array.from({ length: maxPeriod }, (_, i) => i + 1);
  const slotAt = (day: string, p: number) =>
    slots.find(s => s.dayOfWeek === day && s.periodNumber === p);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({
      programId: progFilter || '',
      levelId: levelFilter || '',
      dayOfWeek: dayFilter !== 'All Days' ? dayFilter : 'Monday',
      periodNumber: '1',
      startTime: '', endTime: '',
      subjectName: '', teacherName: '', notes: '',
    });
    setAddOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectName || !form.teacherName || !form.programId) {
      showToast('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await scheduleApi.create({
        programId: form.programId,
        levelId: form.levelId || null,
        dayOfWeek: form.dayOfWeek,
        periodNumber: parseInt(form.periodNumber) || 1,
        startTime: form.startTime,
        endTime: form.endTime,
        subjectName: form.subjectName,
        teacherName: form.teacherName,
        notes: form.notes || undefined,
      });
      showToast('Class slot added! 📅');
      setAddOpen(false);
      fetchSlots();
    } catch (err: any) {
      showToast(err.message || 'Failed to save');
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setSubmitting(true);
    try {
      await scheduleApi.remove(delTarget.id);
      showToast('Slot removed');
      setDelTarget(null);
      fetchSlots();
    } catch {
      showToast('Failed to remove');
    }
    setSubmitting(false);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const meta = {
      programId: progFilter || undefined,
      levelId: levelFilter || undefined,
    };
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}…`);
        await uploadsApi.upload(files[i], meta);
      }
      showToast(`${files.length} file(s) uploaded 🗂️`);
      setActiveTab('view');
      fetchUploads();
    } catch (err: any) {
      showToast(err.message || 'Upload failed');
    }
    setUploading(false);
    setUploadProgress('');
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveUpload = async (id: string) => {
    try {
      await uploadsApi.remove(id);
      setUploads(prev => prev.filter(u => u.id !== id));
      showToast('Removed');
    } catch {
      showToast('Failed to remove');
    }
  };

  const setF = (key: keyof SlotForm) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }));

  const handleProgChange = (pid: string) => {
    const prog = programs.find(p => p.id === pid);
    setForm(f => ({
      ...f,
      programId: pid,
      levelId: prog?.levels?.[0]?.id || '',
    }));
  };

  // ── TABS ───────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'schedule' as const, label: 'Timetable', icon: CalendarDays },
    { id: 'grid' as const, label: 'Grid View', icon: Layers },
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'view' as const, label: `Files (${uploads.length})`, icon: Eye },
  ];

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 relative">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2">
            <GraduationCap className="text-[#A78BFA]" size={28} />
            Class Timetable
          </h2>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">
            Program-wise schedules · Teacher assignments · PDF export
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => downloadPDF(slots, activeProg?.name, levelOpts.find(l => l.id === levelFilter)?.name)}
            className="border-2 border-[#A78BFA]/30 text-[#7C3AED] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#A78BFA]/8 transition-colors text-sm"
          >
            <Download size={16} /> PDF
          </button>
          <GradientBtn icon={Plus} onClick={openAdd}>Add Slot</GradientBtn>
        </div>
      </div>

      {/* STATS */}
      {!loading && slots.length > 0 && <StatsBar slots={slots} />}

      {/* TABS */}
      <div className="flex gap-2 bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-1.5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                : 'text-gray-500 hover:text-[#7C3AED]'
              }`}
          >
            <tab.icon size={14} />{tab.label}
          </button>
        ))}
      </div>

      {/* FILTERS (schedule + grid) */}
      {(activeTab === 'schedule' || activeTab === 'grid') && (
        <Card className="bg-[#FFFDF7]">
          <div className="p-4 border-b border-[#F0EEF8] grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search subject / teacher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] transition-all"
              />
            </div>

            {/* Program filter */}
            <select
              value={progFilter}
              onChange={e => { setProgFilter(e.target.value); setLevelFilter(''); }}
              className="bg-white border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] appearance-none cursor-pointer"
            >
              <option value="">All Programs</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Level filter */}
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              disabled={!levelOpts.length}
              className="bg-white border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] appearance-none cursor-pointer disabled:opacity-40"
            >
              <option value="">All Levels</option>
              {levelOpts.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>

            {/* Slot count */}
            <div className="flex items-center justify-end">
              <span className="text-xs font-black text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-2 rounded-xl">
                {loading ? '…' : `${slots.length} slot${slots.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Day pills */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {['All Days', ...DAYS].map(d => (
              <button
                key={d}
                onClick={() => setDayFilter(d)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${dayFilter === d
                    ? 'bg-[#A78BFA] text-white shadow-[0_4px_12px_rgba(167,139,250,0.35)]'
                    : 'bg-white border border-[#F0EEF8] text-gray-500 hover:border-[#A78BFA]/50 hover:text-[#A78BFA]'
                  }`}
              >
                {d === 'All Days' ? d : DAY_SHORT[d]}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* ── CARD VIEW ─────────────────────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        loading ? (
          <Card className="flex flex-col items-center justify-center h-48 text-[#A78BFA]">
            <Loader2 className="animate-spin mb-3" size={28} />
            <p className="text-sm font-bold text-gray-500">Loading schedule…</p>
          </Card>
        ) : slots.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CalendarDays size={22} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">No classes scheduled</p>
            <p className="text-sm mt-1 text-gray-500">Add slots using the button above.</p>
            <GradientBtn icon={Plus} onClick={openAdd} className="mt-5">
              Add First Slot
            </GradientBtn>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {slots.map(s => (
              <SlotCard key={s.id} slot={s} onDelete={setDelTarget} />
            ))}
          </div>
        )
      )}

      {/* ── GRID VIEW ─────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#7C3AED] text-white text-left px-4 py-3 text-xs font-black uppercase tracking-wider sticky left-0 z-10">
                    Period
                  </th>
                  {gridDays.map(d => (
                    <th key={d} className="bg-[#7C3AED] text-white text-left px-4 py-3 text-xs font-black uppercase tracking-wider min-w-[150px]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gridPeriods.map(p => (
                  <tr key={p} className="border-b border-[#F0EEF8] even:bg-[#FFFDF7]">
                    <td className="px-4 py-3 font-black text-[#A78BFA] text-xs sticky left-0 bg-inherit">
                      P{p}
                    </td>
                    {gridDays.map(d => {
                      const s = slotAt(d, p);
                      const color = s ? PERIOD_COLORS[(s.periodNumber - 1) % PERIOD_COLORS.length] : null;
                      return (
                        <td key={d} className="px-3 py-2">
                          {s ? (
                            // <div
                            //   className="rounded-xl p-2.5 border"
                            //   style={{ background: `${color}12`, borderColor: `${color}30` }}
                            // >
                            //   <p className="font-black text-[11px] leading-tight" style={{ color }}>
                            //     {s.subjectName}
                            //   </p>
                            //   <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                            //     {s.teacherName}
                            //   </p>
                            //   <p className="text-[9px] text-gray-400 mt-1">
                            //     {s.startTime}–{s.endTime}
                            //   </p>
                            // </div>
                            <div
                              className="rounded-xl p-2.5 border"
                              style={{
                                background: `${color || "#6366f1"}12`,
                                borderColor: `${color || "#6366f1"}30`,
                              }}
                            >
                              <p
                                className="font-black text-[11px] leading-tight"
                                style={{ color: color || "#6366f1" }}
                              >
                                {s.subjectName}
                              </p>

                              <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                                {s.teacherName}
                              </p>

                              <p className="text-[9px] text-gray-400 mt-1">
                                {s.startTime}–{s.endTime}
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-xl p-2.5 border border-dashed border-[#F0EEF8] flex items-center justify-center min-h-[52px]">
                              <span className="text-[10px] text-gray-300 font-bold">Free</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── UPLOAD TAB ────────────────────────────────────────────────────────── */}
      {activeTab === 'upload' && (
        <Card>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`m-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 px-8 transition-all text-center group
              ${uploading
                ? 'border-[#A78BFA] bg-[#A78BFA]/4 cursor-default'
                : 'border-[#A78BFA]/40 cursor-pointer hover:border-[#A78BFA] hover:bg-[#A78BFA]/4'
              }`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin text-[#A78BFA] mb-4" size={36} />
                <p className="text-base font-black text-[#1A1A2E]">{uploadProgress}</p>
                <p className="text-sm text-gray-500 mt-1">Please wait…</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-[#A78BFA]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={28} className="text-[#A78BFA]" />
                </div>
                <p className="text-base font-black text-[#1A1A2E]">Drop timetable files here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                <div className="flex gap-3 mt-4">
                  <Badge text="JPG / PNG" color="#10B981" />
                  <Badge text="PDF" color="#A78BFA" />
                  <Badge text="Max 20 MB" color="#F59E0B" />
                </div>
                {(progFilter || levelFilter) && (
                  <p className="text-xs text-[#A78BFA] font-bold mt-3 bg-[#A78BFA]/8 px-4 py-1.5 rounded-full">
                    Will be tagged to: {activeProg?.name ?? 'selected program'}
                    {levelOpts.find(l => l.id === levelFilter)?.name
                      ? ` · ${levelOpts.find(l => l.id === levelFilter)?.name}`
                      : ''}
                  </p>
                )}
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
        </Card>
      )}

      {/* ── VIEW UPLOADS ──────────────────────────────────────────────────────── */}
      {activeTab === 'view' && (
        uploads.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Eye size={22} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">No files uploaded yet</p>
            <button
              onClick={() => setActiveTab('upload')}
              className="mt-4 text-sm font-bold text-[#A78BFA] hover:underline"
            >
              Go to Upload →
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploads.map(u => (
              <div key={u.id} className="relative rounded-2xl border border-[#F0EEF8] overflow-hidden bg-white shadow-sm group">
                <button
                  onClick={() => handleRemoveUpload(u.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-[#F0EEF8] opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>

                {u.mimeType.startsWith('image/') && (
                  <img
                    src={u.url}
                    alt={u.originalName}
                    className="w-full object-contain max-h-[60vh]"
                  />
                )}
                {u.mimeType === 'application/pdf' && (
                  <iframe
                    src={u.url}
                    title={u.originalName}
                    className="w-full h-[60vh] border-0"
                  />
                )}

                <div className="px-4 py-3 bg-[#FFFDF7] border-t border-[#F0EEF8] flex items-center gap-2">
                  {u.mimeType.startsWith('image/')
                    ? <ImageIcon size={14} className="text-[#A78BFA] flex-shrink-0" />
                    : <FileText size={14} className="text-[#A78BFA] flex-shrink-0" />
                  }
                  <span className="text-xs font-bold text-gray-600 truncate flex-1">
                    {u.originalName}
                  </span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {Math.round(u.size / 1024)} KB
                  </span>
                  <a
                    href={u.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-shrink-0 text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                    title="Open in new tab"
                  >
                    <Eye size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── ADD MODAL ─────────────────────────────────────────────────────────── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Schedule New Class">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Program + Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSelect
              label="Program"
              required
              options={programs.map(p => ({ value: p.id, label: p.name }))}
              value={form.programId}
              onChange={handleProgChange}
            />
            {formLevels.length > 0 ? (
              <FSelect
                label="Level / Class"
                options={formLevels.map(l => ({ value: l.id, label: l.name }))}
                value={form.levelId}
                onChange={setF('levelId')}
              />
            ) : (
              <FInput
                label="Level / Class"
                placeholder="e.g. Batch A (optional)"
                value={form.levelId}
                onChange={setF('levelId')}
              />
            )}
          </div>

          {/* Day + Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSelect
              label="Day"
              required
              options={DAYS.map(d => ({ value: d, label: d }))}
              value={form.dayOfWeek}
              onChange={setF('dayOfWeek')}
            />
            <FSelect
              label="Period"
              required
              options={['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => ({ value: n, label: `Period ${n}` }))}
              value={form.periodNumber}
              onChange={setF('periodNumber')}
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FInput label="Start Time" type="time" required value={form.startTime} onChange={setF('startTime')} />
            <FInput label="End Time" type="time" required value={form.endTime} onChange={setF('endTime')} />
          </div>

          {/* Subject + Teacher */}
          <div className="pt-2 border-t border-[#F0EEF8]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA] mb-3">
              Class Details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FInput
                label="Subject"
                placeholder="e.g. Mathematics"
                required
                value={form.subjectName}
                onChange={setF('subjectName')}
              />
              <FInput
                label="Teacher"
                placeholder="e.g. Mrs. Sharma"
                required
                value={form.teacherName}
                onChange={setF('teacherName')}
              />
            </div>
          </div>

          {/* Notes */}
          <FTextarea
            label="Notes (optional)"
            placeholder="e.g. Bring textbook, Lab session…"
            value={form.notes}
            onChange={setF('notes')}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EEF8]">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <GradientBtn type="submit" icon={submitting ? Loader2 : Check} disabled={submitting}>
              {submitting ? 'Saving…' : 'Add Slot'}
            </GradientBtn>
          </div>
        </form>
      </Modal>

      {/* ── DELETE CONFIRM ────────────────────────────────────────────────────── */}
      <Modal isOpen={!!delTarget} onClose={() => setDelTarget(null)} title="Confirm Remove">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove this slot?</h4>
            <p className="text-sm text-gray-500 mt-1.5">
              Period {delTarget?.periodNumber} —{' '}
              <strong>{delTarget?.subjectName}</strong> with {delTarget?.teacherName}
            </p>
          </div>
          <div className="w-full flex gap-3 pt-2">
            <button
              onClick={() => setDelTarget(null)}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Remove'}
            </button>
          </div>
        </div>
      </Modal>

      <Toast msg={toast} />
    </div>
  );
}

