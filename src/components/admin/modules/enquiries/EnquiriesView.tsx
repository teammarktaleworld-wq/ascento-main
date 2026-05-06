// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Search, 
//   Loader2,
//   Mail,
//   Phone,
//   MessageCircle,
//   Trash2,
//   X,
//   RefreshCw,
//   Users,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   Inbox
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

// const Badge = ({ text, color = "#FFB347" }: { text: string; color?: string }) => (
//   <span 
//     style={{ background: color + "15", color, border: `1px solid ${color}30` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block"
//   >
//     {text}
//   </span>
// );

// const ENQUIRY_STATUSES = ["New", "Follow-up", "Enrolled", "Closed"];
// const statusColor: Record<string, string> = {
//   "New": "#4ECDC4",      // Teal
//   "Follow-up": "#FFB347", // Orange
//   "Enrolled": "#A78BFA",  // Purple
//   "Closed": "#999999",    // Gray
// };

// /**
//  * ==========================================
//  * MAIN ENQUIRIES VIEW
//  * ==========================================
//  */
// export default function EnquiriesView() {
//   // Data States
//   const [enquiriesData, setEnquiriesData] = useState<any[]>([]);
//   const [contactEnquiriesData, setContactEnquiriesData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
  
//   // UI States
//   const [enquiryTab, setEnquiryTab] = useState<"contact" | "crm">("contact");
//   const [enquiryFilter, setEnquiryFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
//   const [toast, setToast] = useState<string | null>(null);

//   const showToast = (msg: string) => { 
//     setToast(msg); 
//     setTimeout(() => setToast(null), 3000); 
//   };

//   // --- API Integrations ---
//   const fetchEnquiries = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [crm, contact] = await Promise.all([
//         apiFetch("/api/admin/enquiries").catch(() => []),
//         apiFetch("/api/admin/contact-enquiries").catch(() => []),
//       ]);
//       setEnquiriesData(Array.isArray(crm) ? crm : []);
//       setContactEnquiriesData(Array.isArray(contact) ? contact : []);
//     } catch { 
//       showToast("Failed to load enquiries"); 
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [fetchEnquiries]);

//   // --- Handlers ---
//   const handleUpdateStatus = async (id: string, status: string) => {
//     setUpdatingStatus(true);
//     try {
//       await apiFetch(`/api/admin/enquiries/${id}`, {
//         method: "PATCH",
//         body: JSON.stringify({ status }),
//       });
//       showToast(`Status updated to "${status}"`);
//       setSelectedEnquiry((prev: any) => prev ? { ...prev, status } : null);
//       fetchEnquiries();
//     } catch { 
//       showToast("Failed to update status"); 
//     }
//     setUpdatingStatus(false);
//   };

//   const handleDelete = async (id: string, type: "crm" | "contact") => {
//     if (!confirm("Delete this enquiry? This action cannot be undone.")) return;
//     try {
//       if (type === "crm") {
//         await apiFetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
//       } else {
//         await apiFetch(`/api/admin/contact-enquiries?id=${id}`, { method: "DELETE" });
//       }
//       showToast("Enquiry deleted successfully 🗑️");
//       setSelectedEnquiry(null);
//       fetchEnquiries();
//     } catch { 
//       showToast("Failed to delete enquiry"); 
//     }
//   };

//   // --- Derived Data & Filtering ---
//   const isContact = enquiryTab === "contact";
//   const rawList = isContact ? contactEnquiriesData : enquiriesData;

//   const filteredEnquiries = useMemo(() => {
//     return rawList.filter(e => {
//       const searchTarget = `${e.name || ''} ${e.studentName || ''} ${e.phone || ''} ${e.email || ''}`.toLowerCase();
//       const matchesSearch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());
      
//       const matchesFilter = isContact || enquiryFilter === "All" || e.status === enquiryFilter;
      
//       return matchesSearch && matchesFilter;
//     }).sort((a, b) => {
//       const dateA = new Date(a.submittedAt || a.createdAt || 0).getTime();
//       const dateB = new Date(b.submittedAt || b.createdAt || 0).getTime();
//       return dateB - dateA; // Newest first
//     });
//   }, [rawList, searchQuery, enquiryFilter, isContact]);

