import { PUBLIC_POD_NETWORK_NAME } from '$env/static/public';
import { finalize, from, map, switchMap, tap, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { getContext, setContext } from 'svelte';
import { useClerkContext } from 'svelte-clerk';

declare global {
	interface Window {
		ethereum: {
			isMetaMask: boolean;
			request: (params: { method: string; params?: any[] }) => Promise<any>;
		};
	}
}

export class MetaMask {
	static sid = Symbol.for('MetaMask');

	static create() {
		return setContext(this.sid, new MetaMask());
	}

	static get() {
		return getContext(this.sid);
	}

	constructor() {
		$effect(() => {
			if (!this.clerk.user) {
				this.walletAddressHashId = void 0;
			}
		});
	}

	clerk = useClerkContext();

	version = $state('dev');

	walletAddressHashId = $state<string | undefined>(undefined);

	// connect to meta mask
	connecting = $state(false);

	getMetaMaskProvider() {
		const provider = window.ethereum;

		if (!provider || !provider.isMetaMask) {
			return;
		}

		return provider;
	}

	addPodNetwork(chainId: string, rpcUrl: string) {
		const provider = this.getMetaMaskProvider();

		if (!provider) {
			return throwError(() => new Error('Please install MetaMask'));
		}

		return from(
			provider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: chainId,
						chainName: PUBLIC_POD_NETWORK_NAME,
						nativeCurrency: {
							name: 'pETH',
							symbol: 'pETH',
							decimals: 18
						},
						rpcUrls: [rpcUrl]
					}
				]
			})
		);
	}

	connectWallet(chainId: string, rpcUrl: string) {
		const provider = this.getMetaMaskProvider();
		if (!provider) {
			return throwError(() => new Error('Please install MetaMask'));
		}

		this.connecting = true;

		return this.addPodNetwork(chainId, rpcUrl).pipe(
			switchMap(() => {
				return from(
					provider.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId }]
					})
				);
			}),
			switchMap(() => {
				return from(
					provider.request({
						method: 'eth_requestAccounts'
					})
				);
			}),
			map((res) => res[0]),
			tap((i) => {
				this.walletAddressHashId = i;
			}),
			finalize(() => {
				this.connecting = false;
			})
		);
	}

	getChainId(version: string, rid: number = 1) {
		return ajax<{
			result: string;
			error?: { message: string };
		}>({
			url: '/internal/eth_chainId',
			method: 'POST',
			body: JSON.stringify({
				version,
				rid
			})
		}).pipe(
			map((res) => res.response),
			tap((i) => {
				if (i.error) {
					throw new Error(i.error.message);
				}
			}),
			map((i) => i.result)
			// map((i) => `0x${i.toString(16)}`)
		);
	}
}
