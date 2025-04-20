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
    const response = await fetch(`${API_BASE_URL}/api/notes/`, {
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

  generateQuiz: async (noteIds, quizType) => {
    const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // to include session cookie
      body: JSON.stringify({
        note_ids: noteIds,
        quiz_type: quizType
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate quiz');
    }

    return data;
  },
  
  // User profile
  getProfile: () => request('/api/profile'),
  updateProfile: (profileData) => request('/api/profile', 'PUT', profileData),
};

export default api;