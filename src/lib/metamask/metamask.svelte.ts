import { PUBLIC_POD_NETWORK_NAME } from '$env/static/public';
import { PodApi } from '$lib/pod/pod-api';
import { catchError, finalize, from, map, switchMap, tap, throwError } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { getContext, setContext } from 'svelte';
import { useClerkContext } from 'svelte-clerk';
import Web3 from 'web3';

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
		return getContext<MetaMask>(this.sid);
	}

	web3 = new Web3();

	constructor() {
		$effect(() => {
			if (!this.clerk.user) {
				this.walletAddressHashId = void 0;
				this.maxAmountPerDay = 0;
				this.totalReceived24h = 0;
				this.txHash = '';
				this.walletBalanceAmount = '0';
			} else if (window.localStorage) {
				this.walletAddressHashId =
					window.localStorage.getItem(this.walletAddressHashIdCacheName) ?? void 0;
			}

			if (!this.inited && this.clerk.isLoaded) this.inited = true;
		});
	}

	clerk = useClerkContext();

	inited = $state(false);

	version = $state('dev');

	walletAddressHashIdCacheName = 'pod-doc-wallet-address-hash-id';

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

	addPodNetwork(chainId: string) {
		const provider = this.getMetaMaskProvider();
		const rpcUrl = PodApi.getRpcEndpoint(this.version);

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

	connectWallet(chainId: string) {
		const provider = this.getMetaMaskProvider();

		if (!provider) {
			return throwError(() => new Error('Please install MetaMask'));
		}

		this.connecting = true;

		return this.addPodNetwork(chainId).pipe(
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
				window.localStorage.setItem(this.walletAddressHashIdCacheName, i);
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

	// funding
	requestFundLoading = $state(false);

	maxAmountPerDay = $state(0);
	totalReceived24h = $state(0);
	txHash = $state('');

	requestFund() {
		if (!this.walletAddressHashId) {
			return throwError(() => new Error('Please connect to MetaMask'));
		}

		this.requestFundLoading = true;

		type FaucetResponse = {
			amount: string;
			max_amount_per_day: number;
			message: string;
			remaining_amount: number;
			success: boolean;
			total_received_24h: number;
			txHash: string;
			error?: string;
		};

		return ajax<FaucetResponse>({
			url: '/internal/metamask-request-fund',
			method: 'POST',
			body: JSON.stringify({
				address: this.walletAddressHashId
			})
		}).pipe(
			map((res) => res.response),
			map((i) => {
				if (i.error) {
					throw new Error(i.error);
				}
				return i;
			}),
			map((i) => {
				this.maxAmountPerDay = i.max_amount_per_day;
				this.totalReceived24h = i.total_received_24h;
				this.txHash = i.txHash;
				return i;
			}),
			catchError((e: AjaxError) => {
				if (e.response?.error?.message) {
					return throwError(() => new Error(e.response.error.message));
				}
				return throwError(() => new Error(e.message));
			}),
			finalize(() => {
				this.requestFundLoading = false;
			})
		);
	}

	// wallet

	walletBalanceAmount = $state('0');

	requestingWalletBalance = $state(false);

	requestLatestWalletBalance() {
		const provider = this.getMetaMaskProvider();
		if (!provider) {
			return throwError(() => new Error('Please install MetaMask'));
		}

		this.requestingWalletBalance = true;

		return from(
			provider.request({
				method: 'eth_getBalance',
				params: [this.walletAddressHashId, 'latest']
			})
		).pipe(
			map((i) => this.web3.utils.hexToNumberString(i)),
			map((i) => this.web3.utils.fromWei(i, 'ether')),
			tap((i) => (this.walletBalanceAmount = i)),
			finalize(() => {
				this.requestingWalletBalance = false;
			})
		);
	}
}
