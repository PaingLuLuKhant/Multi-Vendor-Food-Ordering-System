import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import { isValidEmail } from '../../utils/validators';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); 

    const from = location.state?.from?.pathname || '/';

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        setLoginError(''); // Clear any previous login error when form is being validated
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear field-specific error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear login error when user starts typing
        if (loginError) {
            setLoginError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setLoginError(''); // Clear any previous login error

        try {
            const success = await login(formData.email, formData.password);

            console.log("LOGIN SUCCESS:", success);
            console.log("TOKEN IN STORAGE:", localStorage.getItem("token"));

            if (success) {
                navigate(from, { replace: true });
            } else {
                // If login returns false but no error thrown
                setLoginError('Invalid email or password');
            }
        } catch (err) {
            console.error("Login error:", err);
            
            // Always show "Invalid email or password" for any authentication error
            // This provides better security by not revealing whether email exists or not
            setLoginError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Logging in with ${provider}`);
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
        setLoginError(''); // Clear any error when demo credentials are filled
    };
    
    return (
        <div className="login-page">
            <div className="login-container">
                {/* Right Side */}
                <div className="login-right">
                    <div className="login-form-container">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to your account to continue</p>
                        </div>

                        {/* Login Error Message - Now always shows for any authentication failure */}
                        {loginError && (
                            <div className="login-error">
                                {loginError}
                            </div>
                        )}

                        {/* Keep this for backward compatibility or remove if not needed */}
                        {errors.general && !loginError && (
                            <div className="login-error">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.email || loginError ? 'error' : ''}`}
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors.password || loginError ? 'error' : ''}`}
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
                                        <img
                                            src={showPassword ? "/icons/eye_open.png" : "/icons/eye_closed.png"}
                                            alt="toggle password"
                                            className="eye-icon"
                                        />
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
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

                            <button type="submit" className="login-btn" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            {/* Demo login buttons (optional) */}
                            {/* <div className="demo-login-section">
                                <p className="demo-text">Demo Login:</p>
                                <div className="demo-buttons">
                                    <button 
                                        type="button" 
                                        className="demo-btn customer"
                                        onClick={() => handleDemoLogin('customer')}
                                        disabled={isLoading}
                                    >
                                        Customer
                                    </button>
                                    <button 
                                        type="button" 
                                        className="demo-btn vendor"
                                        onClick={() => handleDemoLogin('vendor')}
                                        disabled={isLoading}
                                    >
                                        Vendor
                                    </button>
                                    <button 
                                        type="button" 
                                        className="demo-btn admin"
                                        onClick={() => handleDemoLogin('admin')}
                                        disabled={isLoading}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div> */}
                        </form>

                        <div className="register-link">
                            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;