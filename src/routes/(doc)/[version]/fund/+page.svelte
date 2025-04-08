<script lang="ts">
	import { App } from '$lib/app.svelte';
	import FieldGroup, { FieldGroupStyle } from '$lib/components/field-group.svelte';
	import { Button } from '$lib/components/ui/button';
	import { catchError, EMPTY, firstValueFrom, tap } from 'rxjs';
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { Store } from './store.svelte';

	const app = App.get();
	const store = Store.create();

	// form
	const schema = z.object({
		walletAddress: z.string().min(1),
		accessCode: z.string().min(1)
	});

	const validator = zod(schema);
	const init = defaults(validator);

	const ff = superForm(init, {
		validators: validator,
		resetForm: false,
		SPA: true,
		onSubmit: async () => {
			const c = await ff.validateForm();
			if (c.valid) {
				console.log(c);
				await firstValueFrom(
					store.fund.topUp(c.data.walletAddress, c.data.accessCode).pipe(
						tap(() => {
							toast.success('Funded successfully');
							ff.reset();
						}),
						catchError((e) => {
							toast.error(e.message);
							return EMPTY;
						})
					)
				);
			}
		}
	});

	const { errors, submitting, enhance, form } = ff;
</script>

<div class="flex flex-1 flex-col items-center justify-center">
	<h1 class="text-xl font-medium uppercase">Top up your balance</h1>
	<p class="text-sm">Enter your access code below to top up your wallet</p>

	<form class="mt-12 flex w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[30vw] flex-col gap-2" use:enhance>
		<FieldGroup label="Wallet address" error={$errors.walletAddress}>
			<input type="text" class={FieldGroupStyle.INPUT} bind:value={$form.walletAddress} />
		</FieldGroup>

		<div class="grid auto-cols-auto grid-flow-col gap-1.5">
			<FieldGroup label="Access code" error={$errors.accessCode}>
				<input type="text" class={FieldGroupStyle.INPUT} bind:value={$form.accessCode} />
			</FieldGroup>

			<div class="flex items-center justify-center text-center text-muted-foreground">OR</div>

			<SignedIn>
				<Button class="h-full" variant="outline">Fund your wallet</Button>
			</SignedIn>

			<SignedOut>
				<Button class="h-full" variant="outline">Verify with X</Button>
			</SignedOut>
		</div>

		<Button
			class="mt-2 w-full"
			variant="default"
			disabled={$submitting || !$form.accessCode || !$form.walletAddress}
			type="submit"
		>
			{$submitting ? 'Funding...' : 'Fund wallet'}
		</Button>
	</form>
</div>
