



// "use client";

// import Link from "next/link";

// const programs = [
//   {
//     id: "abacus",
//     emoji: "🧮",
//     title: "Abacus Mastery",
//     subtitle: "A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.",
//     age: "Ages 4–14",
//     img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
//     color: "#FF6B6B",
//     bg: "#FFF0F0",
//     tag: "Most Popular",
//     points: [
//       "11 progressive levels (O to 10)",
//       "Two-hand, four-finger methodology",
//       "Mental math mastery & visualization",
//       "Competition-ready skills",
//       "Boosted concentration & memory",
//     ],
//     levels: ["Junior (4–6 yrs)", "Foundation (6–9 yrs)", "Intermediate (9–11 yrs)", "Advanced (11–13 yrs)", "Grand Master"],
//     format: "120 min, twice a week (Levels 1–10)",
//   },
//   {
//     id: "vedic",
//     emoji: "📐",
//     title: "Vedic Maths",
//     subtitle: "Ancient Vedic sutras applied to modern speed mathematics — from rapid arithmetic through algebraic polynomials and cube roots.",
//     age: "Ages 10+",
//     img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
//     color: "#A78BFA",
//     bg: "#F5F0FF",
//     tag: "Mind-Blowing",
//     points: [
//       "4 comprehensive levels",
//       "16 ancient Vedic sutras",
//       "10x faster calculations",
//       "Perfect for JEE / NEET prep",
//       "Reduces exam anxiety",
//     ],
//     levels: ["Foundation (10–12 yrs)", "Intermediate (12–14 yrs)", "Advanced / Competitive", "Expert"],
//     format: "60 min, 2 classes / week",
//   },
//   {
//     id: "playschool",
//     emoji: "🌟",
//     title: "Pre-Abacus",
//     subtitle: "A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.",
//     age: "Ages 1.5–8",
//     img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
//     color: "#F06292",
//     bg: "#FFF0F5",
//     tag: "For Tiny Minds",
//     points: [
//       "Toddler to Class 2 (7 stages)",
//       "English, Hindi, Maths & EVS",
//       "Communication & confidence",
//       "Fine motor skill development",
//       "School readiness programme",
//     ],
//     levels: ["Toddler (1.5–2.5 yrs)", "Nursery (2.5–3.5 yrs)", "Jr. KG (3.5–4.5 yrs)", "Sr. KG (4.5–5.5 yrs)", "Class 1–2 Bridge"],
//     format: "30–45 min, 3 classes / week",
//   },
//   {
//     id: "braingym",
//     emoji: "🧠",
//     title: "Brain Gym",
//     subtitle: "Cognitive enhancement exercises designed to activate both brain hemispheres, improve focus, coordination, and learning readiness.",
//     age: "All ages",
//     img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",
//     color: "#4ECDC4",
//     bg: "#F0FFFE",
//     tag: "Fan Favourite",
//     points: [
//       "26 targeted body movements",
//       "Whole-brain activation",
//       "Enhanced focus & attention",
//       "Better reading & writing",
//       "Stress relief & emotional balance",
//     ],
//     levels: ["Starter (all ages)", "Intermediate", "Advanced Integration"],
//     format: "30–45 min / session, daily recommended",
//   },
//   {
//     id: "tuitions",
//     emoji: "📚",
//     title: "Tuitions",
//     subtitle: "Expert academic support for Maths and Science from Class 1 to 12, in small batches with personalised attention every session.",
//     age: "Ages 5–17",
//     img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
//     color: "#FFB347",
//     bg: "#FFF8EE",
//     tag: "New! 🎉",
//     points: [
//       "Small batches (max 8 students)",
//       "Covers CBSE, ICSE & State Boards",
//       "Doubt-clearing every session",
//       "Monthly parent progress reports",
//       "Exam preparation & mock tests",
//     ],
//     levels: ["Primary (Class 1–5)", "Middle School (Class 6–8)", "High School (Class 9–10)", "Senior Secondary (Class 11–12)"],
//     format: "60–90 min, 3–5 classes / week",
//   },
// ];

