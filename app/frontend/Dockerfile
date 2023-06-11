# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Define arguments
ARG REACT_APP_API_SERVER_URL
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_AUTH0_CALLBACK_URL
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_DOMAIN

# Declare environment variables
ENV REACT_APP_API_SERVER_URL=$REACT_APP_API_SERVER_URL
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_CALLBACK_URL=$REACT_APP_AUTH0_CALLBACK_URL
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
RUN npm install

# Copying all the files in our project
COPY . .

RUN echo $REACT_APP_API_SERVER_URL
RUN echo $REACT_APP_AUTH0_AUDIENCE
RUN echo $REACT_APP_AUTH0_CALLBACK_URL
RUN echo $REACT_APP_AUTH0_CLIENT_ID
RUN echo $REACT_APP_AUTH0_DOMAIN

# Building our application
RUN npm run build

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

