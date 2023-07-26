import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';

import mysql from 'mysql2/promise';

export async function POST({ request }) {
	const { id } = await request.json();

	if (!id) {
		throw error(400, 'Missing slug');
	}

	const db = await mysql.createConnection(DATABASE_URL);

	const [timers] = await db.execute('SELECT * FROM timers WHERE pageId = ?', [id]);

	if (!timers) {
		throw error(404, 'Timers not found');
	}

	return json({
		status: 200,
		message: 'Timers found',
		timers: timers
	});
}
