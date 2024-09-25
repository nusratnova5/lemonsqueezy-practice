import dbConnect, { pool } from "@/utils/dbConnect";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function update({ params }) {
  dbConnect();
  const id = params.id;
  const data = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
  const result = data.rows[0]

  async function updateNote(formData) {
    "use server";
    let note = formData.get("note");
    let date = formData.get("date");

    try {
      const updatedNote = await pool.query(
        'UPDATE notes SET note = $1, date = $2 WHERE id = $3',
        [note, date, id]
      );
      console.log('New note updated', updatedNote);
    } catch (err) {
      console.error('error in updation', err);
    }
    redirect('/');
  }
  return (
    <div className="flex justify-center mt-20">
      <form action={updateNote} className="bg-white p-6 rounded border shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update the Note</h2>


        <div className="mb-4">
          <label htmlFor="note" className="block text-gray-700 text-sm font-bold mb-2">
            Note
          </label>
          <input
            type="text"
            id="note"
            name="note"
            defaultValue={result.note}
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
            defaultValue={result.date}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  )
}