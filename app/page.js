import fs from 'fs/promises';
import path from 'path';
import dbConnect, { pool } from "@/utils/dbConnect";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  dbConnect();
  //create items
  async function createNote(formData) {
    "use server";
  
    let note = formData.get("note"); 
    let date = formData.get("date");
    let file = formData.get("file"); 
  
    if (!note || !date || !file) {
      console.log('Note, date, and file are required');
      return;
    }
  
    try {
      // Define the uploads directory path
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
  
      // Ensure uploads directory exists
      await fs.mkdir(uploadsDir, { recursive: true });
  
      // Construct the file path
      const filePath = path.join(uploadsDir, file.name); // Save the file in public/uploads
  
      // Read the file data and write to disk
      const fileBuffer = await file.arrayBuffer(); // Get file data as buffer
      await fs.writeFile(filePath, Buffer.from(fileBuffer)); // Save file
  
      // Insert into the database with the relative path
      const newNote = await pool.query(
        'INSERT INTO notes (note, date, file_path) VALUES ($1, $2, $3) RETURNING *',
        [note, date, `uploads/${file.name}`] // Store relative path
      );
  
      console.log('New note added:', newNote.rows[0]);
    } catch (err) {
      console.error('Database insertion error:', err);
    }
    redirect('/');
  }
  //read items
  const data = await pool.query("SELECT * FROM notes")
  const result = data.rows;
  //delete items
  async function deleteNote(formData) {
    "use server";

    let id = formData.get("id");

    try {
      await pool.query(
        'DELETE FROM notes WHERE id = $1', [id]
      );
      if (filePath) {
        await fs.unlink(filePath);
        console.log('File deleted:', filePath);
      }
      console.log('Note deleted:');
    } catch (err) {
      console.error('Database insertion error:', err);
    }
    redirect('/');
  }

  return (
    <div className="grid grid-cols-2 items-center gap-5 justify-center w-3/4 mx-auto min-h-screen">
      <div>
        <form action={createNote} className="bg-white p-6 rounded border shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Add a Note</h2>
          <div className="mb-4">
            <label htmlFor="note" className="block text-gray-700 text-sm font-bold mb-2">
              Note
            </label>
            <input
              type="text"
              id="note"
              name="note"
              placeholder="Write your note here..."
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="mb-1 block">Upload File</span>
              <input
                type="file"
                name="file"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>


          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
      </div>
      <div>
        {
          result.map((items) => {
            return (
              <div className="w-full max-w-md border shadow-md mb-2 p-5 rounded-lg">
                <ul className="">
                  <li>{items?.note}</li>
                  <li>{items?.date}</li>
                  {items?.file_path && (
                    <li className="mt-2">
                      <a
                        href={`/${items.file_path}`} // Adjust the path based on your structure
                        target="_blank" // Open in a new tab
                        className="text-blue-500 hover:underline"
                      >
                        View Uploaded File
                      </a>
                    </li>
                  )}
                  <li className="flex gap-3 mt-4">
                    <Link href={"/update/" + items.id}><button className="btn btn-sx bg-blue-500 px-2 py-1  rounded text-white font-bold">Update</button></Link>

                    <form action={deleteNote}>
                      <input type="hidden" name='id' value={items?.id} />
                      <button className="btn btn-sx bg-red-700 px-2 py-1  rounded text-white font-bold">Delete</button>
                    </form>
                  </li>
                </ul>
              </div>
            )
          })
        }
      </div>

    </div>
  );
}
