import { getContext, setContext } from 'svelte';
import { Auth } from './auth/auth.svelte';
import { Version } from './version.svelte';

export class App {
	constructor() {}

	static sid = Symbol.for('app');

	static create() {
		return setContext(this.sid, new this());
	}

	static get() {
		return getContext<App>(this.sid);
	}

	version = new Version(this);

	// for mapping url
	versionUrl(path: string) {
		if (this.version.fromLatestDomain) return path; // support subdomain (online)
		if (this.version.fromSubdomain) return path; // support subdomain (online)
		return `/${this.version.fromUrl}${path}`; // support param (local)
	}

	// AUTH
	auth = new Auth(this);
}
