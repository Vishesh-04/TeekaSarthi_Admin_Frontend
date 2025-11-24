# TeekaSarthi - Supervisor Frontend

Quick start:
1. Install dependencies: npm install
2. Run dev server: npm run dev
3. Open http://localhost:3000

Notes:
- Tailwind CSS configured.
- Auth: login via POST http://localhost:8081/api/auth/login (expects { username, password }), stores JWT in localStorage.
- API base for supervisor endpoints: http://localhost:8081/api/supervisor
- Some endpoints used outside supervisor base (worker summary, auth) use full URLs.

Recommended next steps:
- Add search & pagination for centers and workers.
- Add proper error handling and DX improvements.
- Replace placeholder endpoints for sessions approval/verification with real PUT endpoints.
