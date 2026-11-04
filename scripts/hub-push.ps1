# Build frontend + backend and push to Docker Hub (Windows PowerShell)
# Usage (from project root):
#   .\scripts\hub-push.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$envFile = Join-Path (Get-Location) ".env.hub"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $name, $value = $_.Split('=', 2)
    Set-Item -Path "Env:$($name.Trim())" -Value $value.Trim()
  }
}

$user = $env:DOCKERHUB_USERNAME
$tag = if ($env:IMAGE_TAG) { $env:IMAGE_TAG } else { "latest" }
$backendName = if ($env:BACKEND_IMAGE) { $env:BACKEND_IMAGE } else { "todo-backend" }
$frontendName = if ($env:FRONTEND_IMAGE) { $env:FRONTEND_IMAGE } else { "todo-frontend" }

if (-not $user -or $user -eq "your-dockerhub-username") {
  Write-Error "Set DOCKERHUB_USERNAME in .env.hub (see .env.hub.example)"
}

$backendImage = "${user}/${backendName}:${tag}"
$frontendImage = "${user}/${frontendName}:${tag}"

Write-Host "==> Login to Docker Hub"
docker login

Write-Host "==> Build backend → $backendImage"
docker build -t $backendImage ./backend

Write-Host "==> Build frontend → $frontendImage"
docker build -t $frontendImage --build-arg VITE_API_URL=/api ./frontend

Write-Host "==> Push backend"
docker push $backendImage

Write-Host "==> Push frontend"
docker push $frontendImage

Write-Host ""
Write-Host "Done. Images:"
Write-Host "  $backendImage"
Write-Host "  $frontendImage"
Write-Host ""
Write-Host "On a server, pull and run with:"
Write-Host "  docker compose --env-file .env.hub -f docker-compose.hub.yml pull"
Write-Host "  docker compose --env-file .env.hub -f docker-compose.hub.yml up -d"
