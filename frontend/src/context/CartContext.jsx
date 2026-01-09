import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('pos-cart');
      const savedQuantities = localStorage.getItem('pos-cart-quantities');
      return {
        cart: savedCart ? JSON.parse(savedCart) : [],
        quantities: savedQuantities ? JSON.parse(savedQuantities) : {}
      };
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return { cart: [], quantities: {} };
    }
  };

  const [cart, setCart] = useState(loadCartFromStorage().cart);
  const [quantities, setQuantities] = useState(loadCartFromStorage().quantities);
  const [cartVisible, setCartVisible] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pos-cart', JSON.stringify(cart));
    localStorage.setItem('pos-cart-quantities', JSON.stringify(quantities));
  }, [cart, quantities]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.shopId === product.shopId
    );
    
    if (existingItem) {
      setQuantities({
        ...quantities,
        [product.id]: (quantities[product.id] || 1) + 1
      });
    } else {
      setCart([...cart, { 
        ...product, 
        shopId: product.shopId,
        shopName: product.shopName || `Shop ${product.shopId}`
      }]);
      setQuantities({
        ...quantities,
        [product.id]: 1
      });
    }
    
    // Show cart when item is added
    setCartVisible(true);
  };

  const removeFromCart = (productId, shopId = null) => {
    setCart(cart.filter(item => 
      !(item.id === productId && (!shopId || item.shopId === shopId))
    ));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setQuantities({
      ...quantities,
      [productId]: newQty
    });
  };

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 1));
    }, 0).toFixed(2);
  };

  const getCartCount = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const getShopCart = (shopId) => {
    return cart.filter(item => item.shopId === shopId);
  };

  const getShopCartTotal = (shopId) => {
    return cart
      .filter(item => item.shopId === shopId)
      .reduce((total, item) => {
        return total + (item.price * (quantities[item.id] || 1));
      }, 0)
      .toFixed(2);
  };

  const getShopCartCount = (shopId) => {
    return cart
      .filter(item => item.shopId === shopId)
      .reduce((sum, item) => sum + (quantities[item.id] || 1), 0);
  };

  const value = {
    cart,
    quantities,
    cartVisible,
    setCartVisible,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart,
    getShopCart,
    getShopCartTotal,
    getShopCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};