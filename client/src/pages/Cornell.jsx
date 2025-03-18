import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const CornellTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const note = location.state?.note || { title: "", questions: "", notes: "", summary: "" };

  const [title, setTitle] = useState(note.title);
  const [header, setHeader] = useState(note.header);
  const [notes, setNotes] = useState(note.notes);
  const [summary, setSummary] = useState(note.summary);

  const handleSave = async () => {
    const noteData = { title, header, notes, summary };

    try {
      if (note._id) {
        await fetch(`/api/notes/${note._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }
      navigate("/private");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{note._id ? `Editing: ${title}` : "Create a New Note"}</h1>
      <div className="grid grid-cols-3 gap-4">
        <input
          className="border p-2 w-full col-span-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="border p-2 w-full"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder="Questions/Headers"
        ></textarea>
        <textarea
          className="border p-2 w-full"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        ></textarea>
        <textarea
          className="border p-2 w-full"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
        ></textarea>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CornellTemplate;
