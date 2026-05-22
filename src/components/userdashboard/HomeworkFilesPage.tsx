"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FileType = "pdf" | "image";

interface HomeworkFile {
  id: string;
  serialId: number;
  title: string;
  label: string;
  fileType: FileType;
  fileUrl: string;
  createdAt: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    "Content-Type": "application/json",
  };
}

async function fetchHomeworkFiles(params: {
  fileType?: string;
  search?: string;
  page?: number;
}): Promise<{ homeworkFiles: HomeworkFile[]; total: number }> {
  const headers = await getAuthHeaders();
  const sp = new URLSearchParams();
  if (params.fileType && params.fileType !== "all") sp.set("fileType", params.fileType);
  if (params.search) sp.set("search", params.search);
  if (params.page) sp.set("page", String(params.page));

  const res = await fetch(`/api/homework-files?${sp}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
  return { homeworkFiles: json.homeworkFiles ?? [], total: json.total ?? 0 };
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
              fontFamily: "'Georgia', serif",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{file.title}</span>
            {file.label && (
              <span style={{
                padding: "2px 10px", borderRadius: 20, background: "#FFF3CD",
                color: "#92660A", fontSize: 10, fontWeight: 700,
                border: "1px solid #F0D080", whiteSpace: "nowrap",
              }}>{file.label}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer"
              download
              style={{
                padding: "7px 16px", borderRadius: 8, background: "#2C2A22",
                color: "#FFFDF7", fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>⬇ Download</a>
            <button onClick={onClose} style={{
              padding: "7px 16px", borderRadius: 8, background: "#F0EBE0",
              color: "#555", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
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
                padding: "10px 24px", borderRadius: 8, background: "#2C2A22",
                color: "#FFFDF7", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Open in Tab ↗</a>
            </div>
          ) : file.fileType === "image" ? (
            <img
              src={file.fileUrl} alt={file.title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setLoadError(true); }}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          ) : (
            <iframe
              key={file.fileUrl} src={file.fileUrl}
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

// ─── File Card ────────────────────────────────────────────────────────────────
function FileCard({ item, onOpen }: { item: HomeworkFile; onOpen: (i: HomeworkFile) => void }) {
  const [hovered, setHovered] = useState(false);
  const isImage = item.fileType === "image";

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
      style={{
        background: hovered ? "#FFF9EE" : "#FFFDF7",
        border: "1.5px solid #EEE9DC", borderRadius: 14,
        padding: "16px 20px", display: "flex", alignItems: "center",
        gap: 14, cursor: "pointer", transition: "all .15s ease", flexWrap: "wrap",
        boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Serial */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: "#F5F0E4",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, color: "#8B7D5A", flexShrink: 0,
        border: "1.5px solid #E8E1CF",
      }}>#{item.serialId}</div>

      {/* Icon */}
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
        <div style={{ fontWeight: 700, fontSize: 15, color: "#2C2A22", marginBottom: 6 }}>
          {item.title}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 20,
            background: isImage ? "#EAF4FF" : "#FFF0F0",
            color: isImage ? "#1A6FB5" : "#C0392B",
            fontSize: 10, fontWeight: 700,
            border: `1px solid ${isImage ? "#A8CCEE" : "#FFAAAA"}`,
            letterSpacing: 0.5, textTransform: "uppercase",
          }}>
            {isImage ? "🖼 Image" : "📄 PDF"}
          </span>
          {item.label && (
            <span style={{
              display: "inline-block", padding: "2px 10px", borderRadius: 20,
              background: "#FFF3CD", color: "#92660A", fontSize: 10, fontWeight: 600,
              letterSpacing: 0.4, border: "1px solid #F0D080",
            }}>{item.label}</span>
          )}
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize: 11, color: "#AAA", flexShrink: 0, textAlign: "right", minWidth: 80 }}>
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        })}
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0, padding: "8px 18px", borderRadius: 8,
        background: hovered ? "#2C2A22" : "#EEE9DC",
        color: hovered ? "#FFFDF7" : "#555",
        fontWeight: 700, fontSize: 12, transition: "all .15s",
        border: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
      }}>
        {isImage ? "🖼 View" : "📄 Open"}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: "#FFFDF7", border: "1.5px solid #EEE9DC",
      borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
    }}>
      {[38, 40].map((s, i) => (
        <div key={i} style={{
          width: s, height: s, borderRadius: 10, background: "#F0EBE0",
          animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0,
        }} />
      ))}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "55%", borderRadius: 6, background: "#F0EBE0", animation: "pulse 1.4s ease-in-out infinite" }} />
        <div style={{ height: 10, width: "30%", borderRadius: 6, background: "#F0EBE0", animation: "pulse 1.4s ease-in-out 0.2s infinite" }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomeworkFilesPage() {
  const [allFiles, setAllFiles] = useState<HomeworkFile[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "pdf" | "image">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [viewingItem, setViewingItem] = useState<HomeworkFile | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { homeworkFiles } = await fetchHomeworkFiles({
        fileType: activeFilter,
        search,
      });
      setAllFiles(homeworkFiles);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const counts = {
    all: allFiles.length,
    pdf: allFiles.filter((f) => f.fileType === "pdf").length,
    image: allFiles.filter((f) => f.fileType === "image").length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#2C2A22", fontFamily: "'Georgia', serif" }}>
          📂 Homework Files
        </h1>
        <p style={{ margin: "4px 0 0", color: "#999", fontSize: 13 }}>
          PDFs and worksheets shared by your teacher
        </p>
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["all", "pdf", "image"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveFilter(tab)} style={{
            padding: "8px 18px", borderRadius: 30,
            background: activeFilter === tab ? "#2C2A22" : "#F0EBE0",
            color: activeFilter === tab ? "#FFFDF7" : "#666",
            border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {tab === "all" ? "📋 All" : tab === "pdf" ? "📄 PDFs" : "🖼 Images"}
            <span style={{
              padding: "1px 7px", borderRadius: 10,
              background: activeFilter === tab ? "rgba(255,255,255,0.2)" : "#DDD8CC",
              color: activeFilter === tab ? "#fff" : "#888", fontSize: 11, fontWeight: 800,
            }}>{counts[tab]}</span>
          </button>
        ))}

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search files…"
            style={{
              padding: "8px 36px 8px 14px", border: "1.5px solid #DDD8CC", borderRadius: 30,
              background: "#FAF7EE", color: "#2C2A22", fontSize: 13, outline: "none",
              fontFamily: "inherit", minWidth: 200,
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

      {/* Summary strip */}
      {!loading && allFiles.length > 0 && (
        <div style={{
          display: "flex", gap: 10, marginBottom: 18, padding: "10px 16px",
          borderRadius: 10, background: "#FAF7EE", border: "1px solid #EEE9DC",
          fontSize: 12, color: "#888", flexWrap: "wrap", alignItems: "center",
        }}>
          <span>📄 <strong style={{ color: "#2C2A22" }}>{counts.pdf}</strong> PDFs</span>
          <span style={{ color: "#DDD8CC" }}>•</span>
          <span>🖼 <strong style={{ color: "#2C2A22" }}>{counts.image}</strong> images</span>
          <span style={{ color: "#DDD8CC" }}>•</span>
          <span>📂 <strong style={{ color: "#2C2A22" }}>{counts.all}</strong> total</span>
        </div>
      )}

      {/* Error */}
      {loadError && (
        <div style={{
          padding: "14px 18px", borderRadius: 12, background: "#FFF0F0",
          border: "1.5px solid #FFCCCC", color: "#C0392B", fontSize: 14, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span>⚠️ {loadError}</span>
          <button onClick={load} style={{
            padding: "6px 14px", borderRadius: 8, background: "#C0392B", color: "#fff",
            border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>Retry</button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : allFiles.length === 0 && !loadError ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#CCC", fontSize: 15,
          border: "2px dashed #EEE9DC", borderRadius: 14,
        }}>
          {search.trim() ? `No files found for "${search}".` : "No homework files yet. Check back soon!"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allFiles.map((item) => (
            <FileCard key={item.id} item={item} onOpen={setViewingItem} />
          ))}
        </div>
      )}

      {viewingItem && <PreviewModal file={viewingItem} onClose={() => setViewingItem(null)} />}
    </div>
  );
}