




"use client";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Megaphone,
  FileText,
  CheckSquare,
  CreditCard,
  Settings,
  School,
  Inbox,
  NotebookText,
  ClipboardList,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (val: string) => void;
}) {


// In menu array, add after "teachers":
const menu = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "students",   label: "Students",   icon: Users },
  { id: "teachers",   label: "Teachers",   icon: GraduationCap },
  { id: "schedule",   label: "Schedule",   icon: Calendar },
  { id: "exams",      label: "Exams",      icon: BookOpen },
  { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "attendance", label: "Attendance", icon: CheckSquare },
    { id: "fees",       label: "Fees",       icon: CreditCard },
    { id: "notes",      label: "Notes",      icon: NotebookText },
    { id: "homework",   label: "Homework",   icon: ClipboardList },
    { id: "enquiries",  label: "Enquiries",  icon: Inbox },
    { id: "reports",    label: "Reports",    icon: FileText },
    { id: "settings",   label: "Settings",   icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-[#1A1A2E] h-screen fixed left-0 top-0 text-white">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
          <School size={20} />
        </div>
        <h1 className="font-bold text-lg">Ascento</h1>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                active
                  ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}