




"use client";

// ─────────────────────────────────────────────
// /app/page.jsx  — Ascento Home Page (UPDATED)
// Changes: "Learn More →" on program cards → /programs#prog-{slug}
//          "Become a Partner" → /franchise
//          "Schedule a Call" → /contact
//          "Enrol Now" → /contact
// ─────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/ui/home/Reveal";
import { Counter } from "@/ui/home/Counter";
import { Blob } from "@/ui/home/Blob";
import { Star } from "@/ui/home/Star";


export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("/Images/DSC_0037-scaled-1.jpg");
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});


  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── programs ── */
  const programs = [
    { emoji: "🧮", title: "Abacus Mastery", slug: "abacus-mastery", ages: "5–14 yrs", color: "#FF6B6B", bg: "#FFF0F0", desc: "Lightning-fast mental math using the ancient abacus method. Build speed, accuracy & number sense!", tag: "Most Popular" },
    { emoji: "🧠", title: "Brain Gym", slug: "brain-gym", ages: "All ages", color: "#4ECDC4", bg: "#F0FFFE", desc: "Fun exercises that wake up both sides of your brain — focus, memory & coordination level up!", tag: "Fan Favourite" },
    { emoji: "📐", title: "Vedic Maths", slug: "vedic-maths", ages: "8+ yrs", color: "#FFB347", bg: "#FFF8EE", desc: "Ancient Indian speed-math tricks that make hard sums feel like magic. Impress your whole class!", tag: "Mind-Blowing" },
    { emoji: "🌟", title: "Pre-Abacus", slug: "pre-abacus", ages: "4–6 yrs", color: "#A78BFA", bg: "#F5F0FF", desc: "The perfect first step! Numbers become friends through games, songs, and colourful play.", tag: "For Tiny Minds" },
    { emoji: "📚", title: "Tuitions", slug: "tuitions", ages: "5–17 yrs", color: "#F06292", bg: "#FFF0F5", desc: "Expert academic support for Maths and Science from Class 1–12. Small batches, big results!", tag: "New! 🎉" },
  ];

  /* ── why cards ── */
  const whyCards = [
    { emoji: "🏆", title: "World-Class Certification", desc: "Certificates recognised across India and globally — show the world what you can do!", color: "#FFB347" },
    { emoji: "🎯", title: "Whole Brain Training", desc: "We activate BOTH sides of your brain so you're creative AND super-smart at maths!", color: "#FF6B6B" },
    { emoji: "👩‍🏫", title: "Expert Coaches", desc: "Our teachers have 2–35 years of experience and love making learning feel like a superpower.", color: "#4ECDC4" },
    { emoji: "🤝", title: "Small, Caring Batches", desc: "Every child gets personal attention — no one gets left behind in our family-sized classes.", color: "#A78BFA" },
    { emoji: "🌍", title: "50+ Centres Nationwide", desc: "Find an Ascento centre near you — or bring one to your city with our franchise programme!", color: "#F06292" },
    { emoji: "📈", title: "Proven Results", desc: "98% student retention rate and thousands of competition winners speak louder than words.", color: "#26C6DA" },
  ];

  /* ── team ── */
  const team = [
    { initials: "BT", name: "Mrs. Bala Tomar", role: "Principal", qual: "M.A., B.Ed., NET Qualified", exp: "27 Years", color: "#4ECDC4", desc: "The heart of Ascento — 27 years of turning curious kids into champions." },
    { initials: "ST", name: "Mr. Surendra Tomar", role: "Director", qual: "B.A., Computer Diploma", exp: "30+ Years", color: "#FF6B6B", desc: "Visionary leader who built a 50+ centre empire on the power of young minds." },
    { initials: "KS", name: "Mrs. Kashish Sheopuri", role: "Admin & Teacher", qual: "B.Com, Computer Diploma", exp: "2 Years", color: "#A78BFA", desc: "Keeps everything running smoothly while making learning super fun for little ones." },
    { initials: "AR", name: "Mrs. Aarti Rathore", role: "Senior Teacher", qual: "M.A., Computer Diploma", exp: "8 Years", color: "#FFB347", desc: "Expert at making Play School to Class 2 feel like the best adventure ever." },
  ];

  /* ── gallery images ── */
  const galleryImgs = [
    { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_cfe7f04f.jpg", alt: "Learning Abacus", fallback: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80" },
    { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_e3ac77d8.jpg", alt: "Brain Gym Session", fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
    { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.38_091c0f31.jpg", alt: "Advanced Student", fallback: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" },
    { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.39_0f634c25-r70q3atn2hrk6sl09jh6d3zwf68pahr7jeygaih09s.jpg", alt: "Class Activities", fallback: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80" },
    { src: "/Images/IMG_20190930_102619.jpg", alt: "Award Winners", fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" },
    { src: "/Images/DSC_0037-scaled-1.jpg", alt: "Our Students", fallback: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFDF7", color: "#1A1A2E", overflowX: "hidden" }}>

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        @keyframes float-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes float-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(-4deg)} }
        @keyframes float-c { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes wiggle  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes bounce  { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} 70%{transform:translateY(-6px)} }
        @keyframes spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }

        .float-a { animation: float-a 4s ease-in-out infinite; }
        .float-b { animation: float-b 5s ease-in-out infinite; }
        .float-c { animation: float-c 3.5s ease-in-out infinite; }
        .wiggle   { animation: wiggle 2s ease-in-out infinite; }
        .spin-slow { animation: spin 12s linear infinite; }

        .prog-card { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
        .prog-card:hover { transform: translateY(-10px) rotate(-1deg) scale(1.02); box-shadow: 0 24px 50px rgba(0,0,0,.13); }
        .why-card  { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
        .why-card:hover  { transform: translateY(-8px) scale(1.03); }
        .team-card { transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
        .team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,.12); }
        .gallery-img { transition: transform .5s cubic-bezier(.22,1,.36,1); }
        .gallery-wrap:hover .gallery-img { transform: scale(1.08); }

        .nav-link { position:relative; font-size:15px; font-weight:800; color:#1A1A2E; text-decoration:none; transition:color .2s; }
        .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:3px; border-radius:3px; background:#FF6B6B; transition:width .3s cubic-bezier(.34,1.56,.64,1); }
        .nav-link:hover { color:#FF6B6B; }
        .nav-link:hover::after { width:100%; }

        .enrol-btn { background:#FF6B6B; color:#fff; font-family:inherit; font-weight:900; font-size:15px; padding:12px 28px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 6px 20px rgba(255,107,107,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .enrol-btn:hover { transform:scale(1.08) translateY(-2px); box-shadow:0 12px 30px rgba(255,107,107,.5); }
        .outline-btn { background:transparent; color:#1A1A2E; font-family:inherit; font-weight:800; font-size:15px; padding:12px 28px; border-radius:50px; border:3px solid #1A1A2E; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .outline-btn:hover { background:#1A1A2E; color:#fff; transform:scale(1.05); }

        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-track { background:#fff; }
        ::-webkit-scrollbar-thumb { background:#FFB347; border-radius:4px; }
      `}</style>

      {/* ════════════════════════════════
          NAVBAR
      ════════════════════════════════ */}
      {/* <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "14px 0",
        background: navScrolled ? "rgba(255,253,247,0.95)" : "transparent",
        backdropFilter: navScrolled ? "blur(16px)" : "none",
        boxShadow: navScrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.4s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 14px rgba(255,107,107,.4)" }}>🧮</div>
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A1A2E", lineHeight: 1 }}>Ascento <span style={{ color: "#FF6B6B" }}>Abacus</span></div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginTop: 1 }}>Brain Development Academy</div>
            </div>
          </Link>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="/programs" className="nav-link">Programs</Link>
            <Link href="#whyus" className="nav-link">Why Us</Link>
            <Link href="#gallery" className="nav-link">Gallery</Link>
            <Link href="#team" className="nav-link">Team</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          <Link href="/contact" className="enrol-btn" style={{ fontSize: 14 }}>🎉 Enrol Now</Link>
        </div>
      </nav> */}


      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 100, paddingBottom: 60, position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #FFFDF7 0%, #FFF0E8 50%, #FFFDF7 100%)" }}>
        <Blob color="#FFE0E0" style={{ width: 500, height: 500, top: "-10%", right: "-8%", opacity: 0.7 }} />
        <Blob color="#E0F7FA" style={{ width: 400, height: 400, bottom: "0%", left: "-8%", opacity: 0.6 }} />
        <Blob color="#EDE7FF" style={{ width: 300, height: 300, top: "40%", right: "5%", opacity: 0.4 }} />

        <div style={{ position: "absolute", top: "18%", left: "6%", fontSize: 40 }} className="float-a">⭐</div>
        <div style={{ position: "absolute", top: "12%", right: "18%", fontSize: 36 }} className="float-b">🎯</div>
        <div style={{ position: "absolute", bottom: "22%", left: "4%", fontSize: 32 }} className="float-c">🚀</div>
        <div style={{ position: "absolute", bottom: "28%", right: "8%", fontSize: 44, animationDelay: "1s" }} className="float-a">🌈</div>
        <div style={{ position: "absolute", top: "55%", left: "12%", fontSize: 28 }} className="wiggle">✏️</div>

        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(circle, #FFB347 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", opacity: 0.18 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0F0", borderRadius: 50, padding: "8px 18px", marginBottom: 24, border: "2px solid #FFD6D6" }}>
                <span style={{ fontSize: 18 }}>🌟</span>
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>India's #1 Brain Development Program</span>
              </div>

              <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(44px,5.5vw,76px)", lineHeight: 1.08, color: "#1A1A2E", marginBottom: 24, letterSpacing: "-0.01em" }}>
                Make Your Child
                <span style={{ display: "block", color: "#FF6B6B", position: "relative" }}>
                  a Math
                  <span style={{ color: "#FFB347" }}> Superstar!</span>
                  <svg style={{ position: "absolute", bottom: -6, left: 0, right: 0 }} viewBox="0 0 300 12" fill="none">
                    <path d="M2 9C50 3 100 10 150 5C200 0 250 8 298 4" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.7, color: "#555", maxWidth: 440, marginBottom: 36 }}>
                Fun, play-based learning that turns numbers into <strong>superpowers</strong>. 10,000+ children aged 4–17 are already on their brain development journey! 🎓
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/contact" className="enrol-btn" style={{ fontSize: 16, padding: "16px 36px" }}>🎉 Enrol Your Child</Link>
                <Link href="/programs" className="outline-btn">🔍 See Programs</Link>
              </div>

              <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
                {[["👶", "Ages 4–17"], ["🏅", "15+ Years"], ["🌏", "50+ Centres"]].map(([e, t]) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{e}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image + floating cards */}
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 32, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.18)", transform: "rotate(2deg)", border: "6px solid white" }}>
                <Image
                  src={imgSrc}
                  alt="Happy students"
                  width={600}
                  height={480}
                  style={{ width: "100%", height: 420, objectFit: "cover" }}
                  onError={() => setImgSrc("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80")}
                />
              </div>

              <div className="float-b" style={{ position: "absolute", bottom: -24, left: -36, background: "white", borderRadius: 20, padding: "16px 22px", boxShadow: "0 16px 40px rgba(0,0,0,.14)", border: "3px solid #FFE0E0" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 36, color: "#FF6B6B" }}>10K+</div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginTop: 2 }}>Happy Students</div>
              </div>

              <div className="float-a" style={{ position: "absolute", top: -20, right: -20, background: "white", borderRadius: 20, padding: "14px 18px", boxShadow: "0 16px 40px rgba(0,0,0,.14)", border: "3px solid #FFF0B3", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FFB347,#FFD700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏆</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 14, color: "#1A1A2E" }}>Award Winning</div>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 700 }}>Since 2010</div>
                </div>
              </div>

              <div className="float-c" style={{ position: "absolute", top: "45%", right: -32, background: "#FF6B6B", borderRadius: 16, padding: "12px 18px", boxShadow: "0 12px 30px rgba(255,107,107,.4)" }}>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "white" }}>98%</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>Retention</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MARQUEE TICKER ════ */}
      <div style={{ background: "#FF6B6B", overflow: "hidden", padding: "14px 0" }}>
        <div style={{ display: "flex", animation: "marquee 18s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: "flex", flexShrink: 0 }}>
              {["🧮 Abacus Mastery", "🧠 Brain Gym", "📐 Vedic Maths", "⭐ Midbrain Activation", "🎯 Right Brain Training", "🌟 Pre-Abacus", "📚 Tuitions", "🏆 50+ Centres Nationwide", "🚀 15 Years of Excellence"].map(item => (
                <span key={item} style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "white", padding: "0 32px", display: "inline-block" }}>
                  {item} <span style={{ opacity: 0.5, margin: "0 8px" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════ STATS ════ */}
      <section style={{ background: "#1A1A2E", padding: "60px 0", position: "relative", overflow: "hidden" }}>
        <Blob color="#2D2D4E" style={{ width: 600, height: 400, top: "-30%", left: "20%", opacity: 0.6 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { emoji: "👦", target: 10000, suffix: "+", label: "Happy Students" },
              { emoji: "🏫", target: 50, suffix: "+", label: "Learning Centres" },
              { emoji: "📅", target: 15, suffix: "+", label: "Years of Magic" },
              { emoji: "🌍", target: 145000, suffix: "+", label: "Lives Touched" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ textAlign: "center", padding: "24px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{s.emoji}</div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 48, color: "#FFB347", lineHeight: 1 }}>
                    <Counter target={s.target} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: 6 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ PROGRAMS ════ */}
      <section id="programs" style={{ padding: "100px 0", background: "#FFFDF7", position: "relative", overflow: "hidden" }}>
        <Blob color="#FFF0E8" style={{ width: 500, height: 500, top: "-10%", right: "-10%", opacity: 0.8 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF0F0", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>📚</span>
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B" }}>Our Curriculum</span>
              </div>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,56px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 16 }}>
                Learning That Feels Like <span style={{ color: "#FF6B6B" }}>Play!</span> 🎮
              </h2>
              <p style={{ fontSize: 17, color: "#777", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                Five amazing programmes designed for every age and stage — from tiny tots to teenage champions.
              </p>
            </div>
          </Reveal>

          {/* ── 5-card grid: 3 top + 2 bottom centred ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 24 }}>
            {programs.slice(0, 3).map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <ProgramCard p={p} />
              </Reveal>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, maxWidth: 820, margin: "0 auto" }}>
            {programs.slice(3).map((p, i) => (
              <Reveal key={i} delay={(i + 3) * 80}>
                <ProgramCard p={p} />
              </Reveal>
            ))}
          </div>

          {/* View all CTA */}
          <Reveal delay={200}>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/programs" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "inherit", fontWeight: 900, fontSize: 16, color: "#FF6B6B", textDecoration: "none", border: "3px solid #FF6B6B", borderRadius: 50, padding: "14px 36px", transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FF6B6B"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FF6B6B"; }}>
                📋 View All Programme Details →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ WHY ASCENTO ════ */}
      <section id="whyus" style={{ padding: "100px 0", background: "linear-gradient(160deg,#F0FFFE 0%,#FFFDF7 60%,#FFF5F5 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "3%", fontSize: 60, opacity: 0.12 }} className="spin-slow">⚙️</div>
        <div style={{ position: "absolute", bottom: "10%", right: "3%", fontSize: 60, opacity: 0.12 }} className="spin-slow">🔆</div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#E0FFFE", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4ECDC4" }}>Why Choose Us</span>
              </div>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,56px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 16 }}>
                Why Parents <span style={{ color: "#4ECDC4" }}>Love</span> Ascento! 💛
              </h2>
              <p style={{ fontSize: 17, color: "#777", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                We're not just a class — we're a launchpad for your child's brightest future.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {whyCards.map((c, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="why-card" style={{ background: "white", borderRadius: 24, padding: 32, border: "3px solid transparent", backgroundClip: "padding-box", boxShadow: "0 4px 20px rgba(0,0,0,.06)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: c.color, borderRadius: "24px 24px 0 0" }} />
                  <div style={{ fontSize: 48, marginBottom: 16, marginTop: 8 }}>{c.emoji}</div>
                  <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 21, color: "#1A1A2E", marginBottom: 10 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <Link href="/contact" className="enrol-btn" style={{ fontSize: 18, padding: "18px 48px" }}>🚀 Start Your Child's Journey Today</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ GALLERY ════ */}
      <section id="gallery" style={{ padding: "100px 0", background: "#1A1A2E", position: "relative", overflow: "hidden" }}>
        <Blob color="#2A2A45" style={{ width: 600, height: 600, top: "-20%", right: "-15%", opacity: 0.8 }} />
        <Blob color="#2A3550" style={{ width: 500, height: 400, bottom: "-20%", left: "-10%", opacity: 0.6 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,179,71,.15)", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>📸</span>
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Campus Vibes</span>
              </div>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,56px)", color: "white", lineHeight: 1.1, marginBottom: 12 }}>
                Life at <span style={{ color: "#FFB347" }}>Ascento!</span> 🎉
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", maxWidth: 420, margin: "0 auto" }}>A peek into our fun, energetic classrooms where every day is a new adventure.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "220px 220px", gap: 16 }}>
            {galleryImgs.map((img, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="gallery-wrap" style={{ borderRadius: 20, overflow: "hidden", position: "relative", ...(i === 0 ? { gridRow: "span 2" } : {}), border: "3px solid rgba(255,255,255,.06)", boxShadow: "0 8px 30px rgba(0,0,0,.3)" }}>

                  <Image
                    src={imageErrors[i] ? img.fallback : img.src}
                    alt={img.alt}
                    width={600}
                    height={440}
                    onError={() => {
                      setImageErrors((prev) => ({
                        ...prev,
                        [i]: true,
                      }));
                    }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TEAM ════ */}
      <section id="team" style={{ padding: "100px 0", background: "#FFFDF7", position: "relative", overflow: "hidden" }}>
        <Blob color="#FFF0E8" style={{ width: 400, height: 400, bottom: "-15%", right: "-10%", opacity: 0.7 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#EDE7FF", borderRadius: 50, padding: "8px 20px", marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>👩‍🏫</span>
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A78BFA" }}>Our Dream Team</span>
              </div>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(32px,4vw,56px)", color: "#1A1A2E", lineHeight: 1.1, marginBottom: 16 }}>
                The Heroes Behind <span style={{ color: "#A78BFA" }}>Every Win!</span> 🦸
              </h2>
              <p style={{ fontSize: 17, color: "#777", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Passionate, caring, and incredibly experienced — our team lives to help children shine.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            {[
              { initials: "BT", name: "Mrs. Bala Tomar", role: "Principal 👑", qual: "M.A., B.Ed., NET Qualified • 27 Years", bio: "The heart and soul of Ascento — 27 years of turning curious children into confident champions through love, wisdom and activity-based learning.", color: "#4ECDC4", tags: ["Right Brain Dev", "Midbrain", "Abacus & Vedic", "Hindi Expert"] },
              { initials: "ST", name: "Mr. Surendra Tomar", role: "Director 🚀", qual: "B.A., Computer Diploma • 30+ Years", bio: "The visionary who built a 50+ centre empire across India — deeply passionate about making quality education accessible to every child.", color: "#FF6B6B", tags: ["Franchise Dev", "Abacus & Vedic", "Academic Mgmt", "Leadership"] },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="team-card" style={{ background: "white", borderRadius: 28, padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,.07)", border: `3px solid ${m.color}22`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: m.color }} />
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginTop: 8 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 22, background: `linear-gradient(135deg,${m.color},${m.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "white", flexShrink: 0, boxShadow: `0 8px 24px ${m.color}40` }}>{m.initials}</div>
                    <div>
                      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#1A1A2E", marginBottom: 3 }}>{m.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: m.color, marginBottom: 4 }}>{m.role}</div>
                      <div style={{ fontSize: 12, color: "#999", fontWeight: 700 }}>{m.qual}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666", margin: "20px 0 16px" }}>{m.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {m.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 50, background: m.color + "15", color: m.color, border: `1.5px solid ${m.color}33` }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {team.map((m, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="team-card" style={{ background: "white", borderRadius: 22, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,.06)", border: `2.5px solid ${m.color}22` }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${m.color},${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "white", marginBottom: 14, boxShadow: `0 6px 16px ${m.color}40` }}>{m.initials}</div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", marginBottom: 3 }}>{m.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: m.color, marginBottom: 10 }}>{m.role}</div>
                  <div style={{ display: "inline-block", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 50, background: m.color + "15", color: m.color, marginBottom: 12 }}>{m.exp}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#777" }}>{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FUN FACTS STRIP ════ */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "5%", fontSize: 120, opacity: 0.08, transform: "translateY(-50%)", fontFamily: "'Fredoka One',cursive" }}>FUN!</div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,4vw,52px)", color: "white", lineHeight: 1.1, marginBottom: 16 }}>Did You Know? 🤯</h2>
            <p style={{ fontSize: 20, color: "rgba(255,255,255,.9)", maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 700 }}>
              Children who learn abacus show <strong style={{ color: "white" }}>2x faster</strong> mental calculation speed and score <strong style={{ color: "white" }}>30% higher</strong> in school maths exams within 6 months! 🚀
            </p>
            <Link href="/contact" style={{ background: "white", color: "#FF6B6B", fontFamily: "inherit", fontWeight: 900, fontSize: 18, padding: "18px 48px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
              🎓 Book a FREE Trial Class!
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ════ FRANCHISE CTA ════ */}
      <section id="contact" style={{ padding: "100px 0", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Reveal dir="scale">
            <div style={{ background: "#1A1A2E", borderRadius: 36, padding: "72px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, position: "relative", overflow: "hidden" }}>
              <Blob color="#2A2A60" style={{ width: 500, height: 400, top: "-30%", right: "-10%", opacity: 0.8 }} />
              <Blob color="#3A1A30" style={{ width: 400, height: 300, bottom: "-30%", left: "10%", opacity: 0.5 }} />

              <Star size={40} color="#FFB347" style={{ position: "absolute", top: 30, right: 200, opacity: 0.6 }} />
              <Star size={24} color="#FF6B6B" style={{ position: "absolute", bottom: 40, right: 320, opacity: 0.5 }} />
              <Star size={32} color="#4ECDC4" style={{ position: "absolute", top: 60, left: 400, opacity: 0.4 }} />

              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,179,71,.15)", borderRadius: 50, padding: "8px 20px", marginBottom: 20 }}>
                  <span style={{ fontSize: 18 }}>🏪</span>
                  <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FFB347" }}>Open a Centre</span>
                </div>
                <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,3.5vw,48px)", color: "white", lineHeight: 1.1, marginBottom: 16 }}>
                  Start Your Own <span style={{ color: "#FFB347" }}>Ascento</span> Centre! 🌟
                </h2>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", maxWidth: 400, lineHeight: 1.7 }}>
                  Join 50+ successful franchise partners across India. Low investment, full training support, and a proven brand that parents trust.
                </p>
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14, alignItems: "center", flexShrink: 0 }}>
                {/* ✅ Updated: links to /franchise */}
                <Link href="/franchise" style={{ background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#1A1A2E", fontFamily: "inherit", fontWeight: 900, fontSize: 17, padding: "18px 40px", borderRadius: 50, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 10px 35px rgba(255,179,71,.45)", whiteSpace: "nowrap" }}>
                  🏪 Become a Partner
                </Link>
                {/* ✅ Updated: links to /contact */}
                <Link href="/contact" style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  📞 Schedule a Call →
                </Link>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 700, letterSpacing: "0.06em", textAlign: "center" }}>
                  Low Investment • High ROI • Full Support
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

   
   </div>
  );
}

type Program = {
  emoji: string;
  title: string;
  ages: string;
  color: string;
  bg: string;
  desc: string;
  tag: string;
  slug: string; // 👈 you used this, so add it
};

function ProgramCard({ p }: { p: Program }) {
  return (
    <div
      className="prog-card"
      style={{
        background: p.bg,
        borderRadius: 28,
        overflow: "hidden",
        border: `3px solid ${p.color}22`,
        position: "relative",
      }}
    >
      {/* Tag */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: p.color,
          color: "white",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 12px",
          borderRadius: 50,
        }}
      >
        {p.tag}
      </div>

      {/* Emoji section */}
      <div
        style={{
          background: p.color + "18",
          padding: "40px 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }}
          className="float-b"
        >
          {p.emoji}
        </div>

        <div
          style={{
            display: "inline-block",
            background: p.color + "22",
            borderRadius: 50,
            padding: "4px 14px",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: p.color }}>
            Ages {p.ages}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 28px" }}>
        <h3
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: 22,
            color: "#1A1A2E",
            marginBottom: 10,
          }}
        >
          {p.title}
        </h3>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#666",
            marginBottom: 20,
          }}
        >
          {p.desc}
        </p>

        <Link
          href={`/programs#prog-${p.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 900,
            fontSize: 14,
            color: p.color,
            textDecoration: "none",
            border: `2.5px solid ${p.color}`,
            borderRadius: 50,
            padding: "8px 18px",
          }}
        >
          Explore Program →
        </Link>
      </div>
    </div>
  );
}