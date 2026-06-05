// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";

// // ─────────────────────────────────────────────
// //  Types
// // ─────────────────────────────────────────────
// interface Message {
//   role: "bot" | "user";
//   text: string;
// }

// // ─────────────────────────────────────────────
// //  Quick-reply suggestions (always visible)
// // ─────────────────────────────────────────────
// const SUGGESTIONS = [
//   { label: "🏫 Join Play School",   prompt: "I want to join the Play School. What are the details?" },
//   { label: "🎭 Extra Activities",   prompt: "What extra activities or after-school programs do you offer?" },
//   { label: "📞 Contact / Enquiry",  prompt: "How can I contact Ascento or submit an enquiry?" },
//   { label: "💰 Fees & Admission",   prompt: "What are the fees and admission process?" },
// ];

// // ─────────────────────────────────────────────
// //  System prompt injected into every Groq call
// // ─────────────────────────────────────────────
// const SYSTEM_PROMPT = `
// You are Buddy, the friendly AI assistant for Ascento Abacus & Play School — a leading Brain Development Academy based in India (Indore, MP) with 18+ years of experience and 50+ centres nationwide.

// Your personality: warm, cheerful, encouraging — like a caring teacher talking to parents and children. Use occasional emojis but keep it professional. Always be helpful and concise (2-4 sentences per answer unless more detail is needed).

// ─── PLAY SCHOOL SECTION ───
// We run a Play School for ages 2–5 years with the following programs:
// • Playgroup (2–3 yrs) – A warm introduction to learning; curiosity-based.
// • Nursery (3–4 yrs) – Colors, shapes, sounds through interactive messy play.
// • Kindergarten (4–5 yrs) – Foundational literacy, numbers & letters.
// • Day Care (All Ages) – Safe, loving environment while parents work.

// Daily Schedule:
// 09:00 AM – Morning Circle Time (songs, greetings)
// 10:30 AM – Creative Exploration (arts, crafts, sensory play)
// 12:00 PM – Lunch & Nutrition
// 01:30 PM – Nap & Wind Down (stories, rest)

// Why choose our Play School:
// ✅ 100% Safe – CCTV monitored, child-safe furniture
// ✅ Caring Staff – low student-to-teacher ratio
// ✅ Play-Way Method – learn by doing, playing, singing
// ✅ Healthy Habits – hygiene, self-feeding, good manners

// ─── EXTRA ACTIVITIES / ASCENTO PROGRAMS ───
// • Abacus Mastery (5–14 yrs) – Lightning-fast mental math
// • Brain Gym / Memory Enhancement & DMIT – Whole-brain training, all ages
// • Vedic Maths (8+ yrs) – Ancient Indian speed-math tricks
// • Pre-Abacus / Abacus (4–6 yrs) – Numbers through games and songs
// • Tuitions (5–17 yrs) – Maths & Science, Classes 1–12

// ─── ADMISSIONS & CONTACT ───
// • Admissions are OPEN. Parents should visit /contact to enquire or register.
// • Website: https://www.ascentoabacus.com
// • Contact page: /contact
// • Free trial class available – encourage parents to book one!

// ─── WHAT TO DO ───
// • If someone asks about joining Play School → give details and direct them to /contact
// • If someone asks about programs/activities → explain the relevant program and suggest a free trial
// • If someone wants fees → say fees vary by program/age group and direct them to /contact for exact pricing
// • If someone asks location → mention Indore, MP headquarters and 50+ centres; tell them to visit /contact

// Never make up specific fee amounts. Always be encouraging and invite them to reach out via the contact page.
// `.trim();

// // ─────────────────────────────────────────────
// //  Greeting
// // ─────────────────────────────────────────────
// const GREETING =
//   "Hi there! 👋 I'm Buddy, your friendly guide at Ascento Abacus & Play School!\n\nHow can I help you today? Whether it's about our Play School, fun activity programs, or admissions — I'm here for you! 🌟";

