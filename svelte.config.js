import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkAbbr from 'remark-abbr';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import remarkTransformDirective from './remark/remark-transform-directive.js';

// note:
// having other version of shiki instance defined in $lib and used within app
const highlighter = await createHighlighterCore({
	themes: [import('@shikijs/themes/one-light'), import('@shikijs/themes/ayu-dark')],
	langs: [
		import('@shikijs/langs/typescript'),
		import('@shikijs/langs/javascript'),
		import('@shikijs/langs/html'),
		import('@shikijs/langs/css'),
		import('@shikijs/langs/json'),
		import('@shikijs/langs/xml'),
		import('@shikijs/langs/python'),
		import('@shikijs/langs/bash'),
		import('@shikijs/langs/rust')
	],
	engine: createJavaScriptRegexEngine()
});

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
				highlighter: async (code, lang = 'text') => {
					let cls = '';
					if (lang.includes(':')) {
						const [realLange, customId] = lang.split(':');
						lang = realLange;
						cls = customId;
					}

					const html = escapeSvelte(
						highlighter.codeToHtml(code, {
							lang,
							defaultColor: false,
							themes: {
								light: 'one-light',
								dark: 'ayu-dark'
							},
							structure: 'classic',
							meta: {
								'data-lang': cls
							}
						})
					);
					return `{@html \`${html}\` }`;
				}
			},
			remarkPlugins: [remarkAbbr, remarkTransformDirective],
			rehypePlugins: [
				rehypeSlug
				// codeTitle
				// [
				// 	rehypeAutolinkHeadings,
				// 	{
				// 		// behavior: 'wrap'
				// 		behavior: 'behavior'
				// 	}
				// ]
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
