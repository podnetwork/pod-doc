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

	checkVersion() {
		const fromParam = page.url.pathname.split('/')[1];

		console.log('fromParam', fromParam);

		if (fromParam.length > 0) {
			return fromParam;
		}

		const fromSubdomain = Subdomain.test(page.url);

		console.log('fromSubdomain', fromSubdomain);

		if (fromSubdomain) {
			return fromSubdomain;
		}
	}

	// not accept empty
	versionFromParam = $derived.by(() => {
		const str = page.url.pathname.split('/')[1];
		if (str.length > 0) return str;
		return void 0;
	});

	versionFromSubdomain = $derived.by(() => {
		const str = Subdomain.test(page.url);
		if (str) return str;
		return void 0;
	});

	// get from params (local domain) or subdomain (production domain)
	version = $derived.by(() => this.versionFromParam ?? this.versionFromSubdomain);

	// for mapping url
	mapWithVersion(path: string) {
		if (this.versionFromSubdomain) return path; // support subdomain (online)
		return `/${this.versionFromParam}${path}`; // support param (local)
	}
}
