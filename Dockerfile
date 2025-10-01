# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Create data directory
RUN mkdir -p data uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/upload/status || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
