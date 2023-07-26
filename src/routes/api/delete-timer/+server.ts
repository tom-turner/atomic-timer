import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';
import pusher from '$lib/pushers';
import mysql from 'mysql2/promise';

export async function POST({ request, cookies }) {
	const { id, pageId, pusherData } = await request.json();

	if (!id) {
		throw error(400, 'Missing slug');
	}

	const db = await mysql.createConnection(DATABASE_URL);

	await db.execute('DELETE FROM timers WHERE id = ?', [id]);

	const [timers] = await db.execute('SELECT * FROM timers WHERE pageId = ?', [pageId]);

	if (!timers || timers.find((timer) => timer.id === id)) {
		throw error(500, 'Something went wrong');
	}

	await pusher.trigger(pusherData.channel, pusherData.event, {
		timers
	});

	return json({
		status: 200,
		message: 'Timer deleted',
		timers: timers
	});
}
