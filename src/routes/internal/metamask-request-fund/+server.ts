import type { RequestHandler } from './$types';

type Payload = {
	address: string;
};

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { address } = (await request.json()) as Payload;

	return fetch('https://faucet.dev.pod.network/api/faucet', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			address
		})
	});
};
