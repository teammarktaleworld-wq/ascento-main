"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Plus, Search, Trash2, X, Loader2, Edit,
  Megaphone, AlertTriangle, Info, Bell,
  Calendar, Users, ToggleLeft, ToggleRight,
  Paperclip, FileText, Image as ImageIcon,
  Send, Mail, CheckCircle, XCircle, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ── API helper ────────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiUpload(file: File, token: string) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/announcements/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ fileUrl: string; storagePath: string; fileType: string; fileName: string }>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Program { id: string; name: string; levels: { id: string; name: string }[] }
interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "info" | "normal" | "urgent";
  audience: "all" | "students" | "teachers" | "program" | "level";
  programId: string | null;
  levelId: string | null;
  fileUrl: string | null;
  fileType: string | null;
  fileName: string | null;
  expiresAt: string | null;
  isActive: boolean;
  emailSent: boolean;
  createdAt: string;
  program?: { id: string; name: string } | null;
  level?: { id: string; name: string } | null;
}

interface FormState {
  title: string; message: string;
  priority: string; audience: string;
  programId: string; levelId: string;
  expiresAt: string; sendEmail: boolean;
  fileUrl: string; storagePath: string;
  fileType: string; fileName: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PRIORITY_CFG = {
  info:   { label: "Info",   color: "#4ECDC4", bg: "#4ECDC418", Icon: Info          },
  normal: { label: "Normal", color: "#FFB347", bg: "#FFB34718", Icon: Bell          },
  urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FF6B6B18", Icon: AlertTriangle },
};
const AUDIENCE_LABEL: Record<string, string> = {
  all: "Everyone", students: "All Students",
  teachers: "Teachers Only", program: "Program", level: "Level",
};
const EMPTY_FORM: FormState = {
  title: "", message: "", priority: "normal", audience: "all",
  programId: "", levelId: "", expiresAt: "", sendEmail: false,
  fileUrl: "", storagePath: "", fileType: "", fileName: "",
};

// ── Primitives ────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[24px] border border-[#F0EEF8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children, onClick, icon: Icon, className = "", type = "button", disabled }: any) => (
  <button type={type} onClick={onClick} disabled={disabled}
    className={`bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${!disabled ? "hover:shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-0.5" : ""} ${className}`}>
    {Icon && <Icon size={18} className={disabled ? "animate-spin" : ""} />}
    {children}
  </button>
);

