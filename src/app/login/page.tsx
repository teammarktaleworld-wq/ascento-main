



// "use client";

// // app/login/page.tsx
// // ─────────────────────────────────────────────────────────────────
// // Ascento-branded login page — now calls /api/auth/login
// // so the same endpoint works for Flutter too.
// // ─────────────────────────────────────────────────────────────────

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import Link from "next/link";

// // ─── Call our unified login API ───────────────────────────────────────────────
// interface LoginResult {
//   access_token: string;
//   refresh_token: string;
//   expires_in: number;
//   user: {
//     id: string;
//     email: string;
//     name: string;
//     role: string;
//     avatarUrl: string | null;
//   };
// }

// async function callLoginApi(email: string, password: string): Promise<LoginResult> {
//   const res = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const json = await res.json();
//   if (!res.ok) throw new Error(json.error ?? "Login failed");
//   return json as LoginResult;
// }

// export default function LoginPage() {
//   const [email, setEmail]       = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError]       = useState("");
//   const [loading, setLoading]   = useState(false);
//   const [showPw, setShowPw]     = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // ── 1. Call unified API (same one Flutter uses) ────────────────────────
//       const result = await callLoginApi(email.trim(), password);

//       // ── 2. Hydrate Supabase client session so existing hooks/middleware work
//       //       (setSession accepts the tokens returned by our API)
//       await supabase.auth.setSession({
//         access_token: result.access_token,
//         refresh_token: result.refresh_token,
//       });

//       // ── 3. Route by role ───────────────────────────────────────────────────
//       router.push(result.user.role === "admin" ? "/admin" : "/profile");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Invalid email or password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: { redirectTo: `${window.location.origin}/auth/callback` },
//       });
//       if (error) throw error;
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Google Sign-In failed.");
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

//         .login-page {
//           min-height: 100vh;
//           background: #FFFDF7;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 40px 20px;
//           position: relative;
//           overflow: hidden;
//           font-family: 'Nunito', system-ui, sans-serif;
//         }
//         .login-blob {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(80px);
//           pointer-events: none;
//           z-index: 0;
//         }
//         .login-card {
//           position: relative;
//           z-index: 1;
//           width: 100%;
//           max-width: 460px;
//           background: white;
//           border-radius: 32px;
//           padding: 48px 44px;
//           box-shadow: 0 24px 80px rgba(255,107,107,.12), 0 4px 20px rgba(0,0,0,.06);
//           border: 2px solid rgba(255,107,107,.08);
//         }
//         .login-icon {
//           width: 72px; height: 72px;
//           border-radius: 22px;
//           background: linear-gradient(135deg, #FF6B6B, #FFB347);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 36px;
//           margin: 0 auto 20px;
//           box-shadow: 0 12px 32px rgba(255,107,107,.35);
//         }
//         .login-title {
//           font-family: 'Fredoka One', cursive;
//           font-size: 34px;
//           color: #1A1A2E;
//           text-align: center;
//           margin-bottom: 6px;
//           line-height: 1.1;
//         }
//         .login-subtitle {
//           font-size: 14px;
//           color: #999;
//           text-align: center;
//           font-weight: 700;
//           margin-bottom: 32px;
//         }
//         .login-error {
//           background: #FFF0F0;
//           border: 2px solid #FFD6D6;
//           color: #FF4444;
//           border-radius: 14px;
//           padding: 12px 16px;
//           font-size: 13px;
//           font-weight: 800;
//           margin-bottom: 20px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .login-field { margin-bottom: 18px; }
//         .login-label {
//           display: block;
//           font-size: 10px;
//           font-weight: 900;
//           letter-spacing: 0.14em;
//           text-transform: uppercase;
//           color: #FF6B6B;
//           margin-bottom: 8px;
//           margin-left: 4px;
//         }
//         .login-input-wrap { position: relative; }
//         .login-input-icon {
//           position: absolute; left: 16px; top: 50%;
//           transform: translateY(-50%);
//           font-size: 18px; pointer-events: none;
//         }
//         .login-input {
//           width: 100%;
//           padding: 14px 16px 14px 46px;
//           border-radius: 14px;
//           border: 2.5px solid #F0EDE8;
//           background: #FFFDF7;
//           font-family: inherit;
//           font-size: 14px;
//           font-weight: 700;
//           color: #1A1A2E;
//           outline: none;
//           transition: border-color .2s, box-shadow .2s;
//           box-sizing: border-box;
//         }
//         .login-input:focus {
//           border-color: #FF6B6B;
//           box-shadow: 0 0 0 4px rgba(255,107,107,.10);
//         }
//         .login-input::placeholder { color: #CCC; font-weight: 600; }
//         .pw-toggle {
//           position: absolute; right: 14px; top: 50%;
//           transform: translateY(-50%);
//           background: none; border: none; cursor: pointer;
//           font-size: 18px; color: #999;
//           padding: 4px;
//         }
//         .login-submit {
//           width: 100%;
//           padding: 15px;
//           border-radius: 50px;
//           border: none;
//           background: linear-gradient(135deg, #FF6B6B, #FF8E53);
//           color: white;
//           font-family: 'Fredoka One', cursive;
//           font-size: 18px;
//           cursor: pointer;
//           box-shadow: 0 8px 24px rgba(255,107,107,.4);
//           transition: all .3s cubic-bezier(.34,1.56,.64,1);
//           display: flex; align-items: center; justify-content: center; gap: 10px;
//           margin-top: 8px;
//         }
//         .login-submit:hover:not(:disabled) {
//           transform: scale(1.04) translateY(-2px);
//           box-shadow: 0 14px 32px rgba(255,107,107,.5);
//         }
//         .login-submit:disabled { opacity: .65; cursor: not-allowed; }
//         .login-divider {
//           display: flex; align-items: center; gap: 14px;
//           margin: 24px 0;
//         }
//         .login-divider-line { flex: 1; height: 1.5px; background: #F0EDE8; }
//         .login-divider-text {
//           font-size: 11px; font-weight: 900; letter-spacing: 0.12em;
//           text-transform: uppercase; color: #CCC;
//           white-space: nowrap;
//         }
//         .login-google {
//           width: 100%;
//           padding: 13px;
//           border-radius: 50px;
//           border: 2.5px solid #F0EDE8;
//           background: white;
//           font-family: inherit;
//           font-size: 15px;
//           font-weight: 800;
//           color: #1A1A2E;
//           cursor: pointer;
//           display: flex; align-items: center; justify-content: center; gap: 10px;
//           transition: all .25s;
//         }
//         .login-google:hover:not(:disabled) {
//           border-color: #FFB347;
//           box-shadow: 0 4px 16px rgba(255,179,71,.2);
//           transform: translateY(-2px);
//         }
//         .login-google:disabled { opacity: .65; cursor: not-allowed; }
//         .login-footer {
//           margin-top: 28px;
//           text-align: center;
//           font-size: 13px;
//           color: #999;
//           font-weight: 700;
//         }
//         .login-footer a {
//           color: #FF6B6B;
//           font-weight: 900;
//           text-decoration: none;
//         }
//         .login-footer a:hover { text-decoration: underline; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .spinner {
//           width: 20px; height: 20px;
//           border: 3px solid rgba(255,255,255,.3);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin .7s linear infinite;
//         }
//       `}</style>

