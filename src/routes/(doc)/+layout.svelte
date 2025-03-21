<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { MetaMask } from '$lib/metamask/metamask.svelte';
	import MetamaskPanel from './metamask-panel.svelte';
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
</script>

<div class="flex min-h-screen">
	<div
		class="fixed left-0 top-0 hidden h-screen w-72 flex-none flex-col overflow-y-auto border-r lg:flex"
	>
		<Logo />
		<SidebarMenu />
		<div class="flex-1" />
		<div class="p-4">
			<ThemeToggle />
		</div>
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

			<MetamaskPanel />

			<div class="ml-auto">
				<ProfileMenu />
			</div>
		</div>

		<div class="flex flex-1 flex-col" bind:this={pageContentEl}>
			{@render children()}
		</div>
	</div>
</div>
