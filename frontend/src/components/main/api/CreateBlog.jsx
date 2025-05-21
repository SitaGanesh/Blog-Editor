// this component deals with the complete creation of the blog and making the preview look for the blog application 

import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchBlog, saveDraft, publishBlog} from './Api';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../../../utils/toastHelper';
import debounce from 'lodash/debounce';

const CreateBlog = () => {
  const { id } = useParams();                      // Get blog ID from URL params (edit mode)
  const navigate = useNavigate();                   // For navigation after actions
  const [title, setTitle] = useState('');           // Blog title state
  const [content, setContent] = useState('');       // Blog content state
  const [tags, setTags] = useState('');             // Blog tags state
  const [mode, setMode] = useState('edit');         // Edit or preview mode
  const [loading, setLoading] = useState(false);    // Loading indicator
  const [blogId, setBlogId] = useState(id || null); // Store blog ID for updates or new
  const [lastSaved, setLastSaved] = useState({ title: '', content: '', tags: '' }); // Track last saved content to avoid redundant saves
  const quillRef = useRef(null);                     // Ref to ReactQuill editor
  const token = localStorage.getItem('token');      // JWT token for auth
  const THEME_COLOR = '#3E27FF';                     // UI theme color

  // Load blog by ID or resume draft from localStorage on mount or ID/token change
useEffect(() => {
  if (id) {
    setLoading(true);
    fetchBlog(id, token)                             // Fetch blog if ID in URL
      .then((data) => {
        if (data && !data.error) {
          setTitle(data.title || '');                // Set states from fetched data
          setContent(data.content || '');
          setTags(data.tags || '');
          setLastSaved({ title: data.title || '', content: data.content || '', tags: data.tags || '' });
          setBlogId(id);
          localStorage.setItem('draftId', id);       // Save draft ID locally
        } else {
          showErrorToast(data.error || 'Failed to load blog');
          navigate('/blogs');                         // Redirect if error
        }
        setLoading(false);
      })
      .catch(() => {
        showErrorToast('Failed to load blog');
        setLoading(false);
        navigate('/blogs');                           // Redirect on fetch error
      });
  } else {
    const savedDraftId = localStorage.getItem('draftId');
    if (savedDraftId && !id) {
      fetchBlog(savedDraftId, token)                 // Resume saved draft if no ID in URL
        .then((data) => {
          if (data && !data.error && data.status === 'draft') {
            setTitle(data.title || '');
            setContent(data.content || '');
            setTags(data.tags || '');
            setLastSaved({ title: data.title || '', content: data.content || '', tags: data.tags || '' });
            setBlogId(savedDraftId);
          }
        })
        .catch(() => {
          localStorage.removeItem('draftId');        // Remove invalid draft ID
        });
    }
  }
}, [id, token, navigate]);


  // Debounced auto-save to avoid excessive calls
// Replace debouncedAutoSave to use saveDraft
const debouncedAutoSave = useCallback(
  debounce(async () => {
    if (!token || !title.trim() || (title === lastSaved.title && content === lastSaved.content && tags === lastSaved.tags)) return;
    setLoading(true);
    const data = { id: blogId || null, title, content, tags, status: 'draft' };
    try {
      const response = await saveDraft(data, token);
      if (response.error) {
        showErrorToast(response.error);
      } else {
        showSuccessToast('Draft auto-saved');
        setLastSaved({ title, content, tags });
        if (!blogId && response.blog) {
          setBlogId(response.blog);
          localStorage.setItem('draftId', response.blog);
        }
      }
    } catch {
      showErrorToast('Error auto-saving draft');
    } finally {
      setLoading(false);
    }
  }, 5000),
  [title, content, tags, blogId, token, lastSaved]
);

  // Auto-save draft when inputs change, debounce for 5s
useEffect(() => {
  debouncedAutoSave();
  return () => debouncedAutoSave.cancel(); // Cleanup debounce on unmount
}, [title, content, tags, debouncedAutoSave]);

// Insert image URL at cursor position in editor
const handleImageInsert = () => {
  const url = prompt('Enter image URL');
  if (url && quillRef.current) {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection() || { index: 0 };
    editor.insertEmbed(range.index, 'image', url);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title.trim() || !content.trim()) {
    showErrorToast('Title and content are required for publishing');
    return;
  }
  if (!token) {
    showErrorToast('Please log in to publish');
    navigate('/login');
    return;
  }

  setLoading(true);
  const blogData = { id: blogId || null, title, content, tags, status: 'published' };

  try {
    const response = await publishBlog(blogData, token);
    if (response.error) {
      showErrorToast(response.error);
    } else {
      showSuccessToast('Blog published successfully');
      localStorage.removeItem('draftId');
      // Pass the new blog ID via navigation state
      navigate('/blogs', { state: { newBlogId: response.blog } });
    }
  } catch {
    showErrorToast('Error publishing blog');
  } finally {
    setLoading(false);
  }
};


  const handleSaveDraft = async () => {
  if (!title.trim()) {
    showErrorToast('Title is required for draft'); // Validate title
    return;
  }
  if (!token) {
    showErrorToast('Please log in to save draft'); // Check auth
    navigate('/login');
    return;
  }

  setLoading(true);
  const data = { id: blogId || null, title, content, tags, status: 'draft' };

  try {
    const response = await saveDraft(data, token);
    if (response.error) {
      showErrorToast(response.error); // Show API error
    } else {
      showSuccessToast(response.message || 'Draft saved'); // Success message
      setLastSaved({ title, content, tags }); // Update last saved state
      if (!blogId && response.blog) {
        setBlogId(response.blog);              // Set new blog ID if created
        localStorage.setItem('draftId', response.blog); // Persist draft ID
      }
    }
  } catch {
    showErrorToast('Error saving draft'); // Catch unexpected errors
  } finally {
    setLoading(false);
  }
};



const getPreviewContent = () => content || '<p>No content yet</p>'; 
// Return blog content or placeholder if empty

const getFirstImageUrl = () => {
  if (!content) return null; // Return null if no content
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const firstImg = doc.querySelector('img');
  return firstImg ? firstImg.src : null; // Extract first image URL if any
};

const getTagsArray = () => 
  tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
// Convert comma-separated tags string to array, trimming whitespace

if (loading && id) return <div className="flex justify-center items-center h-64">Loading...</div>;
// Show loading UI when fetching existing blog

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{blogId ? 'Edit Blog' : 'Create a New Blog'}</h1>
      <div className="flex justify-center mb-6 gap-4">
        {['edit', 'preview'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md text-white ${mode === m ? '' : 'bg-gray-200 text-black'}`}
            style={{ backgroundColor: mode === m ? THEME_COLOR : '' }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {mode === 'edit' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none"
              style={{ outlineColor: THEME_COLOR }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Content</label>
            <button
              type="button"
              onClick={handleImageInsert}
              className="mb-2 px-4 py-2 bg-gray-200 rounded"
              style={{ color: THEME_COLOR, border: `1px solid ${THEME_COLOR}` }}
            >
              📷 Insert Image
            </button>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Tags (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none"
              style={{ outlineColor: THEME_COLOR }}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react, javascript"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full text-white py-3 px-6 rounded-md hover:brightness-90 disabled:opacity-50"
              style={{ backgroundColor: '#6B7280' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              className="w-full text-white py-3 px-6 rounded-md hover:brightness-90 disabled:opacity-50"
              style={{ backgroundColor: THEME_COLOR }}
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {getFirstImageUrl() && <img src={getFirstImageUrl()} alt="Blog Visual" className="w-full rounded-md" />}
          <h2 className="text-3xl font-bold">{title || 'Untitled Blog'}</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          {tags && (
            <div className="mt-4">
              <h4 className="text-md font-semibold">Tags:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {getTagsArray().map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-sm px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateBlog;