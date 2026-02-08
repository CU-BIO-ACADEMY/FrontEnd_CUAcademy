# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CU Academy - an educational activity registration platform for Chulalongkorn University. Features activity browsing/creation, payment via PromptPay, transaction history, and role-based access (member/admin). UI text is in Thai.

## Commands

```bash
bun run dev        # Start dev server (localhost:3000)
bun run build      # Production build
bun run start      # Start production server
bun run lint       # ESLint
bun add <pkg>      # Add dependency
```

No test runner is currently configured.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-based config in `globals.css`, not `tailwind.config.*`)
- **HeroUI v2** component library (Tailwind plugin at `src/app/hero.ts`, content source in `globals.css`)
- **React Hook Form + Zod** for forms
- **SWR** for data fetching
- **Sonner** for toast notifications
- **dayjs** for date handling
- **Font Awesome Pro v7** for icons (loaded via CDN in root layout)
- **Kanit** Google font (Thai/Latin)
- **Bun** as package manager

## Architecture

### Container/Component Pattern

Pages are thin wrappers. Containers hold business logic. Components are presentational.

```
src/app/(main)/activity/page.tsx      → imports ActivityContainer
src/containers/(main)/activity/       → fetches data, manages state
src/components/(main)/activity/       → renders UI, receives props
```

### Route Groups

- `(landing)` — unauthenticated pages (login via Google OAuth)
- `(main)` — authenticated pages with shared Navbar + Sidebar layout, wrapped in `AuthGuard`

### API Layer

Singleton API client with domain-specific services extending `BaseService`:

```typescript
import { api } from "@/services"

await api.activityService.getAllActivities()
await api.authService.logout()
await api.studentInformationService.getStudentInformation()
await api.paymentService...
await api.transactionService...
```

- Services live in `src/services/api/`, each extending `BaseService` (provides `get`, `post`, `put`, `patch`, `delete`, `postWithForm`)
- Two fetch modes in `src/lib/api.ts`: `normalApiFetch` (JSON with Content-Type header) and `formApiFetch` (FormData/file uploads)
- Auth is cookie-based (`credentials: "include"`), backend provides Google OAuth
- Base URL: in production uses `/api` (relative), in development hardcoded to `http://localhost:8000/api` (set in `BaseService` constructor)
- DTOs and response types are colocated in each service file (e.g., `Activity` interface is in `ActivityService.ts`, not in `src/types/`)

### Auth Flow

`LayoutProviders` (`src/components/providers.tsx`) → `AuthProvider` (`src/providers/AuthProvider.tsx`) → `AuthContext` (`src/contexts/AuthContext.tsx`) → `useAuth()` hook (`src/hooks/useAuth.tsx`) → `AuthGuard` (`src/components/AuthGuard.tsx`) wraps the `(main)` layout. User session comes from `GET /api/auth/me`. Login redirects to Google OAuth URL from `GET /api/auth/google`.

### Styling

Tailwind-first with custom CSS variables (`--primary`, `--secondary`, `--pink1`, `--pink2`) defined in `globals.css`. HeroUI components for buttons, modals, inputs, tables, etc. Use `@/*` path alias for all imports. Icons use Font Awesome classes (e.g., `fa-solid fa-filter`).

### Forms

All forms use React Hook Form with Zod schemas and `Controller` components wrapping HeroUI inputs. Error messages are in Thai.

### Key Types

- `User` (`src/types/user.ts`) — id, email, display_name, balance, role (member/admin via `Role` enum)
- `Applicant` (`src/types/applicant.ts`) — student info with educationLevel maps
- `Activity` (`src/services/api/ActivityService.ts`) — id, title, price, max_users, event/registration dates, approved status
- `StudentInformation` (`src/services/api/StudentInformationService.ts`) — student profile linked to user
- `Transaction` (`src/types/transaction.d.ts`) — id, amount, balance_before/after, transaction_type (topup/payment)

## Conventions

- All client components must declare `"use client"` at the top
- Use `@/` path alias for imports (maps to `src/`)
- Use `api` singleton from `@/services` for all API calls — never raw fetch
- Toast notifications via `toast.success()` / `toast.error()` from Sonner
- Middleware (`middleware.ts`) redirects `/home`, `/about`, `/profile` → `/activity`
- Dynamic route params in Next.js 16 are `Promise`-based: `params: Promise<{ id: string }>` — must be awaited
