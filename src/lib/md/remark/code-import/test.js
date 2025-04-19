// @ts-ignore
import { compile } from 'mdsvex';
import fs from 'node:fs/promises';
import plugin from './index.js';

(async function () {
	const file1Content = await fs.readFile(`${import.meta.dirname}/file1.md`, 'utf-8');
	const file1 = await compile(file1Content, {
		remarkPlugins: [plugin]
	});

	// save to file file1_test.md
	await fs.writeFile(`${import.meta.dirname}/file1_test.md`, String(file1.code));

	const file2Content = await fs.readFile(`${import.meta.dirname}/file2.md`, 'utf-8');
	const file2 = await compile(file2Content, {
		remarkPlugins: [plugin]
	});

	// save to file file2_test.md
	await fs.writeFile(`${import.meta.dirname}/file2_test.md`, String(file2.code));

	console.log('Test completed');
})();
