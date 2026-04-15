# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ascento Abacus — a premium education management platform (abacus training, mental arithmetic, cognitive development). Full-stack app with a Next.js frontend and Express.js backend.

## Commands

```bash
# Frontend (root directory)
npm run dev        # Dev server (Turbopack)
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint

# Backend (server/ directory)
cd server && node index.js   # Start Express API server on port 4000
```

No test framework is currently configured.

## Architecture

### Frontend (Next.js 16 + React 19, App Router)

- **`app/`** — Pages and route-specific components
  - `/` — Landing page (hero carousel, program cards, enrollment CTAs)
  - `/login`, `/register` — Firebase auth (email/password + Google OAuth)
  - `/student` — Student portal (protected, multi-tab SPA with 12 sections)
  - `/admin` — Admin dashboard (protected, role-verified via Firestore)
  - `/programs`, `/contact`, `/franchise`, `/profile` — Public/semi-public pages
- **`components/ui/`** — Reusable shadcn-style UI primitives
- **`lib/firebase.ts`** — Firebase app init (Auth, Firestore, Analytics)
- **`lib/studentApi.ts`** — Backend API client with session-based auth (`x-session-key` header, stored in localStorage as `ascento_session_key`)
- **`lib/api.ts`** — Mock API providing demo data when backend is unavailable

### Backend (`server/`)

Express.js server with Firebase Admin SDK. Separate `package.json` — dependencies installed independently.

Key endpoints: `/api/inquiries`, `/api/enrollments`, `/api/auth/*`, `/api/student/*`, `/api/admin/*`.

### Student Portal Data Flow

1. Firebase auth verification → 2. Parallel API calls via `Promise.allSettled` → 3. Data transformation (`StudentData.ts`) → 4. Mock fallback if API unavailable → 5. `StudentDataContext` distributes to page components

Portal components live in `app/student/components/`:
- `PortalPages.tsx` — All 12 page implementations (Dashboard, Academics, Timetable, etc.)
- `PortalComponents.tsx` — Shared UI (Card, CircleProgress, BarChartMini, AttendanceCalendar)
- `StudentData.ts` — TypeScript interfaces, API→UI transform functions, mock data

### Auth & Authorization

- Firebase Authentication for identity (email/password + Google OAuth)
- Firestore `Users` collection stores `Role` field (`"admin"`, `"student"`, `"user"`)
- `AuthGuard` component (`app/components/AuthGuard.tsx`) protects routes and redirects by role
- Admin check compares role against `"Admin"` (capital A)

## Key Conventions

- **Path alias:** `@/*` maps to project root
- **Styling:** Tailwind CSS v4 with custom color variables in `globals.css`. Landing page uses Lexend font; student portal uses DM Sans with inline styles.
- **Animations:** Framer Motion
- **Icons:** Lucide React + Material Design icons (loaded via Google Fonts CDN in layout)
- **Images:** Remote patterns configured for `lh3.googleusercontent.com` (Google profile pictures)
- **Environment:** All Firebase config via `NEXT_PUBLIC_*` env vars in `.env.local`; backend API URL via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`)
