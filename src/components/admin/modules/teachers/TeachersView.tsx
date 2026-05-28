



// 'use client';

// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Plus, Search, Trash2, X, AlertCircle, Loader2,
//   Edit, Mail, Phone, Briefcase, BookOpen, KeyRound,
//   Copy, Check, AlertTriangle, Download, Eye, IdCard,
//   Camera, Upload, MoreHorizontal,
// } from 'lucide-react';
// import { supabase } from "@/lib/supabaseClient";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const SCHOOL_NAME    = "Ascento Playschool";
// const SCHOOL_TAGLINE = "Play School";
// const SCHOOL_WEBSITE = "www.ascentoplayschool.com";
// const SCHOOL_PHONE   = "+91 98765 43210";
// const SCHOOL_ADDRESS = "Ascento Playschool, Indore, MP";
// const LOGO_URL       = "/Acento-Logo.jpg";

// // ── API helper ─────────────────────────────────────────────────────────────────
// async function apiFetch(path: string, options?: RequestInit) {
//   const { data } = await supabase.auth.getSession();
//   const token = data.session?.access_token;
//   const res = await fetch(path, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...(options?.headers ?? {}),
//     },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// // ── Upload photo ───────────────────────────────────────────────────────────────
// async function uploadTeacherPhoto(file: File, email: string): Promise<string> {
//   const { data: sessionData } = await supabase.auth.getSession();
//   if (!sessionData.session) throw new Error("Not authenticated");
//   const ext  = file.name.split(".").pop() ?? "jpg";
//   const path = `teacher-photos/${email.replace(/[@.]/g, "_")}_${Date.now()}.${ext}`;
//   const { error } = await supabase.storage
//     .from("student-assets")
//     .upload(path, file, { upsert: true, contentType: file.type });
//   if (error) throw new Error(error.message);
//   const { data } = supabase.storage.from("student-assets").getPublicUrl(path);
//   return data.publicUrl;
// }

// // ── PDF helpers ────────────────────────────────────────────────────────────────
// function openPrintWindow(htmlContent: string) {
//   const win = window.open("", "_blank", "width=1000,height=700");
//   if (!win) { alert("Please allow popups to download the PDF."); return; }
//   win.document.write(htmlContent);
//   win.document.close();
//   win.focus();
//   setTimeout(() => win.print(), 800);
// }

// async function urlToBase64(url: string): Promise<string> {
//   try {
//     const res  = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload  = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch { return ""; }
// }

// // ── ID Card HTML (green theme, portrait, matches physical card layout) ─────────
// async function buildTeacherIDCardHTML(teacher: any, logoUrl?: string): Promise<string> {
//   let photoSrc = "";
//   if (teacher.photoUrl) { const b64 = await urlToBase64(teacher.photoUrl); if (b64) photoSrc = b64; }
//   let logoSrc = "";
//   if (logoUrl) { const b64 = await urlToBase64(logoUrl); if (b64) logoSrc = b64; }

//   const logoImgFront = logoSrc
//     ? `<img src="${logoSrc}" class="logo-img" />`
//     : `<div class="logo-av">A</div>`;
//   const logoImgBack = logoSrc
//     ? `<img src="${logoSrc}" class="logo-back" />`
//     : `<div class="logo-av-back">A</div>`;
//   const photoHtml = photoSrc
//     ? `<img src="${photoSrc}" class="photo" />`
//     : `<div class="photo-av">${(teacher.name?.[0] ?? "T").toUpperCase()}</div>`;

//   const addrLine = "Ascento Playschool, Indore, Madhya Pradesh";

//   return `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>ID Card — ${teacher.name}</title>
// <style>
//   * { margin:0; padding:0; box-sizing:border-box; }
//   @page { size: A4 portrait; margin: 15mm; }
//   body {
//     font-family: Arial, Helvetica, sans-serif;
//     background: #f5f5f5;
//     display: flex;
//     flex-direction: row;
//     align-items: flex-start;
//     justify-content: center;
//     gap: 20px;
//     padding: 20px;
//   }
//   .card {
//     width: 260px;
//     background: #fff;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//     border: 1px solid #eee;
//     display: flex;
//     flex-direction: column;
//     flex-shrink: 0;
//   }
//   /* Green header */
//   .header {
//     background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
//     padding: 10px 12px 8px;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
//   .logo-img  { width:36px; height:36px; border-radius:6px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0; }
//   .logo-av   { width:36px; height:36px; border-radius:6px; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:900; color:#fff; flex-shrink:0; }
//   .header-text .school { color:#fff; font-weight:900; font-size:13px; line-height:1.2; }
//   .header-text .tag    { color:rgba(255,255,255,0.8); font-size:8px; }
//   .header-text .tid    { color:rgba(255,255,255,0.7); font-size:7.5px; margin-top:2px; }
//   .wave-top svg { display:block; width:100%; }
//   .photo-wrap { display:flex; flex-direction:column; align-items:center; padding:6px 12px 10px; }
//   .photo    { width:80px; height:90px; border-radius:50%; object-fit:cover; border:3px solid #2e7d32; }
//   .photo-av { width:80px; height:90px; border-radius:50%; background:#e8f5e9; border:3px solid #2e7d32; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:#2e7d32; }
//   .info { padding: 0 14px 6px; font-size:9.5px; }
//   .row  { display:flex; gap:4px; margin-bottom:4px; align-items:flex-start; }
//   .lbl  { font-weight:700; color:#333; width:60px; flex-shrink:0; }
//   .val  { color:#555; font-weight:600; }
//   .desig { color:#2e7d32 !important; font-weight:900 !important; }
//   .sign       { padding:4px 14px; display:flex; justify-content:flex-end; }
//   .sign-inner { text-align:center; }
//   .sign-line  { border-bottom:1px solid #aaa; width:60px; margin-bottom:2px; }
//   .sign-label { font-size:7.5px; color:#777; }
//   .wave-bot svg { display:block; width:100%; margin-top:2px; }
//   /* Back */
//   .wave-top-back svg { display:block; width:100%; }
//   .back-logo  { display:flex; flex-direction:column; align-items:center; padding:10px 14px 8px; text-align:center; }
//   .logo-back  { width:48px; height:48px; border-radius:8px; object-fit:contain; margin-bottom:6px; }
//   .logo-av-back { width:48px; height:48px; border-radius:8px; background:linear-gradient(135deg,#2e7d32,#1b5e20); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:#fff; margin-bottom:6px; }
//   .back-school { font-weight:900; font-size:14px; color:#1a1a2e; line-height:1.2; }
//   .back-tag    { font-size:8.5px; color:#666; margin-top:2px; }
//   .divider { height:1px; background:#f0eef8; margin:0 14px; }
//   .back-addr   { padding:8px 14px; text-align:center; font-size:8.5px; color:#444; line-height:1.6; }
//   .finder      { padding:8px 14px; text-align:center; }
//   .finder-title { font-weight:900; font-size:10px; color:#2e7d32; margin-bottom:4px; line-height:1.3; }
//   .finder-addr  { font-size:8.5px; color:#444; line-height:1.6; }
//   .status-chip { display:flex; justify-content:center; padding:4px 0; }
//   .chip        { background:#4ecdc422; border:1px solid #4ecdc444; border-radius:20px; padding:2px 10px; display:flex; align-items:center; gap:4px; }
//   .dot         { width:5px; height:5px; border-radius:50%; background:#4ecdc4; }
//   .chip-txt    { font-size:8px; font-weight:900; color:#4ecdc4; }
//   .card-label  { text-align:center; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:8px; }
//   .card-wrapper { display:flex; flex-direction:column; align-items:center; }
//   @media print {
//     body { background:#fff; gap:20px; padding:0; }
//     * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
//   }
// </style>
// </head>
// <body>
// <!-- FRONT -->
// <div class="card-wrapper">
//   <div class="card-label">Front</div>
//   <div class="card">
//     <div class="header">
//       ${logoImgFront}
//       <div class="header-text">
//         <div class="school">${SCHOOL_NAME}</div>
//         <div class="tag">${SCHOOL_TAGLINE}</div>
//         <div class="tid">ID: ${teacher.teacherId ?? teacher.id?.slice(0,8).toUpperCase() ?? "—"}</div>
//       </div>
//     </div>
//     <div class="wave-top">
//       <svg viewBox="0 0 260 18"><path d="M0,18 Q65,0 130,10 Q195,20 260,4 L260,0 L0,0 Z" fill="#2e7d32" opacity="0.15"/></svg>
//     </div>
//     <div class="photo-wrap">${photoHtml}</div>
//     <div class="info">
//       <div class="row"><span class="lbl">Name</span><span class="val">: &nbsp;${teacher.name ?? "—"}</span></div>
//       <div class="row"><span class="lbl">D.O.B</span><span class="val">: &nbsp;${teacher.dateOfBirth ?? "—"}</span></div>
//       <div class="row"><span class="lbl">Mob.</span><span class="val">: &nbsp;${teacher.phone ?? "—"}</span></div>
//       <div class="row"><span class="lbl">Designation</span><span class="val desig">: &nbsp;${teacher.designation ?? "—"}</span></div>
//       <div class="row"><span class="lbl">W/O</span><span class="val">: &nbsp;${teacher.wifeOrHusbandOf ?? "—"}</span></div>
//     </div>
//     <div class="sign"><div class="sign-inner"><div class="sign-line"></div><div class="sign-label">Auth. Sign.</div></div></div>
//     <div class="wave-bot">
//       <svg viewBox="0 0 260 22"><path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/><path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/></svg>
//     </div>
//   </div>
// </div>
// <!-- BACK -->
// <div class="card-wrapper">
//   <div class="card-label">Back</div>
//   <div class="card">
//     <div class="wave-top-back">
//       <svg viewBox="0 0 260 28"><path d="M0,0 L260,0 L260,16 Q195,28 130,20 Q65,12 0,24 Z" fill="#1b5e20" opacity="0.6"/><path d="M0,0 L260,0 L260,10 Q195,22 130,14 Q65,6 0,18 Z" fill="#2e7d32"/></svg>
//     </div>
//     <div class="back-logo">
//       ${logoImgBack}
//       <div class="back-school">${SCHOOL_NAME}</div>
//       <div class="back-tag">${SCHOOL_TAGLINE}</div>
//     </div>
//     <div class="divider"></div>
//     <div class="back-addr">${SCHOOL_ADDRESS}<br/>${SCHOOL_WEBSITE}<br/>Mob.: ${SCHOOL_PHONE}</div>
//     <div class="divider"></div>
//     <div class="finder">
//       <div class="finder-title">Finder may please<br/>return to</div>
//       <div class="finder-addr">${addrLine}<br/>Mob.: ${teacher.phone ?? "—"}</div>
//     </div>
//     <div class="status-chip"><div class="chip"><div class="dot"></div><span class="chip-txt">${teacher.status ?? "Active"}</span></div></div>
//     <div class="wave-bot">
//       <svg viewBox="0 0 260 22"><path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/><path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/></svg>
//     </div>
//   </div>
// </div>
// </body>
// </html>`;
// }

