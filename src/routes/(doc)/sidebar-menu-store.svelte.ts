import { replaceState } from '$app/navigation';
import { page, updated } from '$app/state';
import { App } from '$lib/app.svelte';
import transformedData from '$lib/transformed-data.json';
import { getContext, setContext, tick } from 'svelte';
import { innerHeight } from 'svelte/reactivity/window';

type TransformedData = typeof transformedData;

export interface SidebarItem {
	href?: string;
	label?: string;
	children?: SidebarItem[];
	heading?: string;
	navId?: string;
}

export interface NavHeading {
	label: string;
	href: string;
	navId: string;
}

export class SidebarMenuStore {
	static sid = Symbol.for('sidebar');

	static create() {
		return setContext(this.sid, new SidebarMenuStore());
	}

	static get() {
		return getContext<SidebarMenuStore>(this.sid);
	}

	constructor() {
		$effect(() => {
			const ver = this.app.version2.version as keyof TransformedData;
			if (ver) {
				this.itemsRaw = (transformedData as TransformedData)[ver]?.menu ?? [];
			}
		});

		// sync with programatically page changes
		$effect(() => {
			this.curl = page.url;
		});
	}

	readonly app = App.get();

	// keep alternative current section/anchor point to, because limit of svelte page state
	// not reactive when manual change url
	curl = $state<URL>(page.url);

	// TOC tracking
	visibleId = $state<string>();

	blockTracking = $state(false);

	tocTracking(pageContentEl?: HTMLDivElement, url?: URL) {
		url ??= page.url;

		// if pagecontent not ready then silent
		if (!pageContentEl) return;

		// listen dom, collect heading h2
		// const hs = pageContentEl.querySelectorAll('h1, h2, h3, h4');
		const hs = pageContentEl.querySelectorAll('.pod-anchor')

		// use observable
		const observer = new IntersectionObserver(
			(entries) => {
				if (this.blockTracking) return;

				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// update url
						if (this.itemIDs.includes(entry.target.id)) {
							this.visibleId = entry.target.id;
							this.manualUpdateHash(entry.target.id);
						}
					} else {
						// console.log(`Heading ${entry.target.id} is not in viewport`);
					}
				});
			},
			{
				rootMargin: `-80px 0px -${(innerHeight.current ?? 0) - 180}px 0px`,
				threshold: 0
			}
		);

		// start observer
		hs.forEach((h2) => {
			observer.observe(h2);
		});

		return () => {
			observer.disconnect();
		};
	}

	// manually update url
	manualUpdateHash(hash: string) {
		const curl = window.location.href;
		// Update the URL hash without reloading the page
		const url = new URL(curl);
		url.hash = `#${hash}`;
		// history.replaceState(null, '', url.toString());

		replaceState(url.toString(), {});
		this.curl = url;
		tick().then(() => updated.check());
	}

	// items
	hashMap = $state<Record<string, Record<string, string>>>({});

	headings(url: string, hashes: Record<string, string>) {
		this.hashMap[url] = hashes;
	}

	itemsRaw = $state<SidebarItem[]>([]);

	// readonly
	items = $derived(this.itemsRaw);

	itemIDs = $derived(
		this.items.flatMap((item) => {
			// Get IDs from current level
			const ids = item.href?.split('#')[1] ? [item.href.split('#')[1]] : [];
			// Recursively get IDs from children
			const childIds =
				item.children?.flatMap((child) =>
					child.href?.split('#')[1] ? [child.href.split('#')[1]] : []
				) || [];
			return [...ids, ...childIds];
		})
	);

	currentItem = $derived.by(() => {
		const id = this.visibleId;
		// Recursive search through items and their children
		const findItem = (items: SidebarItem[]): SidebarItem | null => {
			for (const item of items) {
				if (item.href?.split('#')[1] === id) return item;
				if (item.children?.length) {
					const found = findItem(item.children);
					if (found) return found;
				}
			}
			return null;
		};
		return findItem(this.items);
	});

	currentNavId = $derived.by(() => {
		for (const item of this.items) {
			if (this.isActive(item)) {
				return item.navId;
			}
		}
		return null;
	});

	isActive(item: SidebarItem) {
		if (item.heading) return false;

		const home = '';

		const ihref = (item.href ?? '').trim().replace(/\/$/, '');
		const phref = this.curl.pathname.trim().replace(/\/$/, '');

		if (ihref === home) {
			return ihref === phref;
		}

		if (ihref.includes('#')) {
			const str = `${phref}${this.curl.hash}`;
			return str.startsWith(ihref);
		}

		return phref.startsWith(ihref);
	}
}
