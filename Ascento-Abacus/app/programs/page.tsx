"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FadeIn, SlideIn, ScaleIn } from "../components/AnimatedSection";

// ─── Program Data ────────────────────────────────────────────────────────────

const abacusLevels = [
    {
        level: "O",
        name: "Foundations",
        subtitle: "Pre-Level Introduction",
        duration: "6–8 Weeks",
        format: "45 min class · 5 min warm-up · 15 min concept · 15 min practice · 10 min worksheet",
        tags: ["Abacus basics", "Basic add & subtract", "Focus & speed"],
        sections: [
            { title: "Basics", items: ["Parts of abacus", "Bead values (1 & 5)", "Numbers 1–20"] },
            { title: "Place Value", items: ["Ones & tens", "Numbers up to 99"] },
            { title: "Addition", items: ["Simple addition (no carry)", "Practice + oral"] },
            { title: "Subtraction", items: ["Simple subtraction (no borrow)", "Mixed practice + speed"] },
        ]
    },
    {
        level: "1",
        name: "Core Basics",
        subtitle: "",
        duration: "12 Weeks · Numbers up to 99",
        tags: ["Strong basics", "Speed & accuracy"],
        sections: [
            { title: "Basics", items: ["Parts of abacus", "Bead values", "Finger movements"] },
            { title: "Numbers", items: ["Ones & tens", "Numbers up to 99"] },
            { title: "Addition", items: ["Simple addition (carry)", "Practice + oral"] },
            { title: "Subtraction", items: ["Subtraction (no borrow)", "Mixed practice + speed"] },
            { title: "Complements", items: ["Complements: 10-complement", "Use in carry & borrow"] },
            { title: "Mixed Practice", items: ["Addition + subtraction + complements", "Speed test"] },
        ]
    },
    {
        level: "2",
        name: "Carry & Borrow",
        subtitle: "",
        duration: "12 Weeks · Numbers up to 999",
        tags: ["Carry & borrow", "Listening sums"],
        sections: [
            { title: "Revision + Digit", items: ["Level 1 revision", "Hundreds place", "Up to 999"] },
            { title: "Addition (Carry)", items: ["Carry method", "Use of complements", "Practice"] },
            { title: "Subtraction (Borrow)", items: ["Borrow method", "Use of complements"] },
            { title: "Mixed Practice", items: ["3–4 digit sums", "Speed building"] },
            { title: "Oral & Visualization", items: ["Listening sums", "Mental visualization"] },
            { title: "Speed + Test", items: ["Full practice", "Speed test", "Final assessment"] },
        ]
    },
    {
        level: "3",
        name: "Multi-Digit & Multiplication Intro",
        subtitle: "",
        duration: "12 Weeks · 4 digits up to 9999",
        tags: ["Multi-digit", "Multiplication intro"],
        sections: [
            { title: "Revision + 4 Digits", items: ["Thousands place", "Up to 9999"] },
            { title: "Advanced Addition", items: ["Big carry method"] },
            { title: "Advanced Subtraction", items: ["Multi-digit subtraction", "Fast borrow"] },
            { title: "Multiplication Intro", items: ["Basic multiplication on abacus", "Small tables"] },
            { title: "Oral & Visualization", items: ["Mental image of abacus"] },
            { title: "Speed + Test", items: ["Mixed operations", "Final assessment"] },
        ]
    },
    {
        level: "4",
        name: "Division Intro",
        subtitle: "",
        duration: "12 Weeks · Rows: 5",
        tags: ["Division basics", "Mental speed"],
        sections: [
            { title: "Revision", items: ["Level 3 revision", "Speed improvement", "6 rows"] },
            { title: "Add & Subtract (Adv.)", items: ["Faster carry & borrow", "Oral sums"] },
            { title: "Multiplication (Int)", items: ["2-digit multiplication", "Abacus techniques"] },
            { title: "Division Intro", items: ["Basic division on abacus", "Simple problems"] },
            { title: "Oral & Visualization", items: ["Mental calculation", "Speed drills"] },
            { title: "Speed + Test", items: ["Mixed operations", "Final assessment"] },
        ]
    },
    {
        level: "5",
        name: "High Speed",
        subtitle: "",
        duration: "12 Weeks · Rows: 8",
        tags: ["High speed", "Strong mult & div"],
        sections: [
            { title: "Revision + Row Increase", items: ["Level 4 revision", "8 rows", "Speed up"] },
            { title: "Add & Sub (High Speed)", items: ["Faster multi-digit", "Advanced carry & borrow"] },
            { title: "Multiplication (Adv.)", items: ["2–3 digit multiplication", "Faster techniques"] },
            { title: "Division (Int)", items: ["Division technique", "Step-by-step solving"] },
            { title: "Oral & Visualization", items: ["Visualization practice", "Speed drills"] },
            { title: "Speed + Test", items: ["Mixed operations", "Final assessment"] },
        ]
    },
    {
        level: "6",
        name: "Expert Operations",
        subtitle: "",
        duration: "12 Weeks · Rows: 7",
        tags: ["Expert level speed", "Strong mental maths"],
        sections: [
            { title: "Revision + Row Increase", items: ["Level 5 revision", "7 rows"] },
            { title: "Add & Sub (Expert)", items: ["High speed multi-digit", "Advanced"] },
            { title: "Multiplication (Adv.)", items: ["3-digit multiplication", "Faster methods"] },
            { title: "Division (Adv.)", items: ["Complex division", "Accuracy focus"] },
            { title: "Mental Maths", items: ["Mental multiplication", "Without abacus practice"] },
            { title: "Speed + Test", items: ["Mixed operations", "Final assessment"] },
        ]
    },
    {
        level: "7",
        name: "Mastery Level",
        subtitle: "",
        duration: "12 Weeks · Rows: 8",
        tags: ["Master-level speed", "Strong mental maths"],
        sections: [
            { title: "Revision + Row Increase", items: ["Level 6 revision", "8 rows"] },
            { title: "Add & Sub (Mastery)", items: ["Ultra-fast multi-digit", "Advanced methods"] },
            { title: "Multiplication (High)", items: ["3–4 digit multiplication", "Fast methods"] },
            { title: "Division (High)", items: ["Complex division", "Accuracy + speed"] },
            { title: "Mental Maths (Adv.)", items: ["Mental calculation", "Without abacus solving"] },
            { title: "Speed + Test", items: ["Mixed operations", "Final assessment"] },
        ]
    },
    {
        level: "8",
        name: "Final Level",
        subtitle: "",
        duration: "12 Weeks · Rows: 8 · Decimals introduced",
        tags: ["Master calculation", "Mental maths"],
        sections: [
            { title: "Revision + Row Increase", items: ["Level 7 revision", "8 rows", "Speed"] },
            { title: "Add & Sub (Expert)", items: ["Ultra-fast multi-digit", "Accuracy focus"] },
            { title: "Multiplication (Expert)", items: ["4 digit multiplication", "Advanced techniques"] },
            { title: "Division (Expert)", items: ["Complex division", "Speed + accuracy"] },
            { title: "Decimals & More", items: ["Decimal addition & subtraction", "Abacus practice"] },
            { title: "Final Speed Test", items: ["Mixed operations", "Certification readiness"] },
        ]
    },
    {
        level: "9",
        name: "Advanced Mastery",
        subtitle: "",
        duration: "12 Weeks · Rows: 9",
        tags: ["Complete mastery", "Mental maths ace boss"],
        sections: [
            { title: "Revision + Row Increase", items: ["Level 8 revision", "Est rows", "Speed"] },
            { title: "Add & Sub", items: ["Large multi-digit", "Decimal operations", "Fast ops"] },
            { title: "Multiplication (Mastery)", items: ["Large number multiplication", "Fast methods"] },
            { title: "Division (Mastery)", items: ["Complex division", "Advanced methods"] },
            { title: "Mental Maths (Expert)", items: ["Full visualization", "Without abacus", "Ultra-fast"] },
            { title: "Final Mastery Test", items: ["Mixed ops", "Speed competition", "Final certification"] },
        ]
    },
    {
        level: "10",
        name: "Grand Master",
        subtitle: "",
        duration: "16 Weeks · Ext. · Negative introduced",
        tags: ["Grand-master level", "Complete mental mastery", "Max speed & confidence"],
        sections: [
            { title: "Revision + Ultra Speed", items: ["Level 9 revision", "Est rows", "Ultra speed commands"] },
            { title: "Advanced Operations", items: ["Decimal carry & borrow ops", "Negative sums"] },
            { title: "Mult & Div (Expert)", items: ["Large multiplication", "Complex decimal division"] },
            { title: "Mixed Ops Mastery", items: ["All operations including negative sums"] },
            { title: "Mental Maths (Grand)", items: ["Full visualization mastery", "Ultra-fast drills"] },
            { title: "Final Certification", items: ["Grand speed test", "Competition", "Final graduation"] },
        ]
    },
];

