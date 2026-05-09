






// "use client";

// import { useState } from "react";
// import Link from "next/link";

// const activities = [
//   { emoji: "🎨", label: "Art & Craft" },
//   { emoji: "♻️", label: "Best out of Wastes" },
//   { emoji: "🧠", label: "Brain Exercise" },
//   { emoji: "✏️", label: "Drawing Class" },
//   { emoji: "✍️", label: "Handwriting & Calligraphy" },
//   { emoji: "🧮", label: "Abacus & Vedic Maths" },
//   { emoji: "📖", label: "English Grammar" },
//   { emoji: "🗣️", label: "English Spoken" },
//   { emoji: "📚", label: "Improve Vocabulary" },
//   { emoji: "💃", label: "Dance / Zumba" },
//   { emoji: "🎵", label: "Music" },
//   { emoji: "♟️", label: "Chess" },
//   { emoji: "🧬", label: "Mid Brain Activation" },
//   { emoji: "🎮", label: "Brain Games" },
//   { emoji: "🏠", label: "Holiday Home & Project Work" },
// ];

// const martialArts = [
//   { emoji: "🥋", label: "Karate" },
//   { emoji: "🛡️", label: "Self Defence" },
//   { emoji: "⚔️", label: "Martial Arts" },
//   { emoji: "🏅", label: "Taekwondo" },
// ];

// const tuitionClasses = [
//   { label: "Classes 9th & 10th", subjects: "Mathematics & Science" },
//   { label: "Classes 11th & 12th", subjects: "Mathematics, Accounts & Economics" },
// ];

// type FormState = {
//   childName: string;
//   parentName: string;
//   phone: string;
//   email: string;
//   age: string;
//   program: string;
//   message: string;
// };

// type FieldErrors = Partial<Record<keyof FormState, string>>;

// // ── Validators ───────────────────────────────────────────────────────────────
// const validators: Record<keyof FormState, (v: string) => string> = {
//   childName: (v) =>
//     v.trim().length >= 2 ? "" : "Child's name must be at least 2 characters.",
//   parentName: () => "", // optional
//   phone: (v) =>
//     /^\d{10}$/.test(v.replace(/\D/g, ""))
//       ? ""
//       : "Enter a valid 10-digit mobile number.",
//   email: (v) =>
//     v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
//       ? ""
//       : "Enter a valid email address.",
//   age: (v) => (v.trim() ? "" : "Please select an age group."),
//   program: (v) => (v.trim() ? "" : "Please select a program."),
//   message: () => "", // optional
// };

// export default function SummerCampPage() {
//   const [form, setForm] = useState<FormState>({
//     childName: "",
//     parentName: "",
//     phone: "",
//     email: "",
//     age: "",
//     program: "",
//     message: "",
//   });
//   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [globalError, setGlobalError] = useState("");

//   // ── Per-field validation ─────────────────────────────────────────────────
//   const validateField = (name: keyof FormState, value: string): string =>
//     validators[name]?.(value) ?? "";

//   const validateAll = (): boolean => {
//     const errors: FieldErrors = {};
//     (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
//       const msg = validateField(key, form[key]);
//       if (msg) errors[key] = msg;
//     });
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     const key = name as keyof FormState;
//     const processed =
//       key === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
//     setForm((prev) => ({ ...prev, [key]: processed }));
//     if (fieldErrors[key]) {
//       setFieldErrors((prev) => ({ ...prev, [key]: "" }));
//     }
//   };

//   const handleBlur = (
//     e: React.FocusEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     const key = name as keyof FormState;
//     setFieldErrors((prev) => ({
//       ...prev,
//       [key]: validateField(key, value),
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGlobalError("");
//     if (!validateAll()) return;

//     setLoading(true);
//     try {
//       const res = await fetch("/api/summer-camp/enroll", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Something went wrong");
//       setSubmitted(true);
//     } catch (err: any) {
//       setGlobalError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSubmitted(false);
//     setFieldErrors({});
//     setGlobalError("");
//     setForm({
//       childName: "",
//       parentName: "",
//       phone: "",
//       email: "",
//       age: "",
//       program: "",
//       message: "",
//     });
//   };

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   const hasErrors = Object.values(fieldErrors).some(Boolean);

//   const FieldError = ({ field }: { field: keyof FormState }) =>
//     fieldErrors[field] ? (
//       <div
//         style={{
//           fontSize: 11,
//           fontWeight: 800,
//           color: "#FF4444",
//           marginTop: 6,
//           display: "flex",
//           alignItems: "center",
//           gap: 4,
//         }}
//       >
//         <span>⚠️</span> {fieldErrors[field]}
//       </div>
//     ) : null;

//   const inputBorder = (field: keyof FormState): React.CSSProperties => ({
//     borderColor: fieldErrors[field] ? "#FF4444" : undefined,
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "'Nunito', sans-serif",
//         background: "#FFFDF7",
//         color: "#1A1A2E",
//         overflowX: "hidden",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes float-a  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-16px)} }
//         @keyframes float-b  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
//         @keyframes spin-slow { to { transform: rotate(360deg); } }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

//         .float-a  { animation: float-a  4s   ease-in-out infinite; }
//         .float-b  { animation: float-b  5.5s ease-in-out infinite; }
//         .fade-up  { animation: fadeUp   0.6s ease both; }
//         .shake    { animation: shake    0.4s ease; }

//         /* ── Activity pills ── */
//         .activity-pill {
//           display:flex; align-items:center; gap:10px;
//           padding:12px 18px; border-radius:16px;
//           background:white; border:2px solid #FFF0E8;
//           font-weight:800; font-size:14px; color:#1A1A2E;
//           transition:all 0.25s cubic-bezier(.34,1.56,.64,1); cursor:default;
//         }
//         .activity-pill:hover {
//           transform:translateY(-4px) scale(1.03);
//           border-color:#FF6B6B; box-shadow:0 12px 32px rgba(255,107,107,0.15);
//         }

//         /* ── Martial arts cards ── */
//         .martial-card {
//           background:white; border-radius:22px; padding:28px 24px;
//           border:2px solid #FFF0E8; text-align:center;
//           transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
//           box-shadow:0 4px 16px rgba(0,0,0,0.04);
//         }
//         .martial-card:hover {
//           transform:translateY(-8px);
//           box-shadow:0 20px 48px rgba(255,107,107,0.14);
//           border-color:#FF6B6B;
//         }

//         /* ── CTA button ── */
//         .enroll-btn {
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           color:#fff; font-family:inherit; font-weight:900;
//           font-size:16px; padding:16px 36px; border-radius:50px;
//           border:none; cursor:pointer; text-decoration:none;
//           display:inline-flex; align-items:center; gap:10px;
//           box-shadow:0 8px 28px rgba(255,107,107,0.4);
//           transition:all 0.3s cubic-bezier(.34,1.56,.64,1); white-space:nowrap;
//         }
//         .enroll-btn:hover:not(:disabled) { transform:scale(1.07) translateY(-2px); box-shadow:0 16px 40px rgba(255,107,107,0.5); }
//         .enroll-btn:disabled { opacity:0.7; cursor:not-allowed; }

//         /* ── Form inputs ── */
//         .form-input {
//           width:100%; padding:14px 18px; border-radius:14px;
//           border:2.5px solid #F0EDE8; background:#FFFDF7;
//           font-family:inherit; font-size:15px; font-weight:700;
//           color:#1A1A2E; outline:none; transition:border-color 0.2s, box-shadow 0.2s;
//         }
//         .form-input:focus    { border-color:#FF6B6B; background:white; box-shadow:0 0 0 3px rgba(255,107,107,0.08); }
//         .form-input.error    { border-color:#FF4444 !important; background:#FFF8F8; }
//         .form-input:disabled { opacity:0.6; cursor:not-allowed; }

//         /* ── Info chip ── */
//         .info-chip {
//           display:inline-flex; align-items:center; gap:6px;
//           background:white; border:2px solid #FFF0E8;
//           border-radius:50px; padding:8px 18px;
//           font-size:14px; font-weight:800; color:#1A1A2E;
//         }

//         /* ── Form grid ── */
//         .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

//         /* ── Hero floats hidden on mobile ── */
//         .hero-float { pointer-events:none; }

//         ::-webkit-scrollbar { width:8px; }
//         ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }

//         /* ════════════════════════════════
//            TABLET  ≤ 768px
//         ════════════════════════════════ */
//         @media (max-width: 768px) {
//           .hero-float { display:none; }
//           .form-grid  { grid-template-columns:1fr; gap:14px; }
//         }

//         /* ════════════════════════════════
//            MOBILE  ≤ 640px
//         ════════════════════════════════ */
//         @media (max-width: 640px) {
//           .form-card    { padding:24px 16px !important; border-radius:22px !important; }
//           .form-card h2 { font-size:24px !important; }
//           .enroll-btn   { font-size:14px !important; padding:14px 24px !important; }
//           .info-chip    { font-size:12px; padding:6px 12px; }
//           .activity-pill { font-size:13px; padding:10px 14px; }
//           .martial-section-inner { padding:32px 22px !important; border-radius:22px !important; }
//           .contact-section { padding:48px 16px !important; }
//         }

//         /* ════════════════════════════════
//            SMALL  ≤ 400px
//         ════════════════════════════════ */
//         @media (max-width: 400px) {
//           .info-chips-row { gap:8px !important; }
//           .info-chip { font-size:11px; padding:5px 10px; }
//           .enroll-btn { font-size:13px !important; padding:12px 18px !important; }
//         }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           HERO
//       ══════════════════════════════════════════════════ */}
//       <section
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           background:
//             "linear-gradient(160deg,#1A1A2E 0%,#2D1B4E 50%,#1A1A2E 100%)",
//           position: "relative",
//           overflow: "hidden",
//           padding: "120px 24px 80px",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage:
//               "radial-gradient(circle,rgba(255,179,71,0.12) 1.5px,transparent 1.5px)",
//             backgroundSize: "36px 36px",
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             top: -100,
//             right: -100,
//             width: 400,
//             height: 400,
//             borderRadius: "50%",
//             background: "radial-gradient(circle,#FF6B6B,transparent 70%)",
//             opacity: 0.18,
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             bottom: -80,
//             left: -80,
//             width: 320,
//             height: 320,
//             borderRadius: "50%",
//             background: "radial-gradient(circle,#FFB347,transparent 70%)",
//             opacity: 0.14,
//           }}
//         />

