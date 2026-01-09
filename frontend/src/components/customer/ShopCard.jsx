import React from "react";
import { Link } from "react-router-dom";
import "./ShopCard.css";

const ShopCard = ({ shop }) => {
  return (
    <div className="shop-card" data-category={shop.category}>
      <div className="shop-image-container">
        <img src={shop.image} alt={shop.name} className="shop-image" />
        <div className="shop-badge">{shop.category}</div>
      </div>
      <div className="shop-info">
        <h3 className="shop-name">{shop.name}</h3>
        <p className="shop-description">{shop.description}</p>
        
        <div className="shop-details">
          <span className="rating">
            <span className="star">⭐</span> {shop.rating}
          </span>
          <span className="delivery-time">
            <span className="clock">⏱️</span> {shop.deliveryTime}
          </span>
        </div>

        {/* <div className="shop-products">
          <h4>Popular Items:</h4>
          <ul>
            {shop.products.slice(0, 3).map(product => (
              <li key={product.id}>
                <span className="product-name">{product.name}</span>
                <span className="product-price">${product.price}</span>
              </li>
            ))}
          </ul>
        </div> */}

        <div className="shop-footer">
          <div className="total-products">
            {shop.products.length} items available
          </div>
          <Link to={`/shop/${shop.id}`} className="view-shop-btn">
            Visit Shop 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;