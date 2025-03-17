FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Add build arguments for environment variables
ARG VITE_API_URL=http://localhost:8000

# Create .env file with build arguments
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 