import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ShopPage.css";
import { getCategoryColors, getCategoryIcon, formatCategoryName } from "/utils/categoryColors";

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [deletingRatingId, setDeletingRatingId] = useState(null);

  const {
    addToCart: globalAddToCart,
    updateQuantity: globalUpdateQuantity,
    removeFromCart: globalRemoveFromCart,
    clearShopCart,
    quantities: globalQuantities,
    getShopCart,
    getShopCartTotal,
    getShopCartCount,
    setCartVisible,
  } = useCart();

  const [activeTab, setActiveTab] = useState("all");

  const getShopCategoryColors = () => {
    if (!shop || !shop.category) {
      return {
        primary: "#667eea",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      };
    }
    return getCategoryColors(shop.category);
  };

  const getShopCategoryIcon = () => {
    if (!shop || !shop.category) return "🏪";
    return getCategoryIcon(shop.category);
  };

  // Format time like 930 -> 09:30
  // Correct formatTime function
  // Robust formatTime function
  const formatTime = (time) => {
    if (!time) return "";
    return time; // API already sends "HH:MM" correctly
  };



  const isOpen = shop?.is_open_now;

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Shop not found");
          throw new Error("Failed to fetch shop");
        }

        const data = await res.json();
        console.log("SHOP DATA:", data.shop);
        setShop(data.shop);
        fetchRatings();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  const fetchRatings = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}/ratings`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRatings(data.ratings || []);
        setAverageRating(data.average_rating || 0);
        setRatingCount(data.total_ratings || 0);
        if (data.user_rating) setUserRating(data.user_rating.rating || 0);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSubmitRating = async () => {
    if (!token) return navigate("/login", { state: { from: window.location.pathname } });
    if (userRating === 0) return alert("Please select a rating");

    setIsSubmittingRating(true);
    try {
      const url = editingRatingId
        ? `http://127.0.0.1:8000/api/shops/${id}/ratings/${editingRatingId}`
        : `http://127.0.0.1:8000/api/shops/${id}/ratings`;
      const method = editingRatingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: userRating, comment: ratingComment }),
      });

      if (res.ok) {
        fetchRatings();
        setShowRatingForm(false);
        setRatingComment("");
        setEditingRatingId(null);
        alert(editingRatingId ? "Rating updated successfully!" : "Thank you for your rating!");
      } else throw new Error("Failed to submit rating");
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating. Please try again.");
    } finally { setIsSubmittingRating(false); }
  };

  const handleEditRating = (rating) => {
    if (!token) return navigate("/login", { state: { from: window.location.pathname } });
    setUserRating(rating.rating);
    setRatingComment(rating.comment || "");
    setEditingRatingId(rating.id);
    setShowRatingForm(true);
  };

  const handleDeleteRating = async (ratingId) => {
    if (!token) return navigate("/login", { state: { from: window.location.pathname } });
    if (!window.confirm("Are you sure you want to delete this rating?")) return;

    setDeletingRatingId(ratingId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}/ratings/${ratingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchRatings();
        alert("Rating deleted successfully!");
        if (ratings.find(r => r.id === ratingId)) setUserRating(0);
      } else throw new Error("Failed to delete rating");
    } catch (error) {
      console.error(error);
      alert("Failed to delete rating. Please try again.");
    } finally { setDeletingRatingId(null); }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => {
          let isFilled = star <= Math.floor(rating);
          let isHalf = star === Math.ceil(rating) && rating % 1 >= 0.5;
          return (
            <span
              key={star}
              className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
              onClick={() => interactive && onRate && onRate(star)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  if (loading) return (
    <div className="loading-shops">
      <div className="spinner"></div>
      <p>Loading shop...</p>
    </div>
  );

  const shopCart = getShopCart(parseInt(id));
  const shopCartCount = getShopCartCount(parseInt(id));
  const shopCartTotal = getShopCartTotal(parseInt(id));
  const subtotal = parseFloat(shopCartTotal || 0);
  const total = subtotal;

  const categoryColors = getShopCategoryColors();
  const categoryIcon = getShopCategoryIcon();
  const formattedCategory = shop ? formatCategoryName(shop.category) : "Shop";

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
    if (!token) navigate("/login", { state: { from: { pathname: "/checkout" } } });
    else navigate("/checkout");
  };

  const handleBackToShops = () => navigate("/");

  const filteredProducts = activeTab === "all"
    ? shop.products
    : shop.products.filter(p => p.category === activeTab);

  return (
    <div className="shop-page">
      {/* ===== BACK BUTTON ===== */}
      <div className="shop-page-top-bar">
        <button className="back-to-shops-top" onClick={handleBackToShops}>
          ← Back to All Shops
        </button>
      </div>

      {/* ===== SHOP HEADER ===== */}
      <div className="shop-header" style={{
        background: categoryColors.gradient,
        '--category-color': categoryColors.primary,
        '--category-gradient': categoryColors.gradient
      }}>
        <div className="shop-header-content">
          <div className="shop-header-image">
            {shop.image ? <img src={shop.image} alt={shop.name} /> :
              <div className="shop-initials-logo" style={{ background: categoryColors.gradient }}>
                <span>{categoryIcon}</span>
              </div>}
          </div>

          <div className="shop-header-info">
            <h1>{shop.name}</h1>
            <p className="shop-description">{shop.description}</p>

            {/* Rating */}
            <div className="shop-rating-display-header">
              <div className="rating-display">
                <div className="rating-stars-display">{renderStars(averageRating)}</div>
                <div className="rating-score-display">
                  <span className="rating-number">{averageRating.toFixed(1)}</span>
                  <span className="rating-count">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
              <button className="rate-shop-btn" onClick={() => { setEditingRatingId(null); setRatingComment(""); setUserRating(0); setShowRatingForm(!showRatingForm); }}>
                {userRating > 0 ? 'Update Rating' : 'Rate this Shop'}
              </button>
            </div>

            {/* Shop Hours */}
            <div className="meta-item">
              <span className="meta-icon">⏰</span>
              <span>
  {shop.open_time && shop.close_time
    ? `${formatTime(shop.open_time)} - ${formatTime(shop.close_time)}`
    : "Hours not set"}
  {shop.is_closed_today ? " (Closed today)" : ""}
</span>


            </div>

            {/* Open/Closed */}
            <div className="meta-item">
              <span className="meta-icon">{isOpen ? "🟢" : "🔴"}</span>
              <span style={{ fontWeight: "bold", color: isOpen ? "#16a34a" : "#dc2626" }}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="shop-main-content">
        <div className="shop-content-container">

          {/* ===== PRODUCTS SECTION ===== */}
          <div className="products-section">
            <div className="products-header">
              <h2>Menu Items</h2>
              <div className="category-tabs">
                <button className={`category-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All Items</button>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => {
                const quantityInCart = globalQuantities[product.id] || 0;
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <div className="product-price-row">
                        <div className="product-price">MMK {product.price.toFixed(2)}</div>
                        {quantityInCart > 0 && <div className="in-cart-badge">In Cart: {quantityInCart}</div>}
                      </div>
                    </div>

                    <div className="product-actions">
                      {quantityInCart > 0 ? (
                        <div className="quantity-controls">
                          <button onClick={() => handleUpdateQuantity(product.id, quantityInCart - 1)} className="quantity-btn minus">-</button>
                          <span className="quantity-display">{quantityInCart}</span>
                          <button onClick={() => handleUpdateQuantity(product.id, quantityInCart + 1)} className="quantity-btn plus">+</button>
                        </div>
                      ) : (
                        <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="header-left">
                  <h2>Your Order from {shop.name}</h2>
                  <div className="items-count">{shopCartCount} items</div>
                </div>
                {shopCartCount > 0 && <button className="clear-all-btn" onClick={() => clearShopCart(shop.id)}>Clear All</button>}
              </div>

              {shopCartCount > 0 ? (
                <>
                  <div className="order-items-list">
                    {shopCart.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-main">
                          <span className="item-name">{item.name}</span>
                          <div className="item-category">{item.category}</div>
                        </div>
                        <div className="item-controls">
                          <div className="quantity-selector">
                            <button onClick={() => handleUpdateQuantity(item.id, (globalQuantities[item.id] || 0) - 1)} className="qty-btn">-</button>
                            <span className="qty-display">{globalQuantities[item.id] || 0}</span>
                            <button onClick={() => handleUpdateQuantity(item.id, (globalQuantities[item.id] || 0) + 1)} className="qty-btn">+</button>
                          </div>
                          <div className="item-price-section">
                            <span className="item-price">MMK {((item.price || 0) * (globalQuantities[item.id] || 0)).toFixed(2)}</span>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remove</button>
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
                    <div className="price-row total">
                      <span>Total</span>
                      <span>MMK {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                </>
              ) : (
                <div className="empty-order">
                  <div className="empty-icon">🛒</div>
                  <p>Your cart is empty</p>
                  <small>Add items from the menu to get started!</small>
                </div>
              )}

              {shopCartCount > 0 && (
                <div className="shop-actions">
                  <button className="continue-shopping-btn" onClick={() => navigate("/")}>Continue Shopping</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== REVIEWS SECTION ===== */}
        <div className="shop-reviews-section">
          <h2 className="reviews-title">Customer Reviews ({ratingCount})</h2>

          {ratings.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this shop!</p>
          ) : (
            <div className="reviews-list">
              {ratings.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-user-info">
                      <strong className="review-user">{review.user?.name || "Anonymous"}</strong>
                      {review.is_own && <span className="own-review-badge">Your Review</span>}
                    </div>

                    <div className="review-rating-actions">
                      {renderStars(review.rating)}
                      {review.is_own && (
                        <div className="review-actions">
                          <button className="edit-review-btn" onClick={() => handleEditRating(review)} disabled={deletingRatingId === review.id}>Edit</button>
                          <button className="delete-review-btn" onClick={() => handleDeleteRating(review.id)} disabled={deletingRatingId === review.id}>
                            {deletingRatingId === review.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {review.comment && <p className="review-comment">"{review.comment}"</p>}
                  <small className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                    {review.updated_at !== review.created_at &&
                      ` (Updated: ${new Date(review.updated_at).toLocaleDateString()})`}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== RATING MODAL ===== */}
      {showRatingForm && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <div className="rating-modal-header">
              <h3>{editingRatingId ? 'Edit Your Rating' : 'Rate this Shop'}</h3>
              <button className="close-modal-btn" onClick={() => setShowRatingForm(false)}>×</button>
            </div>

            <div className="rating-modal-body">
              <label>Select Rating:</label>
              {renderStars(userRating, true, setUserRating)}

              <label>Comment (optional):</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Write your comment..."
              />

              <button className="submit-rating-btn" onClick={handleSubmitRating} disabled={isSubmittingRating}>
                {isSubmittingRating ? "Submitting..." : editingRatingId ? "Update Rating" : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
