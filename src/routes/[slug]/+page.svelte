<script>
	export let data;
	import { onMount } from 'svelte';
	import pusher from './pusherInstance';
	import Timer from './timer.svelte';
	import CreateTimer from './create-timer.svelte';
	import EditTimer from './edit-timer.svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';

	const mySQLFormat = 'YYYY-MM-DD HH:mm:ss';
	dayjs.extend(utc);

	const { page, slug } = data;

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

	const deleteTimer = (id) => {
		fetch(`/api/delete-timer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				pageId: page.id,
				pusherData: {
					channel: slug,
					event: 'update'
				}
			})
		}).then((res) => {
			if (res.status !== 200) return alert(res.statusText);
		});
	};

	const startTimer = (id, durationMs) => {
		fetch(`/api/start-timer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				durationMs,
				start: dayjs.utc().format(mySQLFormat),
				end: dayjs.utc().add(durationMs, 'millisecond').format(mySQLFormat),
				pusherData: {
					channel: slug,
					event: 'update'
				}
			})
		}).then((res) => {
			if (res.status !== 200) return alert(res.statusText);
		});
	};

	const stopTimer = (id, durationMs) => {
		fetch(`/api/stop-timer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				durationMs,
				start: dayjs.utc().format(mySQLFormat),
				end: dayjs.utc().add(durationMs, 'millisecond').format(mySQLFormat),
				pusherData: {
					channel: slug,
					event: 'update'
				}
			})
		}).then((res) => {
			if (res.status !== 200) return alert(res.statusText);
		});
	};

	const handleShare = async () => {
		const url = window.location.href;
		await navigator.clipboard.writeText(url);
		alert('Copied ' + url + ' to clipboard');
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

<main class="flex flex-col items-center justify-between w-full h-screen space-y-8 p-8">
	<div class="fixed inset-0 -z-50 bg-white">
		<img
			src={'https://source.unsplash.com/random/1920x1080?nature'}
			class=" -z-40 w-full h-screen opacity-80 object-cover"
			alt="random"
		/>
	</div>

	<div class="text-center text-white text-shadow">
		<p class="text-4xl font-semibold">Cloud-Synchronized</p>
		<h1 class="heading">Atomic Timer ⚛️</h1>
	</div>

	<div>
		{#await timers}
			<p class="text-5xl animate-spin font-semibold text-center my-auto">🕣</p>
		{:then timers}
			{#if timers?.length}
				<div class="flex flex-col space-y-4 bg-gray-100 p-8 rounded-xl bg-opacity-50 shadow">
					{#each timers as timer}
						<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
							<Timer {timer} />
							<div class="flex w-full justify-evenly space-x-2 sm:space-x-0 flex-row sm:flex-col">
								{#if timer.isRunning}
									<button
										on:click={() => stopTimer(timer.id, timer.durationMs)}
										class="bg-yellow-400 hover:bg-yellow-500 w-full text-white my-auto font-bold py-2 px-4 rounded"
										>Stop</button
									>
								{:else}
									<button
										on:click={() => startTimer(timer.id, timer.durationMs)}
										class="bg-green-400 hover:bg-green-500 w-full text-white my-auto font-bold py-2 px-4 rounded"
										>Start</button
									>
								{/if}
								<EditTimer {page} {timer} onSubmit={updateTimers} />
								<button
									on:click={() => deleteTimer(timer.id)}
									class="bg-red-400 hover:bg-red-500 text-white my-auto w-full font-bold py-2 px-4 rounded"
									>Delete</button
								>
							</div>
						</div>
					{/each}
				</div>
				<button
					on:click={handleShare}
					class="bg-sky-400 hover:bg-sky-500 mx-auto flex mt-4 text-white font-bold py-2 px-4 rounded"
					>Share</button
				>
			{/if}

			{#if !timers?.length}
				<CreateTimer {page} onSubmit={updateTimers} />
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

	.text-shadow {
		text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}
</style>
