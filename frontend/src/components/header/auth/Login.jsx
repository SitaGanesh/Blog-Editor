// Login credientials and implementation logic part of this 

import React, { useState } from 'react';          // React with useState hook
import { useNavigate } from 'react-router-dom';  // Navigation hook from React Router
import axios from 'axios';                        // HTTP client for API calls
import { showErrorToast } from '../../../utils/toastHelper';   // Show error toast
import { showSuccessToast } from '../../../utils/toastHelper'; // Show success toast

// Login component receives onLogin callback prop.
const Login = ({ onLogin }) => {
  const navigate = useNavigate();                 // Hook to navigate programmatically
  const [form, setForm] = useState({ email: '', password: '' });  // Form state for inputs
  const [isLoading, setIsLoading] = useState(false);              // Loading state

  // Updates form state on input change.
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Handles form submission asynchronously.
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
  // Sends login request with form data to backend.
  const response = await axios.post('http://localhost:5000/auth/login', form);

  // Saves user info, auth status, and token in localStorage.
  localStorage.setItem('user', JSON.stringify(response.data.user));
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('token', response.data.token);

  // Shows success toast message.
  showSuccessToast(response.data.msg || 'Welcome back!');
  // Calls parent onLogin to update auth state.
  onLogin();
  // Navigates to blogs page after login.
  navigate('/blogs');
} catch (err) {
  // Logs any login errors.
  console.error('Login error:', err);
  // Shows error toast with backend message or generic text.
  showErrorToast(
    err.response?.data?.msg || 
    'Login failed. Please check your credentials.'
  );
} finally {
  // Resets loading state regardless of success/failure.
  setIsLoading(false);
}
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#3E27FF]">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E27FF]"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E27FF]"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3E27FF] text-white py-2 rounded hover:bg-[#2b1fd9] transition-colors duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;