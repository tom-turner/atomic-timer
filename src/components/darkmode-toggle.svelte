<script>
	import { browser } from '$app/environment';
	let dark = false;

	const handleToggle = () => {
		if (!browser) return;

		if (dark) {
			document.documentElement.classList.remove('dark');
			dark = false;
		} else {
			document.documentElement.classList.add('dark');
			dark = true;
		}
	};

	if (browser) {
		dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (dark) document.documentElement.classList.add('dark');
		else document.documentElement.classList.remove('dark');
	}
</script>

<button
	on:click={handleToggle}
	class="bg-white bg-opacity-50 dark:bg-neutral-700 w-12 h-6 rounded-full shadow-inner"
>
	<div
		class={` w-6 h-6 aspect-square transition-all rounded-full inner-shadow
            ${dark ? 'bg-purple-600 translate-x-6' : 'bg-amber-200'}
        `}
	>
		{dark ? '🌙' : '☀️'}
	</div>
</button>
