import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (savedDarkMode) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage({ type: 'error', text: 'Update failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // In UserProfile.jsx, update the handleChangePassword function:

const handleChangePassword = async () => {
  // Validate passwords
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    setMessage({ type: 'error', text: 'All password fields are required' });
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setMessage({ type: 'error', text: 'New passwords do not match' });
    return;
  }

  setIsLoading(true);
  try {
    // Use the AuthContext's changePassword function
    const result = await showChangePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Password changed successfully!' });
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to change password' });
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Apply dark mode to body
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
    
    setMessage({ 
      type: 'success', 
      text: `Dark mode ${newDarkMode ? 'enabled' : 'disabled'}` 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSupport = () => {
    window.open('mailto:support@posmarketplace.com', '_blank');
  };

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="profile-container">
          <div className="no-user">
            <div className="no-user-icon">👤</div>
            <h2>User Not Found</h2>
            <p>Please login to view your profile</p>
            <button onClick={() => navigate('/login')} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="user-avatar-large">
            <img src={user.avatar} alt={user.name} />
            <div className="avatar-overlay">
              <span>📷</span>
            </div>
          </div>
          <div className="user-info-main">
            <h1>{user.name}</h1>
            <p className="user-email">{user.email}</p>
            <div className="user-badges">
              <span className="badge role-badge">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} User
              </span>
              <span className="badge member-badge">
                Member since {user.joinedDate || '2024'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">
              {message.type === 'success' ? '✓' : '⚠️'}
            </span>
            <span className="alert-text">{message.text}</span>
          </div>
        )}

        {/* Profile Content */}
        <div className="profile-content">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            <div className="card-content">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email"
                      disabled
                    />
                    <small className="hint">Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      onClick={handleSaveProfile}
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">{user.address || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Account Type</span>
                    <span className="info-value badge">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{user.joinedDate || '2024'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings & Quick Actions */}
          <div className="profile-sidebar">
            {/* Account Settings Card */}
            <div className="settings-card">
              <h3>Account Settings</h3>
              
              {showChangePassword ? (
                <div className="change-password-form">
                  <h4>Change Password</h4>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="password-actions">
                    <button 
                      onClick={handleChangePassword}
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="settings-list">
                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="settings-item"
                  >
                    <span className="settings-icon">🔒</span>
                    <span className="settings-text">Change Password</span>
                  </button>
                  
                  <button 
                    onClick={toggleDarkMode}
                    className="settings-item"
                  >
                    <span className="settings-icon">🌙</span>
                    <span className="settings-text">
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className={`toggle-switch ${darkMode ? 'active' : ''}`}>
                      <span className="toggle-slider"></span>
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleSupport}
                    className="settings-item"
                  >
                    <span className="settings-icon">❓</span>
                    <span className="settings-text">Help & Support</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <button 
                  onClick={() => navigate('/orders')}
                  className="action-btn"
                >
                  📦 View Orders
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  className="action-btn"
                >
                  🛒 View Cart
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="action-btn"
                >
                  🏠 Go Home
                </button>
                {user.role === 'vendor' && (
                  <button 
                    onClick={() => navigate('/vendor/dashboard')}
                    className="action-btn"
                  >
                    🏪 Vendor Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* Account Security */}
            <div className="security-card">
              <h3>Account Security</h3>
              <div className="security-info">
                <div className="security-item">
                  <span className="security-icon">✓</span>
                  <span className="security-text">Account verified</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">✓</span>
                  <span className="security-text">Two-factor authentication available</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">📧</span>
                  <span className="security-text">Email: {user.email}</span>
                </div>
              </div>
              <button className="security-btn" onClick={() => navigate('/security')}>
                Manage Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;