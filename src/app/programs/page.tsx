








// "use client";

// // ─────────────────────────────────────────────
// // /app/programs/page.jsx  — Ascento Programs Page
// // ─────────────────────────────────────────────
// import Link from "next/link";

// // const programs = [
// //   {
// //     emoji: "🧮",
// //     title: "Abacus Mastery",
// //     ages: "5–14 yrs",
// //     color: "#FF6B6B",
// //     bg: "#FFF0F0",
// //     tag: "Most Popular",
// //     image: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_cfe7f04f.jpg",
// //     fallback: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",
// //     shortDesc: "Foundation for mental arithmetic and lightning-fast calculations.",
// //     fullDesc:
// //       "Our flagship Abacus programme builds incredible speed and accuracy in mental arithmetic. Using the ancient Japanese soroban abacus method, children develop photographic number sense, concentration, and confidence. Students progress through structured levels and compete in national and international competitions.",
// //     benefits: ["Lightning-fast mental math", "Improved concentration & memory", "Boosted self-confidence", "Competition-ready skills", "Better academic performance"],
// //     levels: ["Junior (5–7 yrs)", "Foundation (7–10 yrs)", "Advanced (10–14 yrs)", "Expert / Grand Master"],
// //     duration: "45 min / class",
// //     frequency: "2–3 classes / week",
// //   },
// //   {
// //     emoji: "🧠",
// //     title: "Brain Gym",
// //     ages: "All ages",
// //     color: "#4ECDC4",
// //     bg: "#F0FFFE",
// //     tag: "Fan Favourite",
// //     image: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_e3ac77d8.jpg",
// //     fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
// //     shortDesc: "Cognitive enhancement exercises designed to improve focus and coordination.",
// //     fullDesc:
// //       "Brain Gym is a series of simple, joyful physical movements that activate both hemispheres of the brain simultaneously. Developed from educational kinesiology, these 26 targeted exercises improve learning readiness, focus, memory, and coordination. Perfect for children who struggle with attention or reading.",
// //     benefits: ["Enhanced focus & attention", "Better reading & writing", "Improved hand-eye coordination", "Stress relief & emotional balance", "Whole-brain activation"],
// //     levels: ["Starter (all ages)", "Intermediate", "Advanced Integration"],
// //     duration: "30–45 min / session",
// //     frequency: "Daily practice recommended",
// //   },
// //   {
// //     emoji: "📐",
// //     title: "Vedic Maths",
// //     ages: "8+ yrs",
// //     color: "#FFB347",
// //     bg: "#FFF8EE",
// //     tag: "Mind-Blowing",
// //     image: "/Images/WhatsApp-Image-2025-06-08-at-10.03.38_091c0f31.jpg",
// //     fallback: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
// //     shortDesc: "Ancient speed math techniques for solving complex problems with ease.",
// //     fullDesc:
// //       "Vedic Mathematics is a system of 16 sutras (formulas) from ancient India that make complex calculations feel like magic tricks. Students learn to multiply 3-digit numbers in seconds, instantly find square roots, and tackle competitive exam problems with ease. This programme is especially popular with Class 5–12 students preparing for board exams and entrance tests.",
// //     benefits: ["10x faster calculations", "Impress in competitive exams", "Deeper number intuition", "Reduces exam anxiety", "Perfect for JEE / NEET prep"],
// //     levels: ["Foundation (8–10 yrs)", "Intermediate (10–14 yrs)", "Advanced / Competitive"],
// //     duration: "60 min / class",
// //     frequency: "2 classes / week",
// //   },
// //   {
// //     emoji: "🌟",
// //     title: "Pre-Abacus",
// //     ages: "4–6 yrs",
// //     color: "#A78BFA",
// //     bg: "#F5F0FF",
// //     tag: "For Tiny Minds",
// //     image: "/Images/WhatsApp-Image-2025-06-08-at-10.03.39_0f634c25-r70q3atn2hrk6sl09jh6d3zwf68pahr7jeygaih09s.jpg",
// //     fallback: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80",
// //     shortDesc: "Gentle introduction to numbers and visualisation for toddlers.",
// //     fullDesc:
// //       "Pre-Abacus is specially designed for children aged 4–6 who are just beginning their number journey. Through songs, colourful abacus beads, stories, and playful activities, children develop number recognition, counting skills, and a joyful love for maths before they even start formal schooling. This lays the perfect foundation for Abacus Mastery.",
// //     benefits: ["Early number sense", "Love for learning maths", "Fine motor development", "Phonics & number integration", "School readiness"],
// //     levels: ["Playgroup (4–5 yrs)", "Nursery Bridge (5–6 yrs)"],
// //     duration: "30 min / class",
// //     frequency: "3 classes / week",
// //   },
// //   {
// //     emoji: "📚",
// //     title: "Tuitions",
// //     ages: "5–17 yrs",
// //     color: "#F06292",
// //     bg: "#FFF0F5",
// //     tag: "New! 🎉",
// //     image: "/Images/IMG_20190930_102619.jpg",
// //     fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
// //     shortDesc: "Expert academic support for Maths and Science from Class 1 to 12.",
// //     fullDesc:
// //       "Our Tuitions programme provides expert, personalised academic coaching for Maths and Science from Class 1 to 12. Led by qualified, experienced teachers who know the school curriculum inside-out, classes are small-batch (maximum 8 students) to ensure every child gets individual attention. We cover CBSE, ICSE, and State Boards.",
// //     benefits: ["Small batches (max 8 students)", "Covers CBSE, ICSE & State Boards", "Doubt-clearing every session", "Monthly parent progress reports", "Exam preparation & mock tests"],
// //     levels: ["Primary (Class 1–5)", "Middle School (Class 6–8)", "High School (Class 9–10)", "Senior Secondary (Class 11–12)"],
// //     duration: "60–90 min / class",
// //     frequency: "3–5 classes / week",
// //   },
// // ];

