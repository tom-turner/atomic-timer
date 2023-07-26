import { error, redirect } from '@sveltejs/kit';

const generateUUID = (length = 12) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let uuid = '';
	for (let i = 0; i < length; i++) {
		uuid += characters[Math.floor(Math.random() * characters.length)];
	}
	return uuid;
};

export async function load({ cookies }) {
	let slug = cookies.get('timer-slug');

	if (!slug) {
		slug = generateUUID();
		cookies.set('timer-slug', slug);
	}

	throw redirect(307, `/${slug}`);
}
