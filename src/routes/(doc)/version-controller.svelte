<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	const versions = [
		{ label: 'v1', value: 'v1' },
		{ label: 'v2', value: 'v2' },
		{ label: 'v3', value: 'v3' }
	];

	let selected = $state(versions[0].value);
</script>

<Select.Root type="single" bind:value={selected}>
	<Select.Trigger class="mr-auto w-[180px]">
		{selected}
	</Select.Trigger>
	<Select.Content>
		{#each versions as version}
			<Select.Item value={version.value}>{version.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
