// ─── Student API Service ─────────────────────────────────────────────────────
// Connects the student portal to the Ascento backend (Express + MongoDB).
// Auth: POST /api/auth/login with role:"student" → returns sessionKey
// All subsequent calls include x-session-key header.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ─── Session Management ──────────────────────────────────────────────────────

export function getSessionKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ascento_session_key");
}

export function setSessionKey(key: string) {
  localStorage.setItem("ascento_session_key", key);
}

export function clearSession() {
  localStorage.removeItem("ascento_session_key");
  localStorage.removeItem("ascento_user");
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ascento_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: any) {
  localStorage.setItem("ascento_user", JSON.stringify(user));
}

// ─── Base Fetch ──────────────────────────────────────────────────────────────

async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  const sessionKey = getSessionKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(sessionKey ? { "x-session-key": sessionKey } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    // Session expired or invalid
    if (res.status === 401) {
      clearSession();
    }
    throw new Error(json.message || `API Error ${res.status}`);
  }

  return { success: true, data: json.data, message: json.message };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginStudent(identifier: string, password: string) {
  const res = await apiFetch<{
    sessionKey: string;
    expiresAt: string;
    user: any;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password, role: "student" }),
  });

  setSessionKey(res.data.sessionKey);
  setStoredUser(res.data.user);
  return res.data;
}

export async function logoutStudent() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}

export async function getMe() {
  const res = await apiFetch<any>("/auth/me");
  return res.data;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getStudentDashboard() {
  const res = await apiFetch<{
    attendance: { daily: number; weekly: number; monthly: number };
    pendingHomework: any[];
    pendingFees: any[];
    timetable: any[];
    upcomingExams: any[];
    meetLinks: any[];
  }>("/student/dashboard");
  return res.data;
}

// ─── Current Class / Enrollment ──────────────────────────────────────────────

export async function getCurrentClass() {
  const res = await apiFetch<any>("/student/current-class");
  return res.data;
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export async function getAttendance(params?: { page?: number; limit?: number; academicYear?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.academicYear) query.set("academicYear", params.academicYear);
  const qs = query.toString();
  const res = await apiFetch<{ data: any[]; total: number; page: number; limit: number }>(
    `/student/attendance${qs ? `?${qs}` : ""}`
  );
  return res.data;
}

// ─── Fees ────────────────────────────────────────────────────────────────────

export async function getFees() {
  const res = await apiFetch<any[]>("/student/fees");
  return res.data;
}

// ─── Exams ───────────────────────────────────────────────────────────────────

export async function getExams() {
  const res = await apiFetch<any[]>("/student/exams");
  return res.data;
}

// ─── Marks ───────────────────────────────────────────────────────────────────

export async function getMarks() {
  const res = await apiFetch<any[]>("/student/marks");
  return res.data;
}

// ─── Report Card ─────────────────────────────────────────────────────────────

export async function getReportCard(examId?: string) {
  const qs = examId ? `?examId=${examId}` : "";
  const res = await apiFetch<any>(`/student/report-card${qs}`);
  return res.data;
}

// ─── Timetable ───────────────────────────────────────────────────────────────

export async function getTimetable() {
  const res = await apiFetch<{ entries: any[]; table: any[] }>("/student/timetable");
  return res.data;
}

// ─── Homework ────────────────────────────────────────────────────────────────

export async function getHomework(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const res = await apiFetch<{ data: any[]; total: number; page: number; limit: number }>(
    `/student/homework${qs ? `?${qs}` : ""}`
  );
  return res.data;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications() {
  const res = await apiFetch<any[]>("/notifications");
  return res.data;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents() {
  const res = await apiFetch<any[]>("/events");
  return res.data;
}

// ─── Change Password ─────────────────────────────────────────────────────────

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await apiFetch("/student/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.data;
}
