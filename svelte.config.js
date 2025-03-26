import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkAbbr from 'remark-abbr';
import { highlighter, rehypeCodeBlock } from './src/lib/components/pod/codeblock/plugin.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			layout: {
				simple: './src/lib/mdlayouts/simple.svelte',
				single: './src/lib/mdlayouts/single.svelte',
				blank: './src/lib/mdlayouts/blank.svelte'
			},
			highlight: {
				highlighter: highlighter
			},
			remarkPlugins: [remarkAbbr],
			rehypePlugins: [rehypeSlug, rehypeCodeBlock]
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
