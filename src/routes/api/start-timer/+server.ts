import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';

import mysql from 'mysql2/promise';
import pusher from '$lib/pushers';

export async function POST({ request, cookies }) {
	const { id, start, end, durationMs, pusherData } = await request.json();

	if (!id) {
		throw error(400, 'Missing ID');
	}

	const db = await mysql.createConnection(DATABASE_URL);

	await db.execute(
		'UPDATE timers SET isRunning = 1, start = ?, end = ?, durationMs = ? WHERE id = ?',
		[start, end, durationMs, id]
	);

	const [rows] = await db.execute('SELECT * FROM pages WHERE slug = ?', [pusherData.channel]);

	const page = rows[0];

	const [timers] = await db.execute('SELECT * FROM timers WHERE pageId = ?', [page.id]);

	await pusher.trigger(pusherData.channel, pusherData.event, {
		timers,
		timestamp: Date.now()
	});

	return json({
		status: 200,
		message: 'Timer started',
		timers
	});
}
