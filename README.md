# HELP HUB — Emergency Assistance Platform

A location-based emergency assistance platform for instant medical, vehicle breakdown, police, fire, and specialized municipal emergency help.

---

## 📁 Monorepo Structure

```
Help-hub/
├── frontend/             # React 19 + Vite SPA (Client Application)
│   ├── src/
│   │   ├── components/   # UI components, modals, maps
│   │   ├── views/        # Main screen views (Citizen, Business, Admin)
│   │   ├── services/     # API client (api.ts)
│   │   └── types.ts      # Data types & interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/              # Node.js + Express REST API (Server Application)
│   ├── src/
│   │   ├── config/       # Database & environment configuration
│   │   ├── controllers/  # API request/response handlers
│   │   ├── middlewares/  # JWT auth, RBAC authorization, error handling
│   │   ├── models/       # Mongoose schemas (User, Provider, City, Complaint, AuditLog)
│   │   ├── routes/       # Express route definitions (/api/v1/*)
│   │   ├── services/     # Core business logic
│   │   ├── validators/   # Zod input validation schemas
│   │   └── seed.js       # Database seeder
│   ├── tests/            # Automated integration tests (27 test cases)
│   ├── package.json
│   └── README.md
│
├── docs/                 # System Architecture & AI Context System
│   ├── ARCHITECTURE.md   # Architectural design & data flow
│   ├── API_CONTRACT.md   # Complete API specification
│   ├── DATABASE.md       # Database schemas & relationships
│   ├── BUSINESS_RULES.md # Business logic rules
│   ├── SECURITY.md       # Security & RBAC policies
│   ├── MEMORY.md         # Compact persistent AI memory
│   └── ...
│
├── package.json          # Root workspace scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Backend API
```bash
npm run dev:backend
```
Backend API will start at: `http://localhost:5000/api/v1` (with automatic in-memory MongoDB fallback and auto-seeding).

### 3. Start Frontend App
```bash
npm run dev:frontend
```
Frontend App will start at: `http://localhost:3000`.

### 4. Run Backend Tests
```bash
npm run test:backend
```

---

## 🔑 Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| **Citizen (User)** | `user@helphub.org` | `password123` |
| **Business Partner** | `business@helphub.org` | `password123` |
| **Platform Owner (Admin)** | `admin@helphub.org` | `password123` |
