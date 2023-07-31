<script>
	export let data;
	import { onMount } from 'svelte';
	import pusher from '../pusherInstance';
	import Timer from '../timer.svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import DarkmodeToggle from '../../../components/darkmode-toggle.svelte';

	dayjs.extend(utc);

	const { page, slug } = data;
	const image = page.image || 'https://source.unsplash.com/random/1920x1080?epic,landscape';
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
	<div class="fixed inset-0 -z-50 bg-white dark:bg-black">
		<img
			src={image}
			class=" -z-40 w-full h-screen opacity-80 object-cover"
			alt="random"
		/>
	</div>

	<div class="text-center text-white text-shadow">
		<p class="text-2xl sm:text-4xl font-semibold">Cloud-Synchronized</p>
		<h1 class="heading">Atomic Timer ⚛️</h1>
	</div>

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

	<div class="text-center text-white font-semibold text-sm text-shadow">
		<a class="hover:underline text-sky-400" href="https://ttcreative.limited" target="_blank"
			>TT Creative</a
		>
		<p>Created by Tom Turner</p>
		<p>Latency: {latency ? latency + 'ms' : 'N/A'}</p>
	</div>
</main>

<style>
	.heading {
		font-size: 4rem;
		color: white;
		font-weight: 700;
	}

	@media (max-width: 640px) {
		.heading {
			font-size: 2.5rem;
		}
	}

	.text-shadow {
		text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}
</style>
