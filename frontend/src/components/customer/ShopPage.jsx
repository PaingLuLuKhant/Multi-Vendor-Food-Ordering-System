// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import "./ShopPage.css";

// const ShopPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [shop, setShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const { 
//     addToCart: globalAddToCart,
//     updateQuantity: globalUpdateQuantity,
//     removeFromCart: globalRemoveFromCart,
//     quantities: globalQuantities,
//     getShopCart,
//     getShopCartTotal,
//     getShopCartCount,
//     setCartVisible 
//   } = useCart();

//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}`, {
//           headers: {
//             Accept: "application/json",
//             Authorization: token ? `Bearer ${token}` : undefined,
//           },
//         });

//         if (!res.ok) {
//           if (res.status === 404) throw new Error("Shop not found");
//           throw new Error("Failed to fetch shop");
//         }

//         const data = await res.json();
//         setShop(data.shop);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShop();
//   }, [id]);

//   if (loading) return (
//             <div className="loading-shops">
//                 <div className="spinner"></div>
//                 <p>Loading shop details...</p>
//             </div>
//         );

//   if (error) return (
//     <div className="shop-not-found">
//       <div className="not-found-content">
//         <h2>😢 {error}</h2>
//         <p>Sorry, we couldn’t find this shop.</p>
//         <button className="back-home-btn" onClick={() => navigate("/")}>Back to Shops</button>
//       </div>
//     </div>
//   );

//   const shopCart = getShopCart(parseInt(id));
//   const shopCartCount = getShopCartCount(parseInt(id));
//   const shopCartTotal = getShopCartTotal(parseInt(id));

//   const handleAddToCart = (product) => {
//     globalAddToCart({
//       ...product,
//       shopId: shop.id,
//       shopName: shop.name,
//       image: product.image || shop.image
//     });
//     setCartVisible(true);
//   };

//   const handleUpdateQuantity = (productId, newQty) => globalUpdateQuantity(productId, newQty);
//   const handleRemoveFromCart = (productId) => globalRemoveFromCart(productId, shop.id);
//   const clearShopCart = () => shopCart.forEach(item => globalRemoveFromCart(item.id, shop.id));

//   const productCategories = [...new Set(shop.products.map(p => p.category))];
//   const filteredProducts = activeTab === "all" ? shop.products : shop.products.filter(p => p.category === activeTab);

//   const subtotal = parseFloat(shopCartTotal || 0);
//   const deliveryFee = 2.99;
//   const serviceFee = 1.49;
//   const total = subtotal + deliveryFee + serviceFee;

//   return (
//     <div className="shop-page">
//       {/* ===== SHOP HEADER ===== */}

//       {loading ? (
//             <div className="loading-shops">
//                         <div className="spinner"></div>
//                         <p>Finding shops...</p>
//             </div>
//         ):(<div className="shop-header">
//         <div className="shop-header-top">
//           <button className="back-to-dashboard" onClick={() => navigate("/")}>← Back to Shops</button>
//         </div>
//         <div className="shop-header-content">
//           <div className="shop-header-image">
//             <img src={shop.image} alt={shop.name} />
//           </div>
//           <div className="shop-header-info">
//             <h1>{shop.name}</h1>
//             <p className="shop-description">{shop.description}</p>
//             <div className="shop-meta">
//               <div className="meta-item">Rating: {shop.rating || "N/A"}</div>
//               <div className="meta-item">Category: {shop.category || "General"}</div>
//             </div>
//           </div>
//         </div>
//       </div>)
//       }
      

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="shop-main-content">
//         {/* ===== PRODUCTS SECTION ===== */}
//         <div className="products-section">
//           <div className="products-header">
//             <h2>Products</h2>
//           </div>
//           <div className="category-tabs">
//             <button className={`category-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
//             {productCategories.map(c => (
//               <button key={c} className={`category-tab ${activeTab === c ? "active" : ""}`} onClick={() => setActiveTab(c)}>{c}</button>
//             ))}
//           </div>

