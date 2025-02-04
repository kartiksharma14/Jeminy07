import React, { useState } from 'react';
import './ForgotPasswordModal.css'; // Make sure to import the updated CSS
import axios from 'axios';
function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate an API call to reset password
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      if (response.status === 200) {
        alert('Password reset link sent to your email!');
        onClose(); // Close the modal after successful reset request
      } else {
        setError('Failed to send password reset link.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="forgot-password-modal__overlay">
      <div className="forgot-password-modal__content">
        {/* Close icon */}
        <button className="forgot-password-modal__close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Reset Your Password</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="formField">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