// // ─────────────────────────────────────────────
// //  Component
// // ─────────────────────────────────────────────
// export default function AscentoChatbot() {
//   const [open, setOpen]               = useState(false);
//   const [visible, setVisible]         = useState(false);
//   const [messages, setMessages]       = useState<Message[]>([]);
//   const [input, setInput]             = useState("");
//   const [isTyping, setIsTyping]       = useState(false);
//   const [greetingDone, setGreetingDone] = useState(false);
//   const [typedGreeting, setTypedGreeting] = useState("");
//   const [showBadge, setShowBadge]     = useState(true);
//   const [fabPulse, setFabPulse]       = useState(true);

//   const bodyRef  = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Typewriter greeting on first open
//   useEffect(() => {
//     if (!open || greetingDone) return;
//     let i = 0;
//     const t = setInterval(() => {
//       if (i <= GREETING.length) {
//         setTypedGreeting(GREETING.slice(0, i));
//         i++;
//       } else {
//         clearInterval(t);
//         setGreetingDone(true);
//         setMessages([{ role: "bot", text: GREETING }]);
//       }
//     }, 20);
//     return () => clearInterval(t);
//   }, [open, greetingDone]);

//   // Slide-in animation
//   useEffect(() => {
//     if (open) {
//       requestAnimationFrame(() => setVisible(true));
//       setTimeout(() => inputRef.current?.focus(), 400);
//       setShowBadge(false);
//       setFabPulse(false);
//     } else {
//       setVisible(false);
//     }
//   }, [open]);

//   // Auto-scroll
//   useEffect(() => {
//     bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
//   }, [messages, typedGreeting]);

//   const send = async (text: string) => {
//     const val = text.trim();
//     if (!val || isTyping) return;

//     setMessages((prev) => [...prev, { role: "user", text: val }]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       const history = messages.map((m) => ({
//         role: m.role === "bot" ? "assistant" : ("user" as const),
//         content: m.text,
//       }));
//       history.push({ role: "user", content: val });

//       // ── Internal API route (keeps GROQ_API_KEY server-side) ──────────
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: history }),
//       });

//       const data = await res.json();
//       const reply =
//         data?.reply ||
//         "I'm having a little trouble right now. Please try again or visit our contact page! 😊";

//       setMessages((prev) => [...prev, { role: "bot", text: reply }]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           text: "Oops! Seems like there's a connection hiccup. Please visit our Contact page or try again shortly! 🙏",
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") send(input);
//   };

//   // ─────────────────────────────────────────────
//   //  Render
//   // ─────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

//         /* ── FAB pulse ── */
//         @keyframes ascFabPulse {
//           0%   { box-shadow: 0 0 0 0   rgba(255,107,107,.55); }
//           70%  { box-shadow: 0 0 0 20px rgba(255,107,107,0);  }
//           100% { box-shadow: 0 0 0 0   rgba(255,107,107,0);   }
//         }
//         @keyframes ascFabWiggle {
//           0%,100% { transform:rotate(-8deg) scale(1); }
//           50%     { transform:rotate(8deg)  scale(1.08); }
//         }
//         .asc-fab {
//           transition: transform .25s cubic-bezier(.34,1.56,.64,1);
//         }
//         .asc-fab.pulse { animation: ascFabPulse 2s infinite; }
//         .asc-fab:hover { transform: scale(1.12) rotate(-4deg) !important; }

//         /* ── Chat window slide-in ── */
//         .asc-win {
//           opacity: 0;
//           transform: translateY(20px) scale(0.96);
//           transition: opacity .32s ease, transform .32s cubic-bezier(.34,1.56,.64,1);
//           pointer-events: none;
//         }
//         .asc-win.open {
//           opacity: 1;
//           transform: translateY(0) scale(1);
//           pointer-events: all;
//         }

