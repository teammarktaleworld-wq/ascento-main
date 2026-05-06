'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  AlertCircle,
  Loader2,
  CalendarDays,
  Clock,
  BookOpen,
  User
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7] flex-shrink-0">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
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
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value ?? ""} 
      onChange={e => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors"
    />
  </div>
);

const FormSelect = ({ label, options, required = false, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <select 
      value={value ?? ""} 
      onChange={e => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors appearance-none cursor-pointer"
    >
      <option value="">Select…</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

/**
 * ==========================================
 * MAIN SCHEDULE VIEW
 * ==========================================
 */
export default function ScheduleView() {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('Monday');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [scheduleForm, setScheduleForm] = useState<any>({
    dayOfWeek: 'Monday',
    periodNumber: '1'
  });

  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const PERIOD_COLORS = ["#FF6B6B", "#4ECDC4", "#FFB347", "#A78BFA", "#F06292", "#45B7AA", "#7C3AED", "#FFD700"];

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/schedule");
      setScheduleData(res ?? []);
    } catch { 
      showToast("Failed to load schedule"); 
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // --- Handlers ---
  const handleOpenModal = () => {
    setScheduleForm({
      dayOfWeek: dayFilter !== 'All Days' ? dayFilter : 'Monday',
      periodNumber: '1',
      subjectName: '',
      teacherName: '',
      className: '',
      sectionName: '',
      startTime: '',
      endTime: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.subjectName || !scheduleForm.teacherName) { 
      showToast("Subject and Teacher are required"); 
      return; 
    }
    
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/schedule", {
        method: "POST",
        body: JSON.stringify(scheduleForm),
      });
      
      showToast("Schedule slot added successfully! 📅");
      setIsModalOpen(false);
      fetchSchedule();
    } catch (err: any) { 
      showToast(err.message || "Failed to add schedule slot"); 
    }
    setSubmitting(false);
  };

  const confirmDelete = (slot: any) => {
    setSlotToDelete(slot);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!slotToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/schedule/${slotToDelete.id}`, { method: "DELETE" });
      showToast("Slot removed successfully");
      fetchSchedule();
      setIsDeleteModalOpen(false);
      setSlotToDelete(null);
    } catch {
      showToast("Failed to remove slot");
    }
    setSubmitting(false);
  };

  // --- Local Filtering ---
  const filteredSchedule = useMemo(() => {
    return scheduleData.filter(s => {
      // Search by subject or teacher
      const subject = s.subject?.name || s.subjectName || '';
      const teacher = s.teacher?.user?.name || s.teacherName || '';
      const matchesSearch = subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            teacher.toLowerCase().includes(searchQuery.toLowerCase());
                            
      // Filter by day
      const matchesDay = dayFilter === 'All Days' || s.dayOfWeek === dayFilter;
      
      return matchesSearch && matchesDay;
    }).sort((a, b) => parseInt(a.periodNumber) - parseInt(b.periodNumber)); // Sort by period
  }, [scheduleData, searchQuery, dayFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Class Timetable</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage weekly schedules and teacher assignments.</p>
        </div>
        <GradientButton icon={Plus} onClick={handleOpenModal}>
          Add Class Slot
        </GradientButton>
      </div>

      {/* --- TOOLBAR --- */}
      <Card className="bg-[#FFFDF7]">
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search subject or teacher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Day Pills */}
        <div className="px-5 py-4 flex gap-3 overflow-x-auto no-scrollbar">
          {["All Days", ...DAYS_OF_WEEK].map((day) => (
            <button
              key={day}
              onClick={() => setDayFilter(day)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                dayFilter === day
                  ? 'bg-[#A78BFA] text-white shadow-[0_4px_15px_rgba(167,139,250,0.3)] scale-105'
                  : 'bg-white border border-[#F0EEF8] text-gray-500 hover:border-[#A78BFA]/50 hover:text-[#A78BFA]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      {/* --- SCHEDULE LIST --- */}
      <div className="space-y-4">
        {loading ? (
          <Card className="flex flex-col items-center justify-center h-64 text-[#A78BFA]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-bold text-gray-500">Loading timetable...</p>
          </Card>
        ) : filteredSchedule.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CalendarDays size={24} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">No classes scheduled</p>
            <p className="text-sm mt-1 text-gray-500">Add some timetable slots to see them appear here.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchedule.map((slot: any, i: number) => {
              // Assign consistent color based on period number for visual hierarchy
              const pNum = parseInt(slot.periodNumber) || i;
              const color = PERIOD_COLORS[(pNum - 1) % PERIOD_COLORS.length] || PERIOD_COLORS[0];
              const subject = slot.subject?.name || slot.subjectName || "—";
              const teacher = slot.teacher?.user?.name || slot.teacherName || "—";
              const className = slot.section?.class?.name || slot.className || "—";
              const sectionName = slot.section?.name || slot.sectionName || "—";

              return (
                <div 
                  key={slot.id || i} 
                  className="group relative bg-white rounded-2xl border border-[#F0EEF8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex"
                >
                  {/* Color Accent Bar */}
                  <div className="w-2 flex-shrink-0" style={{ backgroundColor: color }} />
                  
                  <div className="flex-1 p-5 relative">
                    {/* Floating Delete Button */}
                    <button 
                      onClick={() => confirmDelete(slot)}
                      className="absolute top-4 right-4 p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Period & Time */}
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm"
                        style={{ backgroundColor: `${color}15`, color: color }}
                      >
                        P{slot.periodNumber}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{slot.dayOfWeek}</p>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A2E]">
                          <Clock size={12} className="text-gray-400" />
                          {slot.startTime || '00:00'} - {slot.endTime || '00:00'}
                        </div>
                      </div>
                    </div>

                    {/* Subject & Teacher */}
                    <div className="mb-5 space-y-1">
                      <h3 className="text-lg font-black text-[#1A1A2E] flex items-center gap-2">
                        <BookOpen size={16} style={{ color }} /> {subject}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <User size={14} className="text-gray-400" /> {teacher}
                      </p>
                    </div>

                    {/* Class & Section Badges */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#F0EEF8]">
                      <Badge text={`Class ${className}`} color={color} />
                      <Badge text={`Section ${sectionName}`} color="#999" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- ADD SLOT MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Class">
        <form onSubmit={handleSaveSlot} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect 
              label="Day of Week" 
              options={DAYS_OF_WEEK} 
              required 
              value={scheduleForm.dayOfWeek} 
              onChange={(v: string) => setScheduleForm({ ...scheduleForm, dayOfWeek: v })} 
            />
            <FormSelect 
              label="Period Number" 
              options={["1", "2", "3", "4", "5", "6", "7", "8", "9"]} 
              required 
              value={scheduleForm.periodNumber} 
              onChange={(v: string) => setScheduleForm({ ...scheduleForm, periodNumber: v })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
              label="Start Time" 
              type="time" 
              required 
              value={scheduleForm.startTime} 
              onChange={(v: string) => setScheduleForm({ ...scheduleForm, startTime: v })} 
            />
            <FormInput 
              label="End Time" 
              type="time" 
              required 
              value={scheduleForm.endTime} 
              onChange={(v: string) => setScheduleForm({ ...scheduleForm, endTime: v })} 
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2 mt-2">Class Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="Subject Name" 
                placeholder="e.g. Mathematics" 
                required 
                value={scheduleForm.subjectName} 
                onChange={(v: string) => setScheduleForm({ ...scheduleForm, subjectName: v })} 
              />
              <FormInput 
                label="Teacher Name" 
                placeholder="e.g. Mrs. Sharma" 
                required 
                value={scheduleForm.teacherName} 
                onChange={(v: string) => setScheduleForm({ ...scheduleForm, teacherName: v })} 
              />
              <FormInput 
                label="Class Name" 
                placeholder="e.g. X" 
                required 
                value={scheduleForm.className} 
                onChange={(v: string) => setScheduleForm({ ...scheduleForm, className: v })} 
              />
              <FormInput 
                label="Section" 
                placeholder="e.g. A" 
                required 
                value={scheduleForm.sectionName} 
                onChange={(v: string) => setScheduleForm({ ...scheduleForm, sectionName: v })} 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
              {submitting ? 'Saving...' : 'Add Slot'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Action">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove Schedule Slot?</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to remove Period {slotToDelete?.periodNumber} for {slotToDelete?.subjectName || slotToDelete?.subject?.name}? This action cannot be undone.
            </p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] shadow-[0_4px_15px_rgba(255,107,107,0.3)] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Remove'}
            </button>
          </div>
        </div>
      </Modal>

      {/* --- LOCAL TOAST --- */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(167,139,250,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #A78BFA44; border-radius: 6px; }
      `}}/>
    </div>
  );
}