// export default function ProgramsPage() {
//   return (
//     <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
//         @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

//         .float-a { animation: float-a 4s ease-in-out infinite; }
//         .float-b { animation: float-b 5s ease-in-out infinite; }

//         .prog-card { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s; }
//         .prog-card:hover { transform: translateY(-8px); box-shadow: 0 32px 60px rgba(0,0,0,.13); }

//         .benefit-item {
//           display: flex; align-items: center; gap: 10px;
//           padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,.06);
//           font-size: 14px; font-weight: 700; color: #444;
//         }
//         .benefit-item:last-child { border-bottom: none; }

//         .level-pill {
//           display: inline-block; font-size: 12px; font-weight: 800;
//           padding: 5px 14px; border-radius: 50px; margin: 4px;
//         }

//         .enrol-btn {
//           background: #FF6B6B; color: #fff; font-family: inherit;
//           font-weight: 900; font-size: 15px; padding: 14px 32px;
//           border-radius: 50px; border: none; cursor: pointer;
//           text-decoration: none; display: inline-flex; align-items: center;
//           gap: 8px; box-shadow: 0 6px 20px rgba(255,107,107,.4);
//           transition: all .3s cubic-bezier(.34,1.56,.64,1);
//         }
//         .enrol-btn:hover { transform: scale(1.07) translateY(-2px); box-shadow: 0 12px 30px rgba(255,107,107,.5); }

//         .pill-nav { transition: all .2s; }
//         .pill-nav:hover { opacity: 0.85; transform: scale(1.04); }

//         /* Quick nav sticky bar */
//         .prog-quick-nav {
//           background: white; border-bottom: 2px solid #FFF0E8;
//           position: sticky; top: 0; z-index: 100;
//         }
//         .prog-quick-nav-inner {
//           max-width: 1200px; margin: 0 auto;
//           padding: 14px 24px;
//           display: flex; gap: 12px; overflow-x: auto;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//         }
//         .prog-quick-nav-inner::-webkit-scrollbar { display: none; }

//         /* Program card grid */
//         .prog-card-grid {
//           display: grid;
//           grid-template-columns: 400px 1fr;
//           border-radius: 36px;
//           overflow: hidden;
//           border-width: 3px;
//           border-style: solid;
//           box-shadow: 0 8px 40px rgba(0,0,0,.07);
//           background: white;
//         }
//         .prog-card-grid.reverse {
//           grid-template-columns: 1fr 400px;
//         }
//         .prog-card-img {
//           position: relative;
//           overflow: hidden;
//           min-height: 380px;
//         }
//         .prog-card-img img {
//           width: 100%; height: 100%;
//           object-fit: cover; display: block;
//         }
//         .prog-card-content {
//           padding: 44px;
//         }
//         .prog-inner-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 24px;
//           margin-bottom: 28px;
//         }

//         /* Hero floating decorations */
//         .prog-hero-deco { pointer-events: none; }

//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-track { background: #fff; }
//         ::-webkit-scrollbar-thumb { background: #FFB347; border-radius: 4px; }

//         /* ════════════════════════════════
//            MEDIA QUERIES
//         ════════════════════════════════ */

//         /* Tablet: ≤ 900px */
//         @media (max-width: 900px) {
//           .prog-card-grid,
//           .prog-card-grid.reverse {
//             grid-template-columns: 1fr !important;
//           }
//           /* Always put image on top on tablet/mobile */
//           .prog-card-img { min-height: 240px; order: -1 !important; }
//           .prog-card-content { padding: 28px 28px 32px; }
//           .prog-inner-grid { grid-template-columns: 1fr; gap: 20px; }
//           .prog-hero-deco { display: none; }
//         }

//         /* Mobile: ≤ 640px */
//         @media (max-width: 640px) {
//           /* Hero */
//           .prog-hero { padding-top: 80px !important; padding-bottom: 48px !important; }
//           .prog-hero h1 { font-size: clamp(28px, 8vw, 44px) !important; }
//           .prog-hero p  { font-size: 15px !important; }
//           .prog-hero-btns { flex-direction: column; align-items: center; }
//           .prog-hero-btns .browse-btn { display: none; }

