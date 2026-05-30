




// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Reveal } from "@/ui/home/Reveal";

// export default function PlayschoolNew() {
//   /* ── 1. Hero Auto-Slider State ── */
//   const heroImages = [
//     "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&q=80",
//     "https://images.unsplash.com/photo-1587691592099-24045742c181?w=1600&q=80",
//     "https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=1600&q=80"
//   ];
//   const [currentHero, setCurrentHero] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 4000);
//     return () => clearInterval(timer);
//   }, [heroImages.length]);

//   /* ── 2. Programs Carousel State ── */
//   const programs = [
//     { id: 1, title: "Playgroup (2-3 Years)", desc: "These Years Are About Curiosity And Readiness. A warm introduction to learning.", img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" },
//     { id: 2, title: "Nursery (3-4 Years)", desc: "These Years Are About Curiosity And Readiness. Exploring colors, shapes, and sounds.", img: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" },
//     { id: 3, title: "Kindergarten (4-5 Years)", desc: "These Years Are About Curiosity And Readiness. Preparing for the big step with numbers and letters.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
//     { id: 4, title: "Day Care", desc: "A safe, loving, and engaging environment for your child while you work.", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" },
//   ];
//   const [progIndex, setProgIndex] = useState(0);
//   const nextProg = () => setProgIndex((prev) => (prev + 1) % programs.length);
//   const prevProg = () => setProgIndex((prev) => (prev === 0 ? programs.length - 1 : prev - 1));

//   /* ── 3. Testimonials Carousel State ── */
//   const testimonials = [
//     { name: "Kanta Yadav", time: "2 months ago", text: "The school has done a tremendous job my child has learnt a lot and he is so happy to go to school...", img: "https://randomuser.me/api/portraits/women/44.jpg" },
//     { name: "Shikha Mittal", time: "2 months ago", text: "Children are taken care like we parents take care our children... Teachers and staff is the best part.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
//     { name: "Geetu Tyagi", time: "2 months ago", text: "My experience has been very good so far!! Easily the best kids school in the area!! Highly recommended.", img: "https://randomuser.me/api/portraits/women/32.jpg" },
//     { name: "Ety Jindal", time: "2 months ago", text: "A fantastic start for my child's educational journey. My child has blossomed into a confident learner.", img: "https://randomuser.me/api/portraits/women/12.jpg" },
//   ];
//   const [testiIndex, setTestiIndex] = useState(0);
//   const nextTesti = () => setTestiIndex((prev) => (prev + 1) % (testimonials.length - 2));
//   const prevTesti = () => setTestiIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1));

//   return (
//     <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFFFF", color: "#2D3142", overflowX: "hidden" }}>
      
//       {/* ── GLOBAL STYLES & ANIMATIONS ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         /* Typography */
//         .font-fredoka { font-family: 'Fredoka One', cursive; }
//         .text-orange { color: #F68B33; }
//         .text-purple { color: #7C5D9F; }
//         .text-navy { color: #2D3142; }
//         .bg-orange { background-color: #F68B33; }
//         .bg-purple { background-color: #7C5D9F; }

//         /* Themed Elements */
//         .dashed-border {
//           border: 2px dashed #CBD5E1;
//           border-radius: 24px;
//         }
        
//         .scalloped-top {
//           position: absolute;
//           top: 0; left: 0; right: 0; height: 15px;
//           background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px);
//           background-size: 20px 20px;
//           background-repeat: repeat-x;
//           z-index: 10;
//         }

//         /* Animations */
//         .hover-lift { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease; }
//         .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
//         .float { animation: float 4s ease-in-out infinite; }
//         .float-delay { animation: float 4s ease-in-out 2s infinite; }
//         @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        
//         .wiggle { animation: wiggle 2.5s ease-in-out infinite; }
//         @keyframes wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

//         .spin-slow { animation: spin 15s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }

//         /* Image Gallery Hover (from reference) */
//         .gallery-card { position: relative; overflow: hidden; border-radius: 24px; cursor: pointer; }
//         .gallery-overlay {
//           position: absolute; inset: 0; background: rgba(246, 139, 51, 0.85);
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           opacity: 0; transition: all 0.4s ease; transform: translateY(20px);
//         }
//         .gallery-card:hover .gallery-overlay { opacity: 1; transform: translateY(0); }
//         .gallery-card img { transition: transform 0.6s ease; width: 100%; height: 100%; object-fit: cover; }
//         .gallery-card:hover img { transform: scale(1.1); }

//         /* Media Queries */
//         @media (max-width: 1024px) {
//           .intro-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
//           .intro-imgs { height: 500px !important; }
//           .carousel-track { transform: translateX(calc(-100% * var(--idx))) !important; }
//           .prog-card-wrap { min-width: 100% !important; }
//           .testi-track { transform: translateX(calc(-100% * var(--idx))) !important; }
//           .testi-card-wrap { min-width: 100% !important; }
//           .gallery-grid { grid-template-columns: 1fr 1fr !important; }
//         }
//         @media (max-width: 768px) {
//           .hero-box { margin: 60px 20px !important; padding: 30px 20px !important; }
//           .hero-title { font-size: 2.5rem !important; }
//           .gallery-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* ════════════════════════════════════════════
//           1. HERO SECTION (Auto-sliding background)
//       ════════════════════════════════════════════ */}
//       <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "80px" }}>
//         <div className="scalloped-top"></div>
        
//         {/* Auto Fading Background Images */}
//         {heroImages.map((src, i) => (
//           <div key={i} style={{
//             position: "absolute", inset: 0, zIndex: 0,
//             opacity: currentHero === i ? 1 : 0,
//             transition: "opacity 1.5s ease-in-out, transform 6s linear",
//             transform: currentHero === i ? "scale(1.05)" : "scale(1)",
//             backgroundImage: `url(${src})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center"
//           }}>
//             {/* Overlay to ensure text readability */}
//             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%)" }} />
//           </div>
//         ))}

//         <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1, padding: "0 20px" }}>
//           <Reveal>
//             <div className="hero-box dashed-border float" style={{ 
//               background: "white", padding: "50px", maxWidth: "550px", 
//               boxShadow: "0 25px 50px rgba(0,0,0,0.1)", position: "relative" 
//             }}>
//               {/* Star Icon floating */}
//               <div className="wiggle text-orange" style={{ position: "absolute", top: "-25px", left: "40px", fontSize: "40px" }}>⭐</div>
//               <div className="spin-slow text-purple" style={{ position: "absolute", bottom: "-20px", right: "40px", fontSize: "30px" }}>⚙️</div>

//               <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
//                 <span className="text-purple" style={{ fontSize: "24px" }}>👾</span>
//                 <span className="text-orange" style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>Fun Happens!</span>
//               </div>

//               <h1 className="hero-title font-fredoka text-orange" style={{ fontSize: "4rem", lineHeight: 1.1, marginBottom: "16px" }}>
//                 The Kids Center <span className="text-navy">Education</span>
//               </h1>
              
//               <p style={{ fontSize: "1.2rem", color: "#666", fontWeight: 600, marginBottom: "32px" }}>
//                 Work And Play Come Together ?
//               </p>

//               <Link href="/contact" className="hover-lift bg-orange" style={{ 
//                 color: "white", padding: "16px 40px", borderRadius: "50px", 
//                 fontWeight: 900, fontSize: "16px", textDecoration: "none", 
//                 display: "inline-block", letterSpacing: "1px", textTransform: "uppercase",
//                 boxShadow: "0 10px 25px rgba(246, 139, 51, 0.4)"
//               }}>
//                 ADMISSION
//               </Link>
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           2. INTRODUCTION (18+ Years Layout)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FAFAFF" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <div className="intro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            
//             {/* Left Grid: Images & Badge */}
//             <div className="intro-imgs" style={{ position: "relative", height: "600px", width: "100%" }}>
//               <Reveal>
//                 <div className="dashed-border" style={{ position: "absolute", top: 0, right: "10%", width: "60%", height: "250px", overflow: "hidden", padding: "6px", background: "white", zIndex: 2 }}>
//                   <img src="https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=600&q=80" alt="Boy playing" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
//                 </div>
//               </Reveal>

