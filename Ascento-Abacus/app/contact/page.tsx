"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FadeIn, SlideIn, ScaleIn } from "../components/AnimatedSection";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        program: 'Abacus Mental Math',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await fetch('http://localhost:5001/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: 'user@example.com', // Placeholder or add email field
                    phone: formData.phone,
                    message: `Age: ${formData.age}, Program: ${formData.program}, Message: ${formData.message}`
                })
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', age: '', phone: '', program: 'Abacus Mental Math', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-[#f6f7f8] dark:bg-[#111921] font-sans text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
            <Navbar />

            {/* Header Section */}
            <section className="relative py-20 bg-white dark:bg-slate-900 overflow-hidden text-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#197fe6] rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#197fe6] rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#197fe6]/10 text-[#197fe6] text-sm font-bold mb-4 uppercase tracking-wider">Reach Out to Us</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                            Start Your Child's <span className="text-[#197fe6]">Genius Journey</span> Today
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            Have questions about our mental math or brain development programs? Our expert educators at the Dwarka branch are here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        <FadeIn>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="w-12 h-12 bg-[#197fe6]/10 rounded-lg flex items-center justify-center mb-6 text-[#197fe6]">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Visit Our Center</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    D-168 C, Patel Garden,<br />
                                    Near Dwarka Hospital,<br />
                                    Dwarka, New Delhi - 110075
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="w-12 h-12 bg-[#197fe6]/10 rounded-lg flex items-center justify-center mb-6 text-[#197fe6]">
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Call Us Directly</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-1 font-medium text-lg">+91 98765 43210</p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">+91 91234 56789</p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="w-12 h-12 bg-[#197fe6]/10 rounded-lg flex items-center justify-center mb-6 text-[#197fe6]">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Send an Email</h3>
                                <p className="text-slate-600 dark:text-slate-400">info@ascentoabacus.com</p>
                                <p className="text-slate-600 dark:text-slate-400">admissions@ascentoabacus.com</p>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Inquiry Form */}
                    <div className="lg:col-span-8">
                        <FadeIn delay={0.3}>
                            <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                                <h2 className="text-3xl font-bold mb-2">Admission Inquiry</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">Fill out the form below and our counselor will call you back within 24 hours.</p>
                                {status === 'success' && (
                                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                                        Your inquiry has been submitted successfully! We will contact you soon.
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                                        Something went wrong. Please try again later.
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Parent Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-[#197fe6] focus:border-[#197fe6] transition-all"
                                            placeholder="Enter your full name"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Child's Age</label>
                                        <input
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-[#197fe6] focus:border-[#197fe6] transition-all"
                                            placeholder="Enter age (e.g. 7)"
                                            type="number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-[#197fe6] focus:border-[#197fe6] transition-all"
                                            placeholder="+91 XXXXX XXXXX"
                                            type="tel"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Program of Interest</label>
                                        <select
                                            name="program"
                                            value={formData.program}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-[#197fe6] focus:border-[#197fe6] transition-all"
                                        >
                                            <option>Abacus Mental Math</option>
                                            <option>Vedic Mathematics</option>
                                            <option>Calligraphy</option>
                                            <option>Handwriting Improvement</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:ring-[#197fe6] focus:border-[#197fe6] transition-all"
                                            placeholder="Tell us more about your child's requirements..."
                                            rows={4}
                                        ></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <button
                                            disabled={status === 'submitting'}
                                            className="w-full md:w-auto bg-[#197fe6] hover:bg-[#197fe6]/90 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
                                            type="submit"
                                        >
                                            {status === 'submitting' ? 'Sending...' : 'Send Inquiry'} <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Location Map Section */}
            <section className="bg-[#f6f7f8] dark:bg-[#111921] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Find Us in Dwarka</h2>
                            <p className="text-slate-600 dark:text-slate-400">We are conveniently located near Dwarka Hospital for easy access.</p>
                        </div>
                        <Link className="inline-flex items-center gap-2 text-[#197fe6] font-bold hover:underline" href="#">
                            Open in Google Maps <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                    </div>
                    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
                        <Image
                            alt="Location Map"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdrKdbiCpkUUy3tu2gkKOAIQHARHPZeSUCnBvHmWlI5wcMrsyFj5bDXqpEDOxyOjGeEmqvR59JHC-oKym5zlg3qGVNjb0ok0RTPq7GUMsxJcHV9Sliw1r23HxRUbpH0UvU3lK49sTrdo-gjriWGuIWa9HEmvkFTIrc_bXnoUNGGUBAq_Yby-UrSrmuMAEYwILg0eR0zszCHR3v9wmPoYMwgh_ZrHtQy18ZhRfJvcTZSLElglIaCIWgvvRcHvRdr54qOseoFfLPXYc"
                            fill
                            className="w-full h-full object-cover grayscale contrast-125 opacity-80"
                        />
                        {/* Overlay Card on Map */}
                        <div className="absolute top-8 left-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl max-w-sm hidden md:block border-none">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#197fe6] rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white">location_on</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Ascento Abacus Dwarka</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">D-168 C, Patel Garden, Opp. Dwarka Hospital, Sector 15, New Delhi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
