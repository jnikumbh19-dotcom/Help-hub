DEC-001
Decision: Use MongoDB + Mongoose
Why: Flexible schema, easy to match frontend types natively, great for geospatial queries (coordinates for providers).
Alternatives considered: PostgreSQL
Impact: Faster development speed matching the typescript interfaces.
Date: 2026-08-21

DEC-002
Decision: Use JWT Bearer Token for Auth
Why: Simple, scalable, standard for SPAs.
Alternatives considered: Session cookies
Impact: Need to implement token parsing and validation middleware.
Date: 2026-08-21

DEC-003
Decision: Controller-Service pattern (no separate repository layer)
Why: Mongoose already acts as a data access layer. A separate repository adds boilerplate without benefit for this project size.
Alternatives considered: Controller-Service-Repository
Impact: Simpler codebase, services call Mongoose directly.
Date: 2026-08-21

DEC-004
Decision: Use mongodb-memory-server for dev environments without MongoDB installed
Why: Dev machine does not have MongoDB. In-memory server allows full development and testing without external dependencies.
Alternatives considered: Requiring MongoDB install, MongoDB Atlas
Impact: Data is ephemeral in dev (resets on restart). Auto-seed compensates.
Date: 2026-08-21

DEC-005
Decision: Auto-seed database on startup when empty
Why: With in-memory DB, data is lost on restart. Auto-seeding provides a seamless dev experience.
Alternatives considered: Manual seed command only
Impact: Server startup is slightly slower on first run.
Date: 2026-08-21

DEC-006
Decision: Decouple into separate frontend/ and backend/ directories within workspace
Why: Enables independent versioning, deployment, testing, and dependency trees while maintaining a clean monorepo.
Alternatives considered: Polyrepo (separate git repositories)
Impact: Frontend and backend have independent package.json files, with root package.json orchestrating convenience scripts.
Date: 2026-08-21