//           <div className="products-grid">
//             {filteredProducts.map(product => {
//               const quantityInCart = globalQuantities[product.id] || 0;
//               return (
//                 <div key={product.id} className="product-card">
//                   <div className="product-info">
//                     <h3>{product.name}</h3>
//                     <p className="product-category">{product.category}</p>
//                     <div className="product-price-row">
//                       <span className="product-price">{product.price.toFixed(2)}</span>
//                     </div>
//                   </div>
//                   <div className="product-actions">
//                     <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
//                     {quantityInCart > 0 && (
//                       <div className="quantity-controls">
//                         <button className="quantity-btn minus" onClick={() => handleUpdateQuantity(product.id, quantityInCart - 1)}>-</button>
//                         <span className="quantity-display">{quantityInCart}</span>
//                         <button className="quantity-btn plus" onClick={() => handleUpdateQuantity(product.id, quantityInCart + 1)}>+</button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ===== ORDER SUMMARY SECTION ===== */}
//         <div className="order-summary-section">
//           <div className="order-summary-card">
//             <div className="order-summary-header">
//               <div className="header-left">
//                 <h2>Order Summary</h2>
//                 <span className="items-count">{shopCartCount} items</span>
//               </div>
//               {shopCartCount > 0 && <button className="clear-all-btn" onClick={clearShopCart}>Clear All</button>}
//             </div>

