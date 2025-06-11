import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

// Main navigation component
// Last updated: May 28 by Chris
const Navbar: React.FC = () => {
  // Local state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Helper to determine active link - might need to enhance this later
  // TODO: Make this handle nested routes better
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand and logo - left side */}
        <Link to="/" className="navbar-brand">
          <Logo size="sm" />
        </Link>
        
        {/* Hamburger button for mobile */}
        <button 
          className="md:hidden btn btn-outline py-1 px-2"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
        
        {/* Desktop navigation links - only visible on md+ screens */}
        <ul className="navbar-nav hidden md:flex">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/compute" className={`nav-link ${isActive('/compute')}`}>
              Compute
            </Link>
          </li>
          {/* External link - opens in new tab */}
          <li className="nav-item">
            <a 
              href="https://docs.augustcompute.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              Docs
            </a>
          </li>
          {/* TODO: Replace with actual wallet connect logic when backend is ready */}
          <li className="nav-item">
            <Link to="/login" className="btn btn-primary">
              Connect Wallet
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Mobile menu dropdown - only visible when menu is open */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container">
            <ul className="space-y-2 py-2">
              <li>
                <Link 
                  to="/" 
                  className={`block py-2 px-4 rounded ${isActive('/') ? 'bg-primary text-white' : 'text-light hover:bg-surface'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`block py-2 px-4 rounded ${isActive('/dashboard') ? 'bg-primary text-white' : 'text-light hover:bg-surface'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/compute" 
                  className={`block py-2 px-4 rounded ${isActive('/compute') ? 'bg-primary text-white' : 'text-light hover:bg-surface'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Compute
                </Link>
              </li>
              <li>
                <a 
                  href="https://docs.augustcompute.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block py-2 px-4 rounded text-light hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Docs
                </a>
              </li>
              <li className="pt-2">
                <Link 
                  to="/login" 
                  className="block w-full btn btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connect Wallet
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 