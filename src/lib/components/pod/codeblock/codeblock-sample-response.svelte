<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LucideClipboardCopy } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import CodeblockCode from './codeblock-code.svelte';
	import CodeblockContainer from './codeblock-container.svelte';

	let {
		value
	}: {
		value: string;
	} = $props();

	// let ref = $state<HTMLDivElement>();

	// replace raw input
	function copyCode() {
		// copy code in element pre.code
		// const code = ref?.querySelector('pre code')?.textContent?.trim();
		const code = value;
		if (code) {
			navigator.clipboard.writeText(code);
			toast.success('Copied to clipboard');
		}
	}
</script>

{#snippet copyCodeButton()}
	<Button variant="outline" class="size-8 py-1" size="icon" type="button" onclick={copyCode}>
		<LucideClipboardCopy size={16} />
	</Button>
{/snippet}

<CodeblockContainer title={'Response'} class="mt-2">
	{#snippet actions()}
		{@render copyCodeButton()}
	{/snippet}
	<CodeblockCode code={value} lang="json" />
</CodeblockContainer>
