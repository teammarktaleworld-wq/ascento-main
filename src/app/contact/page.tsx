


// "use client";

// // ─────────────────────────────────────────────
// // /app/contact/page.jsx  — Ascento Contact Page
// // ─────────────────────────────────────────────
// import Link from "next/link";
// import { useState } from "react";

// const contactInfo = [
//   { emoji: "📍", title: "Our Location", lines: ["Dwarka, New Delhi", "India – 110 078"], color: "#FF6B6B" },
//   { emoji: "📞", title: "Call / WhatsApp", lines: ["+91 98765 43210", "Mon–Sat, 9AM–7PM"], color: "#4ECDC4" },
//   { emoji: "📧", title: "Email Us", lines: ["info@ascento.in", "We reply within 2 hours"], color: "#FFB347" },
//   { emoji: "🌐", title: "Website", lines: ["www.ascento.in", "Find us on Social Media"], color: "#A78BFA" },
// ];

// const reasons = [
//   { emoji: "🧮", title: "Enrol My Child", desc: "I want to register my child for Abacus, Vedic Maths, Brain Gym, or another programme." },
//   { emoji: "🆓", title: "Book a Free Trial", desc: "I'd like to book a free trial class before committing." },
//   { emoji: "🏪", title: "Franchise Enquiry", desc: "I'm interested in opening an Ascento centre in my city." },
//   { emoji: "❓", title: "General Question", desc: "I have a question about the programmes, timings, fees, or anything else." },
// ];

// export default function ContactPage() {
//   const [form, setForm] = useState({ name: "", phone: "", email: "", childAge: "", reason: "", message: "" });
//   const [submitted, setSubmitted] = useState(false);

// const handleChange = (
//   e: React.ChangeEvent<
//     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//   >
// ) => {
//   const { name, value } = e.target;

//   setForm((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };


// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setSubmitted(true);
// };
//   return (
//     <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
//         @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
//         .float-a { animation: float-a 4s ease-in-out infinite; }
//         .float-b { animation: float-b 5s ease-in-out infinite; }

//         .info-card { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
//         .info-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.1); }

//         .reason-pill { display:flex; align-items:center; gap:12px; padding:14px 18px; border-radius:16px; border:2.5px solid #E8E4F8; cursor:pointer; transition:all .2s; background:white; }
//         .reason-pill:hover { border-color:#FF6B6B; }
//         .reason-pill.selected { border-color:#FF6B6B; background:#FFF0F0; }

//         .form-input { width:100%; padding:14px 18px; border-radius:14px; border:2.5px solid #E8E4F8; background:white; font-family:inherit; font-size:15px; font-weight:700; color:#1A1A2E; outline:none; transition:border-color .2s; }
//         .form-input:focus { border-color:#FF6B6B; }

//         .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
//         .enrol-btn:hover { transform:scale(1.07); }

//         .nav-link { font-size:15px; font-weight:800; color:#1A1A2E; text-decoration:none; transition:color .2s; }
//         .nav-link:hover { color:#FF6B6B; }

//         ::-webkit-scrollbar { width:8px; }
//         ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }
//       `}</style>

//       {/* NAVBAR */}
//       {/* <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "14px 0", background: "rgba(255,253,247,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧮</div>
//             <div>
//               <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", lineHeight: 1 }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
//               <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999" }}>Brain Development Academy</div>
//             </div>
//           </Link>
//           <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
//             {[["Programs", "/programs"], ["Why Us", "/#whyus"], ["Franchise", "/franchise"], ["Contact", "/contact"]].map(([l, h]) => (
//               <Link key={l} href={h} className="nav-link">{l}</Link>
//             ))}
//           </div>
//           <Link href="/contact" className="enrol-btn" style={{ fontSize: 14 }}>🎉 Enrol Now</Link>
//         </div>
//       </nav> */}

//       {/* HERO */}
//       <section style={{ paddingTop: 130, paddingBottom: 72, background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />
//         <div style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }} className="float-a">👋</div>
//         <div style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }} className="float-b">💬</div>
//         <div style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }} className="float-b">📞</div>
//         <div style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }} className="float-a">❤️</div>

