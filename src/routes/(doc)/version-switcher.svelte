<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { App } from '$lib/app.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LucideChevronsUpDown } from '@lucide/svelte';

	const app = App.get();

	let versions = $derived(app.version2.versions);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'outline',
			className: 'flex-1 justify-start gap-1.5'
		})}
	>
		<span class="text-sm">
			{#if app.isLocal}
				Local
			{:else if app.version2.detail?.is_latest}
				Latest
			{:else}
				{app.version2.detail?.v_number ? `v${app.version2.detail.v_number}` : '-'}
			{/if}
		</span>
		<LucideChevronsUpDown size={14} class="ml-auto" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[14rem]" side="top" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Version</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each versions as version}
				<DropdownMenu.Item
					onclick={() => {
						if (version.id === app.version2.detail?.id) return;

						const domain = version.domain;
						const url = `${domain}${page.url.pathname}`;
						goto(url);
					}}
				>
					{#if app.isLocal}
						Local
					{:else}
						v{version.v_number}
					{/if}
					<div class="ml-auto">
						{#if version.is_latest}
							<Badge variant="outline" class="ml-auto">Latest</Badge>
						{/if}

						<Badge
							variant="outline"
							class={[
								version.is_latest
									? ['bg-purple-100 dark:bg-purple-900', 'border-purple-500 dark:border-purple-600']
									: ['bg-cyan-100 dark:bg-cyan-900', 'border-cyan-500 dark:border-cyan-600']
							]}
						>
							{version.name}
						</Badge>
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