// const programs = [
//      {
//          id: "abacus",
//          title: "Abacus Mastery",
//          subtitle: "A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.",
//          age: "Ages 4–14",
//          icon: "calculate",
//          img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
//          color: "#197fe6",
//          points: [
//              "11 progressive levels (O to 10)",
//              "Two-hand, four-finger methodology",
//              "Mental math mastery & visualization",
//          ],
//          format: "120 min, twice a week (Levels 1–10)",
//      },
//      {
//          id: "vedic",
//          title: "Vedic Maths",
//          subtitle: "Ancient Vedic sutras applied to modern speed mathematics — from rapid arithmetic through algebraic polynomials and cube roots.",
//          age: "Ages 10+",
//          icon: "functions",
//          img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
//          color: "#7c3aed",
//          points: [
//              "4 comprehensive levels",
//              "Vedic sutras & speed techniques",
//              "From rapid arithmetic to cube roots",
//          ],
//          format: "Levels 1 to 4",
//          sutras: ["Nikhilam Navatashcaramam Dashatah", "Urdhvatiryak", "Ek Nyunain Purvena", "Dhwajank", "Vilokaman", "Vinculum System"],
//      },
//      {
//          id: "playschool",
//          title: "Pre-Abacus",
//          subtitle: "A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.",
//          age: "Age 1.5 – 8 years",
//          icon: "child_care",
//          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
//          color: "#e65d97",
//          points: [
//              "Toddler to Class 2 (7 stages)",
//              "English, Hindi, Maths & EVS",
//              "Communication, confidence & motor skills",
//          ],
//          format: "Toddler to Class 2",
//          focus: ["Communication skills", "Confidence", "Motor skills", "Social development"],
//      },
// ];

// export default function ProgramsPage() {
//   return (
//     <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
//         @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
//         @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

//         .float-a { animation: float-a 4s ease-in-out infinite; }
//         .float-b { animation: float-b 5s ease-in-out infinite; }

//         .prog-card { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s; }
//         .prog-card:hover { transform: translateY(-8px); box-shadow: 0 32px 60px rgba(0,0,0,.13); }

//         .benefit-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid rgba(0,0,0,.06); font-size:14px; font-weight:700; color:#444; }
//         .benefit-item:last-child { border-bottom:none; }

//         .level-pill { display:inline-block; font-size:12px; font-weight:800; padding:5px 14px; border-radius:50px; margin:4px; }

//         .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
//         .enrol-btn:hover { transform:scale(1.07) translateY(-2px); box-shadow:0 12px 30px rgba(255,107,107,.5); }

//         .nav-link { position:relative; font-size:15px; font-weight:800; color:#1A1A2E; text-decoration:none; transition:color .2s; }
//         .nav-link:hover { color:#FF6B6B; }

//         ::-webkit-scrollbar { width:8px; }
//         ::-webkit-scrollbar-track { background:#fff; }
//         ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }

//         .fade-up { animation: fadeUp 0.6s ease both; }
//       `}</style>

