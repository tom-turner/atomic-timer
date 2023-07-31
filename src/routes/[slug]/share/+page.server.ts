import { error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';

import mysql from 'mysql2/promise';

export async function load({ params }) {
	const { slug } = params;
	const db = await mysql.createConnection(DATABASE_URL);

	const getPage = async () => {
		let page = null;
		try {
			const [rows] = await db.execute('SELECT * FROM pages WHERE slug = ?', [slug]);
			page = rows?.[0];
		} catch (e) {
			throw error(500, 'Database error');
		}
		if (!page) {
			await db.execute('INSERT INTO pages (slug, updatedAt) VALUES (?, NOW())', [slug]);
			return getPage();
		}

		return page;
	};

	const page = await getPage();

	return {
		slug,
		page : {
			...page,
			image : page.image?.toString()
		}
	};
}
