





// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// type AuthUser = {
//   id: string;
//   email: string;
//   name?: string;
//   role?: string;
//   avatar?: string;
// };

// type NavbarProps = {
//   user?: AuthUser | null;
//   onLogin?: () => void;
//   onSignOut?: () => void;
//   onDashboard?: () => void;
// };

// export default function Navbar({
//   user = null,
//   onLogin,
//   onSignOut,
//   onDashboard,
// }: NavbarProps) {
//   const [navScrolled, setNavScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropOpen, setDropOpen] = useState(false);

//   const dropRef = useRef<HTMLDivElement | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const onScroll = () => setNavScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const initials = user?.name
//     ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
//     : user?.email?.[0].toUpperCase() ?? "U";

//   const handleDashboard = () => {
//     setDropOpen(false);
//     setMenuOpen(false);
//     if (user?.role === "admin") {
//       router.push("/admin/dashboard");
//     } else {
//       onDashboard?.();
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

//         .asc-nav {
//           position: fixed; top: 0; left: 0; right: 0; z-index: 1000; /* ✅ raised from 200 */
//           padding: 14px 0;
//           background: rgba(255,253,247,1);
//           border: none; outline: none;
//           transition: background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
//         }
//         .asc-nav.scrolled {
//           background: rgba(255,253,247,0.96);
//           backdrop-filter: blur(16px);
//           box-shadow: 0 2px 20px rgba(0,0,0,0.08);
//         }
//         .asc-nav-inner {
//           max-width: 1200px; margin: 0 auto;
//           padding: 0 24px;
//           display: flex; align-items: center; justify-content: space-between; gap: 16px;
//         }

//         .asc-logo {
//           text-decoration: none; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
//         }
//         .asc-logo-icon {
//           width: 44px; height: 44px; border-radius: 14px;
//           background: linear-gradient(135deg, #FF6B6B, #FFB347);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 22px; box-shadow: 0 4px 14px rgba(255,107,107,.4);
//           flex-shrink: 0;
//         }
//         .asc-logo-title {
//           font-family: 'Fredoka One', cursive; font-size: 22px; color: #1A1A2E; line-height: 1;
//         }
//         .asc-logo-title span { color: #FF6B6B; }
//         .asc-logo-sub {
//           font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
//           text-transform: uppercase; color: #999; margin-top: 1px;
//         }

//         .asc-links { display: flex; gap: 28px; align-items: center; }
//         .asc-link {
//           position: relative; font-size: 15px; font-weight: 800;
//           color: #1A1A2E; text-decoration: none; transition: color .2s;
//           white-space: nowrap;
//         }
//         .asc-link::after {
//           content: ''; position: absolute; bottom: -4px; left: 0;
//           width: 0; height: 3px; border-radius: 3px; background: #FF6B6B;
//           transition: width .3s cubic-bezier(.34,1.56,.64,1);
//         }
//         .asc-link:hover { color: #FF6B6B; }
//         .asc-link:hover::after { width: 100%; }

//         .asc-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

//         .asc-login-btn {
//           background: transparent; color: #1A1A2E;
//           font-family: inherit; font-weight: 800; font-size: 14px;
//           padding: 10px 22px; border-radius: 50px;
//           border: 2.5px solid rgba(26,26,46,0.18);
//           cursor: pointer; text-decoration: none;
//           display: inline-flex; align-items: center; gap: 7px;
//           transition: all .3s cubic-bezier(.34,1.56,.64,1);
//           white-space: nowrap;
//         }
//         .asc-login-btn:hover {
//           border-color: #FF6B6B; color: #FF6B6B;
//           box-shadow: 0 4px 14px rgba(255,107,107,.18);
//         }

//         .asc-enrol-btn {
//           background: #FF6B6B; color: #fff;
//           font-family: inherit; font-weight: 900; font-size: 14px;
//           padding: 10px 22px; border-radius: 50px; border: none;
//           cursor: pointer; text-decoration: none;
//           display: inline-flex; align-items: center; gap: 7px;
//           box-shadow: 0 6px 20px rgba(255,107,107,.4);
//           transition: all .3s cubic-bezier(.34,1.56,.64,1);
//           white-space: nowrap;
//         }
//         .asc-enrol-btn:hover {
//           transform: scale(1.08) translateY(-2px);
//           box-shadow: 0 12px 30px rgba(255,107,107,.5);
//         }

