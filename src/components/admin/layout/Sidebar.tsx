






"use client";

import { useState, useMemo } from "react";
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
  Search,
  X,
  ChevronRight,
} from "lucide-react";

const MENU = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, group: "Main" },
  { id: "students",      label: "Students",       icon: Users,           group: "Academic" },
  { id: "teachers",      label: "Teachers",       icon: GraduationCap,   group: "Academic" },
  { id: "schedule",      label: "Schedule",       icon: Calendar,        group: "Academic" },
  { id: "exams",         label: "Exams",          icon: BookOpen,        group: "Academic" },
  { id: "attendance",    label: "Attendance",     icon: CheckSquare,     group: "Academic" },
  { id: "announcements", label: "Announcements",  icon: Megaphone,       group: "Communication" },
  { id: "enquiries",     label: "Enquiries",      icon: Inbox,           group: "Communication" },
  // { id: "fees",          label: "Fees",           icon: CreditCard,      group: "Finance" },
  { id: "notes",         label: "Notes",          icon: NotebookText,    group: "Resources" },
  { id: "homework",      label: "Homework",       icon: ClipboardList,   group: "Resources" },
  // { id: "reports",       label: "Reports",        icon: FileText,        group: "Analytics" },
  // { id: "settings",      label: "Settings",       icon: Settings,        group: "System" },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (val: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return null; // null = show grouped
    const q = search.toLowerCase();
    return MENU.filter((m) => m.label.toLowerCase().includes(q));
  }, [search]);

  // Group items when not searching
  const groups = useMemo(() => {
    const map: Record<string, typeof MENU> = {};
    MENU.forEach((item) => {
      if (!map[item.group]) map[item.group] = [];
      map[item.group].push(item);
    });
    return map;
  }, []);

  const renderItem = (item: (typeof MENU)[0]) => {
    const Icon = item.icon;
    const active = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-150 group relative
          ${active
            ? "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
            : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"
          }
        `}
      >
        {/* Active indicator bar */}
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#FF6B6B] to-[#FFB347] rounded-r-full" />
        )}
        <Icon size={17} className="flex-shrink-0" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {active && <ChevronRight size={13} className="flex-shrink-0 opacity-60" />}
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col h-full bg-[#13132B] overflow-hidden"
      style={{ width: 260 }}
    >
      {/* ── Logo ── */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,107,0.4)] flex-shrink-0">
            <School size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-white text-[15px] leading-tight tracking-tight">
              Ascento
            </p>
            <p className="text-[10px] text-[#FF9F47] font-semibold tracking-[1.5px] uppercase leading-tight">
              Abacus
            </p>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4D6A] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu..."
            className="
              w-full bg-white/[0.05] border border-white/[0.08] rounded-xl
              pl-8 pr-8 py-2 text-sm text-white placeholder-[#4A4D6A]
              outline-none focus:border-[#FF6B6B]/40 focus:bg-white/[0.07]
              transition-all duration-150
            "
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A4D6A] hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Menu (scrollable) ── */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 min-h-0"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,107,107,0.2) transparent",
        }}
      >
        {/* Search results */}
        {filtered !== null ? (
          filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map(renderItem)}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-[#4A4D6A] text-sm">No results for</p>
              <p className="text-white/60 text-sm font-semibold mt-0.5">"{search}"</p>
            </div>
          )
        ) : (
          /* Grouped menu */
          Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-3">
              <p className="text-[9.5px] font-black text-[#3A3D5C] uppercase tracking-[2px] px-3 py-1.5">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(renderItem)}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-black">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">Admin</p>
            <p className="text-[10px] text-[#4A4D6A] truncate">ascento.abacus.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}