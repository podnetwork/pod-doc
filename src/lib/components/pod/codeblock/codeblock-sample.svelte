<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Shiki } from '$lib/shiki/shiki';
	import { LucideCircleDashed, LucideClipboardCopy, LucidePlay } from '@lucide/svelte';
	import { catchError, defer, EMPTY, finalize, tap } from 'rxjs';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import CodeblockContainer from './codeblock-container.svelte';

	let {
		title,
		children,
		runCode,
	}: {
		title?: string;
		children?: Snippet;
		runCode?: () => Promise<Response>;
	} = $props();

	let ref = $state<HTMLDivElement>();

	function copyCode() {
		// copy code in element pre.code
		const code = ref?.querySelector('pre code')?.textContent?.trim();
		console.log(ref, code);
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

	let runBoardEl = $state<HTMLDivElement>();

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

	$effect(() => {
		if (!runBoardEl) return;

		if (runRes.response) {
			const str = JSON.stringify(runRes, null, 2);
			const sub = Shiki.render('json', str)
				.pipe(tap((html) => (runBoardEl!.innerHTML = html)))
				.subscribe();

			return () => {
				sub.unsubscribe();
			};
		}

		runBoardEl.innerHTML = '';
	});
</script>

<CodeblockContainer {title} >
    {#snippet actions()}
        {#if run}
            <Button variant="secondary" class="h-6 py-1" size="sm" type="button" onclick={run}>
                {#if runningCode}
                    <LucideCircleDashed size={16} class="animate-spin" />
                {:else}
                    <LucidePlay size={16} />
                {/if}
                Run sample
            </Button>
        {/if}

        <Button variant="secondary" class="size-6 py-1" size="icon" type="button" onclick={copyCode}>
            <LucideClipboardCopy size={16} />
        </Button>
    {/snippet}

	{#snippet children()}
		<div bind:this={ref}>
			{@render children?.()}
		</div>
	{/snippet}
</CodeblockContainer>

{#if run && runRes.response}
    <CodeblockContainer title={'Response'} class="mt-2">
        <div bind:this={runBoardEl}></div>
    </CodeblockContainer>
{/if}