//       {/* ── NAVBAR ── */}
//       {/* <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "14px 0", background: "rgba(255,253,247,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 14px rgba(255,107,107,.4)" }}>🧮</div>
//             <div>
//               <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", lineHeight: 1 }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
//               <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginTop: 1 }}>Brain Development Academy</div>
//             </div>
//           </Link>
//           <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
//             {[["Programs", "/programs"], ["Why Us", "/#whyus"], ["Gallery", "/#gallery"], ["Team", "/#team"], ["Contact", "/contact"]].map(([l, h]) => (
//               <Link key={l} href={h} className="nav-link">{l}</Link>
//             ))}
//           </div>
//           <Link href="/contact" className="enrol-btn" style={{ fontSize: 14 }}>🎉 Enrol Now</Link>
//         </div>
//       </nav> */}

//       {/* ── HERO ── */}
//       <section style={{ paddingTop: 130, paddingBottom: 80, background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />
//         <div style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }} className="float-a">📚</div>
//         <div style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }} className="float-b">🧠</div>
//         <div style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }} className="float-b">🧮</div>
//         <div style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }} className="float-a">⭐</div>

//         <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid #FFD6D6" }}>
//             <span>📚</span>
//             <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Our Curriculum</span>
//           </div>
//           <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(40px,5vw,72px)", color: "#1A1A2E", lineHeight: 1.08, marginBottom: 20 }}>
//             5 Amazing <span style={{ color: "#FF6B6B" }}>Programmes</span><br />For Every Child! 🎓
//           </h1>
//           <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
//             From tiny tots taking their first number steps to teenagers conquering competitive exams — we have the perfect programme for your child.
//           </p>
//           <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
//             <Link href="/contact" className="enrol-btn" style={{ fontSize: 16, padding: "16px 36px" }}>🎉 Book a Free Trial</Link>
//             <a href="#all-programs" style={{ background: "transparent", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 50, border: "3px solid #1A1A2E", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .3s" }}>
//               🔍 Browse All
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* ── QUICK NAV PILLS ── */}
//       <div style={{ background: "white", borderBottom: "2px solid #F5F0FF", position: "sticky", top: 72, zIndex: 100 }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", gap: 12, overflowX: "auto" }}>
//           {programs.map(p => (
//             <a key={p.title} href={`#prog-${p.title.toLowerCase().replace(/\s+/g, "-")}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: p.bg, color: p.color, fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 50, border: `2px solid ${p.color}33`, textDecoration: "none", whiteSpace: "nowrap", transition: "all .2s", flexShrink: 0 }}>
//               {p.emoji} {p.title}
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* ── ALL PROGRAMS ── */}
//       <section id="all-programs" style={{ padding: "80px 0 120px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           {programs.map((p, idx) => (
//             <div
//               key={p.title}
//               id={`prog-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
//               style={{ marginBottom: 80, scrollMarginTop: 160 }}
//             >
//               {/* Card */}
//               <div className="prog-card" style={{ background: "white", borderRadius: 36, overflow: "hidden", border: `3px solid ${p.color}22`, boxShadow: "0 8px 40px rgba(0,0,0,.07)", display: "grid", gridTemplateColumns: idx % 2 === 0 ? "420px 1fr" : "1fr 420px" }}>

//                 {/* Image side */}
//                 {idx % 2 === 0 && (
//                   <div style={{ position: "relative", background: p.bg, overflow: "hidden", minHeight: 380 }}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//                       onError={e => { e.currentTarget.src = p.fallback; }}
//                     />
//                     {/* Overlay */}
//                     <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, transparent 60%, white)` }} />
//                     {/* Tag */}
//                     <div style={{ position: "absolute", top: 20, left: 20, background: p.color, color: "white", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 50 }}>{p.tag}</div>
//                   </div>
//                 )}

//                 {/* Content side */}
//                 <div style={{ padding: "44px 44px" }}>
//                   {/* Header */}
//                   <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
//                     <div style={{ fontSize: 56, lineHeight: 1 }} className="float-b">{p.emoji}</div>
//                     <div>
//                       <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 32, color: "#1A1A2E", marginBottom: 6 }}>{p.title}</h2>
//                       <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                         <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: p.color + "18", color: p.color }}>Ages {p.ages}</span>
//                         <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: "#F5F5F5", color: "#888" }}>⏱ {p.duration}</span>
//                         <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: "#F5F5F5", color: "#888" }}>📅 {p.frequency}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <p style={{ fontSize: 15, lineHeight: 1.75, color: "#555", marginBottom: 24 }}>{p.fullDesc}</p>

