

// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

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
//           {/* <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            
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
//         </div> */}

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

//           {/* PDF frame */}
//           <div
//             style={{
//               flex: 1,
//               position: "relative",
//               background: "#525659",
//               overflow: "hidden",
//             }}
//           >
//             {loading && !loadError && (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#CCC",
//                   fontSize: 14,
//                   gap: 12,
//                   zIndex: 1,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 36,
//                     height: 36,
//                     border: "3px solid #666",
//                     borderTopColor: "#FFF",
//                     borderRadius: "50%",
//                     animation: "spin 0.8s linear infinite",
//                   }}
//                 />
//                 Loading PDF…
//               </div>
//             )}
//             {loadError ? (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#EEE",
//                   gap: 16,
//                   padding: 32,
//                   textAlign: "center",
//                 }}
//               >
//                 {/* <div style={{ fontSize: 48 }}>⚠️</div>
//                 <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>

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
//               </a> */}

//                 <div style={{ fontSize: 48 }}>⚠️</div>

//                 <div style={{ fontSize: 16, fontWeight: 700 }}>
//                   PDF could not be loaded
//                 </div>

//                 <a
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     padding: "10px 24px",
//                     borderRadius: 8,
//                     background: "#2C2A22",
//                     color: "#FFFDF7",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     textDecoration: "none",
//                   }}
//                 >
//                   Open in Tab ↗
//                 </a>
//               </div>
//             ) : (
//               <iframe
//                 key={url}
//                 src={url}
//                 style={{ width: "100%", height: "100%", border: "none", display: "block" }}
//                 title={title}
//                 onLoad={() => setLoading(false)}
//                 onError={() => {
//                   setLoading(false);
//                   setLoadError(true);
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       );


//       // ─── Lock Overlay Modal ───────────────────────────────────────────────────────
//       function LockedModal({title, onClose}: {title: string; onClose: () => void }) {
//         useEffect(() => {
//           const handler = (e: KeyboardEvent) => {
//             if (e.key === "Escape") onClose();
//           };
//           document.addEventListener("keydown", handler);
//           document.body.style.overflow = "hidden";
//           return () => {
//             document.removeEventListener("keydown", handler);
//             document.body.style.overflow = "";
//           };
//         }, [onClose]);

//       return (
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 1000,
//           background: "rgba(20,18,14,0.7)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backdropFilter: "blur(8px)",
//           padding: 20,
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           onClick={(e) => e.stopPropagation()}
//           style={{
//             background: "#FFFDF7",
//             borderRadius: 20,
//             padding: "40px 36px",
//             width: "100%",
//             maxWidth: 420,
//             textAlign: "center",
//             boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//           }}
//         >
//           <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
//           <h3
//             style={{
//               margin: "0 0 8px",
//               fontSize: 20,
//               fontWeight: 900,
//               color: "#2C2A22",
//               fontFamily: "'Georgia', serif",
//             }}
//           >
//             Premium Note
//           </h3>
//           <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
//             <strong style={{ color: "#2C2A22" }}>"{title}"</strong> is part of the paid curriculum.
//           </p>
//           <p style={{ color: "#AAA", fontSize: 13, margin: "0 0 28px" }}>
//             Online payments are coming soon. Please contact your teacher to get access.
//           </p>
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 8,
//               padding: "10px 22px",
//               borderRadius: 30,
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               color: "#fff",
//               fontWeight: 800,
//               fontSize: 14,
//               marginBottom: 20,
//               boxShadow: "0 6px 20px rgba(102,126,234,0.35)",
//             }}
//           >
//             <span>💳</span> Razorpay Payment — Coming Soon
//           </div>
//           <div>
//             <button
//               onClick={onClose}
//               style={{
//                 padding: "10px 28px",
//                 borderRadius: 10,
//                 background: "#F0EBE0",
//                 color: "#555",
//                 border: "none",
//                 fontWeight: 700,
//                 fontSize: 14,
//                 cursor: "pointer",
//               }}
//             >
//               Got it
//             </button>
//           </div>
//         </div>
//       </div>
//       );
// }

