# Drive Trip Logger (DTL) — ROVE Technologies

A full-stack trip logging application for drivers to record, filter, and reflect on their journeys — with offline-first support.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Tech Stack & Rationale](#tech-stack--rationale)
- [Tech Flow Diagram](#tech-flow-diagram)
- [User Flow Diagram](#user-flow-diagram)
- [Folder Structure](#folder-structure)
- [Coding Standards](#coding-standards)
- [Potential Improvements](#potential-improvements)

---

## Project Overview

DTL allows drivers to log trips with start/end locations, timestamps, distance, notes, and a "memorable" flag. It works offline — mutations are queued in IndexedDB and auto-synced when the connection is restored. No authentication; trips are scoped to an anonymous device UUID stored in `localStorage`.

**Key capabilities:**
- Create, edit, delete trips with full form validation
- Mark trips as memorable; filter and sort the list
- Aggregate stats: total distance, memorable count
- Offline queue with automatic background sync on reconnect
- Optimistic UI — zero perceived latency for all mutations

---

## Prerequisites

| Requirement | Minimum version |
|-------------|----------------|
| Docker | 24+ |
| Docker Compose | v2 (included with Docker Desktop) |
| Node.js *(dev only)* | 20+ |
| npm *(dev only)* | 10+ |

> **Production** only needs Docker. Node is required only for local development outside Docker.

---

## Getting Started

### Option A — Docker Compose (recommended)

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd Assessment
   ```

2. **Create the environment file**

   ```bash
   cp .env.example .env
   ```

   The default `.env.example` is pre-configured for Docker Compose:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dtl?schema=public"
   ```

   No other variables are required for the MVP.

3. **Start all services** (Postgres + Next.js app)

   ```bash
   docker compose up --build
   ```

   Docker Compose will:
   - Pull and start a Postgres 16 container
   - Wait for Postgres to pass its health check
   - Build the Next.js app (multi-stage)
   - Run `prisma migrate deploy` automatically on startup
   - Serve the app at **http://localhost:3000**

4. **Tear down**

   ```bash
   docker compose down          # stop containers, keep data
   docker compose down -v       # stop containers + delete DB volume
   ```

---

### Option B — Local Development (without Docker app container)

1. Follow steps 1–2 above.

2. **Start only Postgres via Docker**

   ```bash
   docker compose up postgres
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Apply migrations & generate Prisma client**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   App available at **http://localhost:3000** with hot reload.

---

## Tech Stack & Rationale

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14 (App Router) | Unified full-stack in one repo — API routes and React UI share types, schema, and validation logic. `output: 'standalone'` produces a minimal Docker image. Server Components reduce client bundle size. |
| **Language** | TypeScript | End-to-end type safety from DB schema → API response → component props eliminates an entire class of runtime errors. |
| **Database** | PostgreSQL 16 | ACID guarantees for trip mutations. Relational model fits structured trip data well. Mature ecosystem, excellent Docker support, and `@@index([deviceId, createdAt])` supports the primary list query efficiently. |
| **ORM** | Prisma | Type-safe DB client generated from schema. Migrations are versioned and deterministic. `prisma migrate deploy` makes the Docker startup fully automated. |
| **Data fetching** | TanStack Query v5 | Declarative server-state management with built-in caching, optimistic update lifecycle hooks (`onMutate` / `onError` / `onSettled`), and automatic background refetch. |
| **Forms** | React Hook Form + Zod | RHF provides uncontrolled form performance; Zod provides a single schema reused on both client (via `@hookform/resolvers`) and server (API route validation) — no duplication. |
| **UI components** | Shadcn UI + Radix primitives | Accessible, unstyled primitives (Dialog, Select, Label) with copy-in source ownership. No vendor lock-in; components live in `src/components/ui/`. |
| **Styling** | Tailwind CSS | Utility-first keeps styles co-located with components, eliminates dead CSS, and makes responsive design trivial with `sm:/md:/lg:` prefixes. |
| **Offline storage** | idb (IndexedDB) | Persists the mutation queue in the browser across tab reloads. Lightweight wrapper over the native IndexedDB API. |
| **Notifications** | Sonner | Minimal-footprint toast library with `toast.custom()` support for richly styled undo/confirm toasts. |
| **Containerisation** | Docker + Docker Compose | Single command (`docker compose up`) reproduces the full environment — app + database — identically on any machine. Multi-stage Dockerfile keeps the production image lean. |

---

## Tech Flow Diagram

```
┌───────────────────────────────────────────────────────┐
│                      Browser                          │
│                                                       │
│  React (Next.js App Router)                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  TripsPageContainer                             │  │
│  │    ├── TripStatsBar  (aggregate stats)          │  │
│  │    ├── TripFilters   (sort / filter controls)   │  │
│  │    ├── TripListView  (paginated card grid)      │  │
│  │    │     └── TripCard × N                      │  │
│  │    ├── TripFormModal (create / edit)            │  │
│  │    └── DeleteConfirmationModal                  │  │
│  └─────────────────────────────────────────────────┘  │
│           │                          │                │
│    TanStack Query              IndexedDB (idb)        │
│    (server state cache)        (offline mutation queue)│
│           │                          │                │
└───────────┼──────────────────────────┼────────────────┘
            │  X-Device-ID header       │
            │  (fetch, online)          │ flush on reconnect
            ▼                          ▼
┌───────────────────────────────────────────────────────┐
│               Next.js API Routes (/api/trips/*)       │
│                                                       │
│   ① Zod schema validation                            │
│   ② Device-scoped Prisma queries                     │
│   ③ serializeTrip() — strips deviceId, formats dates │
└───────────────────────────┬───────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────┐
│          PostgreSQL 16 (Docker container)             │
│                                                       │
│   Trip table                                          │
│   @@index([deviceId, createdAt(sort: Desc)])          │
└───────────────────────────────────────────────────────┘
```

**Offline path:**

```
Mutation attempted ──► navigator.onLine? ──No──► Enqueue to IndexedDB
                                                       │
        ◄── Optimistic update in TanStack Query cache ◄┘
                                                       │
window 'online' fires ──► useOfflineSync flushes queue ──► API routes ──► DB
```

---

## User Flow Diagram

```
Open App (/)
    │
    ▼
Redirect → /trips
    │
    ▼
TripsPageContainer loads
    │
    ├── [online]  ──► GET /api/trips → render TripCard grid
    └── [offline] ──► TanStack Query serves cached data + OfflineIndicator shown
            │
            ▼
    ┌───────────────────────────────────┐
    │         Trips List View           │
    │  Filter: memorable / has notes    │
    │  Sort: recent / oldest / distance │
    │  Pagination: prev / next          │
    └──────────────┬────────────────────┘
                   │
       ┌───────────┼────────────────┐
       ▼           ▼                ▼
  [+ New Trip]  [Edit Trip]   [Delete Trip]
       │           │                │
       ▼           ▼                ▼
  TripFormModal  TripFormModal  DeleteConfirmation
  (blank form)   (pre-filled)   Modal
       │           │                │
       ▼           ▼                ▼
  POST /api/trips  PUT /api/      DELETE /api/
                   trips/[id]     trips/[id]
       │
       ▼
  [Toggle Memorable ★]
       │
       ▼
  PATCH /api/trips/[id]/memorable
```

All mutations follow this lifecycle:
```
User action
    │
    ▼
Optimistic update (instant UI feedback)
    │
    ├── [online]  → API call → success → invalidate cache
    └── [offline] → queue to IndexedDB → sync on reconnect
            │
            └── on error → rollback optimistic update + toast
```

---

## Folder Structure

```
Assessment/
├── prisma/
│   └── schema.prisma          # DB schema + migrations source
├── src/
│   ├── app/
│   │   ├── api/trips/         # REST API route handlers
│   │   │   ├── route.ts           GET list + POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts       PUT update + DELETE
│   │   │       └── memorable/
│   │   │           └── route.ts   PATCH toggle memorable
│   │   ├── trips/
│   │   │   └── page.tsx       # /trips page (server component shell)
│   │   ├── layout.tsx         # Root layout, QueryClientProvider
│   │   ├── providers.tsx      # TanStack Query provider
│   │   └── globals.css        # Tailwind base + custom variables
│   ├── components/
│   │   ├── trips/             # Feature components (trip domain)
│   │   │   ├── TripsPageContainer.tsx   Container — state + mutations
│   │   │   ├── TripListView.tsx         Presenter — grid + pagination
│   │   │   ├── TripCard.tsx             Presenter — single trip card
│   │   │   ├── TripFormModal.tsx        Presenter — create/edit dialog
│   │   │   ├── TripFormView.tsx         Presenter — form fields
│   │   │   ├── TripFilters.tsx          Presenter — filter/sort bar
│   │   │   └── DeleteConfirmationModal.tsx
│   │   └── ui/                # Reusable UI primitives (Shadcn)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── DateTimePicker.tsx
│   │       ├── EmptyState.tsx
│   │       ├── OfflineIndicator.tsx
│   │       ├── TripStatsBar.tsx
│   │       ├── TripLoader.tsx
│   │       └── toasts/
│   │           ├── DeleteToast.tsx
│   │           └── UpdateToast.tsx
│   ├── hooks/
│   │   ├── useTrips.ts        # TanStack Query — queries + mutations
│   │   ├── useOfflineSync.ts  # Offline queue flush on reconnect
│   │   └── useTripForm.ts     # RHF form state
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   ├── tripService.ts     # Fetch wrappers for API routes
│   │   ├── offlineStore.ts    # IndexedDB CRUD via idb
│   │   ├── apiError.ts        # Typed error helpers
│   │   ├── serializeTrip.ts   # Strip deviceId, format dates
│   │   ├── deviceId.ts        # localStorage UUID management
│   │   ├── ripple.ts          # Button ripple effect utility
│   │   └── utils.ts           # cn() helper (clsx + tailwind-merge)
│   ├── schemas/
│   │   └── tripSchema.ts      # Zod schema (shared client + server)
│   └── types/
│       └── trip.ts            # Trip TypeScript interfaces
├── docs/artifacts/ROVE-1/     # SDLC artifacts (specs, design, plan)
├── .env.example               # Environment variable template
├── docker-compose.yml         # Full stack orchestration
├── Dockerfile                 # Production multi-stage build
├── Dockerfile.dev             # Development container
├── next.config.mjs            # Next.js config (standalone output)
├── CODING_STANDARDS.md        # → See coding standards
└── package.json
```

---

## Coding Standards

See **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** for:
- Coding principles (DRY, single responsibility, co-location)
- Design patterns used and their rationale
- Naming conventions and file structure rules

---

## Potential Improvements

| Area | Improvement | Reason |
|------|------------|--------|
| **Auth** | Add NextAuth.js / Clerk | Replace anonymous device scoping with real user accounts; required for multi-device sync and GDPR compliance |
| **Offline conflict resolution** | Timestamp-based last-write-wins or CRDT | Currently, offline edits to the same record from two devices will silently overwrite each other |
| **Pagination strategy** | Cursor-based pagination | Offset pagination can skip/duplicate records when new trips are inserted during browsing; cursor is stable |
| **Map integration** | Google Maps / Mapbox autocomplete | Replace free-text start/end location inputs with map-aware autocomplete for consistent location data |
| **Trip metrics** | Average speed, duration calculation | Derive from `startTime`, `endTime`, and `distance` — useful for driver insights |
| **Background sync** | Service Worker + Background Sync API | Replace the `window 'online'` flush with a proper Service Worker queue that syncs even when the tab is closed |
| **Analytics** | Trip heatmap, monthly summaries | Aggregate data visualisations over time periods |
| **Export** | CSV / GPX export | Drivers may want records for expense reports or route replay |
| **Rate limiting** | Per-device request throttling | Currently no rate limiting on API routes; relevant once exposed publicly |
| **E2E tests** | Playwright test suite | Covers the offline → sync flow end-to-end, which unit tests cannot reliably exercise |
