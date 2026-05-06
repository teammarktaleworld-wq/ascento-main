// "use client";

// import Card from "@/components/admin/ui/Card";
// import EnrollmentChart from "@/components/admin/charts/EnrollmentChart";
// import PerformanceChart from "@/components/admin/charts/PerformanceChart";

// export default function DashboardView() {
//   const stats = [
//     { title: "Students", value: "248" },
//     { title: "Teachers", value: "24" },
//     { title: "Revenue", value: "₹1.2M" },
//     { title: "Attendance", value: "94%" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Stats */}
//       <div className="grid grid-cols-4 gap-6">
//         {stats.map((s, i) => (
//           <Card key={i} className="p-6">
//             <p className="text-sm text-gray-500">{s.title}</p>
//             <h2 className="text-2xl font-bold">{s.value}</h2>
//           </Card>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-3 gap-6">
//         <Card className="col-span-2 p-6">
//           <h3 className="font-bold mb-4">Enrollment</h3>
//           <EnrollmentChart />
//         </Card>

//         <Card className="p-6">
//           <h3 className="font-bold mb-4">Performance</h3>
//           <PerformanceChart />
//         </Card>
//       </div>
//     </div>
//   );
// }










'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import Card from "@/components/admin/ui/Card";
import Badge from "@/components/admin/ui/Badge";
import EnrollmentChart from "@/components/admin/charts/EnrollmentChart";
import PerformanceChart from "@/components/admin/charts/PerformanceChart";

// --- Local Mock Data for Bottom Sections ---
const RECENT_STUDENTS = [
  { id: 1, name: 'Aarav Sharma', grade: 'Level 2', status: 'Active', avatar: 'A' },
  { id: 2, name: 'Diya Patel', grade: 'Level 1', status: 'Pending', avatar: 'D' },
  { id: 3, name: 'Rohan Gupta', grade: 'Level 3', status: 'Active', avatar: 'R' },
  { id: 4, name: 'Myra Singh', grade: 'Level 1', status: 'Active', avatar: 'M' },
];

export default function DashboardView() {
  // Enhanced stats data with Ascento Theme colors
  const stats = [
    { 
      title: 'Total Students', 
      value: '248', 
      desc: 'Active enrollments', 
      icon: '🎒', 
      color: 'bg-[#FF6B6B]/10', 
      decor: 'bg-[#FF6B6B]/5' 
    },
    { 
      title: 'Teachers', 
      value: '24', 
      desc: 'Faculty members', 
      icon: '👨‍🏫', 
      color: 'bg-[#4ECDC4]/10', 
      decor: 'bg-[#4ECDC4]/5' 
    },
    { 
      title: 'Fees Collected', 
      value: '₹1.2M', 
      desc: '₹45k pending', 
      icon: '💰', 
      color: 'bg-[#FFB347]/10', 
      decor: 'bg-[#FFB347]/5' 
    },
    { 
      title: 'Attendance', 
      value: '94%', 
      desc: 'Last 30 days', 
      icon: '✅', 
      color: 'bg-[#A78BFA]/10', 
      decor: 'bg-[#A78BFA]/5' 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Welcome Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] p-10 shadow-[0_8px_32px_rgba(255,107,107,0.3)]">
        {/* Decorative blur elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 font-['Fredoka_One'] tracking-wide">
            Good Morning, Admin! 👋
          </h2>
          <p className="text-white/90 text-sm font-medium">
            Here's what's happening at Ascento today.
          </p>
        </div>
        {/* Decorative Emoji on the right */}
        <div className="absolute right-10 bottom-4 text-6xl opacity-80 hidden md:block">🏫</div>
      </div>

      {/* 2. Enhanced Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.decor} blur-xl`}></div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-3xl font-black text-[#1A1A2E] my-1">{stat.value}</h3>
            <p className="text-xs text-gray-500 font-medium">{stat.desc}</p>
          </Card>
        ))}
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (Takes 2 columns) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A2E]">Enrollment Trend</h3>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <span className="px-3 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg text-xs font-bold">2026</span>
          </div>
          <EnrollmentChart />
        </Card>

        {/* Performance Rings (Takes 1 column) */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Performance</h3>
          <p className="text-xs text-gray-500 mb-6">Class averages overview</p>
          <PerformanceChart />
        </Card>
      </div>

      {/* 4. Bottom Grid (Schedule & Recent Students) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Schedule Card */}
         <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Today's Schedule</h3>
            <button className="text-[#FF6B6B] text-sm font-bold hover:underline">View all &rarr;</button>
          </div>
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-[#F0EEF8]">
            <Calendar size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">No classes scheduled today</p>
          </div>
        </Card>

        {/* Recent Students List */}
        <Card className="p-0">
          <div className="p-6 border-b border-[#F0EEF8] flex justify-between items-center bg-[#FFFDF7]">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Recent Students</h3>
            <button className="text-[#FF6B6B] text-sm font-bold hover:underline">View all &rarr;</button>
          </div>
          <div className="p-2">
            {RECENT_STUDENTS.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 hover:bg-[#FFFDF7] rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {student.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#FF6B6B] transition-colors">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.grade}</p>
                  </div>
                </div>
                <Badge status={student.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}