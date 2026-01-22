// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './LoginPage.css';

// const LoginPage = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         rememberMe: false
//     });
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { login } = useAuth();

//     const from = location.state?.from?.pathname || '/';

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));

//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setIsLoading(true);

//         try {
//             const success = await login(formData.email, formData.password);

//             console.log("LOGIN SUCCESS:", success);
//             console.log("TOKEN IN STORAGE:", localStorage.getItem("token"));

//             if (success) {
//                 navigate(from, { replace: true });
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setErrors({ general: "Login failed" });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSocialLogin = (provider) => {
//         console.log(`Logging in with ${provider}`);
//         navigate('/');
//     };

//     const handleForgotPassword = () => {
//         navigate('/forgot-password');
//     };

//     const handleDemoLogin = (role) => {
//         const demoCredentials = {
//             customer: { email: 'customer@demo.com', password: 'demo123' },
//             vendor: { email: 'vendor@demo.com', password: 'demo123' },
//             admin: { email: 'admin@demo.com', password: 'demo123' }
//         };

//         setFormData({
//             email: demoCredentials[role].email,
//             password: demoCredentials[role].password,
//             rememberMe: false
//         });
//     };
//     return (
//         <div className="login-page">
//             <div className="login-container">
//                 {/* Left Side */}
//                 <div className="login-left">
//                     <div className="login-brand">
//                         <div className="brand-logo">🛒</div>
//                         <h1>POS Marketplace</h1>
//                         <p className="brand-tagline">Discover amazing shops and order with ease</p>
//                     </div>

//                     <div className="login-features">
//                         <div className="feature">
//                             <div className="feature-icon">🚀</div>
//                             <div className="feature-text">
//                                 <h3>Fast Delivery</h3>
//                                 <p>Get your orders delivered in minutes</p>
//                             </div>
//                         </div>

//                         <div className="feature">
//                             <div className="feature-icon">🔒</div>
//                             <div className="feature-text">
//                                 <h3>Secure Payments</h3>
//                                 <p>100% secure and encrypted transactions</p>
//                             </div>
//                         </div>

//                         <div className="feature">
//                             <div className="feature-icon">⭐️</div>
//                             <div className="feature-text">
//                                 <h3>Top-rated Shops</h3>
//                                 <p>Shop from the best local businesses</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="login-stats">
//                         <div className="stat">
//                             <span className="stat-number">500+</span>
//                             <span className="stat-label">Active Shops</span>
//                         </div>
//                         <div className="stat">
//                             <span className="stat-number">10K+</span>
//                             <span className="stat-label">Happy Customers</span>
//                         </div>
//                         <div className="stat">
//                             <span className="stat-number">24/7</span>
//                             <span className="stat-label">Support</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="login-right">
//                     <div className="login-form-container">
//                         <div className="form-header">
//                             <h2>Welcome Back</h2>
//                             <p>Sign in to your account to continue</p>
//                         </div>

//                         {errors.general && (
//                             <div className="alert alert-error">
//                                 <span className="alert-icon">⚠️</span>
//                                 <span className="alert-text">{errors.general}</span>
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit} className="login-form" noValidate>
//                             <div className="form-group">
//                                 <label htmlFor="email" className="form-label">Email Address</label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleInputChange}
//                                     className={`form - input ${errors.email ? 'error' : ''}`}
//                                     placeholder="you@example.com"
//                                     disabled={isLoading}
//                                     autoComplete="email"
//                                 />
//                                 {errors.email && <span className="error-message">{errors.email}</span>}
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="password" className="form-label">Password</label>
//                                 <div className="password-input-group">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         id="password"
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleInputChange}
//                                         className={`form - input ${errors.password ? 'error' : ''}`}
//                                         placeholder="Enter your password"
//                                         disabled={isLoading}
//                                         autoComplete="current-password"
//                                     />
//                                     <button
//                                         type="button"
//                                         className="password-toggle"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         disabled={isLoading}
//                                     >
//                                         {showPassword ? '👁' : '👁‍🗨'}
//                                     </button>
//                                 </div>
//                                 {errors.password && <span className="error-message">{errors.password}</span>}
//                             </div>

//                             <div className="form-options">
//                                 <label className="checkbox-label">
//                                     <input
//                                         type="checkbox"
//                                         name="rememberMe"
//                                         checked={formData.rememberMe}
//                                         onChange={handleInputChange}
//                                         disabled={isLoading}
//                                     />
//                                     <span className="checkbox-text">Remember me</span>
//                                 </label>

//                                 <button
//                                     type="button"
//                                     onClick={handleForgotPassword}
//                                     className="forgot-password"
//                                     disabled={isLoading}
//                                 >
//                                     Forgot password?
//                                 </button>
//                             </div>

//                             <button type="submit" className="login-btn" disabled={isLoading}>
//                                 {isLoading ? <>Signing in...</> : 'Sign In'}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

/* ========== LoginPage.jsx ========== */
import React, { useState, useEffect } from 'react';
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

    // Load remembered email on component mount
    useEffect(() => {
        const remembered = localStorage.getItem('rememberMe');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (remembered === 'true' && savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail,
                rememberMe: true
            }));
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

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
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const result = await login({ 
                email: formData.email, 
                password: formData.password
            });
            
            if (result.success) {
                // Save remember me preference
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('userEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('userEmail');
                }
                
                navigate(from, { replace: true });
            } else {
                setErrors({ general: result.error || 'Invalid credentials' });
            }
        } catch (err) {
            console.error('Login error:', err);
            setErrors({ general: 'Login failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side */}
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
                            <div className="feature-icon">⭐️</div>
                            <div className="feature-text">
                                <h3>Top-rated Shops</h3>
                                <p>Shop from the best local businesses</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Add stats section */}
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

                {/* Right Side */}
                <div className="login-right">
                    <div className="login-card">
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
                                <label htmlFor="email" className="form-label">Email Address</label>
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

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
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
                                    className="forgot-password"
                                    onClick={handleForgotPassword}
                                    disabled={isLoading}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button type="submit" className="login-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>


                            <div className="register-link">
                                <p>
                                    Are you a customer? <Link to="/register" className="link">Sign up now for customers</Link>
                                </p>
                                <p>
                                    Are you a shop owner? <Link to="/shop-register" className="link shop-owner-link">Sign up for shop owners</Link>
                                </p>
                            </div>
                        </form>
                        
                        {/* Add footer */}
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
        </div>
    );
};

export default LoginPage;