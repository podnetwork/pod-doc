<script lang="ts">
	let {
		onclose
	}: {
		onclose: () => void;
	} = $props();
</script>

<button
	aria-label="Close search"
	onclick={onclose}
	type="button"
	class="text-foreground/50 hover:text-foreground/70"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-5 w-5"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
</button>
