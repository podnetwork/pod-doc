<script lang="ts">
	import { page } from '$app/state';
	import { App } from '$lib/app.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ChevronsUpDown } from '@lucide/svelte';
	import { SignedIn, SignedOut, SignIn } from 'svelte-clerk';

	const app = App.get();
</script>

<SignedOut>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline" class="w-full">Verify</Button>
		</Dialog.Trigger>
		<Dialog.Content class="w-fit border-none bg-transparent">
			<SignIn forceRedirectUrl={page.url.toString()} fallbackRedirectUrl={page.url.toString()} />
		</Dialog.Content>
	</Dialog.Root>
</SignedOut>

<SignedIn>
	{#if app.auth.user}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex items-center gap-2 rounded-md pr-2 hover:bg-foreground/5">
				<Avatar.Root class="rounded-md">
					<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
					{#if app.auth.user.imageUrl}
						<Avatar.Image src={app.auth.user.imageUrl} alt={app.auth.user.fullName} class="rounded-full p-2" />
					{/if}
					<Avatar.Fallback class="rounded-sm bg-primary text-primary-foreground">
						{(app.auth.user.firstName ?? app.auth.user.lastName)?.slice(0, 2).toUpperCase()}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col items-start">
					<span class="text-sm font-bold">{app.auth.user.fullName}</span>
					<span class="text-xs">{app.auth.user.primaryEmailAddress}</span>
				</div>
				<div class="flex-1"></div>
				<ChevronsUpDown class="h-4 w-4 opacity-60" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content side="top" align="end" class="w-[14rem]">
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>Account</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={() => {
						app.auth.signout();
					}}>
						Logout
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</SignedIn>
