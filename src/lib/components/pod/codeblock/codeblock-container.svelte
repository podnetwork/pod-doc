<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { type Snippet } from 'svelte';

	let {
		class: className,
		children,
		title,
		actions,
	}: {
		class?: ClassValue;
		children?: Snippet;
		title?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class={['codeblock-container card2', className]}>
	<div class="codeblock-title">
		{#if title}
			{title}
		{/if}

		{#if actions}
			<div class="ml-auto">
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if children}
		<div class="codeblock-code">
			{@render children()}
		</div>
	{/if}
</div>

<style lang="postcss">
	.codeblock-container {
		@apply flex flex-col;
		max-height: calc(100vh - theme(spacing.20) - theme(spacing.1));

		.codeblock-title {
			@apply rounded-t-sm bg-muted px-2.5 py-2 text-xs uppercase;
			@apply flex items-center gap-2;
		}

		.codeblock-code {
			@apply flex-1 overflow-auto;
			@apply rounded-b-sm;

			:global(pre) {
				@apply overflow-auto p-2 px-2.5 text-sm;
			}

			:global(> table) {
				@apply mx-2.5;
			}
		}
	}
</style>
