<script>
	export let page;
	export let onSubmit = (e) => {
		console.log(e);
	};
	const mySQLFormat = 'YYYY-MM-DD HH:mm:ss';

	export let timer;
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import Timer from './timer.svelte';
	import Button from '../../components/button.svelte';
	dayjs.extend(utc);

	const { slug } = page;
	let showForm = false;
	let isFocused = false;
	let inputValue = 0;

	$: if (inputValue) {
		const value = inputValue?.toString().padStart(8, '0');
		const seconds = Number(value.slice(-2));
		const minutes = Number(value.slice(-4, -2));
		const hours = Number(value.slice(-6, -4));
		const days = Number(value.slice(-8, -6));

		const ms = dayjs
			.utc()
			.add(days, 'day')
			.add(hours, 'hour')
			.add(minutes, 'minute')
			.add(seconds, 'second')
			.diff(dayjs.utc(), 'millisecond');

		timer = {
			...timer,
			durationMs: ms,
			end: dayjs.utc().add(ms, 'milliseconds').format(mySQLFormat),
			start: dayjs.utc().format(mySQLFormat)
		};
	} else {
		timer = {
			...timer,
			durationMs: 0,
			end: dayjs.utc().add(0, 'milliseconds').format(mySQLFormat),
			start: dayjs.utc().format(mySQLFormat)
		};
	}
	
	const handleEditTimer = () => {
		return fetch(`/api/edit-timer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: timer.id,
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
			.then((res) => {
				if (res.status !== 200) return alert(res.statusText);

				return res.json();
			})
			.then((data) => {
				if (data.error) return alert(data.error);

				onSubmit(data);
				showForm = false;
			});
	};
</script>

<button
	on:click={() => (showForm = true)}
	class="bg-sky-400 hover:bg-sky-500 w-full text-white my-auto font-bold py-2 px-4 rounded"
	>Edit</button
>

<div
	class={`inset-0 fixed flex items-center justify-center w-full h-screen backdrop-blur z-40 ${
		showForm ? '' : 'hidden'
	}`}
>
	<button class="fixed inset-0 bg-white dark:bg-black opacity-50 dark:opacity-50 w-full h-full z-40" />
	<div class="flex flex-col space-y-2 z-40">
		<input
			id="timer-input"
			on:focus={() => (isFocused = true)}
			on:blur={() => (isFocused = false)}
			bind:value={inputValue}
			type="number"
			class="bg-gray-200 shadow rounded-xl px-2 py-4 text-2xl opacity-0 pointer-events-none"
		/>
		<button
			on:click={() => {
				document.getElementById('timer-input')?.focus();
			}}
			class={`${isFocused ? 'outline-4 outline rounded-xl p-2 outline-sky-400' : ''}`}
		>
			<Timer {timer} />
		</button>

		<Button
			onClick={handleEditTimer}
			className="bg-sky-400 hover:bg-sky-500 text-white my-auto font-bold py-2 px-4 rounded"
			text="Save"
		/>
		<button
			on:click={() => (showForm = false)}
			class="bg-white hover:bg-gray-100 text-gray-800 border my-auto font-bold py-2 px-4 rounded"
			>Cancel</button
		>
	</div>
</div>
