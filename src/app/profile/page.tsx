


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import {
//   Loader2, Camera, Mail, Phone, Shield, BookOpen, Calendar,
//   User, Lock, Bell, LogOut, CheckCircle2, AlertCircle, ChevronRight,
// } from "lucide-react";

// function Badge({ text, color }: { text: string; color: string }) {
//   return (
//     <span style={{
//       padding: "5px 14px", borderRadius: 50,
//       background: color + "18", color, fontSize: 12, fontWeight: 700,
//     }}>{text}</span>
//   );
// }

// function MiniStat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
//   return (
//     <div style={{
//       background: "#FFFFFF", borderRadius: 20, padding: "20px 24px",
//       border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)",
//       display: "flex", alignItems: "center", gap: 16,
//     }}>
//       <div style={{
//         width: 48, height: 48, borderRadius: 14,
//         background: color + "18", display: "flex", alignItems: "center",
//         justifyContent: "center", fontSize: 22,
//       }}>{icon}</div>
//       <div>
//         <div style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>{value}</div>
//         <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{label}</div>
//       </div>
//     </div>
//   );
// }

// function NavItem({
//   icon, label, active, onClick, danger,
// }: {
//   icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; danger?: boolean;
// }) {
//   return (
//     <div onClick={onClick} style={{
//       display: "flex", alignItems: "center", gap: 12,
//       padding: "10px 12px", borderRadius: 14, cursor: "pointer",
//       background: active ? "#FF6B6B12" : "transparent",
//       color: danger ? "#FF4444" : active ? "#FF6B6B" : "#555",
//       fontWeight: active ? 800 : 700, fontSize: 14,
//       transition: "background 0.2s",
//     }}>
//       {icon} {label}
//     </div>
//   );
// }

// function AInput({
//   label, icon, value, onChange, placeholder, disabled, type,
// }: {
//   label: string; icon: React.ReactNode; value: string;
//   onChange?: (v: string) => void; placeholder?: string;
//   disabled?: boolean; type?: string;
// }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//       <label style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B", marginLeft: 4 }}>{label}</label>
//       <div style={{ position: "relative" }}>
//         <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#CCC" }}>{icon}</span>
//         <input
//           type={type || "text"}
//           value={value}
//           onChange={e => onChange?.(e.target.value)}
//           placeholder={placeholder}
//           disabled={disabled}
//           style={{
//             width: "100%", padding: "13px 14px 13px 44px",
//             borderRadius: 14, border: "2px solid #FFF0E8",
//             background: disabled ? "#FAFAFA" : "#FFFDF7",
//             fontFamily: "inherit", fontSize: 14, fontWeight: 700,
//             color: disabled ? "#AAA" : "#1A1A2E", outline: "none",
//             boxSizing: "border-box",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// function NotifRow({ label, desc, defaultOn, color }: { label: string; desc: string; defaultOn: boolean; color: string }) {
//   const [on, setOn] = useState(defaultOn);
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#FFFDF7", border: "1px solid #FFF0E8" }}>
//       <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Bell size={18} color={color} />
//       </div>
//       <div style={{ flex: 1 }}>
//         <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{label}</div>
//         <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{desc}</div>
//       </div>
//       <div onClick={() => setOn(!on)} style={{
//         width: 50, height: 28, borderRadius: 14,
//         background: on ? `linear-gradient(135deg,${color},${color}BB)` : "#EEE",
//         cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0,
//       }}>
//         <div style={{
//           position: "absolute", top: 4, left: on ? 26 : 4, width: 20, height: 20,
//           borderRadius: "50%", background: "#fff",
//           transition: "left 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//         }} />
//       </div>
//     </div>
//   );
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [activeTab, setActiveTab] = useState("profile");

//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [city, setCity] = useState("");

//   useEffect(() => {
//     const loadUser = async () => {
//       const { data } = await supabase.auth.getSession();
//       const token = data.session?.access_token;

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("/api/user/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const dbUser = await res.json();

//       setUser(dbUser);
//       setName(dbUser?.name || "");
//       setPhoneNumber(dbUser?.phone || "");
//       setCity(dbUser?.city || "");
//       setLoading(false);
//     };

//     loadUser();

//     const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
//       if (!session?.user) router.push("/login");
//     });

//     return () => listener.subscription.unsubscribe();
//   }, [router]);

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setSaving(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const { data } = await supabase.auth.getSession();
//       const token = data.session?.access_token;
//       if (!token) throw new Error("No session");

//       await fetch("/api/user/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ name, phone: phoneNumber, city }),
//       });

//       const res = await fetch("/api/user/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedUser = await res.json();

//       setUser(updatedUser);
//       setName(updatedUser?.name || "");
//       setPhoneNumber(updatedUser?.phone || "");
//       setCity(updatedUser?.city || "");

//       setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
//     } catch (err: any) {
//       setMessage({ type: "error", text: err.message });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     router.push("/");
//   };

//   if (loading) {
//     return (
//       <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }

//   const role = user?.role || "User";
//   const createdAt = user?.createdAt
//     ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
//     : "Recently";

//   const initials = (name || user?.email || "U").slice(0, 2).toUpperCase();
//   const avatarGrad = "linear-gradient(135deg,#FF6B6B,#FFB347)";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'Nunito', sans-serif; background: #FFFDF7; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
//         .profile-card { animation: fadeUp 0.5s ease both; }
//         .anim-1 { animation: fadeUp 0.5s ease 0.05s both; }
//         .anim-2 { animation: fadeUp 0.5s ease 0.15s both; }
//         .anim-3 { animation: fadeUp 0.5s ease 0.25s both; }
//         .toast { animation: fadeIn 0.3s ease both; }
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
//       `}</style>

//       <div style={{
//         minHeight: "100vh",
//         background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)",
//         fontFamily: "'Nunito', sans-serif",
//       }}>
//         {/* ── Page content — padded top so global Navbar doesn't overlap ── */}
//         <div style={{ maxWidth: 1060, margin: "0 auto", padding: "100px 24px 48px" }}>

//           {/* Hero Header */}
//           <div className="profile-card" style={{
//             background: "#FFFFFF", borderRadius: 28, padding: "36px 40px",
//             border: "1px solid #FFF0E8", marginBottom: 28,
//             boxShadow: "0 8px 40px rgba(255,107,107,0.08)",
//             position: "relative", overflow: "hidden",
//             display: "flex", alignItems: "center", gap: 36,
//           }}>
//             <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", opacity: 0.07, pointerEvents: "none" }} />
//             <div style={{ position: "absolute", bottom: -30, left: 160, width: 120, height: 120, borderRadius: "50%", background: "#4ECDC4", opacity: 0.06, pointerEvents: "none" }} />

//             <div style={{ position: "relative", flexShrink: 0 }}>
//               <div style={{
//                 width: 100, height: 100, borderRadius: 28,
//                 background: avatarGrad,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 color: "#fff", fontSize: 36, fontWeight: 900,
//                 boxShadow: "0 12px 40px rgba(255,107,107,0.3)",
//                 fontFamily: "'Poppins', sans-serif",
//               }}>{initials}</div>
//               <button style={{
//                 position: "absolute", bottom: -6, right: -6,
//                 width: 32, height: 32, borderRadius: 10,
//                 background: "#FFFFFF", border: "2px solid #FFF0E8",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 cursor: "pointer", boxShadow: "0 4px 12px rgba(255,107,107,0.15)",
//                 color: "#FF6B6B",
//               }}>
//                 <Camera size={15} />
//               </button>
//             </div>

//             <div style={{ flex: 1 }}>
//               <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 900, color: "#1A1A2E", marginBottom: 6 }}>
//                 {name || "Your Name"}
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
//                 <Mail size={15} /> {user?.email}
//               </div>
//               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                 <Badge text={`🛡️ ${role}`} color="#FF6B6B" />
//                 <Badge text={`📅 Joined ${createdAt}`} color="#FFB347" />
//                 <Badge text="✅ Verified" color="#4ECDC4" />
//               </div>
//             </div>

//             <div style={{ fontSize: 72, opacity: 0.12, position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>👤</div>
//           </div>

//           {/* Mini Stats */}
//           <div className="anim-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
//             <MiniStat icon="🎒" label="Students Managed" value="348" color="#FF6B6B" />
//             <MiniStat icon="📅" label="Sessions This Month" value="42" color="#4ECDC4" />
//             <MiniStat icon="⭐" label="Performance Score" value="97%" color="#FFB347" />
//           </div>

//           {/* Main Content */}
//           <div className="anim-2" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22 }}>

//             {/* Sidebar */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

//               <div style={{ background: "#FFFFFF", borderRadius: 22, padding: 16, border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)" }}>
//                 <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 12px" }}>Account</div>
//                 <NavItem icon={<User size={18} />} label="Profile Info" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
//                 <NavItem icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
//                 <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
//                 <div style={{ height: 1, background: "#FFF0E8", margin: "10px 0" }} />
//                 <NavItem icon={<LogOut size={18} />} label="Sign Out" danger onClick={handleSignOut} />
//               </div>

//               {/* Franchise Promo */}
//               <div style={{
//                 background: "linear-gradient(135deg,#1A1A2E,#2D2D4E)",
//                 borderRadius: 22, padding: 24, position: "relative", overflow: "hidden",
//                 boxShadow: "0 8px 32px rgba(26,26,46,0.2)",
//               }}>
//                 <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "#FF6B6B", opacity: 0.12 }} />
//                 <div style={{ position: "relative", zIndex: 1 }}>
//                   <div style={{ fontSize: 28, marginBottom: 10 }}>🚀</div>
//                   <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Become a Franchise?</div>
//                   <div style={{ color: "#ffffff66", fontSize: 13, fontWeight: 600, marginBottom: 18, lineHeight: 1.6 }}>Start your own Ascento Abacus center and shape the future of learning.</div>
//                   <button
//                     onClick={() => router.push("/franchise")}
//                     style={{
//                       width: "100%", padding: "11px", borderRadius: 14, border: "none",
//                       background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff",
//                       fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
//                       boxShadow: "0 4px 16px rgba(255,107,107,0.3)", transition: "transform 0.15s",
//                     }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
//                     onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
//                   >Learn More →</button>
//                 </div>
//               </div>

//               {/* Achievements */}
//               <div style={{ background: "#FFFFFF", borderRadius: 22, padding: 20, border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)" }}>
//                 <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Achievements</div>
//                 {[
//                   { icon: "🏆", label: "Top Educator 2024", color: "#FFB347" },
//                   { icon: "⭐", label: "100+ Students", color: "#FF6B6B" },
//                   { icon: "📚", label: "50 Courses", color: "#4ECDC4" },
//                 ].map((a, i) => (
//                   <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 12 : 0, padding: "8px 10px", borderRadius: 12, background: "#FFFDF7" }}>
//                     <span style={{ fontSize: 20 }}>{a.icon}</span>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{a.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Main Panel */}
//             <div style={{ background: "#FFFFFF", borderRadius: 26, padding: 36, border: "1px solid #FFF0E8", boxShadow: "0 4px 24px rgba(255,107,107,0.05)" }}>

//               {/* Tab: Profile */}
//               {activeTab === "profile" && (
//                 <>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
//                     <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <User size={22} color="#fff" />
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Personal Details</div>
//                       <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Update your profile information</div>
//                     </div>
//                   </div>

//                   {message.text && (
//                     <div className="toast" style={{
//                       marginBottom: 24, padding: "14px 18px", borderRadius: 16,
//                       display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 14,
//                       background: message.type === "success" ? "#4ECDC411" : "#FF6B6B11",
//                       border: `1.5px solid ${message.type === "success" ? "#4ECDC444" : "#FF6B6B44"}`,
//                       color: message.type === "success" ? "#4ECDC4" : "#FF6B6B",
//                     }}>
//                       {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
//                       {message.text}
//                     </div>
//                   )}

//                   <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//                       <AInput label="Full Name" icon={<User size={18} />} value={name} onChange={setName} placeholder="Your full name" />
//                       <AInput label="Email Address" icon={<Mail size={18} />} value={user?.email || ""} disabled placeholder="your@email.com" />
//                       <AInput label="Phone Number" icon={<Phone size={18} />} value={phoneNumber} onChange={setPhoneNumber} placeholder="+91 98765 XXXXX" type="tel" />
//                       <AInput label="Account Role" icon={<Shield size={18} />} value={role} disabled />
//                       <AInput label="City / Location" icon={<BookOpen size={18} />} value={city} onChange={setCity} placeholder="Indore, MP" />
//                       <AInput label="Member Since" icon={<Calendar size={18} />} value={createdAt} disabled />
//                     </div>

//                     <div style={{ height: 1, background: "#FFF0E8" }} />

//                     <button
//                       type="submit"
//                       disabled={saving}
//                       style={{
//                         padding: "15px", borderRadius: 16, border: "none",
//                         background: saving ? "#FFB34799" : "linear-gradient(135deg,#FF6B6B,#FFB347)",
//                         color: "#fff", fontWeight: 800, fontSize: 16,
//                         cursor: saving ? "not-allowed" : "pointer",
//                         display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
//                         boxShadow: "0 6px 24px rgba(255,107,107,0.3)",
//                         fontFamily: "inherit", transition: "transform 0.15s, box-shadow 0.15s",
//                       }}
//                       onMouseEnter={e => !saving && ((e.currentTarget.style.transform = "translateY(-2px)"), (e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,107,107,0.4)"))}
//                       onMouseLeave={e => ((e.currentTarget.style.transform = ""), (e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,107,107,0.3)"))}
//                     >
//                       {saving
//                         ? <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
//                         : "💾 Save Profile Changes"
//                       }
//                     </button>
//                   </form>
//                 </>
//               )}

//               {/* Tab: Security */}
//               {activeTab === "security" && (
//                 <>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
//                     <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Lock size={22} color="#fff" />
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Security & Privacy</div>
//                       <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Manage your account security</div>
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                     {[
//                       { label: "Change Password", desc: "Update your account password", icon: "🔑", color: "#FF6B6B" },
//                       { label: "Two-Factor Auth", desc: "Add an extra layer of security", icon: "🔐", color: "#4ECDC4" },
//                       { label: "Active Sessions", desc: "View and manage logged-in devices", icon: "📱", color: "#A78BFA" },
//                       { label: "Login History", desc: "Review recent login activity", icon: "📋", color: "#FFB347" },
//                     ].map((item, i) => (
//                       <div key={i} style={{
//                         display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
//                         borderRadius: 18, background: "#FFFDF7", border: "1px solid #FFF0E8",
//                         cursor: "pointer", transition: "transform 0.15s",
//                       }}
//                         onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
//                         onMouseLeave={e => (e.currentTarget.style.transform = "")}
//                       >
//                         <div style={{ width: 46, height: 46, borderRadius: 14, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{item.icon}</div>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{item.label}</div>
//                           <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{item.desc}</div>
//                         </div>
//                         <ChevronRight size={18} color="#CCC" />
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {/* Tab: Notifications */}
//               {activeTab === "notifications" && (
//                 <>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
//                     <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#A78BFA,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Bell size={22} color="#fff" />
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Notification Preferences</div>
//                       <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Choose what alerts you receive</div>
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                     {[
//                       { label: "Email Alerts", desc: "Receive updates via email", defaultOn: true, color: "#FF6B6B" },
//                       { label: "Fee Reminders", desc: "Notify about pending fees", defaultOn: true, color: "#FFB347" },
//                       { label: "Exam Notifications", desc: "Alerts for upcoming exams", defaultOn: true, color: "#4ECDC4" },
//                       { label: "Attendance Alerts", desc: "Low attendance warnings", defaultOn: false, color: "#A78BFA" },
//                       { label: "Report Updates", desc: "New reports and analytics", defaultOn: false, color: "#F06292" },
//                     ].map((item, i) => (
//                       <NotifRow key={i} {...item} />
//                     ))}
//                   </div>
//                   <button style={{
//                     marginTop: 24, width: "100%", padding: "14px", borderRadius: 16, border: "none",
//                     background: "linear-gradient(135deg,#A78BFA,#7C3AED)", color: "#fff",
//                     fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
//                     boxShadow: "0 6px 24px rgba(167,139,250,0.3)",
//                   }}>Save Notification Settings</button>
//                 </>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/helpers/supabaseClient";
import {
  Loader2, Camera, Mail, Phone, Shield, BookOpen, Calendar,
  User, Lock, Bell, LogOut, CheckCircle2, AlertCircle, ChevronRight, Menu, X,
} from "lucide-react";

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      padding: "5px 14px", borderRadius: 50,
      background: color + "18", color, fontSize: 12, fontWeight: 700,
    }}>{text}</span>
  );
}

function MiniStat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 20, padding: "20px 24px",
      border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + "18", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function NavItem({
  icon, label, active, onClick, danger,
}: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; danger?: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 12px", borderRadius: 14, cursor: "pointer",
      background: active ? "#FF6B6B12" : "transparent",
      color: danger ? "#FF4444" : active ? "#FF6B6B" : "#555",
      fontWeight: active ? 800 : 700, fontSize: 14,
      transition: "background 0.2s",
    }}>
      {icon} {label}
    </div>
  );
}

