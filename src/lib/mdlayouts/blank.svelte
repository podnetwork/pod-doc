<script lang="ts">
	import { untrack } from 'svelte';
	import { SidebarMenuStore } from '../../routes/(doc)/sidebar-menu-store.svelte';

	let { children, toc, url } = $props();

	const s = SidebarMenuStore.get();

	$effect(() => {
		if (toc && url) {
			s.headings(url, toc);
			untrack(() => {
				s.makeItems()
			})
		}
	});
</script>

{@render children()}