//       // ─── Note Card ────────────────────────────────────────────────────────────────
//       function NoteCard({note, onOpen}: {note: Note; onOpen: (n: Note) => void }) {
//   const [hovered, setHovered] = useState(false);
//       const isLocked = note.locked;

//       return (
//       <div
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         onClick={() => onOpen(note)}
//         style={{
//           position: "relative",
//           background: hovered ? (isLocked ? "#FDF5FF" : "#FFF9EE") : "#FFFDF7",
//           border: `1.5px solid ${isLocked ? "#E8D5F5" : "#EEE9DC"}`,
//           borderRadius: 14,
//           padding: "16px 20px",
//           display: "flex",
//           alignItems: "center",
//           gap: 14,
//           cursor: "pointer",
//           transition: "all .15s ease",
//           flexWrap: "wrap",
//           boxShadow: hovered
//             ? `0 6px 22px ${isLocked ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.07)"}`
//             : "0 1px 4px rgba(0,0,0,0.04)",
//           opacity: isLocked ? 0.9 : 1,
//         }}
//       >
//         <div
//           style={{
//             width: 38,
//             height: 38,
//             borderRadius: 10,
//             background: "#F5F0E4",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 800,
//             fontSize: 12,
//             color: "#8B7D5A",
//             flexShrink: 0,
//             border: "1.5px solid #E8E1CF",
//           }}
//         >
//           #{note.serialId}
//         </div>

//         <div
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: 10,
//             background: isLocked ? "#F5EEFF" : "#FFE8E8",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 20,
//             flexShrink: 0,
//             border: `1.5px solid ${isLocked ? "#D4AAEE" : "#FFCCCC"}`,
//           }}
//         >
//           {isLocked ? "🔒" : "📄"}
//         </div>

//         <div style={{ flex: 1, minWidth: 140 }}>
//           <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 6 }}>
//             {note.title}
//           </div>
//           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//             <span
//               style={{
//                 display: "inline-block",
//                 padding: "2px 10px",
//                 borderRadius: 20,
//                 background: isLocked ? "#F3E8FF" : "#EAF4FF",
//                 color: isLocked ? "#7A3FAF" : "#1A6FB5",
//                 fontSize: 10,
//                 fontWeight: 800,
//                 border: `1px solid ${isLocked ? "#C89EEA" : "#A8CCEE"}`,
//                 letterSpacing: 0.6,
//                 textTransform: "uppercase",
//               }}
//             >
//               {isLocked ? "Premium" : "Free Preview"}
//             </span>
//             {note.label && (
//               <span
//                 style={{
//                   display: "inline-block",
//                   padding: "2px 10px",
//                   borderRadius: 20,
//                   background: "#FFF3CD",
//                   color: "#92660A",
//                   fontSize: 10,
//                   fontWeight: 600,
//                   letterSpacing: 0.4,
//                   border: "1px solid #F0D080",
//                 }}
//               >
//                 {note.label}
//               </span>
//             )}
//           </div>
//         </div>

//         <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
//           {new Date(note.createdAt).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}
//         </div>

//         <div
//           style={{
//             flexShrink: 0,
//             padding: "8px 18px",
//             borderRadius: 8,
//             background: isLocked
//               ? hovered ? "#764ba2" : "#EEE5F8"
//               : hovered ? "#2C2A22" : "#EEE9DC",
//             color: isLocked
//               ? hovered ? "#fff" : "#764ba2"
//               : hovered ? "#FFFDF7" : "#555",
//             fontWeight: 700,
//             fontSize: 12,
//             transition: "all .15s",
//             border: "none",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {isLocked ? "🔒 Unlock" : "👁 View PDF"}
//         </div>
//       </div>
//       );
// }

