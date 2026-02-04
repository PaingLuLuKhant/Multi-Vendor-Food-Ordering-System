// // 


// import React from "react";
// import { Link } from "react-router-dom";
// import "./ShopCard.css";

// const ShopCard = ({ shop }) => {
//   const getColor = (category) => {
//     const colors = {
//       grocery: "#2E8B57",
//       restaurant: "#DC2626",
//       electronics: "#2563EB",
//       pharmacy: "#0891B2",
//       clothing: "#7C3AED",
//       bakery: "#D97706",
//       cafe: "#059669",
//       bookstore: "#1E40AF",
//       furniture: "#6D28D9",
//       sports: "#0369A1",
//       beauty: "#BE185D",
//       jewelry: "#B45309",
//       default: "#374151",
//     };
//     return colors[category?.toLowerCase()] || colors.default;
//   };

//   const getIcon = (category) => {
//     const icons = {
//       grocery: "🛒",
//       restaurant: "🍽️",
//       electronics: "💻",
//       pharmacy: "🏥",
//       clothing: "👔",
//       bakery: "🥖",
//       cafe: "☕",
//       bookstore: "📖",
//       furniture: "🪑",
//       sports: "⚽",
//       beauty: "💄",
//       jewelry: "💎",
//       default: "🏢",
//     };
//     return icons[category?.toLowerCase()] || icons.default;
//   };

//   const categoryColor = getColor(shop.category);
//   const categoryIcon = getIcon(shop.category);

//   return (
//     <div
//       className="shop-card"
//       style={{ "--category-color": categoryColor }}
//       role="article"
//       aria-label={`${shop.name} - ${shop.category}`}
//     >
//       <div className="shop-header">
//         <div className="shop-badge">
//           <div className="shop-icon">{categoryIcon}</div>
//         </div>

//         <div className="shop-title-section">
//           <h3 className="shop-title">{shop.name}</h3>
//           <span className="shop-category-tag">{shop.category}</span>
//         </div>

//         {/* ⭐ Display average rating */}
//         <div className="shop-rating-display">
//           <span className="rating-stars">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span key={star}>
//                 {star <= Math.round(shop.average_rating || 0) ? "★" : "☆"}
//               </span>
//             ))}
//           </span>
//           <span className="rating-value">
//             {(shop.average_rating || 0).toFixed(1)} ({shop.review_count || 0})
//           </span>
//         </div>
//       </div>

//       <div className="shop-content">
//         <p className="shop-description">
//           {shop.description?.substring(0, 80) ||
//             "Professional services and quality products for your needs..."}
//         </p>
//       </div>

//       <div className="shop-footer">
//         <div className="inventory-info">
//           <span className="inventory-icon">📦</span>
//           <span className="inventory-count">{shop.products?.length || 0} products available</span>
//         </div>

//         <Link to={`/shop/${shop.id}`} className="cta-button">
//           <span>View Store</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ShopCard;



import React from "react";
import { Link } from "react-router-dom";
import "./ShopCard.css";

const ShopCard = ({ shop }) => {
  const getColor = (category) => {
    const colors = {
      grocery: "#2E8B57",
      restaurant: "#DC2626",
      electronics: "#2563EB",
      pharmacy: "#0891B2",
      clothing: "#7C3AED",
      bakery: "#D97706",
      cafe: "#059669",
      bookstore: "#1E40AF",
      furniture: "#6D28D9",
      sports: "#0369A1",
      beauty: "#BE185D",
      jewelry: "#B45309",
      default: "#374151",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

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
      default: "🏢",
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  const categoryColor = getColor(shop.category);
  const categoryIcon = getIcon(shop.category);

  return (
    <div
      className="shop-card"
      style={{ "--category-color": categoryColor }}
      role="article"
      aria-label={`${shop.name} - ${shop.category}`}
    >
      <div className="shop-header">
        <div className="shop-badge">
          <div className="shop-icon">{categoryIcon}</div>
        </div>

        <div className="shop-title-section">
          <h3 className="shop-title">{shop.name}</h3>
          <span className="shop-category-tag">{shop.category}</span>
        </div>

        {/* ⭐ Display average rating */}
        <div className="shop-rating-display">
          <span className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= Math.round(shop.average_rating || 0) ? "★" : "☆"}
              </span>
            ))}
          </span>
          <span className="rating-value">
            {(shop.average_rating || 0).toFixed(1)} ({shop.review_count || 0})
          </span>
        </div>
      </div>

      <div className="shop-content">
        <p className="shop-description">
          {shop.description?.substring(0, 80) ||
            "Professional services and quality products for your needs..."}
        </p>
      </div>

      <div className="shop-footer">
        <div className="inventory-info">
          <span className="inventory-icon">📦</span>
          <span className="inventory-count">{shop.products?.length || 0} products available</span>
        </div>

        <Link to={`/shop/${shop.id}`} className="cta-button">
          <span>View Store</span>
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;