//         <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid #FFD6D6" }}>
//             <span>💬</span>
//             <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Get In Touch</span>
//           </div>
//           <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(40px,5vw,68px)", color: "#1A1A2E", lineHeight: 1.08, marginBottom: 18 }}>
//             We'd Love to <span style={{ color: "#FF6B6B" }}>Hear</span><br />from You! 👋
//           </h1>
//           <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
//             Whether you're enquiring about enrolment, booking a free trial, or have a question — our friendly team is here to help!
//           </p>
//         </div>
//       </section>

//       {/* CONTACT INFO CARDS */}
//       <section style={{ padding: "72px 0 0" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 72 }}>
//             {contactInfo.map((c, i) => (
//               <div key={i} className="info-card" style={{ background: "white", borderRadius: 22, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: `3px solid ${c.color}18`, textAlign: "center", position: "relative", overflow: "hidden" }}>
//                 <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c.color }} />
//                 <div style={{ fontSize: 40, marginBottom: 12, marginTop: 8 }}>{c.emoji}</div>
//                 <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 10 }}>{c.title}</div>
//                 {c.lines.map((l, li) => (
//                   <div key={li} style={{ fontSize: 14, fontWeight: li === 0 ? 800 : 600, color: li === 0 ? "#333" : "#999", lineHeight: 1.5 }}>{l}</div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* MAIN: FORM + MAP */}
//       <section style={{ padding: "0 0 100px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 40, alignItems: "start" }}>

//             {/* FORM */}
//             <div style={{ background: "white", borderRadius: 32, padding: "48px", boxShadow: "0 8px 40px rgba(0,0,0,.08)", border: "3px solid #FFF0F0" }}>
//               <div style={{ marginBottom: 32 }}>
//                 <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 8 }}>Send Us a Message 💌</h2>
//                 <p style={{ fontSize: 15, color: "#888", fontWeight: 700 }}>Fill in the form and we'll get back to you within a few hours.</p>
//               </div>

//               {submitted ? (
//                 <div style={{ background: "#FFF0F0", border: "2.5px solid #FF6B6B", borderRadius: 20, padding: 40, textAlign: "center" }}>
//                   <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
//                   <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", marginBottom: 10 }}>Message Sent!</h3>
//                   <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7 }}>
//                     Thank you, <strong style={{ color: "#FF6B6B" }}>{form.name}</strong>! Our team will contact you at <strong>{form.phone}</strong> within a few hours. We're excited to help! 🚀
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                   {/* Reason for contact */}
//                   <div style={{ marginBottom: 24 }}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>What can we help you with? *</label>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//                       {reasons.map(r => (
//                         <div
//                           key={r.title}
//                           className={`reason-pill${form.reason === r.title ? " selected" : ""}`}
//                           onClick={() => setForm(f => ({ ...f, reason: r.title }))}
//                         >
//                           <span style={{ fontSize: 22 }}>{r.emoji}</span>
//                           <div>
//                             <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1A2E" }}>{r.title}</div>
//                             <div style={{ fontSize: 11, color: "#999", lineHeight: 1.4, fontWeight: 600 }}>{r.desc}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Fields */}
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
//                     <div>
//                       <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Your Name *</label>
//                       <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className="form-input" />
//                     </div>
//                     <div>
//                       <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Phone Number *</label>
//                       <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="form-input" />
//                     </div>
//                   </div>

//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
//                     <div>
//                       <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Email Address</label>
//                       <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="form-input" />
//                     </div>
//                     <div>
//                       <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Child's Age</label>
//                       <select name="childAge" value={form.childAge} onChange={handleChange} className="form-input" style={{ cursor: "pointer" }}>
//                         <option value="">Select age group</option>
//                         <option value="4-6">4–6 years (Pre-Abacus)</option>
//                         <option value="6-8">6–8 years</option>
//                         <option value="8-12">8–12 years</option>
//                         <option value="12-17">12–17 years</option>
//                         <option value="adult">Adult / Parent</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div style={{ marginBottom: 28 }}>
//                     <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Message (Optional)</label>
//                     <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more — which centre location, timing preferences, or any questions..." className="form-input" style={{ height: 110, resize: "vertical" }} />
//                   </div>

