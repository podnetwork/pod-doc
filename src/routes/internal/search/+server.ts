import { removeParentheses } from '$lib/utils';
import { Version } from '$lib/version.svelte';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type DocEntry = {
	slug: string;
	title: string;
	content: string;
	headings: string[];
	parentTitle?: string;
  versionStage: 'local' | 'subdomain';
};

type PageInfo = {
	path: string;
	title: string;
	url?: string;
	dirPath: string;
	toc: Map<string, string>; // key: url-part, value: heading title
	content: string;
  versionStage: 'local' | 'subdomain';
};

type SiblingFile = {
	path: string;
	content: string;
	fileName: string;
};

function extractHeadings(content: string): string[] {
	const headingRegex = /^#{1,6}\s+(.+)$/gm;
	const headings: string[] = [];
	let match;

	while ((match = headingRegex.exec(content)) !== null) {
		headings.push(match[1].trim());
	}

	return headings;
}

function cleanMarkdownContent(content: string): string {
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

function extractFrontmatter(content: string): {
	title: string;
	url?: string;
	toc: Map<string, string>;
	content: string;
} {
	const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
	const match = content.match(frontmatterRegex);

	let title = '';
	let url: string | undefined = undefined;
	const toc = new Map<string, string>();

	if (match) {
		const frontmatter = match[1];

		// Extract title
		const titleMatch = frontmatter.match(/title:\s*(.+)/);
		title = titleMatch ? titleMatch[1].trim() : '';

		// Extract URL if present
		const urlMatch = frontmatter.match(/url:\s*(.+)/);
		if (urlMatch) {
			url = urlMatch[1].trim();
		}

		// Extract TOC entries
		const tocMatch = frontmatter.match(/toc:\s*\n([\s\S]*?)(?:\n\w|$)/);
		if (tocMatch) {
			const tocText = tocMatch[1];
			// Parse the TOC entries
			const tocEntries = tocText.split('\n').filter((line) => line.trim());

			for (const entry of tocEntries) {
				const tocEntryMatch = entry.match(/\s*([^:]+):\s*(.+)/);
				if (tocEntryMatch) {
					const [, urlPart, tocTitle] = tocEntryMatch;
					toc.set(urlPart.trim(), tocTitle.trim());
				}
			}
		}
	}

	const processedContent = match ? content.replace(frontmatterRegex, '').trim() : content;

	return {
		title,
		url,
		toc,
		content: processedContent
	};
}

function getDirPath(filePath: string): string {
	const parts = filePath.split('/');
	parts.pop(); // Remove the file name
	return parts.join('/');
}

function fileContainsHeading(content: string, targetHeading: string): boolean {
	const headingRegex = new RegExp(`^#{1,6}\\s+${escapeRegExp(targetHeading)}$`, 'mi');
	return headingRegex.test(content);
}

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractContentForHeading(content: string, targetHeading: string): string {
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

export const GET: RequestHandler = async ({ request }) => {
  // check origin, if requested url is local (*/<version|latest>/*) then 
  const refererUrl = new URL(request.headers.get('referer') || '')
  const origin = refererUrl.origin;

  let versionStage = 'local' as 'local' | 'subdomain' // detect we are using subdomain or local strategy

  let version = Version.getFromSubdomain(origin);

  if (version) {
    versionStage = 'subdomain';
  } else {
    version = Version.getFromUrl(refererUrl.pathname);
  }

  if (!version) {
    throw new Error('Version not found');
  }

	const mdFiles = import.meta.glob(`/src/routes/**/*.{md,svx}`, { as: 'raw' });

	// Collect all pages with TOC information
	const pageInfos = new Map<string, PageInfo>(); // dir path -> page info

	for (const path in mdFiles) {
    if (!path.includes(`/${version}/`)) continue; // skip files not in the requested version

		// Only process +page files
		if (path.includes('/+page.')) {
			try {
				const content = await mdFiles[path]();
				const { title, url, toc, content: rawContent } = extractFrontmatter(content);

				// Only process pages with TOC entries
				if (toc.size > 0 && title) {
					// Extract directory path for this page
					const dirPath = getDirPath(path);
					const routeMatch = path.match(/\/routes\/(.+?)\/\+page\.(?:md|svx)$/);
					const routePath = routeMatch ? routeMatch[1] : '';

					pageInfos.set(dirPath, {
						path: routePath,
						title,
						url,
						dirPath,
						toc,
						content: rawContent,
            versionStage
					});
				}
			} catch (error) {
				console.error(`Error processing page file ${path}:`, error);
			}
		}
	}

	//  Collect sibling files for each page directory
	const siblingFiles = new Map<string, SiblingFile[]>(); // dir path -> sibling files

	for (const path in mdFiles) {
    if (!path.includes(`/${version}/`)) continue; // skip files not in the requested version

		// Skip +page files, we only want regular markdown files
		if (!path.includes('/+page.')) {
			try {
				const dirPath = getDirPath(path);

				// Check if this is a sibling of a page with TOC
				if (pageInfos.has(dirPath)) {
					const content = await mdFiles[path]();
					const fileNameMatch = path.match(/\/([^/]+)\.(?:md|svx)$/);
					const fileName = fileNameMatch ? fileNameMatch[1] : '';

					if (!siblingFiles.has(dirPath)) {
						siblingFiles.set(dirPath, []);
					}

					siblingFiles.get(dirPath)?.push({
						path,
						content,
						fileName
					});
				}
			} catch (error) {
				console.error(`Error processing sibling file ${path}:`, error);
			}
		}
	}

	// Process TOC entries and create search entries
	const entries: DocEntry[] = [];

	// First, add entries for each main page
	for (const [dirPath, pageInfo] of pageInfos.entries()) {
		// Create an entry for the main page itself
		const pageUrl = `${pageInfo.path}`;
		let pageSlug = removeParentheses(pageUrl);

    // check stragety
    switch(pageInfo.versionStage) {
      case 'local':
        // do nothing
        break;
      case 'subdomain':
        // remove version from slug
        pageSlug = pageSlug.replace(`/${version}/`, '');
        break;
    }

		entries.push({
			slug: pageSlug,
			title: pageInfo.title,
			content: cleanMarkdownContent(pageInfo.content),
			headings: extractHeadings(pageInfo.content),
      versionStage: pageInfo.versionStage
		});

		// Get the sibling files for this directory
		const siblings = siblingFiles.get(dirPath) || [];

		// For each TOC entry, look for matching headings in sibling files
		for (const [urlPart, headingTitle] of pageInfo.toc.entries()) {
			let foundMatch = false;

			// Check each sibling file for the heading
			for (const sibling of siblings) {
				if (fileContainsHeading(sibling.content, headingTitle)) {
					// Found a file with this heading - create an entry
					const headingContent = extractContentForHeading(sibling.content, headingTitle);
					const fullSlug = `${pageUrl}#${urlPart}`;

					entries.push({
						slug: removeParentheses(fullSlug),
						title: `${pageInfo.title} > ${headingTitle}`,
						content: cleanMarkdownContent(headingContent),
						headings: extractHeadings(headingContent),
						parentTitle: pageInfo.title
					});

					foundMatch = true;
					break; // Found one file with this heading, no need to look further
				}
			}

			// If no sibling file had this heading, look in the page itself
			if (!foundMatch && fileContainsHeading(pageInfo.content, headingTitle)) {
				const headingContent = extractContentForHeading(pageInfo.content, headingTitle);
				const fullSlug = `${pageUrl}#${urlPart}`;

				entries.push({
					slug: removeParentheses(fullSlug),
					title: `${pageInfo.title} > ${headingTitle}`,
					content: cleanMarkdownContent(headingContent),
					headings: extractHeadings(headingContent),
					parentTitle: pageInfo.title
				});
			}
		}
	}

	return json(entries);
};
