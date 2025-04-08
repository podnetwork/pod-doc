<script lang="ts">
	import { App } from '$lib/app.svelte';
	import FieldGroup, { FieldGroupStyle } from '$lib/components/field-group.svelte';
	import { Button } from '$lib/components/ui/button';

	const app = App.get();
</script>

<div class="flex flex-1 flex-col items-center justify-center">
	<h1 class="text-xl font-medium uppercase">Fund your wallet</h1>
	<p class="text-sm">Coming soon</p>

	<form class="flex w-full max-w-[30vw] flex-col gap-2 mt-12">
		<FieldGroup label="Wallet address">
			<input type="text" class={FieldGroupStyle.INPUT} />
		</FieldGroup>

		<FieldGroup label="Access code">
			<input type="text" class={FieldGroupStyle.INPUT} />
		</FieldGroup>

		<Button class="w-full mt-2" variant="default">
            Fund wallet
        </Button>
	</form>
</div>
