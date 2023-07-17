# Notes
-------
src/** is the client
server/ is the server

# System dev dependencies:
--------------------------
- Docker Desktop
- Docker Compose
- pnpm
- nvm

# Expose localhost to public domain (Useful for working with Auth/Clerk etc):
-----------------------------------------------------------------------------
Ngrok exposes localhost:3000 to a public domain.

# Scripts:
----------
dev
ngrok
build
start
lint
docker:up
docker:down
generate:schema
migrate
test:unit
test:integration
test:integration-local
test


Staging env:
-----------
- planetscale db
- clerk env -> unit test if node-env = staging integration test real create user.



