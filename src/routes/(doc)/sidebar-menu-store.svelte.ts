import { goto } from '$app/navigation';
import { page } from '$app/state';
import { getContext, setContext } from 'svelte';

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
							goto(`#${entry.target.id}`, { keepFocus: true, replaceState: true, noScroll: true });
						}
					} else {
						// console.log(`Heading ${entry.target.id} is not in viewport`);
					}
				});
			},
			{
				rootMargin: '-50% 0px -50% 0px',
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

	items: SidebarItem[] = [
		{ href: '/', label: 'Welcome to pod' },
		{ href: '/getting-started', label: 'Getting Started' },
		{ heading: 'How to guides' },
		{ href: '/how-to-guides/payments', label: 'Payments' },
		{ href: '/how-to-guides/auctions', label: 'Auctions' },
		{ href: '/how-to-guides/feed-layer', label: 'Feed Layer' },
		{ heading: 'Reference' },
		{
			href: '/reference/rpc-api',
			label: 'RPC API',
			children: [
				{ href: '/reference/rpc-api#base-url', label: 'General' },
				{ href: '/reference/rpc-api#eth_blocknumber', label: 'eth_blocknumber' }
			]
		}
	];

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

	isActive(item: SidebarItem) {
		if (item.heading) return false;
		if (item.href === '/') return page.url.pathname === '/';

		if (item.href?.includes('#')) {
			const str = `${page.url.pathname}${page.url.hash}`;
			return str.startsWith(item.href ?? '');
		}

		return page.url.pathname.startsWith(item.href ?? '');
	}
}
