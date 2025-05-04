// @ts-ignore
import { compile } from 'mdsvex';
import fs from 'node:fs/promises';
import normalizeMarkdown from '../../normalize-md-preprocess/index.js';
import plugin from './index.js';

(async function () {
	const filepath = `${import.meta.dirname}/file1.md`;
	let file1Content = await fs.readFile(filepath, 'utf-8');

	// test with transform
	file1Content = normalizeMarkdown().markup({ content: file1Content, filename: filepath }).code;

	const file1 = await compile(file1Content, {
		// filename: filepath,
		/** @type {any} */
		remarkPlugins: [
			[
				plugin,
				{
					dev: true
				}
			]
		]
	});

	// save to file file1_test.md
	await fs.writeFile(`${import.meta.dirname}/file1_test.md`, String(file1?.code));

	console.log('Test completed');
})();
