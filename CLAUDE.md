# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development

- `yarn dev` - Start development server with Turbopack (available at http://localhost:3000)
- `yarn build` - Type check and build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking only

### Package Manager

This project uses Yarn as the package manager (yarn.lock present).

## Architecture Overview

TopoTrack is a Next.js application for visualizing Strava activities with customizable templates and export capabilities.

### Core Application Flow

1. **Authentication**: Strava OAuth integration via NextAuth.js (`src/auth/`)
2. **Data Flow**: Authenticated users access `/composer` page, unauthenticated users see `/` (home)
3. **Main Feature**: Composer interface for selecting activities, applying templates, and exporting visualizations

### Key Directories

#### `/src/features/`

- **`composer/`**: Main application feature - activity visualization composer
  - `input/`: User controls (activity selection, template/preset selection, search, export)
  - `output/`: Visualization rendering (canvas, figure components)
- **`templates/`**: Visualization templates system
  - Template components with presets and configurable variables
  - Currently includes `templateStatic` with plans for `templateAnimation` and `templateDebug`
- **`home/`**: Landing page for unauthenticated users

#### `/src/hooks/`

- `useStravaActivities.ts`: Fetch paginated Strava activities with SWR
- `useStravaActivity.ts`: Fetch detailed activity data (streams)
- `useGetAddress.ts`: Reverse geocoding for activity locations
- `useGetElevation.ts`: Elevation data fetching

#### `/src/functions/`

- **`export/`**: Export functionality (unified `exportNode` API for PNG, SVG, WebM)
- **`format/`**: Data formatting utilities (dates, distances, filenames)
- **`destructure/`**: Data transformation utilities for activities

#### `/src/components/`

- **`interface/`**: Reusable UI components (button, select, color picker, etc.)
- **`layout/`**: Layout components (cell, column, row)
- **`content/`**, **`header/`**, **`footer/`**: Page structure components

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Strava provider
- **UI Library**: Radix UI components and themes (use for new components instead of building from scratch)
- **Icons**: Lucide React (replacing Font Awesome)
- **Styling**: CSS Modules with CSS variables for theming
- **State Management**: Zustand for global state (`src/stores/`)
- **Data Fetching**: SWR for client-side data fetching
- **Maps**: Mapbox GL JS with React Map GL
- **Visualization**: D3.js, Turf.js for geospatial operations
- **Export**: html-to-image, html2canvas for image generation

### State Management Patterns

- **Local state**: React hooks (`useState`, `useReducer`) for component-local state
- **Server state**: SWR for API data caching and revalidation
- **Global state**: Zustand stores in `src/stores/` for complex cross-component state
  - `useActivityStore`: Activity selection, pagination, search
  - `useTemplateStore`: Template/preset/variable configuration
  - `useExportStore`: Export settings and state

### Data Types

Key TypeScript types defined in `/src/types/`:

- `ActivityType`: Basic Strava activity data
- `ActivityStreamsType`: Detailed activity streams (GPS, elevation, heart rate, etc.)
- `TemplateType`: Template configuration with presets and variables
- `RenderType`: Props passed to template render components

### Development Notes

- Uses TypeScript with strict type checking
- ESLint configuration includes TypeScript, Prettier, and custom import sorting
- CSS Modules for component-scoped styling
- Strava API integration requires proper OAuth scopes: "read,activity:read"
- **Prefer Next.js native solutions** over third-party alternatives when available
- **Light and dark mode support** - use CSS variables for colors, not absolute values

## Development Workflow

### Git Branch Strategy

**Main branch:**

- Production-ready code deployed to Vercel
- Always stable and tested
- Never commit directly - only merge via PRs

**Feature branches:**

- Short-lived branches for implementing issues
- Created from `main` for each GitHub issue
- Naming: `feature/XX-brief-description` (e.g., `feature/15-gpx-upload`)
- Merged back to `main` via PR
- Deleted after merge

### Before Starting Implementation

1. **Pick a GitHub Issue** - Pick assigned issues from the "Todo" column on the project board
2. **Move issue to "Doing" status** - Update the issue status on the project board to "Doing":

   ```bash
   # Get the project item ID for the issue
   ITEM_ID=$(gh project item-list 1 --owner wiederkehr --limit 50 --format json | \
     jq -r '.items[] | select(.content.number == ISSUE_NUMBER) | .id')

   # Move to "Doing" status
   gh project item-edit \
     --id "$ITEM_ID" \
     --project-id PVT_kwHNOyHOAFgQiA \
     --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
     --single-select-option-id 47fc9ee4
   ```

3. **Create feature branch from main**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/XX-brief-description
   ```
4. **Read the issue** - Understand requirements and acceptance criteria and ask any follow up questions
5. **Plan the approach** - Identify files to modify, new files to create, and potential edge cases and explain the implementation approach
6. **Check related code** - Review existing principles and code patterns for a consistent implementation

### Implementation Process

1. **Write code following existing patterns** (see Code Patterns section below)
2. **Commit regularly** with brief, descriptive messages
3. **Run quality checks frequently** during development:
   - `yarn type-check` - Catch type errors early
   - `yarn lint` - Fix linting issues
   - `yarn test` - Run tests in watch mode during development
4. **Write tests** for new functionality (unit tests for utilities, integration tests for hooks)
5. **Manual testing** - Test the feature in the browser at http://localhost:3000

### Before Creating PR

**Required checks** (enforced by pre-commit hooks):

- Type-check passes (`yarn type-check`)
- Linting passes (`yarn lint`)
- Tests pass (`yarn test --run`)
- Build succeeds (`yarn build`)

**Commit message format:**

- Keep messages brief but descriptive (e.g., "add gpx upload functionality")
- Use lowercase, imperative mood
- Don't include Claude co-author attribution

### Creating Pull Requests

1. **Push feature branch**:

   ```bash
   git push -u origin feature/XX-brief-description
   ```

2. **Create PR to main using gh CLI**:

   ```bash
   gh pr create --base main --title "[Feature]: Title" --body "Brief summary\n\nCloses #XX" --reviewer wiederkehr
   ```

3. **Move issue to "Review" status** - Update the issue status on the project board to "Review":

   ```bash
   # Get the project item ID (if not already set from step 2)
   ITEM_ID=$(gh project item-list 1 --owner wiederkehr --limit 50 --format json | \
     jq -r '.items[] | select(.content.number == ISSUE_NUMBER) | .id')

   # Move to "Review" status
   gh project item-edit \
     --id "$ITEM_ID" \
     --project-id PVT_kwHNOyHOAFgQiA \
     --field-id PVTSSF_lAHNOyHOAFgQiM4DhHth \
     --single-select-option-id 886aeac6
   ```

4. **Link PR to issue**: Include "Closes #XX" in PR description so merged PRs automatically close linked issues

5. **Keep PR descriptions brief**:

   - 1-2 sentence summary
   - Link to GitHub issue (Closes #XX)
   - Screenshots/videos for UI changes (if applicable)

6. **After PR is approved and merged**:
   Get ready for future development by checking out the main branch again and delete the local version of the previous feature branch.

   - Clean up local branch
   - Check out main branch

   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/XX-brief-description
   ```

### Project Board Management

For detailed documentation on managing the GitHub project board, including all project IDs, field IDs, and status option IDs, see [.github/project-commands.md](.github/project-commands.md).

**Quick reference:**

- Project Number: 1
- Owner: wiederkehr
- Status options: Backlog, Todo, Doing, Review, Done

## Code Patterns

### File Organization

**Components:**

- One component per file
- Place in appropriate feature directory (`src/features/`)
- Co-locate styles with components (CSS Modules)
- Export only what's needed

**Utilities:**

- Pure functions in `src/functions/`
- Group by purpose (format, destructure, export)
- Include tests next to the file (`*.test.ts`)

**Hooks:**

- Custom hooks in `src/hooks/`
- Follow `use*` naming convention
- Use SWR for data fetching

### Component Patterns

**File Structure:**

All components follow this standardized structure:

```
componentName/
  ├── componentName.tsx          # Component implementation
  ├── index.ts                   # Barrel file (re-exports)
  ├── componentName.module.css   # Component styles
  └── componentName.test.tsx     # Component tests
```

**React Components:**

```typescript
// componentName.tsx - ALWAYS use named exports
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Implementation
}

// Type props interface
interface ComponentProps {
  prop1: string;
  prop2: number;
}
```

**Barrel Files (index.ts):**

```typescript
// index.ts - Re-export using named exports
export { ComponentName } from "./componentName";

// For multiple exports
export { Module, Submodule } from "./module";
```

**Import Pattern:**

```typescript
// CORRECT - Named imports
import { Button } from "@/components/interface/button";
import { Module, Submodule } from "@/components/interface/module";

// INCORRECT - Default imports (do not use)
// import Button from '@/components/interface/button';  ❌
```

**Export Guidelines:**

- ✅ **ALWAYS use named exports** for components
- ✅ Named exports improve IDE support (autocomplete, refactoring)
- ✅ Named exports enforce consistent naming
- ✅ Named exports enable better tree-shaking
- ❌ **NEVER use default exports** for components (enforced by ESLint)
- ℹ️ Exception: Next.js App Router files (page.tsx, layout.tsx) require default exports

**Styling:**

- Use CSS Modules (`.module.css`)
- Import styles: `import styles from './componentName.module.css'`
- Use classnames library for conditional classes
- **Use CSS variables for colors** (not absolute values) to support light/dark mode
- Check existing CSS for color variable patterns

**Complex Components:**

- Break into subcomponents to keep files short
- Minimize logic in render functions
- Extract reusable logic into custom hooks

### Data Fetching

**Using SWR:**

```typescript
// Follow the pattern in useStravaActivities.ts and useStravaActivity.ts
const { data, error, isLoading } = useSWR(key, fetcher);
```

**API Routes:**

- Place in `src/app/api/`
- Use Next.js route handlers
- Include proper error handling and validation

### Type Safety

**Avoid `any`:**

- Use proper TypeScript types
- Create interfaces for complex data structures
- Use Zod for runtime validation

**Environment Variables:**

- Add new variables to `src/env.ts`
- Follow naming convention: `NEXT_PUBLIC_*` for client, no prefix for server
- Update `.env.example` with documentation

### State Management

**Local State:**

- Use `useState` for component-local state
- Use `useReducer` for complex state logic

**Global State (Zustand):**

- Use for complex cross-component state in `src/stores/`
- Follow existing store patterns (see `useActivityStore.ts`)
- Define interface with state and actions
- Keep stores focused on specific domains

**Server State:**

- Use SWR for API data caching
- Follow existing patterns in hooks

### Testing Patterns

**Unit Tests:**

```typescript
import { describe, expect, it } from "vitest";

describe("functionName", () => {
  it("describes what it tests", () => {
    expect(result).toBe(expected);
  });
});
```

**Component Tests:**

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Import Organization

Imports are auto-sorted by `eslint-plugin-simple-import-sort`:

1. External packages (react, next, etc.)
2. Internal imports (components, hooks, utils)
3. Type imports
4. CSS imports

## Quality Standards

### Type Safety

- **Zero `any` types** - Use `unknown` if type is truly unknown
- **Strict null checks** - Handle null/undefined cases explicitly
- **Type imports** - Use `import type` for type-only imports

### Code Style

- **Formatting** - Prettier handles all formatting automatically
- **Naming** - Use descriptive names, prefer clarity over brevity
- **Comments** - Explain "why" not "what", keep them updated

### Testing

- **Unit tests** - Test pure functions in `src/functions/`
- **Integration tests** - Test hooks with mocked APIs
- **Component tests** - Test user-facing behavior, not implementation
- **Coverage goal** - Aim for 70%+ coverage on new code

### Performance

- **Lazy loading** - Use dynamic imports for large components
- **Memoization** - Use `useMemo`/`useCallback` only when needed (measure first)
- **Bundle size** - Monitor impact of new dependencies

## Error Handling

### Client-Side Errors

- Use error boundaries (Next.js `error.tsx`)
- Provide user-friendly error messages
- Log errors for debugging

### Server-Side Errors

- Return appropriate HTTP status codes
- Include error messages in response
- Validate input data with Zod

### API Errors

- Handle network failures gracefully
- Show loading states during requests
- Retry failed requests where appropriate (SWR handles this)

## Git Workflow

### Branch Strategy

- **main** - Production-ready code (deployed to Vercel)
- **feature/** - Feature branches created from main for each issue

### Commit Requirements

All commits must:

1. Pass type-check
2. Pass linting (auto-fixed on commit)
3. Pass related tests
4. Be properly formatted (auto-formatted on commit)

### Pull Request Workflow

1. Create feature branch from `main`
2. Implement feature following this guide
3. Ensure all quality checks pass
4. Create PR to `main` with descriptive summary
5. Wait for review and Vercel staging deployment
6. Address feedback if any
7. Merge to `main` when approved

## Common Tasks

### Adding a New Template

1. Create template directory in `src/features/templates/`
2. Follow structure of existing templates (templateStatic)
3. Include: component, presets, variables, types
4. Register in template system
5. Add tests for template rendering

### Adding a New Hook

1. Create file in `src/hooks/` following `use*.ts` naming
2. Use SWR if fetching data
3. Include proper TypeScript types
4. Write integration tests with mocked API
5. Export from hooks directory if needed

### Adding a New Utility Function

1. Create file in appropriate `src/functions/` subdirectory
2. Write pure function with clear input/output types
3. Create test file (`*.test.ts`) with comprehensive coverage
4. Export from index.ts in that directory

### Adding UI Components

1. Create component in `src/components/interface/`
2. **Use Radix UI components** instead of building from scratch (buttons, dialogs, dropdowns, etc.)
3. **Use Lucide React for icons** (https://lucide.dev/guide/packages/lucide-react) - replacing Font Awesome
4. Style with CSS Modules using CSS variables for colors
5. Break complex components into subcomponents
6. Include TypeScript prop types
7. Write component tests

### Adding Environment Variables

1. Add to `src/env.ts` with Zod validation
2. Update `.env.example` with description
3. Update README.md if user-facing
4. Test that validation works

## Troubleshooting

### Type Errors

- Run `yarn type-check` to see all type errors
- Check `src/types/` for type definitions
- Ensure imports are correct

### Test Failures

- Run `yarn test` to see failing tests
- Check test file for assertion details
- Use `yarn test:ui` for interactive debugging

### Build Failures

- Run `yarn build` to reproduce
- Check environment variables are set
- Review error messages for missing dependencies

### Pre-commit Hook Failures

- Review the specific check that failed
- Fix the issue and commit again
- Don't use `--no-verify` unless absolutely necessary
