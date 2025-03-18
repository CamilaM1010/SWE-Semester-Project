import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import api from '../utils/api';
import { useNavigate } from "react-router-dom";

const Private = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [editingNote, setEditingNote] = useState(null);
  // const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  // const [noteTitle, setNoteTitle] = useState("");
  // const [noteContent, setNoteContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user notes when component mounts
    const fetchNotes = async () => {
      try {
        const response = await api.getNotes(); // Fetch notes from the API
        console.log("Fetched notes:", response);
        setNotes(response || []); // Set notes state with the fetched data

      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // const openModal = (note = null) => {
  //   console.log("Opening modal with note:", note); // Debugging log
  //   setEditingNote(note);  // Ensure note is passed as the object
  //   setNoteForm(note ? { title: note.title, content: note.content || '' } : { title: '', content: '' });
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   setModalOpen(false);
  //   setEditingNote(null);
  //   setNoteForm({ title: '', content: '' });
  // };

    // const handleSave = async () => {
  //   try {
  //     if (editingNote && editingNote._id) {  // Ensure _id exists
  //       const updatedNote = await api.updateNote(editingNote._id, noteForm);
  //       setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
  //     } else {
  //       const newNote = await api.createNote(noteForm);
  //       setNotes([...notes, newNote]);
  //     }
  //     closeModal();
  //   } catch (error) {
  //     console.error("Error saving note:", error);
  //   }
  // };


  // const handleCreateNote = async () => {
  //   const newNote = {
  //     title: noteTitle,
  //     content: noteContent,
  //   };

  //   try {
  //     const response = await fetch("/api/notes", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(newNote),
  //     });

  //     const data = await response.json();
  //     console.log("Created Note Response:", data); // Add this log

  //     if (response.ok) {
  //       setNotes([...notes, {_id: data.note_id, title: noteTitle, content: noteContent }]);
  //       setNoteTitle(""); // Clear input after success
  //       setNoteContent("");
  //     } else {
  //       console.error("Failed to create note");
  //     }
  //   } catch (error) {
  //     console.error("Error creating note:", error);
  //   }
  // };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      // Log the noteId to ensure it's not undefined
      if (!noteId) {
        console.error("No noteId provided. Unable to delete.");
        return;
      }
  
      await api.deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId)); // Remove from UI
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCreateNote = () => {
    navigate("/notes"); // Go to Cornell template for new note
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(note => note._id === noteId);
    navigate("/notes", { state: {note: noteToEdit} }); // Open note in Cornell template
  };


  return (
    <div className="private-page">
      <div className="welcome-header">
        <h1>Welcome, {user?.username}!</h1>
        <p>This is your private notes dashboard</p>
        <button onClick={handleCreateNote}>Create Note</button>
        </div>
      
      <div className="notes-container">
        {loading ? (
          <div className="loading">Loading your notes...</div>
        ) : notes.length === 0 ? (
          <div className="no-notes">
            <p>You don't have any notes yet.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(Date.now()).toLocaleDateString()}
                  </span>
                  <div className="note-actions">
                    <button onClick={() => handleEditNote(note._id)}>Edit</button>
                    <button onClick={() => handleDelete(note._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Private;