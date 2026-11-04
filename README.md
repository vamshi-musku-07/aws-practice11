# Taskflow — Full-Stack Todo List

Todo app with **Node.js / Express / MongoDB** backend and **React + Tailwind CSS** frontend.

## Why it was flaky on EC2

| Symptom | Cause |
|---------|--------|
| Backend restarts hundreds of times in PM2 | MongoDB connect failed → `process.exit(1)` crash loop |
| Frontend loads but API fails | CORS only allowed `localhost:5173`, not Cloudflare URL |
| Sometimes FE works, sometimes BE | Two separate Cloudflare tunnels; `pkill cloudflared` kills both; URLs change every restart |
| `curl :5000` → 404 | Normal — root had no route before (use `/` or `/api/health`) |

**Fix:** Vite proxies `/api` → local backend. You only need **one** tunnel on port **5173**.

## Environment variables

### Backend (`backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
NODE_ENV=development
CLIENT_URL=*
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=/api
VITE_PROXY_TARGET=http://127.0.0.1:5000
```

Do **not** put a Cloudflare URL in `VITE_API_URL` when using the proxy.

## Local run

```bash
# terminal 1
cd backend && npm install && npm run dev

# terminal 2
cd frontend && npm install && npm run dev
```

## Docker

Dockerfiles live in `backend/` and `frontend/`. Compose runs **frontend**, **backend**, and **MongoDB** with a named volume for DB data.

```bash
# from project root
docker compose up --build -d

# Frontend: http://localhost:5173
# Backend:  http://localhost:5000/api/health
# MongoDB:  localhost:27017 (data in volume todo-mongo-data)
```

Named volume `todo-mongo-data` stores MongoDB files under `/data/db` so data survives container restarts/rebuilds.

```bash
# inspect / remove volume (deletes all todos)
docker volume ls
docker volume inspect todo-mongo-data
docker compose down -v   # -v also removes the named volume
```

Compose sets `MONGODB_URI=mongodb://mongo:27017/todo-app` for the backend (overrides Atlas in `.env` while containers run).

## Docker Hub

Push **frontend** and **backend** images to Docker Hub, then pull them on EC2.

### 1. Setup

```powershell
copy .env.hub.example .env.hub
notepad .env.hub
```

Set `DOCKERHUB_USERNAME` to your Hub username.

### 2. Build & push (from your PC)

```powershell
.\scripts\hub-push.ps1
```

On Linux:

```bash
chmod +x scripts/hub-push.sh
./scripts/hub-push.sh
```

### 3. Run on EC2 from Docker Hub

```bash
docker compose --env-file .env.hub -f docker-compose.hub.yml pull
docker compose --env-file .env.hub -f docker-compose.hub.yml up -d
```

App: `http://EC2_PUBLIC_IP:5173`

### Flow

```
Your PC                 Docker Hub                    EC2
--------                ----------                    ---
docker build ──push──► youruser/todo-backend   ◄──pull── docker compose
docker build ──push──► youruser/todo-frontend  ◄──pull── (docker-compose.hub.yml)
                       mongo:7 (official)
```

## EC2 + PM2 + Cloudflare (recommended)

```bash
cd ~/aws-practice11

# Start both apps
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save

# Verify locally
curl http://127.0.0.1:5000/api/health
curl http://127.0.0.1:5173/

# ONE tunnel only — frontend (API is proxied)
pkill cloudflared || true
cd frontend
nohup cloudflared tunnel --url http://127.0.0.1:5173 > tunnel.log 2>&1 &
grep -o 'https://[-a-z0-9]*\.trycloudflare.com' tunnel.log | head -1
```

Open that URL in the browser. Todos should load without a second tunnel.

### After editing `.env`

```bash
pm2 restart aws-practice --update-env
pm2 restart aws-practice-frontend --update-env
```

### Check logs if something breaks

```bash
pm2 logs aws-practice --lines 50
pm2 logs aws-practice-frontend --lines 50
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | API info |
| `GET` | `/api/health` | Health + DB status |
| `GET` | `/api/todos` | List todos |
| `POST` | `/api/todos` | Create todo |
| `PUT` | `/api/todos/:id` | Update todo |
| `DELETE` | `/api/todos/:id` | Delete todo |
