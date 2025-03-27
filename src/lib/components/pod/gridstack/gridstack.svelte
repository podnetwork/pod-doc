<script lang="ts">
	import GridstackBlock from './gridstack-block.svelte';
	import GridstackContainer from './gridstack-container.svelte';

	let { children } = $props();
</script>

<GridstackContainer>
	<GridstackBlock>
		{@render children()}
	</GridstackBlock>
</GridstackContainer>
