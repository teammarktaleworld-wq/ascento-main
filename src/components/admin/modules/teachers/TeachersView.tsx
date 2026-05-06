// export default function TeachersView() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold">Teachers</h2>
//       <div className="mt-4 bg-white p-6 rounded-xl border">
//         Teachers Table Here
//       </div>
//     </div>
//   );
// }










'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  AlertCircle,
  Loader2,
  Edit,
  Mail,
  Phone,
  Briefcase,
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
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#4ECDC4] transition-colors"
    />
  </div>
);

/**
 * ==========================================
 * MAIN TEACHERS VIEW
 * ==========================================
 */
export default function TeachersView() {
  const [teachersData, setTeachersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [teacherForm, setTeacherForm] = useState<any>({});

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/teachers");
      setTeachersData(res ?? []);
    } catch { 
      showToast("Failed to load teachers"); 
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // --- Handlers ---
  const handleOpenModal = (teacher?: any) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({
        name: teacher.name,
        email: teacher.user?.email || teacher.email,
        phone: teacher.phone,
        experience: teacher.experience,
        subjects: teacher.subjects?.map((s: any) => s.subject?.name || s.name).join(', ') || ''
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({ name: '', email: '', phone: '', experience: '', subjects: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email) { 
      showToast("Name and email are required"); 
      return; 
    }
    
    setSubmitting(true);
    try {
      const endpoint = editingTeacher ? `/api/admin/teachers/${editingTeacher.id}` : "/api/admin/teachers";
      const method = editingTeacher ? "PATCH" : "POST";
      
      await apiFetch(endpoint, {
        method,
        body: JSON.stringify({
          name: teacherForm.name,
          email: teacherForm.email,
          phone: teacherForm.phone,
          experience: teacherForm.experience,
          subjects: teacherForm.subjects // Backend should handle comma-separated string or array
        }),
      });
      
      showToast(editingTeacher ? "Teacher updated successfully! ✨" : "Teacher added successfully! 🧑‍🏫");
      setTeacherForm({});
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) { 
      showToast(err.message || `Failed to ${editingTeacher ? 'update' : 'add'} teacher`); 
    }
    setSubmitting(false);
  };

  const confirmDelete = (teacher: any) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/teachers/${teacherToDelete.id}`, { method: "DELETE" });
      showToast("Teacher removed successfully");
      fetchTeachers();
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch {
      showToast("Failed to remove teacher");
    }
    setSubmitting(false);
  };

  // --- Local Filtering ---
  const filteredTeachers = useMemo(() => {
    return teachersData.filter(t => {
      const name = t.name || '';
      const email = t.user?.email || t.email || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [teachersData, searchQuery]);

  // Color palette for avatars
  const gradients = [
    "linear-gradient(135deg,#FF6B6B,#FFB347)", 
    "linear-gradient(135deg,#4ECDC4,#45B7AA)", 
    "linear-gradient(135deg,#A78BFA,#7C3AED)", 
    "linear-gradient(135deg,#F06292,#E91E63)"
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Teachers Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{teachersData.length} faculty members</p>
        </div>
        <GradientButton icon={Plus} onClick={() => handleOpenModal()}>
          Add Teacher
        </GradientButton>
      </div>

      {/* --- TOOLBAR --- */}
      <Card className="p-5 flex flex-col sm:flex-row gap-4 bg-[#FFFDF7]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 transition-all shadow-sm"
          />
        </div>
      </Card>

      {/* --- TEACHERS GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#4ECDC4]">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-sm font-bold text-gray-500">Loading faculty data...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <p className="text-base font-bold text-[#1A1A2E]">No teachers found</p>
          <p className="text-sm mt-1 text-gray-500">Try adjusting your search or add a new faculty member.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeachers.map((t: any, i: number) => {
            const avatarBg = gradients[i % gradients.length];
            const email = t.user?.email || t.email || "No email provided";
            const subjects = t.subjects || [];

            return (
              <Card key={t.id} className="p-6 flex flex-col group hover:border-[#4ECDC4]/30 hover:shadow-[0_8px_30px_rgba(78,205,196,0.1)] transition-all">
                
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    style={{ background: avatarBg }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md flex-shrink-0"
                  >
                    {t.name?.[0]?.toUpperCase() ?? "T"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-[#1A1A2E] truncate group-hover:text-[#4ECDC4] transition-colors">{t.name}</h3>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="opacity-70" /> {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400">
                      <Phone size={12} />
                    </div>
                    <span className="font-medium">{t.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400">
                      <Briefcase size={12} />
                    </div>
                    <span className="font-medium">{t.experience ? `${t.experience} Experience` : "—"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EEF8] mb-6">
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <BookOpen size={12} /> Subjects
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.length > 0 ? (
                       subjects.map((s: any, idx: number) => (
                         <Badge key={idx} text={s.subject?.name || s.name} color="#A78BFA" />
                       ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-auto">
                  <button 
                    onClick={() => handleOpenModal(t)}
                    className="flex-1 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit size={14} /> Edit Profile
                  </button>
                  <button 
                    onClick={() => confirmDelete(t)}
                    className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] transition-colors"
                    title="Remove Teacher"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* --- ADD/EDIT TEACHER MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeacher ? "Edit Teacher Profile" : "Register New Teacher"}>
        <form onSubmit={handleSaveTeacher} className="space-y-6">
          
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#4ECDC4] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" placeholder="e.g. Mrs. Bhavna Tomar" required value={teacherForm.name} onChange={(v: string) => setTeacherForm({ ...teacherForm, name: v })} />
              <FormInput label="Email Address" type="email" placeholder="teacher@ascento.edu" required value={teacherForm.email} onChange={(v: string) => setTeacherForm({ ...teacherForm, email: v })} />
              <FormInput label="Phone Number" placeholder="+91 98111 XXXXX" value={teacherForm.phone} onChange={(v: string) => setTeacherForm({ ...teacherForm, phone: v })} />
              <FormInput label="Years of Experience" placeholder="e.g. 8 years" value={teacherForm.experience} onChange={(v: string) => setTeacherForm({ ...teacherForm, experience: v })} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Profile</h4>
            <FormInput 
              label="Subject Specializations (Comma Separated)" 
              placeholder="e.g. Mathematics, Abacus Level 1" 
              value={teacherForm.subjects} 
              onChange={(v: string) => setTeacherForm({ ...teacherForm, subjects: v })} 
            />
          </div>

          <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : (editingTeacher ? Edit : Plus)}>
              {submitting ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Register Teacher')}
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
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {teacherToDelete?.name}?</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to remove this faculty member? They will lose access to the portal and their classes will be unassigned.
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
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AA] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(78,205,196,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4ECDC444; border-radius: 6px; }
      `}}/>
    </div>
  );
}