<script lang="ts">
	import { page } from '$app/state';
	import { App } from '$lib/app.svelte';
	import DocsSearch from '$lib/components/docs-search.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from '@lucide/svelte';
	import FundBox from './fund-box.svelte';
	import LanguageSwitcher from './language-switcher.svelte';
	import ProfileMenu from './profile-menu.svelte';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';
	import SidebarMenu from './sidebar-menu.svelte';
	import VersionSwitcher from './version-switcher.svelte';

	const app = App.get();

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
		class="fixed left-0 hidden h-screen w-72 flex-none flex-col overflow-y-auto border-r bg-secondary lg:flex"
	>
		<div class="hidden h-14 gap-3 pt-6 pb-0 px-8 md:flex">
			<a href="/">
				<img src="/pod.svg" alt="Pod network" class="w-14 dark:hidden" />
				<img src="/pod-dark.svg" alt="Pod network" class="hidden w-14 dark:inline-block" />
			</a>
		</div>

		<SidebarMenu />

		{#if page.route.id === '/(doc)/[version]/fund'}
			<FundBox />
		{/if}

		<div class="flex-1"></div>
		<div class="sticky bottom-0 z-[1] flex flex-col gap-2 bg-secondary p-4">
			<div class="flex gap-2">
				<ThemeToggle />
			</div>
			<ProfileMenu />
			<Button href={app.versionUrl('/fund')}>Fund wallet</Button>
		</div>
	</div>

	<div class="hidden w-72 lg:block"></div>

	<div class="relative flex flex-1 flex-col">
		<div
			class="sticky top-0 z-[2] flex h-14 flex-none items-center justify-start gap-2 border-b bg-secondary px-3 md:h-14"
		>
			<div class="flex w-full flex-1 items-center">
				<div class="flex items-center gap-2 pr-2 lg:hidden">
					<Button
						size="icon"
						variant="ghost"
						onclick={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
					>
						<Menu />
					</Button>
					<a href="/">
						<img src="/pod.svg" alt="Pod network" class="w-8 dark:hidden" />
						<img src="/pod-dark.svg" alt="Pod network" class="hidden w-8 dark:inline-block" />
					</a>
				</div>

				<div class="flex gap-2">
					<VersionSwitcher />
					<LanguageSwitcher />
				</div>

				<div class="flex w-full items-center gap-4">
					<!-- <div class="hidden w-full justify-start md:flex">
						<nav class="flex items-center gap-8 px-6">
							{#each sidebar.navigationHeadings as heading}
								{@const isActive = sidebar.currentNavId == heading.navId}
								<a
									href={heading.href}
									class="relative px-1 text-xs font-medium tracking-wide {isActive
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground/80'}"
								>
									{heading.label}
									{#if isActive}
										<div class="absolute -bottom-[1.25rem] left-0 h-1 w-full bg-green-500"></div>
									{/if}
								</a>
							{/each}
						</nav>
					</div> -->
					<div class="flex-1"></div>

					<div class="relative hidden md:block">
						<DocsSearch />
					</div>
				</div>
			</div>
		</div>
		{#if isMobileSidebarOpen}
			<div
				class="fixed bottom-0 left-0 right-0 top-14 z-[20] flex flex-col overflow-auto bg-background"
			>
				<SidebarMenu />
				<div class="sticky bottom-0 z-[1] flex flex-col gap-2 bg-background p-4">
					<div class="flex gap-2">
						<ThemeToggle />
						<VersionSwitcher />
						<LanguageSwitcher />
					</div>
					<ProfileMenu />
					<Button href={app.versionUrl('/fund')}>Fund wallet</Button>
				</div>
			</div>
		{/if}

		<div class="flex flex-1 flex-col" bind:this={pageContentEl}>
			{@render children()}
		</div>
	</div>
</div>
