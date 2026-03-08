# Mini App Template v2

A production-ready template for building mini-apps on the unified-user architecture. Each mini-app is a standalone Next.js application that connects to a shared Supabase project, sharing authentication and user profiles across all apps.

## Quick Start

```bash
# 1. Clone the template into a new folder
git clone https://github.com/ross-maher1/mini-app-template-v2.git my-app-name
cd my-app-name

# 2. Detach from the template's git history and create your own repo
rm -rf .git
git init
git add .
git commit -m "Initial commit from mini-app-template-v2"
gh repo create my-app-name --public --source=. --remote=origin --push

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (Dashboard > Settings > API)

# 5. Configure Supabase Auth
# Go to Authentication > Sign In / Providers > Email
# Disable "Confirm email" (so signup creates a session immediately)
# Go to Authentication > URL Configuration
# Add redirect URL: http://localhost:3000/**

# 6. Run database migrations
# Go to Supabase Dashboard > SQL Editor > New Query
# Run each file in database/migrations/ in order (001, 002, 003, 004, 005)
# Migrations 001-004 are shared — only run once per Supabase project
# Migration 005 is the demo table — replace it when building your real app

# 7. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up to test.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Supabase** (Auth + PostgreSQL + RLS)
- **React Hook Form** + **Zod** (form validation)
- **Lucide React** (icons)

## Project Structure

```
src/
  app/
    auth/           # Login, signup, password reset, signout
    demo/           # Demo CRUD page (delete and replace)
    settings/       # Profile + sign out
    page.tsx        # Dashboard
    layout.tsx      # Root layout (AuthProvider + AppShell)
  components/
    layout/         # AppShell wrapper
    ui/             # BottomBar, ListRow
  contexts/         # AuthContext (auth state management)
  hooks/            # useAuth hook
  lib/
    supabase/       # Browser client, server client, middleware helper
    constants.ts    # APP_NAME and config
    types.ts        # App domain types
    utils.ts        # Utility functions
  types/
    database.ts     # Database schema types
database/
  migrations/       # SQL migration files (run in Supabase SQL Editor)
```

## Documentation

- **[MINI_APP_GUIDE.md](./MINI_APP_GUIDE.md)** — Practical guide: full walkthrough based on a real POC, with pitfalls and fixes
- **[HOW_TO.md](./HOW_TO.md)** — Full guide: architecture, setup, adding features, deploying
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Technical reference: auth flow, patterns, conventions

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