//             {shopCartCount === 0 ? (
//               <div className="empty-order">
//                 <div className="empty-icon">🛒</div>
//                 <p>Your cart is empty</p>
//                 <small>Add products to get started</small>
//               </div>
//             ) : (
//               <>
//                 <div className="order-items-list">
//                   {shopCart.map(item => (
//                     <div key={item.id} className="order-item">
//                       <div className="item-main">
//                         <span className="item-name">{item.name}</span>
//                         <span className="item-category">{item.category}</span>
//                       </div>
//                       <div className="item-controls">
//                         <div className="quantity-selector">
//                           <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
//                           <span className="qty-display">{item.quantity}</span>
//                           <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
//                         </div>
//                         <span className="item-price">${item.price.toFixed(2)}</span>
//                         <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="price-breakdown">
//                   <div className="price-row">
//                     <span>Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="price-row">
//                     <span>Delivery</span>
//                     <span>${deliveryFee.toFixed(2)}</span>
//                   </div>
//                   <div className="price-row">
//                     <span>Service</span>
//                     <span>${serviceFee.toFixed(2)}</span>
//                   </div>
//                   <div className="price-row total">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <button className="checkout-btn" onClick={() => navigate("/checkout")}>Checkout</button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopPage;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ShopPage.css";

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const { 
    addToCart: globalAddToCart,
    updateQuantity: globalUpdateQuantity,
    removeFromCart: globalRemoveFromCart,
    quantities: globalQuantities,
    getShopCart,
    getShopCartTotal,
    getShopCartCount,
    setCartVisible,
    clearCart
  } = useCart();

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/shops/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Shop not found");
          throw new Error("Failed to fetch shop");
        }

        const data = await res.json();
        setShop(data.shop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  // Handle back button click
  const handleBackClick = () => {
    const shopCart = getShopCart(parseInt(id));
    if (shopCart.length > 0) {
      setShowExitConfirm(true);
    } else {
      navigate("/");
    }
  };

  const confirmExit = () => {
    // Clear the cart first
    clearCart();
    // Then navigate
    navigate("/");
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  if (loading) return (
            <div className="loading-shops">
                <div className="spinner"></div>
                <p>Loading shop details...</p>
            </div>
        );
  if (error) return (
    <div className="shop-not-found">
      <div className="not-found-content">
        <h2>😢 {error}</h2>
        <p>Sorry, we couldn't find this shop.</p>
        <button className="back-home-btn" onClick={() => navigate("/")}>Back to Shops</button>
      </div>
    </div>
  );

  const shopCart = getShopCart(parseInt(id));
  const shopCartCount = getShopCartCount(parseInt(id));
  const shopCartTotal = getShopCartTotal(parseInt(id));

  const handleAddToCart = (product) => {
    globalAddToCart({
      ...product,
      shopId: shop.id,
      shopName: shop.name,
      image: product.image || shop.image
    });
    setCartVisible(true);
  };

  const handleUpdateQuantity = (productId, newQty) => globalUpdateQuantity(productId, newQty);
  const handleRemoveFromCart = (productId) => globalRemoveFromCart(productId, shop.id);
  const clearShopCart = () => shopCart.forEach(item => globalRemoveFromCart(item.id, shop.id));

  const productCategories = [...new Set(shop.products.map(p => p.category))];
  const filteredProducts = activeTab === "all" ? shop.products : shop.products.filter(p => p.category === activeTab);

  const subtotal = parseFloat(shopCartTotal || 0);
  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="shop-page">
      {/* ===== EXIT CONFIRMATION MODAL ===== */}
      {showExitConfirm && (
        <div className="exit-confirm-modal">
          <div className="exit-confirm-content">
            <div className="exit-confirm-icon">⚠️</div>
            <h3>Do you want to stop shopping from {shop.name}?</h3>
            <p>Your cart will be cleared when you leave this shop.</p>
            <div className="exit-confirm-buttons">
              <button className="exit-confirm-cancel" onClick={cancelExit}>
                Continue Shopping
              </button>
              <button className="exit-confirm-leave" onClick={confirmExit}>
                Yes, Leave Shop
              </button>
            </div>
          </div>
          <div className="exit-confirm-overlay" onClick={cancelExit}></div>
        </div>
      )}

      {/* ===== SHOP HEADER ===== */}
      <div className="shop-header">
        <div className="shop-header-top">
          <button className="back-to-dashboard" onClick={handleBackClick}>← Back to Shops</button>
        </div>
        <div className="shop-header-content">
          <div className="shop-header-image">
            <img src={shop.image} alt={shop.name} />
          </div>
          <div className="shop-header-info">
            <h1>{shop.name}</h1>
            <p className="shop-description">{shop.description}</p>
            <div className="shop-meta">
              <div className="meta-item">Rating: {shop.rating || "N/A"}</div>
              <div className="meta-item">Category: {shop.category || "General"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="shop-main-content">
        {/* ===== PRODUCTS SECTION ===== */}
        <div className="products-section">
          <div className="products-header">
            <h2>Products</h2>
          </div>
          <div className="category-tabs">
            <button className={`category-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
            {productCategories.map(c => (
              <button key={c} className={`category-tab ${activeTab === c ? "active" : ""}`} onClick={() => setActiveTab(c)}>{c}</button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => {
              const quantityInCart = globalQuantities[product.id] || 0;
              return (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price-row">
                      <span className="product-price">{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    {quantityInCart > 0 && (
                      <div className="quantity-controls">
                        <button className="quantity-btn minus" onClick={() => handleUpdateQuantity(product.id, quantityInCart - 1)}>-</button>
                        <span className="quantity-display">{quantityInCart}</span>
                        <button className="quantity-btn plus" onClick={() => handleUpdateQuantity(product.id, quantityInCart + 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== ORDER SUMMARY SECTION ===== */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="order-summary-header">
              <div className="header-left">
                <h2>Order Summary</h2>
                <span className="items-count">{shopCartCount} items</span>
              </div>
              {shopCartCount > 0 && <button className="clear-all-btn" onClick={clearShopCart}>Clear All</button>}
            </div>

            {shopCartCount === 0 ? (
              <div className="empty-order">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <small>Add products to get started</small>
              </div>
            ) : (
              <>
                <div className="order-items-list">
                  {shopCart.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-main">
                        <span className="item-name">{item.name}</span>
                        <span className="item-category">{item.category}</span>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-selector">
                          <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span className="qty-display">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                        <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Service</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="checkout-btn" onClick={() => navigate("/checkout")}>Checkout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;