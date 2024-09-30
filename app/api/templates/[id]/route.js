// /api/delete-template.js

import { pool } from '@/utils/dbConnect'; // Assuming you have a pool connection to your database
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(req, { params }) {
  const { id } = params;
  const data = await pool.query("SELECT * FROM templates WHERE id = $1", [id]);
  const result = data.rows[0]
  const filePath = `public/${result.file_path}`
  const thumbnailPath = `public/${result.thumbnail_path}`
  console.log(result)

  try {
    // Delete from the database
    await pool.query('DELETE FROM templates WHERE id = $1', [id]);

    // Delete the template file if it exists
    if (filePath) {
      const absoluteFilePath = path.join(process.cwd(), filePath);
      await fs.unlink(absoluteFilePath);
      console.log('Template file deleted:', absoluteFilePath);
    }

    // Delete the thumbnail file if it exists
    if (thumbnailPath) {
      const absoluteThumbnailPath = path.join(process.cwd(), thumbnailPath);
      await fs.unlink(absoluteThumbnailPath);
      console.log('Thumbnail file deleted:', absoluteThumbnailPath);
    }

    return Response.json({ message: 'Template and thumbnail deleted successfully' });
  } catch (error) {
    console.error('Error deleting template or files:', error);
    return Response.json({ error: 'Failed to delete template or files' });
  }
}

