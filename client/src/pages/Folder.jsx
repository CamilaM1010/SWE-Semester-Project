import React, {useState, useEffect} from "react";
import { useLocation, useNavigate} from "react-router-dom";
import {api} from "../utils/api";

const Folder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const folder = location.state || { name: "Loading...", notes: [] }; // Default if no folder is passed
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [noteToMove, setNoteToMove] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState({}); // State to hold the selected folder for editing
    const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        // Fetch user notes when component mounts
        const fetchNotes = async () => {
          try {
            const response = await api.getNotes(); // Fetch notes from the API
            const responseFolders = await api.getFolders(); // Fetch folders from the API
            console.log("Fetched notes:", response);
            console.log("Fetched folders:", responseFolders);
            setNotes(response || []); // Set notes state with the fetched data
            setFolders(responseFolders || []); // Set folders state with the fetched data
            setFilteredNotes(response.filter(note => note.folder_id.includes(folder._id)) || []); // Filter notes based on the folder ID
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
          const updatedNotes = filteredNotes.filter(note => note._id !== noteId);
          setNotes(updatedNotes); // Update the full notes array
          setFilteredNotes(updatedNotes.filter(note => 
            note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
          )); // Update the filtered notes
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      };

      const handleEditNote = (noteId) => {
        const noteToEdit = notes.find(note => note._id === noteId);
        navigate("/notes", { state: {note: noteToEdit} }); // Open note in Cornell template
      };

      const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
      };

      const openMoveModal = (noteId) => {
        setNoteToMove(noteId);
        setMoveModalOpen(true);
      };

      const handleMoveNoteToFolder = (folderId) => {
          if (noteToMove) {
            handleMoveNote(folderId, noteToMove);
            setMoveModalOpen(false);
            setNoteToMove(null);
          }
        };
      
        const handleMoveNote = async (folderId, noteId) => {
          if (!folderId) {
            alert("Please select a folder to move the note to.");
            return;
          }
      
          try {
            const response = await api.moveNoteToFolder(folderId, noteId); // Call API to move note
            console.log('Response from moveNoteToFolder:', response);
            if (response.success) {
              const updatedNotes = filteredNotes.filter(note => note._id !== noteId); // Remove the note from the current list
      
              setNotes(updatedNotes); // Update the notes state with the moved note
              setFilteredNotes(updatedNotes.filter(note => 
                note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
              )); // Update the filtered notes
      
              setSelectedFolder(prev => {
                const updated = { ...prev };
                delete updated[noteId];
                return updated;
              }); // Clear the selected folder for the moved note
              //alert("Note moved successfully!");
            } else {
              alert("Failed to move note. Please try again.");
            }
          } catch (error) {
            console.error('Error moving note:', error);
          }
        };

      const handleRemoveNote = (folderId, noteToMove) => {
        if (noteToMove) {
          handleRemoveNoteFromFolder(folderId, noteToMove);
          setMoveModalOpen(false);
          setNoteToMove(null);
        }
      };

      const handleRemoveNoteFromFolder = async (folderId, noteId) => {
        try {
          const response = await api.moveNoteOutOneFolder(folderId, noteId); 
          console.log('Response from moveNoteOutOneFolder:', response);
          if (response.success) {
            const updatedNotes = filteredNotes.filter(note => note._id !== noteId); // Remove the note from the current list
    
            setNotes(updatedNotes); // Update the notes state with the moved note
            setFilteredNotes(updatedNotes.filter(note => 
              note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
            )); // Update the filtered notes
    
            setSelectedFolder(prev => {
              const updated = { ...prev };
              delete updated[noteId];
              return updated;
            }); // Clear the selected folder for the moved note
            //alert("Note moved successfully!");
          } else {
            alert("Failed to move note. Please try again.");
          }
        } catch (error) {
          console.error('Error moving note:', error);
        }
      };


    //console.log("Location state:", location.state);
    // console.log("Folder data:", folder);
    // console.log("Folder ID:", folder._id);

    return(
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
                  The Archaeological Archives <span style={{ marginLeft: "10px" }}>🦖</span>
                </h1>
                <p style={{ 
                  color: "#17a2b8", 
                  margin: "0",
                  fontSize: "16px"
                }}>
                  All notes stored in "{folder? folder.name : "loading..."}" folder
                </p>
                </div>
            </div>

            {/* Notes display section */}
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
            ) : /*filteredNotes.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 4px #2c3e50"
              }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>
                  {searchTerm ? '🔍' : '🦕'}
                </div>
                <p style={{ 
                  fontSize: "18px", 
                  color: "#1E40AF",
                  marginBottom: "20px"
                }}>
                  {searchTerm 
                    ? `No notes found matching "${searchTerm}"`
                    : "No fossil records found yet."}
                </p>
                {!searchTerm && (
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
                )}
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredNotes(notes);
                    }}
                    style={{
                      backgroundColor: "#0021A5",
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
                    Clear Search
                  </button>
                )}
              </div>
            ) : */(
              <h3 style={{
                fontSize: "20px",
                color: "#0021A5",
                fontWeight: "bold"
              }}>
                Your Notes
              </h3>
            )}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
                marginTop: "20px"
              }}>
              

                {filteredNotes.map(note => (
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
                    //onClick={() => handleEditNote(note._id)}
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
                            {stripHtml(note.notes).length > 100 
                              ? stripHtml(note.notes).substring(0, 100) + "..." 
                              : stripHtml(note.notes)}
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
                          {note.edited && new Date(note.edited).toDateString() !== new Date(note.created).toDateString() ? 
                            <span>Edited: {new Date(note.edited).toLocaleDateString()}</span> : null}

                          {note.edited && new Date(note.edited).toDateString() === new Date(note.created).toDateString() ? 
                            <span>Created: {new Date(note.created).toLocaleDateString()}</span> : null}
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
                          <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMoveModal(note._id);
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
                            Move
                          </button>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
          {moveModalOpen && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 0.3s"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "15px"
                }}>
                  <h3 style={{
                    margin: 0,
                    color: "#0021A5",
                    fontSize: "18px",
                    fontWeight: "bold"
                  }}>Move Note to Folder</h3>
                  <button
                    onClick={() => setMoveModalOpen(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "#6B7280"
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: "15px"
                }}>
                  {folders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6B7280" }}>
                      No folders available. Create a folder first.
                    </p>
                  ) : (
                    <>
                    {/* Remove from all folders option */}
                    <button
                      onClick={() => handleRemoveNote(folder._id, noteToMove)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "10px",
                        border: "none",
                        backgroundColor: "#fee2e2", // Light red background
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        color: "#374151"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                    >
                      <div style={{
                        marginRight: "10px",
                        fontSize: "18px",
                        color: "#ef4444" // Red color
                      }}>
                        📤
                      </div>
                      <div>
                        <div style={{ fontWeight: "500" }}>Remove note from current folder</div>
                        <div style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginTop: "2px"
                        }}>Note will not be deleted, just removed from this folder</div>
                      </div>
                    </button>

                    <div style={{
                    borderTop: "1px solid #e5e7eb",
                    margin: "5px 0 15px 0",
                    position: "relative"
                  }}>
                    <span style={{
                      position: "absolute",
                      top: "-9px",
                      backgroundColor: "white",
                      padding: "0 10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "#6B7280",
                      fontSize: "12px"
                    }}>
                      Or select a folder
                    </span>
                  </div>

                    {folders.map((folder) => (
                      <button
                        key={folder._id}
                        onClick={() => handleMoveNoteToFolder(folder._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px",
                          borderRadius: "6px",
                          marginBottom: "5px",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          color: "#374151"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <div style={{
                          marginRight: "10px",
                          fontSize: "18px",
                          color: "#17a2b8"
                        }}>
                          📁
                        </div>
                        <div>
                          <div style={{ fontWeight: "500" }}>{folder.name}</div>
                          {folder.description && (
                            <div style={{
                              fontSize: "12px",
                              color: "#6B7280",
                              marginTop: "2px"
                            }}>{folder.description}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                  )}
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "15px"
                }}>
                  <button
                    onClick={() => setMoveModalOpen(false)}
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </div>
    </div>

    );
};
export default Folder;