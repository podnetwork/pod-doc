/// this function help extract frontmatter from markdown file to js object
// @ts-ignore
import { compile } from 'mdsvex';

/**
 * @typedef {Object} PageInfo
 * @property {string} path - The path of the page.
 * @property {string} title - The title of the page.
 * @property {string} [url] - The optional URL of the page.
 * @property {string} dirPath - The directory path of the page.
 * @property {Map<string, string>} toc - The table of contents, with URL part as key and heading title as value.
 * @property {string} content - The content of the page.
 * @property {'local' | 'subdomain'} versionStage - The version stage of the page.
 */

/**
 * Extract frontmatter from markdown using regex (YAML only)
 * @param {string} markdown
 * @returns {Promise<any|undefined>} frontmatter as JS object
 */
export async function extractFrontmatter(markdown) {
	const compiled = await compile(markdown);
	return compiled?.data?.fm;
}
