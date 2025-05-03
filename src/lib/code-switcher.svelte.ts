import type { App } from './app.svelte';
import transformedData from './transformed-data.json';

const t = transformedData as unknown as TransformedData;

type TransformedData = {
	[version: string]: {
		langs: CodeInfo[];
		menu: any[];
	};
};

interface CodeInfo {
	lang: string;
	label: string;
	default?: boolean;
}

export class CodeSwitcher {
	constructor(private readonly app: App) {
		this.languages = t[this.app.version.version as keyof TransformedData].langs;
	}

	current = $state('js');

	languages = $state<CodeInfo[]>([]);
}
