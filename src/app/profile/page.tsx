


// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "../../lib/supabaseClient";
// import { useRouter } from "next/navigation";
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   Shield, 
//   Calendar, 
//   Camera, 
//   Loader2, 
//   CheckCircle2, 
//   AlertCircle,
//   LogOut,
//   ChevronRight
// } from "lucide-react";

// export default function ProfilePage() {
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });
//     const router = useRouter();

//     // Form states
//     const [name, setName] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");

//     useEffect(() => {
//         const getUser = async () => {
//             const { data: { user } } = await supabase.auth.getUser();

//             if (!user) {
//                 router.push("/login");
//                 return;
//             }

//             setUser(user);
//             setName(user.user_metadata?.name || "");
//             setPhoneNumber(user.user_metadata?.phone || "");
//             setLoading(false);
//         };

//         getUser();

//         const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//             if (!session?.user) {
//                 router.push("/login");
//             }
//         });

//         return () => listener.subscription.unsubscribe();
//     }, [router]);

//     const handleUpdateProfile = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!user) return;

//         setSaving(true);
//         setMessage({ type: "", text: "" });

//         try {
//             const { error } = await supabase.auth.updateUser({
//                 data: {
//                     name,
//                     phone: phoneNumber,
//                 }
//             });

//             if (error) throw error;

//             // Refresh local user state
//             const { data: { user: updatedUser } } = await supabase.auth.getUser();
//             setUser(updatedUser);

//             setMessage({ type: "success", text: "Profile updated successfully!" });
//         } catch (err: any) {
//             console.error("Update error:", err);
//             setMessage({ type: "error", text: err.message || "Failed to update profile." });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleSignOut = async () => {
//         await supabase.auth.signOut();
//         router.push("/");
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//                 <Loader2 className="w-12 h-12 text-[#197fe6] animate-spin" />
//             </div>
//         );
//     }

//     const role = user?.user_metadata?.role || "User";
//     const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently";

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
//             {/* <Navbar /> */}
            
//             <main className="flex-grow py-20 px-4">
//                 <div className="max-w-4xl mx-auto">
//                     {/* Header Card */}
//                     <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 overflow-hidden relative">
//                         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#197fe6]/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        
//                         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
//                             <div className="relative group">
//                                 <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#197fe6] to-[#4f46e5] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#197fe6]/20">
//                                     {name[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
//                                 </div>
//                                 <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all text-[#197fe6]">
//                                     <Camera size={20} />
//                                 </button>
//                             </div>
                            
//                             <div className="text-center md:text-left">
//                                 <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{name || "User Name"}</h1>
//                                 <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
//                                     <Mail size={16} /> {user?.email}
//                                 </p>
//                                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
//                                     <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
//                                         <Shield size={14} className="text-[#197fe6]" />
//                                         {role}
//                                     </span>
//                                     <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
//                                         <Calendar size={14} className="text-orange-500" />
//                                         Joined {createdAt}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                         {/* Sidebar */}
//                         <div className="space-y-6">
//                             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
//                                 <h3 className="text-slate-900 dark:text-white font-bold mb-4 px-2">Account Settings</h3>
//                                 <div className="space-y-1">
//                                     <button className="w-full flex items-center justify-between px-4 py-3 bg-[#197fe6]/5 text-[#197fe6] rounded-2xl font-bold transition-all">
//                                         <span className="flex items-center gap-3"><User size={20} /> Profile Information</span>
//                                         <ChevronRight size={16} />
//                                     </button>
//                                     <button className="w-full flex items-center justify-between px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl font-bold transition-all">
//                                         <span className="flex items-center gap-3"><Shield size={20} /> Security & Privacy</span>
//                                         <ChevronRight size={16} />
//                                     </button>
//                                 </div>
//                                 <hr className="my-4 border-slate-100 dark:border-slate-800" />
//                                 <button 
//                                     onClick={handleSignOut}
//                                     className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all"
//                                 >
//                                     <LogOut size={20} /> Sign Out
//                                 </button>
//                             </div>