//           /* Quick nav */
//           .prog-quick-nav-inner { padding: 10px 12px; gap: 8px; }
//           .pill-nav { font-size: 12px !important; padding: 6px 14px !important; }

//           /* Card */
//           .prog-card-img  { min-height: 200px; }
//           .prog-card-content { padding: 20px 16px 24px; }
//           .prog-card-header { flex-direction: column; gap: 10px; }
//           .prog-card-header-emoji { font-size: 40px !important; }
//           .prog-card-header-title { font-size: 22px !important; }
//           .benefit-item { font-size: 13px; }
//           .level-pill { font-size: 11px; padding: 4px 10px; }
//           .prog-cta-row { flex-direction: column; gap: 10px; }
//           .prog-cta-row a { text-align: center; justify-content: center; width: 100%; }

//           /* Section padding */
//           .prog-all-section { padding: 48px 0 80px !important; }
//           .prog-all-inner { padding: 0 12px !important; }
//           .prog-item { margin-bottom: 40px !important; }

//           /* Bottom CTA */
//           .prog-bottom-cta { padding: 48px 0 !important; }
//           .prog-bottom-cta h2 { font-size: clamp(22px,6vw,36px) !important; }
//           .prog-bottom-cta p  { font-size: 15px !important; }

//           /* Footer */
//           .prog-footer { padding: 28px 0 16px !important; }
//         }

//         /* Small Mobile: ≤ 400px */
//         @media (max-width: 400px) {
//           .prog-card-content { padding: 16px 12px 20px; }
//           .enrol-btn { font-size: 13px; padding: 12px 20px; }
//         }
//       `}</style>

//       {/* ── HERO ── */}
//       <section
//         className="prog-hero"
//         style={{ paddingTop: 100, paddingBottom: 80, background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}
//       >
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />

//         {/* ✅ FIX: removed duplicate className — animation applied via style instead */}
//         <div className="prog-hero-deco float-a" style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }}>📚</div>
//         <div className="prog-hero-deco float-b" style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }}>🧠</div>
//         <div className="prog-hero-deco float-b" style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }}>🧮</div>
//         <div className="prog-hero-deco float-a" style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }}>⭐</div>

//         <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid #FFD6D6" }}>
//             <span>📚</span>
//             <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Our Curriculum</span>
//           </div>
//           <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(38px,5vw,68px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 20 }}>
//             5 Amazing <span style={{ color: "#FF6B6B" }}>Programmes</span><br />For Every Child! 🎓
//           </h1>
//           <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px", fontWeight: 600 }}>
//             From tiny tots taking their first number steps to teenagers conquering competitive exams — we have the perfect programme for your child.
//           </p>
//           <div className="prog-hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
//             <Link href="/contact" className="enrol-btn" style={{ fontSize: 16, padding: "16px 36px" }}>🎉 Book a Free Trial</Link>
//             <a href="#all-programs" className="browse-btn" style={{ background: "transparent", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 50, border: "3px solid #1A1A2E", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .3s" }}>
//               🔍 Browse All
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* ── QUICK NAV PILLS ── */}
//       <div className="prog-quick-nav">
//         <div className="prog-quick-nav-inner">
//           {programs.map(p => (
//             <a key={p.id} className="pill-nav" href={`#prog-${p.id}`} style={{
//               display: "inline-flex", alignItems: "center", gap: 8,
//               background: p.bg, color: p.color, fontWeight: 800, fontSize: 13,
//               padding: "8px 18px", borderRadius: 50, border: `2px solid ${p.color}33`,
//               textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
//             }}>
//               {p.emoji} {p.title}
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* ── ALL PROGRAMS ── */}
//       <section id="all-programs" className="prog-all-section" style={{ padding: "80px 0 120px" }}>
//         <div className="prog-all-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           {programs.map((p, idx) => (
//             <div
//               key={p.id}
//               id={`prog-${p.id}`}
//               className="prog-item"
//               style={{ marginBottom: 80, scrollMarginTop: 100 }}
//             >
//               <div
//                 className={`prog-card prog-card-grid${idx % 2 !== 0 ? " reverse" : ""}`}
//                 style={{ borderColor: `${p.color}22` }}
//               >
//                 {/* Image — left for even, right for odd (reordered via CSS on mobile) */}
//                 <div
//                   className="prog-card-img"
//                   style={{ background: p.bg, order: idx % 2 === 0 ? 0 : 2 }}
//                 >
//                   <img src={p.img} alt={p.title} />
//                   {/* Gradient overlay — direction changes with layout */}
//                   <div style={{
//                     position: "absolute", inset: 0,
//                     background: idx % 2 === 0
//                       ? "linear-gradient(to right,transparent 60%,white)"
//                       : "linear-gradient(to left,transparent 60%,white)",
//                   }} />
//                   <div style={{
//                     position: "absolute",
//                     top: 20,
//                     ...(idx % 2 === 0 ? { left: 20 } : { right: 20 }),
//                     background: p.color, color: "white", fontSize: 11, fontWeight: 900,
//                     letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 50,
//                   }}>{p.tag}</div>
//                 </div>

