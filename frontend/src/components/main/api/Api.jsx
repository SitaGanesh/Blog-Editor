// this components deals with all the endpoints which are required to integrate between frontend and backend data

// Base API URL
const API_URL = 'http://localhost:5000';

// Handles fetch response
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      console.log('Server error response:', { status: response.status, data }); // Log status and data
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
  } else {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return { message: 'Success' };
  }
};


export const fetchBlogs = async (token) => {
  try {
    // Set Authorization header if token exists
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log('Fetching blogs with headers:', headers);
    // Fetch blogs from API
    const response = await fetch(`${API_URL}/api/blogs`, {
      headers// Include cookies if needed
    });
    // Log and parse raw text response
    const text = await response.text();
    console.log('Raw response:', text);
    const data = JSON.parse(text);
    console.log('Fetched blogs:', data);
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
      headers
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
    if (!token) throw new Error('Authentication required');
    console.log('Token sent to /save-draft:', token); // Log the token
    const response = await fetch(`${API_URL}/api/blogs/save-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};



export const publishBlog = async (data, token) => {
  try {
    if (!token) throw new Error('Authentication required');
    console.log('Token sent to /publish:', token); // Log the token
    const response = await fetch(`${API_URL}/api/blogs/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await handleResponse(response);
    console.log('Publish response:', result);
    return result;
  } catch (error) {
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
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Handle and return API response
    return handleResponse(response);
  } catch (error) {
    // Log and propagate errors
    console.error('Error fetching my blogs:', error);
    throw error;
  }
};
