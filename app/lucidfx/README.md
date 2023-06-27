pnpm run dev

# start dev database:
---------------------
$ cd docker && docker compose up -d


# DB migrations:
----------------
$ pnpm drizzle-kit generate:mysql --schema=./src/db/schema/*

In connection.ts we have an automation for running migrations during local 
development. This is not required for staging/production, as migrations will be
run through CI/CD.

`Please only commit one migration script per feature branch`
`Please keep migrations as clean as possible during local development`
One way to achieve this is to delete all local changes in the migration dir
from your git history.

then run:
$ pnpm drizzle-kit generate:mysql --schema=./src/db/schema/*

to generate your migration.

This migration will be used in staging and production.

