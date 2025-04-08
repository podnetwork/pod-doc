import type { App } from '$lib/app.svelte';
import { ClerkExternalProviderName } from '$lib/clerk/type';
import { EMPTY, finalize, tap, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { useClerkContext } from 'svelte-clerk';
import type { AuthVerifyUser } from './verify-user';

export class Auth {
	constructor(private readonly app: App) {
		$effect(() => {
			if (this.user === null) {
				// guest, clear user internal data
				this.userInternal = void 0;
				this.fetchingUserFromSupabase = false; // release loading
			}
		});

		$effect(() => {
			if (this.user) {
				this.fetchUserFromSupabase().subscribe();
			}
		});
	}

	private clerk = useClerkContext();

	signout() {
		return this.clerk.clerk?.signOut();
	}

	user = $derived.by(() => this.clerk.user);

	ready = $derived.by(() => this.clerk.isLoaded && !this.fetchingUserFromSupabase);

	// user from supabase
	userInternal = $state<any>();

	// versions from supabase , which can access
	versions = $state<AuthVerifyUser['versions']>([]);

	fetchingUserFromSupabase = $state(true); // default = true to block loading

	private fetchUserFromSupabase() {
		if (!this.user) return EMPTY;

		this.fetchingUserFromSupabase = true;

		// note: what the hell, clerk typescript types are so bad
		const eAccounts = this.user.externalAccounts as (typeof this.user.externalAccounts)[0][];

		const twitter = eAccounts.find((i) => i.provider === ClerkExternalProviderName.X);

		const firstName = this.user.firstName;
		const lastName = this.user.lastName;

		interface Payload {
			clerk_id: string;
			twitter_id?: string;
			github_id?: string;
			access_version?: string;

			first_name?: string;
			last_name?: string;
		}

		// get current version, remove any alphabetic character
		let version = this.app.version.version;
		if (!version) {
			return throwError(() => new Error('Version not found'));
		}

		version = version.replace(/[a-zA-Z]/g, '');

		const pull = ajax<AuthVerifyUser>({
			method: 'POST',
			url: '/api/user-verify',
			body: JSON.stringify({
				clerk_id: this.user.id,
				twitter_id: twitter?.providerUserId ?? void 0,
				github_id: void 0,
				access_version: version,
				first_name: firstName ?? void 0,
				last_name: lastName ?? void 0
			} satisfies Payload)
		});

		return pull.pipe(
			tap((res) => {
				this.userInternal = res.response.user;
				this.versions = res.response.versions;
			}),
			finalize(() => {
				this.fetchingUserFromSupabase = false;
			})
		);
	}
}
