<script>
	const resetPage = async () => {
		if (
			confirm(
				'Are you sure you want to reset the page? This will delete all timers and reset the background image.'
			)
		)
			location.href = '/?reset=true';
	};
</script>

<button
	on:click={resetPage}
	title="Reset Page"
	class=" rounded-full bg-white bg-opacity-50 dark:bg-neutral-700 dark:text-neutral-100 px-2 text-xs font-semibold shadow-inner flex items-center justify-center truncate"
>
	↺
</button>
