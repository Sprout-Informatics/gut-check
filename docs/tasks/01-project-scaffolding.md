# Task 01: Project Scaffolding

**Depends on**: Nothing (first task)
**Produces**: A working Vite + React + TypeScript project with directory structure, Tailwind, and Vitest configured. `npm run dev` starts, `npm run build` succeeds, `npx vitest` runs (no tests yet).

---

## What to do

1. Initialize a Vite project with the React + TypeScript template in the repo root (`/home/user/gut-check`). The repo already has a `README.md` and `docs/` folder — preserve those.

2. Install dependencies:
   - `recharts` (charting)
   - `tailwindcss @tailwindcss/vite` (styling)

3. Install dev dependencies:
   - `vitest` (testing)

4. Configure Tailwind in `vite.config.ts` using the `@tailwindcss/vite` plugin.

5. Add `@import "tailwindcss"` to the main CSS file.

6. Create the directory structure (empty directories are fine — later tasks fill them):
   ```
   src/
   ├── simulation/
   ├── state/
   └── components/
   tests/
   └── simulation/
   ```

7. Add a `"test"` script to `package.json`: `"test": "vitest"`

8. Clean up the default Vite boilerplate:
   - Replace the default `App.tsx` with a minimal placeholder: just render `<h1>Gut Check</h1>` with a subtitle "The Microbiome Game"
   - Remove default Vite counter CSS and assets that won't be used

9. Verify:
   - `npm run dev` starts without errors
   - `npm run build` succeeds
   - `npx vitest run` exits cleanly (no tests to run yet, but no config errors)

## What NOT to do

- Don't write any simulation logic, types, or components — those are separate tasks
- Don't add any state management yet
- Don't over-customize the Tailwind config
