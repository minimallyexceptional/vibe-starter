# Agent Guidelines

## Repository structure
- `.github/workflows/` – GitHub Actions CI configuration that runs linting, testing, building, and uploads build artifacts.
- `.husky/` – Git hooks; the pre-commit hook runs linting, formatting of staged files, and tests.
- `.ladle/` – Ladle configuration and global providers for component stories.
- `src/components/` – Shared UI primitives (shadcn-based) plus composed controls like the theme toggle.
- `src/routes/` – TanStack Router route files for the application screens.
- `src/lib/`, `src/main.tsx`, and `src/router.tsx` – Application bootstrapping, utilities, and router shell wiring.
- Project root configs: `tailwind.config.ts`, `postcss.config.js`, `eslint.config.js`, `prettier.config.cjs`, `tsconfig*.json`, and `vite.config.ts`.

## Technology stack
This starter relies on React 18 with TypeScript, TanStack Router, TanStack Query, Vite, Tailwind CSS, shadcn/ui primitives, next-themes for theming, Ladle for component docs, Vitest for tests, ESLint + Prettier for linting and formatting, Husky with lint-staged for git hooks, and GitHub Actions for CI. Keep additions compatible with this toolchain.

## Planning and scope
Before touching code, pause to plan your approach and note the impact on existing modules. Make small, surgical changes whenever possible, and prefer extending existing patterns over large refactors.

## UI expectations
All UI changes must be composed from shadcn/ui primitives or existing components that wrap them. When creating or updating front-end components, ensure corresponding Ladle stories exist or are updated so the design system stays documented.

## Reference documentation
Always review any documentation or guidance provided in context7 before making changes; align your work with that material and cite it when relevant.

## Code style and quality
Follow the established TypeScript, ESLint, and Prettier conventions. Keep components typed, accessible, and consistent with the current patterns. Run the relevant npm scripts (`lint`, `test`, `build`) when your change warrants validation to maintain CI parity.