const vedicMathsLevels = [
    {
        level: "1",
        name: "Foundations of Speed",
        subtitle: "Rapid arithmetic · Vinculum · Complements",
        sections: [
            {
                title: "ARITHMETIC",
                items: ["Rapid addition", "Rapid decimal addition", "Rapid subtraction", "Rapid decimal subtraction"]
            },
            {
                title: "MULTIPLICATION",
                highlighted: "Nikhilam Navatashcaramam Dashatah — subtraction from base",
                items: ["Multiplication tables", "Power of 5, 25, 125", "Arambh method", "Andhyok method"]
            },
            {
                title: "DIVISION",
                items: ["Rapid division", "Division by 5, 25, 125"]
            },
            {
                title: "VINCULUM SYSTEM",
                items: [
                    "Vinculate — unit place", "Vinculate — tens place", "Vinculate — hundreds place",
                    "Devinculate — unit place", "Devinculate — tens place", "Devinculate — hundreds place",
                    "Vinculum addition", "Vinculum subtraction"
                ]
            },
        ]
    },
    {
        level: "2",
        name: "Extended Operations",
        subtitle: "Higher rows · Nikhilam · Duplex numbers",
        sections: [
            {
                title: "ARITHMETIC (HIGHER ROWS)",
                items: ["Rapid addition — higher rows", "Rapid decimal addition — higher rows", "Rapid subtraction — higher rows", "Rapid decimal subtraction"]
            },
            {
                title: "MULTIPLICATION",
                highlighted: "Nikhilam sutras — base & sub-base method",
                items: ["Multiplication by 11", "Duplex numbers", "By 12, 13, 14…", "By 21, 31, 41…", "Nikhilam sutra method"]
            },
            {
                title: "DIVISION",
                highlighted: "Nikhilam — complementary method",
                items: ["Nikhilam sutras division", "Duplex number division", "Division by 21, 31, 41…"]
            },
        ]
    },
    {
        level: "3",
        name: "Sutras & Algebra",
        subtitle: "Digital roots · Urdhvatiryak · Polynomials",
        sections: [
            {
                title: "DIGITAL ROOTS",
                items: ["Digital roots — addition", "Digital roots — subtraction"]
            },
            {
                title: "MULTIPLICATION",
                highlighted: "Ek nyunain Purvena · Urdhvatiryak (universal) sutras",
                items: ["Series of 9s — equal numbers", "Urdhvatiryak sutra — universal method"]
            },
            {
                title: "DIVISION",
                highlighted: "Dhwajank & Vilokaman sutras",
                items: ["Dhwajank sutra", "Vilokaman sutra", "Binomial division"]
            },
            {
                title: "POWERS & ROOTS",
                items: ["Squares", "Square roots"]
            },
            {
                title: "ALGEBRA",
                items: ["Algebraic polynomials", "Polynomial operations"]
            },
        ]
    },
    {
        level: "4",
        name: "Mastery & Higher Maths",
        subtitle: "HCF · LCM · Fractions · Cube roots · Equations",
        sections: [
            {
                title: "NUMBER THEORY",
                items: ["HCF", "LCM", "Prime factorization", "Digital roots — multiplication"]
            },
            {
                title: "ADVANCED MULTIPLICATION",
                items: ["Amazing multiplication — higher digits", "More base method", "Less base method", "Criss-cross method"]
            },
            {
                title: "ADVANCED DIVISION",
                items: ["Amazing division — higher digits", "Decimal division", "Decimal to integer"]
            },
            {
                title: "FRACTIONS",
                items: ["Fraction simplification", "Fraction addition", "Fraction subtraction"]
            },
            {
                title: "POWERS, ROOTS & EQUATIONS",
                items: ["Find squares", "Square — digital roots", "Square roots — digital roots", "Cube roots — digital roots", "Solve equations"]
            },
        ]
    },
];

