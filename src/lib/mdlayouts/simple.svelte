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

<div class="mlayout-simple doc-style">
	{@render children()}
</div>

<style lang="postcss">
	.mlayout-simple {
		@apply grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4;

		/* special hr acts like a divider */
		:global(> hr) {
			@apply lg:col-span-2;
		}

		&:not(:last-child) {
			@apply border-b;
		}

		:global(> div:nth-child(2)) {
			@apply lg:relative;
		}

		:global(> div) {
			@apply empty:hidden lg:block;

			@apply p-12 pb-0 lg:pb-12;

			:global(&:last-child),
			:global(&:has(+ hr)) {
				@apply pb-12;
			}

			:global(&:nth-child(odd of div)) {
				@apply lg:pr-2;
			}

			:global(&:nth-child(even of div)) {
				@apply lg:pl-2;
			}
		}
	}
</style>
