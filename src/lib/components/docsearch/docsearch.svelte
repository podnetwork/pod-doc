<script lang="ts">
	import { goto } from '$app/navigation';
	import { App } from '$lib/app.svelte';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import DocsearchClosebtn from './docsearch-closebtn.svelte';
	import DocsearchInputIcon from './docsearch-input-icon.svelte';

	const app = App.get();

	// control select index
	let selectedHash = $state('');

	// clear selected hash when close
	$effect(() => {
		if (!app.searchStore.open) {
			selectedHash = '';
		}
	});

	let resultItems = $state<HTMLLIElement[]>([]);

	function handleKeydown(e: KeyboardEvent) {
		// Open search on Cmd+K or Ctrl+K
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			app.searchStore.open = !app.searchStore.open;
			return;
		}

		// Close search on Escape
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
			e.preventDefault();

			let newIndex = 0;

			switch (e.key) {
				case 'ArrowDown': {
					if (selectedHash === '') {
						selectedHash = app.searchStore.result[0].item.hash;
						newIndex = 0;
						break;
					}

					const index = app.searchStore.result.findIndex(
						(result) => result.item.hash === selectedHash
					);
					newIndex = Math.min(index + 1, app.searchStore.result.length - 1);
					selectedHash = app.searchStore.result[newIndex].item.hash;
					break;
				}

				case 'ArrowUp': {
					if (selectedHash === '') {
						selectedHash = app.searchStore.result[0].item.hash;
						newIndex = 0;
						break;
					}

					const index = app.searchStore.result.findIndex(
						(result) => result.item.hash === selectedHash
					);
					newIndex = Math.max(index - 1, 0);
					selectedHash = app.searchStore.result[newIndex].item.hash;
					break;
				}
			}

			// wait next tick then scroll to selected item
			tick().then(() => {
				const selectedItem = resultItems[newIndex];
				if (selectedItem) {
					selectedItem.scrollIntoView({ behavior: 'smooth' });
				}
			});

			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			const selectedItem = app.searchStore.result.find((i) => i.item.hash === selectedHash);
			if (selectedItem) {
				goto(selectedItem.item.url);
				close();
			}
		}
	}

	const close = () => {
		app.searchStore.open = false;
	};

	function formatPreview(content: string, query: string): string {
		if (!query) return content.slice(0, 150) + '...';

		const lowerContent = content.toLowerCase();
		const lowerQuery = query.toLowerCase();
		const index = lowerContent.indexOf(lowerQuery);

		if (index === -1) return content.slice(0, 150) + '...';

		// Get a window of text around the match
		const start = Math.max(0, index - 75);
		const end = Math.min(content.length, index + query.length + 75);
		let preview = content.slice(start, end);

		// Add ellipsis if needed
		if (start > 0) preview = '...' + preview;
		if (end < content.length) preview = preview + '...';

		return preview;
	}
</script>

<svelte:document onkeydown={handleKeydown} />

{#if app.searchStore.open}
	<button
		type="button"
		class="fixed inset-0 z-50 bg-black/50"
		onclick={close}
		tabindex={0}
		aria-label="Close search"
		transition:fade={{ duration: 200 }}
	></button>

	<div
		class="fixed inset-x-0 top-24 z-50 mx-auto max-w-xl overflow-hidden rounded-lg bg-background shadow-xl dark:bg-secondary"
		transition:fly={{ y: -20, duration: 200 }}
	>
		<div class="flex items-center border border-border p-4">
			<DocsearchInputIcon />

			<input
				type="text"
				placeholder="Search documentation..."
				class="w-full bg-transparent px-4 py-2 focus:outline-none"
				bind:value={app.searchStore.keyword}
			/>

			<DocsearchClosebtn onclose={close} />
		</div>

		<div class="max-h-[50vh] overflow-y-auto">
			{#if app.searchStore.searching}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">Loading search index...</div>
			{:else if app.searchStore.open && app.searchStore.result.length === 0}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					{#if app.searchStore.noSearch}
						Type something to search
					{:else}
						No results found for "{app.searchStore.keyword}"
					{/if}
				</div>
			{:else if app.searchStore.result.length > 0}
				<ul class="divide-y divide-border">
					{#each app.searchStore.result as result, i (result.item.hash)}
						{@const isActive = selectedHash === result.item.hash}

						<li
							bind:this={resultItems[i]}
							class={[
								'cursor-pointer p-4 hover:bg-primary/5',
								isActive ? 'bg-primary/10 dark:bg-primary/20' : ''
							]}
						>
							<a href={result.item.url} onclick={close} class="block">
								<p class="text-xs text-muted-foreground">{result.item.title}</p>
								<h3 class="text-[1rem] font-semibold leading-[1.25rem] text-primary">
									{result.item.heading}
								</h3>
								<p class="mt-1 text-[0.75rem] leading-[0.7rem] text-foreground/60">
									{result.item.urlPage}
								</p>
								{#if result.item.content}
									<p class="mt-4 text-[0.8rem] text-foreground/70">
										{formatPreview(result.item.content, app.searchStore.keyword)}
									</p>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="flex justify-between bg-secondary px-4 py-3 text-xs text-foreground/50">
			<div>
				<span class="mr-3 inline-flex items-center">
					<kbd class="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-600">↑</kbd>
					<kbd class="ml-1 rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-600">↓</kbd>
					<span class="ml-1">to navigate</span>
				</span>
				<span class="inline-flex items-center">
					<kbd class="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-600">Enter</kbd>
					<span class="ml-1">to select</span>
				</span>
			</div>
			<div>
				<span class="inline-flex items-center">
					<kbd class="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-600">Esc</kbd>
					<span class="ml-1">to close</span>
				</span>
			</div>
		</div>
	</div>
{/if}

<button
	type="button"
	class={[
		'inline-flex w-64 items-center justify-start rounded-md border border-border bg-background',
		'px-3 py-1.5 text-sm text-foreground/60 hover:bg-background/50 focus:outline-none'
	]}
	onclick={() => (app.searchStore.open = !app.searchStore.open)}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mr-1.5 h-4 w-4"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
	Search
	<div class="flex-1"></div>
	<span class="text-xs opacity-70">⌘K</span>
</button>
