<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/components/logo.svelte';
</script>

<h1
	class="flex h-screen w-screen flex-col items-center justify-center gap-4 text-3xl font-bold text-primary"
>
	{$page.status}: {$page.error?.message}
</h1>

