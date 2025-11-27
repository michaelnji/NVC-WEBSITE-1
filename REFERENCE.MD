# NVC-WEBSITE Codebase Reference

## 1. Project Overview
- **Framework:** Next.js 16 (App Router, TypeScript, React 19)
- **Styling:** TailwindCSS 4, shadcn-ui, custom CSS
- **Animation:** Framer Motion (primary), GSAP (optional/legacy)
- **UI Primitives:** Radix UI, shadcn-ui
- **State:** React hooks, context (e.g., language)
- **Data:** Supabase (API routes), fallback dummy data (for dev)

## 2. Directory Structure
- `/app` — App Router pages, layouts, API routes
- `/components` — UI components (atomic, sections, admin, ui, etc.)
- `/contexts` — React context providers (e.g., language, theme)
- `/hooks` — Custom React hooks
- `/lib` — Types, utils, dummy data, supabase helpers
- `/public` — Static assets (images, fonts, etc.)
- `/styles` — Global and custom CSS

## 3. Component Organization
- **Sections:** Feature-level UI (e.g., `projects-list-section.tsx`, `flipcountdown-section.tsx`)
- **UI:** Reusable atomic components (e.g., Button, Card, Accordion)
- **Admin:** Dashboard/admin-only components
- **Special:** Animation helpers (e.g., Reveal, AnimatedBackground)
- **Separation:** Large sections split into multiple files for maintainability

## 4. Animation & Transitions
- **Framer Motion:**
  - Used for all major entrance, hover, and layout animations
  - Patterns: `motion.div`, `AnimatePresence`, `whileInView`, `whileHover`, `transition` props
  - Staggered entrances: `delay: idx * 0.08` or similar
  - Spring transitions for tabs, overlays, etc.
  - AnimatePresence for grid/list transitions
- **GSAP:**
  - Not widely used, but available for advanced/legacy cases
- **Parallax/Mouse:**
  - Used in hero/flipcountdown sections for floating images
  - Mouse position tracked, used to set `transform: translate3d(...)`

## 5. Styling
- **TailwindCSS:**
  - Utility-first, v4 syntax (e.g., `aspect-16/10`, `bg-linear-to-t`)
  - Responsive: `md:`, `lg:`, `xl:`
  - Custom colors: `brand`, `brand-ink`, `brand-ink-strong`, etc.
- **shadcn-ui:**
  - Used for some UI primitives (Accordion, Dialog, etc.)
- **Custom CSS:**
  - For global styles, backgrounds, and overrides

## 6. Data & API
- **API Routes:**
  - `/api/projects`, `/api/services`, etc. (REST, Supabase backend)
  - Fallback to dummy data in dev (now removed for prod)
- **Types:**
  - All data models in `lib/types.ts`
- **Fetching:**
  - `fetch("/api/projects")` in client components
  - Data mapped to UI, categories generated dynamically

## 7. Patterns & Best Practices
- **Client Components:**
  - `