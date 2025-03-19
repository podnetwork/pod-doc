import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		...buildClerkProps(locals.auth)
	};
}) satisfies LayoutServerLoad;
