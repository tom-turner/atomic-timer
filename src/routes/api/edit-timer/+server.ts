import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';
import pusher from '$lib/pushers';
import mysql from 'mysql2/promise';

export async function POST({ request }) {
	const { id, slug, timer, pusherData } = await request.json();

	if (!id) {
		throw error(400, 'Missing slug');
	}

	console.log(id, slug, timer, pusherData);

	if (!timer || !timer.durationMs || !timer.start || !timer.end) {
		throw error(400, 'Missing timer');
	}

	const db = await mysql.createConnection(DATABASE_URL);

	const [rows] = await db.execute('SELECT * FROM pages WHERE slug = ?', [slug]);

	const page = rows[0];
	console.log(page);

	if (!page) {
		throw error(404, 'Page not found');
	}

	await db.execute('UPDATE timers SET durationMs = ?, start = ?, end = ? WHERE id = ?', [
		timer.durationMs,
		timer.start,
		timer.end,
		id
	]);

	const [timers] = await db.execute('SELECT * FROM timers WHERE pageId = ?', [page.id]);

	pusher.trigger(pusherData.channel, pusherData.event, {
		timers
	});

	return json({
		status: 200,
		message: 'Timer created',
		timers: timers
	});
}
