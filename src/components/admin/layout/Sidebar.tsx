



// "use client";

// import { useState, useMemo } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   Calendar,
//   BookOpen,
//   Megaphone,
//   CheckSquare,
//   School,
//   Inbox,
//   NotebookText,
//   ClipboardList,
//   Search,
//   X,
//   ChevronRight,
//   Video,
//   Bell,
// } from "lucide-react";

// const MENU = [
//   { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Main" },
//   { id: "students", label: "Students", icon: Users, group: "Academic" },
//   { id: "teachers", label: "Teachers", icon: GraduationCap, group: "Academic" },
//   { id: "schedule", label: "Schedule", icon: Calendar, group: "Academic" },
//   { id: "exams", label: "Exams", icon: BookOpen, group: "Academic" },
//   { id: "attendance", label: "Attendance", icon: CheckSquare, group: "Academic" },
//   { id: "announcements", label: "Announcements", icon: Megaphone, group: "Communication" },
//   { id: "enquiries", label: "Enquiries", icon: Inbox, group: "Communication" },
//   { id: "webinars", label: "Webinars", icon: Video, group: "Communication" },
//   { id: "notifications", label: "Notifications", icon: Bell, group: "Communication" },
//   { id: "notes", label: "Notes", icon: NotebookText, group: "Resources" },
//   { id: "homework", label: "Homework", icon: ClipboardList, group: "Resources" },
// ];

// export default function Sidebar({
//   notificationCount = 0,
// }: {
//   notificationCount?: number;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [search, setSearch] = useState("");

//   const filtered = useMemo(() => {
//     if (!search.trim()) return null;

//     const q = search.toLowerCase();

//     return MENU.filter((m) =>
//       m.label.toLowerCase().includes(q)
//     );
//   }, [search]);

//   const groups = useMemo(() => {
//     const map: Record<string, typeof MENU> = {};

//     MENU.forEach((item) => {
//       if (!map[item.group]) map[item.group] = [];
//       map[item.group].push(item);
//     });

//     return map;
//   }, []);

//   const navigate = (id: string) => {
//     if (id === "dashboard") {
//       router.push("/admin/dashboard");
//     } else {
//       router.push(`/admin/dashboard/${id}`);
//     }
//   };

//   const renderItem = (item: (typeof MENU)[0]) => {
//     const Icon = item.icon;

//     const active =
//       item.id === "dashboard"
//         ? pathname === "/admin/dashboard"
//         : pathname === `/admin/dashboard/${item.id}`;

//     const isNotif = item.id === "notifications";

//     return (
//       <button
//         key={item.id}
//         onClick={() => navigate(item.id)}
//         className={`
//           w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
//           transition-all duration-150 group relative
//           ${
//             active
//               ? "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
//               : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"
//           }
//         `}
//       >
//         {active && (
//           <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#FF6B6B] to-[#FFB347] rounded-r-full" />
//         )}

//         <span className="relative flex-shrink-0">
//           <Icon size={17} />

//           {isNotif && notificationCount > 0 && (
//             <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B6B] text-white text-[9px] font-black rounded-full flex items-center justify-center">
//               {notificationCount > 9 ? "9+" : notificationCount}
//             </span>
//           )}
//         </span>

//         <span className="flex-1 text-left truncate">
//           {item.label}
//         </span>

//         {isNotif && notificationCount > 0 && !active && (
//           <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B]">
//             {notificationCount}
//           </span>
//         )}

//         {active && (
//           <ChevronRight
//             size={13}
//             className="flex-shrink-0 opacity-60"
//           />
//         )}
//       </button>
//     );
//   };

//   return (
//     <aside
//       className="flex flex-col h-full bg-[#13132B] overflow-hidden"
//       style={{ width: 260 }}
//     >
//       {/* Logo */}
//       <div className="flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
//             <School size={18} className="text-white" />
//           </div>

//           <div>
//             <p className="font-black text-white text-[15px]">
//               Ascento
//             </p>

//             <p className="text-[10px] text-[#FF9F47] font-semibold uppercase">
//               Abacus
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="px-4 py-3 border-b border-white/[0.06]">
//         <div className="relative">
//           <Search
//             size={14}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4D6A]"
//           />

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search menu..."
//             className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-8 py-2 text-sm text-white"
//           />

//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-2 top-1/2 -translate-y-1/2"
//             >
//               <X size={13} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 overflow-y-auto py-3 px-3">
//         {filtered
//           ? filtered.map(renderItem)
//           : Object.entries(groups).map(([group, items]) => (
//               <div key={group} className="mb-3">
//                 <p className="text-[9px] font-black text-[#3A3D5C] uppercase tracking-[2px] px-3 py-1.5">
//                   {group}
//                 </p>

//                 <div className="space-y-0.5">
//                   {items.map(renderItem)}
//                 </div>
//               </div>
//             ))}
//       </nav>
//     </aside>
//   );
// }










