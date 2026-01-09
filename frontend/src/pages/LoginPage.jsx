import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call authentication context
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Save remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        
        // Redirect to intended page or home
        navigate(from, { replace: true });
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Simulate social login
    console.log(`Logging in with ${provider}`);
    // In a real app, this would redirect to OAuth provider
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      customer: { email: 'customer@demo.com', password: 'demo123' },
      vendor: { email: 'vendor@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };
    
    setFormData({
      email: demoCredentials[role].email,
      password: demoCredentials[role].password,
      rememberMe: false
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Illustration/Info */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">🛒</div>
            <h1>POS Marketplace</h1>
            <p className="brand-tagline">Discover amazing shops and order with ease</p>
          </div>
          
          <div className="login-features">
            <div className="feature">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <h3>Fast Delivery</h3>
                <p>Get your orders delivered in minutes</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h3>Secure Payments</h3>
                <p>100% secure and encrypted transactions</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">⭐</div>
              <div className="feature-text">
                <h3>Top-rated Shops</h3>
                <p>Shop from the best local businesses</p>
              </div>
            </div>
          </div>
          
          <div className="login-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Shops</span>
            </div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>
            
            {errors.general && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{errors.general}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
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
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
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
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-password"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <div className="divider">
                <span>or continue with</span>
              </div>
              
              <div className="social-login">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="social-btn google"
                  disabled={isLoading}
                >
                  <span className="social-icon">G</span>
                  Google
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="social-btn facebook"
                  disabled={isLoading}
                >
                  <span className="social-icon">f</span>
                  Facebook
                </button>
              </div>
              
              <div className="demo-login">
                <p className="demo-text">Try demo accounts:</p>
                <div className="demo-buttons">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="demo-btn customer"
                    disabled={isLoading}
                  >
                    Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('vendor')}
                    className="demo-btn vendor"
                    disabled={isLoading}
                  >
                    Vendor Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="demo-btn admin"
                    disabled={isLoading}
                  >
                    Admin Demo
                  </button>
                </div>
              </div>
              
              <div className="signup-link">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="link">
                    Sign up now
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="login-footer">
            <p>By continuing, you agree to our</p>
            <div className="footer-links">
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              <span className="separator">•</span>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <span className="separator">•</span>
              <Link to="/cookies" className="footer-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;