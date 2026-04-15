"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, "Users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = (userData.Role || "User").trim().toLowerCase();
                
                if (role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/profile");
                }
            } else {
                setError("User profile not found. Please contact support.");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user document exists
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create profile for new user
                await setDoc(userDocRef, {
                    Name: user.displayName || "Google User",
                    Email: user.email,
                    Role: "User",
                    CreatedAt: serverTimestamp()
                });
                router.push("/profile");
            } else {
                const role = (userDoc.data()?.Role || "User").trim().toLowerCase();
                if (role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/profile");
                }
            }
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err.message || "Google Sign-In failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-4 py-12 text-[#0e141b]">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#197fe6]/10 text-[#197fe6] rounded-2xl mb-6">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Sign In</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold border border-red-100 dark:border-red-800 animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#197fe6] ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-4 focus:ring-[#197fe6]/10 focus:border-[#197fe6] transition-all outline-none font-bold text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#197fe6] hover:bg-[#197fe6]/90 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#197fe6]/20 flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Sign In to Account"
                            )}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-800 px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 transform active:scale-95"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account? <Link href="/register" className="text-[#197fe6] font-bold hover:underline">Sign Up</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
