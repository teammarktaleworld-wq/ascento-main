"use client";

// src/components/userdashboard/OnlineExamPortal.tsx

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Clock,
  Play,
  CheckCircle,
  ChevronRight,
  SkipForward,
  BookOpen,
  ArrowLeft,
  Loader,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: string;
  name: string;
  icon: string;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

type TestPaper = {
  id: string;
  category: string;
  title: string;
  duration: number;
  totalQuestions: number;
  description?: string;
};

type TestPaperWithQuestions = TestPaper & {
  questions: Question[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const categories: Category[] = [
  { id: "math", name: "Mathematics", icon: "📐" },
  { id: "reasoning", name: "Reasoning", icon: "🧠" },
  { id: "english", name: "English", icon: "📚" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnlineExamPortal() {
  // Hydration protection
  const [isHydrated, setIsHydrated] = useState(false);

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [testPapers, setTestPapers] = useState<TestPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<TestPaperWithQuestions | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydration effect - runs only on client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch all test papers on mount
  useEffect(() => {
    const fetchTestPapers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/test-papers");
        if (!response.ok) throw new Error("Failed to fetch test papers");
        const data = await response.json();
        setTestPapers(data.data || []);
      } catch (err) {
        setError("Failed to load test papers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestPapers();
  }, []);

  // Filter test papers by selected category
  const filteredPapers = useMemo(
    () => testPapers.filter((paper) => paper.category === selectedCategory),
    [testPapers, selectedCategory]
  );

  // Get current question
  const questions = selectedPaper?.questions || [];
  const current = questions[currentQuestion];

  // Calculate progress
  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  // Timer effect
  useEffect(() => {
    if (!started || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, submitted]);

  // Event Handlers
  const handleSelectAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }
    setSubmitted(true);
  }, [currentQuestion, questions.length]);

  const handleSkip = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, questions.length]);

  const handleReset = useCallback(() => {
    setSelectedCategory(null);
    setSelectedPaper(null);
    setStarted(false);
    setSubmitted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(0);
    setShowPreview(false);
  }, []);

  const handlePreviewTest = useCallback(
    async (paper: TestPaper) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/test-papers/${paper.id}`);
        if (!response.ok) throw new Error("Failed to fetch test paper details");
        const data = await response.json();
        setSelectedPaper(data.data);
        setShowPreview(true);
      } catch (err) {
        setError("Failed to load test preview");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleStartTest = useCallback(() => {
    if (!selectedPaper) return;
    setStarted(true);
    setTimeLeft(selectedPaper.duration * 60);
    setCurrentQuestion(0);
    setAnswers({});
  }, [selectedPaper]);

  // Calculate score
  const score = questions.reduce((acc, question) => {
    if (answers[question.id] === question.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // ─────────────────── Category Selection Screen ─────────────────

  // Prevent hydration mismatch by not rendering until client hydration completes
  if (!isHydrated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 30,
            border: "1px solid #F0F0F0",
            textAlign: "center",
          }}
        >
          <Loader size={40} className="animate-spin" style={{ margin: "0 auto" }} />
          <div
            style={{
              marginTop: 16,
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
            }}
          >
            Loading Online Exam Portal...
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────── Category Selection Screen ─────────────────

  if (!selectedCategory || (!started && !showPreview)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 30,
            border: "1px solid #F0F0F0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <BookOpen size={26} color="#7C3AED" />
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#1A1A2E",
              }}
            >
              Online Exam Portal
            </div>
          </div>
          <div
            style={{
              color: "#888",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Select a category and start your assessment.
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#DC2626",
            }}
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Category Selection */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background:
                  selectedCategory === category.id
                    ? "linear-gradient(135deg,#7C3AED,#A78BFA)"
                    : "#fff",
                color:
                  selectedCategory === category.id
                    ? "#fff"
                    : "#1A1A2E",
                border:
                  selectedCategory === category.id
                    ? "none"
                    : "1px solid #EEE",
                borderRadius: 20,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ fontSize: 40 }}>
                {category.icon}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {category.name}
              </div>
            </button>
          ))}
        </div>

        {/* Test Papers List */}
        {selectedCategory && (
          <>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 40,
                  gap: 12,
                }}
              >
                <Loader size={20} className="animate-spin" />
                Loading test papers...
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    style={{
                      background: "#fff",
                      padding: 20,
                      borderRadius: 16,
                      border: "1px solid #EEE",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          marginBottom: 8,
                          color: "#1A1A2E",
                        }}
                      >
                        {paper.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#666",
                          display: "flex",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <span>📋 {paper.totalQuestions} Questions</span>
                        <span>⏱️ {paper.duration} Minutes</span>
                      </div>
                      {paper.description && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#999",
                            marginTop: 6,
                          }}
                        >
                          {paper.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handlePreviewTest(paper)}
                      disabled={loading}
                      style={{
                        background: "#7C3AED",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "10px 20px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: 700,
                        fontSize: 13,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "Loading..." : "Preview"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ─────────────────── Test Preview Screen ─────────────────

  if (showPreview && selectedPaper && !started) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          border: "1px solid #F0F0F0",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => {
            setShowPreview(false);
            setSelectedPaper(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            background: "none",
            border: "none",
            color: "#7C3AED",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <ArrowLeft size={18} />
          Back to Papers
        </button>

        {/* Preview Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#1A1A2E",
              marginBottom: 8,
            }}
          >
            {selectedPaper.title}
          </h1>
          {selectedPaper.description && (
            <p
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 16,
              }}
            >
              {selectedPaper.description}
            </p>
          )}
        </div>

        {/* Test Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "#F3E8FF",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #E9D5FF",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Total Questions
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#7C3AED",
              }}
            >
              {selectedPaper.totalQuestions}
            </div>
          </div>

          <div
            style={{
              background: "#DBEAFE",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #BFDBFE",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Duration
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#0284C7",
              }}
            >
              {selectedPaper.duration} min
            </div>
          </div>

          <div
            style={{
              background: "#CCFBF1",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #99F6E4",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Total Marks
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#14B8A6",
              }}
            >
              {selectedPaper.totalQuestions}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            borderRadius: 12,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#1A1A2E",
              marginBottom: 12,
            }}
          >
            📋 Instructions
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ Each question carries 1 mark
            </li>
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ No negative marking
            </li>
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ Timer-based exam - manages time automatically
            </li>
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ Auto-submit when time expires
            </li>
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ You can skip questions and answer them later
            </li>
            <li style={{ fontSize: 13, color: "#666" }}>
              ✓ Maximum 20 questions per test paper
            </li>
          </ul>
        </div>

        {/* Sample Questions Preview */}
        {selectedPaper.questions && selectedPaper.questions.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#1A1A2E",
                marginBottom: 12,
              }}
            >
              📝 Sample Questions (First 2)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedPaper.questions.slice(0, 2).map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    background: "#FAFAFA",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #EEEEEE",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
                    Question {idx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A1A2E",
                      marginBottom: 8,
                    }}
                  >
                    {q.question}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {q.options.map((opt) => (
                      <div
                        key={opt}
                        style={{
                          fontSize: 12,
                          color: "#666",
                          paddingLeft: 16,
                        }}
                      >
                        ○ {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartTest}
          style={{
            width: "100%",
            padding: "16px 20px",
            background: "linear-gradient(135deg,#4ECDC4,#45B7AA)",
            color: "#fff",
            border: "none",
            borderRadius: 16,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Play size={18} />
          Start Test
        </button>
      </div>
    );
  }

  // ─────────────────── Result Screen ─────────────────

  if (submitted) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 40,
          textAlign: "center",
          fontFamily: "'Nunito', sans-serif",
          border: "1px solid #F0F0F0",
        }}
      >
        <CheckCircle size={70} color="#4ECDC4" />

        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            fontWeight: 900,
            color: "#1A1A2E",
          }}
        >
          Test Submitted
        </div>

        <div
          style={{
            marginTop: 12,
            color: "#777",
            fontWeight: 700,
          }}
        >
          Your Score
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 42,
            fontWeight: 900,
            color: "#7C3AED",
          }}
        >
          {score} / {questions.length}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#999",
          }}
        >
          Accuracy: {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
        </div>

        <button
          onClick={handleReset}
          style={{
            marginTop: 32,
            padding: "14px 32px",
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(135deg,#4ECDC4,#45B7AA)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 15,
          }}
        >
          Try Another Test
        </button>
      </div>
    );
  }

  // ─────────────────── Exam Screen ─────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Header with Progress */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #F0F0F0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#1A1A2E",
              }}
            >
              {selectedPaper?.title || "TEST"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#999",
                fontWeight: 700,
              }}
            >
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </div>
          </div>

          <div
            style={{
              background: "#FF6B6B15",
              color: "#FF6B6B",
              padding: "10px 16px",
              borderRadius: 12,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 20,
            background: "#EEE",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(135deg,#7C3AED,#A78BFA)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 28,
          border: "1px solid #F0F0F0",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#1A1A2E",
            marginBottom: 24,
          }}
        >
          {current?.question}
        </div>

        {/* Options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 30,
          }}
        >
          {current?.options.map((option) => (
            <button
              key={option}
              onClick={() =>
                handleSelectAnswer(current.id, option)
              }
              style={{
                textAlign: "left",
                padding: "16px 18px",
                borderRadius: 14,
                cursor: "pointer",
                border:
                  answers[current.id] === option
                    ? "2px solid #7C3AED"
                    : "1px solid #E5E5E5",
                background:
                  answers[current.id] === option
                    ? "#F3E8FF"
                    : "#fff",
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 14,
              border: "1px solid #DDD",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <SkipForward size={16} />
            Skip
          </button>

          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background:
                "linear-gradient(135deg,#7C3AED,#A78BFA)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {currentQuestion === questions.length - 1
              ? "Submit Test"
              : "Next"}

            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}