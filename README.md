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
- MongoDB URI (Atlas)

### Backend
```bash
cd D:/annu/task-manager-fullstack-with-installer/backend
npm install
npm run dev
```
Backend will run on `http://localhost:4000` by default.

### Frontend
```bash
cd D:/annu/task-manager-fullstack-with-installer/frontend
npm install
npm install react-icons
npm install --legacy-peer-deps
npm install
npm run dev
```
Frontend Vite dev server will start (default `http://localhost:5173`). The frontend expects the backend base URL in `.env` as `VITE_API_URL`.

## API Endpoints 
- `POST /api/auth/register` { name, email, password } -> { token }
- `POST /api/auth/login` { email, password } -> { token }
- Protected routes (Authorization: Bearer <token>):
  - `GET /api/tasks` -> paginated list (query: page, limit, status, dueBefore, dueAfter)
  - `POST /api/tasks` -> create task
  - `GET /api/tasks/:id` -> get single
  - `PUT /api/tasks/:id` -> update
  - `DELETE /api/tasks/:id` -> delete

## License
MIT