//                   <button type="submit" className="enrol-btn" style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}>
//                     🚀 Send Message
//                   </button>
//                   <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 14, fontWeight: 700 }}>We reply within 2 hours during working hours (9AM–7PM)</p>
//                 </form>
//               )}
//             </div>

//             {/* RIGHT SIDE */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

//               {/* Quick actions */}
//               <div style={{ background: "#1A1A2E", borderRadius: 24, padding: 28, border: "1.5px solid rgba(255,255,255,.06)" }}>
//                 <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white", marginBottom: 16 }}>⚡ Quick Actions</div>
//                 {[
//                   { emoji: "📞", label: "Call Us Now", sub: "+91 98765 43210", color: "#4ECDC4" },
//                   { emoji: "💬", label: "WhatsApp Chat", sub: "Instant Response", color: "#4CAF50" },
//                   { emoji: "📍", label: "Find a Centre", sub: "50+ locations in India", color: "#FFB347" },
//                 ].map((a, i) => (
//                   <a key={i} href="#" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.06)", textDecoration: "none", marginBottom: i < 2 ? 10 : 0, transition: "background .2s" }}>
//                     <div style={{ width: 44, height: 44, borderRadius: 14, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.emoji}</div>
//                     <div>
//                       <div style={{ fontWeight: 800, fontSize: 14, color: "white" }}>{a.label}</div>
//                       <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>{a.sub}</div>
//                     </div>
//                     <span style={{ marginLeft: "auto", color: a.color, fontSize: 18 }}>→</span>
//                   </a>
//                 ))}
//               </div>

//               {/* Hours */}
//               <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: "3px solid #FFF0F0" }}>
//                 <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 16 }}>🕐 Working Hours</div>
//                 {[
//                   ["Monday – Friday", "9:00 AM – 7:00 PM"],
//                   ["Saturday", "9:00 AM – 5:00 PM"],
//                   ["Sunday", "Closed 😴"],
//                 ].map(([day, time]) => (
//                   <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0EEF8", fontSize: 14 }}>
//                     <span style={{ fontWeight: 800, color: "#1A1A2E" }}>{day}</span>
//                     <span style={{ fontWeight: 700, color: time === "Closed 😴" ? "#999" : "#FF6B6B" }}>{time}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Social */}
//               <div style={{ background: "linear-gradient(135deg,#FFF0F0,#FFF8EE)", borderRadius: 24, padding: 28, border: "3px solid #FFE0E0" }}>
//                 <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 16 }}>📱 Follow Us!</div>
//                 <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 16, fontWeight: 700 }}>Stay updated with results, activities, and programme highlights.</p>
//                 <div style={{ display: "flex", gap: 12 }}>
//                   {[["📘", "Facebook", "#4267B2"], ["📸", "Instagram", "#E1306C"], ["🎥", "YouTube", "#FF0000"]].map(([e, name, c]) => (
//                     <a key={name} href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, padding: "14px 10px", background: "white", borderRadius: 16, textDecoration: "none", border: "2px solid #F0EEF8", transition: "all .2s" }}>
//                       <span style={{ fontSize: 26 }}>{e}</span>
//                       <span style={{ fontSize: 11, fontWeight: 900, color: "#666" }}>{name}</span>
//                     </a>
//                   ))}
//                 </div>
//               </div>

