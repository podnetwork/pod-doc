<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { MetaMask } from '$lib/metamask/metamask.svelte';
	import { Menu, Search } from '@lucide/svelte';
	import MetamaskPanel from './metamask-panel.svelte';
	import ProfileMenu from './profile-menu.svelte';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';
	import SidebarMenu from './sidebar-menu.svelte';
	import SidebarMobile from './sidebar-mobile.svelte';
	import VersionController from './version-controller.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

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

	const navigationItems = [
		{ id: 'get-started', label: 'GET STARTED', href: '/get-started', active: true },
		{ id: 'payments', label: 'PAYMENTS', href: '/payments', active: false },
		{ id: 'finance-automation', label: 'FINANCE AUTOMATION', href: '/finance-automation', active: false },
		{ id: 'platforms', label: 'PLATFORMS AND MARKETPLACES', href: '/platforms', active: false },
		{ id: 'banking', label: 'BANKING AS A SERVICE', href: '/banking', active: false },
		{ id: 'developer', label: 'DEVELOPER TOOLS', href: '/developer', active: false }
	]
</script>


<div
	class="sticky top-0 z-[2] flex flex-col h-14 flex-none items-center justify-start gap-2 border-b bg-secondary px-3 md:h-[15vh]"
>
	<div class="flex flex-1 w-full items-center">
		<div class="flex items-center gap-2 pr-2 lg:hidden">
			<Button
				size="icon"
				variant="ghost"
				onclick={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
			>
				<Menu />
			</Button>
			<a href="/">
				<img src="/pod-logo.svg" alt="Pod network" class="w-8 dark:hidden" />
				<img src="/pod-logo-white.svg" alt="Pod network" class="hidden w-8 dark:inline-block" />
			</a>
		</div>

		<div class="hidden h-14 gap-3 p-3 px-6 md:flex">
			<a href="/">
				<img src="/pod-logo.svg" alt="Pod network" class="w-14 dark:hidden" />
				<img src="/pod-logo-white.svg" alt="Pod network" class="hidden w-14 dark:inline-block" />
			</a>
		</div>

		<MetamaskPanel />

		<div class="ml-auto flex items-center gap-4">
			<div class="relative hidden md:block">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input 
					type="search" 
					placeholder="Search..." 
					class="w-[300px] !bg-white pl-9 !text-[0.8rem] bg-muted/30"
				/>
			</div>
			<ProfileMenu />
		</div>
	</div>
	
	<div class="hidden md:flex w-full justify-start">
		<nav class="flex items-center gap-8 px-6">
			{#each navigationItems as item}
				<a 
					href={'#'}
					class="relative pb-4 px-1 text-xs font-semibold tracking-wide {item.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}"
				>
					{item.label}
					{#if item.active}
						<div class="absolute bottom-0 left-0 h-1 w-full bg-green-500"></div>
					{/if}
				</a>
			{/each}
		</nav>
	</div>
</div>

<div class="flex min-h-screen">
	<div
		class="fixed left-0 top-[15vh] hidden h-[85vh] w-72 flex-none flex-col overflow-y-auto border-r bg-secondary lg:flex"
	>
		<SidebarMenu />
		<div class="flex-1" />
		<div class="p-4">
			<ThemeToggle />
		</div>
	</div>

	<div class="hidden w-72 lg:block"></div>

	<div class="relative flex flex-1 flex-col">
		{#if isMobileSidebarOpen}
			<div
				class="fixed bottom-0 left-0 right-0 top-14 z-[20] flex flex-col overflow-auto bg-background"
			>
				<SidebarMenu />
				<div class="p-4">
					<ThemeToggle />
				</div>
			</div>
		{/if}

		<div class="flex flex-1 flex-col" bind:this={pageContentEl}>
			{@render children()}
		</div>
	</div>
</div>