//         .asc-user-trigger {
//           display: flex; align-items: center; gap: 9px;
//           cursor: pointer; padding: 6px 14px 6px 6px;
//           border-radius: 50px; border: 2.5px solid transparent;
//           transition: all .25s; position: relative;
//           background: transparent; font-family: inherit;
//         }
//         .asc-user-trigger:hover,
//         .asc-user-trigger.open {
//           border-color: rgba(255,107,107,0.2);
//           background: #FFF0F0;
//         }
//         .asc-avatar {
//           width: 34px; height: 34px; border-radius: 50%;
//           background: linear-gradient(135deg, #FF6B6B, #FFB347);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 13px; font-weight: 900; color: white;
//           flex-shrink: 0; overflow: hidden;
//         }
//         .asc-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
//         .asc-user-name {
//           font-size: 13px; font-weight: 800; color: #1A1A2E;
//           max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//         }
//         .asc-chevron {
//           font-size: 10px; color: #999;
//           transition: transform .25s; display: inline-block;
//         }
//         .asc-chevron.open { transform: rotate(180deg); }

//         .asc-admin-badge {
//           font-size: 10px; font-weight: 900; letter-spacing: 0.08em;
//           text-transform: uppercase; color: #FF6B6B;
//           background: #FFF0F0; border: 1.5px solid #FFD6D6;
//           border-radius: 6px; padding: 2px 6px; flex-shrink: 0;
//         }

//         .asc-dropdown {
//           position: absolute; top: calc(100% + 10px); right: 0;
//           background: white; border-radius: 20px;
//           box-shadow: 0 20px 50px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.07);
//           border: 2px solid #FFF0F0;
//           padding: 8px; min-width: 220px;
//           animation: ascDropIn .25s cubic-bezier(.34,1.56,.64,1) both;
//           z-index: 1100; /* ✅ raised from 300 — above navbar AND banner */
//         }
//         @keyframes ascDropIn {
//           from { opacity: 0; transform: translateY(-8px) scale(.96); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         .asc-drop-header {
//           padding: 12px 14px 10px;
//           border-bottom: 1.5px solid #F5F5F5;
//           margin-bottom: 6px;
//         }
//         .asc-drop-header-name { font-weight: 900; font-size: 14px; color: #1A1A2E; }
//         .asc-drop-header-email {
//           font-size: 11px; color: #999; font-weight: 700;
//           margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//         }
//         .asc-drop-header-role {
//           display: inline-flex; align-items: center; gap: 4px;
//           margin-top: 6px; font-size: 10px; font-weight: 900;
//           text-transform: uppercase; letter-spacing: 0.08em;
//           color: #FF6B6B; background: #FFF0F0;
//           border: 1.5px solid #FFD6D6; border-radius: 6px; padding: 2px 8px;
//         }

//         .asc-drop-item {
//           display: flex; align-items: center; gap: 10px;
//           padding: 10px 14px; border-radius: 12px;
//           font-size: 13px; font-weight: 800; color: #1A1A2E;
//           cursor: pointer; text-decoration: none;
//           transition: background .18s, color .18s;
//           width: 100%; border: none; background: none; font-family: inherit;
//           text-align: left;
//         }
//         .asc-drop-item:hover { background: #FFF0F0; color: #FF6B6B; }
//         .asc-drop-item.danger:hover { background: #FFF5F5; color: #FF4444; }
//         .asc-drop-divider { height: 1.5px; background: #F5F5F5; margin: 6px 0; }

//         .asc-hamburger {
//           display: none; flex-direction: column; gap: 5px;
//           cursor: pointer; padding: 8px; background: none; border: none;
//         }
//         .asc-hamburger span {
//           display: block; width: 22px; height: 2.5px;
//           background: #1A1A2E; border-radius: 2px; transition: all .3s;
//         }
//         .asc-hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
//         .asc-hamburger.open span:nth-child(2) { opacity: 0; }
//         .asc-hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

