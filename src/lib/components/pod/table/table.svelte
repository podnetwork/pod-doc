<script lang="ts">
	import type { Snippet } from 'svelte';
	import TableStyle1 from './table-style1.svelte';

	let {
		children,
		styleId
	}: {
		children: Snippet;
		styleId?: string;
	} = $props();

</script>

{#if styleId === 'style1'}
    <TableStyle1>
        {@render children()}
    </TableStyle1>
{/if}