# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start Vite dev server (hot reload)
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

There is no test suite, linter, or TypeScript config — this is a plain JSX + Vite project.

## Architecture

A single-page portfolio for 3D artist/writer "Kefir Fatwa", styled as a Windows 95 desktop. The home page is an interactive 3D "museum" built with React Three Fiber; clicking a floating 3D model routes to that project's detail page.

**Data is the single source of truth.** `src/data/projects.js` drives everything:
- `projects[]` — each entry's `id`, `model` path, `scale`, `images`, and text fields populate both the 3D scene objects and the detail pages. `id` is a **number** and is matched in `ProjectDetail` via `Number.parseInt` — keep ids numeric.
- `museumSections[]` — the text list rendered in the side panel. It is separate from `projects` and must be kept in sync manually.

Adding or changing a project means editing this file; the scene, navigation, and routes update automatically.

**Rendering flow:**
- `src/main.jsx` → `src/app.jsx` (note lowercase filename). `app.jsx` holds the `BrowserRouter`, the persistent top nav, and the Win95 contact modal (the form is non-functional — `onSubmit` is prevented).
- Routes: `/` → `Home`, `/project/:id` → `ProjectDetail`. Both pages are `lazy()`-loaded and receive `projects` as a prop.
- `Home.jsx` renders the `<Canvas>`. `getMuseumPosition(index, total)` arranges objects along an arc (trigonometric layout) — changing the number of projects automatically respaces them.
- `ProjectObject.jsx` is one floating model: `useFrame` drives the bob/rotation animation, hover scales it and shows a `<Text>` label, click calls `navigate`. Models load via `useGLTF` and are `scene.clone()`d so the same `.glb` can be reused across objects.

**Static assets** live in `public/` and are referenced by absolute path (e.g. `/models/v4/...`, `/images/...`, `/textures/...hdr`). Vite serves `public/` at the site root.
- `public/models/` has `v1`–`v4` subfolders (model iterations). `projects.js` currently points at `v4`; the others are kept as history.
- The HDR environment map (`qwantani_moon_noon_puresky_4k.hdr`) is loaded by drei's `<Environment>` for lighting and background.

**Build:** `vite.config.js` splits vendor code into `react` and `three` manual chunks (Three.js is large — keep this split when adjusting build config).

## Conventions

- All UI styling is in `src/index.css`. The Win95 look comes from shared classes — reuse `win95-border` and `btn-95` rather than re-styling.
- Some source text and comments are in Spanish; this is intentional and fine to continue.