//         <div className="hero-float float-a" style={{ position: "absolute", top: "15%", left: "5%", fontSize: 52 }}>🎨</div>
//         <div className="hero-float float-b" style={{ position: "absolute", top: "25%", right: "6%", fontSize: 44 }}>🥋</div>
//         <div className="hero-float float-b" style={{ position: "absolute", bottom: "20%", left: "8%", fontSize: 40 }}>🎵</div>
//         <div className="hero-float float-a" style={{ position: "absolute", bottom: "25%", right: "5%", fontSize: 48 }}>♟️</div>
//         <div className="hero-float float-a" style={{ position: "absolute", top: "50%", left: "2%", fontSize: 36 }}>🧠</div>
//         <div className="hero-float float-b" style={{ position: "absolute", top: "40%", right: "3%", fontSize: 36 }}>💃</div>

//         <div
//           style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
//           className="fade-up"
//         >
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 8,
//               background: "rgba(255,107,107,0.15)",
//               border: "1.5px solid rgba(255,107,107,0.3)",
//               borderRadius: 50,
//               padding: "8px 22px",
//               marginBottom: 28,
//             }}
//           >
//             <span>☀️</span>
//             <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>
//               Dwarka&apos;s Biggest
//             </span>
//           </div>

//           <h1
//             style={{
//               fontFamily: "'Fredoka One', cursive",
//               fontSize: "clamp(52px,8vw,100px)",
//               color: "white",
//               lineHeight: 0.95,
//               marginBottom: 24,
//             }}
//           >
//             Summer<br />
//             <span style={{ color: "#FF6B6B" }}>Camp</span>{" "}
//             <span style={{ color: "#FFB347" }}>2026</span>
//           </h1>

//           <p
//             style={{
//               fontSize: "clamp(16px,2vw,20px)",
//               color: "rgba(255,255,255,0.65)",
//               lineHeight: 1.7,
//               maxWidth: 580,
//               margin: "0 auto 40px",
//               fontWeight: 700,
//             }}
//           >
//             A fun-filled, skill-building summer adventure for ages 5–15. Art,
//             music, martial arts, brain training and so much more!
//           </p>

//           <div
//             className="info-chips-row"
//             style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 44 }}
//           >
//             <div className="info-chip"><span>👶</span> Age: 5 – 15 Yrs</div>
//             <div className="info-chip"><span>📅</span> Starts 11th May</div>
//             <div className="info-chip"><span>🕗</span> 8:00 AM – 1:00 PM</div>
//             <div className="info-chip"><span>📍</span> Dwarka, New Delhi</div>
//           </div>

//           <a href="#enroll" className="enroll-btn" style={{ fontSize: 18, padding: "18px 44px" }}>
//             🎉 Enrol Now — It&apos;s Free to Register!
//           </a>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           ACTIVITIES
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding: "88px 24px", background: "#FFFDF7" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 56 }}>
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 background: "#FFF0F0",
//                 border: "2px solid #FFD6D6",
//                 borderRadius: 50,
//                 padding: "7px 20px",
//                 marginBottom: 16,
//               }}
//             >
//               <span>🎯</span>
//               <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>
//                 What We Offer
//               </span>
//             </div>
//             <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(32px,4vw,52px)", color: "#1A1A2E", marginBottom: 14 }}>
//               15+ Exciting <span style={{ color: "#FF6B6B" }}>Activities</span>
//             </h2>
//             <p style={{ fontSize: 17, color: "#777", fontWeight: 700, maxWidth: 480, margin: "0 auto" }}>
//               Each program gives your child a new experience and provides a fun educational summer camp.
//             </p>
//           </div>

//           <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
//             {activities.map((a, i) => (
//               <div key={i} className="activity-pill">
//                 <span style={{ fontSize: 22 }}>{a.emoji}</span>
//                 {a.label}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           MARTIAL ARTS
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding: "0 24px 88px", background: "#FFFDF7" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//           <div
//             className="martial-section-inner"
//             style={{
//               background: "linear-gradient(135deg,#1A1A2E,#2D2D4E)",
//               borderRadius: 32,
//               padding: "56px 48px",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "#FF6B6B", opacity: 0.1 }} />
//             <div style={{ position: "absolute", bottom: -40, left: 80, width: 160, height: 160, borderRadius: "50%", background: "#FFB347", opacity: 0.1 }} />

//             <div style={{ textAlign: "center", marginBottom: 44, position: "relative", zIndex: 1 }}>
//               <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,3.5vw,44px)", color: "white", marginBottom: 10 }}>
//                 🥋 Martial Arts <span style={{ color: "#FF6B6B" }}>Programme</span>
//               </div>
//               <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, fontWeight: 700 }}>Age Group: 3 Years to 25 Years</p>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, position: "relative", zIndex: 1 }}>
//               {martialArts.map((m, i) => (
//                 <div key={i} className="martial-card">
//                   <div style={{ fontSize: 44, marginBottom: 14 }}>{m.emoji}</div>
//                   <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#1A1A2E" }}>{m.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           TUITION
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding: "0 24px 88px" }}>
//         <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: 48 }}>
//             <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,3.5vw,44px)", color: "#1A1A2E", marginBottom: 12 }}>
//               🎓 Quality <span style={{ color: "#FF6B6B" }}>Tuition Classes</span>
//             </h2>
//             <p style={{ fontSize: 16, color: "#777", fontWeight: 700, maxWidth: 520, margin: "0 auto" }}>
//               Looking for reliable quality tuition for your child? Book a FREE trial class today.
//             </p>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
//             {tuitionClasses.map((c, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "white",
//                   borderRadius: 24,
//                   padding: "36px 32px",
//                   border: "2.5px solid #FFF0E8",
//                   boxShadow: "0 8px 32px rgba(255,107,107,0.07)",
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: i === 0 ? "#FF6B6B" : "#FFB347" }} />
//                 <div style={{ fontSize: 36, marginBottom: 16 }}>{i === 0 ? "📐" : "📊"}</div>
//                 <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", marginBottom: 10 }}>{c.label}</div>
//                 <div style={{ fontSize: 15, fontWeight: 800, color: "#FF6B6B" }}>{c.subjects}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           ENROLL FORM
//       ══════════════════════════════════════════════════ */}
//       <section id="enroll" style={{ padding: "0 24px 100px" }}>
//         <div style={{ maxWidth: 760, margin: "0 auto" }}>
//           {/* Section header */}
//           <div style={{ textAlign: "center", marginBottom: 48 }}>
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 background: "#FFF0F0",
//                 border: "2px solid #FFD6D6",
//                 borderRadius: 50,
//                 padding: "7px 20px",
//                 marginBottom: 16,
//               }}
//             >
//               <span>📝</span>
//               <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>
//                 Register Now
//               </span>
//             </div>
//             <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(30px,4vw,48px)", color: "#1A1A2E", marginBottom: 12 }}>
//               Enrol Your Child <span style={{ color: "#FF6B6B" }}>Today!</span>
//             </h2>
//             <p style={{ fontSize: 16, color: "#777", fontWeight: 700 }}>
//               Fill the form below and we&apos;ll reach out to confirm your spot.
//             </p>
//           </div>

//           {/* Form card */}
//           <div
//             className="form-card"
//             style={{
//               background: "white",
//               borderRadius: 32,
//               padding: "48px",
//               boxShadow: "0 12px 60px rgba(255,107,107,0.10)",
//               border: "2.5px solid #FFF0E8",
//             }}
//           >
//             {submitted ? (
//               /* ── Success state ── */
//               <div style={{ textAlign: "center", padding: "24px 0" }}>
//                 <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
//                 <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 14 }}>
//                   You&apos;re Registered!
//                 </div>
//                 <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
//                   Thank you!{" "}
//                   <strong style={{ color: "#FF6B6B" }}>
//                     {form.parentName || form.childName}
//                   </strong>{" "}
//                   — we&apos;ll call <strong>{form.phone}</strong> to confirm your spot at camp. 🚀
//                 </p>
//                 <button onClick={resetForm} className="enroll-btn" style={{ fontSize: 15, padding: "13px 30px" }}>
//                   ✉️ Register Another Child
//                 </button>
//               </div>
//             ) : (
//               /* ── Form ── */
//               <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//                 {/* ── Validation summary banner ── */}
//                 {hasErrors && (
//                   <div
//                     style={{
//                       background: "#FFF8F0",
//                       border: "2px solid #FFD6A5",
//                       borderRadius: 16,
//                       padding: "14px 18px",
//                     }}
//                   >
//                     <div style={{ fontSize: 13, fontWeight: 800, color: "#FF8C00", marginBottom: 8 }}>
//                       ⚠️ Please fix the following before submitting:
//                     </div>
//                     <ul style={{ paddingLeft: 18, margin: 0 }}>
//                       {(Object.values(fieldErrors).filter(Boolean) as string[]).map((msg, i) => (
//                         <li key={i} style={{ fontSize: 12, fontWeight: 700, color: "#FF4444", marginBottom: 2 }}>
//                           {msg}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* ── Field grid ── */}
//                 <div className="form-grid">

//                   {/* Child's Name */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Child&apos;s Name *
//                     </label>
//                     <input
//                       name="childName"
//                       value={form.childName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       placeholder="Full name"
//                       className={`form-input${fieldErrors.childName ? " error" : ""}`}
//                       style={inputBorder("childName")}
//                       disabled={loading}
//                     />
//                     <FieldError field="childName" />
//                   </div>

//                   {/* Parent's Name */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Parent&apos;s Name
//                       <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none", marginLeft: 4 }}>(optional)</span>
//                     </label>
//                     <input
//                       name="parentName"
//                       value={form.parentName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       placeholder="Parent / Guardian"
//                       className="form-input"
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Phone Number *
//                       <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none", marginLeft: 4 }}>(10 digits)</span>
//                     </label>
//                     <input
//                       name="phone"
//                       value={form.phone}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       placeholder="9876543210"
//                       className={`form-input${fieldErrors.phone ? " error" : ""}`}
//                       style={inputBorder("phone")}
//                       disabled={loading}
//                       inputMode="numeric"
//                       maxLength={10}
//                     />
//                     <FieldError field="phone" />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Email
//                       <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none", marginLeft: 4 }}>(optional)</span>
//                     </label>
//                     <input
//                       name="email"
//                       value={form.email}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       placeholder="you@email.com"
//                       className={`form-input${fieldErrors.email ? " error" : ""}`}
//                       style={inputBorder("email")}
//                       disabled={loading}
//                       type="email"
//                     />
//                     <FieldError field="email" />
//                   </div>

//                   {/* Age Group */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Age Group *
//                     </label>
//                     <select
//                       name="age"
//                       value={form.age}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={`form-input${fieldErrors.age ? " error" : ""}`}
//                       style={{ cursor: "pointer", ...inputBorder("age") }}
//                       disabled={loading}
//                     >
//                       <option value="">Select age group</option>
//                       <option value="3-5">3–5 years</option>
//                       <option value="5-8">5–8 years</option>
//                       <option value="8-12">8–12 years</option>
//                       <option value="12-15">12–15 years</option>
//                       <option value="15-25">15–25 years (Martial Arts)</option>
//                     </select>
//                     <FieldError field="age" />
//                   </div>