//               <Reveal delay={100}>
//                 <div className="dashed-border" style={{ position: "absolute", top: "20%", left: 0, width: "65%", height: "400px", overflow: "hidden", padding: "6px", background: "white", zIndex: 1 }}>
//                   <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80" alt="Girl smiling" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
//                 </div>
//               </Reveal>

//               {/* 18+ Block */}
//               <Reveal delay={200}>
//                 <div style={{ position: "absolute", bottom: "-20px", right: "10%", display: "flex", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", zIndex: 3 }}>
//                   <div className="bg-orange" style={{ padding: "24px 16px", color: "white", fontWeight: 900, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", letterSpacing: "2px" }}>
//                     YEARS OF EXPERIENCE
//                   </div>
//                   <div style={{ backgroundColor: "#2D4B8E", padding: "30px 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <span className="font-fredoka" style={{ color: "white", fontSize: "3.5rem" }}>18+</span>
//                   </div>
//                 </div>
//               </Reveal>
//             </div>

//             {/* Right Text */}
//             <div>
//               <Reveal>
//                 <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "24px" }}>Introduction</h2>
//                 <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8, marginBottom: "20px" }}>
//                   At our Play School, we believe in nurturing little "natkhats" (playful tots) with lots of love and safe guidance. For <strong className="text-navy">18 years</strong> our bright, cheerful classrooms have been a second home where tiny explorers laugh, play, and learn.
//                 </p>
//                 <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8 }}>
//                   We've built a <strong className="text-navy">trusted legacy</strong>: thousands of families have seen their children thrive here, from first steps to confident pre-schoolers. We also offer specialized programs to foster creativity and curiosity.
//                 </p>
//                 <Link href="/about" className="hover-lift" style={{ display: "inline-flex", marginTop: "30px", alignItems: "center", gap: "10px", color: "#F68B33", fontWeight: 800, fontSize: "1.1rem", textDecoration: "none" }}>
//                   Read More <span style={{ fontSize: "1.5rem" }}>→</span>
//                 </Link>
//               </Reveal>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           3. PROGRAMS / CLASSES (Interactive Slider)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FFFFFF", position: "relative", overflow: "hidden" }}>
//         {/* Decorative background shapes */}
//         <div style={{ position: "absolute", top: "10%", left: "-5%", width: "300px", height: "300px", background: "#F0FFFE", borderRadius: "50%", zIndex: 0 }}></div>
        
//         <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
//           <Reveal>
//             <div style={{ textAlign: "center", marginBottom: "60px" }}>
//               <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem" }}>Our Programs</h2>
//               <p style={{ fontSize: "1.2rem", color: "#666", marginTop: "10px" }}>Discover the perfect learning environment for your child.</p>
//             </div>
//           </Reveal>

//           {/* Slider Container */}
//           <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            
//             {/* Prev Button */}
//             <button onClick={prevProg} className="hover-lift text-navy" style={{ background: "transparent", border: "none", fontSize: "3rem", cursor: "pointer", zIndex: 2 }}>←</button>
            
//             {/* Track */}
//             <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
//               <div 
//                 className="carousel-track"
//                 style={{ 
//                   display: "flex", transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
//                   transform: `translateX(calc(-50% * ${progIndex}))`,
//                   '--idx': progIndex 
//                 } as any}
//               >
//                 {programs.map((prog, i) => (
//                   <div key={prog.id} className="prog-card-wrap" style={{ minWidth: "50%", padding: "0 15px", flexShrink: 0 }}>
//                     <div className="dashed-border hover-lift" style={{ background: "white", padding: "12px", height: "100%", display: "flex", flexDirection: "column" }}>
                      
//                       <div style={{ position: "relative", height: "260px", borderRadius: "16px", overflow: "hidden" }}>
//                         <img src={prog.img} alt={prog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        
//                         {/* Overlapping Orange Icon */}
//                         <div className="bg-orange" style={{ 
//                           position: "absolute", bottom: "-25px", left: "50%", transform: "translateX(-50%)",
//                           width: "60px", height: "60px", borderRadius: "50%", border: "4px solid white",
//                           display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", zIndex: 2
//                         }}>
//                           🏫
//                         </div>
//                       </div>

//                       <div style={{ padding: "40px 20px 20px", textAlign: "center", flex: 1 }}>
//                         <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{prog.title}</h3>
//                         <p style={{ color: "#777", lineHeight: 1.6 }}>{prog.desc}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Next Button */}
//             <button onClick={nextProg} className="hover-lift text-navy" style={{ background: "transparent", border: "none", fontSize: "3rem", cursor: "pointer", zIndex: 2 }}>→</button>
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           4. WHY CHOOSE US (To extend page length)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "80px 20px", background: "#F4F7FB" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3rem", textAlign: "center", marginBottom: "50px" }}>Why Parents Choose Us</h2>
//           </Reveal>
          
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
//             {[
//               { icon: "🛡️", title: "100% Safe", desc: "CCTV monitored campuses with child-safe furniture." },
//               { icon: "👩‍🏫", title: "Caring Staff", desc: "Trained teachers with a low student-to-teacher ratio." },
//               { icon: "🎨", title: "Play-Way Method", desc: "Learning by doing, playing, singing, and dancing." },
//               { icon: "🍎", title: "Healthy Habits", desc: "Focus on hygiene, self-feeding, and good manners." }
//             ].map((feature, i) => (
//               <Reveal key={i} delay={i * 100}>
//                 <div className="hover-lift dashed-border" style={{ background: "white", padding: "40px 30px", textAlign: "center", height: "100%" }}>
//                   <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{feature.icon}</div>
//                   <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{feature.title}</h3>
//                   <p style={{ color: "#666" }}>{feature.desc}</p>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           5. GALLERY (Hover Orange Overlay)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "white" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <div style={{ textAlign: "center", marginBottom: "50px" }}>
//               <span className="font-fredoka" style={{ fontSize: "1.2rem", color: "#777", letterSpacing: "2px", textTransform: "uppercase" }}>Leader of a future</span>
//               <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem" }}>Our Gallery</h2>
//             </div>
//           </Reveal>

//           <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            
//             {/* Top Left */}
//             <Reveal delay={50}>
//               <div className="gallery-card dashed-border" style={{ height: "300px" }}>
//                 <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" alt="Kids playing" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Kids Ground</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Top Middle */}
//             <Reveal delay={100}>
//               <div className="gallery-card dashed-border" style={{ height: "300px" }}>
//                 <img src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" alt="Art Class" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Art & Craft</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Right Tall (Spans 2 rows) */}
//             <Reveal delay={150}>
//               <div className="gallery-card dashed-border" style={{ height: "100%", gridRow: "span 2" }}>
//                 <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" alt="School Reading" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <span style={{ color: "white", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 700 }}>School</span>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white" }}>Kids ground</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Bottom Wide (Spans 2 cols) */}
//             <Reveal delay={200}>
//               <div className="gallery-card dashed-border" style={{ height: "300px", gridColumn: "span 2" }}>
//                 <img src="https://images.unsplash.com/photo-1587691592099-24045742c181?w=1000&q=80" alt="Fun activity" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white" }}>Fun Activities</h3>
//                 </div>
//               </div>
//             </Reveal>

//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           6. TESTIMONIALS (What Say Parents)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FAFAFF", overflow: "hidden" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "60px" }}>What Say Parents</h2>
//           </Reveal>

//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <button onClick={prevTesti} className="hover-lift" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#94A3B8", color: "white", border: "none", fontSize: "1.2rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❮</button>
            
//             <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
//               <div 
//                 className="testi-track"
//                 style={{ 
//                   display: "flex", transition: "transform 0.5s ease",
//                   transform: `translateX(calc(-33.333% * ${testiIndex}))`,
//                   '--idx': testiIndex 
//                 } as any}
//               >
//                 {testimonials.map((t, i) => (
//                   <div key={i} className="testi-card-wrap" style={{ minWidth: "33.333%", padding: "0 15px", flexShrink: 0 }}>
//                     <div className="hover-lift" style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column" }}>
                      
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative" }}>
//                         <img src={t.img} alt={t.name} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
//                         {/* Tiny Google logo overlay */}
//                         <div style={{ position: "absolute", bottom: "-5px", left: "30px", background: "white", borderRadius: "50%", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
//                           <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={{ width: "16px", height: "16px" }} alt="Google" />
//                         </div>
//                         <div>
//                           <div style={{ fontWeight: 800, color: "#1A1A2E", display: "flex", alignItems: "center", gap: "4px" }}>
//                             {t.name} <span style={{ color: "#3B82F6", fontSize: "14px" }}>✔</span>
//                           </div>
//                           <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{t.time}</div>
//                         </div>
//                       </div>

