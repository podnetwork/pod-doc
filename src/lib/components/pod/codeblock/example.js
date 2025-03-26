/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { compile } from 'mdsvex';
import fs from 'node:fs/promises';
import { highlighter, rehypeCodeBlock } from './plugin.js';

const document = await fs.readFile(`${import.meta.dirname}/input.md`, 'utf8');

const transformed_code = await compile(document, {
	extensions: ['.svx', '.md'],
	filename: 'input.md',
	rehypePlugins: [rehypeCodeBlock],
	highlight: {
		highlighter: highlighter
	}
});

await fs.writeFile(`${import.meta.dirname}/output.html`, String(transformed_code.code));
