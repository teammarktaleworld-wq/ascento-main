










'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle, Loader2,
  Edit, Mail, Phone, Briefcase, BookOpen, KeyRound,
  Copy, Check, AlertTriangle, Download, Eye, IdCard,
  Camera, Upload, MoreHorizontal, ToggleLeft, ToggleRight,
  FileText, Calendar, Award, MapPin,
} from 'lucide-react';
import { supabase } from "@/lib/helpers/supabaseClient";

// ── Constants ──────────────────────────────────────────────────────────────────
const SCHOOL_NAME    = "Ascento Playschool";
const SCHOOL_TAGLINE = "Play School";
const SCHOOL_WEBSITE = "https://ascentoabacus.com/";
const SCHOOL_PHONE   = "+91 9810366417";
const SCHOOL_ADDRESS = "Ascento Playschool, Dwarka, New Delhi";
const LOGO_URL       = "/Acento-Logo.jpg";

// ── Matches student card width ─────────────────────────────────────────────────
const CARD_W = 208;

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

function formatDate(val: string | Date | null | undefined): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch { return "—"; }
}

function formatDateLong(val: string | Date | null | undefined): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return "—"; }
}

// ── ID Card HTML — same CARD_W as student (208px), portrait stacked ────────────
async function buildTeacherIDCardHTML(teacher: any, logoUrl?: string): Promise<string> {
  let photoSrc = "";
  if (teacher.photoUrl) { const b64 = await urlToBase64(teacher.photoUrl); if (b64) photoSrc = b64; }
  let logoSrc = "";
  if (logoUrl) { const b64 = await urlToBase64(logoUrl); if (b64) logoSrc = b64; }

  const logoImgFront = logoSrc
    ? `<img src="${logoSrc}" class="logo-img" />`
    : `<div class="logo-av">A</div>`;
  const logoImgBack = logoSrc
    ? `<img src="${logoSrc}" class="logo-back" />`
    : `<div class="logo-av-back">A</div>`;
  const photoHtml = photoSrc
    ? `<img src="${photoSrc}" class="photo" />`
    : `<div class="photo-av">${(teacher.name?.[0] ?? "T").toUpperCase()}</div>`;

  const dob = formatDate(teacher.dateOfBirth);
  const w = CARD_W;

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
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 20px;
  }
  .card { width:${w}px; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.15); border:1px solid #eee; font-family:Arial,sans-serif; display:flex; flex-direction:column; flex-shrink:0; }
  .header { background:linear-gradient(135deg,#2e7d32 0%,#1b5e20 100%); padding:8px 10px 6px; display:flex; align-items:center; gap:6px; }
  .logo-img  { width:29px; height:29px; border-radius:5px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0; }
  .logo-av   { width:29px; height:29px; border-radius:5px; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; color:#fff; flex-shrink:0; }
  .header-text .school { color:#fff; font-weight:900; font-size:11px; line-height:1.2; }
  .header-text .tag    { color:rgba(255,255,255,0.8); font-size:7px; line-height:1.3; }
  .header-text .tid    { color:rgba(255,255,255,0.7); font-size:6.5px; margin-top:2px; }
  .wave-top svg { display:block; width:100%; }
  .photo-wrap { display:flex; flex-direction:column; align-items:center; padding:5px 10px 8px; }
  .photo    { width:64px; height:72px; border-radius:50%; object-fit:cover; border:3px solid #2e7d32; }
  .photo-av { width:64px; height:72px; border-radius:50%; background:#e8f5e9; border:3px solid #2e7d32; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#2e7d32; }
  .info { padding:0 11px 5px; font-size:8px; }
  .row  { display:flex; gap:3px; margin-bottom:3px; align-items:flex-start; }
  .lbl  { font-weight:700; color:#333; width:44px; flex-shrink:0; }
  .val  { color:#555; font-weight:600; }
  .desig { color:#2e7d32 !important; font-weight:900 !important; }
  .sign       { padding:3px 11px; display:flex; justify-content:flex-end; }
  .sign-inner { text-align:center; }
  .sign-line  { border-bottom:1px solid #aaa; width:48px; margin-bottom:2px; }
  .sign-label { font-size:6.5px; color:#777; }
  .wave-bot svg { display:block; width:100%; margin-top:2px; }
  .wave-top-back svg { display:block; width:100%; }
  .back-logo  { display:flex; flex-direction:column; align-items:center; padding:8px 11px 6px; text-align:center; }
  .logo-back  { width:38px; height:38px; border-radius:7px; object-fit:contain; margin-bottom:5px; }
  .logo-av-back { width:38px; height:38px; border-radius:7px; background:linear-gradient(135deg,#2e7d32,#1b5e20); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:#fff; margin-bottom:5px; }
  .back-school { font-weight:900; font-size:11px; color:#1a1a2e; line-height:1.2; }
  .divider { height:1px; background:#f0eef8; margin:0 11px; }
  .back-addr   { padding:6px 11px; text-align:center; font-size:7.5px; color:#444; line-height:1.6; }
  .finder      { padding:6px 11px; text-align:center; }
  .finder-title { font-weight:900; font-size:8.5px; color:#2e7d32; margin-bottom:3px; line-height:1.3; }
  .finder-addr  { font-size:7.5px; color:#444; line-height:1.6; }
  .status-chip { display:flex; justify-content:center; padding:3px 11px 5px; }
  .chip        { background:#4ecdc422; border:1px solid #4ecdc444; border-radius:20px; padding:2px 8px; display:flex; align-items:center; gap:3px; }
  .dot         { width:4px; height:4px; border-radius:50%; background:#4ecdc4; }
  .chip-txt    { font-size:7px; font-weight:900; color:#4ecdc4; }
  .card-label  { text-align:center; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:6px; }
  .card-wrapper { display:flex; flex-direction:column; align-items:center; }
  @media print {
    body { background:#fff; gap:16px; padding:0; }
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
      <svg viewBox="0 0 ${w} 14"><path d="M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z" fill="#2e7d32" opacity="0.15"/></svg>
    </div>
    <div class="photo-wrap">${photoHtml}</div>
    <div class="info">
      <div class="row"><span class="lbl">Name</span><span class="val">: &nbsp;${teacher.name ?? "—"}</span></div>
      <div class="row"><span class="lbl">D.O.B</span><span class="val">: &nbsp;${dob}</span></div>
      <div class="row"><span class="lbl">Mob.</span><span class="val">: &nbsp;${teacher.phone ?? "—"}</span></div>
      <div class="row"><span class="lbl">Desig.</span><span class="val desig">: &nbsp;${teacher.designation ?? "—"}</span></div>
      <div class="row"><span class="lbl">W/O</span><span class="val">: &nbsp;${teacher.wifeOrHusbandOf ?? "—"}</span></div>
    </div>
    <div class="sign"><div class="sign-inner"><div class="sign-line"></div><div class="sign-label">Auth. Sign.</div></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#2e7d32"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#1b5e20" opacity="0.6"/></svg>
    </div>
  </div>
</div>
<!-- BACK -->
<div class="card-wrapper">
  <div class="card-label">Back</div>
  <div class="card">
    <div class="wave-top-back">
      <svg viewBox="0 0 ${w} 22"><path d="M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z" fill="#1b5e20" opacity="0.6"/><path d="M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z" fill="#2e7d32"/></svg>
    </div>
    <div class="back-logo">
      ${logoImgBack}
      <div class="back-school">${SCHOOL_NAME}</div>
    </div>
    <div class="divider"></div>
    <div class="back-addr">${SCHOOL_ADDRESS}<br/>${SCHOOL_WEBSITE}<br/>Mob.: ${SCHOOL_PHONE}</div>
    <div class="divider"></div>
    <div class="finder">
      <div class="finder-title">Finder may please<br/>return to</div>
      <div class="finder-addr">${teacher.address ?? SCHOOL_ADDRESS}<br/>Mob.: ${teacher.phone ?? "—"}</div>
    </div>
    <div class="status-chip"><div class="chip"><div class="dot"></div><span class="chip-txt">${teacher.status ?? "Active"}</span></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#2e7d32"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#1b5e20" opacity="0.6"/></svg>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Experience Certificate HTML ────────────────────────────────────────────────
async function buildCertificateHTML(cert: CertificateForm, teacher: any, logoUrl?: string): Promise<string> {
  let logoSrc = "";
  if (logoUrl) { const b64 = await urlToBase64(logoUrl); if (b64) logoSrc = b64; }

  const issuedDate = cert.issueDate
    ? new Date(cert.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const fromDate = cert.fromDate ? formatDateLong(cert.fromDate) : "—";
  const toDate   = cert.toDate   ? formatDateLong(cert.toDate)   : "Present";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Experience Certificate — ${teacher.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4 portrait; margin: 18mm 20mm; }
  body { font-family: 'Times New Roman', Times, serif; background:#fff; color:#1a1a2e; padding:30px; }

  .outer-border {
    border: 3px solid #2e7d32;
    border-radius: 6px;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .inner-border {
    border: 1px solid #a5d6a7;
    margin: 6px;
    border-radius: 3px;
    padding: 28px 32px 24px;
    position: relative;
  }

  /* Corner ornaments */
  .corner { position:absolute; width:24px; height:24px; }
  .corner-tl { top:10px; left:10px; border-top:3px solid #2e7d32; border-left:3px solid #2e7d32; }
  .corner-tr { top:10px; right:10px; border-top:3px solid #2e7d32; border-right:3px solid #2e7d32; }
  .corner-bl { bottom:10px; left:10px; border-bottom:3px solid #2e7d32; border-left:3px solid #2e7d32; }
  .corner-br { bottom:10px; right:10px; border-bottom:3px solid #2e7d32; border-right:3px solid #2e7d32; }

  .header { display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:8px; }
  .logo   { width:52px; height:52px; object-fit:contain; }
  .logo-av { width:52px; height:52px; background:linear-gradient(135deg,#2e7d32,#1b5e20); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#fff; font-family:Arial,sans-serif; flex-shrink:0; }
  .school-block { text-align:center; }
  .school-name { font-family:Arial,Helvetica,sans-serif; font-size:20px; font-weight:900; color:#1a1a2e; letter-spacing:0.5px; }
  .school-tag  { font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#555; letter-spacing:2px; text-transform:uppercase; margin-top:2px; }
  .school-contact { font-family:Arial,Helvetica,sans-serif; font-size:9px; color:#777; margin-top:3px; }

  .divider-line { height:2px; background:linear-gradient(90deg,transparent,#2e7d32,transparent); margin:12px 0; }
  .thin-line    { height:1px; background:linear-gradient(90deg,transparent,#a5d6a7,transparent); margin:8px 0; }

  .cert-title { text-align:center; margin:14px 0 10px; }
  .cert-title h1 { font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:900; letter-spacing:4px; text-transform:uppercase; color:#1b5e20; }
  .cert-subtitle { font-size:11px; color:#888; letter-spacing:2px; text-transform:uppercase; margin-top:3px; font-family:Arial,sans-serif; }

  .cert-no { text-align:right; font-family:Arial,sans-serif; font-size:10px; color:#888; margin-bottom:10px; }

  .body-text { font-size:13px; line-height:1.85; color:#222; text-align:justify; }
  .body-text strong { color:#1a1a2e; font-weight:700; }
  .body-text .highlight { color:#2e7d32; font-weight:700; }

  .details-table { width:100%; margin:16px 0; border-collapse:collapse; font-size:12px; font-family:Arial,sans-serif; }
  .details-table td { padding:5px 8px; vertical-align:top; }
  .details-table .dt-label { color:#888; font-weight:700; width:130px; text-transform:uppercase; font-size:10px; letter-spacing:1px; }
  .details-table .dt-sep   { color:#aaa; width:14px; text-align:center; }
  .details-table .dt-value { color:#1a1a2e; font-weight:700; font-size:12px; }
  .details-table tr:nth-child(odd) td { background:rgba(46,125,50,0.03); }

  .closing-text { font-size:13px; line-height:1.85; color:#222; margin-top:12px; text-align:justify; }

  .sign-section { display:flex; justify-content:space-between; align-items:flex-end; margin-top:30px; }
  .sign-block   { text-align:center; }
  .sign-line    { border-bottom:1px solid #555; width:140px; margin-bottom:4px; }
  .sign-name    { font-family:Arial,sans-serif; font-size:11px; font-weight:900; color:#1a1a2e; }
  .sign-title   { font-family:Arial,sans-serif; font-size:10px; color:#888; }
  .sign-school  { font-family:Arial,sans-serif; font-size:10px; color:#2e7d32; font-weight:700; }

  .issued-on { text-align:center; margin-top:14px; font-family:Arial,sans-serif; font-size:10px; color:#aaa; letter-spacing:1px; text-transform:uppercase; }

  .stamp-area { width:70px; height:70px; border:2px dashed #c8e6c9; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:Arial,sans-serif; font-size:9px; color:#c8e6c9; text-align:center; line-height:1.3; }

  @media print {
    body { padding:0; background:#fff; }
    * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  }
</style>
</head>
<body>
<div class="outer-border">
  <div class="corner corner-tl"></div><div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div><div class="corner corner-br"></div>
  <div class="inner-border">

    <!-- Header -->
    <div class="header">
      ${logoSrc ? `<img src="${logoSrc}" class="logo" />` : `<div class="logo-av">A</div>`}
      <div class="school-block">
        <div class="school-name">${SCHOOL_NAME}</div>
        <div class="school-tag">${SCHOOL_TAGLINE}</div>
        <div class="school-contact">${SCHOOL_ADDRESS} &nbsp;|&nbsp; ${SCHOOL_PHONE} &nbsp;|&nbsp; ${SCHOOL_WEBSITE}</div>
      </div>
    </div>

    <div class="divider-line"></div>

    <!-- Title -->
    <div class="cert-title">
      <h1>Experience Certificate</h1>
      <div class="cert-subtitle">To Whomsoever It May Concern</div>
    </div>

    <div class="cert-no">Ref. No.: ${cert.refNumber || `EXP/${new Date().getFullYear()}/${String(Math.floor(Math.random()*999)+1).padStart(3,"0")}`}</div>

    <div class="thin-line"></div>

    <!-- Body -->
    <div class="body-text">
      This is to certify that <strong>${teacher.name ?? "—"}</strong>
      ${teacher.gender === "Female" ? ", D/O" : teacher.gender === "Male" ? ", S/O" : ""} 
      ${teacher.wifeOrHusbandOf ? `<strong>${teacher.wifeOrHusbandOf}</strong>,` : ""}
      has been employed with <span class="highlight">${SCHOOL_NAME}</span> as a
      <strong>${cert.designation || teacher.designation || "Teacher"}</strong>
      from <strong>${fromDate}</strong> to <strong>${toDate}</strong>.
    </div>

    <!-- Details table -->
    <table class="details-table">
      <tr>
        <td class="dt-label">Full Name</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${teacher.name ?? "—"}</td>
      </tr>
      <tr>
        <td class="dt-label">Designation</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${cert.designation || teacher.designation || "—"}</td>
      </tr>
      <tr>
        <td class="dt-label">Department</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${cert.department || "Academic"}</td>
      </tr>
      <tr>
        <td class="dt-label">Duration</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${cert.duration || teacher.experience || "—"}</td>
      </tr>
      <tr>
        <td class="dt-label">Period</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${fromDate} — ${toDate}</td>
      </tr>
      ${cert.subjects ? `<tr>
        <td class="dt-label">Subjects Taught</td>
        <td class="dt-sep">:</td>
        <td class="dt-value">${cert.subjects}</td>
      </tr>` : ""}
    </table>

    <div class="closing-text">
      ${cert.bodyText || `During the tenure, <strong>${teacher.name ?? "the employee"}</strong> has demonstrated excellent dedication, professionalism, and subject knowledge. ${teacher.name ? teacher.name.split(" ")[0] : "They"} has been an asset to our institution and leaves with our best wishes for future endeavors.`}
    </div>

    <div class="closing-text" style="margin-top:10px;">
      We wish ${teacher.gender === "Female" ? "her" : "them"} all the best in ${teacher.gender === "Female" ? "her" : "their"} future career.
    </div>

    <!-- Signature section -->
    <div class="sign-section">
      <div class="sign-block">
        <div class="stamp-area">Official<br/>Seal</div>
      </div>
      <div class="sign-block">
        <div class="sign-line"></div>
        <div class="sign-name">${cert.authorizedBy || "Principal / Director"}</div>
        <div class="sign-title">Authorized Signatory</div>
        <div class="sign-school">${SCHOOL_NAME}</div>
      </div>
    </div>

    <div class="issued-on">Issued on: ${issuedDate}</div>

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
  if (r.photoUrl) { const b64 = await urlToBase64(r.photoUrl); if (b64) photoHtml = `<img src="${b64}" alt="Photo" class="report-photo" />`; }

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Teacher Report — ${r.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,Helvetica,sans-serif; background:#f7f7f7; color:#1A1A2E; padding:20px; }
  .hdr { background:linear-gradient(135deg,#FF6B6B,#FFB347); border-radius:12px; padding:20px 24px; color:#fff; margin-bottom:18px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
  .hdr-left { flex:1; }
  .school { font-size:9px; font-weight:900; letter-spacing:2px; text-transform:uppercase; opacity:.8; margin-bottom:4px; }
  h1 { font-size:22px; font-weight:900; line-height:1.2; }
  .tid { font-family:monospace; font-size:11px; opacity:.7; margin-top:3px; }
  .badge { background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); padding:2px 10px; border-radius:20px; font-size:9px; font-weight:900; letter-spacing:1px; text-transform:uppercase; display:inline-block; margin-top:8px; }
  .report-photo { width:60px; height:72px; border-radius:8px; object-fit:cover; border:2px solid rgba(255,255,255,0.4); flex-shrink:0; }
  .hdr-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
  .date { font-size:9px; opacity:.65; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .cell { background:#fff; border:1px solid #F0EEF8; border-radius:8px; padding:10px 14px; }
  .lbl  { font-size:7px; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#aaa; margin-bottom:2px; }
  .val  { font-size:12px; font-weight:700; word-break:break-word; }
  .footer { margin-top:18px; text-align:center; font-size:8px; color:#ccc; }
  @page { margin:12mm; }
  @media print { body { background:#fff; padding:0; } * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; } }
</style></head>
<body>
<div class="hdr">
  <div class="hdr-left">
    <div class="school">${SCHOOL_NAME} · Faculty</div>
    <h1>${r.name}</h1>
    <div class="tid">${r.teacherId ?? r.id ?? ""}</div>
    ${r.designation ? `<span class="badge">${r.designation}</span>` : ""}
  </div>
  <div class="hdr-right">${photoHtml}<div class="date">Generated: ${generated}</div></div>
</div>
<div class="grid">
  ${fields.map(([l, v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}
</div>
<div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Teacher Report</div>
</body></html>`;
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface CertificateForm {
  refNumber:    string;
  designation:  string;
  department:   string;
  fromDate:     string;
  toDate:       string;
  duration:     string;
  subjects:     string;
  bodyText:     string;
  authorizedBy: string;
  issueDate:    string;
}

// ── UI Primitives — MATCHES STUDENT THEME (pink/orange) ───────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden relative ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? 'hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5' : ''} ${className}`}
  >
    {Icon && <Icon size={18} className={disabled ? 'animate-spin' : ''} />}
    {children}
  </button>
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
        <div className="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar">
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
      className={`w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

const FormTextarea = ({ label, placeholder, required = false, value, onChange, rows = 4 }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <textarea
      placeholder={placeholder} value={value ?? ""} rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors resize-none"
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
        className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

// ── Status Badge — matches student component ───────────────────────────────────
function StatusBadge({ status, onClick, loading }: { status: string; onClick: () => void; loading?: boolean }) {
  const isActive = status === "Active";
  return (
    <button
      onClick={onClick} disabled={loading}
      title={`Click to ${isActive ? "disable" : "activate"} teacher`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
        isActive
          ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30"
          : "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30"
      }`}
    >
      {loading
        ? <Loader2 size={10} className="animate-spin" />
        : isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />
      }
      {status ?? "Active"}
    </button>
  );
}

// ── Photo Upload ───────────────────────────────────────────────────────────────
function PhotoUpload({ value, onChange }: { value?: string; onChange: (url: string, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value && value !== "pending" ? value : null);
  useEffect(() => { if (value && value !== "pending") setPreview(value); }, [value]);
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
        className="relative w-28 h-36 rounded-2xl border-2 border-dashed border-[#F0EEF8] bg-[#FFFDF7] flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB347] hover:bg-[#FFF8EE] transition-all group overflow-hidden"
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
            <Upload size={20} className="text-gray-300 group-hover:text-[#FFB347] transition-colors mb-1.5" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#FFB347] text-center px-2 leading-tight">Upload<br />Photo</span>
            <span className="text-[9px] text-gray-300 mt-1">Passport size</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ── ID Card Preview (React) — same CARD_W=208 as students ─────────────────────
function TeacherIDCard({ teacher, logoUrl }: { teacher: any; logoUrl?: string }) {
  const dob = formatDate(teacher.dateOfBirth);
  const w   = CARD_W;

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* FRONT */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
        <div style={{ width: w, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
          {/* Green header — only green on the card */}
          <div style={{ background:"linear-gradient(135deg,#2e7d32,#1b5e20)", padding:"8px 10px 6px", display:"flex", alignItems:"center", gap:6 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width:29, height:29, borderRadius:5, objectFit:"contain", background:"#fff", padding:2, flexShrink:0 }} />
            ) : (
              <div style={{ width:29, height:29, background:"rgba(255,255,255,0.25)", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:900, color:"#fff" }}>A</div>
            )}
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:11, lineHeight:1.2 }}>{SCHOOL_NAME}</div>
              {/* <div style={{ color:"rgba(255,255,255,0.8)", fontSize:7, lineHeight:1.3 }}>{SCHOOL_TAGLINE}</div> */}
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:6.5, marginTop:2 }}>ID: {teacher.id?.slice(0,8).toUpperCase() ?? "—"}</div>
            </div>
          </div>
          <svg viewBox={`0 0 ${w} 14`} style={{ display:"block", width:"100%" }}>
            <path d={`M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z`} fill="#2e7d32" opacity="0.15"/>
          </svg>
          {/* Photo */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"5px 10px 8px" }}>
            <div style={{ width:64, height:72, borderRadius:"50%", overflow:"hidden", border:"3px solid #2e7d32", background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {teacher.photoUrl ? (
                <img src={teacher.photoUrl} alt={teacher.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <span style={{ fontSize:22, fontWeight:900, color:"#2e7d32" }}>{teacher.name?.[0]?.toUpperCase() ?? "T"}</span>
              )}
            </div>
          </div>
          {/* Info rows */}
          <div style={{ padding:"0 11px 5px", fontSize:8 }}>
            {([
              ["Name",   teacher.name ?? "—",        false],
              ["D.O.B",  dob,                         false],
              ["Mob.",   teacher.phone ?? "—",        false],
              ["Desig.", teacher.designation ?? "—",  true],
              ["W/O",    teacher.wifeOrHusbandOf ?? "—", false],
            ] as [string, string, boolean][]).map(([label, value, highlight]) => (
              <div key={label} style={{ display:"flex", gap:3, marginBottom:3, alignItems:"flex-start" }}>
                <span style={{ fontWeight:700, color:"#333", width:44, flexShrink:0 }}>{label}</span>
                <span style={{ color: highlight ? "#2e7d32" : "#555", fontWeight: highlight ? 900 : 600 }}>: &nbsp;{value}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:"3px 11px", display:"flex", justifyContent:"flex-end" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ borderBottom:"1px solid #aaa", width:48, marginBottom:2 }} />
              <div style={{ fontSize:6.5, color:"#777" }}>Auth. Sign.</div>
            </div>
          </div>
          <svg viewBox={`0 0 ${w} 18`} style={{ display:"block", width:"100%", marginTop:2 }}>
            <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#2e7d32"/>
            <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#1b5e20" opacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* BACK */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
        <div style={{ width: w, background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", border:"1px solid #eee", fontFamily:"Arial, sans-serif" }}>
          <svg viewBox={`0 0 ${w} 22`} style={{ display:"block", width:"100%" }}>
            <path d={`M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z`} fill="#1b5e20" opacity="0.6"/>
            <path d={`M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z`} fill="#2e7d32"/>
          </svg>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 11px 6px", textAlign:"center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width:38, height:38, borderRadius:7, objectFit:"contain", marginBottom:5 }} />
            ) : (
              <div style={{ width:38, height:38, background:"linear-gradient(135deg,#2e7d32,#1b5e20)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:5, fontSize:16, fontWeight:900, color:"#fff" }}>A</div>
            )}
            <div style={{ fontWeight:900, fontSize:11, color:"#1a1a2e", lineHeight:1.2 }}>{SCHOOL_NAME}</div>
          </div>
          <div style={{ height:1, background:"#f0eef8", margin:"0 11px" }} />
          <div style={{ padding:"6px 11px", textAlign:"center", fontSize:7.5, color:"#444", lineHeight:1.6 }}>
            <div>{SCHOOL_ADDRESS}</div>
            <div>{SCHOOL_WEBSITE}</div>
            <div>Mob.: {SCHOOL_PHONE}</div>
          </div>
          <div style={{ height:1, background:"#f0eef8", margin:"0 11px" }} />
          <div style={{ padding:"6px 11px 5px", textAlign:"center" }}>
            <div style={{ fontWeight:900, fontSize:8.5, color:"#2e7d32", marginBottom:3 }}>Finder may please<br />return to</div>
            <div style={{ fontSize:7.5, color:"#444", lineHeight:1.6 }}>
              {SCHOOL_ADDRESS}<br />Mob.: {teacher.phone ?? "—"}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", padding:"3px 11px 5px" }}>
            <div style={{ background:"#4ecdc422", border:"1px solid #4ecdc444", borderRadius:20, padding:"2px 8px", display:"flex", alignItems:"center", gap:3 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:"#4ecdc4" }} />
              <span style={{ fontSize:7, fontWeight:900, color:"#4ecdc4" }}>{teacher.status ?? "Active"}</span>
            </div>
          </div>
          <svg viewBox={`0 0 ${w} 18`} style={{ display:"block", width:"100%", marginTop:3 }}>
            <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#2e7d32"/>
            <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#1b5e20" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Certificate Editor Modal ───────────────────────────────────────────────────
function CertificateEditor({ teacher, onClose }: { teacher: any; onClose: () => void }) {
  const [form, setForm] = useState<CertificateForm>({
    refNumber:    "",
    designation:  teacher.designation ?? "",
    department:   "Academic",
    fromDate:     teacher.dateOfBirth ? "" : "",
    toDate:       "",
    duration:     teacher.experience ?? "",
    subjects:     teacher.subjects?.map((s: any) => s.subject?.name ?? s.name).join(", ") ?? "",
    bodyText:     "",
    authorizedBy: "Principal / Director",
    issueDate:    new Date().toISOString().slice(0, 10),
  });
  const [generating, setGenerating] = useState(false);
  const set = (key: keyof CertificateForm) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  const handleDownload = async () => {
    setGenerating(true);
    const html = await buildCertificateHTML(form, teacher, LOGO_URL);
    openPrintWindow(html);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Preview info */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] rounded-2xl p-4 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Award size={22} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80">Experience Certificate</p>
          <p className="text-lg font-black">{teacher.name}</p>
          <p className="text-xs opacity-75">{teacher.designation ?? "Teacher"} · {SCHOOL_NAME}</p>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Certificate Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Reference Number" placeholder="EXP/2024/001" value={form.refNumber} onChange={set("refNumber")} />
          <FormInput label="Issue Date" type="date" value={form.issueDate} onChange={set("issueDate")} required />
          <FormInput label="Designation on Certificate" placeholder="Senior Teacher" value={form.designation} onChange={set("designation")} required />
          <FormInput label="Department" placeholder="Academic / Administration" value={form.department} onChange={set("department")} />
          <FormInput label="Employment From" type="date" value={form.fromDate} onChange={set("fromDate")} required />
          <FormInput label="Employment To (leave blank for Present)" type="date" value={form.toDate} onChange={set("toDate")} />
          <FormInput label="Total Duration" placeholder="e.g. 3 years 4 months" value={form.duration} onChange={set("duration")} />
          <FormInput label="Subjects Taught" placeholder="Abacus, Mental Math..." value={form.subjects} onChange={set("subjects")} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Certificate Body</h4>
        <FormTextarea
          label="Custom Body Text (leave blank for default)"
          placeholder="During the tenure, [Name] has demonstrated excellent dedication..."
          value={form.bodyText}
          onChange={set("bodyText")}
          rows={4}
        />
        <FormInput label="Authorized By" placeholder="Mr. / Mrs. Principal Name" value={form.authorizedBy} onChange={set("authorizedBy")} required />
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertTriangle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-medium text-amber-700">A print dialog will open. Use "Save as PDF" to download the certificate.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
        <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
        <GradientButton onClick={handleDownload} disabled={generating} icon={generating ? Loader2 : Download}>
          {generating ? "Generating..." : "Download Certificate"}
        </GradientButton>
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
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] rounded-2xl p-5 text-white">
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
            <img src={report.photoUrl} alt={report.name} className="w-16 h-20 object-cover rounded-xl border-2 border-white/30 flex-shrink-0" />
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
function ActionsMenu({ teacher, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard, onCertificate }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { icon: Edit,     label: "Edit",                color: "#FFB347", action: onEdit },
    { icon: KeyRound, label: "Generate Password",   color: "#4ECDC4", action: onGeneratePassword },
    { icon: IdCard,   label: "View ID Card",        color: "#A78BFA", action: onViewIdCard },
    { icon: Award,    label: "Experience Certificate", color: "#FF6B6B", action: onCertificate },
    { icon: Eye,      label: "View Report",         color: "#64B6FF", action: onViewReport },
    { icon: Download, label: "Download Report",     color: "#6BCB77", action: onDownloadReport },
    { icon: Trash2,   label: "Delete",              color: "#FF6B6B", action: onDelete },
  ];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[#F0EEF8] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-30 py-1.5 min-w-[200px]">
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

const GRADIENTS = [
  "linear-gradient(135deg,#FF6B6B,#FFB347)",
  "linear-gradient(135deg,#A78BFA,#FF6B6B)",
  "linear-gradient(135deg,#FFB347,#FF6B6B)",
  "linear-gradient(135deg,#4ECDC4,#A78BFA)",
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function TeachersView() {
  const [teachersData,   setTeachersData]   = useState<any[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [submitting,     setSubmitting]     = useState(false);
  const [reportLoading,  setReportLoading]  = useState(false);
  const [toast,          setToast]          = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const [isFormModalOpen,        setIsFormModalOpen]        = useState(false);
  const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
  const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const [editingTeacher,   setEditingTeacher]   = useState<any>(null);
  const [teacherToDelete,  setTeacherToDelete]  = useState<any>(null);
  const [idCardTeacher,    setIdCardTeacher]    = useState<any>(null);
  const [certificateTeacher, setCertificateTeacher] = useState<any>(null);
  const [reportData,       setReportData]       = useState<any>(null);
  const [credentials,      setCredentials]      = useState<{ name: string; email: string; password: string } | null>(null);
  const [teacherForm,      setTeacherForm]      = useState<any>({});
  const [photoFile,        setPhotoFile]        = useState<File | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/teachers");
      setTeachersData(res ?? []);
    } catch { showToast("Failed to load teachers"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  // ── Toggle status ────────────────────────────────────────────────────────────
  const handleToggleStatus = async (teacher: any) => {
    const newStatus = teacher.status === "Active" ? "Disabled" : "Active";
    setTogglingStatus(teacher.id);
    try {
      await apiFetch(`/api/admin/teachers/${teacher.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Teacher ${newStatus === "Active" ? "activated — login re-enabled" : "disabled — login blocked & session invalidated"}`);
      fetchTeachers();
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
    setTogglingStatus(null);
  };

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
        dateOfBirth:     teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().slice(0, 10) : "",
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({ name:"", email:"", phone:"", experience:"", designation:"", wifeOrHusbandOf:"", subjects:"", photoUrl:"", dateOfBirth:"" });
    }
    setPhotoFile(null);
    setIsFormModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email) { showToast("Name and email are required"); return; }
    setSubmitting(true);
    try {
      let photoUrl = (teacherForm.photoUrl && teacherForm.photoUrl !== "pending") ? teacherForm.photoUrl : null;
      if (photoFile) {
        try { photoUrl = await uploadTeacherPhoto(photoFile, teacherForm.email); }
        catch (err: any) { showToast(`Photo upload failed: ${err.message}`); setSubmitting(false); return; }
      }
      const isEdit   = !!editingTeacher;
      const endpoint = isEdit ? `/api/admin/teachers/${editingTeacher.id}` : "/api/admin/teachers";
      const method   = isEdit ? "PATCH" : "POST";
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify({ name: teacherForm.name, email: teacherForm.email, phone: teacherForm.phone || null, experience: teacherForm.experience || null, designation: teacherForm.designation || null, wifeOrHusbandOf: teacherForm.wifeOrHusbandOf || null, subjects: teacherForm.subjects, photoUrl, dateOfBirth: teacherForm.dateOfBirth || null }),
      });
      if (!isEdit && res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
      showToast(isEdit ? "Teacher updated! ✨" : "Teacher registered! 🧑‍🏫");
      setTeacherForm({}); setPhotoFile(null); setIsFormModalOpen(false);
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
      setCredentials(res); setIsCredentialsModalOpen(true);
    } catch { showToast("Failed to generate password"); }
  };

  const fetchReport = async (teacher: any, download = false) => {
    setReportLoading(true);
    try {
      const res = await apiFetch(`/api/admin/teachers/${teacher.id}/report`);
      if (download) { const html = await buildTeacherReportHTML(res.report); openPrintWindow(html); }
      else { setReportData(res.report); setIsReportModalOpen(true); }
    } catch { showToast("Failed to load report"); }
    setReportLoading(false);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/teachers/${teacherToDelete.id}`, { method: "DELETE" });
      showToast("Teacher removed successfully");
      setIsDeleteModalOpen(false); setTeacherToDelete(null); fetchTeachers();
    } catch { showToast("Failed to remove teacher"); }
    setSubmitting(false);
  };

  const filteredTeachers = useMemo(() =>
    teachersData.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = (
        t.name?.toLowerCase().includes(q) ||
        (t.user?.email ?? "").toLowerCase().includes(q) ||
        (t.designation ?? "").toLowerCase().includes(q) ||
        t.subjects?.some((s: any) => (s.subject?.name ?? s.name ?? "").toLowerCase().includes(q))
      );
      const matchStatus = !statusFilter || (t.status ?? "Active") === statusFilter;
      return matchSearch && matchStatus;
    }),
    [teachersData, searchQuery, statusFilter]
  );

  const hasActiveFilters = searchQuery || statusFilter;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header — matches student theme */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Teachers Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{teachersData.length} faculty members</p>
        </div>
        <GradientButton icon={Plus} onClick={() => handleOpenModal()}>Add Teacher</GradientButton>
      </div>

      {/* Search + Filters — matches student filter bar */}
      <Card className="overflow-visible">
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, email, designation…" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
          </div>

          {/* Status filter */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          {hasActiveFilters && (
            <button onClick={() => { setSearchQuery(""); setStatusFilter(""); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Clear filters
            </button>
          )}
        </div>

        {/* Card grid inside the same container */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#FF6B6B]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-bold text-gray-500">Loading faculty data…</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={24} className="text-gray-300 mb-3" />
              <p className="text-base font-bold text-[#1A1A2E]">No teachers found</p>
              <p className="text-sm mt-1 text-gray-500">Try adjusting your search or add a new faculty member.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeachers.map((t: any, i: number) => {
                const email    = t.user?.email ?? "No email";
                const subjects = t.subjects ?? [];
                const isActive = (t.status ?? "Active") === "Active";
                return (
                  <div key={t.id}
                    className={`bg-white rounded-[20px] border transition-all flex flex-col p-6 group hover:shadow-[0_8px_30px_rgba(255,107,107,0.1)] ${isActive ? "border-[#F0EEF8] hover:border-[#FFB347]/40" : "border-[#FF6B6B]/20 bg-[#FFF8F8]"}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F0EEF8] flex-shrink-0 relative">
                        {t.photoUrl ? (
                          <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <div style={{ background: GRADIENTS[i % GRADIENTS.length] }} className="w-full h-full flex items-center justify-center text-white text-xl font-black">
                            {t.name?.[0]?.toUpperCase() ?? "T"}
                          </div>
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-[8px] font-black text-white bg-[#FF6B6B] px-1 py-0.5 rounded">OFF</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-black truncate transition-colors ${isActive ? "text-[#1A1A2E] group-hover:text-[#FF6B6B]" : "text-gray-400"}`}>{t.name}</h3>
                        {t.designation && <p className="text-xs font-black text-[#FFB347] mt-0.5">{t.designation}</p>}
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                          <Mail size={11} className="opacity-70 flex-shrink-0" /> {email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <ActionsMenu
                          teacher={t}
                          onEdit={() => handleOpenModal(t)}
                          onDelete={() => { setTeacherToDelete(t); setIsDeleteModalOpen(true); }}
                          onGeneratePassword={() => handleGeneratePassword(t)}
                          onViewReport={() => fetchReport(t, false)}
                          onDownloadReport={() => fetchReport(t, true)}
                          onViewIdCard={() => { setIdCardTeacher(teachersData.find(x => x.id === t.id) ?? t); setIsIdCardModalOpen(true); }}
                          onCertificate={() => { setCertificateTeacher(t); setIsCertificateModalOpen(true); }}
                        />
                      </div>
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
                      <div className="flex flex-wrap gap-2 mb-3">
                        {subjects.length > 0 ? subjects.map((s: any, idx: number) => (
                          <span key={idx} style={{ background:"#FFB34722", color:"#FFB347", border:"1px solid #FFB34744" }}
                            className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                            {s.subject?.name ?? s.name}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-400 italic">No subjects assigned</span>
                        )}
                      </div>
                      {/* Status toggle at bottom of card */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F0EEF8]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Status</span>
                        <StatusBadge
                          status={t.status ?? "Active"}
                          loading={togglingStatus === t.id}
                          onClick={() => handleToggleStatus(t)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* ADD / EDIT Modal */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingTeacher ? "Edit Teacher Profile" : "Register New Teacher"} wide>
        <form onSubmit={handleSaveTeacher} className="space-y-6">
          <div className="flex gap-5 items-start">
            <PhotoUpload key={editingTeacher?.id ?? "new"} value={teacherForm.photoUrl}
              onChange={(url, file) => { setPhotoFile(file); setTeacherForm((p: any) => ({ ...p, photoUrl: url })); }} />
            <div className="flex-1 space-y-4">
              <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" placeholder="Mrs. Bhavna Tomar" required value={teacherForm.name} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, name: v }))} />
                <FormInput label="Email" placeholder="teacher@ascento.edu" required type="email" value={teacherForm.email} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, email: v }))} disabled={!!editingTeacher} />
                <FormInput label="Phone" placeholder="+91 98111 XXXXX" value={teacherForm.phone} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, phone: v }))} />
                <FormInput label="Date of Birth" type="date" value={teacherForm.dateOfBirth} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, dateOfBirth: v }))} />
                <FormInput label="Experience" placeholder="e.g. 8 years" value={teacherForm.experience} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, experience: v }))} />
                <FormInput label="Designation" placeholder="e.g. Principal, Teacher" value={teacherForm.designation} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, designation: v }))} />
                <FormInput label="W/O (Wife / Husband Of)" placeholder="Spouse name" value={teacherForm.wifeOrHusbandOf} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, wifeOrHusbandOf: v }))} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Academic Profile</h4>
            <FormInput label="Subjects (comma separated)" placeholder="Mathematics, Abacus Level 1, Mental Math" value={teacherForm.subjects} onChange={(v: string) => setTeacherForm((p: any) => ({ ...p, subjects: v }))} />
          </div>
          {!editingTeacher && (
            <div className="flex items-start gap-3 bg-[#FFB347]/10 border border-[#FFB347]/30 rounded-xl px-4 py-3">
              <KeyRound size={15} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">A secure login password will be <span className="font-black text-[#1A1A2E]">auto-generated</span> and shown once after registration.</p>
            </div>
          )}
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : (editingTeacher ? Edit : Plus)}>
              {submitting ? "Saving…" : editingTeacher ? "Update Teacher" : "Register Teacher"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ID Card Modal */}
      <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Teacher ID Card" wide>
        {idCardTeacher && (
          <div className="space-y-5">
            <TeacherIDCard teacher={idCardTeacher} logoUrl={LOGO_URL} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button onClick={() => buildTeacherIDCardHTML(idCardTeacher, LOGO_URL).then(openPrintWindow)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Print / Save PDF
              </button>
              <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Certificate Modal */}
      <Modal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)} title="Experience Certificate Editor" wide>
        {certificateTeacher && (
          <CertificateEditor teacher={certificateTeacher} onClose={() => setIsCertificateModalOpen(false)} />
        )}
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Teacher Report" wide>
        {reportLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#FF6B6B]" size={32} /></div>
        ) : reportData && (
          <div className="space-y-4">
            <TeacherReport report={reportData} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button onClick={async () => { const html = await buildTeacherReportHTML(reportData); openPrintWindow(html); }}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Download PDF
              </button>
              <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Credentials Modal */}
      <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Teacher Login Credentials">
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

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Removal">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {teacherToDelete?.name}?</h4>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete their account and all records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Remove"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(255,107,107,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar{width:6px}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:#FFB34744;border-radius:6px}
      `}}/>
    </div>
  );
}