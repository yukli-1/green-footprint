<!-- Copilot instructions for contributors and coding agents -->
# Copilot / AI coding agent guide — Green Footprint

Purpose
- Short, actionable guidance to help AI agents be productive in this Vue 3 + Vite SPA.

Big picture
- This is a client-side single-page application (Vue 3) built with Vite. Entry: `src/main.js` -> `App.vue`.
- Routing is simple: routes live in `src/router/index.js` (Home, ActionRecord, FootprintData, CommunityChallenge).
- Global reactive state uses a plain `reactive` object at `src/store/index.js` (not Vuex/Pinia). Example: `addAction()` assigns `id = Date.now()` and `timestamp = new Date().toISOString()` and updates `user.totalPoints`.
- Static assets are served from `public/images/...` and referenced directly (e.g. `/images/...`). Component CSS lives under `src/assets/`.

How to run / build
- Local dev: `npm run dev` (Vite). The project uses `vite` and `@vitejs/plugin-vue` (see `package.json`).
- Build: `npm run build` (Vite build). Preview build: `npm run preview`.
- Dev tooling: `vite-plugin-vue-devtools` is enabled in devDependencies.

Project conventions and patterns (concrete)
- Components: Single File Components using `<script setup>` and Composition API. Inspect `src/components/TheWelcome.vue` and `src/components/WelcomeItem.vue` for examples.
- Router: Add views to `src/views/` and register them in `src/router/index.js`.
- Store: `src/store/index.js` exports a reactive object named `store`. Mutations are plain methods (e.g., `addPlant()`, `unlockBadge()`); update logic (level calculation) is inside `updateLevel()`.
- Assets & images: Place SVG/PNG under `public/images/...` and reference them with absolute paths in templates or via `src/assets` for imports.
- Dev helper: The welcome component calls `fetch('/__open-in-editor?file=README.md')` — a dev-only helper used by the local server to open files in the editor. Do not rely on this endpoint in production code.

Integration points & external deps
- Vue 3 + vue-router are the primary frameworks. There is no server-side API in this repo — data is local to the client store and components.
- Tests are not configured, but the welcome UI references recommended tooling (Vitest, Cypress, Playwright) if you add tests.

Files worth scanning for context
- `src/main.js`, `App.vue` — bootstrapping and global layout.
- `src/router/index.js` — app routes (how views map to URLs).
- `src/store/index.js` — single source of truth; search here for business logic (points, badges, plants).
- `src/views/FootprintData.vue` and `src/views/Home.vue` — examples of using store and components.
- `src/components/WasteClassifier.vue`, `BadgeSystem.vue`, `ParallaxHero.vue` — domain-specific UI and interaction patterns.
- `public/images/` and `src/assets/*.css` — image and styling conventions.

What AI agents should do/avoid
- Do: Make minimal, focused changes. Follow existing patterns: use `<script setup>`, update `store` methods for shared state changes, add views via `src/views` + `src/router/index.js`.
- Avoid: Introducing a different global state solution (Pinia/Vuex) without an explicit migration plan — current codebase uses the simple reactive `store` throughout.

Examples (copy-paste friendly)
- Add a new route:
  - Add `src/views/MyView.vue` and add to `src/router/index.js`:
    {
      path: '/my-view',
      name: 'MyView',
      component: MyView
    }

- Update store safely:
  - Edit `src/store/index.js` and add a method that mutates the reactive `store` object; prefer simple helpers (e.g., `addAction()` pattern).

If something is unclear
- Ask for the target file(s) or a short description of the feature to implement. I will read the exact files referenced and update these instructions.

End of file
