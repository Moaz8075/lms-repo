# LegalEase Mobile

Production-grade React Native foundation for the Lawyer Case Management SaaS.

## Stack

- Expo SDK 57 + Expo Router
- TypeScript (strict)
- Axios + TanStack Query
- Zustand
- React Hook Form + Zod
- Expo Secure Store

## Setup

```bash
# From repo root
yarn install

# Configure environment
cp apps/mobile/.env.example apps/mobile/.env

# Start Metro
yarn workspace mobile start
```

Set `EXPO_PUBLIC_API_URL` to your NestJS API base URL (e.g. `http://localhost:3000/api/v1`).

For Android emulator, use `http://10.0.2.2:3000/api/v1` instead of `localhost`.

## Project Structure

```
src/
├── api/           # Axios instance + API modules
├── components/    # UI building blocks (common, forms, layout)
├── config/        # Environment configuration
├── constants/     # Colors, routes, storage keys
├── hooks/         # Shared React hooks
├── lib/           # Errors, secure storage, query client
├── providers/     # App-level providers
├── services/      # Business service layer (per module)
├── store/         # Zustand stores
├── theme/         # Design tokens
├── types/         # Shared TypeScript types
└── utils/         # Formatters and helpers
```

## Foundation Includes

- JWT auth store with Secure Store persistence
- Axios interceptors (401, timeout, network errors)
- TanStack Query defaults
- Centralized theme (no inline colors)
- Route constants for auth and app sections
- Reusable `AppError` hierarchy

Business screens (login, dashboard, cases, etc.) are **not** included yet — add them on top of this foundation.
