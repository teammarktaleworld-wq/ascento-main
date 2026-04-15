import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#0e141b] border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative size-10 flex items-center justify-center">
                                <Image 
                                    src="/Acento-Logo.jpg" 
                                    alt="Ascento Abacus Logo" 
                                    width={40} 
                                    height={40}
                                    className="object-contain rounded-lg"
                                />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-[#0e141b] dark:text-white">Ascento Abacus</h2>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Empowering young minds through specialized Abacus and mental math programs that foster brain development and confidence.
                        </p>
                        <div className="flex gap-4">
                            <a className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#197fe6] transition-colors" href="#">
                                <span className="material-symbols-outlined">social_leaderboard</span>
                            </a>
                            <a className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#197fe6] transition-colors" href="#">
                                <span className="material-symbols-outlined">camera</span>
                            </a>
                            <a className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 hover:text-[#197fe6] transition-colors" href="#">
                                <span className="material-symbols-outlined">alternate_email</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#0e141b] dark:text-white mb-6 text-none border-none">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/">Home</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/programs">Our Programs</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/franchise">Franchise Opportunities</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#0e141b] dark:text-white mb-6 text-none border-none">Programs</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/programs">Abacus Mastery</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/programs">Brain Gym</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/programs">Vedic Maths</Link></li>
                            <li><Link className="hover:text-[#197fe6] transition-colors" href="/programs">Pre-Abacus</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#0e141b] dark:text-white mb-6 text-none border-none">Contact Info</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-[#197fe6] text-lg">location_on</span>
                                <span>D-168 C, Patel Garden, Dwarka, New Delhi</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-[#197fe6] text-lg">call</span>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-[#197fe6] text-lg">mail</span>
                                <span>info@ascentoabacus.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>© 2024 Ascento Abacus Academy. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link className="hover:text-[#197fe6] transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-[#197fe6] transition-colors" href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