//                   {/* Program */}
//                   <div>
//                     <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                       Interested Program *
//                     </label>
//                     <select
//                       name="program"
//                       value={form.program}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={`form-input${fieldErrors.program ? " error" : ""}`}
//                       style={{ cursor: "pointer", ...inputBorder("program") }}
//                       disabled={loading}
//                     >
//                       <option value="">Select a program</option>
//                       <option value="Summer Camp (General)">Summer Camp (General)</option>
//                       <option value="Martial Arts / Karate">Martial Arts / Karate</option>
//                       <option value="Abacus & Vedic Maths">Abacus &amp; Vedic Maths</option>
//                       <option value="Tuition (9th-10th)">Tuition (9th–10th)</option>
//                       <option value="Tuition (11th-12th)">Tuition (11th–12th)</option>
//                       <option value="Multiple Programs">Multiple Programs</option>
//                     </select>
//                     <FieldError field="program" />
//                   </div>
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>
//                     Message
//                     <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none", marginLeft: 4 }}>(optional)</span>
//                   </label>
//                   <textarea
//                     name="message"
//                     value={form.message}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder="Any specific questions, preferred timings, or special requirements..."
//                     className="form-input"
//                     disabled={loading}
//                     style={{ height: 100, resize: "vertical" }}
//                   />
//                 </div>

//                 {/* Global API error */}
//                 {globalError && (
//                   <div
//                     style={{
//                       background: "#FFF0F0",
//                       border: "2px solid #FFD6D6",
//                       borderRadius: 14,
//                       padding: "12px 18px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 10,
//                     }}
//                   >
//                     <span style={{ fontSize: 18 }}>⚠️</span>
//                     <span style={{ fontSize: 13, fontWeight: 800, color: "#FF4444" }}>{globalError}</span>
//                   </div>
//                 )}

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="enroll-btn"
//                   disabled={loading}
//                   style={{ width: "100%", justifyContent: "center", fontSize: 17, padding: "18px" }}
//                 >
//                   {loading ? (
//                     <>
//                       <div
//                         style={{
//                           width: 20,
//                           height: 20,
//                           border: "3px solid rgba(255,255,255,0.3)",
//                           borderTop: "3px solid white",
//                           borderRadius: "50%",
//                           animation: "spin-slow 0.8s linear infinite",
//                         }}
//                       />
//                       Submitting…
//                     </>
//                   ) : (
//                     "🚀 Confirm My Enrolment"
//                   )}
//                 </button>

//                 <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", fontWeight: 700 }}>
//                   We&apos;ll call you within a few hours to confirm your spot. 📞
//                 </p>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           CONTACT
//       ══════════════════════════════════════════════════ */}
//       <section
//         className="contact-section"
//         style={{ background: "#1A1A2E", padding: "72px 24px" }}
//       >
//         <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
//           <div
//             style={{
//               position: "absolute",
//               top: -40,
//               right: -40,
//               width: 200,
//               height: 200,
//               borderRadius: "50%",
//               background: "#FF6B6B",
//               opacity: 0.08,
//             }}
//           />
//           <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px,3.5vw,40px)", color: "white", marginBottom: 12 }}>
//             📍 Find Us
//           </div>
//           <div style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 32 }}>
//             HEAD OFFICE — D168C, Patel Garden<br />
//             Main Dwarka Road, Near Royal Garden<br />
//             Dwarka Mor, New Delhi
//           </div>
//           <a
//             href="tel:9810366417"
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 12,
//               background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
//               color: "white",
//               textDecoration: "none",
//               fontFamily: "'Fredoka One', cursive",
//               fontSize: "clamp(22px,3vw,36px)",
//               padding: "18px 44px",
//               borderRadius: 50,
//               boxShadow: "0 10px 40px rgba(255,107,107,0.35)",
//               transition: "transform 0.2s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             📞 9810366417
//           </a>
//           <div style={{ marginTop: 28, fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>
//             For Registration / Enquiry — Call or WhatsApp
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════════════════ */}
//       <footer style={{ background: "#111120", padding: "28px 24px", textAlign: "center" }}>
//         <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "white", marginBottom: 8 }}>
//           Ascento™ <span style={{ color: "#FF6B6B" }}>Activity Center</span>
//         </div>
//         <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
//           © 2025 Ascento Activity Center. All rights reserved. Made with 💛 for young learners.
//         </div>
//       </footer>
//     </div>
//   );
// }

























// "use client";

// import { useState } from "react";

// const activities = [
//   { emoji: "🎨", label: "Art & Craft" },
//   { emoji: "♻️", label: "Best out of Wastes" },
//   { emoji: "🧠", label: "Brain Exercise" },
//   { emoji: "✏️", label: "Drawing Class" },
//   { emoji: "✍️", label: "Handwriting & Calligraphy" },
//   { emoji: "🧮", label: "Abacus & Vedic Maths" },
//   { emoji: "📖", label: "English Grammar" },
//   { emoji: "🗣️", label: "English Spoken" },
//   { emoji: "📚", label: "Improve Vocabulary" },
//   { emoji: "💃", label: "Dance / Zumba" },
//   { emoji: "🎵", label: "Music" },
//   { emoji: "♟️", label: "Chess" },
//   { emoji: "🧬", label: "Mid Brain Activation" },
//   { emoji: "🎮", label: "Brain Games" },
//   { emoji: "🏠", label: "Holiday Home & Project Work" },
// ];

// const martialArts = [
//   { emoji: "🥋", label: "Karate" },
//   { emoji: "🛡️", label: "Self Defence" },
//   { emoji: "⚔️", label: "Martial Arts" },
//   { emoji: "🏅", label: "Taekwondo" },
// ];

// const tuitionClasses = [
//   { label: "Classes 9th & 10th", subjects: "Mathematics & Science" },
//   { label: "Classes 11th & 12th", subjects: "Mathematics, Accounts & Economics" },
// ];

// type FormState = {
//   childName: string;
//   parentName: string;
//   phone: string;
//   email: string;
//   age: string;
//   program: string;
//   message: string;
// };

// type FieldErrors = Partial<Record<keyof FormState, string>>;

// const validators: Record<keyof FormState, (v: string) => string> = {
//   childName: (v) => v.trim().length >= 2 ? "" : "Child's name must be at least 2 characters.",
//   parentName: () => "",
//   phone: (v) => /^\d{10}$/.test(v.replace(/\D/g, "")) ? "" : "Enter a valid 10-digit mobile number.",
//   email: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.",
//   age: (v) => (v.trim() ? "" : "Please select an age group."),
//   program: (v) => (v.trim() ? "" : "Please select a program."),
//   message: () => "",
// };

// export default function SummerCampPage() {
//   const [form, setForm] = useState<FormState>({
//     childName: "", parentName: "", phone: "", email: "",
//     age: "", program: "", message: "",
//   });
//   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [globalError, setGlobalError] = useState("");

//   const validateField = (name: keyof FormState, value: string): string =>
//     validators[name]?.(value) ?? "";

//   const validateAll = (): boolean => {
//     const errors: FieldErrors = {};
//     (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
//       const msg = validateField(key, form[key]);
//       if (msg) errors[key] = msg;
//     });
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const key = name as keyof FormState;
//     const processed = key === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
//     setForm((prev) => ({ ...prev, [key]: processed }));
//     if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }));
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const key = name as keyof FormState;
//     setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setGlobalError("");
//     if (!validateAll()) return;
//     setLoading(true);
//     try {
//       const res = await fetch("/api/summer-camp/enroll", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Something went wrong");
//       setSubmitted(true);
//     } catch (err: any) {
//       setGlobalError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSubmitted(false);
//     setFieldErrors({});
//     setGlobalError("");
//     setForm({ childName: "", parentName: "", phone: "", email: "", age: "", program: "", message: "" });
//   };

//   const hasErrors = Object.values(fieldErrors).some(Boolean);

//   const FieldError = ({ field }: { field: keyof FormState }) =>
//     fieldErrors[field] ? (
//       <div style={{ fontSize: 11, fontWeight: 800, color: "#E53E3E", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
//         <span>⚠️</span> {fieldErrors[field]}
//       </div>
//     ) : null;

//   const inputBorder = (field: keyof FormState): React.CSSProperties => ({
//     borderColor: fieldErrors[field] ? "#E53E3E" : undefined,
//   });

//   return (
//     <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FFFEF0", color: "#1A1A2E", overflowX: "hidden" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes float-a  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
//         @keyframes float-b  { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-12px) rotate(-2deg)} }
//         @keyframes float-c  { 0%,100%{transform:translateY(0) rotate(0deg)}  50%{transform:translateY(-10px) rotate(5deg)} }
//         @keyframes spin-slow { to { transform: rotate(360deg); } }
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 80%{transform:scale(0.95)} 100%{transform:scale(1)} }
//         @keyframes wiggle   { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
//         @keyframes cloud-drift { 0%{transform:translateX(0)} 100%{transform:translateX(8px)} }

//         .float-a { animation: float-a 4s   ease-in-out infinite; }
//         .float-b { animation: float-b 5.5s ease-in-out infinite; }
//         .float-c { animation: float-c 3.5s ease-in-out infinite; }
//         .fade-up { animation: fadeUp  0.7s ease both; }
//         .bounce-in { animation: bounceIn 0.5s cubic-bezier(.34,1.56,.64,1) both; }

//         /* ── Activity pills ── */
//         .activity-pill {
//           display:flex; align-items:center; gap:10px;
//           padding:13px 20px; border-radius:20px;
//           background:white; border:3px solid #FFE5B4;
//           font-weight:800; font-size:14px; color:#333;
//           transition:all 0.25s cubic-bezier(.34,1.56,.64,1);
//           cursor:default; box-shadow:0 3px 0 #FFD580;
//         }
//         .activity-pill:hover {
//           transform:translateY(-5px) scale(1.05);
//           border-color:#FF8C42; box-shadow:0 8px 0 #FF8C42, 0 12px 28px rgba(255,140,66,0.18);
//           background:#FFFBF3;
//         }

//         /* ── Martial arts cards ── */
//         .martial-card {
//           background:white; border-radius:24px; padding:30px 24px;
//           border:3px solid #C3F0CA; text-align:center;
//           transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
//           box-shadow:0 4px 0 #7BD48A;
//         }
//         .martial-card:hover {
//           transform:translateY(-8px) rotate(1deg);
//           box-shadow:0 14px 0 #7BD48A, 0 20px 40px rgba(123,212,138,0.2);
//           border-color:#4CAF50;
//         }

