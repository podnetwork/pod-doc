import { replaceState } from '$app/navigation';
import { page, updated } from '$app/state';
import { getContext, setContext, tick } from 'svelte';

export interface SidebarItem {
	href?: string;
	label?: string;
	children?: SidebarItem[];
	heading?: string;
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
			this.makeItems();
		});
	}

	// version reference to url
	pageVersion = $derived(page.url.pathname.split('/')[1] || 'v1');

	// TOC tracking
	visibleId = $state<string>();

	tocTracking(pageContentEl?: HTMLDivElement, url?: URL) {
		url ??= page.url;

		// if pagecontent not ready then silent
		if (!pageContentEl) return;

		// listen dom, collect heading h2
		const h2s = pageContentEl.querySelectorAll('h2');

		// use observable
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// update url
						if (this.itemIDs.includes(entry.target.id)) {
							this.visibleId = entry.target.id;

							const curl = window.location.href;
							// Update the URL hash without reloading the page
							const url = new URL(curl);
							url.hash = `#${entry.target.id}`;
							// history.replaceState(null, '', url.toString());

							replaceState(url.toString(), {});
							tick().then(() => updated.check());

							// const id = entry.target.id;
							// const newUrl = new URL(window.location.href);
							// newUrl.hash = `#${id}`;
							// Use goto to update URL without page reload
							// goto(`#${id}`, { replaceState: true, noScroll: true, keepFocus: true });
						}
					} else {
						// console.log(`Heading ${entry.target.id} is not in viewport`);
					}
				});
			},
			{
				rootMargin: '-20% 0px -80% 0px',
				threshold: 0
			}
		);

		// start observer
		h2s.forEach((h2) => {
			observer.observe(h2);
		});

		return () => {
			observer.disconnect();
		};
	}

	// items
	hashMap = $state<Record<string, Record<string, string>>>({});

	headings(url: string, hashes: Record<string, string>) {
		this.hashMap[url] = hashes;
	}

	u(p: string) {
		return `/${this.pageVersion}${p}`;
	}

	items = $state<SidebarItem[]>([
		{ href: this.u('/'), label: 'Welcome to pod' },
		{ href: this.u('/getting-started'), label: 'Getting Started' },
		{ heading: 'How to guides' },
		{ href: this.u('/how-to-guides/payments'), label: 'Payments' },
		{ href: this.u('/how-to-guides/auctions'), label: 'Auctions' },
		{ href: this.u('/how-to-guides/feed-layer'), label: 'Feed Layer' },
		{ heading: 'Reference' },
		{
			href: this.u('/reference/rpc-api'),
			label: 'RPC API'
		}
	]);

	makeItems() {
		Object.entries(this.hashMap).forEach(([urlPartial, hashes]) => {
			const url = this.u(urlPartial);
			const item = this.items.find((i) => i.href === url);

			if (item) {
				item.children = Object.entries(hashes).map(([hash, label]) => ({
					href: `${url}#${hash}`,
					label: label
				}));
			}
		});
	}

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

	isActive(item: SidebarItem) {
		if (item.heading) return false;

		const home = `/${this.pageVersion}`;

		const ihref = (item.href ?? '').trim().replace(/\/$/, '');
		const phref = page.url.pathname.trim().replace(/\/$/, '');

		if (ihref === home) {
			return ihref === phref;
		}

		if (ihref.includes('#')) {
			const str = `${phref}${page.url.hash}`;
			return str.startsWith(ihref);
		}

		return phref.startsWith(ihref);
	}
}
