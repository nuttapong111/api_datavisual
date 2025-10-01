# Use Node.js 18 Alpine image
FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Remove devDependencies after build
RUN npm prune --production

# Remove client devDependencies
RUN cd client && npm prune --production

# Create data directory
RUN mkdir -p data uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/upload/status || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
