# AGENTS.md

## Cursor Cloud specific instructions

This is a React + Vite single-page application (portfolio/landing page) using Tailwind CSS 4 + DaisyUI 5 and React Router DOM.

### Key commands

See `package.json` scripts:
- **Dev server:** `npm run dev` (Vite, defaults to `http://localhost:5173`)
- **Lint:** `npm run lint` (ESLint 9)
- **Build:** `npm run build` (Vite production build to `dist/`)
- **Deploy:** `npm run deploy` (builds then publishes to GitHub Pages via `gh-pages`)

### Notes

- No backend services or databases are required. This is a purely front-end project.
- The `LogoSamples` page and its Flask/FastAPI backend integration are commented out in `src/App.jsx`; no backend code exists in this repo.
- There are no automated test suites (no test framework configured). Validation is done via lint and build.
- The dev server supports hot module replacement; file changes are reflected immediately in the browser.
