// import React, { useState, useEffect } from "react";
// // import { shops, categories } from "../../data/shopsData";
// import ShopCard from "./ShopCard";
// import "./CustomerDashboard.css";

// const CustomerDashboard = () => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("all");

//     const [shops, setShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState(shops);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const categoryIcons = {
//         food: "🍔",
//         grocery: "🛒",
//         fashion: "👕",
//         electronics: "📱",
//         beauty: "💄",
//     };

//     const apiCategories = [...new Set(shops.map(shop => shop.category))];
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         const fetchShops = async () => {
//             try {
//                 const res = await fetch("http://127.0.0.1:8000/api/shops", {
//                     headers: {
//                         Accept: "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!res.ok) {
//                     throw new Error("Failed to fetch shops");
//                 }

//                 const data = await res.json();
//                 console.log(data)
//                 setShops(data.shops);

//             } catch (err) {
//                 console.error(err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchShops();

//     }, [token]);

//     useEffect(() => {
//         let filtered = shops;

//         // Filter by category
//         if (selectedCategory !== "all") {
//             filtered = filtered.filter(shop => shop.category === selectedCategory);
//         }

//         // Filter by search term
//         if (searchTerm.trim() !== "") {
//             const term = searchTerm.toLowerCase();
//             filtered = filtered.filter(
//                 shop =>
//                     shop.name.toLowerCase().includes(term) ||
//                     shop.address.toLowerCase().includes(term) ||
//                     shop.phone.toLowerCase().includes(term)
//             );
//         }

//         setFilteredShops(filtered);
//     }, [shops, searchTerm, selectedCategory]);

//     if (loading) {
//         return (
//             <div className="loading-shops">
//                 <div className="spinner"></div>
//                 <p>Loading shops...</p>
//             </div>
//         );
//     }

//     const handleSearch = (e) => {
//         e.preventDefault();
//         // Search is already handled by useEffect
//     };

//     const clearFilters = () => {
//         setSelectedCategory("all");
//         setSearchTerm("");
//     };

//     // Calculate total products across all shops
//     const totalProducts = shops.reduce((total, shop) => total + shop.products.length, 0);

//     // Calculate average rating across all shops
//     const averageRating = (shops.reduce((total, shop) => total + shop.rating, 0) / shops.length).toFixed(1);

//     return (
//         <div className="customer-dashboard">
//             {/* Hero Section */}
//             <div className="dashboard-hero">
//                 <div className="hero-content">
//                     <h1>POS Marketplace</h1>
//                     <p>Discover and order from local shops in your area</p>
//                     <div className="hero-stats">
//                         <div className="stat">
//                             <span className="stat-number">{shops.length}</span>
//                             <span className="stat-label">Shops</span>
//                         </div>
//                         <div className="stat">
//                             <span className="stat-number">{totalProducts}</span>
//                             <span className="stat-label">Products</span>
//                         </div>
//                         <div className="stat">
//                             <span className="stat-number">{averageRating}</span>
//                             <span className="stat-label">Avg Rating</span>
//                         </div>
//                         <div className="stat">
//                             <span className="stat-number">30</span>
//                             <span className="stat-label">Min Delivery</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls Section */}
//             <div className="dashboard-controls">
//                 <form onSubmit={handleSearch} className="search-container">
//                     <div className="search-input-group">
//                         <span className="search-icon">🔍</span>
//                         <input
//                             type="text"
//                             placeholder="Search shops, products, or categories..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="search-input"
//                         />
//                         {searchTerm && (
//                             <button
//                                 type="button"
//                                 onClick={() => setSearchTerm("")}
//                                 className="clear-search"
//                                 aria-label="Clear search"
//                             >
//                                 ✕
//                             </button>
//                         )}
//                     </div>
//                     <button type="submit" className="search-btn">Search</button>
//                 </form>

//                 <div className="controls-row">
//                     <div className="controls-row">
//                         <div className="category-filter">
//                             <h3>Categories</h3>
//                             <div className="category-buttons">

//                                 {/* ALL */}
//                                 <button
//                                     className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
//                                     onClick={() => setSelectedCategory("all")}
//                                 >
//                                     <span className="category-icon">🏪</span>
//                                     <span className="category-name">ALL</span>
//                                 </button>

//                                 {/* FROM API */}
//                                 {apiCategories.map(category => (
//                                     <button
//                                         key={category}
//                                         className={`category-btn ${selectedCategory === category ? "active" : ""}`}
//                                         onClick={() => setSelectedCategory(category)}
//                                     >
//                                         <span className="category-icon">
//                                             {categoryIcons[category.toLowerCase()] || "🏪"}
//                                         </span>
//                                         <span className="category-name">{category.toUpperCase()}</span>
//                                     </button>
//                                 ))}

//                             </div>
//                         </div>

//                     </div>

//                     <div className="filter-actions">
//                         <button
//                             onClick={clearFilters}
//                             className="clear-filters-btn"
//                             disabled={selectedCategory === "all" && !searchTerm}
//                             aria-label="Clear all filters"
//                         >
//                             <span>✕</span>
//                             Clear Filters
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Results Section */}
//             <div className="dashboard-results">
//                 <div className="results-header">
//                     <h2>
//                         {selectedCategory === "all"
//                             ? "All Shops"
//                             : `${selectedCategory} Shops`}
//                         <span className="results-count"> ({filteredShops.length})</span>
//                     </h2>

