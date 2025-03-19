// place files you want to import through the `$lib` alias in this folder.

import CodeblockSample from "./components/pod/codeblock/codeblock-sample.svelte";
import CodeblockSticky from "./components/pod/codeblock/codeblock-sticky.svelte";

// codeblock components
export const Code = {
    Sample: CodeblockSample,
    Sticky: CodeblockSticky
}