//                   {/* Two columns: benefits + levels */}
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
//                     {/* Benefits */}
//                     <div>
//                       <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>✨ Key Benefits</div>
//                       <div>
//                         {p.benefits.map(b => (
//                           <div key={b} className="benefit-item">
//                             <span style={{ width: 20, height: 20, borderRadius: 50, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0 }}>✓</span>
//                             {b}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Levels */}
//                     <div>
//                       <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>🎯 Levels Offered</div>
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
//                         {p.levels.map((lv, li) => (
//                           <span key={lv} className="level-pill" style={{ background: p.color + "15", color: p.color, border: `1.5px solid ${p.color}33` }}>
//                             {String(li + 1).padStart(2, "0")} {lv}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* CTA */}
//                   <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
//                     <Link href="/contact" className="enrol-btn" style={{ background: p.color, boxShadow: `0 6px 20px ${p.color}55` }}>
//                       🎉 Enrol in {p.title}
//                     </Link>
//                     <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 14, color: "#666", textDecoration: "none", padding: "12px 20px", borderRadius: 50, border: "2px solid #eee", transition: "all .2s" }}>
//                       📞 Book Free Trial →
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Image side (right for odd) */}
//                 {idx % 2 !== 0 && (
//                   <div style={{ position: "relative", background: p.bg, overflow: "hidden", minHeight: 380 }}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//                       onError={e => { e.currentTarget.src = p.fallback; }}
//                     />
//                     <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to left, transparent 60%, white)` }} />
//                     <div style={{ position: "absolute", top: 20, right: 20, background: p.color, color: "white", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 50 }}>{p.tag}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── BOTTOM CTA ── */}
//       <section style={{ padding: "80px 0", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", textAlign: "center", position: "relative", overflow: "hidden" }}>
//         <div style={{ position: "absolute", top: "50%", left: "5%", fontSize: 120, opacity: 0.08, transform: "translateY(-50%)", fontFamily: "'Fredoka One',cursive" }}>FUN!</div>
//         <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,52px)", color: "white", marginBottom: 16 }}>
//             Not Sure Which Programme? 🤔
//           </h2>
//           <p style={{ fontSize: 18, color: "rgba(255,255,255,.9)", marginBottom: 32, lineHeight: 1.6, fontWeight: 700 }}>
//             Book a <strong>FREE assessment class</strong> and our experts will recommend the perfect fit for your child's age, level and goals!
//           </p>
//           <Link href="/contact" style={{ background: "white", color: "#FF6B6B", fontFamily: "inherit", fontWeight: 900, fontSize: 18, padding: "18px 48px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
//             🎓 Book FREE Assessment
//           </Link>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer style={{ background: "#1A1A2E", padding: "40px 0 24px", textAlign: "center" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧮</div>
//             <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
//           </div>
//           <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>© 2024 Ascento Abacus. All rights reserved. Made with 💛 for young learners.</span>
//         </div>
//       </footer>
//     </div>
//   );
// }




















"use client";

import Link from "next/link";

