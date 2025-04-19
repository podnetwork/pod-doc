export class RemarkUtil {
	/**
	 *
	 * @param {string} prefix
	 * @param {string} str
	 * @returns
	 */
	static getAttrs(prefix, str) {
		return str.split(prefix)[1].trim().replaceAll(/[“”]/g, `"`);
	}
}
