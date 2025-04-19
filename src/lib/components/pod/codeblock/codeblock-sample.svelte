<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Copy, LucideCircleDashed, LucidePlay } from '@lucide/svelte';
	import { catchError, defer, EMPTY, finalize, tap } from 'rxjs';
	import { toast } from 'svelte-sonner';
	import CodeblockContainer from './codeblock-container.svelte';
	import CodeblockContent from './codeblock-content.svelte';
	import CodeblockSampleResponse from './codeblock-sample-response.svelte';
	import { CodeblockStore } from './codeblock-store.svelte';

	const store = CodeblockStore.get();

	let { children } = $props();

	// replace raw input
	function copyCode() {
		const code = selectedCodeblock?.code;
		if (code) {
			navigator.clipboard.writeText(code);
			toast.success('Copied to clipboard');
		}
	}

	let runningCode = $state(false);

	// store running result
	type RunResult = {
		statusCode?: number;
		statusMessage?: number;
		response?: any;
	};

	let runRes = $state<RunResult>({});

	let runResStr = $derived.by(() => JSON.stringify(runRes, null, 2));

	const runCode = store.runCode ? defer(store.runCode) : undefined;

	const run = () => {
		runningCode = true;
		return runCode?.pipe(
			tap(async (res: Response) => {
				const data = await res.json();
				runRes = { statusCode: res.status, response: data };
			}),
			catchError((e) => {
				runRes = { statusCode: 500, response: e, statusMessage: e.message };
				return EMPTY;
			}),
			finalize(() => {
				runningCode = false;
			})
		);
	};

	// support multi code block

	let ids = $derived(store.codeblocks.map((i) => i.id)) as string[];

	let selectedId = $state<string>();

	let selectedCodeblock = $derived(store.codeblocks.find((i) => i.id === selectedId));

	$effect(() => {
		if (!ids.length) return;
		if (!selectedId) {
			selectedId = ids[0];
		}
	});
</script>

{#snippet tabs()}
	<Tabs.Root
		value={selectedId}
		onValueChange={(value) => (selectedId = value)}
		class="mx-0 flex-1 px-0"
	>
		<Tabs.List class="px-0">
			{#each store.codeblocks as codeblock (codeblock.id)}
				<Tabs.Trigger value={codeblock.id} class="text-xs">
					{codeblock.alias ?? codeblock.lang}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>
{/snippet}

{#snippet runCodeButton()}
	<Button
		variant="outline"
		class="size-8"
		size="icon"
		type="button"
		onclick={() => run()?.subscribe()}
	>
		{#if runningCode}
			<LucideCircleDashed size={16} class="animate-spin" />
		{:else}
			<LucidePlay size={16} />
		{/if}
	</Button>
{/snippet}

{#snippet copyCodeButton()}
	<Button variant="outline" class="size-8 py-1" size="icon" type="button" onclick={copyCode}>
		<Copy size={16} />
	</Button>
{/snippet}

<CodeblockContainer title={store.title}>
	{@render children?.()}

	{#snippet actions()}
		{#if runCode}
			{@render runCodeButton()}
		{:else if store.codeblocks.length <= 1}
			{@render copyCodeButton()}
		{/if}
	{/snippet}

	{#snippet underTitle()}
		<div class="flex justify-end gap-1.5 px-1">
			{#if store.codeblocks.length > 1}
				{@render tabs()}
				{@render copyCodeButton()}
			{/if}
		</div>
	{/snippet}

	{#if selectedCodeblock}
		<CodeblockContent code={selectedCodeblock.code} lang={selectedCodeblock.lang} />
	{/if}
</CodeblockContainer>

{#if runCode && runRes.response && runResStr !== '{}'}
	<CodeblockSampleResponse value={runResStr} />
{/if}
