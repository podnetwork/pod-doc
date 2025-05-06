import { goto } from '$app/navigation';
import type { App } from '$lib/app.svelte';
import { ClerkExternalProviderName } from '$lib/clerk/type';
import { LocalVersion } from '$lib/version2.svelte';
import { EmptyError, firstValueFrom, from, map, Subject, switchMap, takeUntil } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { untrack } from 'svelte';
import { useClerkContext } from 'svelte-clerk';
import { toast } from 'svelte-sonner';
import { AuthVerifyUserAccessVersionStage, type AuthVerifyUser } from './verify-user';

export class Auth {
	constructor(private readonly app: App) {
		$effect(() => {
			if (this.clerk.isLoaded) {
				untrack(() => {
					// fetch versions
					// avoid unexpected reactive
					this.fetchUserFromSupabase();
				});

				return () => this.cancelFetchUserFromSupabase.next();
			}
		});
	}

	private clerk = useClerkContext();

	signout() {
		if (!this.clerk.clerk) return;

		return firstValueFrom(
			from(this.clerk.clerk.signOut()).pipe(
				switchMap(() => {
					// guest, clear user internal data
					this.userInternal = void 0;
					// force reload version list
					return this.fetchUserFromSupabase();
				})
			)
		);
	}

	user = $derived.by(() => this.clerk.user);

	ready = $derived.by(() => this.clerk.isLoaded && !this.fetchingUserFromSupabase);

	// user from supabase
	userInternal = $state<any>();

	// store latest verion accessibility status
	versionAccessStage = $state<string>();

	fetchingUserFromSupabase = $state(true); // default = true to block loading

	// send this request in both case: auth or not auth
	// if authed then request resolve user in database and return versions user can access
	// if not auth then request return all version enabled
	private cancelFetchUserFromSupabase = new Subject<void>();

	private async fetchUserFromSupabase() {
		try {
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

			// get current version
			if (!this.app.version2.version) {
				throw new Error('Version not found');
			}

			// in case working on local then skip fetching from database,
			// making decoy version `local` and accept user to access local
			if (this.app.version2.version === LocalVersion) {
				this.app.version2.versions = [
					{
						id: 1,
						name: 'Local',
						v_number: LocalVersion,
						is_active: true,
						is_locked: false,
						created_at: new Date().toISOString(),
						deleted_at: null,
						updated_at: new Date().toISOString(),
						released_at: new Date().toISOString(),
						domain: 'http://localhost:5173',
						domain_dev: 'http://localhost:5173',
						is_latest: true
					}
				];
				return;
			}

			// from here is production env
			// using subdomain strategy

			const ask$ = ajax<AuthVerifyUser>({
				method: 'POST',
				url: '/api/user-verify',
				body: JSON.stringify({
					clerk_id: this.user?.id,
					twitter_id: twitter?.providerUserId ?? void 0,
					github_id: void 0,
					access_version: this.app.version2.version,
					first_name: firstName ?? void 0,
					last_name: lastName ?? void 0
				} satisfies Payload)
			});

			const asked = await firstValueFrom(
				ask$.pipe(
					map((i) => i.response),
					takeUntil(this.cancelFetchUserFromSupabase)
				)
			).catch((e) => e as Error);

			if (asked instanceof EmptyError) {
				return;
			}

			if (asked instanceof Error) {
				let msg = 'Sorry, we are unable to load your profile right now.';

				switch (asked.message as AuthVerifyUserAccessVersionStage) {
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
				return;
			}

			this.userInternal = asked.user;

			this.app.version2.versions = asked.versions.toSorted(
				(a, b) => Number(a.v_number) - Number(b.v_number)
			);
		} finally {
			this.fetchingUserFromSupabase = false;
		}
	}
}
