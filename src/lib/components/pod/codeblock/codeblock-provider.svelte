<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CodeblockStore } from './codeblock-store.svelte';

	const store = CodeblockStore.create();

	let {
		children,
		title,
		runCode
	}: {
		children: Snippet;
		title?: string;
		runCode?: () => Promise<any>;
	} = $props();

	$effect(() => {
		store.title = title ?? '';
	});

	store.runCode = runCode;
</script>

{@render children()}
