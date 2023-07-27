<script>
	export let data;
	import { onMount } from 'svelte';
	import pusher from './pusherInstance';
	import Timer from './timer.svelte';
	import CreateTimer from './create-timer.svelte';
	import EditTimer from './edit-timer.svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import Button from '../../components/button.svelte';
	import DarkmodeToggle from '../../components/darkmode-toggle.svelte';

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
		return fetch(`/api/start-timer`, {
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
		return fetch(`/api/stop-timer`, {
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
		const url = window.location.href + '/share';
		await navigator.clipboard.writeText(url);
		alert('Copied ' + url + ' to clipboard');
	};

	const handleEmbed = async () => {
		const dark = Array.from(document.documentElement.classList).includes('dark');
		const url = window.location.href + `/embed${dark ? '?dark=true' : ''}}`;
		const iframe = `<iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>`;
		await navigator.clipboard.writeText(iframe);
		alert('Copied ' + iframe + ' to clipboard');
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

<DarkmodeToggle />
<main class="flex flex-col items-center justify-between w-full h-screen space-y-8 p-8">
	<div class="fixed inset-0 -z-50 bg-white dark:bg-black">
		<img
			src={'https://source.unsplash.com/random/1920x1080?landscape'}
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
				<div
					class="flex flex-col space-y-4 bg-gray-100 dark:bg-neutral-700 p-8 rounded-xl bg-opacity-50 dark:bg-opacity-50 shadow"
				>
					{#each timers as timer}
						<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
							<Timer {timer} />
							<div class="flex w-full justify-evenly space-x-2 sm:space-x-0 flex-row sm:flex-col">
								{#if timer.isRunning}
									<Button
										onClick={() => stopTimer(timer.id, timer.durationMs)}
										className="bg-yellow-400 hover:bg-yellow-500 w-full text-white my-auto font-bold py-2 px-4 rounded"
										text="Stop"
									/>
								{:else}
									<Button
										onClick={() => startTimer(timer.id, timer.durationMs)}
										className="bg-green-400 hover:bg-green-500 w-full text-white my-auto font-bold py-2 px-4 rounded"
										text="Start"
									/>
								{/if}
								<EditTimer {page} {timer} onSubmit={updateTimers} />
								<Button
									onClick={() => deleteTimer(timer.id)}
									className="bg-red-400 hover:bg-red-500 text-white my-auto w-full font-bold py-2 px-4 rounded"
									text="Delete"
								/>
							</div>
						</div>
					{/each}
				</div>
				<div class="flex space-x-4 w-full items-center justify-center">
					<button
						on:click={handleShare}
						class="bg-sky-400 hover:bg-sky-500 mt-4 text-white font-bold py-2 px-4 rounded"
						>Share</button
					>

					<button
						on:click={handleEmbed}
						class="bg-indigo-400 hover:bg-indigo-500 mt-4 text-white font-bold py-2 px-4 rounded"
						>Embed</button
					>
				</div>
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