//         /* ── Message slide in ── */
//         @keyframes msgIn {
//           from { opacity:0; transform:translateY(10px) scale(.97); }
//           to   { opacity:1; transform:translateY(0)    scale(1);   }
//         }
//         .asc-msg { animation: msgIn .28s cubic-bezier(.34,1.56,.64,1) forwards; }

//         /* ── Scrollbar ── */
//         .asc-body::-webkit-scrollbar      { width: 4px; }
//         .asc-body::-webkit-scrollbar-track { background: transparent; }
//         .asc-body::-webkit-scrollbar-thumb { background: #FFB34760; border-radius: 4px; }

//         /* ── Typing dots ── */
//         @keyframes ascDot {
//           0%,80%,100% { transform:translateY(0); }
//           40%          { transform:translateY(-6px); }
//         }
//         .asc-dot { width:7px; height:7px; border-radius:50%; background:#FF6B6B; animation:ascDot 1.1s infinite; }
//         .asc-dot:nth-child(2) { animation-delay:.18s; background:#FFB347; }
//         .asc-dot:nth-child(3) { animation-delay:.36s; background:#4ECDC4; }

//         /* ── Suggestion chips ── */
//         .asc-chip {
//           border: 2px solid #FFB34766;
//           background: #FFF8EE;
//           color: #1A1A2E;
//           padding: 6px 13px;
//           border-radius: 50px;
//           cursor: pointer;
//           font-family: 'Nunito', sans-serif;
//           font-size: 12px;
//           font-weight: 800;
//           white-space: nowrap;
//           transition: all .2s cubic-bezier(.34,1.56,.64,1);
//         }
//         .asc-chip:hover {
//           background: #FF6B6B;
//           border-color: #FF6B6B;
//           color: white;
//           transform: translateY(-2px) scale(1.04);
//           box-shadow: 0 6px 16px rgba(255,107,107,.3);
//         }

//         /* ── Send button ── */
//         .asc-send {
//           background: linear-gradient(135deg,#FF6B6B,#FFB347);
//           border: none;
//           padding: 0 18px;
//           cursor: pointer;
//           color: white;
//           font-size: 18px;
//           display: flex; align-items: center; justify-content: center;
//           transition: opacity .2s, transform .2s;
//           flex-shrink: 0;
//         }
//         .asc-send:hover { opacity:.85; transform:scale(1.08); }

//         /* ── Close btn ── */
//         .asc-close {
//           background: none; border: none; cursor: pointer;
//           font-size: 22px; line-height: 1;
//           color: rgba(255,255,255,.6);
//           transition: color .2s, transform .2s;
//           margin-left: auto;
//         }
//         .asc-close:hover { color: white; transform: rotate(90deg); }

//         /* ── Badge ── */
//         @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
//         .asc-badge {
//           position:absolute; top:-2px; right:-2px;
//           width:20px; height:20px; border-radius:50%;
//           background:#FF6B6B; border:3px solid #FFFDF7;
//           display:flex; align-items:center; justify-content:center;
//           font-size:9px; font-weight:900; color:white;
//           animation: badgePop .3s cubic-bezier(.34,1.56,.64,1);
//         }
//       `}</style>

