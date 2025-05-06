/// version control v2
/// start from 2025-05-04: subdomain strategy is only solution for separate version.
/// local site fix to single version is `local`.

import { page } from '$app/state';
import { PUBLIC_LATEST_DOMAIN, PUBLIC_NODE_ENV } from '$env/static/public';
import type { App } from './app.svelte';
import type { AuthVerifyUser } from './auth/verify-user';

export const LocalVersion = 'local';
export const LatestVersion = 'latest';

export class Version2 {
	// subdomain strategy
	// this support online site
	static domains = [
		['latest', PUBLIC_LATEST_DOMAIN],
		// production domains should be format {version}.docs.dev.pod.network
		['subdomain', /^https?:\/\/(\d+)\.docs\.dev\.pod\.network/],
		// vercel domains should be format pod-doc-svelte-(v\d+)\.vercel\.app
		['vercel', /^https?:\/\/pod-doc-svelte-(v\d+)\.vercel\.app/]
	] as [string, string | RegExp][];

	// manual check
	static fromUrl(url: string) {
		if (PUBLIC_NODE_ENV === 'local') return LocalVersion;

		// get origin from url
		const origin = new URL(url).origin;

		for (const [type, str] of Version2.domains) {
			if (typeof str === 'string') {
				if (str === origin) return type;
				continue;
			}

			const matched = str.exec(origin);
			// if matched, return matche version from regex
			if (matched) return matched[1];
		}

		throw new Error(`Version not found for url: ${url}`);
	}

	constructor(private readonly app: App) {}

	// in-app version check
	version = $derived.by(() => {
		const v = Version2.fromUrl(page.url.href);
		return v;
	});

	// versions from supabase , which can access
	versions = $state<AuthVerifyUser['versions']>([]);

	// current version object, this passed from auth class
	detail = $derived.by(() => {
		if (this.version === LocalVersion)
			return this.versions.find((i) => i.v_number === LocalVersion);
		if (this.version === LatestVersion) return this.versions.find((i) => i.is_latest);
		return this.versions.find((i) => i.v_number === this.version);
	});
}
