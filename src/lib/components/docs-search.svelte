<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { DocEntry } from '../../routes/internal/search/+server';
	import { isSearchOpen, initSearchShortcut, searchStore } from '$lib/stores/searchStore';

	onMount(() => {
		searchStore.init();
		const cleanup = initSearchShortcut();

		return cleanup;
	});

	// Auto-focus the search input when modal opens
	let searchInput: HTMLInputElement;
	$: if ($isSearchOpen && searchInput) {
		setTimeout(() => searchInput.focus(), 50);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchStore.setQuery(target.value);
	}

	function closeSearch() {
		isSearchOpen.set(false);
	}

	let selectedIndex = 0;
	let resultsContainer: HTMLDivElement;
	let resultItems: HTMLLIElement[] = [];

	// Auto-scroll to keep selected item in view
	$: if (selectedIndex !== null && resultItems[selectedIndex] && resultsContainer) {
		const containerRect = resultsContainer.getBoundingClientRect();
		const itemRect = resultItems[selectedIndex].getBoundingClientRect();

		const isItemAbove = itemRect.top < containerRect.top;
		const isItemBelow = itemRect.bottom > containerRect.bottom;

		if (isItemAbove) {
			resultsContainer.scrollTo({
				top: resultsContainer.scrollTop + (itemRect.top - containerRect.top),
				behavior: 'smooth'
			});
		} else if (isItemBelow) {
			resultsContainer.scrollTo({
				top: resultsContainer.scrollTop + (itemRect.bottom - containerRect.bottom),
				behavior: 'smooth'
			});
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, $searchStore.results.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (event.key === 'Enter' && $searchStore.results.length > 0) {
			event.preventDefault();
			const selected = $searchStore.results[selectedIndex];
			if (selected) {
				navigateToResult(selected);
			}
		}
	}

	function navigateToResult(doc: DocEntry) {
		closeSearch();
		searchStore.reset();
		selectedIndex = 0;

		const cleanedSlug = doc.slug;
		window.location.href = '/' + cleanedSlug;
	}

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

{#if $isSearchOpen}
	<div
		class="fixed inset-0 z-50 bg-black/50"
		on:click={closeSearch}
		transition:fade={{ duration: 200 }}
	></div>

	<div
		class="fixed inset-x-0 top-24 z-50 mx-auto max-w-xl overflow-hidden rounded-lg bg-background shadow-xl dark:bg-secondary"
		transition:fly={{ y: -20, duration: 200 }}
	>
		<div class="flex items-center border border-border p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-foreground/40"
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

			<input
				bind:this={searchInput}
				type="text"
				placeholder="Search documentation..."
				class="w-full bg-transparent px-4 py-2 focus:outline-none"
				value={$searchStore.query}
				on:input={handleInput}
				on:keydown={handleKeydown}
			/>

			<button on:click={closeSearch} class="text-foreground/50 hover:text-foreground/70">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<div bind:this={resultsContainer} class="max-h-[50vh] overflow-y-auto">
			{#if $searchStore.isLoading}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">Loading search index...</div>
			{:else if $searchStore.query && $searchStore.results.length === 0}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					No results found for "{$searchStore.query}"
				</div>
			{:else if $searchStore.results.length > 0}
				<ul class="divide-y divide-border">
					{#each $searchStore.results as result, i}
						<li
							bind:this={resultItems[i]}
							class="cursor-pointer p-4 hover:bg-primary/5 {i === selectedIndex
								? 'bg-primary/10 dark:bg-primary/20'
								: ''}"
							on:click={() => navigateToResult(result)}
						>
							<a href={'/' + result.slug} class="block">
								<h3 class="text-[1rem] font-semibold leading-[1.25rem] text-primary">
									{result.title || result.slug}
								</h3>
								<p class="mt-1 text-[0.75rem] leading-[0.7rem] text-foreground/60">
									/{result.slug}
								</p>
								{#if result.content}
									<p class="mt-2 text-[0.8rem] text-foreground/70">
										{formatPreview(result.content, $searchStore.query)}
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
	on:click={() => isSearchOpen.set(true)}
	class="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground/60 hover:bg-background/50 focus:outline-none"
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
	<span class="ml-16 text-xs opacity-70">⌘K</span>
</button>
