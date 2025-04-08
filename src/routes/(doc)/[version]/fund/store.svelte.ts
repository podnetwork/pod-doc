import { getContext, setContext } from 'svelte';
import { Fund } from './fund.svelte';

export class Store {
	constructor() {}

	static sid = Symbol.for('pod-fund');

	static create() {
		return setContext(this.sid, new Store());
	}

	static get() {
		return getContext<Store>(this.sid);
	}

    // funding action
    fund = new Fund(this);
}
