"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
  ChevronRight
} from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    // Form states
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const userDoc = await getDoc(doc(db, "Users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setProfileData(data);
                        setName(data.Name || "");
                        setPhoneNumber(data.Phone || "");
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // Update Firebase Auth profile
            await updateProfile(user, {
                displayName: name
            });

            // Update Firestore document
            await updateDoc(doc(db, "Users", user.uid), {
                Name: name,
                Phone: phoneNumber,
                UpdatedAt: new Date().toISOString()
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
            
            // Update local state
            setProfileData({ ...profileData, Name: name, Phone: phoneNumber });
        } catch (err: any) {
            console.error("Update error:", err);
            setMessage({ type: "error", text: err.message || "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-12 h-12 text-[#197fe6] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Navbar />
            
            <main className="flex-grow py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#197fe6]/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#197fe6] to-[#4f46e5] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#197fe6]/20">
                                    {name[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all text-[#197fe6]">
                                    <Camera size={20} />
                                </button>
                            </div>
                            
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{name || "User Name"}</h1>
                                <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                                    <Mail size={16} /> {user?.email}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                                        <Shield size={14} className="text-[#197fe6]" />
                                        {profileData?.Role || "User"}
                                    </span>
                                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                                        <Calendar size={14} className="text-orange-500" />
                                        Joined {profileData?.CreatedAt ? new Date(profileData.CreatedAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-slate-900 dark:text-white font-bold mb-4 px-2">Account Settings</h3>
                                <div className="space-y-1">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-[#197fe6]/5 text-[#197fe6] rounded-2xl font-bold transition-all">
                                        <span className="flex items-center gap-3"><User size={20} /> Profile Information</span>
                                        <ChevronRight size={16} />
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl font-bold transition-all">
                                        <span className="flex items-center gap-3"><Shield size={20} /> Security & Privacy</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <hr className="my-4 border-slate-100 dark:border-slate-800" />
                                <button 
                                    onClick={() => auth.signOut().then(() => router.push('/'))}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Become a Franchise?</h3>
                                    <p className="text-slate-400 text-sm mb-6 font-medium">Start your own Ascento Abacus center and shape the future of learning.</p>
                                    <button 
                                        onClick={() => router.push('/franchise')}
                                        className="w-full py-3 bg-[#197fe6] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#197fe6]/30 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Learn More
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#197fe6]/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Personal Details</h3>
                                
                                {message.text && (
                                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border ${
                                        message.type === 'success' 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                        : 'bg-red-50 border-red-100 text-red-600'
                                    }`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#197fe6] transition-colors" size={20} />
                                                    <input 
                                                        type="text" 
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] outline-none transition-all font-medium"
                                                        placeholder="Your full name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                                <div className="relative group opacity-60">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input 
                                                        type="email" 
                                                        value={user?.email || ""} 
                                                        disabled
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 outline-none font-medium cursor-not-allowed"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase ml-1">Contact support to change email</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#197fe6] transition-colors" size={20} />
                                                    <input 
                                                        type="tel" 
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] outline-none transition-all font-medium"
                                                        placeholder="+91 00000 00000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Role</label>
                                                <div className="relative group opacity-60">
                                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input 
                                                        type="text" 
                                                        value={profileData?.Role || "User"} 
                                                        disabled
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 outline-none font-medium cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button 
                                            type="submit"
                                            disabled={saving}
                                            className="w-full py-4 bg-[#197fe6] text-white rounded-[1.25rem] font-black shadow-xl shadow-[#197fe6]/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={24} /> : "Save Profile Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