//         .asc-mobile-menu {
//           display: none;
//           position: fixed; top: 72px; left: 0; right: 0;
//           background: rgba(255,253,247,0.98);
//           backdrop-filter: blur(20px);
//           padding: 20px 24px 28px;
//           box-shadow: 0 12px 40px rgba(0,0,0,.12);
//           border-bottom: 2px solid #FFE0D0;
//           animation: mobileIn .3s cubic-bezier(.34,1.56,.64,1) both;
//           z-index: 999; /* ✅ raised from 199 */
//         }
//         @keyframes mobileIn {
//           from { opacity: 0; transform: translateY(-16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .asc-mobile-menu.open { display: block; }
//         .asc-mobile-link {
//           display: block; font-size: 18px; font-weight: 800; color: #1A1A2E;
//           text-decoration: none; padding: 12px 0;
//           border-bottom: 1.5px solid #F0EDE8; transition: color .2s;
//         }
//         .asc-mobile-link:hover { color: #FF6B6B; }
//         .asc-mobile-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }

//         @media (max-width: 768px) {
//           .asc-links { display: none; }
//           .asc-enrol-btn { display: none; }
//           .asc-hamburger { display: flex; }
//         }
//         @media (max-width: 480px) {
//           .asc-login-btn span.label { display: none; }
//           .asc-user-name { display: none; }
//           .asc-admin-badge { display: none; }
//         }
//       `}</style>

//       <nav className={`asc-nav${navScrolled ? " scrolled" : ""}`}>
//         <div className="asc-nav-inner">

//           <Link href="/" className="asc-logo">
//             <div className="asc-logo-icon">🧮</div>
//             <div>
//               <div className="asc-logo-title">Ascento <span>Abacus</span></div>
//               <div className="asc-logo-sub">Brain Development Academy</div>
//             </div>
//           </Link>

//           <div className="asc-links">
//             <Link href="/programs" className="asc-link">Programs</Link>
//             <Link href="/#whyus"   className="asc-link">Why Us</Link>
//             <Link href="/#gallery" className="asc-link">Gallery</Link>
//             <Link href="/#team"    className="asc-link">Team</Link>
//             <Link href="/contact"  className="asc-link">Contact</Link>
//           </div>

//           <div className="asc-right">

//             {!user && (
//               <button className="asc-login-btn" onClick={onLogin}>
//                 <span>🔑</span>
//                 <span className="label">Login</span>
//               </button>
//             )}

//             {user && (
//               <div style={{ position: "relative" }} ref={dropRef}>
//                 <button
//                   className={`asc-user-trigger${dropOpen ? " open" : ""}`}
//                   onClick={() => setDropOpen((v) => !v)}
//                   aria-haspopup="true"
//                   aria-expanded={dropOpen}
//                 >
//                   <div className="asc-avatar">
//                     {user.avatar ? (
//                       <img src={user.avatar} alt={user.name ?? "User"} />
//                     ) : (
//                       initials
//                     )}
//                   </div>
//                   <span className="asc-user-name">
//                     {user.name?.split(" ")[0] ?? user.email}
//                   </span>
//                   {user.role === "admin" && (
//                     <span className="asc-admin-badge">Admin</span>
//                   )}
//                   <span className={`asc-chevron${dropOpen ? " open" : ""}`}>▼</span>
//                 </button>

//                 {dropOpen && (
//                   <div className="asc-dropdown" role="menu">
//                     <div className="asc-drop-header">
//                       <div className="asc-drop-header-name">
//                         {user.name ?? user.email}
//                       </div>
//                       {user.email && (
//                         <div className="asc-drop-header-email">{user.email}</div>
//                       )}
//                       {user.role && (
//                         <div className="asc-drop-header-role">
//                           {user.role === "admin" ? "🛡️" : "👤"} {user.role}
//                         </div>
//                       )}
//                     </div>

