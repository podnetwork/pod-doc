<script lang="ts">
	import { page } from '$app/state';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ChevronsUpDown } from '@lucide/svelte';
	import { SignedIn, SignedOut, SignIn, SignOutButton } from 'svelte-clerk';
</script>

<SignedOut>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline">Login</Button>
		</Dialog.Trigger>
		<Dialog.Content class="w-fit border-none bg-transparent">
			<SignIn forceRedirectUrl={page.url.toString()} fallbackRedirectUrl={page.url.toString()} />
		</Dialog.Content>
	</Dialog.Root>
</SignedOut>

<SignedIn>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex items-center gap-2 rounded-md pr-2 hover:bg-foreground/5">
			<Avatar.Root class="rounded-md">
				<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
				<Avatar.Fallback class="rounded-sm bg-primary text-primary-foreground">CN</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex flex-col items-start">
				<span class="text-sm font-bold">Shadcn</span>
				<span class="text-xs">m@example.con</span>
			</div>
			<div class="flex-1" />
			<ChevronsUpDown class="h-4 w-4 opacity-60" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content side="top" align="end">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<SignOutButton>Logout</SignOutButton>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</SignedIn>