const Modal = ({ isOpen, onClose, title, children, wide = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full ${wide ? "max-w-3xl" : "max-w-2xl"} flex flex-col`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-[#F0EEF8] bg-[#FFFDF7] rounded-t-[24px]">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-h-0" style={{ scrollbarWidth: "thin" }}>{children}</div>
      </div>
    </div>
  );
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
    {children} {required && <span className="text-[#FF6B6B]">*</span>}
  </label>
);

const inputCls = "w-full bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#FF6B6B] transition-colors";

// ── Main Component ────────────────────────────────────────────────────────────
export default function AnnouncementsView() {
  const [items,      setItems]      = useState<Announcement[]>([]);
  const [programs,   setPrograms]   = useState<Program[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

  const [isFormOpen,   setIsFormOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen,   setIsViewOpen]   = useState(false);

  const [editing,   setEditing]   = useState<Announcement | null>(null);
  const [toDelete,  setToDelete]  = useState<Announcement | null>(null);
  const [viewing,   setViewing]   = useState<Announcement | null>(null);
  const [form,      setForm]      = useState<FormState>(EMPTY_FORM);
  const [emailResult, setEmailResult] = useState<{ sent: number; failed: number } | null>(null);

  const [search,    setSearch]    = useState("");
  const [fAud,      setFAud]      = useState("");
  const [fPri,      setFPri]      = useState("");
  const [fActive,   setFActive]   = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ann, prog] = await Promise.all([
        apiFetch("/api/admin/announcements"),
        apiFetch("/api/admin/programs"),
      ]);
      setItems(ann ?? []);
      setPrograms(prog.programs ?? []);
    } catch { showToast("Failed to load data", false); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedProgram = programs.find((p) => p.id === form.programId);
  const levels = selectedProgram?.levels ?? [];

  const filtered = useMemo(() =>
    items.filter((a) => {
      const q = search.toLowerCase();
      const matchQ   = !q || a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
      const matchAud = !fAud || a.audience === fAud;
      const matchPri = !fPri || a.priority === fPri;
      const matchAct = !fActive || (fActive === "active" ? a.isActive : !a.isActive);
      return matchQ && matchAud && matchPri && matchAct;
    }),
    [items, search, fAud, fPri, fActive]
  );

  const stats = [
    { label: "Total",    value: items.length,                                                      color: "#FFB347" },
    { label: "Active",   value: items.filter((a) => a.isActive).length,                            color: "#4ECDC4" },
    { label: "Urgent",   value: items.filter((a) => a.priority === "urgent").length,                color: "#FF6B6B" },
    { label: "Emailed",  value: items.filter((a) => a.emailSent).length,                            color: "#A78BFA" },
  ];

  // ── Open modal ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setEmailResult(null);
    setIsFormOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title:       a.title,
      message:     a.message,
      priority:    a.priority,
      audience:    a.audience,
      programId:   a.programId   ?? "",
      levelId:     a.levelId     ?? "",
      expiresAt:   a.expiresAt   ? a.expiresAt.slice(0, 10) : "",
      sendEmail:   false,
      fileUrl:     a.fileUrl     ?? "",
      storagePath: "",
      fileType:    a.fileType    ?? "",
      fileName:    a.fileName    ?? "",
    });
    setEmailResult(null);
    setIsFormOpen(true);
  };

  // ── File upload ─────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token ?? "";
      const res = await apiUpload(file, token);
      setForm((prev) => ({
        ...prev,
        fileUrl:     res.fileUrl,
        storagePath: res.storagePath,
        fileType:    res.fileType,
        fileName:    res.fileName,
      }));
      showToast("File uploaded ✅");
    } catch (err: any) {
      showToast("Upload failed: " + err.message, false);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = () => setForm((prev) => ({ ...prev, fileUrl: "", storagePath: "", fileType: "", fileName: "" }));

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) { showToast("Title and message required", false); return; }
    setSubmitting(true);
    try {
      const payload = {
        title:       form.title.trim(),
        message:     form.message.trim(),
        priority:    form.priority,
        audience:    form.audience,
        programId:   ["program","level"].includes(form.audience) ? (form.programId || null) : null,
        levelId:     form.audience === "level" ? (form.levelId || null) : null,
        fileUrl:     form.fileUrl     || null,
        storagePath: form.storagePath || null,
        fileType:    form.fileType    || null,
        fileName:    form.fileName    || null,
        expiresAt:   form.expiresAt   || null,
        sendEmail:   form.sendEmail,
      };

      const res = editing
        ? await apiFetch(`/api/admin/announcements/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await apiFetch("/api/admin/announcements",                { method: "POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (form.sendEmail && res.emailResult) {
        setEmailResult(res.emailResult);
        showToast(`Sent to ${res.emailResult.sent} recipients 📧`);
      } else {
        showToast(editing ? "Updated ✨" : "Published 📢");
        setIsFormOpen(false);
      }
      fetchAll();
    } catch (err: any) {
      let msg = err.message;
      try { const p = JSON.parse(msg); if (p?.error) msg = p.error; } catch {}
      showToast(msg, false);
    }
    setSubmitting(false);
  };

  // ── Toggle active ───────────────────────────────────────────────────────────
  const handleToggle = async (a: Announcement) => {
    try {
      await apiFetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !a.isActive }),
      });
      setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, isActive: !a.isActive } : x));
    } catch { showToast("Failed to update", false); }
  };

  // ── Resend emails ───────────────────────────────────────────────────────────
  const handleResendEmail = async (a: Announcement) => {
    try {
      const res = await apiFetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: true }),
      });
      showToast(`Resent to ${res.emailResult?.sent ?? 0} recipients 📧`);
      fetchAll();
    } catch { showToast("Email send failed", false); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!toDelete) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/announcements/${toDelete.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
      showToast("Deleted");
      setIsDeleteOpen(false);
      setToDelete(null);
      fetchAll();
    } catch { showToast("Failed to delete", false); }
    setSubmitting(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">Broadcast notices with email delivery to students, programs & teachers</p>
        </div>
        <GradientButton icon={Plus} onClick={openCreate}>New Announcement</GradientButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-3xl font-black text-[#1A1A2E]">{s.value}</p>
            <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: s.color }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#FFFDF7]">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or message…"
              className="w-full bg-white border border-[#F0EEF8] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-[#1A1A2E] focus:outline-none focus:border-[#FF6B6B] transition-all shadow-sm" />
          </div>
          {[
            { val: fAud, set: setFAud, placeholder: "All Audiences", opts: [["all","Everyone"],["students","All Students"],["teachers","Teachers Only"],["program","Program"],["level","Level"]] },
            { val: fPri, set: setFPri, placeholder: "All Priorities", opts: [["urgent","🚨 Urgent"],["normal","🔔 Normal"],["info","ℹ️ Info"]] },
            { val: fActive, set: setFActive, placeholder: "Any Status", opts: [["active","Active"],["inactive","Inactive"]] },
          ].map(({ val, set, placeholder, opts }, i) => (
            <select key={i} value={val} onChange={(e) => set(e.target.value)}
              className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:border-[#FF6B6B] shadow-sm cursor-pointer appearance-none min-w-[150px]">
              <option value="">{placeholder}</option>
              {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          {(search || fAud || fPri || fActive) && (
            <button onClick={() => { setSearch(""); setFAud(""); setFPri(""); setFActive(""); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#FF6B6B]">
          <Loader2 className="animate-spin mb-3" size={32} />
          <p className="text-sm font-bold text-gray-500">Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <Megaphone size={36} className="text-gray-200 mb-3" />
          <p className="text-base font-bold text-[#1A1A2E]">No announcements</p>
          <p className="text-sm text-gray-400 mt-1">Create one to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const cfg      = PRIORITY_CFG[a.priority];
            const PriIcon  = cfg.Icon;
            const expired  = a.expiresAt && new Date(a.expiresAt) < new Date();

            return (
              <Card key={a.id} className={`p-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] ${!a.isActive ? "opacity-55" : ""}`}>
                <div className="flex items-start gap-4">
                  {/* Priority icon */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}>
                    <PriIcon size={18} style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        {/* Title + badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-sm font-black text-[#1A1A2E]">{a.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                            {cfg.label}
                          </span>
                          {!a.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400 border border-gray-200">Inactive</span>}
                          {expired    && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-400 border border-red-100">Expired</span>}
                          {a.emailSent && <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-400 border border-purple-100 flex items-center gap-1"><Mail size={8}/> Emailed</span>}
                          {a.fileUrl  && (
                            <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-400 border border-blue-100 flex items-center gap-1 hover:bg-blue-100 transition-colors">
                              {a.fileType === "image" ? <ImageIcon size={8}/> : <FileText size={8}/>}
                              {a.fileName ?? "Attachment"}
                            </a>
                          )}
                        </div>

                        {/* Message */}
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{a.message}</p>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Users size={11} />
                            {a.audience === "program" && a.program ? `Program: ${a.program.name}`
                              : a.audience === "level" && a.level   ? `Level: ${a.level.name}${a.program ? ` (${a.program.name})` : ""}`
                              : AUDIENCE_LABEL[a.audience]}
                          </span>
                          {a.expiresAt && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                              <Calendar size={11} /> Expires {new Date(a.expiresAt).toLocaleDateString("en-IN")}
                            </span>
                          )}
                          <span className="text-xs text-gray-300">
                            {new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* View */}
                        <button onClick={() => { setViewing(a); setIsViewOpen(true); }} title="View"
                          className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] transition-colors">
                          <Eye size={15} />
                        </button>
                        {/* Resend email */}
                        <button onClick={() => handleResendEmail(a)} title="Resend Email"
                          className="p-2 rounded-xl bg-purple-50 text-purple-400 hover:bg-purple-100 transition-colors">
                          <Send size={15} />
                        </button>
                        {/* Toggle */}
                        <button onClick={() => handleToggle(a)} title={a.isActive ? "Deactivate" : "Activate"}
                          className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                          {a.isActive
                            ? <ToggleRight size={20} className="text-[#4ECDC4]" />
                            : <ToggleLeft  size={20} className="text-gray-300" />}
                        </button>
                        {/* Edit */}
                        <button onClick={() => openEdit(a)} title="Edit"
                          className="p-2 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors">
                          <Edit size={15} />
                        </button>
                        {/* Delete */}
                        <button onClick={() => { setToDelete(a); setIsDeleteOpen(true); }} title="Delete"
                          className="p-2 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editing ? "Edit Announcement" : "New Announcement"} wide>
        <form onSubmit={handleSave} className="space-y-5">

          {/* Email result banner */}
          {emailResult && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${emailResult.failed === 0 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              {emailResult.failed === 0
                ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                : <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />}
              <p className="text-sm font-bold text-gray-700">
                Emails sent to <strong>{emailResult.sent}</strong> recipients
                {emailResult.failed > 0 && <>, <span className="text-red-500">{emailResult.failed} failed</span></>}.
              </p>
              <button type="button" onClick={() => { setEmailResult(null); setIsFormOpen(false); }} className="ml-auto text-xs font-black text-gray-400 hover:text-gray-600">Done</button>
            </div>
          )}

          {/* Title */}
          <div>
            <Label required>Title</Label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Holiday Notice — Diwali Break" className={inputCls} />
          </div>

          {/* Message */}
          <div>
            <Label required>Message</Label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5} placeholder="Write the full announcement here…"
              className={inputCls + " resize-none"} />
          </div>

          {/* Priority + Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Priority</Label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="info">ℹ️ Info</option>
                <option value="normal">🔔 Normal</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
            <div>
              <Label required>Audience</Label>
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value, programId: "", levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="all">👥 Everyone</option>
                <option value="students">🎓 All Students</option>
                <option value="teachers">🧑‍🏫 Teachers Only</option>
                <option value="program">📚 Specific Program</option>
                <option value="level">🎯 Specific Level</option>
              </select>
            </div>
          </div>

          {/* Program dropdown */}
          {(form.audience === "program" || form.audience === "level") && (
            <div>
              <Label>Program</Label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value, levelId: "" })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select program…</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {/* Level dropdown */}
          {form.audience === "level" && levels.length > 0 && (
            <div>
              <Label>Level</Label>
              <select value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} className={inputCls + " appearance-none cursor-pointer"}>
                <option value="">Select level…</option>
                {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          )}

          {/* Expiry date */}
          <div>
            <Label>Expiry Date (optional)</Label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
          </div>

          {/* File attachment */}
          <div>
            <Label>Attachment (PDF or Image, max 10MB)</Label>
            {form.fileUrl ? (
              <div className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
                  {form.fileType === "image" ? <ImageIcon size={16} className="text-blue-400" /> : <FileText size={16} className="text-blue-400" />}
                </div>
                <p className="flex-1 text-sm font-bold text-[#1A1A2E] truncate">{form.fileName}</p>
                <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mr-2">Preview</a>
                <button type="button" onClick={removeFile} className="p-1 text-gray-400 hover:text-[#FF6B6B] transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div>
                <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-dashed border-[#F0EEF8] rounded-xl px-5 py-3 text-sm font-bold text-gray-500 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors disabled:opacity-60 w-full justify-center">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
                  {uploading ? "Uploading…" : "Click to attach PDF or Image"}
                </button>
              </div>
            )}
          </div>

          {/* Send email toggle */}
          <div className="flex items-center justify-between bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Mail size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-black text-[#1A1A2E]">Send Email Notification</p>
                <p className="text-xs text-gray-400">Email will be sent to all matching recipients</p>
              </div>
            </div>
            <button type="button" onClick={() => setForm({ ...form, sendEmail: !form.sendEmail })}
              className="transition-colors">
              {form.sendEmail
                ? <ToggleRight size={28} className="text-purple-500" />
                : <ToggleLeft  size={28} className="text-gray-300" />}
            </button>
          </div>

          {/* Preview */}
          {form.title && form.message && (
            <div className="rounded-xl border-2 p-4 space-y-2"
              style={{ borderColor: PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.color + "33",
                       background:   PRIORITY_CFG[form.priority as keyof typeof PRIORITY_CFG]?.bg }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Preview</p>
              <p className="font-black text-[#1A1A2E] text-sm">{form.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{form.message}</p>
            </div>
          )}

          <div className="pt-4 border-t border-[#F0EEF8] flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <GradientButton type="submit" disabled={submitting || uploading} icon={submitting ? Loader2 : (editing ? Edit : Plus)}>
              {submitting ? "Saving…" : editing ? "Update" : "Publish"}
            </GradientButton>
          </div>
        </form>
      </Modal>

      {/* ── View Modal ───────────────────────────────────────────────────────── */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Announcement Details" wide>
        {viewing && (() => {
          const cfg = PRIORITY_CFG[viewing.priority];
          return (
            <div className="space-y-5">
              <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `2px solid ${cfg.color}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <cfg.Icon size={16} style={{ color: cfg.color }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
                <h2 className="text-xl font-black text-[#1A1A2E] mb-2">{viewing.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Audience",  viewing.audience === "program" && viewing.program ? `Program: ${viewing.program.name}`
                              : viewing.audience === "level" && viewing.level     ? `Level: ${viewing.level.name}`
                              : AUDIENCE_LABEL[viewing.audience]],
                  ["Status",    viewing.isActive ? "Active" : "Inactive"],
                  ["Email Sent", viewing.emailSent ? "Yes" : "No"],
                  ["Expires",   viewing.expiresAt ? new Date(viewing.expiresAt).toLocaleDateString("en-IN") : "Never"],
                  ["Created",   new Date(viewing.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })],
                ].map(([l, v]) => (
                  <div key={l} className="bg-[#FFFDF7] border border-[#F0EEF8] rounded-xl p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{l}</p>
                    <p className="text-sm font-bold text-[#1A1A2E]">{v}</p>
                  </div>
                ))}
              </div>
              {viewing.fileUrl && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Attachment</p>
                  {viewing.fileType === "image" ? (
                    <img src={viewing.fileUrl} alt={viewing.fileName ?? "attachment"} className="rounded-xl max-h-64 object-contain border border-[#F0EEF8] w-full" />
                  ) : (
                    <a href={viewing.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[#FFFDF7] border-2 border-[#F0EEF8] rounded-xl p-3 hover:border-blue-300 transition-colors">
                      <FileText size={20} className="text-blue-400" />
                      <span className="text-sm font-bold text-[#1A1A2E]">{viewing.fileName ?? "View PDF"}</span>
                    </a>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2 border-t border-[#F0EEF8]">
                <button onClick={() => { setIsViewOpen(false); openEdit(viewing); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFB347]/10 text-[#FFB347] hover:bg-[#FFB347]/20 transition-colors text-sm font-bold">
                  <Edit size={14} /> Edit
                </button>
                <GradientButton onClick={() => setIsViewOpen(false)}>Close</GradientButton>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Delete Modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Announcement">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A2E]">Delete "{toDelete?.title}"?</h4>
            <p className="text-sm text-gray-500 mt-2">This cannot be undone. Any attached file will also be removed from storage.</p>
          </div>
          <div className="w-full flex gap-3 pt-4">
            <button onClick={() => setIsDeleteOpen(false)}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={submitting}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B6B] hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-2xl font-bold text-sm z-[999] animate-in slide-in-from-bottom-5 shadow-xl flex items-center gap-2 ${toast.ok ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFB347] shadow-[0_8px_24px_rgba(255,107,107,0.4)]" : "bg-red-500"}`}>
          {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}