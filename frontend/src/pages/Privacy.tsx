import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="card">
        <p className="mb-4">
          This Privacy Policy explains how AugustCompute collects, uses, and protects your information.
        </p>
        <h2 className="text-xl font-semibold mb-3">1. Information Collection</h2>
        <p className="mb-4">
          We collect information necessary to provide our services, including wallet addresses and transaction data.
        </p>
        <h2 className="text-xl font-semibold mb-3">2. Use of Information</h2>
        <p className="mb-4">
          We use your information to provide, maintain, and improve our services, and to communicate with you about your account.
        </p>
      </div>
    </div>
  );
};

export default Privacy; 