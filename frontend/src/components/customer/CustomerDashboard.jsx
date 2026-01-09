import React, { useState, useEffect } from "react";
import { shops, categories } from "../../data/shopsData";
import ShopCard from "./ShopCard";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState(shops);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = shops;

      if (selectedCategory !== "all") {
        filtered = filtered.filter(shop => shop.category === selectedCategory);
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          shop =>
            shop.name.toLowerCase().includes(term) ||
            shop.description.toLowerCase().includes(term) ||
            shop.products.some(product => 
              product.name.toLowerCase().includes(term)
            )
        );
      }

      setFilteredShops(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Calculate total products across all shops
  const totalProducts = shops.reduce((total, shop) => total + shop.products.length, 0);
  
  // Calculate average rating across all shops
  const averageRating = (shops.reduce((total, shop) => total + shop.rating, 0) / shops.length).toFixed(1);

  return (
    <div className="customer-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>POS Marketplace</h1>
          <p>Discover and order from local shops in your area</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{shops.length}</span>
              <span className="stat-label">Shops</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalProducts}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">{averageRating}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">30</span>
              <span className="stat-label">Min Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="dashboard-controls">
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search shops, products, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="clear-search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="controls-row">
          <div className="category-filter">
            <h3>Categories</h3>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                  aria-label={`Filter by ${category.name}`}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button 
              onClick={clearFilters} 
              className="clear-filters-btn"
              disabled={selectedCategory === "all" && !searchTerm}
              aria-label="Clear all filters"
            >
              <span>✕</span>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="dashboard-results">
        <div className="results-header">
          <h2>
            {selectedCategory === "all" ? "All Shops" : 
             categories.find(c => c.id === selectedCategory)?.name}
            <span className="results-count"> ({filteredShops.length})</span>
          </h2>
          <div className="sort-options">
            <select className="sort-select" aria-label="Sort results">
              <option>Recommended</option>
              <option>Rating: High to Low</option>
              <option>Delivery: Fastest</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-shops">
            <div className="spinner"></div>
            <p>Finding shops...</p>
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <ShopCard 
                key={shop.id} 
                shop={shop}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No shops found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="reset-filters-btn">
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Featured Categories */}
      <div className="featured-categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.filter(c => c.id !== "all").map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => setSelectedCategory(category.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setSelectedCategory(category.id)}
              aria-label={`Browse ${category.name} shops`}
            >
              <div className="category-card-icon">{category.icon}</div>
              <h4>{category.name}</h4>
              <p className="category-count">
                {shops.filter(s => s.category === category.id).length} shops
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>© 2026 POS Marketplace. All rights reserved.</p>
        <p>Fast delivery • Secure payments • 24/7 support</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;