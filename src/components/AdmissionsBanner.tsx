"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Star({ style }: { style: React.CSSProperties }) {
  return (
    <span aria-hidden style={{ position: "absolute", fontSize: 14, animation: "sc-star 2.6s ease-in-out infinite", ...style }}>
      ✦
    </span>
  );
}

export default function AdmissionsBanner() {
  const [visible, setVisible] = useState(true);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => !t), 4000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes sc-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sc-star    { 0%,100%{opacity:.2;transform:scale(.6) rotate(0deg)} 50%{opacity:1;transform:scale(1.5) rotate(25deg)} }
        @keyframes sc-wobble  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes sc-glow    { 0%,100%{box-shadow:0 0 0 0 rgba(255,153,102,.55)} 50%{box-shadow:0 0 0 9px rgba(255,153,102,0)} }
        @keyframes sc-badge   { 0%,100%{transform:scale(1) rotate(-1deg)} 50%{transform:scale(1.07) rotate(1deg)} }

        .sc-cta {
          display:inline-flex; align-items:center; gap:7px;
          background:#ff9966;
          color:#1A1A2E;
          font-family:inherit; font-weight:900; font-size:13px;
          letter-spacing:.05em; text-transform:uppercase;
          text-decoration:none;
          padding:10px 22px; border-radius:50px; white-space:nowrap;
          box-shadow:0 4px 0 #cc7a52, 0 8px 22px rgba(255,153,102,.4);
          transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;
          flex-shrink:0;
          animation:sc-glow 2.5s ease-in-out infinite;
        }
        .sc-cta:hover{
          transform:scale(1.08) translateY(-2px);
          box-shadow:0 6px 0 #cc7a52, 0 14px 30px rgba(255,153,102,.5);
          animation:none;
        }
        .sc-cta:active{ transform:scale(.97) translateY(2px); box-shadow:0 2px 0 #cc7a52; }

        .sc-close{
          background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.22);
          cursor:pointer; width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,.7); font-size:14px; font-weight:900;
          flex-shrink:0; transition:background .2s,color .2s;
        }
        .sc-close:hover{ background:rgba(255,255,255,.22); color:#fff; }

        .sc-pill{
          font-size:11px; font-weight:800; color:#ff9966;
          background:rgba(255,153,102,.1); border:1.5px solid rgba(255,153,102,.3);
          border-radius:50px; padding:3px 10px; white-space:nowrap;
        }

        .sc-social{
          display:inline-flex; align-items:center; gap:5px;
          font-size:11px; font-weight:900; color:rgba(255,255,255,.8);
          text-decoration:none;
          background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.18);
          border-radius:50px; padding:4px 12px; white-space:nowrap;
          transition:background .2s,border-color .2s,transform .2s;
        }
        .sc-social:hover{
          background:rgba(255,153,102,.15);
          border-color:rgba(255,153,102,.45);
          transform:translateY(-1px);
        }

        .sc-main{
          max-width:1200px; margin:0 auto; padding:10px 20px;
          display:flex; align-items:center; justify-content:space-between; gap:16px;
          position:relative; z-index:1;
        }
        .sc-left { display:flex; align-items:center; gap:14px; min-width:0; flex:1; }
        .sc-right{ display:flex; align-items:center; gap:10px; flex-shrink:0; }
        .sc-pills{ display:flex; gap:6px; flex-wrap:wrap; }

        .sc-bottom{
          background:rgba(0,0,0,.18); border-top:1px solid rgba(255,255,255,.09);
          padding:6px 20px;
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;
        }
        .sc-info-row  { display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
        .sc-social-row{ display:flex; align-items:center; gap:6px; }

        @media(max-width:900px){
          .sc-pills{ display:none; }
          .sc-new-badge{ display:none; }
        }
        @media(max-width:640px){
          .sc-main{ padding:8px 12px; gap:10px; }
          .sc-left{ gap:8px; }
          .sc-title{ font-size:12px !important; white-space:normal; line-height:1.3; }
          .sc-cta  { font-size:11px; padding:8px 14px; }
          .sc-bottom{ padding:5px 12px; flex-direction:column; align-items:flex-start; gap:5px; }
          .sc-info-row{ gap:10px; }
          .sc-info-item{ font-size:10px !important; }
          .sc-social-row{ display:none; }
        }
        @media(max-width:400px){
          .sc-info-item:nth-child(n+4){ display:none; }
        }
      `}</style>

      {/* Dark Green Gradient Background */}
      <div
        style={{
          position: "relative",
          zIndex: 500,
          overflow: "hidden",
          background: tick
            ? "linear-gradient(90deg, #022c22 0%, #064e3b 45%, #047857 80%, #022c22 100%)"
            : "linear-gradient(90deg, #064e3b 0%, #047857 45%, #022c22 75%, #064e3b 100%)",
          transition: "background 0.8s ease",
        }}
      >
        {/* White dot texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "radial-gradient(circle,rgba(255,255,255,.08) 1.5px,transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Soft glow orbs */}
        <div aria-hidden style={{ position: "absolute", top: "-70%", left: "12%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,153,102,.15),transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "-60%", right: "18%", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.2),transparent 70%)", pointerEvents: "none" }} />

        {/* Sparkles */}
        <Star style={{ top: 5, left: "6%", color: "#ff9966", animationDelay: "0s" }} />
        <Star style={{ top: 7, left: "19%", color: "rgba(255,153,102,.5)", animationDelay: "0.7s" }} />
        <Star style={{ bottom: 5, left: "44%", color: "rgba(16,185,129,.7)", animationDelay: "1.2s" }} />
        <Star style={{ top: 4, right: "27%", color: "rgba(255,153,102,.6)", animationDelay: "0.9s" }} />
        <Star style={{ bottom: 6, right: "9%", color: "#ff9966", animationDelay: "0.4s" }} />

        {/* ── TOP TICKER ── */}
        <div style={{ background: "rgba(0,0,0,.22)", padding: "3px 0", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display: "flex", animation: "sc-marquee 22s linear infinite", whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", flexShrink: 0 }}>
                {[
                  "🎓 Admissions Open",
                  "🏫 Play School",
                  "🧮 Abacus Classes",
                  "📚 Vedic Maths Classes",
                  "✅ Limited Seats Available",
                  "📞 Free Demo Classes",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#A7F3D0",
                      padding: "0 20px",
                    }}
                  >
                    {item}
                    <span style={{ opacity: 0.35, margin: "0 6px", color: "#ff9966" }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN ROW ── */}
        <div className="sc-main">
          <div className="sc-left">
            {/* Badge */}
            <div
              className="sc-new-badge"
              style={{
                background: "linear-gradient(135deg, #ff9966, #ff7a33)",
                borderRadius: 10,
                padding: "5px 13px",
                flexShrink: 0,
                boxShadow: "0 3px 0 #cc5200",
                animation: "sc-badge 2.5s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1A1A2E" }}>
                🎯 ENROL NOW
              </span>
            </div>

            {/* Title */}
            <p
              className="sc-title"
              style={{
                margin: 0,
                fontFamily: "'Fredoka One','Nunito',system-ui,cursive",
                fontSize: "clamp(13px,2vw,17px)",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.3,
              }}
            >
              <span style={{ display: "inline-block", animation: "sc-wobble 2s ease-in-out infinite" }}>🎓</span>{" "}
              <strong style={{ color: "#ff9966" }}>Admissions Open 2026-27</strong>{" "}
              <span style={{ color: "rgba(255,255,255,.75)", fontWeight: 700, fontSize: "0.85em" }}>
                · Play School, Abacus & Vedic Maths
              </span>
            </p>
          </div>

          <div className="sc-right">
            <div className="sc-pills">
              {["🏫 Play School", "🧮 Abacus", "📚 Vedic Maths", "✅ Limited Seats"].map((p) => (
                <span key={p} className="sc-pill">{p}</span>
              ))}
            </div>

            <Link href="/contact" className="sc-cta">Contact Us →</Link>

            <button onClick={() => setVisible(false)} className="sc-close" aria-label="Close banner">✕</button>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div className="sc-bottom">
          <div className="sc-info-row">
            {[
              { icon: "📅", text: "Session 2026-27" },
              { icon: "🎁", text: "Book a Free Demo Class" },
              { icon: "👦", text: "Ages 4–15 Years" },
              { icon: "📍", text: "Patel Garden, Dwarka Mor" },
              { icon: "📞", text: "9810366417" },
            ].map(({ icon, text }) => (
              <span key={text} className="sc-info-item" style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.85)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                {icon} {text}
              </span>
            ))}
          </div>

          <div className="sc-social-row">
            <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 4 }}>Follow:</span>
            <a href="https://www.instagram.com/ascentoabacus/" target="_blank" rel="noreferrer" className="sc-social">Instagram</a>
            <a href="https://www.facebook.com/ASCENTOABACUS/" target="_blank" rel="noreferrer" className="sc-social">Facebook</a>
            <a href="https://wa.me/919810366417" target="_blank" rel="noreferrer" className="sc-social">WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}