/**
 * @import { Scope } from './scope.js'
 */

/**
 * @typedef {Object} DocEntry
 * @property {string} title page title
 * @property {string} urlPage page url (origin, without hash)
 * @property {string} url url to page + heading
 * @property {string} content page content or short paragraph for heading
 * @property {string} heading heading title
 * @property {string} hash unique string per item
 */

/// collect document data at compile time and use for searching
/**
 * @param {Scope} scope
 */
export async function buildSearchInScope(scope) {
	// follow files founded in scope, read content and find heading
	/** @type {DocEntry[]} */
	const docEntries = [];

	for (const file of scope.files) {
		// extract headings in this file
		const headings = extractHeadings(file.content);

		const pageTitle = file.frontmatter?.title;
		const urlPage = file.href;

		// build search data for this heading
		for (const heading of headings) {
			// create short content for heading
			const hcontent = extractContentForHeading(file.content, heading);
			const slug = makeSlug(heading);

			const url = `${urlPage}#${slug}`;

			docEntries.push({
				title: pageTitle,
				urlPage: urlPage,
				url,
				content: cleanMarkdownContent(hcontent),
				heading,
				hash: crypto.randomUUID()
			});
		}
	}

	return {
		[scope.version]: docEntries
	};
}

/**
 * Collect short paragraph for heading from page content
 * @param {string} content
 * @param {string} targetHeading
 * @returns
 */
function extractContentForHeading(content, targetHeading) {
	const headingRegex = new RegExp(`^(#{1,6})\\s+${escapeRegExp(targetHeading)}$`, 'mi');
	const match = headingRegex.exec(content);

	if (!match) {
		return '';
	}

	const headingLevel = match[1].length; // Number of # in the heading
	const headingStart = match.index;

	// Find the next heading of same or higher level (lower or equal number of #)
	const nextHeadingRegex = new RegExp(`^#{1,${headingLevel}}\\s+.+$`, 'gm');
	nextHeadingRegex.lastIndex = headingStart + match[0].length;

	const nextMatch = nextHeadingRegex.exec(content);
	const headingEnd = nextMatch ? nextMatch.index : content.length;

	// Extract content between this heading and the next one (or end of file)
	return content.substring(headingStart, headingEnd).trim();
}

/**
 * @param {string} string
 * @returns {string}
 */
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} content
 * @returns {string[]}
 */
function extractHeadings(content) {
	const headingRegex = /^#{1,6}\s+(.+)$/gm;
	const headings = [];
	let match;

	while ((match = headingRegex.exec(content)) !== null) {
		headings.push(match[1].trim());
	}

	return headings;
}

/**
 * Make slug from string
 * @param {string} str
 * @returns {string}
 */
function makeSlug(str) {
	return (
		'anchor-' +
		str
			.toLowerCase()
			.normalize('NFD') // split accented letters into base + diacritics
			.replace(/[\u0300-\u036f]/g, '') // remove diacritics
			.replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
			.replace(/\s+/g, '-') // replace whitespace with -
			.replace(/-+/g, '-') // collapse multiple -
			.replace(/^-+|-+$/g, '')
	); // trim - from start/end
}

/**
 * Clean markdown content
 * @param {string} content
 * @returns {string}
 */
function cleanMarkdownContent(content) {
	// Remove script tags and their content
	let cleaned = content.replace(/<script[\s\S]*?<\/script>/gi, '');

	// Remove HTML tags (including the chevrons)
	cleaned = cleaned.replace(/<[^>]*>/g, '');

	// Remove markdown headings (# symbols)
	cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

	// Remove code blocks and inline code
	cleaned = cleaned.replace(/```[\s\S]*?```/g, ''); // Code blocks
	cleaned = cleaned.replace(/`([^`]+)`/g, '$1'); // Inline code

	// Remove bullet points and numbered lists
	cleaned = cleaned.replace(/^[\s-]*[-*+]\s+/gm, '');
	cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

	// Remove blockquotes
	cleaned = cleaned.replace(/^>\s+/gm, '');

	// Remove horizontal rules
	cleaned = cleaned.replace(/^-{3,}\s*$|^_{3,}\s*$|^\*{3,}\s*$/gm, '');

	// Remove image references
	cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');

	/// Remove everything inside square brackets including the brackets
	cleaned = cleaned.replace(/\[.*?\]/g, '');

	// Remove link URLs (parentheses part of markdown links)
	cleaned = cleaned.replace(/\(.*?\)/g, '');

	// Remove emphasis markers (* and _)
	cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
	cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2'); // Italic

	// Replace multiple newlines with single space
	cleaned = cleaned.replace(/\n+/g, ' ');

	// Replace multiple spaces with single space
	cleaned = cleaned.replace(/\s+/g, ' ');

	return cleaned.trim();
}
