export class MdTool {
	// example: title="Sample 1" runCode={run}
	static attrString2Obj(str: string) {
		if (!str) return {};
		const obj: Record<string, string> = {};
		const regex = /([^\s=]+)=(?:(?:"([^"]*)")|({[^}]*})|([^\s]*))/g;
		let match;

		while ((match = regex.exec(str)) !== null) {
			const [, key, quotedValue, bracketValue, plainValue] = match;
			obj[key] =
				quotedValue !== undefined
					? quotedValue
					: bracketValue !== undefined
						? bracketValue
						: plainValue;
		}

		return obj;
	}
}
