// pre-build source code.
// 1. read all md files and build search source json file
// 2. build main menu json file
// 3. build language json file
//
// Run this function each time update content

import fs from 'node:fs';
import { buildSearchInScope } from './build-search.js';
import { buildTransformDataInScope, writeTransformData } from './build-transform-data.js';
import { collectScopes } from './scope.js';

export default async function prebuild() {
	console.log(`*** Prebuild started at ${new Date().toISOString()} ***`);
	console.log(`Collect version under scopes`);

	const scopes = await collectScopes();
	// console.log('scopes:', scopes);

	console.log(`=== Collected ${scopes.length} scopes`);

	console.log(`Build transform data`);

	const transformedData = await Promise.all(
		scopes.map((scope) => buildTransformDataInScope(scope))
	);

	console.log(`=== Transformed ${transformedData.length} scopes`);

	// write transform data
	console.log(`Write transform data`);
	await writeTransformData(...transformedData);

	console.log(`=== Transform data written`);

	// buils search
	console.log(`Build search`);
	const searchContents = await Promise.all(scopes.map((scope) => buildSearchInScope(scope)));

	console.log(`=== Search built`);

	// write search content to file search-content.json save to lib directory
	console.log(`Write search content`);

	const searchContentGroup = searchContents.reduce((acc, searchContent) => {
		Object.assign(acc, searchContent);
		return acc;
	}, {});

	fs.writeFileSync('src/lib/search-content.json', JSON.stringify(searchContentGroup, null, 4));

	console.log(`=== Search content written`);

	console.log(`*** Prebuild finished at ${new Date().toISOString()} ***`);
}
