'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
  Clock,
  BookOpen
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
        className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
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

const FormTextarea = ({ label, placeholder, required = false, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <textarea 
      placeholder={placeholder} 
      value={value ?? ""} 
      onChange={e => onChange?.(e.target.value)}
      rows={4}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#A78BFA] transition-colors resize-none custom-scrollbar"
    />
  </div>
);

/**
 * ==========================================
 * MAIN EXAMS VIEW
 * ==========================================
 */
export default function ExamsView() {
  const [examsData, setExamsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [examForm, setExamForm] = useState<any>({
    examName: '',
    examDate: '',
    examEndDate: '',
    description: ''
  });

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/exams");
      setExamsData(res ?? []);
    } catch { 
      showToast("Failed to load exams"); 
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // --- Handlers ---
  const handleOpenModal = () => {
    setExamForm({
      examName: '',
      examDate: '',
      examEndDate: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.examName) { 
      showToast("Exam title is required"); 
      return; 
    }
    
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/exams", {
        method: "POST",
        body: JSON.stringify({ 
          examName: examForm.examName, 
          description: examForm.description, 
          examStartDate: examForm.examDate,
          examEndDate: examForm.examEndDate // Included for completeness
        }),
      });
      
      showToast("Exam scheduled successfully! 📝");
      setIsModalOpen(false);
      fetchExams();
    } catch (err: any) { 
      showToast(err.message || "Failed to schedule exam"); 
    }
    setSubmitting(false);
  };

  const confirmDelete = (exam: any) => {
    setExamToDelete(exam);
    setIsDeleteModalOpen(true);
  };

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
      showToast("Failed to delete exam");
    }
    setSubmitting(false);
  };

  // --- Local Filtering ---
  const filteredExams = useMemo(() => {
    return examsData.filter(e => {
      // Search
      const name = e.examName || '';
      const desc = e.description || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            desc.toLowerCase().includes(searchQuery.toLowerCase());
                            
      // Status Filter
      const isUpcoming = e.examStartDate && new Date(e.examStartDate) >= new Date(new Date().setHours(0,0,0,0));
      let matchesStatus = true;
      if (statusFilter === 'Upcoming') matchesStatus = isUpcoming;
      if (statusFilter === 'Completed') matchesStatus = !isUpcoming;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Sort upcoming first, then by date
      if (!a.examStartDate) return 1;
      if (!b.examStartDate) return -1;
      return new Date(a.examStartDate).getTime() - new Date(b.examStartDate).getTime();
    });
  }, [examsData, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Exam Management</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Schedule and manage upcoming & completed tests.</p>
        </div>
        <GradientButton icon={Plus} onClick={handleOpenModal}>
          Add Exam
        </GradientButton>
      </div>

      {/* --- TOOLBAR --- */}
      <Card className="bg-[#FFFDF7]">
        <div className="p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by exam title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            {["All", "Upcoming", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-2 border-[#A78BFA]/20'
                    : 'bg-white text-gray-500 border-2 border-[#F0EEF8] hover:border-[#A78BFA]/30 hover:text-[#A78BFA]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* --- EXAMS GRID --- */}
      <div className="space-y-4">
        {loading ? (
          <Card className="flex flex-col items-center justify-center h-64 text-[#A78BFA]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-bold text-gray-500">Loading exams...</p>
          </Card>
        ) : filteredExams.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-[#1A1A2E]">No exams found</p>
            <p className="text-sm mt-1 text-gray-500">Adjust your filters or schedule a new exam.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam: any) => {
              const isUpcoming = exam.examStartDate && new Date(exam.examStartDate) >= new Date(new Date().setHours(0,0,0,0));
              const primaryColor = isUpcoming ? '#A78BFA' : '#4ECDC4';
              const gradientClass = isUpcoming 
                ? 'from-[#A78BFA] to-[#7C3AED]' 
                : 'from-[#4ECDC4] to-[#45B7AA]';

              return (
                <div 
                  key={exam.id} 
                  className="group relative bg-white rounded-[24px] border border-[#F0EEF8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <FileText size={20} />
                      </div>
                      <Badge 
                        text={isUpcoming ? "Upcoming" : "Completed"} 
                        color={primaryColor} 
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-black text-[#1A1A2E] mb-2 line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                      {exam.examName}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 min-h-[40px]">
                      {exam.description || "No description provided for this exam."}
                    </p>

                    {/* Dates */}
                    <div className="space-y-2 bg-[#FFFDF7] p-3 rounded-xl border border-[#F0EEF8]">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} style={{ color: primaryColor }} />
                        <span className="font-bold text-[#1A1A2E]">
                          {exam.examStartDate ? new Date(exam.examStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                        </span>
                      </div>
                      {exam.examEndDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} className="opacity-50" />
                          <span>Ends: {new Date(exam.examEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-6 py-4 border-t border-[#F0EEF8] bg-gray-50 flex justify-end">
                    <button 
                      onClick={() => confirmDelete(exam)}
                      className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                    >
                      <Trash2 size={14} /> Remove Exam
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- ADD EXAM MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Exam">
        <form onSubmit={handleSaveExam} className="space-y-6">
          
          <FormInput 
            label="Exam Title" 
            placeholder="e.g. Half-Yearly Mathematics" 
            required 
            value={examForm.examName} 
            onChange={(v: string) => setExamForm({ ...examForm, examName: v })} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput 
              label="Start Date" 
              type="date" 
              required 
              value={examForm.examDate} 
              onChange={(v: string) => setExamForm({ ...examForm, examDate: v })} 
            />
            <FormInput 
              label="End Date (Optional)" 
              type="date" 
              value={examForm.examEndDate} 
              onChange={(v: string) => setExamForm({ ...examForm, examEndDate: v })} 
            />
          </div>

          <FormTextarea 
            label="Description / Instructions" 
            placeholder="e.g. Chapters 1 to 5. Bring geometry boxes. No calculators allowed." 
            value={examForm.description} 
            onChange={(v: string) => setExamForm({ ...examForm, description: v })} 
          />

          <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>
              {submitting ? 'Scheduling...' : 'Schedule Exam'}
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
            <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{examToDelete?.examName}"?</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to remove this exam? This action cannot be undone and will remove it from the schedule.
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
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
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