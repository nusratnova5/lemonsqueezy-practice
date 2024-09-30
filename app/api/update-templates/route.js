import { pool } from "@/utils/dbConnect";
import { NextResponse } from 'next/server'; // Import NextResponse
import fs from 'fs/promises';
import path from 'path';

export async function PUT(req) { // Remove res parameter
    try {
        const formData = await req.formData();
        const templateId = formData.get('id');
        const templateName = formData.get('templateName');
        const description = formData.get('description');
        const price = formData.get('price');
        const thumbnail = formData.get('thumbnail');

        // Check if all required fields are present
        if (!templateId || !templateName || !description || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Handle file uploads
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        let thumbnailPath = null;
        if (thumbnail) {
            const thumbnailFilePath = path.join(uploadsDir, thumbnail.name);
            const thumbnailBuffer = await thumbnail.arrayBuffer();
            await fs.writeFile(thumbnailFilePath, Buffer.from(thumbnailBuffer));
            thumbnailPath = `uploads/${thumbnail.name}`; // Save the thumbnail path
        }

        // Update template in the database
        const updatedTemplate = await pool.query(
            'UPDATE templates SET template_name = $1, description = $2, price = $3, thumbnail_path = $4 WHERE id = $5 RETURNING *',
            [
                templateName,
                description,
                price ? parseFloat(price) : null,
                thumbnailPath, // Use the constructed path
                templateId
            ]
        );

        return NextResponse.json(updatedTemplate.rows[0], { status: 200 }); // Use NextResponse.json
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}
