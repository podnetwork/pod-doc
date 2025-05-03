<script lang="ts">
	import { App } from '$lib/app.svelte';
	import { untrack } from 'svelte';
	import { SidebarMenuStore } from '../../routes/(doc)/sidebar-menu-store.svelte';

	let { children, toc, url, code_languages } = $props();

	const app = App.get();
	const s = SidebarMenuStore.get();

	$effect(() => {
		if (toc && url) {
			s.headings(url, toc);
			untrack(() => {
				s.makeItems()
			})
		}
	});

	$effect(() => {
		if (code_languages) {
			app.codeSwitcher.languages = code_languages;
		}
	});
</script>

{@render children()}
