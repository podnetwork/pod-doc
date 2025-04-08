import { PUBLIC_NODE_ENV } from '$env/static/public';
import type { AuthVerifyUser } from '$lib/auth/verify-user';
import { SupabaseServer } from '$lib/supabase/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface Payload {
	clerk_id?: string;
	twitter_id?: string;
	github_id?: string;
	access_version?: string;

	first_name?: string;
	last_name?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json()) as Payload;

	const s = SupabaseServer.lib;

	// if clerk id empty then fetch directly pod_version folder
	if (!payload.clerk_id) {
		const versions = await s
			.from('pod_versions')
			.select('*')
			.eq('is_locked', false)
			.eq('is_active', true);

		if (versions.error) {
			console.error(versions.error);
			throw error(400, versions.error.message);

			// error type
			/* 
			VERSION_NOT_EXISTS: version not defined in system
			VERSION_LOCKED: versions is locked (pod_versions)
			VERSION_DEACTIVATE: version is deactivate (pod_versions)
			VERSION_DISABLED: version is disabled (user_access_version)
			*/
		}

		return json({
			versions: versions.data,
			user: null
		});
	}

	// build RPC payload
	const rpcPayload = {
		want_version_param: payload.access_version,
		clerk_id_param: payload.clerk_id,
		twitter_id_param: payload.twitter_id,
		github_id_param: payload.github_id,
		user_metadata_param: {
			first_name: payload.first_name,
			last_name: payload.last_name
		}
	};

	const isProd = PUBLIC_NODE_ENV == 'prod';

	const result = await s.rpc(
		isProd ? 'pod_doc_user_verify' : 'pod_doc_user_verify_dev',
		rpcPayload
	);

	if (result.error) {
		console.error(result.error);
		throw error(400, `User verify failed: ${result.error.message}`);
	}

	return json(result.data as AuthVerifyUser);
};
