# Project Context — Drive Trip Logger (ROVE Technologies)

## Project-Specific Context

- Service: drive-trip-logger
- Region: us-east-1 (AWS)
- Ticket prefix: ROVE
- Key dependencies: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Prisma, PostgreSQL, TanStack Query, React Hook Form, Zod, idb
- Team contact: engineering@rove.com

## Conventions

- Branch naming: `ROVE-<ID>-short-description`
- PR title: `ROVE-<ID>: Short description`

<!-- SDLC Plugin Context Start -->
## SDLC Pipeline Context

**Organization:** ROVE Technologies (ROVE builds travel and trip management tools for drivers, riders, and travelers.)
**Stack:** Node.js | **Cloud:** AWS | **CI/CD:** GitHub Actions
**Ticket prefix:** ROVE | **Ticket system:** GitHub Issues

### Conventions

- **Branch naming:** `ROVE-<ID>-short-description`
- **PR title:** `ROVE-<ID>: Short description`
- **Feature flags:** None
- **Structured logging:** (none — use console.* in MVP)

### Brands/Products

- ROVE (brand)
- DTL (Drive Trip Logger product)

### SDLC Pipeline Usage

Run the full pipeline:
```
/sdlc --ticket=ROVE-1
```

Resume from checkpoint:
```
/sdlc --ticket=ROVE-1 --resume
```

Start from specific phase:
```
/sdlc --ticket=ROVE-1 --from=architecture
```

Reconfigure plugin:
```
/onboard
```

### Architecture Context

Single Next.js 14 (App Router) full-stack application with PostgreSQL via Prisma ORM. Offline support via IndexedDB (idb library). REST API at `/api/*`. Docker Compose starts the entire stack locally.

### Security & Compliance

No authentication in MVP. Trip location data is sensitive (patterns of life). No secrets in source code. GDPR obligations activate when user accounts are added in future.

<!-- SDLC Plugin Context End -->

