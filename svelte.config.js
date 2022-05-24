import adapter from '@sveltejs/adapter-auto';
import autoprefixer from 'autoprefixer';
import dsv from '@rollup/plugin-dsv';
import path from 'path';
import sveltePreprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import rehypeWrap from 'rehype-wrap';

/** @type {import('@sveltejs/kit').Config} */

export default {
  extensions: ['.svelte', '.md'],
  kit: {
    adapter: adapter(),
    vite: {
      plugins: [dsv()],
      resolve: {
        // Set alias for top-level folders in the src folder
        alias: {
          $actions: path.resolve('./src/actions'),
          $components: path.resolve('./src/components'),
          $data: path.resolve('./src/data'),
          $functions: path.resolve('./src/functions'),
          $stores: path.resolve('./src/stores'),
          $styles: path.resolve('./src/styles'),
        },
      },
    },
  },
  preprocess: [
    sveltePreprocess({
      // Rename the default name of the markup tag from <template> to <markup>
      markupTagName: 'markup',
      postcss: {
        plugins: [autoprefixer],
      },
      scss: {
        // Import the SCSS constants file at the top every SCSS style definition
        prependData: `@import 'src/styles/constants.scss';`,
      },
    }),
    // Enable writing Svelte components in Markdown
    mdsvex({
      extensions: ['.md'],
      // Wrap Markdown content in div with class .markdown
      rehypePlugins: [[rehypeWrap, { wrapper: 'div.markdown' }]],
    }),
  ],
};
