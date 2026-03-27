# Claude Code Instructions for mini-app-template-v2

## Before doing ANY work, read these files in order:

1. `ARCHITECTURE.md` — project structure, auth flow, component patterns, design system
2. `HOW_TO.md` — full walkthrough including integration rules (Section 11)
3. `QUICKSTART.md` — step-by-step build and deploy guide
4. `MINI_APP_GUIDE.md` — practical guide with examples and AI agent rules

Do not skip this step. Do not skim. Read them fully before writing any code.

---

## Template design system — never override

This template has a specific visual identity. Every page must use it:

- **Background:** Cream `#f7f1ea` — set via `--background` CSS variable
- **Blob:** Decorative gradient at top of page — `.app-blob` class in `globals.css`, rendered by `<div className="app-blob">` in `AppShell.tsx`
- **Content padding:** `.app-content` with `px-6 pb-28 pt-10`
- **Cards:** `rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm`
- **Typography:** `.type-meta`, `.type-h1`, `.type-lead`, `.type-item-title`
- **Page structure:** `<main className="space-y-10">` with header section then card sections
- **Navigation:** `BottomBar` component — fixed bottom nav with optional FAB

### Files that must never be overwritten:

- `src/app/globals.css`
- `src/components/layout/AppShell.tsx`
- `src/app/layout.tsx`
- `src/components/ui/BottomBar.tsx` (structure — nav items can be updated)
- `src/components/ui/Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `ListRow.tsx`

---

## When integrating external code (Figma Make, V0, Bolt, etc.)

Read HOW_TO.md Section 11 in full. Summary of the rules:

1. **Template files are immutable.** Clone the template, then ADD new files. Never paste external CSS/layout over template files.
2. **Diff against the template after every step.** Run `git diff origin/main -- src/app/globals.css src/components/layout/AppShell.tsx` — if template content is lost, that's a bug.
3. **Commit everything together.** Never leave CSS/layout fixes uncommitted while committing page files. Run `git status` after every commit.
4. **Verify visually before pushing.** Start the dev server and confirm cream background, blob, and white cards render correctly.
5. **Extract only logic from external output.** Take: contexts, types, data, business logic. Discard: backgrounds, card styles, navigation, layout shells.
6. **No external backgrounds.** Remove any `bg-gradient-to-br`, `from-pink-`, `via-purple-`, or similar classes. Replace with template card styles.
7. **Single atomic commit.** Include ALL integration changes in one commit — don't split foundation fixes from page restyling.

### Integration checklist (verify before pushing):

- [ ] `globals.css` has `.app-blob`, `.app-shell` with `bg-[var(--background)]`, `.app-content` with `px-6 pb-28 pt-10`
- [ ] `AppShell.tsx` has `<div className="app-blob" aria-hidden="true" />`
- [ ] No external backgrounds in any page file
- [ ] All pages use `<main className="space-y-10">` with template card styles
- [ ] `git status` shows no uncommitted changes
- [ ] Dev server renders correctly before pushing

---

## When building a new feature from scratch

Follow the pattern in QUICKSTART.md Part 2:

1. Write database migration SQL (copy from `005_demo_notes.sql`)
2. Add TypeScript types in `src/types/database.ts` and `src/lib/types.ts`
3. Create page at `src/app/yourfeature/page.tsx` (copy from `src/app/demo/page.tsx`)
4. Update `BottomBar.tsx` nav items
5. Update `protectedPaths` in `src/lib/supabase/middleware.ts`
6. Update `APP_NAME` in `src/lib/constants.ts` and metadata in `src/app/layout.tsx`
7. Delete demo files when done

---

## Auth — do not touch

These files handle authentication and must not be modified:

- `src/middleware.ts`
- `src/lib/supabase/middleware.ts` (only update `protectedPaths`)
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/contexts/AuthContext.tsx`

Key rules:
- Always use `window.location.href` for post-auth redirects, never `router.push`
- Always scope database queries with `.eq("user_id", user.id)`
- Always include `user_id` in inserts
- Never skip RLS policies on new tables

---

## Git workflow

- Create feature branches as `Claude/<feature-name>` from `origin/main`
- Run `npm run build` before pushing — fix any TypeScript errors
- Run `git status` after every commit to catch uncommitted changes
- Never amend commits — create new ones
- Open a PR when the feature is complete
