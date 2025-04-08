<script lang="ts">
	import { App } from '$lib/app.svelte';
	
	const app = App.create();

	let ready = $state(false);

	let { children } = $props();

	$effect(() => {
		if (app.auth.ready) {
			ready = true;
		}
	});
</script>

{#if ready}
	{@render children()}
{/if}
