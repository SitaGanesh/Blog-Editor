// every header components will be embedded in this header component

import React from 'react';
import NavLinks from './nav/NavLinks'; // Navigation links component
import Auth from './auth/Auth'; // Auth status display (login/logout)


const Header = ({ isAuthenticated, onLogout }) => (
  // Header layout with navigation and auth controls
  <header className="w-full bg-white px-4 py-3 shadow-sm mb-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="text-xl font-bold text-[#3E27FF]">MyBlog</div>
      <NavLinks />
      <Auth isAuthenticated={isAuthenticated} onLogout={onLogout} />
    </div>
  </header>
);

export default Header;