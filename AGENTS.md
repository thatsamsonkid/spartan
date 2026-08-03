# AGENTS.md

Repo-wide guidance for AI agents. For contributor conventions (CI checks to run before pushing,
Conventional Commit rules, PR template) see `CLAUDE.md` and `CONTRIBUTING.md` — those still apply.

## Cursor Cloud specific instructions

This is the **spartan** Nx monorepo (pnpm). It ships two products:

- **spartan/ui** — Angular UI primitives: headless `libs/brain` (`@spartan-ng/brain`) + styled
  `libs/helm`, plus `libs/cli` (`@spartan-ng/cli`) and `libs/mcp` (`@spartan-ng/mcp`).
- **spartan/stack** — the docs/demo site in `apps/app`, an AnalogJs (Angular + Vite/Nitro) app
  wired to tRPC + Drizzle ORM + Postgres.

### Node / package manager (non-obvious)

- The repo requires Node `>=22.15` with `engineStrict: true`. The VM's `/exec-daemon/node`
  (v22.14.0) is **too old and sits first on `PATH`**, so anything that ignores `~/.bashrc` gets a
  version that fails `pnpm install`. `~/.bashrc` has been updated to prepend nvm's Node `v22.22.2`
  (which satisfies the range); run commands from a normal login shell so `node`/`pnpm` resolve
  correctly. `pnpm` is provided by nvm and is auto-pinned to `10.30.3` via the `packageManager`
  field.

### Standard commands

Dependency install and the lint/test/build commands are already documented in `CLAUDE.md`
(`pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm nx format:write`). App scripts live in
`package.json`.

- Dev server (docs/demo app): `pnpm run dev` → http://localhost:4200
- Storybook (primary surface for developing UI primitives): `pnpm run storybook` →
  http://localhost:4400 (first webpack build takes a couple of minutes)

### Non-obvious gotchas

- `brain`/`helm` unit tests run in **Vitest browser mode via Playwright Chromium**, so the
  Chromium browser must be present (`pnpm exec playwright install chromium`; the OS libraries were
  installed once during environment setup and persist in the snapshot).
- `pnpm run dev` first runs code generators (`generate-docs-and-snippets`, `generate-ui-docs`,
  `generate-hlm-component-preview`) that write into `apps/app/src/public/data/*` (gitignored), so
  the **first** serve is slower than later ones.
- The docs/demo app boots and serves all pages **without a database**. Only the tRPC `note`
  example (`apps/app/src/db.ts`, `apps/app/src/server/trpc/routers/notes.ts`, exposed at
  `/api/trpc`) needs Postgres.

### Running the full-stack (tRPC + Drizzle + Postgres) example

Postgres is not part of the repo. To exercise the `note` API end-to-end:

1. Start the local cluster: `sudo pg_ctlcluster 16 main start` (PostgreSQL 16 was installed via
   `apt` during setup and persists in the snapshot; it is **not** auto-started on boot).
2. Ensure the `note` table exists (columns match `apps/app/src/db.ts`):
   `sudo -u postgres psql -c "CREATE TABLE IF NOT EXISTS note (id serial primary key, title text not null, content text, created_at timestamptz not null default now());"`
3. Serve with the connection string set (do not commit it; `.env` is gitignored):
   `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres" pnpm run dev`
4. Verify: `curl -s -X POST http://localhost:4200/api/trpc/note.create -H 'Content-Type: application/json' -d '{"json":{"title":"Hello","content":"World"}}'`
   then `curl -s 'http://localhost:4200/api/trpc/note.list?input=%7B%7D'`.