const playSchoolLevels = [
    {
        level: "Tod\ndler",
        name: "Toddler",
        ageRange: "Age 1.5 – 2.5 years",
        category: "EARLY YEARS",
        subjects: [
            { name: "SENSES", topics: ["Colors", "Shapes"] },
            { name: "MOTOR", topics: ["Motor skills development", "Free play"] },
            { name: "LANGUAGE", topics: ["Rhymes", "Songs"] },
            { name: "SOCIAL", topics: ["Social skills"] },
        ]
    },
    {
        level: "Pre\nNur",
        name: "Pre-Nursery",
        ageRange: "Age 2.5 – 3.5 years",
        category: "EARLY YEARS",
        subjects: [
            { name: "WRITING", topics: ["Lines (pre-writing)"] },
            { name: "ENGLISH", topics: ["Alphabet introduction"] },
            { name: "MATHS", topics: ["Numbers 1–10"] },
            { name: "SENSES", topics: ["Colors", "Shapes"] },
            { name: "LANGUAGE", topics: ["Rhymes", "Stories"] },
        ]
    },
    {
        level: "Nur\nsery",
        name: "Nursery",
        ageRange: "Age 3.5 – 4.5 years",
        category: "EARLY YEARS",
        subjects: [
            { name: "ENGLISH", topics: ["A–Z", "A–Z small", "Phonics"] },
            { name: "MATHS", topics: ["Numbers 1–50", "Matching", "Coloring"] },
            { name: "HINDI", topics: ["Swar", "Basic Hindi"] },
        ]
    },
    {
        level: "LKG",
        name: "LKG",
        ageRange: "Age 4 – 5 years",
        category: "PRE-PRIMARY",
        subjects: [
            { name: "ENGLISH", topics: ["3-letter words", "Small sentences"] },
            { name: "MATHS", topics: ["Numbers 1–100", "Basic operations"] },
            { name: "EVS", topics: ["Environment"] },
            { name: "HINDI", topics: ["Swar", "Vyanjan", "2-letter words"] },
        ]
    },
    {
        level: "UKG",
        name: "UKG",
        ageRange: "Age 5 – 6 years",
        category: "PRE-PRIMARY",
        subjects: [
            { name: "ENGLISH", topics: ["Reading", "Comprehension"] },
            { name: "MATHS", topics: ["Numbers 1–200", "Addition", "Subtraction"] },
            { name: "GK & EVS", topics: ["General knowledge", "Environment"] },
            { name: "HINDI", topics: ["Vyanjan", "2–3 letter words", "Simple sentences"] },
        ]
    },
    {
        level: "C1",
        name: "Class 1",
        ageRange: "Age 6 – 7 years",
        category: "PRIMARY CLASSES",
        subjects: [
            { name: "ENGLISH", topics: ["Reading", "Writing", "Phonics", "Grammar", "Dictation", "Comprehension"] },
            { name: "MATHS", topics: ["Addition", "Subtraction", "Multiplication"] },
            { name: "EVS", topics: ["EVS"] },
            { name: "HINDI", topics: ["Matra", "Words & sentences"] },
        ]
    },
    {
        level: "C2",
        name: "Class 2",
        ageRange: "Age 7 – 8 years",
        category: "PRIMARY CLASSES",
        subjects: [
            { name: "ENGLISH", topics: ["Fluent reading", "Fluent writing", "Nouns & pronouns", "Tenses", "Creative writing"] },
            { name: "MATHS", topics: ["All 4 operations"] },
            { name: "GK & EVS", topics: ["General knowledge", "Environment"] },
            { name: "HINDI", topics: ["Matra", "Paragraph", "Grammar"] },
        ]
    },
];

