import { visit } from 'unist-util-visit';

export default function codeTitle(opt) {
	// const className = (opt && opt.className) || 'rehype-code-title';

	/**
	 * @param {Root} tree
	 *   Tree.
	 * @returns {undefined}
	 *   Nothing.
	 */
	return (tree) => {
		visit(tree, 'pre', function (node) {
			console.log(node.type, node);
			// if (
			//     node.type === 'containerDirective' ||
			//     node.type === 'leafDirective' ||
			//     node.type === 'textDirective'
			//   ) {
			//     console.log('matched', node.type, node.name)
			//     console.log(node)
			//     // const data = node.data || (node.data = {})
			//     // const hast = h(node.name, node.attributes || {})
			//     // data.hName = hast.tagName
			//     // data.hProperties = hast.properties
			//   }
		});
	};
}
