/**
 * @import {Root, Paragraph, Text, Code} from 'mdast'
 */

/**
 * @import {Match} from '../util'
 */

import json5 from 'json5';
import fs from 'node:fs';
import { CONTINUE, visit } from 'unist-util-visit';
import { RemarkUtil } from '../util.js';

/**
 * @typedef {Object} Options
 * @property {boolean} [dev]
 */

/**
 * extends markdown code with custom tags from pod network project
 *
 * @param {Options} opts
 * @returns
 *   Transform.
 */
export default function RemarkCustomTag(opts = {}) {
	const isDev = !!opts.dev;

	/**
	 * @param {Root} tree
	 * @param {any} file
	 * @return {undefined}
	 */
	return function (tree, { filename }) {
		// in dev mode, because we call mdsvex via `compile` function
		// mdsvex will unknown the current file compiled
		// we need override the filename to simulate
		if (isDev) {
			filename = `${import.meta.dirname}/anyname.md`;
		}

		// write tree to json file name test_tree.json in same folder
		// fs.writeFileSync(`${import.meta.dirname}/test_tree.json`, JSON.stringify(tree, null, 2));

		// store lines of script want to add to content of page
		/** @type {string[]} */
		const scriptLines = [];

		// travels nodes in tree
		visit(tree, (child) => {
			// take nodes are code for codeblock code snippet
			if (child.type === 'code') {
				return transformCode(child);
			}

			if (child.type === 'inlineCode') {
				// support custom break line of code
				// usually we want use it inside table where not accept long text of code
				if (child.value.startsWith('! break-all ')) {
					console.log('start');
					Object.assign(child, {
						type: 'html',
						value: `<code class="inlinecode-break-all">${child.value.replace('! break-all ', '')}</code>`
					});
				}
				return CONTINUE;
			}

			// in almost of case, custom tag begining is as text line that markdown can not understand
			// it always wrap with a <P> and text we need is first children inside
			// normally each <p> will have only 1 text node

			// update 2025-05-02:
			// follow the request of Shresth, we will support case double space, not empty line
			/** @type {Text | undefined} */
			let syntaxLine = void 0;
			/** @type {Text|Paragraph|undefined} */
			let line = void 0;

			switch (child.type) {
				default: {
					return CONTINUE;
				}
				case 'paragraph': {
					if (child.children.length !== 1) return CONTINUE;
					if (child.children[0].type !== 'text') return CONTINUE;
					line = child;
					syntaxLine = child.children[0];
					break;
				}
				case 'text': {
					line = child;
					syntaxLine = child;
					break;
				}
			}

			if (!syntaxLine || !line) return CONTINUE;

			// inspect text line, it should start with custom tag prefix ! and following a space
			const matched = RemarkUtil.matchCustomTag(syntaxLine.value);
			if (!matched) return CONTINUE;

			const { prefix } = matched;

			switch (prefix) {
				default:
					return CONTINUE;
				case 'sticky':
					return Sticky(line, matched);
				case 'anchor':
					return Anchor(line, matched);
				case 'content':
					return Content(line, matched);
				case 'codeblock':
					return Codeblock(line, matched, filename);
				case 'gridstack':
					return Gridstack(line, matched);
				case 'grid':
					return Grid(line, matched);
				case 'table':
					return Table(line, matched);
				case 'import':
					return ImportComponent(line, matched, scriptLines);
			}
		});

		const scriptTag = RemarkUtil.getFirstScript(tree);

		// remove inject code if script tag content had code injected
		if (
			!scriptTag ||
			(!scriptTag.value.includes('import {Code} from') &&
				!scriptTag.value.includes('import { Code } from'))
		) {
			scriptLines.unshift('import {Code} from "$lib";');
		}

		// inject script code to script tag
		RemarkUtil.prependToScriptTag(tree, scriptLines.join('\n'));
	};
}

/**
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Sticky(child, match) {
	const { modifier } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: '<Code.Sticky>',
				children: void 0
			});
			return CONTINUE;
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: '</Code.Sticky>',
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * anchor
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Anchor(child, match) {
	Object.assign(child, {
		type: 'html',
		value: `<span class="pod-anchor" id="${match.modifier}"></span>`,
		children: void 0
	});
	return CONTINUE;
}

/**
 * content
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Content(child, match) {
	const { modifier, attrs } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: `<div ${attrs} data-anchor>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: `</div>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'empty': {
			Object.assign(child, {
				type: 'html',
				value: '<div>&nbsp;</div>',
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * codeblock
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @param {string} filename
 * @returns
 */
function Codeblock(child, match, filename) {
	const { modifier, attrs } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: `<Code.Provider ${attrs}>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'import': {
			let [lang, path, ...restAttrs] = attrs.split(' ');

			const subAttrs = restAttrs.join(' ');

			// get directory of current file
			const base = filename.split('/').slice(0, -1).join('/') + '/';

			// cleanup quotes in path
			path = path.replace(/['"`]/g, '');

			// remove ./ prefix from path
			path = path.replace(/^\.\//, '');

			// assume the path is relative to current file
			path = `${base}${path}`;

			// from path, read file content
			const content = fs.readFileSync(path, 'utf-8');

			// create new codeblock node
			Object.assign(child, {
				value: content,
				type: 'code',
				lang,
				meta: subAttrs,
				children: void 0
			});

			/** @type {any} */
			const newChild = child;
			return transformCode(newChild);
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: `<Code.Sample></Code.Sample> </Code.Provider>`,
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * gridstack
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Gridstack(child, match) {
	const { modifier, attrs } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: `<Code.GridstackContainer ${attrs}>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: `</Code.GridstackContainer>`,
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * grid
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Grid(child, match) {
	const { modifier, attrs } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: `<Code.GridstackBlock ${attrs}>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: `</Code.GridstackBlock>`,
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * table with styles
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @returns
 */
function Table(child, match) {
	const { modifier, attrs } = match;
	switch (modifier) {
		case 'style1': {
			Object.assign(child, {
				type: 'html',
				value: `<Code.Table styleId="${modifier}" ${attrs}>`,
				children: void 0
			});
			return CONTINUE;
		}
		case 'end': {
			Object.assign(child, {
				type: 'html',
				value: `</Code.Table>`,
				children: void 0
			});
			return CONTINUE;
		}
	}
}

/**
 * import component
 *
 * @param {Paragraph|Text} child
 * @param {Match} match
 * @param {string[]} scriptLines
 */
function ImportComponent(child, match, scriptLines) {
	const { modifier } = match; // modifier = file path

	// get filename from file path
	const filename = modifier.split('/').pop();
	if (!filename) return;

	// remove extension
	const name = filename.split('.')[0];

	// create Camelcase version from name
	let camelCaseName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replaceAll('-', '');
	// make first character uppercase
	camelCaseName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);

	// create import statement
	const importStatement = `import ${camelCaseName} from '${modifier}';`;
	scriptLines.push(importStatement);

	// replace child value to svelte import
	Object.assign(child, {
		type: 'html',
		value: `<${camelCaseName} />`,
		children: void 0
	});

	return CONTINUE;
}

/**
 * transform code node to svelte code component
 *
 * @param {Code} child
 * @returns
 */
function transformCode(child) {
	const lang = child.lang;
	const meta = child.meta;
	const code = child.value;

	Object.assign(child, {
		type: 'html',
		value: `<Code.Code code={${json5.stringify(code)}} lang="${lang}" ${meta}></Code.Code>`,
		children: void 0
	});

	return CONTINUE;
}
