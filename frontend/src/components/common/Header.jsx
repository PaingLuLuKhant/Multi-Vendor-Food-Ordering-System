import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = getCartCount();

  // Check if we're on a page where we want to hide Home & Orders links
  const hideHomeAndOrders = 
    location.pathname.startsWith('/shop/') || 
    location.pathname === '/checkout';
  
  // Get user initial for avatar letter
  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-nav-menu') && 
          !event.target.closest('.mobile-menu-toggle')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showMobileMenu]);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Simple navigation
  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🛒</span>
            <span className="logo-text">Hungry <span>Hub</span></span>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Navigation - Desktop */}
          <nav className="header-nav">
            {/* Only show Home link if NOT on shop or checkout page */}
            {!hideHomeAndOrders && (
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/')}
              >
                🏠 Home
              </Link>
            )}
            
            {/* Only show Orders link if NOT on shop or checkout page */}
            {!hideHomeAndOrders && (
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '/orders')}
              >
                📦 Orders
              </Link>
            )}
            
            {/* Always show Cart link */}
            <Link 
              to="/cart" 
              className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '/cart')}
            >
              🛒 Cart <span className="cart-count">{cartCount}</span>
            </Link>
          </nav>

          {/* User Section - Remaining code unchanged */}
          <div className="header-user">
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="user-avatar-small"
                    />
                  ) : (
                    <div className="user-avatar-letter">
                      {getUserInitial()}
                    </div>
                  )}
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="dropdown-avatar"
                        />
                      ) : (
                        <div className="dropdown-avatar-letter">
                          {getUserInitial()}
                        </div>
                      )}
                      <div className="dropdown-user-info">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link 
                      to="./profile" 
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('./profile');
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="icon">👤</span>
                      My Profile
                    </Link>
                    
                    {user.role === 'vendor' && (
                      <Link 
                        to="/vendor/dashboard" 
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/vendor/dashboard');
                          setShowUserMenu(false);
                        }}
                      >
                        <span className="icon">🏪</span>
                        Vendor Dashboard
                      </Link>
                    )}
                    
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/admin/dashboard');
                          setShowUserMenu(false);
                        }}
                      >
                        <span className="icon">⚙️</span>
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/orders');
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="icon">📦</span>
                      My Orders
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="icon">⚙️</span>
                      Settings
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <span className="icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="header-login-btn"
                  onClick={(e) => handleNavClick(e, '/login')}
                >
                  👤 Login
                </Link>
                <Link 
                  to="/register" 
                  className="header-register-btn"
                  onClick={(e) => handleNavClick(e, '/register')}
                >
                  ✨ Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - Updated for shop and checkout pages */}
      {showMobileMenu && (
        <>
          <div 
            className="mobile-nav-overlay"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="mobile-nav-menu">
            <div className="mobile-nav-header">
              <div className="mobile-nav-logo">
                <span>🛒</span>
                <span>Hungry Hub</span>
              </div>
              <button 
                className="mobile-nav-close"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-nav-items">
              {/* Only show Home link if NOT on shop or checkout page */}
              {!hideHomeAndOrders && (
                <Link 
                  to="/" 
                  className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                    setShowMobileMenu(false);
                  }}
                >
                  🏠 Home
                </Link>
              )}
              
              {/* Only show Shops link if NOT on shop or checkout page */}
              {!hideHomeAndOrders && (
                <Link 
                  to="/shops" 
                  className={`mobile-nav-item ${isActive('/shops') ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/shops');
                    setShowMobileMenu(false);
                  }}
                >
                  🏪 Shops
                </Link>
              )}
              
              {/* Only show Orders link if NOT on shop or checkout page */}
              {!hideHomeAndOrders && (
                <Link 
                  to="/orders" 
                  className={`mobile-nav-item ${isActive('/orders') ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/orders');
                    setShowMobileMenu(false);
                  }}
                >
                  📦 Orders
                </Link>
              )}
              
              {/* Always show Cart link */}
              <Link 
                to="/cart" 
                className={`mobile-nav-item ${isActive('/cart') ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/cart');
                  setShowMobileMenu(false);
                }}
              >
                🛒 Cart ({cartCount})
              </Link>
            </div>
            
            <div className="mobile-nav-footer">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="user-avatar-small"
                      />
                    ) : (
                      <div className="mobile-avatar-letter">
                        {getUserInitial()}
                      </div>
                    )}
                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="mobile-nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/profile');
                      setShowMobileMenu(false);
                    }}
                  >
                    👤 My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="mobile-nav-item logout-item"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="login-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                      setShowMobileMenu(false);
                    }}
                  >
                    👤 Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="register-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/register');
                      setShowMobileMenu(false);
                    }}
                  >
                    ✨ Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;