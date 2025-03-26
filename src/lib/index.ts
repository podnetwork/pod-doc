// place files you want to import through the `$lib` alias in this folder.

import { SidebarMenuStore } from '../routes/(doc)/sidebar-menu-store.svelte';
import CodeblockCode from './components/pod/codeblock/codeblock-code.svelte';
import CodeblockSample from './components/pod/codeblock/codeblock-sample.svelte';
import CodeblockSticky from './components/pod/codeblock/codeblock-sticky.svelte';

// codeblock components
export const Code = {
	Sample: CodeblockSample,
	Sticky: CodeblockSticky,
	Code: CodeblockCode,
	Sidebar: () => SidebarMenuStore.get()
};
