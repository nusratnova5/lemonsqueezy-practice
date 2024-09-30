"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';import { LiaFileAltSolid } from 'react-icons/lia';
;

export default function TemplateUpdateForm({ template }) {
    console.log(template);
    
    const [templateName, setTemplateName] = useState(template.template_name || '');
    const [description, setDescription] = useState(template.description || '');
    const [price, setPrice] = useState(template.price || 0);
    const [filePreview, setFilePreview] = useState(template.file_path || null);
    const [thumbnailPreview, setThumbnailPreview] = useState(template.thumbnail || null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    const handleThumbnailChange = (event) => {
        const thumbnail = event.target.files[0];
        if (thumbnail) {
            const reader = new FileReader();
            reader.onload = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(thumbnail);
        }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          setFilePreview(file.name); // Display the file name as a preview
      }
  };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('id', template.id); // Include template ID for the update
        formData.append('templateName', templateName);
        formData.append('description', description);
        formData.append('price', price);
        if (event.target.thumbnail.files[0]) {
            formData.append('thumbnail', event.target.thumbnail.files[0]);
        }
        if (event.target.file.files[0]) {
          formData.append('file', event.target.file.files[0]); // Add file upload
      }


        try {
            // Use axios to send the PUT request
            const response = await axios.put(`/api/update-templates`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Template updated successfully!');
                router.push('/templates');
            } else {
                setErrorMessage('Failed to update template');
            }
        } catch (error) {
            console.error('Error updating template:', error);
            setErrorMessage('An error occurred while updating the template');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Hidden input to store template id */}
            <input type="hidden" value={template.id} />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Template Name:</label>
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-1">
                <label className="block text-sm font-medium text-gray-700">Update Template File:</label>
                <input type="file" name="file" onChange={handleFileChange}/>
            </div>
            {filePreview && 
            <div className='flex items-center mb-4'>
            <p><LiaFileAltSolid/></p>
            <p alt="File Preview" className=" max-h-40 object-cover" >{template?.file_name}</p>
         </div>
         }

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Update Thumbnail:</label>
                <input type="file" name="thumbnail" accept="image/*" onChange={handleThumbnailChange} />
            </div>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 max-h-20 object-cover" />}

            <div className="mt-6">
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Update Template
                </button>
            </div>
        </form>
    );
}
