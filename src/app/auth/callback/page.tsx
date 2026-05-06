// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// export default function Callback() {
//   const router = useRouter();

//   useEffect(() => {
//     const handleAuth = async () => {
//       const { data, error } = await supabase.auth.getSession();

//       if (error || !data.session) {
//         router.replace("/login");
//         return;
//       }

//       const session = data.session;

//       // ✅ 🔥 THIS IS THE MISSING PART
//       if (session?.access_token) {
//         await fetch("/api/auth/upsert-user", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${session.access_token}`,
//           },
//         });
//       }

//       // ✅ redirect after saving
//       router.replace("/profile");
//     };

//     handleAuth();
//   }, [router]);

//   return <p>Logging you in...</p>;
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying your session...");

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/login");
        return;
      }

      const session = data.session;

      setStatus("Setting up your account...");

      if (session?.access_token) {
        await fetch("/api/auth/upsert-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }

      setStatus("Almost there...");

      setTimeout(() => {
        router.replace("/profile");
      }, 800);
    };

    handleAuth();
  }, [router]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-10px); opacity: 1; }
        }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(54px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(54px) rotate(-360deg); }
        }

        .cb-wrap {
          min-height: 100vh;
          background: linear-gradient(160deg, #FFFDF7 0%, #FFF0E8 50%, #FFFDF7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* background dot grid */
        .cb-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #FFB347 1.5px, transparent 1.5px);
          background-size: 36px 36px;
          opacity: 0.12;
          pointer-events: none;
        }

        /* floating bg blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.18;
        }
        .blob-1 {
          width: 320px; height: 320px;
          background: #FF6B6B;
          top: -80px; left: -80px;
          animation: float 6s ease-in-out infinite;
        }
        .blob-2 {
          width: 260px; height: 260px;
          background: #FFB347;
          bottom: -60px; right: -60px;
          animation: float 8s ease-in-out infinite reverse;
        }
        .blob-3 {
          width: 180px; height: 180px;
          background: #4ECDC4;
          top: 40%; left: 10%;
          animation: float 7s ease-in-out infinite 1s;
        }

        .cb-card {
          position: relative;
          z-index: 1;
          background: #FFFFFF;
          border-radius: 32px;
          padding: 56px 52px 48px;
          box-shadow: 0 24px 80px rgba(255, 107, 107, 0.12), 0 4px 24px rgba(0,0,0,0.06);
          border: 1.5px solid #FFF0E8;
          text-align: center;
          width: 100%;
          max-width: 420px;
          animation: fadeIn 0.6s ease both;
        }

        /* logo icon with pulse ring */
        .logo-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
        }
        .pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          border: 3px solid #FF6B6B;
          animation: pulse-ring 1.6s ease-out infinite;
        }
        .pulse-ring-2 {
          animation-delay: 0.8s;
        }
        .logo-icon {
          width: 80px; height: 80px;
          border-radius: 24px;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
          display: flex; align-items: center; justify-content: center;
          font-size: 38px;
          box-shadow: 0 12px 40px rgba(255, 107, 107, 0.35);
          animation: float 3s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        /* orbit dot */
        .orbit-dot {
          position: absolute;
          top: 50%; left: 50%;
          width: 12px; height: 12px;
          margin-top: -6px; margin-left: -6px;
          border-radius: 50%;
          background: #FFB347;
          box-shadow: 0 0 8px #FFB347;
          animation: orbit 2s linear infinite;
        }

        .brand-title {
          font-family: 'Fredoka One', cursive;
          font-size: 32px;
          color: #1A1A2E;
          line-height: 1;
          margin-bottom: 6px;
        }
        .brand-title span { color: #FF6B6B; }

        .brand-sub {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #BBB;
          margin-bottom: 36px;
        }

        /* shimmer progress bar */
        .progress-track {
          width: 100%;
          height: 6px;
          background: #FFF0E8;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 28px;
        }
        .progress-bar {
          height: 100%;
          width: 60%;
          border-radius: 10px;
          background: linear-gradient(90deg, #FF6B6B, #FFB347, #FF6B6B);
          background-size: 400px 100%;
          animation: shimmer 1.4s linear infinite;
        }

        /* bouncing dots */
        .dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
        }
        .dot:nth-child(1) { animation: dot-bounce 1.2s ease infinite 0s; }
        .dot:nth-child(2) { animation: dot-bounce 1.2s ease infinite 0.15s; }
        .dot:nth-child(3) { animation: dot-bounce 1.2s ease infinite 0.3s; }
        .dot:nth-child(4) { animation: dot-bounce 1.2s ease infinite 0.45s; }

        .status-text {
          font-size: 15px;
          font-weight: 700;
          color: #888;
          min-height: 22px;
          transition: opacity 0.3s;
        }

        /* small emoji decorations */
        .deco {
          position: absolute;
          font-size: 28px;
          pointer-events: none;
          opacity: 0.5;
        }
        .deco-1 { top: 18px; left: 22px; animation: float 4s ease-in-out infinite; }
        .deco-2 { top: 18px; right: 22px; animation: float 5s ease-in-out infinite 0.5s; }
        .deco-3 { bottom: 18px; left: 22px; animation: float 4.5s ease-in-out infinite 1s; }
        .deco-4 { bottom: 18px; right: 22px; animation: float 3.5s ease-in-out infinite 0.3s; }
      `}</style>

      <div className="cb-wrap">
        {/* background blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="cb-card">
          {/* corner decorations */}
          <span className="deco deco-1">🧮</span>
          <span className="deco deco-2">✨</span>
          <span className="deco deco-3">🎯</span>
          <span className="deco deco-4">🧠</span>

          {/* Logo */}
          <div className="logo-wrap">
            <div className="pulse-ring" />
            <div className="pulse-ring pulse-ring-2" />
            <div className="logo-icon">🧮</div>
            <div className="orbit-dot" />
          </div>

          {/* Brand */}
          <div className="brand-title">
            Ascento <span>Abacus</span>
          </div>
          <div className="brand-sub">Brain Development Academy</div>

          {/* Progress */}
          <div className="progress-track">
            <div className="progress-bar" />
          </div>

          {/* Bouncing dots */}
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>

          {/* Status message */}
          <div className="status-text">{status}</div>
        </div>
      </div>
    </>
  );
}