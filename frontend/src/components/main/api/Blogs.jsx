import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from './Api';
import { showSuccessToast, showErrorToast } from '../../../utils/toastHelper';

// Helper to extract the first image URL from HTML content
const getFirstImageUrl = (html) => {
  if (!html) return null;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const img = doc.querySelector('img');
  return img ? img.src : null;
};

// Helper to strip all <img> tags from HTML
const stripImageTags = (html) => {
  if (!html) return '';
  return html.replace(/<img[^>]*>/gi, '');
};

const getTextSnippet = (html, maxLength = 150) => {
  const noImgs = stripImageTags(html);
  // Strip all other HTML tags for a clean snippet (optional, but recommended)
  const div = document.createElement('div');
  div.innerHTML = noImgs;
  const textOnly = div.textContent || div.innerText || '';
  return textOnly.length > maxLength
    ? textOnly.substring(0, maxLength) + '...'
    : textOnly;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs(token);
      setBlogs(data);
    } catch {
      showErrorToast('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (location.state?.newBlogId) {
      console.log('New blog published with ID:', location.state.newBlogId);
      // Optionally scroll to or highlight the new blog
    }
  }, [location.pathname, location.state]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await deleteBlog(id, token);
      showSuccessToast('Blog deleted successfully');
      load();
    } catch {
      showErrorToast('Failed to delete blog');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading blogs...</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Blogs</h1>
      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No blogs available yet</p>
          {token && (
            <button
              onClick={() => navigate('/create-blog')}
              className="px-6 py-2 bg-[#3E27FF] text-white rounded-md hover:bg-[#2E1ED9]"
            >
              Create Your First Blog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const firstImageUrl = getFirstImageUrl(blog.content);
            return (
              <div
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 truncate">{blog.title}</h3>
                  {firstImageUrl && (
                    <img
                      src={firstImageUrl}
                      alt="Blog"
                      className="w-full h-48 object-cover rounded mb-3"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <p className="text-sm text-gray-500 mb-2">By {blog.author}</p>
                  <div className="text-gray-600 mb-4 overflow-hidden" style={{ maxHeight: '100px' }}>
                    {getTextSnippet(blog.content)}
                  </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blogs;