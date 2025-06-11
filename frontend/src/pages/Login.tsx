import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Connect Wallet</h1>
        <div className="card">
          <p className="mb-4 text-center">
            Connect your wallet to access the AugustCompute platform.
          </p>
          <button className="btn btn-primary w-full">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 