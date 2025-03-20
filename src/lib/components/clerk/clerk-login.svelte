<script lang="ts">
	import { page } from '$app/state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { SignIn, SignedOut } from 'svelte-clerk';
	import { Button } from '../ui/button';

	let open = $state(false);

	function toggle() {
		open = !open;
	}
</script>

<SignedOut>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline">Login</Button>
		</Dialog.Trigger>
		<Dialog.Content class="w-fit bg-transparent border-none">
			<SignIn forceRedirectUrl={page.url.toString()} fallbackRedirectUrl={page.url.toString()} />
		</Dialog.Content>
	</Dialog.Root>
</SignedOut>