//         /* ── CTA button ── */
//         .enroll-btn {
//           background:linear-gradient(135deg,#FF6B35,#FF9A00);
//           color:#fff; font-family:inherit; font-weight:900;
//           font-size:16px; padding:16px 36px; border-radius:50px;
//           border:none; cursor:pointer; text-decoration:none;
//           display:inline-flex; align-items:center; gap:10px;
//           box-shadow:0 6px 0 #C94B00, 0 12px 32px rgba(255,107,53,0.3);
//           transition:all 0.2s cubic-bezier(.34,1.56,.64,1); white-space:nowrap;
//         }
//         .enroll-btn:hover:not(:disabled) {
//           transform:scale(1.06) translateY(-3px);
//           box-shadow:0 10px 0 #C94B00, 0 20px 40px rgba(255,107,53,0.4);
//         }
//         .enroll-btn:active:not(:disabled) {
//           transform:scale(0.98) translateY(2px);
//           box-shadow:0 3px 0 #C94B00;
//         }
//         .enroll-btn:disabled { opacity:0.7; cursor:not-allowed; }

//         /* ── Form inputs ── */
//         .form-input {
//           width:100%; padding:14px 18px; border-radius:16px;
//           border:3px solid #FFE5B4; background:#FFFEF8;
//           font-family:inherit; font-size:15px; font-weight:700;
//           color:#333; outline:none;
//           transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
//         }
//         .form-input:focus {
//           border-color:#FF8C42; background:white;
//           box-shadow:0 0 0 4px rgba(255,140,66,0.12), 0 4px 0 #FFD580;
//         }
//         .form-input.error { border-color:#E53E3E !important; background:#FFF5F5; }
//         .form-input:disabled { opacity:0.6; cursor:not-allowed; }

//         /* ── Info chip ── */
//         .info-chip {
//           display:inline-flex; align-items:center; gap:7px;
//           background:white; border:3px solid #FFE5B4;
//           border-radius:50px; padding:9px 20px;
//           font-size:14px; font-weight:800; color:#333;
//           box-shadow:0 3px 0 #FFD580;
//         }

//         /* ── Squiggle divider ── */
//         .squiggle { width:100%; overflow:hidden; line-height:0; }

//         /* ── Form grid ── */
//         .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

//         /* ── Cloud shapes ── */
//         .cloud {
//           position:absolute; background:rgba(255,255,255,0.7);
//           border-radius:50px; pointer-events:none;
//         }

//         .hero-float { pointer-events:none; }

//         ::-webkit-scrollbar { width:8px; }
//         ::-webkit-scrollbar-thumb { background:#FF9A00; border-radius:4px; }

//         /* TABLET ≤ 768px */
//         @media (max-width: 768px) {
//           .hero-float { display:none; }
//           .form-grid  { grid-template-columns:1fr; gap:14px; }
//         }

//         /* MOBILE ≤ 640px */
//         @media (max-width: 640px) {
//           .form-card    { padding:24px 16px !important; border-radius:22px !important; }
//           .form-card h2 { font-size:24px !important; }
//           .enroll-btn   { font-size:14px !important; padding:14px 24px !important; }
//           .info-chip    { font-size:12px; padding:6px 12px; }
//           .activity-pill { font-size:13px; padding:10px 14px; }
//           .martial-section-inner { padding:32px 22px !important; border-radius:22px !important; }
//           .contact-section { padding:48px 16px !important; }
//         }

//         /* SMALL ≤ 400px */
//         @media (max-width: 400px) {
//           .info-chips-row { gap:8px !important; }
//           .info-chip { font-size:11px; padding:5px 10px; }
//           .enroll-btn { font-size:13px !important; padding:12px 18px !important; }
//         }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           HERO — Sky blue gradient, bright & airy
//       ══════════════════════════════════════════════════ */}
//       <section
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           background: "linear-gradient(165deg,#87CEEB 0%,#B8E6FF 35%,#FFF8DC 70%,#FFE4B5 100%)",
//           position: "relative",
//           overflow: "hidden",
//           padding: "120px 24px 100px",
//         }}
//       >
//         {/* Dotty background */}
//         <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,160,0,0.18) 2px,transparent 2px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />

//         {/* Sun */}
//         <div style={{ position:"absolute", top:-60, right:"8%", width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,#FFD700 20%,#FFB347 60%,transparent 80%)", opacity:0.85, pointerEvents:"none" }} />
//         <div style={{ position:"absolute", top:20, right:"12%", fontSize:80, pointerEvents:"none", opacity:0.4 }}>☀️</div>

//         {/* Clouds */}
//         <div className="cloud" style={{ top:"10%",left:"3%", width:140,height:50, animation:"cloud-drift 4s ease-in-out infinite alternate" }} />
//         <div className="cloud" style={{ top:"18%",left:"8%", width:90,height:36, animation:"cloud-drift 5s ease-in-out infinite alternate", animationDelay:"0.5s" }} />
//         <div className="cloud" style={{ top:"8%",right:"30%", width:120,height:44, animation:"cloud-drift 6s ease-in-out infinite alternate", animationDelay:"1s" }} />

//         {/* Floating emojis */}
//         <div className="hero-float float-a" style={{ position:"absolute",top:"15%",left:"4%",fontSize:56 }}>🎨</div>
//         <div className="hero-float float-b" style={{ position:"absolute",top:"22%",right:"5%",fontSize:48 }}>🥋</div>
//         <div className="hero-float float-c" style={{ position:"absolute",bottom:"22%",left:"7%",fontSize:44 }}>🎵</div>
//         <div className="hero-float float-a" style={{ position:"absolute",bottom:"28%",right:"4%",fontSize:52 }}>♟️</div>
//         <div className="hero-float float-b" style={{ position:"absolute",top:"55%",left:"1%",fontSize:38 }}>🧠</div>
//         <div className="hero-float float-c" style={{ position:"absolute",top:"42%",right:"2%",fontSize:40 }}>💃</div>
//         <div className="hero-float float-a" style={{ position:"absolute",bottom:"10%",right:"12%",fontSize:42 }}>🎮</div>

//         {/* Green grass strip at bottom */}
//         <div style={{ position:"absolute",bottom:0,left:0,right:0,height:60, background:"linear-gradient(180deg,transparent,#7CB97E)", borderRadius:"50% 50% 0 0 / 30% 30% 0 0", pointerEvents:"none" }} />

//         <div
//           style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}
//           className="fade-up"
//         >
//           {/* Badge */}
//           <div style={{
//             display:"inline-flex", alignItems:"center", gap:8,
//             background:"#FF6B35", borderRadius:50, padding:"10px 24px", marginBottom:28,
//             boxShadow:"0 4px 0 #C94B00",
//           }}>
//             <span>☀️</span>
//             <span style={{ fontWeight:900, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
//               Dwarka&apos;s Biggest
//             </span>
//           </div>

//           <h1 style={{
//             fontFamily:"'Fredoka One', cursive",
//             fontSize:"clamp(56px,9vw,108px)",
//             color:"#1A3A5C",
//             lineHeight:0.9,
//             marginBottom:24,
//             textShadow:"4px 4px 0 rgba(0,0,0,0.07)",
//           }}>
//             Summer<br />
//             <span style={{ color:"#FF6B35", textShadow:"3px 3px 0 #C94B00" }}>Camp</span>{" "}
//             <span style={{ color:"#FFA500", textShadow:"3px 3px 0 #CC7A00" }}>2026</span>
//           </h1>

//           <p style={{
//             fontSize:"clamp(16px,2vw,20px)",
//             color:"#2C5282",
//             lineHeight:1.7,
//             maxWidth:560,
//             margin:"0 auto 40px",
//             fontWeight:700,
//             background:"rgba(255,255,255,0.5)",
//             padding:"16px 24px",
//             borderRadius:20,
//             backdropFilter:"blur(4px)",
//           }}>
//             A fun-filled, skill-building summer adventure for ages 5–15. Art,
//             music, martial arts, brain training and so much more!
//           </p>

//           <div
//             className="info-chips-row"
//             style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginBottom:44 }}
//           >
//             <div className="info-chip">👶 Age: 5 – 15 Yrs</div>
//             <div className="info-chip">📅 Starts 11th May</div>
//             <div className="info-chip">🕗 8:00 AM – 1:00 PM</div>
//             <div className="info-chip">📍 Dwarka, New Delhi</div>
//           </div>

//           <a href="#enroll" className="enroll-btn" style={{ fontSize:18, padding:"20px 48px" }}>
//             🎉 Enrol Now — It&apos;s Free to Register!
//           </a>
//         </div>
//       </section>

//       {/* Wavy divider */}
//       <div style={{ background:"#FFFEF0", marginTop:-2 }}>
//         <svg viewBox="0 0 1440 60" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
//           <path d="M0,60 C240,0 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z"
//             fill="#7CB97E" />
//         </svg>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           ACTIVITIES — Sunny yellow background
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding:"72px 24px 80px", background:"linear-gradient(180deg,#FFFEF0,#FFF8DC)" }}>
//         <div style={{ maxWidth:1100, margin:"0 auto" }}>
//           <div style={{ textAlign:"center", marginBottom:52 }}>
//             <div style={{
//               display:"inline-flex", alignItems:"center", gap:8,
//               background:"#FF9A00", borderRadius:50, padding:"8px 22px", marginBottom:16,
//               boxShadow:"0 4px 0 #CC7A00",
//             }}>
//               <span style={{ fontWeight:900, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
//                 🎯 What We Offer
//               </span>
//             </div>
//             <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(32px,4vw,52px)", color:"#1A3A5C", marginBottom:14 }}>
//               15+ Exciting <span style={{ color:"#FF6B35" }}>Activities</span>
//             </h2>
//             <p style={{ fontSize:17, color:"#5A6A7A", fontWeight:700, maxWidth:480, margin:"0 auto" }}>
//               Each program gives your child a new experience and provides a fun educational summer camp.
//             </p>
//           </div>

//           <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
//             {activities.map((a, i) => (
//               <div key={i} className="activity-pill">
//                 <span style={{ fontSize:22 }}>{a.emoji}</span>
//                 {a.label}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Wavy divider */}
//       <div style={{ background:"#F0FFF4" }}>
//         <svg viewBox="0 0 1440 55" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
//           <path d="M0,0 C360,55 720,0 1080,40 C1260,55 1380,20 1440,35 L1440,55 L0,55 Z"
//             fill="#FFF8DC" />
//         </svg>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           MARTIAL ARTS — Fresh green background
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding:"0 24px 80px", background:"linear-gradient(180deg,#F0FFF4,#DCFFE8)" }}>
//         <div style={{ maxWidth:1100, margin:"0 auto" }}>
//           <div
//             className="martial-section-inner"
//             style={{
//               background:"linear-gradient(135deg,#2E7D32,#388E3C,#43A047)",
//               borderRadius:36,
//               padding:"56px 48px",
//               position:"relative",
//               overflow:"hidden",
//               boxShadow:"0 8px 0 #1B5E20, 0 16px 48px rgba(46,125,50,0.3)",
//             }}
//           >
//             {/* Decorative dots */}
//             <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.08) 2px,transparent 2px)", backgroundSize:"28px 28px" }} />
//             <div style={{ position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }} />
//             <div style={{ position:"absolute",bottom:-30,left:60,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }} />

