// "use client";

// import { useCallback, useEffect, useState } from "react";

// interface Option { id?: string; text: string; }
// interface Question {
//   id: string;
//   questionText: string;
//   options: Option[];
//   correctOptionIndex: number;
//   marks: number;
//   explanation: string;
//   order: number;
// }

// const blankQ = (): Omit<Question, "id"> => ({
//   questionText: "",
//   options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
//   correctOptionIndex: 0,
//   marks: 1,
//   explanation: "",
//   order: 0,
// });

// export default function PortalQuestionEditor({
//   paperId,
//   onBack,
// }: {
//   paperId: string;
//   onBack: () => void;
// }) {
//   const [paper, setPaper] = useState<{ title: string; totalMarks: number } | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState<string | "new" | null>(null);
//   const [form, setForm] = useState<Omit<Question, "id">>(blankQ());
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [bulkMode, setBulkMode] = useState(false);
//   const [bulkText, setBulkText] = useState("");
//   const [bulkParsed, setBulkParsed] = useState<Omit<Question, "id">[]>([]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [pr, qr] = await Promise.all([
//         fetch(`/api/portal/papers/${paperId}`),
//         fetch(`/api/portal/papers/${paperId}/questions`),
//       ]);
//       const pd = await pr.json();
//       const qd = await qr.json();
//       setPaper(pd.paper ?? null);
//       setQuestions((qd.questions ?? []).sort((a: Question, b: Question) => a.order - b.order));
//     } catch { setError("Failed to load questions."); }
//     finally { setLoading(false); }
//   }, [paperId]);

//   useEffect(() => { load(); }, [load]);

//   // ── Single question save ──────────────────────────────────────────────────
//   const saveQuestion = async (qId: string | "new") => {
//     if (!form.questionText.trim()) return setError("Question text is required.");
//     if (form.options.some(o => !o.text.trim())) return setError("All 4 options must be filled.");
//     setSaving(true); setError("");
//     try {
//       const payload = { ...form, order: qId === "new" ? questions.length : form.order };
//       const url = qId === "new"
//         ? `/api/portal/papers/${paperId}/questions`
//         : `/api/portal/papers/${paperId}/questions/${qId}`;
//       const method = qId === "new" ? "POST" : "PATCH";
//       const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setExpandedId(null); setForm(blankQ()); load();
//     } catch (e: any) { setError(e.message); }
//     finally { setSaving(false); }
//   };

//   // ── Bulk import ───────────────────────────────────────────────────────────
//   const parseBulk = () => {
//     /*
//       Format expected (each block separated by blank line):
//       Q: What is 2+2?
//       A: 3
//       B: 4 ✓
//       C: 5
//       D: 6
//       E: (optional explanation)
//     */
//     const blocks = bulkText.trim().split(/\n\n+/);
//     const parsed: Omit<Question, "id">[] = [];
//     for (const block of blocks) {
//       const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
//       const qLine = lines.find(l => l.startsWith("Q:"))?.slice(2).trim() ?? "";
//       const opts = ["A", "B", "C", "D"].map(letter => {
//         const raw = lines.find(l => l.startsWith(`${letter}:`))?.slice(2).trim() ?? "";
//         return { text: raw.replace(/✓$/, "").trim() };
//       });
//       const correctIndex = ["A", "B", "C", "D"].findIndex(letter => {
//         const raw = lines.find(l => l.startsWith(`${letter}:`)) ?? "";
//         return raw.includes("✓");
//       });
//       const expLine = lines.find(l => l.startsWith("E:"))?.slice(2).trim() ?? "";
//       if (qLine && opts.every(o => o.text)) {
//         parsed.push({ questionText: qLine, options: opts, correctOptionIndex: Math.max(0, correctIndex), marks: 1, explanation: expLine, order: 0 });
//       }
//     }
//     setBulkParsed(parsed);
//   };

//   const saveBulk = async () => {
//     setSaving(true); setError("");
//     try {
//       const r = await fetch(`/api/portal/papers/${paperId}/questions/bulk`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ questions: bulkParsed.map((q, i) => ({ ...q, order: questions.length + i })) }),
//       });
//       if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
//       setBulkMode(false); setBulkText(""); setBulkParsed([]); load();
//     } catch (e: any) { setError(e.message); }
//     finally { setSaving(false); }
//   };

//   const deleteQuestion = async (id: string) => {
//     if (!confirm("Delete this question?")) return;
//     setDeletingId(id);
//     await fetch(`/api/portal/papers/${paperId}/questions/${id}`, { method: "DELETE" });
//     setDeletingId(null); load();
//   };

//   const totalMarksUsed = questions.reduce((acc, q) => acc + q.marks, 0);

//   return (
//     <div style={{ fontFamily: "'Nunito','Fredoka One',system-ui,sans-serif" }}>
//       {/* Back + Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
//         <button onClick={onBack} style={{
//           background: "#F5F3EE", border: "none", borderRadius: 10, padding: "9px 14px",
//           cursor: "pointer", fontWeight: 900, fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6,
//         }}>
//           ← Back
//         </button>
//         <div>
//           <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>
//             ❓ Question Editor
//           </h2>
//           {paper && (
//             <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>
//               {paper.title} — {questions.length} questions · {totalMarksUsed}/{paper.totalMarks} marks assigned
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Stats bar */}
//       <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
//         {[
//           { label: "Questions", value: questions.length, color: "#FF6B6B", bg: "#FFF0F0" },
//           { label: "Marks Assigned", value: totalMarksUsed, color: "#4ECDC4", bg: "#F0FFFE" },
//           { label: "Paper Total", value: paper?.totalMarks ?? "—", color: "#FFB347", bg: "#FFF8EE" },
//         ].map(s => (
//           <div key={s.label} style={{
//             background: s.bg, borderRadius: 12, padding: "12px 20px",
//             border: `2px solid ${s.color}22`, display: "flex", flexDirection: "column", alignItems: "center",
//           }}>
//             <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: s.color }}>{s.value}</div>
//             <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {error && (
//         <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
//           ⚠️ {error}
//         </div>
//       )}

//       {/* Toolbar */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
//         <button
//           onClick={() => { setExpandedId("new"); setForm(blankQ()); setError(""); setBulkMode(false); }}
//           style={primaryBtnStyle}
//         >
//           ➕ Add Question
//         </button>
//         <button
//           onClick={() => { setBulkMode(b => !b); setExpandedId(null); setError(""); }}
//           style={{ ...primaryBtnStyle, background: "linear-gradient(135deg,#4ECDC4,#26C6DA)", boxShadow: "0 4px 16px rgba(78,205,196,.3)" }}
//         >
//           📋 Bulk Import
//         </button>
//       </div>

//       {/* Bulk Import Panel */}
//       {bulkMode && (
//         <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 24, border: "2px solid #4ECDC433" }}>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
//             📋 Bulk Import Questions
//           </h3>
//           <p style={{ fontSize: 13, color: "#777", marginBottom: 12, lineHeight: 1.7 }}>
//             Paste questions in this format (separate blocks with a blank line). Mark the correct answer with <strong>✓</strong>
//           </p>
//           <pre style={{
//             background: "#F9F9F9", borderRadius: 10, padding: "14px 16px", fontSize: 12,
//             color: "#555", marginBottom: 14, overflowX: "auto", fontFamily: "monospace",
//           }}>{`Q: What is 2 + 2?
// A: 3
// B: 4 ✓
// C: 5
// D: 6
// E: 2+2 equals 4 (explanation optional)

// Q: Capital of France?
// A: Berlin
// B: Madrid
// C: Paris ✓
// D: Rome`}</pre>
//           <textarea
//             value={bulkText}
//             onChange={e => { setBulkText(e.target.value); setBulkParsed([]); }}
//             rows={10}
//             placeholder="Paste questions here…"
//             style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13, marginBottom: 12, resize: "vertical" }}
//           />
//           <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
//             <button onClick={parseBulk} style={{ ...primaryBtnStyle, background: "linear-gradient(135deg,#A78BFA,#818CF8)" }}>
//               🔍 Preview ({bulkParsed.length} parsed)
//             </button>
//             {bulkParsed.length > 0 && (
//               <button onClick={saveBulk} disabled={saving} style={primaryBtnStyle}>
//                 {saving ? "Importing…" : `✅ Import ${bulkParsed.length} Questions`}
//               </button>
//             )}
//           </div>
//           {bulkParsed.length > 0 && (
//             <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
//               {bulkParsed.map((q, i) => (
//                 <div key={i} style={{ background: "#F9F9F9", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
//                   <div style={{ fontWeight: 800, marginBottom: 4 }}>Q{i + 1}: {q.questionText}</div>
//                   <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//                     {q.options.map((o, oi) => (
//                       <span key={oi} style={{ color: oi === q.correctOptionIndex ? "#22C55E" : "#777", fontWeight: oi === q.correctOptionIndex ? 900 : 700 }}>
//                         {["A", "B", "C", "D"][oi]}: {o.text} {oi === q.correctOptionIndex ? "✓" : ""}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* New Question Form */}
//       {expandedId === "new" && (
//         <QuestionForm
//           form={form}
//           setForm={setForm}
//           onSave={() => saveQuestion("new")}
//           onCancel={() => { setExpandedId(null); setForm(blankQ()); setError(""); }}
//           saving={saving}
//           label={`Q${questions.length + 1}`}
//         />
//       )}

