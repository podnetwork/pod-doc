<script lang="ts">
	import { App } from '$lib/app.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LucideChevronsUpDown } from '@lucide/svelte';

	const app = App.get();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: 'flex-1 justify-start gap-1.5'
		})}
	>
		<span class="text-sm">{app.version.versionDetail?.name ?? 'Version 1'}</span>
		<LucideChevronsUpDown size={14} class="ml-auto" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[14rem]" side="top" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Version</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each app.auth.versions as version}
				<DropdownMenu.Item
					onclick={() => {
						app.version.goToVersion(`v${version.v_number}`);
					}}
				>
					{version.name}
					{#if version.is_latest}
						<Badge
							variant="outline"
							class={[
								'ml-auto bg-purple-100 dark:bg-purple-900',
								'border-purple-500 dark:border-purple-600'
							]}>latest</Badge
						>
					{/if}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
