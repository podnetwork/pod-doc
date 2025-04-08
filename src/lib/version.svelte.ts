import { goto } from '$app/navigation';
import { page } from '$app/state';
import { PUBLIC_NODE_ENV } from '$env/static/public';
import type { App } from '$lib/app.svelte';

const domainVercelRegex = /^https?:\/\/pod-doc-svelte-(v\d+)\.vercel\.app/;

// production domains should be format {version}.pod-doc.com
const domainRegex = /^https?:\/\/([\w-]+)\.pod-doc\.com/;

export class Version {
	constructor(private readonly app: App) {}

	static getFromSubdomain(url: string) {
		const v = domainRegex.exec(url);
		if (v) return v[1];
		const v2 = domainVercelRegex.exec(url);
		if (v2) return v2[1];
		return void 0;
	}

	get fromSubdomain() {
		return Version.getFromSubdomain(page.url.origin);
	}

	get fromUrl() {
		return page.url.pathname.split('/')[1] || void 0;
	}

	get version() {
		return this.fromSubdomain ?? this.fromUrl ?? void 0;
	}

	get versionDetail() {
		return this.app.auth.versions.find((v) => `v${v.v_number}` === this.version) ?? void 0;
	}

	goToVersion(version: string) {
		// get path name of current url
		const pathname = page.url.pathname;

		const env = PUBLIC_NODE_ENV;

		if (env === 'local') {
			// remove / and version is first segment
			const segments = pathname.split('/').filter(Boolean);

			if (segments.length > 0) {
				// remove first segment
				const newSegments = segments.slice(1);
				// add version
				newSegments.unshift(version);
				// join segments
				const newPathname = `/${newSegments.join('/')}`;
				goto(newPathname);
				return;
			}

			goto(`/${version}`);
			return;
		}

		// staging or production
		const versionInfo = this.app.auth.versions.find((i) => `v${i.v_number}` === version);
		if (!versionInfo) {
			throw new Error(`Version ${version} not found`);
		}

		// choose domain base on env
		if (env === 'dev') {
			window.location.href = `${versionInfo.domain_dev}${pathname}`;
			return;
		}

		window.location.href = `${versionInfo.domain}${pathname}`;
		return;
	}
}
