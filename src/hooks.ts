import type { Reroute } from '@sveltejs/kit';

// const reroutes: Record<string, string> = {
//     '/isr': '/reroute-and-isr',
//     '/isr/__data.json?x-sveltekit-invalidated=01': '/reroute-and-isr/__data.json?x-sveltekit-invalidated=01',
//     '/reroute/no-isr': '/reroute-without-isr',
//     '/reroute/no-isr/__data.json?x-sveltekit-invalidated=01': '/reroute-without-isr/__data.json?x-sveltekit-invalidated=01',
//     '/no-ssr': '/reroute-without-ssr'
// }

// export const reroute: Reroute = ({ url }) => {
//     console.log("## REROUTE HOOK ##");
//     console.log("REROUTE HOOK href: ", url.href);
//     console.log("REROUTE HOOK pathname: ", url.pathname);

//     if (url.pathname in reroutes) {
//         return reroutes[url.pathname];
//     }

//     console.log("Not rerouted");
// }

// Testing another way of using reroute hooks

export const reroute: Reroute = ({ url }) => {
	console.log('## REROUTE HOOK ##');
	console.log('REROUTE HOOK href: ', url.href);
	console.log('REROUTE HOOK origin: ', url.origin);
	console.log('REROUTE HOOK pathname: ', url.pathname);

	const origin = url.origin;

	// match domain pod-doc-svelte-{version}.vercel.app
	const version = origin.match(/pod-doc-svelte-(v\d+)\.vercel\.app/)?.[1];

	if (version) {
		console.log('Rerouted to version: ', version);
		return `/${version}${url.pathname}`;
	}

	console.log('Not rerouted');
};
