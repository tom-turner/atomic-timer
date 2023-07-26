import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';
import pusher from '$lib/pushers';
import mysql from 'mysql2/promise';

export async function POST({ request, cookies }) {
	const { timer, slug, pusherData } = await request.json();

	if (!slug) {
		throw error(400, 'Missing slug');
	}

	if (!timer || !timer.durationMs || !timer.start || !timer.end) {
		throw error(400, 'Missing timer duration');
	}

	const db = await mysql.createConnection(DATABASE_URL);
	const [rows] = await db.execute('SELECT * FROM pages WHERE slug = ?', [slug]);
	const page = rows?.[0];

	if (!page) {
		throw error(404, 'Page not found');
	}

	const [inserted] = await db.execute(
		'INSERT INTO timers (pageId, durationMs, start, end, isRunning) VALUES (?, ?, ?, ?, 0)',
		[page.id, timer.durationMs, timer.start, timer.end]
	);

	const [timers] = await db.execute('SELECT * FROM timers WHERE pageId = ?', [page.id]);

	await pusher.trigger(pusherData.channel, pusherData.event, {
		timers
	});

	return json({
		status: 200,
		message: 'Timer created',
		timers: timers,
		newTimer: inserted
	});
}
