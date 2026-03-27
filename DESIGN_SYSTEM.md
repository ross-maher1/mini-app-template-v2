# Design System — mini-app-template-v2

This document defines every visual token, component, and layout pattern used in the template. Use it as a reference when designing screens in Figma, or feed it directly to Figma Make / AI code generators so their output already matches the template.

---

## 1. Foundations

### 1.1 Colours

| Token | Value | Usage |
|---|---|---|
| `--background` | `#f7f1ea` | Page background (warm cream) |
| `--foreground` | `#111827` | Primary text (slate-900) |
| `slate-900` | `#0f172a` | Headings, strong text, primary buttons |
| `slate-700` | `#334155` | Body text, secondary buttons, labels |
| `slate-600` | `#475569` | Subtitles, descriptions |
| `slate-500` | `#64748b` | Meta text, placeholders, inactive icons |
| `slate-400` | `#94a3b8` | Borders, disabled text, icon buttons |
| `slate-200` | `#e2e8f0` | Card borders, dividers, input borders |
| `slate-100` | `#f1f5f9` | Secondary button backgrounds, hover states |
| `slate-50` | `#f8fafc` | Hover backgrounds on list items |
| `white` / `bg-white/85` | `#ffffff` at 85% opacity | Card backgrounds |
| `rose-600` | `#e11d48` | Destructive button background |
| `rose-400` / `rose-200` / `rose-50` | — | Error states (border, background, text) |

**Gradient — Decorative blob (not applied to any UI element, only the background blob):**
```
radial-gradient(circle at 20% 40%, #fbbf24 0%, transparent 35%),
radial-gradient(circle at 50% 30%, #fb7185 0%, transparent 45%),
radial-gradient(circle at 75% 20%, #c084fc 0%, transparent 40%)
```

> **Rule:** No gradients are ever applied to cards, buttons, pages, or nav elements. The blob gradient only appears as a decorative background element behind content.

### 1.2 Typography

**Font family:** Geist Sans (`--font-geist-sans`) for all text. Geist Mono (`--font-geist-mono`) for code.

| Class | CSS | Usage |
|---|---|---|
| `.type-meta` | `text-xs uppercase tracking-[0.3rem] text-slate-500` | Section label above page title |
| `.type-h1` | `text-3xl font-semibold tracking-tight md:text-4xl` | Page title |
| `.type-lead` | `text-sm text-slate-600` | Subtitle below page title |
| `.type-item-title` | `text-sm font-semibold italic text-slate-900` | List item title |

**Other text styles used inline:**

| Style | Tailwind classes | Usage |
|---|---|---|
| Card heading | `text-lg font-semibold` | Section title inside a card |
| Field label | `text-sm font-medium text-slate-700` | Form field label |
| Field label (optional) | `font-normal text-slate-400` | "(optional)" suffix |
| Detail label | `text-xs font-medium uppercase text-slate-500` | Label in detail views |
| Detail value | `text-sm text-slate-900` | Value in detail views |
| Small text | `text-xs text-slate-600` | Subtitles in list items |
| Tiny text | `text-[11px] text-slate-500` | Meta info in list items |
| Timestamp | `text-xs text-slate-400` | Dates, times |
| Count badge | `text-xs text-slate-500` | "3 notes" style counters |

### 1.3 Spacing

| Context | Value |
|---|---|
| Page sections | `space-y-10` (40px between major sections) |
| Header internal | `space-y-2` (8px between meta, h1, lead) |
| Card internal | `p-5` or `p-6` (20–24px padding) |
| Card to card | `gap-6` (24px in grid layouts) |
| Form fields | `space-y-4` (16px between fields) |
| Content padding (mobile) | `px-6` (24px horizontal) |
| Content top | `pt-10` (40px) |
| Content bottom | `pb-28` (112px — clears the bottom nav) |
| Max content width | `max-w-6xl` centred |

### 1.4 Border radius

| Element | Value |
|---|---|
| Cards | `rounded-2xl` (16px) |
| Inner cards / list items | `rounded-xl` (12px) |
| Buttons | `rounded-lg` (8px) |
| Inputs | `rounded-lg` (8px) |
| Badges / pills | `rounded-full` |
| FAB | `rounded-full` |
| Modal | `rounded-xl` (12px) |

### 1.5 Shadows

| Element | Value |
|---|---|
| Cards | `shadow-sm` |
| Buttons | `shadow-sm` |
| FAB | `shadow-md` |
| Modal | `shadow-xl` |

### 1.6 Icons

**Library:** Lucide React (`lucide-react`)

| Context | Size | Stroke |
|---|---|---|
| Navigation (active) | `20` | `2.5` |
| Navigation (inactive) | `20` | `2` |
| Inline action buttons | `16` | default |
| List row chevron | `16` | default |

---

## 2. Layout

### 2.1 App Shell

Every page is wrapped in `AppShell`, which provides three layers:

```
┌─────────────────────────────────┐
│ .app-shell                      │  cream background, min-h-screen
│  ┌────────────────────────────┐ │
│  │ .app-blob                  │ │  decorative gradient, top of screen
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ .app-content               │ │  z-1, max-w-6xl, px-6 pb-28 pt-10
│  │  ┌──────────────────────┐  │ │
│  │  │ <main>  (page)       │  │ │  space-y-10
│  │  └──────────────────────┘  │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ BottomBar (fixed)          │ │  fixed bottom, z-50
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

**CSS classes (from `globals.css`):**
```css
.app-shell {
  @apply relative min-h-screen overflow-hidden bg-[var(--background)] text-slate-900;
}
.app-blob {
  @apply pointer-events-none absolute inset-x-0 top-[-18%] h-[320px] max-w-5xl
         -translate-x-1/2 left-1/2 rounded-full opacity-80 blur-3xl;
  background: radial-gradient(circle at 20% 40%, #fbbf24 0%, transparent 35%),
              radial-gradient(circle at 50% 30%, #fb7185 0%, transparent 45%),
              radial-gradient(circle at 75% 20%, #c084fc 0%, transparent 40%);
}
.app-content {
  @apply relative z-[1] mx-auto w-full max-w-6xl px-6 pb-28 pt-10;
}
```

**JSX (`AppShell.tsx`):**
```tsx
<div className="app-shell">
  <div className="app-blob" aria-hidden="true" />
  <div className="app-content">{children}</div>
  <BottomBar />
</div>
```

> **Rule:** Pages never set their own background. The shell provides it. Pages only render `<main>` content.

### 2.2 Page structure

Every page follows this pattern:

```tsx
<main className="space-y-10">
  {/* Header */}
  <div className="space-y-2">
    <p className="type-meta">Section Label</p>
    <h1 className="type-h1">Page Title</h1>
    <p className="type-lead">Optional subtitle text.</p>
  </div>

  {/* Content — one or more cards */}
  <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
    {/* Card content */}
  </div>
</main>
```

### 2.3 Bottom navigation

Fixed at bottom of viewport. Frosted glass effect.

```
┌──────────────────────────────────────┐
│  🏠 Home    📄 Notes    [+]    ⚙ Settings  │
└──────────────────────────────────────┘
```

**Container:**
```
fixed bottom-0 inset-x-0 z-50
border-t border-slate-200/70
bg-white/90 backdrop-blur-lg
```

**Nav items:**
```
flex flex-col items-center gap-0.5 px-4 py-1
text-xs font-medium
Active:   text-slate-900, icon strokeWidth 2.5
Inactive: text-slate-500 hover:text-slate-700, icon strokeWidth 2
```

**FAB (optional, centre position):**
```
h-10 w-10 rounded-full
bg-slate-900 text-white shadow-md
hover:bg-slate-800
Icon: Plus at size 20
```

---

## 3. Components

### 3.1 Card

The primary container for all content sections.

```tsx
// Inline style (most common in pages):
<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">

// Or using the Card component:
import { Card } from "@/components/ui/Card";
<Card header={<h2>Title</h2>} footer={<Button>Save</Button>}>
  {content}
</Card>
```

**Card component classes:**
- Outer: `rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60`
- Header: `border-b border-slate-200 px-5 py-4`
- Body: `px-5 py-4`
- Footer: `border-t border-slate-200 px-5 py-3`

**Max width:** Add `max-w-lg` for narrow single-column cards (settings, forms).

### 3.2 Button

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Edit</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button loading>Saving...</Button>
```

| Variant | Background | Text | Hover |
|---|---|---|---|
| `primary` | `var(--foreground)` / slate-900 | white | `slate-800` |
| `secondary` | `slate-100` | `slate-900` | `slate-200` |
| `ghost` | transparent | `slate-700` | `slate-100` |
| `destructive` | `rose-600` | white | `rose-700` |

| Size | Padding | Text |
|---|---|---|
| `sm` | `px-3 py-1.5` | `text-xs` |
| `md` | `px-4 py-2` | `text-sm` |
| `lg` | `px-5 py-2.5` | `text-base` |

All buttons: `rounded-lg font-medium shadow-sm`, focus ring on `focus-visible`.

### 3.3 Input

```tsx
import { Input } from "@/components/ui/Input";

<Input placeholder="Enter text" />
<Input error />
```

**Classes:**
- Default: `w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400`
- Error: `border-rose-400 focus:border-rose-500`

### 3.4 FormField

Wraps a label, input, and error message:

```tsx
import { FormField } from "@/components/ui/FormField";

<FormField label="Email" id="email" error={errors.email?.message} placeholder="you@example.com" />
```

- Label: `text-sm font-medium text-slate-700`
- Error: `mt-1 text-xs text-rose-600`

### 3.5 Modal

```tsx
import { Modal } from "@/components/ui/Modal";

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Edit Item"
  footer={<Button onClick={save}>Save</Button>}>
  {form content}
</Modal>
```

- Backdrop: `bg-black/50`
- Container: `max-w-lg w-full rounded-xl bg-white shadow-xl`
- Header: `border-b border-slate-200 px-5 py-4`, title `text-lg font-semibold text-slate-900`
- Body: `px-5 py-4`
- Footer: `border-t border-slate-200 px-5 py-3`

### 3.6 ListRow

A standard row for list views:

```tsx
import ListRow from "@/components/ui/ListRow";

<ListRow
  title="Melbourne Single Launch"
  subtitle="My Punk Band | Album Tour"
  meta="Sat Aug 13 | 4pm"
  onClick={() => router.push("/gigs/1")}
  actionLabel="Confirmed"
/>
```

- Container: `border-b border-dashed border-slate-200 py-3 last:border-b-0`
- Clickable: adds `cursor-pointer hover:bg-slate-50`
- Title: `.type-item-title text-base` (semibold italic)
- Subtitle: `text-xs text-slate-600`
- Meta: `text-[11px] text-slate-500`
- Action label (pill): `rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm`
- Chevron: `ChevronRight size={16} text-slate-400`

### 3.7 ErrorBanner

```tsx
import { ErrorBanner } from "@/components/ui/ErrorBanner";

<ErrorBanner message={error} onDismiss={() => setError(null)} />
```

- Container: `rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600`
- Dismiss button: `text-red-400 hover:text-red-600`

### 3.8 Skeleton

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

<Skeleton width="200px" height="20px" />
<Skeleton className="h-10 w-full" rounded />
```

- `animate-pulse bg-slate-200 rounded-md`

### 3.9 Spinner

```tsx
import { Spinner } from "@/components/ui/Spinner";

<Spinner size="sm" />  // 16px
<Spinner size="md" />  // 24px
<Spinner size="lg" />  // 32px
```

- `animate-spin rounded-full border-current border-r-transparent`

---

## 4. Common patterns

### 4.1 List page

```tsx
<main className="space-y-10">
  <div className="space-y-2">
    <p className="type-meta">Category</p>
    <h1 className="type-h1">Items</h1>
    <p className="type-lead">Manage your items.</p>
  </div>

  {/* Optional search/filter bar */}
  <input className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3
                     text-sm shadow-sm placeholder:text-slate-400
                     focus:border-slate-300 focus:outline-none" />

  {/* List card */}
  <div className="rounded-2xl border border-slate-200 bg-white/85 shadow-sm
                  divide-y divide-dashed divide-slate-200">
    {items.map(item => (
      <div key={item.id} className="px-5 py-4 cursor-pointer hover:bg-slate-50/50">
        <p className="type-item-title text-base">{item.title}</p>
        <p className="text-xs text-slate-600">{item.subtitle}</p>
        <p className="text-[11px] text-slate-500">{item.meta}</p>
      </div>
    ))}
  </div>
</main>
```

### 4.2 Detail page

```tsx
<main className="space-y-6">
  {/* Back link */}
  <a href="/items" className="text-sm text-slate-500 hover:text-slate-700">← Back to items</a>

  {/* Header card */}
  <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
    <p className="type-meta">Detail</p>
    <h1 className="type-h1 mt-1">{item.title}</h1>
    <p className="type-lead mt-1">{item.subtitle}</p>
  </div>

  {/* Info cards */}
  <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
    <h2 className="text-lg font-semibold mb-3">Section Title</h2>
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium uppercase text-slate-500">Label</p>
        <p className="text-sm text-slate-900">Value</p>
      </div>
    </div>
  </div>
</main>
```

### 4.3 Form page

```tsx
<main className="space-y-10">
  <div className="space-y-2">
    <p className="type-meta">Create</p>
    <h1 className="type-h1">New Item</h1>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-lg">
    <form className="space-y-4">
      <FormField label="Title" id="title" placeholder="Enter title" error={errors.title} />
      <FormField label="Description" id="desc">
        <textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2
                             text-sm shadow-sm resize-none
                             focus:border-slate-400 focus:outline-none" rows={3} />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  </div>
</main>
```

### 4.4 Settings page

```tsx
<main className="space-y-10">
  <div className="space-y-2">
    <p className="type-meta">Preferences</p>
    <h1 className="type-h1">Settings</h1>
    <p className="type-lead">Manage your account and preferences.</p>
  </div>

  {/* Multiple narrow cards */}
  <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-lg">
    <h2 className="text-lg font-semibold">Section Title</h2>
    <p className="mt-2 text-sm text-slate-600">Description text.</p>
    <Button variant="secondary" className="mt-4">Action</Button>
  </div>
</main>
```

---

## 5. What NOT to do

These patterns are explicitly excluded from this design system. AI code generators and external tools often produce them — they must be replaced with template equivalents.

| ❌ Don't | ✅ Do instead |
|---|---|
| `bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300` | No page backgrounds — the shell provides `#f7f1ea` |
| Custom navigation components (slide-up menus, tab bars, sidebars) | Use `BottomBar` component |
| `@mui/material` or `@radix-ui` imports | Use template `Button`, `Card`, `Input`, `Modal` components |
| Custom layout wrappers with their own padding/backgrounds | Use `AppShell` — pages only render `<main>` |
| Coloured status badges with custom backgrounds | Use `rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm` |
| Full-width coloured headers | Use `.type-meta` + `.type-h1` header pattern |
| Custom icon libraries (Material Icons, Font Awesome) | Use `lucide-react` |
| Dark mode / dark backgrounds | Not supported — always light cream background |
| Inline background colours on cards (`bg-purple-50`, `bg-blue-100`) | Always `bg-white/85` |
| Fixed/absolute positioned elements (except BottomBar) | Content flows normally inside `.app-content` |

---

## 6. Figma Make integration notes

When using this document with Figma Make or similar AI design-to-code tools:

1. **Set the canvas background** to `#f7f1ea` — this is the page background, not white.
2. **Don't design a navigation bar** — the template provides `BottomBar` automatically. Leave ~70px clear at the bottom of each screen for it.
3. **Use white cards** (`#ffffff` at 85% opacity) with 16px corner radius, 1px `#e2e8f0` border, and subtle shadow for all content sections.
4. **Use the font** Geist Sans for all text.
5. **Use the type scale** from Section 1.2 — don't invent new heading sizes.
6. **Don't design custom buttons** — the template has `Button` with 4 variants. Use the specs from Section 3.2.
7. **Don't add background gradients** to any element. The only gradient in the system is the decorative blob, which is handled by the shell.
8. **Icon library** is Lucide. Use icons from https://lucide.dev at the sizes specified in Section 1.6.
9. **Content area** has 24px horizontal padding and 40px top padding. Max width 1152px centred.
10. **Bottom padding** must be at least 112px (`pb-28`) to clear the fixed bottom nav.
