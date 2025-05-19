import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import All from './components/All';
import Blogs from './components/main/api/Blogs';
import CreateBlog from './components/main/api/CreateBlog';
import Login from './components/header/auth/Login';
import Signup from './components/header/auth/Signup';
import Header from './components/header/Header';
import Drafts from './components/Drafts';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      toast.error('Please login to access this page', { autoClose: 3000 });
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <Routes>
        <Route path="/" element={<All />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/api/blogs" element={<Blogs />} />
        <Route path="/blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/api/blogs/save-draft" element={<Drafts />} />
      </Routes>
    </>
  );
}

export default App;