import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Add this import
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Add this line
  const {
    cart,
    quantities,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  } = useCart();

  const deliveryFee = 2.99;
  const subtotal = parseFloat(getCartTotal());
  const total = subtotal + deliveryFee;
  
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add items from shops to get started</p>
          <button onClick={() => navigate('/')} className="browse-shops-btn">
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear All
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => {
              const qty = quantities[item.id] || 1;
              return (
                <div key={`${item.id}-${item.shopId}`} className="cart-item">
                  <div className="item-image">
                    <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-shop">{item.shopName}</p>
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
                    <div className="item-price">
                      MMK {(item.price * qty).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>MMK {subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>MMK {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>MMK {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!token) {
                  navigate('/login', { state: { from: { pathname: '/checkout' } } });
                } else {
                  navigate('/checkout');
                }
              }}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;