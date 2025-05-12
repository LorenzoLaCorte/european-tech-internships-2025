import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      // default options are usually fine:
      // out: 'build'
    }),

    // If you’d previously set `fallback`/`prerender`, you can remove those:
    // trailingSlash, prerender, etc can stay at their defaults.
  }
};

export default config;
