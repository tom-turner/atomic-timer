import { error, redirect } from '@sveltejs/kit';

const generateUUID = (length = 12) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let uuid = '';
	for (let i = 0; i < length; i++) {
		uuid += characters[Math.floor(Math.random() * characters.length)];
	}
	return uuid;
};

export async function load({ cookies, url }) {
	const reset = url.searchParams.get('reset') === 'true';
	if (reset) {
		cookies.delete('slug');
	}

	let slug = cookies.get('slug');

	if (!slug) {
		slug = generateUUID();
		cookies.set('slug', slug);
	}

	throw redirect(307, `/${slug}`);
}
