import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import api from '../utils/api';
import { useNavigate } from "react-router-dom";

const Private = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div style={{ 
      backgroundColor: "#EBF5FF", 
      minHeight: "100vh",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: "linear-gradient(90deg, #0021A5 0%, #17a2b8 100%)",
          padding: "20px 30px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 4px 6px #2c3e50"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              color: "white", 
              margin: "0 0 5px 0",
              display: "flex",
              alignItems: "center"
            }}>
              Welcome, {user?.username}! <span style={{ marginLeft: "10px" }}>🦖</span>
            </h1>
            <p style={{ 
              color: "#17a2b8", 
              margin: "0",
              fontSize: "16px"
            }}>
              Your prehistoric notes collection
            </p>
          </div>

          <button 
            onClick={handleCreateNote}
            style={{
              backgroundColor: "#FA4616",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "14px 30px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 6px #2c3e50",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s, background-color 0.2s"
            }}
          >
            <span style={{ marginRight: "8px" }}>🦕</span> Create New Note
          </button>
        </div>
        
        <div>
          {loading ? (
            <div style={{
              textAlign: "center",
              padding: "40px 0",
              fontSize: "18px",
              color: "#1E40AF",
              fontWeight: "bold",
              background: "#f8f9fa",
              borderRadius: "12px",
              boxShadow: "0 2px 4px #2c3e50"
            }}>
              <div style={{
                display: "inline-block",
                animation: "bounce 1s infinite alternate"
              }}>
                🦖 Excavating your notes... 🦕
              </div>
              <style>
                {`
                  @keyframes bounce {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-10px); }
                  }
                `}
              </style>
            </div>
          ) : notes.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 4px #2c3e50"
            }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🦕</div>
              <p style={{ 
                fontSize: "18px", 
                color: "#1E40AF",
                marginBottom: "20px"
              }}>
                No fossil records found yet.
              </p>
              <button 
                onClick={handleCreateNote}
                style={{
                  backgroundColor: "#F97316",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px #2c3e50"
                }}
              >
                Start Your First Note
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "20px"
            }}>
              {notes.map(note => (
                <div 
                  key={note._id} 
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px #2c3e50",
                    overflow: "hidden",
                    border: "3px solid #0021A5",
                    transition: "transform 0.2s",
                    cursor: "pointer"
                  }}
                  onClick={() => handleEditNote(note._id)}
                >
                  <div style={{
                    background: "linear-gradient(90deg, #0021A5 0%, #17a2b8 100%)",
                    padding: "15px",
                    position: "relative"
                  }}>
                    <h3 style={{ 
                      margin: "0",
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {note.title || "Untitled Note"}
                    </h3>
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      fontSize: "18px"
                    }}>
                      🦖
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: "15px",
                    background: "linear-gradient(to bottom, #FFFFFF, #F0F7FF)"
                  }}>
                    <div style={{
                      overflow: "hidden",
                      maxHeight: "100px",
                      marginBottom: "15px",
                      color: "#374151",
                      fontSize: "14px"
                    }}>
                      {note.notes ? (
                        <p style={{ margin: "0" }}>
                          {note.notes.length > 100 
                            ? note.notes.substring(0, 100) + "..." 
                            : note.notes}
                        </p>
                      ) : <p style={{ margin: "0", fontStyle: "italic", color: "#9CA3AF" }}>No content</p>}
                    </div>
                    
                    <div style={{
                      borderTop: "1px solid #f8f9fa",
                      paddingTop: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{ 
                        color: "#6B7280",
                        fontSize: "12px"
                      }}>
                        {new Date(Date.now()).toLocaleDateString()}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note._id);
                          }}
                          style={{
                            backgroundColor: "#17a2b8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note._id);
                          }}
                          style={{
                            backgroundColor: "#EF4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ 
          marginTop: "40px", 
          textAlign: "center"
        }}>
          
        </div>
      </div>
    </div>
  );
};

export default Private;