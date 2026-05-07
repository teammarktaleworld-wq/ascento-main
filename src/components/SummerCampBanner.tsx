






// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// function Sparkle({ style }: { style: React.CSSProperties }) {
//   return (
//     <span
//       aria-hidden
//       style={{
//         position: "absolute",
//         fontSize: 18,
//         animation: "sc-sparkle 2s ease-in-out infinite",
//         ...style,
//       }}
//     >
//       ✦
//     </span>
//   );
// }

// export default function SummerCampBanner() {
//   const [visible, setVisible] = useState(true);
//   const [shimmer, setShimmer] = useState(false);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setShimmer(true);
//       setTimeout(() => setShimmer(false), 900);
//     }, 4000);
//     return () => clearInterval(id);
//   }, []);

//   if (!visible) return null;

//   return (
//     <>
//       <style>{`
//         @keyframes sc-marquee {
//           from { transform: translateX(0); }
//           to   { transform: translateX(-50%); }
//         }
//         @keyframes sc-sparkle {
//           0%,100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
//           50%      { opacity: 1;   transform: scale(1.3) rotate(20deg); }
//         }
//         @keyframes sc-pulse {
//           0%,100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.5); }
//           50%      { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
//         }
//         @keyframes sc-shake {
//           0%,100% { transform: rotate(-2deg); }
//           50%      { transform: rotate(2deg);  }
//         }
//         @keyframes sc-shimmer {
//           0%   { background-position: -200% center; }
//           100% { background-position:  200% center; }
//         }
//         .sc-cta-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: white;
//           color: #FF6B6B;
//           font-family: inherit;
//           font-weight: 900;
//           font-size: 13px;
//           letter-spacing: 0.04em;
//           text-transform: uppercase;
//           text-decoration: none;
//           padding: 10px 22px;
//           border-radius: 50px;
//           white-space: nowrap;
//           box-shadow: 0 4px 18px rgba(0,0,0,0.18);
//           transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
//           animation: sc-pulse 2.5s ease-in-out infinite;
//         }
//         .sc-cta-btn:hover {
//           transform: scale(1.08) translateY(-2px);
//           box-shadow: 0 10px 28px rgba(0,0,0,0.22);
//           animation: none;
//         }
//         .sc-close {
//           background: rgba(255,255,255,0.15);
//           border: none;
//           cursor: pointer;
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 15px;
//           font-weight: 900;
//           flex-shrink: 0;
//           transition: background 0.2s;
//         }
//         .sc-close:hover { background: rgba(255,255,255,0.3); }
//         .sc-emoji { animation: sc-shake 1.8s ease-in-out infinite; display: inline-block; }
//         .sc-social-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 11px;
//           font-weight: 900;
//           color: white;
//           text-decoration: none;
//           background: rgba(255,255,255,0.15);
//           border: 1.5px solid rgba(255,255,255,0.35);
//           border-radius: 50px;
//           padding: 4px 12px;
//           white-space: nowrap;
//           transition: background 0.2s, transform 0.2s;
//         }
//         .sc-social-btn:hover {
//           background: rgba(255,255,255,0.28);
//           transform: translateY(-1px);
//         }
//       `}</style>

//       <div
//         style={{
//           position: "relative",
//           zIndex: 500,
//           overflow: "hidden",
//           background: "linear-gradient(90deg, #FF6B6B 0%, #FF8E53 35%, #FFB347 65%, #FF6B6B 100%)",
//           backgroundSize: "200% auto",
//           animation: shimmer ? "sc-shimmer 0.9s linear" : "none",
//         }}
//       >
//         {/* decorative dots */}
//         <div
//           aria-hidden
//           style={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
//             backgroundSize: "20px 20px",
//             pointerEvents: "none",
//           }}
//         />

//         <Sparkle style={{ top: 6,    left: "8%",   color: "rgba(255,255,255,0.7)",  animationDelay: "0s"   }} />
//         <Sparkle style={{ top: 8,    left: "22%",  color: "rgba(255,255,255,0.5)",  animationDelay: "0.5s" }} />
//         <Sparkle style={{ bottom: 6, left: "45%",  color: "rgba(255,255,255,0.6)",  animationDelay: "1s"   }} />
//         <Sparkle style={{ top: 4,    right: "30%", color: "rgba(255,255,255,0.55)", animationDelay: "0.8s" }} />
//         <Sparkle style={{ bottom: 5, right: "12%", color: "rgba(255,255,255,0.65)", animationDelay: "0.3s" }} />

