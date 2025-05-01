<script lang="ts">
	let { children } = $props();
</script>

<div class="gridstack-block">
	<div class="">
        {@render children()}
		<div class="top">&nbsp;</div>
		<div class="bottom">&nbsp;</div>
	</div>
</div>

<style lang="postcss">
	.gridstack-block {
		@apply overflow-hidden;

		:global(> div) {
			box-sizing: border-box;
			position: relative;
			@apply border bg-muted px-8 py-8;
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
			@apply border border-border dark:border-background bg-background;
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
                @apply mt-0 mb-2;
            }
        }
	}
</style>