// // ── Report HTML ────────────────────────────────────────────────────────────────
// async function buildTeacherReportHTML(r: any): Promise<string> {
//   const generated = new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });
//   const joined    = r.joinedAt ? new Date(r.joinedAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—";

//   const fields: [string, string][] = [
//     ["Teacher ID",   r.teacherId ?? r.id ?? "—"],
//     ["Full Name",    r.name],
//     ["Email",        r.email ?? "—"],
//     ["Phone",        r.phone ?? "—"],
//     ["Designation",  r.designation ?? "—"],
//     ["W/O",          r.wifeOrHusbandOf ?? "—"],
//     ["Experience",   r.experience ?? "—"],
//     ["Subjects",     (r.subjects ?? []).join(", ") || "—"],
//     ["Status",       r.status ?? "Active"],
//     ["Joined At",    joined],
//   ];

//   let photoHtml = "";
//   if (r.photoUrl) {
//     const b64 = await urlToBase64(r.photoUrl);
//     if (b64) photoHtml = `<img src="${b64}" alt="Photo" class="report-photo" />`;
//   }

//   return `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>Teacher Report — ${r.name}</title>
// <style>
//   * { margin:0; padding:0; box-sizing:border-box; }
//   body { font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; color:#1A1A2E; padding:20px; }
//   .hdr { background:linear-gradient(135deg,#2e7d32,#1b5e20); border-radius:12px; padding:20px 24px; color:#fff; margin-bottom:18px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
//   .hdr-left { flex:1; }
//   .school    { font-size:9px; font-weight:900; letter-spacing:2px; text-transform:uppercase; opacity:.8; margin-bottom:4px; }
//   h1         { font-size:22px; font-weight:900; line-height:1.2; }
//   .tid       { font-family:monospace; font-size:11px; opacity:.7; margin-top:3px; }
//   .badge     { background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); padding:2px 10px; border-radius:20px; font-size:9px; font-weight:900; letter-spacing:1px; text-transform:uppercase; display:inline-block; margin-top:8px; }
//   .report-photo { width:60px; height:72px; border-radius:8px; object-fit:cover; border:2px solid rgba(255,255,255,0.4); flex-shrink:0; }
//   .hdr-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
//   .date      { font-size:9px; opacity:.65; }
//   .grid      { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
//   .cell      { background:#fff; border:1px solid #F0EEF8; border-radius:8px; padding:10px 14px; }
//   .lbl       { font-size:7px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:2px; }
//   .val       { font-size:12px; font-weight:700; word-break:break-word; }
//   .footer    { margin-top:18px; text-align:center; font-size:8px; color:#ccc; }
//   @page { margin:12mm; }
//   @media print {
//     body { background:#fff; padding:0; }
//     * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
//   }
// </style>
// </head>
// <body>
// <div class="hdr">
//   <div class="hdr-left">
//     <div class="school">${SCHOOL_NAME} · Faculty</div>
//     <h1>${r.name}</h1>
//     <div class="tid">${r.teacherId ?? r.id ?? ""}</div>
//     ${r.designation ? `<span class="badge">${r.designation}</span>` : ""}
//   </div>
//   <div class="hdr-right">
//     ${photoHtml}
//     <div class="date">Generated: ${generated}</div>
//   </div>
// </div>
// <div class="grid">
//   ${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}
// </div>
// <div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Teacher Report</div>
// </body>
// </html>`;
// }

// // ── UI Primitives ──────────────────────────────────────────────────────────────
// const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
//   <button
//     type={type} onClick={onClick} disabled={disabled}
//     className={`bg-gradient-to-r from-[#2e7d32] to-[#43a047] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(46,125,50,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
//   >
//     {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
//     {children}
//   </button>
// );

// const Badge = ({ text, color = "#2e7d32" }: { text: string; color?: string }) => (
//   <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
//     className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block">
//     {text}
//   </span>
// );

// const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
//       <div className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col`}
//         style={{ maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
//         <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
//           <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
//           <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"><X size={20} /></button>
//         </div>
//         <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: 'thin' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange, disabled = false }: any) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
//       {label} {required && <span className="text-[#FF6B6B]">*</span>}
//     </label>
//     <input type={type} placeholder={placeholder} value={value ?? ""} disabled={disabled}
//       onChange={(e) => onChange?.(e.target.value)}
//       className={`w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#43a047] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
//   </div>
// );

// function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
//       <div className="min-w-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//         <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
//       </div>
//       <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//         className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#43a047] border-[#43a047]/40 bg-[#43a047]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#43a047]"}`}>
//         {copied ? <Check size={15} /> : <Copy size={15} />}
//       </button>
//     </div>
//   );
// }

// // ── Photo Upload ───────────────────────────────────────────────────────────────
// function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(value ?? null);
//   const handleFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//     onChange("pending", file);
//   };
//   return (
//     <div className="space-y-1.5">
//       <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
//       <div onClick={() => inputRef.current?.click()}
//         className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#43a047] hover:bg-[#f1f8e9] transition-all group overflow-hidden">
//         {preview ? (
//           <>
//             <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
//               <Camera size={20} className="text-white" />
//             </div>
//           </>
//         ) : (
//           <>
//             <Upload size={20} className="text-gray-300 group-hover:text-[#43a047] transition-colors mb-1.5" />
//             <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#43a047] text-center px-2 leading-tight">Upload<br />Photo</span>
//             <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
//           </>
//         )}
//       </div>
//       <input ref={inputRef} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//     </div>
//   );
// }

// // ── Teacher ID Card Preview ────────────────────────────────────────────────────
// function TeacherIDCard({ teacher, logoUrl }: { teacher: any; logoUrl?: string }) {
//   return (
//     <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
//       {/* FRONT */}
//       <div className="w-[260px] flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
//         <div style={{ width:260, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
//           {/* Header */}
//           <div style={{ background:"linear-gradient(135deg,#2e7d32,#1b5e20)", padding:"10px 12px 8px", display:"flex", alignItems:"center", gap:8 }}>
//             {logoUrl ? (
//               <img src={logoUrl} alt="logo" style={{ width:36, height:36, borderRadius:6, objectFit:"contain", background:"#fff", padding:2, flexShrink:0 }} />
//             ) : (
//               <div style={{ width:36, height:36, background:"rgba(255,255,255,0.25)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, fontWeight:900, color:"#fff" }}>A</div>
//             )}
//             <div>
//               <div style={{ color:"#fff", fontWeight:900, fontSize:13, lineHeight:1.2 }}>{SCHOOL_NAME}</div>
//               <div style={{ color:"rgba(255,255,255,0.8)", fontSize:8 }}>{SCHOOL_TAGLINE}</div>
//               <div style={{ color:"rgba(255,255,255,0.7)", fontSize:7.5, marginTop:2 }}>ID: {teacher.id?.slice(0,8).toUpperCase() ?? "—"}</div>
//             </div>
//           </div>
//           {/* Wave */}
//           <svg viewBox="0 0 260 18" style={{ display:"block", width:"100%" }}>
//             <path d="M0,18 Q65,0 130,10 Q195,20 260,4 L260,0 L0,0 Z" fill="#2e7d32" opacity="0.15"/>
//           </svg>
//           {/* Photo */}
//           <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"6px 12px 10px" }}>
//             <div style={{ width:80, height:90, borderRadius:"50%", overflow:"hidden", border:"3px solid #2e7d32", background:"#f1f8e9", display:"flex", alignItems:"center", justifyContent:"center" }}>
//               {teacher.photoUrl ? (
//                 <img src={teacher.photoUrl} alt={teacher.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//               ) : (
//                 <span style={{ fontSize:28, fontWeight:900, color:"#2e7d32" }}>{teacher.name?.[0]?.toUpperCase() ?? "T"}</span>
//               )}
//             </div>
//           </div>
//           {/* Info */}
//           <div style={{ padding:"0 14px 6px", fontSize:9.5 }}>
//             {[
//               ["Name",        teacher.name ?? "—"],
//               ["D.O.B",       teacher.dateOfBirth ?? "—"],
//               ["Mob.",        teacher.phone ?? "—"],
//               ["Designation", teacher.designation ?? "—", true],
//               ["W/O",         teacher.wifeOrHusbandOf ?? "—"],
//             ].map(([label, value, green]) => (
//               <div key={String(label)} style={{ display:"flex", gap:4, marginBottom:4, alignItems:"flex-start" }}>
//                 <span style={{ fontWeight:700, color:"#333", width:60, flexShrink:0 }}>{label}</span>
//                 <span style={{ color: green ? "#2e7d32" : "#555", fontWeight: green ? 900 : 600 }}>: &nbsp;{value}</span>
//               </div>
//             ))}
//           </div>
//           {/* Auth sign */}
//           <div style={{ padding:"4px 14px", display:"flex", justifyContent:"flex-end" }}>
//             <div style={{ textAlign:"center" }}>
//               <div style={{ borderBottom:"1px solid #aaa", width:60, marginBottom:2 }} />
//               <div style={{ fontSize:7.5, color:"#777" }}>Auth. Sign.</div>
//             </div>
//           </div>
//           {/* Wave bottom */}
//           <svg viewBox="0 0 260 22" style={{ display:"block", width:"100%", marginTop:2 }}>
//             <path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/>
//             <path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/>
//           </svg>
//         </div>
//       </div>

