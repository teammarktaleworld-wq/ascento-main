"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userDoc = await getDoc(doc(db, "Users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-[100] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative size-12 flex items-center justify-center transition-transform group-hover:scale-110">
                            <Image 
                                src="/Acento-Logo.jpg" 
                                alt="Ascento Abacus Logo" 
                                width={48} 
                                height={48}
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-[#0e141b] dark:text-white bg-clip-text">
                            Ascento <span className="text-[#197fe6]">Abacus</span>
                        </h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-10">
                        {['Home', 'Programs', 'Franchise', 'Contact'].map((item) => (
                            <Link 
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-[#197fe6] transition-all duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#197fe6] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 pl-4 py-1.5 pr-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all font-bold text-sm text-slate-700 dark:text-slate-300"
                                >
                                    <span className="hidden sm:inline italic">{userData?.Name || user.email?.split('@')[0]}</span>
                                    <div className="size-8 rounded-xl bg-[#197fe6] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[#197fe6]/20">
                                        {userData?.Name?.[0] || 'U'}
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-3 z-20 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300 text-[#0e141b]">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl mb-2">
                                                <p className="text-xs font-black text-[#197fe6] uppercase tracking-widest mb-1 italic">Level: {userData?.Role || 'User'}</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                {userData?.Role?.trim().toLowerCase() === 'admin' ? (
                                                    <Link 
                                                        href="/admin" 
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#197fe6] hover:bg-[#197fe6]/5 rounded-xl transition-all ring-1 ring-[#197fe6]/20 bg-[#197fe6]/5 uppercase tracking-widest text-[10px]"
                                                    >
                                                        <LayoutDashboard size={18} /> Admin Dashboard
                                                    </Link>
                                                ) : (
                                                    <Link 
                                                        href="/student" 
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#197fe6] hover:bg-[#197fe6]/5 rounded-xl transition-all ring-1 ring-[#197fe6]/20 bg-[#197fe6]/5 uppercase tracking-widest text-[10px]"
                                                    >
                                                        <LayoutDashboard size={18} /> My Dashboard
                                                    </Link>
                                                )}
                                                
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all uppercase tracking-widest text-[10px]"
                                                >
                                                    <LogOut size={18} /> Logout Session
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 group">
                                <span className="hidden sm:inline text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-[#197fe6] transition-colors">Login</span>
                                <div className="bg-[#197fe6] hover:bg-[#197fe6]/90 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#197fe6]/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                                    Sign In
                                </div>
                            </Link>
                        )}
                        
                        <button
                            className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-100 rounded-xl transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 p-6 animate-in slide-in-from-top-10 duration-500">
                    <nav className="flex flex-col gap-4">
                        {['Home', 'Programs', 'Franchise', 'Contact'].map((item) => (
                            <Link 
                                key={item}
                                className="text-lg font-black uppercase tracking-widest text-slate-500 hover:text-[#197fe6]" 
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <hr className="my-4 border-slate-100 dark:border-slate-800" />
                        {user ? (
                            <>
                                {userData?.Role?.trim().toLowerCase() === 'admin' ? (
                                    <Link className="text-lg font-black uppercase tracking-widest text-[#197fe6]" href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Open Admin Console</Link>
                                ) : (
                                    <Link className="text-lg font-black uppercase tracking-widest text-[#197fe6] flex items-center gap-2" href="/student" onClick={() => setIsMobileMenuOpen(false)}>
                                        <LayoutDashboard size={20} /> My Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="text-lg font-black uppercase tracking-widest text-red-500 text-left">Logout</button>
                            </>
                        ) : (
                            <Link className="bg-[#197fe6] text-white px-8 py-4 rounded-2xl text-center font-black uppercase tracking-widest transition-all shadow-xl shadow-[#197fe6]/20" href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                Join Now
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
