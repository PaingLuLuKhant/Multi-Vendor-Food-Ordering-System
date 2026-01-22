// import React from "react";
// import { Link } from "react-router-dom";
// import "./ShopCard.css";

// const ShopCard = ({ shop }) => {
//   return (
//     <div className="shop-card" data-category={shop.category}>
//       <div className="shop-image-container">
//         <img src={shop.image} alt={shop.name} className="shop-image" />
//         <div className="shop-badge">{shop.category}</div>
//       </div>
//       <div className="shop-info">
//         <h3 className="shop-name">{shop.name}</h3>
//         <p className="shop-description">{shop.description}</p>
        
//         <div className="shop-details">
//           <span className="rating">
//             <span className="star">⭐</span> {shop.rating}
//           </span>
//           <span className="delivery-time">
//             <span className="clock">⏱️</span> {shop.deliveryTime}
//           </span>
//         </div>

//         {/* <div className="shop-products">
//           <h4>Popular Items:</h4>
//           <ul>
//             {shop.products.slice(0, 3).map(product => (
//               <li key={product.id}>
//                 <span className="product-name">{product.name}</span>
//                 <span className="product-price">${product.price}</span>
//               </li>
//             ))}
//           </ul>
//         </div> */}

//         <div className="shop-footer">
//           <div className="total-products">
//             {shop.products.length} items available
//           </div>
//           <Link to={`/shop/${shop.id}`} className="view-shop-btn">
//             Visit Shop 
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopCard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ShopCard.css";

const ShopCard = ({ shop }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Professional color palette for categories
  const getColor = (category) => {
    const colors = {
      grocery: "#2E8B57", // Sea Green
      restaurant: "#DC2626", // Professional Red
      electronics: "#2563EB", // Corporate Blue
      pharmacy: "#0891B2", // Medical Cyan
      clothing: "#7C3AED", // Premium Purple
      bakery: "#D97706", // Warm Amber
      cafe: "#059669", // Business Green
      bookstore: "#1E40AF", // Deep Blue
      furniture: "#6D28D9", // Royal Purple
      sports: "#0369A1", // Athletic Blue
      beauty: "#BE185D", // Elegant Pink
      jewelry: "#B45309", // Gold Amber
      default: "#374151" // Professional Gray
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  // Professional icons for each category
  const getIcon = (category) => {
    const icons = {
      grocery: "🛒",
      restaurant: "🍽️",
      electronics: "💻",
      pharmacy: "🏥",
      clothing: "👔",
      bakery: "🥖",
      cafe: "☕",
      bookstore: "📖",
      furniture: "🪑",
      sports: "⚽",
      beauty: "💄",
      jewelry: "💎",
      default: "🏢"
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  // Check opening hours
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setIsOpen(currentHour >= 8 && currentHour < 22);
    };
    
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Format distance if available

  const categoryColor = getColor(shop.category);
  const categoryIcon = getIcon(shop.category);

  return (
    <div 
      className="shop-card" 
      style={{ '--category-color': categoryColor }}
      role="article"
      aria-label={`${shop.name} - ${shop.category}`}
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
          <h3 className="shop-title">{shop.name || "Business Name"}</h3>
          <span className="shop-category-tag">
            {shop.category || "Retail"}
          </span>
        </div>
        
        <div className="shop-rating-display">
          <span className="rating-stars">★★★★★</span>
          <span className="rating-value">
            {shop.rating?.toFixed(1) || "4.5"}
            <span className="rating-count"> ({shop.reviewCount || "50+"})</span>
          </span>
        </div>
      </div>
      
      <div className="shop-content">
        <p className="shop-description">
          {shop.description?.substring(0, 80) || "Professional services and quality products for your needs..."}
        </p>
        
       
        
        {shop.features && shop.features.length > 0 && (
          <div className="features-section">
            <h4 className="features-title">Key Features</h4>
            <div className="features-tags">
              {shop.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="shop-footer">
        <div className="inventory-info">
          <span className="inventory-icon">📦</span>
          <span className="inventory-count">{shop.products?.length || 0} products available</span>
        </div>
        
        <Link 
          to={`/shop/${shop.id}`} 
          className="cta-button"
          aria-label={`Visit ${shop.name} store`}
        >
          <span>View Store</span>
          <svg className="cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;