# PROJECT MEMORY

## Current State
- Project is cleanly structured into separated `frontend/` and `backend/` directories
- Frontend: React 19 + TypeScript + Vite SPA building with 0 errors
- Backend: Node.js + Express + MongoDB REST API with 27/27 integration tests passing
- Root: Orchestrator `package.json` with convenience scripts for both workspaces

## Completed
- [x] Separate frontend files into dedicated `frontend/` directory
- [x] Create `frontend/package.json`, `frontend/README.md`, `frontend/.env.example`
- [x] Verify frontend builds with Vite (`npm run build` in `frontend/`)
- [x] Complete backend implementation in `backend/`
- [x] Automated integration tests passing in `backend/` (27/27)
- [x] Root orchestrator `package.json` and comprehensive root `README.md`
- [x] Documentation system in `docs/`

## Important Decisions
- DEC-001: MongoDB + Mongoose for flexible schema matching frontend types
- DEC-002: JWT Bearer Token for auth
- DEC-003: Controller-Service pattern (no separate repository layer needed)
- DEC-004: mongodb-memory-server for dev environments without external MongoDB
- DEC-005: Auto-seed on empty database startup
- DEC-006: Decouple into separate frontend/ and backend/ directories within workspace

## Important Files
- `frontend/` — Client SPA (React, Vite, TypeScript, Tailwind)
- `backend/` — API Server (Express, MongoDB, JWT, Zod)
- `docs/` — System architecture and documentation
- `package.json` — Root workspace scripts
- `README.md` — Monorepo documentation
