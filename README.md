# Health Decoded

Health Decoded is an educational platform that helps people navigate the first 90 days after a Type 2 diabetes diagnosis.

## Foundation

- Next.js 15 with the App Router and TypeScript
- Tailwind CSS and shadcn/ui
- Supabase browser and server clients
- React Hook Form, Zod, Lucide React, and Framer Motion
- ESLint and Prettier

## Getting started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and provide the Supabase values.
3. Start the development server: `npm run dev`

## Quality checks

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

## Project structure

```text
app/                 Routes and route layouts only
components/ui/       shadcn/ui primitives
components/layout/   Reusable application layout components
components/shared/   Reusable non-feature components
features/            Feature-owned components, hooks, services, and types
hooks/               Shared hooks
lib/                 Shared utilities and Supabase configuration
services/            External-system integrations
types/               Shared TypeScript types
styles/              Shared style resources
public/              Static assets
supabase/            Supabase configuration and migrations
```

No product pages or features are included in this foundation.