//       {/* BACK */}
//       <div className="w-[260px] flex-shrink-0">
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
//         <div style={{ width:260, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
//           <svg viewBox="0 0 260 28" style={{ display:"block", width:"100%" }}>
//             <path d="M0,0 L260,0 L260,16 Q195,28 130,20 Q65,12 0,24 Z" fill="#1b5e20" opacity="0.6"/>
//             <path d="M0,0 L260,0 L260,10 Q195,22 130,14 Q65,6 0,18 Z" fill="#2e7d32"/>
//           </svg>
//           <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 14px 8px", textAlign:"center" }}>
//             {logoUrl ? (
//               <img src={logoUrl} alt="logo" style={{ width:48, height:48, borderRadius:8, objectFit:"contain", marginBottom:6 }} />
//             ) : (
//               <div style={{ width:48, height:48, background:"linear-gradient(135deg,#2e7d32,#1b5e20)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6, fontSize:20, fontWeight:900, color:"#fff" }}>A</div>
//             )}
//             <div style={{ fontWeight:900, fontSize:14, color:"#1a1a2e", lineHeight:1.2 }}>{SCHOOL_NAME}</div>
//             <div style={{ fontSize:8.5, color:"#666", marginTop:2 }}>{SCHOOL_TAGLINE}</div>
//           </div>
//           <div style={{ height:1, background:"#f0eef8", margin:"0 14px" }} />
//           <div style={{ padding:"8px 14px", textAlign:"center", fontSize:8.5, color:"#444", lineHeight:1.6 }}>
//             <div>{SCHOOL_ADDRESS}</div>
//             <div>{SCHOOL_WEBSITE}</div>
//             <div>Mob.: {SCHOOL_PHONE}</div>
//           </div>
//           <div style={{ height:1, background:"#f0eef8", margin:"0 14px" }} />
//           <div style={{ padding:"8px 14px", textAlign:"center" }}>
//             <div style={{ fontWeight:900, fontSize:10, color:"#2e7d32", marginBottom:4 }}>Finder may please<br />return to</div>
//             <div style={{ fontSize:8.5, color:"#444", lineHeight:1.6 }}>
//               Ascento Playschool, Indore, MP<br />Mob.: {teacher.phone ?? "—"}
//             </div>
//           </div>
//           <div style={{ display:"flex", justifyContent:"center", padding:"4px 14px 6px" }}>
//             <div style={{ background:"#4ecdc422", border:"1px solid #4ecdc444", borderRadius:20, padding:"2px 10px", display:"flex", alignItems:"center", gap:4 }}>
//               <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ecdc4" }} />
//               <span style={{ fontSize:8, fontWeight:900, color:"#4ecdc4" }}>{teacher.status ?? "Active"}</span>
//             </div>
//           </div>
//           <svg viewBox="0 0 260 22" style={{ display:"block", width:"100%", marginTop:4 }}>
//             <path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/>
//             <path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Teacher Report Preview ─────────────────────────────────────────────────────
// function TeacherReport({ report }: { report: any }) {
//   const fields: [string, string][] = [
//     ["Teacher ID",   report.teacherId ?? report.id ?? "—"],
//     ["Full Name",    report.name],
//     ["Email",        report.email ?? "—"],
//     ["Phone",        report.phone ?? "—"],
//     ["Designation",  report.designation ?? "—"],
//     ["W/O",          report.wifeOrHusbandOf ?? "—"],
//     ["Experience",   report.experience ?? "—"],
//     ["Subjects",     (report.subjects ?? []).join(", ") || "—"],
//     ["Status",       report.status ?? "Active"],
//     ["Joined At",    report.joinedAt ? new Date(report.joinedAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—"],
//   ];
//   return (
//     <div className="space-y-4">
//       <div className="bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] rounded-2xl p-5 text-white">
//         <div className="flex gap-4 items-start">
//           <div className="flex-1">
//             <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME} · Faculty</p>
//             <p className="text-2xl font-black">{report.name}</p>
//             <p className="font-mono text-white/75 text-sm mt-0.5">{report.teacherId ?? report.id}</p>
//             {report.designation && (
//               <span className="mt-2 inline-block bg-white/20 border border-white/30 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
//                 {report.designation}
//               </span>
//             )}
//           </div>
//           {report.photoUrl && (
//             <img src={report.photoUrl} alt={report.name}
//               className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />
//           )}
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {fields.map(([label, value]) => (
//           <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
//             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
//             <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Actions Dropdown ───────────────────────────────────────────────────────────
// function ActionsMenu({ teacher, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);
//   const items = [
//     { icon: Edit,     label: "Edit",             color: "#43a047", action: onEdit },
//     { icon: KeyRound, label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
//     { icon: IdCard,   label: "View ID Card",      color: "#2e7d32", action: onViewIdCard },
//     { icon: Eye,      label: "View Report",       color: "#64B6FF", action: onViewReport },
//     { icon: Download, label: "Download Report",   color: "#6BCB77", action: onDownloadReport },
//     { icon: Trash2,   label: "Delete",            color: "#FF6B6B", action: onDelete },
//   ];
//   return (
//     <div ref={ref} className="relative">
//       <button onClick={() => setOpen(!open)}
//         className="p-2 text-gray-400 hover:text-[#2e7d32] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#2e7d32]/30 transition-all shadow-sm">
//         <MoreHorizontal size={15} />
//       </button>
//       {open && (
//         <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[190px]">
//           {items.map(({ icon: Icon, label, color, action }) => (
//             <button key={label} onClick={() => { action(); setOpen(false); }}
//               className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
//               <Icon size={14} style={{ color }} />
//               <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Avatar gradients ───────────────────────────────────────────────────────────
// const GRADIENTS = [
//   "linear-gradient(135deg,#2e7d32,#43a047)",
//   "linear-gradient(135deg,#1b5e20,#2e7d32)",
//   "linear-gradient(135deg,#43a047,#66bb6a)",
//   "linear-gradient(135deg,#388e3c,#4caf50)",
// ];

// // ── Main ───────────────────────────────────────────────────────────────────────
// export default function TeachersView() {
//   const [teachersData,   setTeachersData]   = useState<any[]>([]);
//   const [loading,        setLoading]        = useState(true);
//   const [searchQuery,    setSearchQuery]    = useState("");
//   const [submitting,     setSubmitting]     = useState(false);
//   const [reportLoading,  setReportLoading]  = useState(false);
//   const [toast,          setToast]          = useState<string | null>(null);

//   const [isFormModalOpen,        setIsFormModalOpen]        = useState(false);
//   const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
//   const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
//   const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
//   const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

//   const [editingTeacher,  setEditingTeacher]  = useState<any>(null);
//   const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
//   const [idCardTeacher,   setIdCardTeacher]   = useState<any>(null);
//   const [reportData,      setReportData]      = useState<any>(null);
//   const [credentials,     setCredentials]     = useState<{ name: string; email: string; password: string } | null>(null);
//   const [teacherForm,     setTeacherForm]     = useState<any>({});
//   const [photoFile,       setPhotoFile]       = useState<File | null>(null);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

//   const fetchTeachers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await apiFetch("/api/admin/teachers");
//       setTeachersData(res ?? []);
//     } catch { showToast("Failed to load teachers"); }
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

//   const handleOpenModal = (teacher?: any) => {
//     if (teacher) {
//       setEditingTeacher(teacher);
//       setTeacherForm({
//         name:            teacher.name,
//         email:           teacher.user?.email ?? "",
//         phone:           teacher.phone           ?? "",
//         experience:      teacher.experience       ?? "",
//         designation:     teacher.designation      ?? "",
//         wifeOrHusbandOf: teacher.wifeOrHusbandOf  ?? "",
//         subjects:        teacher.subjects?.map((s: any) => s.subject?.name ?? s.name).join(", ") ?? "",
//         photoUrl:        teacher.photoUrl          ?? "",
//       });
//     } else {
//       setEditingTeacher(null);
//       setTeacherForm({ name:"", email:"", phone:"", experience:"", designation:"", wifeOrHusbandOf:"", subjects:"", photoUrl:"" });
//     }
//     setPhotoFile(null);
//     setIsFormModalOpen(true);
//   };

//   const handleSaveTeacher = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!teacherForm.name || !teacherForm.email) { showToast("Name and email are required"); return; }
//     setSubmitting(true);
//     try {
//       let photoUrl = teacherForm.photoUrl || null;
//       if (photoFile) {
//         try { photoUrl = await uploadTeacherPhoto(photoFile, teacherForm.email); }
//         catch (err: any) { showToast(`Photo upload failed: ${err.message}`); setSubmitting(false); return; }
//       }
//       const isEdit   = !!editingTeacher;
//       const endpoint = isEdit ? `/api/admin/teachers/${editingTeacher.id}` : "/api/admin/teachers";
//       const method   = isEdit ? "PATCH" : "POST";

//       const res = await apiFetch(endpoint, {
//         method,
//         body: JSON.stringify({
//           name:            teacherForm.name,
//           email:           teacherForm.email,
//           phone:           teacherForm.phone,
//           experience:      teacherForm.experience,
//           designation:     teacherForm.designation,
//           wifeOrHusbandOf: teacherForm.wifeOrHusbandOf,
//           subjects:        teacherForm.subjects,
//           photoUrl,
//         }),
//       });

//       if (!isEdit && res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
//       showToast(isEdit ? "Teacher updated! ✨" : "Teacher registered! 🧑‍🏫");
//       setTeacherForm({}); setPhotoFile(null); setIsFormModalOpen(false);
//       fetchTeachers();
//     } catch (err: any) {
//       let msg = err.message || "Failed to save teacher";
//       try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
//       showToast(msg);
//     }
//     setSubmitting(false);
//   };

//   const handleGeneratePassword = async (teacher: any) => {
//     try {
//       const res = await apiFetch(`/api/admin/teachers/${teacher.id}/generate-password`, { method: "POST" });
//       setCredentials(res); setIsCredentialsModalOpen(true);
//     } catch { showToast("Failed to generate password"); }
//   };

//   const fetchReport = async (teacher: any, download = false) => {
//     setReportLoading(true);
//     try {
//       const res = await apiFetch(`/api/admin/teachers/${teacher.id}/report`);
//       if (download) {
//         const html = await buildTeacherReportHTML(res.report);
//         openPrintWindow(html);
//       } else {
//         setReportData(res.report);
//         setIsReportModalOpen(true);
//       }
//     } catch { showToast("Failed to load report"); }
//     setReportLoading(false);
//   };

//   const handleDelete = async () => {
//     if (!teacherToDelete) return;
//     setSubmitting(true);
//     try {
//       await apiFetch(`/api/admin/teachers/${teacherToDelete.id}`, { method: "DELETE" });
//       showToast("Teacher removed successfully");
//       setIsDeleteModalOpen(false); setTeacherToDelete(null);
//       fetchTeachers();
//     } catch { showToast("Failed to remove teacher"); }
//     setSubmitting(false);
//   };

//   const filteredTeachers = useMemo(() =>
//     teachersData.filter((t) => {
//       const q = searchQuery.toLowerCase();
//       return (
//         t.name?.toLowerCase().includes(q) ||
//         (t.user?.email ?? "").toLowerCase().includes(q) ||
//         (t.designation ?? "").toLowerCase().includes(q) ||
//         t.subjects?.some((s: any) => (s.subject?.name ?? s.name ?? "").toLowerCase().includes(q))
//       );
//     }),
//     [teachersData, searchQuery]
//   );

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 relative">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Teachers Directory</h2>
//           <p className="text-sm text-gray-500 mt-1 font-medium">{teachersData.length} faculty members</p>
//         </div>
//         <GradientButton icon={Plus} onClick={() => handleOpenModal()}>Add Teacher</GradientButton>
//       </div>

//       {/* Search */}
//       <Card className="p-5 bg-[#FFFDF7]">
//         <div className="relative max-w-md">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input type="text" placeholder="Search by name, email, designation…" value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#43a047] focus:ring-4 focus:ring-[#43a047]/10 transition-all shadow-sm" />
//         </div>
//       </Card>

//       {/* Grid */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-64 text-[#2e7d32]">
//           <Loader2 className="animate-spin mb-4" size={32} />
//           <p className="text-sm font-bold text-gray-500">Loading faculty data…</p>
//         </div>
//       ) : filteredTeachers.length === 0 ? (
//         <Card className="flex flex-col items-center justify-center py-20 text-center">
//           <Search size={24} className="text-gray-300 mb-3" />
//           <p className="text-base font-bold text-[#1A1A2E]">No teachers found</p>
//           <p className="text-sm mt-1 text-gray-500">Try adjusting your search or add a new faculty member.</p>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredTeachers.map((t: any, i: number) => {
//             const email    = t.user?.email ?? "No email";
//             const subjects = t.subjects ?? [];
//             return (
//               <Card key={t.id} className="p-6 flex flex-col group hover:border-[#2e7d32]/30 hover:shadow-[0_8px_30px_rgba(46,125,50,0.1)] transition-all">
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F0EEF8] flex-shrink-0">
//                     {t.photoUrl ? (
//                       <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <div style={{ background: GRADIENTS[i % GRADIENTS.length] }} className="w-full h-full flex items-center justify-center text-white text-xl font-black">
//                         {t.name?.[0]?.toUpperCase() ?? "T"}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-black text-[#1A1A2E] truncate group-hover:text-[#2e7d32] transition-colors">{t.name}</h3>
//                     {t.designation && <p className="text-xs font-black text-[#2e7d32] mt-0.5">{t.designation}</p>}
//                     <p className="text-xs text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
//                       <Mail size={11} className="opacity-70 flex-shrink-0" /> {email}
//                     </p>
//                   </div>
//                   <ActionsMenu
//                     teacher={t}
//                     onEdit={() => handleOpenModal(t)}
//                     onDelete={() => { setTeacherToDelete(t); setIsDeleteModalOpen(true); }}
//                     onGeneratePassword={() => handleGeneratePassword(t)}
//                     onViewReport={() => fetchReport(t, false)}
//                     onDownloadReport={() => fetchReport(t, true)}
//                     onViewIdCard={() => { setIdCardTeacher(t); setIsIdCardModalOpen(true); }}
//                   />
//                 </div>
//                 <div className="space-y-2 mb-4 flex-1">
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0"><Phone size={12} /></div>
//                     <span className="font-medium">{t.phone || "—"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0"><Briefcase size={12} /></div>
//                     <span className="font-medium">{t.experience ? `${t.experience} experience` : "—"}</span>
//                   </div>
//                   {t.wifeOrHusbandOf && (
//                     <div className="flex items-center gap-3 text-sm text-gray-600">
//                       <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0 text-[10px] font-black">W/O</div>
//                       <span className="font-medium">{t.wifeOrHusbandOf}</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="pt-3 border-t border-[#F0EEF8]">
//                   <div className="flex items-center gap-2 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest"><BookOpen size={12} /> Subjects</div>
//                   <div className="flex flex-wrap gap-2">
//                     {subjects.length > 0 ? subjects.map((s: any, idx: number) => (
//                       <Badge key={idx} text={s.subject?.name ?? s.name} color="#2e7d32" />
//                     )) : (
//                       <span className="text-xs text-gray-400 italic">No subjects assigned</span>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* ADD / EDIT Modal */}
//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}
//         title={editingTeacher ? "Edit Teacher Profile" : "Register New Teacher"} wide>
//         <form onSubmit={handleSaveTeacher} className="space-y-6">
//           <div className="flex gap-5 items-start">
//             <PhotoUpload
//               value={teacherForm.photoUrl}
//               onChange={(url, file) => { setPhotoFile(file); setTeacherForm((p: any) => ({ ...p, photoUrl: url })); }}
//             />
//             <div className="flex-1 space-y-4">
//               <h4 className="text-xs font-black text-[#2e7d32] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Personal Information</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormInput label="Full Name"    placeholder="Mrs. Bhavna Tomar"   required value={teacherForm.name}        onChange={(v: string) => setTeacherForm((p:any)=>({...p,name:v}))} />
//                 <FormInput label="Email"        placeholder="teacher@ascento.edu" required value={teacherForm.email}       onChange={(v: string) => setTeacherForm((p:any)=>({...p,email:v}))} type="email" disabled={!!editingTeacher} />
//                 <FormInput label="Phone"        placeholder="+91 98111 XXXXX"              value={teacherForm.phone}       onChange={(v: string) => setTeacherForm((p:any)=>({...p,phone:v}))} />
//                 <FormInput label="Experience"   placeholder="e.g. 8 years"                value={teacherForm.experience}  onChange={(v: string) => setTeacherForm((p:any)=>({...p,experience:v}))} />
//                 <FormInput label="Designation"  placeholder="e.g. Principal, Teacher"     value={teacherForm.designation} onChange={(v: string) => setTeacherForm((p:any)=>({...p,designation:v}))} />
//                 <FormInput label="W/O (Wife / Husband Of)" placeholder="Spouse name"      value={teacherForm.wifeOrHusbandOf} onChange={(v: string) => setTeacherForm((p:any)=>({...p,wifeOrHusbandOf:v}))} />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h4 className="text-xs font-black text-[#43a047] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Profile</h4>
//             <FormInput label="Subjects (comma separated)" placeholder="Mathematics, Abacus Level 1, Mental Math"
//               value={teacherForm.subjects} onChange={(v: string) => setTeacherForm((p:any)=>({...p,subjects:v}))} />
//           </div>
//           {!editingTeacher && (
//             <div className="flex items-start gap-3 bg-[#2e7d32]/5 border border-[#2e7d32]/20 rounded-xl px-4 py-3">
//               <KeyRound size={15} className="text-[#2e7d32] mt-0.5 flex-shrink-0" />
//               <p className="text-xs text-gray-500 leading-relaxed">
//                 A secure login password will be <span className="font-black text-[#1A1A2E]">auto-generated</span> and shown once after registration.
//               </p>
//             </div>
//           )}
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
//             <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
//             <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : (editingTeacher ? Edit : Plus)}>
//               {submitting ? "Saving…" : editingTeacher ? "Update Teacher" : "Register Teacher"}
//             </GradientButton>
//           </div>
//         </form>
//       </Modal>

//       {/* ID Card Modal */}
//       <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Teacher ID Card" wide>
//         {idCardTeacher && (
//           <div className="space-y-5">
//             <TeacherIDCard teacher={idCardTeacher} logoUrl={LOGO_URL} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={() => buildTeacherIDCardHTML(idCardTeacher, LOGO_URL).then(openPrintWindow)}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Print / Save PDF
//               </button>
//               <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Report Modal */}
//       <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Teacher Report" wide>
//         {reportLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#2e7d32]" size={32} /></div>
//         ) : reportData && (
//           <div className="space-y-4">
//             <TeacherReport report={reportData} />
//             <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
//               <button onClick={async () => { const html = await buildTeacherReportHTML(reportData); openPrintWindow(html); }}
//                 className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
//                 <Download size={16} /> Download PDF
//               </button>
//               <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Credentials Modal */}
//       <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Teacher Login Credentials">
//         <div className="space-y-5">
//           <p className="text-sm text-gray-500">The password is shown <span className="font-black text-[#FF6B6B]">only once</span>. Share it now.</p>
//           {credentials && (
//             <div className="space-y-3">
//               <CredentialRow label="Name"               value={credentials.name} />
//               <CredentialRow label="Login Email"        value={credentials.email} />
//               <CredentialRow label="Temporary Password" value={credentials.password} mono />
//             </div>
//           )}
//           <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
//             <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
//             <p className="text-xs font-medium text-amber-700">Share these credentials securely. Ask the teacher to change their password after first login.</p>
//           </div>
//           <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
//             <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete Modal */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Removal">
//         <div className="flex flex-col items-center text-center space-y-4 py-4">
//           <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
//           <div>
//             <h4 className="text-lg font-black text-[#1A1A2E]">Remove {teacherToDelete?.name}?</h4>
//             <p className="text-sm text-gray-500 mt-2">This will permanently delete their account and all records.</p>
//           </div>
//           <div className="w-full flex gap-3 pt-4">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
//             <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
//               {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Remove"}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {toast && (
//         <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#2e7d32] to-[#43a047] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(46,125,50,0.4)] z-[999] animate-in slide-in-from-bottom-5">
//           {toast}
//         </div>
//       )}
//     </div>
//   );
// }










'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle, Loader2,
  Edit, Mail, Phone, Briefcase, BookOpen, KeyRound,
  Copy, Check, AlertTriangle, Download, Eye, IdCard,
  Camera, Upload, MoreHorizontal,
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

// ── Constants ──────────────────────────────────────────────────────────────────
const SCHOOL_NAME    = "Ascento Playschool";
const SCHOOL_TAGLINE = "Play School";
const SCHOOL_WEBSITE = "www.ascentoplayschool.com";
const SCHOOL_PHONE   = "+91 98765 43210";
const SCHOOL_ADDRESS = "Ascento Playschool, Indore, MP";
const LOGO_URL       = "/Acento-Logo.jpg";

// ── API helper ─────────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Upload photo ───────────────────────────────────────────────────────────────
async function uploadTeacherPhoto(file: File, email: string): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("Not authenticated");
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `teacher-photos/${email.replace(/[@.]/g, "_")}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("student-assets")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("student-assets").getPublicUrl(path);
  return data.publicUrl;
}

// ── PDF helpers ────────────────────────────────────────────────────────────────
function openPrintWindow(htmlContent: string) {
  const win = window.open("", "_blank", "width=1000,height=700");
  if (!win) { alert("Please allow popups to download the PDF."); return; }
  win.document.write(htmlContent);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

async function urlToBase64(url: string): Promise<string> {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch { return ""; }
}

// ── Format date helper ─────────────────────────────────────────────────────────
function formatDate(val: string | Date | null | undefined): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return "—"; }
}

// ── ID Card HTML (green theme, portrait — identical sizing to student card) ────
async function buildTeacherIDCardHTML(teacher: any, logoUrl?: string): Promise<string> {
  let photoSrc = "";
  if (teacher.photoUrl) {
    const b64 = await urlToBase64(teacher.photoUrl);
    if (b64) photoSrc = b64;
  }
  let logoSrc = "";
  if (logoUrl) {
    const b64 = await urlToBase64(logoUrl);
    if (b64) logoSrc = b64;
  }

  const logoImgFront = logoSrc
    ? `<img src="${logoSrc}" class="logo-img" />`
    : `<div class="logo-av">A</div>`;
  const logoImgBack = logoSrc
    ? `<img src="${logoSrc}" class="logo-back" />`
    : `<div class="logo-av-back">A</div>`;
  const photoHtml = photoSrc
    ? `<img src="${photoSrc}" class="photo" />`
    : `<div class="photo-av">${(teacher.name?.[0] ?? "T").toUpperCase()}</div>`;

  const dob     = formatDate(teacher.dateOfBirth);
  const addrLine = "Ascento Playschool, Indore, Madhya Pradesh";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ID Card — ${teacher.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 portrait; margin: 15mm; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #f5f5f5;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    padding: 20px;
  }
  .card {
    width: 260px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .header {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    padding: 10px 12px 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo-img  { width:36px; height:36px; border-radius:6px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0; }
  .logo-av   { width:36px; height:36px; border-radius:6px; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:900; color:#fff; flex-shrink:0; }
  .header-text .school { color:#fff; font-weight:900; font-size:13px; line-height:1.2; }
  .header-text .tag    { color:rgba(255,255,255,0.8); font-size:8px; }
  .header-text .tid    { color:rgba(255,255,255,0.7); font-size:7.5px; margin-top:2px; }
  .wave-top svg { display:block; width:100%; }
  .photo-wrap { display:flex; flex-direction:column; align-items:center; padding:6px 12px 10px; }
  .photo    { width:80px; height:90px; border-radius:50%; object-fit:cover; border:3px solid #2e7d32; }
  .photo-av { width:80px; height:90px; border-radius:50%; background:#e8f5e9; border:3px solid #2e7d32; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:#2e7d32; }
  .info { padding: 0 14px 6px; font-size:9.5px; }
  .row  { display:flex; gap:4px; margin-bottom:4px; align-items:flex-start; }
  .lbl  { font-weight:700; color:#333; width:60px; flex-shrink:0; }
  .val  { color:#555; font-weight:600; }
  .desig { color:#2e7d32 !important; font-weight:900 !important; }
  .sign       { padding:4px 14px; display:flex; justify-content:flex-end; }
  .sign-inner { text-align:center; }
  .sign-line  { border-bottom:1px solid #aaa; width:60px; margin-bottom:2px; }
  .sign-label { font-size:7.5px; color:#777; }
  .wave-bot svg { display:block; width:100%; margin-top:2px; }
  .wave-top-back svg { display:block; width:100%; }
  .back-logo  { display:flex; flex-direction:column; align-items:center; padding:10px 14px 8px; text-align:center; }
  .logo-back  { width:48px; height:48px; border-radius:8px; object-fit:contain; margin-bottom:6px; }
  .logo-av-back { width:48px; height:48px; border-radius:8px; background:linear-gradient(135deg,#2e7d32,#1b5e20); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:#fff; margin-bottom:6px; }
  .back-school { font-weight:900; font-size:14px; color:#1a1a2e; line-height:1.2; }
  .back-tag    { font-size:8.5px; color:#666; margin-top:2px; }
  .divider { height:1px; background:#f0eef8; margin:0 14px; }
  .back-addr   { padding:8px 14px; text-align:center; font-size:8.5px; color:#444; line-height:1.6; }
  .finder      { padding:8px 14px; text-align:center; }
  .finder-title { font-weight:900; font-size:10px; color:#2e7d32; margin-bottom:4px; line-height:1.3; }
  .finder-addr  { font-size:8.5px; color:#444; line-height:1.6; }
  .status-chip { display:flex; justify-content:center; padding:4px 0; }
  .chip        { background:#4ecdc422; border:1px solid #4ecdc444; border-radius:20px; padding:2px 10px; display:flex; align-items:center; gap:4px; }
  .dot         { width:5px; height:5px; border-radius:50%; background:#4ecdc4; }
  .chip-txt    { font-size:8px; font-weight:900; color:#4ecdc4; }
  .card-label  { text-align:center; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:8px; }
  .card-wrapper { display:flex; flex-direction:column; align-items:center; }
  @media print {
    body { background:#fff; gap:20px; padding:0; }
    * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  }
</style>
</head>
<body>
<!-- FRONT -->
<div class="card-wrapper">
  <div class="card-label">Front</div>
  <div class="card">
    <div class="header">
      ${logoImgFront}
      <div class="header-text">
        <div class="school">${SCHOOL_NAME}</div>
        <div class="tag">${SCHOOL_TAGLINE}</div>
        <div class="tid">ID: ${teacher.id?.slice(0,8).toUpperCase() ?? "—"}</div>
      </div>
    </div>
    <div class="wave-top">
      <svg viewBox="0 0 260 18"><path d="M0,18 Q65,0 130,10 Q195,20 260,4 L260,0 L0,0 Z" fill="#2e7d32" opacity="0.15"/></svg>
    </div>
    <div class="photo-wrap">${photoHtml}</div>
    <div class="info">
      <div class="row"><span class="lbl">Name</span><span class="val">: &nbsp;${teacher.name ?? "—"}</span></div>
      <div class="row"><span class="lbl">D.O.B</span><span class="val">: &nbsp;${dob}</span></div>
      <div class="row"><span class="lbl">Mob.</span><span class="val">: &nbsp;${teacher.phone ?? "—"}</span></div>
      <div class="row"><span class="lbl">Designation</span><span class="val desig">: &nbsp;${teacher.designation ?? "—"}</span></div>
      <div class="row"><span class="lbl">W/O</span><span class="val">: &nbsp;${teacher.wifeOrHusbandOf ?? "—"}</span></div>
    </div>
    <div class="sign"><div class="sign-inner"><div class="sign-line"></div><div class="sign-label">Auth. Sign.</div></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 260 22"><path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/><path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/></svg>
    </div>
  </div>
</div>
<!-- BACK -->
<div class="card-wrapper">
  <div class="card-label">Back</div>
  <div class="card">
    <div class="wave-top-back">
      <svg viewBox="0 0 260 28"><path d="M0,0 L260,0 L260,16 Q195,28 130,20 Q65,12 0,24 Z" fill="#1b5e20" opacity="0.6"/><path d="M0,0 L260,0 L260,10 Q195,22 130,14 Q65,6 0,18 Z" fill="#2e7d32"/></svg>
    </div>
    <div class="back-logo">
      ${logoImgBack}
      <div class="back-school">${SCHOOL_NAME}</div>
      <div class="back-tag">${SCHOOL_TAGLINE}</div>
    </div>
    <div class="divider"></div>
    <div class="back-addr">${SCHOOL_ADDRESS}<br/>${SCHOOL_WEBSITE}<br/>Mob.: ${SCHOOL_PHONE}</div>
    <div class="divider"></div>
    <div class="finder">
      <div class="finder-title">Finder may please<br/>return to</div>
      <div class="finder-addr">${addrLine}<br/>Mob.: ${teacher.phone ?? "—"}</div>
    </div>
    <div class="status-chip"><div class="chip"><div class="dot"></div><span class="chip-txt">${teacher.status ?? "Active"}</span></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 260 22"><path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/><path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/></svg>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Report HTML ────────────────────────────────────────────────────────────────
async function buildTeacherReportHTML(r: any): Promise<string> {
  const generated = new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });
  const joined    = r.joinedAt ? new Date(r.joinedAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—";

  const fields: [string, string][] = [
    ["Teacher ID",    r.teacherId ?? r.id ?? "—"],
    ["Full Name",     r.name],
    ["Email",         r.email ?? "—"],
    ["Phone",         r.phone ?? "—"],
    ["Date of Birth", formatDate(r.dateOfBirth)],
    ["Designation",   r.designation ?? "—"],
    ["W/O",           r.wifeOrHusbandOf ?? "—"],
    ["Experience",    r.experience ?? "—"],
    ["Subjects",      (r.subjects ?? []).join(", ") || "—"],
    ["Status",        r.status ?? "Active"],
    ["Joined At",     joined],
  ];

  let photoHtml = "";
  if (r.photoUrl) {
    const b64 = await urlToBase64(r.photoUrl);
    if (b64) photoHtml = `<img src="${b64}" alt="Photo" class="report-photo" />`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Teacher Report — ${r.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; color:#1A1A2E; padding:20px; }
  .hdr { background:linear-gradient(135deg,#2e7d32,#1b5e20); border-radius:12px; padding:20px 24px; color:#fff; margin-bottom:18px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
  .hdr-left { flex:1; }
  .school    { font-size:9px; font-weight:900; letter-spacing:2px; text-transform:uppercase; opacity:.8; margin-bottom:4px; }
  h1         { font-size:22px; font-weight:900; line-height:1.2; }
  .tid       { font-family:monospace; font-size:11px; opacity:.7; margin-top:3px; }
  .badge     { background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); padding:2px 10px; border-radius:20px; font-size:9px; font-weight:900; letter-spacing:1px; text-transform:uppercase; display:inline-block; margin-top:8px; }
  .report-photo { width:60px; height:72px; border-radius:8px; object-fit:cover; border:2px solid rgba(255,255,255,0.4); flex-shrink:0; }
  .hdr-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
  .date      { font-size:9px; opacity:.65; }
  .grid      { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .cell      { background:#fff; border:1px solid #F0EEF8; border-radius:8px; padding:10px 14px; }
  .lbl       { font-size:7px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:2px; }
  .val       { font-size:12px; font-weight:700; word-break:break-word; }
  .footer    { margin-top:18px; text-align:center; font-size:8px; color:#ccc; }
  @page { margin:12mm; }
  @media print {
    body { background:#fff; padding:0; }
    * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  }
</style>
</head>
<body>
<div class="hdr">
  <div class="hdr-left">
    <div class="school">${SCHOOL_NAME} · Faculty</div>
    <h1>${r.name}</h1>
    <div class="tid">${r.teacherId ?? r.id ?? ""}</div>
    ${r.designation ? `<span class="badge">${r.designation}</span>` : ""}
  </div>
  <div class="hdr-right">
    ${photoHtml}
    <div class="date">Generated: ${generated}</div>
  </div>
</div>
<div class="grid">
  ${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}
</div>
<div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Teacher Report</div>
</body>
</html>`;
}

// ── UI Primitives ──────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
    {children}
  </div>
);

