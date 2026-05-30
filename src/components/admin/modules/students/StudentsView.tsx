














'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Search, Trash2, X, AlertCircle,
  Loader2, Copy, Check, AlertTriangle, Pencil,
  KeyRound, Download, IdCard,
  Eye, MoreHorizontal, Camera, Upload,
  ToggleLeft, ToggleRight,
} from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS       = ["A", "B", "C", "D"];
const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
const CITIES         = ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior"];

const SCHOOL_NAME    = "Ascento Playschool";
const SCHOOL_TAGLINE = "Play School";
const SCHOOL_WEBSITE = "https://ascentoabacus.com/";
const SCHOOL_PHONE   = "+91 9810366417";
const SCHOOL_ADDRESS = "Ascento Playschool, Dwarka, New Delhi";

// Card dimensions — 20% narrower than original 260px
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

// ── Upload photo to Supabase Storage ──────────────────────────────────────────
async function uploadStudentPhoto(file: File, studentEmail: string): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("Not authenticated");

  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `student-photos/${studentEmail.replace(/[@.]/g, "_")}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("student-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("student-assets").getPublicUrl(path);
  return data.publicUrl;
}

// ── PDF via print window ───────────────────────────────────────────────────────
function openPrintWindow(htmlContent: string) {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) { alert("Please allow popups to download the PDF."); return; }
  win.document.write(htmlContent);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 800);
}

// ── Convert image URL to base64 ────────────────────────────────────────────────
async function urlToBase64(url: string): Promise<string> {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader    = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProgramLevel { id: string; name: string; sortOrder: number; }
interface Program      { id: string; name: string; hasLevels: boolean; levels: ProgramLevel[]; }

// ── UI primitives ──────────────────────────────────────────────────────────────
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

const BadgeChip = ({ text, color }: { text: string; color: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
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
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, type = "text", placeholder, required = false, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input type={type} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
  </div>
);

const ComboInput = ({ label, value, onChange, options, placeholder, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <input list={`list-${label}`} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors" />
    <datalist id={`list-${label}`}>{options.map((o: string) => <option key={o} value={o} />)}</datalist>
  </div>
);

const FormSelect = ({ label, options, required = false, value, onChange, placeholder = "Select..." }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
      {label} {required && <span className="text-[#FF6B6B]">*</span>}
    </label>
    <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
      <option value="">{placeholder}</option>
      {options.map((o: { value: string; label: string } | string) =>
        typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
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
      <button onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className={`p-2 border rounded-xl transition-all flex-shrink-0 ${copied ? "text-[#4ECDC4] border-[#4ECDC4]/40 bg-[#4ECDC4]/10" : "text-gray-400 border-[#F0EEF8] bg-white hover:text-[#FFB347]"}`}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}

// ── Photo Upload Component ─────────────────────────────────────────────────────
function PhotoUpload({ value, onChange, label = "Passport Photo" }: {
  value?: string;
  onChange: (url: string, file: File) => void;
  label?: string;
}) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader   = new FileReader();
    reader.onload  = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onChange("pending", file);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</label>
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

// ── Program Selector ───────────────────────────────────────────────────────────
function ProgramSelector({ programs, programId, programLevelId, onProgramChange, onLevelChange }: {
  programs: Program[]; programId: string; programLevelId: string;
  onProgramChange: (id: string) => void; onLevelChange: (id: string) => void;
}) {
  const selectedProgram = programs.find((p) => p.id === programId);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Program</label>
        <select value={programId} onChange={(e) => onProgramChange(e.target.value)}
          className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
          <option value="">Select program...</option>
          {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {selectedProgram && selectedProgram.levels.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
            {selectedProgram.hasLevels ? "Level" : "Class / Sub-group"}
          </label>
          <select value={programLevelId} onChange={(e) => onLevelChange(e.target.value)}
            className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors appearance-none cursor-pointer">
            <option value="">Select level...</option>
            {selectedProgram.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

// ── Student Form Fields ────────────────────────────────────────────────────────
function StudentFormFields({ form, setForm, programs, photoFile, setPhotoFile }: {
  form: any; setForm: (u: any) => void; programs: Program[];
  photoFile: File | null; setPhotoFile: (f: File | null) => void;
}) {
  const set = (key: string) => (v: string) => setForm((prev: any) => ({ ...prev, [key]: v }));

  useEffect(() => {
    if (!form.programId) return;
    const params = new URLSearchParams({ programId: form.programId });
    if (form.programLevelId) params.set("programLevelId", form.programLevelId);
    if (form.section)        params.set("section",        form.section);

    apiFetch(`/api/admin/students/next-roll-number?${params}`)
      .then((res) => {
        const roll = res.formatted ?? String(res.nextRollNumber ?? "");
        setForm((prev: any) => ({ ...prev, rollNumber: roll }));
      })
      .catch(() => {});
  }, [form.programId, form.programLevelId, form.section]);

  return (
    <div className="space-y-6">
      {/* Photo + Program row */}
      <div className="flex gap-5 items-start">
        <PhotoUpload
          value={form.photoUrl}
          label="Passport Photo"
          onChange={(url, file) => {
            setPhotoFile(file);
            setForm((prev: any) => ({ ...prev, photoUrl: url }));
          }}
        />
        <div className="flex-1 space-y-4">
          <h4 className="text-xs font-black text-[#FF6B6B] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Program Enrollment</h4>
          <ProgramSelector
            programs={programs} programId={form.programId ?? ""} programLevelId={form.programLevelId ?? ""}
            onProgramChange={(v) => setForm((prev: any) => ({ ...prev, programId: v, programLevelId: "", rollNumber: "" }))}
            onLevelChange={(v) => setForm((prev: any) => ({ ...prev, programLevelId: v, rollNumber: "" }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect label="Section" options={SECTIONS} value={form.section}
              onChange={(v: string) => setForm((prev: any) => ({ ...prev, section: v, rollNumber: "" }))} placeholder="No section" />
            <FormSelect label="Academic Year" options={ACADEMIC_YEARS} value={form.academicYear} onChange={set("academicYear")} placeholder="Select year" />
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                Roll Number{" "}
                {form.programId && (
                  <span className="ml-2 text-[#4ECDC4] normal-case tracking-normal font-medium text-[10px]">(auto-filled)</span>
                )}
              </label>
              <input
                type="text"
                placeholder="01"
                value={form.rollNumber ?? ""}
                onChange={(e) => set("rollNumber")(e.target.value)}
                className="w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FFB347] transition-colors"
              />
            </div>
            <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set("admissionDate")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#FFB347] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Student Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" placeholder="Aarav"  required value={form.firstName}  onChange={set("firstName")} />
          <FormInput label="Last Name"  placeholder="Sharma" required value={form.lastName}   onChange={set("lastName")} />
          <FormInput label="Student Email" type="email" placeholder="student@email.com" required value={form.email} onChange={set("email")} />
          <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
          <FormSelect label="Gender" options={["Male","Female","Other"]} value={form.gender} onChange={set("gender")} />
          <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={form.bloodGroup} onChange={set("bloodGroup")} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-[#A78BFA] uppercase tracking-[2px] border-b border-[#F0EEF8] pb-2">Parent & Contact Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Parent Name"  placeholder="Rahul Sharma"         required value={form.parentName}  onChange={set("parentName")} />
          <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX"               value={form.parentPhone} onChange={set("parentPhone")} />
          <FormInput label="Parent Email" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} />
          <ComboInput label="City" placeholder="Indore" options={CITIES}     value={form.city}  onChange={set("city")} />
          <FormInput label="State" placeholder="Madhya Pradesh"              value={form.state} onChange={set("state")} />
        </div>
        <FormInput label="Full Address" placeholder="123, Gandhi Nagar..." value={form.address} onChange={set("address")} />
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status, onClick, loading }: { status: string; onClick: () => void; loading?: boolean }) {
  const isActive = status === "Active";
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={`Click to ${isActive ? "disable" : "activate"} student`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
        isActive
          ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30 hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B] hover:border-[#FF6B6B]/30"
          : "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] hover:border-[#4ECDC4]/30"
      }`}
    >
      {loading
        ? <Loader2 size={10} className="animate-spin" />
        : isActive
          ? <ToggleRight size={13} />
          : <ToggleLeft  size={13} />
      }
      {status ?? "Active"}
    </button>
  );
}

