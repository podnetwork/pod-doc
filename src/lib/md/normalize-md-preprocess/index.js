const svelteMarkdown = () => {
	return {
		name: 'svelte-markdown',
		/**
		 * @param {object} options
		 * @param {string} options.content
		 * @param {string} options.filename
		 */
		markup: ({ content, filename }) => {
			if (filename.endsWith('.md')) {
				// read content file line by line
				const lines = content.split('\n');

				/** @type {Array<number>} */
				const pos = [];

				lines.forEach((line, idx) => {
					// regex match line start with !<space><word><space><empty or any character>
					const regex = /^!\s\w+(\s.*)?$/;
					const matched = regex.test(line);

					if (!matched) return;

					// because idea is put empty line before and after the custom tag
					// then we just remove double space on custom tag line.
					lines[idx] = line.trim();

					// check prev line
					const prevLine = lines[idx - 1];
					if (prevLine) {
						switch (true) {
							case !isEmptyLine(prevLine): {
								// insert new empty line before current line
								pos.push(idx);
								break;
							}
						}
					}

					// check next line
					const nextLine = lines[idx + 1];
					if (nextLine) {
						switch (true) {
							case !isEmptyLine(nextLine): {
								// insert new empty line after current line
								pos.push(idx + 1);
								break;
							}
						}
					}
				});

				// revert the pos array to make sure we append new empty line from bottom to top
				// like this we can make sure offset at the time read line position always correct
				pos.reverse().forEach((offset) => {
					lines.splice(offset, 0, '');
				});

				// compose lines to content
				const contentNew = lines.join('\n');

				return { code: contentNew };
			}

			return { code: content };
		}
	};
};

export default svelteMarkdown;

/**
 * check if line is empty line
 *
 * @param {string} line
 * @returns {boolean}
 */
function isEmptyLine(line) {
	return line.trim().length === 0;
}
