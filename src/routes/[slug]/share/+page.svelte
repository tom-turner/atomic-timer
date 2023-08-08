<script>
	export let data;
	import { onMount } from 'svelte';
	import pusher from '../../../lib/pusherInstance';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import DarkmodeToggle from '../../../components/darkmode-toggle.svelte';

	import Timer from '../../../components/timer.svelte';
	import Heading from '../../../components/heading.svelte';
	import Footer from '../../../components/footer.svelte';
	import Background from '../../../components/background.svelte';

	dayjs.extend(utc);

	const { page, slug } = data;
	const backgroundImage = page.image;
	$: timers = getTimers();

	const updateTimers = (e) => {
		timers = e.timers;
	};

	const getTimers = async () => {
		const res = await fetch(`/api/get-timers`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: page.id
			})
		}).then((res) => {
			if (res.status !== 200) return alert(res.statusText);
			return res.json();
		});

		return res.timers;
	};

	let channel = null;
	let latency = null;

	onMount(() => {
		if (channel) return;

		channel = pusher.subscribe(slug);
		const start = Date.now();
		channel.bind('pusher:subscription_succeeded', () => {
			latency = Date.now() - start;
		});
		channel.bind('update', (data) => {
			updateTimers(data);
			if (data.timestamp) latency = Date.now() - data.timestamp;
		});
	});
</script>

<div class="absolute top-0 right-0 mx-4 mt-2 flex space-x-1">
	<DarkmodeToggle />
</div>
<main class="flex flex-col items-center justify-between w-full h-screen space-y-8 p-8">
	<Background image={backgroundImage} />
	<Heading />
	<div>
		{#await timers}
			<p class="text-5xl animate-spin font-semibold text-center my-auto">🕣</p>
		{:then timers}
			{#if timers?.length}
				<div
					class="flex flex-col space-y-4 bg-gray-100 dark:bg-neutral-700 p-2 sm:p-8 rounded-xl bg-opacity-50 dark:bg-opacity-50 shadow"
				>
					{#each timers as timer}
						<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
							<Timer {timer} />
						</div>
					{/each}
				</div>
			{/if}
		{:catch error}
			<p class="text-red-400">{error.message}</p>
		{/await}
	</div>
	<Footer {latency} />
</main>
