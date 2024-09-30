"use client";

import { useState } from 'react';
import { LiaFileAltSolid } from "react-icons/lia";

import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function TemplateForm() {
    const [filePreview, setFilePreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const router = useRouter();
    console.log(filePreview);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            setFilePreview(file.name);
            

            // const reader = new FileReader();
            // console.log(reader)
            // reader.onload = () => {
            //     setFilePreview(reader.result);
            // };
            // reader.readAsDataURL(file);
        }
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.append('filename', filePreview);

        try {
            const response = await axios.post('/api/templates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
                },
            });

            if (response.status === 200) {
                // Handle success, e.g., show a success message or redirect
                console.log('Template uploaded successfully!', response.data);

                router.push('/templates');
            } else {
                // Handle error
                console.error('Error uploading template:', response.data);
            }
        } catch (error) {
            // Handle network or server error
            console.error('Error uploading template', error);
        }
    };

    return (
        <form className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Template Name:</label>
                <input type="text" name="templateName" required className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea name="description" className="mt-1 p-2 w-full border border-gray-300 rounded-md"></textarea>
            </div>

            <div className="mb-1">
                <label className="block text-sm font-medium text-gray-700">Upload Template</label>
                <input type="file" name="file" required onChange={handleFileChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
            </div>
            {filePreview && 
            <div className='flex items-center mb-4'>
               <p><LiaFileAltSolid/></p>
               <p alt="File Preview" className=" max-h-40 object-cover" >{filePreview}</p>
            </div>
            }

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price (if applicable):</label>
                <input type="number" name="price" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Upload Thumbnail:</label>
                <input type="file" name="thumbnail" accept="image/*" onChange={handleThumbnailChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
            </div>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 max-h-20 object-cover" />}

            <div className="mt-6">
                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Upload Template
                </button>
            </div>
        </form>
    );
}