//                     <button className="asc-drop-item" role="menuitem" onClick={handleDashboard}>
//                       <span>{user.role === "admin" ? "🛡️" : "📊"}</span>
//                       {user.role === "admin" ? "Admin Panel" : "Dashboard"}
//                     </button>

//                     <Link href="/profile" className="asc-drop-item" role="menuitem" onClick={() => setDropOpen(false)}>
//                       <span>👤</span> My Profile
//                     </Link>

//                     <Link href="/settings" className="asc-drop-item" role="menuitem" onClick={() => setDropOpen(false)}>
//                       <span>⚙️</span> Settings
//                     </Link>

//                     <div className="asc-drop-divider" />

//                     <button
//                       className="asc-drop-item danger"
//                       role="menuitem"
//                       onClick={() => { setDropOpen(false); onSignOut?.(); }}
//                     >
//                       <span>🚪</span> Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             <Link href="/contact" className="asc-enrol-btn">🎉 Enrol Now</Link>

//             <button
//               className={`asc-hamburger${menuOpen ? " open" : ""}`}
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-label="Toggle menu"
//             >
//               <span /><span /><span />
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className={`asc-mobile-menu${menuOpen ? " open" : ""}`}>
//         {[
//           ["Programs", "/programs"],
//           ["Why Us",   "/#whyus"],
//           ["Gallery",  "/#gallery"],
//           ["Team",     "/#team"],
//           ["Contact",  "/contact"],
//         ].map(([label, href]) => (
//           <Link key={label} href={href} className="asc-mobile-link" onClick={() => setMenuOpen(false)}>
//             {label}
//           </Link>
//         ))}

//         <div className="asc-mobile-actions">
//           {!user && (
//             <button
//               className="asc-login-btn"
//               style={{ justifyContent: "center" }}
//               onClick={() => { setMenuOpen(false); onLogin?.(); }}
//             >
//               🔑 Login
//             </button>
//           )}

//           {user && (
//             <>
//               <button
//                 className="asc-login-btn"
//                 style={{ justifyContent: "center" }}
//                 onClick={handleDashboard}
//               >
//                 {user.role === "admin" ? "🛡️ Admin Panel" : "📊 Dashboard"}
//               </button>
//               <button
//                 className="asc-login-btn"
//                 style={{ justifyContent: "center", color: "#FF4444", borderColor: "rgba(255,68,68,0.18)" }}
//                 onClick={() => { setMenuOpen(false); onSignOut?.(); }}
//               >
//                 🚪 Sign Out
//               </button>
//             </>
//           )}

//           <Link
//             href="/contact"
//             className="asc-enrol-btn"
//             style={{ justifyContent: "center" }}
//             onClick={() => setMenuOpen(false)}
//           >
//             🎉 Enrol Now
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }










"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
};

type NavbarProps = {
  user?: AuthUser | null;
  onLogin?: () => void;
  onSignOut?: () => void;
  onDashboard?: () => void;
};