"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Megaphone,
  CheckSquare,
  School,
  Inbox,
  NotebookText,
  ClipboardList,
  Search,
  X,
  ChevronRight,
  Video,
  Bell,
} from "lucide-react";

const MENU = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, group: "Main" },
  { id: "students",      label: "Students",      icon: Users,           group: "Academic" },
  { id: "teachers",      label: "Teachers",      icon: GraduationCap,   group: "Academic" },
  { id: "schedule",      label: "Schedule",      icon: Calendar,        group: "Academic" },
  { id: "exams",         label: "Exams",         icon: BookOpen,        group: "Academic" },
  { id: "attendance",    label: "Attendance",    icon: CheckSquare,     group: "Academic" },
  { id: "announcements", label: "Announcements", icon: Megaphone,       group: "Communication" },
  { id: "enquiries",     label: "Enquiries",     icon: Inbox,           group: "Communication" },
  { id: "webinars",      label: "Webinars",      icon: Video,           group: "Communication" },
  { id: "notifications", label: "Notifications", icon: Bell,            group: "Communication" },
  { id: "notes",         label: "Notes",         icon: NotebookText,    group: "Resources" },
  { id: "homework",      label: "Homework",      icon: ClipboardList,   group: "Resources" },
];

export default function Sidebar({
  notificationCount = 0,
}: {
  notificationCount?: number;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return MENU.filter((m) => m.label.toLowerCase().includes(q));
  }, [search]);

  const groups = useMemo(() => {
    const map: Record<string, typeof MENU> = {};
    MENU.forEach((item) => {
      if (!map[item.group]) map[item.group] = [];
      map[item.group].push(item);
    });
    return map;
  }, []);

  const navigate = (id: string) => {
    router.push(id === "dashboard" ? "/admin/dashboard" : `/admin/dashboard/${id}`);
  };

  const renderItem = (item: (typeof MENU)[0]) => {
    const Icon   = item.icon;
    const active =
      item.id === "dashboard"
        ? pathname === "/admin/dashboard"
        : pathname === `/admin/dashboard/${item.id}`;
    const isNotif = item.id === "notifications";

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-150 group relative
          ${active
            ? "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
            : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"}
        `}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#FF6B6B] to-[#FFB347] rounded-r-full" />
        )}

        <span className="relative flex-shrink-0">
          <Icon size={17} />
          {isNotif && notificationCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B6B] text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </span>

        <span className="flex-1 text-left truncate">{item.label}</span>

        {isNotif && notificationCount > 0 && !active && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B]">
            {notificationCount}
          </span>
        )}

        {active && <ChevronRight size={13} className="flex-shrink-0 opacity-60" />}
      </button>
    );
  };

  return (
    <>
      {/* ── Custom scrollbar for the nav area ── */}
      <style>{`
        .sidebar-nav::-webkit-scrollbar        { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track  { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb  {
          background: rgba(255,107,107,0.25);
          border-radius: 4px;
        }
        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255,107,107,0.45);
        }
        /* Firefox */
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,107,107,0.25) transparent;
        }
      `}</style>

      <aside
        className="flex flex-col bg-[#13132B]"
        style={{
          width: 260,
          minWidth: 260,
          height: "100vh",         /* ← full viewport height, never grows */
          position: "sticky",
          top: 0,
          flexShrink: 0,           /* ← never squishes in a flex row */
          overflow: "hidden",      /* ← nothing leaks outside */
        }}
      >
        {/* ── Logo ── */}
        <div className="flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
              <School size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white text-[15px]">Ascento</p>
              <p className="text-[10px] text-[#FF9F47] font-semibold uppercase tracking-widest">Abacus</p>
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4D6A]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-8 py-2
                text-sm text-white placeholder:text-[#4A4D6A] outline-none
                focus:border-[#FF6B6B]/40 focus:bg-white/[0.07] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A4D6A] hover:text-white transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Nav — this is the ONLY scrollable region ── */}
        <nav
          className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 px-3"
          /* overflow-x hidden stops horizontal scroll ghost */
        >
          {filtered
            ? (
              filtered.length > 0
                ? filtered.map(renderItem)
                : (
                  <p className="text-center text-[11px] text-[#3A3D5C] font-semibold mt-6">
                    No results for "{search}"
                  </p>
                )
            )
            : Object.entries(groups).map(([group, items]) => (
                <div key={group} className="mb-4">
                  <p className="text-[9px] font-black text-[#3A3D5C] uppercase tracking-[2px] px-3 py-1.5">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {items.map(renderItem)}
                  </div>
                </div>
              ))
          }
        </nav>

        {/* ── Footer branding ── */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-[#3A3D5C] font-semibold text-center">
            © 2026 Ascento Abacus
          </p>
        </div>
      </aside>
    </>
  );
}