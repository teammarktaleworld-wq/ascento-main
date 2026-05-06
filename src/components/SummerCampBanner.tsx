"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ─── tiny animated star ───────────────────────────────────────────
function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        fontSize: 18,
        animation: "sc-sparkle 2s ease-in-out infinite",
        ...style,
      }}
    >
      ✦
    </span>
  );
}

export default function SummerCampBanner() {
  const [visible, setVisible] = useState(true);
  const [shimmer, setShimmer] = useState(false);

  // pulse the shimmer every few seconds so it catches the eye
  useEffect(() => {
    const id = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 900);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes sc-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes sc-sparkle {
          0%,100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
          50%      { opacity: 1;   transform: scale(1.3) rotate(20deg); }
        }
        @keyframes sc-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
        }
        @keyframes sc-shake {
          0%,100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg);  }
        }
        @keyframes sc-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .sc-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #FF6B6B;
          font-family: "'Nunito', system-ui, sans-serif";
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 50px;
          white-space: nowrap;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
          animation: sc-pulse 2.5s ease-in-out infinite;
        }
        .sc-cta-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.22);
          animation: none;
        }
        .sc-close {
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 15px;
          font-weight: 900;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .sc-close:hover { background: rgba(255,255,255,0.3); }
        .sc-emoji { animation: sc-shake 1.8s ease-in-out infinite; display: inline-block; }
      `}</style>

      {/* ── OUTER WRAPPER ── */}
      <div
        style={{
          position: "relative",
          zIndex: 300,
          overflow: "hidden",
          background: "linear-gradient(90deg, #FF6B6B 0%, #FF8E53 35%, #FFB347 65%, #FF6B6B 100%)",
          backgroundSize: "200% auto",
          animation: shimmer ? "sc-shimmer 0.9s linear" : "none",
        }}
      >
        {/* decorative dots */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />

        <Sparkle style={{ top: 6, left: "8%", color: "rgba(255,255,255,0.7)", animationDelay: "0s" }} />
        <Sparkle style={{ top: 8, left: "22%", color: "rgba(255,255,255,0.5)", animationDelay: "0.5s" }} />
        <Sparkle style={{ bottom: 6, left: "45%", color: "rgba(255,255,255,0.6)", animationDelay: "1s" }} />
        <Sparkle style={{ top: 4, right: "30%", color: "rgba(255,255,255,0.55)", animationDelay: "0.8s" }} />
        <Sparkle style={{ bottom: 5, right: "12%", color: "rgba(255,255,255,0.65)", animationDelay: "0.3s" }} />

        {/* ── TOP MICRO-TICKER (optional extra punch) ── */}
        <div
          style={{
            background: "rgba(0,0,0,0.12)",
            padding: "3px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              animation: "sc-marquee 20s linear infinite",
              whiteSpace: "nowrap",
            }}
          >
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", flexShrink: 0 }}>
                {[
                  "☀️ Summer Camp 2025",
                  "🎨 Art & Craft",
                  "🧮 Abacus & Vedic Maths",
                  "🥋 Karate & Self Defence",
                  "🎵 Dance & Music",
                  "♟️ Chess & Brain Games",
                  "✍️ Calligraphy",
                  "📖 Holiday Homework Help",
                  "🧠 Brain Development",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.9)",
                      padding: "0 20px",
                    }}
                  >
                    {item}
                    <span style={{ opacity: 0.4, margin: "0 6px" }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN BANNER CONTENT ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* LEFT: label + headline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            {/* badge */}
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 10,
                padding: "5px 11px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "white" }}>
                🔥 NEW
              </span>
            </div>

            {/* headline */}
            <p
              style={{
                margin: 0,
                fontFamily: "'Fredoka One', 'Nunito', system-ui, cursive",
                fontSize: "clamp(14px, 2vw, 18px)",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span className="sc-emoji">☀️</span>{" "}
              <strong>Dwarka's Biggest Summer Camp</strong> is LIVE!&nbsp;
              <span style={{ fontWeight: 700, fontSize: "0.85em", opacity: 0.9 }}>
                Ages 5–15 · Starts 11th May · 8 AM–1 PM
              </span>
            </p>
          </div>

          {/* RIGHT: CTA + pills + close */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* info pills — hidden on small screens via inline media approach */}
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
              className="sc-pills"
            >
              {["🎨 Art & Craft", "🥋 Karate", "🧮 Abacus", "🎵 Dance"].map((pill) => (
                <span
                  key={pill}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "white",
                    background: "rgba(255,255,255,0.18)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    borderRadius: 50,
                    padding: "3px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pill}
                </span>
              ))}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "white",
                  background: "rgba(255,255,255,0.18)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: 50,
                  padding: "3px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                +More!
              </span>
            </div>

            <Link href="/summer-camp" className="sc-cta-btn">
              Register Free →
            </Link>

            <button
              onClick={() => setVisible(false)}
              className="sc-close"
              aria-label="Close banner"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── BOTTOM DETAIL STRIP ── */}
        <div
          style={{
            background: "rgba(0,0,0,0.1)",
            padding: "5px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {[
            { icon: "📅", text: "Starts 11th May 2025" },
            { icon: "🕗", text: "8:00 AM – 1:00 PM" },
            { icon: "👦", text: "Age 5–15 Years" },
            { icon: "📍", text: "Patel Garden, Dwarka Mor" },
            { icon: "📞", text: "9810366417" },
          ].map(({ icon, text }) => (
            <span
              key={text}
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.92)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {icon} {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}