import fs from 'fs';
import * as glob from 'glob';
import yaml from 'js-yaml';

export const transformYamlData = () => {
	const files = glob.sync('src/routes/(doc)/*/{menu,langs}.{yml,yaml}').sort((a, b) => {
		// sort file path to make sure files same folder will stay close together
		return a.localeCompare(b);
	});

	let data = {};

	files.forEach((file) => {
		// get version, version is folder name closest to file
		const parts = file.split('/');
		const dirName = parts[parts.length - 2];

		const content = fs.readFileSync(file, 'utf8');
		const ymlContent = yaml.load(content);

		if (!data[dirName]) {
			data[dirName] = {};
		}

		Object.assign(data[dirName], ymlContent);
	});

	// create new json file name `transformed-data.json`
	fs.writeFileSync('src/lib/transformed-data.json', JSON.stringify(data, null, 2));

	return;
};
