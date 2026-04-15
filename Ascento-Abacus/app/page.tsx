"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FadeIn, SlideIn, ScaleIn } from "./components/AnimatedSection";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists() && userDoc.data().Role?.trim().toLowerCase() === "admin") {
            router.push("/admin");
          } else {
            setChecking(false);
          }
        } catch (err) {
          console.error("Auth check error:", err);
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-6 text-[#0e141b]">
          <div className="text-[#197fe6] size-16 animate-pulse">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <div className="h-1 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#197fe6] animate-[shimmer_1.5s_infinite] w-1/2"></div>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Authenticating Secure Cloud Session</p>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-[#f6f7f8] dark:bg-[#111921] font-sans text-[#0e141b] dark:text-slate-100 antialiased">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <SlideIn>
                <div className="flex flex-col gap-8">
                  <div className="inline-flex items-center gap-2 bg-[#197fe6]/10 text-[#197fe6] px-4 py-1.5 rounded-full w-fit">
                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                    <span className="text-xs font-bold uppercase tracking-wider">India's Leading Brain Development Program</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] text-[#0e141b] dark:text-white tracking-tight">
                    Unlock Your Child’s <span className="text-[#197fe6]">Brain Power</span>
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                    Empowering young minds through specialized abacus and cognitive training. Join 10,000+ students on a journey toward lifelong mathematical and mental excellence.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/contact" className="bg-[#197fe6] hover:bg-[#197fe6]/90 text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-[#197fe6]/20 flex items-center gap-2 text-center justify-center">
                      Enroll Your Child <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                    <Link href="/franchise" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#f59e0b] text-[#0e141b] dark:text-white px-8 py-4 rounded-xl text-base font-bold transition-all flex items-center gap-2 group text-center justify-center">
                      <span className="text-[#f59e0b] material-symbols-outlined">storefront</span>
                      Explore Franchise Opportunity
                    </Link>
                  </div>
                </div>
              </SlideIn>

              <ScaleIn delay={0.2}>
                <div className="relative">
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#197fe6]/5 rounded-full blur-3xl"></div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 border-4 border-white dark:border-slate-800">
                    <Image
                      src="/Images/DSC_0037-scaled-1.jpg"
                      alt="Ascento Abacus Learning Center"
                      width={800}
                      height={600}
                      className="w-full aspect-[4/3] object-cover"
                      priority
                    />
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-white dark:bg-[#0e141b] py-12 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center border-none">
              {[
                { label: "Active Students", value: "10K+" },
                { label: "Growth Impact", value: "145K+" },
                { label: "Learning Centers", value: "50+" },
                { label: "Years Excellence", value: "15+" }
              ].map((stat, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div>
                    <p className="text-4xl font-black text-[#197fe6] mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Overview Section */}
        <section className="py-24 bg-white dark:bg-[#0e141b]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <FadeIn>
                <h2 className="text-[#f59e0b] font-bold text-sm uppercase tracking-[0.2em] mb-4">Our Curriculum</h2>
                <h3 className="text-3xl md:text-5xl font-black text-[#0e141b] dark:text-white tracking-tight">Empowering Every Learning Stage</h3>
              </FadeIn>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Abacus Mastery",
                  desc: "Foundation for mental arithmetic and lightning-fast calculations without calculators.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdFhqG9a9-fBgKLgbNPqwnO5voA87LfZmXLxHt4dmOHXmsnYUEXMdg322k0PM-pKokF0DIHWmxw1O8JPpF_3a3W1oFpRGZC-u9f_xx3VVSu5Whbhf3kVsk_QJxoa-n8MyBzqIDsApK3bkk4a3Y8DfASHrkxFWGvvYNW7rhMvN6-1zEqR70uqtHtPDG6BYeCZGDlNTn9rTKRXy39mFzO8xucea9PwtU5_R8gTVe0iaA1FH0M9VvyMbeoVlcvsdrFYO5IOR98aqeCks",
                  link: "/programs"
                },
                {
                   title: "Brain Gym",
                   desc: "Cognitive enhancement exercises designed to improve focus, memory, and coordination.",
                   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-KjGhIH5UWuoRzqykSXECuHJmSwiEhAg1Pq887ETL2CeXteE6zGQ2FmtE2TIQwE4pwpg9hWAqDpwaFIBU9FdWSb3QOh4rF1hEW_oweHQLZTbFxf1vSuiJPxoKbU5xfLxI5asllsPal1BMqRbe9nECVYcLxXos4YjvUhKB2d-UgwyY7UAiWyT6rW0J_r4gERaSLMKrDRi2joKGeEYPHLiYYfL6csQ10V89jKjrqKsl8Q4rE5h7zq3eFhgfRanDOaonuHsG9Q3Amu0",
                   link: "/programs"
                },
                {
                   title: "Vedic Maths",
                   desc: "Ancient speed math techniques for solving complex problems with high accuracy and speed.",
                   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9c0zn9HjZO8j8qoRm3yqdDDmrkV5RGqYcp01fHh5-lEbey_uFdVmnceNDbSu91Q6J8N86hpnq1fohRhAkEJOYxuambigsDjfRS5P50w8fXsQXYI_7LltFP1pRdwnWyiVYTKOvLkpV1vSRWw2nj0qRI-FTVhCwI879qqV2xzG1DathRr4ZYppLEAKML_qyEAb5kRrsOBDVz8PLFkgnw3PdzN_sHycV6m2K0q_SE3_LOErGva_Fz24W9x1P4s4U2qUy0gXZm2elxi8",
                   link: "/programs"
                },
                {
                   title: "Pre-Abacus",
                   desc: "Gentle introduction to numbers and visualization for toddlers aged 4 to 6 years.",
                   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8pGSOA7YE4IVngIktlp5rjhrt7XPSh2zZ6GtLBmkn2xv9057mWdDTVPPLuUqDjIvVmwjXQUMT_kVuP38Vkqh6Rp1AlbFakAaUrijdhtdKzAC1Of90EtBpD2-ealyMghqaNvujnaKoP0tExkJM_arDCuEaCussJased2VrOm8wq5ZJ0f7OmgU5smKtPQ6IDgIWM3tqPBVZr4wzEgDFNmNFgzII0jalKaGhYs8zzoE0Ys5yqm0iwm7xlvbDjSNBuTTLb8W5yfxKTdw",
                   link: "/programs"
                }
              ].map((prog, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="group bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-transparent hover:border-[#197fe6]/20 transition-all hover:shadow-xl">
                    <div className="aspect-square rounded-xl overflow-hidden mb-6">
                      <Image 
                        src={prog.img} 
                        alt={prog.title} 
                        width={400} 
                        height={400} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="px-4 pb-6">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-[#197fe6] transition-colors dark:text-white">{prog.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
                        {prog.desc}
                      </p>
                      <Link href={prog.link} className="text-[#197fe6] font-bold text-sm flex items-center gap-2 group/link">
                        Explore Program 
                        <span className="material-symbols-outlined text-base group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 bg-white dark:bg-[#0e141b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="/Images/DSC_0037-scaled-1.jpg" 
                        alt="Student practicing abacus" 
                        width={400} 
                        height={500} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="h-40 bg-[#f59e0b]/10 rounded-2xl p-6 flex flex-col justify-end">
                      <p className="text-[#f59e0b] font-black text-3xl">98%</p>
                      <p className="text-[#0e141b] dark:text-white text-xs font-bold uppercase tracking-wider">Retention Rate</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-40 bg-[#197fe6]/10 rounded-2xl p-6 flex flex-col justify-end">
                      <p className="text-[#197fe6] font-black text-3xl">Expert</p>
                      <p className="text-[#0e141b] dark:text-white text-xs font-bold uppercase tracking-wider">Certified Trainers</p>
                    </div>
                    <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="/Images/WhatsApp-Image-2025-06-08-at-10.03.39_0f634c25-r70q3atn2hrk6sl09jh6d3zwf68pahr7jeygaih09s.jpg" 
                        alt="Teacher explaining math concept" 
                        width={400} 
                        height={500} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2 space-y-10">
                <SlideIn direction="right">
                  <h2 className="text-4xl lg:text-5xl font-black text-[#0e141b] dark:text-white leading-tight tracking-tight">
                    Why Parents Choose <br/><span className="text-[#197fe6]">Ascento Abacus?</span>
                  </h2>
                </SlideIn>
                <div className="space-y-8">
                  {[
                    {
                      icon: "psychology",
                      title: "Whole Brain Development",
                      desc: "Our syllabus stimulates both left (logical) and right (creative) brain hemispheres simultaneously.",
                      color: "text-[#197fe6] bg-[#197fe6]/10"
                    },
                    {
                      icon: "emoji_events",
                      title: "Globally Recognized",
                      desc: "Certification that is respected worldwide, giving your child a competitive edge in global exams.",
                      color: "text-[#f59e0b] bg-[#f59e0b]/10"
                    },
                    {
                      icon: "diversity_3",
                      title: "Small Batch Sizes",
                      desc: "Personalized attention for every child ensures steady progress and concept clarity.",
                      color: "text-emerald-600 bg-emerald-50"
                    }
                  ].map((feat, idx) => (
                    <FadeIn key={idx} delay={idx * 0.1}>
                      <div className="flex gap-5 group">
                        <div className={`shrink-0 size-14 ${feat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-1 dark:text-white">{feat.title}</h4>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex bg-[#0e141b] dark:bg-slate-700 text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:bg-[#197fe6] hover:shadow-xl hover:shadow-[#197fe6]/20 items-center gap-2 group">
                  Enroll Your Child Today
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-[#f8fafc] dark:bg-[#020617]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#0e141b] dark:text-white mb-4">Our Learning <span className="text-[#197fe6]">Environment</span></h2>
              <p className="text-slate-500 max-w-2xl mx-auto italic font-medium">Glimpses of our vibrant classrooms and the focused journey of our students.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_cfe7f04f.jpg", alt: "Students learning abacus", span: "md:col-span-1" },
                { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_e3ac77d8.jpg", alt: "Abacus training session", span: "md:col-span-1" },
                { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.38_091c0f31.jpg", alt: "Advanced abacus student", span: "md:col-span-1" },
                { src: "/Images/WhatsApp-Image-2025-06-08-at-10.03.39_0f634c25-r70q3atn2hrk6sl09jh6d3zwf68pahr7jeygaih09s.jpg", alt: "Classroom activities", span: "md:col-span-2" },
                { src: "/Images/IMG_20190930_102619.jpg", alt: "Award winning students", span: "md:col-span-1" }
              ].map((img, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ${img.span}`}>
                    <Image 
                      src={img.src} 
                      alt={img.alt} 
                      width={800} 
                      height={600} 
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <p className="text-white font-bold text-lg">{img.alt}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Meet Our Team Section */}
        <section className="py-24 bg-white dark:bg-[#0e141b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <FadeIn>
                <h2 className="text-[#f59e0b] font-bold text-sm uppercase tracking-[0.2em] mb-4">Our Educators</h2>
                <h3 className="text-3xl md:text-5xl font-black text-[#0e141b] dark:text-white tracking-tight">Meet the Team Behind <span className="text-[#197fe6]">Every Success</span></h3>
                <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">Passionate educators and caregivers dedicated to nurturing young minds with experience, expertise, and love.</p>
              </FadeIn>
            </div>

            {/* Principal — Featured Card */}
            <FadeIn>
              <div className="mb-12 bg-gradient-to-br from-[#197fe6]/5 to-[#f59e0b]/5 dark:from-[#197fe6]/10 dark:to-[#f59e0b]/10 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                  <div className="shrink-0 size-28 lg:size-32 bg-gradient-to-br from-[#197fe6] to-[#197fe6]/70 rounded-3xl flex items-center justify-center shadow-xl shadow-[#197fe6]/20">
                    <span className="text-white font-black text-4xl lg:text-5xl">BT</span>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1 rounded-full mb-3">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Principal</span>
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-black text-[#0e141b] dark:text-white mb-1">Mrs. Bala Tomar</h4>
                    <p className="text-[#197fe6] font-semibold text-sm mb-4">M.A., B.Ed., NET Qualified &bull; 27 Years Experience</p>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      A distinguished educationist and the visionary leader of Ascento Play School, Dwarka. Mrs. Tomar brings 27 years of rich experience in teaching, academic leadership, and student development. She believes in a child-centric, activity-based learning approach where education goes beyond books.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Right Brain Development", "Midbrain Activation", "Abacus & Vedic Maths", "Hindi & Sanskrit Expert", "Teacher Mentoring", "Franchise Training"].map((tag) => (
                        <span key={tag} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Other Team Members */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  initials: "KS",
                  name: "Mrs. Kashish Sheopuri",
                  role: "Office Admin & Play School Teacher",
                  qual: "B.Com, Computer Diploma",
                  exp: "2 Years",
                  desc: "Efficiently manages administrative responsibilities while actively engaging with young learners through interactive, activity-based teaching methods.",
                  color: "from-emerald-500 to-emerald-400",
                  shadow: "shadow-emerald-500/20",
                  tags: ["Administration", "Interactive Teaching"]
                },
                {
                  initials: "AR",
                  name: "Mrs. Aarti Rathore",
                  role: "Senior Teacher (Play School – Class 2)",
                  qual: "M.A., Computer Diploma",
                  exp: "8 Years",
                  desc: "A seasoned educator shaping foundational learners from Play School to Class 2 with activity-based, practical teaching that builds understanding and confidence.",
                  color: "from-[#197fe6] to-blue-400",
                  shadow: "shadow-[#197fe6]/20",
                  tags: ["Early Education", "Classroom Management"]
                },
                {
                  initials: "SS",
                  name: "Ms. Soni Sehgal",
                  role: "Teacher (Pre-Nursery & Nursery)",
                  qual: "B.A., Basic Computer Diploma",
                  exp: "4 Years",
                  desc: "A sincere and hardworking educator dedicated to creating a nurturing atmosphere where the youngest learners feel encouraged to explore and grow.",
                  color: "from-[#f59e0b] to-amber-400",
                  shadow: "shadow-[#f59e0b]/20",
                  tags: ["Pre-Nursery", "Nursery"]
                },
                {
                  initials: "SV",
                  name: "Mrs. Santosh Verma",
                  role: "Kids Care Assistant (Nanny)",
                  qual: "Pre-Nursery & Nursery Support",
                  exp: "35 Years",
                  desc: "With an extraordinary 35 years of child care experience, she ensures every child's safety, comfort, and emotional well-being with warmth and dedication.",
                  color: "from-rose-500 to-pink-400",
                  shadow: "shadow-rose-500/20",
                  tags: ["Child Care", "Safety & Comfort"]
                }
              ].map((member, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-[#197fe6]/20 transition-all hover:shadow-xl p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`shrink-0 size-14 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center ${member.shadow} shadow-lg transition-transform group-hover:scale-110`}>
                        <span className="text-white font-black text-lg">{member.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-[#0e141b] dark:text-white truncate">{member.name}</h4>
                        <p className="text-[#197fe6] text-xs font-semibold truncate">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">school</span>
                        {member.qual}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      <span className="bg-[#197fe6]/10 text-[#197fe6] text-xs font-bold px-2.5 py-1 rounded-full">{member.exp}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1 mb-4">{member.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {member.tags.map((tag) => (
                        <span key={tag} className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-full border border-slate-200 dark:border-slate-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScaleIn>
              <div className="bg-[#197fe6] rounded-[2.5rem] p-8 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-[#197fe6]/30">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
                  </svg>
                </div>
                <div className="relative z-10 lg:w-3/5 text-center lg:text-left">
                  <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">Start Your Entrepreneurial Journey Today</h2>
                  <p className="text-white/80 text-lg max-w-xl">
                    Join our network of 50+ successful centers. We provide end-to-end support, training, and marketing materials to help you succeed.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col gap-4 w-full lg:w-auto items-center">
                  <Link href="/franchise" className="bg-white text-[#197fe6] px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105 hover:shadow-2xl shadow-xl whitespace-nowrap">
                    Become a Franchisee
                  </Link>
                  <p className="text-white/60 text-sm font-medium tracking-wide">Low Investment • High ROI • Dedicated Support</p>
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
