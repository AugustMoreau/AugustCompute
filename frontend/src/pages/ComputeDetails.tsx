import React from 'react';
import { useParams } from 'react-router-dom';

const ComputeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Compute Details</h1>
      <div className="card">
        <p className="mb-4">
          Viewing details for compute resource ID: {id}
        </p>
      </div>
    </div>
  );
};

export default ComputeDetails; 