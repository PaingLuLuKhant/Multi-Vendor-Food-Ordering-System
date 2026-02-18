import React from "react";
import { Link } from "react-router-dom";
import { getCategoryColors, getCategoryIcon, formatCategoryName } from "/utils/categoryColors";
import "./ShopCard.css";

const ShopCard = ({ shop, isFavorite, onToggleFavorite, showFavoriteButton = true }) => {
  const isOpen = !!shop.is_open_now;
  
  // Get consistent colors and icon based on category
  const categoryColors = getCategoryColors(shop.category);
  const categoryIcon = getCategoryIcon(shop.category);
  const formattedCategory = formatCategoryName(shop.category);

  // Get description with fallback - ENSURE IT'S NEVER EMPTY
  const getDescription = () => {
    // First check if shop has description
    if (shop.description && shop.description.trim() !== "") {
      return shop.description.length > 80 
        ? `${shop.description.substring(0, 80)}...` 
        : shop.description;
    }
    
    // If no description, use category-based fallbacks
    const category = shop.category?.toLowerCase() || "";
    const fallbackDescriptions = {
      "myanmar": "Authentic Burmese cuisine with traditional flavors and spices. Experience the taste of Myanmar.",
      "chinese": "Classic Chinese dishes made with fresh ingredients and authentic cooking techniques.",
      "thai": "Traditional Thai food with perfect balance of sweet, sour, salty, and spicy flavors.",
      "fast food": "Quick, delicious meals made fresh to order with quality ingredients and fast service.",
      "italian": "Classic Italian dishes made from authentic recipes using traditional methods.",
      "seafood": "Fresh seafood dishes prepared daily with expert techniques and premium ingredients."
    };
    
    // Find matching fallback
    for (const [key, desc] of Object.entries(fallbackDescriptions)) {
      if (category.includes(key)) {
        return desc;
      }
    }
    
    // Default fallback
    return "Delicious food and quality service for your dining pleasure. Experience great taste and excellent service!";
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  // Function to render stars with proper half-star handling
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <span className="rating-stars">
        {"★".repeat(fullStars)}
        {hasHalfStar && <span className="half-star">★</span>}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div 
      className="shop-card" 
      style={{ 
        '--category-color': categoryColors.primary,
        '--category-gradient': categoryColors.gradient,
        '--category-light': categoryColors.light,
        '--category-text': categoryColors.text
      }}
      role="article"
      aria-label={`${shop.name} - ${formattedCategory}`}
    >
      <div className="shop-header">
        <div className="shop-badge">
          <div className="shop-icon">
            {categoryIcon}
          </div>
          <div className={`status-indicator ${isOpen ? 'open' : 'closed'}`}>
            <span className="indicator-dot"></span>
            {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>
        
        <div className="shop-title-section">
          <h3 className="shop-title">{shop.name || "Restaurant Name"}</h3>
          <span className="shop-category-tag">
            {formattedCategory}
          </span>
        </div>
        
        {/* FIXED RATING DISPLAY */}
        <div className="shop-rating-display">
          <div className="rating-container">
            {renderStars(shop.average_rating || 0)}
            <span className="rating-value">
              {shop.average_rating !== null && shop.average_rating !== undefined
                ? shop.average_rating.toFixed(1)
                : "0.0"}
            </span>
          </div>
          <span className="rating-count">
            ({shop.review_count || 0})
          </span>
        </div>
      </div>
      
      <div className="shop-content">
        {/* DESCRIPTION - FIXED VISIBILITY */}
        <div className="description-container" style={{ marginBottom: '20px' }}>
          <p className="shop-description" style={{ 
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {getDescription()}
          </p>
        </div>
        
        {/* Favorite indicator badge */}
        {isFavorite && showFavoriteButton && (
          <div className="favorite-badge">
            <span className="favorite-star">★</span>
            <span>Favorited</span>
          </div>
        )}
      </div>
      
      <div className="shop-footer">
        <div className="inventory-info">
          <span className="inventory-icon">🍽️</span>
          <span className="inventory-count">{shop.products?.length || 0} menu items</span>
        </div>
        
        <div className="footer-actions">
          {/* Favorite Button in Footer */}
          {showFavoriteButton && (
            <button
              className={`favorite-heart-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? `Remove ${shop.name} from favorites` : `Add ${shop.name} to favorites`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2"
                className="heart-icon"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          )}
          
          <Link 
            to={`/shop/${shop.id}`} 
            className="cta-button"
            aria-label={`Visit ${shop.name} restaurant`}
          >
            <span>View Menu</span>
            <svg className="cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;