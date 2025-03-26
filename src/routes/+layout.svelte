<script lang="ts">
	import { App } from '$lib/app.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import { ClerkProvider } from 'svelte-clerk';
	import '../app.css';
	import '../doc-style.postcss';

	let { children } = $props();

	App.create();
</script>

<Toaster position="top-right" />
<ModeWatcher />

<ClerkProvider>
	{@render children()}
</ClerkProvider>
