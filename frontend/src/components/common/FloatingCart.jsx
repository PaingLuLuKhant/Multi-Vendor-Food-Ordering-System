import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './FloatingCart.css';

const FloatingCart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    quantities, 
    cartVisible, 
    setCartVisible, 
    getCartCount, 
    getCartTotal,
    updateQuantity,
    removeFromCart,
    clearCart 
  } = useCart();

  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const subtotal = parseFloat(getCartTotal()) || 0;
  const total = +(subtotal + deliveryFee + serviceFee).toFixed(2);

  if (!cartVisible) return null;

  return (
    <div className="floating-cart-overlay" onClick={() => setCartVisible(false)}>
      <div className="floating-cart" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div className="header-left">
            <h2>Your Cart</h2>
            <span className="cart-items-count">{getCartCount()} items</span>
          </div>
          <div className="header-right">
            <button 
              onClick={() => setCartVisible(false)}
              className="close-cart-btn"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-card">
                <div className="empty-illustration" aria-hidden="true">🛒</div>
                <h3 className="empty-title">Your cart is empty</h3>
                <p className="empty-subtitle">Add items from shops to get started</p>
                <div className="empty-actions">
                  <button 
                    onClick={() => {
                      setCartVisible(false);
                      navigate('/');
                    }}
                    className="browse-shops-btn"
                    type="button"
                  >
                    Browse Shops
                  </button>
                  <button
                    onClick={() => setCartVisible(false)}
                    className="dismiss-btn"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items-scroll">
                {cart.map(item => {
                  const qty = quantities[item.id] || 1;
                  return (
                    <div key={`${item.id}-${item.shopId}`} className="cart-item">
                      <div className="item-image">
                        <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-shop">{item.shopName}</p>
                        <div className="item-category">{item.category}</div>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            className="qty-btn minus"
                          >
                            −
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            className="qty-btn plus"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-price-section">
                          <span className="item-price">${(item.price * qty).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="remove-item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="cart-actions">
                <button 
                  onClick={() => {
                    navigate('/checkout');
                    setCartVisible(false);
                  }}
                  className="checkout-btn"
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </button>
                {cart.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="clear-cart-btn"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;