//       <div className="login-page">
//         <div className="login-blob" style={{ width: 500, height: 500, background: "#FFE0E0", top: "-15%", right: "-10%", opacity: 0.5 }} />
//         <div className="login-blob" style={{ width: 350, height: 350, background: "#E0F7FA", bottom: "-10%", left: "-8%", opacity: 0.5 }} />
//         <div className="login-blob" style={{ width: 200, height: 200, background: "#EDE7FF", top: "40%", left: "5%", opacity: 0.4 }} />

//         <div className="login-card">
//           <div className="login-icon">🔑</div>
//           <h1 className="login-title">Welcome Back!</h1>
//           <p className="login-subtitle">Sign in to your Ascento account</p>

//           {error && (
//             <div className="login-error">
//               <span>⚠️</span> {error}
//             </div>
//           )}

//           <form onSubmit={handleLogin}>
//             <div className="login-field">
//               <label className="login-label">Email Address</label>
//               <div className="login-input-wrap">
//                 <span className="login-input-icon">📧</span>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="login-input"
//                   placeholder="name@example.com"
//                 />
//               </div>
//             </div>

//             <div className="login-field">
//               <label className="login-label">Password</label>
//               <div className="login-input-wrap">
//                 <span className="login-input-icon">🔒</span>
//                 <input
//                   type={showPw ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="login-input"
//                   placeholder="••••••••"
//                 />
//                 <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
//                   {showPw ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
//               <Link href="/forgot-password" style={{ fontSize: 12, fontWeight: 800, color: "#FF6B6B", textDecoration: "none" }}>
//                 Forgot password?
//               </Link>
//             </div>

//             <button type="submit" className="login-submit" disabled={loading}>
//               {loading ? <div className="spinner" /> : <>🎉 Sign In</>}
//             </button>
//           </form>

//           <div className="login-divider">
//             <div className="login-divider-line" />
//             <span className="login-divider-text">or continue with</span>
//             <div className="login-divider-line" />
//           </div>

//           <button className="login-google" onClick={handleGoogleLogin} disabled={loading}>
//             <svg width="20" height="20" viewBox="0 0 24 24">
//               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
//               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//             </svg>
//             Continue with Google
//           </button>

//           <div className="login-footer">
//             Don't have an account?{" "}
//             <Link href="/register">Sign Up Free 🚀</Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }










"use client";

// app/login/page.tsx
// ─────────────────────────────────────────────────────────────────
// Ascento-branded login page — calls /api/auth/login to authenticate,
// then /api/auth/upsert-user to sync the user to DB.
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/helpers/supabaseClient";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoginResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl: string | null;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function callLoginApi(email: string, password: string): Promise<LoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Login failed");
  return json as LoginResult;
}

