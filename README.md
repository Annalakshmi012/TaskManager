# Task Manager - Full Stack Starter

## Overview
This is a starter full-stack task manager application fulfilling the evaluation task:
- JWT authentication (register/login)
- CRUD operations for tasks (title, description, status, dueDate)
- Pagination and filtering available on backend
- Frontend built with React (Vite) and Tailwind CDN for quick styling
- Backend built with Express and MongoDB (Mongoose)

## What's included
- `backend/` - Express API
- `frontend/` - Vite + React SPA
- `README.md` - this file

## Quick setup (local)
### Prerequisites
- Node.js (>=18 recommended)
- MongoDB running locally or a MongoDB URI (Atlas)

### Backend
```bash
cd backend
cp .env
# edit .env to set MONGO_URI and JWT_SECRET
npm install
npm run dev
```
Backend will run on `http://localhost:4000` by default.

### Frontend
```bash
cd frontend
cp .env
npm install
npm run dev
```
Frontend Vite dev server will start (default `http://localhost:5173`). The frontend expects the backend base URL in `.env` as `VITE_API_URL`.

## API Endpoints (sample)
- `POST /api/auth/register` { name, email, password } -> { token }
- `POST /api/auth/login` { email, password } -> { token }
- Protected routes (Authorization: Bearer <token>):
  - `GET /api/tasks` -> paginated list (query: page, limit, status, dueBefore, dueAfter)
  - `POST /api/tasks` -> create task
  - `GET /api/tasks/:id` -> get single
  - `PUT /api/tasks/:id` -> update
  - `DELETE /api/tasks/:id` -> delete

## Notes & Next steps (suggested)
- Add better UI/UX, client-side validation, and loading states
- Add editing tasks UI
- Add tests, TypeScript conversion (bonus), and deploy backend to Render/Heroku and frontend to Vercel/Netlify
- Improve security: rate-limiting, helmet, refresh tokens

## License
MIT
