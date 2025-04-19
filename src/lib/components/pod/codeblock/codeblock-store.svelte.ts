import { getContext, setContext } from 'svelte';

export interface CodeBlock {
    id: string;
	lang: string;
	code: string;
	alias?: string;
}

export class CodeblockStore {
	static sid = Symbol.for('codeblock-store');

	static create() {
		return setContext(this.sid, new CodeblockStore());
	}

	static get() {
		return getContext<CodeblockStore>(this.sid);
	}

	constructor() {}

	codeblocks = $state<CodeBlock[]>([]);

    title = $state('')

    runCode?: () => Promise<Response>;
}
