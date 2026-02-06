import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, quantities, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth(); // Get user and token from auth context

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    paymentMethod: 'cash'
  });

  const [loading, setLoading] = useState(false);

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        // If user has phone/address in their profile, you can add them here too
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const deliveryFee = 2.99;
  const subtotal = parseFloat(getCartTotal());
  const total = subtotal + deliveryFee ;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === 'phone') {
      const formattedPhone = formatMyanmarPhone(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Format Myanmar phone number (09X XXX XXXX)
  const formatMyanmarPhone = (value) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Limit to 11 characters (09XXXXXXXXX)
    const limited = phoneNumber.slice(0, 11);
    
    // Format with spaces: 09X XXX XXXX
    if (limited.length > 3 && limited.length <= 6) {
      return limited.replace(/(\d{3})(\d{0,3})/, '$1 $2');
    } else if (limited.length > 6) {
      return limited.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3');
    }
    
    return limited;
  };

  // Validate Myanmar phone number
  const validateMyanmarPhone = (phone) => {
    // Remove spaces for validation
    const cleanPhone = phone.replace(/\s/g, '');
    // Myanmar phone numbers start with 09 and are 11 digits total
    return /^09\d{9}$/.test(cleanPhone);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    
    if (!validateMyanmarPhone(formData.phone)) {
      alert('Please enter a valid Myanmar phone number (09XXXXXXXXX)');
      return false;
    }
    
    if (!formData.address.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    
    return true;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      alert('Please log in to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: quantities[item.id] || 1,
        price: item.price
      }));

      const data = {
        total_amount: parseFloat(total.toFixed(2)),
        items: orderItems,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone.replace(/\s/g, ''), // Remove spaces for storage
        customer_address: formData.address,
        payment_method: formData.paymentMethod,
        user_id: user.id // Include user ID from auth context
      };

      // Use token from auth context instead of localStorage
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // Use token from context
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order submission failed');
      }

      console.log('Order response:', result);

      // Clear cart
      clearCart();

      // Navigate to confirmation page
      navigate('/order-confirmation', {
        state: { 
          orderDetails: result,
          customerName: formData.name,
          customerPhone: formData.phone
        }
      });

    } catch (error) {
      console.error('Order submission failed:', error.message);
      alert(`Order submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart'); // Go back to cart
  };

  // If user is not logged in, show message
  if (!user) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="login-required">
            <h2>Please Log In</h2>
            <p>You need to be logged in to proceed to checkout.</p>
            <button 
              onClick={() => navigate('/login', { state: { from: '/checkout' } })}
              className="login-btn"
            >
              Go to Login
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="cancel-btn"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        {/* <div className="user-info-banner">
          <span>Logged in as: <strong>{user.name}</strong> ({user.email})</span>
        </div> */}
        <div className="checkout-content">

          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Delivery Information</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
              <small className="field-note">Auto-filled from your account</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+95</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="9XX XXX XXXX"
                  maxLength="13" // 11 digits + 2 spaces
                  pattern="^09\d{9}$"
                  title="Myanmar phone number (09XXXXXXXXX)"
                />
              </div>
              <small className="phone-hint">Format: 09X XXX XXXX (Myanmar)</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
              <small className="field-note">Auto-filled from your account</small>
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder=" House/Street number, Street name, Township, City"
                rows="3"
              />
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
                <span>💵 Cash on Delivery</span>
              </label>
              
              {/* <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="kbz"
                  checked={formData.paymentMethod === 'kbz'}
                  onChange={handleInputChange}
                />
                <span>🏦 KBZ Pay</span>
              </label>
              
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wave"
                  checked={formData.paymentMethod === 'wave'}
                  onChange={handleInputChange}
                />
                <span>🌊 Wave Money</span>
              </label> */}
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - MMK ${total.toFixed(2)}`}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="order-summary-sidebar">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => {
                const qty = quantities[item.id] || 1;
                return (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name} × {qty}</span>
                    <span className="item-price">MMK {(item.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>MMK {subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>MMK {deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="price-row total">
                <span>Total</span>
                <span>MMK {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="customer-info-summary">
              <h3>👤 Customer Information</h3>
              <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
              <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
            </div>

            
            
            <div className="phone-note">
              <p>📞 We'll call you at {formData.phone || 'your number'} for delivery confirmation</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;