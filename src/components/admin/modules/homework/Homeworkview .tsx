// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type HWStatus = "upcoming" | "overdue" | "no-due-date";

// interface Homework {
//   id: string;
//   title: string;
//   description: string | null;
//   dueDate: string | null;
//   createdAt: string;
//   submissionCount: number;
//   status: HWStatus;
// }

// interface Submission {
//   id: string;
//   status: string;
//   submittedAt: string | null;
//   student: {
//     id: string;
//     fullName: string;
//     studentId: string;
//     class: string | null;
//     section: string | null;
//   };
// }

// interface HomeworkDetail extends Homework {
//   submissions: Submission[];
// }

// // ─── Auth helper ──────────────────────────────────────────────────────────────
// async function getAuthHeaders(): Promise<Record<string, string>> {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   return {
//     Authorization: `Bearer ${session?.access_token ?? ""}`,
//     "Content-Type": "application/json",
//   };
// }

// // ─── API ──────────────────────────────────────────────────────────────────────
// const API = {
//   list: async (params: {
//     search?: string;
//     status?: string;
//     page?: number;
//   }): Promise<{ homework: Homework[]; total: number }> => {
//     const headers = await getAuthHeaders();
//     const sp = new URLSearchParams();
//     if (params.search) sp.set("search", params.search);
//     if (params.status && params.status !== "all") sp.set("status", params.status);
//     if (params.page) sp.set("page", String(params.page));
//     const res = await fetch(`/api/admin/homework?${sp}`, { headers });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return { homework: json.homework ?? [], total: json.total ?? 0 };
//   },

//   get: async (id: string): Promise<HomeworkDetail> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/homework/${id}`, { headers });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.homework;
//   },

//   create: async (fields: {
//     title: string;
//     description?: string;
//     dueDate?: string | null;
//   }): Promise<Homework> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch("/api/admin/homework", {
//       method: "POST",
//       headers,
//       body: JSON.stringify(fields),
//     });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.homework;
//   },

//   update: async (
//     id: string,
//     fields: { title?: string; description?: string | null; dueDate?: string | null }
//   ): Promise<Homework> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/homework/${id}`, {
//       method: "PATCH",
//       headers,
//       body: JSON.stringify(fields),
//     });
//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//     return json.homework;
//   },

//   delete: async (id: string): Promise<void> => {
//     const headers = await getAuthHeaders();
//     const res = await fetch(`/api/admin/homework/${id}`, {
//       method: "DELETE",
//       headers,
//     });
//     if (!res.ok) {
//       const json = await res.json().catch(() => ({}));
//       throw new Error(json.error ?? `Server error ${res.status}`);
//     }
//   },
// };

// // ─── Status helpers ───────────────────────────────────────────────────────────
// const STATUS_CONFIG: Record<
//   HWStatus,
//   { label: string; bg: string; color: string; border: string; emoji: string }
// > = {
//   upcoming: {
//     label: "Active",
//     bg: "#EDFBF0",
//     color: "#1A7A3A",
//     border: "#8ED4A8",
//     emoji: "🟢",
//   },
//   overdue: {
//     label: "Overdue",
//     bg: "#FFF0F0",
//     color: "#C0392B",
//     border: "#FFAAAA",
//     emoji: "🔴",
//   },
//   "no-due-date": {
//     label: "Open",
//     bg: "#F5F0E4",
//     color: "#8B7D5A",
//     border: "#DDD8CC",
//     emoji: "⚪",
//   },
// };

// function StatusPill({ status }: { status: HWStatus }) {
//   const cfg = STATUS_CONFIG[status];
//   return (
//     <span
//       style={{
//         display: "inline-block",
//         padding: "2px 10px",
//         borderRadius: 20,
//         background: cfg.bg,
//         color: cfg.color,
//         fontSize: 10,
//         fontWeight: 800,
//         border: `1px solid ${cfg.border}`,
//         letterSpacing: 0.5,
//         textTransform: "uppercase",
//       }}
//     >
//       {cfg.emoji} {cfg.label}
//     </span>
//   );
// }

// function formatDueDate(dueDate: string | null): string {
//   if (!dueDate) return "No due date";
//   const d = new Date(dueDate);
//   const now = new Date();
//   const diffMs = d.getTime() - now.getTime();
//   const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

//   const formatted = d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   if (diffDays < 0) return `${formatted} (${Math.abs(diffDays)}d overdue)`;
//   if (diffDays === 0) return `${formatted} (due today)`;
//   if (diffDays === 1) return `${formatted} (due tomorrow)`;
//   return `${formatted} (in ${diffDays}d)`;
// }

// // ─── Submissions Detail Modal ─────────────────────────────────────────────────
// function SubmissionsModal({
//   homeworkId,
//   title,
//   onClose,
// }: {
//   homeworkId: string;
//   title: string;
//   onClose: () => void;
// }) {
//   const [detail, setDetail] = useState<HomeworkDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handler);
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", handler);
//       document.body.style.overflow = "";
//     };
//   }, [onClose]);

//   useEffect(() => {
//     API.get(homeworkId)
//       .then(setDetail)
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [homeworkId]);

//   const subStatusColor = (s: string) =>
//     s === "submitted" || s === "graded"
//       ? "#1A7A3A"
//       : s === "pending"
//       ? "#92660A"
//       : "#555";

