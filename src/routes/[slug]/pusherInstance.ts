import Pusher from 'pusher-js';
import { PUBLIC_APP_CLUSTER, PUBLIC_APP_KEY, PUBLIC_ENV } from '$env/static/public';

Pusher.logToConsole = PUBLIC_ENV === 'production' ? false : true;

const pusher = new Pusher(PUBLIC_APP_KEY, {
	cluster: PUBLIC_APP_CLUSTER
});

export default pusher;
