'use client';

import React, { useState } from 'react';
import { 
  BarChart2, 
  CheckSquare, 
  CreditCard, 
  TrendingUp, 
  Download,
  Loader2,
  FileSpreadsheet
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

/**
 * ==========================================
 * MAIN REPORTS VIEW
 * ==========================================
 */
export default function ReportsView() {
  const [toast, setToast] = useState<string | null>(null);
  const [exportingMap, setExportingMap] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  const handleExport = async (type: string, title: string) => {
    setExportingMap(prev => ({ ...prev, [type]: true }));
    showToast(`Preparing ${title}...`);
    
    try {
      // In a real scenario, this endpoint would likely return a CSV, PDF, or Excel file blob.
      const data = await apiFetch(`/api/admin/reports?type=${type}`);
      console.log(`[Export] ${title} Data:`, data);
      
      // Simulate network delay for UI feedback
      await new Promise(res => setTimeout(res, 800));
      
      showToast(`${title} exported successfully! 📄`);
    } catch (error) {
      showToast(`Failed to export ${title}`);
    } finally {
      setExportingMap(prev => ({ ...prev, [type]: false }));
    }
  };

  const reportsList = [
    { 
      id: "marks",
      title: "Student Performance Report", 
      desc: "Class-wise grade distribution and averages", 
      icon: BarChart2, 
      color: "#FF6B6B" // Primary Red
    },
    { 
      id: "attendance",
      title: "Attendance Summary", 
      desc: "Monthly attendance trends by class and section", 
      icon: CheckSquare, 
      color: "#4ECDC4" // Teal
    },
    { 
      id: "fees",
      title: "Fee Collection Report", 
      desc: "Paid vs pending breakdown with due dates", 
      icon: CreditCard, 
      color: "#FFB347" // Secondary Orange
    },
    { 
      id: "enrollment",
      title: "Enrollment Trends", 
      desc: "Monthly admissions, withdrawals, and growth metrics", 
      icon: TrendingUp, 
      color: "#A78BFA" // Purple
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#A78BFA]/10 text-[#A78BFA] rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
            Reports & Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Export school data, track performance, and view analytics.</p>
        </div>
      </div>

      {/* --- REPORTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((report) => {
          const Icon = report.icon;
          const isExporting = exportingMap[report.id];

          return (
            <Card 
              key={report.id} 
              className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-transparent group"
            >
              {/* Dynamic Glow Background on Hover */}
              <div 
                className="absolute -inset-1 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
                style={{ backgroundColor: report.color }}
              />

              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${report.color}15`, color: report.color }}
              >
                <Icon size={26} strokeWidth={2.5} />
              </div>
              
              {/* Details */}
              <div className="flex-1 relative z-10">
                <h3 className="text-base font-bold text-[#1A1A2E] mb-1">{report.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{report.desc}</p>
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => handleExport(report.id, report.title)}
                disabled={isExporting}
                className="w-full sm:w-auto relative z-10 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  color: report.color,
                  border: `2px solid ${report.color}40`,
                  backgroundColor: isExporting ? `${report.color}10` : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.backgroundColor = `${report.color}10`;
                    e.currentTarget.style.borderColor = report.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = `${report.color}40`;
                  }
                }}
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Export
                  </>
                )}
              </button>
            </Card>
          );
        })}
      </div>

      {/* --- OVERVIEW FOOTER (Optional Empty State / Info) --- */}
      <Card className="mt-8 p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FFFDF7] to-white">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">Need custom reports?</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          Custom report generation and advanced analytics dashboards will be available in the upcoming v2.0 Ascento release.
        </p>
      </Card>

      {/* --- LOCAL TOAST --- */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(167,139,250,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
    </div>
  );
}