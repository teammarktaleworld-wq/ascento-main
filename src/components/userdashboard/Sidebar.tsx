









// // src/components/userdashboard/Sidebar.tsx
// "use client";

// import { useState, useMemo } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { Search, X, ChevronRight, School } from "lucide-react";

// export type NavPage =
//   | "home" | "announcements" | "schedule" | "notes"
//   | "homework" | "attendance" | "exams" | "fees" | "profile";

// interface NavItem { id: NavPage; icon: string; label: string; group: string }

// const NAV_ITEMS: NavItem[] = [
//   { id: "home",          icon: "⊞",  label: "Dashboard",       group: "Main" },
//   { id: "announcements", icon: "📢", label: "Announcements",   group: "Main" },
//   { id: "schedule",      icon: "📅", label: "Schedule",        group: "Main" },
//   { id: "notes",         icon: "📚", label: "Notes",           group: "Academics" },
//   { id: "homework",      icon: "📂", label: "Homework Files",  group: "Academics" },
//   { id: "attendance",    icon: "✅", label: "Attendance",      group: "Academics" },
//   { id: "exams",         icon: "📝", label: "Exams",           group: "Academics" },
//   { id: "fees",          icon: "💳", label: "Fees",            group: "Account" },
//   { id: "profile",       icon: "👤", label: "My Profile",      group: "Account" },
// ];

// interface SidebarProps {
//   sidebarOpen?: boolean;
//   onClose?: () => void;
//   notificationCount?: number;
// }

// export default function Sidebar({
//   sidebarOpen = false,
//   onClose,
//   notificationCount = 0,
// }: SidebarProps) {
//   const router   = useRouter();
//   const pathname = usePathname();
//   const [search, setSearch] = useState("");

//   const groups = useMemo(() => {
//     const map: Record<string, NavItem[]> = {};
//     NAV_ITEMS.forEach((item) => {
//       (map[item.group] ??= []).push(item);
//     });
//     return map;
//   }, []);

//   const filtered = useMemo(() => {
//     if (!search.trim()) return null;
//     const q = search.toLowerCase();
//     return NAV_ITEMS.filter((m) => m.label.toLowerCase().includes(q));
//   }, [search]);

//   const navigate = (id: NavPage) => {
//     router.push(`/dashboard/${id}`);
//     onClose?.();
//   };

//   const isActive = (id: NavPage) =>
//     pathname === `/dashboard/${id}` ||
//     (id === "home" && (pathname === "/dashboard" || pathname === "/dashboard/home"));

//   const renderItem = (item: NavItem) => {
//     const active = isActive(item.id);

//     return (
//       <button
//         key={item.id}
//         onClick={() => navigate(item.id)}
//         className={`
//           w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
//           transition-all duration-150 relative
//           ${active
//             ? "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
//             : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"}
//         `}
//       >
//         {active && (
//           <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#FF6B6B] to-[#FFB347]" />
//         )}
//         <span className="flex-shrink-0 text-base leading-none">{item.icon}</span>
//         <span className="flex-1 text-left truncate">{item.label}</span>
//         {active && <ChevronRight size={13} className="flex-shrink-0 opacity-60" />}
//       </button>
//     );
//   };

//   return (
//     <>
//       <style>{`
//         .sidebar-nav::-webkit-scrollbar        { width: 4px; }
//         .sidebar-nav::-webkit-scrollbar-track  { background: transparent; }
//         .sidebar-nav::-webkit-scrollbar-thumb  { background: rgba(255,107,107,0.25); border-radius: 4px; }
//         .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,107,107,0.45); }
//         .sidebar-nav { scrollbar-width: thin; scrollbar-color: rgba(255,107,107,0.25) transparent; }
//       `}</style>

//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           flex flex-col bg-[#13132B] z-50 transition-transform duration-300
//           fixed lg:relative inset-y-0 left-0
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//         style={{ width: 260, minWidth: 260, flexShrink: 0 }}
//       >
//         {/* Logo */}
//         <div className="flex-shrink-0 px-5 py-5 border-b border-white/[0.06]">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B6B] to-[#FFB347] rounded-xl flex items-center justify-center">
//               <School size={18} className="text-white" />
//             </div>
//             <div>
//               <p className="font-black text-white text-[15px]">Ascento</p>
//               <p className="text-[10px] text-[#FF9F47] font-semibold uppercase tracking-widest">Abacus</p>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06]">
//           <div className="relative">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4D6A]" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search menu..."
//               className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-8 py-2
//                 text-sm text-white placeholder:text-[#4A4D6A] outline-none
//                 focus:border-[#FF6B6B]/40 focus:bg-white/[0.07] transition-colors"
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A4D6A] hover:text-white transition-colors"
//               >
//                 <X size={13} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">
//           {filtered
//             ? filtered.length > 0
//               ? filtered.map(renderItem)
//               : <p className="text-center text-[11px] text-[#3A3D5C] font-semibold mt-6">No results for "{search}"</p>
//             : Object.entries(groups).map(([group, items]) => (
//                 <div key={group} className="mb-4">
//                   <p className="text-[9px] font-black text-[#3A3D5C] uppercase tracking-[2px] px-3 py-1.5">
//                     {group}
//                   </p>
//                   <div className="space-y-0.5">
//                     {items.map(renderItem)}
//                   </div>
//                 </div>
//               ))
//           }
//         </nav>

