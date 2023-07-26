
<script>
	export let data    
  import Pusher from 'pusher-js';
  import {
      PUBLIC_APP_CLUSTER,
      PUBLIC_APP_KEY,
      PUBLIC_ENV,
  } from '$env/static/public';
  import Timer from './timer.svelte'
  import CreateTimer from './create-timer.svelte'
  import dayjs from 'dayjs'
  import utc from 'dayjs/plugin/utc'
  const mySQLFormat = 'YYYY-MM-DD HH:mm:ss'
  dayjs.extend(utc);
  
  Pusher.logToConsole = PUBLIC_ENV === 'production' ? false : true;

  const { page, slug } = data

  let pusher = new Pusher(PUBLIC_APP_KEY, {
    cluster: PUBLIC_APP_CLUSTER
  });

  $: timers = getTimers()

  const updateTimers = (e) => {
    timers = e.timers
  }

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
        if(res.status !== 200) return alert(res.statusText)
        return res.json()
      })
    
    return res.timers
  }

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
          event: 'update',
        }
      })
    }).then((res) => {
        if(res.status !== 200) return alert(res.statusText)
    })
  }

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
          event: 'update',
        }
      })
    }).then((res) => {
        if(res.status !== 200) return alert(res.statusText)
    })
  }

  const stopTimer = (id, durationMs, reset = true) => {
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
          event: 'update',
        }
      })
    }).then((res) => {
        if(res.status !== 200) return alert(res.statusText)
    })
  }

  let channel = pusher.subscribe(slug);

  channel.bind('update',(data) => {
      updateTimers(data)
  });
  
</script>


<main
    class="flex flex-col items-center justify-center w-full h-full space-y-8 p-8"
>
    <div class="flex flex-col space-y-4">
      {#await timers}
        <p class="text-4xl font-semibold text-center my-auto">Loading Timers...</p>
      {:then timers}
        {#each timers as timer}
            <div class="flex space-x-2">
                <Timer {timer} />
                <div class="flex flex-col h-full justify-between space-y-2">
                    {#if timer.isRunning}
                      <button on:click={() => stopTimer(timer.id, timer.durationMs)} class="bg-yellow-400 text-white my-auto font-bold py-2 px-4 rounded">Stop</button>
                    {:else}
                      <button on:click={() => startTimer(timer.id, timer.durationMs)} class="bg-green-400 text-white my-auto font-bold py-2 px-4 rounded">Start</button>
                    {/if}
                    <button class="bg-sky-400 text-white my-auto font-bold py-2 px-4 rounded">Edit</button>
                    <button on:click={() => deleteTimer(timer.id)} class="bg-red-400 text-white my-auto font-bold py-2 px-4 rounded">Delete</button>
                </div>
            </div>
        {/each}
        
        {:catch error}
	        <p class="text-red-400">{error.message}</p>

      {/await}
    </div>

    <CreateTimer page={page} onSubmit={updateTimers} />
  </main>

