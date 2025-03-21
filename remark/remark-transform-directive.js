/**
 * @import {} from 'mdast-util-directive'
 * @import {Root} from 'mdast'
 */

import { visit } from 'unist-util-visit';

export default function remarkTransformDirective() {
	/**
	 * @param {Root} tree
	 *   Tree.
	 * @returns {undefined}
	 *   Nothing.
	 */
	return (tree) => {
		visit(tree, function (node) {
            console.log(node.type, node)
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