const programs = [
  {
    id: "abacus",
    emoji: "🧮",
    title: "Abacus Mastery",
    subtitle: "A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.",
    age: "Ages 4–14",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
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
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
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
    title: "Pre-Abacus",
    subtitle: "A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.",
    age: "Ages 1.5–8",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
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
    title: "Brain Gym",
    subtitle: "Cognitive enhancement exercises designed to activate both brain hemispheres, improve focus, coordination, and learning readiness.",
    age: "All ages",
    img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",
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
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop", 
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5s ease-in-out infinite; }

        .prog-card { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s; }
        .prog-card:hover { transform: translateY(-8px); box-shadow: 0 32px 60px rgba(0,0,0,.13); }

        .benefit-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid rgba(0,0,0,.06); font-size:14px; font-weight:700; color:#444; }
        .benefit-item:last-child { border-bottom:none; }

        .level-pill { display:inline-block; font-size:12px; font-weight:800; padding:5px 14px; border-radius:50px; margin:4px; }

        .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .enrol-btn:hover { transform:scale(1.07) translateY(-2px); box-shadow:0 12px 30px rgba(255,107,107,.5); }

        .pill-nav:hover { opacity: 0.85; transform: scale(1.04); }
        .pill-nav { transition: all .2s; }

        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-track { background:#fff; }
        ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />
        <div style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }} className="float-a">📚</div>
        <div style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }} className="float-b">🧠</div>
        <div style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }} className="float-b">🧮</div>
        <div style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }} className="float-a">⭐</div>

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
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="enrol-btn" style={{ fontSize: 16, padding: "16px 36px" }}>🎉 Book a Free Trial</Link>
            <a href="#all-programs" style={{ background: "transparent", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 50, border: "3px solid #1A1A2E", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .3s" }}>
              🔍 Browse All
            </a>
          </div>
        </div>
      </section>

      {/* ── QUICK NAV PILLS ── */}
      <div style={{ background: "white", borderBottom: "2px solid #FFF0E8", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", gap: 12, overflowX: "auto" }}>
          {programs.map(p => (
            <a key={p.id} className="pill-nav" href={`#prog-${p.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: p.bg, color: p.color, fontWeight: 800, fontSize: 13,
              padding: "8px 18px", borderRadius: 50,
              border: `2px solid ${p.color}33`, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {p.emoji} {p.title}
            </a>
          ))}
        </div>
      </div>

      {/* ── ALL PROGRAMS ── */}
      <section id="all-programs" style={{ padding: "80px 0 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {programs.map((p, idx) => (
            <div
              key={p.id}
              id={`prog-${p.id}`}
              style={{ marginBottom: 80, scrollMarginTop: 100 }}
            >
              <div className="prog-card" style={{
                background: "white", borderRadius: 36, overflow: "hidden",
                border: `3px solid ${p.color}22`,
                boxShadow: "0 8px 40px rgba(0,0,0,.07)",
                display: "grid",
                gridTemplateColumns: idx % 2 === 0 ? "400px 1fr" : "1fr 400px",
              }}>

                {/* Image — left for even */}
                {idx % 2 === 0 && (
                  <div style={{ position: "relative", background: p.bg, overflow: "hidden", minHeight: 380 }}>
                    <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, white)" }} />
                    <div style={{ position: "absolute", top: 20, left: 20, background: p.color, color: "white", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 50 }}>{p.tag}</div>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "44px" }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
                    <div style={{ fontSize: 52, lineHeight: 1 }} className="float-b">{p.emoji}</div>
                    <div>
                      <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 6 }}>{p.title}</h2>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: p.color + "18", color: p.color }}>{p.age}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 14px", borderRadius: 50, background: "#F5F5F5", color: "#888" }}>⏱ {p.format}</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "#555", marginBottom: 24, fontWeight: 600 }}>{p.subtitle}</p>

                  {/* Two columns: benefits + levels */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                    {/* Key Points */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>✨ Key Benefits</div>
                      <div>
                        {(p.points ?? []).map(b => (
                          <div key={b} className="benefit-item">
                            <span style={{ width: 20, height: 20, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0 }}>✓</span>
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Levels */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: 12 }}>🎯 Levels Offered</div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {(p.levels ?? []).map((lv, li) => (
                          <span key={lv} className="level-pill" style={{ background: p.color + "15", color: p.color, border: `1.5px solid ${p.color}33` }}>
                            {String(li + 1).padStart(2, "0")} {lv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Link href="/contact" className="enrol-btn" style={{ background: p.color, boxShadow: `0 6px 20px ${p.color}55` }}>
                      🎉 Enrol in {p.title}
                    </Link>
                    <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 14, color: "#666", textDecoration: "none", padding: "12px 20px", borderRadius: 50, border: "2px solid #eee", transition: "all .2s" }}>
                      📞 Book Free Trial →
                    </Link>
                  </div>
                </div>

                {/* Image — right for odd */}
                {idx % 2 !== 0 && (
                  <div style={{ position: "relative", background: p.bg, overflow: "hidden", minHeight: 380 }}>
                    <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 60%, white)" }} />
                    <div style={{ position: "absolute", top: 20, right: 20, background: p.color, color: "white", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 50 }}>{p.tag}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "5%", fontSize: 120, opacity: 0.08, transform: "translateY(-50%)", fontFamily: "'Fredoka One',cursive" }}>FUN!</div>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,52px)", color: "white", marginBottom: 16 }}>
            Not Sure Which Programme? 🤔
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.9)", marginBottom: 32, lineHeight: 1.6, fontWeight: 700 }}>
            Book a <strong>FREE assessment class</strong> and our experts will recommend the perfect fit for your child's age, level and goals!
          </p>
          <Link href="/contact" style={{ background: "white", color: "#FF6B6B", fontFamily: "inherit", fontWeight: 900, fontSize: 18, padding: "18px 48px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
            🎓 Book FREE Assessment
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1A2E", padding: "40px 0 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧮</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>© 2025 Ascento Abacus. All rights reserved. Made with 💛 for young learners.</span>
        </div>
      </footer>

    </div>
  );
}