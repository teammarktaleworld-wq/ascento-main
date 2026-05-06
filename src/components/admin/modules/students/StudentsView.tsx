// // 'use client';

// // import React from 'react';
// // import { Plus } from 'lucide-react';
// // import StudentsTable from "./StudentsTable";
// // import GradientButton from "@/components/admin/ui/GradientButton";
// // import Card from "@/components/admin/ui/Card";

// // export default function StudentsView() {
// //   return (
// //     <div className="space-y-6 animate-fade-in">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-[#1A1A2E]">Students Directory</h2>
// //           <p className="text-sm text-gray-500 mt-1">Manage enrollments, grades, and profiles.</p>
// //         </div>
// //         <GradientButton icon={Plus}>
// //           Add Student
// //         </GradientButton>
// //       </div>

// //       {/* Table Container wrapped in the themed Card component */}
// //       <Card className="overflow-hidden bg-white">
// //         <StudentsTable />
// //       </Card>
// //     </div>
// //   );
// // }

















// 'use client';

// import React, { useState, useMemo } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Edit, 
//   Trash2, 
//   X, 
//   AlertCircle 
// } from 'lucide-react';

// /**
//  * ==========================================
//  * TYPES & MOCK DATA
//  * ==========================================
//  */
// type StudentStatus = 'Active' | 'Pending' | 'Inactive';

// interface Student {
//   id: string;
//   name: string;
//   parentName: string;
//   level: string;
//   status: StudentStatus;
//   avatar: string;
// }

// const INITIAL_STUDENTS: Student[] = [
//   { id: 'ASC-2026-001', name: 'Aarav Sharma', parentName: 'Rajesh Sharma', level: 'Level 2', status: 'Active', avatar: 'A' },
//   { id: 'ASC-2026-002', name: 'Diya Patel', parentName: 'Meera Patel', level: 'Level 1', status: 'Pending', avatar: 'D' },
//   { id: 'ASC-2026-003', name: 'Rohan Gupta', parentName: 'Amit Gupta', level: 'Level 3', status: 'Active', avatar: 'R' },
//   { id: 'ASC-2026-004', name: 'Myra Singh', parentName: 'Priya Singh', level: 'Level 1', status: 'Active', avatar: 'M' },
// ];

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

// const GradientButton = ({ children, onClick, icon: Icon, className="", type="button" }: any) => (
//   <button 
//     type={type}
//     onClick={onClick}
//     className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 ${className}`}
//   >
//     {Icon && <Icon size={18} />}
//     {children}
//   </button>
// );

// const Badge = ({ status }: { status: StudentStatus | string }) => {
//   const styles: Record<string, string> = {
//     Active: 'bg-[#4ECDC4]/10 text-[#4ECDC4]',
//     Pending: 'bg-[#FFB347]/10 text-[#FFB347]',
//     Inactive: 'bg-[#FF6B6B]/10 text-[#FF6B6B]',
//   };
//   return (
//     <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
//       {status}
//     </span>
//   );
// };

// const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
//       <div 
//         className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center p-6 border-b border-[#F0EEF8] bg-[#FFFDF7]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// /**
//  * ==========================================
//  * MAIN CRUD COMPONENT
//  * ==========================================
//  */
// export default function StudentsView() {
//   const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
//   // Search & Filter State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [levelFilter, setLevelFilter] = useState('All Levels');

//   // Modal & Form State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState<Student | null>(null);
//   const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

//   // Form Fields
//   const [formData, setFormData] = useState({
//     name: '',
//     parentName: '',
//     level: 'Level 1',
//     status: 'Active' as StudentStatus
//   });

