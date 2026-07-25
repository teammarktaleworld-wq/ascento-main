


// // src\components\admin\layout\Sidebar.tsx



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
//   UserCog,
//   DollarSign,
// } from "lucide-react";

// const MENU = [
//   { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, group: "Main" },
//   { id: "students",      label: "Students",       icon: Users,           group: "Academic" },
//   { id: "teachers",      label: "Teachers",       icon: GraduationCap,   group: "Academic" },
//   { id: "schedule",      label: "Schedule",       icon: Calendar,        group: "Academic" },
//   { id: "exams",         label: "Exams",          icon: BookOpen,        group: "Academic" },
//   { id: "attendance",    label: "Attendance",     icon: CheckSquare,     group: "Academic" },
//   { id: "fees",          label: "Fees",           icon: DollarSign,      group: "Academic" },
//   { id: "announcements", label: "Announcements",  icon: Megaphone,       group: "Communication" },
//   { id: "enquiries",     label: "Enquiries",      icon: Inbox,           group: "Communication" },
//   { id: "webinars",      label: "Webinars",       icon: Video,           group: "Communication" },
//   { id: "notifications", label: "Notifications",  icon: Bell,            group: "Communication" },
//   { id: "notes",         label: "Notes",          icon: NotebookText,    group: "Resources" },
//   { id: "homework",      label: "Homework",       icon: ClipboardList,   group: "Resources" },
//   { id: "users",         label: "User Management", icon: UserCog,        group: "System" },
//     // ← NEW
// ];

// export default function Sidebar({
//   notificationCount = 0,
// }: {
//   notificationCount?: number;
// }) {
//   const router   = useRouter();
//   const pathname = usePathname();
//   const [search, setSearch] = useState("");

//   const filtered = useMemo(() => {
//     if (!search.trim()) return null;
//     const q = search.toLowerCase();
//     return MENU.filter((m) => m.label.toLowerCase().includes(q));
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
//     router.push(id === "dashboard" ? "/admin/dashboard" : `/admin/dashboard/${id}`);
//   };

//   const renderItem = (item: (typeof MENU)[0]) => {
//     const Icon   = item.icon;
//     const active =
//       item.id === "dashboard"
//         ? pathname === "/admin/dashboard"
//         : pathname === `/admin/dashboard/${item.id}`;
//     const isNotif = item.id === "notifications";
//     const isSystem = item.group === "System";

//     return (
//       <button
//         key={item.id}
//         onClick={() => navigate(item.id)}
//         className={`
//           w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
//           transition-all duration-150 group relative
//           ${active
//             ? isSystem
//               ? "bg-gradient-to-r from-[#A78BFA]/20 to-[#7C3AED]/10 text-[#A78BFA] shadow-[inset_0_0_0_1px_rgba(167,139,250,0.25)]"
//               : "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFB347]/10 text-[#FF6B6B] shadow-[inset_0_0_0_1px_rgba(255,107,107,0.25)]"
//             : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"}
//         `}
//       >
//         {active && (
//           <span
//             className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${
//               isSystem
//                 ? "bg-gradient-to-b from-[#A78BFA] to-[#7C3AED]"
//                 : "bg-gradient-to-b from-[#FF6B6B] to-[#FFB347]"
//             }`}
//           />
//         )}

//         <span className="relative flex-shrink-0">
//           <Icon size={17} />
//           {isNotif && notificationCount > 0 && (
//             <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B6B] text-white text-[9px] font-black rounded-full flex items-center justify-center">
//               {notificationCount > 9 ? "9+" : notificationCount}
//             </span>
//           )}
//         </span>

//         <span className="flex-1 text-left truncate">{item.label}</span>

//         {isNotif && notificationCount > 0 && !active && (
//           <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B]">
//             {notificationCount}
//           </span>
//         )}

//         {active && <ChevronRight size={13} className="flex-shrink-0 opacity-60" />}
//       </button>
//     );
//   };

//   return (
//     <>
//       <style>{`
//         .sidebar-nav::-webkit-scrollbar        { width: 4px; }
//         .sidebar-nav::-webkit-scrollbar-track  { background: transparent; }
//         .sidebar-nav::-webkit-scrollbar-thumb  {
//           background: rgba(255,107,107,0.25);
//           border-radius: 4px;
//         }
//         .sidebar-nav::-webkit-scrollbar-thumb:hover {
//           background: rgba(255,107,107,0.45);
//         }
//         .sidebar-nav {
//           scrollbar-width: thin;
//           scrollbar-color: rgba(255,107,107,0.25) transparent;
//         }
//       `}</style>

