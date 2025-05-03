// @ts-ignore
import { compile } from 'mdsvex';
import fs from 'node:fs/promises';
import normalizeMarkdown from '../../normalize-md-preprocess/index.js';
import plugin from './index.js';

(async function () {
	let file1Content = await fs.readFile(`${import.meta.dirname}/file1.md`, 'utf-8');

	// test with transform
	file1Content = normalizeMarkdown().markup({ content: file1Content, filename: 'file1.md' }).code;

	const file1 = await compile(file1Content, {
		remarkPlugins: [plugin]
	});

	// save to file file1_test.md
	await fs.writeFile(`${import.meta.dirname}/file1_test.md`, String(file1.code));

	console.log('Test completed');
})();
