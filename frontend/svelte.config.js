import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',   // where HTML/JS/CSS go
      assets: 'build',
      fallback: 'index.html', // single-page-app fallback
      precompress: true       // create .br/.gz files (optional)
      // strict is automatically disabled when fallback is set
    }),

    // optional but handy when you rely on client routing
    // trailingSlash: 'never',

    // If prerendering gives you ‘not all pages were prerendered’
    // warnings, disable the crawl:
    // prerender: { crawl: false }
  }
};

export default config;
