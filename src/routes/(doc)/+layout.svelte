<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { MetaMask } from '$lib/metamask/metamask.svelte';
	import { Menu } from '@lucide/svelte';
	import MetamaskPanel from './metamask-panel.svelte';
	import ProfileMenu from './profile-menu.svelte';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';
	import SidebarMenu from './sidebar-menu.svelte';
	import SidebarMobile from './sidebar-mobile.svelte';
	import VersionController from './version-controller.svelte';
	import { Button } from '$lib/components/ui/button';

	const mm = MetaMask.create();

	let { children } = $props();

	let pageContentEl = $state<HTMLDivElement>();
	let isMobileSidebarOpen = $state(false);

	const sidebar = SidebarMenuStore.create();

	$effect(() => {
		return sidebar.tocTracking(pageContentEl, page.url);
	});

	$effect(() => {
		page.url.pathname; // Needed to track this as dependency

		isMobileSidebarOpen = false;
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
				<Button
					size="icon"
					variant="outline"
					onclick={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}><Menu /></Button
				>
				<!-- <SidebarMobile /> -->
			</div>

			<VersionController />

			<MetamaskPanel />

			<div class="ml-auto">
				<ProfileMenu />
			</div>
		</div>

		{#if isMobileSidebarOpen}
			<div class="fixed bottom-0 left-0 right-0 top-14 z-[999] bg-background">
				<SidebarMenu />
			</div>
		{/if}

		<div class="flex flex-1 flex-col" bind:this={pageContentEl}>
			{@render children()}
		</div>
	</div>
</div>
