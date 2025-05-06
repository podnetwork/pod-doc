<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		href
	}: {
		children: Snippet;
		href?: string;
	} = $props();

	let dynamicTag = $derived.by(() => (href ? 'a' : 'div'));
</script>

<div class="gridstack-block">
	<svelte:element this={dynamicTag as 'a' | 'div'} {href} class="block h-full">
		{@render children()}
		<div class="top">&nbsp;</div>
		<div class="bottom">&nbsp;</div>
	</svelte:element>
</div>

<style lang="postcss">
	.gridstack-block {
		@apply overflow-hidden;

		:global(> div, > a) {
			box-sizing: border-box;
			position: relative;
			@apply border bg-muted px-8 py-8;
		}

		:global(> a) {
			@apply cursor-pointer text-inherit no-underline;
			@apply transition-[opacity,border-color,background-color] duration-200;

			&:hover {
				@apply border-green-300 bg-green-50;

				.top:before,
				.top:after,
				.bottom:before,
				.bottom:after {
					@apply border-green-300;
				}
			}
		}

		.top,
		.bottom {
			@apply absolute left-0 top-0 size-full;
			@apply pointer-events-none;
		}

		.top:before,
		.top:after,
		.bottom:before,
		.bottom:after {
			content: ' ';
			@apply absolute;
			@apply border border-border bg-background dark:border-background;
			@apply transition-[opacity,border-color,background-color] duration-200;
			width: 40px;
			height: 40px;
		}

		.top:before {
			top: -25px;
			left: -25px;
		}

		.top:after {
			top: -25px;
			right: -25px;
			//box-shadow: inset 1px 1px 1px grey;
		}

		.bottom:before {
			bottom: -25px;
			left: -25px;
		}

		.bottom:after {
			bottom: -25px;
			right: -25px;
			//box-shadow: inset 1px 1px 1px grey;
		}

		:global(h1, h2, h3, h4, h5, h6) {
			&:first-child {
				@apply mb-2 mt-0;
			}
		}
	}

	:global(.dark) {
		.gridstack-block {
			:global(> a) {
				&:hover {
					@apply border-green-600 bg-green-900;

					.top:before,
					.top:after,
					.bottom:before,
					.bottom:after {
						@apply border-green-600;
					}
				}
			}
		}
	}
</style>
