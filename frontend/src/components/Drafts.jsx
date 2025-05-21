// this is the draft component where the blog gets drafted will be implemented with help of this thing

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';
import { getMyBlogs, deleteBlog, publishBlog } from './main/api/Api';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
  if (!token) {
    showErrorToast('Please log in to view drafts'); // Redirect if not logged in
    navigate('/login');
    return;
  }
  setLoading(true);
  getMyBlogs(token) // Fetch user's blogs
    .then(data => {
      setDrafts(data.filter(b => b.status === 'draft')); // Keep only drafts
      setLoading(false);
    })
    .catch(() => {
      showErrorToast('Failed to load drafts'); // Handle fetch error
      setLoading(false);
    });
}, [token, navigate]);

const handleDelete = async (id) => {
  if (!window.confirm('Delete this draft?')) return; // Confirm deletion
  try {
    await deleteBlog(id, token); // Call delete API
    setDrafts(drafts.filter(d => d.id !== id)); // Remove from state
    showSuccessToast('Draft deleted');
  } catch {
    showErrorToast('Failed to delete draft');
  }
};

const handleEdit = (id) => {
  navigate(`/edit-blog/${id}`); // Navigate to edit draft page
};

const handlePublish = async (draft) => {
  try {
    const payload = { id: draft.id, title: draft.title, content: draft.content, tags: draft.tags, status: 'published' }; // Prepare publish data
    await publishBlog(payload, token); // Call publish API
    showSuccessToast('Draft published!');
    setDrafts(drafts.filter(d => d.id !== draft.id)); // Remove published draft
    navigate('/blogs'); // Redirect to blogs list
  } catch {
    showErrorToast('Failed to publish');
  }
};


  if (loading) return <div className="flex justify-center items-center h-64">Loading drafts...</div>;

  if (!drafts.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">No drafts yet.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-2 bg-[#3E27FF] text-white rounded-md hover:bg-[#2E1ED9]"
        >
          Create a Draft
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Drafts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map(d => (
          <div key={d.id} className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 truncate">{d.title || 'Untitled'}</h3>
              <div
                className="text-gray-600 mb-4 overflow-hidden"
                style={{ maxHeight: '100px' }}
                dangerouslySetInnerHTML={{ __html: d.content.substring(0, 150) + '...' }}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {d.tags?.split(',').map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(d.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => handlePublish(d)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drafts;