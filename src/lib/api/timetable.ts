// lib/api/timetable.ts
import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client (anon key) — used only to read the session token
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/** Returns the current session's Bearer token, or throws if not logged in. */
async function getToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ProgramLevel {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Program {
  id: string;
  name: string;
  hasLevels: boolean;
  levels: ProgramLevel[];
}

export interface ScheduleSlot {
  id: string;
  programId: string;
  levelId: string | null;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  notes?: string | null;
  program: { id: string; name: string };
  level: { id: string; name: string } | null;
  createdAt: string;
}

export interface TimetableUpload {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  programId: string | null;
  levelId: string | null;
  createdAt: string;
}

export interface SlotFilters {
  programId?: string;
  levelId?: string;
  dayOfWeek?: string;
  search?: string;
}

export interface CreateSlotPayload {
  programId: string;
  levelId?: string | null;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  notes?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * All API calls go through here.
 * Automatically attaches Authorization: Bearer <token> on every request —
 * same pattern as the notes API client.
 */
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // caller can still pass extra headers (e.g. no Content-Type for FormData)
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.error ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

function buildQuery(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

// ─── SCHEDULE API ─────────────────────────────────────────────────────────────

export const scheduleApi = {
  async list(filters: SlotFilters = {}): Promise<ScheduleSlot[]> {
    const qs = buildQuery({
      programId: filters.programId,
      levelId:   filters.levelId,
      dayOfWeek: filters.dayOfWeek,
      search:    filters.search,
    });
    const data = await apiFetch<{ slots: ScheduleSlot[] }>(
      `/api/admin/schedule${qs}`
    );
    return data.slots;
  },

  async create(payload: CreateSlotPayload): Promise<ScheduleSlot> {
    const data = await apiFetch<{ slot: ScheduleSlot }>("/api/admin/schedule", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.slot;
  },

  async remove(id: string): Promise<void> {
    await apiFetch(`/api/admin/schedule/${id}`, { method: "DELETE" });
  },
};

// ─── PROGRAMS API ─────────────────────────────────────────────────────────────

export const programsApi = {
  async list(): Promise<Program[]> {
    const data = await apiFetch<{ programs: Program[] }>("/api/admin/programs");
    return data.programs;
  },
};

// ─── UPLOADS API ──────────────────────────────────────────────────────────────
//
// Mirrors the notes upload pattern exactly:
//   1. Browser converts File → base64
//   2. POST JSON { base64, fileName, mimeType, size, programId?, levelId? }
//      to /api/admin/timetable-uploads
//   3. Server (service-role) uploads to Supabase Storage + saves DB record
//   4. Returns the saved TimetableUpload row
//
// This avoids the signed-URL dance and keeps all storage logic server-side.

export const uploadsApi = {
  async list(): Promise<TimetableUpload[]> {
    const data = await apiFetch<{ uploads: TimetableUpload[] }>(
      "/api/admin/timetable-uploads"
    );
    return data.uploads;
  },

  async upload(
    file: File,
    meta: { programId?: string; levelId?: string }
  ): Promise<TimetableUpload> {
    // Convert file to base64 (same approach as notes PDF upload)
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });

    const data = await apiFetch<{ upload: TimetableUpload }>(
      "/api/admin/timetable-uploads",
      {
        method: "POST",
        body: JSON.stringify({
          base64,
          fileName:     file.name,
          mimeType:     file.type,
          size:         file.size,
          programId:    meta.programId  ?? null,
          levelId:      meta.levelId    ?? null,
        }),
      }
    );
    return data.upload;
  },

  async remove(id: string): Promise<void> {
    await apiFetch(`/api/admin/timetable-uploads/${id}`, { method: "DELETE" });
  },
};