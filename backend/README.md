# Help Hub Backend

Backend API for the Help Hub emergency assistance platform.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Dev DB**: mongodb-memory-server (auto-fallback when MongoDB is unavailable)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server (auto-seeds on first run)
npm run dev

# Or manually seed database
npm run seed
```

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| User | user@helphub.org | password123 |
| Business | business@helphub.org | password123 |
| Admin | admin@helphub.org | password123 |

## API Base URL
```
http://localhost:5000/api/v1
```

## Project Structure
```
backend/
├── src/
│   ├── config/         # Database, env, logger
│   ├── controllers/    # Request/response handlers
│   ├── middlewares/     # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Business logic
│   ├── validators/     # Zod validation schemas
│   ├── utils/          # Response formatters
│   ├── app.js          # Express app
│   ├── server.js       # Entry point
│   └── seed.js         # Database seeder
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user/business
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Providers (Public)
- `GET /api/v1/providers` - List providers (with filters)
- `GET /api/v1/providers/:id` - Get provider details

### Providers (Protected)
- `POST /api/v1/providers` - Create provider (Business/Admin)
- `PUT /api/v1/providers/:id` - Update provider (Owner/Admin)
- `DELETE /api/v1/providers/:id` - Delete provider (Admin)
- `PUT /api/v1/providers/:id/verify` - Toggle verify (Admin)
- `PUT /api/v1/providers/:id/approve` - Approve (Admin)
- `PUT /api/v1/providers/:id/reject` - Reject (Admin)
- `PUT /api/v1/providers/:id/toggle-active` - Toggle active (Owner/Admin)

### Users
- `GET /api/v1/users` - List all users (Admin)
- `PUT /api/v1/users/:id/profile` - Update profile (Own)
- `PUT /api/v1/users/:id/role` - Update role (Admin)

### Complaints
- `GET /api/v1/complaints` - List complaints
- `POST /api/v1/complaints` - File complaint
- `PUT /api/v1/complaints/:id/status` - Update status (Admin)

### Cities
- `GET /api/v1/cities` - List cities
- `POST /api/v1/cities` - Add city (Admin)
- `PUT /api/v1/cities/:id/toggle` - Toggle active (Admin)

### Audit Logs
- `GET /api/v1/audit-logs` - View logs (Admin)

See [/docs/API_CONTRACT.md](../docs/API_CONTRACT.md) for full API documentation.
