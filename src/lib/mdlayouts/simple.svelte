<script lang="ts">
	let { children } = $props();
</script>

<div class="mlayout-simple doc-style">
	{@render children()}
</div>

<style lang="postcss">
	.mlayout-simple {
		@apply grid grid-cols-1 gap-4 md:grid-cols-2;

		/* special hr acts like a divider */
		:global(> hr) {
			@apply col-span-2;
		}

		&:not(:last-child) {
			@apply border-b;
		}

		:global(> div:nth-child(2)) {
			@apply relative;
		}

		:global(> div) {
			@apply p-12;

			&:nth-child(odd of div) {
				@apply pr-2;
			}

			&:nth-child(even of div) {
				@apply pl-2;
			}
		}
	}
</style>
