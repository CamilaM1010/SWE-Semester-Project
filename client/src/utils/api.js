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
  getNotes: () => request('/api/notes'),
  createNote: (noteData) => request('/api/notes', 'POST', noteData),
  updateNote: (id, noteData) => request(`/api/notes/${id}`, 'PUT', noteData),
  deleteNote: (id) => request(`/api/notes/${id}`, 'DELETE'),
  
  // User profile
  getProfile: () => request('/api/profile'),
  updateProfile: (profileData) => request('/api/profile', 'PUT', profileData),
};

export default api;