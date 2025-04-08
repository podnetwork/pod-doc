import Fuse, { type FuseResult } from 'fuse.js';
import { writable } from 'svelte/store';
import type { DocEntry } from '../../routes/internal/search/+server';

// Initial search state
type SearchState = {
  query: string;
  results: DocEntry[];
  isLoading: boolean;
  index: DocEntry[];
  fuse: Fuse<DocEntry> | null;
  initialized: boolean;
};

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  index: [],
  fuse: null,
  initialized: false
};

function createSearchStore() {
  const { subscribe, update } = writable<SearchState>(initialState);

  return {
    subscribe,

    // Initialize the search store with document index
    init: async () => {
      update((state) => ({ ...state, isLoading: true }));

      try {
        const response = await fetch('/internal/search');
        const docs = await response.json();

        // Initialize Fuse.js with our documents
        const fuse = new Fuse<DocEntry>(docs, {
          keys: [
            { name: 'title', weight: 1.0 },
            { name: 'headings', weight: 0.8 },
            { name: 'content', weight: 0.6 }
          ],
          includeMatches: true,
          threshold: 0.3,
          ignoreLocation: true
        });

        update((state) => ({
          ...state,
          index: docs,
          fuse,
          initialized: true,
          isLoading: false
        }));
      } catch (error) {
        console.error('Failed to initialize search:', error);
        update((state) => ({ ...state, isLoading: false }));
      }
    },

    // Set the search query and update results
    setQuery: (query: string) => {
      update((state) => {
        if (!query.trim()) {
          return { ...state, query, results: [] };
        }

        if (!state.fuse) {
          return { ...state, query };
        }

        // Perform search using Fuse.js
        const results = state.fuse.search(query) as FuseResult<DocEntry>[];

        return {
          ...state,
          query,
          results: results.map((result) => result.item)
        };
      });
    },

    // Reset the search
    reset: () => {
      update((state) => ({ ...state, query: '', results: [] }));
    }
  };
}

export const searchStore = createSearchStore();

// Create a derived store for the search modal state
export const isSearchOpen = writable(false);

// Helper to open the search modal with keyboard shortcut
export function initSearchShortcut() {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Open search on Cmd+K or Ctrl+K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      isSearchOpen.set(true);
    }

    // Close search on Escape
    if (event.key === 'Escape') {
      isSearchOpen.set(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