export default function Navbar({
  user = null,
  onLogin,
  onSignOut,
  onDashboard,
}: NavbarProps) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const dropRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "U";

  const handleDashboard = () => {
    setDropOpen(false);
    setMenuOpen(false);
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      onDashboard?.();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

        /* ─── Reset ─── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Navbar ─── */
        .asc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 12px 0;
          background: rgba(255,253,247,1);
          border: none; outline: none;
          transition: background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
          font-family: 'Nunito', sans-serif;
        }
        .asc-nav.scrolled {
          background: rgba(255,253,247,0.96);
          backdrop-filter: blur(16px);
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        .asc-nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        /* ─── Logo ─── */
        .asc-logo {
          text-decoration: none; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .asc-logo-icon {
          width: 42px; height: 42px; border-radius: 14px;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; box-shadow: 0 4px 14px rgba(255,107,107,.4);
          flex-shrink: 0;
        }
        .asc-logo-text { display: flex; flex-direction: column; }
        .asc-logo-title {
          font-family: 'Fredoka One', cursive; font-size: 20px; color: #1A1A2E; line-height: 1;
        }
        .asc-logo-title span { color: #FF6B6B; }
        .asc-logo-sub {
          font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: #999; margin-top: 1px;
        }

        /* ─── Desktop nav links ─── */
        .asc-links { display: flex; gap: 24px; align-items: center; }
        .asc-link {
          position: relative; font-size: 14px; font-weight: 800;
          color: #1A1A2E; text-decoration: none; transition: color .2s;
          white-space: nowrap;
        }
        .asc-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 3px; border-radius: 3px; background: #FF6B6B;
          transition: width .3s cubic-bezier(.34,1.56,.64,1);
        }
        .asc-link:hover { color: #FF6B6B; }
        .asc-link:hover::after { width: 100%; }

        /* ─── Right slot ─── */
        .asc-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        /* ─── Login button ─── */
        .asc-login-btn {
          background: transparent; color: #1A1A2E;
          font-family: 'Nunito', inherit; font-weight: 800; font-size: 13px;
          padding: 9px 20px; border-radius: 50px;
          border: 2.5px solid rgba(26,26,46,0.18);
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          white-space: nowrap;
        }
        .asc-login-btn:hover {
          border-color: #FF6B6B; color: #FF6B6B;
          box-shadow: 0 4px 14px rgba(255,107,107,.18);
        }

        /* ─── Enrol button ─── */
        .asc-enrol-btn {
          background: #FF6B6B; color: #fff;
          font-family: 'Nunito', inherit; font-weight: 900; font-size: 13px;
          padding: 9px 20px; border-radius: 50px; border: none;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 7px;
          box-shadow: 0 6px 20px rgba(255,107,107,.4);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          white-space: nowrap;
        }
        .asc-enrol-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 30px rgba(255,107,107,.5);
        }

        /* ─── User avatar trigger ─── */
        .asc-user-trigger {
          display: flex; align-items: center; gap: 8px;
          cursor: pointer; padding: 5px 12px 5px 5px;
          border-radius: 50px; border: 2.5px solid transparent;
          transition: all .25s; position: relative;
          background: transparent; font-family: 'Nunito', inherit;
        }
        .asc-user-trigger:hover,
        .asc-user-trigger.open {
          border-color: rgba(255,107,107,0.2);
          background: #FFF0F0;
        }
        .asc-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 900; color: white;
          flex-shrink: 0; overflow: hidden;
        }
        .asc-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .asc-user-name {
          font-size: 13px; font-weight: 800; color: #1A1A2E;
          max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .asc-chevron {
          font-size: 9px; color: #999;
          transition: transform .25s; display: inline-block;
        }
        .asc-chevron.open { transform: rotate(180deg); }

        .asc-admin-badge {
          font-size: 9px; font-weight: 900; letter-spacing: 0.08em;
          text-transform: uppercase; color: #FF6B6B;
          background: #FFF0F0; border: 1.5px solid #FFD6D6;
          border-radius: 6px; padding: 2px 6px; flex-shrink: 0;
        }

        /* ─── Dropdown ─── */
        .asc-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: white; border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.07);
          border: 2px solid #FFF0F0;
          padding: 8px; min-width: 220px;
          animation: ascDropIn .25s cubic-bezier(.34,1.56,.64,1) both;
          z-index: 1100;
        }
        @keyframes ascDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .asc-drop-header {
          padding: 12px 14px 10px;
          border-bottom: 1.5px solid #F5F5F5;
          margin-bottom: 6px;
        }
        .asc-drop-header-name { font-weight: 900; font-size: 14px; color: #1A1A2E; }
        .asc-drop-header-email {
          font-size: 11px; color: #999; font-weight: 700;
          margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .asc-drop-header-role {
          display: inline-flex; align-items: center; gap: 4px;
          margin-top: 6px; font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #FF6B6B; background: #FFF0F0;
          border: 1.5px solid #FFD6D6; border-radius: 6px; padding: 2px 8px;
        }
        .asc-drop-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 12px;
          font-size: 13px; font-weight: 800; color: #1A1A2E;
          cursor: pointer; text-decoration: none;
          transition: background .18s, color .18s;
          width: 100%; border: none; background: none;
          font-family: 'Nunito', inherit; text-align: left;
        }
        .asc-drop-item:hover { background: #FFF0F0; color: #FF6B6B; }
        .asc-drop-item.danger:hover { background: #FFF5F5; color: #FF4444; }
        .asc-drop-divider { height: 1.5px; background: #F5F5F5; margin: 6px 0; }

        /* ─── Hamburger ─── */
        .asc-hamburger {
          display: none; flex-direction: column; justify-content: center; gap: 5px;
          cursor: pointer; padding: 8px; background: none; border: none;
          width: 40px; height: 40px;
        }
        .asc-hamburger span {
          display: block; width: 22px; height: 2.5px;
          background: #1A1A2E; border-radius: 2px; transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .asc-hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .asc-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .asc-hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

        /* ─── Mobile Overlay ─── */
        .asc-mobile-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(26,26,46,0.3);
          backdrop-filter: blur(2px);
          z-index: 997;
          animation: overlayIn .3s ease both;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .asc-mobile-overlay.open { display: block; }

        /* ─── Mobile Drawer ─── */
        .asc-mobile-menu {
          display: none;
          position: fixed; top: 0; right: -100%; bottom: 0;
          width: min(320px, 85vw);
          background: #FFFDF7;
          padding: 0;
          box-shadow: -8px 0 40px rgba(0,0,0,.15);
          z-index: 998;
          transition: right .35s cubic-bezier(.34,1.56,.64,1);
          overflow-y: auto;
          flex-direction: column;
        }
        .asc-mobile-menu.open {
          display: flex;
          right: 0;
        }

        .asc-mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 2px solid #FFE8E8;
          background: white;
          position: sticky; top: 0; z-index: 1;
        }
        .asc-mobile-close {
          width: 36px; height: 36px; border-radius: 50%;
          background: #FFF0F0; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #FF6B6B;
          transition: background .2s, transform .2s;
        }
        .asc-mobile-close:hover { background: #FFE0E0; transform: rotate(90deg); }

        .asc-mobile-nav { padding: 12px 16px; flex: 1; }
        .asc-mobile-nav-label {
          font-size: 10px; font-weight: 900; letter-spacing: 0.14em;
          text-transform: uppercase; color: #BBB;
          padding: 8px 8px 4px;
        }
        .asc-mobile-link {
          display: flex; align-items: center; gap: 12px;
          font-size: 16px; font-weight: 800; color: #1A1A2E;
          text-decoration: none; padding: 13px 12px;
          border-radius: 14px;
          transition: background .2s, color .2s, transform .2s;
        }
        .asc-mobile-link:hover {
          background: #FFF0F0; color: #FF6B6B;
          transform: translateX(4px);
        }
        .asc-mobile-link-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #F5F5F5;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
          transition: background .2s;
        }
        .asc-mobile-link:hover .asc-mobile-link-icon { background: #FFE8E8; }

        .asc-mobile-divider {
          height: 1.5px; background: #F0EDE8; margin: 8px 0;
        }

        .asc-mobile-footer {
          padding: 16px; display: flex; flex-direction: column; gap: 10px;
          border-top: 2px solid #F0EDE8;
          background: white;
          position: sticky; bottom: 0;
        }
        .asc-mobile-user-bar {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; background: #FFF5F5;
          border-radius: 14px; border: 1.5px solid #FFE0E0;
          margin-bottom: 4px;
        }
        .asc-mobile-user-info { flex: 1; min-width: 0; }
        .asc-mobile-user-name {
          font-size: 14px; font-weight: 900; color: #1A1A2E;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .asc-mobile-user-email {
          font-size: 11px; color: #999; font-weight: 700;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          margin-top: 1px;
        }
        .asc-mobile-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px;
          padding: 13px 20px; border-radius: 14px; cursor: pointer;
          text-decoration: none; border: none; transition: all .25s;
          width: 100%;
        }
        .asc-mobile-btn-outline {
          background: transparent; color: #1A1A2E;
          border: 2.5px solid rgba(26,26,46,0.15);
        }
        .asc-mobile-btn-outline:hover {
          border-color: #FF6B6B; color: #FF6B6B; background: #FFF0F0;
        }
        .asc-mobile-btn-danger {
          background: #FFF0F0; color: #FF4444;
          border: 2px solid rgba(255,68,68,0.15);
        }
        .asc-mobile-btn-danger:hover { background: #FFE0E0; }
        .asc-mobile-btn-primary {
          background: #FF6B6B; color: white;
          box-shadow: 0 6px 20px rgba(255,107,107,.3);
        }
        .asc-mobile-btn-primary:hover {
          background: #FF5252; transform: scale(1.02);
          box-shadow: 0 10px 28px rgba(255,107,107,.4);
        }

        /* ─── Responsive Breakpoints ─── */

        /* Tablet: 769px – 1024px */
        @media (min-width: 769px) and (max-width: 1024px) {
          .asc-links { gap: 16px; }
          .asc-link { font-size: 13px; }
          .asc-logo-title { font-size: 18px; }
          .asc-logo-sub { display: none; }
          .asc-nav-inner { padding: 0 16px; }
        }

        /* Mobile: ≤ 768px */
        @media (max-width: 768px) {
          .asc-links { display: none; }
          .asc-enrol-btn { display: none; }
          .asc-login-btn { display: none; }
          .asc-user-trigger { display: none; }
          .asc-hamburger { display: flex; }
          .asc-nav-inner { padding: 0 16px; }
        }

        /* Small Mobile: ≤ 480px */
        @media (max-width: 480px) {
          .asc-logo-sub { display: none; }
          .asc-logo-title { font-size: 17px; }
          .asc-logo-icon { width: 36px; height: 36px; font-size: 18px; border-radius: 10px; }
          .asc-nav-inner { padding: 0 12px; }
          .asc-nav { padding: 10px 0; }
        }

        /* Extra Small: ≤ 360px */
        @media (max-width: 360px) {
          .asc-logo-text { display: none; }
        }
      `}</style>

      {/* ════ NAVBAR ════ */}
      <nav className={`asc-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="asc-nav-inner">

          {/* Logo */}
          <Link href="/" className="asc-logo">
            <div className="asc-logo-icon">🧮</div>
            <div className="asc-logo-text">
              <div className="asc-logo-title">Ascento <span>Abacus</span></div>
              <div className="asc-logo-sub">Brain Development Academy</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="asc-links">
            <Link href="/programs" className="asc-link">Programs</Link>
            <Link href="/#whyus"   className="asc-link">Why Us</Link>
            <Link href="/#gallery" className="asc-link">Gallery</Link>
            <Link href="/#team"    className="asc-link">Team</Link>
            <Link href="/contact"  className="asc-link">Contact</Link>
          </div>

          {/* Right: Auth + Enrol + Hamburger */}
          <div className="asc-right">

            {/* NOT logged in — desktop */}
            {!user && (
              <button className="asc-login-btn" onClick={onLogin}>
                <span>🔑</span>
                <span className="label">Login</span>
              </button>
            )}

            {/* Logged in: avatar + dropdown */}
            {user && (
              <div style={{ position: "relative" }} ref={dropRef}>
                <button
                  className={`asc-user-trigger${dropOpen ? " open" : ""}`}
                  onClick={() => setDropOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropOpen}
                >
                  <div className="asc-avatar">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name ?? "User"} />
                      : initials}
                  </div>
                  <span className="asc-user-name">
                    {user.name?.split(" ")[0] ?? user.email}
                  </span>
                  {user.role === "admin" && (
                    <span className="asc-admin-badge">Admin</span>
                  )}
                  <span className={`asc-chevron${dropOpen ? " open" : ""}`}>▼</span>
                </button>

                {dropOpen && (
                  <div className="asc-dropdown" role="menu">
                    <div className="asc-drop-header">
                      <div className="asc-drop-header-name">{user.name ?? user.email}</div>
                      {user.email && <div className="asc-drop-header-email">{user.email}</div>}
                      {user.role && (
                        <div className="asc-drop-header-role">
                          {user.role === "admin" ? "🛡️" : "👤"} {user.role}
                        </div>
                      )}
                    </div>

                    <button className="asc-drop-item" role="menuitem" onClick={handleDashboard}>
                      <span>{user.role === "admin" ? "🛡️" : "📊"}</span>
                      {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </button>

                    <Link href="/profile" className="asc-drop-item" role="menuitem" onClick={() => setDropOpen(false)}>
                      <span>👤</span> My Profile
                    </Link>

                    <Link href="/settings" className="asc-drop-item" role="menuitem" onClick={() => setDropOpen(false)}>
                      <span>⚙️</span> Settings
                    </Link>

                    <div className="asc-drop-divider" />

                    <button
                      className="asc-drop-item danger"
                      role="menuitem"
                      onClick={() => { setDropOpen(false); onSignOut?.(); }}
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link href="/contact" className="asc-enrol-btn">🎉 Enrol Now</Link>

            {/* Hamburger */}
            <button
              className={`asc-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ════ MOBILE OVERLAY ════ */}
      <div
        className={`asc-mobile-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ════ MOBILE DRAWER ════ */}
      <div className={`asc-mobile-menu${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">

        {/* Drawer Header */}
        <div className="asc-mobile-header">
          <Link href="/" className="asc-logo" onClick={() => setMenuOpen(false)}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧮</div>
            <div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", lineHeight: 1 }}>
                Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span>
              </div>
            </div>
          </Link>
          <button className="asc-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        {/* Nav Links */}
        <div className="asc-mobile-nav">
          <div className="asc-mobile-nav-label">Navigation</div>

          {[
            { label: "Programs",    href: "/programs",  icon: "📚" },
            { label: "Why Us",      href: "/#whyus",    icon: "✨" },
            { label: "Gallery",     href: "/#gallery",  icon: "📸" },
            { label: "Team",        href: "/#team",     icon: "👩‍🏫" },
            { label: "Contact",     href: "/contact",   icon: "📞" },
          ].map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="asc-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              <div className="asc-mobile-link-icon">{icon}</div>
              {label}
            </Link>
          ))}

          <div className="asc-mobile-divider" />
          <div className="asc-mobile-nav-label">Quick Links</div>

          <Link href="/franchise" className="asc-mobile-link" onClick={() => setMenuOpen(false)}>
            <div className="asc-mobile-link-icon">🏪</div>
            Open a Centre
          </Link>
          <Link href="/programs" className="asc-mobile-link" onClick={() => setMenuOpen(false)}>
            <div className="asc-mobile-link-icon">🧮</div>
            Free Trial Class
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="asc-mobile-footer">

          {/* Logged-in user info */}
          {user && (
            <div className="asc-mobile-user-bar">
              <div className="asc-avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name ?? "User"} />
                  : initials}
              </div>
              <div className="asc-mobile-user-info">
                <div className="asc-mobile-user-name">{user.name ?? user.email}</div>
                {user.email && user.name && (
                  <div className="asc-mobile-user-email">{user.email}</div>
                )}
              </div>
              {user.role === "admin" && (
                <span className="asc-admin-badge">Admin</span>
              )}
            </div>
          )}

          {/* Auth buttons */}
          {!user ? (
            <button
              className="asc-mobile-btn asc-mobile-btn-outline"
              onClick={() => { setMenuOpen(false); onLogin?.(); }}
            >
              🔑 Login to Account
            </button>
          ) : (
            <>
              <button
                className="asc-mobile-btn asc-mobile-btn-outline"
                onClick={handleDashboard}
              >
                {user.role === "admin" ? "🛡️ Admin Panel" : "📊 Dashboard"}
              </button>
              <button
                className="asc-mobile-btn asc-mobile-btn-danger"
                onClick={() => { setMenuOpen(false); onSignOut?.(); }}
              >
                🚪 Sign Out
              </button>
            </>
          )}

          {/* Always show Enrol CTA */}
          <Link
            href="/contact"
            className="asc-mobile-btn asc-mobile-btn-primary"
            onClick={() => setMenuOpen(false)}
          >
            🎉 Enrol Now — It's Free!
          </Link>
        </div>
      </div>
    </>
  );
}