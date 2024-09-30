import React from 'react';
import { pool } from '@/utils/dbConnect';
import UpdateTemplates from '@/app/components/templates/UpdateTemplates';

export default async function Page({ params }) {
  const { id } = params; // Get the ID from the URL parameters

  // Fetch the template data from the API or database
  const template = await getTemplateById(id);

  return (
    <div>
      <h1>Update Template</h1>
      {template ? (
        <UpdateTemplates template={template} />
      ) : (
        <p>Template not found</p>
      )}
    </div>
  );
}

// Function to fetch the template by ID from the database
async function getTemplateById(id) {
  try {
    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    return result.rows[0]; // Return the first row (template data)
  } catch (error) {
    console.error('Error fetching template:', error);
    return null; // Return null if an error occurs
  }
}
