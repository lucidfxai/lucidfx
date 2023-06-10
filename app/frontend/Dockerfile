# Stage 1 - the build process
FROM node:18-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM node:18-alpine
# Create app directory
WORKDIR /app

# Create app user
RUN addgroup -S app && adduser -S app -G app

# Install serve package globally
RUN npm install -g serve

# Copy built app from previous stage
COPY --from=build-deps /usr/src/app/build /app

# Change to non-root user
USER app

# Start the app with serve on the port defined in the environment
CMD serve -s -l tcp://0.0.0.0:${PORT}
