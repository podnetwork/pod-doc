import fs from 'fs';
import glob from 'glob';
import yaml from 'js-yaml';

export const makeMenu = () => {
	const files = glob
		.sync('src/routes/(doc)/*/*.{yml,yaml}')
		.map((file) => {
			const content = fs.readFileSync(file, 'utf8');

			if (!content.startsWith('menu')) return;

			const path = file;
			const ymlContent = yaml.load(content);

			const parts = path.split('/');

			const fileDir = parts.slice(0, -1).join('/');

			const parentDirName = parts[parts.length - 2];

			return {
				path,
				content: ymlContent,
				fileDir,
				parentDirName
			};
		})
		.filter(Boolean);

	// create new json file name `menus.json`

	let jsonContent = {};

	files.forEach((file) => {
		const { parentDirName, content } = file;
		jsonContent[parentDirName] = content.menu;
	});

	// write to a json file `menus.json` at src/routes/(doc)
	fs.writeFileSync('src/routes/(doc)/menu.json', JSON.stringify(jsonContent, null, 2));

	return files;
};