//                       <div style={{ color: "#FBBF24", fontSize: "1.2rem", marginBottom: "12px", letterSpacing: "2px" }}>★★★★★</div>
                      
//                       <p style={{ color: "#555", lineHeight: 1.6, flex: 1 }}>{t.text}</p>
                      
//                       <button style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 700, textAlign: "left", marginTop: "12px", cursor: "pointer", padding: 0 }}>Read more</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button onClick={nextTesti} className="hover-lift" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#94A3B8", color: "white", border: "none", fontSize: "1.2rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❯</button>
//           </div>

//           <div style={{ textAlign: "center", marginTop: "30px" }}>
//             <span style={{ display: "inline-block", background: "#F1F5F9", padding: "8px 16px", borderRadius: "50px", fontSize: "0.9rem", color: "#64748B", fontWeight: 600 }}>
//               ↻ Free Google Reviews Widget
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           7. ENQUIRY FORM (To inquire or apply)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "white", position: "relative" }}>
//         {/* Decorative faint notebook rings left side */}
//         <div style={{ position: "absolute", left: "-50px", top: "20%", opacity: 0.05, pointerEvents: "none" }}>
//           <svg width="200" height="600" viewBox="0 0 200 600" fill="none">
//             {[0,1,2,3,4,5].map(i => (
//               <path key={i} d={`M 50 ${100 * i + 50} C 150 ${100 * i + 20}, 150 ${100 * i + 80}, 50 ${100 * i + 50}`} stroke="#000" strokeWidth="20" strokeLinecap="round" />
//             ))}
//           </svg>
//         </div>

//         <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3rem", marginBottom: "16px" }}>To inquire or apply,</h2>
//             <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "50px" }}>To inquire or apply, just fill out our Enquiry Form with these details</p>
//           </Reveal>

//           <Reveal delay={100}>
//             <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} onSubmit={(e)=>e.preventDefault()}>
//               <input type="text" placeholder="Parent's Name *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
//               <input type="text" placeholder="Child's Name *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
              
//               <input type="email" placeholder="Email Address *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
//               <input type="tel" placeholder="Phone *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
              
//               <select style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#999", gridColumn: "span 2", cursor: "pointer", appearance: "none" }}>
//                 <option value="">Select Program *</option>
//                 <option value="playgroup">Playgroup</option>
//                 <option value="nursery">Nursery</option>
//                 <option value="lkg">LKG</option>
//                 <option value="ukg">UKG</option>
//               </select>

//               <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "20px" }}>
//                 <button className="hover-lift bg-purple" style={{ 
//                   color: "white", border: "none", padding: "18px 60px", borderRadius: "50px", 
//                   fontSize: "1.2rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 30px rgba(124, 93, 159, 0.4)"
//                 }}>
//                   Submit Enquiry
//                 </button>
//               </div>
//             </form>
//           </Reveal>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           FLOATING ACTION BUTTONS (from reference)
//       ════════════════════════════════════════════ */}
//       <div style={{ position: "fixed", bottom: "30px", right: "30px", display: "flex", flexDirection: "column", gap: "16px", zIndex: 100 }}>
//         {/* Fake Scroll Progress Circle */}
//         <div className="bg-orange hover-lift" style={{ width: "50px", height: "50px", borderRadius: "50%", border: "3px solid #2D3142", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "12px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
//           84%
//         </div>
//         {/* WhatsApp Button */}
//         <div className="hover-lift" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
//           <div style={{ background: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", color: "#555" }}>
//             Need Help? <strong>Chat with us</strong>
//           </div>
//           <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(37,211,102,0.4)" }}>
//             <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
//               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
//             </svg>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }













// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Reveal } from "@/ui/home/Reveal";

// export default function PlayschoolNew() {
//   /* ── 1. Hero Auto-Slider State ── */
//   const heroImages = [
//     "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&q=80",
//     "https://images.unsplash.com/photo-1587691592099-24045742c181?w=1600&q=80",
//     "https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=1600&q=80"
//   ];
//   const [currentHero, setCurrentHero] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 4000);
//     return () => clearInterval(timer);
//   }, [heroImages.length]);

//   /* ── 2. Programs Carousel State ── */
//   const programs = [
//     { id: 1, title: "Playgroup (2-3 Years)", desc: "These Years Are About Curiosity And Readiness. A warm introduction to learning.", img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" },
//     { id: 2, title: "Nursery (3-4 Years)", desc: "These Years Are About Curiosity And Readiness. Exploring colors, shapes, and sounds.", img: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" },
//     { id: 3, title: "Kindergarten (4-5 Years)", desc: "These Years Are About Curiosity And Readiness. Preparing for the big step with numbers and letters.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
//     { id: 4, title: "Day Care", desc: "A safe, loving, and engaging environment for your child while you work.", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" },
//   ];
//   const [progIndex, setProgIndex] = useState(0);
//   const nextProg = () => setProgIndex((prev) => (prev + 1) % programs.length);
//   const prevProg = () => setProgIndex((prev) => (prev === 0 ? programs.length - 1 : prev - 1));

//   /* ── 3. Testimonials Carousel State ── */
//   const testimonials = [
//     { name: "Kanta Yadav", time: "2 months ago", text: "The school has done a tremendous job my child has learnt a lot and he is so happy to go to school...", img: "https://randomuser.me/api/portraits/women/44.jpg" },
//     { name: "Shikha Mittal", time: "2 months ago", text: "Children are taken care like we parents take care our children... Teachers and staff is the best part.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
//     { name: "Geetu Tyagi", time: "2 months ago", text: "My experience has been very good so far!! Easily the best kids school in the area!! Highly recommended.", img: "https://randomuser.me/api/portraits/women/32.jpg" },
//     { name: "Ety Jindal", time: "2 months ago", text: "A fantastic start for my child's educational journey. My child has blossomed into a confident learner.", img: "https://randomuser.me/api/portraits/women/12.jpg" },
//   ];
//   const [testiIndex, setTestiIndex] = useState(0);
//   const nextTesti = () => setTestiIndex((prev) => (prev + 1) % (testimonials.length - 2));
//   const prevTesti = () => setTestiIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1));

//   return (
//     <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFFFF", color: "#2D3142", overflowX: "hidden" }}>
      
//       {/* ── GLOBAL STYLES & ANIMATIONS ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         html { scroll-behavior: smooth; }

//         /* Typography */
//         .font-fredoka { font-family: 'Fredoka One', cursive; }
//         .text-orange { color: #F68B33; }
//         .text-purple { color: #7C5D9F; }
//         .text-navy { color: #2D3142; }
//         .bg-orange { background-color: #F68B33; }
//         .bg-purple { background-color: #7C5D9F; }

//         /* Themed Elements */
//         .dashed-border {
//           border: 2px dashed #CBD5E1;
//           border-radius: 24px;
//         }
        
//         .scalloped-top {
//           position: absolute;
//           top: 0; left: 0; right: 0; height: 15px;
//           background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px);
//           background-size: 20px 20px;
//           background-repeat: repeat-x;
//           z-index: 10;
//         }

//         /* Animations */
//         .hover-lift { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease; }
//         .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
//         .float { animation: float 4s ease-in-out infinite; }
//         .float-delay { animation: float 4s ease-in-out 2s infinite; }
//         @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        
//         .wiggle { animation: wiggle 2.5s ease-in-out infinite; }
//         @keyframes wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

//         .spin-slow { animation: spin 15s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }

//         /* Image Gallery Hover (from reference) */
//         .gallery-card { position: relative; overflow: hidden; border-radius: 24px; cursor: pointer; }
//         .gallery-overlay {
//           position: absolute; inset: 0; background: rgba(246, 139, 51, 0.85);
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           opacity: 0; transition: all 0.4s ease; transform: translateY(20px);
//         }
//         .gallery-card:hover .gallery-overlay { opacity: 1; transform: translateY(0); }
//         .gallery-card img { transition: transform 0.6s ease; width: 100%; height: 100%; object-fit: cover; }
//         .gallery-card:hover img { transform: scale(1.1); }

