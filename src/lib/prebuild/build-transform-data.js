/**
 * @import { Scope } from './scope.js'
 */

import fs from 'fs';
// @ts-ignore
import yaml from 'js-yaml';

/**
 * @typedef {Object} TransformedDataInScope
 * @property {any} menu
 * @property {any} langs
 */

/**
 *
 * @param {Scope} scope
 * @returns {Promise<Record<string, TransformedDataInScope>>}
 */
export async function buildTransformDataInScope(scope) {
	/** @type {TransformedDataInScope} */
	let data = {};

	// transform menu
	if (scope.menuFile) {
		const content = fs.readFileSync(scope.menuFile, 'utf8');
		const ymlContent = yaml.load(content);

		const menu = ymlContent.menu ?? [];

		// follow menu, load content of file +page.md has path match with path of href in menu item
		// then collect toc data
		for (const item of menu) {
			if (!item.href) continue;

			let href = item.href;
			// remove hash path
			if (href.includes('#')) {
				href = href.split('#')[0];
			}


			// find the file end with +page.md and have url match with this item menu
			const file = scope.files.find((i) => {
				return i.href === href && i.file.endsWith('+page.md');
			});

			const toc = file?.frontmatter?.toc;
			if (toc) {
				if (!item.children) item.children = [];
				for (const [hash, label] of Object.entries(toc)) {
					item.children.push({
						href: `${href}#${hash}`,
						label
					});
				}
			}
		}

		data.menu = menu;
	}

	// transform language
	if (scope.languageFile) {
		const content = fs.readFileSync(scope.languageFile, 'utf8');
		const ymlContent = yaml.load(content);
		data.langs = ymlContent.langs ?? [];
	}

	return {
		[scope.version]: data
	};
}

/**
 *
 * @param  {...Record<string, TransformedDataInScope>} datas
 */
export async function writeTransformData(...datas) {
	const data = datas.reduce((acc, cur) => {
		Object.assign(acc, cur);
		return acc;
	}, {});

	fs.writeFileSync('src/lib/transformed-data.json', JSON.stringify(data, null, 2));
}
