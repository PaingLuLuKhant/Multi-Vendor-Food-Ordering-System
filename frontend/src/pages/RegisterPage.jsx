import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'customer',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional but recommended)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare complete user data for registration
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || '',
        address: formData.address.trim(),
        role: formData.role,
        // Generate avatar from name
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim())}&background=4f46e5&color=ffffff&size=128`,
        // Add timestamp for joined date
        joinedDate: new Date().toISOString(),
        // Additional default fields
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to home or profile page
        navigate('/login', { 
          state: { 
            welcomeMessage: 'Welcome to POS Marketplace! Your account has been created successfully.' 
          } 
        });
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join thousands of happy customers</p>
          </div>
          
          {errors.general && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">{errors.general}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>
            </div>
            
            {/* NEW: Address Field */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Enter your complete delivery address (street, city, zip code)"
                  rows="3"
                  disabled={isLoading}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="customer">Customer Account</option>
                  <option value="vendor">Vendor Account</option>
                </select>
                <p className="form-hint">
                  {formData.role === 'customer' 
                    ? 'Customer: Browse and order from shops' 
                    : 'Vendor: Create and manage your own shop'}
                </p>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="At least 6 characters with letters and numbers"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
                <div className="password-hints">
                  <span className={`hint ${formData.password.length >= 6 ? 'valid' : ''}`}>
                    • At least 6 characters
                  </span>
                  <span className={`hint ${/(?=.*[A-Za-z])/.test(formData.password) ? 'valid' : ''}`}>
                    • At least one letter
                  </span>
                  <span className={`hint ${/(?=.*\d)/.test(formData.password) ? 'valid' : ''}`}>
                    • At least one number
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
            
            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.acceptTerms ? 'error' : ''}
                />
                <span className="checkbox-text">
                  I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link> *
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="error-message">{errors.acceptTerms}</span>
              )}
            </div>
            
            <button
              type="submit"
              className="register-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="login-link">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="link">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
          
          <div className="register-footer">
            <p>By creating an account, you agree to our</p>
            <div className="footer-links">
              <Link to="/terms" className="footer-link">Terms</Link>
              <span className="separator">•</span>
              <Link to="/privacy" className="footer-link">Privacy</Link>
              <span className="separator">•</span>
              <Link to="/cookies" className="footer-link">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;