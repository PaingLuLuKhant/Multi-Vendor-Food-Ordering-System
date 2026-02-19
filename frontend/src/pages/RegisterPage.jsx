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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        // eslint-disable-next-line no-undef
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.acceptTerms)
            newErrors.acceptTerms = 'You must accept the terms';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const result = await register({ ...formData });
            if (result.success) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                setErrors({ general: result.error || 'Registration failed' });
            }
        } catch (err) {
            setErrors({ general: 'Registration failed' });
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
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">Phone Number *</label>
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
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="form-row address-row">
                            <div className="form-group">
                                <label htmlFor="address" className="form-label">Delivery Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`form-input textarea-input ${errors.address ? 'error' : ''}`}
                                    placeholder="Enter your complete delivery address"
                                    rows="3"
                                    disabled={isLoading}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
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
                                        placeholder="At least 6 characters with letters and numbers"
                                        disabled={isLoading}
                                    />
                                    <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    >
                                    <img
                                        src={showPassword ? "/icons/eye_open.png" : "/icons/eye_closed.png"}
                                        alt="toggle password"
                                        className="eye-icon"
                                    />
                                    </button>

                                </div>
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
                                    className={`form-input password-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    disabled={isLoading}
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
                                    I agree to the <Link to="/terms" className="terms-link">Terms</Link> and <Link to="/privacy" className="terms-link">Privacy</Link> *
                                </span>
                            </label>
                            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
                        </div>

                        <button type="submit" className="register-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="login-link">
                            <p>Already have an account? <Link to="/login" className="link">Sign in here</Link></p>
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
