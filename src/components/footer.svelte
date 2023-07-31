<script>
	export let latency;
</script>

<div class="text-center text-white font-semibold text-sm text-shadow">
	<a class="hover:underline text-sky-400" href="https://ttcreative.limited" target="_blank"
		>TT Creative</a
	>
	<p>Created by Tom Turner</p>
	<p>Latency: {latency ? latency + 'ms' : 'N/A'}</p>
</div>

<style>
	.text-shadow {
		text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}
</style>
