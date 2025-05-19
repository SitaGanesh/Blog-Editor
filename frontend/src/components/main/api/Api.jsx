// this components deals with all the endpoints which are required to integrate between frontend and backend data

// Base API URL
const API_URL = 'http://localhost:5000';

// Handles fetch response
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  // If response is JSON
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      // Throw error from JSON response
      throw new Error(data.error || 'Something went wrong');
    }
    return data; // Return parsed JSON
  } else {
    // Handle non-JSON responses (e.g. plain text or HTML)
    if (!response.ok) {
      throw new Error('Server error: ' + response.status);
    }
    return { message: 'Success' }; // Fallback success response
  }
};


export const fetchBlogs = async (token) => {
  try {
    // Set Authorization header if token exists
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    // Fetch blogs from API
    const response = await fetch(`${API_URL}/api/blogs`, {
      headers,
      credentials: 'include' // Include cookies if needed
    });

    // Log and parse raw text response
    const text = await response.text();
    console.log('Raw response:', text);
    const data = JSON.parse(text);

    // Handle unauthorized response
    if (!response.ok) {
      if (response.status === 401) {
        // Clear local auth info on 401
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`Error ${response.status}`);
    }

    // Ensure returned data is an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Log and return empty list on error
    console.error('Error fetching blogs:', error);
    return [];
  }
};


export const fetchBlog = async (id, token) => {
  try {
    // Return empty blog if no ID is provided
    if (!id) return { title: '', content: '', tags: '' };

    // Set Authorization header if token is available
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    // Fetch the blog by ID from the API
    const response = await fetch(`${API_URL}/api/blogs/${id}`, {
      headers,
      credentials: 'include' // Include credentials if needed
    });

    // Handle and return parsed response
    return handleResponse(response);
  } catch (error) {
    // Log and rethrow error
    console.error(`Error fetching blog ${id}:`, error);
    throw error;
  }
};


export const saveDraft = async (data, token) => {
  try {
    // Ensure the user is authenticated
    if (!token) throw new Error('Authentication required');

    // Send POST request to save or update the draft
    const response = await fetch(`${API_URL}/api/blogs/save-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(data) // Send blog data in request body
    });

    // Parse and return the response
    return handleResponse(response);
  } catch (error) {
    // Log and rethrow any errors
    console.error('Error saving draft:', error);
    throw error;
  }
};


export const autoSaveDraft = async (data, token) => {
  try {
    // Check for authentication
    if (!token) throw new Error('Authentication required');

    // Send draft data to the backend for auto-saving
    const response = await fetch(`${API_URL}/api/blogs/save-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(data) // Blog content to save
    });

    // Handle and return server response
    return handleResponse(response);
  } catch (error) {
    // Log any errors during auto-save
    console.error('Error auto-saving draft:', error);
    throw error;
  }
};

export const publishBlog = async (data, token) => {
  try {
    // Ensure user is authenticated
    if (!token) throw new Error('Authentication required');

    // Send blog data to backend to publish
    const response = await fetch(`${API_URL}/api/blogs/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(data) // Blog details to publish
    });

    // Process and return response from server
    return handleResponse(response);
  } catch (error) {
    // Log and rethrow any error encountered
    console.error('Error publishing blog:', error);
    throw error;
  }
};


export const deleteBlog = async (id, token) => {
  try {
    // Require auth token
    if (!token) throw new Error('Authentication required');

    // Call DELETE API for blog by ID
    const response = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });

    // Handle and return API response
    return handleResponse(response);
  } catch (error) {
    // Log and propagate errors
    console.error(`Error deleting blog ${id}:`, error);
    throw error;
  }
};


export const getMyBlogs = async (token) => {
  try {
    // Require auth token
    if (!token) throw new Error('Authentication required');

    // Fetch blogs belonging to current user
    const response = await fetch(`${API_URL}/api/blogs/my`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });

    // Handle and return API response
    return handleResponse(response);
  } catch (error) {
    // Log and propagate errors
    console.error('Error fetching my blogs:', error);
    throw error;
  }
};
