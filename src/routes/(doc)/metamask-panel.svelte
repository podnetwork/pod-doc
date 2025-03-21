<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MetaMask } from '$lib/metamask/metamask.svelte';
	import { LucideCircleDashed, LucideEllipsis } from '@lucide/svelte';
	import { catchError, delayWhen, EMPTY, switchMap, tap } from 'rxjs';
	import { SignedIn } from 'svelte-clerk';
	import { toast } from 'svelte-sonner';

	const mm = MetaMask.get();

	const connectMetaMask = () => {
		return mm.getChainId('dev', 1).pipe(
			switchMap((chainId) => mm.connectWallet(chainId)),
			switchMap(() => mm.requestLatestWalletBalance()),
			tap(() => {
				toast.success('Connected to MetaMask');
			}),
			catchError((e) => {
				toast.error(e.message);
				return EMPTY;
			})
		);
	};

	const requestFund = () => {
		return mm.requestFund().pipe(
			delayWhen(() => mm.requestLatestWalletBalance()),
			tap((res) => {
				toast.success(res.message ?? 'Request fund success');
			}),
			catchError((e) => {
				toast.error(e.message);
				return EMPTY;
			})
		);
	};
</script>

<SignedIn>
	{#if mm.inited}
		{#if mm.walletAddressHashId === undefined}
			<Button
				variant="default"
				onclick={() => connectMetaMask().subscribe()}
				disabled={mm.connecting}
			>
				{mm.connecting ? 'Connecting...' : 'Connect metamask'}
			</Button>
		{:else}
			<div class="flex gap-2">
				<div>
					<Button
						variant="default"
						onclick={() => requestFund().subscribe()}
						disabled={mm.requestFundLoading || mm.requestingWalletBalance}
					>
						{mm.requestFundLoading || mm.requestingWalletBalance ? 'Requesting...' : 'Fund Wallet'}
					</Button>
				</div>

				<div>
					<div class="text-xs text-muted-foreground">
						Your wallet address | Balance:
						<span class="font-bold text-foreground">
							{#if mm.requestingWalletBalance}
								<LucideEllipsis size={14} class="inline-block animate-ping" />
							{:else}
								{mm.walletBalanceAmount} podETH
							{/if}
						</span>
					</div>
					<div class="font-mono text-xs">{mm.walletAddressHashId}</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="flex items-center gap-2 px-3">
			<LucideCircleDashed size={16} class="animate-spin" />
			<div class="text-xs text-muted-foreground">Connecting to MetaMask...</div>
		</div>
	{/if}
</SignedIn>