//         /* Media Queries */
//         @media (max-width: 1024px) {
//           .intro-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
//           .intro-imgs { height: 500px !important; }
//           .carousel-track { transform: translateX(calc(-100% * var(--idx))) !important; }
//           .prog-card-wrap { min-width: 100% !important; }
//           .testi-track { transform: translateX(calc(-100% * var(--idx))) !important; }
//           .testi-card-wrap { min-width: 100% !important; }
//           .gallery-grid { grid-template-columns: 1fr 1fr !important; }
//         }
//         @media (max-width: 768px) {
//           .hero-box { margin: 60px 20px !important; padding: 30px 20px !important; }
//           .hero-title { font-size: 2.5rem !important; }
//           .gallery-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>

//       {/* ════════════════════════════════════════════
//           1. HERO SECTION (Auto-sliding background)
//       ════════════════════════════════════════════ */}
//       <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "80px" }}>
//         <div className="scalloped-top"></div>
        
//         {/* Auto Fading Background Images */}
//         {heroImages.map((src, i) => (
//           <div key={i} style={{
//             position: "absolute", inset: 0, zIndex: 0,
//             opacity: currentHero === i ? 1 : 0,
//             transition: "opacity 1.5s ease-in-out, transform 6s linear",
//             transform: currentHero === i ? "scale(1.05)" : "scale(1)",
//             backgroundImage: `url(${src})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center"
//           }}>
//             {/* Overlay to ensure text readability */}
//             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%)" }} />
//           </div>
//         ))}

//         <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1, padding: "0 20px" }}>
//           <Reveal>
//             <div className="hero-box dashed-border float" style={{ 
//               background: "white", padding: "50px", maxWidth: "550px", 
//               boxShadow: "0 25px 50px rgba(0,0,0,0.1)", position: "relative" 
//             }}>
//               {/* Star Icon floating */}
//               <div className="wiggle text-orange" style={{ position: "absolute", top: "-25px", left: "40px", fontSize: "40px" }}>⭐</div>
//               <div className="spin-slow text-purple" style={{ position: "absolute", bottom: "-20px", right: "40px", fontSize: "30px" }}>⚙️</div>

//               <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
//                 <span className="text-purple" style={{ fontSize: "24px" }}>👾</span>
//                 <span className="text-orange" style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>Fun Happens!</span>
//               </div>

//               <h1 className="hero-title font-fredoka text-orange" style={{ fontSize: "4rem", lineHeight: 1.1, marginBottom: "16px" }}>
//                 The Kids Center <span className="text-navy">Education</span>
//               </h1>
              
//               <p style={{ fontSize: "1.2rem", color: "#666", fontWeight: 600, marginBottom: "32px" }}>
//                 Work And Play Come Together ?
//               </p>

//               <Link href="/contact" className="hover-lift bg-orange" style={{ 
//                 color: "white", padding: "16px 40px", borderRadius: "50px", 
//                 fontWeight: 900, fontSize: "16px", textDecoration: "none", 
//                 display: "inline-block", letterSpacing: "1px", textTransform: "uppercase",
//                 boxShadow: "0 10px 25px rgba(246, 139, 51, 0.4)"
//               }}>
//                 ADMISSION
//               </Link>
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           2. INTRODUCTION (18+ Years Layout)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FAFAFF" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <div className="intro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            
//             {/* Left Grid: Images & Badge */}
//             <div className="intro-imgs" style={{ position: "relative", height: "600px", width: "100%" }}>
//               <Reveal>
//                 <div className="dashed-border" style={{ position: "absolute", top: 0, right: "10%", width: "60%", height: "250px", overflow: "hidden", padding: "6px", background: "white", zIndex: 2 }}>
//                   <img src="https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=600&q=80" alt="Boy playing" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
//                 </div>
//               </Reveal>

//               <Reveal delay={100}>
//                 <div className="dashed-border" style={{ position: "absolute", top: "20%", left: 0, width: "65%", height: "400px", overflow: "hidden", padding: "6px", background: "white", zIndex: 1 }}>
//                   <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80" alt="Girl smiling" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
//                 </div>
//               </Reveal>

//               {/* 18+ Block */}
//               <Reveal delay={200}>
//                 <div style={{ position: "absolute", bottom: "-20px", right: "10%", display: "flex", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", zIndex: 3 }}>
//                   <div className="bg-orange" style={{ padding: "24px 16px", color: "white", fontWeight: 900, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", letterSpacing: "2px" }}>
//                     YEARS OF EXPERIENCE
//                   </div>
//                   <div style={{ backgroundColor: "#2D4B8E", padding: "30px 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <span className="font-fredoka" style={{ color: "white", fontSize: "3.5rem" }}>18+</span>
//                   </div>
//                 </div>
//               </Reveal>
//             </div>

//             {/* Right Text */}
//             <div>
//               <Reveal>
//                 <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "24px" }}>Introduction</h2>
//                 <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8, marginBottom: "20px" }}>
//                   At our Play School, we believe in nurturing little "natkhats" (playful tots) with lots of love and safe guidance. For <strong className="text-navy">18 years</strong> our bright, cheerful classrooms have been a second home where tiny explorers laugh, play, and learn.
//                 </p>
//                 <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8 }}>
//                   We've built a <strong className="text-navy">trusted legacy</strong>: thousands of families have seen their children thrive here, from first steps to confident pre-schoolers. We also offer specialized programs to foster creativity and curiosity.
//                 </p>
//                 <Link href="/about" className="hover-lift" style={{ display: "inline-flex", marginTop: "30px", alignItems: "center", gap: "10px", color: "#F68B33", fontWeight: 800, fontSize: "1.1rem", textDecoration: "none" }}>
//                   Read More <span style={{ fontSize: "1.5rem" }}>→</span>
//                 </Link>
//               </Reveal>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           3. PROGRAMS / CLASSES (Interactive Slider)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FFFFFF", position: "relative", overflow: "hidden" }}>
//         {/* Decorative background shapes */}
//         <div style={{ position: "absolute", top: "10%", left: "-5%", width: "300px", height: "300px", background: "#F0FFFE", borderRadius: "50%", zIndex: 0 }}></div>
        
//         <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
//           <Reveal>
//             <div style={{ textAlign: "center", marginBottom: "60px" }}>
//               <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem" }}>Our Programs</h2>
//               <p style={{ fontSize: "1.2rem", color: "#666", marginTop: "10px" }}>Discover the perfect learning environment for your child.</p>
//             </div>
//           </Reveal>

//           {/* Slider Container */}
//           <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            
//             {/* Prev Button */}
//             <button onClick={prevProg} className="hover-lift text-navy" style={{ background: "transparent", border: "none", fontSize: "3rem", cursor: "pointer", zIndex: 2 }}>←</button>
            
//             {/* Track */}
//             <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
//               <div 
//                 className="carousel-track"
//                 style={{ 
//                   display: "flex", transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
//                   transform: `translateX(calc(-50% * ${progIndex}))`,
//                   '--idx': progIndex 
//                 } as any}
//               >
//                 {programs.map((prog, i) => (
//                   <div key={prog.id} className="prog-card-wrap" style={{ minWidth: "50%", padding: "0 15px", flexShrink: 0 }}>
//                     <div className="dashed-border hover-lift" style={{ background: "white", padding: "12px", height: "100%", display: "flex", flexDirection: "column" }}>
                      
//                       <div style={{ position: "relative", height: "260px", borderRadius: "16px", overflow: "hidden" }}>
//                         <img src={prog.img} alt={prog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        
//                         {/* Overlapping Orange Icon */}
//                         <div className="bg-orange" style={{ 
//                           position: "absolute", bottom: "-25px", left: "50%", transform: "translateX(-50%)",
//                           width: "60px", height: "60px", borderRadius: "50%", border: "4px solid white",
//                           display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", zIndex: 2
//                         }}>
//                           🏫
//                         </div>
//                       </div>

