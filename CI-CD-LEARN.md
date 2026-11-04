# CI/CD with GitHub Actions — you run these commands

Workflow file is already in the repo: `.github/workflows/deploy.yml`

Flow:
`git push` → GitHub Actions → build images → Docker Hub → SSH EC2 → `docker compose pull/up`

---

## A) One-time: Docker Hub access token

1. Open https://hub.docker.com → Account Settings → **Security** → **New Access Token**
2. Name it `github-actions`, permission: Read & Write
3. Copy the token (shown once)

---

## B) One-time: GitHub repo + secrets

### 1. Create repo on GitHub (if you don’t have one)
Browser: github.com → New repository → name e.g. `aws-practice11` → create (empty is fine)

### 2. On your PC (PowerShell) — connect local project to GitHub

```powershell
cd C:\Users\eagle\AllCodes\aws-practice11

git status
git init
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/aws-practice11.git
```

If `remote origin already exists`, skip `remote add` or fix with:
```powershell
git remote -v
git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/aws-practice11.git
```

### 3. Add GitHub Secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these exact names:

| Secret name | Value |
|-------------|--------|
| `DOCKERHUB_USERNAME` | `vamshi0726` |
| `DOCKERHUB_TOKEN` | the Hub access token from step A |
| `EC2_HOST` | your EC2 **public IP** (or public DNS) |
| `EC2_USERNAME` | `ubuntu` |
| `EC2_SSH_KEY` | full contents of your `.pem` private key |
| `EC2_DEPLOY_PATH` | `/home/ubuntu/todo-docker` |

**How to copy the PEM into the secret (Windows):**
```powershell
Get-Content path\to\your-key.pem -Raw
```
Paste the whole output into `EC2_SSH_KEY` (including `-----BEGIN ... KEY-----` lines).

---

## C) One-time: EC2 must already run Docker compose

On EC2, you should already have:

```bash
ls ~/todo-docker
# need: docker-compose.hub.yml, .env.hub, backend/.env
```

If not finished yet, on EC2:

```bash
mkdir -p ~/todo-docker/backend
# then copy the 3 files from your PC with scp (see earlier guide)
```

From PC:
```powershell
cd C:\Users\eagle\AllCodes\aws-practice11
scp -i path\to\your-key.pem docker-compose.hub.yml ubuntu@YOUR_EC2_IP:~/todo-docker/
scp -i path\to\your-key.pem .env.hub ubuntu@YOUR_EC2_IP:~/todo-docker/
scp -i path\to\your-key.pem backend\.env ubuntu@YOUR_EC2_IP:~/todo-docker/backend/.env
```

On EC2 — first manual run (proves Docker works before Actions):
```bash
cd ~/todo-docker
newgrp docker   # if docker needs group
docker compose --env-file .env.hub -f docker-compose.hub.yml pull
docker compose --env-file .env.hub -f docker-compose.hub.yml up -d
curl http://127.0.0.1:5000/api/health
```

Security group: allow inbound **22** from GitHub?  
Actually Actions SSH comes from **random GitHub IPs**. For practice, allow SSH `0.0.0.0/0` on port 22 (or lock later). Also open **5173** for the website.

---

## D) First push — start the pipeline

On your PC:

```powershell
cd C:\Users\eagle\AllCodes\aws-practice11

git add .
git status
git commit -m "Add GitHub Actions CI/CD deploy workflow"
git push -u origin main
```

Then open GitHub → your repo → **Actions** tab → watch **Build and Deploy**.

---

## E) Every future update (this is the new daily process)

```powershell
# edit code, then:
git add .
git commit -m "Describe your change"
git push
```

No more `hub-push.ps1` for deploy. Actions does build → Hub → EC2.

---

## F) If deploy fails — check these

```bash
# On EC2
cd ~/todo-docker
docker compose -f docker-compose.hub.yml ps
docker compose -f docker-compose.hub.yml logs --tail=50
```

- Actions “Login to Docker Hub” fails → wrong `DOCKERHUB_TOKEN`
- Actions “Deploy over SSH” fails → wrong `EC2_HOST` / key / SG blocks port 22
- Containers unhealthy → `backend/.env` missing or Mongo issue

---

## What you no longer need for deploy
- Running `.\scripts\hub-push.ps1` every time
- Manually SSHing to run `pull` / `up` every time
- PM2 for this app
