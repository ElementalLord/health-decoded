# Health Decoded

Health Decoded is an educational web application for adults during the first 14 days after a new Type 2 diabetes diagnosis. The future product scope supports a 90-day journey.

## Requirements

- Node.js 20 or later
- npm

## Installation

```bash
npm install
```

## Environment setup

Copy `.env.example` to `.env.local`, then provide the required local values. Do not commit `.env.local`.

Current public values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Current server-only values:

- `GEMINI_API_KEY`

## Development commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run format:check
npm run build
```

## Documentation

Project documentation is in [Documentation](./Documentation/README.md).
