import React, { useState } from 'react'; // React core + hook for local state
import { useNavigate } from 'react-router-dom'; // Hook to programmatically navigate
import axios from 'axios'; // HTTP client for API calls
import { showErrorToast, showSuccessToast } from '../../../utils/toastHelper'; // Toast notifications

const Signup = () => {
  // Provides navigation ability
  const navigate = useNavigate();

  // Holds input field values
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  // Indicates loading state during signup
  const [isLoading, setIsLoading] = useState(false);

  // Updates form state when input fields change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Handles form submission logic
  const handleSubmit = async e => {
    e.preventDefault();

    // Check if passwords match before proceeding
    if (form.password !== form.confirmPassword) {
      showErrorToast('Passwords do not match'); // Show error if mismatch
      return; // Stop form submission
    }

    setIsLoading(true); // Show loading indicator while signup is processing

    try {
      // Send signup data to backend API
      const response = await axios.post('http://localhost:5000/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password
      });

      // Show success message
      showSuccessToast(response.data.msg || 'Signup successful! Please login.');

      // Store token for session management (optional here since redirecting to login)
      localStorage.setItem('token', response.data.token);

      // Redirect to login page
      navigate('/login');

    } catch (err) {
      console.error('Signup error:', err); // Log error in console

      // Show appropriate error message from backend or fallback
      showErrorToast(
        err.response?.data?.msg ||
        'Signup failed. Please try again.'
      );

    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  }

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#3E27FF]">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E27FF]"
          value={form.username}
          onChange={handleChange}
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E27FF]"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3E27FF] text-white py-2 rounded hover:bg-[#2b1fd9] transition-colors duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;