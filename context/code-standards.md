# Dorovu — Code Standards

## Architecture Pattern
MVC — Thin Controller / Fat Service

Route → Middleware → Controller → Service → Prisma → Response


- Controllers: only parse request + call service + send response
- Services: ALL business logic, DB queries, error throwing
- Routes: only wire URLs to controllers, nothing else

## TypeScript
- Strict mode always on — no `any` type ever
- Prefer `interface` for object shapes, `type` for unions/aliases
- Always type function return values explicitly
- Import types with `import type { X }` when only used as a type

## Naming Conventions
- Files: `kebab-case` → `auth.service.ts`, `product.controller.ts`
- React components: `PascalCase` → `ProductCard.tsx`
- Variables and functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Prisma model fields: `camelCase`
- Database columns: `snake_case` (Prisma maps automatically)
- Zod schemas: `PascalCase` + `Schema` suffix → `CreateProductSchema`
- DTO types: `PascalCase` + `DTO` suffix → `CreateProductDTO`

## File Structure Rules
- One controller per resource (auth, product, order, crafter, payment)
- One service per resource
- One route file per resource
- Components go in `components/<feature>/ComponentName.tsx`
- Hooks go in `hooks/use-feature-name.ts`
- Zustand stores go in `store/feature.store.ts`

## Error Handling (Backend)
Always use AppError for expected errors:
```ts
throw new AppError(404, 'Product not found')
throw new AppError(400, 'Email already in use')
throw new AppError(403, 'You do not own this product')
```
Never expose raw error messages to client.
Always call next(err) in controllers — never catch and swallow.

## API Response Shape
Success:
```json
{ "data": {}, "message": "optional success message" }
```
Error:
```json
{ "message": "Human readable error" }
```

## Validation
- Always validate request body with Zod before using it
- Use schemas from `@dorovu/shared`
- Parse with `.parse()` — it throws ZodError which errorHandler catches

```ts
const data = CreateProductSchema.parse(req.body)
```

## Authentication
- JWT stored in httpOnly cookies only — never localStorage
- Cookie names: `accessToken`, `refreshToken`
- Always use `authenticate` middleware before role checks
- Role check always comes after authenticate:
```ts
router.post('/products', authenticate, requireRole('CRAFTER'), controller.create)
```

## Prisma Rules
- Never instantiate `new PrismaClient()` — import from `src/lib/prisma.ts`
- Always run `npx prisma migrate dev --name <description>` after schema change
- Always run `npx prisma generate` after migration
- Use transactions for operations that touch multiple tables:
```ts
await prisma.$transaction([...])
```

## Frontend Rules
- Use TanStack Query for ALL server data fetching — no raw fetch/axios in components
- Use Zustand only for client-side state (cart, UI state)
- Never call API directly from a page — use a custom hook
- Forms use React Hook Form + Zod resolver
- Never modify files in `components/ui/` — shadcn managed

## Import Order
1. Node built-ins (`path`, `fs`)
2. External packages (`express`, `prisma`)
3. Internal packages (`@dorovu/shared`)
4. Local relative imports (`../services/auth.service`)

## Comments
- Write comments for WHY, not WHAT
- Complex business logic must have a comment explaining the rule
- No commented-out code in commits