//               {/* Franchise CTA */}
//               <div style={{ background: "#1A1A2E", borderRadius: 24, padding: 28, textAlign: "center" }}>
//                 <div style={{ fontSize: 36, marginBottom: 10 }}>🏪</div>
//                 <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "white", marginBottom: 8 }}>Want to Open a Centre?</div>
//                 <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 16, lineHeight: 1.6, fontWeight: 700 }}>Join our 50+ franchise partners across India!</p>
//                 <Link href="/franchise" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 50, textDecoration: "none" }}>
//                   🌟 Franchise Info →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* MAP PLACEHOLDER */}
//       <section style={{ height: 320, background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
//         <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,179,71,.08) 1.5px,transparent 1.5px)", backgroundSize: "30px 30px" }} />
//         <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
//           <div style={{ fontSize: 64, marginBottom: 12 }}>📍</div>
//           <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "white", marginBottom: 8 }}>Dwarka, New Delhi, India</div>
//           <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white", fontFamily: "inherit", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 50, textDecoration: "none", marginTop: 8 }}>
//             🗺️ Open in Google Maps
//           </a>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer style={{ background: "#111120", padding: "40px 0 24px", textAlign: "center" }}>
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

// ─────────────────────────────────────────────
// /app/contact/page.tsx  — Ascento Contact Page
// ─────────────────────────────────────────────
import Link from "next/link";
import { useState } from "react";

const contactInfo = [
  { emoji: "📍", title: "Our Location", lines: ["Dwarka, New Delhi", "India – 110 078"], color: "#FF6B6B" },
  { emoji: "📞", title: "Call / WhatsApp", lines: ["+91 98765 43210", "Mon–Sat, 9AM–7PM"], color: "#4ECDC4" },
  { emoji: "📧", title: "Email Us", lines: ["info@ascento.in", "We reply within 2 hours"], color: "#FFB347" },
  { emoji: "🌐", title: "Website", lines: ["www.ascento.in", "Find us on Social Media"], color: "#A78BFA" },
];

