import { PUBLIC_NODE_ENV } from '$env/static/public';
import { Version } from '$lib/version.svelte';
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	// with local, use origin url
	if (!PUBLIC_NODE_ENV || PUBLIC_NODE_ENV === 'local') {
		return;
	}

	// catch route not doc
	const whitelist = ['api', 'internal'];

	const firstSegment = url.pathname.split('/')[1];

	if (whitelist.includes(firstSegment)) {
		return;
	}

	// console.log('## REROUTE HOOK ##');
	// console.log('REROUTE HOOK href: ', url.href);
	// console.log('REROUTE HOOK origin: ', url.origin);
	// console.log('REROUTE HOOK pathname: ', url.pathname);

	// match domain pod-doc-svelte-{version}.vercel.app
	const version = Version.getFromSubdomain(url.origin);

	if (version) {
		// console.log('Rerouted to version: ', version);
		return `/${version}${url.pathname}`;
	}

	// catch the case domain match static is latest version
	if (url.origin === 'https://pod-doc-svelte.vercel.app') {
		return `/latest${url.pathname}`;
	}

	// uncatched, assume running on local

	console.log('Not rerouted');
};