//   const subStatusBg = (s: string) =>
//     s === "submitted" || s === "graded"
//       ? "#EDFBF0"
//       : s === "pending"
//       ? "#FFF3CD"
//       : "#F0EBE0";

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1000,
//         background: "rgba(20,18,14,0.75)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(6px)",
//         padding: 20,
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#FFFDF7",
//           borderRadius: 18,
//           width: "100%",
//           maxWidth: 680,
//           maxHeight: "85vh",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "18px 24px",
//             borderBottom: "1px solid #EEE9DC",
//             background: "#FAF7EE",
//             flexShrink: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 12,
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontWeight: 800,
//                 fontSize: 16,
//                 color: "#2C2A22",
//                 fontFamily: "'Georgia', serif",
//               }}
//             >
//               📋 Submissions — {title}
//             </div>
//             {detail && (
//               <div style={{ fontSize: 12, color: "#AAA", marginTop: 3 }}>
//                 {detail.submissionCount} submission
//                 {detail.submissionCount !== 1 ? "s" : ""}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "7px 16px",
//               borderRadius: 8,
//               background: "#F0EBE0",
//               color: "#555",
//               border: "none",
//               cursor: "pointer",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//           >
//             ✕ Close
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>
//           {loading ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "40px 0",
//                 color: "#BBB",
//                 fontSize: 14,
//               }}
//             >
//               <div
//                 style={{
//                   width: 28,
//                   height: 28,
//                   border: "3px solid #DDD",
//                   borderTopColor: "#888",
//                   borderRadius: "50%",
//                   animation: "spin 0.8s linear infinite",
//                   margin: "0 auto 10px",
//                 }}
//               />
//               Loading submissions…
//             </div>
//           ) : error ? (
//             <p style={{ color: "#C0392B", fontSize: 14 }}>⚠️ {error}</p>
//           ) : !detail || detail.submissions.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "48px 0",
//                 color: "#CCC",
//                 fontSize: 14,
//                 border: "2px dashed #EEE9DC",
//                 borderRadius: 12,
//               }}
//             >
//               No submissions yet.
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {detail.submissions.map((sub) => (
//                 <div
//                   key={sub.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     padding: "12px 16px",
//                     borderRadius: 12,
//                     background: "#FFFDF7",
//                     border: "1.5px solid #EEE9DC",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 36,
//                       height: 36,
//                       borderRadius: 10,
//                       background: "#F5F0E4",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 16,
//                       flexShrink: 0,
//                     }}
//                   >
//                     👤
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{ fontWeight: 700, fontSize: 14, color: "#2C2A22" }}
//                     >
//                       {sub.student.fullName}
//                     </div>
//                     <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>
//                       {sub.student.studentId}
//                       {sub.student.class && ` · ${sub.student.class}`}
//                       {sub.student.section && ` ${sub.student.section}`}
//                     </div>
//                   </div>
//                   <div>
//                     <span
//                       style={{
//                         padding: "3px 10px",
//                         borderRadius: 20,
//                         background: subStatusBg(sub.status),
//                         color: subStatusColor(sub.status),
//                         fontSize: 11,
//                         fontWeight: 700,
//                         textTransform: "capitalize",
//                       }}
//                     >
//                       {sub.status}
//                     </span>
//                     {sub.submittedAt && (
//                       <div
//                         style={{
//                           fontSize: 10,
//                           color: "#BBB",
//                           marginTop: 4,
//                           textAlign: "right",
//                         }}
//                       >
//                         {new Date(sub.submittedAt).toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Add / Edit Modal ─────────────────────────────────────────────────────────
// function HomeworkFormModal({
//   editHW,
//   onClose,
//   onSaved,
// }: {
//   editHW?: Homework | null;
//   onClose: () => void;
//   onSaved: () => void;
// }) {
//   const isEdit = !!editHW;
//   const [title, setTitle] = useState(editHW?.title ?? "");
//   const [description, setDescription] = useState(editHW?.description ?? "");
//   const [dueDate, setDueDate] = useState(
//     editHW?.dueDate
//       ? new Date(editHW.dueDate).toISOString().slice(0, 16)
//       : ""
//   );
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   const handleSubmit = async () => {
//     if (!title.trim()) return setError("Title is required.");
//     setError("");
//     setSaving(true);
//     try {
//       const payload = {
//         title: title.trim(),
//         description: description.trim() || null,
//         dueDate: dueDate ? new Date(dueDate).toISOString() : null,
//       };
//       if (isEdit) {
//         await API.update(editHW!.id, payload);
//       } else {
//         await API.create(payload);
//       }
//       onSaved();
//       onClose();
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inp: React.CSSProperties = {
//     width: "100%",
//     padding: "10px 14px",
//     borderRadius: 8,
//     border: "1.5px solid #DDD8CC",
//     background: "#FFFDF7",
//     color: "#2C2A22",
//     fontSize: 14,
//     fontFamily: "inherit",
//     outline: "none",
//     boxSizing: "border-box",
//   };
//   const lbl: React.CSSProperties = {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#888",
//     letterSpacing: 0.6,
//     textTransform: "uppercase",
//     marginBottom: 6,
//     display: "block",
//   };

//   return (
//     <div
//       onClick={saving ? undefined : onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 999,
//         background: "rgba(20,18,14,0.6)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(4px)",
//         padding: 20,
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#FFFDF7",
//           borderRadius: 18,
//           width: "100%",
//           maxWidth: 520,
//           padding: 32,
//           boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         <h2
//           style={{
//             margin: "0 0 24px",
//             fontSize: 20,
//             fontWeight: 800,
//             color: "#2C2A22",
//             fontFamily: "'Georgia', serif",
//           }}
//         >
//           {isEdit ? "✏️ Edit Homework" : "➕ Assign New Homework"}
//         </h2>

//         <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
//           {/* Title */}
//           <div>
//             <label style={lbl}>Title *</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Chapter 5 – Practice Problems"
//               style={inp}
//               disabled={saving}
//               autoFocus
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label style={lbl}>Description (optional)</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Instructions, page numbers, or any notes for students…"
//               rows={4}
//               style={{
//                 ...inp,
//                 resize: "vertical",
//                 lineHeight: 1.6,
//               }}
//               disabled={saving}
//             />
//           </div>

//           {/* Due date */}
//           <div>
//             <label style={lbl}>Due Date & Time (optional)</label>
//             <input
//               type="datetime-local"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               style={inp}
//               disabled={saving}
//             />
//             {dueDate && (
//               <button
//                 onClick={() => setDueDate("")}
//                 style={{
//                   marginTop: 6,
//                   background: "none",
//                   border: "none",
//                   color: "#AAA",
//                   fontSize: 12,
//                   cursor: "pointer",
//                   padding: 0,
//                 }}
//               >
//                 ✕ Clear due date
//               </button>
//             )}
//           </div>
//         </div>

//         {error && (
//           <p
//             style={{
//               color: "#C0392B",
//               fontSize: 13,
//               marginTop: 14,
//               marginBottom: 0,
//             }}
//           >
//             ⚠️ {error}
//           </p>
//         )}

//         <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             style={{
//               flex: 1,
//               padding: "12px 0",
//               borderRadius: 10,
//               background: saving ? "#AAA" : "#2C2A22",
//               color: "#FFFDF7",
//               border: "none",
//               fontWeight: 800,
//               fontSize: 15,
//               cursor: saving ? "not-allowed" : "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 8,
//             }}
//           >
//             {saving ? (
//               <>
//                 <span
//                   style={{
//                     width: 14,
//                     height: 14,
//                     border: "2px solid #fff6",
//                     borderTopColor: "#fff",
//                     borderRadius: "50%",
//                     animation: "spin 0.7s linear infinite",
//                     display: "inline-block",
//                   }}
//                 />
//                 Saving…
//               </>
//             ) : isEdit ? (
//               "Save Changes"
//             ) : (
//               "Assign Homework"
//             )}
//           </button>
//           <button
//             onClick={saving ? undefined : onClose}
//             style={{
//               padding: "12px 20px",
//               borderRadius: 10,
//               background: "#F0EBE0",
//               color: "#555",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 15,
//               cursor: saving ? "not-allowed" : "pointer",
//               opacity: saving ? 0.5 : 1,
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
// function DeleteConfirmModal({
//   hw,
//   onClose,
//   onConfirm,
//   deleting,
// }: {
//   hw: Homework;
//   onClose: () => void;
//   onConfirm: () => void;
//   deleting: boolean;
// }) {
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1001,
//         background: "rgba(20,18,14,0.6)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(4px)",
//         padding: 20,
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#FFFDF7",
//           borderRadius: 16,
//           padding: 32,
//           width: "100%",
//           maxWidth: 420,
//           boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
//           textAlign: "center",
//         }}
//       >
//         <div style={{ fontSize: 42, marginBottom: 12 }}>🗑️</div>
//         <h3
//           style={{
//             margin: "0 0 8px",
//             fontSize: 18,
//             fontWeight: 800,
//             color: "#2C2A22",
//           }}
//         >
//           Delete Homework?
//         </h3>
//         <p
//           style={{ color: "#666", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}
//         >
//           "<strong>{hw.title}</strong>" will be permanently deleted.
//         </p>
//         {hw.submissionCount > 0 && (
//           <p
//             style={{
//               color: "#C0392B",
//               fontSize: 12,
//               margin: "0 0 20px",
//               padding: "8px 12px",
//               background: "#FFF0F0",
//               borderRadius: 8,
//               border: "1px solid #FFAAAA",
//             }}
//           >
//             ⚠️ This will also delete{" "}
//             <strong>{hw.submissionCount} submission record</strong>
//             {hw.submissionCount !== 1 ? "s" : ""}.
//           </p>
//         )}
//         <div
//           style={{
//             display: "flex",
//             gap: 10,
//             justifyContent: "center",
//             marginTop: 20,
//           }}
//         >
//           <button
//             onClick={onConfirm}
//             disabled={deleting}
//             style={{
//               padding: "10px 24px",
//               borderRadius: 10,
//               background: deleting ? "#AAA" : "#C0392B",
//               color: "#fff",
//               border: "none",
//               fontWeight: 800,
//               fontSize: 14,
//               cursor: deleting ? "not-allowed" : "pointer",
//             }}
//           >
//             {deleting ? "Deleting…" : "Yes, Delete"}
//           </button>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "10px 24px",
//               borderRadius: 10,
//               background: "#F0EBE0",
//               color: "#555",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Homework Card ────────────────────────────────────────────────────────────
// function HomeworkCard({
//   hw,
//   onEdit,
//   onDelete,
//   onViewSubmissions,
// }: {
//   hw: Homework;
//   onEdit: (h: Homework) => void;
//   onDelete: (h: Homework) => void;
//   onViewSubmissions: (h: Homework) => void;
// }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         background: hovered ? "#FFF9EE" : "#FFFDF7",
//         border: "1.5px solid #EEE9DC",
//         borderRadius: 14,
//         padding: "18px 22px",
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 16,
//         transition: "all .15s ease",
//         boxShadow: hovered
//           ? "0 6px 22px rgba(0,0,0,0.07)"
//           : "0 1px 4px rgba(0,0,0,0.04)",
//         flexWrap: "wrap",
//       }}
//     >
//       {/* Icon */}
//       <div
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: 12,
//           background: "#FFF3CD",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 22,
//           flexShrink: 0,
//           border: "1.5px solid #F0D080",
//         }}
//       >
//         📝
//       </div>

//       {/* Content */}
//       <div style={{ flex: 1, minWidth: 180 }}>
//         <div
//           style={{
//             fontWeight: 700,
//             fontSize: 15,
//             color: "#2C2A22",
//             marginBottom: 6,
//             lineHeight: 1.4,
//           }}
//         >
//           {hw.title}
//         </div>

//         {hw.description && (
//           <div
//             style={{
//               fontSize: 13,
//               color: "#888",
//               marginBottom: 8,
//               lineHeight: 1.5,
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//             }}
//           >
//             {hw.description}
//           </div>
//         )}

//         <div
//           style={{
//             display: "flex",
//             gap: 8,
//             flexWrap: "wrap",
//             alignItems: "center",
//           }}
//         >
//           <StatusPill status={hw.status} />

//           <span
//             style={{
//               fontSize: 11,
//               color: hw.status === "overdue" ? "#C0392B" : "#888",
//               fontWeight: hw.status === "overdue" ? 700 : 400,
//             }}
//           >
//             📅 {formatDueDate(hw.dueDate)}
//           </span>

//           {/* Submission count chip */}
//           <button
//             onClick={() => onViewSubmissions(hw)}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 4,
//               padding: "2px 10px",
//               borderRadius: 20,
//               background: "#EAF4FF",
//               color: "#1A6FB5",
//               fontSize: 11,
//               fontWeight: 700,
//               border: "1px solid #A8CCEE",
//               cursor: "pointer",
//             }}
//           >
//             👥 {hw.submissionCount} submission
//             {hw.submissionCount !== 1 ? "s" : ""}
//           </button>
//         </div>
//       </div>

//       {/* Date + actions */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//           gap: 8,
//           flexShrink: 0,
//         }}
//       >
//         <div style={{ fontSize: 11, color: "#CCC" }}>
//           Created{" "}
//           {new Date(hw.createdAt).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}
//         </div>
//         <div style={{ display: "flex", gap: 6 }}>
//           <ActionBtn
//             label="Submissions"
//             emoji="👥"
//             color="#1A6FB5"
//             bg="#EAF4FF"
//             onClick={() => onViewSubmissions(hw)}
//           />
//           <ActionBtn
//             label="Edit"
//             emoji="✏️"
//             color="#7A5C1A"
//             bg="#FFF3CD"
//             onClick={() => onEdit(hw)}
//           />
//           <ActionBtn
//             label="Delete"
//             emoji="🗑"
//             color="#C0392B"
//             bg="#FDECEC"
//             onClick={() => onDelete(hw)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActionBtn({
//   label,
//   emoji,
//   color,
//   bg,
//   onClick,
// }: {
//   label: string;
//   emoji: string;
//   color: string;
//   bg: string;
//   onClick: () => void;
// }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button
//       title={label}
//       onClick={onClick}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 4,
//         padding: "6px 12px",
//         borderRadius: 8,
//         background: hovered ? color : bg,
//         color: hovered ? "#fff" : color,
//         border: `1.5px solid ${color}22`,
//         cursor: "pointer",
//         fontWeight: 700,
//         fontSize: 12,
//         transition: "all .15s",
//         whiteSpace: "nowrap",
//       }}
//     >
//       {emoji} {label}
//     </button>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div
//       style={{
//         background: "#FFFDF7",
//         border: "1.5px solid #EEE9DC",
//         borderRadius: 14,
//         padding: "18px 22px",
//         display: "flex",
//         gap: 16,
//       }}
//     >
//       <div
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: 12,
//           background: "#F0EBE0",
//           animation: "pulse 1.4s ease-in-out infinite",
//           flexShrink: 0,
//         }}
//       />
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
//         <div
//           style={{
//             height: 14,
//             width: "60%",
//             borderRadius: 6,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out infinite",
//           }}
//         />
//         <div
//           style={{
//             height: 11,
//             width: "85%",
//             borderRadius: 6,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out 0.15s infinite",
//           }}
//         />
//         <div
//           style={{
//             height: 11,
//             width: "40%",
//             borderRadius: 6,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out 0.3s infinite",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// // ─── Main View ────────────────────────────────────────────────────────────────
// export default function HomeworkView() {
//   const [allHW, setAllHW] = useState<Homework[]>([]);
//   const [activeFilter, setActiveFilter] = useState<string>("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [loadError, setLoadError] = useState("");

//   // Modals
//   const [editingHW, setEditingHW] = useState<Homework | null | undefined>(undefined);
//   const [deletingHW, setDeletingHW] = useState<Homework | null>(null);
//   const [deleting, setDeleting] = useState(false);
//   const [viewingSubmissions, setViewingSubmissions] = useState<Homework | null>(null);

//   const load = useCallback(
//     async (isRefresh = false) => {
//       if (isRefresh) setRefreshing(true);
//       else setLoading(true);
//       setLoadError("");
//       try {
//         const { homework } = await API.list({
//           search,
//           status: activeFilter,
//         });
//         setAllHW(homework);
//       } catch (e) {
//         setLoadError(e instanceof Error ? e.message : "Failed to load homework");
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [search, activeFilter]
//   );

//   // Debounce search
//   useEffect(() => {
//     const t = setTimeout(() => load(), search ? 350 : 0);
//     return () => clearTimeout(t);
//   }, [load, search]);

//   const handleDelete = async () => {
//     if (!deletingHW) return;
//     setDeleting(true);
//     try {
//       await API.delete(deletingHW.id);
//       setDeletingHW(null);
//       load(true);
//     } catch {
//       /* ignore — could show toast */
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const counts = {
//     all: allHW.length,
//     upcoming: allHW.filter((h) => h.status === "upcoming").length,
//     overdue: allHW.filter((h) => h.status === "overdue").length,
//     "no-due-date": allHW.filter((h) => h.status === "no-due-date").length,
//   };

//   const FILTERS = [
//     { key: "all", label: "All", emoji: "📋" },
//     { key: "upcoming", label: "Active", emoji: "🟢" },
//     { key: "overdue", label: "Overdue", emoji: "🔴" },
//     { key: "no-due-date", label: "Open", emoji: "⚪" },
//   ] as const;

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto" }}>
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.45; }
//         }
//       `}</style>

//       {/* ── Header ── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           marginBottom: 24,
//           flexWrap: "wrap",
//           gap: 12,
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: 26,
//               fontWeight: 900,
//               color: "#2C2A22",
//               fontFamily: "'Georgia', serif",
//             }}
//           >
//             📝 Homework Manager
//           </h1>
//           <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//             Assign and track homework for students
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button
//             onClick={() => load(true)}
//             disabled={refreshing}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "11px 16px",
//               borderRadius: 10,
//               background: "#F0EBE0",
//               color: "#555",
//               border: "1.5px solid #DDD8CC",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: refreshing ? "not-allowed" : "pointer",
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-block",
//                 animation: refreshing ? "spin 0.7s linear infinite" : "none",
//               }}
//             >
//               🔄
//             </span>
//             {refreshing ? "Refreshing…" : "Refresh"}
//           </button>
//           <button
//             onClick={() => setEditingHW(null)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "11px 20px",
//               borderRadius: 10,
//               background: "#2C2A22",
//               color: "#FFFDF7",
//               border: "none",
//               fontWeight: 800,
//               fontSize: 14,
//               cursor: "pointer",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//             }}
//           >
//             ➕ Assign Homework
//           </button>
//         </div>
//       </div>

//       {/* ── Filters + Search ── */}
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           marginBottom: 20,
//           flexWrap: "wrap",
//           alignItems: "center",
//         }}
//       >
//         {FILTERS.map(({ key, label, emoji }) => (
//           <button
//             key={key}
//             onClick={() => setActiveFilter(key)}
//             style={{
//               padding: "8px 16px",
//               borderRadius: 30,
//               background: activeFilter === key ? "#2C2A22" : "#F0EBE0",
//               color: activeFilter === key ? "#FFFDF7" : "#666",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: "pointer",
//               transition: "all .15s",
//               display: "flex",
//               alignItems: "center",
//               gap: 5,
//             }}
//           >
//             {emoji} {label}
//             <span
//               style={{
//                 padding: "1px 7px",
//                 borderRadius: 10,
//                 background:
//                   activeFilter === key ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//                 color: activeFilter === key ? "#fff" : "#888",
//                 fontSize: 11,
//                 fontWeight: 800,
//               }}
//             >
//               {counts[key as keyof typeof counts] ?? 0}
//             </span>
//           </button>
//         ))}

//         {/* Search */}
//         <div style={{ marginLeft: "auto", position: "relative" }}>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍  Search homework…"
//             style={{
//               padding: "8px 36px 8px 14px",
//               border: "1.5px solid #DDD8CC",
//               borderRadius: 30,
//               background: "#FAF7EE",
//               color: "#2C2A22",
//               fontSize: 13,
//               outline: "none",
//               fontFamily: "inherit",
//               minWidth: 210,
//             }}
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               style={{
//                 position: "absolute",
//                 right: 10,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "#AAA",
//                 fontSize: 14,
//                 padding: 0,
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Summary strip ── */}
//       {!loading && allHW.length > 0 && (
//         <div
//           style={{
//             display: "flex",
//             gap: 10,
//             marginBottom: 18,
//             padding: "10px 16px",
//             borderRadius: 10,
//             background: "#FAF7EE",
//             border: "1px solid #EEE9DC",
//             fontSize: 12,
//             color: "#888",
//             flexWrap: "wrap",
//             alignItems: "center",
//           }}
//         >
//           <span>
//             🟢 <strong style={{ color: "#1A7A3A" }}>{counts.upcoming}</strong> active
//           </span>
//           <span style={{ color: "#DDD8CC" }}>•</span>
//           <span>
//             🔴 <strong style={{ color: "#C0392B" }}>{counts.overdue}</strong> overdue
//           </span>
//           <span style={{ color: "#DDD8CC" }}>•</span>
//           <span>
//             ⚪ <strong style={{ color: "#8B7D5A" }}>{counts["no-due-date"]}</strong> open
//           </span>
//         </div>
//       )}

//       {/* ── Error ── */}
//       {loadError && (
//         <div
//           style={{
//             padding: "14px 18px",
//             borderRadius: 12,
//             background: "#FFF0F0",
//             border: "1.5px solid #FFCCCC",
//             color: "#C0392B",
//             fontSize: 14,
//             marginBottom: 16,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 12,
//           }}
//         >
//           <span>⚠️ {loadError}</span>
//           <button
//             onClick={() => load()}
//             style={{
//               padding: "6px 14px",
//               borderRadius: 8,
//               background: "#C0392B",
//               color: "#fff",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 12,
//               cursor: "pointer",
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ── List ── */}
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {Array.from({ length: 4 }).map((_, i) => (
//             <SkeletonCard key={i} />
//           ))}
//         </div>
//       ) : allHW.length === 0 && !loadError ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "64px 0",
//             color: "#CCC",
//             fontSize: 15,
//             border: "2px dashed #EEE9DC",
//             borderRadius: 14,
//           }}
//         >
//           {search.trim()
//             ? `No homework matches "${search}".`
//             : activeFilter !== "all"
//             ? `No ${activeFilter} homework.`
//             : "No homework assigned yet. Click ➕ Assign Homework to get started."}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {allHW.map((hw) => (
//             <HomeworkCard
//               key={hw.id}
//               hw={hw}
//               onEdit={setEditingHW}
//               onDelete={setDeletingHW}
//               onViewSubmissions={setViewingSubmissions}
//             />
//           ))}
//         </div>
//       )}

//       {/* ── Modals ── */}
//       {editingHW !== undefined && (
//         <HomeworkFormModal
//           editHW={editingHW}
//           onClose={() => setEditingHW(undefined)}
//           onSaved={() => load(true)}
//         />
//       )}
//       {deletingHW && (
//         <DeleteConfirmModal
//           hw={deletingHW}
//           onClose={() => setDeletingHW(null)}
//           onConfirm={handleDelete}
//           deleting={deleting}
//         />
//       )}
//       {viewingSubmissions && (
//         <SubmissionsModal
//           homeworkId={viewingSubmissions.id}
//           title={viewingSubmissions.title}
//           onClose={() => setViewingSubmissions(null)}
//         />
//       )}
//     </div>
//   );
// }














"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────
type FileType = "pdf" | "image";

interface HomeworkFile {
  id: string;
  serialId: number;
  title: string;
  label: string;
  fileType: FileType;
  fileUrl: string;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Supabase Storage config ──────────────────────────────────────────────────
const BUCKET = "homework-files";

async function uploadFileToSupabase(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ fileUrl: string; storagePath: string; fileType: FileType }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `homework/${Date.now()}-${safeName}`;
  const fileType: FileType = file.type.startsWith("image/") ? "image" : "pdf";

  onProgress?.(10);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  onProgress?.(90);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  onProgress?.(100);

  return { fileUrl: data.publicUrl, storagePath, fileType };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    "Content-Type": "application/json",
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────
const API = {
  list: async (): Promise<HomeworkFile[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/homework-files", { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.homeworkFiles ?? [];
  },

  create: async (fields: {
    title: string; label: string; serialId: number;
    fileUrl: string; storagePath: string; fileType: FileType;
  }): Promise<HomeworkFile> => {
    const headers = await getAuthHeaders();
    const res = await fetch("/api/admin/homework-files", {
      method: "POST", headers, body: JSON.stringify(fields),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.homeworkFile;
  },

  update: async (id: string, fields: {
    title?: string; label?: string; serialId?: number;
    fileUrl?: string; storagePath?: string; fileType?: FileType;
  }): Promise<HomeworkFile> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/homework-files/${id}`, {
      method: "PATCH", headers, body: JSON.stringify(fields),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
    return json.homeworkFile;
  },

  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/homework-files/${id}`, { method: "DELETE", headers });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? `Server error ${res.status}`);
    }
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function storagePathToName(storagePath: string): string {
  const filename = storagePath.split("/").pop() ?? storagePath;
  return filename.replace(/^\d+-/, "").replace(/_/g, " ");
}

function FileTypePill({ fileType }: { fileType: FileType }) {
  const isPdf = fileType === "pdf";
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      background: isPdf ? "#FFF0F0" : "#EAF4FF",
      color: isPdf ? "#C0392B" : "#1A6FB5",
      fontSize: 11, fontWeight: 700,
      border: `1px solid ${isPdf ? "#FFAAAA" : "#A8CCEE"}`,
      letterSpacing: 0.5, textTransform: "uppercase",
    }}>
      {isPdf ? "📄 PDF" : "🖼 Image"}
    </span>
  );
}

function Badge({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      background: "#FFF3CD", color: "#92660A", fontSize: 11, fontWeight: 600,
      letterSpacing: 0.4, border: "1px solid #F0D080",
    }}>{text}</span>
  );
}

// ─── Upload Progress ──────────────────────────────────────────────────────────
function UploadProgress({ pct, filename }: { pct: number; filename: string }) {
  return (
    <div style={{
      padding: "12px 14px", borderRadius: 10,
      background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>⬆️ Uploading {filename}…</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "#C8E0F8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, background: "#1A6FB5",
          width: `${pct}%`, transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ file, onClose }: { file: HomeworkFile; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,14,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 980,
        height: "calc(100vh - 40px)", maxHeight: 880,
        display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 22px", borderBottom: "1px solid #EEE9DC",
          background: "#FAF7EE", flexShrink: 0, gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 20 }}>{file.fileType === "pdf" ? "📄" : "🖼"}</span>
            <span style={{
              fontWeight: 700, fontSize: 15, color: "#2C2A22",
              fontFamily: "'Georgia', serif", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{file.title}</span>
            <FileTypePill fileType={file.fileType} />
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{
              padding: "7px 16px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>Open in Tab ↗</a>
            <button onClick={onClose} style={{
              padding: "7px 16px", borderRadius: 8, background: "#F0EBE0", color: "#555",
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>✕ Close</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
          {loading && !loadError && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
            }}>
              <div style={{
                width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
              Loading…
            </div>
          )}
          {loadError ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "#EEE", gap: 16, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>File could not be loaded</div>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                padding: "10px 24px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Open in Tab ↗</a>
            </div>
          ) : file.fileType === "image" ? (
            <img
              key={file.fileUrl}
              src={file.fileUrl}
              alt={file.title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setLoadError(true); }}
              style={{
                width: "100%", height: "100%", objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <iframe
              key={file.fileUrl}
              src={file.fileUrl}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={file.title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setLoadError(true); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function HomeworkFileFormModal({
  editItem, onClose, onSaved,
}: {
  editItem?: HomeworkFile | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!editItem;
  const [title, setTitle] = useState(editItem?.title ?? "");
  const [label, setLabel] = useState(editItem?.label ?? "");
  const [serialId, setSerialId] = useState<number>(editItem?.serialId ?? 1);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const currentFileName = editItem?.storagePath ? storagePathToName(editItem.storagePath) : null;
  const currentFileType = editItem?.fileType;

  const handleSubmit = async () => {
    if (!title.trim()) return setError("Title is required.");
    if (!isEdit && !newFile) return setError("Please select a PDF or image file.");
    setError("");

    let fileUrl = editItem?.fileUrl;
    let storagePath = editItem?.storagePath;
    let fileType = editItem?.fileType;

    if (newFile) {
      setUploading(true);
      setUploadPct(0);
      try {
        const result = await uploadFileToSupabase(newFile, setUploadPct);
        fileUrl = result.fileUrl;
        storagePath = result.storagePath;
        fileType = result.fileType;
      } catch (err) {
        setUploading(false);
        setError(err instanceof Error ? err.message : "Upload failed");
        return;
      }
      setUploading(false);
    }

    setSaving(true);
    try {
      if (isEdit) {
        await API.update(editItem!.id, { title, label, serialId, fileUrl, storagePath, fileType });
      } else {
        await API.create({ title, label, serialId, fileUrl: fileUrl!, storagePath: storagePath!, fileType: fileType! });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const isBusy = uploading || saving;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #DDD8CC", background: "#FFFDF7", color: "#2C2A22",
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.6,
    textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  const previewFileType = newFile
    ? (newFile.type.startsWith("image/") ? "image" : "pdf")
    : currentFileType;

  return (
    <div onClick={isBusy ? undefined : onClose} style={{
      position: "fixed", inset: 0, zIndex: 999, background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 520, padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto",
      }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
          {isEdit ? "✏️ Edit Homework File" : "➕ Upload Homework File"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Serial ID */}
          <div>
            <label style={labelStyle}>Serial ID (sort order)</label>
            <input type="number" min={1} value={serialId}
              onChange={(e) => setSerialId(Number(e.target.value))}
              style={{ ...inputStyle, width: 110 }} disabled={isBusy}
            />
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 – Worksheet"
              style={inputStyle} disabled={isBusy} autoFocus
            />
          </div>

          {/* Label */}
          <div>
            <label style={labelStyle}>Label (optional tag)</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Maths, Week 2, Practice…"
              style={inputStyle} disabled={isBusy}
            />
          </div>

          {/* File section */}
          <div>
            <label style={labelStyle}>File (PDF or Image)</label>

            {uploading && newFile && (
              <UploadProgress pct={uploadPct} filename={newFile.name} />
            )}

            {/* Current file indicator (edit mode, no new file) */}
            {isEdit && !newFile && !uploading && currentFileName && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#F0FBF3", border: "1.5px solid #8ED4A8", marginBottom: 8,
              }}>
                <span style={{ fontSize: 20 }}>{currentFileType === "image" ? "🖼" : "📄"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A7A3A" }}>Current File</div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentFileName}
                  </div>
                </div>
                <button onClick={() => fileRef.current?.click()} disabled={isBusy} style={{
                  padding: "5px 12px", borderRadius: 6, background: "#2C2A22", color: "#FFFDF7",
                  border: "none", fontSize: 11, fontWeight: 700,
                  cursor: isBusy ? "not-allowed" : "pointer", flexShrink: 0,
                }}>Replace</button>
              </div>
            )}

            {/* New file selected */}
            {newFile && !uploading && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8,
                background: "#EAF4FF", border: "1.5px solid #A8CCEE", marginBottom: 8,
              }}>
                <span style={{ fontSize: 20 }}>{previewFileType === "image" ? "🖼" : "📋"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1A6FB5" }}>
                    {isEdit ? "New file (will replace current)" : "File selected"}
                  </div>
                  <div style={{ fontSize: 13, color: "#2C2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {newFile.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {(newFile.size / 1024 / 1024).toFixed(2)} MB · {previewFileType?.toUpperCase()}
                  </div>
                </div>
                <button onClick={() => setNewFile(null)} style={{
                  padding: "5px 10px", borderRadius: 6, background: "#FDECEC", color: "#C0392B",
                  border: "1px solid #FFAAAA", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", flexShrink: 0,
                }}>✕</button>
              </div>
            )}

            {/* Drop zone */}
            {!uploading && !(isEdit && !newFile && currentFileName) && (
              <div onClick={() => !isBusy && fileRef.current?.click()} style={{
                border: "2px dashed #CCC8BE", borderRadius: 10, padding: "20px",
                cursor: isBusy ? "not-allowed" : "pointer",
                background: "#FAF7EE", color: "#888",
                fontSize: 13, fontWeight: 600, textAlign: "center",
                opacity: isBusy ? 0.5 : 1,
              }}>
                📂 Click to {isEdit ? "replace" : "select"} file
                <div style={{ fontSize: 11, marginTop: 5, color: "#BBB" }}>
                  PDF or Image (JPG, PNG, WEBP) · No size limit
                </div>
              </div>
            )}

            <input
              ref={fileRef} type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={(e) => { setNewFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "#C0392B", fontSize: 13, marginTop: 12, marginBottom: 0 }}>⚠️ {error}</p>
        )}

        {(uploading || saving) && (
          <p style={{ color: "#1A6FB5", fontSize: 13, marginTop: 10, marginBottom: 0, fontWeight: 600 }}>
            {uploading ? `⬆️ Uploading… ${uploadPct}%` : "💾 Saving…"}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={isBusy} style={{
            flex: 1, padding: "12px 0", borderRadius: 10,
            background: isBusy ? "#AAA" : "#2C2A22",
            color: "#FFFDF7", border: "none",
            fontWeight: 800, fontSize: 15, cursor: isBusy ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {isBusy ? (
              <>
                <span style={{
                  width: 14, height: 14, border: "2px solid #fff6", borderTopColor: "#fff",
                  borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
                }} />
                {uploading ? `Uploading… ${uploadPct}%` : "Saving…"}
              </>
            ) : isEdit ? "Save Changes" : "Upload File"}
          </button>
          <button onClick={isBusy ? undefined : onClose} style={{
            padding: "12px 20px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 15,
            cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirmModal({ item, onClose, onConfirm, deleting }: {
  item: HomeworkFile; onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1001, background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)", padding: 20, boxSizing: "border-box",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#FFFDF7", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#2C2A22" }}>Delete File?</h3>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
          "<strong>{item.title}</strong>" will be permanently deleted along with its file from storage.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onConfirm} disabled={deleting} style={{
            padding: "10px 24px", borderRadius: 10,
            background: deleting ? "#AAA" : "#C0392B",
            color: "#fff", border: "none", fontWeight: 800, fontSize: 14,
            cursor: deleting ? "not-allowed" : "pointer",
          }}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── File Card ────────────────────────────────────────────────────────────────
function FileCard({ item, onView, onEdit, onDelete }: {
  item: HomeworkFile;
  onView: (i: HomeworkFile) => void;
  onEdit: (i: HomeworkFile) => void;
  onDelete: (i: HomeworkFile) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isImage = item.fileType === "image";

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#FFF9EE" : "#FFFDF7",
        border: "1.5px solid #EEE9DC", borderRadius: 14,
        padding: "16px 20px", display: "flex", alignItems: "center",
        gap: 14, transition: "all .15s ease", flexWrap: "wrap",
        boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Serial ID badge */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: "#F5F0E4",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, color: "#8B7D5A", flexShrink: 0,
        border: "1.5px solid #E8E1CF",
      }}>#{item.serialId}</div>

      {/* File type icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: isImage ? "#EAF4FF" : "#FFE8E8",
        border: `1.5px solid ${isImage ? "#A8CCEE" : "#FFCCCC"}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>
        {isImage ? "🖼" : "📄"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 5 }}>
          {item.title}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FileTypePill fileType={item.fileType} />
          <Badge text={item.label} />
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <ActionBtn label="View"   emoji="👁"  color="#1A6FB5" bg="#EAF4FF" onClick={() => onView(item)} />
        <ActionBtn label="Edit"   emoji="✏️"  color="#7A5C1A" bg="#FFF3CD" onClick={() => onEdit(item)} />
        <ActionBtn label="Delete" emoji="🗑"  color="#C0392B" bg="#FDECEC" onClick={() => onDelete(item)} />
      </div>
    </div>
  );
}

function ActionBtn({ label, emoji, color, bg, onClick }: {
  label: string; emoji: string; color: string; bg: string; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button title={label} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8,
        background: hovered ? color : bg, color: hovered ? "#fff" : color,
        border: `1.5px solid ${color}22`, cursor: "pointer", fontWeight: 700, fontSize: 12,
        transition: "all .15s", whiteSpace: "nowrap",
      }}
    >
      {emoji} {label}
    </button>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function HomeworkFilesView() {
  const [allFiles, setAllFiles] = useState<HomeworkFile[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "pdf" | "image">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const [viewingItem, setViewingItem] = useState<HomeworkFile | null>(null);
  const [editingItem, setEditingItem] = useState<HomeworkFile | null | undefined>(undefined);
  const [deletingItem, setDeletingItem] = useState<HomeworkFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadFiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    try {
      const data = await API.list();
      setAllFiles(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load files");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await API.delete(deletingItem.id);
      setDeletingItem(null);
      loadFiles(true);
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  const filtered = allFiles
    .filter((f) => activeFilter === "all" || f.fileType === activeFilter)
    .filter((f) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return f.title.toLowerCase().includes(q) || f.label.toLowerCase().includes(q);
    });

  const counts = {
    all: allFiles.length,
    pdf: allFiles.filter((f) => f.fileType === "pdf").length,
    image: allFiles.filter((f) => f.fileType === "image").length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 880, margin: "0 auto" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 24, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
            📂 Homework Files
          </h1>
          <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
            Upload and manage PDF worksheets & images for students
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => loadFiles(true)} disabled={refreshing} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "11px 16px", borderRadius: 10, background: "#F0EBE0", color: "#555",
            border: "1.5px solid #DDD8CC", fontWeight: 700, fontSize: 14,
            cursor: refreshing ? "not-allowed" : "pointer",
          }}>
            <span style={{ display: "inline-block", animation: refreshing ? "spin 0.7s linear infinite" : "none" }}>🔄</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button onClick={() => setEditingItem(null)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10,
            background: "#2C2A22", color: "#FFFDF7", border: "none", fontWeight: 800, fontSize: 14,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            ➕ Upload File
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["all", "pdf", "image"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveFilter(tab)} style={{
            padding: "8px 18px", borderRadius: 30,
            background: activeFilter === tab ? "#2C2A22" : "#F0EBE0",
            color: activeFilter === tab ? "#FFFDF7" : "#666",
            border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
          }}>
            {tab === "all" ? "All" : tab === "pdf" ? "📄 PDFs" : "🖼 Images"}
            <span style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10,
              background: activeFilter === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
              color: activeFilter === tab ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
            }}>{counts[tab]}</span>
          </button>
        ))}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search by title or label…"
            style={{
              padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
              background: "#FAF7EE", color: "#2C2A22",
              fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 220,
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#AAA", fontSize: 14, padding: 0,
            }}>✕</button>
          )}
        </div>
      </div>

      {search.trim() && !loading && (
        <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
          {filtered.length === 0
            ? `No results for "${search}"`
            : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
        </div>
      )}

      {loadError && (
        <div style={{
          padding: "16px 20px", borderRadius: 12, background: "#FFF0F0",
          border: "1.5px solid #FFCCCC", color: "#C0392B", fontSize: 14, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span>⚠️ {loadError}</span>
          <button onClick={() => loadFiles()} style={{
            padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
            border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB", fontSize: 15 }}>
          <div style={{
            width: 32, height: 32, border: "3px solid #DDD", borderTopColor: "#888",
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
          }} />
          Loading files…
        </div>
      ) : filtered.length === 0 && !loadError ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
          border: "2px dashed #EEE9DC", borderRadius: 14,
        }}>
          {search.trim()
            ? `No files match "${search}".`
            : "No files yet. Click ➕ Upload File to get started."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((item) => (
            <FileCard
              key={item.id} item={item}
              onView={setViewingItem} onEdit={setEditingItem} onDelete={setDeletingItem}
            />
          ))}
        </div>
      )}

      {viewingItem && <PreviewModal file={viewingItem} onClose={() => setViewingItem(null)} />}
      {editingItem !== undefined && (
        <HomeworkFileFormModal
          editItem={editingItem}
          onClose={() => setEditingItem(undefined)}
          onSaved={() => loadFiles(true)}
        />
      )}
      {deletingItem && (
        <DeleteConfirmModal
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}