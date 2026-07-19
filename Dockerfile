# --- Stage 1: build the SPA (Vite) ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend

# Enable pnpm and allow dependency build scripts in CI/Docker
RUN corepack enable
ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true

# Copy frontend manifest + lockfile and install deps
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build args for environment variables
ARG VITE_CLERK_PUBLISHABLE_KEY=""
ENV VITE_API_URL=
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Copy rest of frontend source and build
COPY frontend/ ./
RUN pnpm build

# --- Stage 2: compile the API (TypeScript → JavaScript) ---
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app

RUN corepack enable
ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true

# Copy backend manifest + lockfile, then install deps
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy backend source and build
COPY backend/ ./
RUN pnpm build

# --- Stage 3: runtime image (only prod deps + built assets) ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable
ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true

# Install only production deps using lockfile
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm cache clean 

# Copy compiled backend and built frontend
COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]