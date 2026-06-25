# Task 2 Report: Prisma Schema for Heman Peptide Storefront

## What Was Built

- `prisma/schema.prisma` — full schema with 13 models + 4 enums for the Rx telehealth peptide storefront
- `test/schema.test.ts` — 3 Vitest tests (TDD: RED → GREEN)
- `package.json` — moved `prisma` CLI from `dependencies` to `devDependencies`

## TDD Evidence: RED → GREEN

### RED (before schema existed)
```
npx vitest run test/schema.test.ts

FAIL  test/schema.test.ts [ test/schema.test.ts ]
Error: ENOENT: no such file or directory, open 'prisma/schema.prisma'
Test Files  1 failed (1)
Tests  no tests
```

### GREEN (after schema written)
```
npx vitest run test/schema.test.ts

Test Files  1 passed (1)
     Tests  3 passed (3)
  Start at  22:24:03
  Duration  129ms
```

## Prisma Validate & Generate

### `npx prisma validate`
```
Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid 🚀
```

### `npx prisma generate`
```
Prisma schema loaded from prisma/schema.prisma.
✔ Generated Prisma Client (v7.8.0) to ./node_modules/@prisma/client in 78ms
```

## Relation Fixes & Prisma 7 Breaking Changes

The brief's schema (written for Prisma ~5/6 conventions) required two categories of fixes for Prisma 7.8.0:

### 1. Single-line blocks no longer valid (Prisma 7 breaking change)
The brief used compact single-line notation:
```prisma
generator client { provider = "prisma-client-js" }
enum ProductStatus { ACTIVE COMING_SOON WAITLIST }
```
Prisma 7 requires multi-line block syntax for all definitions. All blocks expanded.

### 2. `datasource url` moved out of schema.prisma (Prisma 7 breaking change)
Prisma 7 no longer accepts `url = env("DATABASE_URL")` in the `datasource` block of `schema.prisma`. The connection URL is now configured via `prisma.config.ts` or passed via the `PrismaClient` constructor. The datasource block was simplified to:
```prisma
datasource db {
  provider = "postgresql"
}
```

### 3. Relation integrity (no changes needed)
The brief's Order↔Consult and Order↔Prescription relations are correctly modeled:
- `Order.consultId String? @unique` → `Order.consult Consult? @relation(...)` (Order owns FK, one-to-one optional)
- `Consult.order Order?` (back-relation, no fields/references needed — Prisma infers from the owning side)
- Same pattern for Prescription
These passed `prisma validate` without modification.

## Task-1 Fold-in Fix: prisma → devDependencies

`prisma` CLI moved from `dependencies` to `devDependencies` in `package.json`.  
`@prisma/client` remains in `dependencies` (runtime role).

Before:
```json
"dependencies": { "prisma": "^7.8.0", ... }
```
After:
```json
"devDependencies": { "prisma": "^7.8.0", ... }
```

## Files Changed

- `prisma/schema.prisma` — created (13 models, 4 enums)
- `test/schema.test.ts` — created (3 tests)
- `package.json` — moved prisma to devDependencies

## Migration Note

`prisma migrate dev` was NOT run — no PostgreSQL database is provisioned. The actual migration is a deferred follow-up requiring a `DATABASE_URL` connection. The schema is validated and the client generated successfully without a live DB.

## Concerns

- **Prisma 7 config migration**: The `datasource url` removal means `prisma migrate dev` and `prisma db push` will also need a `prisma.config.ts` file specifying the database URL/adapter. This should be addressed when provisioning the DB for Task-3+.
- **`StackItem` model**: Not tested by `schema.test.ts` (test checks for `model Stack` but not `model StackItem`). Both are present in the schema.
- **`prisma.config.ts`**: Not yet created. Prisma 7 migration commands will require it to specify the `DATABASE_URL`. Worth creating in the DB-provisioning task.