//       // ─── Skeleton loader ──────────────────────────────────────────────────────────
//       function SkeletonCard() {
//   return (
//       <div
//         style={{
//           background: "#FFFDF7",
//           border: "1.5px solid #EEE9DC",
//           borderRadius: 14,
//           padding: "16px 20px",
//           display: "flex",
//           alignItems: "center",
//           gap: 14,
//         }}
//       >
//         {["38px", "40px"].map((w, i) => (
//           <div
//             key={i}
//             style={{
//               width: w,
//               height: w,
//               borderRadius: 10,
//               background: "#F0EBE0",
//               animation: "pulse 1.4s ease-in-out infinite",
//               flexShrink: 0,
//             }}
//           />
//         ))}
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
//           <div
//             style={{
//               height: 14,
//               width: "55%",
//               borderRadius: 6,
//               background: "#F0EBE0",
//               animation: "pulse 1.4s ease-in-out infinite",
//             }}
//           />
//           <div
//             style={{
//               height: 10,
//               width: "30%",
//               borderRadius: 6,
//               background: "#F0EBE0",
//               animation: "pulse 1.4s ease-in-out 0.2s infinite",
//             }}
//           />
//         </div>
//       </div>
//       );
// }

//       // ─── Main Page ────────────────────────────────────────────────────────────────
//       export default function NotesPage({onToast}: NotesPageProps) {
//   const [allNotes, setAllNotes] = useState<Note[]>([]);
//       const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
//       const [search, setSearch] = useState("");
//       const [loading, setLoading] = useState(true);
//       const [loadError, setLoadError] = useState("");
//       const [viewingNote, setViewingNote] = useState<Note | null>(null);
//       const [lockedNote, setLockedNote] = useState<Note | null>(null);
//       const searchRef = useRef<HTMLInputElement>(null);

//   const load = useCallback(async () => {
//           setLoading(true);
//         setLoadError("");
//         try {
//       const {notes} = await fetchNotes({type: activeTab, search });
//         setAllNotes(notes);
//     } catch (e) {
//           setLoadError(e instanceof Error ? e.message : "Failed to load notes");
//     } finally {
//           setLoading(false);
//     }
//   }, [activeTab, search]);

//   useEffect(() => {
//     const t = setTimeout(() => load(), search ? 350 : 0);
//     return () => clearTimeout(t);
//   }, [load, search]);

//   const handleOpen = (note: Note) => {
//     if (note.locked || !note.pdfUrl) {
//           setLockedNote(note);
//         onToast("This is a premium note 🔒");
//     } else {
//           setViewingNote(note);
//         onToast(`Opening: ${note.title}`);
//     }
//   };

//         const counts = {
//           all: allNotes.length,
//     DEMO: allNotes.filter((n) => !n.locked).length,
//     REAL: allNotes.filter((n) => n.locked).length,
//   };

//         return (
//         <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
//           <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.45; }
//         }
//       `}</style>

//           <div style={{ marginBottom: 28 }}>
//             <h1
//               style={{
//                 margin: 0,
//                 fontSize: 26,
//                 fontWeight: 900,
//                 color: "#2C2A22",
//                 fontFamily: "'Georgia', serif",
//               }}
//             >
//               📚 Notes & Materials
//             </h1>
//             <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
//               Study resources shared by your teacher
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               marginBottom: 20,
//               flexWrap: "wrap",
//               alignItems: "center",
//             }}
//           >
//             {(
//               [
//                 { key: "all", label: "All Notes", emoji: "📋" },
//                 { key: "DEMO", label: "Free", emoji: "🎓" },
//                 { key: "REAL", label: "Premium", emoji: "🔒" },
//               ] as const
//             ).map(({ key, label, emoji }) => (
//               <button
//                 key={key}
//                 onClick={() => setActiveTab(key)}
//                 style={{
//                   padding: "8px 18px",
//                   borderRadius: 30,
//                   background: activeTab === key ? "#2C2A22" : "#F0EBE0",
//                   color: activeTab === key ? "#FFFDF7" : "#666",
//                   border: "none",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   cursor: "pointer",
//                   transition: "all .15s",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                 }}
//               >
//                 {emoji} {label}
//                 <span
//                   style={{
//                     padding: "1px 7px",
//                     borderRadius: 10,
//                     background: activeTab === key ? "rgba(255,255,255,0.2)" : "#DDD8CC",
//                     color: activeTab === key ? "#fff" : "#888",
//                     fontSize: 11,
//                     fontWeight: 800,
//                   }}
//                 >
//                   {counts[key]}
//                 </span>
//               </button>
//             ))}

//             <div style={{ marginLeft: "auto", position: "relative" }}>
//               <input
//                 ref={searchRef}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="🔍  Search notes…"
//                 style={{
//                   padding: "8px 36px 8px 14px",
//                   border: "1.5px solid #DDD8CC",
//                   borderRadius: 30,
//                   background: "#FAF7EE",
//                   color: "#2C2A22",
//                   fontSize: 13,
//                   outline: "none",
//                   fontFamily: "inherit",
//                   minWidth: 200,
//                 }}
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch("")}
//                   style={{
//                     position: "absolute",
//                     right: 10,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#AAA",
//                     fontSize: 14,
//                     padding: 0,
//                   }}
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>

//           {!loading && allNotes.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 gap: 10,
//                 marginBottom: 18,
//                 padding: "10px 16px",
//                 borderRadius: 10,
//                 background: "#FAF7EE",
//                 border: "1px solid #EEE9DC",
//                 fontSize: 12,
//                 color: "#888",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//               }}
//             >
//               <span>
//                 📄 <strong style={{ color: "#2C2A22" }}>{counts.DEMO}</strong> free notes available
//               </span>
//               <span style={{ color: "#DDD8CC" }}>•</span>
//               <span>
//                 🔒 <strong style={{ color: "#764ba2" }}>{counts.REAL}</strong> premium notes (payment coming soon)
//               </span>
//             </div>
//           )}

//           {loadError && (
//             <div
//               style={{
//                 padding: "14px 18px",
//                 borderRadius: 12,
//                 background: "#FFF0F0",
//                 border: "1.5px solid #FFCCCC",
//                 color: "#C0392B",
//                 fontSize: 14,
//                 marginBottom: 16,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: 12,
//               }}
//             >
//               <span>⚠️ {loadError}</span>
//               <button
//                 onClick={load}
//                 style={{
//                   padding: "6px 14px",
//                   borderRadius: 8,
//                   background: "#C0392B",
//                   color: "#fff",
//                   border: "none",
//                   fontWeight: 700,
//                   fontSize: 12,
//                   cursor: "pointer",
//                 }}
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {loading ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <SkeletonCard key={i} />
//               ))}
//             </div>
//           ) : allNotes.length === 0 && !loadError ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "60px 0",
//                 color: "#CCC",
//                 fontSize: 15,
//                 border: "2px dashed #EEE9DC",
//                 borderRadius: 14,
//               }}
//             >
//               {search.trim()
//                 ? `No notes found for "${search}".`
//                 : "No notes available yet. Check back soon!"}
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {allNotes.map((note) => (
//                 <NoteCard key={note.id} note={note} onOpen={handleOpen} />
//               ))}
//             </div>
//           )}

//           {viewingNote && viewingNote.pdfUrl && (
//             <PdfModal
//               url={viewingNote.pdfUrl}
//               title={viewingNote.title}
//               onClose={() => setViewingNote(null)}
//             />
//           )}
//           {lockedNote && (
//             <LockedModal title={lockedNote.title} onClose={() => setLockedNote(null)} />
//           )}
//         </div>
//         );
// }











"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────
type NoteType = "DEMO" | "REAL";

interface Note {
  id: string;
  serialId: number;
  title: string;
  label: string;
  type: NoteType;
  pdfUrl: string | null;
  locked: boolean;
  createdAt: string;
}

interface NotesPageProps {
  onToast: (msg: string) => void;
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    "Content-Type": "application/json",
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchNotes(params: {
  type?: NoteType | "all";
  search?: string;
  page?: number;
}): Promise<{ notes: Note[]; total: number }> {
  const headers = await getAuthHeaders();
  const sp = new URLSearchParams();
  if (params.type && params.type !== "all") sp.set("type", params.type);
  if (params.search) sp.set("search", params.search);
  if (params.page) sp.set("page", String(params.page));

  const res = await fetch(`/api/notes?${sp.toString()}`, { headers });
  const text = await res.text();
  let json: { notes?: Note[]; total?: number; error?: string } = {};
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Invalid server response");
  }
  if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
  return { notes: json.notes ?? [], total: json.total ?? 0 };
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PdfModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(20,18,14,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFDF7",
          borderRadius: 18,
          width: "100%",
          maxWidth: 980,
          height: "calc(100vh - 48px)",
          maxHeight: 880,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #EEE9DC",
            background: "#FAF7EE",
            flexShrink: 0,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#2C2A22",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </span>
            <span
              style={{
                flexShrink: 0,
                padding: "2px 10px",
                borderRadius: 20,
                background: "#EAF4FF",
                color: "#1A6FB5",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.6,
                border: "1px solid #A8CCEE",
                textTransform: "uppercase",
              }}
            >
              Free Preview
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: "#2C2A22",
                color: "#FFFDF7",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Open in Tab ↗
            </a>
            <button
              onClick={onClose}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: "#F0EBE0",
                color: "#555",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* PDF frame */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "#525659",
            overflow: "hidden",
          }}
        >
          {loading && !loadError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#CCC",
                fontSize: 14,
                gap: 12,
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid #666",
                  borderTopColor: "#FFF",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Loading PDF…
            </div>
          )}
          {loadError ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#EEE",
                gap: 16,
                padding: 32,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>PDF could not be loaded</div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  background: "#2C2A22",
                  color: "#FFFDF7",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open in Tab ↗
              </a>
            </div>
          ) : (
            <iframe
              key={url}
              src={url}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={title}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setLoadError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lock Overlay Modal ───────────────────────────────────────────────────────
function LockedModal({ title, onClose }: { title: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(20,18,14,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFDF7",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 20,
            fontWeight: 900,
            color: "#2C2A22",
            fontFamily: "'Georgia', serif",
          }}
        >
          Premium Note
        </h3>
        <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>
          <strong style={{ color: "#2C2A22" }}>"{title}"</strong> is part of the paid curriculum.
        </p>
        <p style={{ color: "#AAA", fontSize: 13, margin: "0 0 28px" }}>
          Online payments are coming soon. Please contact your teacher to get access.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            borderRadius: 30,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            marginBottom: 20,
            boxShadow: "0 6px 20px rgba(102,126,234,0.35)",
          }}
        >
          <span>💳</span> Razorpay Payment — Coming Soon
        </div>
        <div>
          <button
            onClick={onClose}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              background: "#F0EBE0",
              color: "#555",
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────
function NoteCard({ note, onOpen }: { note: Note; onOpen: (n: Note) => void }) {
  const [hovered, setHovered] = useState(false);
  const isLocked = note.locked;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(note)}
      style={{
        position: "relative",
        background: hovered ? (isLocked ? "#FDF5FF" : "#FFF9EE") : "#FFFDF7",
        border: `1.5px solid ${isLocked ? "#E8D5F5" : "#EEE9DC"}`,
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
        transition: "all .15s ease",
        flexWrap: "wrap",
        boxShadow: hovered
          ? `0 6px 22px ${isLocked ? "rgba(118,75,162,0.1)" : "rgba(0,0,0,0.07)"}`
          : "0 1px 4px rgba(0,0,0,0.04)",
        opacity: isLocked ? 0.9 : 1,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "#F5F0E4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 12,
          color: "#8B7D5A",
          flexShrink: 0,
          border: "1.5px solid #E8E1CF",
        }}
      >
        #{note.serialId}
      </div>

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: isLocked ? "#F5EEFF" : "#FFE8E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
          border: `1.5px solid ${isLocked ? "#D4AAEE" : "#FFCCCC"}`,
        }}
      >
        {isLocked ? "🔒" : "📄"}
      </div>

      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 6 }}>
          {note.title}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: 20,
              background: isLocked ? "#F3E8FF" : "#EAF4FF",
              color: isLocked ? "#7A3FAF" : "#1A6FB5",
              fontSize: 10,
              fontWeight: 800,
              border: `1px solid ${isLocked ? "#C89EEA" : "#A8CCEE"}`,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            {isLocked ? "Premium" : "Free Preview"}
          </span>
          {note.label && (
            <span
              style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: 20,
                background: "#FFF3CD",
                color: "#92660A",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.4,
                border: "1px solid #F0D080",
              }}
            >
              {note.label}
            </span>
          )}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
        {new Date(note.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "8px 18px",
          borderRadius: 8,
          background: isLocked
            ? hovered ? "#764ba2" : "#EEE5F8"
            : hovered ? "#2C2A22" : "#EEE9DC",
          color: isLocked
            ? hovered ? "#fff" : "#764ba2"
            : hovered ? "#FFFDF7" : "#555",
          fontWeight: 700,
          fontSize: 12,
          transition: "all .15s",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        {isLocked ? "🔒 Unlock" : "👁 View PDF"}
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#FFFDF7",
        border: "1.5px solid #EEE9DC",
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {["38px", "40px"].map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: w,
            borderRadius: 10,
            background: "#F0EBE0",
            animation: "pulse 1.4s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
      ))}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            height: 14,
            width: "55%",
            borderRadius: 6,
            background: "#F0EBE0",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 10,
            width: "30%",
            borderRadius: 6,
            background: "#F0EBE0",
            animation: "pulse 1.4s ease-in-out 0.2s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotesPage({ onToast }: NotesPageProps) {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<NoteType | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [lockedNote, setLockedNote] = useState<Note | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { notes } = await fetchNotes({ type: activeTab, search });
      setAllNotes(notes);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const t = setTimeout(() => load(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const handleOpen = (note: Note) => {
    if (note.locked || !note.pdfUrl) {
      setLockedNote(note);
      onToast("This is a premium note 🔒");
    } else {
      setViewingNote(note);
      onToast(`Opening: ${note.title}`);
    }
  };

  const counts = {
    all: allNotes.length,
    DEMO: allNotes.filter((n) => !n.locked).length,
    REAL: allNotes.filter((n) => n.locked).length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            color: "#2C2A22",
            fontFamily: "'Georgia', serif",
          }}
        >
          📚 Notes & Materials
        </h1>
        <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
          Study resources shared by your teacher
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {(
          [
            { key: "all", label: "All Notes", emoji: "📋" },
            { key: "DEMO", label: "Free", emoji: "🎓" },
            { key: "REAL", label: "Premium", emoji: "🔒" },
          ] as const
        ).map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "8px 18px",
              borderRadius: 30,
              background: activeTab === key ? "#2C2A22" : "#F0EBE0",
              color: activeTab === key ? "#FFFDF7" : "#666",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all .15s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {emoji} {label}
            <span
              style={{
                padding: "1px 7px",
                borderRadius: 10,
                background: activeTab === key ? "rgba(255,255,255,0.2)" : "#DDD8CC",
                color: activeTab === key ? "#fff" : "#888",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {counts[key]}
            </span>
          </button>
        ))}

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search notes…"
            style={{
              padding: "8px 36px 8px 14px",
              border: "1.5px solid #DDD8CC",
              borderRadius: 30,
              background: "#FAF7EE",
              color: "#2C2A22",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              minWidth: 200,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#AAA",
                fontSize: 14,
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {!loading && allNotes.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 18,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#FAF7EE",
            border: "1px solid #EEE9DC",
            fontSize: 12,
            color: "#888",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span>
            📄 <strong style={{ color: "#2C2A22" }}>{counts.DEMO}</strong> free notes available
          </span>
          <span style={{ color: "#DDD8CC" }}>•</span>
          <span>
            🔒 <strong style={{ color: "#764ba2" }}>{counts.REAL}</strong> premium notes (payment coming soon)
          </span>
        </div>
      )}

      {loadError && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "#FFF0F0",
            border: "1.5px solid #FFCCCC",
            color: "#C0392B",
            fontSize: 14,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span>⚠️ {loadError}</span>
          <button
            onClick={load}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#C0392B",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : allNotes.length === 0 && !loadError ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#CCC",
            fontSize: 15,
            border: "2px dashed #EEE9DC",
            borderRadius: 14,
          }}
        >
          {search.trim()
            ? `No notes found for "${search}".`
            : "No notes available yet. Check back soon!"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allNotes.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {viewingNote && viewingNote.pdfUrl && (
        <PdfModal
          url={viewingNote.pdfUrl}
          title={viewingNote.title}
          onClose={() => setViewingNote(null)}
        />
      )}
      {lockedNote && (
        <LockedModal title={lockedNote.title} onClose={() => setLockedNote(null)} />
      )}
    </div>
  );
}