//       <div
//         style={{
//           position: "fixed",
//           bottom: 28,
//           right: 28,
//           zIndex: 9999,
//           fontFamily: "'Nunito', sans-serif",
//         }}
//       >
//         {/* ── CHAT WINDOW ── */}
//         <div
//           className={`asc-win ${visible ? "open" : ""}`}
//           style={{
//             position: "absolute",
//             bottom: 88,
//             right: 0,
//             width: 348,
//             height: 520,
//             background: "#FFFDF7",
//             borderRadius: 24,
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//             boxShadow: "0 32px 64px rgba(0,0,0,.18), 0 0 0 2px rgba(255,107,107,.12)",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               background: "linear-gradient(135deg,#FF6B6B,#FF8C42)",
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               flexShrink: 0,
//             }}
//           >
//             {/* Mascot icon */}
//             <div
//               style={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: "50%",
//                 background: "white",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 22,
//                 flexShrink: 0,
//                 boxShadow: "0 4px 12px rgba(0,0,0,.15)",
//                 border: "3px solid rgba(255,255,255,.4)",
//               }}
//             >
//               🧸
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Fredoka One', cursive",
//                   fontSize: 16,
//                   color: "white",
//                   lineHeight: 1.2,
//                 }}
//               >
//                 Buddy
//               </div>
//               <div
//                 style={{
//                   fontSize: 11,
//                   color: "rgba(255,255,255,.85)",
//                   fontWeight: 700,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 <span
//                   style={{
//                     width: 6,
//                     height: 6,
//                     borderRadius: "50%",
//                     background: "#A8FF78",
//                     display: "inline-block",
//                   }}
//                 />
//                 Ascento Guide · Online
//               </div>
//             </div>
//             <button className="asc-close" onClick={() => setOpen(false)} aria-label="Close">
//               ×
//             </button>
//           </div>

//           {/* Sub-header strip */}
//           <div
//             style={{
//               background: "#FFF0E8",
//               borderBottom: "1.5px solid #FFD6B3",
//               padding: "6px 14px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexShrink: 0,
//             }}
//           >
//             <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", letterSpacing: "0.05em" }}>
//               🎓 Play School &amp; Activity Programs
//             </span>
//             <Link
//               href="/contact"
//               style={{
//                 fontSize: 10,
//                 fontWeight: 900,
//                 color: "#FF6B6B",
//                 textDecoration: "none",
//                 border: "1.5px solid #FF6B6B",
//                 borderRadius: 50,
//                 padding: "2px 10px",
//                 transition: "all .2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#FF6B6B";
//                 e.currentTarget.style.color = "white";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "transparent";
//                 e.currentTarget.style.color = "#FF6B6B";
//               }}
//             >
//               Enquire Now →
//             </Link>
//           </div>

//           {/* Body / messages */}
//           <div
//             ref={bodyRef}
//             className="asc-body"
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               padding: "14px 12px",
//               display: "flex",
//               flexDirection: "column",
//               gap: 8,
//               background: "#FFFDF7",
//             }}
//           >
//             {/* Typewriter greeting */}
//             {!greetingDone ? (
//               <div
//                 className="asc-msg"
//                 style={{
//                   background: "white",
//                   border: "2px solid #FFE0CC",
//                   borderRadius: "16px 16px 16px 4px",
//                   padding: "10px 14px",
//                   fontSize: 13,
//                   lineHeight: 1.65,
//                   whiteSpace: "pre-line",
//                   color: "#1A1A2E",
//                   maxWidth: "88%",
//                   boxShadow: "0 2px 10px rgba(255,107,107,.08)",
//                 }}
//               >
//                 {typedGreeting}
//                 <span
//                   style={{
//                     display: "inline-block",
//                     width: 2,
//                     height: 13,
//                     background: "#FF6B6B",
//                     marginLeft: 2,
//                     verticalAlign: "middle",
//                   }}
//                 />
//               </div>
//             ) : (
//               messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className="asc-msg"
//                   style={{
//                     background:
//                       m.role === "bot"
//                         ? "white"
//                         : "linear-gradient(135deg,#FF6B6B,#FFB347)",
//                     border: m.role === "bot" ? "2px solid #FFE0CC" : "none",
//                     borderRadius:
//                       m.role === "bot"
//                         ? "16px 16px 16px 4px"
//                         : "16px 16px 4px 16px",
//                     padding: "10px 14px",
//                     fontSize: 13,
//                     lineHeight: 1.65,
//                     whiteSpace: "pre-line",
//                     color: m.role === "bot" ? "#1A1A2E" : "white",
//                     maxWidth: "88%",
//                     alignSelf: m.role === "user" ? "flex-end" : "flex-start",
//                     boxShadow:
//                       m.role === "bot"
//                         ? "0 2px 10px rgba(255,107,107,.08)"
//                         : "0 4px 16px rgba(255,107,107,.35)",
//                     fontWeight: m.role === "user" ? 700 : 600,
//                   }}
//                 >
//                   {m.text}
//                 </div>
//               ))
//             )}

