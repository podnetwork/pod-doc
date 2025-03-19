<script lang="ts">
	import type { ClassValue } from 'clsx';
	import type { Snippet } from 'svelte';

	let {
		children,
		className
	}: {
		children: Snippet;
		className?: ClassValue;
	} = $props();
</script>

<div class="codeblock-sticky {className}">
	{@render children()}
</div>

<style lang="postcss">
	.codeblock-sticky {
		@apply sticky top-20 flex flex-col;
		z-index: 1;

		:global(> p) {
			@apply mb-4 mt-4;
		}

		:global(> *:not(:last-child)) {
			@apply mb-4;
		}
	}
</style>
