# ========== STAGE 1: Install dependencies ==========
# This stage has npm tools and downloads packages.
# It is thrown away after the final image is built.
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


# ========== STAGE 2: Production image ==========
# Only this stage becomes the final image you run.
# It copies ready node_modules from stage 1 — no npm install here.
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy installed packages from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source only (no junk from install caches)
COPY package*.json ./
COPY server.js ./
COPY config ./config
COPY models ./models
COPY routes ./routes

# Run as non-root user (safer)
USER node

EXPOSE 5000

CMD ["node", "server.js"]
