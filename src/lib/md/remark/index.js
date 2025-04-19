/// this file is endpoint of all remark plugins write for mdsvex and this project
/// read comments for more detail;
/// using in sveltekit allow write in ES6 syntax

import RemarkCodeImport from './code-import/index.js';
import RemarkContent from './content/index.js';

/** @type {any[]} */
export const remarkPlugins = [
	RemarkContent,
	RemarkCodeImport
];