//                 {/* Content */}
//                 <div className="prog-card-content" style={{ order: 1 }}>
//                   {/* Header */}
//                   <div className="prog-card-header" style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
//                     {/* ✅ FIX: removed duplicate className on emoji div */}
//                     <div className="prog-card-header-emoji float-b" style={{ fontSize: 52, lineHeight: 1 }}>{p.emoji}</div>
//                     <div>
//                       <h2 className="prog-card-header-title" style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 6 }}>{p.title}</h2>
//                       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                         <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: p.color + "18", color: p.color }}>{p.age}</span>
//                         <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: "#F5F5F5", color: "#888" }}>⏱ {p.format}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <p style={{ fontSize: 15, lineHeight: 1.75, color: "#555", marginBottom: 24, fontWeight: 600 }}>{p.subtitle}</p>

//                   {/* Two columns: benefits + levels */}
//                   <div className="prog-inner-grid">
//                     {/* Key Points */}
//                     <div>
//                       <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>✨ Key Benefits</div>
//                       <div>
//                         {p.points.map(b => (
//                           <div key={b} className="benefit-item">
//                             <span style={{ width: 20, height: 20, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0 }}>✓</span>
//                             {b}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Levels */}
//                     <div>
//                       <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>🎯 Levels Offered</div>
//                       <div style={{ display: "flex", flexWrap: "wrap" }}>
//                         {p.levels.map((lv, li) => (
//                           <span key={lv} className="level-pill" style={{ background: p.color + "15", color: p.color, border: `1.5px solid ${p.color}33` }}>
//                             {String(li + 1).padStart(2, "0")} {lv}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* CTA */}
//                   <div className="prog-cta-row" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
//                     <Link href="/contact" className="enrol-btn" style={{ background: p.color, boxShadow: `0 6px 20px ${p.color}55` }}>
//                       🎉 Enrol in {p.title}
//                     </Link>
//                     <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 14, color: "#666", textDecoration: "none", padding: "12px 20px", borderRadius: 50, border: "2px solid #eee", transition: "all .2s" }}>
//                       📞 Book Free Trial →
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── BOTTOM CTA ── */}
//       <section className="prog-bottom-cta" style={{ padding: "80px 0", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", textAlign: "center", position: "relative", overflow: "hidden" }}>
//         <div style={{ position: "absolute", top: "50%", left: "5%", fontSize: 120, opacity: 0.08, transform: "translateY(-50%)", fontFamily: "'Fredoka One',cursive" }}>FUN!</div>
//         <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,52px)", color: "white", marginBottom: 16 }}>
//             Not Sure Which Programme? 🤔
//           </h2>
//           <p style={{ fontSize: 18, color: "rgba(255,255,255,.9)", marginBottom: 32, lineHeight: 1.6, fontWeight: 700 }}>
//             Book a <strong>FREE assessment class</strong> and our experts will recommend the perfect fit for your child&apos;s age, level and goals!
//           </p>
//           <Link href="/contact" style={{ background: "white", color: "#FF6B6B", fontFamily: "inherit", fontWeight: 900, fontSize: 18, padding: "18px 48px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
//             🎓 Book FREE Assessment
//           </Link>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer className="prog-footer" style={{ background: "#1A1A2E", padding: "40px 0 24px", textAlign: "center" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧮</div>
//             <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
//           </div>
//           <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>© 2025 Ascento Abacus. All rights reserved. Made with 💛 for young learners.</span>
//         </div>
//       </footer>
//     </div>
//   );
// }





