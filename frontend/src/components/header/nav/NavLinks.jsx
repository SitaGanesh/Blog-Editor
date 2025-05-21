import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ mobile = false, onClick }) => {
  return (
    <nav className={`${mobile ? 'flex flex-col space-y-3' : 'hidden md:flex items-center space-x-6'}`}>
      <Link to="/" onClick={onClick} className="text-gray-600 hover:text-[#3E27FF]">Home</Link>
      <Link to="/blogs" onClick={onClick} className="text-gray-600 hover:text-[#3E27FF]">Blogs</Link>
      <Link to="/create-blog" onClick={onClick} className="text-gray-600 hover:text-[#3E27FF]">Create Blog</Link>
      <Link to="/drafts" onClick={onClick} className="text-gray-600 hover:text-[#3E27FF]">Drafts</Link>
    </nav>
  );
};

export default NavLinks;