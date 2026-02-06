import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  const getStorageKey = (baseKey) => (user ? `${baseKey}_${user.id}` : `${baseKey}_guest`);

  const loadCartFromStorage = () => {
    try {
      const cartKey = getStorageKey('pos-cart');
      const quantitiesKey = getStorageKey('pos-cart-quantities');
      
      const savedCart = localStorage.getItem(cartKey);
      const savedQuantities = localStorage.getItem(quantitiesKey);
      
      return {
        cart: savedCart ? JSON.parse(savedCart) : [],
        quantities: savedQuantities ? JSON.parse(savedQuantities) : {}
      };
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return { cart: [], quantities: {} };
    }
  };

  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const { cart: loadedCart, quantities: loadedQuantities } = loadCartFromStorage();
    setCart(loadedCart);
    setQuantities(loadedQuantities);
  }, [user?.id]);

  useEffect(() => {
    const cartKey = getStorageKey('pos-cart');
    const quantitiesKey = getStorageKey('pos-cart-quantities');
    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem(quantitiesKey, JSON.stringify(quantities));
  }, [cart, quantities, user?.id]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id && item.shopId === product.shopId);
    if (existingItem) {
      setQuantities({ ...quantities, [product.id]: (quantities[product.id] || 1) + 1 });
    } else {
      setCart([...cart, { ...product, shopId: product.shopId, shopName: product.shopName || `Shop ${product.shopId}` }]);
      setQuantities({ ...quantities, [product.id]: 1 });
    }
    setCartVisible(true);
  };

  const removeFromCart = (productId, shopId = null) => {
    setCart(cart.filter(item => !(item.id === productId && (!shopId || item.shopId === shopId))));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setQuantities({ ...quantities, [productId]: newQty });
  };

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  // ✅ NEW: Clear all items from a specific shop
  const clearShopCart = (shopId) => {
    setCart(cart.filter(item => item.shopId !== shopId));
    const newQuantities = { ...quantities };
    Object.keys(quantities).forEach(id => {
      const item = cart.find(ci => ci.id.toString() === id.toString());
      if (item && item.shopId === shopId) {
        delete newQuantities[id];
      }
    });
    setQuantities(newQuantities);
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * (quantities[item.id] || 1)), 0).toFixed(2);

  const getCartCount = () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const toggleCart = () => setCartVisible(!cartVisible);

  const getShopCart = (shopId) => cart.filter(item => item.shopId === shopId);

  const getShopCartTotal = (shopId) => cart
    .filter(item => item.shopId === shopId)
    .reduce((total, item) => total + (item.price * (quantities[item.id] || 1)), 0)
    .toFixed(2);

  const getShopCartCount = (shopId) => cart
    .filter(item => item.shopId === shopId)
    .reduce((sum, item) => sum + (quantities[item.id] || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      quantities,
      cartVisible,
      setCartVisible,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearShopCart, // ✅ add this
      getCartTotal,
      getCartCount,
      toggleCart,
      getShopCart,
      getShopCartTotal,
      getShopCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
