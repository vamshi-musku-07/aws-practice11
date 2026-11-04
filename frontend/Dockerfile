# ========== STAGE 1: Install dependencies ==========
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci


# ========== STAGE 2: Build React app ==========
# Needs Node + Vite + Tailwind to compile JS/CSS into static files.
# Final image does NOT keep Node or these build tools.
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Relative /api — nginx proxies this to the backend container
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
# Result: /app/dist  (HTML, CSS, JS only)


# ========== STAGE 3: Tiny production server ==========
# Only nginx + the built files. No Node, no npm, no source code.
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
