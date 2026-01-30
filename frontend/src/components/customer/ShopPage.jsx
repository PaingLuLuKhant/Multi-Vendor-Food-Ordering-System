import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ShopPage.css";

// Import category utility functions (same as in CustomerDashboard)
import { getCategoryColors, getCategoryIcon, formatCategoryName } from "/utils/categoryColors";

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { 
    addToCart: globalAddToCart,
    updateQuantity: globalUpdateQuantity,
    removeFromCart: globalRemoveFromCart,
    quantities: globalQuantities,
    getShopCart,
    getShopCartTotal,
    getShopCartCount,
    setCartVisible,
  } = useCart();

  const [activeTab, setActiveTab] = useState("all");

  // Function to get shop category colors
  const getShopCategoryColors = () => {
    if (!shop || !shop.category) {
      return {
        primary: "#667eea",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      };
    }
    return getCategoryColors(shop.category);
  };

  // Function to get shop category icon
  const getShopCategoryIcon = () => {
    if (!shop || !shop.category) return "🏪";
    return getCategoryIcon(shop.category);
  };

  // Fetch shop data
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Shop not found");
          throw new Error("Failed to fetch shop");
        }

        const data = await res.json();
        setShop(data.shop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  if (loading) return (
    <div className="loading-shops">
      <div className="spinner"></div>
      <p>Loading shop...</p>
    </div>
  );

  const shopCart = getShopCart(parseInt(id));
  const shopCartCount = getShopCartCount(parseInt(id));
  const shopCartTotal = getShopCartTotal(parseInt(id));

  const handleAddToCart = (product) => {
    globalAddToCart({
      ...product,
      shopId: shop.id,
      shopName: shop.name,
      image: product.image || shop.image
    });
    setCartVisible(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty < 0) return;
    globalUpdateQuantity(productId, newQty);
  };

  const handleRemoveFromCart = (productId) => globalRemoveFromCart(productId, shop.id);

  const handleCheckout = () => {
    if (!token) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  const handleBackToShops = () => {
    navigate("/");
  };

  const productCategories = [...new Set(shop.products.map(p => p.category))];
  const filteredProducts = activeTab === "all" 
    ? shop.products 
    : shop.products.filter(p => p.category === activeTab);

  const subtotal = parseFloat(shopCartTotal || 0);
  const serviceFee = subtotal * 0.10;
  const total = subtotal + serviceFee;

  // Get shop category colors
  const categoryColors = getShopCategoryColors();
  const categoryIcon = getShopCategoryIcon();
  const formattedCategory = shop ? formatCategoryName(shop.category) : "Shop";

  return (
    <div className="shop-page">
      {/* ===== SHOP HEADER ===== */}
      <div 
        className="shop-header"
        style={{ 
          background: categoryColors.gradient,
          '--category-color': categoryColors.primary,
          '--category-gradient': categoryColors.gradient 
        }}
      >
        <div className="shop-header-top">
          <button 
            className="back-to-dashboard"
            onClick={handleBackToShops}
          >
            ← Back to Shops
          </button>
        </div>
        
        <div className="shop-header-content">
          <div className="shop-header-image">
            {shop.image ? (
              <img src={shop.image} alt={shop.name} />
            ) : (
              <div 
                className="shop-initials-logo"
                style={{ background: categoryColors.gradient }}
              >
                <span>{categoryIcon}</span>
              </div>
            )}
          </div>
          
          <div className="shop-header-info">
            <h1>{shop.name}</h1>
            <p className="shop-description">{shop.description}</p>
            
            <div className="shop-meta">
              <div className="meta-item category-display">
                <span className="meta-icon">{categoryIcon}</span>
                <span className="category-name">{formattedCategory}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{shop.address || "City Center"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📞</span>
                <span>{shop.phone || "Contact Available"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="shop-main-content">
        {/* ===== PRODUCTS SECTION ===== */}
        <div className="products-section">
          <div className="products-header">
            <h2>Menu Items</h2>
            <div className="category-tabs">
              <button
                className={`category-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Items
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const quantityInCart = globalQuantities[product.id] || 0;
              return (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price-row">
                      <div className="product-price">MMK {product.price.toFixed(2)}</div>
                      {quantityInCart > 0 && (
                        <div className="in-cart-badge">In Cart: {quantityInCart}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    {quantityInCart > 0 ? (
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleUpdateQuantity(product.id, quantityInCart - 1)}
                          className="quantity-btn minus"
                        >
                          -
                        </button>
                        <span className="quantity-display">{quantityInCart}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(product.id, quantityInCart + 1)}
                          className="quantity-btn plus"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== ORDER SUMMARY SECTION ===== */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="order-summary-header">
              <div className="header-left">
                <h2>Your Order from {shop.name}</h2>
                <div className="items-count">{shopCartCount} items</div>
              </div>
              {shopCartCount > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={() => {
                    shopCart.forEach(item => handleRemoveFromCart(item.id));
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {shopCartCount > 0 ? (
              <>
                <div className="order-items-list">
                  {shopCart.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-main">
                        <span className="item-name">{item.name}</span>
                        <div className="item-category">{item.category}</div>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-selector">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, (globalQuantities[item.id] || 0) - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-display">{globalQuantities[item.id] || 0}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, (globalQuantities[item.id] || 0) + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-price-section">
                          <span className="item-price">
                            MMK {((item.price || 0) * (globalQuantities[item.id] || 0)).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal ({shopCartCount} items)</span>
                    <span>MMK {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Service Fee</span>
                    <span>MMK {serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>MMK {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </>
            ) : (
              <div className="empty-order">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <small>Add items from the menu to get started!</small>
              </div>
            )}
            
            <div className="shop-actions">
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;