"use client";

import Link from "next/link";
import Image from "next/image";

const programs = [
  {
    id: "abacus",
    emoji: "🧮",
    title: "Abacus Mastery",
    subtitle: "A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.",
    age: "Ages 4–14",
    img: "/programs/abacu.jpeg",
    color: "#FF6B6B",
    bg: "#FFF0F0",
    tag: "Most Popular",
    points: [
      "11 progressive levels (O to 10)",
      "Two-hand, four-finger methodology",
      "Mental math mastery & visualization",
      "Competition-ready skills",
      "Boosted concentration & memory",
    ],
    levels: ["Junior (4–6 yrs)", "Foundation (6–9 yrs)", "Intermediate (9–11 yrs)", "Advanced (11–13 yrs)", "Grand Master"],
    format: "120 min, twice a week (Levels 1–10)",
  },
  {
    id: "vedic",
    emoji: "📐",
    title: "Vedic Maths",
    subtitle: "Ancient Vedic sutras applied to modern speed mathematics — from rapid arithmetic through algebraic polynomials and cube roots.",
    age: "Ages 10+",
    img: "/programs/vedic image.jpg",
    color: "#A78BFA",
    bg: "#F5F0FF",
    tag: "Mind-Blowing",
    points: [
      "4 comprehensive levels",
      "16 ancient Vedic sutras",
      "10x faster calculations",
      "Perfect for JEE / NEET prep",
      "Reduces exam anxiety",
    ],
    levels: ["Foundation (10–12 yrs)", "Intermediate (12–14 yrs)", "Advanced / Competitive", "Expert"],
    format: "60 min, 2 classes / week",
  },
  {
    id: "playschool",
    emoji: "🌟",
    title: "Playschool",
    subtitle: "A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.",
    age: "Ages 1.5–8",
    img: "/programs/preabacus.jpeg",
    color: "#F06292",
    bg: "#FFF0F5",
    tag: "For Tiny Minds",
    points: [
      "Toddler to Class 2 (7 stages)",
      "English, Hindi, Maths & EVS",
      "Communication & confidence",
      "Fine motor skill development",
      "School readiness programme",
    ],
    levels: ["Toddler (1.5–2.5 yrs)", "Nursery (2.5–3.5 yrs)", "Jr. KG (3.5–4.5 yrs)", "Sr. KG (4.5–5.5 yrs)", "Class 1–2 Bridge"],
    format: "30–45 min, 3 classes / week",
  },
  {
    id: "braingym",
    emoji: "🧠",
    title: "Ascento Memory Enhancement Program & DMIT",
    subtitle: "Cognitive enhancement exercises designed to activate both brain hemispheres, improve focus, coordination, and learning readiness.",
    age: "All ages",
    img: "/programs/braingym.jpeg",
    color: "#4ECDC4",
    bg: "#F0FFFE",
    tag: "Fan Favourite",
    points: [
      "26 targeted body movements",
      "Whole-brain activation",
      "Enhanced focus & attention",
      "Better reading & writing",
      "Stress relief & emotional balance",
    ],
    levels: ["Starter (all ages)", "Intermediate", "Advanced Integration"],
    format: "30–45 min / session, daily recommended",
  },
  {
    id: "tuitions",
    emoji: "📚",
    title: "Tuitions",
    subtitle: "Expert academic support for Maths and Science from Class 1 to 12, in small batches with personalised attention every session.",
    age: "Ages 5–17",
    img: "/programs/tution.jpg",
    color: "#FFB347",
    bg: "#FFF8EE",
    tag: "New! 🎉",
    points: [
      "Small batches (max 8 students)",
      "Covers CBSE, ICSE & State Boards",
      "Doubt-clearing every session",
      "Monthly parent progress reports",
      "Exam preparation & mock tests",
    ],
    levels: ["Primary (Class 1–5)", "Middle School (Class 6–8)", "High School (Class 9–10)", "Senior Secondary (Class 11–12)"],
    format: "60–90 min, 3–5 classes / week",
  },
];

