# Lawyer Case Management System (LMS)

Multi-tenant SaaS monorepo for Pakistani law firms.

## Structure

```
lms-repo/
├── apps/
│   ├── backend/          # NestJS API
│   ├── frontend/         # Next.js web app
│   └── mobile/           # Expo mobile app
└── package.json          # Yarn workspaces root
```

## Tech Stack

### Backend (`apps/backend`)

- **NestJS** — API framework
- **Prisma** — ORM with PostgreSQL
- **JWT + Passport** — Authentication
- **Swagger** — API documentation
- **Winston** — Structured logging
- **Docker** — Backend image for production (e.g. Render)

## Getting Started

### Prerequisites

- Node.js >= 20
- Yarn 1.x
- PostgreSQL 16 (local) or a cloud database (e.g. Neon)

### Setup

```bash
# Install dependencies
yarn install

# Copy environment variables
cp apps/backend/.env.example apps/backend/.env
# Set DATABASE_URL to your local or cloud Postgres

# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# Start development server
yarn backend:dev
```

### API

| Resource | URL |
|----------|-----|
| API Base | `http://localhost:3000/api/v1` |
| Swagger  | `http://localhost:3000/docs` |

### Scripts

| Command | Description |
|---------|-------------|
| `yarn backend:dev` | Start backend in watch mode |
| `yarn backend:build` | Build backend for production |
| `yarn backend:start` | Run production build |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn prisma:migrate` | Run database migrations |
| `yarn prisma:studio` | Open Prisma Studio |

## Architecture

Feature-based modular architecture with multi-tenant support via `organizationId` on all tenant-scoped resources.

### Backend Modules

- `auth` — JWT authentication infrastructure
- `organizations` — Law firm tenants
- `users` — Firm members and roles
- `clients` — Client management
- `cases` — Case lifecycle
- `hearings` — Court hearing schedules
- `case-diary` — Daily case notes
- `documents` — Document management
- `payments` — Fee tracking
- `expenses` — Expense tracking
- `activity-logs` — Audit trail

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```
