# Frontend (Vite + React) with pnpm
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy manifest + lockfile (pnpm)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using the lockfile
RUN pnpm install --frozen-lockfile

# Build args for environment variables
ARG VITE_API_URL=""
ARG VITE_CLERK_PUBLISHABLE_KEY=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Copy the rest of the frontend source and build
COPY . .
RUN pnpm build

# Runtime stage - serve static files
FROM node:22-bookworm-slim
WORKDIR /app

RUN corepack enable

# Install 'serve' to run the static site
RUN pnpm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173
USER node

CMD ["serve", "-s", "dist", "-l", "5173"]