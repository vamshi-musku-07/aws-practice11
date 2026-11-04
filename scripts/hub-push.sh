#!/usr/bin/env bash
# Build frontend + backend and push to Docker Hub (Linux / EC2 / Git Bash)
# Usage (from project root):
#   chmod +x scripts/hub-push.sh
#   ./scripts/hub-push.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env.hub ]]; then
  # shellcheck disable=SC1091
  set -a
  source .env.hub
  set +a
fi

USER_NAME="${DOCKERHUB_USERNAME:?Set DOCKERHUB_USERNAME in .env.hub}"
TAG="${IMAGE_TAG:-latest}"
BACKEND_NAME="${BACKEND_IMAGE:-todo-backend}"
FRONTEND_NAME="${FRONTEND_IMAGE:-todo-frontend}"

BACKEND_IMAGE_REF="${USER_NAME}/${BACKEND_NAME}:${TAG}"
FRONTEND_IMAGE_REF="${USER_NAME}/${FRONTEND_NAME}:${TAG}"

echo "==> Login to Docker Hub"
docker login

echo "==> Build backend → ${BACKEND_IMAGE_REF}"
docker build -t "${BACKEND_IMAGE_REF}" ./backend

echo "==> Build frontend → ${FRONTEND_IMAGE_REF}"
docker build -t "${FRONTEND_IMAGE_REF}" --build-arg VITE_API_URL=/api ./frontend

echo "==> Push backend"
docker push "${BACKEND_IMAGE_REF}"

echo "==> Push frontend"
docker push "${FRONTEND_IMAGE_REF}"

echo ""
echo "Done. Images:"
echo "  ${BACKEND_IMAGE_REF}"
echo "  ${FRONTEND_IMAGE_REF}"
echo ""
echo "On a server, pull and run with:"
echo "  docker compose --env-file .env.hub -f docker-compose.hub.yml pull"
echo "  docker compose --env-file .env.hub -f docker-compose.hub.yml up -d"
