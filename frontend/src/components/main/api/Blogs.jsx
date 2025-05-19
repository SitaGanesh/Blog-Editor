// this components deals with showing the blog contents after it got published

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from './Api';
import { showSuccessToast, showErrorToast } from '../../../utils/toastHelper';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);          // Store blogs
  const [loading, setLoading] = useState(true);    // Loading state
  const token = localStorage.getItem('token');     // Auth token
  const navigate = useNavigate();                   // Router navigation

  const load = () => {
    setLoading(true);                               // Start loading
    fetchBlogs(token)                               // Fetch blogs from API
      .then(data => {
        setBlogs(data);                             // Save blogs to state
        setLoading(false);                          // End loading
      })
      .catch(() => {
        showErrorToast('Failed to load blogs');    // Show error toast
        setLoading(false);                          // End loading even on error
      });
  };


  useEffect(() => {
    load();  // Load blogs on component mount
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return; // Confirm deletion
    try {
      await deleteBlog(id, token);          // Call API to delete blog
      showSuccessToast('Blog deleted successfully');  // Notify success
      load();                              // Reload blogs after deletion
    } catch {
      showErrorToast('Failed to delete blog');  // Notify error
    }
  };

  const handleEdit = (id) => {
    navigate(`/blog/${id}`);  // Navigate to blog edit page
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading blogs...</div>;  // Loading state UI

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Blogs</h1>
      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No blogs available yet</p>
          {token && (
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-2 bg-[#3E27FF] text-white rounded-md hover:bg-[#2E1ED9]"
            >
              Create Your First Blog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 truncate">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-2">By {blog.author}</p>
                <div
                  className="text-gray-600 mb-4 overflow-hidden"
                  style={{ maxHeight: '100px' }}
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}
                />
                {blog.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {token && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(blog.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;