//             {/* Typing indicator */}
//             {isTyping && (
//               <div
//                 className="asc-msg"
//                 style={{
//                   background: "white",
//                   border: "2px solid #FFE0CC",
//                   borderRadius: "16px 16px 16px 4px",
//                   padding: "12px 16px",
//                   alignSelf: "flex-start",
//                   display: "flex",
//                   gap: 5,
//                 }}
//               >
//                 <div className="asc-dot" />
//                 <div className="asc-dot" />
//                 <div className="asc-dot" />
//               </div>
//             )}
//           </div>

//           {/* Quick-reply suggestions */}
//           <div
//             style={{
//               padding: "8px 10px",
//               display: "flex",
//               gap: 6,
//               flexWrap: "wrap",
//               borderTop: "1.5px solid #FFE8D6",
//               background: "#FFFDF7",
//               flexShrink: 0,
//             }}
//           >
//             {SUGGESTIONS.map((s) => (
//               <button
//                 key={s.label}
//                 className="asc-chip"
//                 onClick={() => send(s.prompt)}
//               >
//                 {s.label}
//               </button>
//             ))}
//           </div>

//           {/* Input bar */}
//           <div
//             style={{
//               display: "flex",
//               borderTop: "1.5px solid #FFE8D6",
//               flexShrink: 0,
//               background: "white",
//             }}
//           >
//             <input
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask anything about Ascento…"
//               style={{
//                 flex: 1,
//                 padding: "12px 14px",
//                 border: "none",
//                 outline: "none",
//                 fontSize: 13,
//                 fontFamily: "'Nunito', sans-serif",
//                 fontWeight: 600,
//                 color: "#1A1A2E",
//                 background: "transparent",
//               }}
//             />
//             <button className="asc-send" onClick={() => send(input)}>
//               ➤
//             </button>
//           </div>
//         </div>

//         {/* ── FAB ── */}
//         <button
//           className={`asc-fab ${fabPulse ? "pulse" : ""}`}
//           onClick={() => setOpen((p) => !p)}
//           aria-label="Chat with Buddy"
//           style={{
//             position: "relative",
//             width: 68,
//             height: 68,
//             borderRadius: "50%",
//             background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
//             border: "none",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 8px 24px rgba(255,107,107,.45)",
//           }}
//         >
//           {open ? (
//             <span style={{ fontSize: 26, color: "white" }}>✕</span>
//           ) : (
//             <>
//               {/* Custom brain+star mascot icon */}
//               <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
//                 {/* Head */}
//                 <ellipse cx="18" cy="20" rx="12" ry="11" fill="white" />
//                 {/* Eyes */}
//                 <circle cx="14" cy="20" r="2.2" fill="#FF6B6B" />
//                 <circle cx="22" cy="20" r="2.2" fill="#FF6B6B" />
//                 {/* Pupils */}
//                 <circle cx="14.6" cy="20.6" r="1" fill="white" />
//                 <circle cx="22.6" cy="20.6" r="1" fill="white" />
//                 {/* Smile */}
//                 <path d="M14 25 Q18 28.5 22 25" stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
//                 {/* Mortarboard cap */}
//                 <ellipse cx="18" cy="10" rx="9.5" ry="2.5" fill="white" />
//                 <rect x="14" y="7" width="8" height="5" rx="1" fill="white" />
//                 {/* Star */}
//                 <path d="M29 5 L30.1 8 L33.4 8 L30.8 10 L31.8 13.2 L29 11.4 L26.2 13.2 L27.2 10 L24.6 8 L27.9 8 Z" fill="#FFD700" />
//               </svg>
//               {!open && showBadge && <div className="asc-badge">1</div>}
//             </>
//           )}
//         </button>
//       </div>
//     </>
//   );
// }










