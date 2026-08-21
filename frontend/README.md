# Help Hub Frontend

Frontend SPA built with React 19, TypeScript, Tailwind CSS, Lucide icons, and Vite.

## Setup & Running

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

## Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL (Default: `http://localhost:5000/api/v1`)

## Structure
```
frontend/
├── src/
│   ├── components/     # Modals, Navbar, Sidebar, BottomNav, Map
│   ├── data/           # Mock data & initial states
│   ├── services/       # API client (api.ts)
│   ├── views/          # Views (Home, Category, Provider, Auth, Dashboards)
│   ├── App.tsx         # Main application container
│   ├── main.tsx        # React entry point
│   ├── types.ts        # TypeScript data models & interfaces
│   └── index.css       # Styles & theme definitions
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
