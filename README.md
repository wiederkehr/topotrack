## Development

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing

This project uses [Vitest](https://vitest.dev/) for testing with React Testing Library.

**Run tests in watch mode:**

```bash
yarn test
```

**Run tests once (CI mode):**

```bash
yarn test --run
```

**Run tests with coverage:**

```bash
yarn test:coverage
```

**Run tests with UI:**

```bash
yarn test:ui
```

**Writing Tests:**

- Unit tests: Place `.test.ts` files next to the code they test
- Component tests: Use React Testing Library for component testing
- Test utilities: Located in `src/functions/format/`, `src/functions/destructure/`
- Example: See `src/functions/format/formatMeters.test.ts`

### Code Quality

**Type checking:**

```bash
yarn type-check
```

**Linting:**

```bash
yarn lint
```

**Build:**

```bash
yarn build
```

Before committing, ensure all quality checks pass:

```bash
yarn type-check && yarn lint && yarn test --run
```

### Git Workflow

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks and [lint-staged](https://github.com/lint-staged/lint-staged) to ensure code quality.

**Pre-commit Hooks:**

When you commit, the following automated checks run:

1. **Type check** - Validates TypeScript types across the entire codebase
2. **Lint & Format** - Fixes linting issues and formats staged files
3. **Test related files** - Runs tests for files affected by your changes

**Committing Changes:**

```bash
git add .
git commit -m "your message"
```

The pre-commit hook will automatically:

- Run type checking
- Fix ESLint issues on staged files
- Format code with Prettier
- Run tests related to changed files

If any check fails, the commit will be blocked. Fix the issues and try again.

**Bypassing hooks (not recommended):**

```bash
git commit --no-verify -m "your message"
```

Only use `--no-verify` in exceptional circumstances, as it skips all quality checks.

### Environment Variables

This project uses [Zod](https://zod.dev/) and [@t3-oss/env-nextjs](https://env.t3.gg/) for type-safe environment variable validation.

**Setup:**

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `AUTH_STRAVA_ID` & `AUTH_STRAVA_SECRET`: Get from [Strava API settings](https://www.strava.com/settings/api)
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Get from [Mapbox account](https://account.mapbox.com/access-tokens/)

**Environment validation:**

- All environment variables are validated at build/runtime via `src/env.ts`
- Missing or invalid variables will cause the build to fail
- Server-only variables (without `NEXT_PUBLIC_` prefix) are never exposed to the browser
- Client variables (with `NEXT_PUBLIC_` prefix) are safe to expose

**Required variables:**

- `AUTH_SECRET` - NextAuth.js secret key
- `AUTH_STRAVA_ID` - Strava OAuth client ID
- `AUTH_STRAVA_SECRET` - Strava OAuth client secret
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox public access token

## Dependencies

- [React](https://react.dev/)
- [Next](https://nextjs.org/)
- [Radix](https://www.radix-ui.com/)

## Deployment

This application is deployed on [Vercel](https://vercel.com/benjamin-wiederkehr/topotrack) and available on the domain [topotrack.vercel.app](https://topotrack.vercel.app).
