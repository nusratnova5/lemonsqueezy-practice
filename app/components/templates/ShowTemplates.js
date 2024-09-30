"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function ShowTemplates() {
    const [templates, setTemplates] = useState([]);
    const fetchTemplates = async () => {
        const response = await axios.get("/api/show-all-templates");
        setTemplates(response?.data);
    }
    useEffect(() => {
        fetchTemplates();
    }, [])
    const handleDelete = async (id, filePath, thumbnailPath) => {
        try {
        //   const response = await axios({
        //     method: 'DELETE',
        //     url: '/api/delete-template',
        //     data: { id, filePath, thumbnailPath }
        //   });
        const response = await axios.delete(`/api/templates/${id}`)
    
          if (response.status === 200) {
            // Update state to remove the deleted template from the UI
            setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== id));
            console.log('Template and thumbnail deleted successfully');
          } else {
            console.error('Failed to delete template');
          }
        } catch (error) {
          console.error('Error deleting template:', error);
        }
      };
    return (
        <div className='w-3/4 mx-auto'>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Available Templates</h1>
                {/* Render the templates in a grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">{template.template_name}</h2>

                            <p className="mb-4 text-gray-700">{template.description}</p>

                            {template.thumbnail_path && (
                                <img
                                    src={`/${template.thumbnail_path}`}
                                    alt={template.template_name}
                                    className="w-full h-40 object-cover mb-4 rounded-md"
                                />
                            )}

                            <p className="text-lg font-bold mb-4">
                                {template.price && typeof template.price === 'number'
                                    ? `$${template.price.toFixed(2)}`
                                    : 'Free'}
                            </p>

                            {template.file_path && (
                                <a
                                    href={`/${template.file_path}`}
                                    download
                                    className="text-blue-500 hover:underline"
                                >
                                    Download Template
                                </a>
                            )}
                            <div className='flex gap-5'>
                                <button className='btn btn-xs bg-blue-500'><Link href={`/templates/update-templates/${template.id}`}>
                                    Update Template
                                </Link></button>
                                <button
                                    className='btn btn-xs bg-red-500'
                                    onClick={() =>
                                        handleDelete(
                                            template.id,
                                            template.file_path,
                                            template.thumbnail_path
                                        )
                                    }
                                >
                                    Delete
                                </button>                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}
