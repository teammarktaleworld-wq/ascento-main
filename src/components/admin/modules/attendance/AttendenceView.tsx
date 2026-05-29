// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Search, 
//   Loader2,
//   Calendar as CalendarIcon,
//   CheckSquare,
//   Save,
//   Check,
//   X,
//   Clock,
//   CheckCircle2
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

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
//     className={`bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(78,205,196,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
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

// /**
//  * ==========================================
//  * MAIN ATTENDANCE VIEW
//  * ==========================================
//  */
// export default function AttendanceView() {
//   const [studentsData, setStudentsData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // State
//   const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
//   const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [classFilter, setClassFilter] = useState('All Classes');

//   const showToast = (msg: string) => { 
//     setToast(msg); 
//     setTimeout(() => setToast(null), 3000); 
//   };

//   // --- API Integrations ---
//   const fetchStudents = useCallback(async (q = "") => {
//     setLoading(true);
//     try {
//       // Fetching up to 100 students for the attendance roster
//       const res = await apiFetch(`/api/admin/students?search=${encodeURIComponent(q)}&limit=100`);
//       setStudentsData(res.students ?? []);
//     } catch { 
//       showToast("Failed to load students roster"); 
//     }
//     setLoading(false);
//   }, []);

//   // Debounced Search Effect
//   useEffect(() => {
//     const t = setTimeout(() => fetchStudents(searchQuery), 350);
//     return () => clearTimeout(t);
//   }, [searchQuery, fetchStudents]);

//   // --- Handlers ---
//   const handleAttendanceMark = (studentId: string, status: 'present' | 'absent' | 'late') => {
//     setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
//   };

//   const handleMarkAllPresent = () => {
//     const newRecords = { ...attendanceRecords };
//     filteredStudents.forEach(s => {
//       newRecords[s.id] = 'present';
//     });
//     setAttendanceRecords(newRecords);
//     showToast("All visible students marked as present.");
//   };

//   const handleSaveAttendance = async () => {
//     if (Object.keys(attendanceRecords).length === 0) {
//       showToast("No attendance records marked yet.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({ studentId, status }));
//       await apiFetch("/api/admin/attendance", { 
//         method: "POST", 
//         body: JSON.stringify({ date: attendanceDate, records }) 
//       });
//       showToast("Attendance saved successfully! ✅");
//     } catch { 
//       showToast("Failed to save attendance records."); 
//     }
//     setSaving(false);
//   };

//   // --- Local Filtering ---
//   const filteredStudents = useMemo(() => {
//     if (classFilter === 'All Classes') return studentsData;
//     return studentsData.filter(s => {
//       const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
//       return className.includes(classFilter) || classFilter.includes(className);
//     });
//   }, [studentsData, classFilter]);

//   // Dynamic Button Styles based on Ascento Theme Colors
//   const getBtnClass = (status: 'present' | 'absent' | 'late', current: string) => {
//     const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border-2 border-transparent focus:outline-none flex-1 ";
    
//     if (current !== status) {
//       return base + "bg-gray-50 text-gray-400 hover:bg-gray-100";
//     }
    
//     if (status === 'present') return base + "bg-[#4ECDC4] text-white shadow-[0_4px_15px_rgba(78,205,196,0.4)] scale-[1.02]";
//     if (status === 'absent') return base + "bg-[#FF6B6B] text-white shadow-[0_4px_15px_rgba(255,107,107,0.4)] scale-[1.02]";
//     if (status === 'late') return base + "bg-[#FFB347] text-white shadow-[0_4px_15px_rgba(255,179,71,0.4)] scale-[1.02]";
    
//     return base;
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-xl">
//               <CheckSquare size={24} />
//             </div>
//             Daily Attendance
//           </h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">Record and track student attendance securely.</p>
//         </div>
        
//         {/* Date Picker & Save Action */}
//         <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
//           <div className="relative group">
//             <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4ECDC4] transition-colors" />
//             <input 
//               type="date" 
//               value={attendanceDate} 
//               onChange={e => setAttendanceDate(e.target.value)}
//               className="pl-11 pr-4 py-2.5 bg-white border border-[#F0EEF8] rounded-xl text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm cursor-pointer" 
//             />
//           </div>
//           <GradientButton 
//             onClick={handleSaveAttendance} 
//             disabled={saving} 
//             icon={saving ? Loader2 : Save}
//             className="w-full sm:w-auto"
//           >
//             {saving ? "Saving..." : "Save Register"}
//           </GradientButton>
//         </div>
//       </div>

