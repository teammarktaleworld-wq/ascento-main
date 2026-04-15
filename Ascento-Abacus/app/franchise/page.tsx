"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FadeIn, SlideIn, ScaleIn } from "../components/AnimatedSection";

export default function FranchisePage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#111921] text-slate-900 dark:text-slate-100 selection:bg-[#197fe6] selection:text-white font-sans antialiased">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white py-16 dark:bg-[#111921] lg:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <SlideIn>
                                <div className="max-w-2xl space-y-8">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#197fe6]/10 px-4 py-1.5 text-sm font-bold text-[#197fe6]">
                                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                                        <span>Award-Winning Global Franchise</span>
                                    </div>
                                    <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                                        Become an Entrepreneur with a <span className="text-[#197fe6]">Social Cause</span>
                                    </h1>
                                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                        Join Ascento Abacus and bring world-class brain development and math programs to your community. Empower the next generation while building a sustainable, profitable business.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button className="rounded-lg bg-[#197fe6] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#197fe6]/25 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                                            Apply for Franchise
                                        </button>
                                        <button className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                            Watch Success Story
                                        </button>
                                    </div>
                                </div>
                            </SlideIn>

                            <ScaleIn delay={0.2}>
                                <div className="relative">
                                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                        <Image
                                            alt="Education"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9KTAbHyRbZvZjiHX0_Kn94zgCEp-fE6T0Q5FhqEwrOaJaNJAY2jaGkbvjHHyufNwNME3zmSrTffn6d6HI8pp8filZiYjNJ4vvFAIhFZ-0xNGvcbR0ijpLExkj2TYHk3ZL9kXXdXYvRavaMzgkt19z5sqhmYF4AfoA-eJ4mEy9kn5W-pRALOtWpju0iGaYKlesJuHax14gHZBIHLwLZMrU3KXxldI0rGaS_R0MFqUPTicmXvhCd5JWtu1YuoUP4wJ2uc7sOHPNr4I"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#197fe6]/20 blur-3xl"></div>
                                    <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#197fe6]/20 blur-3xl"></div>
                                </div>
                            </ScaleIn>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-[#f6f7f8] py-20 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Why Partner with Ascento Abacus?</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                                We provide a comprehensive business ecosystem designed for your growth and student success.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3 text-none border-none">
                            {[
                                { icon: "public", title: "International Brand", desc: "Leverage our recognized reputation across 15+ countries. Trust is built-in from day one." },
                                { icon: "menu_book", title: "Proven Curriculum", desc: "Access research-backed pedagogy that delivers measurable results in children's cognitive speed." },
                                { icon: "support_agent", title: "360° Support", desc: "From teacher training to local marketing strategies, our dedicated experts support you every step." }
                            ].map((benefit, idx) => (
                                <FadeIn key={idx} delay={idx * 0.1}>
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-[#197fe6]/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#111921] h-full">
                                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#197fe6]/10 text-[#197fe6] transition-colors group-hover:bg-[#197fe6] group-hover:text-white">
                                            <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{benefit.desc}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Steps & Form Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="grid gap-16 lg:grid-cols-5">
                            {/* Left: Steps */}
                            <div className="lg:col-span-3">
                                <h2 className="mb-10 text-3xl font-bold text-slate-900 dark:text-white">Steps to Get Started</h2>
                                <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:h-[calc(100%-1.5rem)] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                    {[
                                        { step: "01", title: "Express Interest", desc: "Fill out the inquiry form. Our franchise discovery team will reach out for an initial briefing." },
                                        { step: "02", title: "Personal Consultation", desc: "Join a 1-on-1 session to understand the business model, investment, and territory rights." },
                                        { step: "03", title: "Training & Certification", desc: "Complete our rigorous teacher training program and get certified by international masters." },
                                        { step: "04", title: "Center Launch", desc: "Grand opening of your center with our on-ground marketing support and digital leads." }
                                    ].map((step, idx) => (
                                        <div key={idx} className="relative flex gap-8">
                                            <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#197fe6] text-white ring-4 ring-white dark:ring-[#111921]">
                                                <span className="text-sm font-bold">{step.step}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h4>
                                                <p className="mt-1 text-slate-600 dark:text-slate-400">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div className="lg:col-span-2">
                                <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-[#111921]">
                                    <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Franchise Inquiry</h3>
                                    <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">Take the first step toward your new venture.</p>
                                    <form action="#" className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                            <input className="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm focus:border-[#197fe6] focus:ring-[#197fe6] dark:border-slate-700 dark:bg-slate-900" placeholder="John Doe" type="text" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">location_on</span>
                                                <input className="w-full rounded-lg border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm focus:border-[#197fe6] focus:ring-[#197fe6] dark:border-slate-700 dark:bg-slate-900" placeholder="City, Country" type="text" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                                            <input className="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm focus:border-[#197fe6] focus:ring-[#197fe6] dark:border-slate-700 dark:bg-slate-900" placeholder="+1 (555) 000-0000" type="tel" />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Professional Background</label>
                                            <select className="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm focus:border-[#197fe6] focus:ring-[#197fe6] dark:border-slate-700 dark:bg-slate-900">
                                                <option>Education / Teacher</option>
                                                <option>Business Owner</option>
                                                <option>Corporate Professional</option>
                                                <option>Stay-at-home Parent</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <button className="mt-4 w-full rounded-lg bg-[#197fe6] py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#197fe6]/90 active:scale-[0.98]" type="submit">
                                            Send Inquiry Request
                                        </button>
                                    </form>
                                    <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                                        <div className="flex items-center gap-4 italic text-slate-500">
                                            <div className="h-10 w-10 overflow-hidden rounded-full relative">
                                                <Image alt="Testimonial User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcJCVx6C8QJCmzEYCvrq1qfVXg3ZKomgja4bPdc4RwssYfG-GwLOlExglCQLPqKDRjjTuFVCxOZ_T5yXFYm2jVvRorBa5s4tL2oMJvPg7ebMUt3DaK4T41IRwe89Wy9UnSndzc-Jykf0laS3bnf_XYL_QPwjEc_k_Zt_VNnL31cfrfJrwkpVzMIeA95X5XqB56RZVfM3a-uzTEiKOCXNN9vVHpmO-nopVtlydKZTYMQaF6NmGrZJNkai-FJCaic5uCPDwYAJ6yixc" fill className="object-cover" />
                                            </div>
                                            <p className="text-xs leading-tight">
                                                "Joining Ascento was the best decision for my career and my community." <br />
                                                <span className="font-bold text-slate-700 dark:text-slate-300">— Sarah M., Franchise Partner</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
