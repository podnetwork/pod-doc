<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import { SidebarMenuStore } from './sidebar-menu-store.svelte';

	const sidebar = SidebarMenuStore.get();

	const go = (href: string) => {
		goto(href, { keepFocus: true, replaceState: true, noScroll: true });
	};
</script>

<Select.Root type="single" onValueChange={(value) => go(value)}>
	<Select.Trigger class="w-[180px]">
		{sidebar.currentItem?.label}
	</Select.Trigger>
	<Select.Content>
		{#each sidebar.items as item}
			<Select.Group>
				{#if item.heading}
					<Select.GroupHeading>{item.heading}</Select.GroupHeading>
				{:else if item.children}
					{#each item.children as child}
						<Select.Item value={child.href ?? ''}>{child.label}</Select.Item>
					{/each}
				{:else}
					<Select.Item value={item.href ?? ''}>{item.label}</Select.Item>
				{/if}
			</Select.Group>
		{/each}
	</Select.Content>
</Select.Root>
