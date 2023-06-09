# Stage 1 - the build process
FROM node:18-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM node:18-alpine
WORKDIR /app
COPY --from=build-deps /usr/src/app/build /app
RUN npm install -g serve
CMD serve -s -l $PORT
EXPOSE 8080