function AInput({
  label, icon, value, onChange, placeholder, disabled, type,
}: {
  label: string; icon: React.ReactNode; value: string;
  onChange?: (v: string) => void; placeholder?: string;
  disabled?: boolean; type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF6B6B", marginLeft: 4 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#CCC" }}>{icon}</span>
        <input
          type={type || "text"}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%", padding: "13px 14px 13px 44px",
            borderRadius: 14, border: "2px solid #FFF0E8",
            background: disabled ? "#FAFAFA" : "#FFFDF7",
            fontFamily: "inherit", fontSize: 14, fontWeight: 700,
            color: disabled ? "#AAA" : "#1A1A2E", outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

function NotifRow({ label, desc, defaultOn, color }: { label: string; desc: string; defaultOn: boolean; color: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#FFFDF7", border: "1px solid #FFF0E8" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Bell size={18} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{desc}</div>
      </div>
      <div onClick={() => setOn(!on)} style={{
        width: 50, height: 28, borderRadius: 14,
        background: on ? `linear-gradient(135deg,${color},${color}BB)` : "#EEE",
        cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 4, left: on ? 26 : 4, width: 20, height: 20,
          borderRadius: "50%", background: "#fff",
          transition: "left 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dbUser = await res.json();

      setUser(dbUser);
      setName(dbUser?.name || "");
      setPhoneNumber(dbUser?.phone || "");
      setCity(dbUser?.city || "");
      setLoading(false);
    };

    loadUser();

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
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("No session");

      await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone: phoneNumber, city }),
      });

      const res = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = await res.json();

      setUser(updatedUser);
      setName(updatedUser?.name || "");
      setPhoneNumber(updatedUser?.phone || "");
      setCity(updatedUser?.city || "");

      setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // close sidebar on mobile after tab select
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const role = user?.role || "User";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Recently";

  const initials = (name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: #FFFDF7; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideInLeft { from { opacity:0; transform:translateX(-100%); } to { opacity:1; transform:translateX(0); } }

        .profile-card { animation: fadeUp 0.5s ease both; }
        .anim-1 { animation: fadeUp 0.5s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.5s ease 0.15s both; }
        .anim-3 { animation: fadeUp 0.5s ease 0.25s both; }
        .toast { animation: fadeIn 0.3s ease both; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }

        /* ── Sidebar overlay on mobile ── */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 200; animation: fadeIn 0.2s ease;
        }
        .sidebar-overlay.open { display: block; }

        /* ── Mobile sidebar drawer ── */
        .sidebar-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
          background: #FFFDF7; z-index: 300; padding: 24px 16px;
          overflow-y: auto; animation: slideInLeft 0.3s ease;
          box-shadow: 4px 0 30px rgba(255,107,107,0.12);
        }

        /* ── Mobile hamburger button ── */
        .mobile-menu-btn {
          display: none;
          position: fixed; top: 16px; right: 16px; z-index: 150;
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg,#FF6B6B,#FFB347);
          border: none; cursor: pointer; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(255,107,107,0.3); color: #fff;
        }

        /* ── Bottom tab bar on mobile ── */
        .mobile-tab-bar {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #fff; border-top: 1px solid #FFF0E8;
          padding: 8px 0 max(8px, env(safe-area-inset-bottom));
          z-index: 150;
          box-shadow: 0 -4px 24px rgba(255,107,107,0.08);
        }
        .mobile-tab-bar-inner {
          display: flex; justify-content: space-around; align-items: center;
        }
        .mobile-tab-btn {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 12px; border: none; background: transparent;
          cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 10px;
          font-weight: 700; color: #999; transition: color 0.2s; flex: 1;
        }
        .mobile-tab-btn.active { color: #FF6B6B; }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        /* ── Two-column form grid ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ── Main layout ── */
        .main-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 22px;
        }
        .sidebar-col { display: flex; flex-direction: column; gap: 18px; }

        /* ── Hero badges wrap ── */
        .hero-badges { display: flex; gap: 10px; flex-wrap: wrap; }

        /* ── Page wrapper ── */
        .page-wrapper {
          max-width: 1060px; margin: 0 auto; padding: 100px 24px 48px;
        }

        /* ────────────────────────────────
           TABLET  (≤ 900px)
        ──────────────────────────────── */
        @media (max-width: 900px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
          .sidebar-col { display: none; } /* hidden; shown via drawer */
          .mobile-menu-btn { display: flex; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ────────────────────────────────
           MOBILE  (≤ 640px)
        ──────────────────────────────── */
        @media (max-width: 640px) {
          .page-wrapper { padding: 72px 14px 100px; }

          /* Hero header compact */
          .hero-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
            padding: 24px !important;
          }
          .hero-header-text .hero-name { font-size: 22px !important; }

          /* Avatar smaller */
          .hero-avatar { width: 80px !important; height: 80px !important; border-radius: 22px !important; font-size: 28px !important; }

          /* Stats: 1 column on very small, 2 on mobile */
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }

          /* Hide the third stat on small screens to keep 2-col clean */
          .stats-grid > *:nth-child(3) { display: none; }

          /* Form: single column */
          .form-grid { grid-template-columns: 1fr; gap: 16px; }

          /* Main panel padding */
          .main-panel { padding: 22px 18px !important; }

          /* Bottom tab bar visible */
          .mobile-tab-bar { display: block; }

          /* Decorative large emoji hidden */
          .hero-deco-emoji { display: none !important; }

          /* MiniStat padding */
          .mini-stat-inner { padding: 14px 16px !important; }
          .mini-stat-value { font-size: 18px !important; }
        }

        /* ────────────────────────────────
           VERY SMALL  (≤ 380px)
        ──────────────────────────────── */
        @media (max-width: 380px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stats-grid > *:nth-child(3) { display: flex; }
          .hero-badges > *:nth-child(3) { display: none; }
        }
      `}</style>

      {/* ── Mobile sidebar overlay ── */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <div className="sidebar-drawer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: 18, color: "#1A1A2E" }}>Menu</div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 12px" }}>Account</div>
            <NavItem icon={<User size={18} />} label="Profile Info" active={activeTab === "profile"} onClick={() => handleTabChange("profile")} />
            <NavItem icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => handleTabChange("security")} />
            <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => handleTabChange("notifications")} />
            <div style={{ height: 1, background: "#FFF0E8", margin: "10px 0" }} />
            <NavItem icon={<LogOut size={18} />} label="Sign Out" danger onClick={handleSignOut} />
          </div>

          {/* Franchise promo in drawer */}
          <div style={{
            background: "linear-gradient(135deg,#1A1A2E,#2D2D4E)",
            borderRadius: 22, padding: 20, marginTop: 8,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>Become a Franchise?</div>
            <div style={{ color: "#ffffff66", fontSize: 12, fontWeight: 600, marginBottom: 14, lineHeight: 1.6 }}>Start your own Ascento Abacus center.</div>
            <button
              onClick={() => router.push("/franchise")}
              style={{
                width: "100%", padding: "10px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff",
                fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >Learn More →</button>
          </div>
        </div>
      )}

      {/* ── Mobile hamburger ── */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <Menu size={20} />
      </button>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#FFFDF7 0%,#FFF0E8 50%,#FFFDF7 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}>
        <div className="page-wrapper">

          {/* ── Hero Header ── */}
          <div className="profile-card hero-header" style={{
            background: "#FFFFFF", borderRadius: 28, padding: "36px 40px",
            border: "1px solid #FFF0E8", marginBottom: 28,
            boxShadow: "0 8px 40px rgba(255,107,107,0.08)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", gap: 36,
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", opacity: 0.07, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, left: 160, width: 120, height: 120, borderRadius: "50%", background: "#4ECDC4", opacity: 0.06, pointerEvents: "none" }} />

            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="hero-avatar" style={{
                width: 100, height: 100, borderRadius: 28,
                background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
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

            <div className="hero-header-text" style={{ flex: 1, minWidth: 0 }}>
              <div className="hero-name" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 900, color: "#1A1A2E", marginBottom: 6 }}>
                {name || "Your Name"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, fontWeight: 600, marginBottom: 16, overflow: "hidden" }}>
                <Mail size={15} style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</span>
              </div>
              <div className="hero-badges">
                <Badge text={`🛡️ ${role}`} color="#FF6B6B" />
                <Badge text={`📅 Joined ${createdAt}`} color="#FFB347" />
                <Badge text="✅ Verified" color="#4ECDC4" />
              </div>
            </div>

            <div className="hero-deco-emoji" style={{ fontSize: 72, opacity: 0.12, position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>👤</div>
          </div>

          {/* ── Mini Stats ── */}
          <div className="anim-1 stats-grid">
            <div className="mini-stat-inner" style={{
              background: "#FFFFFF", borderRadius: 20, padding: "20px 24px",
              border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FF6B6B18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎒</div>
              <div>
                <div className="mini-stat-value" style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>348</div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Students</div>
              </div>
            </div>
            <div className="mini-stat-inner" style={{
              background: "#FFFFFF", borderRadius: 20, padding: "20px 24px",
              border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#4ECDC418", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📅</div>
              <div>
                <div className="mini-stat-value" style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>42</div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Sessions</div>
              </div>
            </div>
            <div className="mini-stat-inner" style={{
              background: "#FFFFFF", borderRadius: 20, padding: "20px 24px",
              border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FFB34718", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⭐</div>
              <div>
                <div className="mini-stat-value" style={{ fontSize: 22, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>97%</div>
                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>Score</div>
              </div>
            </div>
          </div>

          {/* ── Main Layout ── */}
          <div className="anim-2 main-layout">

            {/* ── Desktop Sidebar (hidden on mobile via CSS) ── */}
            <div className="sidebar-col">
              <div style={{ background: "#FFFFFF", borderRadius: 22, padding: 16, border: "1px solid #FFF0E8", boxShadow: "0 4px 20px rgba(255,107,107,0.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#CCC", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 12px" }}>Account</div>
                <NavItem icon={<User size={18} />} label="Profile Info" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                <NavItem icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
                <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
                <div style={{ height: 1, background: "#FFF0E8", margin: "10px 0" }} />
                <NavItem icon={<LogOut size={18} />} label="Sign Out" danger onClick={handleSignOut} />
              </div>

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
                  <button
                    onClick={() => router.push("/franchise")}
                    style={{
                      width: "100%", padding: "11px", borderRadius: 14, border: "none",
                      background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff",
                      fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 4px 16px rgba(255,107,107,0.3)", transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >Learn More →</button>
                </div>
              </div>

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

            {/* ── Main Panel ── */}
            <div className="main-panel" style={{ background: "#FFFFFF", borderRadius: 26, padding: 36, border: "1px solid #FFF0E8", boxShadow: "0 4px 24px rgba(255,107,107,0.05)" }}>

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={22} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Poppins', sans-serif" }}>Personal Details</div>
                      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Update your profile information</div>
                    </div>
                  </div>

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
                    <div className="form-grid">
                      <AInput label="Full Name" icon={<User size={18} />} value={name} onChange={setName} placeholder="Your full name" />
                      <AInput label="Email Address" icon={<Mail size={18} />} value={user?.email || ""} disabled placeholder="your@email.com" />
                      <AInput label="Phone Number" icon={<Phone size={18} />} value={phoneNumber} onChange={setPhoneNumber} placeholder="+91 98765 XXXXX" type="tel" />
                      <AInput label="Account Role" icon={<Shield size={18} />} value={role} disabled />
                      <AInput label="City / Location" icon={<BookOpen size={18} />} value={city} onChange={setCity} placeholder="Indore, MP" />
                      <AInput label="Member Since" icon={<Calendar size={18} />} value={createdAt} disabled />
                    </div>

                    <div style={{ height: 1, background: "#FFF0E8" }} />

                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        padding: "15px", borderRadius: 16, border: "none",
                        background: saving ? "#FFB34799" : "linear-gradient(135deg,#FF6B6B,#FFB347)",
                        color: "#fff", fontWeight: 800, fontSize: 16,
                        cursor: saving ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        boxShadow: "0 6px 24px rgba(255,107,107,0.3)",
                        fontFamily: "inherit", transition: "transform 0.15s, box-shadow 0.15s",
                      }}
                      onMouseEnter={e => !saving && ((e.currentTarget.style.transform = "translateY(-2px)"), (e.currentTarget.style.boxShadow = "0 10px 32px rgba(255,107,107,0.4)"))}
                      onMouseLeave={e => ((e.currentTarget.style.transform = ""), (e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,107,107,0.3)"))}
                    >
                      {saving
                        ? <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                        : "💾 Save Profile Changes"
                      }
                    </button>
                  </form>
                </>
              )}

              {/* Tab: Security */}
              {activeTab === "security" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{item.desc}</div>
                        </div>
                        <ChevronRight size={18} color="#CCC" style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tab: Notifications */}
              {activeTab === "notifications" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#A78BFA,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                    ].map((item, i) => (
                      <NotifRow key={i} {...item} />
                    ))}
                  </div>
                  <button style={{
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

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="mobile-tab-bar">
        <div className="mobile-tab-bar-inner">
          {[
            { tab: "profile", icon: <User size={20} />, label: "Profile" },
            { tab: "security", icon: <Lock size={20} />, label: "Security" },
            { tab: "notifications", icon: <Bell size={20} />, label: "Alerts" },
            { tab: "signout", icon: <LogOut size={20} />, label: "Sign Out" },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              className={`mobile-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => tab === "signout" ? handleSignOut() : setActiveTab(tab)}
              style={{ color: tab === "signout" ? "#FF4444" : activeTab === tab ? "#FF6B6B" : "#999" }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}