//   // Stats Calculations
//   const contactStats = useMemo(() => ({
//     total: contactEnquiriesData.length,
//     enrol: contactEnquiriesData.filter(e => e.reason === "Enrol My Child").length,
//     trial: contactEnquiriesData.filter(e => e.reason === "Book a Free Trial").length,
//     franchise: contactEnquiriesData.filter(e => e.reason === "Franchise Enquiry").length,
//   }), [contactEnquiriesData]);

//   const crmStats = useMemo(() => ({
//     total: enquiriesData.length,
//     new: enquiriesData.filter(e => e.status === "New").length,
//     followUp: enquiriesData.filter(e => e.status === "Follow-up").length,
//     enrolled: enquiriesData.filter(e => e.status === "Enrolled").length,
//   }), [enquiriesData]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-[#FFB347]/10 text-[#FFB347] rounded-xl">
//               <Inbox size={24} />
//             </div>
//             Enquiries & Leads
//           </h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">Manage website contact forms and CRM admission leads.</p>
//         </div>
//         <button 
//           onClick={fetchEnquiries}
//           className="px-5 py-2.5 bg-white border border-[#F0EEF8] text-[#1A1A2E] font-bold rounded-xl shadow-sm hover:border-[#FFB347] hover:text-[#FFB347] transition-all flex items-center gap-2"
//         >
//           <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//           Refresh
//         </button>
//       </div>

//       {/* --- STATS GRID --- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {isContact ? (
//           <>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,107,107,0.3)]"><Mail size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Forms</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.total}</h3>
//               <p className="text-xs text-gray-500 font-medium">Website submissions</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(78,205,196,0.3)]"><Users size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enrol Requests</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.enrol}</h3>
//               <p className="text-xs text-gray-500 font-medium">Want to join</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(167,139,250,0.3)]"><Clock size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Trial Bookings</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.trial}</h3>
//               <p className="text-xs text-gray-500 font-medium">Free trial requested</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FFD700] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,179,71,0.3)]"><Building2 size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Franchise</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.franchise}</h3>
//               <p className="text-xs text-gray-500 font-medium">Business inquiries</p>
//             </Card>
//           </>
//         ) : (
//           <>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,107,107,0.3)]"><Users size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total CRM Leads</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.total}</h3>
//               <p className="text-xs text-gray-500 font-medium">All recorded leads</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(78,205,196,0.3)]"><AlertCircle size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">New Leads</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.new}</h3>
//               <p className="text-xs text-gray-500 font-medium">Needs attention</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FFD700] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,179,71,0.3)]"><Phone size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Follow-up</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.followUp}</h3>
//               <p className="text-xs text-gray-500 font-medium">In progress</p>
//             </Card>
//             <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(167,139,250,0.3)]"><CheckCircle2 size={20} /></div>
//               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enrolled</p>
//               <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.enrolled}</h3>
//               <p className="text-xs text-gray-500 font-medium">Successfully converted</p>
//             </Card>
//           </>
//         )}
//       </div>

//       {/* --- TOOLBAR: TABS & FILTERS --- */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
//         {/* Tab Switcher */}
//         <div className="flex p-1.5 bg-white rounded-2xl border border-[#F0EEF8] shadow-sm w-full sm:w-auto">
//           {(["contact", "crm"] as const).map(tab => (
//             <button
//               key={tab}
//               onClick={() => { 
//                 setEnquiryTab(tab); 
//                 setSelectedEnquiry(null); 
//                 setEnquiryFilter("All"); 
//                 setSearchQuery(""); 
//               }}
//               className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
//                 enquiryTab === tab 
//                   ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white shadow-md' 
//                   : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A2E]'
//               }`}
//             >
//               {tab === "contact" ? "📬 Website Forms" : "📋 CRM Leads"}
//             </button>
//           ))}
//         </div>

//         {/* Search & Status Filters */}
//         <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//           <div className="relative flex-1 sm:min-w-[250px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               placeholder="Search name, phone, email..."
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
//             />
//           </div>
          
//           {!isContact && (
//             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
//               {["All", ...ENQUIRY_STATUSES].map(s => {
//                 const isActive = enquiryFilter === s;
//                 const color = s === "All" ? "#1A1A2E" : statusColor[s];
//                 return (
//                   <button
//                     key={s}
//                     onClick={() => setEnquiryFilter(s)}
//                     style={{
//                       backgroundColor: isActive ? `${color}15` : 'white',
//                       borderColor: isActive ? color : '#F0EEF8',
//                       color: isActive ? color : '#777777'
//                     }}
//                     className="px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-sm hover:bg-gray-50"
//                   >
//                     {s}
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- MAIN SPLIT LAYOUT (LIST + DETAILS) --- */}
//       <div className={`grid gap-6 items-start transition-all duration-500 ${selectedEnquiry ? 'lg:grid-cols-[1fr_400px]' : 'grid-cols-1'}`}>
        
