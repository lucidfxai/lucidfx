Docker
You can containerize this stack and deploy it as a single container using Docker, or as a part of a group of containers using docker-compose. See ajcwebdev/ct3a-docker↗ for an example repo based on this doc.

Docker Project Configuration
Please note that Next.js requires a different process for build time (available in the frontend, prefixed by NEXT_PUBLIC) and runtime environment, server-side only, variables. In this demo we are using two variables, pay attention to their positions in the Dockerfile, command-line arguments, and docker-compose.yml:

DATABASE_URL (used by the server)
NEXT_PUBLIC_CLIENTVAR (used by the client)
1. Next Configuration
In your next.config.mjs↗, add the standalone output-option configuration to reduce image size by automatically leveraging output traces↗:

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
 output: "standalone",
});

2. Create dockerignore file
Click here and include contents in .dockerignore:
.env
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git

3. Create Dockerfile
Since we’re not pulling the server environment variables into our container, the environment schema validation will fail. To prevent this, we have to add a SKIP_ENV_VALIDATION=1 flag to the build command so that the env-schemas aren’t validated at build time.

Click here and include contents in Dockerfile:
##### DEPENDENCIES

FROM --platform=linux/amd64 node:16-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm ci; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### BUILDER

FROM --platform=linux/amd64 node:16-alpine3.17 AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
 if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
 elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### RUNNER

FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]

Notes

Emulation of --platform=linux/amd64 may not be necessary after moving to Node 18.
See node:alpine↗ to understand why libc6-compat might be needed.
Using Alpine 3.17 based images can cause issues with Prisma↗. Setting engineType = "binary" solves the issue in Alpine 3.17, but has an associated performance cost↗.
Next.js collects anonymous telemetry data about general usage↗. Uncomment the first instance of ENV NEXT_TELEMETRY_DISABLED 1 to disable telemetry during the build. Uncomment the second instance to disable telemetry during runtime.
Build and Run Image Locally
Build and run this image locally with the following commands:

docker build -t ct3a-docker --build-arg NEXT_PUBLIC_CLIENTVAR=clientvar .
docker run -p 3000:3000 -e DATABASE_URL="database_url_goes_here" ct3a-docker

Open localhost:3000↗ to see your running application.

Docker Compose
You can also use Docker Compose to build the image and run the container.

Follow steps 1-4 above, click here, and include contents in docker-compose.yml:
Deploy to Railway
You can use a PaaS such as Railway’s↗ automated Dockerfile deployments↗ to deploy your app. If you have the Railway CLI installed↗ you can deploy your app with the following commands:

railway login
railway init
railway link
railway up
railway open

Go to “Variables” and include your DATABASE_URL. Then go to “Settings” and select “Generate Domain.” To view a running example on Railway, visit ct3a-docker.up.railway.app↗.

Useful Resources
Resource	Link
Dockerfile reference	https://docs.docker.com/engine/reference/builder/↗
Compose file version 3 reference	https://docs.docker.com/compose/compose-file/compose-file-v3/↗
Docker CLI reference	https://docs.docker.com/engine/reference/commandline/docker/↗
Docker Compose CLI reference	https://docs.docker.com/compose/reference/↗
Next.js Deployment with Docker Image	https://nextjs.org/docs/deployment#docker-image↗
Next.js in Docker	https://benmarte.com/blog/nextjs-in-docker/↗
Next.js with Docker Example	https://github.com/vercel/next.js/tree/canary/examples/with-docker↗
Create Docker Image of a Next.js app	https://blog.tericcabrel.com/create-docker-image-nextjs-application/↗



