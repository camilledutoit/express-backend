# Stage 1: Build and Test
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:20-alpine

# Install curl and upgrade npm
RUN apk add --no-cache curl && \
    npm install -g npm@11.0.0

# Create a non-root user
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser
USER appuser

# Set working directory
WORKDIR /usr/src/app

# Only copy necessary files for production
COPY --from=builder /usr/src/app /usr/src/app

# Copy any other necessary production files
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose port 4000
EXPOSE 4000

# Add a health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "server.js"]