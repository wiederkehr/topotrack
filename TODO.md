# Development Backlog

## Features

### Activity Upload

- [ ] Add activity gpx upload in addition to Strava activities

### Activity Search

- [ ] Add activity search via Strava API

### Composer Input

- [ ] Add variables randomizer
- [ ] Add collapsable / expandable modules for composer inputs
- [ ] Add mini color glyphs for variable presets dropdown
- [ ] Add text input fields to composer for overriding text elements (name, type, distance, elevation, time, etc.)

## Templates

### Combo Template

- [ ] Create new template that consolidates templates into one rendering with variants: static 2d, animated 2d, static 3d, animated 3d
  - [ ] Canvas rendering for exporting as animated mp4
  - [ ] Mapbox tiles for 3d map and 3d contour lines

### Static Template

- [ ] Add primary photo as background
- [ ] Add image upload for background
- [ ] Add new layout for static template
- [ ] Add path animation for static template
- [ ] Add contour lines via elevation data tiles from Mapbox using d3.contour
- [ ] Convert static template from svg to canvas for animation and video export

### Flyover Template

- [ ] Fix flyover template
- [ ] Fix reload map after setFormat
- [ ] Adjust animation speed based on activity duration (real speed instead of linear interpolation)
- [ ] Adjust total animation duration to fixed duration optimized for Instagram

### Export

- [ ] Add mpg export for canvas animations (flyover template)
- [ ] Add mpg export for svg / canvas animations (static template)

### User Settings

- [ ] Add user settings for units (metric and imperial)
- [ ] Add protected routes for functionalitzies only accessible to authorized users
- [ ] Implement user directory of authorized users (minimalist approach using list of authorized user IDs)

## Technical Improvements

- [ ] Add error boundaries for graceful errors (error.ts)
- [ ] Add suspense for loading states with skeleton components (loading.ts)
- [ ] Add zod for data validation
- [ ] Caching strategy for activity data
- [ ] Accessibility improvements
- [ ] Template variable validation

## Technical Refactoring

- [x] Refactor composer state management
- [ ] Consolidate export functions
- [ ] Improve TypeScript coverage
- [ ] Add comprehensive error boundaries
- [ ] Optimize bundle size
- [ ] Add comprehensive test coverage

## Infrastructure

- [ ] Add Storybook as component workbench
- [ ] Add Vercel analytics
- [ ] Add Vercel speed insights

## Documentation

- [ ]

## Bugs

- [ ]
