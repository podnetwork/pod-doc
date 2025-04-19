/// this plugin create block of content that wrap content in a div

import json5 from 'json5';
import { CONTINUE, visit } from 'unist-util-visit';
import { RemarkUtil } from '../util';

/**
 * @import {Root} from 'mdast'
 */

/**
 * add code library to component within <script tag
 *
 * @returns
 *   Transform.
 */
export default function RemarkContent() {
	/**
	 * @param {Root} tree
	 * @return {undefined}
	 */
	return function (tree) {
		visit(tree, (child) => {
			// take nodes are paragraph
			if (child.type === 'paragraph') {
				const firstChild = child.children[0];

				if (!firstChild) return CONTINUE;
				if (firstChild.type !== 'text') return CONTINUE;

				// the formular is `+++ custom tag`
				switch (true) {
					default:
						return CONTINUE;
					case firstChild.value === '+++ sticky': {
						Object.assign(child, {
							type: 'html',
							value: '<Code.Sticky>',
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ endsticky': {
						Object.assign(child, {
							type: 'html',
							value: '</Code.Sticky>',
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value.startsWith('+++ anchor'): {
						// catch attribute
						const attrs = RemarkUtil.getAttrs('+++ anchor', firstChild.value);

						Object.assign(child, {
							type: 'html',
							value: `<span ${attrs}></span>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value.startsWith('+++ content'): {
						// catch attribute
						const attrs = RemarkUtil.getAttrs('+++ content', firstChild.value);

						Object.assign(child, {
							type: 'html',
							value: `<div ${attrs}>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ endcontent': {
						Object.assign(child, {
							type: 'html',
							value: '</div>',
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ contentempty': {
						Object.assign(child, {
							type: 'html',
							value: '<div>&nbsp;</div>',
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value.startsWith('+++ codeblock'): {
						// catch attribute
						const attrs = RemarkUtil.getAttrs('+++ codeblock', firstChild.value);

						Object.assign(child, {
							type: 'html',
							value: `<Code.Provider ${attrs}>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ endcodeblock': {
						Object.assign(child, {
							type: 'html',
							value: `<Code.Sample></Code.Sample> </Code.Provider>`,
							children: void 0
						});
						return CONTINUE;
					}

					// grid stack
					case firstChild.value.startsWith('+++ gridstack'): {
						// catch attribute
						const attrs = RemarkUtil.getAttrs('+++ gridstack', firstChild.value);

						Object.assign(child, {
							type: 'html',
							value: `<Code.GridstackContainer ${attrs}>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ endgridstack': {
						Object.assign(child, {
							type: 'html',
							value: `</Code.GridstackContainer>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value.startsWith('+++ grid'): {
						// catch attribute
						const attrs = RemarkUtil.getAttrs('+++ grid', firstChild.value);

						Object.assign(child, {
							type: 'html',
							value: `<Code.GridstackBlock ${attrs}>`,
							children: void 0
						});
						return CONTINUE;
					}

					case firstChild.value === '+++ endgrid': {
						Object.assign(child, {
							type: 'html',
							value: `</Code.GridstackBlock>`,
							children: void 0
						});
						return CONTINUE;
					}
				}
			}

			// take nodes are code
			if (child.type === 'code') {
				const lang = child.lang;
				const meta = child.meta;
				const code = child.value;

				Object.assign(child, {
					type: 'html',
					value: `<Code.Code code={${json5.stringify(code)}} lang="${lang}" ${meta}></Code.Code>`,
					children: void 0
				});
			}
		});

		// write tree to file ast.json
		// fs.writeFileSync(`${import.meta.dirname}/ast.json`, JSON.stringify(tree, null, 2));
	};
}
