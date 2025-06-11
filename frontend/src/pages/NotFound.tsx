import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-light mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 