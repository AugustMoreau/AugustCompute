import React from 'react';
import { Link } from 'react-router-dom';

// TODO: Consider splitting these sections into separate components if we add more content
// Started: 5/12 - Alex
const Home: React.FC = () => {
  // Feature data could be moved to a separate file later
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>,
      title: "High Performance",
      description: "Leverage distributed computing resources for fast and efficient model inference."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your data and models remain secure and private."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>,
      title: "Cost Effective",
      description: "Pay only for the compute resources you use with transparent pricing."
    }
  ];
  
  // These could be fetched from an API in the future
  const howItWorksSteps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Link your wallet to access the platform and manage your resources."
    },
    {
      number: "02",
      title: "Deploy Your Model",
      description: "Upload your model or select from our marketplace of pre-trained models."
    },
    {
      number: "03",
      title: "Run Inference",
      description: "Start running inference on your data using our distributed compute network."
    }
  ];
  
  return (
    <div className="bg-surface">
      {/* Hero Section - Updated 6/2 */}
      <section className="py-6 md:py-12">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Decentralized Compute Platform
              </h1>
              <p className="text-light text-lg mb-6 mx-auto" style={{ maxWidth: '700px' }}>
                {/* FIXME: Marketing wants to revisit this copy before launch */}
                AugustCompute enables decentralized model inference using distributed compute resources. Run models efficiently and affordably.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/dashboard" className="btn btn-primary">
                  Get Started
                </Link>
                <a href="https://docs.augustcompute.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - refactored to use data mapping for easier maintenance */}
      <section className="py-6 md:py-12 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Key Features</h2>
            <p className="text-light mx-auto" style={{ maxWidth: '700px' }}>
              AugustCompute provides a robust platform for decentralized computing with powerful features.
            </p>
          </div>

          <div className="row">
            {features.map((feature, idx) => (
              <div className="col-12 md:col-4 mb-6" key={`feature-${idx}`}>
                <div className="card h-full">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - using data array for future-proofing */}
      <section className="py-6 md:py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-light mx-auto" style={{ maxWidth: '700px' }}>
              AugustCompute makes it easy to deploy and run models in a decentralized environment.
            </p>
          </div>

          <div className="row">
            {howItWorksSteps.map((step, idx) => (
              <div className="col-12 md:col-4 mb-6" key={`step-${idx}`}>
                <div className="card h-full">
                  <div className="text-primary text-2xl font-bold mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 