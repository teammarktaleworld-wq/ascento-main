'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Loader2,
  Calendar as CalendarIcon,
  CheckSquare,
  Save,
  Check,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

/**
 * ==========================================
 * API HELPER
 * ==========================================
 */
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

/**
 * ==========================================
 * REUSABLE UI COMPONENTS (Ascento Theme)
 * ==========================================
 */
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className="", type="button", disabled }: any) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(78,205,196,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
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

/**
 * ==========================================
 * MAIN ATTENDANCE VIEW
 * ==========================================
 */
export default function AttendanceView() {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchStudents = useCallback(async (q = "") => {
    setLoading(true);
    try {
      // Fetching up to 100 students for the attendance roster
      const res = await apiFetch(`/api/admin/students?search=${encodeURIComponent(q)}&limit=100`);
      setStudentsData(res.students ?? []);
    } catch { 
      showToast("Failed to load students roster"); 
    }
    setLoading(false);
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const t = setTimeout(() => fetchStudents(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery, fetchStudents]);

  // --- Handlers ---
  const handleAttendanceMark = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const newRecords = { ...attendanceRecords };
    filteredStudents.forEach(s => {
      newRecords[s.id] = 'present';
    });
    setAttendanceRecords(newRecords);
    showToast("All visible students marked as present.");
  };

  const handleSaveAttendance = async () => {
    if (Object.keys(attendanceRecords).length === 0) {
      showToast("No attendance records marked yet.");
      return;
    }

    setSaving(true);
    try {
      const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({ studentId, status }));
      await apiFetch("/api/admin/attendance", { 
        method: "POST", 
        body: JSON.stringify({ date: attendanceDate, records }) 
      });
      showToast("Attendance saved successfully! ✅");
    } catch { 
      showToast("Failed to save attendance records."); 
    }
    setSaving(false);
  };

  // --- Local Filtering ---
  const filteredStudents = useMemo(() => {
    if (classFilter === 'All Classes') return studentsData;
    return studentsData.filter(s => {
      const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
      return className.includes(classFilter) || classFilter.includes(className);
    });
  }, [studentsData, classFilter]);

  // Dynamic Button Styles based on Ascento Theme Colors
  const getBtnClass = (status: 'present' | 'absent' | 'late', current: string) => {
    const base = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border-2 border-transparent focus:outline-none flex-1 ";
    
    if (current !== status) {
      return base + "bg-gray-50 text-gray-400 hover:bg-gray-100";
    }
    
    if (status === 'present') return base + "bg-[#4ECDC4] text-white shadow-[0_4px_15px_rgba(78,205,196,0.4)] scale-[1.02]";
    if (status === 'absent') return base + "bg-[#FF6B6B] text-white shadow-[0_4px_15px_rgba(255,107,107,0.4)] scale-[1.02]";
    if (status === 'late') return base + "bg-[#FFB347] text-white shadow-[0_4px_15px_rgba(255,179,71,0.4)] scale-[1.02]";
    
    return base;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-xl">
              <CheckSquare size={24} />
            </div>
            Daily Attendance
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Record and track student attendance securely.</p>
        </div>
        
        {/* Date Picker & Save Action */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative group">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4ECDC4] transition-colors" />
            <input 
              type="date" 
              value={attendanceDate} 
              onChange={e => setAttendanceDate(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white border border-[#F0EEF8] rounded-xl text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm cursor-pointer" 
            />
          </div>
          <GradientButton 
            onClick={handleSaveAttendance} 
            disabled={saving} 
            icon={saving ? Loader2 : Save}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Register"}
          </GradientButton>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <Card className="overflow-visible bg-white">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#FFFDF7]">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm"
              />
            </div>
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 shadow-sm cursor-pointer appearance-none w-full sm:w-48"
            >
              <option>All Classes</option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
              <option>Level 1</option>
              <option>Level 2</option>
            </select>
          </div>
          
          <button 
            onClick={handleMarkAllPresent}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/20 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#4ECDC4] hover:text-white transition-all whitespace-nowrap w-full md:w-auto justify-center"
          >
            <CheckCircle2 size={16} />
            Mark All Present
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-[#4ECDC4]">
               <Loader2 className="animate-spin mb-4" size={32} />
               <p className="text-sm font-bold text-gray-500">Loading student roster...</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap w-1/3">Student Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Class / Section</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">Status Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => {
                    const currentStatus = attendanceRecords[s.id] || '';
                    const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
                    const avatarGradients = ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"];
                    const avatarBg = avatarGradients[i % 3];

                    return (
                      <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                        
                        {/* Student Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div 
                              style={{ background: avatarBg }}
                              className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-black shadow-md flex-shrink-0"
                            >
                              {s.fullName?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A2E]">{s.fullName}</p>
                              <p className="text-xs text-gray-400 font-medium font-mono tracking-widest">{s.studentId || s.id.substring(0,8)}</p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Class Info */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <Badge text={className} color="#A78BFA" />
                            <span className="text-xs text-gray-500 font-bold ml-1">Roll: {s.rollNumber ?? "—"}</span>
                          </div>
                        </td>

                        {/* Status Toggles */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 max-w-[400px] ml-auto">
                            <button 
                              onClick={() => handleAttendanceMark(s.id, 'present')}
                              className={getBtnClass('present', currentStatus)}
                            >
                              <Check size={14} className={currentStatus === 'present' ? 'text-white' : 'text-[#4ECDC4]'} />
                              Present
                            </button>
                            <button 
                              onClick={() => handleAttendanceMark(s.id, 'absent')}
                              className={getBtnClass('absent', currentStatus)}
                            >
                              <X size={14} className={currentStatus === 'absent' ? 'text-white' : 'text-[#FF6B6B]'} />
                              Absent
                            </button>
                            <button 
                              onClick={() => handleAttendanceMark(s.id, 'late')}
                              className={getBtnClass('late', currentStatus)}
                            >
                              <Clock size={14} className={currentStatus === 'late' ? 'text-white' : 'text-[#FFB347]'} />
                              Late
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Search size={24} className="text-gray-300" />
                        </div>
                        <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                        <p className="text-sm mt-1">Check your search query or class filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-5 border-t border-[#F0EEF8] bg-[#FFFDF7] flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
           <span>Total Students: {filteredStudents.length}</span>
           <span>
             Marked: <span className="text-[#4ECDC4]">{Object.keys(attendanceRecords).length}</span> / {filteredStudents.length}
           </span>
        </div>
      </Card>

      {/* --- LOCAL TOAST --- */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(78,205,196,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4ECDC444; border-radius: 6px; }
      `}}/>
    </div>
  );
}