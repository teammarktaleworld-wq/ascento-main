


"use client";

import Link from "next/link";
import { useState } from "react";

const contactInfo = [
  { emoji: "📍", title: "Our Location", lines: ["Dwarka, New Delhi", "India – 110 078"], color: "#FF6B6B" },
  { emoji: "📞", title: "Call / WhatsApp", lines: ["+91 9810366417", "Mon–Sat, 9AM–7PM"], color: "#4ECDC4" },
  { emoji: "📧", title: "Email Us", lines: ["Ascentoabacus35@gmail.com", "We reply within 2 hours"], color: "#FFB347" },
  { emoji: "🌐", title: "Website", lines: ["https://ascentoabacus.com/", "Find us on Social Media"], color: "#A78BFA" },
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

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", email: "", childAge: "", reason: "", message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Validators ──────────────────────────────────────────────────
  const validators: Record<keyof FormState, (v: string) => string> = {
    reason: (v) => v.trim() ? "" : "Please select what you need help with.",
    name: (v) => v.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters).",
    phone: (v) => /^\d{10}$/.test(v.replace(/\D/g, "")) ? "" : "Please enter a valid 10-digit mobile number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address (e.g. you@example.com).",
    childAge: (v) => v.trim() ? "" : "Please select a child age group.",
    message: (v) => v.trim().length >= 10 ? "" : "Please enter a message (at least 10 characters).",
  };

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

  // ── Build WhatsApp message ──────────────────────────────────────
  const buildWhatsAppUrl = (f: FormState): string => {
    const text = [
      `🌟 *New Enquiry – Ascento Abacus*`,
      ``,
      `👤 *Name:* ${f.name}`,
      `📞 *Phone:* ${f.phone}`,
      `📧 *Email:* ${f.email}`,
      `👶 *Child Age:* ${f.childAge || "Not specified"}`,
      `📋 *Reason:* ${f.reason}`,
      `💬 *Message:* ${f.message}`,
    ].join("\n");
    return `https://wa.me/919810366417?text=${encodeURIComponent(text)}`;
  };

  // ── Handlers ────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    const processed = key === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [key]: processed }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    const msg = validateField(key, value);
    setFieldErrors((prev) => ({ ...prev, [key]: msg }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!validateAll()) return;

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

      // ✅ Redirect to WhatsApp with form data after successful submission
      const waUrl = buildWhatsAppUrl(form);
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────
  const inputStyle = (field: keyof FormState): React.CSSProperties => ({
    borderColor: fieldErrors[field] ? "#FF4444" : undefined,
  });

  const FieldError = ({ field }: { field: keyof FormState }) =>
    fieldErrors[field] ? (
      <div style={{ fontSize: 11, fontWeight: 800, color: "#FF4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
        <span>⚠️</span> {fieldErrors[field]}
      </div>
    ) : null;

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
        .reason-pill.error { border-color:#FF4444; }

        .form-input { width:100%; padding:14px 18px; border-radius:14px; border:2.5px solid #E8E4F8; background:white; font-family:inherit; font-size:15px; font-weight:700; color:#1A1A2E; outline:none; transition:border-color .2s; }
        .form-input:focus { border-color:#FF6B6B; }
        .form-input.error { border-color:#FF4444 !important; }
        .form-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:14px 32px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .enrol-btn:hover:not(:disabled) { transform:scale(1.07); }
        .enrol-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

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
              <div
                key={i}
                className="info-card"
                style={{ background: "white", borderRadius: 22, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: `3px solid ${c.color}18`, textAlign: "center", position: "relative", overflow: "hidden" }}
              >
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
                <p style={{ fontSize: 15, color: "#888", fontWeight: 700 }}>All fields marked * are required.</p>
              </div>

              {submitted ? (
                <div style={{ background: "#FFF0F0", border: "2.5px solid #FF6B6B", borderRadius: 20, padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", marginBottom: 10 }}>Message Sent!</h3>
                  <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 8 }}>
                    Thank you, <strong style={{ color: "#FF6B6B" }}>{form.name}</strong>! Our team will contact you at{" "}
                    <strong>{form.phone}</strong> within a few hours. 🚀
                  </p>
                  <p style={{ fontSize: 13, color: "#4CAF50", fontWeight: 800, marginBottom: 24 }}>
                    💬 WhatsApp is opening with your enquiry details…
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <a
                      href={buildWhatsAppUrl(form)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#4CAF50",
                        color: "white",
                        fontWeight: 900,
                        fontSize: 14,
                        padding: "12px 24px",
                        borderRadius: 50,
                        textDecoration: "none",
                        boxShadow: "0 4px 16px rgba(76,175,80,.4)",
                      }}
                    >
                      💬 Open WhatsApp Chat
                    </a>
                    <button
                      onClick={() => {
                        setForm({ name: "", phone: "", email: "", childAge: "", reason: "", message: "" });
                        setFieldErrors({});
                        setSubmitted(false);
                      }}
                      className="enrol-btn"
                      style={{ fontSize: 14, padding: "12px 28px" }}
                    >
                      ✉️ Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>

                  {/* ── Reason pills ── */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
                      What can we help you with? *
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {reasons.map(r => (
                        <div
                          key={r.title}
                          className={`reason-pill${form.reason === r.title ? " selected" : ""}${fieldErrors.reason && form.reason === "" ? " error" : ""}`}
                          onClick={() => {
                            if (loading) return;
                            setForm(f => ({ ...f, reason: r.title }));
                            setFieldErrors(prev => ({ ...prev, reason: "" }));
                          }}
                        >
                          <span style={{ fontSize: 22 }}>{r.emoji}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#1A1A2E" }}>{r.title}</div>
                            <div style={{ fontSize: 11, color: "#999", lineHeight: 1.4, fontWeight: 600 }}>{r.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FieldError field="reason" />
                  </div>

                  {/* ── Name + Phone ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                        Your Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Full name"
                        className={`form-input${fieldErrors.name ? " error" : ""}`}
                        style={inputStyle("name")}
                        disabled={loading}
                      />
                      <FieldError field="name" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                        Phone Number *{" "}
                        <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none" }}>(10 digits)</span>
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="9876543210"
                        className={`form-input${fieldErrors.phone ? " error" : ""}`}
                        style={inputStyle("phone")}
                        disabled={loading}
                        inputMode="numeric"
                        maxLength={10}
                      />
                      <FieldError field="phone" />
                    </div>
                  </div>

                  {/* ── Email + Child Age ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                        Email Address *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className={`form-input${fieldErrors.email ? " error" : ""}`}
                        style={inputStyle("email")}
                        disabled={loading}
                      />
                      <FieldError field="email" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                        Child's Age *
                      </label>
                      <select
                        name="childAge"
                        value={form.childAge}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-input${fieldErrors.childAge ? " error" : ""}`}
                        style={{ cursor: "pointer", ...inputStyle("childAge") }}
                        disabled={loading}
                      >
                        <option value="">Select age group</option>
                        <option value="4-6">4–6 years (Pre-Abacus)</option>
                        <option value="6-8">6–8 years</option>
                        <option value="8-12">8–12 years</option>
                        <option value="12-17">12–17 years</option>
                        <option value="adult">Adult / Parent</option>
                      </select>
                      <FieldError field="childAge" />
                    </div>
                  </div>

                  {/* ── Message ── */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
                      Message *{" "}
                      <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, textTransform: "none" }}>(min 10 characters)</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us more — which centre location, timing preferences, or any questions..."
                      className={`form-input${fieldErrors.message ? " error" : ""}`}
                      style={{ height: 110, resize: "vertical", ...inputStyle("message") }}
                      disabled={loading}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <FieldError field="message" />
                      <span style={{ fontSize: 11, color: form.message.length >= 10 ? "#4ECDC4" : "#bbb", fontWeight: 700, marginLeft: "auto" }}>
                        {form.message.length} / 10 min
                      </span>
                    </div>
                  </div>

                  {/* ── Global error ── */}
                  {error && (
                    <div style={{ background: "#FFF0F0", border: "2px solid #FFD6D6", borderRadius: 14, padding: "12px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#FF4444" }}>{error}</span>
                    </div>
                  )}

                  {/* ── Validation summary ── */}
                  {Object.values(fieldErrors).some(Boolean) && (
                    <div style={{ background: "#FFF8F0", border: "2px solid #FFD6A5", borderRadius: 14, padding: "12px 18px", marginBottom: 18 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#FF8C00", marginBottom: 6 }}>⚠️ Please fix the following:</div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {(Object.values(fieldErrors).filter(Boolean) as string[]).map((msg, i) => (
                          <li key={i} style={{ fontSize: 12, fontWeight: 700, color: "#FF4444", marginBottom: 2 }}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Submit ── */}
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
                      <>🚀 Send Message &amp; WhatsApp Us</>
                    )}
                  </button>

                  <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 14, fontWeight: 700 }}>
                    💬 After submitting, WhatsApp will open with your enquiry details
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
                  { emoji: "📞", label: "Call Us Now", sub: "+91 9810366417", color: "#4ECDC4", href: "tel:+919810366417" },
                  { emoji: "💬", label: "WhatsApp Chat", sub: "Instant Response", color: "#4CAF50", href: "https://wa.me/919810366417" },
                  { emoji: "📍", label: "Find a Centre", sub: "Dwarka, New Delhi", color: "#FFB347", href: "https://www.google.com/maps/place/ASCENTO+SCHOOL+%26+DAY+CARE+(+ABACUS+%26+VEDIC+MATHS+CLASSES)/@28.6156395,77.0322703,17z/data=!3m1!4b1!4m6!3m5!1s0x390d054876a6e37f:0x2c13c4b57d282fd5!8m2!3d28.6156395!4d77.0322703!16s%2Fg%2F11bbrjzqfv?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D" },
                ].map((a, i) => (
                  <a
                    key={i}
                    href={a.href}
                    target={a.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="quick-action-link"
                    style={{ marginBottom: i < 2 ? 10 : 0 }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {a.emoji}
                    </div>
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
                  <div
                    key={String(day)}
                    style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < (arr.length as number) - 1 ? "1px solid #F0EEF8" : "none", fontSize: 14 }}
                  >
                    <span style={{ fontWeight: 800, color: "#1A1A2E" }}>{day as string}</span>
                    <span style={{ fontWeight: 700, color: closed ? "#999" : "#FF6B6B" }}>{time as string}</span>
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
                    { emoji: "📘", name: "Facebook", href: "https://www.facebook.com/ASCENTOABACUS/" },
                    { emoji: "📸", name: "Instagram", href: "https://www.instagram.com/ascentoabacus/" },
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
                <Link
                  href="/franchise"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 50, textDecoration: "none" }}
                >
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
            backgroundImage: "radial-gradient(circle,rgba(255,179,71,.08) 1.5px,transparent 1.5px)",
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
          <a
            href="https://www.google.com/maps/place/ASCENTO+SCHOOL+%26+DAY+CARE+(+ABACUS+%26+VEDIC+MATHS+CLASSES)/@28.6156395,77.0322703,17z/data=!3m1!4b1!4m6!3m5!1s0x390d054876a6e37f:0x2c13c4b57d282fd5!8m2!3d28.6156395!4d77.0322703!16s%2Fg%2F11bbrjzqfv?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
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