import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	// const version = Subdomain.test(url);
	// if (version) {
	// 	return { version };
	// }
	throw redirect(302, '/v1');
}) satisfies PageServerLoad;
