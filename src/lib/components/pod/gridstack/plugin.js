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
export function rehypeGridstack() {
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

					case '[gridstack]':
						Object.assign(node, {
							type: 'raw',
							value: '<Code.GridstackContainer>',
							children: []
						});
						return;

					case '[/gridstack]':
						Object.assign(node, {
							type: 'raw',
							value: '</Code.GridstackContainer>',
							children: []
						});
						return;

					case '[grid]':
						Object.assign(node, {
							type: 'raw',
							value: '<Code.GridstackBlock>',
							children: []
						});
						return;

					case '[/grid]':
						Object.assign(node, {
							type: 'raw',
							value: '</Code.GridstackBlock>',
							children: []
						});
						return;
				}
			}
		});

		// await fs.writeFile(`${import.meta.dirname}/tree.json`, JSON.stringify(nodes, null, 2));
	};
}
