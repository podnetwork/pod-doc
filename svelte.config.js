import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkAbbr from 'remark-abbr';
import normalizeMarkdown from './src/lib/md/normalize-md-preprocess/index.js';
import { remarkPlugins } from './src/lib/md/remark/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		normalizeMarkdown(),
		mdsvex({
			extensions: ['.md', '.svx'],
			layout: {
				simple: new URL('./src/lib/mdlayouts/simple.svelte', import.meta.url).pathname,
				single: new URL('./src/lib/mdlayouts/single.svelte', import.meta.url).pathname,
				blank: new URL('./src/lib/mdlayouts/blank.svelte', import.meta.url).pathname
			},
			highlight: {
				// highlighter: highlighter
			},
			remarkPlugins: [remarkAbbr, ...remarkPlugins],
			rehypePlugins: [
				[rehypeSlug, { prefix: 'anchor-' }]
				// rehypeCodeBlock,
				// rehypeHTMLMap,
				// rehypeGridstack,
			]
		})
	],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
