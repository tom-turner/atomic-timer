<script>
    import dayjs from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    import duration from "dayjs/plugin/duration";
    const mySQLFormat = 'YYYY-MM-DD HH:mm:ss'
    dayjs.extend(utc);
    dayjs.extend(duration);

    export let timer = {
        durationMs: 45000,
        start: dayjs.utc().format(mySQLFormat),
        end: dayjs.utc().add(45, 'seconds').format(mySQLFormat),
        isRunning: false,
    }

    $: isRunning = timer.isRunning
    $: diff = dayjs(timer.end).diff( !timer.isRunning ? dayjs(timer.start) : dayjs().utc().format(mySQLFormat), 'millisecond')
    $: days = dayjs.duration(diff).days()
    $: hours = dayjs.duration(diff).hours()
    $: minutes = dayjs.duration(diff).minutes()
    $: seconds = dayjs.duration(diff).seconds()
    $: milliseconds = dayjs.duration(diff).milliseconds()
    let interval;
    $:{
        if(isRunning){          
            interval = setInterval(() => {
                diff = dayjs(timer.end).diff(dayjs().utc().format(mySQLFormat), 'millisecond')
            }, 100)
        } else {
            clearInterval(interval)
        }
    }
    
</script>
    <div class="flex space-x-4 w-full justify-center">
        <div class="flex flex-col">
            <div class="flex items-center justify-center bg-gray-200 shadow rounded-xl w-32 aspect-square">
                <p class="text-6xl text-gray-800">{days}</p>
            </div>
            <p class="text-center text-gray-800">Days</p>
        </div>

        <div class="flex flex-col">
            <div class="flex items-center justify-center bg-gray-200 shadow rounded-xl w-32 aspect-square">
                <p class="text-6xl text-gray-800">{hours}</p>
            </div>
            <p class="text-center text-gray-800">Hours</p>
        </div>

        <div class="flex flex-col">
            <div class="flex items-center justify-center bg-gray-200 shadow rounded-xl w-32 aspect-square">
                <p class="text-6xl text-gray-800">{minutes}</p>
            </div>
            <p class="text-center text-gray-800">Minutes</p>
        </div>


        <div class="flex flex-col">
            <div class="flex relative items-center justify-center bg-gray-200 shadow rounded-xl w-32 aspect-square">
                <p class="text-6xl text-gray-800">{seconds}</p>
                {#if milliseconds}
                    <p class=" font-semibold text-gray-800 w-4 h-12">.{Math.abs(milliseconds).toString().split('').splice(0,1).join('')}</p>
                {/if}
            </div>
            <p class="text-center text-gray-800">Seconds</p>
        </div>

    </div>

