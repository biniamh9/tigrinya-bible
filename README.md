# Tigrinya Bible

A mobile-first Bible and devotional foundation built with Next.js, TypeScript, Tailwind CSS, and Supabase.

> Read the Bible. Grow daily. Grow together.

This first milestone contains project infrastructure, placeholder routes, Supabase utilities, and the initial database/RLS architecture. Product features and production Bible content are intentionally not implemented yet.

## Requirements

- Node.js 22 LTS recommended (20.19 or newer is supported)
- npm
- Docker Desktop (for local Supabase)
- Supabase CLI (included as a development dependency)

## Setup

```bash
npm install
cp .env.example .env.local
npm run supabase:start
```

Copy the local API URL and publishable/anonymous key printed by Supabase into `.env.local`, then initialize the database and start Next.js:

```bash
npm run supabase:reset
npm run types:database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local Supabase Studio is normally available at [http://localhost:54323](http://localhost:54323).

## Environment variables

| Variable | Required | Exposure | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser and server | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Browser and server | Publishable key protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server only | Reserved for future privileged server workflows |

Never add a service-role key to a `NEXT_PUBLIC_` variable or client module. This application is designed to use the publishable key and database RLS for normal user access.

## Useful commands

```bash
npm run dev                 # Start the Next.js development server
npm run build               # Create a production build
npm run start               # Run the production build
npm run lint                # Run ESLint
npm run typecheck           # Run TypeScript without emitting files
npm run supabase:start      # Start the local Supabase stack
npm run supabase:stop       # Stop the local stack
npm run supabase:reset      # Rebuild local DB from migrations and seed
npm run types:database      # Regenerate database types from local DB
```

## Database migrations

Migrations live in `supabase/migrations` and are applied in filename order. The initial migration creates the full core schema, indexes, constraints, timestamp triggers, signup profile trigger, and RLS policies.

For local development, create a new migration with:

```bash
npx supabase migration new descriptive_name
```

Edit the generated SQL, reset the local database, and regenerate types. Do not edit a migration already deployed to a shared environment; add a new one instead.

To link and deploy migrations to a hosted Supabase project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Review all migration output and RLS behavior against a staging project before production deployment.

## Generated database types

`src/types/database.generated.ts` is a checked-in placeholder so a fresh install can compile before local Supabase is running. After `supabase:start` and `supabase:reset`, run `npm run types:database`. Commit the generated file whenever the schema changes. Application code should import `Database` from that module rather than hand-writing table shapes.

## Project structure

```text
src/
  app/                    App Router layouts and routes
  components/             Reusable UI and navigation
  lib/env.ts              Runtime environment validation
  lib/supabase/           Typed browser/server Supabase factories
  types/                  Generated database types
supabase/
  migrations/             Versioned PostgreSQL schema and RLS
  config.toml             Local Supabase configuration
  seed.sql                Deliberately empty content seed
```

## Security model

- PostgreSQL Row Level Security is enabled on every public table.
- Personal saved verses, highlights, notes, and preferences are owner-only.
- Private group content is gated by membership; leadership mutations are checked in database policies.
- Devotional and Bible content mutations require the database `admin` role.
- Profile creation and notification defaults are created by a security-definer signup trigger with a fixed search path.
- Client-provided roles and user IDs must never be treated as authorization. Server code should validate authentication and inputs, while PostgreSQL remains the final authorization boundary.

The initial migration bootstraps groups without silently adding an owner membership row. When group creation is implemented, use a transaction or database RPC to create the group and its owner membership atomically.

## Deployment

1. Create hosted Supabase and Vercel projects.
2. Apply migrations with `npx supabase db push`.
3. Configure the hosted Auth site URL and allowed redirect URLs for the Vercel domain.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to Vercel for each environment.
5. Run `npm run build`, then deploy through the Vercel Git integration or CLI.

Keep privileged secrets server-only and use Vercel environment scoping for preview versus production values.
