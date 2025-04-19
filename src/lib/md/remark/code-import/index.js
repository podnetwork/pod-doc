/**
 * @import {Root} from 'mdast'
 */

/**
 * add code library to component within <script tag
 *
 * @returns
 *   Transform.
 */
export default function RemarkCodeImport() {
	/**
	 * @param {Root} tree
	 * @return {undefined}
	 */
	return function (tree) {
		if (tree.type !== 'root') return;

		// see in child, if not found any element has type 'html' and value start by `<script`
		// then skip
		const scriptTagIndex = tree.children.findIndex(
			(child) => child.type === 'html' && child.value.startsWith('<script')
		);

		// if found script tag, get content within `<script ...>` and `</script> use regex`
		if (scriptTagIndex !== -1) {
			const scriptTag = tree.children[scriptTagIndex];
			if (scriptTag.type === 'html') {
				const scriptContent = scriptTag.value;

				const regex = /<script[^>]*>(.*?)<\/script>/s;
				const match = scriptContent.match(regex);

				if (match) {
					let codeLibrary = match[1];

					const inject = `import {Code} from '$lib';`;

					// if codeLibrary contains same inject then skip
					if (codeLibrary.includes(inject)) return;

					// add code library
					const newCodeLibrary = `${inject}\n${codeLibrary}`;

					// replae content
					scriptTag.value = scriptTag.value.replace(codeLibrary, newCodeLibrary);
				}
			}
			return;
		}

		// if not found then create new script
		tree.children.unshift({
			type: 'html',
			value: `<script>import {Code} from '$lib';</script>`
		});
	};
}