//                       <div style={{ padding: "40px 20px 20px", textAlign: "center", flex: 1 }}>
//                         <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{prog.title}</h3>
//                         <p style={{ color: "#777", lineHeight: 1.6 }}>{prog.desc}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Next Button */}
//             <button onClick={nextProg} className="hover-lift text-navy" style={{ background: "transparent", border: "none", fontSize: "3rem", cursor: "pointer", zIndex: 2 }}>→</button>
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           4. WHY CHOOSE US (To extend page length)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "80px 20px", background: "#F4F7FB" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3rem", textAlign: "center", marginBottom: "50px" }}>Why Parents Choose Us</h2>
//           </Reveal>
          
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
//             {[
//               { icon: "🛡️", title: "100% Safe", desc: "CCTV monitored campuses with child-safe furniture." },
//               { icon: "👩‍🏫", title: "Caring Staff", desc: "Trained teachers with a low student-to-teacher ratio." },
//               { icon: "🎨", title: "Play-Way Method", desc: "Learning by doing, playing, singing, and dancing." },
//               { icon: "🍎", title: "Healthy Habits", desc: "Focus on hygiene, self-feeding, and good manners." }
//             ].map((feature, i) => (
//               <Reveal key={i} delay={i * 100}>
//                 <div className="hover-lift dashed-border" style={{ background: "white", padding: "40px 30px", textAlign: "center", height: "100%" }}>
//                   <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{feature.icon}</div>
//                   <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{feature.title}</h3>
//                   <p style={{ color: "#666" }}>{feature.desc}</p>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           5. GALLERY (Hover Orange Overlay)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "white" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <div style={{ textAlign: "center", marginBottom: "50px" }}>
//               <span className="font-fredoka" style={{ fontSize: "1.2rem", color: "#777", letterSpacing: "2px", textTransform: "uppercase" }}>Leader of a future</span>
//               <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem" }}>Our Gallery</h2>
//             </div>
//           </Reveal>

//           <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            
//             {/* Top Left */}
//             <Reveal delay={50}>
//               <div className="gallery-card dashed-border" style={{ height: "300px" }}>
//                 <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" alt="Kids playing" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Kids Ground</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Top Middle */}
//             <Reveal delay={100}>
//               <div className="gallery-card dashed-border" style={{ height: "300px" }}>
//                 <img src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" alt="Art Class" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Art & Craft</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Right Tall (Spans 2 rows) */}
//             <Reveal delay={150}>
//               <div className="gallery-card dashed-border" style={{ height: "100%", gridRow: "span 2" }}>
//                 <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" alt="School Reading" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <span style={{ color: "white", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 700 }}>School</span>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white" }}>Kids ground</h3>
//                 </div>
//               </div>
//             </Reveal>

//             {/* Bottom Wide (Spans 2 cols) */}
//             <Reveal delay={200}>
//               <div className="gallery-card dashed-border" style={{ height: "300px", gridColumn: "span 2" }}>
//                 <img src="https://images.unsplash.com/photo-1587691592099-24045742c181?w=1000&q=80" alt="Fun activity" />
//                 <div className="gallery-overlay">
//                   <div style={{ width: "60px", height: "60px", background: "#2D3142", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
//                     <span style={{ fontSize: "24px", color: "white" }}>👁️</span>
//                   </div>
//                   <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white" }}>Fun Activities</h3>
//                 </div>
//               </div>
//             </Reveal>

//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           6. TESTIMONIALS (What Say Parents)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "#FAFAFF", overflow: "hidden" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "60px" }}>What Say Parents</h2>
//           </Reveal>

//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <button onClick={prevTesti} className="hover-lift" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#94A3B8", color: "white", border: "none", fontSize: "1.2rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❮</button>
            
//             <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
//               <div 
//                 className="testi-track"
//                 style={{ 
//                   display: "flex", transition: "transform 0.5s ease",
//                   transform: `translateX(calc(-33.333% * ${testiIndex}))`,
//                   '--idx': testiIndex 
//                 } as any}
//               >
//                 {testimonials.map((t, i) => (
//                   <div key={i} className="testi-card-wrap" style={{ minWidth: "33.333%", padding: "0 15px", flexShrink: 0 }}>
//                     <div className="hover-lift" style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column" }}>
                      
//                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative" }}>
//                         <img src={t.img} alt={t.name} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
//                         {/* Tiny Google logo overlay */}
//                         <div style={{ position: "absolute", bottom: "-5px", left: "30px", background: "white", borderRadius: "50%", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
//                           <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={{ width: "16px", height: "16px" }} alt="Google" />
//                         </div>
//                         <div>
//                           <div style={{ fontWeight: 800, color: "#1A1A2E", display: "flex", alignItems: "center", gap: "4px" }}>
//                             {t.name} <span style={{ color: "#3B82F6", fontSize: "14px" }}>✔</span>
//                           </div>
//                           <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{t.time}</div>
//                         </div>
//                       </div>

//                       <div style={{ color: "#FBBF24", fontSize: "1.2rem", marginBottom: "12px", letterSpacing: "2px" }}>★★★★★</div>
                      
//                       <p style={{ color: "#555", lineHeight: 1.6, flex: 1 }}>{t.text}</p>
                      
//                       <button style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 700, textAlign: "left", marginTop: "12px", cursor: "pointer", padding: 0 }}>Read more</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button onClick={nextTesti} className="hover-lift" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#94A3B8", color: "white", border: "none", fontSize: "1.2rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❯</button>
//           </div>

//           <div style={{ textAlign: "center", marginTop: "30px" }}>
//             <span style={{ display: "inline-block", background: "#F1F5F9", padding: "8px 16px", borderRadius: "50px", fontSize: "0.9rem", color: "#64748B", fontWeight: 600 }}>
//               ↻ Free Google Reviews Widget
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           7. ENQUIRY FORM (To inquire or apply)
//       ════════════════════════════════════════════ */}
//       <section style={{ padding: "100px 20px", background: "white", position: "relative" }}>
//         {/* Decorative faint notebook rings left side */}
//         <div style={{ position: "absolute", left: "-50px", top: "20%", opacity: 0.05, pointerEvents: "none" }}>
//           <svg width="200" height="600" viewBox="0 0 200 600" fill="none">
//             {[0,1,2,3,4,5].map(i => (
//               <path key={i} d={`M 50 ${100 * i + 50} C 150 ${100 * i + 20}, 150 ${100 * i + 80}, 50 ${100 * i + 50}`} stroke="#000" strokeWidth="20" strokeLinecap="round" />
//             ))}
//           </svg>
//         </div>

//         <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
//           <Reveal>
//             <h2 className="font-fredoka text-navy" style={{ fontSize: "3rem", marginBottom: "16px" }}>To inquire or apply,</h2>
//             <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "50px" }}>To inquire or apply, just fill out our Enquiry Form with these details</p>
//           </Reveal>

//           <Reveal delay={100}>
//             <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} onSubmit={(e)=>e.preventDefault()}>
//               <input type="text" placeholder="Parent's Name *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
//               <input type="text" placeholder="Child's Name *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
              
//               <input type="email" placeholder="Email Address *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
//               <input type="tel" placeholder="Phone *" style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#333" }} required />
              
//               <select style={{ width: "100%", padding: "20px", borderRadius: "12px", border: "none", background: "#F9F6F0", fontSize: "1rem", outline: "none", fontWeight: 600, color: "#999", gridColumn: "span 2", cursor: "pointer", appearance: "none" }}>
//                 <option value="">Select Program *</option>
//                 <option value="playgroup">Playgroup</option>
//                 <option value="nursery">Nursery</option>
//                 <option value="lkg">LKG</option>
//                 <option value="ukg">UKG</option>
//               </select>

//               <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: "20px" }}>
//                 <button className="hover-lift bg-purple" style={{ 
//                   color: "white", border: "none", padding: "18px 60px", borderRadius: "50px", 
//                   fontSize: "1.2rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 30px rgba(124, 93, 159, 0.4)"
//                 }}>
//                   Submit Enquiry
//                 </button>
//               </div>
//             </form>
//           </Reveal>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════════
//           FLOATING ACTION BUTTONS (from reference)
//       ════════════════════════════════════════════ */}
//       <div style={{ position: "fixed", bottom: "30px", right: "30px", display: "flex", flexDirection: "column", gap: "16px", zIndex: 100 }}>
//         {/* Fake Scroll Progress Circle */}
//         <div className="bg-orange hover-lift" style={{ width: "50px", height: "50px", borderRadius: "50%", border: "3px solid #2D3142", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "12px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
//           84%
//         </div>
//         {/* WhatsApp Button */}
//         <div className="hover-lift" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
//           <div style={{ background: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", color: "#555" }}>
//             Need Help? <strong>Chat with us</strong>
//           </div>
//           <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(37,211,102,0.4)" }}>
//             <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
//               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
//             </svg>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }















"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// Mock Reveal component (assuming you have this in your UI folder)
// If not, this acts as a standard div wrapper to prevent errors.
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div style={{ animation: `fadeUp 0.8s ease forwards ${delay}ms`, opacity: 0, transform: 'translateY(30px)' }}>
    {children}
  </div>
);

export default function PlayschoolNew() {
  /* ── 1. Hero Auto-Slider State ── */
  const heroImages = [
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1600&q=80",
    "https://images.unsplash.com/photo-1587691592099-24045742c181?w=1600&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=1600&q=80"
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  /* ── 2. Programs Carousel State ── */
  const programs = [
    { id: 1, title: "Playgroup (2-3 Years)", desc: "These Years Are About Curiosity And Readiness. A warm introduction to learning.", img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" },
    { id: 2, title: "Nursery (3-4 Years)", desc: "Exploring colors, shapes, and sounds through interactive, messy play.", img: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" },
    { id: 3, title: "Kindergarten (4-5 Years)", desc: "Preparing for the big step with numbers, letters, and foundational literacy.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
    { id: 4, title: "Day Care (All Ages)", desc: "A safe, loving, and engaging environment for your child while you work.", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" },
  ];
  const [progIndex, setProgIndex] = useState(0);
  const nextProg = () => setProgIndex((prev) => (prev + 1) % programs.length);
  const prevProg = () => setProgIndex((prev) => (prev === 0 ? programs.length - 1 : prev - 1));

  /* ── 3. Testimonials Carousel State ── */
  const testimonials = [
    { name: "Kanta Yadav", time: "2 months ago", text: "The school has done a tremendous job. My child has learnt a lot and is so happy to go to school every single day!", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Shikha Mittal", time: "2 months ago", text: "Children are taken care of like we parents take care of them. The teachers and staff are absolutely the best part.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Geetu Tyagi", time: "2 months ago", text: "My experience has been very good so far! Easily the best kids school in the area. Highly recommended for toddlers.", img: "https://randomuser.me/api/portraits/women/32.jpg" },
    { name: "Ety Jindal", time: "2 months ago", text: "A fantastic start for my child's educational journey. My child has blossomed into a confident, curious learner.", img: "https://randomuser.me/api/portraits/women/12.jpg" },
  ];
  const [testiIndex, setTestiIndex] = useState(0);
  const nextTesti = () => setTestiIndex((prev) => (prev + 1) % (testimonials.length - 2));
  const prevTesti = () => setTestiIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1));

  /* ── 4. Scroll Progress State ── */
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${Math.round((totalScroll / windowHeight) * 100)}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Changed overflowX from 'hidden' to 'clip' to fix mobile scrolling issues
    <div style={{ fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif", background: "#FFFFFF", color: "#2D3142", overflowX: "clip", width: "100%" }}>
      
      {/* ── GLOBAL STYLES & ANIMATIONS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        /* Typography */
        .font-fredoka { font-family: 'Fredoka One', cursive; }
        .text-orange { color: #F68B33; }
        .text-purple { color: #7C5D9F; }
        .text-navy { color: #2D3142; }
        .bg-orange { background-color: #F68B33; }
        .bg-purple { background-color: #7C5D9F; }
        .bg-navy { background-color: #2D3142; }

        /* Themed Elements */
        .dashed-border { border: 3px dashed #CBD5E1; border-radius: 24px; }
        .solid-border { border: 3px solid #F1F5F9; border-radius: 24px; }
        
        .scalloped-top {
          position: absolute; top: 0; left: 0; right: 0; height: 15px;
          background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px);
          background-size: 20px 20px; background-repeat: repeat-x; z-index: 10;
        }
        
        .scalloped-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 15px;
          background-image: radial-gradient(circle at 10px 15px, transparent 10px, white 11px);
          background-size: 20px 20px; background-repeat: repeat-x; z-index: 10;
        }

        /* Animations */
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-lift { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease; }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        .float { animation: float 4s ease-in-out infinite; }
        .float-delay { animation: float 4s ease-in-out 2s infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        
        .wiggle { animation: wiggle 2.5s ease-in-out infinite; }
        @keyframes wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

        .spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Animated Text Reveal */
        .text-reveal { display: inline-block; overflow: hidden; white-space: nowrap; border-right: 4px solid #F68B33; animation: typing 3s steps(30, end) infinite alternate; }
        @keyframes typing { 0%, 20% { width: 0; } 80%, 100% { width: 100%; } }

        /* Image Gallery Hover */
        .gallery-card { position: relative; overflow: hidden; border-radius: 24px; cursor: pointer; }
        .gallery-overlay {
          position: absolute; inset: 0; background: rgba(246, 139, 51, 0.85);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transition: all 0.4s ease; transform: translateY(20px);
        }
        .gallery-card:hover .gallery-overlay { opacity: 1; transform: translateY(0); }
        .gallery-card img { transition: transform 0.6s ease; width: 100%; height: 100%; object-fit: cover; }
        .gallery-card:hover img { transform: scale(1.1); }

        /* Timeline Line */
        .timeline-line::before {
            content: ''; position: absolute; top: 0; bottom: 0; left: 24px; width: 4px;
            background: #CBD5E1; border-radius: 4px; z-index: 0;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          .intro-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .intro-imgs { height: 500px !important; }
          .carousel-track { transform: translateX(calc(-100% * var(--idx))) !important; }
          .prog-card-wrap { min-width: 100% !important; }
          .testi-track { transform: translateX(calc(-100% * var(--idx))) !important; }
          .testi-card-wrap { min-width: 100% !important; }
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .timeline-line::before { left: 20px; }
        }
        @media (max-width: 768px) {
          .hero-box { margin: 60px 20px !important; padding: 30px 20px !important; }
          .hero-title { font-size: 2.5rem !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
          .enquiry-form { grid-template-columns: 1fr !important; }
          .enquiry-btn { grid-column: span 1 !important; }
          .timeline-card { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          SECTION 1: HERO (Auto-sliding background)
      ════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "80px" }}>
        <div className="scalloped-top"></div>
        
        {/* Auto Fading Background Images */}
        {heroImages.map((src, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0, zIndex: 0,
            opacity: currentHero === i ? 1 : 0,
            transition: "opacity 1.5s ease-in-out, transform 6s linear",
            transform: currentHero === i ? "scale(1.05)" : "scale(1)",
            backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center"
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%)" }} />
          </div>
        ))}

        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1, padding: "0 20px" }}>
          <Reveal>
            <div className="hero-box dashed-border float" style={{ background: "white", padding: "50px", maxWidth: "550px", boxShadow: "0 25px 50px rgba(0,0,0,0.1)", position: "relative" }}>
              <div className="wiggle text-orange" style={{ position: "absolute", top: "-25px", left: "40px", fontSize: "40px" }}>⭐</div>
              <div className="spin-slow text-purple" style={{ position: "absolute", bottom: "-20px", right: "40px", fontSize: "30px" }}>🎨</div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span className="text-purple" style={{ fontSize: "24px" }}>🧸</span>
                <span className="text-orange" style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "1px" }}>Fun Happens Here!</span>
              </div>

              <h1 className="hero-title font-fredoka text-orange" style={{ fontSize: "4rem", lineHeight: 1.1, marginBottom: "16px" }}>
                The Kids Center <span className="text-navy text-reveal" style={{ display: 'block' }}>Education</span>
              </h1>
              
              <p style={{ fontSize: "1.2rem", color: "#666", fontWeight: 600, marginBottom: "32px" }}>
                Where work, play, and imagination come together to build a brighter tomorrow.
              </p>

              <Link href="/contact" className="hover-lift bg-orange" style={{ color: "white", padding: "16px 40px", borderRadius: "50px", fontWeight: 900, fontSize: "16px", textDecoration: "none", display: "inline-block", letterSpacing: "1px", textTransform: "uppercase", boxShadow: "0 10px 25px rgba(246, 139, 51, 0.4)" }}>
                ADMISSION OPEN
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2: INTRODUCTION (18+ Years Layout)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#FAFAFF" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="intro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            
            <div className="intro-imgs" style={{ position: "relative", height: "600px", width: "100%" }}>
              <Reveal>
                <div className="dashed-border float" style={{ position: "absolute", top: 0, right: "10%", width: "60%", height: "250px", overflow: "hidden", padding: "6px", background: "white", zIndex: 2 }}>
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb0d9e0b?w=600&q=80" alt="Boy playing" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="dashed-border float-delay" style={{ position: "absolute", top: "20%", left: 0, width: "65%", height: "400px", overflow: "hidden", padding: "6px", background: "white", zIndex: 1 }}>
                  <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80" alt="Girl smiling" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="hover-lift" style={{ position: "absolute", bottom: "-20px", right: "10%", display: "flex", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", zIndex: 3 }}>
                  <div className="bg-orange" style={{ padding: "24px 16px", color: "white", fontWeight: 900, writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", letterSpacing: "2px" }}>
                    YEARS OF EXPERIENCE
                  </div>
                  <div className="bg-navy" style={{ padding: "30px 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="font-fredoka" style={{ color: "white", fontSize: "3.5rem" }}>18+</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span className="text-orange" style={{ fontSize: "20px" }}>✏️</span>
                  <span className="text-purple" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>About Us</span>
                </div>
                <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "24px" }}>Introduction</h2>
                <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8, marginBottom: "20px" }}>
                  At our Play School, we believe in nurturing little "natkhats" (playful tots) with lots of love and safe guidance. For <strong className="text-navy">18 years</strong> our bright, cheerful classrooms have been a second home where tiny explorers laugh, play, and learn.
                </p>
                <p style={{ fontSize: "1.15rem", color: "#555", lineHeight: 1.8 }}>
                  We've built a <strong className="text-navy">trusted legacy</strong>: thousands of families have seen their children thrive here, from first steps to confident pre-schoolers. We also offer specialized programs to foster creativity and curiosity.
                </p>
                <Link href="/about" className="hover-lift" style={{ display: "inline-flex", marginTop: "30px", alignItems: "center", gap: "10px", color: "#F68B33", fontWeight: 800, fontSize: "1.1rem", textDecoration: "none" }}>
                  Read More <span className="wiggle" style={{ fontSize: "1.5rem", display: "inline-block" }}>→</span>
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3: OUR PHILOSOPHY (New Section)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#FFFFFF", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "20px" }}>Our Core Values</h2>
            <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "600px", margin: "0 auto 60px" }}>The foundational pillars that make our educational approach unique and highly effective for early childhood development.</p>
          </Reveal>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
            {[
              { icon: "🌱", title: "Nurturing Growth", desc: "We provide a fertile ground for physical, mental, and emotional development." },
              { icon: "🎨", title: "Creative Freedom", desc: "Encouraging out-of-the-box thinking through arts, crafts, and imaginative play." },
              { icon: "🤝", title: "Social Skills", desc: "Fostering teamwork, empathy, and communication in a community setting." },
              { icon: "🧠", title: "Cognitive Play", desc: "Stimulating young minds with puzzles, blocks, and interactive learning tools." }
            ].map((val, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="hover-lift solid-border" style={{ padding: "40px 30px", height: "100%", background: "#FAFAFF" }}>
                  <div className="bg-purple float" style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "35px" }}>
                    {val.icon}
                  </div>
                  <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "15px" }}>{val.title}</h3>
                  <p style={{ color: "#666", lineHeight: 1.6 }}>{val.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4: PROGRAMS / CLASSES (Slider)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#F4F7FB", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: "300px", height: "300px", background: "#FFFFFF", borderRadius: "50%", zIndex: 0 }}></div>
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem" }}>Our Programs</h2>
              <p style={{ fontSize: "1.2rem", color: "#666", marginTop: "10px" }}>Discover the perfect learning environment for your child.</p>
            </div>
          </Reveal>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button onClick={prevProg} className="hover-lift text-navy" style={{ background: "white", border: "2px solid #CBD5E1", width: "60px", height: "60px", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", zIndex: 2, flexShrink: 0 }}>❮</button>
            
            <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
              <div className="carousel-track" style={{ display: "flex", transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)", transform: `translateX(calc(-50% * ${progIndex}))`, '--idx': progIndex } as any}>
                {programs.map((prog) => (
                  <div key={prog.id} className="prog-card-wrap" style={{ minWidth: "50%", padding: "0 15px", flexShrink: 0 }}>
                    <div className="dashed-border hover-lift" style={{ background: "white", padding: "12px", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "260px", borderRadius: "16px", overflow: "hidden" }}>
                        <img src={prog.img} alt={prog.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
                        <div className="bg-orange" style={{ position: "absolute", bottom: "-25px", left: "50%", transform: "translateX(-50%)", width: "60px", height: "60px", borderRadius: "50%", border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", zIndex: 2 }}>🏫</div>
                      </div>
                      <div style={{ padding: "40px 20px 20px", textAlign: "center", flex: 1 }}>
                        <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{prog.title}</h3>
                        <p style={{ color: "#777", lineHeight: 1.6 }}>{prog.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={nextProg} className="hover-lift text-navy" style={{ background: "white", border: "2px solid #CBD5E1", width: "60px", height: "60px", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", zIndex: 2, flexShrink: 0 }}>❯</button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5: DAILY ROUTINE (New Timeline Section)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#FFFFFF", position: "relative" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span className="text-orange" style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>⏰</span>
              <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "15px" }}>A Day in the Life</h2>
              <p style={{ fontSize: "1.2rem", color: "#666" }}>Structure that feels like pure play and enjoyment.</p>
            </div>
          </Reveal>

          <div className="timeline-line" style={{ position: "relative" }}>
            {[
              { time: "09:00 AM", title: "Morning Circle Time", icon: "☀️", color: "#F68B33", desc: "Greeting friends, singing songs, and setting a positive tone for the day." },
              { time: "10:30 AM", title: "Creative Exploration", icon: "🎨", color: "#7C5D9F", desc: "Engaging in arts, crafts, and sensory play to boost fine motor skills." },
              { time: "12:00 PM", title: "Lunch & Nutrition", icon: "🍱", color: "#2D3142", desc: "Enjoying healthy meals together while learning table manners." },
              { time: "01:30 PM", title: "Nap & Wind Down", icon: "💤", color: "#F68B33", desc: "A quiet time for stories and rest to recharge their little batteries." }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="timeline-card hover-lift" style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "40px", position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "white", flexShrink: 0, boxShadow: "0 0 0 8px white" }}>
                    {item.icon}
                  </div>
                  {/* Content Box */}
                  <div className="dashed-border" style={{ background: "#FAFAFF", padding: "30px", flex: 1 }}>
                    <div style={{ fontWeight: 800, color: item.color, fontSize: "1.1rem", marginBottom: "8px" }}>{item.time}</div>
                    <h3 className="font-fredoka text-navy" style={{ fontSize: "1.6rem", marginBottom: "10px" }}>{item.title}</h3>
                    <p style={{ color: "#666", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 6: WHY CHOOSE US
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#F4F7FB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "60px" }}>Why Parents Choose Us</h2>
          </Reveal>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
            {[
              { icon: "🛡️", title: "100% Safe", desc: "CCTV monitored campuses with child-safe, edge-free furniture." },
              { icon: "👩‍🏫", title: "Caring Staff", desc: "Highly trained teachers with a very low student-to-teacher ratio." },
              { icon: "🎪", title: "Play-Way Method", desc: "No boring lectures. We learn by doing, playing, singing, and dancing." },
              { icon: "🍎", title: "Healthy Habits", desc: "We focus heavily on hygiene, self-feeding, and good manners." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="hover-lift dashed-border" style={{ background: "white", padding: "40px 30px", textAlign: "center", height: "100%" }}>
                  <div className="float" style={{ fontSize: "3.5rem", marginBottom: "20px" }}>{feature.icon}</div>
                  <h3 className="font-fredoka text-navy" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{feature.title}</h3>
                  <p style={{ color: "#666", lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 7: GALLERY (Hover Overlays)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span className="font-fredoka text-orange" style={{ fontSize: "1.2rem", letterSpacing: "2px", textTransform: "uppercase" }}>Leader of the future</span>
              <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginTop: "10px" }}>Our Gallery</h2>
            </div>
          </Reveal>

          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <Reveal delay={50}>
              <div className="gallery-card dashed-border" style={{ height: "300px" }}>
                <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80" alt="Kids playing" />
                <div className="gallery-overlay">
                  <div className="bg-navy float" style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}><span style={{ fontSize: "24px", color: "white" }}>👁️</span></div>
                  <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Kids Ground</h3>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="gallery-card dashed-border" style={{ height: "300px" }}>
                <img src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80" alt="Art Class" />
                <div className="gallery-overlay">
                  <div className="bg-navy float" style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}><span style={{ fontSize: "24px", color: "white" }}>👁️</span></div>
                  <h3 className="font-fredoka text-white" style={{ fontSize: "1.5rem", color: "white" }}>Art & Craft</h3>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="gallery-card dashed-border" style={{ height: "100%", gridRow: "span 2" }}>
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" alt="School Reading" />
                <div className="gallery-overlay">
                  <div className="bg-navy float" style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}><span style={{ fontSize: "24px", color: "white" }}>👁️</span></div>
                  <span style={{ color: "white", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 700 }}>School</span>
                  <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white", textAlign: "center" }}>Learning Environment</h3>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="gallery-card dashed-border" style={{ height: "300px", gridColumn: "span 2" }}>
                <img src="https://images.unsplash.com/photo-1587691592099-24045742c181?w=1000&q=80" alt="Fun activity" />
                <div className="gallery-overlay">
                  <div className="bg-navy float" style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}><span style={{ fontSize: "24px", color: "white" }}>👁️</span></div>
                  <h3 className="font-fredoka text-white" style={{ fontSize: "2rem", color: "white" }}>Fun Activities</h3>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 8: TESTIMONIALS (What Say Parents)
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "#FAFAFF", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "60px" }}>What Say Parents</h2>
          </Reveal>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={prevTesti} className="hover-lift" style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#CBD5E1", color: "white", border: "none", fontSize: "1.5rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❮</button>
            
            <div style={{ overflow: "hidden", flex: 1, padding: "20px 0" }}>
              <div className="testi-track" style={{ display: "flex", transition: "transform 0.5s ease", transform: `translateX(calc(-33.333% * ${testiIndex}))`, '--idx': testiIndex } as any}>
                {testimonials.map((t, i) => (
                  <div key={i} className="testi-card-wrap" style={{ minWidth: "33.333%", padding: "0 15px", flexShrink: 0 }}>
                    <div className="hover-lift" style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", position: "relative" }}>
                        <img src={t.img} alt={t.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", bottom: "-5px", left: "40px", background: "white", borderRadius: "50%", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={{ width: "16px", height: "16px" }} alt="Google" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#1A1A2E", fontSize: "1.1rem" }}>
                            {t.name} <span style={{ color: "#3B82F6", fontSize: "16px" }}>✔</span>
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>{t.time}</div>
                        </div>
                      </div>
                      <div style={{ color: "#FBBF24", fontSize: "1.4rem", marginBottom: "12px", letterSpacing: "2px" }}>★★★★★</div>
                      <p style={{ color: "#555", lineHeight: 1.6, flex: 1, fontStyle: "italic" }}>"{t.text}"</p>
                      <button style={{ background: "none", border: "none", color: "#F68B33", fontWeight: 800, textAlign: "left", marginTop: "15px", cursor: "pointer", padding: 0 }}>Read more</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={nextTesti} className="hover-lift" style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#CBD5E1", color: "white", border: "none", fontSize: "1.5rem", cursor: "pointer", flexShrink: 0, zIndex: 2 }}>❯</button>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <span className="hover-lift" style={{ display: "inline-block", background: "#F1F5F9", padding: "10px 20px", borderRadius: "50px", fontSize: "0.95rem", color: "#64748B", fontWeight: 700, cursor: "pointer" }}>
              ↻ Free Google Reviews Widget
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 9: ENQUIRY FORM 
      ════════════════════════════════════════════ */}
      <section style={{ padding: "100px 20px", background: "white", position: "relative", overflow: "hidden" }}>
        {/* Decorative faint background blobs */}
        <div className="spin-slow" style={{ position: "absolute", left: "-50px", top: "10%", fontSize: "150px", opacity: 0.05, pointerEvents: "none" }}>⚽</div>
        <div className="spin-slow" style={{ position: "absolute", right: "-50px", bottom: "10%", fontSize: "150px", opacity: 0.05, pointerEvents: "none" }}>🧸</div>

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <h2 className="font-fredoka text-navy" style={{ fontSize: "3.5rem", marginBottom: "16px" }}>To inquire or apply,</h2>
            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "50px" }}>Just fill out our Enquiry Form with these details and our admissions team will contact you shortly.</p>
          </Reveal>

          <Reveal delay={100}>
            <form className="enquiry-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} onSubmit={(e)=>e.preventDefault()}>
              <input type="text" placeholder="Parent's Name *" style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "2px solid #F1F5F9", background: "#FAFAFF", fontSize: "1.05rem", outline: "none", fontWeight: 600, color: "#333", transition: "border 0.3s" }} onFocus={(e)=>e.target.style.border="2px solid #F68B33"} onBlur={(e)=>e.target.style.border="2px solid #F1F5F9"} required />
              <input type="text" placeholder="Child's Name *" style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "2px solid #F1F5F9", background: "#FAFAFF", fontSize: "1.05rem", outline: "none", fontWeight: 600, color: "#333", transition: "border 0.3s" }} onFocus={(e)=>e.target.style.border="2px solid #F68B33"} onBlur={(e)=>e.target.style.border="2px solid #F1F5F9"} required />
              
              <input type="email" placeholder="Email Address *" style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "2px solid #F1F5F9", background: "#FAFAFF", fontSize: "1.05rem", outline: "none", fontWeight: 600, color: "#333", transition: "border 0.3s" }} onFocus={(e)=>e.target.style.border="2px solid #F68B33"} onBlur={(e)=>e.target.style.border="2px solid #F1F5F9"} required />
              <input type="tel" placeholder="Phone *" style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "2px solid #F1F5F9", background: "#FAFAFF", fontSize: "1.05rem", outline: "none", fontWeight: 600, color: "#333", transition: "border 0.3s" }} onFocus={(e)=>e.target.style.border="2px solid #F68B33"} onBlur={(e)=>e.target.style.border="2px solid #F1F5F9"} required />
              
              <select style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "2px solid #F1F5F9", background: "#FAFAFF", fontSize: "1.05rem", outline: "none", fontWeight: 600, color: "#777", gridColumn: "span 2", cursor: "pointer", transition: "border 0.3s" }} onFocus={(e)=>e.target.style.border="2px solid #F68B33"} onBlur={(e)=>e.target.style.border="2px solid #F1F5F9"}>
                <option value="">Select Program *</option>
                <option value="playgroup">Playgroup</option>
                <option value="nursery">Nursery</option>
                <option value="lkg">LKG</option>
                <option value="ukg">UKG</option>
              </select>

              <div className="enquiry-btn" style={{ gridColumn: "span 2", textAlign: "center", marginTop: "30px" }}>
                <button className="hover-lift bg-purple" style={{ color: "white", border: "none", padding: "20px 80px", borderRadius: "50px", fontSize: "1.2rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 15px 30px rgba(124, 93, 159, 0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Submit Enquiry
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FLOATING ACTION BUTTONS
      ════════════════════════════════════════════ */}
      <div style={{ position: "fixed", bottom: "30px", right: "30px", display: "flex", flexDirection: "column", gap: "16px", zIndex: 100 }}>
        {/* Scroll Progress Circle */}
        <div className="bg-orange hover-lift" onClick={() => window.scrollTo(0,0)} style={{ width: "55px", height: "55px", borderRadius: "50%", border: "4px solid #2D3142", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
          {scrollProgress}%
        </div>
        {/* WhatsApp Button */}
        <div className="hover-lift" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div style={{ background: "white", padding: "10px 20px", borderRadius: "30px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", color: "#2D3142" }}>
            Need Help? <strong style={{ color: "#25D366" }}>Chat with us</strong>
          </div>
          <div style={{ width: "65px", height: "65px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 25px rgba(37,211,102,0.5)" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}