const reasons = [
  { emoji: "🧮", title: "Enrol My Child", desc: "I want to register my child for Abacus, Vedic Maths, Brain Gym, or another programme." },
  { emoji: "🆓", title: "Book a Free Trial", desc: "I'd like to book a free trial class before committing." },
  { emoji: "🏪", title: "Franchise Enquiry", desc: "I'm interested in opening an Ascento centre in my city." },
  { emoji: "❓", title: "General Question", desc: "I have a question about the programmes, timings, fees, or anything else." },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  childAge: string;
  reason: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", email: "", childAge: "", reason: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.reason) {
      setError("Please select what you need help with.");
      return;
    }
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5s ease-in-out infinite; }

        .info-card { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
        .info-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.1); }

        .reason-pill { display:flex; align-items:center; gap:12px; padding:14px 18px; border-radius:16px; border:2.5px solid #E8E4F8; cursor:pointer; transition:all .2s; background:white; }
        .reason-pill:hover { border-color:#FF6B6B; background:#FFFAFA; }
        .reason-pill.selected { border-color:#FF6B6B; background:#FFF0F0; }

        .form-input { width:100%; padding:14px 18px; border-radius:14px; border:2.5px solid #E8E4F8; background:white; font-family:inherit; font-size:15px; font-weight:700; color:#1A1A2E; outline:none; transition:border-color .2s; }
        .form-input:focus { border-color:#FF6B6B; }
        .form-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .enrol-btn:hover:not(:disabled) { transform:scale(1.07); }
        .enrol-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .nav-link { font-size:15px; font-weight:800; color:#1A1A2E; text-decoration:none; transition:color .2s; }
        .nav-link:hover { color:#FF6B6B; }

        .quick-action-link { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.05); border:1.5px solid rgba(255,255,255,.06); text-decoration:none; transition:background .2s; }
        .quick-action-link:hover { background: rgba(255,255,255,.1); }

        .social-link { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; padding:14px 10px; background:white; border-radius:16px; text-decoration:none; border:2px solid #F0EEF8; transition:all .2s; }
        .social-link:hover { border-color:#FF6B6B; transform: translateY(-2px); }

        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }
      `}</style>

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 72, background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#FFB347 1.5px,transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.14 }} />
        <div style={{ position: "absolute", top: "15%", left: "6%", fontSize: 48 }} className="float-a">👋</div>
        <div style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }} className="float-b">💬</div>
        <div style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }} className="float-b">📞</div>
        <div style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }} className="float-a">❤️</div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid #FFD6D6" }}>
            <span>💬</span>
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Get In Touch</span>
          </div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(40px,5vw,68px)", color: "#1A1A2E", lineHeight: 1.08, marginBottom: 18 }}>
            We'd Love to <span style={{ color: "#FF6B6B" }}>Hear</span><br />from You! 👋
          </h1>
          <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Whether you're enquiring about enrolment, booking a free trial, or have a question — our friendly team is here to help!
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section style={{ padding: "72px 0 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 72 }}>
            {contactInfo.map((c, i) => (
              <div key={i} className="info-card" style={{ background: "white", borderRadius: 22, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: `3px solid ${c.color}18`, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c.color }} />
                <div style={{ fontSize: 40, marginBottom: 12, marginTop: 8 }}>{c.emoji}</div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 10 }}>{c.title}</div>
                {c.lines.map((l, li) => (
                  <div key={li} style={{ fontSize: 14, fontWeight: li === 0 ? 800 : 600, color: li === 0 ? "#333" : "#999", lineHeight: 1.5 }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN: FORM + SIDEBAR */}
      <section style={{ padding: "0 0 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 40, alignItems: "start" }}>

            {/* FORM CARD */}
            <div style={{ background: "white", borderRadius: 32, padding: "48px", boxShadow: "0 8px 40px rgba(0,0,0,.08)", border: "3px solid #FFF0F0" }}>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 8 }}>Send Us a Message 💌</h2>
                <p style={{ fontSize: 15, color: "#888", fontWeight: 700 }}>Fill in the form and we'll get back to you within a few hours.</p>
              </div>

              {submitted ? (
                <div style={{ background: "#FFF0F0", border: "2.5px solid #FF6B6B", borderRadius: 20, padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", marginBottom: 10 }}>Message Sent!</h3>
                  <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
                    Thank you, <strong style={{ color: "#FF6B6B" }}>{form.name}</strong>! Our team will contact you at{" "}
                    <strong>{form.phone}</strong> within a few hours. We're excited to help! 🚀
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name: "", phone: "", email: "", childAge: "", reason: "", message: "" });
                      setSubmitted(false);
                    }}
                    className="enrol-btn"
                    style={{ fontSize: 14, padding: "12px 28px" }}
                  >
                    ✉️ Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>

                  {/* Reason pills */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
                      What can we help you with? *
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {reasons.map(r => (
                        <div
                          key={r.title}
                          className={`reason-pill${form.reason === r.title ? " selected" : ""}`}
                          onClick={() => !loading && setForm(f => ({ ...f, reason: r.title }))}
                        >
                          <span style={{ fontSize: 22 }}>{r.emoji}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1A2E" }}>{r.title}</div>
                            <div style={{ fontSize: 11, color: "#999", lineHeight: 1.4, fontWeight: 600 }}>{r.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Your Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        required placeholder="Full name" className="form-input" disabled={loading}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Phone Number *</label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        required placeholder="+91 98765 43210" className="form-input" disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email + Child Age */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Email Address</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="you@email.com" className="form-input" disabled={loading}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Child's Age</label>
                      <select
                        name="childAge" value={form.childAge} onChange={handleChange}
                        className="form-input" style={{ cursor: "pointer" }} disabled={loading}
                      >
                        <option value="">Select age group</option>
                        <option value="4-6">4–6 years (Pre-Abacus)</option>
                        <option value="6-8">6–8 years</option>
                        <option value="8-12">8–12 years</option>
                        <option value="12-17">12–17 years</option>
                        <option value="adult">Adult / Parent</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Message (Optional)</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell us more — which centre location, timing preferences, or any questions..."
                      className="form-input" style={{ height: 110, resize: "vertical" }} disabled={loading}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div style={{ background: "#FFF0F0", border: "2px solid #FFD6D6", borderRadius: 14, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#FF4444" }}>{error}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="enrol-btn"
                    disabled={loading}
                    style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}
                  >
                    {loading ? (
                      <>
                        <div style={{ width: 18, height: 18, border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Sending…
                      </>
                    ) : (
                      <>🚀 Send Message</>
                    )}
                  </button>

                  <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 14, fontWeight: 700 }}>
                    We reply within 2 hours during working hours (9AM–7PM)
                  </p>
                </form>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Quick Actions */}
              <div style={{ background: "#1A1A2E", borderRadius: 24, padding: 28, border: "1.5px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white", marginBottom: 16 }}>⚡ Quick Actions</div>
                {[
                  { emoji: "📞", label: "Call Us Now", sub: "+91 98765 43210", color: "#4ECDC4", href: "tel:+919876543210" },
                  { emoji: "💬", label: "WhatsApp Chat", sub: "Instant Response", color: "#4CAF50", href: "https://wa.me/919876543210" },
                  { emoji: "📍", label: "Find a Centre", sub: "50+ locations in India", color: "#FFB347", href: "#" },
                ].map((a, i) => (
                  <a key={i} href={a.href} target={a.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    className="quick-action-link"
                    style={{ marginBottom: i < 2 ? 10 : 0 }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "white" }}>{a.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>{a.sub}</div>
                    </div>
                    <span style={{ marginLeft: "auto", color: a.color, fontSize: 18 }}>→</span>
                  </a>
                ))}
              </div>

              {/* Working Hours */}
              <div style={{ background: "white", borderRadius: 24, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: "3px solid #FFF0F0" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 16 }}>🕐 Working Hours</div>
                {[
                  ["Monday – Friday", "9:00 AM – 7:00 PM", false],
                  ["Saturday", "9:00 AM – 5:00 PM", false],
                  ["Sunday", "Closed 😴", true],
                ].map(([day, time, closed], i, arr) => (
                  <div key={String(day)} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #F0EEF8" : "none", fontSize: 14 }}>
                    <span style={{ fontWeight: 800, color: "#1A1A2E" }}>{day}</span>
                    <span style={{ fontWeight: 700, color: closed ? "#999" : "#FF6B6B" }}>{time}</span>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div style={{ background: "linear-gradient(135deg,#FFF0F0,#FFF8EE)", borderRadius: 24, padding: 28, border: "3px solid #FFE0E0" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 16 }}>📱 Follow Us!</div>
                <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 16, fontWeight: 700 }}>
                  Stay updated with results, activities, and programme highlights.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { emoji: "📘", name: "Facebook", href: "https://facebook.com" },
                    { emoji: "📸", name: "Instagram", href: "https://instagram.com" },
                    { emoji: "🎥", name: "YouTube", href: "https://youtube.com" },
                  ].map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="social-link">
                      <span style={{ fontSize: 26 }}>{s.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 900, color: "#666" }}>{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Franchise CTA */}
              <div style={{ background: "#1A1A2E", borderRadius: 24, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🏪</div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "white", marginBottom: 8 }}>Want to Open a Centre?</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 16, lineHeight: 1.6, fontWeight: 700 }}>
                  Join our 50+ franchise partners across India!
                </p>
                <Link href="/franchise" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 50, textDecoration: "none" }}>
                  🌟 Franchise Info →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section
        style={{
          height: 320,
          background: "#1A1A2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle,rgba(255,179,71,.08) 1.5px,transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>📍</div>

          <div
            style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: 24,
              color: "white",
              marginBottom: 8,
            }}
          >
            Dwarka, New Delhi, India
          </div>

          {/* ✅ FIXED LINK */}
          <a
            href="https://maps.google.com/?q=Dwarka,New+Delhi,India"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
              color: "white",
              fontWeight: 900,
              fontSize: 14,
              padding: "12px 28px",
              borderRadius: 50,
              textDecoration: "none",
              marginTop: 8,
            }}
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111120", padding: "40px 0 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🧮
            </div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>
              Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span>
            </div>
          </div>

          <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>
            © 2024 Ascento Abacus. All rights reserved. Made with 💛 for young learners.
          </span>
        </div>
      </footer>

    </div>  
);
}