# AWDF Practical 6 — Task Manager

A React + Vite task-manager frontend. The provided archive's `TaskManagerAPI` directory was empty, so the backend implementation is not included.

## Frontend setup

```bash
cd TaskManager-frontend
npm install
npm run dev
```

The frontend currently calls `http://localhost:5000/tasks` and expects a backend with GET/POST `/tasks` and PUT/DELETE `/tasks/:id` endpoints. Start that API separately for task persistence to work.
