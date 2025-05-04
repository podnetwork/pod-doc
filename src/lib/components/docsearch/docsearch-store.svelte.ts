import { App } from '$lib/app.svelte';
import type { DocEntry } from '$lib/prebuild/build-search';
import source from '$lib/search-content.json';
import Fuse, { type FuseResult } from 'fuse.js';
import { map, Subject, tap, throttleTime } from 'rxjs';
import { untrack } from 'svelte';

export class DocSearchStore {
	constructor(private readonly app: App) {
		$effect(() => {
			if (this.version && this.source.length > 0) {
				untrack(() => {
					this.fuse = new Fuse<DocEntry>(this.source as DocEntry[], {
						keys: [
							{ name: 'title', weight: 1.0 },
							{ name: 'heading', weight: 0.8 },
							{ name: 'content', weight: 0.6 }
						],
						includeMatches: true,
						threshold: 0.3,
						ignoreLocation: true
					});
				});
			}
		});

		$effect(() => {
			if (!this.version || !this.source.length) return;
			const sub = this.searchByKeyword$.subscribe();
			return () => sub.unsubscribe();
		});

		$effect(() => {
			if (this.keyword != void 0) {
				untrack(() => {
					this.keyword$.next(this.keyword);
				});
			}
		});
	}

	fuse: Fuse<DocEntry> | undefined;

	get version() {
		return this.app.version2.version;
	}

	get source() {
		return source[this.version as keyof typeof source] ?? [];
	}

	searching = $state(false);

	keyword = $state('');

	result = $state<FuseResult<DocEntry>[]>([]);

	noSearch = $derived.by(() => this.keyword.length === 0);

	// search progress
	private keyword$ = new Subject<string>();

	private searchByKeyword$ = this.keyword$.pipe(
		tap(() => (!this.searching ? (this.searching = true) : void 0)),
		throttleTime(200, void 0, { trailing: true, leading: true }),
		map((str) => {
			console.log(str);
			if (!str || !str.length) {
				this.result = [];
				return;
			}
			this.result = this.fuse?.search(str) ?? [];
		}),
		tap(() => (this.searching = false))
	);

	// control open search command
	open = $state(false);
}
