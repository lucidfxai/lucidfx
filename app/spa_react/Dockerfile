# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci 

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /app
COPY . /app
RUN npm run build

# --- Release with Nginx ----
FROM nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Add bash
RUN apk add --no-cache bash

# Substitute variable references in the Nginx configuration for real values from the environment
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp" && nginx -c /etc/nginx/conf.d/default.conf.temp -g 'daemon off;'


EXPOSE 8080