//         {/* TOP MICRO-TICKER */}
//         <div style={{ background: "rgba(0,0,0,0.12)", padding: "3px 0", overflow: "hidden" }}>
//           <div style={{ display: "flex", animation: "sc-marquee 20s linear infinite", whiteSpace: "nowrap" }}>
//             {[...Array(2)].map((_, ri) => (
//               <div key={ri} style={{ display: "flex", flexShrink: 0 }}>
//                 {[
//                   "☀️ Summer Camp 2025",
//                   "🎨 Art & Craft",
//                   "🧮 Abacus & Vedic Maths",
//                   "🥋 Karate & Self Defence",
//                   "🎵 Dance & Music",
//                   "♟️ Chess & Brain Games",
//                   "✍️ Calligraphy",
//                   "📖 Holiday Homework Help",
//                   "🧠 Brain Development",
//                 ].map((item) => (
//                   <span
//                     key={item}
//                     style={{
//                       fontSize: 10, fontWeight: 900,
//                       letterSpacing: "0.15em", textTransform: "uppercase",
//                       color: "rgba(255,255,255,0.9)", padding: "0 20px",
//                     }}
//                   >
//                     {item}
//                     <span style={{ opacity: 0.4, margin: "0 6px" }}>✦</span>
//                   </span>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* MAIN BANNER CONTENT */}
//         <div
//           style={{
//             maxWidth: 1200, margin: "0 auto", padding: "10px 20px",
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             gap: 16, position: "relative", zIndex: 1,
//           }}
//         >
//           {/* LEFT */}
//           <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
//             <div style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 10, padding: "5px 11px", flexShrink: 0 }}>
//               <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
//                 🔥 NEW
//               </span>
//             </div>
//             <p style={{ margin: 0, fontFamily: "'Fredoka One', 'Nunito', system-ui, cursive", fontSize: "clamp(14px, 2vw, 18px)", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//               <span className="sc-emoji">☀️</span>{" "}
//               <strong>Dwarka's Biggest Summer Camp</strong> is LIVE!&nbsp;
//               <span style={{ fontWeight: 700, fontSize: "0.85em", opacity: 0.9 }}>
//                 Ages 5–15 · Starts 11th May · 8 AM–1 PM
//               </span>
//             </p>
//           </div>

//           {/* RIGHT */}
//           <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
//             <div style={{ display: "flex", gap: 6 }}>
//               {["🎨 Art & Craft", "🥋 Karate", "🧮 Abacus", "🎵 Dance"].map((pill) => (
//                 <span key={pill} style={{ fontSize: 11, fontWeight: 800, color: "white", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 50, padding: "3px 10px", whiteSpace: "nowrap" }}>
//                   {pill}
//                 </span>
//               ))}
//               <span style={{ fontSize: 11, fontWeight: 800, color: "white", background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 50, padding: "3px 10px", whiteSpace: "nowrap" }}>
//                 +More!
//               </span>
//             </div>
//             <Link href="/summer-camp" className="sc-cta-btn">Register Free →</Link>
//             <button onClick={() => setVisible(false)} className="sc-close" aria-label="Close banner" title="Dismiss">✕</button>
//           </div>
//         </div>

//         {/* BOTTOM STRIP — info + social */}
//         <div
//           style={{
//             background: "rgba(0,0,0,0.12)",
//             padding: "6px 20px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             gap: 8,
//           }}
//         >
//           {/* Info details */}
//           <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
//             {[
//               { icon: "📅", text: "Starts 11th May 2025" },
//               { icon: "🕗", text: "8:00 AM – 1:00 PM" },
//               { icon: "👦", text: "Age 5–15 Years" },
//               { icon: "📍", text: "Patel Garden, Dwarka Mor" },
//               { icon: "📞", text: "9810366417" },
//             ].map(({ icon, text }) => (
//               <span key={text} style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.92)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
//                 {icon} {text}
//               </span>
//             ))}
//           </div>