//                             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
//                                 <div className="relative z-10">
//                                     <h3 className="text-xl font-bold mb-2">Become a Franchise?</h3>
//                                     <p className="text-slate-400 text-sm mb-6 font-medium">Start your own Ascento Abacus center and shape the future of learning.</p>
//                                     <button 
//                                         onClick={() => router.push('/franchise')}
//                                         className="w-full py-3 bg-[#197fe6] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#197fe6]/30 hover:scale-105 active:scale-95 transition-all"
//                                     >
//                                         Learn More
//                                     </button>
//                                 </div>
//                                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#197fe6]/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
//                             </div>
//                         </div>

//                         {/* Main Form */}
//                         <div className="lg:col-span-2">
//                             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
//                                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Personal Details</h3>
                                
//                                 {message.text && (
//                                     <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border ${
//                                         message.type === 'success' 
//                                         ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
//                                         : 'bg-red-50 border-red-100 text-red-600'
//                                     }`}>
//                                         {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
//                                         {message.text}
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleUpdateProfile} className="space-y-6">
//                                     <div className="space-y-4">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div className="space-y-2">
//                                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
//                                                 <div className="relative group">
//                                                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#197fe6] transition-colors" size={20} />
//                                                     <input 
//                                                         type="text" 
//                                                         value={name}
//                                                         onChange={(e) => setName(e.target.value)}
//                                                         className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] outline-none transition-all font-medium"
//                                                         placeholder="Your full name"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
//                                                 <div className="relative group opacity-60">
//                                                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                                                     <input 
//                                                         type="email" 
//                                                         value={user?.email || ""} 
//                                                         disabled
//                                                         className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 outline-none font-medium cursor-not-allowed"
//                                                     />
//                                                 </div>
//                                                 <p className="text-[10px] text-slate-400 font-bold uppercase ml-1">Contact support to change email</p>
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div className="space-y-2">
//                                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
//                                                 <div className="relative group">
//                                                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#197fe6] transition-colors" size={20} />
//                                                     <input 
//                                                         type="tel" 
//                                                         value={phoneNumber}
//                                                         onChange={(e) => setPhoneNumber(e.target.value)}
//                                                         className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] outline-none transition-all font-medium"
//                                                         placeholder="+91 00000 00000"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Role</label>
//                                                 <div className="relative group opacity-60">
//                                                     <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                                                     <input 
//                                                         type="text" 
//                                                         value={role}
//                                                         disabled
//                                                         className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 outline-none font-medium cursor-not-allowed"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="pt-6">
//                                         <button 
//                                             type="submit"
//                                             disabled={saving}
//                                             className="w-full py-4 bg-[#197fe6] text-white rounded-[1.25rem] font-black shadow-xl shadow-[#197fe6]/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             {saving ? <Loader2 className="animate-spin" size={24} /> : "Save Profile Changes"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//         </div>
//     );
// }






"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Bell,
  Lock,
  Star,
  Award,
  BookOpen,
} from "lucide-react";

// ─── Reusable Badge ───────────────────────────────────────────────────────────
const Badge = ({ text, color }: { text: string; color: string }) => (
  <span style={{
    background: color + "18", color, border: `1px solid ${color}33`,
    borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700,
  }}>{text}</span>
);

// ─── Stat Mini Card ───────────────────────────────────────────────────────────
const MiniStat = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <div style={{
    background: "#FFFFFF", borderRadius: 18, padding: "16px 20px",
    border: "1px solid #FFF0E8", display: "flex", alignItems: "center", gap: 14,
    boxShadow: "0 2px 12px rgba(255,107,107,0.06)",
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 14, background: color + "18",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A2E", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#999", marginTop: 3, fontWeight: 600 }}>{label}</div>
    </div>
  </div>
);