//       {/* --- MAIN CARD --- */}
//       <Card className="overflow-visible bg-white">
        
//         {/* Toolbar */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#FFFDF7]">
//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Search students..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm"
//               />
//             </div>
//             <select 
//               value={classFilter}
//               onChange={(e) => setClassFilter(e.target.value)}
//               className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 shadow-sm cursor-pointer appearance-none w-full sm:w-48"
//             >
//               <option>All Classes</option>
//               <option>Class 1</option>
//               <option>Class 2</option>
//               <option>Class 3</option>
//               <option>Level 1</option>
//               <option>Level 2</option>
//             </select>
//           </div>
          
//           <button 
//             onClick={handleMarkAllPresent}
//             className="flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/20 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#4ECDC4] hover:text-white transition-all whitespace-nowrap w-full md:w-auto justify-center"
//           >
//             <CheckCircle2 size={16} />
//             Mark All Present
//           </button>
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//              <div className="flex flex-col items-center justify-center h-64 text-[#4ECDC4]">
//                <Loader2 className="animate-spin mb-4" size={32} />
//                <p className="text-sm font-bold text-gray-500">Loading student roster...</p>
//              </div>
//           ) : (
//             <table className="w-full text-left border-collapse min-w-[800px]">
//               <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                 <tr>
//                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap w-1/3">Student Details</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Class / Section</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">Status Registration</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F0EEF8]">
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((s, i) => {
//                     const currentStatus = attendanceRecords[s.id] || '';
//                     const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
//                     const avatarGradients = ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"];
//                     const avatarBg = avatarGradients[i % 3];

//                     return (
//                       <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                        
//                         {/* Student Info */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-4">
//                             <div 
//                               style={{ background: avatarBg }}
//                               className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-black shadow-md flex-shrink-0"
//                             >
//                               {s.fullName?.[0]?.toUpperCase() ?? "?"}
//                             </div>
//                             <div>
//                               <p className="text-sm font-bold text-[#1A1A2E]">{s.fullName}</p>
//                               <p className="text-xs text-gray-400 font-medium font-mono tracking-widest">{s.studentId || s.id.substring(0,8)}</p>
//                             </div>
//                           </div>
//                         </td>
                        
//                         {/* Class Info */}
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col items-start gap-1">
//                             <Badge text={className} color="#A78BFA" />
//                             <span className="text-xs text-gray-500 font-bold ml-1">Roll: {s.rollNumber ?? "—"}</span>
//                           </div>
//                         </td>

//                         {/* Status Toggles */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 max-w-[400px] ml-auto">
//                             <button 
//                               onClick={() => handleAttendanceMark(s.id, 'present')}
//                               className={getBtnClass('present', currentStatus)}
//                             >
//                               <Check size={14} className={currentStatus === 'present' ? 'text-white' : 'text-[#4ECDC4]'} />
//                               Present
//                             </button>
//                             <button 
//                               onClick={() => handleAttendanceMark(s.id, 'absent')}
//                               className={getBtnClass('absent', currentStatus)}
//                             >
//                               <X size={14} className={currentStatus === 'absent' ? 'text-white' : 'text-[#FF6B6B]'} />
//                               Absent
//                             </button>
//                             <button 
//                               onClick={() => handleAttendanceMark(s.id, 'late')}
//                               className={getBtnClass('late', currentStatus)}
//                             >
//                               <Clock size={14} className={currentStatus === 'late' ? 'text-white' : 'text-[#FFB347]'} />
//                               Late
//                             </button>
//                           </div>
//                         </td>

//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={3} className="px-6 py-20 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-400">
//                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                           <Search size={24} className="text-gray-300" />
//                         </div>
//                         <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                         <p className="text-sm mt-1">Check your search query or class filter.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Footer info */}
//         <div className="p-5 border-t border-[#F0EEF8] bg-[#FFFDF7] flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
//            <span>Total Students: {filteredStudents.length}</span>
//            <span>
//              Marked: <span className="text-[#4ECDC4]">{Object.keys(attendanceRecords).length}</span> / {filteredStudents.length}
//            </span>
//         </div>
//       </Card>

//       {/* --- LOCAL TOAST --- */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(78,205,196,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #4ECDC444; border-radius: 6px; }
//       `}}/>
//     </div>
//   );
// }




'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Search, Loader2, Calendar as CalendarIcon, CheckSquare,
  Save, Check, X, Clock, CheckCircle2, ChevronLeft, ChevronRight,
  BarChart2, Users, AlertCircle, BookOpen, TrendingUp, Download,
  Filter, RefreshCw, Edit2, Eye, Percent, Award, XCircle,
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// API HELPER
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday' | '';
interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }
interface ProgramLevel { id: string; name: string; sortOrder: number; }
interface Student {
  id: string; studentId: string; fullName: string; rollNumber?: string;
  photoUrl?: string; parentPhone?: string; status: string;
  program?: { id: string; name: string };
  programLevel?: { id: string; name: string };
}
interface AttendanceRecord {
  id: string; studentId: string; date: string; status: AttendanceStatus; note?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];
function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MiniCalendar({
  selected, onChange, markedDates = {},
}: {
  selected: string;
  onChange: (date: string) => void;
  markedDates?: Record<string, AttendanceStatus>;
}) {
  const [view, setView] = useState(() => {
    const d = new Date(selected + "T00:00:00");
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daysInMonth  = getDaysInMonth(view.year, view.month);
  const firstDay     = getFirstDayOfMonth(view.year, view.month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () =>
    setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () =>
    setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-white rounded-2xl border border-[#F0EEF8] shadow-sm overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA]">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-black text-white tracking-wide">
          {MONTHS[view.month]} {view.year}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#F0EEF8]">
        {DAYS.map((d) => (
          <div key={d} className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-px p-2">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const iso    = `${view.year}-${pad(view.month + 1)}-${pad(day)}`;
          const isSel  = iso === selected;
          const isToday = iso === TODAY;
          const status = markedDates[iso];
          const dotColor =
            status === "present" ? "#4ECDC4" :
            status === "absent"  ? "#FF6B6B" :
            status === "late"    ? "#FFB347" :
            status === "holiday" ? "#A78BFA" : null;

          return (
            <button
              key={idx}
              onClick={() => onChange(iso)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all
                ${isSel
                  ? "bg-[#4ECDC4] text-white shadow-[0_4px_12px_rgba(78,205,196,0.4)]"
                  : isToday
                  ? "bg-[#4ECDC4]/10 text-[#4ECDC4] ring-2 ring-[#4ECDC4]/30"
                  : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              {day}
              {dotColor && !isSel && (
                <div
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: dotColor }}
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="px-3 py-2 border-t border-[#F0EEF8] flex flex-wrap gap-3">
        {[
          ["#4ECDC4", "Present"],
          ["#FF6B6B", "Absent"],
          ["#FFB347", "Late"],
          ["#A78BFA", "Holiday"],
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[9px] font-bold text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE STATUS BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function StatusButton({
  status, current, onClick,
}: {
  status: AttendanceStatus; current: AttendanceStatus; onClick: () => void;
}) {
  const configs: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; shadow: string }> = {
    present: { label: "Present", icon: <Check size={13} />,   color: "#4ECDC4", bg: "#4ECDC4", shadow: "rgba(78,205,196,0.4)" },
    absent:  { label: "Absent",  icon: <X size={13} />,       color: "#FF6B6B", bg: "#FF6B6B", shadow: "rgba(255,107,107,0.4)" },
    late:    { label: "Late",    icon: <Clock size={13} />,    color: "#FFB347", bg: "#FFB347", shadow: "rgba(255,179,71,0.4)" },
    holiday: { label: "Holiday", icon: <Award size={13} />,   color: "#A78BFA", bg: "#A78BFA", shadow: "rgba(167,139,250,0.4)" },
  };
  const c = configs[status as string];
  const isActive = current === status;

  return (
    <button
      onClick={onClick}
      style={isActive ? {
        background: c.bg, color: "#fff",
        boxShadow: `0 4px 14px ${c.shadow}`,
        transform: "scale(1.04)",
        borderColor: "transparent",
      } : {
        background: "#FAFAFA", color: "#999",
        borderColor: "#F0EEF8",
      }}
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 flex-1"
    >
      {c.icon}
      <span className="hidden sm:inline">{c.label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE INPUT (inline, collapsible)
// ─────────────────────────────────────────────────────────────────────────────
function NoteInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(!!value);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] font-bold text-gray-300 hover:text-[#4ECDC4] transition-colors ml-2 whitespace-nowrap"
      >
        + note
      </button>
    );
  }
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => { if (!value) setOpen(false); }}
      placeholder="Add note…"
      className="ml-2 text-xs px-2 py-1 bg-[#FFFDF7] border border-[#F0EEF8] rounded-lg outline-none focus:border-[#4ECDC4] text-gray-600 font-medium w-32 transition-colors"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT REPORT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function StudentReportModal({
  student, onClose,
}: {
  student: Student; onClose: () => void;
}) {
  const [loading, setLoading]   = useState(true);
  const [stats,   setStats]     = useState<any>(null);
  const [records, setRecords]   = useState<AttendanceRecord[]>([]);
  const [month,   setMonth]     = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/attendance/${student.id}?month=${month}`);
      setStats(res.stats);
      setRecords(res.records ?? []);
    } catch { /* silent */ }
    setLoading(false);
  }, [student.id, month]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const statCards = stats ? [
    { label: "Working Days", value: stats.workingDays, color: "#1A1A2E", icon: CalendarIcon },
    { label: "Present",      value: stats.present,     color: "#4ECDC4", icon: CheckCircle2 },
    { label: "Absent",       value: stats.absent,      color: "#FF6B6B", icon: XCircle },
    { label: "Late",         value: stats.late,        color: "#FFB347", icon: Clock },
    { label: "Holidays",     value: stats.holiday,     color: "#A78BFA", icon: Award },
    { label: "Attendance %", value: `${stats.percentage}%`, color: stats.percentage >= 75 ? "#4ECDC4" : "#FF6B6B", icon: Percent },
  ] : [];

  const statusColor: Record<string, string> = {
    present: "#4ECDC4", absent: "#FF6B6B", late: "#FFB347", holiday: "#A78BFA",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] rounded-t-[24px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-base">{student.fullName[0]}</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{student.fullName}</h3>
              <p className="text-white/70 text-xs font-mono">{student.studentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Month selector */}
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Month</label>
            <input
              type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#4ECDC4]" size={28} />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {statCards.map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-2xl p-3 text-center">
                    <Icon size={18} style={{ color }} className="mx-auto mb-1" />
                    <p className="text-xl font-black" style={{ color }}>{value}</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Attendance % bar */}
              {stats && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Attendance Rate</span>
                    <span className="text-xs font-black" style={{ color: stats.percentage >= 75 ? "#4ECDC4" : "#FF6B6B" }}>
                      {stats.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${stats.percentage}%`,
                        background: stats.percentage >= 75
                          ? "linear-gradient(90deg,#4ECDC4,#45B7AA)"
                          : "linear-gradient(90deg,#FF6B6B,#FFB347)",
                      }}
                    />
                  </div>
                  {stats.percentage < 75 && (
                    <p className="text-[10px] font-bold text-[#FF6B6B] mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> Below 75% threshold
                    </p>
                  )}
                </div>
              )}

              {/* Day-by-day records */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Day-by-Day Record ({records.length} entries)
                </h4>
                {records.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6 bg-[#FFFDF7] rounded-xl">No records for this month</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                    {records.map((r) => (
                      <div key={r.id} className="flex items-center justify-between bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-2.5">
                        <span className="text-sm font-bold text-[#1A1A2E]">
                          {new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                        </span>
                        <div className="flex items-center gap-2">
                          {r.note && <span className="text-[10px] text-gray-400 italic">{r.note}</span>}
                          <span
                            className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                            style={{
                              background: (statusColor[r.status as string] ?? "#999") + "22",
                              color: statusColor[r.status as string] ?? "#999",
                              border: `1px solid ${(statusColor[r.status as string] ?? "#999")}44`,
                            }}
                          >
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-[#F0EEF8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ATTENDANCE VIEW
// ─────────────────────────────────────────────────────────────────────────────
export default function AttendanceView() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [programs,     setPrograms]     = useState<Program[]>([]);
  const [students,     setStudents]     = useState<Student[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; type?: "ok"|"err" } | null>(null);

  // Filters
  const [selectedDate,     setSelectedDate]     = useState(TODAY);
  const [programFilter,    setProgramFilter]    = useState("");
  const [levelFilter,      setLevelFilter]      = useState("");
  const [searchQuery,      setSearchQuery]      = useState("");

  // Attendance data
  const [records,       setRecords]       = useState<Record<string, AttendanceStatus>>({});
  const [notes,         setNotes]         = useState<Record<string, string>>({});
  const [savedDates,    setSavedDates]    = useState<Record<string, AttendanceStatus>>({}); // for calendar dots

  // UI state
  const [activeTab,        setActiveTab]        = useState<"mark" | "calendar">("mark");
  const [reportStudent,    setReportStudent]    = useState<Student | null>(null);
  const [dirtyRecords,     setDirtyRecords]     = useState(false);
  const [calendarMonth,    setCalendarMonth]    = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load programs ──────────────────────────────────────────────────────────
  useEffect(() => {
    apiFetch("/api/admin/programs")
      .then((r) => setPrograms(r.programs ?? []))
      .catch(() => {});
  }, []);

  // ── Selected program object ────────────────────────────────────────────────
  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === programFilter) ?? null,
    [programs, programFilter]
  );

  // ── Fetch attendance for selected date + filters ───────────────────────────
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date: selectedDate });
      if (programFilter) params.set("programId", programFilter);
      if (levelFilter)   params.set("levelId", levelFilter);

      const res = await apiFetch(`/api/admin/attendance?${params}`);
      setStudents(res.students ?? []);

      // Populate records map from existing data
      const recMap: Record<string, AttendanceStatus> = {};
      const noteMap: Record<string, string> = {};
      Object.entries(res.records as Record<string, any>).forEach(([sid, rec]: any) => {
        recMap[sid]  = rec.status ?? "";
        noteMap[sid] = rec.note  ?? "";
      });
      setRecords(recMap);
      setNotes(noteMap);
      setDirtyRecords(false);
    } catch (e: any) {
      showToast("Failed to load attendance", "err");
    }
    setLoading(false);
  }, [selectedDate, programFilter, levelFilter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  // ── Filtered students (search) ─────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        (s.studentId ?? "").toLowerCase().includes(q) ||
        (s.rollNumber ?? "").toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  // ── Mark a single student ──────────────────────────────────────────────────
  const handleMark = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [studentId]: prev[studentId] === status ? "" : status }));
    setDirtyRecords(true);
  };

  const handleNote = (studentId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [studentId]: note }));
    setDirtyRecords(true);
  };

  // ── Mark all visible students ──────────────────────────────────────────────
  const handleMarkAll = (status: AttendanceStatus) => {
    const next = { ...records };
    filteredStudents.forEach((s) => { next[s.id] = status; });
    setRecords(next);
    setDirtyRecords(true);
    showToast(`All ${filteredStudents.length} students marked as ${status}`);
  };

  // ── Save attendance ────────────────────────────────────────────────────────
  const handleSave = async () => {
    const toSave = Object.entries(records)
      .filter(([, status]) => !!status)
      .map(([studentId, status]) => ({
        studentId, status, note: notes[studentId] || null,
      }));

    if (toSave.length === 0) { showToast("No records to save", "err"); return; }

    setSaving(true);
    try {
      await apiFetch("/api/admin/attendance", {
        method: "POST",
        body: JSON.stringify({ date: selectedDate, records: toSave }),
      });
      showToast(`Saved ${toSave.length} records ✓`);
      setDirtyRecords(false);
    } catch {
      showToast("Failed to save attendance", "err");
    }
    setSaving(false);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const all = Object.values(records);
    return {
      total:   students.length,
      marked:  Object.values(records).filter(Boolean).length,
      present: all.filter((s) => s === "present").length,
      absent:  all.filter((s) => s === "absent").length,
      late:    all.filter((s) => s === "late").length,
      holiday: all.filter((s) => s === "holiday").length,
    };
  }, [records, students]);

  // ── Calendar month days ────────────────────────────────────────────────────
  const calDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(calendarMonth.year, calendarMonth.month);
    const firstDay    = getFirstDayOfMonth(calendarMonth.year, calendarMonth.month);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calendarMonth]);

  const pad = (n: number) => String(n).padStart(2, "0");

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-in fade-in duration-500 relative">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-xl">
              <CheckSquare size={22} />
            </div>
            Attendance Register
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            {fmtDate(selectedDate)} — {students.length} students loaded
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date picker */}
          <div className="relative group">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-[#F0EEF8] rounded-xl text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm cursor-pointer"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !dirtyRecords}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
              ${dirtyRecords
                ? "bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white hover:shadow-[0_8px_20px_rgba(78,205,196,0.4)] hover:-translate-y-0.5"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : dirtyRecords ? "Save Attendance" : "Saved"}
          </button>
        </div>
      </div>

      {/* ── STAT PILLS ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total",   value: stats.total,   color: "#1A1A2E", bg: "#F8F8FF" },
          { label: "Marked",  value: stats.marked,  color: "#64B6FF", bg: "#64B6FF" },
          { label: "Present", value: stats.present, color: "#4ECDC4", bg: "#4ECDC4" },
          { label: "Absent",  value: stats.absent,  color: "#FF6B6B", bg: "#FF6B6B" },
          { label: "Late",    value: stats.late,    color: "#FFB347", bg: "#FFB347" },
          { label: "Holiday", value: stats.holiday, color: "#A78BFA", bg: "#A78BFA" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="bg-white border border-[#F0EEF8] rounded-2xl p-4 flex flex-col items-center shadow-sm"
          >
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
            <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: stats.total > 0 ? `${Math.round((value / stats.total) * 100)}%` : "0%",
                  background: bg,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN BODY: two-column on large screens ────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── LEFT: CALENDAR ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          <MiniCalendar
            selected={selectedDate}
            onChange={(d) => { setSelectedDate(d); setActiveTab("mark"); }}
            markedDates={savedDates}
          />

          {/* Program + Level filters */}
          <div className="bg-white border border-[#F0EEF8] rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Filter size={12} /> Filters
            </p>
            <div className="space-y-2">
              <select
                value={programFilter}
                onChange={(e) => { setProgramFilter(e.target.value); setLevelFilter(""); }}
                className="w-full bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] transition-colors appearance-none cursor-pointer"
              >
                <option value="">All Programs</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              {selectedProgram && selectedProgram.levels.length > 0 && (
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-3 py-2.5 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Levels</option>
                  {selectedProgram.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              )}
            </div>

            {/* Quick "Mark All" buttons */}
            <div className="space-y-2 pt-1 border-t border-[#F0EEF8]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Mark all visible</p>
              <div className="grid grid-cols-2 gap-2">
                {(["present","absent","late","holiday"] as AttendanceStatus[]).map((s) => {
                  const colors: Record<string, string> = { present:"#4ECDC4", absent:"#FF6B6B", late:"#FFB347", holiday:"#A78BFA" };
                  return (
                    <button
                      key={s}
                      onClick={() => handleMarkAll(s)}
                      style={{ borderColor: colors[s] + "44", color: colors[s], background: colors[s] + "11" }}
                      className="py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border hover:opacity-80 transition-opacity"
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchAttendance}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#F0EEF8] rounded-xl text-sm font-bold text-gray-500 hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-colors"
          >
            <RefreshCw size={14} /> Reload
          </button>
        </div>

        {/* ── RIGHT: STUDENT ROSTER ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[24px] border border-[#F0EEF8] shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="p-4 border-b border-[#F0EEF8] bg-[#FFFDF7] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search students…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm"
                />
              </div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {filteredStudents.length} shown · {stats.marked} marked
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ minHeight: 400 }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#4ECDC4]">
                  <Loader2 className="animate-spin mb-3" size={28} />
                  <p className="text-sm font-bold text-gray-400">Loading roster…</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                  <Users size={32} className="mb-3" />
                  <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8] sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Program / Level</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EEF8]">
                    {filteredStudents.map((s, i) => {
                      const status = records[s.id] ?? "";
                      const note   = notes[s.id]   ?? "";
                      const GRADS  = [
                        "linear-gradient(135deg,#4ECDC4,#45B7AA)",
                        "linear-gradient(135deg,#FF6B6B,#FFB347)",
                        "linear-gradient(135deg,#A78BFA,#7C3AED)",
                        "linear-gradient(135deg,#64B6FF,#4ECDC4)",
                      ];

                      const rowBg =
                        status === "present" ? "bg-[#4ECDC4]/[0.03]" :
                        status === "absent"  ? "bg-[#FF6B6B]/[0.03]" :
                        status === "late"    ? "bg-[#FFB347]/[0.03]" :
                        status === "holiday" ? "bg-[#A78BFA]/[0.03]" : "";

                      return (
                        <tr key={s.id} className={`transition-colors hover:bg-[#FFFDF7] ${rowBg}`}>
                          {/* Student info */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                {s.photoUrl ? (
                                  <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  <div style={{ background: GRADS[i % GRADS.length] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">
                                    {s.fullName[0]}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#1A1A2E] truncate">{s.fullName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-[10px] font-mono text-gray-400">{s.studentId}</p>
                                  {s.rollNumber && (
                                    <span className="text-[10px] font-bold text-gray-400">· Roll {s.rollNumber}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Program */}
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex flex-col gap-1">
                              {s.program && (
                                <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-[#4ECDC4]/10 text-[#4ECDC4] inline-block w-fit">
                                  {s.program.name}
                                </span>
                              )}
                              {s.programLevel && (
                                <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-[#A78BFA]/10 text-[#A78BFA] inline-block w-fit">
                                  {s.programLevel.name}
                                </span>
                              )}
                              {!s.program && <span className="text-xs text-gray-300">—</span>}
                            </div>
                          </td>

                          {/* Attendance buttons */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {(["present","absent","late","holiday"] as AttendanceStatus[]).map((st) => (
                                <StatusButton
                                  key={st}
                                  status={st}
                                  current={status as AttendanceStatus}
                                  onClick={() => handleMark(s.id, st)}
                                />
                              ))}
                              <NoteInput value={note} onChange={(v) => handleNote(s.id, v)} />
                            </div>
                          </td>

                          {/* Report button */}
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setReportStudent(s)}
                              className="p-2 text-gray-400 hover:text-[#4ECDC4] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#4ECDC4]/30 transition-all shadow-sm"
                              title="View attendance report"
                            >
                              <BarChart2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#F0EEF8] bg-[#FFFDF7] flex flex-wrap justify-between items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <div className="flex gap-4">
                <span>Total: <span className="text-[#1A1A2E]">{stats.total}</span></span>
                <span>Marked: <span className="text-[#4ECDC4]">{stats.marked}</span></span>
              </div>
              <div className="flex gap-4">
                {stats.present > 0  && <span>Present: <span className="text-[#4ECDC4]">{stats.present}</span></span>}
                {stats.absent > 0   && <span>Absent: <span className="text-[#FF6B6B]">{stats.absent}</span></span>}
                {stats.late > 0     && <span>Late: <span className="text-[#FFB347]">{stats.late}</span></span>}
                {stats.holiday > 0  && <span>Holiday: <span className="text-[#A78BFA]">{stats.holiday}</span></span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STUDENT REPORT MODAL ────────────────────────────────────────────── */}
      {reportStudent && (
        <StudentReportModal
          student={reportStudent}
          onClose={() => setReportStudent(null)}
        />
      )}

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm z-[999] animate-in slide-in-from-bottom-5 shadow-lg ${
            toast.type === "err"
              ? "bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] shadow-[0_8px_24px_rgba(255,107,107,0.4)]"
              : "bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] shadow-[0_8px_24px_rgba(78,205,196,0.4)]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}