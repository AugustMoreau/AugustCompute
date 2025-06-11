import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h1>
      <div className="card">
        <p className="mb-4">
          Have questions or need assistance? Get in touch with our team.
        </p>
        <form className="space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" className="form-input" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" className="form-input" placeholder="Your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea id="message" className="form-input" rows={4} placeholder="Your message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 