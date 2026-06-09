// src\app\admin\layout.tsx
"use client";

import Sidebar from "@/components/admin/layout/Sidebar";
import TopBar from "@/components/admin/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed flex inset-0 pt-20">
      <div style={{ width: 260 }}>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <TopBar title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}