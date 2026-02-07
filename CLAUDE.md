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
- **HeroUI v2** component library
- **React Hook Form + Zod** for forms
- **SWR** for data fetching
- **Sonner** for toast notifications
- **dayjs** for date handling
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

- `(landing)` — unauthenticated pages (login)
- `(main)` — authenticated pages with shared Navbar + Sidebar layout

### API Layer

Singleton API client with domain-specific services extending `BaseService`:

```typescript
import { api } from "@/services"

await api.activityService.getAllActivities()
await api.authService.logout()
```

- Services live in `src/services/api/`, each extending `BaseService` (provides `get`, `post`, `put`, `patch`, `delete`)
- Two fetch modes: `normalApiFetch` (JSON) and `formApiFetch` (FormData/file uploads)
- Auth is cookie-based (`credentials: "include"`), backend provides Google OAuth
- Base URL: `NEXT_PUBLIC_API_URL` env var (default `http://localhost:8000`), API path: `/api`

### Auth Flow

`AuthProvider` → `AuthContext` → `useAuth()` hook → `AuthGuard` HOC protects routes. User session comes from `/api/auth/me`.

### Styling

Tailwind-first with custom CSS variables (`--primary`, `--pink1`, `--pink2`) defined in `globals.css`. HeroUI components for buttons, modals, inputs, tables, etc. Use `@/*` path alias for all imports.

### Forms

All forms use React Hook Form with Zod schemas and `Controller` components wrapping HeroUI inputs. Error messages are in Thai.

### Key Types

- `User` — id, email, display_name, balance, role (member/admin)
- `Activity` — id, title, price, max_users, event dates, registration dates, approved status
- `Transaction` — id, amount, balance_before/after, transaction_type (topup/payment)

Types in `src/types/`. Zod schemas colocated with form components.

## Conventions

- All client components must declare `"use client"` at the top
- Use `@/` path alias for imports (maps to `src/`)
- Use `api` singleton from `@/services` for all API calls — never raw fetch
- Toast notifications via `toast.success()` / `toast.error()` from Sonner
- Middleware (`middleware.ts`) redirects `/home`, `/about`, `/profile` → `/activity`
