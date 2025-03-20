import { PodApi } from '$lib/pod/pod-api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type R = {
	result: {
		result: string;
		error?: { message: string };
	};
};

export const POST: RequestHandler = async ({ request, fetch }) => {
	const { version, rid } = (await request.json()) as { version: string; rid: number };

	const rpcUrl = PodApi.getRpcEndpoint(version);

	const res = await fetch(rpcUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: rid,
			method: 'eth_chainId',
			params: []
		})
	});

	if (res.status !== 200) {
		throw error(res.status, res.statusText);
	}

	return json((await res.json()) as R);
};
