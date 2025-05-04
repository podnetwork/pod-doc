<script lang="ts">
	import { App } from '$lib/app.svelte';
	let { children, code_languages } = $props();

	const app = App.get();

	$effect(() => {
		if (code_languages) {
			app.codeSwitcher.languages = code_languages;
		}
	});
</script>

{@render children()}
