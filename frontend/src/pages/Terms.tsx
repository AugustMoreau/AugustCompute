import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="card">
        <p className="mb-4">
          These Terms of Service govern your use of the AugustCompute platform.
        </p>
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using the AugustCompute platform, you agree to be bound by these Terms of Service.
        </p>
        <h2 className="text-xl font-semibold mb-3">2. Use of Services</h2>
        <p className="mb-4">
          AugustCompute provides a decentralized AI model inference platform. You agree to use the services only for lawful purposes and in accordance with these Terms.
        </p>
      </div>
    </div>
  );
};

export default Terms; 