// NOTE: GradientButton uses green only for the teachers page — matches the green theme
const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#2e7d32] to-[#43a047] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(46,125,50,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
);

const Badge = ({ text, color = "#2e7d32" }: { text: string; color?: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap inline-block">
    {text}
  </span>
);

const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} flex flex-col`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: 'thin' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange, disabled = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input
      type={type} placeholder={placeholder} value={value ?? ""} disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#43a047] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

function CredentialRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-bold text-[#1A1A2E] truncate ${mono ? "font-mono tracking-wide" : ""}`}>{value}</p>
      </div>
      <button
        onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#43a047] border-[#43a047]/40 bg-[#43a047]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#43a047]"}`}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

// ── Photo Upload ───────────────────────────────────────────────────────────────
function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Show existing saved URL as preview (not "pending")
  const [preview, setPreview] = useState<string | null>(
    value && value !== "pending" ? value : null
  );

  // Sync preview when value changes from outside (e.g. opening edit modal)
  useEffect(() => {
    if (value && value !== "pending") setPreview(value);
  }, [value]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onChange("pending", file);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Passport Photo</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#43a047] hover:bg-[#f1f8e9] transition-all group overflow-hidden"
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <Camera size={20} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload size={20} className="text-gray-300 group-hover:text-[#43a047] transition-colors mb-1.5" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#43a047] text-center px-2 leading-tight">Upload<br />Photo</span>
            <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
          </>
        )}
      </div>
      <input
        ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── Teacher ID Card Preview (React) ───────────────────────────────────────────
