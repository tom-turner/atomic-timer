<script>
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import duration from 'dayjs/plugin/duration';
	import { onMount, beforeUpdate } from 'svelte';
	import { get } from 'svelte/store';
	const mySQLFormat = 'YYYY-MM-DD HH:mm:ss';
	dayjs.extend(utc);
	dayjs.extend(duration);

	const getUTC = () => {
		const now = new Date();

		const year = now.getUTCFullYear();
		const month = now.getUTCMonth() + 1;
		const day = now.getUTCDate();
		const hours = now.getUTCHours();
		const minutes = now.getUTCMinutes();
		const seconds = now.getUTCSeconds();
		const milliseconds = now.getUTCMilliseconds();

		return `${year}-${month}-${day} 
            ${hours}:${minutes}:${seconds}.${milliseconds}`;
	};

	export let timer = {
		durationMs: 45000,
		start: dayjs().format(mySQLFormat),
		end: dayjs().add(45, 'seconds').format(mySQLFormat),
		isRunning: false
	};

	$: isRunning = timer.isRunning;
	$: diff = dayjs(timer.end).local().diff(
		!timer.isRunning ? dayjs(timer.start).local() : getUTC(),
	);
	
	console.log(dayjs.utc(timer.end), dayjs.utc(timer.start), getUTC());

	$: days = dayjs.duration(diff).days();
	$: hours = dayjs.duration(diff).hours();
	$: minutes = dayjs.duration(diff).minutes();
	$: seconds = dayjs.duration(diff).seconds();
	$: milliseconds = dayjs.duration(diff).milliseconds();
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

<div class="flex space-x-4 w-full justify-center">
	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 shadow rounded-xl w-24 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800">{days}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800">Days</p>
	</div>

	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 shadow rounded-xl w-24 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800">{hours}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800">Hours</p>
	</div>

	<div class="flex flex-col">
		<div
			class="flex items-center justify-center bg-gray-100 shadow rounded-xl w-24 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800">{minutes}</p>
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800">Minutes</p>
	</div>

	<div class="flex flex-col">
		<div
			class="flex relative items-center justify-center bg-gray-100 shadow rounded-xl w-24 sm:w-32 aspect-square"
		>
			<p class="text-4xl sm:text-6xl text-gray-800">{seconds}</p>
			{#if milliseconds}
				<p class=" font-semibold text-gray-800 w-4 h-12">
					.{Math.abs(milliseconds).toString().split('').splice(0, 1).join('')}
				</p>
			{/if}
		</div>
		<p class="text-sm sm:text-base text-center text-gray-800">Seconds</p>
	</div>
</div>