//           {/* Social media */}
//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 2 }}>
//               Follow Us:
//             </span>

//             {/* Instagram */}
//             <a href="https://www.instagram.com/ascentoabacus/" target="_blank" rel="noreferrer" className="sc-social-btn" title="Instagram">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
//                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//               </svg>
//               Instagram
//             </a>

//             {/* Facebook */}
//             <a href="https://www.facebook.com/ASCENTOABACUS/" target="_blank" rel="noreferrer" className="sc-social-btn" title="Facebook">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//               </svg>
//               Facebook
//             </a>

//             {/* LinkedIn */}
//             <a href="https://www.linkedin.com/company/103174291/" target="_blank" rel="noreferrer" className="sc-social-btn" title="LinkedIn">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
//                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//               </svg>
//               LinkedIn
//             </a>

//             {/* WhatsApp */}
//             <a href="https://wa.me/919810366417" target="_blank" rel="noreferrer" className="sc-social-btn" title="WhatsApp">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
//                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//               </svg>
//               WhatsApp
//             </a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }












"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        fontSize: 18,
        animation: "sc-sparkle 2s ease-in-out infinite",
        ...style,
      }}
    >
      ✦
    </span>
  );
}

export default function SummerCampBanner() {
  const [visible, setVisible] = useState(true);
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 900);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes sc-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes sc-sparkle {
          0%,100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
          50%      { opacity: 1;   transform: scale(1.3) rotate(20deg); }
        }
        @keyframes sc-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
        }
        @keyframes sc-shake {
          0%,100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg);  }
        }
        @keyframes sc-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .sc-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #FF6B6B;
          font-family: inherit;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 50px;
          white-space: nowrap;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
          animation: sc-pulse 2.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        .sc-cta-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.22);
          animation: none;
        }
        .sc-close {
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 15px;
          font-weight: 900;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .sc-close:hover { background: rgba(255,255,255,0.3); }
        .sc-emoji { animation: sc-shake 1.8s ease-in-out infinite; display: inline-block; }

        .sc-social-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 900;
          color: white;
          text-decoration: none;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 50px;
          padding: 4px 12px;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }
        .sc-social-btn:hover {
          background: rgba(255,255,255,0.28);
          transform: translateY(-1px);
        }

        /* ── Pills row ── */
        .sc-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        /* ── Main content row ── */
        .sc-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          zIndex: 1;
        }
        .sc-main-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }
        .sc-main-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .sc-main-title {
          margin: 0;
          font-family: "'Fredoka One', 'Nunito', system-ui, cursive";
          font-size: clamp(13px, 2vw, 18px);
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Bottom strip ── */
        .sc-bottom {
          background: rgba(0,0,0,0.12);
          padding: 6px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sc-info-list {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .sc-social-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ════════════════════════════════
           MEDIA QUERIES
        ════════════════════════════════ */

        /* Tablet: ≤ 900px */
        @media (max-width: 900px) {
          .sc-pills { display: none; }
          .sc-main-title { font-size: 13px !important; }
          .sc-new-badge { display: none; }
        }

        /* Mobile: ≤ 640px */
        @media (max-width: 640px) {
          .sc-main {
            padding: 8px 12px;
            gap: 10px;
          }
          .sc-main-left { gap: 8px; }
          .sc-main-title {
            font-size: 12px !important;
            white-space: normal;
            line-height: 1.3;
          }
          .sc-cta-btn {
            font-size: 11px;
            padding: 8px 14px;
          }
          .sc-bottom {
            padding: 5px 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .sc-info-list {
            gap: 10px;
          }
          .sc-info-list span {
            font-size: 10px !important;
          }
          .sc-social-row { display: none; }
        }

        /* Small Mobile: ≤ 400px */
        @media (max-width: 400px) {
          .sc-main-title .sc-meta { display: none; }
          .sc-info-list { gap: 6px; }
          .sc-info-list span:nth-child(n+4) { display: none; }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 500,
          overflow: "hidden",
          background: "linear-gradient(90deg,#FF6B6B 0%,#FF8E53 35%,#FFB347 65%,#FF6B6B 100%)",
          backgroundSize: "200% auto",
          animation: shimmer ? "sc-shimmer 0.9s linear" : "none",
        }}
      >
        {/* Decorative dots */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.18) 1px,transparent 1px)",
            backgroundSize: "20px 20px", pointerEvents: "none",
          }}
        />

        <Sparkle style={{ top: 6,    left: "8%",   color: "rgba(255,255,255,0.7)",  animationDelay: "0s"   }} />
        <Sparkle style={{ top: 8,    left: "22%",  color: "rgba(255,255,255,0.5)",  animationDelay: "0.5s" }} />
        <Sparkle style={{ bottom: 6, left: "45%",  color: "rgba(255,255,255,0.6)",  animationDelay: "1s"   }} />
        <Sparkle style={{ top: 4,    right: "30%", color: "rgba(255,255,255,0.55)", animationDelay: "0.8s" }} />
        <Sparkle style={{ bottom: 5, right: "12%", color: "rgba(255,255,255,0.65)", animationDelay: "0.3s" }} />

        {/* Top micro-ticker */}
        <div style={{ background: "rgba(0,0,0,0.12)", padding: "3px 0", overflow: "hidden" }}>
          <div style={{ display: "flex", animation: "sc-marquee 20s linear infinite", whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_,ri) => (
              <div key={ri} style={{ display: "flex", flexShrink: 0 }}>
                {["☀️ Summer Camp 2025","🎨 Art & Craft","🧮 Abacus & Vedic Maths","🥋 Karate & Self Defence","🎵 Dance & Music","♟️ Chess & Brain Games","✍️ Calligraphy","📖 Holiday Homework Help","🧠 Brain Development"].map(item => (
                  <span key={item} style={{ fontSize:10, fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)", padding:"0 20px" }}>
                    {item}<span style={{ opacity:0.4, margin:"0 6px" }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main banner content */}
        <div className="sc-main">
          {/* Left */}
          <div className="sc-main-left">
            <div className="sc-new-badge" style={{ background:"rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.4)", borderRadius:10, padding:"5px 11px", flexShrink:0 }}>
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"white" }}>🔥 NEW</span>
            </div>
            <p className="sc-main-title">
              <span className="sc-emoji">☀️</span>{" "}
              <strong>Dwarka's Biggest Summer Camp</strong> is LIVE!&nbsp;
              <span className="sc-meta" style={{ fontWeight:700, fontSize:"0.85em", opacity:0.9 }}>
                Ages 5–15 · Starts 11th May · 8 AM–1 PM
              </span>
            </p>
          </div>

          {/* Right */}
          <div className="sc-main-right">
            <div className="sc-pills">
              {["🎨 Art & Craft","🥋 Karate","🧮 Abacus","🎵 Dance"].map(pill => (
                <span key={pill} style={{ fontSize:11, fontWeight:800, color:"white", background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.35)", borderRadius:50, padding:"3px 10px", whiteSpace:"nowrap" }}>
                  {pill}
                </span>
              ))}
              <span style={{ fontSize:11, fontWeight:800, color:"white", background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.35)", borderRadius:50, padding:"3px 10px", whiteSpace:"nowrap" }}>
                +More!
              </span>
            </div>
            <Link href="/summer-camp" className="sc-cta-btn">Register Free →</Link>
            <button onClick={() => setVisible(false)} className="sc-close" aria-label="Close banner">✕</button>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="sc-bottom">
          <div className="sc-info-list">
            {[
              { icon:"📅", text:"Starts 11th May 2025" },
              { icon:"🕗", text:"8:00 AM – 1:00 PM" },
              { icon:"👦", text:"Age 5–15 Years" },
              { icon:"📍", text:"Patel Garden, Dwarka Mor" },
              { icon:"📞", text:"9810366417" },
            ].map(({ icon, text }) => (
              <span key={text} style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.92)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                {icon} {text}
              </span>
            ))}
          </div>

          <div className="sc-social-row">
            <span style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginRight:2 }}>Follow Us:</span>

            <a href="https://www.instagram.com/ascentoabacus/" target="_blank" rel="noreferrer" className="sc-social-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/ASCENTOABACUS/" target="_blank" rel="noreferrer" className="sc-social-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a href="https://wa.me/919810366417" target="_blank" rel="noreferrer" className="sc-social-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}