//             <div style={{ textAlign:"center", marginBottom:44, position:"relative", zIndex:1 }}>
//               <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(28px,3.5vw,44px)", color:"white", marginBottom:10, textShadow:"2px 2px 0 rgba(0,0,0,0.2)" }}>
//                 🥋 Martial Arts <span style={{ color:"#A5D6A7" }}>Programme</span>
//               </div>
//               <div style={{
//                 display:"inline-block", background:"rgba(255,255,255,0.15)",
//                 border:"2px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"7px 20px",
//               }}>
//                 <p style={{ color:"rgba(255,255,255,0.9)", fontSize:15, fontWeight:800 }}>Age Group: 3 Years to 25 Years</p>
//               </div>
//             </div>

//             <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20, position:"relative", zIndex:1 }}>
//               {martialArts.map((m, i) => (
//                 <div key={i} className="martial-card">
//                   <div style={{ fontSize:48, marginBottom:14 }}>{m.emoji}</div>
//                   <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:22, color:"#1A3A5C" }}>{m.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Wavy divider */}
//       <div style={{ background:"#FFF0F5" }}>
//         <svg viewBox="0 0 1440 55" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
//           <path d="M0,55 C480,0 960,55 1440,20 L1440,55 Z" fill="#DCFFE8" />
//         </svg>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           TUITION — Soft pink/lavender
//       ══════════════════════════════════════════════════ */}
//       <section style={{ padding:"72px 24px 80px", background:"linear-gradient(180deg,#FFF0F5,#F3E8FF)" }}>
//         <div style={{ maxWidth:1100, margin:"0 auto" }}>
//           <div style={{ textAlign:"center", marginBottom:48 }}>
//             <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(28px,3.5vw,44px)", color:"#1A3A5C", marginBottom:12 }}>
//               🎓 Quality <span style={{ color:"#8B5CF6" }}>Tuition Classes</span>
//             </h2>
//             <p style={{ fontSize:16, color:"#5A6A7A", fontWeight:700, maxWidth:520, margin:"0 auto" }}>
//               Looking for reliable quality tuition for your child? Book a FREE trial class today.
//             </p>
//           </div>

//           <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
//             {tuitionClasses.map((c, i) => (
//               <div key={i} style={{
//                 background:"white",
//                 borderRadius:28,
//                 padding:"36px 32px",
//                 border:`3px solid ${i === 0 ? "#FFC0CB" : "#C4B5FD"}`,
//                 boxShadow:`0 6px 0 ${i === 0 ? "#FFB347" : "#8B5CF6"}, 0 12px 32px rgba(0,0,0,0.06)`,
//                 position:"relative",
//                 overflow:"hidden",
//                 transition:"transform 0.25s cubic-bezier(.34,1.56,.64,1)",
//               }}
//               onMouseEnter={e => (e.currentTarget.style.transform="translateY(-6px)")}
//               onMouseLeave={e => (e.currentTarget.style.transform="translateY(0)")}
//               >
//                 <div style={{
//                   position:"absolute",top:0,left:0,right:0,height:8,
//                   background:i === 0 ? "linear-gradient(90deg,#FF6B6B,#FFB347)" : "linear-gradient(90deg,#8B5CF6,#EC4899)",
//                   borderRadius:"24px 24px 0 0"
//                 }} />
//                 <div style={{ fontSize:40, marginBottom:16 }}>{i === 0 ? "📐" : "📊"}</div>
//                 <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:24, color:"#1A3A5C", marginBottom:10 }}>{c.label}</div>
//                 <div style={{ fontSize:15, fontWeight:800, color: i === 0 ? "#FF6B35" : "#8B5CF6" }}>{c.subjects}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           ENROLL FORM — Warm white
//       ══════════════════════════════════════════════════ */}
//       <section id="enroll" style={{ padding:"80px 24px 100px", background:"linear-gradient(180deg,#FFF8DC,#FFFEF0)" }}>
//         <div style={{ maxWidth:760, margin:"0 auto" }}>
//           <div style={{ textAlign:"center", marginBottom:48 }}>
//             <div style={{
//               display:"inline-flex",alignItems:"center",gap:8,
//               background:"#FF6B35",borderRadius:50,padding:"9px 22px",marginBottom:16,
//               boxShadow:"0 4px 0 #C94B00",
//             }}>
//               <span style={{ fontWeight:900, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
//                 📝 Register Now
//               </span>
//             </div>
//             <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(30px,4vw,48px)", color:"#1A3A5C", marginBottom:12 }}>
//               Enrol Your Child <span style={{ color:"#FF6B35" }}>Today!</span>
//             </h2>
//             <p style={{ fontSize:16, color:"#5A6A7A", fontWeight:700 }}>
//               Fill the form below and we&apos;ll reach out to confirm your spot.
//             </p>
//           </div>

//           <div
//             className="form-card"
//             style={{
//               background:"white",
//               borderRadius:36,
//               padding:"48px",
//               boxShadow:"0 8px 0 #FFD580, 0 16px 60px rgba(255,165,0,0.12)",
//               border:"3px solid #FFE5B4",
//             }}
//           >
//             {submitted ? (
//               <div style={{ textAlign:"center", padding:"24px 0" }}>
//                 <div style={{ fontSize:80, marginBottom:20 }}>🎉</div>
//                 <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:32, color:"#1A3A5C", marginBottom:14 }}>
//                   You&apos;re Registered!
//                 </div>
//                 <p style={{ fontSize:16, color:"#5A6A7A", lineHeight:1.7, marginBottom:28 }}>
//                   Thank you!{" "}
//                   <strong style={{ color:"#FF6B35" }}>{form.parentName || form.childName}</strong>
//                   {" "}— we&apos;ll call <strong>{form.phone}</strong> to confirm your spot at camp. 🚀
//                 </p>
//                 <button onClick={resetForm} className="enroll-btn" style={{ fontSize:15, padding:"13px 30px" }}>
//                   ✉️ Register Another Child
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:20 }}>
//                 {hasErrors && (
//                   <div style={{
//                     background:"#FFF8F0", border:"3px solid #FFD6A5",
//                     borderRadius:16, padding:"14px 18px",
//                     boxShadow:"0 3px 0 #FFB347",
//                   }}>
//                     <div style={{ fontSize:13, fontWeight:800, color:"#CC7700", marginBottom:8 }}>
//                       ⚠️ Please fix the following before submitting:
//                     </div>
//                     <ul style={{ paddingLeft:18, margin:0 }}>
//                       {(Object.values(fieldErrors).filter(Boolean) as string[]).map((msg, i) => (
//                         <li key={i} style={{ fontSize:12, fontWeight:700, color:"#E53E3E", marginBottom:2 }}>{msg}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="form-grid">
//                   {/* Child's Name */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Child&apos;s Name *
//                     </label>
//                     <input
//                       name="childName" value={form.childName}
//                       onChange={handleChange} onBlur={handleBlur}
//                       placeholder="Full name"
//                       className={`form-input${fieldErrors.childName ? " error" : ""}`}
//                       style={inputBorder("childName")} disabled={loading}
//                     />
//                     <FieldError field="childName" />
//                   </div>

//                   {/* Parent's Name */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Parent&apos;s Name
//                       <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
//                     </label>
//                     <input
//                       name="parentName" value={form.parentName}
//                       onChange={handleChange} onBlur={handleBlur}
//                       placeholder="Parent / Guardian"
//                       className="form-input" disabled={loading}
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Phone Number *
//                       <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(10 digits)</span>
//                     </label>
//                     <input
//                       name="phone" value={form.phone}
//                       onChange={handleChange} onBlur={handleBlur}
//                       placeholder="9876543210"
//                       className={`form-input${fieldErrors.phone ? " error" : ""}`}
//                       style={inputBorder("phone")} disabled={loading}
//                       inputMode="numeric" maxLength={10}
//                     />
//                     <FieldError field="phone" />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Email
//                       <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
//                     </label>
//                     <input
//                       name="email" value={form.email}
//                       onChange={handleChange} onBlur={handleBlur}
//                       placeholder="you@email.com"
//                       className={`form-input${fieldErrors.email ? " error" : ""}`}
//                       style={inputBorder("email")} disabled={loading} type="email"
//                     />
//                     <FieldError field="email" />
//                   </div>

//                   {/* Age Group */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Age Group *
//                     </label>
//                     <select
//                       name="age" value={form.age}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`form-input${fieldErrors.age ? " error" : ""}`}
//                       style={{ cursor:"pointer",...inputBorder("age") }} disabled={loading}
//                     >
//                       <option value="">Select age group</option>
//                       <option value="3-5">3–5 years</option>
//                       <option value="5-8">5–8 years</option>
//                       <option value="8-12">8–12 years</option>
//                       <option value="12-15">12–15 years</option>
//                       <option value="15-25">15–25 years (Martial Arts)</option>
//                     </select>
//                     <FieldError field="age" />
//                   </div>

//                   {/* Program */}
//                   <div>
//                     <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                       Interested Program *
//                     </label>
//                     <select
//                       name="program" value={form.program}
//                       onChange={handleChange} onBlur={handleBlur}
//                       className={`form-input${fieldErrors.program ? " error" : ""}`}
//                       style={{ cursor:"pointer",...inputBorder("program") }} disabled={loading}
//                     >
//                       <option value="">Select a program</option>
//                       <option value="Summer Camp (General)">Summer Camp (General)</option>
//                       <option value="Martial Arts / Karate">Martial Arts / Karate</option>
//                       <option value="Abacus & Vedic Maths">Abacus &amp; Vedic Maths</option>
//                       <option value="Tuition (9th-10th)">Tuition (9th–10th)</option>
//                       <option value="Tuition (11th-12th)">Tuition (11th–12th)</option>
//                       <option value="Multiple Programs">Multiple Programs</option>
//                     </select>
//                     <FieldError field="program" />
//                   </div>
//                 </div>

//                 {/* Message */}
//                 <div>
//                   <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
//                     Message
//                     <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
//                   </label>
//                   <textarea
//                     name="message" value={form.message}
//                     onChange={handleChange} onBlur={handleBlur}
//                     placeholder="Any specific questions, preferred timings, or special requirements..."
//                     className="form-input" disabled={loading}
//                     style={{ height:100, resize:"vertical" }}
//                   />
//                 </div>