// Main programs list for cards
const programs = [
    {
        id: "abacus",
        title: "Ascento Abacus Program",
        subtitle: "A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.",
        age: "Ages 4–14",
        icon: "calculate",
        img: "/Images/WhatsApp-Image-2025-06-08-at-10.03.38_091c0f31.jpg",
        color: "#197fe6",
        points: [
            "11 progressive levels (O to 10)",
            "Two-hand, four-finger methodology",
            "Mental math mastery & visualization",
        ],
        format: "120 min, twice a week (Levels 1–10)",
    },
    {
        id: "vedic",
        title: "Ascento Vedic Maths Program",
        subtitle: "Ancient Vedic sutras applied to modern speed mathematics — from rapid arithmetic through algebraic polynomials and cube roots.",
        age: "Ages 10+",
        icon: "functions",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqxk1GRUHZfJQuTBAfsCo2fGg5thwR6QsSFYcvEUwsCc0tTjJ2oghjRR8RsIXERJrYD0wIuvD_M7VDmUFcQhPK4ek3PDc-A2B8XK1E_2hnsYuFsv64pQ188LEj6BVNWB0cqQIF5wZuBYYyMX6mFi5df5UAOjY6MTLr-Yaz_YmJOFsjkhUnrSk1tyoexF0dLtK1k_WfEoQle0EFb11BemMigNI0kiNSdkYWgbdtVzPcHBXPhbttGou1Vl4HKk2gI54QQltMGWLAY1A",
        color: "#7c3aed",
        points: [
            "4 comprehensive levels",
            "Vedic sutras & speed techniques",
            "From rapid arithmetic to cube roots",
        ],
        format: "Levels 1 to 4",
        sutras: ["Nikhilam Navatashcaramam Dashatah", "Urdhvatiryak", "Ek Nyunain Purvena", "Dhwajank", "Vilokaman", "Vinculum System"],
    },
    {
        id: "playschool",
        title: "Ascento Play School",
        subtitle: "A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.",
        age: "Age 1.5 – 8 years",
        icon: "child_care",
        img: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_cfe7f04f.jpg",
        color: "#e65d97",
        points: [
            "Toddler to Class 2 (7 stages)",
            "English, Hindi, Maths & EVS",
            "Communication, confidence & motor skills",
        ],
        format: "Toddler to Class 2",
        focus: ["Communication skills", "Confidence", "Motor skills", "Social development"],
    },
];

