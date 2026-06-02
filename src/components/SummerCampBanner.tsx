

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Star({ style }: { style: React.CSSProperties }) {
  return (
    <span aria-hidden style={{ position:"absolute", fontSize:14, animation:"sc-star 2.6s ease-in-out infinite", ...style }}>
      ✦
    </span>
  );
}

export default function SummerCampBanner() {
  const [visible, setVisible] = useState(true);
  const [tick, setTick]       = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 4000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes sc-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sc-star    { 0%,100%{opacity:.2;transform:scale(.6) rotate(0deg)} 50%{opacity:1;transform:scale(1.5) rotate(25deg)} }
        @keyframes sc-wobble  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes sc-glow    { 0%,100%{box-shadow:0 0 0 0 rgba(250,204,21,.55)} 50%{box-shadow:0 0 0 9px rgba(250,204,21,0)} }
        @keyframes sc-badge   { 0%,100%{transform:scale(1) rotate(-1deg)} 50%{transform:scale(1.07) rotate(1deg)} }

        .sc-cta {
          display:inline-flex; align-items:center; gap:7px;
          background:linear-gradient(135deg,#FDE047,#FACC15);
          color:#1E3A5F;
          font-family:inherit; font-weight:900; font-size:13px;
          letter-spacing:.05em; text-transform:uppercase;
          text-decoration:none;
          padding:10px 22px; border-radius:50px; white-space:nowrap;
          box-shadow:0 4px 0 #B45309, 0 8px 22px rgba(250,204,21,.4);
          transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;
          flex-shrink:0;
          animation:sc-glow 2.5s ease-in-out infinite;
        }
        .sc-cta:hover{
          transform:scale(1.08) translateY(-2px);
          box-shadow:0 6px 0 #B45309, 0 14px 30px rgba(250,204,21,.5);
          animation:none;
        }
        .sc-cta:active{ transform:scale(.97) translateY(2px); box-shadow:0 2px 0 #B45309; }

        .sc-close{
          background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.22);
          cursor:pointer; width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,.7); font-size:14px; font-weight:900;
          flex-shrink:0; transition:background .2s,color .2s;
        }
        .sc-close:hover{ background:rgba(255,255,255,.22); color:#fff; }

        .sc-pill{
          font-size:11px; font-weight:800; color:#FDE047;
          background:rgba(253,224,71,.1); border:1.5px solid rgba(253,224,71,.3);
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
          background:rgba(253,224,71,.15);
          border-color:rgba(253,224,71,.45);
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

      {/* Royal blue → cobalt → deep navy */}
      <div
        style={{
          position:"relative", zIndex:500, overflow:"hidden",
          background: tick
            ? "linear-gradient(90deg,#1E40AF 0%,#2563EB 45%,#1E3A8A 80%,#1E40AF 100%)"
            : "linear-gradient(90deg,#1E3A8A 0%,#1D4ED8 45%,#2563EB 75%,#1E3A8A 100%)",
          transition:"background 0.8s ease",
        }}
      >
        {/* White dot texture */}
        <div aria-hidden style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,.13) 1.5px,transparent 1.5px)",
          backgroundSize:"22px 22px",
        }}/>

        {/* Soft glow orbs */}
        <div aria-hidden style={{ position:"absolute",top:"-70%",left:"12%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,.35),transparent 70%)",pointerEvents:"none" }}/>
        <div aria-hidden style={{ position:"absolute",bottom:"-60%",right:"18%",width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(250,204,21,.2),transparent 70%)",pointerEvents:"none" }}/>

        {/* Sparkles */}
        <Star style={{ top:5,  left:"6%",  color:"#FDE047",             animationDelay:"0s"   }}/>
        <Star style={{ top:7,  left:"19%", color:"rgba(253,224,71,.5)", animationDelay:"0.7s" }}/>
        <Star style={{ bottom:5, left:"44%",color:"rgba(147,197,253,.7)",animationDelay:"1.2s" }}/>
        <Star style={{ top:4,  right:"27%",color:"rgba(253,224,71,.6)", animationDelay:"0.9s" }}/>
        <Star style={{ bottom:6,right:"9%", color:"#FDE047",            animationDelay:"0.4s" }}/>

        {/* ── TOP TICKER ── */}
        <div style={{ background:"rgba(0,0,0,.22)", padding:"3px 0", overflow:"hidden", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display:"flex", animation:"sc-marquee 22s linear infinite", whiteSpace:"nowrap" }}>
            {[...Array(2)].map((_,ri) => (
              <div key={ri} style={{ display:"flex", flexShrink:0 }}>
                {[
                  "☀️ Summer Camp 2026","🎨 Art & Craft","🧮 Abacus & Vedic Maths",
                  "🥋 Karate & Self Defence","🎵 Dance & Music","♟️ Chess & Brain Games",
                  "✍️ Calligraphy","📖 Holiday Homework Help","🧠 Brain Development",
                ].map(item => (
                  <span key={item} style={{
                    fontSize:10, fontWeight:900, letterSpacing:"0.15em",
                    textTransform:"uppercase", color:"#BAE6FD",
                    padding:"0 20px",
                  }}>
                    {item}
                    <span style={{ opacity:.35, margin:"0 6px", color:"#FDE047" }}>✦</span>
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
                background:"linear-gradient(135deg,#FDE047,#F59E0B)",
                borderRadius:10, padding:"5px 13px", flexShrink:0,
                boxShadow:"0 3px 0 #92400E",
                animation:"sc-badge 2.5s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#1E3A5F" }}>
                🔥 LIVE NOW
              </span>
            </div>

            {/* Title */}
            <p
              className="sc-title"
              style={{
                margin:0,
                fontFamily:"'Fredoka One','Nunito',system-ui,cursive",
                fontSize:"clamp(13px,2vw,17px)",
                color:"white",
                whiteSpace:"nowrap",
                overflow:"hidden",
                textOverflow:"ellipsis",
                lineHeight:1.3,
              }}
            >
              <span style={{ display:"inline-block", animation:"sc-wobble 2s ease-in-out infinite" }}>☀️</span>{" "}
              <strong style={{ color:"#FDE047" }}>Dwarka's Biggest Summer Camp</strong>{" "}
              <span style={{ color:"rgba(255,255,255,.75)", fontWeight:700, fontSize:"0.85em" }}>
                is HERE! · Ages 5–15 · Starts 11th May · 8 AM–1 PM
              </span>
            </p>
          </div>

          <div className="sc-right">
            <div className="sc-pills">
              {["🎨 Art","🥋 Karate","🧮 Abacus","🎵 Dance","♟️ Chess"].map(p => (
                <span key={p} className="sc-pill">{p}</span>
              ))}
              <span className="sc-pill" style={{ color:"#BAE6FD", borderColor:"rgba(186,230,253,.3)", background:"rgba(186,230,253,.08)" }}>
                +More!
              </span>
            </div>

            <Link href="/summer-camp" className="sc-cta">Register Free →</Link>

            <button onClick={() => setVisible(false)} className="sc-close" aria-label="Close banner">✕</button>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div className="sc-bottom">
          <div className="sc-info-row">
            {[
              { icon:"📅", text:"Starts 11th May 2026" },
              { icon:"🕗", text:"8:00 AM – 1:00 PM" },
              { icon:"👦", text:"Age 5–15 Years" },
              { icon:"📍", text:"Patel Garden, Dwarka Mor" },
              { icon:"📞", text:"9810366417" },
            ].map(({ icon, text }) => (
              <span key={text} className="sc-info-item" style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.85)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                {icon} {text}
              </span>
            ))}
          </div>

          <div className="sc-social-row">
            <span style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,.4)", letterSpacing:"0.1em", textTransform:"uppercase", marginRight:4 }}>Follow:</span>
            <a href="https://www.instagram.com/ascentoabacus/" target="_blank" rel="noreferrer" className="sc-social">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/ASCENTOABACUS/" target="_blank" rel="noreferrer" className="sc-social">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a href="https://wa.me/919810366417" target="_blank" rel="noreferrer" className="sc-social">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}