import { PUBLIC_POD_FAUCET_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface Payload {
	address: string;
	access_code: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const { address, access_code } = (await request.json()) as Payload;

	// send request to faucet
	const askFaucet = await fetch(PUBLIC_POD_FAUCET_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ address, access_code })
	})
		.catch((e) => e as Error)
		.then(async (res) => {
			if (res instanceof Error) return res;

			const data = await res.json();

			if (res.ok) return data;

			if (data.success === false) {
				data.error = 'Invalid access code';
				return data;
			}

			data.error = data.message || res.statusText;
			return data;
		});

	if (askFaucet instanceof Error) {
		return json({ message: askFaucet.message }, { status: 400 });
	}

	if (askFaucet.error) {
		return json({ message: askFaucet.error, ...askFaucet }, { status: 400 });
	}

	return json(askFaucet);
};
