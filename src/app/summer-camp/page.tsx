"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function SummerCampPage() {
  const [form, setForm] = useState<FormState>({
    childName: "", parentName: "", phone: "", email: "",
    age: "", program: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.childName.trim()) return setError("Please enter your child's name.");
    if (!form.phone.trim()) return setError("Please enter a phone number.");
    if (!form.age) return setError("Please select an age group.");
    if (!form.program) return setError("Please select a program.");

    setLoading(true);
    try {
      const res = await fetch("/api/summer-camp/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5.5s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }

        .activity-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; border-radius: 16px;
          background: white; border: 2px solid #FFF0E8;
          font-weight: 800; font-size: 14px; color: #1A1A2E;
          transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
          cursor: default;
        }
        .activity-pill:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: #FF6B6B;
          box-shadow: 0 12px 32px rgba(255,107,107,0.15);
        }

        .martial-card {
          background: white; border-radius: 22px; padding: 28px 24px;
          border: 2px solid #FFF0E8; text-align: center;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .martial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(255,107,107,0.14);
          border-color: #FF6B6B;
        }

        .enroll-btn {
          background: linear-gradient(135deg,#FF6B6B,#FFB347);
          color: #fff; font-family: inherit; font-weight: 900;
          font-size: 16px; padding: 16px 36px; border-radius: 50px;
          border: none; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 28px rgba(255,107,107,0.4);
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          white-space: nowrap;
        }
        .enroll-btn:hover:not(:disabled) { transform: scale(1.07) translateY(-2px); box-shadow: 0 16px 40px rgba(255,107,107,0.5); }
        .enroll-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .form-input {
          width: 100%; padding: 14px 18px; border-radius: 14px;
          border: 2.5px solid #F0EDE8; background: #FFFDF7;
          font-family: inherit; font-size: 15px; font-weight: 700;
          color: #1A1A2E; outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #FF6B6B; background: white; }
        .form-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .info-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; border: 2px solid #FFF0E8;
          border-radius: 50px; padding: 8px 18px;
          font-size: 14px; font-weight: 800; color: #1A1A2E;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #FFB347; border-radius: 4px; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(160deg,#1A1A2E 0%,#2D1B4E 50%,#1A1A2E 100%)",
        position: "relative", overflow: "hidden", padding: "120px 24px 80px",
      }}>
        {/* dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,179,71,0.12) 1.5px,transparent 1.5px)", backgroundSize: "36px 36px" }} />

        {/* blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#FF6B6B,transparent 70%)", opacity: 0.18 }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#FFB347,transparent 70%)", opacity: 0.14 }} />

        {/* floating emojis */}
        <div style={{ position: "absolute", top: "15%", left: "5%", fontSize: 52 }} className="float-a">🎨</div>
        <div style={{ position: "absolute", top: "25%", right: "6%", fontSize: 44 }} className="float-b">🥋</div>
        <div style={{ position: "absolute", bottom: "20%", left: "8%", fontSize: 40 }} className="float-b">🎵</div>
        <div style={{ position: "absolute", bottom: "25%", right: "5%", fontSize: 48 }} className="float-a">♟️</div>
        <div style={{ position: "absolute", top: "50%", left: "2%", fontSize: 36 }} className="float-a">🧠</div>
        <div style={{ position: "absolute", top: "40%", right: "3%", fontSize: 36 }} className="float-b">💃</div>

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }} className="fade-up">
          {/* badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,107,107,0.15)", border: "1.5px solid rgba(255,107,107,0.3)", borderRadius: 50, padding: "8px 22px", marginBottom: 28 }}>
            <span>☀️</span>
            <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Dwarka's Biggest</span>
          </div>

          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(52px,8vw,100px)", color: "white", lineHeight: 0.95, marginBottom: 24 }}>
            Summer<br /><span style={{ color: "#FF6B6B" }}>Camp</span> <span style={{ color: "#FFB347" }}>2025</span>
          </h1>

          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px", fontWeight: 700 }}>
            A fun-filled, skill-building summer adventure for ages 5–15. Art, music, martial arts, brain training and so much more!
          </p>

          {/* info chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 44 }}>
            <div className="info-chip"><span>👶</span> Age: 5 – 15 Yrs</div>
            <div className="info-chip"><span>📅</span> Starts 16th May</div>
            <div className="info-chip"><span>🕗</span> 8:00 AM – 1:00 PM</div>
            <div className="info-chip"><span>📍</span> Dwarka, New Delhi</div>
          </div>

          <a href="#enroll" className="enroll-btn" style={{ fontSize: 18, padding: "18px 44px" }}>
            🎉 Enrol Now — It's Free to Register!
          </a>
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
      <section style={{ padding: "88px 24px", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", border: "2px solid #FFD6D6", borderRadius: 50, padding: "7px 20px", marginBottom: 16 }}>
              <span>🎯</span>
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>What We Offer</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(32px,4vw,52px)", color: "#1A1A2E", marginBottom: 14 }}>
              15+ Exciting <span style={{ color: "#FF6B6B" }}>Activities</span>
            </h2>
            <p style={{ fontSize: 17, color: "#777", fontWeight: 700, maxWidth: 480, margin: "0 auto" }}>
              Each program gives your child a new experience and provides a fun educational summer camp.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {activities.map((a, i) => (
              <div key={i} className="activity-pill">
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARTIAL ARTS ── */}
      <section style={{ padding: "0 24px 88px", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg,#1A1A2E,#2D2D4E)", borderRadius: 32, padding: "56px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "#FF6B6B", opacity: 0.1 }} />
            <div style={{ position: "absolute", bottom: -40, left: 80, width: 160, height: 160, borderRadius: "50%", background: "#FFB347", opacity: 0.1 }} />

            <div style={{ textAlign: "center", marginBottom: 44, position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,3.5vw,44px)", color: "white", marginBottom: 10 }}>
                🥋 Martial Arts <span style={{ color: "#FF6B6B" }}>Programme</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, fontWeight: 700 }}>Age Group: 3 Years to 25 Years</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, position: "relative", zIndex: 1 }}>
              {martialArts.map((m, i) => (
                <div key={i} className="martial-card">
                  <div style={{ fontSize: 44, marginBottom: 14 }}>{m.emoji}</div>
                  <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "#1A1A2E" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TUITION ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,3.5vw,44px)", color: "#1A1A2E", marginBottom: 12 }}>
              🎓 Quality <span style={{ color: "#FF6B6B" }}>Tuition Classes</span>
            </h2>
            <p style={{ fontSize: 16, color: "#777", fontWeight: 700, maxWidth: 520, margin: "0 auto" }}>
              Looking for reliable quality tuition for your child? Book a FREE trial class today.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {tuitionClasses.map((c, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 24, padding: "36px 32px",
                border: "2.5px solid #FFF0E8",
                boxShadow: "0 8px 32px rgba(255,107,107,0.07)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: i === 0 ? "#FF6B6B" : "#FFB347" }} />
                <div style={{ fontSize: 36, marginBottom: 16 }}>{i === 0 ? "📐" : "📊"}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", marginBottom: 10 }}>{c.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#FF6B6B" }}>{c.subjects}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENROLL FORM ── */}
      <section id="enroll" style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", border: "2px solid #FFD6D6", borderRadius: 50, padding: "7px 20px", marginBottom: 16 }}>
              <span>📝</span>
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Register Now</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(30px,4vw,48px)", color: "#1A1A2E", marginBottom: 12 }}>
              Enrol Your Child <span style={{ color: "#FF6B6B" }}>Today!</span>
            </h2>
            <p style={{ fontSize: 16, color: "#777", fontWeight: 700 }}>
              Fill the form below and we'll reach out to confirm your spot.
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 32, padding: "48px", boxShadow: "0 12px 60px rgba(255,107,107,0.10)", border: "2.5px solid #FFF0E8" }}>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "#1A1A2E", marginBottom: 14 }}>You're Registered!</div>
                <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
                  Thank you! We'll call <strong style={{ color: "#FF6B6B" }}>{form.parentName || form.childName}</strong> on{" "}
                  <strong>{form.phone}</strong> to confirm your spot at camp. 🚀
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ childName: "", parentName: "", phone: "", email: "", age: "", program: "", message: "" }); }}
                  className="enroll-btn"
                  style={{ fontSize: 15, padding: "13px 30px" }}
                >
                  ✉️ Register Another Child
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Child's Name *</label>
                    <input name="childName" value={form.childName} onChange={handleChange} placeholder="Full name" className="form-input" disabled={loading} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Parent's Name</label>
                    <input name="parentName" value={form.parentName} onChange={handleChange} placeholder="Parent / Guardian" className="form-input" disabled={loading} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98103 66417" className="form-input" disabled={loading} type="tel" required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Email</label>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="form-input" disabled={loading} type="email" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Age Group *</label>
                    <select name="age" value={form.age} onChange={handleChange} className="form-input" disabled={loading} required style={{ cursor: "pointer" }}>
                      <option value="">Select age</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-8">5–8 years</option>
                      <option value="8-12">8–12 years</option>
                      <option value="12-15">12–15 years</option>
                      <option value="15-25">15–25 years (Martial Arts)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Interested Program *</label>
                    <select name="program" value={form.program} onChange={handleChange} className="form-input" disabled={loading} required style={{ cursor: "pointer" }}>
                      <option value="">Select program</option>
                      <option value="Summer Camp (General)">Summer Camp (General)</option>
                      <option value="Martial Arts / Karate">Martial Arts / Karate</option>
                      <option value="Abacus & Vedic Maths">Abacus & Vedic Maths</option>
                      <option value="Tuition (9th-10th)">Tuition (9th–10th)</option>
                      <option value="Tuition (11th-12th)">Tuition (11th–12th)</option>
                      <option value="Multiple Programs">Multiple Programs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF6B6B", marginBottom: 8 }}>Message (Optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Any specific questions, preferred timings, or special requirements..." className="form-input" disabled={loading} style={{ height: 100, resize: "vertical" }} />
                </div>

                {error && (
                  <div style={{ background: "#FFF0F0", border: "2px solid #FFD6D6", borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#FF4444" }}>{error}</span>
                  </div>
                )}

                <button type="submit" className="enroll-btn" disabled={loading} style={{ width: "100%", justifyContent: "center", fontSize: 17, padding: "18px" }}>
                  {loading ? (
                    <>
                      <div style={{ width: 20, height: 20, border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
                      Submitting…
                    </>
                  ) : "🚀 Confirm My Enrolment"}
                </button>

                <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", fontWeight: 700 }}>
                  We'll call you within a few hours to confirm your spot. 📞
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ background: "#1A1A2E", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "#FF6B6B", opacity: 0.08 }} />

          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px,3.5vw,40px)", color: "white", marginBottom: 12 }}>
            📍 Find Us
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 32 }}>
            HEAD OFFICE — D168C, Patel Garden<br />
            Main Dwarka Road, Near Royal Garden<br />
            Dwarka Mor, New Delhi
          </div>

          <a
            href="tel:9810366417"
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
              color: "white", textDecoration: "none",
              fontFamily: "'Fredoka One', cursive", fontSize: "clamp(22px,3vw,36px)",
              padding: "18px 44px", borderRadius: 50,
              boxShadow: "0 10px 40px rgba(255,107,107,0.35)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            📞 9810366417
          </a>

          <div style={{ marginTop: 28, fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>
            For Registration / Enquiry — Call or WhatsApp
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#111120", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "white", marginBottom: 8 }}>
          Ascento™ <span style={{ color: "#FF6B6B" }}>Activity Center</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
          © 2025 Ascento Activity Center. All rights reserved. Made with 💛 for young learners.
        </div>
      </footer>
    </div>
  );
}