<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { LucideCircleDashed, LucideClipboardCopy, LucidePlay } from '@lucide/svelte';
	import { catchError, defer, EMPTY, finalize, tap } from 'rxjs';
	import { toast } from 'svelte-sonner';
	import CodeblockCode from './codeblock-code.svelte';
	import CodeblockContainer from './codeblock-container.svelte';
	import CodeblockSampleResponse from './codeblock-sample-response.svelte';

	type CodeBlock = {
		lang: string;
		code: string;
		alias?: string;
	};

	let {
		title,
		runCode,
		codeblocks = []
	}: {
		title?: string;
		runCode?: () => Promise<Response>;
		codeblocks?: CodeBlock[];
	} = $props();

	let ref = $state<HTMLDivElement>();

	// replace raw input
	function copyCode() {
		// copy code in element pre.code
		const code = ref?.querySelector('pre code')?.textContent?.trim();
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

	let run = $derived(
		runCode
			? () => {
					runningCode = true;
					defer(runCode)
						.pipe(
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
						)
						.subscribe();
				}
			: undefined
	);

	// support multi code block

	let langs = $derived(codeblocks.map((i) => i.lang)) as string[];

	let selectedLang = $state<string>();

	let selectedCodeblock = $derived(codeblocks.find((i) => i.lang === selectedLang));

	$effect(() => {
		if (!langs.length) return;
		if (!selectedLang) {
			selectedLang = langs[0];
		}
	});
</script>

{#snippet tabs()}
	<Tabs.Root
		value={selectedLang}
		onValueChange={(value) => (selectedLang = value)}
		class="mx-0 flex-1 px-0"
	>
		<Tabs.List class="px-0">
			{#each codeblocks as codeblock}
				<Tabs.Trigger value={codeblock.lang} class="text-xs">
					{codeblock.alias ?? codeblock.lang}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>
{/snippet}

{#snippet runCodeButton()}
	<Button variant="outline" class="size-8" size="icon" type="button" onclick={run}>
		{#if runningCode}
			<LucideCircleDashed size={16} class="animate-spin" />
		{:else}
			<LucidePlay size={16} />
		{/if}
	</Button>
{/snippet}

{#snippet copyCodeButton()}
	<Button variant="outline" class="size-8 py-1" size="icon" type="button" onclick={copyCode}>
		<LucideClipboardCopy size={16} />
	</Button>
{/snippet}

<CodeblockContainer {title}>
	{#snippet actions()}
		{#if run}
			{@render runCodeButton()}
		{:else if codeblocks.length <= 1}
			{@render copyCodeButton()}
		{/if}
	{/snippet}

	{#snippet underTitle()}
		<div class="flex justify-end gap-1.5 px-1">
			{#if codeblocks.length > 1}
				{@render tabs()}
				{@render copyCodeButton()}
			{/if}
		</div>
	{/snippet}

	<div bind:this={ref}>
		{#if selectedCodeblock}
			<CodeblockCode code={selectedCodeblock.code} lang={selectedCodeblock.lang} />
		{/if}
	</div>
</CodeblockContainer>

{#if run && runRes.response && runResStr !== '{}'}
	<CodeblockSampleResponse value={runResStr} />
{/if}
