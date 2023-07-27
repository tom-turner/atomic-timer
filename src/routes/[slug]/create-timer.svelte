<script>
	export let page;
	export let onSubmit = (e) => {
		console.log(e);
	};
	import { onMount, beforeUpdate } from 'svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import duration from 'dayjs/plugin/duration';
	import Button from '../../components/button.svelte';
	const mySQLFormat = 'YYYY-MM-DD HH:mm:ss';
	const dateFormat = 'YYYY-MM-DD';
	const timeFormat = 'HH:mm:ss';

	dayjs.extend(utc);
	dayjs.extend(duration);

	const { slug } = page;
	let showForm = false;

	let timer = {
		durationMs: 0,
		start: dayjs.utc().format(mySQLFormat),
		end: dayjs.utc().add(0, 'seconds').format(mySQLFormat),
		isRunning: false
	};

	let values = {
		seconds: 0,
		minutes: 0,
		hours: 0,
		days: 0,
		date: dayjs.utc().format(dateFormat),
		time: dayjs.utc().format(timeFormat)
	};

	const updateValues = () => {
		values.seconds = dayjs.duration(timer.durationMs).seconds();
		values.minutes = dayjs.duration(timer.durationMs).minutes();
		values.hours = dayjs.duration(timer.durationMs).hours();
		values.days = dayjs.duration(timer.durationMs).days();
		values.date = dayjs.utc().add(timer.durationMs, 'millisecond').format(dateFormat);
		values.time = dayjs.utc().add(timer.durationMs, 'millisecond').format(timeFormat);
	};

	const handleInput = (e) => {
		const value = e.target.value;
		const name = e.target.id;
		values[name] = value;

		if (name === 'seconds' || name === 'minutes' || name === 'hours' || name === 'days') {
			timer.end = dayjs
				.utc()
				.add(values.days, 'day')
				.add(values.hours, 'hour')
				.add(values.minutes, 'minute')
				.add(values.seconds, 'second')
				.format(mySQLFormat);
			timer.start = dayjs.utc().format(mySQLFormat);
			timer.durationMs = dayjs.utc(timer.end).diff(dayjs.utc(timer.start), 'millisecond');
		}

		if (name === 'date' || name === 'time') {
			timer.end = dayjs.utc(`${values.date} ${values.time}`).format(mySQLFormat);
			timer.start = dayjs.utc().format(mySQLFormat);
			timer.durationMs = dayjs.utc(timer.end).diff(dayjs.utc(timer.start), 'millisecond');
		}

		updateValues();
	};

	// let interval;
	// const run = () => {
	// 	interval = setInterval(() => {
	// 		updateValues();
	// 	}, 500);
	// };
	// const stop = () => {
	// 	clearInterval(interval);
	// };
	// onMount(() => {
	// 	stop();
	// 	run();
	// });

	// beforeUpdate(() => {
	// 	stop();
	// 	run();
	// });

	const handleCreateTimer = () => {
		return fetch(`/api/create-timer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				timer: {
					durationMs: timer.durationMs,
					start: dayjs(timer.start).format(mySQLFormat),
					end: dayjs(timer.end).format(mySQLFormat),
					isRunning: timer.isRunning
				},
				slug,
				pusherData: {
					channel: slug,
					event: 'update'
				}
			})
		})
			.then(async (res) => {
				if (res.status !== 200) {
					const body = await res.json();
					return alert(body.message || res.statusText);
				}

				return res.json();
			})
			.then((data) => {
				onSubmit(data);
				showForm = false;
			});
	};
</script>

<div>
	<button
		on:click={() => (showForm = true)}
		class="bg-sky-400 hover:bg-sky-500 mx-auto flex text-white my-auto font-bold py-2 px-4 rounded"
		>Create New Timer</button
	>

	<div
		class={`inset-0 fixed flex items-center justify-center w-full backdrop-blur h-screen ${
			showForm ? '' : 'hidden'
		}`}
	>
		<button class="fixed inset-0 bg-white dark:bg-black opacity-50 dark:opacity-50 w-full h-full" />
		<div class="flex flex-col space-y-2 z-0">
			<div class={`flex h-min w-full items-center justify-center space-x-2 rounded-xl p-2 `}>
				<input
					on:input={handleInput}
					value={values.date}
					id="date"
					type="date"
					class="rounded bg-gray-100 dark:bg-neutral-800 dark:text-neutral-100 px-4 py-2"
				/>
				<input
					on:input={handleInput}
					value={values.time}
					id="time"
					type="time"
					class="rounded bg-gray-100 dark:bg-neutral-800 dark:text-neutral-100 px-4 py-2"
				/>
			</div>
			<div class={`flex h-min w-full items-center space-x-2 rounded-xl p-2 text-center`}>
				<div class="flex flex-col">
					<input
						on:input={handleInput}
						value={values.days}
						id="days"
						type="number"
						min="0"
						class="flex text-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-24 sm:w-32 aspect-square text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200"
					/>
					<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Days</p>
				</div>
				<div class="flex flex-col">
					<input
						on:input={handleInput}
						value={values.hours}
						id="hours"
						type="number"
						min="0"
						max="23"
						class="flex text-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-24 sm:w-32 aspect-square text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200"
					/>
					<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">Hours</p>
				</div>

				<div class="flex flex-col">
					<input
						on:input={handleInput}
						value={values.minutes}
						id="minutes"
						type="number"
						min="0"
						max="59"
						class="flex text-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-24 sm:w-32 aspect-square text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200"
					/>
					<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">
						Minutes
					</p>
				</div>

				<div class="flex flex-col">
					<input
						on:input={handleInput}
						value={values.seconds}
						id="seconds"
						type="number"
						min="0"
						max="59"
						class="flex text-center bg-gray-100 dark:bg-neutral-800 shadow rounded-xl w-24 sm:w-32 aspect-square text-4xl sm:text-6xl text-gray-800 dark:text-neutral-200"
					/>
					<p class="text-sm sm:text-base text-center text-gray-800 dark:text-neutral-200">
						Seconds
					</p>
				</div>
			</div>

			<Button
				onClick={handleCreateTimer}
				className="bg-sky-400 hover:bg-sky-500 text-white my-auto font-bold py-2 px-4 rounded"
				text="Create"
			/>
			<button
				on:click={() => (showForm = false)}
				class="bg-white hover:bg-gray-100 text-gray-800 border my-auto font-bold py-2 px-4 rounded"
				>Cancel</button
			>
		</div>
	</div>
</div>
