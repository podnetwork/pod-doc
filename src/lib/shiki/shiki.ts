import { defer, from, map, shareReplay } from 'rxjs';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// note:
// having other version of shiki instance defined in svelte.config.js
export const shikiEngine = createHighlighterCore({
	themes: [
		import('@shikijs/themes/one-light'),
		import('@shikijs/themes/ayu-dark')
	],
	langs: [
		import('@shikijs/langs/typescript'),
		import('@shikijs/langs/javascript'),
		import('@shikijs/langs/html'),
		import('@shikijs/langs/css'),
		import('@shikijs/langs/json'),
		import('@shikijs/langs/xml'),
		import('@shikijs/langs/python'),
		import('@shikijs/langs/bash'),
		import('@shikijs/langs/rust'),
		import('@shikijs/langs/toml')
	],
	engine: createJavaScriptRegexEngine()
});

export class Shiki {
	static themes = {
		light: 'one-light',
		dark: 'ayu-dark'
	};

	static engine$ = defer(() => from(shikiEngine)).pipe(shareReplay(1));

	static render(lang: string, code: string) {
		return this.engine$.pipe(
			map((shiki) =>
				shiki.codeToHtml(code, {
					defaultColor: false,
					structure: 'classic',
					lang,
					themes: this.themes
				})
			)
		);
	}
}