//   // --- Handlers ---
//   const handleOpenModal = (student?: Student) => {
//     if (student) {
//       setEditingStudent(student);
//       setFormData({
//         name: student.name,
//         parentName: student.parentName,
//         level: student.level,
//         status: student.status
//       });
//     } else {
//       setEditingStudent(null);
//       setFormData({ name: '', parentName: '', level: 'Level 1', status: 'Active' });
//     }
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingStudent(null);
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingStudent) {
//       // Update existing
//       setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData, avatar: formData.name.charAt(0).toUpperCase() } : s));
//     } else {
//       // Create new
//       const newStudent: Student = {
//         id: `ASC-2026-${String(students.length + 1).padStart(3, '0')}`,
//         ...formData,
//         avatar: formData.name.charAt(0).toUpperCase()
//       };
//       setStudents([newStudent, ...students]);
//     }
//     handleCloseModal();
//   };

//   const confirmDelete = (id: string) => {
//     setStudentToDelete(id);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDelete = () => {
//     if (studentToDelete) {
//       setStudents(students.filter(s => s.id !== studentToDelete));
//       setIsDeleteModalOpen(false);
//       setStudentToDelete(null);
//     }
//   };

//   // --- Filtering Logic ---
//   const filteredStudents = useMemo(() => {
//     return students.filter(student => {
//       const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                             student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesLevel = levelFilter === 'All Levels' || student.level === levelFilter;
//       return matchesSearch && matchesLevel;
//     });
//   }, [students, searchQuery, levelFilter]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">Manage enrollments, grades, and profiles.</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => handleOpenModal()}>
//           Add Student
//         </GradientButton>
//       </div>

//       {/* --- TABLE CARD --- */}
//       <Card className="overflow-visible">
        
//         {/* Toolbar (Search & Filters) */}
//         <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-4 bg-[#FFFDF7]">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search students by name, ID, or parent..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
//             />
//           </div>
//           <select 
//             value={levelFilter}
//             onChange={(e) => setLevelFilter(e.target.value)}
//             className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 shadow-sm cursor-pointer"
//           >
//             <option>All Levels</option>
//             <option>Level 1</option>
//             <option>Level 2</option>
//             <option>Level 3</option>
//           </select>
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//               <tr>
//                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student Details</th>
//                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Parent / Guardian</th>
//                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Current Level</th>
//                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
//                 <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#F0EEF8]">
//               {filteredStudents.length > 0 ? (
//                 filteredStudents.map((student) => (
//                   <tr key={student.id} className="hover:bg-[#FFFDF7] transition-colors group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-[#4ECDC4]/20 flex-shrink-0">
//                           {student.avatar}
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{student.name}</p>
//                           <p className="text-xs text-gray-400 font-medium font-mono">{student.id}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-600">{student.parentName}</td>
//                     <td className="px-6 py-4">
//                       <span className="text-sm font-black text-[#A78BFA] bg-[#A78BFA]/10 px-3 py-1.5 rounded-lg border border-[#A78BFA]/20">
//                         {student.level}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4"><Badge status={student.status} /></td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button 
//                           onClick={() => handleOpenModal(student)}
//                           className="p-2 text-gray-400 hover:text-[#FFB347] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FFB347]/30 hover:bg-[#FFB347]/10 transition-all shadow-sm"
//                           title="Edit"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button 
//                           onClick={() => confirmDelete(student.id)}
//                           className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10 transition-all shadow-sm"
//                           title="Delete"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-16 text-center">
//                     <div className="flex flex-col items-center justify-center text-gray-400">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                         <Search size={24} className="text-gray-300" />
//                       </div>
//                       <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
//                       <p className="text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination Footer */}
//         <div className="p-5 border-t border-[#F0EEF8] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FFFDF7]">
//            <span className="text-sm font-bold text-gray-400">
//              Showing <span className="text-[#1A1A2E]">{filteredStudents.length}</span> results
//            </span>
//            <div className="flex gap-2">
//               <button className="px-4 py-2 border border-[#F0EEF8] rounded-xl text-sm font-bold text-gray-500 hover:bg-white hover:text-[#1A1A2E] hover:shadow-sm transition-all disabled:opacity-50">Prev</button>
//               <button className="px-4 py-2 border border-[#F0EEF8] rounded-xl text-sm font-bold text-gray-500 hover:bg-white hover:text-[#1A1A2E] hover:shadow-sm transition-all bg-white shadow-sm">Next</button>
//            </div>
//         </div>
//       </Card>

//       {/* --- ADD/EDIT MODAL --- */}
//       <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStudent ? "Edit Student Details" : "Register New Student"}>
//         <form onSubmit={handleSave} className="space-y-5">
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Student Full Name</label>
//             <input 
//               type="text" required
//               value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
//               className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] transition-colors"
//               placeholder="e.g. Arjun Kumar"
//             />
//           </div>
          
//           <div className="space-y-1.5">
//             <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Parent / Guardian Name</label>
//             <input 
//               type="text" required
//               value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})}
//               className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] transition-colors"
//               placeholder="e.g. Ramesh Kumar"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Enrollment Level</label>
//               <select 
//                 value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] transition-colors appearance-none"
//               >
//                 <option>Level 1</option>
//                 <option>Level 2</option>
//                 <option>Level 3</option>
//                 <option>Level 4</option>
//               </select>
//             </div>
            
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Status</label>
//               <select 
//                 value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as StudentStatus})}
//                 className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] transition-colors appearance-none"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <div className="pt-6 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button 
//               type="button" 
//               onClick={handleCloseModal}
//               className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </button>
//             <GradientButton type="submit" className="w-full sm:w-auto">
//               {editingStudent ? 'Save Changes' : 'Register Student'}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* --- DELETE CONFIRMATION MODAL --- */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
//             <AlertCircle size={32} />
//           </div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove Student Record?</h4>
//             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
//               Are you sure you want to delete this student? This action cannot be undone and will remove all associated grades and attendance records.
//             </p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button 
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
//             >
//               Keep Record
//             </button>
//             <button 
//               onClick={handleDelete}
//               className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] shadow-[0_4px_15px_rgba(255,107,107,0.3)] hover:bg-red-500 transition-colors"
//             >
//               Yes, Delete
//             </button>
//           </div>
//         </div>
//       </Modal>

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
  Loader2
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
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const Badge = ({ text, color }: { text: string; color: string }) => (
  <span 
    style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
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

// Form Inputs tailored to Ascento Theme
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
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
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
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer"
    >
      <option value="">Select…</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

/**
 * ==========================================
 * MAIN STUDENTS VIEW
 * ==========================================
 */
export default function StudentsView() {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All Classes');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [studentForm, setStudentForm] = useState<any>({});

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchStudents = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/students?search=${encodeURIComponent(q)}&limit=50`);
      setStudentsData(res.students ?? []);
    } catch { 
      showToast("Failed to load students"); 
    }
    setLoading(false);
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const t = setTimeout(() => fetchStudents(studentSearch), 350);
    return () => clearTimeout(t);
  }, [studentSearch, fetchStudents]);

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setStudentForm({});
    setIsModalOpen(true);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.firstName || !studentForm.lastName) { 
      showToast("First and last name are required"); 
      return; 
    }
    if (!studentForm.email) { 
      showToast("Email is required"); 
      return; 
    }
    
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/students", {
        method: "POST",
        body: JSON.stringify({
          fullName: `${studentForm.firstName} ${studentForm.lastName}`,
          email: studentForm.email,
          dateOfBirth: studentForm.dateOfBirth,
          gender: studentForm.gender,
          bloodGroup: studentForm.bloodGroup,
          rollNumber: studentForm.rollNumber,
          parentName: studentForm.parentName,
          parentPhone: studentForm.parentPhone,
          parentEmail: studentForm.parentEmail,
          address: studentForm.address,
          city: studentForm.city,
          state: studentForm.state,
          sectionId: studentForm.sectionId,
          academicYear: studentForm.academicYear,
        }),
      });
      showToast("Student added successfully! 🎒");
      setStudentForm({});
      setIsModalOpen(false);
      fetchStudents(studentSearch);
    } catch (err: any) { 
      showToast(err.message || "Failed to add student"); 
    }
    setSubmitting(false);
  };

  const confirmDelete = (student: any) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
      showToast("Student deleted successfully");
      fetchStudents(studentSearch);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch {
      showToast("Failed to delete student");
    }
    setSubmitting(false);
  };

  // --- Local Filtering (for Class Level) ---
  const filteredStudents = useMemo(() => {
    if (levelFilter === 'All Classes') return studentsData;
    return studentsData.filter(s => {
      const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
      return className.includes(levelFilter) || levelFilter.includes(className);
    });
  }, [studentsData, levelFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} enrolled students</p>
        </div>
        <GradientButton icon={Plus} onClick={handleOpenAddModal}>
          Add Student
        </GradientButton>
      </div>

      {/* --- TABLE CARD --- */}
      <Card className="overflow-visible">
        
        {/* Toolbar (Search & Filters) */}
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-4 bg-[#FFFDF7]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or parent..." 
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
            />
          </div>
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 shadow-sm cursor-pointer appearance-none"
          >
            <option>All Classes</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
            <option>Level 1</option>
            <option>Level 2</option>
          </select>
        </div>

        {/* Data Table */}
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
                  {["ID", "Student Details", "Class / Roll", "Attendance", "Fees Status", "Parent", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => {
                    const latestFee = s.fees?.[0];
                    const attendancePct = s.attendance?.length 
                      ? Math.round(s.attendance.filter((a: any) => a.status === "present").length / s.attendance.length * 100) 
                      : null;
                    const className = s.enrollments?.[0]?.section?.class?.name ?? "—";
                    const avatarGradients = ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"];
                    const avatarBg = avatarGradients[i % 3];

                    return (
                      <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                        <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono">
                          {s.studentId || s.id.substring(0,6)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div 
                              style={{ background: avatarBg }}
                              className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-black shadow-md flex-shrink-0"
                            >
                              {s.fullName?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{s.fullName}</p>
                              <p className="text-xs text-gray-400 font-medium">{s.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-black text-[#A78BFA] bg-[#A78BFA]/10 px-3 py-1 rounded-lg border border-[#A78BFA]/20 w-max mb-1">
                            {className}
                          </div>
                          <span className="text-xs text-gray-500 font-medium ml-1">Roll: {s.rollNumber ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          {attendancePct !== null ? (
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-1.5 bg-[#FFF0E8] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${attendancePct >= 90 ? "bg-[#4ECDC4]" : "bg-[#FFB347]"}`} 
                                  style={{ width: `${attendancePct}%` }} 
                                />
                              </div>
                              <span className="text-xs font-black text-[#1A1A2E]">{attendancePct}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            text={latestFee?.paymentStatus === "paid" ? "Paid" : "Pending"} 
                            color={latestFee?.paymentStatus === "paid" ? "#4ECDC4" : "#FF6B6B"} 
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                          {s.parentName ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => confirmDelete(s)}
                            className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Search size={24} className="text-gray-300" />
                        </div>
                        <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                        <p className="text-sm mt-1">Try adjusting your search or add a new student.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* --- ADD STUDENT MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form onSubmit={handleAddStudent} className="space-y-6">
          
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="First Name" placeholder="Aarav" required value={studentForm.firstName} onChange={(v: string) => setStudentForm({ ...studentForm, firstName: v })} />
              <FormInput label="Last Name" placeholder="Sharma" required value={studentForm.lastName} onChange={(v: string) => setStudentForm({ ...studentForm, lastName: v })} />
              <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={studentForm.email} onChange={(v: string) => setStudentForm({ ...studentForm, email: v })} />
              <FormInput label="Date of Birth" type="date" required value={studentForm.dateOfBirth} onChange={(v: string) => setStudentForm({ ...studentForm, dateOfBirth: v })} />
              <FormSelect label="Gender" options={["Male", "Female", "Other"]} required value={studentForm.gender} onChange={(v: string) => setStudentForm({ ...studentForm, gender: v })} />
              <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={studentForm.bloodGroup} onChange={(v: string) => setStudentForm({ ...studentForm, bloodGroup: v })} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#4ECDC4] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Roll Number" placeholder="01" value={studentForm.rollNumber} onChange={(v: string) => setStudentForm({ ...studentForm, rollNumber: v })} />
              <FormInput label="Section ID" placeholder="SEC-A" value={studentForm.sectionId} onChange={(v: string) => setStudentForm({ ...studentForm, sectionId: v })} />
              <FormInput label="Academic Year" placeholder="2025-2026" value={studentForm.academicYear} onChange={(v: string) => setStudentForm({ ...studentForm, academicYear: v })} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Parent Name" placeholder="Rahul Sharma" required value={studentForm.parentName} onChange={(v: string) => setStudentForm({ ...studentForm, parentName: v })} />
              <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX" value={studentForm.parentPhone} onChange={(v: string) => setStudentForm({ ...studentForm, parentPhone: v })} />
              <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={studentForm.parentEmail} onChange={(v: string) => setStudentForm({ ...studentForm, parentEmail: v })} />
              <FormInput label="City" placeholder="Indore" value={studentForm.city} onChange={(v: string) => setStudentForm({ ...studentForm, city: v })} />
              <FormInput label="State" placeholder="Madhya Pradesh" value={studentForm.state} onChange={(v: string) => setStudentForm({ ...studentForm, state: v })} />
            </div>
            <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={studentForm.address} onChange={(v: string) => setStudentForm({ ...studentForm, address: v })} />
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
              {submitting ? 'Registering...' : 'Register Student'}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to delete this student? This action cannot be undone and will remove all associated grades and attendance records.
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

      {/* --- LOCAL TOAST (Matches Monolithic Style) --- */}
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