# Frontend (Vite + React)
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Build args for environment variables
ARG VITE_API_URL=""
ARG VITE_CLERK_PUBLISHABLE_KEY=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

COPY . .
RUN npm run build

# Runtime stage - serve static files
FROM node:22-bookworm-slim
WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve --no-audit --no-fund

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173
USER node

CMD ["serve", "-s", "dist", "-l", "5173"]