// ─── Form Input ───────────────────────────────────────────────────────────────
const AInput = ({
  label, icon, type = "text", value, onChange, placeholder, disabled = false,
}: {
  label: string; icon: React.ReactNode; type?: string;
  value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    <label style={{ fontSize: 11, fontWeight: 800, color: "#BBB", letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: disabled ? "#CCC" : "#FFB347", display: "flex",
      }}>{icon}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%", padding: "13px 16px 13px 46px",
          borderRadius: 14, border: `2px solid ${disabled ? "#F5F5F5" : "#FFF0E8"}`,
          background: disabled ? "#FAFAFA" : "#FFFDF7",
          fontSize: 14, color: disabled ? "#AAA" : "#1A1A2E",
          outline: "none", fontFamily: "inherit", fontWeight: 600,
          cursor: disabled ? "not-allowed" : "text",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={e => !disabled && (e.target.style.borderColor = "#FF6B6B")}
        onBlur={e => !disabled && (e.target.style.borderColor = "#FFF0E8")}
      />
    </div>
    {disabled && (
      <span style={{ fontSize: 11, color: "#CCC", fontWeight: 700, letterSpacing: 0.5 }}>
        Contact support to change
      </span>
    )}
  </div>
);

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const NavItem = ({
  icon, label, active = false, danger = false, onClick,
}: {
  icon: React.ReactNode; label: string; active?: boolean; danger?: boolean; onClick?: () => void;
}) => (
  <button onClick={onClick} style={{
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "11px 16px", borderRadius: 14, border: "none", cursor: "pointer",
    background: danger ? "transparent" : active ? "#FF6B6B0F" : "transparent",
    color: danger ? "#FF6B6B" : active ? "#FF6B6B" : "#777",
    fontWeight: 700, fontSize: 14, fontFamily: "inherit",
    transition: "background 0.15s",
  }}
    onMouseEnter={e => {
      if (!active) (e.currentTarget as HTMLElement).style.background = danger ? "#FF6B6B0A" : "#FFF0E8";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = active ? "#FF6B6B0F" : "transparent";
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{icon} {label}</span>
    {!danger && <ChevronRight size={15} />}
  </button>
);

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const router = useRouter();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      setName(user.user_metadata?.name || "");
      setPhoneNumber(user.user_metadata?.phone || "");
      setCity(user.user_metadata?.city || "");
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) router.push("/login");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { error } = await supabase.auth.updateUser({ data: { name, phone: phoneNumber, city } });
      if (error) throw error;
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFDF7" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", animation: "spin 1s linear infinite" }}>
            <Loader2 size={28} color="#fff" />
          </div>
          <span style={{ fontSize: 14, color: "#999", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>Loading your profile…</span>
        </div>
      </div>
    );
  }

  const role = user?.user_metadata?.role || "User";
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Recently";
  const initials = (name || user?.email || "U").slice(0, 2).toUpperCase();
  const gradients = ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"];
  const avatarGrad = gradients[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FFFDF7; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .profile-card { animation: fadeUp 0.5s ease both; }
        .anim-1 { animation: fadeUp 0.5s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.5s ease 0.15s both; }
        .anim-3 { animation: fadeUp 0.5s ease 0.25s both; }
        .toast { animation: fadeIn 0.3s ease both; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)", fontFamily: "'Nunito', sans-serif" }}>
        {/* Top bar */}
        <div style={{ height: 64, background: "#FFFFFF", borderBottom: "1px solid #FFF0E8", display: "flex", alignItems: "center", padding: "0 32px", gap: 16, boxShadow: "0 2px 16px rgba(255,107,107,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏫</div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>Ascento</span>
            <span style={{ fontSize: 12, color: "#FFB347", fontWeight: 700, marginLeft: 4 }}>Admin</span>
          </div>
          <button onClick={() => router.back()} style={{ padding: "8px 18px", borderRadius: 12, border: "2px solid #FFF0E8", background: "#FFFDF7", color: "#777", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Back to Dashboard</button>
        </div>

        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 24px" }}>

          {/* ── Hero Header Card ── */}
          <div className="profile-card" style={{
            background: "#FFFFFF", borderRadius: 28, padding: "36px 40px",
            border: "1px solid #FFF0E8", marginBottom: 28,
            boxShadow: "0 8px 40px rgba(255,107,107,0.08)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", gap: 36,
          }}>
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", opacity: 0.07, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, left: 160, width: 120, height: 120, borderRadius: "50%", background: "#4ECDC4", opacity: 0.06, pointerEvents: "none" }} />

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 100, height: 100, borderRadius: 28,
                background: avatarGrad,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 36, fontWeight: 900,
                boxShadow: "0 12px 40px rgba(255,107,107,0.3)",
                fontFamily: "'Poppins', sans-serif",
              }}>{initials}</div>
              <button style={{
                position: "absolute", bottom: -6, right: -6,
                width: 32, height: 32, borderRadius: 10,
                background: "#FFFFFF", border: "2px solid #FFF0E8",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 4px 12px rgba(255,107,107,0.15)",
                color: "#FF6B6B",
              }}>
                <Camera size={15} />
              </button>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 900, color: "#1A1A2E", marginBottom: 6 }}>
                {name || "Your Name"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                <Mail size={15} /> {user?.email}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Badge text={`🛡️ ${role}`} color="#FF6B6B" />
                <Badge text={`📅 Joined ${createdAt}`} color="#FFB347" />
                <Badge text="✅ Verified" color="#4ECDC4" />
              </div>
            </div>

            {/* Right decoration */}
            <div style={{ fontSize: 72, opacity: 0.12, position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>👤</div>
          </div>

          {/* ── Mini Stats ── */}
          <div className="anim-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
            <MiniStat icon="🎒" label="Students Managed" value="348" color="#FF6B6B" />
            <MiniStat icon="📅" label="Sessions This Month" value="42" color="#4ECDC4" />
            <MiniStat icon="⭐" label="Performance Score" value="97%" color="#FFB347" />
          </div>

          {/* ── Main Content ── */}
          <div className="anim-2" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22 }}>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Nav Card */}
              <div style={{ background: "#FFFFFF", borderRadius: 22, padding: 16, border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 12px" }}>Account</div>
                <NavItem icon={<User size={18} />} label="Profile Info" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                <NavItem icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
                <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
                <div style={{ height: 1, background: "#FFF0E8", margin: "10px 0" }} />
                <NavItem icon={<LogOut size={18} />} label="Sign Out" danger onClick={handleSignOut} />
              </div>

              {/* Franchise Promo */}
              <div style={{
                background: "linear-gradient(135deg,#1A1A2E,#2D2D4E)",
                borderRadius: 22, padding: 24, position: "relative", overflow: "hidden",
                boxShadow: "0 8px 32px rgba(26,26,46,0.2)",
              }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "#FF6B6B", opacity: 0.12 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🚀</div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Become a Franchise?</div>
                  <div style={{ color: "#ffffff66", fontSize: 13, fontWeight: 600, marginBottom: 18, lineHeight: 1.6 }}>Start your own Ascento Abacus center and shape the future of learning.</div>
                  <button onClick={() => router.push("/franchise")} style={{
                    width: "100%", padding: "11px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff",
                    fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(255,107,107,0.3)",
                    transition: "transform 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >Learn More →</button>
                </div>
              </div>

              {/* Achievement Card */}
              <div style={{ background: "#FFFFFF", borderRadius: 22, padding: 20, border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Achievements</div>
                {[
                  { icon: "🏆", label: "Top Educator 2024", color: "#FFB347" },
                  { icon: "⭐", label: "100+ Students", color: "#FF6B6B" },
                  { icon: "📚", label: "50 Courses", color: "#4ECDC4" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 12 : 0, padding: "8px 10px", borderRadius: 12, background: "#FFFDF7" }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Panel */}
            <div style={{ background: "#FFFFFF", borderRadius: 26, padding: 36, border: "1px solid #FFF0E8", boxShadow: "0 4px 24px rgba(255,107,107,0.05)" }}>

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={22} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Personal Details</div>
                      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Update your profile information</div>
                    </div>
                  </div>

                  {/* Toast */}
                  {message.text && (
                    <div className="toast" style={{
                      marginBottom: 24, padding: "14px 18px", borderRadius: 16,
                      display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 14,
                      background: message.type === "success" ? "#4ECDC411" : "#FF6B6B11",
                      border: `1.5px solid ${message.type === "success" ? "#4ECDC444" : "#FF6B6B44"}`,
                      color: message.type === "success" ? "#4ECDC4" : "#FF6B6B",
                    }}>
                      {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <AInput label="Full Name" icon={<User size={18} />} value={name} onChange={setName} placeholder="Your full name" />
                      <AInput label="Email Address" icon={<Mail size={18} />} value={user?.email || ""} disabled placeholder="your@email.com" />
                      <AInput label="Phone Number" icon={<Phone size={18} />} value={phoneNumber} onChange={setPhoneNumber} placeholder="+91 98765 XXXXX" type="tel" />
                      <AInput label="Account Role" icon={<Shield size={18} />} value={role} disabled />
                      <AInput label="City / Location" icon={<BookOpen size={18} />} value={city} onChange={setCity} placeholder="Indore, MP" />
                      <AInput label="Member Since" icon={<Calendar size={18} />} value={createdAt} disabled />
                    </div>

                    <div style={{ height: 1, background: "#FFF0E8" }} />

                    <button type="submit" disabled={saving} style={{
                      padding: "15px", borderRadius: 16, border: "none",
                      background: saving ? "#FFB34799" : "linear-gradient(135deg,#FF6B6B,#FFB347)",
                      color: "#fff", fontWeight: 800, fontSize: 16, cursor: saving ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      boxShadow: "0 6px 24px rgba(255,107,107,0.3)",
                      fontFamily: "inherit", transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                      onMouseEnter={e => !saving && ((e.currentTarget.style.transform = "translateY(-2px)"), (e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,107,107,0.4)"))}
                      onMouseLeave={e => ((e.currentTarget.style.transform = ""), (e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,107,107,0.3)"))}
                    >
                      {saving ? <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "💾 Save Profile Changes"}
                    </button>
                  </form>
                </>
              )}

              {/* Tab: Security */}
              {activeTab === "security" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lock size={22} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Security & Privacy</div>
                      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Manage your account security</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { label: "Change Password", desc: "Update your account password", icon: "🔑", color: "#FF6B6B" },
                      { label: "Two-Factor Auth", desc: "Add an extra layer of security", icon: "🔐", color: "#4ECDC4" },
                      { label: "Active Sessions", desc: "View and manage logged-in devices", icon: "📱", color: "#A78BFA" },
                      { label: "Login History", desc: "Review recent login activity", icon: "📋", color: "#FFB347" },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                        borderRadius: 18, background: "#FFFDF7", border: "1px solid #FFF0E8",
                        cursor: "pointer", transition: "transform 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "")}
                      >
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{item.desc}</div>
                        </div>
                        <ChevronRight size={18} color="#CCC" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tab: Notifications */}
              {activeTab === "notifications" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#A78BFA,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bell size={22} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Notification Preferences</div>
                      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Choose what alerts you receive</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { label: "Email Alerts", desc: "Receive updates via email", defaultOn: true, color: "#FF6B6B" },
                      { label: "Fee Reminders", desc: "Notify about pending fees", defaultOn: true, color: "#FFB347" },
                      { label: "Exam Notifications", desc: "Alerts for upcoming exams", defaultOn: true, color: "#4ECDC4" },
                      { label: "Attendance Alerts", desc: "Low attendance warnings", defaultOn: false, color: "#A78BFA" },
                      { label: "Report Updates", desc: "New reports and analytics", defaultOn: false, color: "#F06292" },
                    ].map((item, i) => {
                      const [on, setOn] = useState(item.defaultOn);
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#FFFDF7", border: "1px solid #FFF0E8" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Bell size={18} color={item.color} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{item.desc}</div>
                          </div>
                          <div onClick={() => setOn(!on)} style={{
                            width: 50, height: 28, borderRadius: 14,
                            background: on ? `linear-gradient(135deg,${item.color},${item.color}BB)` : "#EEE",
                            cursor: "pointer", position: "relative",
                            transition: "background 0.3s", flexShrink: 0,
                          }}>
                            <div style={{
                              position: "absolute", top: 4, left: on ? 26 : 4, width: 20, height: 20,
                              borderRadius: "50%", background: "#fff",
                              transition: "left 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => {}} style={{
                    marginTop: 24, width: "100%", padding: "14px", borderRadius: 16, border: "none",
                    background: "linear-gradient(135deg,#A78BFA,#7C3AED)", color: "#fff",
                    fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 6px 24px rgba(167,139,250,0.3)",
                  }}>Save Notification Settings</button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}