



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabaseClient";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import Link from "next/link";

// export default function RegisterPage() {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleRegister = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             setLoading(false);
//             return;
//         }

//         try {
//             const { error } = await supabase.auth.signUp({
//                 email,
//                 password,
//                 options: {
//                     data: {
//                         name,       // stored in user_metadata.name
//                         role: "user" // stored in user_metadata.role
//                     }
//                 }
//             });

//             if (error) throw error;

//             router.push("/profile");
//         } catch (err: any) {
//             console.error("Registration Error:", err);
//             setError(err.message || "Registration failed. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGoogleSignUp = async () => {
//         setLoading(true);
//         setError("");

//         try {
//             const { error } = await supabase.auth.signInWithOAuth({
//                 provider: "google",
//                 options: {
//                     redirectTo: `${window.location.origin}/auth/callback`,
//                 },
//             });

//             if (error) throw error;
//             // Redirect handled automatically by Supabase OAuth flow
//         } catch (err: any) {
//             console.error("Google Sign-Up Error:", err);
//             setError(err.message || "Google Sign-Up failed.");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
//             <Navbar />
//             <div className="flex-grow flex items-center justify-center px-4 py-12 text-[#0e141b]">
//                 <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
//                     <div className="text-center mb-10">
//                         <div className="inline-flex items-center justify-center w-16 h-16 bg-[#197fe6]/10 text-[#197fe6] rounded-2xl mb-6">
//                             <span className="material-symbols-outlined text-3xl font-bold">person_add</span>
//                         </div>
//                         <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Sign Up</h1>
//                         <p className="text-slate-500 dark:text-slate-400 font-medium italic">Create your new account</p>
//                     </div>

//                     {error && (
//                         <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold border border-red-100 dark:border-red-800 animate-shake">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleRegister} className="space-y-4">
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Proprietor Name</label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
//                                 placeholder="e.g. Rahul Sharma"
//                             />
//                         </div>
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Email Address</label>
//                             <input
//                                 type="email"
//                                 required
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
//                                 placeholder="rahul@example.com"
//                             />
//                         </div>
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Password</label>
//                             <input
//                                 type="password"
//                                 required
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
//                                 placeholder="••••••••"
//                             />
//                         </div>
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Verify Password</label>
//                             <input
//                                 type="password"
//                                 required
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
//                                 placeholder="••••••••"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-[#197fe6] hover:bg-[#197fe6]/90 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#197fe6]/20 flex items-center justify-center gap-2 mt-4 transform active:scale-95"
//                         >
//                             {loading ? (
//                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                             ) : (
//                                 "Create Account"
//                             )}
//                         </button>

//                         <div className="relative my-8">
//                             <div className="absolute inset-0 flex items-center">
//                                 <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
//                             </div>
//                             <div className="relative flex justify-center text-xs uppercase">
//                                 <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
//                             </div>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={handleGoogleSignUp}
//                             disabled={loading}
//                             className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 transform active:scale-95"
//                         >
//                             <svg className="w-5 h-5" viewBox="0 0 24 24">
//                                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
//                                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//                             </svg>
//                             Sign Up with Google
//                         </button>
//                     </form>

//                     <div className="mt-8 text-center text-sm text-slate-500">
//                         Already have access?{" "}
//                         <Link href="/login" className="text-[#197fe6] font-bold hover:underline">Sign In</Link>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );

// }








// "use client";

// // app/register/page.tsx
// // ─────────────────────────────────────────────────────────────────
// // Ascento-branded register page (Supabase + Prisma)
// // ─────────────────────────────────────────────────────────────────

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import Link from "next/link";

// async function upsertUserToDB(accessToken: string) {
//   try {
//     await fetch("/api/auth/upsert-user", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//   } catch (e) {
//     console.error("DB upsert failed:", e);
//   }
// }

// export default function RegisterPage() {
//   const [name, setName]                   = useState("");
//   const [email, setEmail]                 = useState("");
//   const [password, setPassword]           = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError]                 = useState("");
//   const [loading, setLoading]             = useState(false);
//   const [showPw, setShowPw]               = useState(false);
//   const [success, setSuccess]             = useState(false);
//   const router = useRouter();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: { name, role: "user" },
//         },
//       });