//       <aside
//         className="flex flex-col bg-[#13132B]"
//         style={{
//           width: 260,
//           minWidth: 260,
//           height: "100vh",
//           position: "sticky",
//           top: 0,
//           flexShrink: 0,
//           overflow: "hidden",
//         }}
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
//             ? (
//               filtered.length > 0
//                 ? filtered.map(renderItem)
//                 : (
//                   <p className="text-center text-[11px] text-[#3A3D5C] font-semibold mt-6">
//                     No results for "{search}"
//                   </p>
//                 )
//             )
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














// src\components\admin\layout\Sidebar.tsx

"use client";

// import { useState, useMemo } from "react";
import { useState, useMemo, useEffect, useRef } from "react"; //priya
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
  UserCog,
  DollarSign,
  Target,
} from "lucide-react";

const MENU = [
  { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard, group: "Main" },
  { id: "students",      label: "Students",        icon: Users,           group: "Academic" },
  { id: "teachers",      label: "Teachers",        icon: GraduationCap,   group: "Academic" },
  { id: "schedule",      label: "Schedule",        icon: Calendar,        group: "Academic" },
  { id: "exams",         label: "Exams",           icon: BookOpen,        group: "Academic" },
  { id: "attendance",    label: "Attendance",      icon: CheckSquare,     group: "Academic" },
  { id: "announcements", label: "Announcements",   icon: Megaphone,       group: "Communication" },
  { id: "enquiries",     label: "Enquiries",       icon: Inbox,           group: "Communication" },
  { id: "webinars",      label: "Webinars",        icon: Video,           group: "Communication" },
  { id: "notifications", label: "Notifications",   icon: Bell,            group: "Communication" },
  { id: "notes",         label: "Notes",           icon: NotebookText,    group: "Resources" },
  { id: "homework",      label: "Homework",        icon: ClipboardList,   group: "Resources" },
  { id: "portal-exam",   label: "Exam Portal",     icon: Target,          group: "Resources" },
  { id: "users",         label: "User Management", icon: UserCog,         group: "System" },
];

export default function Sidebar({
  notificationCount = 0,
}: {
  notificationCount?: number;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  // priya !>
  const navRef = useRef<HTMLElement>(null);

useEffect(() => {
  const nav = navRef.current;
  if (!nav) return;

  const saved = sessionStorage.getItem("sidebar-scroll");
  if (saved) {
    setTimeout(() => {
      nav.scrollTop = Number(saved);
    }, 0);
  }

  const handleScroll = () => {
    sessionStorage.setItem("sidebar-scroll", String(nav.scrollTop));
  };
  nav.addEventListener("scroll", handleScroll);
  return () => nav.removeEventListener("scroll", handleScroll);
}, []);


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

  // const navigate = (id: string) => {
  //   router.push(id === "dashboard" ? "/admin/dashboard" : `/admin/dashboard/${id}`);
  // };
  const navigate = (id: string) => {
  router.push(id === "dashboard" ? "/admin/dashboard" : `/admin/dashboard/${id}`);
}; //priya

  const renderItem = (item: (typeof MENU)[0]) => {
    const Icon    = item.icon;
    const active  =
      item.id === "dashboard"
        ? pathname === "/admin/dashboard"
        : pathname === `/admin/dashboard/${item.id}`;
    const isNotif  = item.id === "notifications";
    const isSystem = item.group === "System";
    const isPortal = item.id === "portal-exam";

    // Accent colours per item type
    const accentColor = isSystem ? "#A78BFA" : isPortal ? "#4ECDC4" : "#FF6B6B";
    const accentTo    = isSystem ? "#7C3AED"  : isPortal ? "#26C6DA" : "#FFB347";

    return (
      <button
        key={item.id}
        onClick={() => navigate(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-150 group relative
          ${active
            ? "text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
            : "text-[#8B8FA8] hover:bg-white/5 hover:text-white"}
        `}
        style={active ? {
          background: `linear-gradient(to right, ${accentColor}22, ${accentTo}10)`,
          color: accentColor,
          boxShadow: `inset 0 0 0 1px ${accentColor}33`,
        } : undefined}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentTo})` }}
          />
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
          // height: "100vh",
          height :"100%",  //priya 
          // position: "sticky",
          // top: 0,
          position:"relative",
          
          flexShrink: 0,
          overflow: "hidden",
        }}
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

        {/* Nav */}
        {/* <nav className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">
         */}
         <nav ref={navRef} className="sidebar-nav flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">

          {filtered
            ? (
              filtered.length > 0
                ? filtered.map(renderItem)
                : (
                  <p className="text-center text-[11px] text-[#3A3D5C] font-semibold mt-6">
                    {/* No results for "{search}" */}
  {`No results for "${search}"`}
                    
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