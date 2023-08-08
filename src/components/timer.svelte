<script>
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { onMount, beforeUpdate } from 'svelte';
	const utcFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
	dayjs.extend(duration);

	export let timer = {
		durationMs: 45000,
		start: dayjs().format(utcFormat),
		end: dayjs().add(45, 'seconds').format(utcFormat),
		isRunning: false
	};

	$: diff = dayjs(timer.end).diff(!timer.isRunning ? dayjs(timer.start) : dayjs());

	console.log('start:', dayjs(timer.start), timer.start);
	console.log('end:', dayjs(timer.end), timer.end);
	console.log('now in utc:', dayjs());

	$: days = Math.max( 0, dayjs.duration(diff).days());
	$: hours =  Math.max( 0, dayjs.duration(diff).hours());
	$: minutes =  Math.max( 0, dayjs.duration(diff).minutes());
	$: seconds =  Math.max( 0, dayjs.duration(diff).seconds());
	$: milliseconds = Math.max( 0,  dayjs.duration(diff).milliseconds());
	let interval;
	const run = () => {
		if (timer.isRunning) {
			interval = setInterval(() => {
				timer = {
					...timer,
					isRunning: true
				};
			}, 100);
		}
	};
	onMount(() => {
		clearInterval(interval);
		run();
	});

	beforeUpdate(() => {
		clearInterval(interval);
		run();
	});
</script>

<div class="flex space-x-3 sm:space-x-4 w-full justify-center">
	{#if days > 0}
	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-20 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200">{days}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Days</p>
	</div>
	{/if}

	{#if hours > 0}
	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-20 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200">{hours}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Hours</p>
	</div>
	{/if}

	{#if minutes > 0}
	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-20 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200">{minutes}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Minutes</p>
	</div>
	{/if}

	<div class="flex flex-col">
		<div
			class="flex relative items-center justify-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-20 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200">{seconds}</p>
			{#if milliseconds}
				<p class=" font-semibold text-gray-800 dark:text-neutral-200 w-4 h-12">
					.{Math.abs(milliseconds).toString().split('').splice(0, 1).join('')}
				</p>
			{/if}
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Seconds</p>
	</div>
</div>
