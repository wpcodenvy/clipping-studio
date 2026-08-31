# Stage 1: Build Frontend (Vite) and Backend Server (esbuild)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code and configuration files
COPY . .

# Build Vite client SPA and bundle server.ts into dist/server.cjs
RUN npm run build

# --------------------------------------------------------
# Stage 2: Production Runtime Container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests for runtime production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled build artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root security context
USER node

# Expose default application port
EXPOSE 3000

# Healthcheck to ensure container is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/config-status || exit 1

# Start production server
CMD ["node", "dist/server.cjs"]
