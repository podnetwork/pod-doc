import { PUBLIC_NODE_ENV } from '$env/static/public';
import { Version2 } from '$lib/version2.svelte';
import type { Reroute } from '@sveltejs/kit';

const isLocal = PUBLIC_NODE_ENV === 'local';

// exclude from rewrite url if first segment of url match this list
const whitelist = ['/api', '/internal'];

// from 2025-05-04: subdomain strategy is only solution for separate version.
// with local, fixed to version `local`
export const reroute: Reroute = ({ url }) => {
	// console.log('## REROUTE HOOK ##');
	// console.log('REROUTE HOOK href: ', url.href);
	// console.log('REROUTE HOOK origin: ', url.origin);
	// console.log('REROUTE HOOK pathname: ', url.pathname);

	if (whitelist.some((i) => url.pathname.startsWith(i))) {
		return;
	}

	// with local, redirect all to version `local`
	if (isLocal) {
		return `/local${url.pathname}`;
	}

	// match domain pod-doc-svelte-{version}.vercel.app
	const version = Version2.fromUrl(url.href);

	return `/${version}${url.pathname}`;
};
