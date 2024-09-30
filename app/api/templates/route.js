import fs from 'fs/promises';
import path from 'path';
import { pool } from "@/utils/dbConnect";

export async function POST(req) {
    try {
        const formData = await req.formData(); // Parse the incoming FormData

        const newTemplate = await createTemplate(formData);

        // Returning JSON response with status 200
        return Response.json(newTemplate, { status: 200 });
    } catch (error) {
        console.error('Error creating template:', error);

        // Return JSON error response with status 500
        return Response.json({ error: 'Failed to create template' }, { status: 500 });
    }
}

// Create your createTemplate function here
async function createTemplate(formData) {
    const templateName = formData.get("templateName");
    const description = formData.get("description");
    const file = formData.get("file");
    const price = formData.get("price");
    const thumbnail = formData.get("thumbnail");
    const filename = formData.get("filename");

    if (!templateName || !description || !file || !price || !thumbnail) {
        console.log('templateName, description, file, price, and thumbnail are required');
        throw new Error('Validation error');
    }

    try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        const filePath = path.join(uploadsDir, file.name);
        const thumbnailPath = path.join(uploadsDir, thumbnail.name);

        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        const thumbnailBuffer = await thumbnail.arrayBuffer();
        await fs.writeFile(thumbnailPath, Buffer.from(thumbnailBuffer));

        const newTemplate = await pool.query(
            'INSERT INTO templates (template_name, description, file_path, price, thumbnail_path, file_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                templateName,
                description,
                `uploads/${file.name}`,
                price ? parseFloat(price) : null,
                `uploads/${thumbnail.name}`,
                filename
            ]
        );

        console.log('New template added:', newTemplate.rows[0]);
        return newTemplate.rows[0]; // Return the newly created template
    } catch (err) {
        console.error('Database insertion error:', err);
        throw new Error('Database error');
    }
}
