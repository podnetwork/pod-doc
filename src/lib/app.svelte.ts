import { PUBLIC_NODE_ENV } from '$env/static/public';
import { getContext, setContext } from 'svelte';
import { Auth } from './auth/auth.svelte';
import { CodeSwitcher } from './code-switcher.svelte';
import { Version2 } from './version2.svelte';

export class App {
	static sid = Symbol.for('app');

	static create() {
		return setContext(this.sid, new this());
	}

	static get() {
		return getContext<App>(this.sid);
	}

	constructor() {}

	get isLocal() {
		return PUBLIC_NODE_ENV === 'local';
	}

	version2 = new Version2(this);

	// AUTH
	auth = new Auth(this);

	// CODE SWITCHER
	codeSwitcher = new CodeSwitcher(this);
}
