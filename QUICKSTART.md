# Quickstart: Building a New Mini-App

A step-by-step guide for creating a new app from the `mini-app-template-v2` template. Follow the steps in order and you'll have a working, deployed app by the end.

**Example of a finished app:** [expense-tracker-poc.vercel.app](https://expense-tracker-poc.vercel.app) — source at `ross-maher1/expense-tracker-poc`

---

## Before You Start

You'll need:
- **Node.js 18+** installed (`node -v` to check)
- **GitHub CLI** installed (`gh --version` to check)
- A **Supabase account** — free tier at [supabase.com](https://supabase.com)
- A **Vercel account** — free tier at [vercel.com](https://vercel.com)
- Access to the `ross-maher1/mini-app-template-v2` GitHub repo

---

## Part 1: Get Set Up Locally

### 1. Create your new repo from the template

Open a terminal and run the following, replacing `my-app-name` with your actual app name (e.g. `invoice-tracker`):

```bash
git clone https://github.com/ross-maher1/mini-app-template-v2.git my-app-name
cd my-app-name
rm -rf .git
git init
git add .
git commit -m "Initial commit from mini-app-template-v2"
gh repo create my-app-name --public --source=. --remote=origin --push
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**
2. Give it a name, set a database password, choose a region, click **Create new project**
3. Wait for it to finish setting up (takes about a minute)

### 3. Get your Supabase credentials

In your Supabase project, go to **Settings → API**. You'll need:
- **Project URL** (looks like `https://xxxxx.supabase.co`)
- **anon / public** key
- **service_role** key (click to reveal it)

### 4. Set up environment variables

In your project folder:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5. Configure Supabase Auth

In your Supabase project:

1. Go to **Authentication → Sign In / Providers → Email**
2. **Turn off "Confirm email"** — this lets users sign up and log in immediately without needing to click a confirmation link
3. Go to **Authentication → URL Configuration**
4. Under **Redirect URLs**, add: `http://localhost:3000/**`

### 6. Run the database migrations

Go to **Supabase Dashboard → SQL Editor → New Query**.

For each file below, copy the SQL content and click **Run**. Do them in order:

1. `database/migrations/001_shared_schema.sql`
2. `database/migrations/002_rls_policies.sql`
3. `database/migrations/003_indexes.sql`
4. `database/migrations/004_triggers.sql` ← **don't skip this one**
5. `database/migrations/005_demo_notes.sql`

### 7. Start the dev server and test

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **If you see a blank page or auth keeps looping:** You may have leftover cookies from a previous project. Open browser DevTools → Application → Cookies → `http://localhost:3000` → delete everything starting with `sb-`. Then refresh.

Run through this quick test to confirm everything is working:

- [ ] Visiting `/` redirects you to the login page
- [ ] Signing up takes you to the dashboard immediately (no confirmation email)
- [ ] Going to `/demo` lets you add and delete notes
- [ ] Signing out redirects you back to login
- [ ] Signing back in shows your notes are still there

If all of these pass, the template is working correctly. Now you can build your feature.

---

## Part 2: Build Your Feature

The template comes with a demo "Notes" feature. You'll replace it with your own.

### Step 1: Write a database migration

Create a new file: `database/migrations/005_yourfeature.sql`

This replaces the demo notes migration. Copy the structure from `005_demo_notes.sql` and change the table name and columns to match your app. Every table needs:
- `id`, `user_id`, `created_at`, `updated_at` columns (copy as-is)
- Your own custom columns (e.g. `amount`, `title`, `date`, etc.)
- The RLS policies (copy as-is, just update the table name)
- The `updated_at` trigger (copy as-is, just update the table name)

Run your new migration in Supabase SQL Editor.

### Step 2: Add TypeScript types

Open `src/types/database.ts` and add three interfaces for your table following the same pattern as `DemoNoteRow`, `DemoNoteInsert`, and `DemoNoteUpdate`. Update the `Database` interface at the bottom to include your table.

Open `src/lib/types.ts` and add a type for your feature (following the `DemoNote` example).

### Step 3: Create your page

Create `src/app/yourfeature/page.tsx`. The easiest way is to copy `src/app/demo/page.tsx` and adapt it — change the table name, form fields, and column references to match your feature.

### Step 4: Update the navigation

Open `src/components/ui/BottomBar.tsx` and update the middle nav item:
- Change `href` to your new route (e.g. `/invoices`)
- Change the `icon` import to something appropriate from [lucide.dev](https://lucide.dev)
- Change the `label` to your feature name

### Step 5: Protect your new route

Open `src/lib/supabase/middleware.ts` and update the `protectedPaths` array to include your new route:

```typescript
const protectedPaths = ["/", "/yourfeature", "/settings"];
```

### Step 6: Update the app name

- `src/lib/constants.ts` → change `APP_NAME`
- `src/app/layout.tsx` → change the `title` and `description` in the metadata

### Step 7: Update the dashboard

Open `src/app/page.tsx` and replace the demo notes stats with something relevant to your app (e.g. total invoices, total amount, etc.).

### Step 8: Delete the demo

- Delete the folder `src/app/demo/`
- Delete `database/migrations/005_demo_notes.sql`
- Optionally, run `DROP TABLE IF EXISTS public.demo_notes CASCADE;` in Supabase SQL Editor

### Step 9: Check it builds

```bash
npm run build
```

Fix any TypeScript errors before deploying. The most common one is forgetting to update the `Database` interface in `src/types/database.ts`.

---

## Part 3: Deploy to Vercel

### 1. Push your code

```bash
git add .
git commit -m "Add [your feature name]"
git push
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your GitHub repo
3. Before clicking **Deploy**, scroll down to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |

4. Click **Deploy**

Vercel will give you a URL like `your-app-name.vercel.app`.

### 3. Update Supabase for production

In Supabase → **Authentication → URL Configuration**:
- Set **Site URL** to `https://your-app-name.vercel.app`
- Under **Redirect URLs**, add `https://your-app-name.vercel.app/**`

### 4. Run the same end-to-end test on your production URL

- [ ] Visiting the site redirects to login
- [ ] Signup works and takes you to the dashboard
- [ ] Your feature works (add and delete items)
- [ ] Sign out and sign back in — data persists
- [ ] Dashboard shows correct counts/totals

---

## Things to Know

**Don't touch these files** — they handle auth and will break things if modified:
- `src/middleware.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/client.ts` / `server.ts`
- `src/contexts/AuthContext.tsx`

**Always scope database queries to the logged-in user:**
```typescript
.from("your_table").select("*").eq("user_id", user.id)
```

**Always include `user_id` when inserting:**
```typescript
.from("your_table").insert({ user_id: user.id, ...yourData })
```

**If something breaks with auth**, the most common causes are:
1. Stale cookies — clear `sb-` cookies in browser DevTools
2. Email confirmation is on — turn it off in Supabase Auth settings
3. Migration 004 wasn't run — the profile trigger won't exist

---

---

## Integrating External Code (Figma Make, V0, etc.)

If you're integrating code from an external generator rather than building from scratch, read the **"Integrating External UI Output"** section in `HOW_TO.md` before starting. The key rule: **the template is the base** — add new page files to the template, don't overwrite template files with external versions. Extract only logic (contexts, types, data) from the external output; all visual styling must use the template's design system (cream background, blob gradient, white cards).

---

If you get stuck, check `MINI_APP_GUIDE.md` for more detail, or look at the Expense Tracker POC (`ross-maher1/expense-tracker-poc`) as a complete working example.