async function upsertUserToDB(accessToken: string) {
  try {
    await fetch("/api/auth/upsert-user", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    console.error("DB upsert failed:", e);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ── 1. Authenticate ──────────────────────────────────────────────────
      const result = await callLoginApi(email.trim(), password);

      // ── 2. Sync user to DB (non-blocking; mirrors what register does) ────
      await upsertUserToDB(result.access_token);

      // ── 3. Hydrate Supabase client session so hooks/middleware work ───────
      await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });

      // ── 4. Route by role ─────────────────────────────────────────────────
      router.push(result.user.role === "admin" ? "/admin" : "/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google Sign-In failed.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

        .login-page {
          min-height: 100vh;
          background: #FFFDF7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', system-ui, sans-serif;
        }
        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
          background: white;
          border-radius: 32px;
          padding: 48px 44px;
          box-shadow: 0 24px 80px rgba(255,107,107,.12), 0 4px 20px rgba(0,0,0,.06);
          border: 2px solid rgba(255,107,107,.08);
        }
        .login-icon {
          width: 72px; height: 72px;
          border-radius: 22px;
          background: linear-gradient(135deg, #FF6B6B, #FFB347);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin: 0 auto 20px;
          box-shadow: 0 12px 32px rgba(255,107,107,.35);
        }
        .login-title {
          font-family: 'Fredoka One', cursive;
          font-size: 34px;
          color: #1A1A2E;
          text-align: center;
          margin-bottom: 6px;
          line-height: 1.1;
        }
        .login-subtitle {
          font-size: 14px;
          color: #999;
          text-align: center;
          font-weight: 700;
          margin-bottom: 32px;
        }
        .login-error {
          background: #FFF0F0;
          border: 2px solid #FFD6D6;
          color: #FF4444;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-field { margin-bottom: 18px; }
        .login-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FF6B6B;
          margin-bottom: 8px;
          margin-left: 4px;
        }
        .login-input-wrap { position: relative; }
        .login-input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 18px; pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border-radius: 14px;
          border: 2.5px solid #F0EDE8;
          background: #FFFDF7;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          color: #1A1A2E;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #FF6B6B;
          box-shadow: 0 0 0 4px rgba(255,107,107,.10);
        }
        .login-input::placeholder { color: #CCC; font-weight: 600; }
        .pw-toggle {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 18px; color: #999;
          padding: 4px;
        }
        .login-submit {
          width: 100%;
          padding: 15px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          color: white;
          font-family: 'Fredoka One', cursive;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(255,107,107,.4);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 8px;
        }
        .login-submit:hover:not(:disabled) {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 14px 32px rgba(255,107,107,.5);
        }
        .login-submit:disabled { opacity: .65; cursor: not-allowed; }
        .login-divider {
          display: flex; align-items: center; gap: 14px;
          margin: 24px 0;
        }
        .login-divider-line { flex: 1; height: 1.5px; background: #F0EDE8; }
        .login-divider-text {
          font-size: 11px; font-weight: 900; letter-spacing: 0.12em;
          text-transform: uppercase; color: #CCC;
          white-space: nowrap;
        }
        .login-google {
          width: 100%;
          padding: 13px;
          border-radius: 50px;
          border: 2.5px solid #F0EDE8;
          background: white;
          font-family: inherit;
          font-size: 15px;
          font-weight: 800;
          color: #1A1A2E;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all .25s;
        }
        .login-google:hover:not(:disabled) {
          border-color: #FFB347;
          box-shadow: 0 4px 16px rgba(255,179,71,.2);
          transform: translateY(-2px);
        }
        .login-google:disabled { opacity: .65; cursor: not-allowed; }
        .login-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: #999;
          font-weight: 700;
        }
        .login-footer a {
          color: #FF6B6B;
          font-weight: 900;
          text-decoration: none;
        }
        .login-footer a:hover { text-decoration: underline; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 20px; height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
      `}</style>

      <div className="login-page">
        <div className="login-blob" style={{ width: 500, height: 500, background: "#FFE0E0", top: "-15%", right: "-10%", opacity: 0.5 }} />
        <div className="login-blob" style={{ width: 350, height: 350, background: "#E0F7FA", bottom: "-10%", left: "-8%", opacity: 0.5 }} />
        <div className="login-blob" style={{ width: 200, height: 200, background: "#EDE7FF", top: "40%", left: "5%", opacity: 0.4 }} />

        <div className="login-card">
          <div className="login-icon">🔑</div>
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Sign in to your Ascento account</p>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">📧</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
              <Link href="/forgot-password" style={{ fontSize: 12, fontWeight: 800, color: "#FF6B6B", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? <div className="spinner" /> : <>🎉 Sign In</>}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or continue with</span>
            <div className="login-divider-line" />
          </div>

          <button className="login-google" onClick={handleGoogleLogin} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="login-footer">
            Don't have an account?{" "}
            <Link href="/register">Sign Up Free 🚀</Link>
          </div>
        </div>
      </div>
    </>
  );
}