//       {/* Questions List */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontWeight: 800 }}>Loading questions…</div>
//       ) : questions.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "50px 24px" }}>
//           <div style={{ fontSize: 52, marginBottom: 12 }}>❓</div>
//           <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No questions yet</h3>
//           <p style={{ fontSize: 13, color: "#aaa" }}>Add questions one-by-one or use Bulk Import for faster setup.</p>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {questions.map((q, idx) => (
//             expandedId === q.id ? (
//               <QuestionForm
//                 key={q.id}
//                 form={form}
//                 setForm={setForm}
//                 onSave={() => saveQuestion(q.id)}
//                 onCancel={() => { setExpandedId(null); setForm(blankQ()); setError(""); }}
//                 saving={saving}
//                 label={`Q${idx + 1}`}
//               />
//             ) : (
//               <QuestionRow
//                 key={q.id}
//                 question={q}
//                 index={idx}
//                 deleting={deletingId === q.id}
//                 onEdit={() => {
//                   setForm({ ...q, options: q.options.map(o => ({ text: o.text })) });
//                   setExpandedId(q.id);
//                   setError("");
//                 }}
//                 onDelete={() => deleteQuestion(q.id)}
//               />
//             )
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Question Form ─────────────────────────────────────────────────────────────
// function QuestionForm({
//   form, setForm, onSave, onCancel, saving, label,
// }: {
//   form: Omit<Question, "id">;
//   setForm: React.Dispatch<React.SetStateAction<Omit<Question, "id">>>;
//   onSave: () => void;
//   onCancel: () => void;
//   saving: boolean;
//   label: string;
// }) {
//   return (
//     <div style={{
//       background: "white", borderRadius: 20, padding: 24,
//       border: "2.5px solid #FF6B6B33", boxShadow: "0 8px 28px rgba(255,107,107,.08)",
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
//         <div style={{
//           width: 32, height: 32, borderRadius: 8,
//           background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontFamily: "'Fredoka One',cursive", color: "white", fontSize: 13,
//         }}>{label}</div>
//         <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>Question</span>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//           <label style={{ fontSize: 12, fontWeight: 900, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Marks</label>
//           <input
//             type="number" min={1} value={form.marks}
//             onChange={e => setForm(f => ({ ...f, marks: +e.target.value }))}
//             style={{ width: 64, padding: "7px 10px", borderRadius: 8, border: "2px solid #EEE", fontFamily: "inherit", fontSize: 14 }}
//           />
//         </div>
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <label style={labelStyle}>Question Text *</label>
//         <textarea
//           value={form.questionText}
//           onChange={e => setForm(f => ({ ...f, questionText: e.target.value }))}
//           placeholder="Type your question here…"
//           rows={3}
//           style={{ ...inputStyle, resize: "vertical" }}
//         />
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <label style={labelStyle}>Options (select the correct answer)</label>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {form.options.map((opt, oi) => (
//             <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <input
//                 type="radio"
//                 name="correctOption"
//                 checked={form.correctOptionIndex === oi}
//                 onChange={() => setForm(f => ({ ...f, correctOptionIndex: oi }))}
//                 style={{ width: 18, height: 18, accentColor: "#4ECDC4", flexShrink: 0 }}
//               />
//               <div style={{
//                 width: 28, height: 28, borderRadius: 8, flexShrink: 0,
//                 background: form.correctOptionIndex === oi ? "#E8FFF5" : "#F5F5F5",
//                 border: `2px solid ${form.correctOptionIndex === oi ? "#22C55E" : "#EEE"}`,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontWeight: 900, fontSize: 12,
//                 color: form.correctOptionIndex === oi ? "#22C55E" : "#aaa",
//               }}>
//                 {["A", "B", "C", "D"][oi]}
//               </div>
//               <input
//                 value={opt.text}
//                 onChange={e => setForm(f => ({
//                   ...f,
//                   options: f.options.map((o, i) => i === oi ? { ...o, text: e.target.value } : o),
//                 }))}
//                 placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
//                 style={{ ...inputStyle, flex: 1 }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ marginBottom: 20 }}>
//         <label style={labelStyle}>Explanation (shown after submission)</label>
//         <input
//           value={form.explanation}
//           onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
//           placeholder="Optional: why is this the correct answer?"
//           style={inputStyle}
//         />
//       </div>

//       <div style={{ display: "flex", gap: 10 }}>
//         <button onClick={onSave} disabled={saving} style={primaryBtnStyle}>
//           {saving ? "Saving…" : "✅ Save Question"}
//         </button>
//         <button onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
//       </div>
//     </div>
//   );
// }

// // ── Question Row (collapsed view) ─────────────────────────────────────────────
// function QuestionRow({ question, index, onEdit, onDelete, deleting }: {
//   question: Question;
//   index: number;
//   onEdit: () => void;
//   onDelete: () => void;
//   deleting: boolean;
// }) {
//   return (
//     <div style={{
//       background: "white", borderRadius: 14, padding: "14px 18px",
//       border: "2px solid #EEE", display: "flex", alignItems: "center", gap: 14,
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 8, flexShrink: 0,
//         background: "linear-gradient(135deg,#FF6B6B22,#FFB34722)",
//         border: "2px solid #FF6B6B22",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontFamily: "'Fredoka One',cursive", color: "#FF6B6B", fontSize: 13,
//       }}>Q{index + 1}</div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//           {question.questionText}
//         </div>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {question.options.map((o, oi) => (
//             <span key={oi} style={{
//               fontSize: 11, fontWeight: 800,
//               color: oi === question.correctOptionIndex ? "#22C55E" : "#aaa",
//               background: oi === question.correctOptionIndex ? "#E8FFF5" : "#F5F5F5",
//               padding: "2px 8px", borderRadius: 6,
//             }}>
//               {["A", "B", "C", "D"][oi]}: {o.text}
//               {oi === question.correctOptionIndex ? " ✓" : ""}
//             </span>
//           ))}
//         </div>
//       </div>
//       <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 900, color: "#FFB347", background: "#FFF8EE", padding: "4px 10px", borderRadius: 8 }}>
//         {question.marks}m
//       </div>
//       <div style={{ display: "flex", gap: 6 }}>
//         <button onClick={onEdit} style={iconBtnStyle("#4ECDC4")}>✏️</button>
//         <button onClick={onDelete} disabled={deleting} style={iconBtnStyle("#FF6B6B")}>
//           {deleting ? "…" : "🗑️"}
//         </button>
//       </div>
//     </div>
//   );
// }

// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 900, color: "#555",
//   letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
//   border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
//   boxSizing: "border-box",
// };
// const primaryBtnStyle: React.CSSProperties = {
//   background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
//   border: "none", borderRadius: 10, padding: "11px 24px",
//   fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
//   boxShadow: "0 4px 16px rgba(255,107,107,.3)",
// };
// const cancelBtnStyle: React.CSSProperties = {
//   background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
//   padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
// };
// const iconBtnStyle = (color: string): React.CSSProperties => ({
//   background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 8,
//   width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
//   cursor: "pointer", fontSize: 14,
// });











"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Option { id?: string; text: string; }
interface Question {
  id: string;
  questionText: string;
  options: Option[];
  correctOptionIndex: number;
  marks: number;
  explanation: string;
  order: number;
}

const blankQ = (): Omit<Question, "id"> => ({
  questionText: "",
  options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
  correctOptionIndex: 0,
  marks: 1,
  explanation: "",
  order: 0,
});

export default function PortalQuestionEditor({
  paperId,
  onBack,
}: {
  paperId: string;
  onBack: () => void;
}) {
  const { token } = useAuth();

  const [paper, setPaper] = useState<{ title: string; totalMarks: number } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Omit<Question, "id">>(blankQ());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkParsed, setBulkParsed] = useState<Omit<Question, "id">[]>([]);

  const authFetch = useCallback((url: string, init: RequestInit = {}) =>
    fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, qr] = await Promise.all([
        authFetch(`/api/admin/portal/papers/${paperId}`),
        authFetch(`/api/admin/portal/papers/${paperId}/questions`),
      ]);
      const pd = await pr.json();
      const qd = await qr.json();
      setPaper(pd.paper ?? null);
      setQuestions((qd.questions ?? []).sort((a: Question, b: Question) => a.order - b.order));
    } catch { setError("Failed to load questions."); }
    finally { setLoading(false); }
  }, [paperId, authFetch]);

  useEffect(() => { load(); }, [load]);

  // ── Single question save ──────────────────────────────────────────────────
  const saveQuestion = async (qId: string | "new") => {
    if (!form.questionText.trim()) return setError("Question text is required.");
    if (form.options.some(o => !o.text.trim())) return setError("All 4 options must be filled.");
    setSaving(true); setError("");
    try {
      const payload = { ...form, order: qId === "new" ? questions.length : form.order };
      const url = qId === "new"
        ? `/api/admin/portal/papers/${paperId}/questions`
        : `/api/admin/portal/papers/${paperId}/questions/${qId}`;
      const method = qId === "new" ? "POST" : "PATCH";
      const r = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      setExpandedId(null); setForm(blankQ()); load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  // ── Bulk import ───────────────────────────────────────────────────────────
  const parseBulk = () => {
    /*
      Format expected (each block separated by blank line):
      Q: What is 2+2?
      A: 3
      B: 4 ✓
      C: 5
      D: 6
      E: (optional explanation)
    */
    const blocks = bulkText.trim().split(/\n\n+/);
    const parsed: Omit<Question, "id">[] = [];
    for (const block of blocks) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      const qLine = lines.find(l => l.startsWith("Q:"))?.slice(2).trim() ?? "";
      const opts = ["A", "B", "C", "D"].map(letter => {
        const raw = lines.find(l => l.startsWith(`${letter}:`))?.slice(2).trim() ?? "";
        return { text: raw.replace(/✓$/, "").trim() };
      });
      const correctIndex = ["A", "B", "C", "D"].findIndex(letter => {
        const raw = lines.find(l => l.startsWith(`${letter}:`)) ?? "";
        return raw.includes("✓");
      });
      const expLine = lines.find(l => l.startsWith("E:"))?.slice(2).trim() ?? "";
      if (qLine && opts.every(o => o.text)) {
        parsed.push({ questionText: qLine, options: opts, correctOptionIndex: Math.max(0, correctIndex), marks: 1, explanation: expLine, order: 0 });
      }
    }
    setBulkParsed(parsed);
  };

  const saveBulk = async () => {
    setSaving(true); setError("");
    try {
      const r = await authFetch(`/api/admin/portal/papers/${paperId}/questions/bulk`, {
        method: "POST",
        body: JSON.stringify({ questions: bulkParsed.map((q, i) => ({ ...q, order: questions.length + i })) }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
      setBulkMode(false); setBulkText(""); setBulkParsed([]); load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    setDeletingId(id);
    await authFetch(`/api/admin/portal/papers/${paperId}/questions/${id}`, { method: "DELETE" });
    setDeletingId(null); load();
  };

  const totalMarksUsed = questions.reduce((acc, q) => acc + q.marks, 0);

  return (
    <div style={{ fontFamily: "'Nunito','Fredoka One',system-ui,sans-serif" }}>
      {/* Back + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: "#F5F3EE", border: "none", borderRadius: 10, padding: "9px 14px",
          cursor: "pointer", fontWeight: 900, fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 6,
        }}>
          ← Back
        </button>
        <div>
          <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", margin: 0 }}>
            ❓ Question Editor
          </h2>
          {paper && (
            <p style={{ fontSize: 13, color: "#aaa", margin: "3px 0 0", fontWeight: 700 }}>
              {paper.title} — {questions.length} questions · {totalMarksUsed}/{paper.totalMarks} marks assigned
            </p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Questions", value: questions.length, color: "#FF6B6B", bg: "#FFF0F0" },
          { label: "Marks Assigned", value: totalMarksUsed, color: "#4ECDC4", bg: "#F0FFFE" },
          { label: "Paper Total", value: paper?.totalMarks ?? "—", color: "#FFB347", bg: "#FFF8EE" },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 12, padding: "12px 20px",
            border: `2px solid ${s.color}22`, display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "#FFF0F0", border: "1.5px solid #FFD6D6", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => { setExpandedId("new"); setForm(blankQ()); setError(""); setBulkMode(false); }}
          style={primaryBtnStyle}
        >
          ➕ Add Question
        </button>
        <button
          onClick={() => { setBulkMode(b => !b); setExpandedId(null); setError(""); }}
          style={{ ...primaryBtnStyle, background: "linear-gradient(135deg,#4ECDC4,#26C6DA)", boxShadow: "0 4px 16px rgba(78,205,196,.3)" }}
        >
          📋 Bulk Import
        </button>
      </div>

      {/* Bulk Import Panel */}
      {bulkMode && (
        <div style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 24, border: "2px solid #4ECDC433" }}>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", margin: "0 0 12px" }}>
            📋 Bulk Import Questions
          </h3>
          <p style={{ fontSize: 13, color: "#777", marginBottom: 12, lineHeight: 1.7 }}>
            Paste questions in this format (separate blocks with a blank line). Mark the correct answer with <strong>✓</strong>
          </p>
          <pre style={{
            background: "#F9F9F9", borderRadius: 10, padding: "14px 16px", fontSize: 12,
            color: "#555", marginBottom: 14, overflowX: "auto", fontFamily: "monospace",
          }}>{`Q: What is 2 + 2?
A: 3
B: 4 ✓
C: 5
D: 6
E: 2+2 equals 4 (explanation optional)

Q: Capital of France?
A: Berlin
B: Madrid
C: Paris ✓
D: Rome`}</pre>
          <textarea
            value={bulkText}
            onChange={e => { setBulkText(e.target.value); setBulkParsed([]); }}
            rows={10}
            placeholder="Paste questions here…"
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13, marginBottom: 12, resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <button onClick={parseBulk} style={{ ...primaryBtnStyle, background: "linear-gradient(135deg,#A78BFA,#818CF8)" }}>
              🔍 Preview ({bulkParsed.length} parsed)
            </button>
            {bulkParsed.length > 0 && (
              <button onClick={saveBulk} disabled={saving} style={primaryBtnStyle}>
                {saving ? "Importing…" : `✅ Import ${bulkParsed.length} Questions`}
              </button>
            )}
          </div>
          {bulkParsed.length > 0 && (
            <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {bulkParsed.map((q, i) => (
                <div key={i} style={{ background: "#F9F9F9", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>Q{i + 1}: {q.questionText}</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {q.options.map((o, oi) => (
                      <span key={oi} style={{ color: oi === q.correctOptionIndex ? "#22C55E" : "#777", fontWeight: oi === q.correctOptionIndex ? 900 : 700 }}>
                        {["A", "B", "C", "D"][oi]}: {o.text} {oi === q.correctOptionIndex ? "✓" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Question Form */}
      {expandedId === "new" && (
        <QuestionForm
          form={form}
          setForm={setForm}
          onSave={() => saveQuestion("new")}
          onCancel={() => { setExpandedId(null); setForm(blankQ()); setError(""); }}
          saving={saving}
          label={`Q${questions.length + 1}`}
        />
      )}

      {/* Questions List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontWeight: 800 }}>Loading questions…</div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>❓</div>
          <h3 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>No questions yet</h3>
          <p style={{ fontSize: 13, color: "#aaa" }}>Add questions one-by-one or use Bulk Import for faster setup.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.map((q, idx) => (
            expandedId === q.id ? (
              <QuestionForm
                key={q.id}
                form={form}
                setForm={setForm}
                onSave={() => saveQuestion(q.id)}
                onCancel={() => { setExpandedId(null); setForm(blankQ()); setError(""); }}
                saving={saving}
                label={`Q${idx + 1}`}
              />
            ) : (
              <QuestionRow
                key={q.id}
                question={q}
                index={idx}
                deleting={deletingId === q.id}
                onEdit={() => {
                  setForm({ ...q, options: q.options.map(o => ({ text: o.text })) });
                  setExpandedId(q.id);
                  setError("");
                }}
                onDelete={() => deleteQuestion(q.id)}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}

// ── Question Form ─────────────────────────────────────────────────────────────
function QuestionForm({
  form, setForm, onSave, onCancel, saving, label,
}: {
  form: Omit<Question, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Question, "id">>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  label: string;
}) {
  return (
    <div style={{
      background: "white", borderRadius: 20, padding: 24,
      border: "2.5px solid #FF6B6B33", boxShadow: "0 8px 28px rgba(255,107,107,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Fredoka One',cursive", color: "white", fontSize: 13,
        }}>{label}</div>
        <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E" }}>Question</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 900, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Marks</label>
          <input
            type="number" min={1} value={form.marks}
            onChange={e => setForm(f => ({ ...f, marks: +e.target.value }))}
            style={{ width: 64, padding: "7px 10px", borderRadius: 8, border: "2px solid #EEE", fontFamily: "inherit", fontSize: 14 }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Question Text *</label>
        <textarea
          value={form.questionText}
          onChange={e => setForm(f => ({ ...f, questionText: e.target.value }))}
          placeholder="Type your question here…"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Options (select the correct answer)</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {form.options.map((opt, oi) => (
            <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="radio"
                name="correctOption"
                checked={form.correctOptionIndex === oi}
                onChange={() => setForm(f => ({ ...f, correctOptionIndex: oi }))}
                style={{ width: 18, height: 18, accentColor: "#4ECDC4", flexShrink: 0 }}
              />
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: form.correctOptionIndex === oi ? "#E8FFF5" : "#F5F5F5",
                border: `2px solid ${form.correctOptionIndex === oi ? "#22C55E" : "#EEE"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 12,
                color: form.correctOptionIndex === oi ? "#22C55E" : "#aaa",
              }}>
                {["A", "B", "C", "D"][oi]}
              </div>
              <input
                value={opt.text}
                onChange={e => setForm(f => ({
                  ...f,
                  options: f.options.map((o, i) => i === oi ? { ...o, text: e.target.value } : o),
                }))}
                placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Explanation (shown after submission)</label>
        <input
          value={form.explanation}
          onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
          placeholder="Optional: why is this the correct answer?"
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={saving} style={primaryBtnStyle}>
          {saving ? "Saving…" : "✅ Save Question"}
        </button>
        <button onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
      </div>
    </div>
  );
}

// ── Question Row (collapsed view) ─────────────────────────────────────────────
function QuestionRow({ question, index, onEdit, onDelete, deleting }: {
  question: Question;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "14px 18px",
      border: "2px solid #EEE", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: "linear-gradient(135deg,#FF6B6B22,#FFB34722)",
        border: "2px solid #FF6B6B22",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Fredoka One',cursive", color: "#FF6B6B", fontSize: 13,
      }}>Q{index + 1}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {question.questionText}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {question.options.map((o, oi) => (
            <span key={oi} style={{
              fontSize: 11, fontWeight: 800,
              color: oi === question.correctOptionIndex ? "#22C55E" : "#aaa",
              background: oi === question.correctOptionIndex ? "#E8FFF5" : "#F5F5F5",
              padding: "2px 8px", borderRadius: 6,
            }}>
              {["A", "B", "C", "D"][oi]}: {o.text}
              {oi === question.correctOptionIndex ? " ✓" : ""}
            </span>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 900, color: "#FFB347", background: "#FFF8EE", padding: "4px 10px", borderRadius: 8 }}>
        {question.marks}m
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onEdit} style={iconBtnStyle("#4ECDC4")}>✏️</button>
        <button onClick={onDelete} disabled={deleting} style={iconBtnStyle("#FF6B6B")}>
          {deleting ? "…" : "🗑️"}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 900, color: "#555",
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
  border: "2px solid #EEE", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box",
};
const primaryBtnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "white",
  border: "none", borderRadius: 10, padding: "11px 24px",
  fontFamily: "inherit", fontWeight: 900, fontSize: 14, cursor: "pointer",
  boxShadow: "0 4px 16px rgba(255,107,107,.3)",
};
const cancelBtnStyle: React.CSSProperties = {
  background: "#F5F3EE", color: "#777", border: "none", borderRadius: 10,
  padding: "11px 22px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
};
const iconBtnStyle = (color: string): React.CSSProperties => ({
  background: color + "15", border: `1.5px solid ${color}33`, borderRadius: 8,
  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: 14,
});