// Identical card dimensions to the student IDCard component
function TeacherIDCard({ teacher, logoUrl }: { teacher: any; logoUrl?: string }) {
  const dob = formatDate(teacher.dateOfBirth);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
      {/* ── FRONT ── */}
      <div className="w-[260px] flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
        <div style={{ width:260, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
          {/* Header — green */}
          <div style={{ background:"linear-gradient(135deg,#2e7d32,#1b5e20)", padding:"10px 12px 8px", display:"flex", alignItems:"center", gap:8 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width:36, height:36, borderRadius:6, objectFit:"contain", background:"#fff", padding:2, flexShrink:0 }} />
            ) : (
              <div style={{ width:36, height:36, background:"rgba(255,255,255,0.25)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, fontWeight:900, color:"#fff" }}>A</div>
            )}
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:13, lineHeight:1.2 }}>{SCHOOL_NAME}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:8 }}>{SCHOOL_TAGLINE}</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:7.5, marginTop:2 }}>ID: {teacher.id?.slice(0,8).toUpperCase() ?? "—"}</div>
            </div>
          </div>
          {/* Wave */}
          <svg viewBox="0 0 260 18" style={{ display:"block", width:"100%" }}>
            <path d="M0,18 Q65,0 130,10 Q195,20 260,4 L260,0 L0,0 Z" fill="#2e7d32" opacity="0.15"/>
          </svg>
          {/* Photo — same dimensions as student card */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"6px 12px 10px" }}>
            <div style={{ width:80, height:90, borderRadius:"50%", overflow:"hidden", border:"3px solid #2e7d32", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {teacher.photoUrl ? (
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span style={{ fontSize:28, fontWeight:900, color:"#2e7d32" }}>{teacher.name?.[0]?.toUpperCase() ?? "T"}</span>
              )}
            </div>
          </div>
          {/* Info rows — same structure as student card */}
          <div style={{ padding:"0 14px 6px", fontSize:9.5 }}>
            {([
              ["Name",        teacher.name ?? "—",        false],
              ["D.O.B",       dob,                        false],
              ["Mob.",        teacher.phone ?? "—",       false],
              ["Designation", teacher.designation ?? "—", true ],
              ["W/O",         teacher.wifeOrHusbandOf ?? "—", false],
            ] as [string, string, boolean][]).map(([label, value, highlight]) => (
              <div key={label} style={{ display:"flex", gap:4, marginBottom:4, alignItems:"flex-start" }}>
                <span style={{ fontWeight:700, color:"#333", width:60, flexShrink:0 }}>{label}</span>
                <span style={{ color: highlight ? "#2e7d32" : "#555", fontWeight: highlight ? 900 : 600 }}>
                  : &nbsp;{value}
                </span>
              </div>
            ))}
          </div>
          {/* Auth sign */}
          <div style={{ padding:"4px 14px", display:"flex", justifyContent:"flex-end" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ borderBottom:"1px solid #aaa", width:60, marginBottom:2 }} />
              <div style={{ fontSize:7.5, color:"#777" }}>Auth. Sign.</div>
            </div>
          </div>
          {/* Wave bottom */}
          <svg viewBox="0 0 260 22" style={{ display:"block", width:"100%", marginTop:2 }}>
            <path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/>
            <path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* ── BACK ── */}
      <div className="w-[260px] flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
        <div style={{ width:260, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
          <svg viewBox="0 0 260 28" style={{ display:"block", width:"100%" }}>
            <path d="M0,0 L260,0 L260,16 Q195,28 130,20 Q65,12 0,24 Z" fill="#1b5e20" opacity="0.6"/>
            <path d="M0,0 L260,0 L260,10 Q195,22 130,14 Q65,6 0,18 Z" fill="#2e7d32"/>
          </svg>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 14px 8px", textAlign:"center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width:48, height:48, borderRadius:8, objectFit:"contain", marginBottom:6 }} />
            ) : (
              <div style={{ width:48, height:48, background:"linear-gradient(135deg,#2e7d32,#1b5e20)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6, fontSize:20, fontWeight:900, color:"#fff" }}>A</div>
            )}
            <div style={{ fontWeight:900, fontSize:14, color:"#1a1a2e", lineHeight:1.2 }}>{SCHOOL_NAME}</div>
            <div style={{ fontSize:8.5, color:"#666", marginTop:2 }}>{SCHOOL_TAGLINE}</div>
          </div>
          <div style={{ height:1, background:"#f0eef8", margin:"0 14px" }} />
          <div style={{ padding:"8px 14px", textAlign:"center", fontSize:8.5, color:"#444", lineHeight:1.6 }}>
            <div>{SCHOOL_ADDRESS}</div>
            <div>{SCHOOL_WEBSITE}</div>
            <div>Mob.: {SCHOOL_PHONE}</div>
          </div>
          <div style={{ height:1, background:"#f0eef8", margin:"0 14px" }} />
          <div style={{ padding:"8px 14px", textAlign:"center" }}>
            <div style={{ fontWeight:900, fontSize:10, color:"#2e7d32", marginBottom:4 }}>Finder may please<br />return to</div>
            <div style={{ fontSize:8.5, color:"#444", lineHeight:1.6 }}>
              Ascento Playschool, Indore, MP<br />Mob.: {teacher.phone ?? "—"}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", padding:"4px 14px 6px" }}>
            <div style={{ background:"#4ecdc422", border:"1px solid #4ecdc444", borderRadius:20, padding:"2px 10px", display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ecdc4" }} />
              <span style={{ fontSize:8, fontWeight:900, color:"#4ecdc4" }}>{teacher.status ?? "Active"}</span>
            </div>
          </div>
          <svg viewBox="0 0 260 22" style={{ display:"block", width:"100%", marginTop:4 }}>
            <path d="M0,22 L0,12 Q65,0 130,8 Q195,16 260,6 L260,22 Z" fill="#2e7d32"/>
            <path d="M0,22 L0,16 Q65,4 130,12 Q195,20 260,10 L260,22 Z" fill="#1b5e20" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Teacher Report Preview ─────────────────────────────────────────────────────
function TeacherReport({ report }: { report: any }) {
  const fields: [string, string][] = [
    ["Teacher ID",    report.teacherId ?? report.id ?? "—"],
    ["Full Name",     report.name],
    ["Email",         report.email ?? "—"],
    ["Phone",         report.phone ?? "—"],
    ["Date of Birth", formatDate(report.dateOfBirth)],
    ["Designation",   report.designation ?? "—"],
    ["W/O",           report.wifeOrHusbandOf ?? "—"],
    ["Experience",    report.experience ?? "—"],
    ["Subjects",      (report.subjects ?? []).join(", ") || "—"],
    ["Status",        report.status ?? "Active"],
    ["Joined At",     report.joinedAt ? new Date(report.joinedAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—"],
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] rounded-2xl p-5 text-white">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME} · Faculty</p>
            <p className="text-2xl font-black">{report.name}</p>
            <p className="font-mono text-white/75 text-sm mt-0.5">{report.teacherId ?? report.id}</p>
            {report.designation && (
              <span className="mt-2 inline-block bg-white/20 border border-white/30 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                {report.designation}
              </span>
            )}
          </div>
          {report.photoUrl && (
            <img src={report.photoUrl} alt={report.name}
              className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(([label, value]) => (
          <div key={label} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-[#1A1A2E]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Actions Dropdown ───────────────────────────────────────────────────────────
function ActionsMenu({ teacher, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { icon: Edit,     label: "Edit",             color: "#43a047", action: onEdit },
    { icon: KeyRound, label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
    { icon: IdCard,   label: "View ID Card",      color: "#2e7d32", action: onViewIdCard },
    { icon: Eye,      label: "View Report",       color: "#64B6FF", action: onViewReport },
    { icon: Download, label: "Download Report",   color: "#6BCB77", action: onDownloadReport },
    { icon: Trash2,   label: "Delete",            color: "#FF6B6B", action: onDelete },
  ];
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-400 hover:text-[#2e7d32] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#2e7d32]/30 transition-all shadow-sm"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[190px]">
          {items.map(({ icon: Icon, label, color, action }) => (
            <button key={label} onClick={() => { action(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FFFDF7] transition-colors text-left">
              <Icon size={14} style={{ color }} />
              <span style={{ color: label === "Delete" ? "#FF6B6B" : undefined }}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Avatar gradients ───────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#2e7d32,#43a047)",
  "linear-gradient(135deg,#1b5e20,#2e7d32)",
  "linear-gradient(135deg,#43a047,#66bb6a)",
  "linear-gradient(135deg,#388e3c,#4caf50)",
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function TeachersView() {
  const [teachersData,   setTeachersData]   = useState<any[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [submitting,     setSubmitting]     = useState(false);
  const [reportLoading,  setReportLoading]  = useState(false);
  const [toast,          setToast]          = useState<string | null>(null);

  const [isFormModalOpen,        setIsFormModalOpen]        = useState(false);
  const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
  const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

  const [editingTeacher,  setEditingTeacher]  = useState<any>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  const [idCardTeacher,   setIdCardTeacher]   = useState<any>(null);
  const [reportData,      setReportData]      = useState<any>(null);
  const [credentials,     setCredentials]     = useState<{ name: string; email: string; password: string } | null>(null);
  const [teacherForm,     setTeacherForm]     = useState<any>({});
  const [photoFile,       setPhotoFile]       = useState<File | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/teachers");
      setTeachersData(res ?? []);
    } catch { showToast("Failed to load teachers"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const handleOpenModal = (teacher?: any) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({
        name:            teacher.name,
        email:           teacher.user?.email ?? "",
        phone:           teacher.phone            ?? "",
        experience:      teacher.experience        ?? "",
        designation:     teacher.designation       ?? "",
        wifeOrHusbandOf: teacher.wifeOrHusbandOf   ?? "",
        subjects:        teacher.subjects?.map((s: any) => s.subject?.name ?? s.name).join(", ") ?? "",
        photoUrl:        teacher.photoUrl           ?? "",
        // Format dateOfBirth as YYYY-MM-DD for the date input
        dateOfBirth:     teacher.dateOfBirth
          ? new Date(teacher.dateOfBirth).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({
        name: "", email: "", phone: "", experience: "",
        designation: "", wifeOrHusbandOf: "", subjects: "",
        photoUrl: "", dateOfBirth: "",
      });
    }
    setPhotoFile(null);
    setIsFormModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email) { showToast("Name and email are required"); return; }
    setSubmitting(true);
    try {
      // Upload photo first — get real URL before saving
      let photoUrl = (teacherForm.photoUrl && teacherForm.photoUrl !== "pending")
        ? teacherForm.photoUrl
        : null;

      if (photoFile) {
        try {
          photoUrl = await uploadTeacherPhoto(photoFile, teacherForm.email);
        } catch (err: any) {
          showToast(`Photo upload failed: ${err.message}`);
          setSubmitting(false);
          return;
        }
      }

      const isEdit   = !!editingTeacher;
      const endpoint = isEdit ? `/api/admin/teachers/${editingTeacher.id}` : "/api/admin/teachers";
      const method   = isEdit ? "PATCH" : "POST";

      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify({
          name:            teacherForm.name,
          email:           teacherForm.email,
          phone:           teacherForm.phone        || null,
          experience:      teacherForm.experience   || null,
          designation:     teacherForm.designation  || null,
          wifeOrHusbandOf: teacherForm.wifeOrHusbandOf || null,
          subjects:        teacherForm.subjects,
          photoUrl,
          dateOfBirth:     teacherForm.dateOfBirth  || null,
        }),
      });

      if (!isEdit && res.credentials) {
        setCredentials(res.credentials);
        setIsCredentialsModalOpen(true);
      }
      showToast(isEdit ? "Teacher updated! ✨" : "Teacher registered! 🧑‍🏫");
      setTeacherForm({});
      setPhotoFile(null);
      setIsFormModalOpen(false);

      // Refetch so ID card / report always has latest data including new photoUrl
      await fetchTeachers();
    } catch (err: any) {
      let msg = err.message || "Failed to save teacher";
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg);
    }
    setSubmitting(false);
  };

  const handleGeneratePassword = async (teacher: any) => {
    try {
      const res = await apiFetch(`/api/admin/teachers/${teacher.id}/generate-password`, { method: "POST" });
      setCredentials(res);
      setIsCredentialsModalOpen(true);
    } catch { showToast("Failed to generate password"); }
  };

  const fetchReport = async (teacher: any, download = false) => {
    setReportLoading(true);
    try {
      const res = await apiFetch(`/api/admin/teachers/${teacher.id}/report`);
      if (download) {
        const html = await buildTeacherReportHTML(res.report);
        openPrintWindow(html);
      } else {
        setReportData(res.report);
        setIsReportModalOpen(true);
      }
    } catch { showToast("Failed to load report"); }
    setReportLoading(false);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/teachers/${teacherToDelete.id}`, { method: "DELETE" });
      showToast("Teacher removed successfully");
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
      fetchTeachers();
    } catch { showToast("Failed to remove teacher"); }
    setSubmitting(false);
  };

  // Open ID card using the latest data from teachersData (post-fetch)
  const handleViewIdCard = (teacher: any) => {
    // Find the most up-to-date version from state
    const latest = teachersData.find((t) => t.id === teacher.id) ?? teacher;
    setIdCardTeacher(latest);
    setIsIdCardModalOpen(true);
  };

  const filteredTeachers = useMemo(() =>
    teachersData.filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.name?.toLowerCase().includes(q) ||
        (t.user?.email ?? "").toLowerCase().includes(q) ||
        (t.designation ?? "").toLowerCase().includes(q) ||
        t.subjects?.some((s: any) => (s.subject?.name ?? s.name ?? "").toLowerCase().includes(q))
      );
    }),
    [teachersData, searchQuery]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Teachers Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{teachersData.length} faculty members</p>
        </div>
        <GradientButton icon={Plus} onClick={() => handleOpenModal()}>Add Teacher</GradientButton>
      </div>

      {/* Search */}
      <Card className="p-5 bg-[#FFFDF7]">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search by name, email, designation…" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#43a047] focus:ring-4 focus:ring-[#43a047]/10 transition-all shadow-sm"
          />
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#2e7d32]">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-sm font-bold text-gray-500">Loading faculty data…</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={24} className="text-gray-300 mb-3" />
          <p className="text-base font-bold text-[#1A1A2E]">No teachers found</p>
          <p className="text-sm mt-1 text-gray-500">Try adjusting your search or add a new faculty member.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeachers.map((t: any, i: number) => {
            const email    = t.user?.email ?? "No email";
            const subjects = t.subjects ?? [];
            return (
              <Card key={t.id} className="p-6 flex flex-col group hover:border-[#2e7d32]/30 hover:shadow-[0_8px_30px_rgba(46,125,50,0.1)] transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F0EEF8] flex-shrink-0">
                    {t.photoUrl ? (
                      <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div style={{ background: GRADIENTS[i % GRADIENTS.length] }} className="w-full h-full flex items-center justify-center text-white text-xl font-black">
                        {t.name?.[0]?.toUpperCase() ?? "T"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-[#1A1A2E] truncate group-hover:text-[#2e7d32] transition-colors">{t.name}</h3>
                    {t.designation && <p className="text-xs font-black text-[#2e7d32] mt-0.5">{t.designation}</p>}
                    <p className="text-xs text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                      <Mail size={11} className="opacity-70 flex-shrink-0" /> {email}
                    </p>
                  </div>
                  <ActionsMenu
                    teacher={t}
                    onEdit={() => handleOpenModal(t)}
                    onDelete={() => { setTeacherToDelete(t); setIsDeleteModalOpen(true); }}
                    onGeneratePassword={() => handleGeneratePassword(t)}
                    onViewReport={() => fetchReport(t, false)}
                    onDownloadReport={() => fetchReport(t, true)}
                    onViewIdCard={() => handleViewIdCard(t)}
                  />
                </div>
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0"><Phone size={12} /></div>
                    <span className="font-medium">{t.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0"><Briefcase size={12} /></div>
                    <span className="font-medium">{t.experience ? `${t.experience} experience` : "—"}</span>
                  </div>
                  {t.wifeOrHusbandOf && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-6 h-6 rounded-md bg-[#FFFDF7] border border-[#F0EEF8] flex items-center justify-center text-gray-400 flex-shrink-0 text-[10px] font-black">W/O</div>
                      <span className="font-medium">{t.wifeOrHusbandOf}</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-[#F0EEF8]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest"><BookOpen size={12} /> Subjects</div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.length > 0 ? subjects.map((s: any, idx: number) => (
                      <Badge key={idx} text={s.subject?.name ?? s.name} color="#2e7d32" />
                    )) : (
                      <span className="text-xs text-gray-400 italic">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── ADD / EDIT Modal ── */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTeacher ? "Edit Teacher Profile" : "Register New Teacher"}
        wide
      >
        <form onSubmit={handleSaveTeacher} className="space-y-6">
          <div className="flex gap-5 items-start">
            {/* Photo upload — key forces remount when switching between add/edit */}
            <PhotoUpload
              key={editingTeacher?.id ?? "new"}
              value={teacherForm.photoUrl}
              onChange={(url, file) => {
                setPhotoFile(file);
                setTeacherForm((p: any) => ({ ...p, photoUrl: url }));
              }}
            />
            <div className="flex-1 space-y-4">
              <h4 className="text-xs font-black text-[#2e7d32] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name" placeholder="Mrs. Bhavna Tomar" required
                  value={teacherForm.name}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, name: v }))}
                />
                <FormInput
                  label="Email" placeholder="teacher@ascento.edu" required type="email"
                  value={teacherForm.email}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, email: v }))}
                  disabled={!!editingTeacher}
                />
                <FormInput
                  label="Phone" placeholder="+91 98111 XXXXX"
                  value={teacherForm.phone}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, phone: v }))}
                />
                {/* ── NEW: Date of Birth field ── */}
                <FormInput
                  label="Date of Birth" type="date"
                  value={teacherForm.dateOfBirth}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, dateOfBirth: v }))}
                />
                <FormInput
                  label="Experience" placeholder="e.g. 8 years"
                  value={teacherForm.experience}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, experience: v }))}
                />
                <FormInput
                  label="Designation" placeholder="e.g. Principal, Teacher"
                  value={teacherForm.designation}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, designation: v }))}
                />
                <FormInput
                  label="W/O (Wife / Husband Of)" placeholder="Spouse name"
                  value={teacherForm.wifeOrHusbandOf}
                  onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, wifeOrHusbandOf: v }))}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#43a047] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Profile</h4>
            <FormInput
              label="Subjects (comma separated)"
              placeholder="Mathematics, Abacus Level 1, Mental Math"
              value={teacherForm.subjects}
              onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, subjects: v }))}
            />
          </div>
          {!editingTeacher && (
            <div className="flex items-start gap-3 bg-[#2e7d32]/5 border border-[#2e7d32]/20 rounded-xl px-4 py-3">
              <KeyRound size={15} className="text-[#2e7d32] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                A secure login password will be <span className="font-black text-[#1A1A2E]">auto-generated</span> and shown once after registration.
              </p>
            </div>
          )}
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : (editingTeacher ? Edit : Plus)}>
              {submitting ? "Saving…" : editingTeacher ? "Update Teacher" : "Register Teacher"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── ID Card Modal ── */}
      <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Teacher ID Card" wide>
        {idCardTeacher && (
          <div className="space-y-5">
            <TeacherIDCard teacher={idCardTeacher} logoUrl={LOGO_URL} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button
                onClick={() => buildTeacherIDCardHTML(idCardTeacher, LOGO_URL).then(openPrintWindow)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Print / Save PDF
              </button>
              <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Report Modal ── */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Teacher Report" wide>
        {reportLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#2e7d32]" size={32} /></div>
        ) : reportData && (
          <div className="space-y-4">
            <TeacherReport report={reportData} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button
                onClick={async () => { const html = await buildTeacherReportHTML(reportData); openPrintWindow(html); }}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Download PDF
              </button>
              <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Credentials Modal ── */}
      <Modal
        isOpen={isCredentialsModalOpen}
        onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}
        title="Teacher Login Credentials"
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-500">The password is shown <span className="font-black text-[#FF6B6B]">only once</span>. Share it now.</p>
          {credentials && (
            <div className="space-y-3">
              <CredentialRow label="Name"               value={credentials.name} />
              <CredentialRow label="Login Email"        value={credentials.email} />
              <CredentialRow label="Temporary Password" value={credentials.password} mono />
            </div>
          )}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-700">Share these credentials securely. Ask the teacher to change their password after first login.</p>
          </div>
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
            <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
          </div>
        </div>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Removal">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {teacherToDelete?.name}?</h4>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete their account and all records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Remove"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#2e7d32] to-[#43a047] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(46,125,50,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}
    </div>
  );
}