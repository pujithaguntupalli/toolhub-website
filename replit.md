# Multi-Toolbox

A browser-first suite of free unit converters, calculators, image tools, and PDF tools. Calculations and supported file processing stay on the user's device.

## Run & Operate

- The Multi-Toolbox web preview runs through its managed Replit workflow.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/multi-toolbox run typecheck` — typecheck the web app
- The API server and database scaffolds are not used by Multi-Toolbox.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/multi-toolbox/src/tools.ts` — searchable tool registry and calculator/converter definitions
- `artifacts/multi-toolbox/src/lib/image-tools.ts` — browser Canvas image processing
- `artifacts/multi-toolbox/src/lib/pdf-tools.ts` — browser PDF processing
- `artifacts/multi-toolbox/src/components/FilesToolPage.tsx` — image and PDF upload, controls, previews, and downloads
- `artifacts/multi-toolbox/src/App.tsx` — routes, navigation, and page metadata

## Architecture decisions

- Keep calculations and file processing in the browser; do not send user inputs or files to an external processing service.
- Recent tool names are stored in browser local storage; file contents and calculator inputs are not persisted.
- Use `pdf-lib` for PDF editing and PDF.js for page rendering/text extraction. PDF operations run only after a user opens a PDF tool.
- PDF password encryption/removal are unavailable in the browser-only version and are clearly labeled; PDF compression may not reduce embedded-image size.

## Product

- 20 unit converters and 20 calculators.
- 20 image tools for resize, compression, format conversion, and common edits.
- 18 working PDF tools for editing, conversion, and extraction; password protection and removal are unavailable.
- Search, category browsing, recent tools, and About, Contact, Privacy, and Terms pages.

## User preferences

- Prefer free dependencies and browser-side processing. Do not add paid APIs or third-party file uploads without the user's explicit permission.

## Gotchas

- The app currently has 78 working tools, not the full 80 requested; two PDF password actions are intentionally unavailable rather than simulated.
- The contact page has no destination because the site owner has not supplied contact details.
- Dynamic page metadata is present. Add a production sitemap after the published domain is known; do not use a guessed URL.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
