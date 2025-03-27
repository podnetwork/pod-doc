<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { sidebarMenuButtonVariants } from '$lib/components/ui/sidebar/sidebar-menu-button.svelte';
	import { ChevronRight } from '@lucide/svelte';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';

	const sidebar = SidebarMenuStore.get();

	const onclickIntoView = (e: MouseEvent, href: string) => {
		e.preventDefault();
		const hash = href.split('#')[1];

		// if no hash, return
		if (!hash) return;

		const element = document.getElementById(hash);
		if (!element) return;

		sidebar.blockTracking = true;

		sidebar.manualUpdateHash(hash);

		addEventListener(
			'scrollend',
			() => {
				sidebar.blockTracking = false;
			},
			{ once: true }
		);

		element.scrollIntoView({ behavior: 'smooth' });
	};
</script>

<div class="relative flex h-fit flex-col justify-between p-4">
	<!-- <div class="absolute bottom-4 left-4 top-4 w-[1px] bg-foreground/20" /> -->
	<div class="ml-2 flex h-fit flex-col gap-4">
		<Sidebar.Menu>
			{#each sidebar.items as item}
				{#if item.heading}
					<Sidebar.GroupLabel
						class=" mb-2 mt-4 border-t pb-2 pt-8 font-aplha text-[14px] text-foreground"
						>{item.heading}</Sidebar.GroupLabel
					>
				{:else if item.children}
					<Collapsible.Root open={sidebar.isActive(item)} class="group/collapsible ">
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={sidebar.isActive(item)}>
								{#snippet child({ props })}
									<a
										{...props}
										href={item.href}
										class={[
											sidebarMenuButtonVariants({}),
											'flex justify-between text-sidebar-foreground'
										]}
										>{item.label}
										<ChevronRight
											size={16}
											class="text-muted-foreground {sidebar.isActive(item)
												? 'rotate-90'
												: ''} transition-all"
										/></a
									>
								{/snippet}
							</Sidebar.MenuButton>

							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.children as child}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton
												isActive={sidebar.isActive(child)}
												href={child.href}
												onclick={(e) => onclickIntoView(e, child.href ?? '')}
											>
												<!-- {#if child.icon} -->
												<!-- 	{child.icon} -->
												<!-- {/if} -->
												{child.label}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						</Sidebar.MenuItem>
					</Collapsible.Root>
				{:else}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={sidebar.isActive(item)}>
							{#snippet child({ props })}
								<a
									{...props}
									href={item.href}
									class={[
										sidebarMenuButtonVariants({}),
										'flex justify-between text-sidebar-foreground'
									]}>{item.label}</a
								>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/if}
			{/each}
		</Sidebar.Menu>
	</div>
</div>
