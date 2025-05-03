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

<div class="mlayout-single doc-style">
	<div>
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.mlayout-single {
		@apply grid grid-cols-1 gap-4;
		@apply lg:max-w-[80%];

		&:not(:last-child) {
			@apply border-b;
		}

		:global(> div) {
			@apply empty:hidden lg:block;

			@apply p-12 pb-0 lg:pb-12;

			:global(&:last-child),
			:global(&:has(+ hr)) {
				@apply pb-12;
			}
		}

		:global(> div > hr) {
			@apply my-12;
		}
	}
</style>
