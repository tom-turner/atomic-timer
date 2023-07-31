import { json, error } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';
import mysql from 'mysql2/promise';

export async function POST({ request }) {
    const { imageString, slug } = await request.json();
    console.log(imageString, slug);

    const webpImageRegex = /^data:image\/webp;base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    if (!webpImageRegex.test(imageString)) {
        throw error(400, 'Invalid image string');
    }

    const decodedImageBuffer = Buffer.from(imageString.replace(/^data:image\/webp;base64,/, ''), 'base64');
    if (decodedImageBuffer.length > 1 * 1024 * 1024) {
        throw error(400, 'Maximum file size is 1MB');
    }

    const connection = await mysql.createConnection(DATABASE_URL);

    try {
        const [rows] = await connection.execute(`
            UPDATE pages
            SET image = ?
            WHERE slug = ?
        `, [imageString, slug]);

        return json({
            success: true,
            message: 'Image uploaded successfully'
        });

    } catch (err) {
        console.log(err);
        throw error(500, 'Internal server error');
    }
}