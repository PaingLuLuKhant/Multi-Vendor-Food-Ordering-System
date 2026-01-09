import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shops } from "../../data/shopsData";
import { useCart } from "../../context/CartContext";
import "./ShopPage.css";

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use the global cart context
  const { 
    addToCart: globalAddToCart, 
    updateQuantity: globalUpdateQuantity,
    removeFromCart: globalRemoveFromCart,
    quantities: globalQuantities,
    getShopCart,
    getShopCartTotal,
    getShopCartCount,
    setCartVisible 
  } = useCart();

  const [activeTab, setActiveTab] = useState("all");

  const shop = shops.find(s => s.id === parseInt(id));
  
  // Get cart items specific to this shop
  const shopCart = getShopCart(parseInt(id));
  const shopCartCount = getShopCartCount(parseInt(id));
  const shopCartTotal = getShopCartTotal(parseInt(id));

  useEffect(() => {
    if (shop) {
      document.title = `${shop.name} | POS Marketplace`;
    }
  }, [shop]);

  if (!shop) {
    return (
      <div className="shop-not-found">
        <div className="not-found-content">
          <h2>🚫 Shop Not Found</h2>
          <p>The shop you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/")} 
            className="back-home-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
    globalUpdateQuantity(productId, newQty);
  };

  const handleRemoveFromCart = (productId) => {
    globalRemoveFromCart(productId, shop.id);
  };

  const clearShopCart = () => {
    shopCart.forEach(item => {
      globalRemoveFromCart(item.id, shop.id);
    });
  };

  const productCategories = [...new Set(shop.products.map(p => p.category))];
  const filteredProducts = activeTab === "all" 
    ? shop.products 
    : shop.products.filter(p => p.category === activeTab);

  const getDeliveryTime = () => {
    const times = shop.deliveryTime.split("-");
    if (times.length === 2) {
      return `${times[0].trim()} min`;
    }
    return shop.deliveryTime;
  };

  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const subtotal = parseFloat(shopCartTotal || 0);
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="shop-page">
      {/* Shop Info Header (not the app header) */}
      <div className="shop-info-header">
        <div className="shop-info-top">
          <button 
            onClick={() => navigate("/")} 
            className="back-to-shops"
          >
            ← Back to Shops
          </button>
        </div>
        
        <div className="shop-info-content">
          <div className="shop-info-image">
            <img src={shop.image} alt={shop.name} />
            <div className="shop-rating-badge">
              ⭐ {shop.rating} • {getDeliveryTime()}
            </div>
          </div>
          
          <div className="shop-info-details">
            <h1>{shop.name}</h1>
            <p className="shop-description">{shop.description}</p>
            <div className="shop-meta">
              <span className="meta-item">
                <span className="meta-icon">🏷️</span>
                <span className="meta-text">{shop.category}</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">{shop.deliveryTime}</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">⭐</span>
                <span className="meta-text">{shop.rating} Rating</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">📦</span>
                <span className="meta-text">{shop.products.length} Items</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="shop-main-content">
        {/* Products Section */}
        <div className="products-section">
          <div className="products-header">
            <h2>Our Products</h2>
            <div className="category-tabs">
              <button
                className={`category-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All ({shop.products.length})
              </button>
              {productCategories.map(category => (
                <button
                  key={category}
                  className={`category-tab ${activeTab === category ? "active" : ""}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => {
              const quantityInCart = globalQuantities[product.id] || 0;
              
              return (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price-row">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {quantityInCart > 0 && (
                        <span className="in-cart-badge">
                          {quantityInCart} in cart
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                    {quantityInCart > 0 && (
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, quantityInCart - 1)}
                          className="quantity-btn minus"
                        >
                          –
                        </button>
                        <span className="quantity-display">{quantityInCart}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product.id, quantityInCart + 1)}
                          className="quantity-btn plus"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="order-summary-header">
              <div className="header-left">
                <h2>Order Summary</h2>
                <span className="items-count">{shopCartCount} items</span>
              </div>
              {shopCart.length > 0 && (
                <button onClick={clearShopCart} className="clear-all-btn">
                  Clear All
                </button>
              )}
            </div>

            {shopCart.length === 0 ? (
              <div className="empty-order">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <small>Add items from the menu to start your order</small>
              </div>
            ) : (
              <>
                <div className="order-items-list">
                  {shopCart.map(item => {
                    const qty = globalQuantities[item.id] || 1;
                    return (
                      <div key={`${item.id}-${item.shopId}`} className="order-item">
                        <div className="item-main">
                          <span className="item-name">{item.name}</span>
                          <span className="item-category">{item.category}</span>
                        </div>
                        <div className="item-controls">
                          <div className="quantity-selector">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, qty - 1)}
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-display">{qty}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, qty + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          <div className="item-price-section">
                            <span className="item-price">
                              ${(item.price * qty).toFixed(2)}
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
                    );
                  })}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="checkout-btn"
                  disabled={shopCart.length === 0}
                >
                  Proceed to Checkout
                </button>
                
                <p className="delivery-estimate">
                  ⏱️ Estimated delivery: {getDeliveryTime()}
                </p>

                <div className="additional-actions">
                  <button 
                    onClick={() => navigate("/cart")}
                    className="view-full-cart-btn"
                  >
                    View Full Cart Details →
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="shop-actions">
            <button 
              onClick={() => navigate("/profile")}
              className="view-profile-btn"
            >
              👤 View Profile
            </button>
            <button 
              onClick={() => navigate("/")}
              className="continue-shopping-btn"
            >
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Related Shops */}
      <div className="related-shops">
        <h2>More shops you might like</h2>
        <div className="related-shops-grid">
          {shops
            .filter(s => s.id !== shop.id && s.category === shop.category)
            .slice(0, 3)
            .map(relatedShop => (
              <div 
                key={relatedShop.id} 
                className="related-shop-card"
                onClick={() => navigate(`/shop/${relatedShop.id}`)}
              >
                <img src={relatedShop.image} alt={relatedShop.name} />
                <h4>{relatedShop.name}</h4>
                <p>⭐ {relatedShop.rating} • ⏱️ {relatedShop.deliveryTime}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;