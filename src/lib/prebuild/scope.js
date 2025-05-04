/// function target to doc version detection and manipulation
import { glob } from 'glob';
import fs from 'node:fs';
import { extractFrontmatter } from './frontmatter.js';

/**
 * Represents a scope within the documentation structure.
 * @typedef {Object} Scope
 * @property {string} version - The version of the documentation.
 * @property {string} directory - The directory of the documentation.
 * @property {Array<DocFile>} files - The files of the documentation.
 * @property {string|undefined} menuFile - The menu file of the documentation.
 * @property {string|undefined} languageFile - The language file of the documentation.
 */

/**
 * File of documentation
 * @typedef {Object} DocFile
 * @property {string} file - The file path of the documentation.
 * @property {string} content - The content of the documentation.
 * @property {string} href - The href of the documentation.
 * @property {any} frontmatter - The frontmatter of the documentation.
 */

/**
 * Collects all scopes within the documentation structure.
 * @returns {Promise<Array<Scope>>} An array of scopes.
 */
export async function collectScopes() {
	let endpointFiles = await glob(`src/routes/(doc)/*/+page.md`);

	endpointFiles = endpointFiles.sort((a, b) => a.length - b.length);

	/**
	 * @type {Array<Scope>}
	 */
	const result = [];

	for (const file of endpointFiles) {
		const parts = file.split('/');
		const version = parts[parts.length - 2];
		const directory = getDir(parts);
		// const url = directory.replace(`src/routes/${version}`, '');

		// detect if inside scope has file menu.yaml
		const menuFile = (await glob(`${directory}/menu.{yaml,yml}`))?.[0];

		// detect if inside scope has language file
		const languageFile = (await glob(`${directory}/langs.{yaml,yml}`))?.[0];

		// find md files within scope
		let mdFiles = await glob(`${directory}/**/*.md`);
		mdFiles.sort((a, b) => a.length - b.length);

		const files = [];

		/** @type {Record<string, string>} */
		const cacheUrl = {};

		// load content of files for future actions
		for await (const mdFile of mdFiles) {
			// get directory path of file
			const mdFileDir = getDir(mdFile);

			// remember url of endpoint
			if (!cacheUrl[mdFileDir]) {
				const fileUrl = getUrlOfFile(mdFiles, mdFileDir, version);
				if (!fileUrl) {
					throw new Error(`Endpoint not found for file ${mdFile}`);
				}
				cacheUrl[mdFileDir] = fileUrl;
			}

			const content = fs.readFileSync(mdFile, 'utf8');

			const frontmatter = await extractFrontmatter(content);

			files.push({
				file: mdFile,
				content,
				href: cacheUrl[mdFileDir],
				frontmatter
			});
		}

		result.push({
			version,
			directory,
			files,
			menuFile,
			languageFile
		});
	}

	return result;
}

/**
 * Get directory path of file
 * @param {string|string[]} filePath
 * @returns
 */
function getDir(filePath) {
	if (Array.isArray(filePath)) {
		return filePath.slice(0, -1).join('/');
	}
	return filePath.split('/').slice(0, -1).join('/');
}

/**
 *
 * @param {string[]} fileList
 * @param {string} fileDir
 * @param {string} version
 */
function getUrlOfFile(fileList, fileDir, version) {
	for (const file of fileList) {
		if (file.startsWith(fileDir) && file.endsWith('+page.md')) {
			const dir = getDir(file);

			const url = dir.replace(`src/routes/(doc)/${version}`, '');
			return url.length ? url : '/';
		}
	}
}
