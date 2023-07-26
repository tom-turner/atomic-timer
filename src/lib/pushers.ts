import Pusher from 'pusher';
import { PUBLIC_APP_KEY, PUBLIC_APP_CLUSTER, PUBLIC_ENV } from '$env/static/public';
import { APP_ID, APP_SECRET } from '$env/static/private';

const pusher = new Pusher({
	appId: APP_ID,
	key: PUBLIC_APP_KEY,
	secret: APP_SECRET,
	cluster: PUBLIC_APP_CLUSTER,
	useTLS: PUBLIC_ENV === 'production' ? true : false
});

export default pusher;
