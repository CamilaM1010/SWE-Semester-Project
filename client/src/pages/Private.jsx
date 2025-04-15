import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import api from '../utils/api';
import { useNavigate } from "react-router-dom";

const Private = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // State to control folder modal visibility
  const [folderNameModal, setFolderNameModal] = useState(''); // State to hold the folder name for modal input
  const [folderDescriptionModal, setFolderDescriptionModal] = useState(''); // State to hold the folder description for modal input
  const navigate = useNavigate();

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
        setFilteredNotes(response || []); // Initially, filtered notes are all notes
        setFilteredFolders(responseFolders || []); // Initially, filtered folders are all folders
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchNotes();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Filter notes based on search term
    if (term.trim() === '') {
      setFilteredNotes(notes); // If search is empty, show all notes
    } else {
      const filtered = notes.filter(note => 
        note.title && note.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredNotes(filtered);
    }

    // Filter folders based on search term
    if (term.trim() === '') {
      setFilteredFolders(folders); // If search is empty, show all folders
    } else {
      const filtered = folders.filter(folder => 
        folder.name && folder.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFolders(filtered);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      // Log the noteId to ensure it's not undefined
      if (!noteId) {
        console.error("No noteId provided. Unable to delete.");
        return;
      }
  
      await api.deleteNote(noteId);
      const updatedNotes = notes.filter(note => note._id !== noteId);
      setNotes(updatedNotes); // Update the full notes array
      setFilteredNotes(updatedNotes.filter(note => 
        note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
      )); // Update the filtered notes
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
  
  // Helper function to strip HTML tags for preview
  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  const handleCreateFolder = () => {
    setIsFolderModalOpen(true); // Open the folder creation modal
    setFolderNameModal(''); // Reset folder name input
    setFolderDescriptionModal(''); // Reset folder description input
  };

  const handleSaveFolder = async () => {
    try{
      if (!folderNameModal.trim()) {
        alert("Folder name cannot be empty.");
        return;
      }
      
      const newFolder = {
        name: folderNameModal,
        description: folderDescriptionModal
      };

      const response = await api.createFolder(newFolder); // Call API to create folder
      console.log('Response from createFolder:', response);
      if (response.folder_id) {
        setFolders([...folders, { 
          _id: response.folder_id, 
          name: folderNameModal, 
          description: folderDescriptionModal 
      }]);
      setIsFolderModalOpen(false); // Close the modal
      setFolderNameModal('');
      setFolderDescriptionModal('');
      } 
      else {
        alert("Failed to create folder. Please try again.");
      }
    }
    catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleCancelFolder = () => {
    // Function to handle canceling folder creation
    setIsFolderModalOpen(false); // Close the folder creation modal
    setFolderNameModal(''); // Reset folder name input
    setFolderDescriptionModal(''); // Reset folder description input
  };

  const handleFolderClick = (folderId) => {
    const folderClicked = folders.find(folder => folder._id === folderId);
    navigate("/folder", { state: folderClicked }); // Open note in Cornell template
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
            onClick={handleCreateFolder}
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
              transition: "transform 0.2s, background-color 0.2s",
              marginLeft: "400px"
            }}
          >
            <span style={{ marginRight: "8px" }}>🦕</span> Create New Folder
          </button>

          {isFolderModalOpen && (
            <div className="modal-background">
              <div className="modal-content">
                <h2>Create New Folder</h2>
                <input
                type="text"
                placeholder="Folder Name"
                value={folderNameModal}
                onChange={(e) => setFolderNameModal(e.target.value)}
                />
                <textarea
                placeholder="Folder Description"
                value={folderDescriptionModal}
                onChange={(e) => setFolderDescriptionModal(e.target.value)}
                 ></textarea>
                <button onClick={handleSaveFolder}>Save</button>
               <button onClick={handleCancelFolder}>Cancel</button>
              </div>
            </div>
          )}

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
    
        {/* Search Bar */}
        <div style={{
          marginBottom: "20px",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px #2c3e50"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "97%",
            border: "2px solid #0021A5",
            borderRadius: "50px",
            padding: "5px 15px",
            backgroundColor: "white"
          }}>
            <span style={{ marginRight: "10px", fontSize: "18px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search notes by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                padding: "8px",
                fontSize: "16px"
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredNotes(notes);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px"
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Folders Section */}
        <div style={{
          marginBottom: "30px"
        }}>
          {folders && folders.length > 0 && (
            <div style={{
              marginBottom: "20px"
            }}>
              <h3 style={{
                fontSize: "20px",
                color: "#0021A5",
                fontWeight: "bold"
              }}>
                Your Folders
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px"
              }}>
                {folders.map((folder) => (
                  <div 
                    key={folder._id}
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px #2c3e50",
                      overflow: "hidden",
                      border: "2px solid #17a2b8",
                      cursor: "pointer",
                      padding: "15px",
                      textAlign: "center"
                    }}
                    onClick={() => handleFolderClick(folder._id)}
                  >
                    <h4 style={{ margin: "0", color: "#17a2b8" }}>
                      {folder.name}
                    </h4>
                    <p style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      marginTop: "10px"
                    }}>
                      {folder.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          ) : filteredNotes.length === 0 ? (
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
          ) : (
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Search results count - show when search is active */}
        {searchTerm && filteredNotes.length > 0 && (
          <div style={{ 
            marginTop: "20px", 
            textAlign: "center",
            color: "#1E40AF",
            fontWeight: "bold"
          }}>
            Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>    
  );
};


export default Private;