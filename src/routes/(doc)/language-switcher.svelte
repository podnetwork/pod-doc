<script lang="ts">
	import { App } from '$lib/app.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LucideChevronsUpDown } from '@lucide/svelte';

	const app = App.get();

	let languages = $derived.by(() => app.codeSwitcher.languages);

	let current = $derived.by(() =>
		app.codeSwitcher.languages.find((l) => l.lang === app.codeSwitcher.current)
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: 'flex-1 justify-start gap-1.5'
		})}
	>
		<span class="text-sm">
			{current?.label}
		</span>
		<LucideChevronsUpDown size={14} class="ml-auto" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[14rem]" side="top" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Language</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each languages as language}
				<DropdownMenu.Item
					onclick={() => {
						if (language.lang === app.codeSwitcher.current) return;
						app.codeSwitcher.current = language.lang;
					}}
				>
					{language.label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