//       if (error) throw error;

//       // Sync to Prisma users table
//       if (data.session?.access_token) {
//         await upsertUserToDB(data.session.access_token);
//         router.push("/profile");
//       } else {
//         // Email confirmation required
//         setSuccess(true);
//       }
//     } catch (err: any) {
//       setError(err.message || "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: { redirectTo: `${window.location.origin}/auth/callback` },
//       });
//       if (error) throw error;
//     } catch (err: any) {
//       setError(err.message || "Google Sign-Up failed.");
//       setLoading(false);
//     }
//   };

//   /* Password strength */
//   const strength = password.length === 0 ? 0
//     : password.length < 6 ? 1
//     : password.length < 10 ? 2
//     : 3;
//   const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
//   const strengthColor = ["", "#FF4444", "#FFB347", "#4ECDC4"][strength];

//   if (success) {

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/helpers/supabaseClient";
import Link from "next/link";

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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.access_token) {
          await upsertUserToDB(session.access_token);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      if (data.session?.access_token) {
        await upsertUserToDB(data.session.access_token);
        router.push("/profile");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google Sign-Up failed.");
      setLoading(false);
    }
  };

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10
      ? 2
      : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#FF4444", "#FFB347", "#4ECDC4"][strength];

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap');
          .login-page { min-height:100vh; background:#FFFDF7; display:flex; align-items:center; justify-content:center; font-family:'Nunito',system-ui,sans-serif; }
          .success-card { background:white; border-radius:32px; padding:56px 44px; text-align:center; max-width:440px; width:100%; box-shadow:0 24px 80px rgba(78,205,196,.15); border:2px solid rgba(78,205,196,.15); }
        `}</style>
        <div className="login-page">
          <div className="success-card">
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 32, color: "#1A1A2E", marginBottom: 12 }}>
              You're In!
            </h2>
            <p style={{ color: "#777", fontSize: 15, lineHeight: 1.6, fontWeight: 700 }}>
              We've sent a confirmation email to{" "}
              <strong style={{ color: "#1A1A2E" }}>{email}</strong>.<br />
              Click the link to activate your account.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block", marginTop: 28, padding: "14px 36px",
                borderRadius: 50, background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
                color: "white", fontFamily: "'Fredoka One',cursive", fontSize: 18, textDecoration: "none",
              }}
            >
              Go to Login →
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ✅ MAIN REGISTER FORM
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

        .login-page {
          min-height: 100vh;
          background: #FFFDF7;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
          position: relative; overflow: hidden;
          font-family: 'Nunito', system-ui, sans-serif;
        }
        .login-blob { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; }
        .login-card {
          position:relative; z-index:1; width:100%; max-width:480px;
          background:white; border-radius:32px; padding:44px 44px;
          box-shadow:0 24px 80px rgba(167,139,250,.12), 0 4px 20px rgba(0,0,0,.06);
          border:2px solid rgba(167,139,250,.1);
        }
        .login-icon { width:72px; height:72px; border-radius:22px; background:linear-gradient(135deg,#A78BFA,#7C3AED); display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto 20px; box-shadow:0 12px 32px rgba(167,139,250,.4); }
        .login-title { font-family:'Fredoka One',cursive; font-size:34px; color:#1A1A2E; text-align:center; margin-bottom:6px; line-height:1.1; }
        .login-subtitle { font-size:14px; color:#999; text-align:center; font-weight:700; margin-bottom:28px; }
        .login-error { background:#FFF0F0; border:2px solid #FFD6D6; color:#FF4444; border-radius:14px; padding:12px 16px; font-size:13px; font-weight:800; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
        .login-field { margin-bottom:16px; }
        .login-label { display:block; font-size:10px; font-weight:900; letter-spacing:0.14em; text-transform:uppercase; color:#A78BFA; margin-bottom:8px; margin-left:4px; }
        .login-input-wrap { position:relative; }
        .login-input-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px; pointer-events:none; }
        .login-input { width:100%; padding:14px 16px 14px 46px; border-radius:14px; border:2.5px solid #F0EDE8; background:#FFFDF7; font-family:inherit; font-size:14px; font-weight:700; color:#1A1A2E; outline:none; transition:border-color .2s, box-shadow .2s; box-sizing:border-box; }
        .login-input:focus { border-color:#A78BFA; box-shadow:0 0 0 4px rgba(167,139,250,.10); }
        .login-input::placeholder { color:#CCC; font-weight:600; }
        .pw-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:18px; color:#999; padding:4px; }
        .pw-strength { display:flex; align-items:center; gap:8px; margin-top:6px; margin-left:4px; }
        .pw-bar { flex:1; height:4px; border-radius:2px; background:#F0EDE8; overflow:hidden; }
        .pw-bar-fill { height:100%; border-radius:2px; transition:width .3s, background .3s; }
        .pw-label { font-size:10px; font-weight:900; letter-spacing:0.1em; text-transform:uppercase; }
        .login-submit { width:100%; padding:15px; border-radius:50px; border:none; background:linear-gradient(135deg,#A78BFA,#7C3AED); color:white; font-family:'Fredoka One',cursive; font-size:18px; cursor:pointer; box-shadow:0 8px 24px rgba(167,139,250,.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); display:flex; align-items:center; justify-content:center; gap:10px; margin-top:8px; }
        .login-submit:hover:not(:disabled) { transform:scale(1.04) translateY(-2px); box-shadow:0 14px 32px rgba(167,139,250,.5); }
        .login-submit:disabled { opacity:.65; cursor:not-allowed; }
        .login-divider { display:flex; align-items:center; gap:14px; margin:22px 0; }
        .login-divider-line { flex:1; height:1.5px; background:#F0EDE8; }
        .login-divider-text { font-size:11px; font-weight:900; letter-spacing:0.12em; text-transform:uppercase; color:#CCC; white-space:nowrap; }
        .login-google { width:100%; padding:13px; border-radius:50px; border:2.5px solid #F0EDE8; background:white; font-family:inherit; font-size:15px; font-weight:800; color:#1A1A2E; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:all .25s; }
        .login-google:hover:not(:disabled) { border-color:#A78BFA; box-shadow:0 4px 16px rgba(167,139,250,.2); transform:translateY(-2px); }
        .login-google:disabled { opacity:.65; cursor:not-allowed; }
        .login-footer { margin-top:24px; text-align:center; font-size:13px; color:#999; font-weight:700; }
        .login-footer a { color:#A78BFA; font-weight:900; text-decoration:none; }
        .login-footer a:hover { text-decoration:underline; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width:20px; height:20px; border:3px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
      `}</style>

      <div className="login-page">
        <div className="login-blob" style={{ width: 400, height: 400, background: "#EDE7FF", top: "-15%", right: "-8%", opacity: 0.6 }} />
        <div className="login-blob" style={{ width: 300, height: 300, background: "#FFE0E0", bottom: "-8%", left: "-6%", opacity: 0.5 }} />

        <div className="login-card">
          <div className="login-icon">🌟</div>
          <h1 className="login-title">Join Ascento!</h1>
          <p className="login-subtitle">Create your free account today</p>

          {error && <div className="login-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleRegister}>
            <div className="login-field">
              <label className="login-label">Full Name</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="login-input" placeholder="e.g. Priya Sharma" />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">📧</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="login-input" placeholder="name@example.com" />
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
                  onChange={e => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Min. 6 characters"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {password.length > 0 && (
                <div className="pw-strength">
                  <div className="pw-bar">
                    <div className="pw-bar-fill" style={{ width: `${(strength / 3) * 100}%`, background: strengthColor }} />
                  </div>
                  <span className="pw-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="login-field">
              <label className="login-label">Confirm Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✅</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="login-input"
                  placeholder="Repeat your password"
                  style={confirmPassword && confirmPassword !== password ? { borderColor: "#FF4444" } : {}}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: 11, color: "#FF4444", fontWeight: 800, marginTop: 4, marginLeft: 4 }}>
                  Passwords don't match
                </p>
              )}
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? <div className="spinner" /> : <>🚀 Create Account</>}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or sign up with</span>
            <div className="login-divider-line" />
          </div>

          <button className="login-google" onClick={handleGoogleSignUp} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign Up with Google
          </button>

          <div className="login-footer">
            Already have an account?{" "}
            <Link href="/login">Sign In 🎉</Link>
          </div>
        </div>
      </div>
    </>
  );
}