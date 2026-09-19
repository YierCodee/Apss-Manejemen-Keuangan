# CLAUDE.md — Figma Design Integration Rules for serkwu

> @AGENTS.md

---

## 1. Design System Structure

### 1.1 Token Definitions

**Where tokens are defined:**
- **Primary location:** `app/globals.css` — All design tokens are defined as CSS custom properties (variables) inside `:root` and `.dark` blocks
- **Tailwind v4 theme:** Configured via `@theme inline` block in `app/globals.css` (no `tailwind.config.js` exists)

**Token format/structure:**
Tokens use **OKLCH color space** for all color values, organized by semantic category:

```css
/* Color tokens (oklch format) */
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
--secondary: oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);
--muted: oklch(0.97 0 0);
--muted-foreground: oklch(0.556 0 0);
--accent: oklch(0.97 0 0);
--accent-foreground: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);

/* Chart color tokens */
--chart-1: oklch(0.87 0 0);
--chart-2: oklch(0.556 0 0);
--chart-3: oklch(0.439 0 0);
--chart-4: oklch(0.371 0 0);
--chart-5: oklch(0.269 0 0);

/* Radius tokens (semantic spacing) */
--radius: 0.625rem;
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
--radius-2xl: calc(var(--radius) * 1.8);
--radius-3xl: calc(var(--radius) * 2.2);
--radius-4xl: calc(var(--radius) * 2.6);

/* Font tokens */
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
--font-heading: var(--font-sans);

/* Sidebar tokens */
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: oklch(0.145 0 0);
--sidebar-primary: oklch(0.205 0 0);
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.97 0 0);
--sidebar-accent-foreground: oklch(0.205 0 0);
--sidebar-border: oklch(0.922 0 0);
--sidebar-ring: oklch(0.708 0 0);
```

**Dark mode tokens** are defined in the `.dark` class block with inverted OKLCH values.

**Token transformation system:**
- Tailwind v4's `@theme inline` block maps CSS variables to Tailwind utility names (e.g., `--color-background` → `bg-background`)
- All CSS variables are referenced via `var()` function
- No custom PostCSS or JS-based token transformation pipeline exists

### 1.2 Component Library

**Where UI components are defined:**
- **Components directory:** `@/components` (alias configured in `components.json`)
- **UI component directory:** `@/components/ui` (shadcn/ui components)
- **Note:** The `components/` directory does **not yet exist** in the project — it needs to be created via `npx shadcn@latest init` or `npx shadcn@latest add <component>`

**Component architecture:**
- **shadcn/ui** (v4.21.0) — Headless UI component library built on Radix UI primitives
- **Base style:** `base-nova` (configured in `components.json`)
- **RSC support:** Enabled (`"rsc": true`)
- **TSX support:** Enabled (`"tsx": true`)
- **Component registration:** Uses shadcn CLI (`npx shadcn@latest add <component>`)

**Component configuration** (`components.json`):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Component documentation/storybooks:** None configured (no Storybook, Chromatic, or similar)

### 1.3 Frameworks & Libraries

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.3.5 |
| **UI Framework** | React | 19.2.8 |
| **Language** | TypeScript | 5 (strict mode) |
| **Styling** | Tailwind CSS | v4 |
| **CSS Post-Processor** | `@tailwindcss/postcss` | v4 |
| **UI Components** | shadcn/ui | 4.21.0 |
| **Icons** | lucide-react | ^1.47.0 |
| **Animations** | framer-motion | ^13.4.0 |
| **Charts** | recharts | ^3.10.1 |
| **Carousel** | embla-carousel-react | ^8.6.0 |
| **Class Utils** | class-variance-authority (cva) | ^0.7.1 |
| **Class Merging** | cn | ^0.3.0 |
| **CSS Animations** | tw-animate-css | ^1.4.0 |
| **Build System** | Next.js (built-in webpack/turbopack) | — |
| **Linting** | ESLint v9 (flat config) | ^9 |
| **Fonts** | Geist (next/font/google) | — |

**Key configuration files:**
- `next.config.ts` — Currently empty (default config)
- `tsconfig.json` — Strict TypeScript with `@/*` path alias
- `eslint.config.mjs` — ESLint v9 flat config (extends `nextVitals` + `nextTs`)
- `postcss.config.mjs` — Only `@tailwindcss/postcss` plugin
- `app/globals.css` — Tailwind v4 `@import "tailwindcss"` (no tailwind.config.js)

