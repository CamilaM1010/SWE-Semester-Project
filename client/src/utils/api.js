// Base API URL
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

// Generic request function
const request = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // For 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }
    
    const responseData = await response.json();
    
    return {
      success: response.ok,
      data: responseData,
      status: response.status
    };
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

// API functions
export const api = {
  // Notes
  getNotes: async () => {
    const response = await fetch(`${API_BASE_URL}/api/notes`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  getNote: (id) => request(`/api/notes/${id}`),

  createNote: async (noteData) => {
    const response = await fetch("/api/notes/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  updateNote: async (noteId, updatedNote) => {
    if (!noteId) throw new Error("Note ID is undefined");  // Add this check
    const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedNote),
    });
    if (!response.ok) throw new Error("Failed to update note");
    return response.json();
  },

  deleteNote: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },
  
  // User profile
  getProfile: () => request('/api/profile'),
  updateProfile: (profileData) => request('/api/profile', 'PUT', profileData),

  // Folders
  getFolders: async() => {
    const response = await fetch(`${API_BASE_URL}/api/folders`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch folders');
    return response.json();
  },

  getFolder: (id) => request(`/api/folders/${id}`),

  createFolder: async (folderData) => {
    const response = await fetch("/api/folders/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(folderData),
    });
    if (!response.ok) throw new Error('Failed to create folder');
    return response.json();
  },

  updateFolder: async (folderId, updatedFolder) => {
    if (!folderId) throw new Error("Folder ID is undefined");  // Add this check
    const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedFolder),
    });
    if (!response.ok) throw new Error("Failed to update folder");
    return response.json();
  },

  deleteFolder: async (folderId) => {
    const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete folder');
    return response.json();
  },

  moveNoteToFolder: async (folderId, noteId) => {
    const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}/notes/${noteId}/move`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to move note in folder');
    return response.json();
  },

  moveNoteOutAllFolder: async (noteId) => {
    const response = await fetch(`${API_BASE_URL}/api/folders/notes/${noteId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

      if (!response.ok) throw new Error('Failed to move note in folder');
      return response.json();
  },

  moveNoteOutOneFolder: async (folderId, noteId) => {
    const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}/notes/${noteId}/remove`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to move note out of folder');
    return response.json();
  },

};

export default api;