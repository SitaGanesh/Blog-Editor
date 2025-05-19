// this components deals with authentication ui implementing login, logout and signup parts

// Imports React library.
import React from 'react';
// Imports Link component for navigation from React Router.
import { Link } from 'react-router-dom';
// Imports a helper function to show success toast notifications.
import { showSuccessToast } from '../../../utils/toastHelper';

// Auth component takes authentication status and logout handler as props.
const Auth = ({ isAuthenticated, onLogout }) => {
  // Handles user logout asynchronously.
  const handleLogout = async () => {
    try {
      // Calls onLogout to clear localStorage and update app state.
      onLogout();
      // Shows a success toast message on logout.
      showSuccessToast('Logged out successfully');
    } catch (err) {
      // Logs any error that occurs during logout.
      console.error('Logout error:', err);
      // Ensures client-side logout happens even if server logout fails.
      onLogout();
    }
  };


  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 px-2">
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-sm font-medium text-white bg-[#3E27FF] rounded hover:bg-[#2b1fd9] transition duration-200"
        >
          Logout
        </button>
      ) : (
        <>
          <Link
            to="/login"
            className="px-6 py-2 text-sm font-medium text-[#3E27FF] bg-white border border-[#3E27FF] rounded hover:bg-[#3E27FF] hover:text-white transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 text-sm font-medium text-[#3E27FF] bg-white border border-[#3E27FF] rounded hover:bg-[#3E27FF] hover:text-white transition duration-200"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default Auth;