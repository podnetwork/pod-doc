/**
 * @import {Root, Paragraph} from 'mdast'
 */

/**
 * @import {Match} from '../util'
 */

import json5 from 'json5';
import { CONTINUE, visit } from 'unist-util-visit';
import { RemarkUtil } from '../util.js';

/**
 * extends markdown code with custom tags from pod network project
 *
 * @returns
 *   Transform.
 */
export default function RemarkCustomTag() {
	/**
	 * @param {Root} tree
	 * @return {undefined}
	 */
	return function (tree) {
		// store lines of script want to add to content of page
		/** @type {string[]} */
		const scriptLines = [];

		// travels nodes in tree
		visit(tree, (child) => {
			// in almost of case, custom tag begining is as text line that markdown can not understand
			// it always wrap with a <P> and text we need is first children inside
			// normally each <p> will have only 1 text node
			if (child.type === 'paragraph') {
				const firstChild = child.children[0];

				if (!firstChild) return CONTINUE;
				if (firstChild.type !== 'text') return CONTINUE;

				// inspect text line, it should start with custom tag prefix ! and following a space
				const matched = RemarkUtil.matchCustomTag(firstChild.value);
				if (!matched) return CONTINUE;

				const { prefix } = matched;

				switch (prefix) {
					default:
						return CONTINUE;
					case 'sticky':
						return Sticky(child, matched);
					case 'anchor':
						return Anchor(child, matched);
					case 'content':
						return Content(child, matched);
					case 'codeblock':
						return Codeblock(child, matched);
					case 'gridstack':
						return Gridstack(child, matched);
					case 'grid':
						return Grid(child, matched);
					case 'table':
						return Table(child, matched);
					case 'import':
						return ImportComponent(child, matched, scriptLines);
				}
			}

			// take nodes are code for codeblock code snippet
			if (child.type === 'code') {
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
 * @param {Paragraph} child
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
 * @param {Paragraph} child
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
 * @param {Paragraph} child
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
 * @param {Paragraph} child
 * @param {Match} match
 * @returns
 */
function Codeblock(child, match) {
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
 * @param {Paragraph} child
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
 * @param {Paragraph} child
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
 * @param {Paragraph} child
 * @param {Match} match
 * @returns
 */
function Table(child, match) {
	const { modifier, attrs } = match;
	switch (modifier) {
		default: {
			Object.assign(child, {
				type: 'html',
				value: `<Code.Table ${attrs}>`,
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
 * @param {Paragraph} child
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
