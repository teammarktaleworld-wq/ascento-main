"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Option { text: string; }
interface Question {
  id: string;
  questionText: string;
  options: Option[];
  marks: number;
}
interface PaperInfo {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  allowReview: boolean;
  category: { id: string; name: string } | null;
}
interface Result {
  score: number | null;
  totalMarks: number;
  percentage: number | null;
  passed: boolean | null;
  submittedAt: string | null;
  timeTaken: number | null;
}

type SessionState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | {
      phase: "active";
      registrationId: string;
      attemptNumber: number;
      paper: PaperInfo;
      questions: Question[];
      answers: Record<string, number | null>;
      remainingSeconds: number;
    }
  | { phase: "done"; status: "submitted" | "expired"; paper?: Partial<PaperInfo>; result: Result };

export default function UserExamPage() {
  const params = useParams();
  const regId = params?.id as string;
  const { token } = useAuth();

  const [session, setSession] = useState<SessionState>({ phase: "loading" });
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [savingQ, setSavingQ] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSubmittedRef = useRef(false);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  // ── Load session ───────────────────────────────────────────────────
  const loadSession = useCallback(async () => {
    if (!token || !regId) return;
    try {
      const r = await fetch(`/api/portal/exam/${regId}`, { headers: authHeaders(), cache: "no-store" });
      const data = await r.json();
      if (!r.ok) {
        setSession({ phase: "error", message: data.error ?? "Failed to load exam" });
        return;
      }
      if (data.status === "submitted" || data.status === "expired") {
        setSession({ phase: "done", status: data.status, paper: data.paper, result: data.result });
        return;
      }
      setSession({
        phase: "active",
        registrationId: data.registrationId,
        attemptNumber: data.attemptNumber,
        paper: data.paper,
        questions: data.questions,
        answers: data.answers ?? {},
        remainingSeconds: data.remainingSeconds,
      });
    } catch {
      setSession({ phase: "error", message: "Network error. Please refresh." });
    }
  }, [token, regId, authHeaders]);

  useEffect(() => { loadSession(); }, [loadSession]);

  // ── Submit (defined before timer effect uses it) ──────────────────
  const handleSubmit = useCallback(async (auto = false) => {
    if (session.phase !== "active") return;
    if (autoSubmittedRef.current && auto) return;
    if (auto) autoSubmittedRef.current = true;

    setSubmitting(true);
    try {
      const r = await fetch(`/api/portal/exam/${regId}/submit`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await r.json();
      if (r.ok) {
        setSession({ phase: "done", status: data.status, result: data.result, paper: session.paper });
      } else {
        // If server says already finalized/expired, reload to get the final state
        await loadSession();
      }
    } catch {
      // best-effort; reload to get true server state
      await loadSession();
    } finally {
      setSubmitting(false);
    }
  }, [session, regId, authHeaders, loadSession]);

  // ── Countdown timer (purely cosmetic — server enforces real expiry) ─
  useEffect(() => {
    if (session.phase !== "active") return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSession((prev) => {
        if (prev.phase !== "active") return prev;
        if (prev.remainingSeconds <= 1) {
          // Time's up — auto submit (server will validate & finalize regardless)
          handleSubmit(true);
          return { ...prev, remainingSeconds: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.phase]);

  // ── Save an answer ──────────────────────────────────────────────────
  const handleAnswer = async (questionId: string, selectedIndex: number) => {
    if (session.phase !== "active") return;

    // Optimistic UI update
    setSession((prev) => {
      if (prev.phase !== "active") return prev;
      return { ...prev, answers: { ...prev.answers, [questionId]: selectedIndex } };
    });

    setSavingQ(questionId);
    try {
      const r = await fetch(`/api/portal/exam/${regId}/answer`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ questionId, selectedIndex }),
      });
      if (!r.ok) {
        const data = await r.json();
        if (r.status === 409) {
          // Exam was auto-expired server-side — reload to show result
          await loadSession();
        } else {
          alert(data.error ?? "Failed to save answer");
        }
      }
    } catch {
      // ignore transient errors; user can retry by re-selecting
    } finally {
      setSavingQ(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────

  if (session.phase === "loading") {
    return <CenteredMessage emoji="⏳" title="Loading exam…" subtitle="Please wait" />;
  }

  if (session.phase === "error") {
    return <CenteredMessage emoji="⚠️" title="Unable to load exam" subtitle={session.message} />;
  }

  if (session.phase === "done") {
    return <ResultView status={session.status} result={session.result} paper={session.paper} />;
  }

  // active
  const { paper, questions, answers, remainingSeconds } = session;
  const q = questions[current];
  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeCritical = remainingSeconds <= 60;

  return (
    <div style={{ fontFamily: "'Nunito',system-ui,sans-serif", maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#1A1A2E", margin: 0 }}>
            {paper.title}
          </h1>
          <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0", fontWeight: 700 }}>
            Attempt #{session.attemptNumber} · {paper.totalMarks} marks · Pass: {paper.passingMarks}
          </p>
        </div>
        <div style={{
          background: timeCritical ? "#FFF0F0" : "#F0FFFE",
          border: `2px solid ${timeCritical ? "#FF6B6B33" : "#4ECDC433"}`,
          borderRadius: 12, padding: "8px 18px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: timeCritical ? "#FF6B6B" : "#26C6DA" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, fontWeight: 900, color: "#aaa", textTransform: "uppercase" }}>
            Time Left
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {questions.map((qq, idx) => {
          const isAnswered = answers[qq.id] !== null && answers[qq.id] !== undefined;
          return (
            <button
              key={qq.id}
              onClick={() => setCurrent(idx)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 900, fontSize: 12,
                background: idx === current ? "#FF6B6B" : isAnswered ? "#F0FFF8" : "#F5F5F5",
                color: idx === current ? "white" : isAnswered ? "#22C55E" : "#999",
                border: idx === current ? "none" : isAnswered ? "1.5px solid #22C55E33" : "1.5px solid #EEE",
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <div style={{ background: "white", borderRadius: 20, border: "2px solid #EEE", padding: "24px 22px", marginBottom: 18, boxShadow: "0 2px 16px rgba(0,0,0,.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#FF6B6B", background: "#FFF0F0", padding: "4px 12px", borderRadius: 50 }}>
            Question {current + 1} of {questions.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#999" }}>
            {q.marks} mark{q.marks !== 1 ? "s" : ""}
          </span>
        </div>

        <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A2E", lineHeight: 1.5, marginBottom: 20 }}>
          {q.questionText}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, idx) => {
            const selected = answers[q.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(q.id, idx)}
                disabled={savingQ === q.id}
                style={{
                  textAlign: "left", padding: "13px 18px", borderRadius: 12,
                  border: `2px solid ${selected ? "#FF6B6B" : "#EEE"}`,
                  background: selected ? "#FFF0F0" : "white",
                  color: selected ? "#FF6B6B" : "#333",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, transition: "all .15s",
                  opacity: savingQ === q.id ? 0.7 : 1,
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${selected ? "#FF6B6B" : "#DDD"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: selected ? "#FF6B6B" : "transparent",
                }}>
                  {selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          style={navBtnStyle(current === 0)}
        >
          ← Previous
        </button>

        <span style={{ fontSize: 13, fontWeight: 800, color: "#999", alignSelf: "center" }}>
          {answeredCount}/{questions.length} answered
        </span>

        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} style={navBtnStyle(false)}>
            Next →
          </button>
        ) : (
          <button
            onClick={() => {
              if (window.confirm("Submit the exam? You won't be able to change your answers after this.")) {
                handleSubmit(false);
              }
            }}
            disabled={submitting}
            style={{
              ...navBtnStyle(false),
              background: "linear-gradient(135deg,#22C55E,#16A34A)",
              color: "white", border: "none",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting…" : "✅ Submit Exam"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Result view ────────────────────────────────────────────────────
function ResultView({ status, result, paper }: {
  status: "submitted" | "expired";
  result: Result;
  paper?: Partial<PaperInfo>;
}) {
  const passed = result.passed;
  const formatTime = (s: number | null) => {
    if (s == null) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div style={{ fontFamily: "'Nunito',system-ui,sans-serif", maxWidth: 480, margin: "60px auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>
        {status === "expired" ? "⏰" : passed ? "🏆" : "📉"}
      </div>
      <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#1A1A2E", marginBottom: 6 }}>
        {status === "expired" ? "Time's Up!" : "Exam Submitted"}
      </h1>
      {paper?.title && (
        <p style={{ fontSize: 14, color: "#999", fontWeight: 700, marginBottom: 24 }}>{paper.title}</p>
      )}

      {result.percentage != null ? (
        <div style={{
          background: passed ? "#F0FFF8" : "#FFF0F0",
          border: `2px solid ${passed ? "#22C55E33" : "#FF6B6B33"}`,
          borderRadius: 16, padding: "24px 20px", marginBottom: 16,
        }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 36, color: passed ? "#22C55E" : "#FF6B6B" }}>
            {result.score}/{result.totalMarks}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#999", marginBottom: 8 }}>
            {result.percentage.toFixed(1)}%
          </div>
          <div style={{
            display: "inline-block", fontSize: 13, fontWeight: 900, padding: "6px 18px", borderRadius: 50,
            background: passed ? "#22C55E" : "#FF6B6B", color: "white",
          }}>
            {passed ? "Passed ✅" : "Failed ❌"}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: "#999", fontWeight: 700, marginBottom: 16 }}>
          Your result has been recorded.
        </p>
      )}

      <p style={{ fontSize: 13, color: "#aaa", fontWeight: 700 }}>
        Time taken: {formatTime(result.timeTaken)}
        {result.submittedAt && (
          <> · Submitted {new Date(result.submittedAt).toLocaleString("en-IN")}</>
        )}
      </p>
    </div>
  );
}

function CenteredMessage({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div style={{ fontFamily: "'Nunito',system-ui,sans-serif", textAlign: "center", padding: "100px 24px" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>{emoji}</div>
      <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#1A1A2E", marginBottom: 6 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "#aaa", fontWeight: 700 }}>{subtitle}</p>
    </div>
  );
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "2px solid #EEE", borderRadius: 50, padding: "11px 24px",
    fontFamily: "inherit", fontWeight: 900, fontSize: 13, cursor: disabled ? "default" : "pointer",
    background: "white", color: disabled ? "#CCC" : "#333", opacity: disabled ? 0.5 : 1,
  };
}