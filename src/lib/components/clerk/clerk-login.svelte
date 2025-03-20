<script lang="ts">
	import { page } from '$app/state';
	import * as Drawer from '$lib/components/ui/drawer';
	import { SignIn, SignedOut } from 'svelte-clerk';
	import { Button } from '../ui/button';

	let open = $state(false);

	function toggle() {
		open = !open;
	}
</script>

<SignedOut>
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<Button variant="outline">Login</Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
				<SignIn forceRedirectUrl={page.url.toString()} fallbackRedirectUrl={page.url.toString()} />
			</div>
		</Drawer.Content>
	</Drawer.Root>
</SignedOut>