export default function ProgramsPage() {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5s ease-in-out infinite; }

        .prog-card { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s; }
        .prog-card:hover { transform: translateY(-8px); box-shadow: 0 32px 60px rgba(0,0,0,.13); }

        .benefit-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,.06);
          font-size: 14px; font-weight: 700; color: #444;
        }
        .benefit-item:last-child { border-bottom: none; }

        .level-pill {
          display: inline-block; font-size: 12px; font-weight: 800;
          padding: 5px 14px; border-radius: 50px; margin: 4px;
        }

        .enrol-btn {
          background: #FF6B6B; color: #fff; font-family: inherit;
          font-weight: 900; font-size: 15px; padding: 14px 32px;
          border-radius: 50px; border: none; cursor: pointer;
          text-decoration: none; display: inline-flex; align-items: center;
          gap: 8px; box-shadow: 0 6px 20px rgba(255,107,107,.4);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .enrol-btn:hover { transform: scale(1.07) translateY(-2px); box-shadow: 0 12px 30px rgba(255,107,107,.5); }

        .pill-nav { transition: all .2s; }
        .pill-nav:hover { opacity: 0.85; transform: scale(1.04); }

        /* ── Sticky quick-nav ── */
        .prog-quick-nav {
          background: white; border-bottom: 2px solid #FFF0E8;
          position: sticky; top: 0; z-index: 100;
        }
        .prog-quick-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 14px 24px;
          display: flex; gap: 12px; overflow-x: auto;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .prog-quick-nav-inner::-webkit-scrollbar { display: none; }

        /* ── Program card layout ── */
        .prog-card-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          border-radius: 36px; overflow: hidden;
          border-width: 3px; border-style: solid;
          box-shadow: 0 8px 40px rgba(0,0,0,.07);
          background: white;
        }
        .prog-card-grid.reverse { grid-template-columns: 1fr 400px; }

        /* The image cell must be position:relative for next/image fill */
        .prog-card-img {
          position: relative;
          overflow: hidden;
          min-height: 380px;
        }
        .prog-card-content { padding: 44px; }
        .prog-inner-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 24px; margin-bottom: 28px;
        }

        .prog-hero-deco { pointer-events: none; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fff; }
        ::-webkit-scrollbar-thumb { background: #FFB347; border-radius: 4px; }

        /* ── Tablet ≤ 900px ── */
        @media (max-width: 900px) {
          .prog-card-grid,
          .prog-card-grid.reverse { grid-template-columns: 1fr !important; }
          .prog-card-img { min-height: 240px; order: -1 !important; }
          .prog-card-content { padding: 28px 28px 32px; }
          .prog-inner-grid { grid-template-columns: 1fr; gap: 20px; }
          .prog-hero-deco { display: none; }
        }

        /* ── Mobile ≤ 640px ── */
        @media (max-width: 640px) {
          .prog-hero { padding-top: 80px !important; padding-bottom: 48px !important; }
          .prog-hero h1 { font-size: clamp(28px, 8vw, 44px) !important; }
          .prog-hero p  { font-size: 15px !important; }
          .prog-hero-btns { flex-direction: column; align-items: center; }
          .prog-hero-btns .browse-btn { display: none; }

          .prog-quick-nav-inner { padding: 10px 12px; gap: 8px; }
          .pill-nav { font-size: 12px !important; padding: 6px 14px !important; }

          .prog-card-img  { min-height: 200px; }
          .prog-card-content { padding: 20px 16px 24px; }
          .prog-card-header { flex-direction: column; gap: 10px; }
          .prog-card-header-emoji { font-size: 40px !important; }
          .prog-card-header-title { font-size: 22px !important; }
          .benefit-item { font-size: 13px; }
          .level-pill { font-size: 11px; padding: 4px 10px; }
          .prog-cta-row { flex-direction: column; gap: 10px; }
          .prog-cta-row a { text-align: center; justify-content: center; width: 100%; }

          .prog-all-section { padding: 48px 0 80px !important; }
          .prog-all-inner { padding: 0 12px !important; }
          .prog-item { margin-bottom: 40px !important; }

          .prog-bottom-cta { padding: 48px 0 !important; }
          .prog-bottom-cta h2 { font-size: clamp(22px,6vw,36px) !important; }
          .prog-bottom-cta p  { font-size: 15px !important; }
          .prog-footer { padding: 28px 0 16px !important; }
        }

        /* ── Small Mobile ≤ 400px ── */
        @media (max-width: 400px) {
          .prog-card-content { padding: 16px 12px 20px; }
          .enrol-btn { font-size: 13px; padding: 12px 20px; }
        }
      `}</style>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section
        className="prog-hero"
        style={{
          paddingTop: 100,
          paddingBottom: 80,
          background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Dot pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />

        {/* Floating decorations */}
        <div className="prog-hero-deco float-a" style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }}>📚</div>
        <div className="prog-hero-deco float-b" style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }}>🧠</div>
        <div className="prog-hero-deco float-b" style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }}>🧮</div>
        <div className="prog-hero-deco float-a" style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }}>⭐</div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid #FFD6D6" }}>
            <span>📚</span>
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Our Curriculum</span>
          </div>

          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(38px,5vw,68px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 20 }}>
            5 Amazing <span style={{ color: "#FF6B6B" }}>Programmes</span><br />For Every Child! 🎓
          </h1>

          <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px", fontWeight: 600 }}>
            From tiny tots taking their first number steps to teenagers conquering competitive exams — we have the perfect programme for your child.
          </p>

          <div className="prog-hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="enrol-btn" style={{ fontSize: 16, padding: "16px 36px" }}>
              🎉 Book a Free Trial
            </Link>
            <a
              href="#all-programs"
              className="browse-btn"
              style={{
                background: "transparent", color: "#1A1A2E", fontFamily: "inherit",
                fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 50,
                border: "3px solid #1A1A2E", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8, transition: "all .3s",
              }}
            >
              🔍 Browse All
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STICKY QUICK-NAV PILLS
      ════════════════════════════════ */}
      <div className="prog-quick-nav">
        <div className="prog-quick-nav-inner">
          {programs.map((p) => (
            <a
              key={p.id}
              className="pill-nav"
              href={`#prog-${p.id}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: p.bg, color: p.color, fontWeight: 800, fontSize: 13,
                padding: "8px 18px", borderRadius: 50, border: `2px solid ${p.color}33`,
                textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {p.emoji} {p.title}
            </a>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          ALL PROGRAMS
      ════════════════════════════════ */}
      <section id="all-programs" className="prog-all-section" style={{ padding: "80px 0 120px" }}>
        <div className="prog-all-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {programs.map((p, idx) => (
            <div
              key={p.id}
              id={`prog-${p.id}`}
              className="prog-item"
              style={{ marginBottom: 80, scrollMarginTop: 100 }}
            >
              <div
                className={`prog-card prog-card-grid${idx % 2 !== 0 ? " reverse" : ""}`}
                style={{ borderColor: `${p.color}22` }}
              >

                {/* ── Image panel ─────────────────────────────────────── */}
                {/*
                  position: relative is already in .prog-card-img via CSS.
                  next/image with fill will stretch to cover the cell.
                  The cell's min-height (380px) sets the visual height.
                */}
                <div
                  className="prog-card-img"
                  style={{
                    background: p.bg,
                    order: idx % 2 === 0 ? 0 : 2,
                  }}
                >
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 900px) 100vw, 400px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority={idx === 0}
                  />

                  {/* Gradient overlay — blends image into content panel */}
                  <div
                    style={{
                      position: "absolute", inset: 0, zIndex: 1,
                      background: idx % 2 === 0
                        ? "linear-gradient(to right, transparent 55%, white)"
                        : "linear-gradient(to left, transparent 55%, white)",
                    }}
                  />

                  {/* Tag badge */}
                  <div
                    style={{
                      position: "absolute", zIndex: 2,
                      top: 20,
                      ...(idx % 2 === 0 ? { left: 20 } : { right: 20 }),
                      background: p.color, color: "white",
                      fontSize: 11, fontWeight: 900,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "6px 16px", borderRadius: 50,
                    }}
                  >
                    {p.tag}
                  </div>
                </div>

                {/* ── Content panel ───────────────────────────────────── */}
                <div className="prog-card-content" style={{ order: 1 }}>

                  {/* Header row */}
                  <div className="prog-card-header" style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
                    <div className="prog-card-header-emoji float-b" style={{ fontSize: 52, lineHeight: 1 }}>
                      {p.emoji}
                    </div>
                    <div>
                      <h2
                        className="prog-card-header-title"
                        style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 6 }}
                      >
                        {p.title}
                      </h2>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: p.color + "18", color: p.color }}>
                          {p.age}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: "#F5F5F5", color: "#888" }}>
                          ⏱ {p.format}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "#555", marginBottom: 24, fontWeight: 600 }}>
                    {p.subtitle}
                  </p>

                  {/* Two columns: benefits + levels */}
                  <div className="prog-inner-grid">
                    {/* Key Benefits */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>
                        ✨ Key Benefits
                      </div>
                      <div>
                        {p.points.map((b) => (
                          <div key={b} className="benefit-item">
                            <span style={{ width: 20, height: 20, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0 }}>
                              ✓
                            </span>
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Levels Offered */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>
                        🎯 Levels Offered
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {p.levels.map((lv, li) => (
                          <span
                            key={lv}
                            className="level-pill"
                            style={{ background: p.color + "15", color: p.color, border: `1.5px solid ${p.color}33` }}
                          >
                            {String(li + 1).padStart(2, "0")} {lv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="prog-cta-row" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Link
                      href="/contact"
                      className="enrol-btn"
                      style={{ background: p.color, boxShadow: `0 6px 20px ${p.color}55` }}
                    >
                      🎉 Enrol in {p.title}
                    </Link>
                    <Link
                      href="/contact"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontWeight: 800, fontSize: 14, color: "#666",
                        textDecoration: "none", padding: "12px 20px",
                        borderRadius: 50, border: "2px solid #eee", transition: "all .2s",
                      }}
                    >
                      📞 Book Free Trial →
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ════════════════════════════════
          BOTTOM CTA BANNER
      ════════════════════════════════ */}
      <section
        className="prog-bottom-cta"
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "5%", fontSize: 120, opacity: 0.08, transform: "translateY(-50%)", fontFamily: "'Fredoka One',cursive" }}>
          FUN!
        </div>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,52px)", color: "white", marginBottom: 16 }}>
            Not Sure Which Programme? 🤔
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.9)", marginBottom: 32, lineHeight: 1.6, fontWeight: 700 }}>
            Book a <strong>FREE assessment class</strong> and our experts will recommend the perfect fit for your child&apos;s age, level and goals!
          </p>
          <Link
            href="/contact"
            style={{
              background: "white", color: "#FF6B6B", fontFamily: "inherit",
              fontWeight: 900, fontSize: 18, padding: "18px 48px", borderRadius: 50,
              textDecoration: "none", display: "inline-flex", alignItems: "center",
              gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.2)",
            }}
          >
            🎓 Book FREE Assessment
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="prog-footer" style={{ background: "#1A1A2E", padding: "40px 0 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              🧮
            </div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>
              Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span>
            </div>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>
            © 2025 Ascento Abacus. All rights reserved. Made with 💛 for young learners.
          </span>
        </div>
      </footer>

    </div>
  );
}