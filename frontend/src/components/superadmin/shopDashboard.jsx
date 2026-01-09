// ShopDashboard.jsx
import React, { useState } from 'react';
import './ShopDashboard.css';

const ShopDashboard = () => {
  // Initial shops data
  const initialShops = [
    {
      id: 1,
      name: "Tech Gadgets Store",
      type: "Electronics",
      rating: 4.5,
      sales: 1284,
      status: "active",
      revenue: "$45,230",
      description: "Latest tech gadgets and accessories",
      color: "#3B82F6"
    },
    {
      id: 2,
      name: "Urban Fashion",
      type: "Clothing",
      rating: 3.2,
      sales: 892,
      status: "active",
      revenue: "$28,150",
      description: "Trendy clothing and accessories",
      color: "#8B5CF6"
    },
    {
      id: 3,
      name: "Healthy Bites",
      type: "Food & Beverage",
      rating: 2.8,
      sales: 1567,
      status: "active",
      revenue: "$52,890",
      description: "Organic and healthy food options",
      color: "#10B981"
    }
  ];

  // User profile data
  const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "AJ",
    role: "Business Owner",
    plan: "Premium",
    shopsCount: 3,
    joinDate: "Jan 2023"
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
    { id: 'shops', label: 'My Shops', icon: '🏪', active: false },
    { id: 'analytics', label: 'Analytics', icon: '📈', active: false },
    { id: 'orders', label: 'Orders', icon: '📦', active: false },
    { id: 'customers', label: 'Customers', icon: '👥', active: false },
    { id: 'settings', label: 'Settings', icon: '⚙️', active: false }
  ];

  const [shops] = useState(initialShops);
  const [sortBy, setSortBy] = useState('name');
  const [activeNav, setActiveNav] = useState('shops');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sort shops based on selected criteria
  const sortedShops = [...shops].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'sales':
        return b.sales - a.sales;
      case 'rating':
        return b.rating - a.rating;
      case 'revenue':
        { const revenueA = parseInt(a.revenue.replace(/[$,]/g, ''));
        const revenueB = parseInt(b.revenue.replace(/[$,]/g, ''));
        return revenueB - revenueA; }
      default:
        return 0;
    }
  });

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏪</span>
            <h2>ShopHub</h2>
          </div>
        </div>

        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.id === 'shops' && <span className="notification-badge">3</span>}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="upgrade-banner">
            <span className="upgrade-icon">🚀</span>
            <div className="upgrade-text">
              <strong>Upgrade to Pro</strong>
              <small>Get advanced features</small>
            </div>
            <button className="upgrade-btn">Upgrade</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="header-left">
            <h1>My Shops</h1>
            <div className="breadcrumb">Dashboard / Shops</div>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>

            <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="user-avatar">
                {userProfile.avatar}
              </div>
              <div className="user-info">
                <span className="user-name">{userProfile.name}</span>
                <span className="user-role">{userProfile.role}</span>
              </div>
              <span className="dropdown-icon">{isProfileOpen ? '▲' : '▼'}</span>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{userProfile.avatar}</div>
                    <div>
                      <h4>{userProfile.name}</h4>
                      <p>{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-stats">
                    <div className="dropdown-stat">
                      <span className="stat-value">{userProfile.shopsCount}</span>
                      <span className="stat-label">Shops</span>
                    </div>
                    <div className="dropdown-stat">
                      <span className="stat-value">{userProfile.plan}</span>
                      <span className="stat-label">Plan</span>
                    </div>
                    <div className="dropdown-stat">
                      <span className="stat-value">{userProfile.joinDate}</span>
                      <span className="stat-label">Joined</span>
                    </div>
                  </div>
                  <div className="dropdown-menu">
                    <button className="dropdown-item">
                      <span>👤</span> My Profile
                    </button>
                    <button className="dropdown-item">
                      <span>⚙️</span> Account Settings
                    </button>
                    <button className="dropdown-item">
                      <span>💳</span> Billing
                    </button>
                    <button className="dropdown-item">
                      <span>🛟</span> Help & Support
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout">
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <span style={{ color: '#3B82F6' }}>💰</span>
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">${shops.reduce((sum, shop) => sum + parseInt(shop.revenue.replace(/[$,]/g, '')), 0).toLocaleString()}</p>
              <span className="stat-change positive">+12.5%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <span style={{ color: '#10B981' }}>📦</span>
            </div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{shops.reduce((sum, shop) => sum + shop.sales, 0).toLocaleString()}</p>
              <span className="stat-change positive">+8.2%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <span style={{ color: '#8B5CF6' }}>🏪</span>
            </div>
            <div className="stat-content">
              <h3>Active Shops</h3>
              <p className="stat-value">{shops.length}</p>
              <span className="stat-change neutral">+1 new</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <span style={{ color: '#F59E0B' }}>⭐</span>
            </div>
            <div className="stat-content">
              <h3>Avg Rating</h3>
              <p className="stat-value">{(shops.reduce((sum, shop) => sum + shop.rating, 0) / shops.length).toFixed(1)}</p>
              <span className="stat-change positive">+0.3</span>
            </div>
          </div>
        </div>

        {/* Dashboard Controls */}
        <div className="dashboard-controls-section">
          <div className="controls-left">
            <h2>Shop Management</h2>
            <p className="subtitle">Manage your {shops.length} active shops</p>
          </div>
          <div className="controls-right">
            <div className="sort-controls">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Name</option>
                <option value="sales">Sales</option>
                <option value="rating">Rating</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <button className="filter-btn">
              <span>🔍</span> Filter
            </button>
            <button className="add-shop-btn">
              <span>+</span> Add Shop
            </button>
          </div>
        </div>

        {/* Shops Grid */}
        <div className="shops-grid">
          {sortedShops.map(shop => (
            <div 
              key={shop.id} 
              className="shop-card"
              style={{ '--shop-color': shop.color }}
            >
              <div className="shop-card-header">
                <div className="shop-avatar" style={{ backgroundColor: shop.color }}>
                  {shop.name.charAt(0)}
                </div>
                <div className="shop-title">
                  <h3>{shop.name}</h3>
                  <span className="shop-type">{shop.type}</span>
                </div>
                <span className={`status-badge status-${shop.status}`}>
                  {shop.status}
                </span>
              </div>

              <p className="shop-description">{shop.description}</p>

              <div className="shop-stats">
                <div className="stat">
                  <span className="stat-value">{shop.rating}</span>
                  <span className="stat-label">Rating</span>
                  <div className="stars">
                    {'★'.repeat(Math.floor(shop.rating))}
                    {'☆'.repeat(5 - Math.floor(shop.rating))}
                  </div>
                </div>
                
                <div className="stat">
                  <span className="stat-value">{shop.sales.toLocaleString()}</span>
                  <span className="stat-label">Total Sales</span>
                </div>
                
                <div className="stat">
                  <span className="stat-value">{shop.revenue}</span>
                  <span className="stat-label">Revenue</span>
                </div>
              </div>

              <div className="shop-actions">
                <button className="action-btn view-btn">View Details</button>
                <button className="action-btn manage-btn">Manage</button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <p><strong>New order</strong> in Tech Gadgets Store</p>
                <small>2 minutes ago</small>
              </div>
              <span className="activity-badge">+$249</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <p><strong>New review</strong> in Urban Fashion</p>
                <small>1 hour ago</small>
              </div>
              <span className="activity-badge">5 stars</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📈</div>
              <div className="activity-content">
                <p><strong>Sales update</strong> in Healthy Bites</p>
                <small>3 hours ago</small>
              </div>
              <span className="activity-badge">+15 orders</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopDashboard;