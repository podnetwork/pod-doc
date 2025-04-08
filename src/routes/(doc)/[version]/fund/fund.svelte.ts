import { catchError, finalize, throwError } from 'rxjs';
import { ajax, type AjaxError } from 'rxjs/ajax';
import type { Store } from './store.svelte';

interface Payload {
	address: string;
	access_code: string;
}

interface Response {
	[k: string]: any;
	error?: string;
}

export class Fund {
	constructor(private readonly store: Store) {}

	api = '/api/fund-wallet';

	funding = $state(false);

	topUp(address: string, accessCode: string) {
		const q = ajax<Response>({
			url: this.api,
			method: 'POST',
			body: JSON.stringify({
				address,
				access_code: accessCode
			} satisfies Payload)
		});

		this.funding = true;

		return q.pipe(
			catchError((e: AjaxError) => {
				if (e.response.error) return throwError(() => new Error(e.response.error));
				return throwError(() => e);
			}),
			finalize(() => {
				this.funding = false;
			})
		);
	}
}
