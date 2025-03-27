<script lang="ts">
	import { Shiki } from '$lib/shiki/shiki';
	import { tap } from 'rxjs';

	let { code, lang }: { code: string; lang?: string } = $props();

	const langClass = `language-${lang}`;

	let codeRef = $state<HTMLElement>();

	let init = $state(false);

	$effect(() => {
		if (!lang || !codeRef) return;

		const sub = Shiki.render(lang, code)
			.pipe(
				tap((html) => {
					codeRef!.innerHTML = html;
					init = true;
				})
			)
			.subscribe();

		return () => {
			sub.unsubscribe();
		};
	});
</script>

<div
	class={['codeblock-code', langClass, 'duration-200', init ? 'opacity-100' : 'opacity-0']}
	bind:this={codeRef}
>
	{@html code}
</div>

<style lang="postcss">
	.codeblock-code {
		@apply flex-1 overflow-auto;
		@apply h-full rounded-b-sm;

		:global(> pre) {
			@apply p-2 px-2.5 text-xs h-full;
			@apply overflow-auto;
		}

		:global(> table) {
			@apply mx-2.5;
		}

		:global(code) {
			counter-reset: step;
			counter-increment: step 0;
		}

		:global(code .line::before) {
			content: counter(step);
			counter-increment: step;
			width: 1rem;
			margin-right: 1.5rem;
			display: inline-block;
			text-align: right;
			color: rgba(115, 138, 148, 0.4);
		}
	}
</style>
