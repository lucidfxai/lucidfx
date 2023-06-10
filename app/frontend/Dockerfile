# Base image for build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app/build ./build

# Copy local environment variables
COPY .env .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

