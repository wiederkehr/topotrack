# Data Visualization Starterkit

## Features

### Frameworks

- ✅ Svelte as component framework
- ✅ SvelteKit as application framework

### Compilers and Transpilters

- ✅ svelte-preprocess for transforming JS and CSS supersets
- ✅ Sass as CSS superset
- ✅ TypeScript as JS superset
- ✅ PostCSS for transforming CSS styles
- ✅ PostCSS with autoprefixer to add vendor prefixes to CSS rules

### Libraries

- ✅ Lodash for convenience functions
- ✅ D3 for building custom, advanced charts
- ✅ Plot for building standard, basic charts
- ✅ [Chroma](https://github.com/gka/chroma.js/) for working with color
- ✅ [Feather Icons](https://github.com/feathericons/feather) for user interface icons
- ✅ [Textures](https://github.com/riccardoscalco/textures) for working with textures
- ✅ [Tidy](https://github.com/pbeshai/tidy) for working with data
- ✅ [SVGCrowbar](https://github.com/cy6erskunk/svg-crowbar) for exporting static assets like SVG and PNG
- ✅ [Math.js](https://github.com/josdejong/mathjs) for math
- ✅ [Flatten.js](https://github.com/alexbol99/flatten-js) for geometry
- ✅ [Day-fns.js](https://github.com/date-fns/date-fns) for working with dates
- ✅ [MDSvex](https://mdsvex.com/) for working with Markdown
- 🔄 [Something] for user interface elements
  - [Inclusive Components](https://inclusive-components.design/)
  - [Accessible Components](https://github.com/scottaohara/accessible_components)

### Structure

- ✅ Basic Folder structure
  - ✅ Folder _src/actions_ for `use` actions for components
  - ✅ Folder _src/components_ for components
  - ✅ Folder _src/data_ for storing static data files
  - ✅ Folder _src/routes_ for pages
  - ✅ Folder _src/stores_ for stores of data
  - ✅ Folder _src/functions_ for utility functions
- ✅ Basic CSS file structure
  - ✅ File _src/styles/app_ for importing all following files
  - ✅ File _src/styles/base_ for root CSS styling
  - ✅ File _src/styles/constants_ for CSS and JS constants
  - ✅ File _src/styles/fonts_ for @font-face declarations
  - ✅ File _src/styles/reset_ for CSS style reset across browsers
  - ✅ File _src/styles/variables_ for CSS variables
- 🅾️ Basic README structure

### Code

- ✅ Prettier configuration for CSS, JS, Svelte

### Infrastructure

- 🅾️ Deployment on Github Pages
- 🅾️ Deployment on Vercel

### Misc

- ✅ Vite configuration for loading CSV and TSV files

### Components and Recipes

- ✅ Data loading
- ✅ Data exporting
- ✅ Chart component
- ✅ Custom fonts from Google Fonts
- ✅ Sticky chart layout
- ✅ Theme toggle with localStorage
- ✅ SVG exporting
- ✅ Interface component
- 🅾️ Search with autocomplete

### Stores

- ✅ Store for width and height of the viewport
- ✅ Store for media queries
- ✅ Store for theme
- ✅ Store state as URL parameter
- 🔄 Store for user interface state

### Actions

- ✅ Action for checking if a component is in the viewport
- ✅ Action for checking if the user clicked outside a component

## Development

Start a development server:

```bash
yarn dev
```

Or start the server and open the app in a new browser tab:

```bash
yarn dev --open
```

## Building

To create a production build:

```bash
yarn build
```

To preview the production build:

```bash
yarn preview
```

## Deployment

Install an [adapter](https://kit.svelte.dev/docs#adapters) for the target environment.