// ── Actions Dropdown ───────────────────────────────────────────────────────────
function ActionsMenu({ student, onEdit, onDelete, onGeneratePassword, onViewReport, onDownloadReport, onViewIdCard }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { icon: Pencil,   label: "Edit",             color: "#FFB347", action: onEdit },
    { icon: KeyRound, label: "Generate Password", color: "#4ECDC4", action: onGeneratePassword },
    { icon: IdCard,   label: "View ID Card",      color: "#A78BFA", action: onViewIdCard },
    { icon: Eye,      label: "View Report",       color: "#64B6FF", action: onViewReport },
    { icon: Download, label: "Download Report",   color: "#6BCB77", action: onDownloadReport },
    { icon: Trash2,   label: "Delete",            color: "#FF6B6B", action: onDelete },
  ];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-2 text-gray-400 hover:text-[#FF6B6B] bg-white border border-[#F0EEF8] rounded-xl hover:border-[#FF6B6B]/30 transition-all shadow-sm">
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

// ── ID Card preview (modal) ────────────────────────────────────────────────────
// Card width is CARD_W (208px) — 20% narrower than original 260px
function IDCard({ student, logoUrl }: { student: any; logoUrl?: string }) {
  const admDate = student.admissionDate
    ? new Date(student.admissionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";
  const dob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const w = CARD_W;

  return (
    // Vertical stack: front on top, back below — matches physical card layout
    <div className="flex flex-col gap-4 items-center">

      {/* ── FRONT ── */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Front</p>
        <div style={{ width: w, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid #eee", fontFamily: "Arial, sans-serif" }}>
          {/* Top header */}
          <div style={{ background: "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)", padding: "8px 10px 6px", display: "flex", alignItems: "center", gap: 6 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width: 29, height: 29, borderRadius: 5, objectFit: "contain", background: "#fff", padding: 2, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 29, height: 29, background: "rgba(255,255,255,0.25)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 900, color: "#fff" }}>A</div>
            )}
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 11, lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
              {/* <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 7, lineHeight: 1.3 }}>{SCHOOL_TAGLINE}</div> */}
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 6.5, marginTop: 2 }}>Adm. No.: {student.studentId ?? "—"}</div>
            </div>
          </div>

          {/* Pink wave top decoration */}
          <div style={{ background: "#fff", position: "relative", overflow: "hidden" }}>
            <svg viewBox={`0 0 ${w} 14`} style={{ display: "block", width: "100%" }}>
              <path d={`M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z`} fill="#e91e8c" opacity="0.15"/>
            </svg>
          </div>

          {/* Photo area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 10px 8px" }}>
            <div style={{
              width: 64, height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #e91e8c",
              background: "#f8f8f8",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {student.photoUrl ? (
                <img src={student.photoUrl} alt={student.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 22, fontWeight: 900, color: "#e91e8c" }}>{student.fullName?.[0]?.toUpperCase() ?? "?"}</span>
              )}
            </div>
          </div>

          {/* Info rows */}
          <div style={{ padding: "0 11px 5px", fontSize: 8 }}>
            {[
              ["Name",     student.fullName ?? "—"],
              ["D.O.B",    dob],
              ["Adm Date", admDate],
              ["Mob.",     student.parentPhone ?? "—"],
              ["Class",    student.programLevel?.name ?? student.program?.name ?? "—"],
              ["P. Name",  student.parentName ?? "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 3, marginBottom: 3, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, color: "#333", width: 44, flexShrink: 0 }}>{label}</span>
                <span style={{ color: "#555", fontWeight: 600 }}>: &nbsp;{value}</span>
              </div>
            ))}
            {student.bloodGroup && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                <span style={{ fontWeight: 700, color: "#333", width: 44 }}>Blood</span>
                <span style={{ color: "#e91e8c", fontWeight: 900 }}>: &nbsp;{student.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Auth sign area */}
          <div style={{ padding: "3px 11px", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ borderBottom: "1px solid #aaa", width: 48, marginBottom: 2 }} />
              <div style={{ fontSize: 6.5, color: "#777" }}>Auth. Sign.</div>
            </div>
          </div>

          {/* Bottom wave */}
          <svg viewBox={`0 0 ${w} 18`} style={{ display: "block", width: "100%", marginTop: 2 }}>
            <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#e91e8c"/>
            <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* ── BACK ── */}
      <div style={{ width: w }} className="flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Back</p>
        <div style={{ width: w, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid #eee", fontFamily: "Arial, sans-serif" }}>
          {/* Top wave */}
          <svg viewBox={`0 0 ${w} 22`} style={{ display: "block", width: "100%" }}>
            <path d={`M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z`} fill="#9c27b0" opacity="0.6"/>
            <path d={`M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z`} fill="#e91e8c"/>
          </svg>

          {/* Logo + school name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 11px 6px", textAlign: "center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width: 38, height: 38, borderRadius: 7, objectFit: "contain", marginBottom: 5 }} />
            ) : (
              <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#e91e8c,#9c27b0)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 5, fontSize: 16, fontWeight: 900, color: "#fff" }}>A</div>
            )}
            <div style={{ fontWeight: 900, fontSize: 11, color: "#1a1a2e", lineHeight: 1.2 }}>{SCHOOL_NAME}</div>
            {/* <div style={{ fontSize: 7, color: "#666", marginTop: 2 }}>{SCHOOL_TAGLINE}</div> */}
          </div>

          <div style={{ height: 1, background: "#f0eef8", margin: "0 11px" }} />

          {/* School address block */}
          <div style={{ padding: "6px 11px", textAlign: "center", fontSize: 7.5, color: "#444", lineHeight: 1.6 }}>
            <div>{SCHOOL_ADDRESS}</div>
            <div>{SCHOOL_WEBSITE}</div>
            <div>Mob.: {SCHOOL_PHONE}</div>
          </div>

          <div style={{ height: 1, background: "#f0eef8", margin: "0 11px" }} />

          {/* If found */}
          <div style={{ padding: "6px 11px 5px", textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 8.5, color: "#e91e8c", marginBottom: 3 }}>Finder may please<br />return to</div>
            <div style={{ fontSize: 7.5, color: "#444", lineHeight: 1.6 }}>
              {student.address ? <>{student.address}<br /></> : null}
              {[student.city, student.state].filter(Boolean).join(", ") || "—"}<br />
              Mob.: {student.parentPhone ?? "—"}
            </div>
          </div>

          {/* Status chip */}
          <div style={{ display: "flex", justifyContent: "center", padding: "3px 11px 5px" }}>
            <div style={{ background: "#4ecdc422", border: "1px solid #4ecdc444", borderRadius: 20, padding: "2px 8px", display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ecdc4" }} />
              <span style={{ fontSize: 7, fontWeight: 900, color: "#4ecdc4" }}>{student.status ?? "Active"}</span>
            </div>
          </div>

          {/* Bottom wave */}
          <svg viewBox={`0 0 ${w} 18`} style={{ display: "block", width: "100%", marginTop: 3 }}>
            <path d={`M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z`} fill="#e91e8c"/>
            <path d={`M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z`} fill="#9c27b0" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── ID Card PDF HTML ─────────────────────────────────────────────────────────
// Portrait A4, vertically stacked front then back, card width = CARD_W (208px)
async function buildIDCardHTML(student: any, logoUrl?: string): Promise<string> {
  let photoSrc = "";
  if (student.photoUrl) {
    const b64 = await urlToBase64(student.photoUrl);
    if (b64) photoSrc = b64;
  }

  let logoSrc = "";
  if (logoUrl) {
    const b64 = await urlToBase64(logoUrl);
    if (b64) logoSrc = b64;
  }

  const admDate = student.admissionDate
    ? new Date(student.admissionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";
  const dob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const w = CARD_W;

  const logoImgFront = logoSrc
    ? `<img src="${logoSrc}" class="logo-img" />`
    : `<div class="logo-av">A</div>`;
  const logoImgBack = logoSrc
    ? `<img src="${logoSrc}" class="logo-back" />`
    : `<div class="logo-av-back">A</div>`;

  const photoHtml = photoSrc
    ? `<img src="${photoSrc}" class="photo" />`
    : `<div class="photo-av">${(student.fullName?.[0] ?? "?").toUpperCase()}</div>`;

  const addrLine = [student.address, student.city, student.state].filter(Boolean).join(", ") || "—";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ID Card — ${student.fullName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  @page {
    size: A4 portrait;
    margin: 15mm;
  }

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

  .card {
    width: ${w}px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border: 1px solid #eee;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* ── FRONT ── */
  .header {
    background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%);
    padding: 8px 10px 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .logo-img  { width:29px; height:29px; border-radius:5px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0; }
  .logo-av   { width:29px; height:29px; border-radius:5px; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; color:#fff; flex-shrink:0; }
  .header-text .school { color:#fff; font-weight:900; font-size:11px; line-height:1.2; }
  .header-text .tag    { color:rgba(255,255,255,0.8); font-size:7px; line-height:1.3; }
  .header-text .adm    { color:rgba(255,255,255,0.7); font-size:6.5px; margin-top:2px; }

  .wave-top svg { display:block; width:100%; }

  .photo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px 8px;
    flex-shrink: 0;
  }
  .photo    { width:64px; height:72px; border-radius:50%; object-fit:cover; border:3px solid #e91e8c; }
  .photo-av { width:64px; height:72px; border-radius:50%; background:#f3e5f5; border:3px solid #e91e8c; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#e91e8c; }

  .info { padding: 0 11px 5px; font-size:8px; }
  .row  { display:flex; gap:3px; margin-bottom:3px; align-items:flex-start; }
  .lbl  { font-weight:700; color:#333; width:44px; flex-shrink:0; }
  .val  { color:#555; font-weight:600; }
  .blood { color:#e91e8c !important; font-weight:900 !important; }

  .sign       { padding:3px 11px; display:flex; justify-content:flex-end; }
  .sign-inner { text-align:center; }
  .sign-line  { border-bottom:1px solid #aaa; width:48px; margin-bottom:2px; }
  .sign-label { font-size:6.5px; color:#777; }

  .wave-bot svg { display:block; width:100%; margin-top:2px; }

  /* ── BACK ── */
  .wave-top-back svg { display:block; width:100%; }
  .back-logo  { display:flex; flex-direction:column; align-items:center; padding:8px 11px 6px; text-align:center; }
  .logo-back  { width:38px; height:38px; border-radius:7px; object-fit:contain; margin-bottom:5px; }
  .logo-av-back { width:38px; height:38px; border-radius:7px; background:linear-gradient(135deg,#e91e8c,#9c27b0); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:#fff; margin-bottom:5px; }
  .back-school { font-weight:900; font-size:11px; color:#1a1a2e; line-height:1.2; }
  .back-tag    { font-size:7px; color:#666; margin-top:2px; }

  .divider { height:1px; background:#f0eef8; margin:0 11px; }

  .back-addr   { padding:6px 11px; text-align:center; font-size:7.5px; color:#444; line-height:1.6; }
  .finder      { padding:6px 11px; text-align:center; }
  .finder-title { font-weight:900; font-size:8.5px; color:#e91e8c; margin-bottom:3px; line-height:1.3; }
  .finder-addr  { font-size:7.5px; color:#444; line-height:1.6; }

  .status-chip { display:flex; justify-content:center; padding:3px 0 5px; }
  .chip        { background:#4ecdc422; border:1px solid #4ecdc444; border-radius:20px; padding:2px 8px; display:flex; align-items:center; gap:3px; }
  .dot         { width:4px; height:4px; border-radius:50%; background:#4ecdc4; }
  .chip-txt    { font-size:7px; font-weight:900; color:#4ecdc4; }

  .card-label {
    text-align: center;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #aaa;
    margin-bottom: 6px;
  }

  .card-wrapper { display: flex; flex-direction: column; align-items: center; }

  @media print {
    body { background: #fff; gap: 16px; padding: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
        <div class="adm">Adm. No.: ${student.studentId ?? "—"}</div>
      </div>
    </div>
    <div class="wave-top">
      <svg viewBox="0 0 ${w} 14"><path d="M0,14 Q${w*0.25},0 ${w*0.5},8 Q${w*0.75},16 ${w},3 L${w},0 L0,0 Z" fill="#e91e8c" opacity="0.15"/></svg>
    </div>
    <div class="photo-wrap">${photoHtml}</div>
    <div class="info">
      <div class="row"><span class="lbl">Name</span><span class="val">: &nbsp;${student.fullName ?? "—"}</span></div>
      <div class="row"><span class="lbl">D.O.B</span><span class="val">: &nbsp;${dob}</span></div>
      <div class="row"><span class="lbl">Adm Date</span><span class="val">: &nbsp;${admDate}</span></div>
      <div class="row"><span class="lbl">Mob.</span><span class="val">: &nbsp;${student.parentPhone ?? "—"}</span></div>
      <div class="row"><span class="lbl">Class</span><span class="val">: &nbsp;${student.programLevel?.name ?? student.program?.name ?? "—"}</span></div>
      <div class="row"><span class="lbl">P. Name</span><span class="val">: &nbsp;${student.parentName ?? "—"}</span></div>
      ${student.bloodGroup ? `<div class="row"><span class="lbl">Blood</span><span class="val blood">: &nbsp;${student.bloodGroup}</span></div>` : ""}
    </div>
    <div class="sign"><div class="sign-inner"><div class="sign-line"></div><div class="sign-label">Auth. Sign.</div></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity="0.6"/></svg>
    </div>
  </div>
</div>

<!-- BACK -->
<div class="card-wrapper">
  <div class="card-label">Back</div>
  <div class="card">
    <div class="wave-top-back">
      <svg viewBox="0 0 ${w} 22"><path d="M0,0 L${w},0 L${w},13 Q${w*0.75},22 ${w*0.5},16 Q${w*0.25},10 0,19 Z" fill="#9c27b0" opacity="0.6"/><path d="M0,0 L${w},0 L${w},8 Q${w*0.75},18 ${w*0.5},11 Q${w*0.25},5 0,14 Z" fill="#e91e8c"/></svg>
    </div>
    <div class="back-logo">
      ${logoImgBack}
      <div class="back-school">${SCHOOL_NAME}</div>
    </div>
    <div class="divider"></div>
    <div class="back-addr">
      ${SCHOOL_ADDRESS}<br/>
      ${SCHOOL_WEBSITE}<br/>
      Mob.: ${SCHOOL_PHONE}
    </div>
    <div class="divider"></div>
    <div class="finder">
      <div class="finder-title">Finder may please<br/>return to</div>
      <div class="finder-addr">${addrLine}<br/>Mob.: ${student.parentPhone ?? "—"}</div>
    </div>
    <div class="status-chip"><div class="chip"><div class="dot"></div><span class="chip-txt">${student.status ?? "Active"}</span></div></div>
    <div class="wave-bot">
      <svg viewBox="0 0 ${w} 18"><path d="M0,18 L0,10 Q${w*0.25},0 ${w*0.5},6 Q${w*0.75},13 ${w},5 L${w},18 Z" fill="#e91e8c"/><path d="M0,18 L0,13 Q${w*0.25},3 ${w*0.5},10 Q${w*0.75},16 ${w},8 L${w},18 Z" fill="#9c27b0" opacity="0.6"/></svg>
    </div>
  </div>
</div>

</body>
</html>`;
}

// ── Report PDF HTML ────────────────────────────────────────────────────────────
async function buildReportHTML(r: any): Promise<string> {
  const addr      = [r.address, r.city, r.state].filter(Boolean).join(", ") || "—";
  const enrolled  = r.enrolledAt    ? new Date(r.enrolledAt).toLocaleDateString("en-IN",    { year:"numeric", month:"long", day:"numeric" }) : "—";
  const admDate   = r.admissionDate ? new Date(r.admissionDate).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—";
  const generated = new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });

  const fields: [string,string][] = [
    ["Student ID",    r.studentId],
    ["Full Name",     r.fullName],
    ["Email",         r.email ?? "—"],
    ["Date of Birth", r.dateOfBirth ?? "—"],
    ["Admission Date",admDate],
    ["Gender",        r.gender ?? "—"],
    ["Blood Group",   r.bloodGroup ?? "—"],
    ["Program",       r.program?.name ?? "—"],
    ["Level / Class", r.level?.name ?? "—"],
    ["Section",       r.section ? `Section ${r.section}` : "—"],
    ["Roll Number",   r.rollNumber ?? "—"],
    ["Academic Year", r.academicYear ?? "—"],
    ["Status",        r.status ?? "—"],
    ["Parent Name",   r.parentName ?? "—"],
    ["Parent Phone",  r.parentPhone ?? "—"],
    ["Parent Email",  r.parentEmail ?? "—"],
    ["Address",       addr],
    ["Enrolled At",   enrolled],
  ];

  let photoHtml = "";
  if (r.photoUrl) {
    const b64 = await urlToBase64(r.photoUrl);
    if (b64) photoHtml = `<img src="${b64}" alt="Student Photo" class="report-photo" />`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Student Report — ${r.fullName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; color:#1A1A2E; padding:20px; }
  .hdr { background:linear-gradient(135deg,#e91e8c,#9c27b0); border-radius:12px; padding:20px 24px; color:#fff; margin-bottom:18px; display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
  .hdr-left  { flex:1; }
  .school    { font-size:9px; font-weight:900; letter-spacing:2px; text-transform:uppercase; opacity:.8; margin-bottom:4px; }
  h1         { font-size:22px; font-weight:900; line-height:1.2; }
  .sid       { font-family:monospace; font-size:11px; opacity:.7; margin-top:3px; }
  .badges    { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
  .badge     { background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); padding:2px 10px; border-radius:20px; font-size:9px; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
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
    <div class="school">${SCHOOL_NAME} · ${SCHOOL_TAGLINE}</div>
    <h1>${r.fullName}</h1>
    <div class="sid">${r.studentId}</div>
    <div class="badges">
      ${r.program ? `<span class="badge">${r.program.name}</span>` : ""}
      ${r.level   ? `<span class="badge">${r.level.name}</span>`   : ""}
      ${r.section ? `<span class="badge">Sec ${r.section}</span>`  : ""}
    </div>
  </div>
  <div class="hdr-right">
    ${photoHtml}
    <div class="date">Generated: ${generated}</div>
  </div>
</div>
<div class="grid">
  ${fields.map(([l,v]) => `<div class="cell"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("")}
</div>
<div class="footer">${SCHOOL_NAME} · ${SCHOOL_TAGLINE} · Student Report</div>
</body>
</html>`;
}

// ── Report modal preview ───────────────────────────────────────────────────────
function StudentReport({ report }: { report: any }) {
  const admDate = report.admissionDate
    ? new Date(report.admissionDate).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })
    : "—";
  const fields: [string,string][] = [
    ["Student ID",    report.studentId],
    ["Full Name",     report.fullName],
    ["Email",         report.email ?? "—"],
    ["Date of Birth", report.dateOfBirth ?? "—"],
    ["Admission Date",admDate],
    ["Gender",        report.gender ?? "—"],
    ["Blood Group",   report.bloodGroup ?? "—"],
    ["Program",       report.program?.name ?? "—"],
    ["Level / Class", report.level?.name ?? "—"],
    ["Section",       report.section ? `Section ${report.section}` : "—"],
    ["Roll Number",   report.rollNumber ?? "—"],
    ["Academic Year", report.academicYear ?? "—"],
    ["Status",        report.status ?? "—"],
    ["Parent Name",   report.parentName ?? "—"],
    ["Parent Phone",  report.parentPhone ?? "—"],
    ["Parent Email",  report.parentEmail ?? "—"],
    ["Address",       [report.address, report.city, report.state].filter(Boolean).join(", ") || "—"],
    ["Enrolled At",   report.enrolledAt ? new Date(report.enrolledAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : "—"],
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] rounded-2xl p-5 text-white">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80 mb-1">{SCHOOL_NAME} · {SCHOOL_TAGLINE}</p>
            <p className="text-2xl font-black">{report.fullName}</p>
            <p className="font-mono text-white/75 text-sm mt-0.5">{report.studentId}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {report.program && <BadgeChip text={report.program.name} color="#fff" />}
              {report.level   && <BadgeChip text={report.level.name}   color="#fff" />}
              {report.section && <BadgeChip text={`Section ${report.section}`} color="#fff" />}
            </div>
          </div>
          {report.photoUrl && (
            <img src={report.photoUrl} alt={report.fullName}
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

// ── Main ───────────────────────────────────────────────────────────────────────
export default function StudentsView() {
  const [studentsData,  setStudentsData]  = useState<any[]>([]);
  const [programs,      setPrograms]      = useState<Program[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");   // ← NEW

  const [isAddModalOpen,         setIsAddModalOpen]         = useState(false);
  const [isEditModalOpen,        setIsEditModalOpen]        = useState(false);
  const [isDeleteModalOpen,      setIsDeleteModalOpen]      = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isIdCardModalOpen,      setIsIdCardModalOpen]      = useState(false);
  const [isReportModalOpen,      setIsReportModalOpen]      = useState(false);

  const [editingStudent,   setEditingStudent]   = useState<any>(null);
  const [studentToDelete,  setStudentToDelete]  = useState<any>(null);
  const [idCardStudent,    setIdCardStudent]    = useState<any>(null);
  const [reportData,       setReportData]       = useState<any>(null);
  const [credentials,      setCredentials]      = useState<{ studentId: string; email: string; password: string } | null>(null);
  const [submitting,       setSubmitting]       = useState(false);
  const [reportLoading,    setReportLoading]    = useState(false);
  const [toast,            setToast]            = useState<string | null>(null);
  const [addForm,          setAddForm]          = useState<any>({});
  const [editForm,         setEditForm]         = useState<any>({});
  const [addPhotoFile,     setAddPhotoFile]     = useState<File | null>(null);
  const [editPhotoFile,    setEditPhotoFile]    = useState<File | null>(null);
  // Track which student's status is being toggled
  const [togglingStatus,   setTogglingStatus]   = useState<string | null>(null);

  const LOGO_URL = "/Acento-Logo.jpg";

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const fetchPrograms = useCallback(async () => {
    try { const r = await apiFetch("/api/admin/programs"); setPrograms(r.programs ?? []); } catch {}
  }, []);
  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const fetchStudents = useCallback(async (q = "", prog = "", sec = "", stat = "") => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ search: q, limit: "100" });
      if (prog) p.set("programId", prog);
      if (sec)  p.set("section", sec);
      if (stat) p.set("status", stat);      // ← NEW
      const r = await apiFetch(`/api/admin/students?${p}`);
      setStudentsData(r.students ?? []);
    } catch { showToast("Failed to load students"); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter), 350);
    return () => clearTimeout(t);
  }, [studentSearch, programFilter, sectionFilter, statusFilter, fetchStudents]);

  // ── Toggle Active / Disabled ──────────────────────────────────────────────
  const handleToggleStatus = async (student: any) => {
    const newStatus = student.status === "Active" ? "Disabled" : "Active";
    setTogglingStatus(student.id);
    try {
      await apiFetch(`/api/admin/students/${student.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Student ${newStatus === "Active" ? "activated — login re-enabled" : "disabled — login blocked"}`);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
    setTogglingStatus(null);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email) {
      showToast("First name, last name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (addPhotoFile) {
        try { photoUrl = await uploadStudentPhoto(addPhotoFile, addForm.email); }
        catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`); setSubmitting(false); return; }
      }
      const res = await apiFetch("/api/admin/students", {
        method: "POST",
        body: JSON.stringify({
          fullName:      `${addForm.firstName} ${addForm.lastName}`,
          email:         addForm.email,
          photoUrl,
          admissionDate: addForm.admissionDate || null,
          dateOfBirth:   addForm.dateOfBirth,
          gender:        addForm.gender,
          bloodGroup:    addForm.bloodGroup,
          rollNumber:    addForm.rollNumber,
          parentName:    addForm.parentName,
          parentPhone:   addForm.parentPhone,
          parentEmail:   addForm.parentEmail,
          address:       addForm.address,
          city:          addForm.city,
          state:         addForm.state,
          section:       addForm.section       || null,
          academicYear:  addForm.academicYear  || null,
          programId:     addForm.programId     || null,
          programLevelId:addForm.programLevelId|| null,
        }),
      });
      if (res.credentials) { setCredentials(res.credentials); setIsCredentialsModalOpen(true); }
      setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(false);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) {
      let msg = err.message || "Failed to add student";
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg);
    }
    setSubmitting(false);
  };

  const openEdit = (student: any) => {
    const [firstName, ...rest] = (student.fullName ?? "").split(" ");
    setEditForm({
      firstName, lastName: rest.join(" "), email: student.user?.email ?? "",
      dateOfBirth:   student.dateOfBirth   ? student.dateOfBirth.slice(0, 10)   : "",
      admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : "",
      gender: student.gender ?? "", bloodGroup: student.bloodGroup ?? "",
      rollNumber: student.rollNumber ?? "", section: student.section ?? "",
      academicYear: student.academicYear ?? "", parentName: student.parentName ?? "",
      parentPhone: student.parentPhone ?? "", parentEmail: student.parentEmail ?? "",
      city: student.city ?? "", state: student.state ?? "", address: student.address ?? "",
      programId: student.programId ?? "", programLevelId: student.programLevelId ?? "",
      photoUrl: student.photoUrl ?? "",
    });
    setEditPhotoFile(null);
    setEditingStudent(student); setIsEditModalOpen(true);
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSubmitting(true);
    try {
      let photoUrl = editForm.photoUrl || null;
      if (editPhotoFile) {
        try { photoUrl = await uploadStudentPhoto(editPhotoFile, editForm.email || editingStudent.user?.email || editingStudent.id); }
        catch (photoErr: any) { showToast(`Photo upload failed: ${photoErr.message}`); setSubmitting(false); return; }
      }
      await apiFetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          fullName:      `${editForm.firstName} ${editForm.lastName}`,
          photoUrl:      photoUrl ?? undefined,
          admissionDate: editForm.admissionDate || null,
          dateOfBirth:   editForm.dateOfBirth,
          gender:        editForm.gender,
          bloodGroup:    editForm.bloodGroup,
          rollNumber:    editForm.rollNumber,
          parentName:    editForm.parentName,
          parentPhone:   editForm.parentPhone,
          parentEmail:   editForm.parentEmail,
          address:       editForm.address,
          city:          editForm.city,
          state:         editForm.state,
          section:       editForm.section       || null,
          academicYear:  editForm.academicYear  || null,
          programId:     editForm.programId     || null,
          programLevelId:editForm.programLevelId|| null,
        }),
      });
      showToast("Student updated successfully");
      setIsEditModalOpen(false); setEditingStudent(null); setEditPhotoFile(null);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch (err: any) { showToast(err.message || "Failed to update student"); }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/students/${studentToDelete.id}`, { method: "DELETE" });
      showToast("Student deleted successfully");
      setIsDeleteModalOpen(false); setStudentToDelete(null);
      fetchStudents(studentSearch, programFilter, sectionFilter, statusFilter);
    } catch { showToast("Failed to delete student"); }
    setSubmitting(false);
  };

  const handleGeneratePassword = async (student: any) => {
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/generate-password`, { method: "POST" });
      setCredentials(res); setIsCredentialsModalOpen(true);
    } catch { showToast("Failed to generate password"); }
  };

  const fetchReport = async (student: any, download = false) => {
    setReportLoading(true);
    try {
      const res = await apiFetch(`/api/admin/students/${student.id}/report`);
      if (download) {
        const html = await buildReportHTML(res.report);
        openPrintWindow(html);
      } else {
        setReportData(res.report);
        setIsReportModalOpen(true);
      }
    } catch { showToast("Failed to load report"); }
    setReportLoading(false);
  };

  const handleDownloadIdCard = async (student: any) => {
    const html = await buildIDCardHTML(student, LOGO_URL);
    openPrintWindow(html);
  };

  const avatarGradients = [
    "linear-gradient(135deg,#e91e8c,#c2185b)",
    "linear-gradient(135deg,#9c27b0,#7b1fa2)",
    "linear-gradient(135deg,#FF6B6B,#FFB347)",
  ];

  const hasActiveFilters = programFilter || sectionFilter || studentSearch || statusFilter;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Students Directory</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{studentsData.length} students</p>
        </div>
        <GradientButton icon={Plus} onClick={() => { setAddForm({}); setAddPhotoFile(null); setIsAddModalOpen(true); }}>Add Student</GradientButton>
      </div>

      <Card className="overflow-visible">
        <div className="p-5 border-b border-[#F0EEF8] flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by name, ID, parent..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-11 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FFB347] focus:ring-4 focus:ring-[#FFB347]/10 transition-all shadow-sm" />
          </div>

          {/* Program filter */}
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[160px]">
            <option value="">All Programs</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Section filter */}
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>

          {/* Status filter ← NEW */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FFB347] shadow-sm cursor-pointer appearance-none min-w-[130px]">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={() => { setProgramFilter(""); setSectionFilter(""); setStudentSearch(""); setStatusFilter(""); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#e91e8c]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-bold text-gray-500">Loading students...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FFFDF7] border-b border-[#F0EEF8]">
                <tr>
                  {["","ID","Student","Program","Level / Class","Section","Academic Year","Parent","Status","Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {studentsData.length > 0 ? studentsData.map((s, i) => (
                  <tr key={s.id} className="hover:bg-[#FFFDF7] transition-colors group">
                    {/* Avatar */}
                    <td className="pl-5 py-3 pr-0">
                      <div className="w-9 h-11 rounded-lg overflow-hidden border border-[#F0EEF8] bg-[#FFFDF7] flex items-center justify-center flex-shrink-0">
                        {s.photoUrl ? (
                          <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div style={{ background: avatarGradients[i % 3] }} className="w-full h-full flex items-center justify-center text-white text-xs font-black">
                            {s.fullName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Student ID */}
                    <td className="px-5 py-4 text-xs font-bold text-gray-400 font-mono whitespace-nowrap">{s.studentId}</td>
                    {/* Name + email */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#e91e8c] transition-colors">{s.fullName}</p>
                        <p className="text-xs text-gray-400">{s.user?.email ?? "—"}</p>
                      </div>
                    </td>
                    {/* Program */}
                    <td className="px-5 py-4">{s.program ? <span className="text-xs font-black text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-lg border border-[#e91e8c]/20">{s.program.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    {/* Level */}
                    <td className="px-5 py-4">{s.programLevel ? <span className="text-xs font-black text-[#9c27b0] bg-[#9c27b0]/10 px-2 py-0.5 rounded-lg border border-[#9c27b0]/20">{s.programLevel.name}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    {/* Section */}
                    <td className="px-5 py-4">{s.section ? <span className="text-xs font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-lg border border-[#4ECDC4]/20">Sec {s.section}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    {/* Academic Year */}
                    <td className="px-5 py-4 text-xs font-bold text-gray-500">{s.academicYear ?? "—"}</td>
                    {/* Parent */}
                    <td className="px-5 py-4 text-xs font-medium text-gray-600">{s.parentName ?? "—"}</td>
                    {/* Status toggle ← NEW */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={s.status ?? "Active"}
                        loading={togglingStatus === s.id}
                        onClick={() => handleToggleStatus(s)}
                      />
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionsMenu
                          student={s}
                          onEdit={() => openEdit(s)}
                          onDelete={() => { setStudentToDelete(s); setIsDeleteModalOpen(true); }}
                          onGeneratePassword={() => handleGeneratePassword(s)}
                          onViewReport={() => fetchReport(s, false)}
                          onDownloadReport={() => fetchReport(s, true)}
                          onViewIdCard={() => { setIdCardStudent(s); setIsIdCardModalOpen(true); }}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={10} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Search size={24} className="text-gray-300 mb-3" />
                      <p className="text-base font-bold text-[#1A1A2E]">No students found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ADD MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student" wide>
        <form onSubmit={handleAddStudent} className="space-y-6">
          <StudentFormFields form={addForm} setForm={setAddForm} programs={programs} photoFile={addPhotoFile} setPhotoFile={setAddPhotoFile} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Plus}>{submitting ? "Registering..." : "Register Student"}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit — ${editingStudent?.fullName}`} wide>
        <form onSubmit={handleEditStudent} className="space-y-6">
          <StudentFormFields form={editForm} setForm={setEditForm} programs={programs} photoFile={editPhotoFile} setPhotoFile={setEditPhotoFile} />
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <GradientButton type="submit" disabled={submitting} icon={submitting ? Loader2 : Pencil}>{submitting ? "Saving..." : "Save Changes"}</GradientButton>
          </div>
        </form>
      </Modal>

      {/* ID CARD MODAL */}
      <Modal isOpen={isIdCardModalOpen} onClose={() => setIsIdCardModalOpen(false)} title="Student ID Card" wide>
        {idCardStudent && (
          <div className="space-y-5">
            <IDCard student={idCardStudent} logoUrl={LOGO_URL} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button
                onClick={() => handleDownloadIdCard(idCardStudent)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Print / Save PDF
              </button>
              <GradientButton onClick={() => setIsIdCardModalOpen(false)}>Done</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* REPORT MODAL */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Student Report" wide>
        {reportLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#e91e8c]" size={32} /></div>
        ) : reportData && (
          <div className="space-y-4">
            <StudentReport report={reportData} />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
              <button onClick={async () => { const html = await buildReportHTML(reportData); openPrintWindow(html); }}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download size={16} /> Download PDF
              </button>
              <GradientButton onClick={() => setIsReportModalOpen(false)}>Close</GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* CREDENTIALS MODAL */}
      <Modal isOpen={isCredentialsModalOpen} onClose={() => { setIsCredentialsModalOpen(false); setCredentials(null); }} title="Student Credentials">
        <div className="space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">The password is shown <span className="font-black text-[#e91e8c]">only once</span>. Save it now.</p>
          {credentials && (
            <div className="space-y-3">
              <CredentialRow label="Student ID"         value={credentials.studentId} />
              <CredentialRow label="Email"              value={credentials.email} />
              <CredentialRow label="Temporary Password" value={credentials.password} mono />
            </div>
          )}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-700">Share and ask the student to change password after first login.</p>
          </div>
          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end">
            <GradientButton onClick={() => { setIsCredentialsModalOpen(false); setCredentials(null); }}>Done</GradientButton>
          </div>
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Remove {studentToDelete?.fullName}?</h4>
            <p className="text-sm text-gray-500 mt-2">This will permanently delete the student and all associated records.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#e91e8c] to-[#9c27b0] text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(233,30,140,0.4)] z-[999] animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar{width:6px}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:#e91e8c44;border-radius:6px}
      `}}/>
    </div>
  );
}