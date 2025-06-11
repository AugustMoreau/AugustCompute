import React from 'react';

// Simple footer component
// TODO: Add social media links and additional site links - JK
// TODO: Consider implementing React Context for theme switching - AT

const Footer: React.FC = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer mt-auto py-3">
      <div className="container">
        <div className="py-2 border-t border-gray-200">
          {/* 
            Footer content removed as per design meeting 6/5
            Will revisit when sitemap is finalized
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 