<script lang="ts">
	import { page } from '$app/state';
	import ClerkLogin from '$lib/components/clerk/clerk-login.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { MetaMask } from '$lib/metamask/metamask.svelte';
	import { PodApi } from '$lib/pod/pod-api';
	import { catchError, EMPTY, switchMap, tap } from 'rxjs';
	import { SignedIn, SignOutButton } from 'svelte-clerk';
	import { toast } from 'svelte-sonner';
	import ProfileMenu from './profile-menu.svelte';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';
	import SidebarMenu from './sidebar-menu.svelte';
	import SidebarMobile from './sidebar-mobile.svelte';
	import VersionController from './version-controller.svelte';

	const mm = MetaMask.create();

	let { children } = $props();

	let pageContentEl = $state<HTMLDivElement>();

	const sidebar = SidebarMenuStore.create();

	$effect(() => {
		return sidebar.tocTracking(pageContentEl, page.url);
	});

	const connectMetaMask = () => {
		const rpcUrl = PodApi.getRpcEndpoint('dev');

		return mm.getChainId('dev', 1).pipe(
			switchMap((chainId) => mm.connectWallet(chainId, rpcUrl)),
			tap(() => {
				toast.success('Connected to MetaMask');
			}),
			catchError((e) => {
				toast.error(e.message);
				return EMPTY;
			})
		);
	};

	$effect(() => {
		console.log(mm.connecting);
	});
</script>

<div class="flex min-h-screen">
	<div class="fixed left-0 top-0 hidden h-screen w-72 flex-none overflow-y-auto border-r lg:block">
		<div class="flex h-14 gap-3 p-3 px-6">
			<div>
				<img src="/pod-logo.svg" alt="Pod network" class="w-10 dark:hidden" />
				<img src="/pod-logo-white.svg" alt="Pod network" class="hidden w-10 dark:inline-block" />
				<div class="text-sm">Pod network</div>
			</div>

			<div class="ml-auto">
				<ThemeToggle />
			</div>
		</div>

		<SidebarMenu />
	</div>

	<div class="hidden w-72 lg:block"></div>

	<div class="relative flex flex-1 flex-col">
		<div
			class="sticky top-0 z-[2] flex h-14 flex-none items-center justify-start gap-2 border-b bg-background px-3"
		>
			<div class="lg:hidden">
				<SidebarMobile />
			</div>

			<VersionController />

			<ClerkLogin />

			<SignedIn>
				{#if mm.walletAddressHashId === undefined}
					<Button
						variant="outline"
						onclick={() => connectMetaMask().subscribe()}
						disabled={mm.connecting}
					>
						{mm.connecting ? 'Connecting...' : 'Connect metamask'}
					</Button>
				{:else}
					<div>
						<div class="text-xs text-muted-foreground">Your wallet address</div>
						<div class="font-mono text-xs">{mm.walletAddressHashId}</div>
					</div>
				{/if}

				<SignOutButton>
					<span class={buttonVariants({ variant: 'ghost' })}>Logout</span>
				</SignOutButton>
			</SignedIn>

			<div class="ml-auto">
				<ProfileMenu />
			</div>
		</div>

		<div class="flex flex-1 flex-col" bind:this={pageContentEl}>
			{@render children()}
		</div>
	</div>
</div>
