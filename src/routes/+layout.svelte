<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import { ClerkProvider } from 'svelte-clerk';

	import '../app.css';
	import '../doc-style.postcss';
	import Preload from './preload.svelte';

	let { children } = $props();
</script>

<Toaster position="top-right" />
<ModeWatcher />

<ClerkProvider>
	<Preload>
		{@render children()}
	</Preload>
</ClerkProvider>
