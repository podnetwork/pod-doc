<script lang="ts">
	import { CodeblockStore } from './codeblock-store.svelte';

	const store = CodeblockStore.get();

	console.log(store)

	let {
		code,
		lang,
		alias
	}: {
		code: string;
		lang: string;
		alias?: string;
	} = $props();

	if (!alias) alias = lang;

	store.codeblocks.push({
		lang,
		code,
		alias,
		id: crypto.randomUUID()
	});
</script>
