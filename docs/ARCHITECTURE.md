# Help Hub Architecture

## Overview
Help Hub is structured as a decoupled full-stack monorepo with distinct frontend and backend tiers:

```
Help-hub/
├── frontend/             # React 19 + TypeScript + Vite SPA
├── backend/              # Node.js + Express + MongoDB REST API
└── docs/                 # Persistent AI Context & Architecture Docs
```

## Data Flow
```
User / Browser
   ↓
Frontend (React 19 SPA)
   ↓ HTTP / JSON (via src/services/api.ts)
Backend API Route (/api/v1/*)
   ↓
Middleware (Auth JWT / Role RBAC / Zod Validation / CORS / Helmet)
   ↓
Controller (Request/Response Handling)
   ↓
Service (Business Logic & Audit Logging)
   ↓
Model (Mongoose Schemas & Hooks)
   ↓
Database (MongoDB / In-Memory Mongo Fallback)
```

## Core Components
- **Frontend (`frontend/`)**: React 19 SPA with Tailwind CSS v4, Lucide icons, Framer Motion, and TypeScript.
- **Backend (`backend/`)**: Node.js with Express, RESTful APIs, JWT authentication, and Zod schema validations.
- **Database**: MongoDB with Mongoose ODM (with automatic in-memory fallback for local dev).
- **Authentication**: JWT Bearer token authentication with role-based authorization (`user`, `business`, `admin`).