"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface Message {
  role: "bot" | "user";
  text: string;
}

// ─────────────────────────────────────────────
//  Quick-reply suggestions (always visible)
// ─────────────────────────────────────────────
const SUGGESTIONS = [
  { label: "🏫 Join Play School",   prompt: "I want to join the Play School. What are the details?" },
  { label: "🎭 Extra Activities",   prompt: "What extra activities or after-school programs do you offer?" },
  { label: "📞 Contact / Enquiry",  prompt: "How can I contact Ascento or submit an enquiry?" },
  { label: "💰 Fees & Admission",   prompt: "What are the fees and admission process?" },
];

// ─────────────────────────────────────────────
//  Greeting
// ─────────────────────────────────────────────
const GREETING =
  "Hi there! 👋 I'm Buddy, your friendly guide at Ascento Abacus & Play School!\n\nHow can I help you today? Whether it's about our Play School, fun activity programs, or admissions — I'm here for you! 🌟";

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
export default function AscentoChatbot() {
  const [open, setOpen]               = useState(false);
  const [visible, setVisible]         = useState(false);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [typedGreeting, setTypedGreeting] = useState("");
  const [showBadge, setShowBadge]     = useState(true);
  const [fabPulse, setFabPulse]       = useState(true);

  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter greeting on first open
  useEffect(() => {
    if (!open || greetingDone) return;
    let i = 0;
    const t = setInterval(() => {
      if (i <= GREETING.length) {
        setTypedGreeting(GREETING.slice(0, i));
        i++;
      } else {
        clearInterval(t);
        setGreetingDone(true);
        setMessages([{ role: "bot", text: GREETING }]);
      }
    }, 20);
    return () => clearInterval(t);
  }, [open, greetingDone]);

  // Slide-in animation
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      setTimeout(() => inputRef.current?.focus(), 400);
      setShowBadge(false);
      setFabPulse(false);
    } else {
      setVisible(false);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typedGreeting]);

  const send = async (text: string) => {
    const val = text.trim();
    if (!val || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: val }]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "bot" ? "assistant" : ("user" as const),
        content: m.text,
      }));
      history.push({ role: "user", content: val });

      // ── Internal API route (keeps GROQ_API_KEY server-side) ──────────
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply =
        data?.reply ||
        "I'm having a little trouble right now. Please try again or visit our contact page! 😊";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Oops! Seems like there's a connection hiccup. Please visit our Contact page or try again shortly! 🙏",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") send(input);
  };

  // ─────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

        /* ── FAB pulse ── */
        @keyframes ascFabPulse {
          0%   { box-shadow: 0 0 0 0   rgba(255,107,107,.55); }
          70%  { box-shadow: 0 0 0 20px rgba(255,107,107,0);  }
          100% { box-shadow: 0 0 0 0   rgba(255,107,107,0);   }
        }
        @keyframes ascFabWiggle {
          0%,100% { transform:rotate(-8deg) scale(1); }
          50%     { transform:rotate(8deg)  scale(1.08); }
        }
        .asc-fab {
          transition: transform .25s cubic-bezier(.34,1.56,.64,1);
        }
        .asc-fab.pulse { animation: ascFabPulse 2s infinite; }
        .asc-fab:hover { transform: scale(1.12) rotate(-4deg) !important; }

        /* ── Chat window slide-in ── */
        .asc-win {
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          transition: opacity .32s ease, transform .32s cubic-bezier(.34,1.56,.64,1);
          pointer-events: none;
        }
        .asc-win.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        /* ── Message slide in ── */
        @keyframes msgIn {
          from { opacity:0; transform:translateY(10px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        .asc-msg { animation: msgIn .28s cubic-bezier(.34,1.56,.64,1) forwards; }

        /* ── Scrollbar ── */
        .asc-body::-webkit-scrollbar      { width: 4px; }
        .asc-body::-webkit-scrollbar-track { background: transparent; }
        .asc-body::-webkit-scrollbar-thumb { background: #FFB34760; border-radius: 4px; }

        /* ── Typing dots ── */
        @keyframes ascDot {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-6px); }
        }
        .asc-dot { width:7px; height:7px; border-radius:50%; background:#FF6B6B; animation:ascDot 1.1s infinite; }
        .asc-dot:nth-child(2) { animation-delay:.18s; background:#FFB347; }
        .asc-dot:nth-child(3) { animation-delay:.36s; background:#4ECDC4; }

        /* ── Suggestion chips ── */
        .asc-chip {
          border: 2px solid #FFB34766;
          background: #FFF8EE;
          color: #1A1A2E;
          padding: 6px 13px;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          transition: all .2s cubic-bezier(.34,1.56,.64,1);
        }
        .asc-chip:hover {
          background: #FF6B6B;
          border-color: #FF6B6B;
          color: white;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 16px rgba(255,107,107,.3);
        }

        /* ── Send button ── */
        .asc-send {
          background: linear-gradient(135deg,#FF6B6B,#FFB347);
          border: none;
          padding: 0 18px;
          cursor: pointer;
          color: white;
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: opacity .2s, transform .2s;
          flex-shrink: 0;
        }
        .asc-send:hover { opacity:.85; transform:scale(1.08); }

        /* ── Close btn ── */
        .asc-close {
          background: none; border: none; cursor: pointer;
          font-size: 22px; line-height: 1;
          color: rgba(255,255,255,.6);
          transition: color .2s, transform .2s;
          margin-left: auto;
        }
        .asc-close:hover { color: white; transform: rotate(90deg); }

        /* ── Badge ── */
        @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
        .asc-badge {
          position:absolute; top:-2px; right:-2px;
          width:20px; height:20px; border-radius:50%;
          background:#FF6B6B; border:3px solid #FFFDF7;
          display:flex; align-items:center; justify-content:center;
          font-size:9px; font-weight:900; color:white;
          animation: badgePop .3s cubic-bezier(.34,1.56,.64,1);
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* ── CHAT WINDOW ── */}
        <div
          className={`asc-win ${visible ? "open" : ""}`}
          style={{
            position: "absolute",
            bottom: 88,
            right: 0,
            width: 348,
            height: 520,
            background: "#FFFDF7",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 32px 64px rgba(0,0,0,.18), 0 0 0 2px rgba(255,107,107,.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg,#FF6B6B,#FF8C42)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            {/* Mascot icon */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,.15)",
                border: "3px solid rgba(255,255,255,.4)",
              }}
            >
              🧸
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 16,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                Buddy
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.85)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#A8FF78",
                    display: "inline-block",
                  }}
                />
                Ascento Guide · Online
              </div>
            </div>
            <button className="asc-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          {/* Sub-header strip */}
          <div
            style={{
              background: "#FFF0E8",
              borderBottom: "1.5px solid #FFD6B3",
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B", letterSpacing: "0.05em" }}>
              🎓 Play School &amp; Activity Programs
            </span>
            <Link
              href="/contact"
              style={{
                fontSize: 10,
                fontWeight: 900,
                color: "#FF6B6B",
                textDecoration: "none",
                border: "1.5px solid #FF6B6B",
                borderRadius: 50,
                padding: "2px 10px",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FF6B6B";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FF6B6B";
              }}
            >
              Enquire Now →
            </Link>
          </div>

          {/* Body / messages */}
          <div
            ref={bodyRef}
            className="asc-body"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "#FFFDF7",
            }}
          >
            {/* Typewriter greeting */}
            {!greetingDone ? (
              <div
                className="asc-msg"
                style={{
                  background: "white",
                  border: "2px solid #FFE0CC",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.65,
                  whiteSpace: "pre-line",
                  color: "#1A1A2E",
                  maxWidth: "88%",
                  boxShadow: "0 2px 10px rgba(255,107,107,.08)",
                }}
              >
                {typedGreeting}
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 13,
                    background: "#FF6B6B",
                    marginLeft: 2,
                    verticalAlign: "middle",
                  }}
                />
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className="asc-msg"
                  style={{
                    background:
                      m.role === "bot"
                        ? "white"
                        : "linear-gradient(135deg,#FF6B6B,#FFB347)",
                    border: m.role === "bot" ? "2px solid #FFE0CC" : "none",
                    borderRadius:
                      m.role === "bot"
                        ? "16px 16px 16px 4px"
                        : "16px 16px 4px 16px",
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.65,
                    whiteSpace: "pre-line",
                    color: m.role === "bot" ? "#1A1A2E" : "white",
                    maxWidth: "88%",
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    boxShadow:
                      m.role === "bot"
                        ? "0 2px 10px rgba(255,107,107,.08)"
                        : "0 4px 16px rgba(255,107,107,.35)",
                    fontWeight: m.role === "user" ? 700 : 600,
                  }}
                >
                  {m.text}
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div
                className="asc-msg"
                style={{
                  background: "white",
                  border: "2px solid #FFE0CC",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "12px 16px",
                  alignSelf: "flex-start",
                  display: "flex",
                  gap: 5,
                }}
              >
                <div className="asc-dot" />
                <div className="asc-dot" />
                <div className="asc-dot" />
              </div>
            )}
          </div>

          {/* Quick-reply suggestions */}
          <div
            style={{
              padding: "8px 10px",
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              borderTop: "1.5px solid #FFE8D6",
              background: "#FFFDF7",
              flexShrink: 0,
            }}
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                className="asc-chip"
                onClick={() => send(s.prompt)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div
            style={{
              display: "flex",
              borderTop: "1.5px solid #FFE8D6",
              flexShrink: 0,
              background: "white",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about Ascento…"
              style={{
                flex: 1,
                padding: "12px 14px",
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                color: "#1A1A2E",
                background: "transparent",
              }}
            />
            <button className="asc-send" onClick={() => send(input)}>
              ➤
            </button>
          </div>
        </div>

        {/* ── FAB ── */}
        <button
          className={`asc-fab ${fabPulse ? "pulse" : ""}`}
          onClick={() => setOpen((p) => !p)}
          aria-label="Chat with Buddy"
          style={{
            position: "relative",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,107,107,.45)",
          }}
        >
          {open ? (
            <span style={{ fontSize: 26, color: "white" }}>✕</span>
          ) : (
            <>
              {/* Custom brain+star mascot icon */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {/* Head */}
                <ellipse cx="18" cy="20" rx="12" ry="11" fill="white" />
                {/* Eyes */}
                <circle cx="14" cy="20" r="2.2" fill="#FF6B6B" />
                <circle cx="22" cy="20" r="2.2" fill="#FF6B6B" />
                {/* Pupils */}
                <circle cx="14.6" cy="20.6" r="1" fill="white" />
                <circle cx="22.6" cy="20.6" r="1" fill="white" />
                {/* Smile */}
                <path d="M14 25 Q18 28.5 22 25" stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                {/* Mortarboard cap */}
                <ellipse cx="18" cy="10" rx="9.5" ry="2.5" fill="white" />
                <rect x="14" y="7" width="8" height="5" rx="1" fill="white" />
                {/* Star */}
                <path d="M29 5 L30.1 8 L33.4 8 L30.8 10 L31.8 13.2 L29 11.4 L26.2 13.2 L27.2 10 L24.6 8 L27.9 8 Z" fill="#FFD700" />
              </svg>
              {!open && showBadge && <div className="asc-badge">1</div>}
            </>
          )}
        </button>
      </div>
    </>
  );
}