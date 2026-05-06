'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Send,
  Receipt,
  Wallet
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
    style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block"
  >
    {text}
  </span>
);

/**
 * ==========================================
 * MAIN FEES VIEW
 * ==========================================
 */
export default function FeesView() {
  const [feesData, setFeesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // --- API Integrations ---
  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/fees");
      setFeesData(res ?? []);
    } catch { 
      showToast("Failed to load fee records"); 
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // --- Handlers ---
  const handleMarkFeePaid = async (feeId: string, studentName: string) => {
    setActionLoading(feeId);
    try {
      await apiFetch(`/api/admin/fees/${feeId}/pay`, { method: "PATCH" });
      showToast(`Fee marked as paid for ${studentName}! ✅`);
      fetchFees();
    } catch { 
      showToast("Failed to update fee status."); 
    }
    setActionLoading(null);
  };

  const handleRemind = (studentName: string) => {
    showToast(`Payment reminder sent to ${studentName}! 📨`);
  };

  // --- Derived Data & Filtering ---
  const { collected, pending, paidPct } = useMemo(() => {
    const totalCollected = feesData.filter(f => f.paymentStatus === "paid").reduce((s, f) => s + Number(f.amount), 0);
    const totalPending = feesData.filter(f => f.paymentStatus === "pending").reduce((s, f) => s + Number(f.amount), 0);
    const pct = feesData.length ? Math.round(feesData.filter(f => f.paymentStatus === "paid").length / feesData.length * 100) : 0;
    
    return { collected: totalCollected, pending: totalPending, paidPct: pct };
  }, [feesData]);

  const filteredFees = useMemo(() => {
    return feesData.filter(f => {
      const studentName = f.student?.fullName || '';
      const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.feeType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || f.paymentStatus === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Pending first, then by date
      if (a.paymentStatus === 'pending' && b.paymentStatus === 'paid') return -1;
      if (a.paymentStatus === 'paid' && b.paymentStatus === 'pending') return 1;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [feesData, searchQuery, statusFilter]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#FFB347]/10 text-[#FFB347] rounded-xl">
              <CreditCard size={24} />
            </div>
            Fees & Payments
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage student fee collections and track pending dues.</p>
        </div>
        <button 
          onClick={fetchFees}
          className="px-5 py-2.5 bg-white border border-[#F0EEF8] text-[#1A1A2E] font-bold rounded-xl shadow-sm hover:border-[#FFB347] hover:text-[#FFB347] transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Collected */}
        <Card className="p-6 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#4ECDC4]/5 blur-xl group-hover:bg-[#4ECDC4]/10 transition-colors" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Collected</p>
              <h3 className="text-3xl font-black text-[#1A1A2E]">{formatCurrency(collected)}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">This academic period</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#45B7AA] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(78,205,196,0.3)]">
              <IndianRupee size={24} />
            </div>
          </div>
        </Card>

        {/* Pending Dues */}
        <Card className="p-6 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#FF6B6B]/5 blur-xl group-hover:bg-[#FF6B6B]/10 transition-colors" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Dues</p>
              <h3 className="text-3xl font-black text-[#1A1A2E]">{formatCurrency(pending)}</h3>
              <p className="text-xs text-[#FF6B6B] font-bold mt-1">From {feesData.filter(f => f.paymentStatus === 'pending').length} records</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(255,107,107,0.3)]">
              <AlertCircle size={24} />
            </div>
          </div>
        </Card>

        {/* Collection Rate */}
        <Card className="p-6 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#A78BFA]/5 blur-xl group-hover:bg-[#A78BFA]/10 transition-colors" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Collection Rate</p>
              <h3 className="text-3xl font-black text-[#1A1A2E]">{paidPct}%</h3>
              <div className="w-32 h-1.5 bg-[#F0EEF8] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#A78BFA] rounded-full" style={{ width: `${paidPct}%` }} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(167,139,250,0.3)]">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* --- TABLE CARD --- */}
      <Card className="overflow-visible bg-white">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#FFFDF7]">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student or fee type..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {['All', 'Pending', 'Paid'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  statusFilter === status 
                    ? 'bg-[#1A1A2E] text-white shadow-md' 
                    : 'bg-white border border-[#F0EEF8] text-gray-500 hover:border-[#1A1A2E]/30'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-[#FFB347]">
               <Loader2 className="animate-spin mb-4" size={32} />
               <p className="text-sm font-bold text-gray-500">Loading fee records...</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Fee Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Due Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {filteredFees.length > 0 ? (
                  filteredFees.map((f, i) => {
                    const isPaid = f.paymentStatus === 'paid';
                    const isOverdue = !isPaid && f.dueDate && new Date(f.dueDate) < new Date();
                    const studentName = f.student?.fullName ?? "Unknown Student";
                    
                    return (
                      <tr key={f.id} className="hover:bg-[#FFFDF7] transition-colors group">
                        
                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A2E] text-xs font-black flex-shrink-0">
                              {studentName[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-[#1A1A2E]">{studentName}</span>
                          </div>
                        </td>
                        
                        {/* Fee Type */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Receipt size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">{f.feeType}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-[#1A1A2E]">
                            {formatCurrency(Number(f.amount))}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge 
                            text={isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"} 
                            color={isPaid ? "#4ECDC4" : isOverdue ? "#FF6B6B" : "#FFB347"} 
                          />
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold ${isOverdue ? 'text-[#FF6B6B]' : 'text-gray-500'}`}>
                            {f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          {!isPaid ? (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleMarkFeePaid(f.id, studentName)}
                                disabled={actionLoading === f.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ECDC4]/10 hover:bg-[#4ECDC4] text-[#4ECDC4] hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                              >
                                {actionLoading === f.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                Mark Paid
                              </button>
                              <button 
                                onClick={() => handleRemind(studentName)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-[#FFB347]/10 text-gray-500 hover:text-[#FFB347] rounded-lg text-xs font-bold transition-all"
                              >
                                <Send size={14} />
                                Remind
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-[#4ECDC4] uppercase tracking-widest pr-2 flex items-center justify-end gap-1">
                              <CheckCircle2 size={14} /> Settled
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Wallet size={24} className="text-gray-300" />
                        </div>
                        <p className="text-base font-bold text-[#1A1A2E]">No fee records found</p>
                        <p className="text-sm mt-1">Check your search query or status filter.</p>
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
           <span>Total Records: {filteredFees.length}</span>
           <span>
             Pending: <span className="text-[#FF6B6B]">{filteredFees.filter(f => f.paymentStatus === 'pending').length}</span>
           </span>
        </div>
      </Card>

      {/* --- LOCAL TOAST --- */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FFB347] to-[#FFD700] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,179,71,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
      `}}/>
    </div>
  );
}