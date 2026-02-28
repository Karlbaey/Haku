# Repository Guidelines

## Project Structure & Module Organization

- Core site code lives in `src/`.
- Pages and routes are in `src/pages/` (for example `src/pages/articles/[...slug].astro`).
- Reusable UI is grouped under `src/components/` (`meta/`, `buttons/`, `styles/`, `scripts/`).
- Shared layouts are in `src/layouts/`, utilities in `src/utils/`, and global types in `src/types/`.
- Content collections are in `src/content/` (`articles/`, `main_page/`), with schema in `src/content.config.ts`.
- Static files are in `public/`; CLI entrypoint is `bin/haku.mjs`; automation helpers are in `scripts/`.

## Build, Test, and Development Commands

- `pnpm install` — install dependencies.
- `pnpm dev` — start Astro dev server for local development.
- `pnpm build` — build production output and run Pagefind indexing (`dist/`).
- `pnpm preview` — serve the built site locally for final verification.
- `pnpm astro -- check` — run Astro project checks when validating content/routes.

## Coding Style & Naming Conventions

- Use TypeScript + Astro ESM modules; prefer explicit imports and small focused utilities.
- Follow existing formatting in touched files (current codebase primarily uses 2-space indentation).
- Use `PascalCase` for component files (e.g., `LatestArticles.astro`), `camelCase` for variables/functions, and kebab-case for script filenames when already established.
- Keep route/content filenames consistent with current collection conventions.

## Testing Guidelines

- No dedicated automated test suite is configured yet.
- For changes, run at minimum:
  - `pnpm build`
  - `pnpm preview` and manually verify updated pages/components.
- If adding tests, prefer Playwright (already in dev dependencies) and place specs in a clear `tests/` directory with `*.spec.ts` naming.

## Commit & Pull Request Guidelines

- Follow Conventional Commit style seen in history: `feat:`, `fix:`, `chore:`, optional scope (e.g., `chore(deps): ...`).
- Keep commits focused and descriptive; reference issues when applicable (`(#123)`).
- PRs should include:
  - linked issue (`Closes #...` when relevant),
  - change summary and impact,
  - screenshots/GIFs for UI changes,
  - confirmation that `pnpm build` passes.

## Security & Configuration Tips

- Do not commit secrets or environment-specific credentials.
- Keep site-level settings centralized in `src/config.ts` and avoid hardcoding duplicate values across components.
- Ever use UTF-8 text encoding.
- Do not delete any code comment.