//         {/* LEFT PANE: ENQUIRY LIST */}
//         <Card className="overflow-hidden min-h-[400px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
//               <Loader2 className="animate-spin mb-4" size={32} />
//               <p className="text-sm font-bold text-gray-500">Loading leads...</p>
//             </div>
//           ) : filteredEnquiries.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-64 text-center p-8">
//               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                 <Search size={24} className="text-gray-300" />
//               </div>
//               <p className="text-lg font-bold text-[#1A1A2E] mb-1">No records found</p>
//               <p className="text-sm text-gray-500">
//                 {isContact ? "No website form submissions match your criteria." : "No CRM leads match your criteria."}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
//                   <tr>
//                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Name</th>
//                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{isContact ? "Reason" : "Course"}</th>
//                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
//                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{isContact ? "Submitted" : "Status"}</th>
//                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#F0EEF8]">
//                   {filteredEnquiries.map((e, i) => {
//                     const isSelected = selectedEnquiry?.id === e.id;
//                     const name = e.name || e.studentName || "—";
//                     const date = e.submittedAt || e.createdAt;
//                     const avatarGradients = ["from-[#FF6B6B] to-[#FFB347]", "from-[#4ECDC4] to-[#45B7AA]", "from-[#A78BFA] to-[#7C3AED]"];
//                     const gradient = avatarGradients[i % 3];

//                     return (
//                       <tr 
//                         key={e.id} 
//                         onClick={() => setSelectedEnquiry(isSelected ? null : { ...e, _type: enquiryTab })}
//                         className={`transition-colors cursor-pointer group ${isSelected ? 'bg-[#FFB347]/5' : 'hover:bg-[#FFFDF7]'}`}
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             {isSelected && <div className="absolute left-0 w-1 h-12 bg-[#FF6B6B] rounded-r-md"></div>}
//                             <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm`}>
//                               {name[0]?.toUpperCase()}
//                             </div>
//                             <div>
//                               <p className={`text-sm font-bold transition-colors ${isSelected ? 'text-[#FF6B6B]' : 'text-[#1A1A2E] group-hover:text-[#FF6B6B]'}`}>{name}</p>
//                               <p className="text-xs text-gray-400 font-medium">{e.email || "No email"}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm font-bold text-gray-600">
//                           {e.reason || e.course || "—"}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-bold text-[#1A1A2E]">
//                           {e.phone || "—"}
//                         </td>
//                         <td className="px-6 py-4">
//                           {isContact ? (
//                             <span className="text-xs font-bold text-gray-500">
//                               {date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
//                             </span>
//                           ) : (
//                             <Badge text={e.status || "New"} color={statusColor[e.status] || "#4ECDC4"} />
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <button
//                             onClick={(ev) => {
//                               ev.stopPropagation();
//                               handleDelete(e.id, enquiryTab === "contact" ? "contact" : "crm");
//                             }}
//                             className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10 transition-all shadow-sm opacity-0 group-hover:opacity-100"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>

//         {/* RIGHT PANE: DETAILS PANEL */}
//         {selectedEnquiry && (
//           <Card className="sticky top-24 animate-in slide-in-from-right-8 duration-300">
//             {/* Panel Header */}
//             <div className="p-6 border-b border-[#F0EEF8] bg-gradient-to-r from-[#FF6B6B]/5 to-[#FFB347]/5 flex justify-between items-center">
//               <h3 className="text-lg font-black text-[#1A1A2E]">Enquiry Details</h3>
//               <button 
//                 onClick={() => setSelectedEnquiry(null)} 
//                 className="p-1.5 text-gray-400 hover:text-[#FF6B6B] hover:bg-white rounded-lg transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
              
