import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css'; // your full CSS

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'customer',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        message: ''
    });

    // Add email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Strong password validation function
    const checkPasswordStrength = (password) => {
        const strength = {
            score: 0,
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
            message: ''
        };

        // Calculate score
        if (strength.hasMinLength) strength.score++;
        if (strength.hasUpperCase) strength.score++;
        if (strength.hasLowerCase) strength.score++;
        if (strength.hasNumber) strength.score++;
        if (strength.hasSpecialChar) strength.score++;

        // Set message based on score
        if (password.length === 0) {
            strength.message = '';
        } else if (strength.score < 3) {
            strength.message = 'Weak password';
        } else if (strength.score < 4) {
            strength.message = 'Medium password';
        } else if (strength.score < 5) {
            strength.message = 'Strong password';
        } else {
            strength.message = 'Very strong password';
        }

        return strength;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Check password strength when password field changes
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name?.trim()) {
            newErrors.name = 'Full Name is required';
        }
        
        // Email validation
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Enhanced password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const strength = checkPasswordStrength(formData.password);
            if (!strength.hasMinLength) {
                newErrors.password = 'Password must be at least 8 characters long';
            } else if (!strength.hasUpperCase) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            } else if (!strength.hasLowerCase) {
                newErrors.password = 'Password must contain at least one lowercase letter';
            } else if (!strength.hasNumber) {
                newErrors.password = 'Password must contain at least one number';
            } else if (!strength.hasSpecialChar) {
                newErrors.password = 'Password must contain at least one special character (!@#$%^&* etc.)';
            }
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        // Terms validation
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsLoading(true);
        try {
            // Prepare data for API - remove confirmPassword as it's not needed for backend
            const { confirmPassword, acceptTerms, ...registrationData } = formData;
            
            console.log('Submitting registration data:', registrationData); // Debug log
            
            const result = await register(registrationData);
            
            if (result?.success) {
                alert('Registration successful!');
                navigate('/login', { state: { message: 'Registration successful! Please login.' } });
            } else {
                setErrors({ 
                    general: result?.error || 'Registration failed. Please try again.' 
                });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setErrors({ 
                general: err.response?.data?.message || 'Registration failed. Please check your connection and try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Get password strength color
    const getStrengthColor = () => {
        if (formData.password.length === 0) return '#e0e0e0';
        if (passwordStrength.score < 3) return '#ff4444';
        if (passwordStrength.score < 4) return '#ffbb33';
        if (passwordStrength.score < 5) return '#00C851';
        return '#007E33';
    };

    // Get strength width percentage
    const getStrengthWidth = () => {
        return `${(passwordStrength.score / 5) * 100}%`;
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

                    <form onSubmit={handleSubmit} className="register-form" noValidate>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="John Doe"
                                    disabled={isLoading}
                                    autoComplete="name"
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address *</label>
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
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-row role-row">
                            <div className="form-group">
                                <label className="form-label">Account Type</label>
                                <input
                                    type="text"
                                    value="Customer Account"
                                    className="form-input"
                                    disabled
                                />
                                <input type="hidden" name="role" value="customer" />
                            </div>
                        </div>

                        <div className="form-row password-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password *</label>
                                <div className="password-input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`form-input password-input ${errors.password ? 'error' : ''}`}
                                        placeholder="Create a strong password"
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <img
                                            src={showPassword ? "/icons/eye_open.png" : "/icons/eye_closed.png"}
                                            alt={showPassword ? 'Hide password' : 'Show password'}
                                            className="eye-icon"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = ''; // Fallback if image fails to load
                                            }}
                                        />
                                    </button>
                                </div>
                                
                                {/* Password strength meter */}
                                {formData.password.length > 0 && (
                                    <div className="password-strength">
                                        <div className="strength-meter">
                                            <div 
                                                className="strength-meter-fill" 
                                                style={{ 
                                                    width: getStrengthWidth(),
                                                    backgroundColor: getStrengthColor()
                                                }}
                                            />
                                        </div>
                                        <span 
                                            className="strength-text"
                                            style={{ color: getStrengthColor() }}
                                        >
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Password requirements checklist */}
                                {formData.password.length > 0 && (
                                    <div className="password-requirements">
                                        <p className="requirements-title">Password must contain:</p>
                                        <ul className="requirements-list">
                                            <li className={passwordStrength.hasMinLength ? 'valid' : 'invalid'}>
                                                <span className="requirement-icon">
                                                    {passwordStrength.hasMinLength ? '✓' : '○'}
                                                </span>
                                                At least 8 characters
                                            </li>
                                            <li className={passwordStrength.hasUpperCase ? 'valid' : 'invalid'}>
                                                <span className="requirement-icon">
                                                    {passwordStrength.hasUpperCase ? '✓' : '○'}
                                                </span>
                                                One uppercase letter
                                            </li>
                                            <li className={passwordStrength.hasLowerCase ? 'valid' : 'invalid'}>
                                                <span className="requirement-icon">
                                                    {passwordStrength.hasLowerCase ? '✓' : '○'}
                                                </span>
                                                One lowercase letter
                                            </li>
                                            <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                                                <span className="requirement-icon">
                                                    {passwordStrength.hasNumber ? '✓' : '○'}
                                                </span>
                                                One number
                                            </li>
                                            <li className={passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}>
                                                <span className="requirement-icon">
                                                    {passwordStrength.hasSpecialChar ? '✓' : '○'}
                                                </span>
                                                One special character (!@#$%^&*)
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
                                    I agree to the <Link to="/terms" className="terms-link" target="_blank">Terms</Link> and <Link to="/privacy" className="terms-link" target="_blank">Privacy</Link> *
                                </span>
                            </label>
                            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="register-btn" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="login-link">
                            <p>Already have an account? <Link to="/login" className="link">Sign in here</Link></p>
                        </div>
                    </form>

                    {/* <div className="register-footer">
                        <p>By creating an account, you agree to our</p>
                        <div className="footer-links">
                            <Link to="/terms" className="footer-link" target="_blank">Terms</Link>
                            <span className="separator">•</span>
                            <Link to="/privacy" className="footer-link" target="_blank">Privacy</Link>
                            <span className="separator">•</span>
                            <Link to="/cookies" className="footer-link" target="_blank">Cookies</Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;