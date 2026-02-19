import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Generate storage key per user or guest
  const getStorageKey = (baseKey) => {
    return user ? `${baseKey}_${user.id}` : `${baseKey}_guest`;
  };

  // Load cart and quantities from localStorage
  const loadCartFromStorage = () => {
    try {
      const cartKey = getStorageKey('pos-cart');
      const quantitiesKey = getStorageKey('pos-cart-quantities');

      console.log('Loading cart from:', cartKey); // Debug log

      const savedCart = localStorage.getItem(cartKey);
      const savedQuantities = localStorage.getItem(quantitiesKey);

      console.log('Found cart:', savedCart); // Debug log

      return {
        cart: savedCart ? JSON.parse(savedCart) : [],
        quantities: savedQuantities ? JSON.parse(savedQuantities) : {},
      };
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return { cart: [], quantities: {} };
    }
  };

  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartVisible, setCartVisible] = useState(false);

  // Migrate guest cart to user cart on login
  useEffect(() => {
    if (!user) return;

    console.log('User logged in, checking for guest cart...'); // Debug log

    const guestCart = localStorage.getItem('pos-cart_guest');
    const guestQuantities = localStorage.getItem('pos-cart-quantities_guest');

    const userCartKey = `pos-cart_${user.id}`;
    const userQtyKey = `pos-cart-quantities_${user.id}`;

    const existingUserCart = localStorage.getItem(userCartKey);
    const existingUserQuantities = localStorage.getItem(userQtyKey);

    // If there's a guest cart with items
    if (guestCart && guestCart !== '[]' && guestCart !== 'null' && guestCart !== 'undefined') {
      console.log('Found guest cart, migrating...'); // Debug log
      
      if (!existingUserCart || existingUserCart === '[]' || existingUserCart === 'null') {
        // No user cart - just migrate guest cart
        console.log('No existing user cart, migrating guest cart');
        localStorage.setItem(userCartKey, guestCart);
        localStorage.setItem(userQtyKey, guestQuantities || '{}');
      } else {
        // Merge guest cart with existing user cart
        console.log('Merging guest cart with existing user cart');
        
        const guestItems = JSON.parse(guestCart);
        const guestQtys = JSON.parse(guestQuantities || '{}');
        const userItems = JSON.parse(existingUserCart);
        const userQtys = JSON.parse(existingUserQuantities || '{}');

        // Start with user items
        const mergedItems = [...userItems];
        const mergedQtys = { ...userQtys };

        // Add guest items if they don't exist in user cart
        guestItems.forEach(guestItem => {
          const exists = userItems.some(item => 
            item.id === guestItem.id && item.shopId === guestItem.shopId
          );
          
          if (!exists) {
            mergedItems.push(guestItem);
            mergedQtys[guestItem.id] = guestQtys[guestItem.id] || 1;
          } else {
            // If item exists, maybe keep the higher quantity? Or sum them?
            // Option: Keep the higher quantity
            const existingQty = userQtys[guestItem.id] || 1;
            const guestQty = guestQtys[guestItem.id] || 1;
            mergedQtys[guestItem.id] = Math.max(existingQty, guestQty);
          }
        });

        localStorage.setItem(userCartKey, JSON.stringify(mergedItems));
        localStorage.setItem(userQtyKey, JSON.stringify(mergedQtys));
      }

      // Clear guest cart after migration/merge
      localStorage.removeItem('pos-cart_guest');
      localStorage.removeItem('pos-cart-quantities_guest');
    }

    // Load the cart for this user
    const { cart: loadedCart, quantities: loadedQuantities } = loadCartFromStorage();
    setCart(loadedCart);
    setQuantities(loadedQuantities);
    
    console.log('Cart loaded:', loadedCart); // Debug log
  }, [user?.id]);

  // Persist cart to localStorage whenever cart or quantities change
  useEffect(() => {
    const cartKey = getStorageKey('pos-cart');
    const quantitiesKey = getStorageKey('pos-cart-quantities');

    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem(quantitiesKey, JSON.stringify(quantities));
  }, [cart, quantities, user?.id]);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id && item.shopId === product.shopId);

    if (existingItem) {
      setQuantities({
        ...quantities,
        [product.id]: (quantities[product.id] || 1) + 1,
      });
    } else {
      setCart([...cart, { 
        ...product, 
        shopId: product.shopId, 
        shopName: product.shopName || `Shop ${product.shopId}` 
      }]);
      setQuantities({ ...quantities, [product.id]: 1 });
    }

    setCartVisible(true);
  };

  // Remove product from cart
  const removeFromCart = (productId, shopId = null) => {
    setCart(cart.filter(item => !(item.id === productId && (!shopId || item.shopId === shopId))));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  // Update quantity of a product
  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setQuantities({ ...quantities, [productId]: newQty });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  // Clear all items from a specific shop
  const clearShopCart = (shopId) => {
    setCart(cart.filter(item => item.shopId !== shopId));
    const newQuantities = { ...quantities };
    Object.keys(quantities).forEach(id => {
      const item = cart.find(ci => ci.id.toString() === id.toString());
      if (item && item.shopId === shopId) delete newQuantities[id];
    });
    setQuantities(newQuantities);
  };

  // Cart totals
  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * (quantities[item.id] || 1)), 0).toFixed(2);
  const getCartCount = () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Shop-specific cart helpers
  const getShopCart = (shopId) => cart.filter(item => item.shopId === shopId);
  const getShopCartTotal = (shopId) => cart
    .filter(item => item.shopId === shopId)
    .reduce((total, item) => total + (item.price * (quantities[item.id] || 1)), 0)
    .toFixed(2);
  const getShopCartCount = (shopId) => cart
    .filter(item => item.shopId === shopId)
    .reduce((sum, item) => sum + (quantities[item.id] || 1), 0);

  // Toggle cart visibility
  const toggleCart = () => setCartVisible(!cartVisible);

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
      clearShopCart,
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