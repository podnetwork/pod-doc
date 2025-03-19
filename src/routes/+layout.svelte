<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import '../doc-style.postcss';
	let { children } = $props();
</script>

<Toaster />
<ModeWatcher />
{@render children()}
