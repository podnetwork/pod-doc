/// this file is endpoint of all remark plugins write for mdsvex and this project
/// read comments for more detail;
/// using in sveltekit allow write in ES6 syntax

import RemarkCustomTag from './custom-tag/index.js';

/** @type {any[]} */
export const remarkPlugins = [
	RemarkCustomTag,
];