//               {/* Profile Header */}
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white font-black text-xl shadow-md">
//                   {(selectedEnquiry.name || selectedEnquiry.studentName || "?")[0]?.toUpperCase()}
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-black text-[#1A1A2E] leading-tight">
//                     {selectedEnquiry.name || selectedEnquiry.studentName || "—"}
//                   </h4>
//                   <p className="text-sm text-gray-500 font-medium mt-0.5">
//                     {selectedEnquiry.email || "No email provided"}
//                   </p>
//                 </div>
//               </div>

//               {/* Data Grid */}
//               <div className="space-y-3">
//                 {[
//                   { icon: Phone, label: "Phone", value: selectedEnquiry.phone || "—" },
//                   { icon: MessageCircle, label: isContact ? "Interest" : "Course", value: selectedEnquiry.reason || selectedEnquiry.course || "—" },
//                   ...(selectedEnquiry.childAge ? [{ icon: Users, label: "Child Age", value: selectedEnquiry.childAge }] : []),
//                   ...(selectedEnquiry.source ? [{ icon: Search, label: "Source", value: selectedEnquiry.source }] : []),
//                   { 
//                     icon: Clock, 
//                     label: "Submitted", 
//                     value: (selectedEnquiry.submittedAt || selectedEnquiry.createdAt)
//                       ? new Date(selectedEnquiry.submittedAt || selectedEnquiry.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
//                       : "—" 
//                   },
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#F0EEF8]">
//                     <item.icon size={16} className="text-[#FFB347] mt-0.5" />
//                     <div>
//                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
//                       <p className="text-sm font-bold text-[#1A1A2E]">{item.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Message Block */}
//               {selectedEnquiry.message && (
//                 <div className="p-4 bg-gray-50 rounded-xl border border-[#F0EEF8]">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</p>
//                   <p className="text-sm text-[#1A1A2E] font-medium leading-relaxed italic">
//                     "{selectedEnquiry.message}"
//                   </p>
//                 </div>
//               )}

//               {/* CRM Status Updater */}
//               {selectedEnquiry._type === "crm" && (
//                 <div className="pt-4 border-t border-[#F0EEF8]">
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Update Lead Status</p>
//                   <div className="grid grid-cols-2 gap-2">
//                     {ENQUIRY_STATUSES.map(s => {
//                       const isActive = selectedEnquiry.status === s;
//                       const color = statusColor[s];
//                       return (
//                         <button
//                           key={s}
//                           disabled={updatingStatus || isActive}
//                           onClick={() => handleUpdateStatus(selectedEnquiry.id, s)}
//                           style={{
//                             backgroundColor: isActive ? color : 'white',
//                             borderColor: isActive ? color : '#F0EEF8',
//                             color: isActive ? 'white' : color,
//                             opacity: updatingStatus ? 0.6 : 1
//                           }}
//                           className="py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:brightness-95 flex items-center justify-center gap-1"
//                         >
//                           {isActive && <CheckCircle2 size={14} />} {s}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Quick Actions */}
//               <div className="pt-4 border-t border-[#F0EEF8] space-y-2">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
                
//                 {selectedEnquiry.phone && (
//                   <>
//                     <a 
//                       href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, "")}`}
//                       target="_blank" rel="noreferrer"
//                       className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ECDC4]/10 text-[#45B7AA] border border-[#4ECDC4]/30 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#4ECDC4] hover:text-white transition-all"
//                     >
//                       <MessageCircle size={16} /> WhatsApp
//                     </a>
//                     <a 
//                       href={`tel:${selectedEnquiry.phone}`}
//                       className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#F0EEF8] text-[#1A1A2E] rounded-xl text-sm font-black uppercase tracking-wider hover:border-[#1A1A2E] transition-all shadow-sm"
//                     >
//                       <Phone size={16} /> Call Lead
//                     </a>
//                   </>
//                 )}
//                 {selectedEnquiry.email && (
//                   <a 
//                     href={`mailto:${selectedEnquiry.email}`}
//                     className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#F0EEF8] text-[#1A1A2E] rounded-xl text-sm font-black uppercase tracking-wider hover:border-[#1A1A2E] transition-all shadow-sm"
//                   >
//                     <Mail size={16} /> Send Email
//                   </a>
//                 )}
//               </div>

//             </div>
//           </Card>
//         )}
//       </div>

//       {/* --- LOCAL TOAST --- */}
//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #F0EEF8; border-radius: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FFB34766; }
//       `}}/>
//     </div>
//   );
// }











'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Loader2,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  X,
  RefreshCw,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  Building2
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

const Badge = ({ text, color = "#FFB347" }: { text: string; color?: string }) => (
  <span 
    style={{ background: color + "15", color, border: `1px solid ${color}30` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block"
  >
    {text}
  </span>
);

const ENQUIRY_STATUSES = ["New", "Follow-up", "Enrolled", "Closed"];
const statusColor: Record<string, string> = {
  "New": "#4ECDC4",
  "Follow-up": "#FFB347",
  "Enrolled": "#A78BFA",
  "Closed": "#999999",
};

/**
 * ==========================================
 * MAIN ENQUIRIES VIEW
 * ==========================================
 */
export default function EnquiriesView() {
  // Data States
  const [enquiriesData, setEnquiriesData] = useState<any[]>([]);
  const [contactEnquiriesData, setContactEnquiriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // UI States
  const [enquiryTab, setEnquiryTab] = useState<"contact" | "crm">("contact");
  const [enquiryFilter, setEnquiryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const [crm, contact] = await Promise.all([
        apiFetch("/api/admin/enquiries").catch(() => []),
        apiFetch("/api/admin/contact-enquiries").catch(() => []),
      ]);
      setEnquiriesData(Array.isArray(crm) ? crm : []);
      setContactEnquiriesData(Array.isArray(contact) ? contact : []);
    } catch { 
      showToast("Failed to load enquiries"); 
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    try {
      await apiFetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      showToast(`Status updated to "${status}"`);
      setSelectedEnquiry((prev: any) => prev ? { ...prev, status } : null);
      fetchEnquiries();
    } catch { 
      showToast("Failed to update status"); 
    }
    setUpdatingStatus(false);
  };

  const handleDelete = async (id: string, type: "crm" | "contact") => {
    if (!confirm("Delete this enquiry? This action cannot be undone.")) return;
    try {
      if (type === "crm") {
        await apiFetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      } else {
        await apiFetch(`/api/admin/contact-enquiries?id=${id}`, { method: "DELETE" });
      }
      showToast("Enquiry deleted successfully 🗑️");
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch { 
      showToast("Failed to delete enquiry"); 
    }
  };

  const isContact = enquiryTab === "contact";
  const rawList = isContact ? contactEnquiriesData : enquiriesData;

  const filteredEnquiries = useMemo(() => {
    return rawList.filter(e => {
      const searchTarget = `${e.name || ''} ${e.studentName || ''} ${e.phone || ''} ${e.email || ''}`.toLowerCase();
      const matchesSearch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());
      const matchesFilter = isContact || enquiryFilter === "All" || e.status === enquiryFilter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.submittedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [rawList, searchQuery, enquiryFilter, isContact]);

  const contactStats = useMemo(() => ({
    total: contactEnquiriesData.length,
    enrol: contactEnquiriesData.filter(e => e.reason === "Enrol My Child").length,
    trial: contactEnquiriesData.filter(e => e.reason === "Book a Free Trial").length,
    franchise: contactEnquiriesData.filter(e => e.reason === "Franchise Enquiry").length,
  }), [contactEnquiriesData]);

  const crmStats = useMemo(() => ({
    total: enquiriesData.length,
    new: enquiriesData.filter(e => e.status === "New").length,
    followUp: enquiriesData.filter(e => e.status === "Follow-up").length,
    enrolled: enquiriesData.filter(e => e.status === "Enrolled").length,
  }), [enquiriesData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#FFB347]/10 text-[#FFB347] rounded-xl">
              <Inbox size={24} />
            </div>
            Enquiries & Leads
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Manage website contact forms and CRM admission leads.
          </p>
        </div>
        <button 
          onClick={fetchEnquiries}
          className="px-5 py-2.5 bg-white border border-[#F0EEF8] text-[#1A1A2E] font-bold rounded-xl shadow-sm hover:border-[#FFB347] hover:text-[#FFB347] transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isContact ? (
          <>
            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,107,107,0.3)]">
                <Mail size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Forms</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.total}</h3>
              <p className="text-xs text-gray-500 font-medium">Website submissions</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(78,205,196,0.3)]">
                <Users size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enrol Requests</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.enrol}</h3>
              <p className="text-xs text-gray-500 font-medium">Want to join</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(167,139,250,0.3)]">
                <Clock size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Trial Bookings</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.trial}</h3>
              <p className="text-xs text-gray-500 font-medium">Free trial requested</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FFD700] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,179,71,0.3)]">
                <Building2 size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Franchise</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{contactStats.franchise}</h3>
              <p className="text-xs text-gray-500 font-medium">Business inquiries</p>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,107,107,0.3)]">
                <Users size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total CRM Leads</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.total}</h3>
              <p className="text-xs text-gray-500 font-medium">All recorded leads</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(78,205,196,0.3)]">
                <AlertCircle size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">New Leads</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.new}</h3>
              <p className="text-xs text-gray-500 font-medium">Needs attention</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB347] to-[#FFD700] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(255,179,71,0.3)]">
                <Phone size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Follow-up</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.followUp}</h3>
              <p className="text-xs text-gray-500 font-medium">In progress</p>
            </Card>

            <Card className="p-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white mb-4 shadow-[0_4px_15px_rgba(167,139,250,0.3)]">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enrolled</p>
              <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{crmStats.enrolled}</h3>
              <p className="text-xs text-gray-500 font-medium">Successfully converted</p>
            </Card>
          </>
        )}
      </div>

      {/* TOOLBAR: TABS & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-white rounded-2xl border border-[#F0EEF8] shadow-sm w-full sm:w-auto">
          {(["contact", "crm"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { 
                setEnquiryTab(tab); 
                setSelectedEnquiry(null); 
                setEnquiryFilter("All"); 
                setSearchQuery(""); 
              }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                enquiryTab === tab 
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A2E]'
              }`}
            >
              {tab === "contact" ? "📬 Website Forms" : "📋 CRM Leads"}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              placeholder="Search name, phone, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
            />
          </div>
          
          {!isContact && (
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["All", ...ENQUIRY_STATUSES].map(s => {
                const isActive = enquiryFilter === s;
                const color = s === "All" ? "#1A1A2E" : statusColor[s];
                return (
                  <button
                    key={s}
                    onClick={() => setEnquiryFilter(s)}
                    style={{
                      backgroundColor: isActive ? `${color}15` : 'white',
                      borderColor: isActive ? color : '#F0EEF8',
                      color: isActive ? color : '#777777'
                    }}
                    className="px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-sm hover:bg-gray-50"
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MAIN SPLIT LAYOUT (LIST + DETAILS) */}
      <div className={`grid gap-6 items-start transition-all duration-500 ${selectedEnquiry ? 'lg:grid-cols-[1fr_400px]' : 'grid-cols-1'}`}>
        
        {/* LEFT PANE: ENQUIRY LIST */}
        <Card className="overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-bold text-gray-500">Loading leads...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-lg font-bold text-[#1A1A2E] mb-1">No records found</p>
              <p className="text-sm text-gray-500">
                {isContact
                  ? "No website form submissions match your criteria."
                  : "No CRM leads match your criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {isContact ? "Reason" : "Course"}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {isContact ? "Submitted" : "Status"}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EEF8]">
                  {filteredEnquiries.map((e, i) => {
                    const isSelected = selectedEnquiry?.id === e.id;
                    const name = e.name || e.studentName || "—";
                    const date = e.submittedAt || e.createdAt;
                    const avatarGradients = [
                      "from-[#FF6B6B] to-[#FFB347]",
                      "from-[#4ECDC4] to-[#45B7AA]",
                      "from-[#A78BFA] to-[#7C3AED]",
                    ];
                    const gradient = avatarGradients[i % 3];

                    return (
                      <tr 
                        key={e.id} 
                        onClick={() => setSelectedEnquiry(isSelected ? null : { ...e, _type: enquiryTab })}
                        className={`transition-colors cursor-pointer group relative ${
                          isSelected ? 'bg-[#FFB347]/5' : 'hover:bg-[#FFFDF7]'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B] rounded-r-md" />
                            )}
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm`}>
                              {name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className={`text-sm font-bold transition-colors ${
                                isSelected ? 'text-[#FF6B6B]' : 'text-[#1A1A2E] group-hover:text-[#FF6B6B]'
                              }`}>
                                {name}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">{e.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-600">
                          {e.reason || e.course || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1A1A2E]">
                          {e.phone || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {isContact ? (
                            <span className="text-xs font-bold text-gray-500">
                              {date
                                ? new Date(date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </span>
                          ) : (
                            <Badge
                              text={e.status || "New"}
                              color={statusColor[e.status] || "#4ECDC4"}
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={ev => {
                              ev.stopPropagation();
                              handleDelete(
                                e.id,
                                enquiryTab === "contact" ? "contact" : "crm"
                              );
                            }}
                            className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* RIGHT PANE: DETAILS PANEL */}
        {selectedEnquiry && (
          <Card className="sticky top-24 animate-in slide-in-from-right-8 duration-300">
            {/* Panel Header */}
            <div className="p-6 border-b border-[#F0EEF8] bg-gradient-to-r from-[#FF6B6B]/5 to-[#FFB347]/5 flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1A1A2E]">Enquiry Details</h3>
              <button 
                onClick={() => setSelectedEnquiry(null)} 
                className="p-1.5 text-gray-400 hover:text-[#FF6B6B] hover:bg-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white font-black text-xl shadow-md">
                  {(selectedEnquiry.name || selectedEnquiry.studentName || "?")[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#1A1A2E] leading-tight">
                    {selectedEnquiry.name || selectedEnquiry.studentName || "—"}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                    {selectedEnquiry.email || "No email provided"}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-3">
                {[
                  { icon: Phone, label: "Phone", value: selectedEnquiry.phone || "—" },
                  { icon: MessageCircle, label: isContact ? "Interest" : "Course", value: selectedEnquiry.reason || selectedEnquiry.course || "—" },
                  ...(selectedEnquiry.childAge ? [{ icon: Users, label: "Child Age", value: selectedEnquiry.childAge }] : []),
                  ...(selectedEnquiry.source ? [{ icon: Search, label: "Source", value: selectedEnquiry.source }] : []),
                  { 
                    icon: Clock, 
                    label: "Submitted", 
                    value: (selectedEnquiry.submittedAt || selectedEnquiry.createdAt)
                      ? new Date(selectedEnquiry.submittedAt || selectedEnquiry.createdAt).toLocaleString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#F0EEF8]">
                    <item.icon size={16} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                      <p className="text-sm font-bold text-[#1A1A2E]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Block */}
              {selectedEnquiry.message && (
                <div className="p-4 bg-gray-50 rounded-xl border border-[#F0EEF8]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</p>
                  <p className="text-sm text-[#1A1A2E] font-medium leading-relaxed italic">
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              )}

              {/* CRM Status Updater */}
              {selectedEnquiry._type === "crm" && (
                <div className="pt-4 border-t border-[#F0EEF8]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Update Lead Status
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ENQUIRY_STATUSES.map(s => {
                      const isActive = selectedEnquiry.status === s;
                      const color = statusColor[s];
                      return (
                        <button
                          key={s}
                          disabled={updatingStatus || isActive}
                          onClick={() => handleUpdateStatus(selectedEnquiry.id, s)}
                          style={{
                            backgroundColor: isActive ? color : 'white',
                            borderColor: isActive ? color : '#F0EEF8',
                            color: isActive ? 'white' : color,
                            opacity: updatingStatus ? 0.6 : 1,
                          }}
                          className="py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:brightness-95 flex items-center justify-center gap-1.5"
                        >
                          {isActive && <CheckCircle2 size={13} />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-[#F0EEF8] space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Quick Actions
                </p>

                {selectedEnquiry.phone && (
                  <>
                    <a 
                      href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#4ECDC4]/10 text-[#45B7AA] border border-[#4ECDC4]/30 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#4ECDC4] hover:text-white transition-all"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <a 
                      href={`tel:${selectedEnquiry.phone}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#F0EEF8] text-[#1A1A2E] rounded-xl text-sm font-black uppercase tracking-wider hover:border-[#1A1A2E] transition-all shadow-sm"
                    >
                      <Phone size={16} /> Call Lead
                    </a>
                  </>
                )}

                {selectedEnquiry.email && (
                  <a 
                    href={`mailto:${selectedEnquiry.email}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#F0EEF8] text-[#1A1A2E] rounded-xl text-sm font-black uppercase tracking-wider hover:border-[#1A1A2E] transition-all shadow-sm"
                  >
                    <Mail size={16} /> Send Email
                  </a>
                )}

                <button
                  onClick={() => handleDelete(
                    selectedEnquiry.id,
                    selectedEnquiry._type === "contact" ? "contact" : "crm"
                  )}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/30 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#FF6B6B] hover:text-white transition-all"
                >
                  <Trash2 size={16} /> Delete Enquiry
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* LOCAL TOAST */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}