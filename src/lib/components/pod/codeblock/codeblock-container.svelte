<script lang="ts">
	import type { ClassValue } from 'clsx';
	import { type Snippet } from 'svelte';

	let {
		class: className,
		children,
		title,
		actions,
		underTitle
	}: {
		class?: ClassValue;
		children?: Snippet;
		title?: string;
		actions?: Snippet;
		underTitle?: Snippet;
	} = $props();
</script>

<div class={['codeblock-container card2', className]}>
	<div class="codeblock-title">
		{#if title}
			<div class="codeblock-title-text">
				{title}
			</div>
		{:else}
			<div class="flex-1"></div>
		{/if}

		{#if actions}
			<div class="flex-none">
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if underTitle}
		{@render underTitle()}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="postcss">
	.codeblock-container {
		@apply flex flex-col;
		max-height: calc(100vh - theme(spacing.20) - theme(spacing.1));

		.codeblock-title {
			@apply rounded-t-sm px-1 py-1 text-xs;
			@apply flex gap-1 flex-none;

			.codeblock-title-text {
				@apply flex h-8 flex-1 items-center px-2 text-xs;
				@apply rounded-md bg-background font-medium;
			}
		}
	}
</style>
