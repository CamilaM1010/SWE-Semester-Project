import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';

const Private = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user notes when component mounts
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || []);
        } else {
          console.error('Failed to fetch notes');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="private-page">
      <div className="welcome-header">
        <h1>Welcome, {user?.username}!</h1>
        <p>This is your private notes dashboard</p>
      </div>
      
      <div className="notes-container">
        {loading ? (
          <div className="loading">Loading your notes...</div>
        ) : notes.length === 0 ? (
          <div className="no-notes">
            <p>You don't have any notes yet.</p>
            <button className="create-note-btn">Create Your First Note</button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content.substring(0, 100)}...</p>
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="note-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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