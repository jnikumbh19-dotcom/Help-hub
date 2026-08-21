[2026-08-21]

Added:
- Separated frontend application into dedicated `frontend/` directory with independent `package.json`, `tsconfig.json`, `vite.config.ts`, and build scripts.
- Root `package.json` with npm workspace scripts (`npm run dev:frontend`, `npm run dev:backend`, `npm run build:frontend`, `npm run test:backend`, `npm run install:all`).
- Root `README.md` and `frontend/README.md` documenting the separated monorepo architecture.
- Full backend architecture in `backend/` with Express, MongoDB, JWT auth, RBAC authorization, and 27 integration tests.
- Complete `/docs` AI context system and documentation.
