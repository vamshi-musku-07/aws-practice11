# Taskflow — Full-Stack Todo List

Todo app with a **Node.js / Express / MongoDB** backend and a **React + Tailwind CSS** frontend.

## Project structure

```
aws-practice11/
├── backend/          # Express API + MongoDB
│   ├── .env          # Backend environment variables
│   ├── server.js
│   ├── config/
│   ├── models/
│   └── routes/
└── frontend/         # React (Vite) + Tailwind
    ├── .env          # Frontend environment variables
    └── src/
```

## Environment variables

### Backend (`backend/.env`)

| Variable       | Description                          | Example                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `PORT`         | API server port                      | `5000`                                       |
| `MONGODB_URI`  | MongoDB connection string           | `mongodb://127.0.0.1:27017/todo-app`         |
| `NODE_ENV`     | Environment                          | `development`                                |
| `CLIENT_URL`   | Frontend origin (CORS)               | `http://localhost:5173`                      |

### Frontend (`frontend/.env`)

| Variable       | Description                          | Example                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `VITE_API_URL` | Backend API base URL                 | `http://localhost:5000/api`                  |

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI in `MONGODB_URI`)

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## API endpoints

| Method   | Path              | Description        |
|----------|-------------------|--------------------|
| `GET`    | `/api/health`     | Health check       |
| `GET`    | `/api/todos`      | List all todos     |
| `POST`   | `/api/todos`      | Create a todo      |
| `PUT`    | `/api/todos/:id`  | Update a todo      |
| `DELETE` | `/api/todos/:id`  | Delete a todo      |
