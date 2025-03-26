import { page } from '$app/state';
import { getContext, setContext } from 'svelte';
import { Subdomain } from './subdomain';

export class App {
	static sid = Symbol.for('app');

	static create() {
		return setContext(this.sid, new this());
	}

	static get() {
		return getContext<App>(this.sid);
	}

	// get from params (local domain) or subdomain (production domain)
	version = $derived(page.url.pathname.split('/')[1] ?? Subdomain.test(page.url));
}
