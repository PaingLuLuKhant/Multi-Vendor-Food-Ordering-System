import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ShopCard from "./ShopCard";
import "./CustomerDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { getCategoryColors, getCategoryIcon, formatCategoryName } from "/utils/categoryColors";

const CustomerDashboard = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for favorites
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoriteStatuses, setFavoriteStatuses] = useState({});

  // Ref for scrolling to shops section
  const shopsGridRef = useRef(null);
  
  // Track scroll after category click
  const [shouldScroll, setShouldScroll] = useState(false);

  // Load saved filters from sessionStorage on initial load
  useEffect(() => {
    const savedCategory = sessionStorage.getItem('lastCategory');
    const savedSearch = sessionStorage.getItem('lastSearch');
    
    if (savedCategory && savedCategory !== 'all') {
      console.log("Loading saved category from session:", savedCategory);
      setSelectedCategory(savedCategory);
    }
    
    if (savedSearch) {
      console.log("Loading saved search from session:", savedSearch);
      setSearchTerm(savedSearch);
    }
  }, []);

  // Handle returning from shop page with filters
  useEffect(() => {
    console.log("Location state:", location.state); // For debugging
    
    if (location.state?.preserveFilter) {
      // Restore category if provided
      if (location.state.selectedCategory && location.state.selectedCategory !== 'all') {
        console.log("Restoring category from navigation:", location.state.selectedCategory);
        setSelectedCategory(location.state.selectedCategory);
        // Save to sessionStorage
        sessionStorage.setItem('lastCategory', location.state.selectedCategory);
      }
      
      // Restore search term if provided
      if (location.state.searchTerm) {
        console.log("Restoring search term from navigation:", location.state.searchTerm);
        setSearchTerm(location.state.searchTerm);
        // Save to sessionStorage
        sessionStorage.setItem('lastSearch', location.state.searchTerm);
      }
      
      setShowFavoritesOnly(false);
      setShouldScroll(true);
      
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        console.log("Fetching shops...");
        const res = await fetch("http://127.0.0.1:8000/api/shops", {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch shops. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Shops data received:", data);
        
        const shopsData = data.shops || [];

        setShops(shopsData);
        setFilteredShops(shopsData);

      } catch (err) {
        console.error("Error fetching shops:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token]);

  // Fetch user's favorite shops
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id || !token) return;
      
      setLoadingFavorites(true);
      try {
        console.log("Fetching favorites for user:", user.id);
        const res = await fetch("http://127.0.0.1:8000/api/user/favorites", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Favorites response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Favorites data:", data);
          
          if (data.success) {
            const favoriteIds = data.favorite_ids || data.favorites?.map(fav => fav.shop_id || fav.id) || [];
            setFavoriteShops(favoriteIds);
            
            // Create a lookup object for favorite statuses
            const statuses = {};
            favoriteIds.forEach(id => {
              statuses[id] = true;
            });
            setFavoriteStatuses(statuses);
          }
        } else {
          console.warn("Failed to fetch favorites, using local state");
        }
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // Toggle favorite status for a shop
  const toggleFavorite = async (shopId) => {
    console.log("Toggling favorite for shop:", shopId);
    console.log("User:", user);
    console.log("Token exists:", !!token);
    
    if (!user?.id || !token) {
      alert("Please login to save favorites");
      return;
    }

    const isCurrentlyFavorite = favoriteStatuses[shopId] || false;

    // Optimistic update
    const newFavoriteStatuses = { ...favoriteStatuses };
    if (isCurrentlyFavorite) {
      newFavoriteStatuses[shopId] = false;
      setFavoriteShops(prev => prev.filter(id => id !== shopId));
    } else {
      newFavoriteStatuses[shopId] = true;
      setFavoriteShops(prev => [...prev, shopId]);
    }
    setFavoriteStatuses(newFavoriteStatuses);

    try {
      const url = `http://127.0.0.1:8000/api/user/favorites/${shopId}/toggle`;
      console.log("Making request to:", url);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
      });

      console.log("Toggle response status:", res.status);
      
      if (res.status === 401) {
        throw new Error("Please login to favorite shops. Status: 401");
      }
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Toggle response data:", data);
      
      if (!data.success) {
        throw new Error(data.error || data.message || "Failed to update favorite");
      }
      
      console.log("Toggle successful:", data);
      
      // Update the shops array with new favorite status
      setShops(prevShops => 
        prevShops.map(shop => 
          shop.id === shopId 
            ? { ...shop, is_favorite: data.is_favorite }
            : shop
        )
      );
      
      // Update local state with the server response
      setFavoriteStatuses(prev => ({
        ...prev,
        [shopId]: data.is_favorite
      }));
      
      if (data.is_favorite) {
        setFavoriteShops(prev => [...new Set([...prev, shopId])]);
      } else {
        setFavoriteShops(prev => prev.filter(id => id !== shopId));
      }
      
    } catch (err) {
      console.error("Failed to update favorite:", err);
      
      // Revert optimistic update on error
      const revertedStatuses = { ...favoriteStatuses };
      revertedStatuses[shopId] = isCurrentlyFavorite;
      setFavoriteStatuses(revertedStatuses);
      
      if (isCurrentlyFavorite) {
        setFavoriteShops(prev => [...prev, shopId]);
      } else {
        setFavoriteShops(prev => prev.filter(id => id !== shopId));
      }
      
      alert(`${err.message}. Please try again.`);
    }
  };

  // Update search handler to save to session storage
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    sessionStorage.setItem('lastSearch', term);
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchTerm("");
    sessionStorage.removeItem('lastSearch');
  };

  // Handle category click - save to sessionStorage
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setShowFavoritesOnly(false);
    setShouldScroll(true);
    
    // Save category to sessionStorage
    if (category === 'all') {
      sessionStorage.removeItem('lastCategory');
    } else {
      sessionStorage.setItem('lastCategory', category);
    }
    // Clear search when clicking category
    sessionStorage.removeItem('lastSearch');
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...shops];

    // Apply category filter if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter(shop => shop.category === selectedCategory);
    }

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        shop =>
          shop.name?.toLowerCase().includes(term) ||
          shop.address?.toLowerCase().includes(term) ||
          shop.phone?.toLowerCase().includes(term) ||
          shop.category?.toLowerCase().includes(term) ||
          (shop.products && shop.products.some(product =>
            product.name?.toLowerCase().includes(term)
          ))
      );
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(shop => favoriteStatuses[shop.id]);
    }

    setFilteredShops(filtered);

    if (shouldScroll && shopsGridRef.current) {
      setTimeout(() => {
        shopsGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      setShouldScroll(false);
    }
  }, [shops, selectedCategory, searchTerm, shouldScroll, showFavoritesOnly, favoriteStatuses]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setShowFavoritesOnly(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    sessionStorage.removeItem('lastCategory');
    sessionStorage.removeItem('lastSearch');
  };

  const toggleFavoritesFilter = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    if (!showFavoritesOnly) {
      setSelectedCategory("all");
      setSearchTerm("");
      sessionStorage.removeItem('lastCategory');
      sessionStorage.removeItem('lastSearch');
    }
    setShouldScroll(true);
  };

  const totalProducts = shops.reduce((total, shop) => total + (shop.products?.length || 0), 0);

  const apiCategories = [...new Set(shops.map(shop => shop.category).filter(Boolean))];

  // Count shops per category
  const categoryCounts = {};
  apiCategories.forEach(category => {
    categoryCounts[category] = shops.filter(shop => shop.category === category).length;
  });

  if (loading) {
    return (
      <div className="loading-shops">
        <div className="spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Restaurants</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Hungry Hub</h1>
          <p>Discover and order from the best restaurants in your area</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{shops.length}</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalProducts}</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat">
              <span className="stat-number">{favoriteShops.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="dashboard-controls">
        <div className="search-container">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search restaurants, cuisine, or dishes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="button" className="search-btn">Search</button>
        </div>

        <div className="controls-row">
          <div className="category-filter">
            <h3>Cuisine Types</h3>
            <div className="category-buttons">
              <button
                className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategoryClick("all")}
                style={{ '--category-color': '#6B7280', '--category-gradient': 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)' }}
              >
                <span className="category-icon">🏪</span>
                <span className="category-name">ALL</span>
              </button>

              {apiCategories.map(category => {
                const categoryColors = getCategoryColors(category);
                const categoryIcon = getCategoryIcon(category);
                const formattedCategory = formatCategoryName(category);

                return (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      '--category-color': categoryColors.primary,
                      '--category-gradient': categoryColors.gradient
                    }}
                  >
                    <span className="category-icon">{categoryIcon}</span>
                    <span className="category-name">{formattedCategory}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="filter-section-spacer"></div>

          <div className="filter-actions">
            <div className="action-buttons">
              <button
                onClick={toggleFavoritesFilter}
                className={`favorites-toggle-btn ${showFavoritesOnly ? "active" : ""}`}
                aria-label={showFavoritesOnly ? "Show all restaurants" : "Show favorites only"}
                title={showFavoritesOnly ? "Show all restaurants" : "Show my favorites"}
                disabled={!user}
              >
                <span className="favorites-icon">❤️</span>
                <span className="favorites-text">
                  {showFavoritesOnly ? "Show All" : "My Favorites"}
                </span>
                {showFavoritesOnly && (
                  <span className="favorites-count">({favoriteShops.length})</span>
                )}
              </button>
              
              <button
                onClick={clearFilters}
                className="clear-filters-btn"
                disabled={selectedCategory === "all" && !searchTerm && !showFavoritesOnly}
                aria-label="Clear all filters"
              >
                ✕ Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="dashboard-results" ref={shopsGridRef}>
        <div className="results-header">
          <h2>
            {showFavoritesOnly ? (
              <>
                <span className="favorites-heart">❤️</span> My Favorite Restaurants
                {!user && <span className="login-required"> (Login Required)</span>}
              </>
            ) : searchTerm ? (
              <>
                Search Results for "<span className="search-term">{searchTerm}</span>"
              </>
            ) : selectedCategory === "all" ? (
              "All Restaurants"
            ) : (
              `${formatCategoryName(selectedCategory)} Restaurants`
            )}
            <span className="results-count"> ({filteredShops.length})</span>
          </h2>
        </div>

        {loadingFavorites && showFavoritesOnly ? (
          <div className="loading-favorites">
            <div className="spinner"></div>
            <p>Loading your favorite restaurants...</p>
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="shops-grid">
            {filteredShops.map(shop => (
              <ShopCard 
                key={shop.id} 
                shop={shop} 
                isFavorite={favoriteStatuses[shop.id] || false}
                onToggleFavorite={() => toggleFavorite(shop.id)}
                showFavoriteButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              {showFavoritesOnly ? "❤️" : "🔍"}
            </div>
            <h3>
              {showFavoritesOnly 
                ? "No favorite restaurants yet" 
                : searchTerm 
                  ? `No results found for "${searchTerm}"`
                  : "No restaurants found"}
            </h3>
            <p>
              {showFavoritesOnly
                ? user 
                  ? "Click the heart icon on any restaurant to add it to your favorites!"
                  : "Please login to save favorites"
                : searchTerm
                  ? "Try different keywords or browse by category"
                  : "Try adjusting your search or filters"}
            </p>
            <button onClick={clearFilters} className="reset-filters-btn">
              {showFavoritesOnly ? "Browse All Restaurants" : "Reset Filters"}
            </button>
          </div>
        )}
      </div>

      {/* Featured Categories - Always visible */}
      {!showFavoritesOnly && filteredShops.length > 0 && (
        <div className="featured-categories">
          <h2>Explore by Cuisine</h2>
          <div className="category-grid">
            {apiCategories.map(category => {
              const categoryColors = getCategoryColors(category);
              const categoryIcon = getCategoryIcon(category);
              const formattedCategory = formatCategoryName(category);

              return (
                <div
                  key={category}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    '--category-color': categoryColors.primary,
                    '--category-gradient': categoryColors.gradient
                  }}
                >
                  <div className="category-card-icon">{categoryIcon}</div>
                  <h4>{formattedCategory}</h4>
                  <p className="category-count">{categoryCounts[category]} restaurants</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="dashboard-footer">
        <p>© 2026 Hungry Hub Marketplace. All rights reserved.</p>
        <p>Fast delivery • Secure payments • 24/7 support</p>
        {!user && (
          <p className="login-notice">Login to save your favorite restaurants!</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;