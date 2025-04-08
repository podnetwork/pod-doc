import { goto } from '$app/navigation';
import type { App } from '$lib/app.svelte';
import { ClerkExternalProviderName } from '$lib/clerk/type';
import { catchError, EMPTY, finalize, tap, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { useClerkContext } from 'svelte-clerk';
import { toast } from 'svelte-sonner';
import { AuthVerifyUserAccessVersionStage, type AuthVerifyUser } from './verify-user';

export class Auth {
	constructor(private readonly app: App) {
		$effect(() => {
			if (this.clerk.isLoaded) {
				if (this.user === null) {
					// guest, clear user internal data
					this.userInternal = void 0;
				}

				// fetch versions
				this.fetchUserFromSupabase()
					.pipe(
						catchError((e) => {
							let msg = 'Sorry, we are unable to load your profile right now.';

							switch (e.message as AuthVerifyUserAccessVersionStage) {
								case AuthVerifyUserAccessVersionStage.NOT_EXISTS:
									this.versionAccessStage = AuthVerifyUserAccessVersionStage.NOT_EXISTS;
									msg = 'The version you are trying to access does not exist.';
									goto('/404'); //todo: redirect to version not exists page
									break;
								case AuthVerifyUserAccessVersionStage.LOCKED:
									this.versionAccessStage = AuthVerifyUserAccessVersionStage.LOCKED;
									msg = 'The version you are trying to access is locked.';
									goto('/404'); //todo: redirect to version locked page
									break;
								case AuthVerifyUserAccessVersionStage.DEACTIVATE:
									this.versionAccessStage = AuthVerifyUserAccessVersionStage.DEACTIVATE;
									msg = 'The version you are trying to access is deactivated.';
									goto('/404'); //todo: redirect to version deactivate page
									break;
								case AuthVerifyUserAccessVersionStage.DISABLED:
									this.versionAccessStage = AuthVerifyUserAccessVersionStage.DISABLED;
									msg = 'The version you are trying to access is disabled.';
									goto('/404'); //todo: redirect to version disabled page
									break;
							}

							toast.error(msg);
							return EMPTY;
						})
					)
					.subscribe(); // active both case auth or not auth
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

	// store latest verion accessibility status
	versionAccessStage = $state<string>();

	// versions from supabase , which can access
	versions = $state<AuthVerifyUser['versions']>([]);

	fetchingUserFromSupabase = $state(true); // default = true to block loading

	// send this request in both case: auth or not auth
	// if authed then request resolve user in database and return versions user can access
	// if not auth then request return all version enabled
	private fetchUserFromSupabase() {
		this.fetchingUserFromSupabase = true;

		// note: what the hell, clerk typescript types are so bad
		type EAccounts = NonNullable<typeof this.user>['externalAccounts'][0][];
		const eAccounts = (this.user?.externalAccounts ?? []) as EAccounts;

		const twitter = eAccounts.find((i) => i.provider === ClerkExternalProviderName.X);

		const firstName = this.user?.firstName;
		const lastName = this.user?.lastName;

		interface Payload {
			clerk_id?: string;
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
				clerk_id: this.user?.id,
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
