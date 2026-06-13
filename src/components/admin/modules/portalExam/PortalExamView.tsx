"use client";

import { useState } from "react";
import PortalCategoriesPanel from "./PortalCategoriesPanel";
import PortalPapersPanel from "./PortalPapersPanel";
import PortalQuestionEditor from "./PortalQuestionEditor";
import PortalSubmissionsPanel from "./PortalSubmissionsPanel";

export type PortalTab = "categories" | "papers" | "submissions";

export default function PortalExamView() {
  const [activeTab, setActiveTab] = useState<PortalTab>("categories");
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);

  const tabs: { id: PortalTab; label: string; emoji: string }[] = [
    { id: "categories", label: "Categories", emoji: "🗂️" },
    { id: "papers",     label: "Exam Papers", emoji: "📝" },
    { id: "submissions",label: "Submissions", emoji: "📊" },
  ];

  if (editingPaperId !== null) {
    return (
      <PortalQuestionEditor
        paperId={editingPaperId}
        onBack={() => setEditingPaperId(null)}
      />
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito','Fredoka One',system-ui,sans-serif", minHeight: "100%" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 6px 20px rgba(255,107,107,.35)",
          }}>🎯</div>
          <div>
            <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#1A1A2E", margin: 0, lineHeight: 1.1 }}>
              Exam Portal
            </h1>
            <p style={{ fontSize: 13, color: "#999", margin: 0, fontWeight: 700 }}>
              Create categories, build papers, track results
            </p>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28,
        background: "#F5F3EE", borderRadius: 16, padding: 6, width: "fit-content",
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              border: "none", cursor: "pointer",
              padding: "9px 22px", borderRadius: 12,
              fontFamily: "inherit", fontWeight: 800, fontSize: 14,
              display: "flex", alignItems: "center", gap: 7,
              transition: "all .2s",
              background: activeTab === t.id ? "white" : "transparent",
              color: activeTab === t.id ? "#FF6B6B" : "#888",
              boxShadow: activeTab === t.id ? "0 2px 12px rgba(0,0,0,.1)" : "none",
            }}
          >
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "categories"  && <PortalCategoriesPanel />}
      {activeTab === "papers"      && <PortalPapersPanel onEditQuestions={setEditingPaperId} />}
      {activeTab === "submissions" && <PortalSubmissionsPanel />}
    </div>
  );
}