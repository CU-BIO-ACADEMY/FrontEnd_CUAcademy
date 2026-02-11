# ===================================
# Stage 1: Dependencies
# ===================================
FROM oven/bun:1-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# ===================================
# Stage 2: Builder
# ===================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# ⭐ เพิ่ม ARG ตรงนี้ (ก่อน ENV และ RUN build)
ARG NEXT_PUBLIC_API_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# ⭐ ตั้งค่า ENV จาก ARG (ก่อน build)
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ===================================
# Stage 3: Runner (Production)
# ===================================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check using wget (lightweight)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application with Bun runtime
CMD ["bun", "run", "server.js"]
