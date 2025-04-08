<script module lang="ts">
	export class FieldGroupStyle {
		static INPUT = [
			/*  */
			/* tw */ `appearance-none w-full bg-transparent disabled:text-muted-foreground`,
			/* tw */ `text-xs`,
			/* tw */ `grow-0 outline-none`,
			/* tw */ `rounded-sm`,
			/* tw */ `pb-1 pt-1`,
		];

		static SELECT = [
			/*  */
			/* tw */ `appearance-none w-full bg-transparent disabled:text-muted-foreground`,
			/* tw */ `text-xs`,
			/* tw */ `grow-0 outline-none`,
			/* tw */ `rounded-sm`,
			/* tw */ `pb-1 pt-1`,
		];

		static TEXTAREA = [
			/*  */
			/* tw */ `appearance-none w-auto bg-transparent disabled:text-muted-foreground`,
			/* tw */ `text-xs`,
			/* tw */ `grow-0 outline-none`,
			/* tw */ `rounded-sm`,
			/* tw */ `-mx-2 px-2 pt-2`
		];

		static CHECKBOX = [/* tw */ `flex items-center gap-2 text-xs pt-2`];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className,
		label,
		error,
		stack = false,
		tip,
		stackHorizontal = false
	}: {
		children: Snippet;
		class?: any;
		label?: string;
		error?: string | string[];
		stack?: boolean;
		stackHorizontal?: boolean;
		tip?: Snippet;
	} = $props();

	let e = $derived(error ? (Array.isArray(error) ? error[0] : error) : undefined);
</script>

<label
	class={[
		'field-group',
		'flex min-h-12 w-full flex-col justify-end',
		'border border-input px-3 py-1 text-base shadow-sm transition-colors',
		'focus-within:relative focus-within:z-[1] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'bg-background dark:bg-accent',
		'border-border dark:border-foreground/[10%]',
		stack ? (stackHorizontal ? ['stack-horizontal'] : ['stack']) : ['no-stack'],
		className
	]}
>
	{#if label?.length}
		<p
			class={[
				'text-xs font-medium leading-none',
				'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				'text-muted-foreground',
				'mb-auto mt-0.5',
				'flex gap-2'
			]}
		>
			{label}

			{#if e}
				<span class="truncate text-destructive">{e}</span>
			{/if}
		</p>
	{/if}

	{@render children()}

	{#if tip}
		<div
			class={['tip', '-mx-3 -mb-1 mt-1 flex-1 border-t bg-foreground/5 px-3 py-1.5 text-xs', className]}
		>
			{@render tip()}
		</div>
	{/if}
</label>

<style lang="postcss">
	.field-group {
		&.stack-horizontal {
			@apply -mr-px;

			&:first-of-type {
				@apply rounded-l-md;
			}

			&:last-of-type {
				@apply rounded-r-md;
			}

			&:last-child {
				@apply mr-0;
			}
		}
		&.stack {
			@apply -mb-px;

			&:last-of-type {
				@apply rounded-b-md;

				.tip {
					@apply rounded-b-md;
				}
			}

			&:first-of-type {
				@apply rounded-t-md;

				.tip {
					@apply rounded-t-md;
				}
			}

			&:last-child {
				@apply mb-0;
			}
		}
		&.no-stack {
			@apply rounded-md;

			.tip {
				@apply rounded-b-md;
			}
		}
	}
</style>
