/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import json5 from 'json5';
import { visit } from 'unist-util-visit';

function attrString2Obj(str) {
	if (!str) return {};
	const obj = {};
	const regex = /([^\s=]+)=(?:(?:"([^"]*)")|({[^}]*})|([^\s]*))/g;
	let match;

	while ((match = regex.exec(str)) !== null) {
		const [, key, quotedValue, bracketValue, plainValue] = match;
		obj[key] =
			quotedValue !== undefined
				? quotedValue
				: bracketValue !== undefined
					? bracketValue
					: plainValue;
	}

	return obj;
}

export function highlighter(code, lang, metaStr) {
	const metadata = attrString2Obj(metaStr);

	metadata.alias = metadata.alias || lang;
	// create special syntax allow to catch later by plugin
	let str = json5.stringify({
		...metadata,
		lang,
		code
	});
	return `codeblockcode:${str}`;
}

/**
 * @import {Root} from 'hast'
 */

/**
 * Add `id`s to headings.
 *
 * @returns
 *   Transform.
 */
export function rehypeCodeBlock() {
	// const nodes = [];

	let containerEl = null; // mark position

	let data = {}; // build code block element

	/**
	 * @param {Root} tree
	 * @return {undefined}
	 */
	return async function (tree) {
		visit(tree, function (node) {
			if (node.value === '' || node.value === '\n' || node.type === 'root') {
				return;
			}

			// nodes.push(JSON.parse(JSON.stringify(node))); // for debug

			const checkValue = node.children?.[0]?.value;

			// sticky 
			switch (checkValue) {
				default:
					break
				case '[sticky]':
					Object.assign(node, {
						type: 'raw',
						value: `<Code.Sticky>`
					})
					return;
				case '[/sticky]':
					Object.assign(node, {
						type: 'raw',
						value: `</Code.Sticky>`
					})
					return;
			}

			// open a codeblock
			if (checkValue === '[codeblock]') {
				if (node.children[1] && node.children[1].value.length > 0) {
					const attrString = node.children[1].value
						.trim()
						.replaceAll('”', '"')
						.replaceAll('“', '"');
					data.rawattr = attrString;
				}

				// remember the code block
				containerEl = node;

				return;
			}

			// catch [/codeblock]
			if (checkValue === '[/codeblock]') {
				// remove current node from tree
				Object.assign(node, {
					type: 'raw',
					value: `<!-- ${checkValue} -->`
				});

				// build code block
				if (containerEl) {
					containerEl.type = 'element';
					containerEl.tagName = 'div';
					const codeblocks = json5.stringify(data.rawCodeblocks);
					containerEl.children = [
						{
							type: 'raw',
							value: `<Code.Sample ${data.rawattr} codeblocks={${codeblocks}}></Code.Sample>`
						}
					];

					// clear container
					containerEl = null;
					data = {};
				}

				return;
			}

			// catch codes str inside
			if (node.type === 'raw' && node.value.startsWith('codeblockcode:')) {
				const codeRaw = node.value.split('codeblockcode:')[1];

				// add code to rawCodeblocks
				if (!data.rawCodeblocks) {
					data.rawCodeblocks = [];
				}

				const { lang, alias, code } = json5.parse(codeRaw);

				data.rawCodeblocks.push({ lang, alias, code });

				// remove current node from tree
				Object.assign(node, { type: 'raw', value: '' });
			}
		});

		// await fs.writeFile(`${import.meta.dirname}/tree.json`, JSON.stringify(nodes, null, 2));
	};
}
