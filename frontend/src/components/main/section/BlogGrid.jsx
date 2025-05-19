// this component shows the raw data of the blogs when user is not login or signup then they will be seeing this kind of grids

import React from 'react'
const placeholderBlogs = [
  {
    hasImage: true,
    imageUrl: '',
    title: 'Mastering React in 30 Days',
    author: 'Ganesh',
    excerpt: 'React is a powerful JavaScript library for building modern UIs. Learn how to master components, hooks, and more...',
  },
  {
    hasImage: false,
    title: 'Why Tailwind CSS is a Game Changer',
    author: 'Ganesh',
    excerpt: 'Tailwind’s utility-first approach changes how you style web apps. Here’s why it works better for modern workflows...',
  },
  {
    hasImage: true,
    imageUrl: '',
    title: 'The Future of JavaScript Frameworks',
    author: 'Ganesh',
    excerpt: 'From React to SolidJS, frameworks are evolving fast. What does the future hold for frontend development?',
  },
  {
    hasImage: false,
    title: 'UI/UX Basics Every Developer Should Know',
    author: 'Ganesh',
    excerpt: 'Good design isn’t just about looks — it’s about clarity and user flow. Learn the principles behind good UI...',
  },
];

const BlogGrid = () => {
  return (
     <div className="p-10 m-5 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {placeholderBlogs.map((blog, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
        >
          {blog.hasImage && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">by {blog.author}</p>
              <p className="text-sm text-gray-700">{blog.excerpt}</p>
            </div>
            <div className="mt-4">
              <button
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogGrid
