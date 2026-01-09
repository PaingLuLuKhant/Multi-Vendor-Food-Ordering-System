import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send a password reset email
      console.log('Password reset requested for:', email);
      
      setIsSubmitted(true);
      setError('');
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          {isSubmitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h1>Check Your Email</h1>
              <p>
                We've sent password reset instructions to:
                <br />
                <strong>{email}</strong>
              </p>
              <p className="instruction">
                Please check your inbox and follow the link to reset your password.
              </p>
              <div className="actions">
                <button
                  onClick={() => navigate('/login')}
                  className="back-to-login-btn"
                >
                  Back to Login
                </button>
                <p className="resend-text">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="resend-link"
                  >
                    Click to resend
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="forgot-password-header">
                <h1>Forgot Password?</h1>
                <p>Enter your email to reset your password</p>
              </div>
              
              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  className="reset-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
                
                <div className="back-to-login">
                  <Link to="/login" className="back-link">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;