//                 {globalError && (
//                   <div style={{
//                     background:"#FFF0F0", border:"3px solid #FFC0CB",
//                     borderRadius:14, padding:"12px 18px",
//                     display:"flex", alignItems:"center", gap:10,
//                   }}>
//                     <span style={{ fontSize:18 }}>⚠️</span>
//                     <span style={{ fontSize:13, fontWeight:800, color:"#E53E3E" }}>{globalError}</span>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className="enroll-btn"
//                   disabled={loading}
//                   style={{ width:"100%", justifyContent:"center", fontSize:17, padding:"18px" }}
//                 >
//                   {loading ? (
//                     <>
//                       <div style={{ width:20,height:20,border:"3px solid rgba(255,255,255,0.3)",borderTop:"3px solid white",borderRadius:"50%",animation:"spin-slow 0.8s linear infinite" }} />
//                       Submitting…
//                     </>
//                   ) : (
//                     "🚀 Confirm My Enrolment"
//                   )}
//                 </button>

//                 <p style={{ textAlign:"center", fontSize:12, color:"#AAA", fontWeight:700 }}>
//                   We&apos;ll call you within a few hours to confirm your spot. 📞
//                 </p>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           CONTACT — Bright coral/orange
//       ══════════════════════════════════════════════════ */}
//       <section
//         className="contact-section"
//         style={{ background:"linear-gradient(135deg,#FF6B35,#FF9A00,#FFB347)", padding:"80px 24px", position:"relative", overflow:"hidden" }}
//       >
//         <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.12) 2px,transparent 2px)", backgroundSize:"28px 28px" }} />
//         <div style={{ position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }} />
//         <div style={{ position:"absolute",bottom:-40,left:40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.08)" }} />

//         <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
//           <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(26px,3.5vw,40px)", color:"white", marginBottom:12, textShadow:"2px 2px 0 rgba(0,0,0,0.15)" }}>
//             📍 Find Us
//           </div>
//           <div style={{
//             fontSize:18, fontWeight:800, color:"rgba(255,255,255,0.92)", lineHeight:1.8, marginBottom:32,
//             background:"rgba(255,255,255,0.15)", display:"inline-block", padding:"20px 32px", borderRadius:24,
//             border:"2px solid rgba(255,255,255,0.25)", backdropFilter:"blur(4px)",
//           }}>
//             HEAD OFFICE — D168C, Patel Garden<br />
//             Main Dwarka Road, Near Royal Garden<br />
//             Dwarka Mor, New Delhi
//           </div>
//           <div style={{ display:"block" }} />
//           <a
//             href="tel:9810366417"
//             style={{
//               display:"inline-flex", alignItems:"center", gap:12,
//               background:"white", color:"#FF6B35",
//               textDecoration:"none",
//               fontFamily:"'Fredoka One', cursive",
//               fontSize:"clamp(22px,3vw,36px)",
//               padding:"18px 44px", borderRadius:50,
//               boxShadow:"0 6px 0 rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.1)",
//               transition:"transform 0.2s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.transform="scale(1.06) translateY(-3px)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform="scale(1)")}
//           >
//             📞 9810366417
//           </a>
//           <div style={{ marginTop:24, fontSize:15, color:"rgba(255,255,255,0.85)", fontWeight:800 }}>
//             For Registration / Enquiry — Call or WhatsApp 💬
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════════════════ */}
//       <footer style={{ background:"#1A3A5C", padding:"28px 24px", textAlign:"center" }}>
//         <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:20, color:"white", marginBottom:8 }}>
//           Ascento™ <span style={{ color:"#FFB347" }}>Activity Center</span>
//         </div>
//         <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontWeight:700 }}>
//           © 2025 Ascento Activity Center. All rights reserved. Made with 💛 for young learners.
//         </div>
//       </footer>
//     </div>
//   );
// }





















"use client";

import { useState } from "react";

const activities = [
  { emoji: "🎨", label: "Art & Craft" },
  { emoji: "♻️", label: "Best out of Wastes" },
  { emoji: "🧠", label: "Brain Exercise" },
  { emoji: "✏️", label: "Drawing Class" },
  { emoji: "✍️", label: "Handwriting & Calligraphy" },
  { emoji: "🧮", label: "Abacus & Vedic Maths" },
  { emoji: "📖", label: "English Grammar" },
  { emoji: "🗣️", label: "English Spoken" },
  { emoji: "📚", label: "Improve Vocabulary" },
  { emoji: "💃", label: "Dance / Zumba" },
  { emoji: "🎵", label: "Music" },
  { emoji: "♟️", label: "Chess" },
  { emoji: "🧬", label: "Mid Brain Activation" },
  { emoji: "🎮", label: "Brain Games" },
  { emoji: "🏠", label: "Holiday Home & Project Work" },
];

const martialArts = [
  { emoji: "🥋", label: "Karate" },
  { emoji: "🛡️", label: "Self Defence" },
  { emoji: "⚔️", label: "Martial Arts" },
  { emoji: "🏅", label: "Taekwondo" },
];

const tuitionClasses = [
  { label: "Classes 9th & 10th", subjects: "Mathematics & Science" },
  { label: "Classes 11th & 12th", subjects: "Mathematics, Accounts & Economics" },
];

type FormState = {
  childName: string;
  parentName: string;
  phone: string;
  email: string;
  age: string;
  program: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const validators: Record<keyof FormState, (v: string) => string> = {
  childName: (v) => v.trim().length >= 2 ? "" : "Child's name must be at least 2 characters.",
  parentName: () => "",
  phone: (v) => /^\d{10}$/.test(v.replace(/\D/g, "")) ? "" : "Enter a valid 10-digit mobile number.",
  email: (v) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.",
  age: (v) => (v.trim() ? "" : "Please select an age group."),
  program: (v) => (v.trim() ? "" : "Please select a program."),
  message: () => "",
};

export default function SummerCampPage() {
  const [form, setForm] = useState<FormState>({
    childName: "", parentName: "", phone: "", email: "",
    age: "", program: "", message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validateField = (name: keyof FormState, value: string): string =>
    validators[name]?.(value) ?? "";

  const validateAll = (): boolean => {
    const errors: FieldErrors = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      const msg = validateField(key, form[key]);
      if (msg) errors[key] = msg;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    const processed = key === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [key]: processed }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const sendToWhatsApp = (f: FormState) => {
    const WHATSAPP_NUMBER = "919810366417"; // ← your WhatsApp number (country code + number, no +)
    const ageLabels: Record<string, string> = {
      "3-5": "3–5 years", "5-8": "5–8 years",
      "8-12": "8–12 years", "12-15": "12–15 years",
      "15-25": "15–25 years (Martial Arts)",
    };
    const lines = [
      "🌟 *New Enrolment Enquiry — Ascento Activity Center*",
      "",
      `👦 *Child's Name:* ${f.childName}`,
      f.parentName ? `👨‍👩‍👦 *Parent's Name:* ${f.parentName}` : null,
      `📞 *Phone:* ${f.phone}`,
      f.email ? `📧 *Email:* ${f.email}` : null,
      `🎂 *Age Group:* ${ageLabels[f.age] ?? f.age}`,
      `📚 *Program:* ${f.program}`,
      f.message ? `💬 *Message:* ${f.message}` : null,
      "",
      "✅ Please confirm the enrolment slot. Thank you!",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validateAll()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/summer-camp/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    } catch (err: any) {
      // Non-blocking — still open WhatsApp even if the API is unavailable
      console.warn("API error (non-blocking):", err);
    } finally {
      setLoading(false);
    }
    // Always mark success and open WhatsApp
    setSubmitted(true);
    sendToWhatsApp(form);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFieldErrors({});
    setGlobalError("");
    setForm({ childName: "", parentName: "", phone: "", email: "", age: "", program: "", message: "" });
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  const FieldError = ({ field }: { field: keyof FormState }) =>
    fieldErrors[field] ? (
      <div style={{ fontSize: 11, fontWeight: 800, color: "#E53E3E", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
        <span>⚠️</span> {fieldErrors[field]}
      </div>
    ) : null;

  const inputBorder = (field: keyof FormState): React.CSSProperties => ({
    borderColor: fieldErrors[field] ? "#E53E3E" : undefined,
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FFFEF0", color: "#1A1A2E", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float-a  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes float-b  { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-12px) rotate(-2deg)} }
        @keyframes float-c  { 0%,100%{transform:translateY(0) rotate(0deg)}  50%{transform:translateY(-10px) rotate(5deg)} }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounceIn { 0%{transform:scale(0.7)} 60%{transform:scale(1.1)} 80%{transform:scale(0.95)} 100%{transform:scale(1)} }
        @keyframes wiggle   { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
        @keyframes cloud-drift { 0%{transform:translateX(0)} 100%{transform:translateX(8px)} }

        .float-a { animation: float-a 4s   ease-in-out infinite; }
        .float-b { animation: float-b 5.5s ease-in-out infinite; }
        .float-c { animation: float-c 3.5s ease-in-out infinite; }
        .fade-up { animation: fadeUp  0.7s ease both; }
        .bounce-in { animation: bounceIn 0.5s cubic-bezier(.34,1.56,.64,1) both; }

        /* ── Activity pills ── */
        .activity-pill {
          display:flex; align-items:center; gap:10px;
          padding:13px 20px; border-radius:20px;
          background:white; border:3px solid #FFE5B4;
          font-weight:800; font-size:14px; color:#333;
          transition:all 0.25s cubic-bezier(.34,1.56,.64,1);
          cursor:default; box-shadow:0 3px 0 #FFD580;
        }
        .activity-pill:hover {
          transform:translateY(-5px) scale(1.05);
          border-color:#FF8C42; box-shadow:0 8px 0 #FF8C42, 0 12px 28px rgba(255,140,66,0.18);
          background:#FFFBF3;
        }

        /* ── Martial arts cards ── */
        .martial-card {
          background:white; border-radius:24px; padding:30px 24px;
          border:3px solid #C3F0CA; text-align:center;
          transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
          box-shadow:0 4px 0 #7BD48A;
        }
        .martial-card:hover {
          transform:translateY(-8px) rotate(1deg);
          box-shadow:0 14px 0 #7BD48A, 0 20px 40px rgba(123,212,138,0.2);
          border-color:#4CAF50;
        }

        /* ── CTA button ── */
        .enroll-btn {
          background:linear-gradient(135deg,#FF6B35,#FF9A00);
          color:#fff; font-family:inherit; font-weight:900;
          font-size:16px; padding:16px 36px; border-radius:50px;
          border:none; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:10px;
          box-shadow:0 6px 0 #C94B00, 0 12px 32px rgba(255,107,53,0.3);
          transition:all 0.2s cubic-bezier(.34,1.56,.64,1); white-space:nowrap;
        }
        .enroll-btn:hover:not(:disabled) {
          transform:scale(1.06) translateY(-3px);
          box-shadow:0 10px 0 #C94B00, 0 20px 40px rgba(255,107,53,0.4);
        }
        .enroll-btn:active:not(:disabled) {
          transform:scale(0.98) translateY(2px);
          box-shadow:0 3px 0 #C94B00;
        }
        .enroll-btn:disabled { opacity:0.7; cursor:not-allowed; }

        /* ── Form inputs ── */
        .form-input {
          width:100%; padding:14px 18px; border-radius:16px;
          border:3px solid #FFE5B4; background:#FFFEF8;
          font-family:inherit; font-size:15px; font-weight:700;
          color:#333; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .form-input:focus {
          border-color:#FF8C42; background:white;
          box-shadow:0 0 0 4px rgba(255,140,66,0.12), 0 4px 0 #FFD580;
        }
        .form-input.error { border-color:#E53E3E !important; background:#FFF5F5; }
        .form-input:disabled { opacity:0.6; cursor:not-allowed; }

        /* ── Info chip ── */
        .info-chip {
          display:inline-flex; align-items:center; gap:7px;
          background:white; border:3px solid #FFE5B4;
          border-radius:50px; padding:9px 20px;
          font-size:14px; font-weight:800; color:#333;
          box-shadow:0 3px 0 #FFD580;
        }

        /* ── Squiggle divider ── */
        .squiggle { width:100%; overflow:hidden; line-height:0; }

        /* ── Form grid ── */
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

        /* ── Cloud shapes ── */
        .cloud {
          position:absolute; background:rgba(255,255,255,0.7);
          border-radius:50px; pointer-events:none;
        }

        .hero-float { pointer-events:none; }

        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-thumb { background:#FF9A00; border-radius:4px; }

        /* TABLET ≤ 768px */
        @media (max-width: 768px) {
          .hero-float { display:none; }
          .form-grid  { grid-template-columns:1fr; gap:14px; }
        }

        /* MOBILE ≤ 640px */
        @media (max-width: 640px) {
          .form-card    { padding:24px 16px !important; border-radius:22px !important; }
          .form-card h2 { font-size:24px !important; }
          .enroll-btn   { font-size:14px !important; padding:14px 24px !important; }
          .info-chip    { font-size:12px; padding:6px 12px; }
          .activity-pill { font-size:13px; padding:10px 14px; }
          .martial-section-inner { padding:32px 22px !important; border-radius:22px !important; }
          .contact-section { padding:48px 16px !important; }
        }

        /* SMALL ≤ 400px */
        @media (max-width: 400px) {
          .info-chips-row { gap:8px !important; }
          .info-chip { font-size:11px; padding:5px 10px; }
          .enroll-btn { font-size:13px !important; padding:12px 18px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          HERO — Sky blue gradient, bright & airy
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(165deg,#87CEEB 0%,#B8E6FF 35%,#FFF8DC 70%,#FFE4B5 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px 100px",
        }}
      >
        {/* Dotty background */}
        <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,160,0,0.18) 2px,transparent 2px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />

        {/* Sun */}
        <div style={{ position:"absolute", top:-60, right:"8%", width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,#FFD700 20%,#FFB347 60%,transparent 80%)", opacity:0.85, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:20, right:"12%", fontSize:80, pointerEvents:"none", opacity:0.4 }}>☀️</div>

        {/* Clouds */}
        <div className="cloud" style={{ top:"10%",left:"3%", width:140,height:50, animation:"cloud-drift 4s ease-in-out infinite alternate" }} />
        <div className="cloud" style={{ top:"18%",left:"8%", width:90,height:36, animation:"cloud-drift 5s ease-in-out infinite alternate", animationDelay:"0.5s" }} />
        <div className="cloud" style={{ top:"8%",right:"30%", width:120,height:44, animation:"cloud-drift 6s ease-in-out infinite alternate", animationDelay:"1s" }} />

        {/* Floating emojis */}
        <div className="hero-float float-a" style={{ position:"absolute",top:"15%",left:"4%",fontSize:56 }}>🎨</div>
        <div className="hero-float float-b" style={{ position:"absolute",top:"22%",right:"5%",fontSize:48 }}>🥋</div>
        <div className="hero-float float-c" style={{ position:"absolute",bottom:"22%",left:"7%",fontSize:44 }}>🎵</div>
        <div className="hero-float float-a" style={{ position:"absolute",bottom:"28%",right:"4%",fontSize:52 }}>♟️</div>
        <div className="hero-float float-b" style={{ position:"absolute",top:"55%",left:"1%",fontSize:38 }}>🧠</div>
        <div className="hero-float float-c" style={{ position:"absolute",top:"42%",right:"2%",fontSize:40 }}>💃</div>
        <div className="hero-float float-a" style={{ position:"absolute",bottom:"10%",right:"12%",fontSize:42 }}>🎮</div>

        {/* Green grass strip at bottom */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:60, background:"linear-gradient(180deg,transparent,#7CB97E)", borderRadius:"50% 50% 0 0 / 30% 30% 0 0", pointerEvents:"none" }} />

        <div
          style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}
          className="fade-up"
        >
          {/* Badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"#FF6B35", borderRadius:50, padding:"10px 24px", marginBottom:28,
            boxShadow:"0 4px 0 #C94B00",
          }}>
            <span>☀️</span>
            <span style={{ fontWeight:900, fontSize:13, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
              Dwarka&apos;s Biggest
            </span>
          </div>

          <h1 style={{
            fontFamily:"'Fredoka One', cursive",
            fontSize:"clamp(56px,9vw,108px)",
            color:"#1A3A5C",
            lineHeight:0.9,
            marginBottom:24,
            textShadow:"4px 4px 0 rgba(0,0,0,0.07)",
          }}>
            Summer<br />
            <span style={{ color:"#FF6B35", textShadow:"3px 3px 0 #C94B00" }}>Camp</span>{" "}
            <span style={{ color:"#FFA500", textShadow:"3px 3px 0 #CC7A00" }}>2026</span>
          </h1>

          <p style={{
            fontSize:"clamp(16px,2vw,20px)",
            color:"#2C5282",
            lineHeight:1.7,
            maxWidth:560,
            margin:"0 auto 40px",
            fontWeight:700,
            background:"rgba(255,255,255,0.5)",
            padding:"16px 24px",
            borderRadius:20,
            backdropFilter:"blur(4px)",
          }}>
            A fun-filled, skill-building summer adventure for ages 5–15. Art,
            music, martial arts, brain training and so much more!
          </p>

          <div
            className="info-chips-row"
            style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginBottom:44 }}
          >
            <div className="info-chip">👶 Age: 5 – 15 Yrs</div>
            <div className="info-chip">📅 Starts 11th May</div>
            <div className="info-chip">🕗 8:00 AM – 1:00 PM</div>
            <div className="info-chip">📍 Dwarka, New Delhi</div>
          </div>

          <a href="#enroll" className="enroll-btn" style={{ fontSize:18, padding:"20px 48px" }}>
            🎉 Enrol Now — It&apos;s Free to Register!
          </a>
        </div>
      </section>

      {/* Wavy divider */}
      <div style={{ background:"#FFFEF0", marginTop:-2 }}>
        <svg viewBox="0 0 1440 60" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
          <path d="M0,60 C240,0 480,60 720,30 C960,0 1200,50 1440,20 L1440,0 L0,0 Z"
            fill="#7CB97E" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════
          ACTIVITIES — Sunny yellow background
      ══════════════════════════════════════════════════ */}
      <section style={{ padding:"72px 24px 80px", background:"linear-gradient(180deg,#FFFEF0,#FFF8DC)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"#FF9A00", borderRadius:50, padding:"8px 22px", marginBottom:16,
              boxShadow:"0 4px 0 #CC7A00",
            }}>
              <span style={{ fontWeight:900, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
                🎯 What We Offer
              </span>
            </div>
            <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(32px,4vw,52px)", color:"#1A3A5C", marginBottom:14 }}>
              15+ Exciting <span style={{ color:"#FF6B35" }}>Activities</span>
            </h2>
            <p style={{ fontSize:17, color:"#5A6A7A", fontWeight:700, maxWidth:480, margin:"0 auto" }}>
              Each program gives your child a new experience and provides a fun educational summer camp.
            </p>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            {activities.map((a, i) => (
              <div key={i} className="activity-pill">
                <span style={{ fontSize:22 }}>{a.emoji}</span>
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div style={{ background:"#F0FFF4" }}>
        <svg viewBox="0 0 1440 55" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
          <path d="M0,0 C360,55 720,0 1080,40 C1260,55 1380,20 1440,35 L1440,55 L0,55 Z"
            fill="#FFF8DC" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════
          MARTIAL ARTS — Fresh green background
      ══════════════════════════════════════════════════ */}
      <section style={{ padding:"0 24px 80px", background:"linear-gradient(180deg,#F0FFF4,#DCFFE8)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div
            className="martial-section-inner"
            style={{
              background:"linear-gradient(135deg,#2E7D32,#388E3C,#43A047)",
              borderRadius:36,
              padding:"56px 48px",
              position:"relative",
              overflow:"hidden",
              boxShadow:"0 8px 0 #1B5E20, 0 16px 48px rgba(46,125,50,0.3)",
            }}
          >
            {/* Decorative dots */}
            <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.08) 2px,transparent 2px)", backgroundSize:"28px 28px" }} />
            <div style={{ position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }} />
            <div style={{ position:"absolute",bottom:-30,left:60,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }} />

            <div style={{ textAlign:"center", marginBottom:44, position:"relative", zIndex:1 }}>
              <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(28px,3.5vw,44px)", color:"white", marginBottom:10, textShadow:"2px 2px 0 rgba(0,0,0,0.2)" }}>
                🥋 Martial Arts <span style={{ color:"#A5D6A7" }}>Programme</span>
              </div>
              <div style={{
                display:"inline-block", background:"rgba(255,255,255,0.15)",
                border:"2px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"7px 20px",
              }}>
                <p style={{ color:"rgba(255,255,255,0.9)", fontSize:15, fontWeight:800 }}>Age Group: 3 Years to 25 Years</p>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20, position:"relative", zIndex:1 }}>
              {martialArts.map((m, i) => (
                <div key={i} className="martial-card">
                  <div style={{ fontSize:48, marginBottom:14 }}>{m.emoji}</div>
                  <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:22, color:"#1A3A5C" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div style={{ background:"#FFF0F5" }}>
        <svg viewBox="0 0 1440 55" style={{ display:"block", width:"100%" }} preserveAspectRatio="none">
          <path d="M0,55 C480,0 960,55 1440,20 L1440,55 Z" fill="#DCFFE8" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════
          TUITION — Soft pink/lavender
      ══════════════════════════════════════════════════ */}
      <section style={{ padding:"72px 24px 80px", background:"linear-gradient(180deg,#FFF0F5,#F3E8FF)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(28px,3.5vw,44px)", color:"#1A3A5C", marginBottom:12 }}>
              🎓 Quality <span style={{ color:"#8B5CF6" }}>Tuition Classes</span>
            </h2>
            <p style={{ fontSize:16, color:"#5A6A7A", fontWeight:700, maxWidth:520, margin:"0 auto" }}>
              Looking for reliable quality tuition for your child? Book a FREE trial class today.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
            {tuitionClasses.map((c, i) => (
              <div key={i} style={{
                background:"white",
                borderRadius:28,
                padding:"36px 32px",
                border:`3px solid ${i === 0 ? "#FFC0CB" : "#C4B5FD"}`,
                boxShadow:`0 6px 0 ${i === 0 ? "#FFB347" : "#8B5CF6"}, 0 12px 32px rgba(0,0,0,0.06)`,
                position:"relative",
                overflow:"hidden",
                transition:"transform 0.25s cubic-bezier(.34,1.56,.64,1)",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform="translateY(-6px)")}
              onMouseLeave={e => (e.currentTarget.style.transform="translateY(0)")}
              >
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:8,
                  background:i === 0 ? "linear-gradient(90deg,#FF6B6B,#FFB347)" : "linear-gradient(90deg,#8B5CF6,#EC4899)",
                  borderRadius:"24px 24px 0 0"
                }} />
                <div style={{ fontSize:40, marginBottom:16 }}>{i === 0 ? "📐" : "📊"}</div>
                <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:24, color:"#1A3A5C", marginBottom:10 }}>{c.label}</div>
                <div style={{ fontSize:15, fontWeight:800, color: i === 0 ? "#FF6B35" : "#8B5CF6" }}>{c.subjects}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ENROLL FORM — Warm white
      ══════════════════════════════════════════════════ */}
      <section id="enroll" style={{ padding:"80px 24px 100px", background:"linear-gradient(180deg,#FFF8DC,#FFFEF0)" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:8,
              background:"#FF6B35",borderRadius:50,padding:"9px 22px",marginBottom:16,
              boxShadow:"0 4px 0 #C94B00",
            }}>
              <span style={{ fontWeight:900, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"white" }}>
                📝 Register Now
              </span>
            </div>
            <h2 style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(30px,4vw,48px)", color:"#1A3A5C", marginBottom:12 }}>
              Enrol Your Child <span style={{ color:"#FF6B35" }}>Today!</span>
            </h2>
            <p style={{ fontSize:16, color:"#5A6A7A", fontWeight:700 }}>
              Fill the form below and we&apos;ll reach out to confirm your spot.
            </p>
          </div>

          <div
            className="form-card"
            style={{
              background:"white",
              borderRadius:36,
              padding:"48px",
              boxShadow:"0 8px 0 #FFD580, 0 16px 60px rgba(255,165,0,0.12)",
              border:"3px solid #FFE5B4",
            }}
          >
            {submitted ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:80, marginBottom:20 }}>🎉</div>
                <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:32, color:"#1A3A5C", marginBottom:14 }}>
                  You&apos;re Registered!
                </div>
                <p style={{ fontSize:16, color:"#5A6A7A", lineHeight:1.7, marginBottom:28 }}>
                  Thank you!{" "}
                  <strong style={{ color:"#FF6B35" }}>{form.parentName || form.childName}</strong>
                  {" "}— we&apos;ll call <strong>{form.phone}</strong> to confirm your spot at camp. 🚀
                </p>
                <button onClick={resetForm} className="enroll-btn" style={{ fontSize:15, padding:"13px 30px" }}>
                  ✉️ Register Another Child
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {hasErrors && (
                  <div style={{
                    background:"#FFF8F0", border:"3px solid #FFD6A5",
                    borderRadius:16, padding:"14px 18px",
                    boxShadow:"0 3px 0 #FFB347",
                  }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#CC7700", marginBottom:8 }}>
                      ⚠️ Please fix the following before submitting:
                    </div>
                    <ul style={{ paddingLeft:18, margin:0 }}>
                      {(Object.values(fieldErrors).filter(Boolean) as string[]).map((msg, i) => (
                        <li key={i} style={{ fontSize:12, fontWeight:700, color:"#E53E3E", marginBottom:2 }}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="form-grid">
                  {/* Child's Name */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Child&apos;s Name *
                    </label>
                    <input
                      name="childName" value={form.childName}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Full name"
                      className={`form-input${fieldErrors.childName ? " error" : ""}`}
                      style={inputBorder("childName")} disabled={loading}
                    />
                    <FieldError field="childName" />
                  </div>

                  {/* Parent's Name */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Parent&apos;s Name
                      <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
                    </label>
                    <input
                      name="parentName" value={form.parentName}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Parent / Guardian"
                      className="form-input" disabled={loading}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Phone Number *
                      <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(10 digits)</span>
                    </label>
                    <input
                      name="phone" value={form.phone}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="9876543210"
                      className={`form-input${fieldErrors.phone ? " error" : ""}`}
                      style={inputBorder("phone")} disabled={loading}
                      inputMode="numeric" maxLength={10}
                    />
                    <FieldError field="phone" />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Email
                      <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
                    </label>
                    <input
                      name="email" value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="you@email.com"
                      className={`form-input${fieldErrors.email ? " error" : ""}`}
                      style={inputBorder("email")} disabled={loading} type="email"
                    />
                    <FieldError field="email" />
                  </div>

                  {/* Age Group */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Age Group *
                    </label>
                    <select
                      name="age" value={form.age}
                      onChange={handleChange} onBlur={handleBlur}
                      className={`form-input${fieldErrors.age ? " error" : ""}`}
                      style={{ cursor:"pointer",...inputBorder("age") }} disabled={loading}
                    >
                      <option value="">Select age group</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-8">5–8 years</option>
                      <option value="8-12">8–12 years</option>
                      <option value="12-15">12–15 years</option>
                      <option value="15-25">15–25 years (Martial Arts)</option>
                    </select>
                    <FieldError field="age" />
                  </div>

                  {/* Program */}
                  <div>
                    <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                      Interested Program *
                    </label>
                    <select
                      name="program" value={form.program}
                      onChange={handleChange} onBlur={handleBlur}
                      className={`form-input${fieldErrors.program ? " error" : ""}`}
                      style={{ cursor:"pointer",...inputBorder("program") }} disabled={loading}
                    >
                      <option value="">Select a program</option>
                      <option value="Summer Camp (General)">Summer Camp (General)</option>
                      <option value="Martial Arts / Karate">Martial Arts / Karate</option>
                      <option value="Abacus & Vedic Maths">Abacus &amp; Vedic Maths</option>
                      <option value="Tuition (9th-10th)">Tuition (9th–10th)</option>
                      <option value="Tuition (11th-12th)">Tuition (11th–12th)</option>
                      <option value="Multiple Programs">Multiple Programs</option>
                    </select>
                    <FieldError field="program" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display:"block",fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FF6B35",marginBottom:8 }}>
                    Message
                    <span style={{ fontSize:10,color:"#bbb",fontWeight:700,textTransform:"none",marginLeft:4 }}>(optional)</span>
                  </label>
                  <textarea
                    name="message" value={form.message}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="Any specific questions, preferred timings, or special requirements..."
                    className="form-input" disabled={loading}
                    style={{ height:100, resize:"vertical" }}
                  />
                </div>

                {globalError && (
                  <div style={{
                    background:"#FFF0F0", border:"3px solid #FFC0CB",
                    borderRadius:14, padding:"12px 18px",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:18 }}>⚠️</span>
                    <span style={{ fontSize:13, fontWeight:800, color:"#E53E3E" }}>{globalError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="enroll-btn"
                  disabled={loading}
                  style={{ width:"100%", justifyContent:"center", fontSize:17, padding:"18px" }}
                >
                  {loading ? (
                    <>
                      <div style={{ width:20,height:20,border:"3px solid rgba(255,255,255,0.3)",borderTop:"3px solid white",borderRadius:"50%",animation:"spin-slow 0.8s linear infinite" }} />
                      Submitting…
                    </>
                  ) : (
                    "🚀 Confirm My Enrolment"
                  )}
                </button>

                <p style={{ textAlign:"center", fontSize:12, color:"#AAA", fontWeight:700 }}>
                  We&apos;ll call you within a few hours to confirm your spot. 📞
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT — Bright coral/orange
      ══════════════════════════════════════════════════ */}
      <section
        className="contact-section"
        style={{ background:"linear-gradient(135deg,#FF6B35,#FF9A00,#FFB347)", padding:"80px 24px", position:"relative", overflow:"hidden" }}
      >
        <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.12) 2px,transparent 2px)", backgroundSize:"28px 28px" }} />
        <div style={{ position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }} />
        <div style={{ position:"absolute",bottom:-40,left:40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.08)" }} />

        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:"clamp(26px,3.5vw,40px)", color:"white", marginBottom:12, textShadow:"2px 2px 0 rgba(0,0,0,0.15)" }}>
            📍 Find Us
          </div>
          <div style={{
            fontSize:18, fontWeight:800, color:"rgba(255,255,255,0.92)", lineHeight:1.8, marginBottom:32,
            background:"rgba(255,255,255,0.15)", display:"inline-block", padding:"20px 32px", borderRadius:24,
            border:"2px solid rgba(255,255,255,0.25)", backdropFilter:"blur(4px)",
          }}>
            HEAD OFFICE — D168C, Patel Garden<br />
            Main Dwarka Road, Near Royal Garden<br />
            Dwarka Mor, New Delhi
          </div>
          <div style={{ display:"block" }} />
          <a
            href="tel:9810366417"
            style={{
              display:"inline-flex", alignItems:"center", gap:12,
              background:"white", color:"#FF6B35",
              textDecoration:"none",
              fontFamily:"'Fredoka One', cursive",
              fontSize:"clamp(22px,3vw,36px)",
              padding:"18px 44px", borderRadius:50,
              boxShadow:"0 6px 0 rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.1)",
              transition:"transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform="scale(1.06) translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform="scale(1)")}
          >
            📞 9810366417
          </a>
          <div style={{ marginTop:24, fontSize:15, color:"rgba(255,255,255,0.85)", fontWeight:800 }}>
            For Registration / Enquiry — Call or WhatsApp 💬
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{ background:"#1A3A5C", padding:"28px 24px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Fredoka One', cursive", fontSize:20, color:"white", marginBottom:8 }}>
          Ascento™ <span style={{ color:"#FFB347" }}>Activity Center</span>
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontWeight:700 }}>
          © 2025 Ascento Activity Center. All rights reserved. Made with 💛 for young learners.
        </div>
      </footer>
    </div>
  );
}