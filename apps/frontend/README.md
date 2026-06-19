# LegalEase Frontend

Next.js App Router frontend for the Lawyer Case Management SaaS.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Material UI (MUI)
- TanStack Query
- Axios
- React Hook Form + Zod
- Zustand

## Getting Started

```bash
# From repo root
yarn install

# Copy env and set API URL
cp apps/frontend/.env.example apps/frontend/.env.local

# Start backend (port 3000) then frontend (port 3001)
yarn backend:dev
yarn frontend:dev
```

Open [http://localhost:3001](http://localhost:3001).

## Project Structure

```
app/
├── (auth)/          # Login, register
├── (dashboard)/     # Protected app pages
components/
├── layout/          # Sidebar, Header, AppLayout
├── ui/              # Reusable UI components
services/            # API service layer
store/               # Zustand stores
hooks/               # React Query hooks
types/               # Shared TypeScript types
utils/               # Helpers and constants
```

## Authentication

- JWT stored in Zustand (persisted) + auth cookie for middleware
- Axios attaches `Authorization` and `x-organization-id` headers
- 401 responses trigger automatic logout and redirect to `/login`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:3000/api/v1`) |
