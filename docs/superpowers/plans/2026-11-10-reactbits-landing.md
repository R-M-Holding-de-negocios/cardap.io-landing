# React Bits Landing Integration Implementation Plan

> **For agentic workers:** Use the `superpowers:executing-plans` skill to implement the approved plan task by task.

**Goal:** Integrate the seven approved React Bits components into the Cardapio.io landing page, following the hand-drawn editorial direction while preserving existing copy and interactions.

**Architecture:** Preserve the supplied React components as JSX under `src/components/public/react-bits/`, retaining focused CSS files. The project already enables `allowJs`, and this keeps upstream animation code readable without a broad mechanical TypeScript rewrite. Add GSAP and Motion, reuse the existing Lucide icon package for the toast close button, and wire each component into the existing page, navbar, plan card, or demo.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, GSAP, Motion, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-10-reactbits-landing-design.md`

## Global Constraints

- Keep the cream, orange, and charcoal palette; illustration uses medium-detail hand-drawn food/menu art.
- Preserve approved Portuguese copy, plan prices and features, link destinations, forms, product preview, and simulator flow.
- Use local images only; do not add external image assets.
- Respect `prefers-reduced-motion`; automatic and scroll-driven effects must become static or use minimal transitions.
- The mobile StaggeredMenu keeps current destinations; desktop navigation remains present.
- The SwipeToast must identify its result as a completed simulation, never as a real order.
- Preserve existing uncommitted changes in `page.tsx`, `Navbar.tsx`, `LiveDemoSimulator.tsx`, and `package-lock.json`; do not reset or commit them.
- Do not add or run automated tests unless the user asks.

## Review Focus

- Desktop and mobile navigation retain all current anchors and product URLs.
- The rotating text does not change the approved headline or supporting paragraph and does not continuously announce updates to screen readers.
- ScrollExpand does not trap scrolling or break layout on narrow screens.
- Reduced-motion settings suppress automatic loops, scroll reveals, and staggered menu transitions.
- Plans, toast, and demo remain readable, accessible, and clearly labeled.

---

### Task 1: Add animation dependencies and React Bits components

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/public/react-bits/PixelCard.tsx` and `PixelCard.css`
- Create: `src/components/public/react-bits/SwipeToast.tsx` and `SwipeToast.css`
- Create: `src/components/public/react-bits/ScrollExpand.tsx` and `ScrollExpand.css`
- Create: `src/components/public/react-bits/TextLoop.tsx` and `TextLoop.css`
- Create: `src/components/public/react-bits/StaggeredMenu.tsx` and `StaggeredMenu.css`
- Create: `src/components/public/react-bits/ScrollReveal.tsx` and `ScrollReveal.css`
- Create: `src/components/public/react-bits/RotatingText.tsx` and `RotatingText.css`

- [x] Add only `gsap` and `motion`; reuse Lucide for the close icon instead of adding Hugeicons.
- [x] Preserve supplied sources as JSX and retain their prefixed CSS classes.
- [x] Scope browser animation setup to effects and clean up GSAP timelines, observers, animation frames, and event listeners on unmount.
- [x] Make reduced-motion settings stop TextLoop/RotatingText auto loops, bypass ScrollExpand and ScrollReveal transitions, and skip StaggeredMenu staggering. PixelCard and SwipeToast retain their reduced-motion handling.

### Task 2: Integrate responsive navigation

**Files:**
- Modify: `src/components/public/Navbar.tsx`

- [x] Keep the existing desktop links and CTAs.
- [x] Replace only the current mobile toggle/panel with StaggeredMenu.
- [x] Use the existing brand image and warm underlay colors; preserve destinations for section anchors, partners, login, and registration.
- [x] Close the menu after navigation; keep accessible labels and keyboard operation.

### Task 3: Add editorial motion to the main page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [x] Replace only the static hero eyebrow with RotatingText phrases: “Cardápio digital”, “Pedidos na mesa”, and “Atendimento do salão”. Keep the hero headline and paragraph unchanged; hide the animated visual from live announcements and expose one stable accessible label.
- [x] Add ScrollExpand in the opening area using local `/images/landing/menu-aberto.png`, with the existing headline/CTA remaining readable and the actual product preview staying crisp.
- [x] Change the root horizontal clipping from `overflow-hidden` to `overflow-x-clip` for the sticky window-scroll stage; preserve the existing visual crop.
- [x] Add one restrained TextLoop band with product categories between the opening and feature sections; expose a stable accessible label and keep it static under reduced motion.
- [x] Apply ScrollReveal only to selected existing section headings; retain their exact text and heading level.
- [x] Set responsive sizing and image framing; use window scrolling and responsive widths without nested scroll containers.

### Task 4: Add focused feedback to plans and demo

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/public/LiveDemoSimulator.tsx`

- [x] Wrap only the Pro plan card in a subtle warm PixelCard effect with readable text and visible keyboard focus.
- [x] Show an accessible SwipeToast when the four-step simulator reaches its completed state: title “Demonstração concluída”; description “Você viu o fluxo de atendimento.”
- [x] Keep the toast dismissible by swipe, close button, and Escape; do not introduce real-order behavior.
- [x] Preserve all existing plan prices, features, and CTA destinations.

### Task 5: Review the changed files

**Files:**
- Review: all files listed above

- [x] Review the diff for accidental changes to copy, plans, routes, or existing interactions.
- [x] Confirm new dependencies are limited to GSAP and Motion.
- [ ] Do not run automated tests or build commands unless the user requests verification.
