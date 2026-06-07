



// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type NoteType = "DEMO" | "REAL";

// interface Note {
//   id: string;
//   serialId: number;
//   title: string;
//   label: string;
//   type: NoteType;
//   pdfUrl: string | null;
//   locked: boolean;
//   createdAt: string;
// }

// interface NotesPageProps {
//   onToast: (msg: string) => void;
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
// async function fetchNotes(params: {
//   type?: NoteType | "all";
//   search?: string;
//   page?: number;
// }): Promise<{ notes: Note[]; total: number }> {
//   const headers = await getAuthHeaders();
//   const sp = new URLSearchParams();
//   if (params.type && params.type !== "all") sp.set("type", params.type);
//   if (params.search) sp.set("search", params.search);
//   if (params.page) sp.set("page", String(params.page));

//   const res = await fetch(`/api/notes?${sp.toString()}`, { headers });
//   const text = await res.text();
//   let json: { notes?: Note[]; total?: number; error?: string } = {};
//   try {
//     json = JSON.parse(text);
//   } catch {
//     throw new Error("Invalid server response");
//   }
//   if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//   return { notes: json.notes ?? [], total: json.total ?? 0 };
// }

// // ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
// function PdfModal({
//   url,
//   title,
//   onClose,
// }: {
//   url: string;
//   title: string;
//   onClose: () => void;
// }) {
//   const [loadError, setLoadError] = useState(false);
//   const [loading, setLoading] = useState(true);

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

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1000,
//         background: "rgba(20,18,14,0.85)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(8px)",
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
//           maxWidth: 980,
//           height: "calc(100vh - 48px)",
//           maxHeight: 880,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
//         }}
//       >
//         {/* Modal header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "14px 20px",
//             borderBottom: "1px solid #EEE9DC",
//             background: "#FAF7EE",
//             flexShrink: 0,
//             gap: 12,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//             <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
//             <span
//               style={{
//                 fontWeight: 700,
//                 fontSize: 15,
//                 color: "#2C2A22",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {title}
//             </span>
//             <span
//               style={{
//                 flexShrink: 0,
//                 padding: "2px 10px",
//                 borderRadius: 20,
//                 background: "#EAF4FF",
//                 color: "#1A6FB5",
//                 fontSize: 10,
//                 fontWeight: 800,
//                 letterSpacing: 0.6,
//                 border: "1px solid #A8CCEE",
//                 textTransform: "uppercase",
//               }}
//             >
//               Free Preview
//             </span>
//           </div>

//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a
//               href={url}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 padding: "7px 16px",
//                 borderRadius: 8,
//                 background: "#2C2A22",
//                 color: "#FFFDF7",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               Open in Tab ↗
//             </a>
//             <button
//               onClick={onClose}
//               style={{
//                 padding: "7px 16px",
//                 borderRadius: 8,
//                 background: "#F0EBE0",
//                 color: "#555",
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: 13,
//                 fontWeight: 600,
//               }}
//             >
//               ✕ Close
//             </button>
//           </div>
//         </div>

//         {/* PDF frame */}
//         <div
//           style={{
//             flex: 1,
//             position: "relative",
//             background: "#525659",
//             overflow: "hidden",
//           }}
//         >
//           {loading && !loadError && (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#CCC",
//                 fontSize: 14,
//                 gap: 12,
//                 zIndex: 1,
//               }}
//             >
//               <div
//                 style={{
//                   width: 36,
//                   height: 36,
//                   border: "3px solid #666",
//                   borderTopColor: "#FFF",
//                   borderRadius: "50%",
//                   animation: "spin 0.8s linear infinite",
//                 }}
//               />
//               Loading PDF…
//             </div>
//           )}
//           {loadError ? (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#EEE",
//                 gap: 16,
//                 padding: 32,
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
//               <a
//                 href={url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{
//                   padding: "10px 24px",
//                   borderRadius: 8,
//                   background: "#2C2A22",
//                   color: "#FFFDF7",
//                   fontSize: 13,
//                   fontWeight: 600,
//                   textDecoration: "none",
//                 }}
//               >
//                 Open in Tab ↗
//               </a>
//             </div>
//           ) : (
//             <iframe
//               key={url}
//               src={url}
//               style={{ width: "100%", height: "100%", border: "none", display: "block" }}
//               title={title}
//               onLoad={() => setLoading(false)}
//               onError={() => {
//                 setLoading(false);
//                 setLoadError(true);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Lock Overlay Modal ───────────────────────────────────────────────────────
// function LockedModal({ title, onClose }: { title: string; onClose: () => void }) {
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

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1000,
//         background: "rgba(20,18,14,0.7)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(8px)",
//         padding: 20,
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#FFFDF7",
//           borderRadius: 20,
//           padding: "40px 36px",
//           width: "100%",
//           maxWidth: 420,
//           textAlign: "center",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//         }}
//       >
//         <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
//         <h3
//           style={{
//             margin: "0 0 8px",
//             fontSize: 20,
//             fontWeight: 900,
//             color: "#2C2A22",
//             fontFamily: "'Georgia', serif",
//           }}
//         >
//           Premium Note
//         </h3>
//         <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
//           <strong style={{ color: "#2C2A22" }}>"{title}"</strong> is part of the paid curriculum.
//         </p>
//         <p style={{ color: "#AAA", fontSize: 13, margin: "0 0 28px" }}>
//           Online payments are coming soon. Please contact your teacher to get access.
//         </p>
//         <div
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "10px 22px",
//             borderRadius: 30,
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 14,
//             marginBottom: 20,
//             boxShadow: "0 6px 20px rgba(102,126,234,0.35)",
//           }}
//         >
//           <span>💳</span> Razorpay Payment — Coming Soon
//         </div>
//         <div>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "10px 28px",
//               borderRadius: 10,
//               background: "#F0EBE0",
//               color: "#555",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//             }}
//           >
//             Got it
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Note Card ────────────────────────────────────────────────────────────────
// function NoteCard({ note, onOpen }: { note: Note; onOpen: (n: Note) => void }) {
//   const [hovered, setHovered] = useState(false);
//   const isLocked = note.locked;

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={() => onOpen(note)}
//       style={{
//         position: "relative",
//         background: hovered ? (isLocked ? "#FDF5FF" : "#FFF9EE") : "#FFFDF7",
//         border: `1.5px solid ${isLocked ? "#E8D5F5" : "#EEE9DC"}`,
//         borderRadius: 14,
//         padding: "16px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 14,
//         cursor: "pointer",
//         transition: "all .15s ease",
//         flexWrap: "wrap",
//         boxShadow: hovered
//           ? `0 6px 22px ${isLocked ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.07)"}`
//           : "0 1px 4px rgba(0,0,0,0.04)",
//         opacity: isLocked ? 0.9 : 1,
//       }}
//     >
//       <div
//         style={{
//           width: 38,
//           height: 38,
//           borderRadius: 10,
//           background: "#F5F0E4",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontWeight: 800,
//           fontSize: 12,
//           color: "#8B7D5A",
//           flexShrink: 0,
//           border: "1.5px solid #E8E1CF",
//         }}
//       >
//         #{note.serialId}
//       </div>

//       <div
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: 10,
//           background: isLocked ? "#F5EEFF" : "#FFE8E8",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 20,
//           flexShrink: 0,
//           border: `1.5px solid ${isLocked ? "#D4AAEE" : "#FFCCCC"}`,
//         }}
//       >
//         {isLocked ? "🔒" : "📄"}
//       </div>

//       <div style={{ flex: 1, minWidth: 140 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 6 }}>
//           {note.title}
//         </div>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           <span
//             style={{
//               display: "inline-block",
//               padding: "2px 10px",
//               borderRadius: 20,
//               background: isLocked ? "#F3E8FF" : "#EAF4FF",
//               color: isLocked ? "#7A3FAF" : "#1A6FB5",
//               fontSize: 10,
//               fontWeight: 800,
//               border: `1px solid ${isLocked ? "#C89EEA" : "#A8CCEE"}`,
//               letterSpacing: 0.6,
//               textTransform: "uppercase",
//             }}
//           >
//             {isLocked ? "Premium" : "Free Preview"}
//           </span>
//           {note.label && (
//             <span
//               style={{
//                 display: "inline-block",
//                 padding: "2px 10px",
//                 borderRadius: 20,
//                 background: "#FFF3CD",
//                 color: "#92660A",
//                 fontSize: 10,
//                 fontWeight: 600,
//                 letterSpacing: 0.4,
//                 border: "1px solid #F0D080",
//               }}
//             >
//               {note.label}
//             </span>
//           )}
//         </div>
//       </div>

//       <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
//         {new Date(note.createdAt).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         })}
//       </div>

//       <div
//         style={{
//           flexShrink: 0,
//           padding: "8px 18px",
//           borderRadius: 8,
//           background: isLocked
//             ? hovered ? "#764ba2" : "#EEE5F8"
//             : hovered ? "#2C2A22" : "#EEE9DC",
//           color: isLocked
//             ? hovered ? "#fff" : "#764ba2"
//             : hovered ? "#FFFDF7" : "#555",
//           fontWeight: 700,
//           fontSize: 12,
//           transition: "all .15s",
//           border: "none",
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//           whiteSpace: "nowrap",
//         }}
//       >
//         {isLocked ? "🔒 Unlock" : "👁 View PDF"}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton loader ──────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div
//       style={{
//         background: "#FFFDF7",
//         border: "1.5px solid #EEE9DC",
//         borderRadius: 14,
//         padding: "16px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 14,
//       }}
//     >
//       {["38px", "40px"].map((w, i) => (
//         <div
//           key={i}
//           style={{
//             width: w,
//             height: w,
//             borderRadius: 10,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out infinite",
//             flexShrink: 0,
//           }}
//         />
//       ))}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//         <div
//           style={{
//             height: 14,
//             width: "55%",
//             borderRadius: 6,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out infinite",
//           }}
//         />
//         <div
//           style={{
//             height: 10,
//             width: "30%",
//             borderRadius: 6,
//             background: "#F0EBE0",
//             animation: "pulse 1.4s ease-in-out 0.2s infinite",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function NotesPage({ onToast }: NotesPageProps) {
//   const [allNotes, setAllNotes] = useState<Note[]>([]);
//   const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [viewingNote, setViewingNote] = useState<Note | null>(null);
//   const [lockedNote, setLockedNote] = useState<Note | null>(null);
//   const searchRef = useRef<HTMLInputElement>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setLoadError("");
//     try {
//       const { notes } = await fetchNotes({ type: activeTab, search });
//       setAllNotes(notes);
//     } catch (e) {
//       setLoadError(e instanceof Error ? e.message : "Failed to load notes");
//     } finally {
//       setLoading(false);
//     }
//   }, [activeTab, search]);

//   useEffect(() => {
//     const t = setTimeout(() => load(), search ? 350 : 0);
//     return () => clearTimeout(t);
//   }, [load, search]);

//   const handleOpen = (note: Note) => {
//     if (note.locked || !note.pdfUrl) {
//       setLockedNote(note);
//       onToast("This is a premium note 🔒");
//     } else {
//       setViewingNote(note);
//       onToast(`Opening: ${note.title}`);
//     }
//   };

//   const counts = {
//     all: allNotes.length,
//     DEMO: allNotes.filter((n) => !n.locked).length,
//     REAL: allNotes.filter((n) => n.locked).length,
//   };

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.45; }
//         }
//       `}</style>

//       <div style={{ marginBottom: 28 }}>
//         <h1
//           style={{
//             margin: 0,
//             fontSize: 26,
//             fontWeight: 900,
//             color: "#2C2A22",
//             fontFamily: "'Georgia', serif",
//           }}
//         >
//           📚 Notes & Materials
//         </h1>
//         <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//           Study resources shared by your teacher
//         </p>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           gap: 10,
//           marginBottom: 20,
//           flexWrap: "wrap",
//           alignItems: "center",
//         }}
//       >
//         {(
//           [
//             { key: "all", label: "All Notes", emoji: "📋" },
//             { key: "DEMO", label: "Free", emoji: "🎓" },
//             { key: "REAL", label: "Premium", emoji: "🔒" },
//           ] as const
//         ).map(({ key, label, emoji }) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             style={{
//               padding: "8px 18px",
//               borderRadius: 30,
//               background: activeTab === key ? "#2C2A22" : "#F0EBE0",
//               color: activeTab === key ? "#FFFDF7" : "#666",
//               border: "none",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: "pointer",
//               transition: "all .15s",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//           >
//             {emoji} {label}
//             <span
//               style={{
//                 padding: "1px 7px",
//                 borderRadius: 10,
//                 background: activeTab === key ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//                 color: activeTab === key ? "#fff" : "#888",
//                 fontSize: 11,
//                 fontWeight: 800,
//               }}
//             >
//               {counts[key]}
//             </span>
//           </button>
//         ))}

//         <div style={{ marginLeft: "auto", position: "relative" }}>
//           <input
//             ref={searchRef}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍  Search notes…"
//             style={{
//               padding: "8px 36px 8px 14px",
//               border: "1.5px solid #DDD8CC",
//               borderRadius: 30,
//               background: "#FAF7EE",
//               color: "#2C2A22",
//               fontSize: 13,
//               outline: "none",
//               fontFamily: "inherit",
//               minWidth: 200,
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

//       {!loading && allNotes.length > 0 && (
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
//             📄 <strong style={{ color: "#2C2A22" }}>{counts.DEMO}</strong> free notes available
//           </span>
//           <span style={{ color: "#DDD8CC" }}>•</span>
//           <span>
//             🔒 <strong style={{ color: "#764ba2" }}>{counts.REAL}</strong> premium notes (payment coming soon)
//           </span>
//         </div>
//       )}

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
//             onClick={load}
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

//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {Array.from({ length: 5 }).map((_, i) => (
//             <SkeletonCard key={i} />
//           ))}
//         </div>
//       ) : allNotes.length === 0 && !loadError ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "60px 0",
//             color: "#CCC",
//             fontSize: 15,
//             border: "2px dashed #EEE9DC",
//             borderRadius: 14,
//           }}
//         >
//           {search.trim()
//             ? `No notes found for "${search}".`
//             : "No notes available yet. Check back soon!"}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {allNotes.map((note) => (
//             <NoteCard key={note.id} note={note} onOpen={handleOpen} />
//           ))}
//         </div>
//       )}

//       {viewingNote && viewingNote.pdfUrl && (
//         <PdfModal
//           url={viewingNote.pdfUrl}
//           title={viewingNote.title}
//           onClose={() => setViewingNote(null)}
//         />
//       )}
//       {lockedNote && (
//         <LockedModal title={lockedNote.title} onClose={() => setLockedNote(null)} />
//       )}
//     </div>
//   );
// }








// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type NoteType = "DEMO" | "REAL";

// interface Category {
//   id: string;
//   name: string;
//   description: string;
//   _count: { notes: number };
// }

// interface Note {
//   id: string;
//   serialId: number;
//   title: string;
//   label: string;
//   type: NoteType;
//   pdfUrl: string | null;
//   locked: boolean;
//   categoryId: string | null;
//   category: { id: string; name: string } | null;
//   createdAt: string;
// }

// interface NotesPageProps {
//   onToast: (msg: string) => void;
// }

// // ─── Auth helper ──────────────────────────────────────────────────────────────
// async function getAuthHeaders(): Promise<Record<string, string>> {
//   const { data: { session } } = await supabase.auth.getSession();
//   return {
//     Authorization: `Bearer ${session?.access_token ?? ""}`,
//     "Content-Type": "application/json",
//   };
// }

// // ─── API ──────────────────────────────────────────────────────────────────────
// async function fetchNotes(params: {
//   type?: NoteType | "all";
//   categoryId?: string;
//   search?: string;
//   page?: number;
// }): Promise<{ notes: Note[]; total: number }> {
//   const headers = await getAuthHeaders();
//   const sp = new URLSearchParams();
//   if (params.type && params.type !== "all") sp.set("type", params.type);
//   if (params.categoryId && params.categoryId !== "all") sp.set("categoryId", params.categoryId);
//   if (params.search) sp.set("search", params.search);
//   if (params.page) sp.set("page", String(params.page));

//   const res = await fetch(`/api/notes?${sp.toString()}`, { headers });
//   const text = await res.text();
//   let json: { notes?: Note[]; total?: number; error?: string } = {};
//   try { json = JSON.parse(text); } catch { throw new Error("Invalid server response"); }
//   if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
//   return { notes: json.notes ?? [], total: json.total ?? 0 };
// }

// async function fetchCategories(): Promise<Category[]> {
//   const headers = await getAuthHeaders();
//   const res = await fetch("/api/categories", { headers });
//   const text = await res.text();
//   let json: { categories?: Category[]; error?: string } = {};
//   try { json = JSON.parse(text); } catch { return []; }
//   if (!res.ok) return [];
//   return json.categories ?? [];
// }

// // ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
// function PdfModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
//   const [loadError, setLoadError] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", handler);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,14,0.85)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(8px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 18, width: "100%", maxWidth: 980,
//         height: "calc(100vh - 48px)", maxHeight: 880,
//         display: "flex", flexDirection: "column",
//         overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
//       }}>
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "14px 20px", borderBottom: "1px solid #EEE9DC",
//           background: "#FAF7EE", flexShrink: 0, gap: 12,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//             <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
//             <span style={{
//               fontWeight: 700, fontSize: 15, color: "#2C2A22",
//               overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//             }}>{title}</span>
//             <span style={{
//               flexShrink: 0, padding: "2px 10px", borderRadius: 20,
//               background: "#EAF4FF", color: "#1A6FB5",
//               fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
//               border: "1px solid #A8CCEE", textTransform: "uppercase" as const,
//             }}>Free Preview</span>
//           </div>
//           <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
//             <a href={url} target="_blank" rel="noopener noreferrer" style={{
//               padding: "7px 16px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//               fontSize: 12, fontWeight: 600, textDecoration: "none",
//             }}>Open in Tab ↗</a>
//             <button onClick={onClose} style={{
//               padding: "7px 16px", borderRadius: 8, background: "#F0EBE0", color: "#555",
//               border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
//             }}>✕ Close</button>
//           </div>
//         </div>
//         <div style={{ flex: 1, position: "relative", background: "#525659", overflow: "hidden" }}>
//           {loading && !loadError && (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center", color: "#CCC", fontSize: 14, gap: 12, zIndex: 1,
//             }}>
//               <div style={{ width: 36, height: 36, border: "3px solid #666", borderTopColor: "#FFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//               Loading PDF…
//             </div>
//           )}
//           {loadError ? (
//             <div style={{
//               position: "absolute", inset: 0, display: "flex", flexDirection: "column",
//               alignItems: "center", justifyContent: "center",
//               color: "#EEE", gap: 16, padding: 32, textAlign: "center",
//             }}>
//               <div style={{ fontSize: 48 }}>⚠️</div>
//               <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
//               <a href={url} target="_blank" rel="noopener noreferrer" style={{
//                 padding: "10px 24px", borderRadius: 8, background: "#2C2A22", color: "#FFFDF7",
//                 fontSize: 13, fontWeight: 600, textDecoration: "none",
//               }}>Open in Tab ↗</a>
//             </div>
//           ) : (
//             <iframe key={url} src={url}
//               style={{ width: "100%", height: "100%", border: "none", display: "block" }}
//               title={title}
//               onLoad={() => setLoading(false)}
//               onError={() => { setLoading(false); setLoadError(true); }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Lock Overlay Modal ───────────────────────────────────────────────────────
// function LockedModal({ title, onClose }: { title: string; onClose: () => void }) {
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", handler);
//     document.body.style.overflow = "hidden";
//     return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,14,0.7)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       backdropFilter: "blur(8px)", padding: 20, boxSizing: "border-box",
//     }}>
//       <div onClick={(e) => e.stopPropagation()} style={{
//         background: "#FFFDF7", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420,
//         textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//       }}>
//         <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
//         <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//           Premium Note
//         </h3>
//         <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
//           <strong style={{ color: "#2C2A22" }}>"{title}"</strong> is part of the paid curriculum.
//         </p>
//         <p style={{ color: "#AAA", fontSize: 13, margin: "0 0 28px" }}>
//           Online payments are coming soon. Please contact your teacher to get access.
//         </p>
//         <div style={{
//           display: "inline-flex", alignItems: "center", gap: 8,
//           padding: "10px 22px", borderRadius: 30,
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 20,
//           boxShadow: "0 6px 20px rgba(102,126,234,0.35)",
//         }}>
//           <span>💳</span> Razorpay Payment — Coming Soon
//         </div>
//         <div>
//           <button onClick={onClose} style={{
//             padding: "10px 28px", borderRadius: 10, background: "#F0EBE0", color: "#555",
//             border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
//           }}>Got it</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Note Card ────────────────────────────────────────────────────────────────
// function NoteCard({ note, onOpen }: { note: Note; onOpen: (n: Note) => void }) {
//   const [hovered, setHovered] = useState(false);
//   const isLocked = note.locked;

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={() => onOpen(note)}
//       style={{
//         position: "relative",
//         background: hovered ? (isLocked ? "#FDF5FF" : "#FFF9EE") : "#FFFDF7",
//         border: `1.5px solid ${isLocked ? "#E8D5F5" : "#EEE9DC"}`,
//         borderRadius: 14,
//         padding: "16px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 14,
//         cursor: "pointer",
//         transition: "all .15s ease",
//         flexWrap: "wrap",
//         boxShadow: hovered
//           ? `0 6px 22px ${isLocked ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.07)"}`
//           : "0 1px 4px rgba(0,0,0,0.04)",
//         opacity: isLocked ? 0.9 : 1,
//       }}
//     >
//       <div style={{
//         width: 38, height: 38, borderRadius: 10, background: "#F5F0E4",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 800, fontSize: 12, color: "#8B7D5A", flexShrink: 0, border: "1.5px solid #E8E1CF",
//       }}>
//         #{note.serialId}
//       </div>

//       <div style={{
//         width: 40, height: 40, borderRadius: 10,
//         background: isLocked ? "#F5EEFF" : "#FFE8E8",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 20, flexShrink: 0,
//         border: `1.5px solid ${isLocked ? "#D4AAEE" : "#FFCCCC"}`,
//       }}>
//         {isLocked ? "🔒" : "📄"}
//       </div>

//       <div style={{ flex: 1, minWidth: 140 }}>
//         <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 6 }}>
//           {note.title}
//         </div>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
//           {/* Free / Premium pill */}
//           <span style={{
//             display: "inline-block", padding: "2px 10px", borderRadius: 20,
//             background: isLocked ? "#F3E8FF" : "#EAF4FF",
//             color: isLocked ? "#7A3FAF" : "#1A6FB5",
//             fontSize: 10, fontWeight: 800,
//             border: `1px solid ${isLocked ? "#C89EEA" : "#A8CCEE"}`,
//             letterSpacing: 0.6, textTransform: "uppercase" as const,
//           }}>
//             {isLocked ? "Premium" : "Free Preview"}
//           </span>

//           {/* Category badge */}
//           {note.category && (
//             <span style={{
//               display: "inline-flex", alignItems: "center", gap: 3,
//               padding: "2px 10px", borderRadius: 20,
//               background: "#F3EEFF", color: "#6B35C8",
//               fontSize: 10, fontWeight: 700,
//               border: "1px solid #C8A8F0", letterSpacing: 0.4,
//             }}>
//               📁 {note.category.name}
//             </span>
//           )}

//           {/* Label badge */}
//           {note.label && (
//             <span style={{
//               display: "inline-block", padding: "2px 10px", borderRadius: 20,
//               background: "#FFF3CD", color: "#92660A",
//               fontSize: 10, fontWeight: 600, letterSpacing: 0.4, border: "1px solid #F0D080",
//             }}>
//               {note.label}
//             </span>
//           )}
//         </div>
//       </div>

//       <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
//         {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
//       </div>

//       <div style={{
//         flexShrink: 0, padding: "8px 18px", borderRadius: 8,
//         background: isLocked
//           ? hovered ? "#764ba2" : "#EEE5F8"
//           : hovered ? "#2C2A22" : "#EEE9DC",
//         color: isLocked
//           ? hovered ? "#fff" : "#764ba2"
//           : hovered ? "#FFFDF7" : "#555",
//         fontWeight: 700, fontSize: 12, transition: "all .15s",
//         border: "none", cursor: "pointer",
//         display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" as const,
//       }}>
//         {isLocked ? "🔒 Unlock" : "👁 View PDF"}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton loader ──────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div style={{
//       background: "#FFFDF7", border: "1.5px solid #EEE9DC",
//       borderRadius: 14, padding: "16px 20px",
//       display: "flex", alignItems: "center", gap: 14,
//     }}>
//       {["38px", "40px"].map((w, i) => (
//         <div key={i} style={{
//           width: w, height: w, borderRadius: 10, background: "#F0EBE0",
//           animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0,
//         }} />
//       ))}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//         <div style={{ height: 14, width: "55%", borderRadius: 6, background: "#F0EBE0", animation: "pulse 1.4s ease-in-out infinite" }} />
//         <div style={{ height: 10, width: "30%", borderRadius: 6, background: "#F0EBE0", animation: "pulse 1.4s ease-in-out 0.2s infinite" }} />
//       </div>
//     </div>
//   );
// }

// // ─── Category filter strip ────────────────────────────────────────────────────
// function CategoryStrip({
//   categories,
//   activeCategoryId,
//   allCount,
//   notes,
//   onChange,
// }: {
//   categories: Category[];
//   activeCategoryId: string;
//   allCount: number;
//   notes: Note[];
//   onChange: (id: string) => void;
// }) {
//   if (categories.length === 0) return null;

//   const countFor = (catId: string) => notes.filter((n) => n.categoryId === catId).length;

//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div style={{
//         fontSize: 11, fontWeight: 700, color: "#AAA",
//         letterSpacing: 0.8, textTransform: "uppercase" as const, marginBottom: 8,
//       }}>
//         Browse by Category
//       </div>
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         {/* All */}
//         <button onClick={() => onChange("all")} style={{
//           padding: "7px 16px", borderRadius: 30,
//           background: activeCategoryId === "all" ? "#6B35C8" : "#F3EEFF",
//           color: activeCategoryId === "all" ? "#fff" : "#6B35C8",
//           border: "1.5px solid #C8A8F0",
//           fontWeight: 700, fontSize: 12, cursor: "pointer",
//           transition: "all .15s",
//         }}>
//           📚 All
//           <span style={{
//             marginLeft: 5, padding: "1px 6px", borderRadius: 8,
//             background: activeCategoryId === "all" ? "rgba(255,255,255,0.25)" : "#C8A8F0",
//             fontSize: 11, fontWeight: 800,
//           }}>{allCount}</span>
//         </button>

//         {categories.map((cat) => {
//           const isActive = activeCategoryId === cat.id;
//           const count = countFor(cat.id);
//           return (
//             <button key={cat.id} onClick={() => onChange(cat.id)} style={{
//               padding: "7px 16px", borderRadius: 30,
//               background: isActive ? "#6B35C8" : "#F3EEFF",
//               color: isActive ? "#fff" : "#6B35C8",
//               border: "1.5px solid #C8A8F0",
//               fontWeight: 700, fontSize: 12, cursor: "pointer",
//               transition: "all .15s",
//             }}>
//               📁 {cat.name}
//               <span style={{
//                 marginLeft: 5, padding: "1px 6px", borderRadius: 8,
//                 background: isActive ? "rgba(255,255,255,0.25)" : "#C8A8F0",
//                 fontSize: 11, fontWeight: 800,
//               }}>{count}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function NotesPage({ onToast }: NotesPageProps) {
//   const [allNotes, setAllNotes] = useState<Note[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//   const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [viewingNote, setViewingNote] = useState<Note | null>(null);
//   const [lockedNote, setLockedNote] = useState<Note | null>(null);
//   const searchRef = useRef<HTMLInputElement>(null);

//   // Load categories once on mount
//   useEffect(() => {
//     fetchCategories().then(setCategories).catch(() => {});
//   }, []);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setLoadError("");
//     try {
//       const { notes } = await fetchNotes({
//         type: activeTab,
//         categoryId: activeCategoryId,
//         search,
//       });
//       setAllNotes(notes);
//     } catch (e) {
//       setLoadError(e instanceof Error ? e.message : "Failed to load notes");
//     } finally {
//       setLoading(false);
//     }
//   }, [activeTab, activeCategoryId, search]);

//   useEffect(() => {
//     const t = setTimeout(() => load(), search ? 350 : 0);
//     return () => clearTimeout(t);
//   }, [load, search]);

//   const handleOpen = (note: Note) => {
//     if (note.locked || !note.pdfUrl) {
//       setLockedNote(note);
//       onToast("This is a premium note 🔒");
//     } else {
//       setViewingNote(note);
//       onToast(`Opening: ${note.title}`);
//     }
//   };

//   // When user picks a category tab, re-fetch from server with that filter
//   const handleCategoryChange = (catId: string) => {
//     setActiveCategoryId(catId);
//   };

//   const counts = {
//     all: allNotes.length,
//     DEMO: allNotes.filter((n) => !n.locked).length,
//     REAL: allNotes.filter((n) => n.locked).length,
//   };

//   return (
//     <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
//       `}</style>

//       {/* Page header */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
//           📚 Notes & Materials
//         </h1>
//         <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//           Study resources shared by your teacher
//         </p>
//       </div>

//       {/* Category strip */}
//       <CategoryStrip
//         categories={categories}
//         activeCategoryId={activeCategoryId}
//         allCount={allNotes.length}
//         notes={allNotes}
//         onChange={handleCategoryChange}
//       />

//       {/* Type tabs + search */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
//         {(
//           [
//             { key: "all", label: "All Notes", emoji: "📋" },
//             { key: "DEMO", label: "Free", emoji: "🎓" },
//             { key: "REAL", label: "Premium", emoji: "🔒" },
//           ] as const
//         ).map(({ key, label, emoji }) => (
//           <button key={key} onClick={() => setActiveTab(key)} style={{
//             padding: "8px 18px", borderRadius: 30,
//             background: activeTab === key ? "#2C2A22" : "#F0EBE0",
//             color: activeTab === key ? "#FFFDF7" : "#666",
//             border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
//             display: "flex", alignItems: "center", gap: 6,
//           }}>
//             {emoji} {label}
//             <span style={{
//               padding: "1px 7px", borderRadius: 10,
//               background: activeTab === key ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//               color: activeTab === key ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
//             }}>
//               {counts[key]}
//             </span>
//           </button>
//         ))}

//         <div style={{ marginLeft: "auto", position: "relative" }}>
//           <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
//             placeholder="🔍  Search notes…"
//             style={{
//               padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
//               background: "#FAF7EE", color: "#2C2A22", fontSize: 13, outline: "none",
//               fontFamily: "inherit", minWidth: 200,
//             }}
//           />
//           {search && (
//             <button onClick={() => setSearch("")} style={{
//               position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//               background: "none", border: "none", cursor: "pointer", color: "#AAA", fontSize: 14, padding: 0,
//             }}>✕</button>
//           )}
//         </div>
//       </div>

//       {/* Summary bar */}
//       {!loading && allNotes.length > 0 && (
//         <div style={{
//           display: "flex", gap: 10, marginBottom: 18, padding: "10px 16px",
//           borderRadius: 10, background: "#FAF7EE", border: "1px solid #EEE9DC",
//           fontSize: 12, color: "#888", flexWrap: "wrap", alignItems: "center",
//         }}>
//           <span>📄 <strong style={{ color: "#2C2A22" }}>{counts.DEMO}</strong> free notes available</span>
//           <span style={{ color: "#DDD8CC" }}>•</span>
//           <span>🔒 <strong style={{ color: "#764ba2" }}>{counts.REAL}</strong> premium notes (payment coming soon)</span>
//           {activeCategoryId !== "all" && (
//             <>
//               <span style={{ color: "#DDD8CC" }}>•</span>
//               <span style={{ color: "#6B35C8", fontWeight: 700 }}>
//                 📁 {categories.find((c) => c.id === activeCategoryId)?.name ?? "Category"}
//               </span>
//               <button onClick={() => setActiveCategoryId("all")} style={{
//                 padding: "2px 8px", borderRadius: 10, background: "#F3EEFF", color: "#6B35C8",
//                 border: "1px solid #C8A8F0", fontSize: 11, fontWeight: 700, cursor: "pointer",
//               }}>✕ Clear</button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Error */}
//       {loadError && (
//         <div style={{
//           padding: "14px 18px", borderRadius: 12, background: "#FFF0F0",
//           border: "1.5px solid #FFCCCC", color: "#C0392B", fontSize: 14, marginBottom: 16,
//           display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
//         }}>
//           <span>⚠️ {loadError}</span>
//           <button onClick={load} style={{
//             padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
//             border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
//           }}>Retry</button>
//         </div>
//       )}

//       {/* Notes list */}
//       {loading ? (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
//         </div>
//       ) : allNotes.length === 0 && !loadError ? (
//         <div style={{
//           textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
//           border: "2px dashed #EEE9DC", borderRadius: 14,
//         }}>
//           {search.trim()
//             ? `No notes found for "${search}".`
//             : activeCategoryId !== "all"
//               ? `No notes in this category yet.`
//               : "No notes available yet. Check back soon!"}
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {allNotes.map((note) => (
//             <NoteCard key={note.id} note={note} onOpen={handleOpen} />
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       {viewingNote && viewingNote.pdfUrl && (
//         <PdfModal url={viewingNote.pdfUrl} title={viewingNote.title} onClose={() => setViewingNote(null)} />
//       )}
//       {lockedNote && (
//         <LockedModal title={lockedNote.title} onClose={() => setLockedNote(null)} />
//       )}
//     </div>
//   );
// }










"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/helpers/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  description: string;
}

interface NoteItem {
  id: string;
  serialId: number;
  title: string;
  label: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  price: number;
  discountPercent: number | null;
  effectivePrice: number;
  isPurchased: boolean;
  locked: boolean;
  demoUrl: string | null;
  realUrl: string | null;
  purchase: {
    paidAmount: number;
    discountApplied: number;
    purchasedAt: string;
  } | null;
  createdAt: string;
  _count: { purchases: number };
}

interface NotesPageProps {
  onToast?: (msg: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    "Content-Type": "application/json",
  };
}

// ─── Razorpay script loader ───────────────────────────────────────────────────

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchNotes(params: {
  search?: string;
  categoryId?: string;
  price?: string;
  access?: string;
}): Promise<{ notes: NoteItem[]; total: number }> {
  const headers = await getAuthHeaders();
  const sp = new URLSearchParams();
  if (params.search)     sp.set("search",     params.search);
  if (params.categoryId && params.categoryId !== "all") sp.set("categoryId", params.categoryId);
  if (params.price  && params.price  !== "all") sp.set("price",  params.price);
  if (params.access && params.access !== "all") sp.set("access", params.access);

  const res  = await fetch(`/api/notes?${sp}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to load notes");
  return { notes: json.notes ?? [], total: json.total ?? 0 };
}

async function fetchCategories(): Promise<Category[]> {
  const headers = await getAuthHeaders();
  const res  = await fetch("/api/notes/categories", { headers });
  const json = await res.json();
  return json.categories ?? [];
}

// ─── Purchase flow ────────────────────────────────────────────────────────────

async function createOrder(itemId: string, itemType: string, couponCode?: string) {
  const headers = await getAuthHeaders();
  const res  = await fetch("/api/razorpay-order", {
    method:  "POST",
    headers,
    body:    JSON.stringify({ itemId, itemType, couponCode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create order");
  return json;
}

async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const headers = await getAuthHeaders();
  const res  = await fetch("/api/razorpay-verify", {
    method:  "POST",
    headers,
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Verification failed");
  return json;
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

function PdfViewer({
  url, title, onClose, allowDownload,
}: {
  url: string; title: string; onClose: () => void; allowDownload: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,20,0.88)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%",
          maxWidth: 1000, height: "calc(100vh - 48px)", maxHeight: 900,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px", borderBottom: "1px solid #eee",
          background: "#fafafa", gap: 12, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <span style={{
              fontWeight: 700, fontSize: 14, color: "#1a1a2e",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{title}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "7px 14px", borderRadius: 8, background: "#5b4fcf",
                color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}
            >Open ↗</a>
            {allowDownload && (
              <a
                href={url}
                download
                style={{
                  padding: "7px 14px", borderRadius: 8, background: "#059669",
                  color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
                }}
              >⬇ Download</a>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "7px 14px", borderRadius: 8, background: "#f0f0f0",
                color: "#555", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}
            >✕</button>
          </div>
        </div>

        {/* PDF */}
        <div style={{ flex: 1, position: "relative", background: "#525659" }}>
          {loading && !error && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#ddd", fontSize: 14, gap: 10, flexDirection: "column",
            }}>
              <div style={{
                width: 32, height: 32, border: "3px solid #666",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Loading PDF…
            </div>
          )}
          {error ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#eee", gap: 12, padding: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 40 }}>⚠️</div>
              <div>PDF could not load in-browser.</div>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{
                padding: "8px 20px", borderRadius: 8, background: "#5b4fcf",
                color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Open in New Tab ↗</a>
            </div>
          ) : (
            <iframe
              key={url}
              src={url}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────

function PaymentModal({
  note, onClose, onSuccess,
}: {
  note: NoteItem; onClose: () => void; onSuccess: (updatedNote: NoteItem) => void;
}) {
  const [coupon,       setCoupon]       = useState("");
  const [couponApplied,setCouponApplied]= useState<{ code: string; saved: number; discountPercent: number } | null>(null);
  const [couponError,  setCouponError]  = useState("");
  const [validating,   setValidating]   = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const displayPrice = couponApplied
    ? note.effectivePrice - couponApplied.saved
    : note.effectivePrice;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    setCouponError("");
    try {
      // Dry-run order creation to validate coupon
      const result = await createOrder(note.id, "note", coupon.trim().toUpperCase());
      if (result.free || result.orderId) {
        setCouponApplied(result.couponApplied ?? { code: coupon.trim().toUpperCase(), saved: 0, discountPercent: 0 });
      }
    } catch (e: any) {
      setCouponError(e.message);
    } finally {
      setValidating(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Payment gateway could not load. Check your connection.");

      const order = await createOrder(note.id, "note", couponApplied?.code);

      // Free after coupon
      if (order.free) {
        onSuccess({ ...note, isPurchased: true, locked: false, realUrl: "reloaded" });
        onClose();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email ?? "";

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id:    order.orderId,
          amount:      order.amount,
          currency:    order.currency,
          name:        "Notes Library",
          description: note.title,
          prefill:     { email: userEmail },
          theme:       { color: "#5b4fcf" },
          handler: async (response: any) => {
            try {
              const verified = await verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });
              onSuccess({
                ...note,
                isPurchased: true,
                locked:      false,
                realUrl:     verified.pdfUrl,
                purchase: {
                  paidAmount:      displayPrice,
                  discountApplied: note.price - displayPrice,
                  purchasedAt:     new Date().toISOString(),
                },
              });
              onClose();
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
        });
        rzp.open();
      });
    } catch (e: any) {
      if (e.message !== "Payment cancelled.") setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1001,
        background: "rgba(10,10,20,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          width: "100%", maxWidth: 440,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a1a2e" }}>
            Unlock Full Note
          </h3>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: 14, lineHeight: 1.5 }}>
            {note.title}
          </p>
        </div>

        {/* Pricing */}
        <div style={{
          background: "#f8f7ff", borderRadius: 14, padding: "16px 20px",
          marginBottom: 20, border: "1px solid #e8e0ff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#888" }}>Base price</span>
            <span style={{ fontWeight: 700, color: "#1a1a2e" }}>₹{note.price}</span>
          </div>
          {note.discountPercent && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 13, color: "#059669" }}>Item discount ({note.discountPercent}%)</span>
              <span style={{ fontWeight: 700, color: "#059669" }}>-₹{note.price - note.effectivePrice}</span>
            </div>
          )}
          {couponApplied && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 13, color: "#059669" }}>
                Coupon {couponApplied.code} ({couponApplied.discountPercent}%)
              </span>
              <span style={{ fontWeight: 700, color: "#059669" }}>-₹{couponApplied.saved}</span>
            </div>
          )}
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 10,
            paddingTop: 10, borderTop: "1px dashed #ddd",
          }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#5b4fcf" }}>
              {displayPrice === 0 ? "FREE 🎉" : `₹${displayPrice}`}
            </span>
          </div>
        </div>

        {/* Coupon */}
        {!couponApplied && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon code (optional)"
                style={{
                  flex: 1, padding: "10px 14px", border: "2px solid #eee",
                  borderRadius: 10, fontSize: 13, fontFamily: "monospace",
                  fontWeight: 700, letterSpacing: 2, outline: "none",
                  textTransform: "uppercase",
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyCoupon(); }}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!coupon.trim() || validating}
                style={{
                  padding: "10px 16px", borderRadius: 10, background: "#1a1a2e",
                  color: "#fff", border: "none", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", opacity: !coupon.trim() || validating ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {validating ? "…" : "Apply"}
              </button>
            </div>
            {couponError && (
              <p style={{ color: "#c00", fontSize: 12, margin: "6px 0 0", fontWeight: 600 }}>
                ⚠ {couponError}
              </p>
            )}
          </div>
        )}

        {couponApplied && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", background: "#f0fdf4", border: "1.5px solid #6ee7b7",
            borderRadius: 10, marginBottom: 16,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>
              ✓ {couponApplied.code} applied — saved ₹{couponApplied.saved}
            </span>
            <button
              onClick={() => { setCouponApplied(null); setCoupon(""); }}
              style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 14 }}
            >✕</button>
          </div>
        )}

        {error && (
          <div style={{
            padding: "10px 14px", background: "#fff0f0", border: "1.5px solid #fca5a5",
            borderRadius: 10, marginBottom: 16, color: "#c00", fontSize: 13, fontWeight: 600,
          }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 12, background: "#f0f0f0",
              color: "#555", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >Cancel</button>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 12,
              background: displayPrice === 0 ? "#059669" : "linear-gradient(135deg, #5b4fcf, #7c3aed)",
              color: "#fff", border: "none", fontWeight: 800, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing…" : displayPrice === 0 ? "Get for Free 🎉" : `Pay ₹${displayPrice}`}
          </button>
        </div>

        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 11, color: "#bbb" }}>
          Secured by Razorpay · UPI, Cards, Net Banking accepted
        </p>
      </div>
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────

function NoteCard({
  note,
  onView,
  onDownload,
  onBuy,
}: {
  note: NoteItem;
  onView:     (n: NoteItem, url: string, isReal: boolean) => void;
  onDownload: (n: NoteItem) => void;
  onBuy:      (n: NoteItem) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const hasDemo    = !!note.demoUrl;
  const hasReal    = !!note.realUrl;
  const isPurchased= note.isPurchased;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? (isPurchased ? "#f0fdf4" : "#faf8ff") : "#fff",
        border: `1.5px solid ${isPurchased ? "#6ee7b7" : "#ede9fe"}`,
        borderRadius: 14, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 14,
        transition: "all .15s", flexWrap: "wrap",
        boxShadow: hovered ? "0 6px 22px rgba(91,79,207,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Serial */}
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: isPurchased ? "#d1fae5" : "#ede9fe",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: 11,
        color: isPurchased ? "#065f46" : "#5b4fcf", flexShrink: 0,
      }}>
        #{note.serialId}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{
          fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 6,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {note.title}
          {isPurchased && (
            <span style={{
              fontSize: 10, fontWeight: 800, background: "#d1fae5", color: "#065f46",
              padding: "2px 8px", borderRadius: 20, border: "1px solid #6ee7b7",
            }}>✓ Owned</span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {/* Price badge */}
          {note.price === 0 ? (
            <span style={{
              padding: "2px 10px", borderRadius: 20, background: "#d1fae5",
              color: "#065f46", fontSize: 10, fontWeight: 800, border: "1px solid #6ee7b7",
            }}>🆓 Free</span>
          ) : (
            <span style={{
              padding: "2px 10px", borderRadius: 20,
              background: isPurchased ? "#d1fae5" : "#ede9fe",
              color: isPurchased ? "#065f46" : "#5b4fcf",
              fontSize: 10, fontWeight: 800,
              border: `1px solid ${isPurchased ? "#6ee7b7" : "#c4b5fd"}`,
            }}>
              {isPurchased ? `✓ ₹${note.purchase?.paidAmount ?? note.effectivePrice}` : (
                note.discountPercent
                  ? <><s style={{ opacity: 0.5 }}>₹{note.price}</s> ₹{note.effectivePrice}</>
                  : `₹${note.price}`
              )}
            </span>
          )}

          {/* Discount badge */}
          {note.discountPercent && !isPurchased && (
            <span style={{
              padding: "2px 8px", borderRadius: 20, background: "#fef3c7",
              color: "#92400e", fontSize: 10, fontWeight: 800, border: "1px solid #fcd34d",
            }}>{note.discountPercent}% OFF</span>
          )}

          {/* Category */}
          {note.category && (
            <span style={{
              padding: "2px 10px", borderRadius: 20, background: "#f3e8ff",
              color: "#6b21a8", fontSize: 10, fontWeight: 700, border: "1px solid #d8b4fe",
            }}>📁 {note.category.name}</span>
          )}

          {/* Label */}
          {note.label && (
            <span style={{
              padding: "2px 10px", borderRadius: 20, background: "#fefce8",
              color: "#92400e", fontSize: 10, fontWeight: 600, border: "1px solid #fde68a",
            }}>{note.label}</span>
          )}

          {/* Purchase info */}
          {note.purchase && (
            <span style={{ fontSize: 10, color: "#6b7280" }}>
              Purchased {fmtDate(note.purchase.purchasedAt)}
              {note.purchase.discountApplied > 0 && ` · saved ₹${note.purchase.discountApplied}`}
            </span>
          )}
        </div>
      </div>

      {/* PDF availability */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {hasDemo && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
            background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
          }}>Preview</span>
        )}
        {hasReal && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
            background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
          }}>Full PDF</span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        {/* Demo preview always available if exists */}
        {hasDemo && (
          <button
            onClick={() => onView(note, note.demoUrl!, false)}
            style={{
              padding: "7px 14px", borderRadius: 8, background: "#eff6ff",
              color: "#1d4ed8", border: "1.5px solid #bfdbfe",
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              transition: "all .15s",
            }}
          >👁 Preview</button>
        )}

        {isPurchased && hasReal ? (
          <>
            <button
              onClick={() => onView(note, note.realUrl!, true)}
              style={{
                padding: "7px 14px", borderRadius: 8,
                background: "#f0fdf4", color: "#15803d",
                border: "1.5px solid #bbf7d0",
                fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}
            >📄 View Full</button>
            <button
              onClick={() => onDownload(note)}
              style={{
                padding: "7px 14px", borderRadius: 8, background: "#5b4fcf",
                color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}
            >⬇ Download</button>
          </>
        ) : !isPurchased && note.price > 0 ? (
          <button
            onClick={() => onBuy(note)}
            style={{
              padding: "7px 16px", borderRadius: 8,
              background: hovered ? "#5b4fcf" : "#ede9fe",
              color: hovered ? "#fff" : "#5b4fcf",
              border: "none", fontWeight: 700, fontSize: 12,
              cursor: "pointer", transition: "all .15s",
            }}
          >🔒 Unlock ₹{note.effectivePrice}</button>
        ) : null}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #eee", borderRadius: 14,
      padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
    }}>
      {[38, 40].map((s, i) => (
        <div key={i} style={{
          width: s, height: s, borderRadius: 10, background: "#f0ecff",
          animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0,
        }} />
      ))}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "55%", borderRadius: 6, background: "#f0ecff", animation: "pulse 1.4s ease-in-out infinite" }} />
        <div style={{ height: 10, width: "32%", borderRadius: 6, background: "#f0ecff", animation: "pulse 1.4s ease-in-out 0.2s infinite" }} />
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ notes }: { notes: NoteItem[] }) {
  const owned   = notes.filter((n) => n.isPurchased && n.price > 0).length;
  const free    = notes.filter((n) => n.price === 0).length;
  const locked  = notes.filter((n) => !n.isPurchased && n.price > 0).length;
  const saved   = notes.reduce((s, n) => s + (n.purchase?.discountApplied ?? 0), 0);

  return (
    <div style={{
      display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16,
    }}>
      {[
        { label: "Free Notes",  value: free,   color: "#059669", bg: "#d1fae5" },
        { label: "My Library",  value: owned,  color: "#5b4fcf", bg: "#ede9fe" },
        { label: "Locked",      value: locked, color: "#92400e", bg: "#fef3c7" },
        ...(saved > 0 ? [{ label: "Total Saved", value: `₹${saved}`, color: "#0891b2", bg: "#e0f2fe" }] : []),
      ].map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 10,
          background: s.bg, border: `1px solid ${s.color}30`,
        }}>
          <span style={{ fontWeight: 900, fontSize: 16, color: s.color }}>{s.value}</span>
          <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotesPage({ onToast }: NotesPageProps) {
  const [notes,       setNotes]       = useState<NoteItem[]>([]);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadError,   setLoadError]   = useState("");

  // Filters
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [accessFilter,setAccessFilter]= useState("all");

  // Modals
  const [viewerNote,  setViewerNote]  = useState<{ note: NoteItem; url: string; isReal: boolean } | null>(null);
  const [buyNote,     setBuyNote]     = useState<NoteItem | null>(null);

  // Load categories once
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { notes } = await fetchNotes({
        search:     search || undefined,
        categoryId: catFilter !== "all" ? catFilter : undefined,
        price:      priceFilter !== "all" ? priceFilter : undefined,
        access:     accessFilter !== "all" ? accessFilter : undefined,
      });
      setNotes(notes);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [search, catFilter, priceFilter, accessFilter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const handleView = (note: NoteItem, url: string, isReal: boolean) => {
    setViewerNote({ note, url, isReal });
    onToast?.(`Opening: ${note.title}`);
  };

  const handleDownload = (note: NoteItem) => {
    if (!note.realUrl) return;
    const a = document.createElement("a");
    a.href     = note.realUrl;
    a.download = `${note.title}.pdf`;
    a.target   = "_blank";
    a.click();
    onToast?.(`Downloading: ${note.title}`);
  };

  const handleBuySuccess = (updated: NoteItem) => {
    setNotes((ns) => ns.map((n) => (n.id === updated.id ? updated : n)));
    onToast?.(`✓ Unlocked: ${updated.title}`);
    // Reload to get fresh realUrl
    setTimeout(load, 500);
  };

  const filterBtn = (label: string, value: string, current: string, setter: (v: string) => void, color = "#5b4fcf") => (
    <button
      key={value}
      onClick={() => setter(value)}
      style={{
        padding: "7px 16px", borderRadius: 30, fontWeight: 700, fontSize: 12,
        cursor: "pointer", transition: "all .15s", border: "1.5px solid",
        background: current === value ? color : "transparent",
        borderColor: current === value ? color : "#ddd",
        color:       current === value ? "#fff" : "#666",
      }}
    >{label}</button>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}>
          📚 Notes & Materials
        </h1>
        <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
          Study resources, PDFs and test papers from your teacher
        </p>
      </div>

      {/* Stats */}
      {!loading && notes.length > 0 && <StatsBar notes={notes} />}

      {/* Filter bar */}
      <div style={{
        background: "#fff", border: "1.5px solid #eee", borderRadius: 14,
        padding: "14px 16px", marginBottom: 16, display: "flex",
        flexDirection: "column", gap: 12,
      }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title or tag…"
            style={{
              width: "100%", padding: "10px 36px 10px 38px", border: "1.5px solid #eee",
              borderRadius: 10, fontSize: 14, outline: "none",
              background: "#fafafa", boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 16,
              }}
            >✕</button>
          )}
        </div>

        {/* Filter rows */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginRight: 4 }}>ACCESS</span>
          {filterBtn("All",     "all",   accessFilter, setAccessFilter)}
          {filterBtn("🆓 Free",  "free",  accessFilter, setAccessFilter, "#059669")}
          {filterBtn("✓ My Library","owned",accessFilter, setAccessFilter, "#5b4fcf")}
          {filterBtn("🔒 Locked","locked",accessFilter, setAccessFilter, "#d97706")}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginRight: 4 }}>PRICE</span>
          {filterBtn("All",    "all",  priceFilter, setPriceFilter)}
          {filterBtn("Free",   "free", priceFilter, setPriceFilter, "#059669")}
          {filterBtn("Paid",   "paid", priceFilter, setPriceFilter, "#5b4fcf")}
        </div>

        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginRight: 4 }}>CATEGORY</span>
            {filterBtn("All", "all", catFilter, setCatFilter)}
            {categories.map((c) => filterBtn(`📁 ${c.name}`, c.id, catFilter, setCatFilter, "#6b21a8"))}
          </div>
        )}
      </div>

      {/* Error */}
      {loadError && (
        <div style={{
          padding: "14px 18px", borderRadius: 12, background: "#fff0f0",
          border: "1.5px solid #fca5a5", color: "#c0392b", fontSize: 14,
          marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12,
        }}>
          <span>⚠️ {loadError}</span>
          <button onClick={load} style={{
            padding: "6px 14px", borderRadius: 8, background: "#c0392b",
            color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>Retry</button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : notes.length === 0 && !loadError ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 15,
          border: "2px dashed #eee", borderRadius: 14,
        }}>
          {search ? `No notes found for "${search}"` : "No notes match your filters"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={handleView}
              onDownload={handleDownload}
              onBuy={setBuyNote}
            />
          ))}
        </div>
      )}

      {/* PDF Viewer */}
      {viewerNote && (
        <PdfViewer
          url={viewerNote.url}
          title={viewerNote.note.title}
          allowDownload={viewerNote.isReal && viewerNote.note.isPurchased}
          onClose={() => setViewerNote(null)}
        />
      )}

      {/* Payment Modal */}
      {buyNote && (
        <PaymentModal
          note={buyNote}
          onClose={() => setBuyNote(null)}
          onSuccess={handleBuySuccess}
        />
      )}
    </div>
  );
}