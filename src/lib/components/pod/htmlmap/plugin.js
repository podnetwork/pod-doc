/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { visit } from 'unist-util-visit';

/**
 * @import {Root} from 'hast'
 */

/**
 * Add `id`s to headings.
 *
 * @returns
 *   Transform.
 */
export function rehypeHTMLMap() {
	/**
	 * @param {Root} tree
	 * @return {Promise<undefined>}
	 */
	return async function (tree) {
		// const nodes = [];

		visit(tree, function (node) {
			if (node.value === '' || node.value === '\n' || node.type === 'root') {
				return;
			}

			// keep copy of origin node
			// nodes.push(JSON.parse(JSON.stringify(node)));

			// modify node

			if (node.type === 'element' && node.tagName === 'p') {
				const text = node.children[0].value;

				switch (text) {
					default:
						return;

					case '[content]':
						Object.assign(node, {
							type: 'raw',
							value: '<div>',
							children: []
						});
						return;

					case '[/content]':
						Object.assign(node, {
							type: 'raw',
							value: '</div>',
							children: []
						});
						return;
				}
			}
		});

		// await fs.writeFile(`${import.meta.dirname}/tree.json`, JSON.stringify(nodes, null, 2));
	};
}