### 1.4 Asset Management

**Static assets location:** `public/` directory
- Currently contains SVGs: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`
- Images referenced via `/filename.svg` path (e.g., `/next.svg`)

**Image handling:**
- Uses Next.js `<Image>` component (`import Image from "next/image"`)
- Images in `public/` are served at root path
- No CDN configuration (no `.env` files for CDN URLs)
- Images use `width` and `height` props for intrinsic sizing
- `priority` prop for above-the-fold images

**Asset optimization:**
- `next/font/google` auto-optimizes font loading
- Next.js Image component provides automatic optimization (lazy loading, blur placeholder)
- No custom image optimization pipeline

**No CDN configuration** — assets served from `/public/` at root URL

### 1.5 Icon System

**Icon library:** **lucide-react** (`lucide` configured in `components.json`)

**Import pattern:**
```tsx
import { <IconName> } from "lucide-react";
```

**Icon naming convention:** kebab-case from the lucide icon set (e.g., `ArrowRight`, `ChevronDown`, `Menu`, `Settings`, `Home`, `LayoutDashboard`)

**Icon usage in components:**
```tsx
// Standard icon usage
<Settings className="h-4 w-4" />

// With specific sizing
<ArrowRight className="h-[14px] w-4" />

// Icons in navigation items (from Figma mapping)
<Home className="h-5 w-5" />
<Wallet className="h-5 w-5" />
<FileText className="h-5 w-5" />
<BarChart3 className="h-5 w-5" />
```

**SVG icons in Figma:** Icons in Figma designs are mapped to lucide-react icons (e.g., `fa7-solid:warehouse` → `FaWarehouse`, `f7:money-dollar-circle-fill` → `MoneyDollarCircle`)

**Note:** `@/components` and `@/components/ui` directories do not yet exist — shadcn components need to be installed via CLI

### 1.6 Styling Approach

**CSS methodology:** **Tailwind CSS v4** with CSS custom properties
- No CSS Modules
- No Styled Components
- No CSS-in-JS libraries (except `tw-animate-css` for animation utilities)
- Utility-first approach with `@apply` directive for base styles

**Global styles** (`app/globals.css`):
```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { @apply font-sans; }
}
```

**Custom CSS variants:**
```css
@custom-variant dark (&:is(.dark *));
```

**Responsive design:**
- Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Mobile-first approach
- No custom media query breakpoints defined

**Class merging utility:** `cn` function from `cn` package (re-exports `class-variance-authority` and `clsx`)
```tsx
import { cn } from "@/lib/utils";
// Usage
className={cn("flex items-center", isActive && "text-primary")}
```

### 1.7 Project Structure

```
serkwu/
├── app/                    # App Router pages & layouts
│   ├── globals.css        # Global styles + Tailwind v4 theme tokens
│   ├── layout.tsx         # Root layout (Geist fonts, html/body)
│   └── page.tsx           # Home page (default)
├── public/                # Static assets (SVGs)
├── lib/
│   └── utils.ts           # Utility exports (cn)
├── components.json         # shadcn/ui configuration
├── next.config.ts         # Next.js config (empty)
├── tsconfig.json          # TypeScript config with @/* alias
├── eslint.config.mjs      # ESLint v9 flat config
├── postcss.config.mjs     # PostCSS config (tailwindcss/postcss)
├── .gitignore             # Git ignore rules
└── AGENTS.md              # Next.js agent rules (auto-generated)
```

**Feature organization patterns:**
- **App Router convention:** `app/` directory maps to routes (e.g., `app/dashboard/page.tsx` → `/dashboard`)
- **Layout nesting:** Layouts can nest (e.g., `app/dashboard/layout.tsx` wraps `app/dashboard/*`)
- **Route groups:** Can use `(group)` folder conventions for organizational routing
- **No existing features directory** — project is currently a default Next.js template

---

## 2. Figma Design Integration Rules

### 2.1 Mapping Figma to Code

**Figma file:** `8dvxOo5ltqJDPw2mVNKC1X` (Serkwu-Umpo)

**Page-to-route mapping:**

| Figma Frame | Node ID | Suggested Route | Components Needed |
|-------------|---------|-----------------|-------------------|
| **Landing Page** | `74:1029` | `/` (home) | HeroSection, PartnersAndEcosystem, ValuePropositionFeatures, ComparisonMatrix, FAQSection, DeepDiveVisualSection |
| **Dashboard Keuangan** | `1:391` | `/dashboard` | SidebarNav, TopBar, AccountCard, TransactionRow, AnalyticsDonut, SpendingSummary |
| **Halaman Manajemen Keuangan** | `1:800` | `/financial-management` | MetricsCard, TransactionTable, FilterTabs, ActionBar |

**Figma design dimensions:** All pages use `1280px` width canvas (desktop-first)

### 2.2 Color Mapping (Figma → CSS Variables)

When extracting colors from Figma:
1. **Map to OKLCH tokens** in `app/globals.css` `:root` or `.dark` block
2. **Use semantic naming** (e.g., `--primary`, `--accent`, `--muted`)
3. **Reference via Tailwind utilities** (e.g., `bg-primary`, `text-accent-foreground`)
4. **For chart colors**, use `--chart-1` through `--chart-5`

### 2.3 Typography Mapping

| Figma Typography | CSS/Tailwind Class | Font Token |
|-----------------|-------------------|------------|
| Heading 1 (Landing) | `text-3xl font-semibold tracking-tight` | `--font-sans` |
| Heading 2 (Section) | `text-xl font-semibold` | `--font-sans` |
| Heading 3 (Card) | `text-lg font-medium` | `--font-sans` |
| Body text | `text-base leading-8` | `--font-sans` |
| Caption/Label | `text-sm` | `--font-sans` |
| Mono/data | `font-mono` | `--font-mono` |

**Font:** Geist (loaded via `next/font/google` in `app/layout.tsx`)

### 2.4 Component Development Workflow

1. **Install shadcn components:** `npx shadcn@latest add <component-name>`
2. **Create feature components** in `@/components/<feature>/`
3. **Use `cn()` utility** for conditional class merging
4. **Use `lucide-react` icons** for all icon needs
5. **Use `framer-motion`** for animations (already installed)
6. **Use `recharts`** for data visualization charts
7. **Use `embla-carousel-react`** for carousels/sliders

### 2.5 Figma Node-to-Code Patterns

Based on Figma metadata, common structural patterns:

```tsx
// Layout pattern (from Dashboard Keuangan)
<aside className="w-72 bg-background border-r">Sidebar</aside>
<main className="flex-1">Content area</main>

// Card pattern (from all pages)
<div className="rounded-xl border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Heading</h3>
  <p className="text-muted-foreground">Description</p>
</div>

// Button pattern
<button className="rounded-full bg-primary px-5 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
  Label
</button>
```

---

## 3. Integration Checklist

- [ ] Create `components/` and `components/ui/` directories
- [ ] Initialize shadcn: `npx shadcn@latest init`
- [ ] Install base components: `npx shadcn@latest add button card input label badge tabs`
- [ ] Create route files: `app/dashboard/page.tsx`, `app/financial-management/page.tsx`
- [ ] Create layout files: `app/dashboard/layout.tsx` (with sidebar)
- [ ] Add icons from lucide-react matching Figma nodes
- [ ] Map Figma colors to CSS variables in `app/globals.css`
- [ ] Add `framer-motion` animations for page transitions
- [ ] Add `recharts` for analytics/dashboard charts
- [ ] Add `embla-carousel-react` for any slider/carousel sections
- [ ] Create `@/hooks/` directory for custom hooks (referenced in `components.json`)
- [ ] Add `@/components/ui/` components via shadcn CLI

---

## 4. Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Add shadcn components
npx shadcn@latest add button card input label

# Add specific icons
npm install lucide-react

# Add animations
npm install framer-motion

# Add charts
npm install recharts

# Linting
npm run lint         # ESLint v9 flat config

# Build
npm run build        # Production build
```

---

## 5. Gotchas & Warnings

1. **No `tailwind.config.js`** — Tailwind v4 uses `@theme inline` in `globals.css` only
2. **No `components/` directory yet** — Must be created via `npx shadcn@latest init`
3. **No `hooks/` directory yet** — Referenced in `components.json` aliases but doesn't exist
4. **No test framework** — No Jest/Vitest configured
5. **ESLint v9 flat config** — Not `.eslintrc` format
6. **`next-env.d.ts` is auto-generated** — Never manually edit
7. **`AGENTS.md` is auto-generated** — Will be overwritten by `next dev`
8. **`@/*` path alias** maps to `./` — Use `@/components`, `@/lib/utils`, etc.
9. **CSS Variables for all theming** — No plain color values in components
10. **OKLCH color format** — All tokens use OKLCH, not HEX or RGB
