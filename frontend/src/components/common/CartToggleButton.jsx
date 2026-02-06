import React from 'react';
import { useCart } from '../../context/CartContext';

const CartToggleButton = () => {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  return (
    <button 
      onClick={toggleCart}
      className="cart-toggle-btn"
      title="View Cart"
    >
      🛒
      {cartCount > 0 && (
        <span className="cart-badge">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </button>
  );
};

export default CartToggleButton;