//                     <div className="sort-options">
//                         <select className="sort-select" aria-label="Sort results">
//                             <option>Recommended</option>
//                             <option>Rating: High to Low</option>
//                             <option>Delivery: Fastest</option>
//                             <option>Price: Low to High</option>
//                         </select>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="loading-shops">
//                         <div className="spinner"></div>
//                         <p>Finding shops...</p>
//                     </div>
//                 ) : filteredShops.length > 0 ? (
//                     <div className="shops-grid">
//                         {filteredShops.map((shop) => (
//                             <ShopCard
//                                 key={shop.id}
//                                 shop={shop}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="no-results">
//                         <div className="no-results-icon">🔍</div>
//                         <h3>No shops found</h3>
//                         <p>Try adjusting your search or filters</p>
//                         <button onClick={clearFilters} className="reset-filters-btn">
//                             Reset Filters
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Featured Categories */}
//             <div className="featured-categories">
//                 <h2>Shop by Category</h2>
//                 <div className="category-grid">
//                     {apiCategories.map(category => (
//                         <div
//                             key={category}
//                             className="category-card"
//                             onClick={() => setSelectedCategory(category)}
//                         >
//                             <div className="category-card-icon">
//                                 {categoryIcons[category.toLowerCase()] || "🏪"}
//                             </div>
//                             <h4>{category}</h4>
//                             <p className="category-count">
//                                 {shops.filter(s => s.category === category).length} shops
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="dashboard-footer">
//                 <p>© 2026 POS Marketplace. All rights reserved.</p>
//                 <p>Fast delivery • Secure payments • 24/7 support</p>
//             </div>
//         </div>
//     );
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import ShopCard from "./ShopCard";
// import RestaurantCard from "./RestaurantCard";
import "./CustomerDashboard.css";
import { useAuth } from "../../context/AuthContext";
// adjust path if needed

const CustomerDashboard = () => {
  const { token } = useAuth();

  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icons for categories
  const categoryIcons = { 
    food: "🍔",
    grocery: "🛒",
    fashion: "👕",
    electronics: "📱",
    beauty: "💄",
  };

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/shops", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch shops");
        }

        const data = await res.json();
        setShops(data.shops || []);
        setFilteredShops(data.shops || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token]);

  // Filter logic
  useEffect(() => {
    let filtered = [...shops];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (shop) => shop.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop.name?.toLowerCase().includes(term) ||
          shop.address?.toLowerCase().includes(term) ||
          shop.phone?.toLowerCase().includes(term)
      );
    }

    setFilteredShops(filtered);
  }, [shops, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Stats (safe)
  const totalProducts = shops.reduce(
    (total, shop) => total + (shop.products ? shop.products.length : 0),
    0
  );

  const averageRating =
    shops.length > 0
      ? (
          shops.reduce((total, shop) => total + (shop.rating || 0), 0) /
          shops.length
        ).toFixed(1)
      : "0.0";

  const apiCategories = [
    ...new Set(shops.map((shop) => shop.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="loading-shops">
        <div className="spinner"></div>
        <p>Loading shops...</p>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div className="customer-dashboard">
      {/* Hero */}
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
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="dashboard-controls">
        <div className="search-container">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="category-buttons">
          <button
            className={`category-btn ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            🏪 ALL
          </button>

          {apiCategories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryIcons[category?.toLowerCase()] || "🏪"}{" "}
              {category.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="dashboard-results">
        {filteredShops.length > 0 ? (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No shops found</h3>
            <button onClick={clearFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
