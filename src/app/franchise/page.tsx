


"use client";

// ─────────────────────────────────────────────
// /app/franchise/page.jsx  — Ascento Franchise Page
// ─────────────────────────────────────────────
import Link from "next/link";
import { useState } from "react";

const benefits = [
  { emoji: "🏆", title: "Proven Brand", desc: "15+ years of trust, 50+ centres across India. Parents already know and love Ascento.", color: "#FF6B6B" },
  { emoji: "📦", title: "Turnkey Setup", desc: "We handle everything — curriculum, training, marketing materials, software, and launch support.", color: "#4ECDC4" },
  { emoji: "💰", title: "Low Investment", desc: "One of the most affordable franchise opportunities in the education sector — high ROI, low risk.", color: "#FFB347" },
  { emoji: "👩‍🏫", title: "Complete Training", desc: "Comprehensive teacher and owner training before launch and ongoing support every step of the way.", color: "#A78BFA" },
  { emoji: "📈", title: "High Demand", desc: "Parent demand for quality brain development programmes is growing exponentially across India.", color: "#F06292" },
  { emoji: "🌐", title: "Marketing Support", desc: "We provide digital marketing, social media templates, banners, and national brand campaigns.", color: "#26C6DA" },
];

const steps = [
  { step: "01", title: "Submit Enquiry", desc: "Fill out the form below. Our franchise team will reach out within 24 hours.", emoji: "📝" },
  { step: "02", title: "Discovery Call", desc: "A 30-minute call with our franchise director to understand your city, goals, and investment capacity.", emoji: "📞" },
  { step: "03", title: "Site Visit & Demo", desc: "Visit one of our existing centres (or virtual tour), see the model in action.", emoji: "🏫" },
  { step: "04", title: "Agreement & Fee", desc: "Sign the franchise agreement and pay the one-time franchise fee. We're partners!", emoji: "🤝" },
  { step: "05", title: "Training", desc: "Attend our intensive 5-day training programme. Your teachers get certified too.", emoji: "🎓" },
  { step: "06", title: "Grand Launch! 🎉", desc: "We run a full launch campaign. Your centre opens its doors to happy families.", emoji: "🚀" },
];

const faqs = [
  { q: "What is the total investment required?", a: "The total investment typically ranges from ₹2–5 lakhs depending on city tier and centre size. This includes the franchise fee, setup, furniture, materials, and initial marketing." },
  { q: "Do I need a teaching background?", a: "Not at all! Many of our best franchise owners are entrepreneurs, homemakers, or professionals from non-teaching backgrounds. We provide complete training for you and your staff." },
  { q: "What is the expected monthly revenue?", a: "A well-run centre with 80–100 students can generate ₹1.5–3 lakhs per month in revenue. Most partners recover their investment within 12–18 months." },
  { q: "What ongoing support does Ascento provide?", a: "We provide monthly training webinars, curriculum updates, digital marketing support, teacher certification, competition participation, and a dedicated franchise support manager." },
  { q: "How many students are needed to break even?", a: "Most centres break even with just 40–50 enrolled students, which is achievable within the first 2–3 months of launch." },
  { q: "Can I open multiple centres?", a: "Yes! Many of our partners own 2–5 centres across their district or state. We offer special multi-centre packages and exclusive territory rights." },
];

export default function FranchisePage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", investment: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
const [openFaq, setOpenFaq] = useState<number | null>(null);
const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value } = e.target;
  setForm((f) => ({ ...f, [name]: value }));
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitted(true);
};

  return (
    <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5s ease-in-out infinite; }

        .benefit-card { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
        .benefit-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,.11); }

        .step-card { transition: transform .3s, box-shadow .3s; }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.1); }

        .faq-item { border: 2.5px solid #F0EEF8; border-radius: 18px; margin-bottom: 12px; overflow: hidden; transition: border-color .3s; }
        .faq-item.open { border-color: #A78BFA; }
        .faq-q { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; cursor: pointer; font-weight: 800; font-size: 15px; color: #1A1A2E; background: white; }
        .faq-a { padding: 0 24px 20px; font-size: 14px; line-height: 1.75; color: #555; background: white; }

        .form-input { width: 100%; padding: 14px 18px; border-radius: 14px; border: 2.5px solid #E8E4F8; background: white; font-family: inherit; font-size: 15px; font-weight: 700; color: #1A1A2E; outline: none; transition: border-color .2s; }
        .form-input:focus { border-color: #A78BFA; }

        .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .enrol-btn:hover { transform:scale(1.07) translateY(-2px); }

        .nav-link { font-size:15px; font-weight:800; color:#1A1A2E; text-decoration:none; transition:color .2s; }
        .nav-link:hover { color:#FF6B6B; }

        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }
      `}</style>

      {/* NAVBAR */}
      {/* <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "14px 0", background: "rgba(255,253,247,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧮</div>
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", lineHeight: 1 }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999" }}>Brain Development Academy</div>
            </div>
          </Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Programs", "/programs"], ["Why Us", "/#whyus"], ["Franchise", "/franchise"], ["Contact", "/contact"]].map(([l, h]) => (
              <Link key={l} href={h} className="nav-link">{l}</Link>
            ))}
          </div>
          <Link href="/contact" className="enrol-btn" style={{ fontSize: 14 }}>🎉 Enrol Now</Link>
        </div>
      </nav> */}

      {/* HERO */}
      <section style={{ paddingTop: 130, paddingBottom: 80, background: "linear-gradient(160deg,#1A1A2E 0%,#2D2D4E 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,179,71,.15) 1.5px,transparent 1.5px)", backgroundSize: "36px 36px" }} />
        <div style={{ position: "absolute", top: "18%", left: "6%", fontSize: 48 }} className="float-a">🏪</div>
        <div style={{ position: "absolute", top: "20%", right: "8%", fontSize: 40 }} className="float-b">🌟</div>
        <div style={{ position: "absolute", bottom: "15%", left: "10%", fontSize: 36 }} className="float-b">💰</div>
        <div style={{ position: "absolute", bottom: "20%", right: "6%", fontSize: 44 }} className="float-a">🚀</div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,179,71,.15)", borderRadius: 50, padding: "8px 20px", marginBottom: 20, border: "2px solid rgba(255,179,71,.3)" }}>
            <span>🏪</span>
            <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Franchise Opportunity</span>
          </div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(40px,5vw,72px)", color: "white", lineHeight: 1.08, marginBottom: 20 }}>
            Own an <span style={{ color: "#FFB347" }}>Ascento</span> Centre<br />in Your City! 🌟
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px", fontWeight: 700 }}>
            Join 50+ successful franchise partners across India. Low investment, full training, and a brand that parents already trust and love.
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[["💰", "₹2–5L Investment"], ["📅", "ROI in 12–18 months"], ["🌍", "50+ Active Centres"]].map(([e, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.08)", borderRadius: 50, padding: "10px 20px", border: "1.5px solid rgba(255,255,255,.12)" }}>
                <span style={{ fontSize: 20 }}>{e}</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: "white" }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <a href="#enquiry" style={{ background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 17, padding: "16px 40px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 10px 35px rgba(255,179,71,.45)" }}>
              🤝 Apply for Franchise
            </a>
          </div>
        </div>
      </section>

      {/* WHY FRANCHISE */}
      <section style={{ padding: "100px 0", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF8EE", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
              <span>✨</span>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Why Partner With Us</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,52px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 14 }}>
              Everything You Need to <span style={{ color: "#FFB347" }}>Succeed!</span> 🏆
            </h2>
            <p style={{ fontSize: 17, color: "#777", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              We've built the system. You bring the passion. Together, we change children's lives.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card" style={{ background: "white", borderRadius: 24, padding: 32, border: `3px solid ${b.color}18`, boxShadow: "0 4px 20px rgba(0,0,0,.06)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: b.color, borderRadius: "24px 24px 0 0" }} />
                <div style={{ fontSize: 48, marginBottom: 16, marginTop: 8 }}>{b.emoji}</div>
                <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 21, color: "#1A1A2E", marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 0", background: "#1A1A2E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.03) 1.5px,transparent 1.5px)", backgroundSize: "36px 36px" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(78,205,196,.15)", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
              <span>🗺️</span>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4ECDC4" }}>The Journey</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,52px)", color: "white", lineHeight: 1.1, marginBottom: 14 }}>
              From Enquiry to <span style={{ color: "#4ECDC4" }}>Grand Launch!</span> 🚀
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.5)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>6 simple steps and you're running your own successful centre.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card" style={{ background: "rgba(255,255,255,.05)", borderRadius: 22, padding: 28, border: "1.5px solid rgba(255,255,255,.08)", position: "relative" }}>
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Fredoka One',cursive", fontSize: 48, color: "rgba(255,255,255,.04)", lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4ECDC4", marginBottom: 8 }}>Step {s.step}</div>
                <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,.5)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg,#FFB347,#FFD700)", textAlign: "center" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,3.5vw,48px)", color: "#1A1A2E", marginBottom: 40 }}>Our Partners' Success Numbers 📊</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[["50+", "Active Centres"], ["₹2–3L", "Avg Monthly Revenue"], ["12–18mo", "Avg ROI Period"], ["98%", "Partner Retention"]].map(([v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.3)", borderRadius: 20, padding: "28px 16px", backdropFilter: "blur(10px)" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 36, color: "#1A1A2E", marginBottom: 6 }}>{v}</div>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,26,46,.6)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 0", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#EDE7FF", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
              <span>❓</span>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A78BFA" }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,48px)", color: "#1A1A2E" }}>
              Got Questions? <span style={{ color: "#A78BFA" }}>We've Got Answers!</span> 💬
            </h2>
          </div>

          {faqs.map((f, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span style={{ fontSize: 20, color: "#A78BFA", transition: "transform .3s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquiry" style={{ padding: "100px 0", background: "#1A1A2E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.025) 1.5px,transparent 1.5px)", backgroundSize: "36px 36px" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,179,71,.15)", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
              <span>📝</span>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Franchise Enquiry</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,48px)", color: "white", lineHeight: 1.1, marginBottom: 12 }}>
              Start Your <span style={{ color: "#FFB347" }}>Ascento</span> Journey! 🤝
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>Fill in your details and our franchise team will contact you within 24 hours.</p>
          </div>

          {submitted ? (
            <div style={{ background: "rgba(78,205,196,.15)", border: "2px solid #4ECDC4", borderRadius: 24, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "white", marginBottom: 12 }}>Enquiry Submitted!</h3>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>Thank you, <strong style={{ color: "#4ECDC4" }}>{form.name}</strong>! Our franchise team will call you within 24 hours. Get ready to change children's lives! 🚀</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,.05)", borderRadius: 28, padding: "44px", border: "1.5px solid rgba(255,255,255,.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="form-input" />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="form-input" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>City / Location *</label>
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="e.g. Pune, Maharashtra" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Investment Capacity</label>
                  <select name="investment" value={form.investment} onChange={handleChange} className="form-input" style={{ cursor: "pointer" }}>
                    <option value="">Select range</option>
                    <option value="2-3L">₹2–3 Lakhs</option>
                    <option value="3-5L">₹3–5 Lakhs</option>
                    <option value="5L+">₹5 Lakhs+</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Message / Questions (Optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about yourself, your goals, or any questions you have..." className="form-input" style={{ height: 120, resize: "vertical" }} />
              </div>
              <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 17, padding: "18px", borderRadius: 50, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 10px 35px rgba(255,179,71,.45)", transition: "transform .2s" }}>
                🤝 Submit Franchise Enquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111120", padding: "40px 0 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧮</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white" }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)", fontWeight: 700 }}>© 2024 Ascento Abacus. All rights reserved. Made with 💛 for young learners.</span>
        </div>
      </footer>
    </div>
  );
}