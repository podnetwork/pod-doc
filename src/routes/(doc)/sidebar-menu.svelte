<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';

	const sidebar = SidebarMenuStore.get();
</script>

<div class="relative flex h-fit p-4">
	<div class="absolute bottom-4 left-4 top-4 w-[1px] bg-foreground/20" />
	<div class="ml-2 flex h-fit flex-col gap-4">
		<Sidebar.Menu>
			{#each sidebar.items as item}
				{#if item.heading}
					<Sidebar.GroupLabel class="mt-4">{item.heading}</Sidebar.GroupLabel>
				{:else if item.children}
					<Collapsible.Root open={sidebar.isActive(item)} class="group/collapsible">
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={sidebar.isActive(item)}>
								<a href={item.href} class="w-full">{item.label}</a>
							</Sidebar.MenuButton>

							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.children as child}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton isActive={sidebar.isActive(child)} href={child.href}>
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
							<a href={item.href} class="w-full">{item.label}</a>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/if}
			{/each}
		</Sidebar.Menu>
	</div>
</div>
