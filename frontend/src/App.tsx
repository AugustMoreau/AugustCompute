import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Compute from './pages/Compute';
import ComputeDetails from './pages/ComputeDetails';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  // Add global SVG size fix styles directly to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      svg {
        width: 20px !important;
        height: 20px !important;
        min-width: 0 !important;
        min-height: 0 !important;
        max-width: 20px !important;
        max-height: 20px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Web3Provider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compute" element={<Compute />} />
            <Route path="/compute/:id" element={<ComputeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Web3Provider>
  );
};

export default App; 