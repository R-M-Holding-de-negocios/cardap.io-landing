# Landing Pixel Theme Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add an accessible light/dark toggle to the landing navbar that sweeps a rectangular pixel line down the viewport and changes each element's theme as the line reaches it.

**Architecture:** A landing-scoped client provider owns the selected theme, sweep progress, and overlay; its context gives the navbar toggle a shared action without coupling it to the mobile menu. Theme colors transition on each visible element with a delay based on its vertical position, while a fixed pixel band travels through the viewport. The global theme and other product pages remain unchanged.

**Tech Stack:** Next.js App Router, React context/hooks, CSS custom properties and keyframes, existing lucide-react icons.

**Spec:** `docs/superpowers/specs/landing-pixel-theme-sweep.md`

## Global Constraints

- Desktop: button discreetly in the top bar.
- Mobile: same button alongside the menu control.
- The landing starts in the light theme regardless of the global theme used by other areas.
- Click toggles light/dark; the sweep is rectangular, travels from the top to the end of the visible viewport quickly, and does not use a circular mask.
- Visible elements change theme colors as the line reaches them; the reverse transition works too.
- Respect `prefers-reduced-motion` by changing theme without the animated sweep.
- Reuse the existing CSS color system and PixelCard canvas/sweep as visual reference without modifying the plan PixelCard.
- Do not alter product pages outside the landing or persist the selection between visits.
- Keep keyboard operation, an accessible label, and visible focus.

## Review Focus

- Global theme stays unchanged when the landing toggle is used.
- Mobile toggle remains separate from and next to the StaggeredMenu button.
- Color changes follow the pixel band in both directions, including text, surfaces, borders, links, and controls.
- Reduced-motion preference skips the sweep while still toggling the theme.
- Repeated activation or resize during a sweep leaves no stuck overlay or stale transition delays.

## Files

- Create `src/components/public/LandingThemeProvider.tsx` for scoped theme state, toggle context, visible-element transition delays, sweep lifecycle, and reduced-motion handling.
- Modify `src/app/page.tsx` to wrap the landing content with the provider.
- Modify `src/components/public/Navbar.tsx` to render the desktop and mobile theme controls, placing the latter adjacent to the menu.
- Modify `src/components/public/react-bits/StaggeredMenu.jsx` to accept a header action slot for the adjacent mobile toggle.
- Modify `src/app/globals.css` for landing-scoped light/dark tokens, sweep band appearance, and per-element color transitions.

## Tasks

### Task 1: Landing-scoped theme and sweep provider

**Interfaces:** Exports `LandingThemeProvider({ children })` and a `LandingThemeToggle` component consuming its context. Toggle uses `aria-pressed`, a changing accessible label, and sun/moon icon. Provider sets `data-landing-theme` only on the landing root; it never writes `html[data-theme]`.

- [x] Add provider context, light initial state, reversible sweep state, reduced-motion fallback, and cleanup for timers/animation frame and temporary transition-delay properties.
- [x] Compute per-element transition delays from visible element positions and the active sweep direction; clear delays at completion or interruption.
- [x] Add a fixed, rectangular, square-pixel sweep band and progress driven by the provider; avoid circular masks and prevent pointer interception.
- [x] Wrap the landing page root with the provider.
- [x] Run `npm.cmd run typecheck` and `git diff --check`.

### Task 2: Navbar controls and scoped theme styles

**Interfaces:** Navbar uses `LandingThemeToggle` from Task 1; desktop button is in the right-side action group and mobile button is adjacent to the StaggeredMenu trigger.

- [x] Add independent desktop and mobile toggle placements with keyboard focus, accessible labels, and a minimum 44px mobile target; expose the mobile placement through StaggeredMenu's header action slot.
- [x] Define landing-only light and dark theme tokens and the square pixel band styles without changing the global theme rules or PixelCard styles.
- [x] Run `npm.cmd run typecheck` and `git diff --check`.

Verification note: repeated toggles and reduced-motion preference were reviewed in the provider lifecycle and CSS fallback; no automated tests were added or run.

## Execution

Implement natively in this session. The two tasks share one provider interface and the change is limited to a single landing page, so keeping the work together avoids coordination overhead.