// Supplementary programs (kept as small cards)
const supplementaryPrograms = [
    {
        title: "Brain Gym",
        age: "Ages 5-15",
        icon: "psychology",
        img: "/Images/WhatsApp-Image-2025-06-08-at-10.03.37_e3ac77d8.jpg",
        points: ["Kinesiology-based movement exercises", "Improves left and right brain coordination", "Reduces stress and boosts concentration"]
    },
    {
        title: "Handwriting & Arts",
        age: "Ages 7+",
        icon: "draw",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9rKBuSrrdJ8oZl_1jCR-cgCmHrrxyfJv8ioRjWm7HCRiKy_mn3iGbJyH3-zoWcB6idqghb99Fxyz-ToDuLoAAb76AP5s01lojq8u9R2srZ4p9vxdY7A4XiRW9hFZsDhnSsjyf1iBuXtCQZkswWT1xrPhgXt5oehE5vJEH8JuMt_A9c8AOWJPgXQBQVnKZgl2FAp-Vc5HH40Zj1cjmA88ckI3c8R3Posy0537o9J4F-tsX3y4xEBClOei3U2Pp4Kw7THDZGWCqzCw",
        points: ["Cursive and print handwriting improvement", "Artistic calligraphy for creative expression", "Focus on grip, posture, and legibility"]
    },
    {
        title: "Yoga & Zumba",
        age: "For Females",
        icon: "self_improvement",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8D6owVTNfzRcriY-mEEJ9xWtY0ZrIQOnym60cM-1cnV9I7eBmPM9B-atZ3LwveycepmKrgbkQ3r8x8xyeP1k437XFhUW4cIfcFqbTikjJKqkaLypgsqv1fBb45H03iRl0oFuFo4CUKFlGT-hhWpEedHq3vSMa9mGDX68uvbKkRUSs2A4gzhbka54MfYr4RMw0lOS7qSCPvifM5cV15fYslP4yO2tZRWgXX8kXtscaaE86kIK_xRQXziipgE29mZIeLbx0O9C9cPs",
        points: ["Holistic wellness and physical fitness", "Rhythmic Zumba sessions for energy", "Mental clarity and community building"]
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProgramsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [detailModal, setDetailModal] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        parentName: "",
        childName: "",
        childAge: "",
        phone: "",
        email: ""
    });

    const handleEnroll = (courseName: string) => {
        setSelectedCourse(courseName);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "Enquiries"), {
                ...formData,
                course: selectedCourse,
                status: "Pending",
                createdAt: serverTimestamp(),
                source: "Website Enrollment"
            });
            setShowSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setShowSuccess(false);
                setFormData({ parentName: "", childName: "", childAge: "", phone: "", email: "" });
            }, 3000);
        } catch (error) {
            console.error("Enrollment Error:", error);
            alert("Failed to submit enrollment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-[#f6f7f8] dark:bg-[#111921] font-sans text-slate-900 dark:text-slate-100 antialiased">
            <Navbar />

            {/* Hero Section */}
            <header className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#197fe6_0%,_transparent_70%)]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm font-semibold mb-4 tracking-wide uppercase">Brain Development Center</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                        Our Specialized Programs
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Empowering young minds through our signature <span className="text-[#197fe6] font-semibold">&ldquo;two-hand, four-finger&rdquo;</span> methodology. We focus on holistic growth, combining ancient wisdom with modern cognitive science.
                    </p>
                </div>
            </header>

            {/* ─── Main Program Cards ─── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Core Programs</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Our flagship programs with structured curriculum and progressive levels.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {programs.map((prog, idx) => (
                        <FadeIn key={prog.id} delay={idx * 0.1}>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col h-full group">
                                {/* Image */}
                                <div className="h-52 relative overflow-hidden">
                                    <Image src={prog.img} alt={prog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: prog.color }}>{prog.age}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-icons p-2 rounded-lg text-white" style={{ backgroundColor: prog.color }}>{prog.icon}</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{prog.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{prog.subtitle}</p>

                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 mb-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            <span className="material-icons text-sm" style={{ color: prog.color }}>schedule</span>
                                            {prog.format}
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6 flex-grow">
                                        {prog.points.map((pt, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-sm mt-0.5" style={{ color: prog.color }}>check_circle</span>
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex gap-3 mt-auto">
                                        <button
                                            onClick={() => setDetailModal(prog.id)}
                                            className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:shadow-md"
                                            style={{ borderColor: prog.color, color: prog.color }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleEnroll(prog.title)}
                                            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-md hover:opacity-90"
                                            style={{ backgroundColor: prog.color }}
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* ─── Supplementary Programs ─── */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Supplementary Programs</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Additional programs to complement holistic development.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {supplementaryPrograms.map((prog, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                                <div className="h-48 relative">
                                    <Image src={prog.img} alt={prog.title} fill className="object-cover" />
                                    <div className="absolute top-4 right-4 bg-[#197fe6] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{prog.age}</div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-[#197fe6] p-2 bg-[#197fe6]/10 rounded-lg">{prog.icon}</span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{prog.title}</h3>
                                    </div>
                                    <ul className="space-y-3 mb-6 text-slate-600 dark:text-slate-400 flex-grow">
                                        {prog.points.map((pt, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-2">
                                                <span className="material-icons text-[#197fe6] text-sm mt-1">check_circle</span>
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleEnroll(prog.title)}
                                        className="w-full bg-[#197fe6] text-white py-3 rounded-lg font-semibold hover:bg-[#197fe6]/90 transition-colors mt-auto"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </main>

            {/* Methodology Highlight Section */}
            <section className="bg-[#197fe6]/5 dark:bg-slate-900/50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Why the Two-Hand, Four-Finger Methodology?</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                                Our unique approach stimulates both the left and right hemispheres of the brain simultaneously. Using two hands and four fingers creates a sensory-rich environment that enhances cognitive dexterity.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8 text-center border-none">
                                <div className="p-4 bg-[#197fe6]/10 rounded-xl">
                                    <div className="text-[#197fe6] font-bold text-2xl mb-1">95%</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy Improvement</div>
                                </div>
                                <div className="p-4 bg-[#197fe6]/10 rounded-xl">
                                    <div className="text-[#197fe6] font-bold text-2xl mb-1">2.5x</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Faster Processing</div>
                                </div>
                            </div>
                            <button className="text-[#197fe6] font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                                Learn about our methodology <span className="material-icons">arrow_forward</span>
                            </button>
                        </div>
                        <div className="md:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKjmqfxdkYgPj8VLXpxT9qf6Y2PKKtUp6U8WA8AHFwLIFONW2iwrRzyxpDoUvZBj9m5ZOpbJ5FiyU40_ueTRCtwVPFg7_FwKmRgqPahR413Cj42PBtXszl-DXb2dFzs6H12W8Y2vwlimwIyi9D_7wTQzrmX8oqkkM48g3VAUc42HKynMYL81cG2hS_ZPf5NlGcaMqaYKVGBiKWvwBJ-paRGSKbxhPJxAPfaf5SkP72oy_kom4EGQ6C1S-3FGFQehGKOacH4gZmvRU"
                                    alt="Methodology"
                                    width={600}
                                    height={400}
                                    className="w-full aspect-video object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#197fe6]/40 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 bg-[#f6f7f8] dark:bg-[#111921]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Start Your Child&apos;s Journey Today</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
                        Join hundreds of families who have seen remarkable improvements in their children&apos;s focus, memory, and confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-[#197fe6] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#197fe6]/90 transition-all shadow-lg shadow-[#197fe6]/30">Book a Free Trial</button>
                        <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-xl font-bold text-lg hover:border-[#197fe6] transition-all">Download Brochure</button>
                    </div>
                </div>
            </section>

            <Footer />

            {/* ─── Detail Modals ─── */}
            <AnimatePresence>
                {detailModal && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-8 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDetailModal(null)}
                            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-5xl bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden z-10"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setDetailModal(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <span className="material-icons">close</span>
                            </button>

                            {/* ─── Abacus Detail ─── */}
                            {detailModal === "abacus" && (
                                <div className="p-6 md:p-10">
                                    <div className="text-center mb-10">
                                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#197fe6]/20 text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-4">Ascento Abacus Program</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Complete Syllabus — Levels O to 10</h2>
                                        <p className="text-slate-400 max-w-2xl mx-auto">A structured 12-week per-level journey from foundational abacus basics through grand master mental mathematics mastery.</p>
                                    </div>

                                    {/* Standard class format */}
                                    <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Standard Class Format — 120 min, twice a week (Levels 1–10)</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                            <span>Warm-up + Oral</span>
                                            <span>•</span>
                                            <span>Concept Teaching</span>
                                            <span>•</span>
                                            <span>Worksheet + Speed</span>
                                            <span>•</span>
                                            <span>Abacus Practice</span>
                                        </div>
                                    </div>

                                    {/* Foundation */}
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Foundation</p>
                                        <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-5">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 text-white font-bold text-lg">O</span>
                                                <div>
                                                    <h4 className="text-white font-bold">O Level — Foundations</h4>
                                                    <p className="text-slate-400 text-xs">Pre-Level Introduction</p>
                                                </div>
                                                <span className="ml-auto text-xs text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">{abacusLevels[0].duration}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 mb-4">{abacusLevels[0].format}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {abacusLevels[0].sections.map((sec, i) => (
                                                    <div key={i}>
                                                        <p className="text-xs font-bold text-slate-400 mb-1">{sec.title}</p>
                                                        <ul className="space-y-0.5">
                                                            {sec.items.map((item, j) => (
                                                                <li key={j} className="text-sm text-slate-300">{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {abacusLevels[0].tags.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Beginner Levels 1–4 */}
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Beginner — Levels 1 to 4</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {abacusLevels.slice(1, 5).map((lvl) => (
                                                <AbacusLevelCard key={lvl.level} lvl={lvl} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Intermediate Levels 5–7 */}
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Intermediate — Levels 5 to 7</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {abacusLevels.slice(5, 8).map((lvl) => (
                                                <AbacusLevelCard key={lvl.level} lvl={lvl} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expert Levels 8–10 */}
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Expert — Levels 8 to 10</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {abacusLevels.slice(8, 11).map((lvl) => (
                                                <AbacusLevelCard key={lvl.level} lvl={lvl} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Enroll CTA */}
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={() => { setDetailModal(null); handleEnroll("Ascento Abacus Program"); }}
                                            className="bg-[#197fe6] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#197fe6]/90 transition-all shadow-lg shadow-[#197fe6]/30"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ─── Vedic Maths Detail ─── */}
                            {detailModal === "vedic" && (
                                <div className="p-6 md:p-10">
                                    <div className="text-center mb-10">
                                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold uppercase tracking-widest mb-4">Ascento Vedic Maths Program</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Complete Syllabus — Levels 1 to 4</h2>
                                        <p className="text-slate-400 max-w-2xl mx-auto">Ancient Vedic sutras applied to modern speed mathematics — from rapid arithmetic through algebraic polynomials and cube roots.</p>
                                    </div>

                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">All Levels</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {vedicMathsLevels.map((lvl) => (
                                            <div key={lvl.level} className="bg-slate-800/60 rounded-xl border border-slate-700 p-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7c3aed] text-white font-bold text-lg">{lvl.level}</span>
                                                    <div>
                                                        <h4 className="text-white font-bold">Level {lvl.level} — {lvl.name}</h4>
                                                        <p className="text-slate-400 text-xs">{lvl.subtitle}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {lvl.sections.map((sec, i) => (
                                                        <div key={i}>
                                                            <p className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider mb-1">{sec.title}</p>
                                                            {sec.highlighted && (
                                                                <p className="text-sm text-slate-400 italic bg-slate-700/40 rounded-lg px-3 py-1.5 mb-2">{sec.highlighted}</p>
                                                            )}
                                                            <div className="flex flex-wrap gap-2">
                                                                {sec.items.map((item, j) => (
                                                                    <span key={j} className="px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs">{item}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sutras covered */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 mb-8">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sutras Covered Across the Program</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Nikhilam Navatashcaramam Dashatah", "Urdhvatiryak", "Ek Nyunain Purvena", "Dhwajank", "Vilokaman", "Vinculum System"].map((s, i) => {
                                                const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#84cc16"];
                                                return (
                                                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: colors[i] + "22", color: colors[i] }}>{s}</span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={() => { setDetailModal(null); handleEnroll("Ascento Vedic Maths Program"); }}
                                            className="bg-[#7c3aed] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#7c3aed]/90 transition-all shadow-lg shadow-[#7c3aed]/30"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ─── Play School Detail ─── */}
                            {detailModal === "playschool" && (
                                <div className="p-6 md:p-10">
                                    <div className="text-center mb-10">
                                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#e65d97]/20 text-[#e65d97] text-xs font-bold uppercase tracking-widest mb-4">Ascento Play School</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Complete Curriculum — Toddler to Class 2</h2>
                                        <p className="text-slate-400 max-w-2xl mx-auto">A nurturing early-learning journey that blends language, numeracy, and life skills — from first words through fluent reading and writing.</p>
                                    </div>

                                    {/* Group by category */}
                                    {["EARLY YEARS", "PRE-PRIMARY", "PRIMARY CLASSES"].map((category) => (
                                        <div key={category} className="mb-8">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{category}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {playSchoolLevels.filter(l => l.category === category).map((lvl) => (
                                                    <div key={lvl.level} className="bg-slate-800/60 rounded-xl border border-slate-700 p-5">
                                                        <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
                                                            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e65d97]/20 text-[#e65d97] font-bold text-xs leading-tight text-center whitespace-pre-line">{lvl.level}</span>
                                                            <div>
                                                                <h4 className="text-white font-bold">{lvl.name}</h4>
                                                                <p className="text-slate-400 text-xs">{lvl.ageRange}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {lvl.subjects.map((subj, i) => {
                                                                const subjectColors: Record<string, string> = {
                                                                    SENSES: "#f59e0b",
                                                                    MOTOR: "#ef4444",
                                                                    LANGUAGE: "#8b5cf6",
                                                                    SOCIAL: "#10b981",
                                                                    WRITING: "#6366f1",
                                                                    ENGLISH: "#3b82f6",
                                                                    MATHS: "#f59e0b",
                                                                    HINDI: "#ef4444",
                                                                    EVS: "#10b981",
                                                                    "GK & EVS": "#10b981",
                                                                };
                                                                const color = subjectColors[subj.name] || "#64748b";
                                                                return (
                                                                    <div key={i} className="flex items-start gap-3">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1 min-w-[60px]" style={{ color }}>{subj.name}</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {subj.topics.map((t, j) => (
                                                                                <span key={j} className="px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: color + "18", color }}>{t}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Program focus */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 mb-8">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Program Focus — What Every Child Develops</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Communication skills", "Confidence", "Motor skills", "Social development"].map((f, i) => {
                                                const colors = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];
                                                return (
                                                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: colors[i] + "22", color: colors[i] }}>{f}</span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={() => { setDetailModal(null); handleEnroll("Ascento Play School"); }}
                                            className="bg-[#e65d97] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#e65d97]/90 transition-all shadow-lg shadow-[#e65d97]/30"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── Enrollment Modal ─── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            {showSuccess ? (
                                <div className="p-12 text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons text-4xl">check_circle</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Application Received</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Our advisors will contact you shortly to finalize the enrollment for <span className="text-[#197fe6] font-bold">{selectedCourse}</span>.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-[#197fe6] p-8 text-white relative">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                                        >
                                            <span className="material-icons">close</span>
                                        </button>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Enrollment Portal</span>
                                        <h3 className="text-2xl font-black italic tracking-tight mt-1">Enroll in {selectedCourse}</h3>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-8 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Parent&apos;s Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.parentName}
                                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-[#197fe6] outline-none transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Child&apos;s Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.childName}
                                                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-[#197fe6] outline-none transition-all"
                                                    placeholder="Alex"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1.5 col-span-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Age</label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={formData.childAge}
                                                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-[#197fe6] outline-none transition-all"
                                                    placeholder="8"
                                                />
                                            </div>
                                            <div className="space-y-1.5 col-span-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-[#197fe6] outline-none transition-all"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email (Optional)</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-[#197fe6] outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <button
                                            disabled={isSubmitting}
                                            className="w-full bg-[#197fe6] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs mt-4 shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Processing..." : "Submit Enrollment"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Abacus Level Card Component ─────────────────────────────────────────────

function AbacusLevelCard({ lvl }: { lvl: typeof abacusLevels[number] }) {
    return (
        <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#197fe6] text-white font-bold text-lg">{lvl.level}</span>
                <div className="flex-1">
                    <h4 className="text-white font-bold text-sm">Level {lvl.level} — {lvl.name}</h4>
                    <p className="text-slate-400 text-xs">{lvl.duration}</p>
                </div>
            </div>
            <div className="space-y-2">
                {lvl.sections.map((sec, i) => (
                    <div key={i}>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">{sec.title}</p>
                        <ul className="space-y-0">
                            {sec.items.map((item, j) => (
                                <li key={j} className="text-xs text-slate-400">{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
                {lvl.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px]">{tag}</span>
                ))}
            </div>
        </div>
    );
}