//         {/* Footer */}
//         <div className="flex-shrink-0 px-5 py-4 border-t border-white/[0.06]">
//           <p className="text-[10px] text-[#3A3D5C] font-semibold text-center">
//             © 2026 Ascento Abacus
//           </p>
//         </div>
//       </aside>
//     </>
//   );
// }





// src/components/userdashboard/Sidebar.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, ChevronRight, School } from "lucide-react";

export type NavPage =
  | "home" | "announcements" | "schedule" | "notes"
  | "homework" | "attendance" | "exams" | "profile" | "notifications" | "online-exams";

interface NavItem { id: NavPage; icon: string; label: string; group: string }

const NAV_ITEMS: NavItem[] = [
  { id: "home",          icon: "⊞",  label: "Dashboard",       group: "Main" },
  { id: "announcements", icon: "📢", label: "Announcements",   group: "Main" },
  { id: "schedule",      icon: "📅", label: "Schedule",        group: "Main" },
  { id: "notifications", icon: "🔔", label: "Notifications",   group: "Main" },
  { id: "notes",         icon: "📚", label: "Notes",           group: "Academics" },
  { id: "homework",      icon: "📂", label: "Homework Files",  group: "Academics" },
  { id: "attendance",    icon: "✅", label: "Attendance",      group: "Academics" },
  { id: "exams",         icon: "📝", label: "Exams",           group: "Academics" },
  { id: "online-exams",  icon: "💻", label: "Online Exam Portal",  group: "Academics" },
  { id: "profile",       icon: "👤", label: "My Profile",      group: "Account" },
];

interface SidebarProps {
  sidebarOpen?: boolean;
  onClose?: () => void;
  notificationCount?: number;
}

export default function Sidebar({
  sidebarOpen = false,
  onClose,
  notificationCount = 0,
}: SidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const groups = useMemo(() => {
    const map: Record<string, NavItem[]> = {};
    NAV_ITEMS.forEach((item) => {
      (map[item.group] ??= []).push(item);
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return NAV_ITEMS.filter((m) => m.label.toLowerCase().includes(q));
  }, [search]);
const navigate = (id: NavPage) => {
  if (id === "profile") {
    router.push("/profile");
  } else {
    router.push(`/dashboard/${id}`);
  }
  onClose?.();
};

  const isActive = (id: NavPage) => {
  if (id === "profile") {
    return pathname === "/profile";
  }

  return (
    pathname === `/dashboard/${id}` ||
    (id === "home" &&
      (pathname === "/dashboard" || pathname === "/dashboard/home"))
  );
};

  const renderItem = (item: NavItem) => {
    const active = isActive(item.id);
    const showBadge = item.id === "notifications" && notificationCount > 0;

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-150 relative
          ${active
            ? "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
            : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"}
        `}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#FF6B6B] to-[#FFB347]" />
        )}
        <span className="flex-shrink-0 text-base leading-none relative">
          {item.icon}
          {showBadge && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B6B] rounded-full text-white text-[9px] font-black flex items-center justify-center leading-none">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </span>
        <span className="flex-1 text-left truncate">{item.label}</span>
        {active && <ChevronRight size={13} className="flex-shrink-0 opacity-60" />}
      </button>
    );
  };

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar        { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track  { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb  { background: rgba(255,107,107,0.25); border-radius: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,107,107,0.45); }
        .sidebar-nav { scrollbar-width: thin; scrollbar-color: rgba(255,107,107,0.25) transparent; }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          flex flex-col bg-[#13132B] z-50 transition-transform duration-300
          lg:relative lg:translate-x-0
          fixed top-0 bottom-0 left-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: 260, minWidth: 260, flexShrink: 0 }}
      >
        {/* Logo */}
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

        {/* Search */}
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

        {/* Nav — this is the scrollable area */}
        <nav className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 min-h-0">
          {filtered
            ? filtered.length > 0
              ? filtered.map(renderItem)
              : <p className="text-center text-[11px] text-[#3A3D5C] font-semibold mt-6">No results for "{search}"</p>
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

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-[#3A3D5C] font-semibold text-center">
            © 2026 Ascento Abacus
          </p>
        </div>
      </aside>
    </>
  );
}