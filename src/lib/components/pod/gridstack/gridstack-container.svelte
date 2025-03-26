<script lang="ts">
	let { children } = $props();
</script>

<div class="gridstack-container">
	{@render children()}
</div>

<style lang="postcss">
	.gridstack-container {
		@apply grid auto-cols-auto grid-flow-col gap-4;
	}
</style>
