<script lang="ts">
	import { SidebarMenuStore } from '../../routes/(doc)/sidebar-menu-store.svelte';

	let { children, toc, url } = $props();

	const s = SidebarMenuStore.get();

	$effect(() => {
		if (toc && url) {
			s.headings(url, toc);
		}
	});
</script>

{@render children()}
