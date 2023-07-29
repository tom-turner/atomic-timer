<script>
	export let onClick;
	export let className;
	export let text;
	let loading = false;

	const handleClick = async () => {
		loading = true;
		try {
			await onClick()
		} catch (e) {
			console.error(e);
			alert(e)
		}
		loading = false;
	};
</script>

<button class={className} on:click={handleClick}>
	{#if loading}
		<p class="animate-spin font-semibold text-center my-auto">⌛️</p>
	{:else}
		{text}
	{/if}
</button>
