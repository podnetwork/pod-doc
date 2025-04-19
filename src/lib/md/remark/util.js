/**
 * @import { Root, Html } from 'mdast'
 */

/**
 * @typedef {object} Match
 * @property {string} prefix
 * @property {string} modifier
 * @property {string} attrs
 */

export class RemarkUtil {
	static customPrefix = `!`;

	/**
	 *
	 * @param {string} prefix
	 * @param {string} str
	 * @returns
	 */
	static getAttrs(prefix, str) {
		return str.split(prefix)[1].trim().replaceAll(/[“”]/g, `"`);
	}

	static findScriptRegex = /<script(?![^>]*context=['"]module['"])[^>]*>(.*?)<\/script>/s;

	/**
	 *
	 * @param {Root} tree
	 */
	static getFirstScript(tree) {
		// find the first script tag in file
		/** @type {import('mdast').Html | undefined} */
		// @ts-ignore
		let script = tree.children.find((child) => {
			if (child.type !== 'html') return false;
			return !!child.value.match(this.findScriptRegex);
		});

		return script;
	}

	/**
	 *
	 * @param {Html} node
	 * @returns {string}
	 */
	static getScriptContent(node) {
		return node.value.match(this.findScriptRegex)?.[1] ?? '';
	}

	/**
	 *
	 * @param {string} content
	 * @returns {string}
	 */
	static combineScriptValue(content) {
		return `<script lang="ts">\n${content}\n</script>`;
	}

	/**
	 *
	 * @param {Root} tree
	 * @param {string} content
	 * @param {(content: string) => boolean} [filter]
	 */
	static prependToScriptTag(tree, content, filter) {
		const script = this.getFirstScript(tree);
		if (!script) {
			/** @type {Html} */
			const newScript = {
				type: 'html',
				value: this.combineScriptValue(`${content}`)
			};
			tree.children.unshift(newScript);
			return;
		}

		const scriptContent = this.getScriptContent(script);

		if (filter && !filter(scriptContent)) {
			return;
		}

		const newContent = this.combineScriptValue(`${content}\n${scriptContent}`);
		script.value = newContent;
	}

	/**
	 *
	 * @param {string} str
	 * @returns { { prefix: string; modifier: string; attrs: string } | undefined }
	 */
	static matchCustomTag(str) {
		if (!str.startsWith(`${this.customPrefix} `)) return undefined;

		// normalize weird quote characters id=“1” to id="1"
		str = str.replace(/[“”]/g, '"');

		const parts = str.match(/(?:[^\s"]+|"[^"]*")+/g);
		if (!parts) return undefined;

		// remove first element, it is custom tag
		parts.shift();

		// take second element, it is prefix (custom tag name)
		const prefix = parts?.shift() ?? '';
		if (prefix === '') return undefined;

		// take third element, it maybe modifier
		let modifier = parts?.shift() ?? '';

		// take rest elements, it is attributes
		let attrs = parts?.join(' ') ?? '';

		// inspect modifier, if modifier is a string match format <key>=(quote)value(quote)
		const match = modifier.match(/([\w-]+)=(?:"|'|`)([^"'`]+)(?:"|'|`)/);

		if (match) {
			attrs = `${modifier} ${attrs}`;
			modifier = ''; // this child has not modifier
		}

		return { prefix, modifier, attrs };
	}
}
