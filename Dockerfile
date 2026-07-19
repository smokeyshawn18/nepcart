# --- Stage 1: build the SPA (Vite) ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./

# Empty = browser calls /api on the same host as the page
ENV VITE_API_URL=
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# install pnpm (if you don't already via corepack)
RUN corepack enable
RUN pnpm install --no-audit --no-fund
RUN pnpm build

# --- Stage 2: compile the API (TypeScript → JavaScript) ---
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app

RUN corepack enable

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --no-audit --no-fund --frozen-lockfile

COPY backend/ ./
RUN pnpm build

# --- Stage 3: runtime image (only prod deps + built assets) ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Install only production deps using lockfile
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --prod --no-audit --no-fund --frozen-lockfile \
  && pnpm cache clean --force

# Copy compiled backend and built frontend
COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]